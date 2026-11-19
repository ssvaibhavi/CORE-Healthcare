import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export type AiLanguage = 'en' | 'kn' | 'te';
export type AiComplexity = 'extra_simple' | 'simple' | 'detailed';

export interface AiServiceHttpError {
  status: number;
  code: string;
  message: string;
}

const MODEL_ID = 'gemini-4-hydrogen';
const TTS_MODEL_ID = 'gemini-3.8-flash-lite-tts';
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

function getGeminiClient(apiVersion?: string): GoogleGenAI {
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
    ...(apiVersion ? { apiVersion } : {}),
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

function languageScriptRequirement(lang: AiLanguage): string {
  if (lang === 'kn') {
    return 'Write naturally in Kannada Unicode script (ಕನ್ನಡ ಲಿಪಿ) with everyday patient-friendly words. You may keep standard hospital abbreviations like OPD or CT scan in parentheses after the Kannada explanation.';
  }
  if (lang === 'te') {
    return 'Write naturally in Telugu Unicode script (తెలుగు లిపి) with everyday patient-friendly words. You may keep standard hospital abbreviations like OPD or CT scan in parentheses after the Telugu explanation.';
  }
  return 'Write in clear, warm, conversational English with accessible explanations for medical/hospital terms.';
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
  fn: (signal: AbortSignal) => Promise<T>,
  modelName = MODEL_ID
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
        model: modelName,
        durationMs: Date.now() - attemptStart,
        outcome: 'ok',
      });
      lastAiDiagnostic = {
        timestamp: new Date().toISOString(),
        operation,
        model: modelName,
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
        model: modelName,
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

  const mapped = mapGeminiError(lastError, { log: false, modelName });
  lastAiDiagnostic = {
    timestamp: new Date().toISOString(),
    operation,
    model: modelName,
    attempts,
    mappedStatus: mapped.status,
    mappedCode: mapped.code,
  };
  throw lastError;
}

export function mapGeminiError(
  err: unknown,
  options: { log?: boolean; modelName?: string } = { log: true }
): AiServiceHttpError {
  const activeModel = options.modelName || MODEL_ID;
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
      message: `The configured Gemini model (${activeModel}) could not be found right now.`,
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
      message: `Google Gemini (${activeModel}) is temporarily overloaded due to high demand. Your request was not lost — please wait ${retryHintSec ? `about ${retryHintSec} seconds` : 'a few seconds'} and tap Retry.`,
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
  actionIntent?: unknown;
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
  const actionIntent =
    payload.actionIntent === 'simplify' || payload.actionIntent === 'elaborate'
      ? payload.actionIntent
      : 'chat';
  const guidedMode = payload.guidedMode === true;
  const voicePreferred = payload.voicePreferred === true;
  const currentPage = typeof payload.currentPage === 'string' ? payload.currentPage : 'home';
  const pageContext = sanitizeText(payload.pageContext, 300);

  const rawHistory = Array.isArray(payload.history)
    ? payload.history
        .slice(-10)
        .filter(
          (item): item is { role: 'user' | 'assistant'; text: string } =>
            typeof item === 'object' &&
            item !== null &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.text === 'string' &&
            item.text.trim().length > 0
        )
    : [];

  // Build native multi-turn Content[] history (excluding duplicate trailing turn if already matching userMessage)
  const trimmedHistory =
    rawHistory.length > 0 &&
    rawHistory[rawHistory.length - 1].role === 'user' &&
    sanitizeText(rawHistory[rawHistory.length - 1].text) === userMessage
      ? rawHistory.slice(0, -1)
      : rawHistory;

  const complexityInstruction =
    complexity === 'extra_simple'
      ? 'RESPONSE MODE — QUICK ANSWER: Respond in strictly 2 to 3 concise, reassuring plain sentences (~30–65 words total). Do not use long headings or multi-part lists. Keep the meaning effortless to read or listen to aloud.'
      : complexity === 'detailed'
      ? 'RESPONSE MODE — DETAILED EXPLANATION: Provide a thorough, well-organized guide using clear markdown section headings (##), numbered steps, practical preparation tips, and a brief closing note on what to verify with hospital staff.'
      : 'RESPONSE MODE — SIMPLE EXPLANATION: Provide a warm, beginner-friendly explanation with 1 brief plain sentence followed by 3–5 clear numbered or bulleted practical steps.';

  const intentDirective =
    actionIntent === 'simplify'
      ? 'The user clicked "Simplify" on your previous response. Rewrite that exact previous explanation much more simply without dropping safety accuracy.'
      : actionIntent === 'elaborate'
      ? 'The user clicked "Explain Further" on your previous response. Expand on that exact previous explanation with structured sections and helpful practical examples.'
      : '';

  const systemInstruction = [
    `You are CORE AI Companion, an accessibility and healthcare-navigation assistant for CORE ("Care That Understands You").`,
    `STRICT LANGUAGE REQUIREMENT: You MUST generate your entire response—including reply, suggestedActionLabel, followUpQuestion, and safetyNotice—directly in ${languageName(
      language
    )} (ISO code: ${language}).`,
    languageScriptRequirement(language),
    `Even if the user's message or earlier conversation turns are in a different language, ALWAYS respond in ${languageName(
      language
    )} unless explicitly told otherwise by this prompt.`,
    complexityInstruction,
    intentDirective,
    guidedMode ? 'The user prefers step-by-step guided instructions.' : '',
    voicePreferred ? 'Use natural, clear phrasing suitable for text-to-speech playback.' : '',
    `CORE pages you can suggest by ID when relevant: home, appointment (Hear My Appointment), reschedule, reminders, journey (My Care Journey), clarity (Explain It Simply / CORE Clarity AI), carecircle (CareCircle / CORE Connect), passport (My Visit Passport), intelligence (CORE Intelligence), voicebridge, sense (CORE Sense), carecompass, careflow, accessibility-lab, help (Get Help).`,
    `STRICT PRIVACY & SAFETY RULES:`,
    `1. You are an AI navigation & clarity assistant — NEVER claim to be a doctor, nurse, or clinician.`,
    `2. NEVER diagnose medical conditions, prescribe or alter medication dosages, or interpret test results as medical conclusions.`,
    `3. NEVER invent hospital appointments, dates, times, hospital policies, or pretend to access confidential patient records.`,
    `4. If the user asks about symptoms, pain, emergencies, or medication/clinical decisions, warmly advise them to consult qualified hospital professionals or emergency services immediately.`,
    `5. Maintain accurate continuity across follow-up turns (e.g., if the user refers to "the second point", look at the exact prior assistant turn in the conversation history).`,
  ]
    .filter(Boolean)
    .join('\n');

  const multiTurnContents = trimmedHistory.map((item) => ({
    role: item.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: sanitizeText(item.text, 900) }],
  }));

  const currentTurnText = [
    `[Context: Current CORE page "${currentPage}"${pageContext ? ` — ${pageContext}` : ''}]`,
    `[Required output language: ${languageName(language)} | Length mode: ${complexity}]`,
    userMessage,
  ].join('\n');

  multiTurnContents.push({
    role: 'user' as const,
    parts: [{ text: currentTurnText }],
  });

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('companion', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: multiTurnContents,
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
              description: `Warm, helpful, plain-language response written strictly in ${languageName(
                language
              )} matching the requested length mode.`,
            },
            suggestedPage: {
              type: Type.STRING,
              description:
                'Optional valid CORE page ID if navigation helps (e.g. appointment, clarity, journey, carecircle, passport, reschedule, reminders, help, voicebridge, carecompass, careflow, accessibility-lab), or empty string if none.',
            },
            suggestedActionLabel: {
              type: Type.STRING,
              description: `Short button label strictly in ${languageName(
                language
              )} for suggestedPage, or empty string.`,
            },
            followUpQuestion: {
              type: Type.STRING,
              description: `Optional helpful clarifying follow-up question strictly in ${languageName(
                language
              )}, or empty string.`,
            },
            safetyNotice: {
              type: Type.STRING,
              description: `Brief reminder strictly in ${languageName(
                language
              )} if medical/clinical verification with hospital staff is relevant, or empty string.`,
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
    responseLanguage: language,
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

export interface TranslateRequestPayload {
  text?: unknown;
  targetLanguage?: unknown;
  consentAccepted?: unknown;
}

export async function runTranslateAi(payload: TranslateRequestPayload) {
  validateConsent(payload.consentAccepted);

  const sourceText = sanitizeText(payload.text, 2400);
  if (!sourceText || sourceText.length < 2) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_TEXT',
      message: 'Please provide text to translate.',
    };
    throw err;
  }

  const targetLanguage = normalizeLanguage(payload.targetLanguage);

  const systemInstruction = [
    `You are CORE Language Bridge, a faithful healthcare-accessibility translator.`,
    `Translate the provided assistant guidance into natural ${languageName(targetLanguage)}.`,
    languageScriptRequirement(targetLanguage),
    `STRICT TRANSLATION RULES:`,
    `1. Preserve the exact meaning, formatting (headings, bullet lists, numbered steps), and tone without adding new medical facts, inventing clinical orders, or altering numbers/dates.`,
    `2. If a medical abbreviation appears (e.g., OPD, CT, NPO), explain or keep it accurately in parentheses so the patient understands.`,
    `3. Return translatedText strictly in ${languageName(targetLanguage)} and a brief verificationNote reminding the user to confirm clinical instructions with hospital staff.`,
  ].join('\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('translate', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: `Translate the following text faithfully into ${languageName(targetLanguage)}:\n\n${sourceText}`,
      config: {
        abortSignal,
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
              description: `Faithful translation strictly in ${languageName(targetLanguage)}.`,
            },
            verificationNote: {
              type: Type.STRING,
              description: `Short note in ${languageName(targetLanguage)} reminding the reader to confirm important clinical details with hospital staff.`,
            },
          },
          required: ['translatedText'],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  return {
    translatedText: String(parsed.translatedText ?? ''),
    targetLanguage,
    verificationNote: parsed.verificationNote ? String(parsed.verificationNote) : undefined,
  };
}

export interface TtsCapabilities {
  cloudTtsConfigured: boolean;
  providers: Array<'google-cloud-tts' | 'gemini-tts'>;
}

export function getTtsCapabilities(): TtsCapabilities {
  const providers: Array<'google-cloud-tts' | 'gemini-tts'> = [];
  const gcloudKey = process.env.GOOGLE_CLOUD_TTS_API_KEY?.trim();
  if (gcloudKey && gcloudKey !== 'MY_GOOGLE_CLOUD_TTS_API_KEY') {
    providers.push('google-cloud-tts');
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (
    process.env.DISABLE_GEMINI_TTS !== 'true' &&
    geminiKey &&
    geminiKey !== 'MY_GEMINI_API_KEY'
  ) {
    providers.push('gemini-tts');
  }

  return {
    cloudTtsConfigured: providers.length > 0,
    providers,
  };
}

export interface TtsRequestPayload {
  text?: unknown;
  language?: unknown;
  rate?: unknown;
  consentAccepted?: unknown;
}

function getLocaleForLanguage(lang: AiLanguage): 'en-IN' | 'kn-IN' | 'te-IN' {
  if (lang === 'kn') return 'kn-IN';
  if (lang === 'te') return 'te-IN';
  return 'en-IN';
}

export async function runTtsAi(payload: TtsRequestPayload) {
  validateConsent(payload.consentAccepted);

  const text = sanitizeText(payload.text, 2400);
  if (!text || text.length < 1) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_TEXT',
      message: 'Please provide text to synthesize.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const locale = getLocaleForLanguage(language);
  const rawRate = typeof payload.rate === 'number' ? payload.rate : 0.9;
  const speakingRate = Math.min(1.25, Math.max(0.75, rawRate));
  const caps = getTtsCapabilities();

  if (!caps.cloudTtsConfigured) {
    const err: AiServiceHttpError = {
      status: 503,
      code: 'TTS_NOT_CONFIGURED',
      message:
        'Server Text-to-Speech is not configured. Set GEMINI_API_KEY (or GOOGLE_CLOUD_TTS_API_KEY) in server secrets to enable voice generation when browser voices are absent.',
    };
    throw err;
  }

  if (caps.providers.includes('google-cloud-tts')) {
    const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY!.trim();
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(18_000),
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: locale,
            ssmlGender: 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate,
          },
        }),
      }
    );

    const data = (await res.json().catch(() => ({}))) as {
      audioContent?: string;
      error?: { message?: string; status?: string };
    };

    if (!res.ok || !data.audioContent) {
      const err: AiServiceHttpError = {
        status: res.status === 429 ? 429 : res.status >= 400 && res.status < 500 ? res.status : 502,
        code: res.status === 429 ? 'TTS_RATE_LIMITED' : 'TTS_UPSTREAM_ERROR',
        message:
          data?.error?.message ||
          `Cloud Text-to-Speech request failed for ${locale}.`,
      };
      throw err;
    }

    return {
      audioBase64: data.audioContent,
      mimeType: 'audio/mpeg',
      language,
      locale,
      provider: 'google-cloud-tts' as const,
      model: 'google-cloud-tts-v1',
    };
  }

  // Reuses the configured GEMINI_API_KEY with Gemini 3.8 Flash Lite TTS (standard API tier, v1beta for speechConfig/speechMetadata)
  const ai = getGeminiClient('v1beta');
  const paceCue =
    speakingRate <= 0.8
      ? 'very gentle, unhurried, slow pace'
      : speakingRate < 0.95
      ? 'calm, steady, unhurried pace'
      : 'natural clear pace';

  const response = await callWithExponentialBackoff(
    'tts',
    (abortSignal) =>
      ai.models.generateContent({
        model: TTS_MODEL_ID,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: `Warm, patient, articulate healthcare guide speaking strictly in ${languageName(
                    language
                  )} (${locale}) at a ${paceCue}. Pronounce every word clearly for elderly patients.`,
                },
              },
            ],
          },
        ],
        config: {
          abortSignal,
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }),
    TTS_MODEL_ID
  );

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const audioPart = parts.find((p) => Boolean(p?.inlineData?.data));
  const inline = audioPart?.inlineData;
  if (!inline?.data) {
    const err: AiServiceHttpError = {
      status: 502,
      code: 'TTS_EMPTY_AUDIO',
      message: `Gemini TTS (${TTS_MODEL_ID}) returned no playable audio for ${locale}.`,
    };
    throw err;
  }

  return {
    audioBase64: inline.data,
    mimeType: inline.mimeType || 'audio/wav',
    language,
    locale,
    provider: 'gemini-tts' as const,
    model: TTS_MODEL_ID,
  };
}

