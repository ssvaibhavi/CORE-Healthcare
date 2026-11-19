import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export type AiLanguage = 'en' | 'kn' | 'te';
export type AiComplexity = 'extra_simple' | 'simple' | 'detailed';

export interface AiServiceHttpError {
  status: number;
  code: string;
  message: string;
}

const MODEL_ID = 'gemini-4-hydrogen';
const MAX_INPUT_CHARS = 1200;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 25;

// In-memory sliding-window rate limiter (no conversation content retained)
const ipRequestTimestamps = new Map<string, number[]>();

export function checkRateLimit(clientKey: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const prev = ipRequestTimestamps.get(clientKey) ?? [];
  const recent = prev.filter((ts) => now - ts < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
    ipRequestTimestamps.set(clientKey, recent);
    return { allowed: false, retryAfterSec };
  }

  recent.push(now);
  ipRequestTimestamps.set(clientKey, recent);
  return { allowed: true };
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const err: AiServiceHttpError = {
      status: 503,
      code: 'GEMINI_NOT_CONFIGURED',
      message:
        'Gemini AI service is not configured on the server. Please set GEMINI_API_KEY in Settings > Secrets (or your hosting environment).',
    };
    throw err;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeLanguage(lang: unknown): AiLanguage {
  if (lang === 'kn' || lang === 'te' || lang === 'en') return lang;
  return 'en';
}

function normalizeComplexity(val: unknown): AiComplexity {
  if (val === 'extra_simple' || val === 'simple' || val === 'detailed') return val;
  return 'simple';
}

function languageName(lang: AiLanguage): string {
  if (lang === 'kn') return 'Kannada (ಕನ್ನಡ)';
  if (lang === 'te') return 'Telugu (తెలుగు)';
  return 'English';
}

function sanitizeText(raw: unknown, maxLen = MAX_INPUT_CHARS): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function validateConsent(consentAccepted: unknown): void {
  if (consentAccepted !== true) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'CONSENT_REQUIRED',
      message: 'Explicit user consent is required before sending text to the AI assistant.',
    };
    throw err;
  }
}

function safeJsonParse(raw: string | undefined): Record<string, unknown> {
  const cleaned = (raw ?? '{}')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  if (!cleaned) return {};
  return JSON.parse(cleaned) as Record<string, unknown>;
}

export interface AiAttemptDiagnostic {
  attempt: number;
  model: string;
  durationMs: number;
  outcome: 'ok' | 'error';
  upstreamStatus?: number;
  errorName?: string;
  sanitizedMessage?: string;
}

export interface AiDiagnosticSnapshot {
  timestamp: string;
  operation: string;
  model: string;
  attempts: AiAttemptDiagnostic[];
  mappedStatus?: number;
  mappedCode?: string;
}

let lastAiDiagnostic: AiDiagnosticSnapshot | null = null;

export function getLastAiDiagnostic(): AiDiagnosticSnapshot | null {
  return lastAiDiagnostic;
}

function sanitizeDiagnosticMessage(raw: string): string {
  return raw
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, '[REDACTED_KEY]')
    .replace(/key=[^&\s"']+/gi, 'key=[REDACTED]')
    .slice(0, 300);
}

function extractUpstreamStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  if ('status' in err && typeof (err as { status?: unknown }).status === 'number') {
    return (err as { status: number }).status;
  }
  const msg = err instanceof Error ? err.message : String(err);
  const jsonCodeMatch = msg.match(/"code"\s*:\s*(\d{3})/);
  if (jsonCodeMatch) return Number(jsonCodeMatch[1]);
  const statusMatch = msg.match(/\b(400|401|403|404|408|429|500|502|503|504)\b/);
  if (statusMatch) return Number(statusMatch[1]);
  return undefined;
}

function isRetryableUpstreamError(err: unknown, upstreamStatus?: number): boolean {
  const msg = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase();
  const name = (err instanceof Error ? err.name : '').toLowerCase();

  // Never retry auth, permission, invalid-argument, or missing-model errors
  if (
    upstreamStatus === 400 ||
    upstreamStatus === 401 ||
    upstreamStatus === 403 ||
    upstreamStatus === 404 ||
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('api_key_expired') ||
    msg.includes('permission_denied') ||
    msg.includes('invalid_argument') ||
    msg.includes('not_found')
  ) {
    return false;
  }

  // Retry transient overload, rate limits, server 5xx, network drops, and attempt timeouts
  return (
    upstreamStatus === 429 ||
    upstreamStatus === 408 ||
    upstreamStatus === 500 ||
    upstreamStatus === 502 ||
    upstreamStatus === 503 ||
    upstreamStatus === 504 ||
    name === 'timeouterror' ||
    name === 'aborterror' ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('resource_exhausted') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('aborted') ||
    msg.includes('etimedout') ||
    msg.includes('econnreset') ||
    msg.includes('fetch failed') ||
    msg.includes('network')
  );
}

function extractProviderRetryDelayMs(err: unknown): number | undefined {
  if (typeof err === 'object' && err !== null) {
    // Check response headers if exposed by SDK
    const maybeResp = (err as { response?: { headers?: { get?: (k: string) => string | null; [k: string]: unknown } } }).response;
    const headerVal =
      typeof maybeResp?.headers?.get === 'function'
        ? maybeResp.headers.get('retry-after')
        : typeof maybeResp?.headers?.['retry-after'] === 'string'
        ? maybeResp.headers['retry-after']
        : undefined;
    if (headerVal) {
      const asSeconds = Number(headerVal);
      if (Number.isFinite(asSeconds) && asSeconds > 0) {
        return Math.ceil(asSeconds * 1000);
      }
    }
  }

  const raw = err instanceof Error ? err.message : String(err ?? '');
  const retryDelayMatch = raw.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/i);
  if (retryDelayMatch) {
    return Math.ceil(Number(retryDelayMatch[1]) * 1000);
  }
  const proseRetryMatch = raw.match(/retry in\s+(\d+(?:\.\d+)?)s/i);
  if (proseRetryMatch) {
    return Math.ceil(Number(proseRetryMatch[1]) * 1000);
  }
  return undefined;
}

const MAX_RETRIES = 2;
const ATTEMPT_TIMEOUT_MS = 22_000;
const TOTAL_RETRY_BUDGET_MS = 50_000;

async function callWithExponentialBackoff<T>(
  operation: string,
  fn: (signal: AbortSignal) => Promise<T>
): Promise<T> {
  const startedAt = Date.now();
  const attempts: AiAttemptDiagnostic[] = [];
  let lastError: unknown;

  for (let retryIdx = 0; retryIdx <= MAX_RETRIES; retryIdx++) {
    const attemptStart = Date.now();
    const elapsedTotal = attemptStart - startedAt;
    const remainingBudget = TOTAL_RETRY_BUDGET_MS - elapsedTotal;

    if (retryIdx > 0 && remainingBudget < 5_000) {
      break;
    }

    const attemptTimeout = Math.min(ATTEMPT_TIMEOUT_MS, Math.max(5_000, remainingBudget));

    try {
      const result = await fn(AbortSignal.timeout(attemptTimeout));
      attempts.push({
        attempt: retryIdx + 1,
        model: MODEL_ID,
        durationMs: Date.now() - attemptStart,
        outcome: 'ok',
      });
      lastAiDiagnostic = {
        timestamp: new Date().toISOString(),
        operation,
        model: MODEL_ID,
        attempts,
        mappedStatus: 200,
        mappedCode: 'OK',
      };
      return result;
    } catch (err) {
      lastError = err;
      const upstreamStatus = extractUpstreamStatus(err);
      const rawMsg = err instanceof Error ? err.message : String(err ?? 'Unknown error');
      const errName = err instanceof Error ? err.name : typeof err;

      attempts.push({
        attempt: retryIdx + 1,
        model: MODEL_ID,
        durationMs: Date.now() - attemptStart,
        outcome: 'error',
        upstreamStatus,
        errorName: errName,
        sanitizedMessage: sanitizeDiagnosticMessage(rawMsg),
      });

      const canRetry =
        retryIdx < MAX_RETRIES && isRetryableUpstreamError(err, upstreamStatus);

      if (!canRetry) {
        break;
      }

      const providerDelayMs = extractProviderRetryDelayMs(err);
      const expBackoffMs = 1000 * Math.pow(2, retryIdx);
      const jitterMs = Math.floor(Math.random() * 350);
      const delayMs =
        providerDelayMs !== undefined
          ? Math.max(expBackoffMs, providerDelayMs) + jitterMs
          : expBackoffMs + jitterMs;

      // Respect provider retry guidance: if requested wait exceeds our safe HTTP budget, stop instead of hammering upstream
      if (Date.now() - startedAt + delayMs + 6_000 > TOTAL_RETRY_BUDGET_MS) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const mapped = mapGeminiError(lastError, { log: false });
  lastAiDiagnostic = {
    timestamp: new Date().toISOString(),
    operation,
    model: MODEL_ID,
    attempts,
    mappedStatus: mapped.status,
    mappedCode: mapped.code,
  };
  throw lastError;
}

export function mapGeminiError(
  err: unknown,
  options: { log?: boolean } = { log: true }
): AiServiceHttpError {
  if (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'code' in err &&
    'message' in err
  ) {
    return err as AiServiceHttpError;
  }

  const upstreamStatus = extractUpstreamStatus(err);
  const rawMsg = err instanceof Error ? err.message : String(err ?? 'Unknown AI service error');
  const lower = rawMsg.toLowerCase();
  const providerDelayMs = extractProviderRetryDelayMs(err);
  const retryHintSec = providerDelayMs ? Math.max(1, Math.ceil(providerDelayMs / 1000)) : undefined;
  const retryHintLabel =
    retryHintSec === undefined
      ? undefined
      : retryHintSec >= 3600
      ? `~${Math.round(retryHintSec / 3600)} hour(s)`
      : retryHintSec >= 120
      ? `~${Math.round(retryHintSec / 60)} minute(s)`
      : `~${retryHintSec}s`;

  const shouldLog = options.log !== false;
  if (shouldLog) {
    const isExpectedTransient =
      upstreamStatus === 429 ||
      upstreamStatus === 503 ||
      upstreamStatus === 504 ||
      upstreamStatus === 408 ||
      lower.includes('unavailable') ||
      lower.includes('overloaded') ||
      lower.includes('aborted') ||
      lower.includes('timeout');

    if (isExpectedTransient) {
      console.warn('[CORE AI transient upstream]', upstreamStatus ?? '', sanitizeDiagnosticMessage(rawMsg));
    } else {
      console.error('[CORE AI upstream error]', upstreamStatus ?? '', sanitizeDiagnosticMessage(rawMsg));
    }
  }

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('api_key_expired')) {
    return {
      status: 400,
      code: 'AI_KEY_INVALID',
      message: 'The server Gemini API key was rejected or expired. Please check GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (upstreamStatus === 401 || upstreamStatus === 403 || lower.includes('permission_denied')) {
    return {
      status: 403,
      code: 'AI_PERMISSION_DENIED',
      message: 'Gemini API access was denied. Please check the API key permissions in Settings > Secrets.',
    };
  }
  if (upstreamStatus === 429 || lower.includes('resource_exhausted')) {
    const isQuotaExhausted = lower.includes('quota') || lower.includes('billing');
    const isLongWait = retryHintSec !== undefined && retryHintSec > 300;
    return {
      status: 429,
      code: 'AI_QUOTA_EXCEEDED',
      message: isQuotaExhausted
        ? `Google Gemini API quota for this tier is currently exhausted${retryHintLabel ? ` (retry suggested in ${retryHintLabel})` : ''}. ${
            isLongWait
              ? 'Please try again later or check your Gemini API plan and billing.'
              : 'Please wait briefly and tap Retry.'
          }`
        : `Google Gemini temporary rate limit reached${retryHintLabel ? ` (retry suggested in ${retryHintLabel})` : ''}. Please wait a moment and tap Retry.`,
    };
  }
  if (upstreamStatus === 404 || lower.includes('not_found')) {
    return {
      status: 502,
      code: 'AI_MODEL_UNAVAILABLE',
      message: `The configured Gemini model (${MODEL_ID}) could not be found right now.`,
    };
  }
  if (upstreamStatus === 400 || lower.includes('invalid_argument')) {
    return {
      status: 400,
      code: 'AI_REQUEST_INVALID',
      message: 'The AI service could not process that prompt format. Please try rephrasing.',
    };
  }
  if (upstreamStatus === 503 || lower.includes('unavailable') || lower.includes('overloaded')) {
    return {
      status: 503,
      code: 'AI_SERVICE_BUSY',
      message: `Google Gemini (${MODEL_ID}) is temporarily overloaded due to high demand. Your message was not lost — please wait ${retryHintSec ? `about ${retryHintSec} seconds` : 'a few seconds'} and tap Retry.`,
    };
  }
  if (
    upstreamStatus === 408 ||
    upstreamStatus === 504 ||
    lower.includes('aborted') ||
    lower.includes('timeout') ||
    lower.includes('etimedout')
  ) {
    return {
      status: 504,
      code: 'AI_TIMEOUT',
      message: 'Google Gemini took too long to respond. Your question was not lost — please tap Retry or ask a shorter question.',
    };
  }

  return {
    status: 502,
    code: 'AI_UPSTREAM_ERROR',
    message: `Unable to reach the Gemini AI service right now${upstreamStatus ? ` (upstream ${upstreamStatus})` : ''}. Please try again shortly.`,
  };
}

const VALID_PAGES = new Set([
  'home',
  'appointment',
  'reschedule',
  'reminders',
  'how-it-works',
  'help',
  'about',
  'journey',
  'clarity',
  'carecircle',
  'passport',
  'intelligence',
  'voicebridge',
  'sense',
  'carecompass',
  'careflow',
  'accessibility-lab',
  'insights',
  'showcase',
  'stories',
]);

export interface CompanionRequestPayload {
  message?: unknown;
  language?: unknown;
  complexity?: unknown;
  guidedMode?: unknown;
  voicePreferred?: unknown;
  currentPage?: unknown;
  pageContext?: unknown;
  history?: unknown;
  consentAccepted?: unknown;
}

export async function runCompanionAi(payload: CompanionRequestPayload) {
  validateConsent(payload.consentAccepted);

  const userMessage = sanitizeText(payload.message);
  if (!userMessage) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_MESSAGE',
      message: 'Please enter a question or request for CORE AI Companion.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const complexity = normalizeComplexity(payload.complexity);
  const guidedMode = payload.guidedMode === true;
  const voicePreferred = payload.voicePreferred === true;
  const currentPage = typeof payload.currentPage === 'string' ? payload.currentPage : 'home';
  const pageContext = sanitizeText(payload.pageContext, 300);

  const historyArr = Array.isArray(payload.history)
    ? payload.history
        .slice(-8)
        .filter(
          (item): item is { role: 'user' | 'assistant'; text: string } =>
            typeof item === 'object' &&
            item !== null &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.text === 'string'
        )
        .map((item) => `${item.role === 'user' ? 'User' : 'CORE AI'}: ${sanitizeText(item.text, 400)}`)
    : [];

  const complexityInstruction =
    complexity === 'extra_simple'
      ? 'Use very short, reassuring sentences suitable for low-literacy elderly patients.'
      : complexity === 'detailed'
      ? 'Provide thorough, well-structured, polite guidance.'
      : 'Use warm, plain everyday language.';

  const systemInstruction = [
    `You are CORE AI Companion, an accessibility and healthcare-navigation assistant for CORE ("Care That Understands You").`,
    `ALWAYS reply primarily in ${languageName(language)}.`,
    complexityInstruction,
    guidedMode ? 'The user prefers step-by-step guided instructions.' : '',
    voicePreferred ? 'Keep sentences natural and easy to listen to aloud via speech synthesis.' : '',
    `CORE pages you can suggest by ID when relevant: home, appointment (Hear My Appointment), reschedule, reminders, journey (My Care Journey), clarity (Explain It Simply / CORE Clarity AI), carecircle (CareCircle / CORE Connect), passport (My Visit Passport), intelligence (CORE Intelligence), voicebridge, sense (CORE Sense), carecompass, careflow, accessibility-lab, help (Get Help).`,
    `STRICT SAFETY RULES:`,
    `1. Clearly remember you are an AI navigation & clarity assistant — NEVER claim to be a doctor, nurse, or clinician.`,
    `2. NEVER diagnose conditions, prescribe or alter medication dosages, or interpret diagnostic test results as medical conclusions.`,
    `3. If the user describes symptoms, pain, emergencies, or asks for medical/medication advice, warmly advise them to consult qualified hospital clinicians or emergency services immediately.`,
    `4. Never invent appointment dates, times, or hospital confirmations, and never pretend you can view real hospital records or send live SMS/WhatsApp messages.`,
    `5. If the user's request is ambiguous, ask one gentle clarifying follow-up question.`,
  ]
    .filter(Boolean)
    .join('\n');

  const promptBody = [
    `Current CORE page ID: ${currentPage}`,
    pageContext ? `Approved page context (no personal records): ${pageContext}` : '',
    historyArr.length > 0 ? `Recent conversation context:\n${historyArr.join('\n')}` : '',
    `Current user message: ${userMessage}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('companion', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: promptBody,
      config: {
        abortSignal,
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Warm, helpful, plain-language response in the requested language.',
            },
            suggestedPage: {
              type: Type.STRING,
              description:
                'Optional valid CORE page ID if navigation helps (e.g. appointment, clarity, journey, carecircle, passport, reschedule, reminders, help, voicebridge, carecompass, careflow, accessibility-lab), or empty string if none.',
            },
            suggestedActionLabel: {
              type: Type.STRING,
              description: 'Short button label in the requested language for suggestedPage, or empty string.',
            },
            followUpQuestion: {
              type: Type.STRING,
              description: 'Optional helpful clarifying follow-up question in the requested language, or empty string.',
            },
            safetyNotice: {
              type: Type.STRING,
              description:
                'Brief reminder in the requested language if medical/clinical verification is relevant, or empty string.',
            },
          },
          required: ['reply'],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  const suggestedPage =
    typeof parsed.suggestedPage === 'string' && VALID_PAGES.has(parsed.suggestedPage)
      ? parsed.suggestedPage
      : undefined;

  return {
    reply: typeof parsed.reply === 'string' ? parsed.reply : '',
    suggestedPage,
    suggestedActionLabel:
      suggestedPage && typeof parsed.suggestedActionLabel === 'string'
        ? parsed.suggestedActionLabel
        : undefined,
    followUpQuestion:
      typeof parsed.followUpQuestion === 'string' && parsed.followUpQuestion.trim()
        ? parsed.followUpQuestion.trim()
        : undefined,
    safetyNotice:
      typeof parsed.safetyNotice === 'string' && parsed.safetyNotice.trim()
        ? parsed.safetyNotice.trim()
        : undefined,
  };
}

export interface ClarityRequestPayload {
  instructionText?: unknown;
  language?: unknown;
  complexity?: unknown;
  consentAccepted?: unknown;
}

export async function runClarityAi(payload: ClarityRequestPayload) {
  validateConsent(payload.consentAccepted);

  const instructionText = sanitizeText(payload.instructionText);
  if (!instructionText || instructionText.length < 4) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_INSTRUCTION',
      message: 'Please enter a healthcare instruction or phrase to simplify.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const complexity = normalizeComplexity(payload.complexity);

  const systemInstruction = [
    `You are CORE Clarity AI, an administrative healthcare language simplifier.`,
    `Target language for output fields: ${languageName(language)}.`,
    `Complexity style: ${
      complexity === 'extra_simple'
        ? 'Extra simple short sentences suitable for elderly or low-literacy readers'
        : complexity === 'detailed'
        ? 'Clear, structured plain language with helpful context'
        : 'Plain, warm everyday language'
    }.`,
    `STRICT RULES:`,
    `1. Preserve the exact meaning of the original text without inventing appointment dates, times, treatment plans, or medical facts.`,
    `2. NEVER modify, recommend, or calculate medication dosages or change clinical orders.`,
    `3. If the input contains ambiguous abbreviations, clinical judgment, or dosage details, clearly explain that uncertainty in uncertaintyNote and advise confirming with hospital staff.`,
    `4. Always populate plainExplanation, shortExplanation, stepByStepSummary, translatedExplanation (all in ${languageName(
      language
    )}), questionsForProvider (2-4 polite questions the patient can ask hospital staff), uncertaintyNote, and verificationDisclaimer.`,
  ].join('\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('clarity', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: `Original non-clinical or administrative instruction to clarify:\n"${instructionText}"`,
      config: {
        abortSignal,
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plainExplanation: { type: Type.STRING },
            shortExplanation: { type: Type.STRING },
            stepByStepSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            translatedExplanation: { type: Type.STRING },
            questionsForProvider: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            uncertaintyNote: { type: Type.STRING },
            verificationDisclaimer: { type: Type.STRING },
          },
          required: [
            'plainExplanation',
            'shortExplanation',
            'stepByStepSummary',
            'translatedExplanation',
            'questionsForProvider',
            'verificationDisclaimer',
          ],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  return {
    plainExplanation: String(parsed.plainExplanation ?? ''),
    shortExplanation: String(parsed.shortExplanation ?? ''),
    stepByStepSummary: Array.isArray(parsed.stepByStepSummary)
      ? parsed.stepByStepSummary.map(String)
      : [],
    translatedExplanation: String(parsed.translatedExplanation ?? ''),
    questionsForProvider: Array.isArray(parsed.questionsForProvider)
      ? parsed.questionsForProvider.map(String)
      : [],
    uncertaintyNote: parsed.uncertaintyNote ? String(parsed.uncertaintyNote) : '',
    verificationDisclaimer: String(parsed.verificationDisclaimer ?? ''),
  };
}

export interface SmartJourneyRequestPayload {
  needDescription?: unknown;
  language?: unknown;
  complexity?: unknown;
  consentAccepted?: unknown;
}

export async function runSmartJourneyAi(payload: SmartJourneyRequestPayload) {
  validateConsent(payload.consentAccepted);

  const needDescription = sanitizeText(payload.needDescription);
  if (!needDescription || needDescription.length < 5) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_DESCRIPTION',
      message: 'Please describe what hospital visit assistance you need.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const complexity = normalizeComplexity(payload.complexity);

  const systemInstruction = [
    `You are CORE Smart Journey, an organizational hospital-visit checklist planner.`,
    `Reply entirely in ${languageName(language)}.`,
    `Complexity preference: ${
      complexity === 'extra_simple' ? 'Extra brief, clear steps' : 'Warm, clear organizational steps'
    }.`,
    `STRICT RULES:`,
    `1. Only suggest practical, non-clinical administrative & preparation tasks (appointment confirmation, documents to check with the hospital, transport/timing, caregiver planning, questions to ask staff).`,
    `2. NEVER suggest clinical treatments, diagnoses, or fasting/medication rules as mandatory hospital instructions.`,
    `3. Explicitly frame tasks as helpful optional suggestions that the patient can edit or verify with their clinic.`,
    `4. Return 4 to 6 editable checklist items across categories: "confirmation", "documents", "transport", "questions".`,
  ].join('\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('smart-journey', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: `Patient's visit preparation request:\n"${needDescription}"`,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        abortSignal,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            advisoryNote: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  label: { type: Type.STRING },
                  helper: { type: Type.STRING },
                },
                required: ['category', 'label', 'helper'],
              },
            },
          },
          required: ['planTitle', 'advisoryNote', 'tasks'],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  const rawTasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];

  return {
    planTitle: String(parsed.planTitle ?? ''),
    advisoryNote: String(parsed.advisoryNote ?? ''),
    tasks: rawTasks.slice(0, 8).map((item: Record<string, unknown>, idx: number) => ({
      id: `ai-task-${Date.now()}-${idx}`,
      category: String(item.category ?? 'documents'),
      label: String(item.label ?? ''),
      helper: String(item.helper ?? ''),
      completed: false,
    })),
  };
}
