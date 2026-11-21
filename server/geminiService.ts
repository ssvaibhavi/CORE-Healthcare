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

  const mapped = mapGeminiError(lastError, { log: false, modelName, operation });
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
  options: { log?: boolean; modelName?: string; operation?: string } = { log: true }
): AiServiceHttpError {
  const activeModel =
    options.modelName || (options.operation === 'tts' ? TTS_MODEL_ID : MODEL_ID);
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

  if (
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('api_key_expired') ||
    lower.includes('unauthenticated')
  ) {
    return {
      status: 401,
      code: 'AI_KEY_INVALID',
      message:
        'Authentication failed: the server Gemini API key is invalid or expired. Please check GEMINI_API_KEY in server environment secrets.',
    };
  }
  if (upstreamStatus === 401 || upstreamStatus === 403 || lower.includes('permission_denied')) {
    return {
      status: 403,
      code: 'AI_PERMISSION_DENIED',
      message:
        'Authentication failed: Gemini API access was denied for this credential or project. Please verify GEMINI_API_KEY permissions.',
    };
  }
  if (upstreamStatus === 429 || lower.includes('resource_exhausted')) {
    const isQuotaExhausted = lower.includes('quota') || lower.includes('billing');
    const isLongWait = retryHintSec !== undefined && retryHintSec > 300;
    if (isQuotaExhausted) {
      return {
        status: 429,
        code: 'AI_QUOTA_EXCEEDED',
        message: `Google Gemini API quota for this tier is currently exhausted${retryHintLabel ? ` (retry suggested in ${retryHintLabel})` : ''}. ${
          isLongWait
            ? 'Please try again later or check your Gemini API plan and billing.'
            : 'Please wait briefly and tap Retry.'
        }`,
      };
    }
    return {
      status: 429,
      code: 'AI_RATE_LIMITED',
      message: `Google Gemini temporary rate limit reached${retryHintLabel ? ` (retry suggested in ${retryHintLabel})` : ''}. Please wait a moment and try again.`,
    };
  }
  if (upstreamStatus === 404 || lower.includes('not_found')) {
    return {
      status: 502,
      code: 'AI_MODEL_UNAVAILABLE',
      message: `Unsupported or unavailable Gemini model configuration (${activeModel}). Please verify the configured model and API endpoint.`,
    };
  }
  if (upstreamStatus === 400 || lower.includes('invalid_argument')) {
    const isUnsupportedConfig =
      lower.includes('unsupported') &&
      (lower.includes('model') ||
        lower.includes('modality') ||
        lower.includes('modalities') ||
        lower.includes('response_format') ||
        lower.includes('speech_config') ||
        lower.includes('language') ||
        lower.includes('voice'));
    if (isUnsupportedConfig) {
      return {
        status: 400,
        code: 'AI_MODEL_UNAVAILABLE',
        message: `Unsupported Gemini configuration for ${activeModel}: the requested audio format, voice, or language setting was rejected.`,
      };
    }
    if (options.operation === 'tts') {
      return {
        status: 400,
        code: 'TTS_INVALID_REQUEST',
        message:
          'Audio generation request format was rejected by the speech service. Please verify the text and selected language and try again.',
      };
    }
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
      message: `Google Gemini (${activeModel}) is temporarily unavailable due to high demand. Please wait ${retryHintSec ? `about ${retryHintSec} seconds` : 'a few seconds'} and try again.`,
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
      message: 'Google Gemini took too long to respond. Please tap Retry or try shorter text.',
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
  'navigator',
  'recovery',
  'impact-lab',
]);

export interface CompanionAppContextPayload {
  activeScenario?: unknown;
  scenarioTitle?: unknown;
  routeChanged?: unknown;
  routeSummary?: unknown;
  routeChangeReason?: unknown;
  noAccessibleRoute?: unknown;
  accessibleOnly?: unknown;
  comfortSummary?: unknown;
}

export interface CompanionRequestPayload {
  message?: unknown;
  language?: unknown;
  complexity?: unknown;
  actionIntent?: unknown;
  guidedMode?: unknown;
  voicePreferred?: unknown;
  currentPage?: unknown;
  pageContext?: unknown;
  appContext?: CompanionAppContextPayload;
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
  const pageContext = sanitizeText(payload.pageContext, 1050);

  const rawAppCtx =
    typeof payload.appContext === 'object' && payload.appContext !== null
      ? payload.appContext
      : undefined;
  const appCtxScenario = rawAppCtx ? sanitizeText(rawAppCtx.activeScenario, 60) : '';
  const appCtxScenarioTitle = rawAppCtx ? sanitizeText(rawAppCtx.scenarioTitle, 140) : '';
  const appCtxRouteChanged = rawAppCtx?.routeChanged === true;
  const appCtxNoAccessible = rawAppCtx?.noAccessibleRoute === true;
  const appCtxAccessibleOnly = rawAppCtx?.accessibleOnly === true;
  const appCtxRouteSummary = rawAppCtx ? sanitizeText(rawAppCtx.routeSummary, 260) : '';
  const appCtxRouteReason = rawAppCtx ? sanitizeText(rawAppCtx.routeChangeReason, 300) : '';
  const appCtxComfort = rawAppCtx ? sanitizeText(rawAppCtx.comfortSummary, 160) : '';

  const structuredContextBlock = rawAppCtx
    ? [
        `ActiveScenario=${appCtxScenario || 'none'}${appCtxScenarioTitle ? ` (${appCtxScenarioTitle})` : ''}`,
        appCtxRouteSummary ? `Route=${appCtxRouteSummary}` : '',
        appCtxRouteChanged && appCtxRouteReason ? `RouteChangedReason=${appCtxRouteReason}` : '',
        appCtxNoAccessible
          ? 'CRITICAL_ACCESS_RULE=No step-free path exists right now; NEVER suggest stairs; tell user to ask Ground Reception for staff lift escort'
          : appCtxAccessibleOnly
          ? 'StepFreeOnly=TRUE (never suggest stairs)'
          : '',
        appCtxComfort ? `Comfort=${appCtxComfort}` : '',
      ]
        .filter(Boolean)
        .join(' | ')
    : '';

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
    `CORE pages you can suggest by ID when relevant: home, appointment (Hear My Appointment), reschedule, reminders, journey (My Care Journey), clarity (Explain It Simply / CORE Clarity AI), carecircle (CareCircle), passport (My Visit Passport), intelligence, voicebridge, sense, carecompass, careflow, accessibility-lab, help (Get Help), navigator (CORE Smart Hospital Navigator), recovery (CORE Smart Recovery), impact-lab (CORE Impact Lab).`,
    currentPage === 'navigator' || currentPage === 'recovery' || pageContext.includes('FICTIONAL_DEMO_MAP') || Boolean(structuredContextBlock)
      ? [
          `SMART HOSPITAL NAVIGATOR & RECOVERY GROUNDING RULES (CRITICAL):`,
          `- You are assisting inside the CORE Smart Hospital Navigator / Adaptive Recovery fictional demonstration.`,
          `- Use ONLY the approved fictional demonstration hospital locations (Main Entrance, Reception, Registration Counter, Waiting Area, Radiology, Pharmacy, Laboratory, Consultation Rooms, Accessible Lift) and the exact active scenario / route details provided in [Context].`,
          `- If the user asks why their route changed or what to do during a disruption, answer directly using the active RouteChangedReason and scenario context provided.`,
          `- If StepFreeOnly=TRUE or CRITICAL_ACCESS_RULE appears, NEVER suggest stairs under any circumstance.`,
          `- NEVER invent unverified room numbers, wings, exits, floors, parking lots, or pretend to know live hospital wait times or doctor schedules.`,
        ].join('\n')
      : '',
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
    `[Context: Current CORE page "${currentPage}"${pageContext ? ` — ${pageContext}` : ''}${
      structuredContextBlock ? ` | ${structuredContextBlock}` : ''
    }]`,
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

export function prepareTtsTranscript(rawText: string, language: AiLanguage): string {
  let formatted = rawText
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`+/g, '')
    // Convert bullet/numbered line breaks into clear sentence pauses
    .replace(/:\s*\n+\s*(?:[-*•]|\d+[.)])\s+/g, ': ')
    .replace(/\n+\s*(?:[-*•]|\d+[.)])\s+/g, '. ')
    .replace(/\n+/g, '. ')
    // Replace technical separators with calm spoken pauses
    .replace(/\s*\|\s*/g, ', ')
    .replace(/\s*;\s*/g, ', ')
    .replace(/\s*\/\s*/g, ', ')
    // Normalize spacing around punctuation for gentle pauses
    .replace(/\s+([.,!?।:])/g, '$1')
    .replace(/([.,!?।:])([^\s.,!?।:\d])/g, '$1 $2')
    .replace(/[:;,]\s*\./g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (!formatted) return '';

  // Ensure a clean terminal pause
  if (!/[.!?।]$/.test(formatted)) {
    formatted += '.';
  }

  // Keep slight patient-friendly pause after commas in regional scripts
  if (language === 'kn' || language === 'te') {
    formatted = formatted.replace(/,\s*/g, ', ');
  }

  return formatted.slice(0, 2400);
}

const CALM_HEALTHCARE_SPEECH_STYLE =
  'Speak as a calm, warm, reassuring patient guide in clear, unhurried pronunciation with gentle pauses at commas and sentences.';

export async function runTtsAi(payload: TtsRequestPayload) {
  validateConsent(payload.consentAccepted);

  const rawSanitized = sanitizeText(payload.text, 2400);
  if (!rawSanitized || rawSanitized.length < 1) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_TEXT',
      message: 'Please provide text to synthesize.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const locale = getLocaleForLanguage(language);
  const text = prepareTtsTranscript(rawSanitized, language) || rawSanitized;
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

  // Gemini 3.8 TTS via Interactions API (single-speaker audio response on v1beta, Kore calm voice + speech_metadata style)
  const ai = getGeminiClient('v1beta');

  const createTtsInteraction = async (useStyleAnnotation: boolean) => {
    const inputPayload = useStyleAnnotation
      ? [
          {
            type: 'text' as const,
            text,
            annotations: [
              {
                type: 'speech_metadata' as const,
                style: CALM_HEALTHCARE_SPEECH_STYLE,
              },
            ],
          },
        ]
      : text;

    return callWithExponentialBackoff(
      'tts',
      (abortSignal) =>
        ai.interactions.create(
          {
            model: TTS_MODEL_ID,
            input: inputPayload,
            response_format: { type: 'audio' },
            generation_config: {
              speech_config: [
                {
                  language: locale,
                  voice: 'Kore',
                },
              ],
            },
            store: false,
          },
          { signal: abortSignal }
        ),
      TTS_MODEL_ID
    );
  };

  let interaction;
  try {
    interaction = await createTtsInteraction(true);
  } catch (err) {
    const status = extractUpstreamStatus(err);
    const msg = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase();
    // If upstream rejects structured annotation format for a specific input/locale, retry once with plain transcript
    if (status === 400 && (msg.includes('annotation') || msg.includes('speech_metadata') || msg.includes('input'))) {
      interaction = await createTtsInteraction(false);
    } else {
      throw err;
    }
  }

  // Unary response returns complete WAV audio (audio/wav, 24kHz mono 16-bit) on output_audio
  let audioData = interaction.output_audio?.data;
  let audioMime = interaction.output_audio?.mime_type;

  if (!audioData && Array.isArray(interaction.steps)) {
    for (let i = interaction.steps.length - 1; i >= 0; i--) {
      const step = interaction.steps[i];
      if (step?.type === 'model_output' && Array.isArray(step.content)) {
        const audioBlock = step.content.find(
          (c): c is { type: 'audio'; data?: string; mime_type?: string } =>
            c?.type === 'audio' && typeof (c as { data?: unknown }).data === 'string'
        );
        if (audioBlock?.data) {
          audioData = audioBlock.data;
          audioMime = audioBlock.mime_type;
          break;
        }
      }
    }
  }

  if (!audioData) {
    const err: AiServiceHttpError = {
      status: 502,
      code: 'TTS_EMPTY_AUDIO',
      message: `Gemini TTS (${TTS_MODEL_ID}) returned no playable audio for ${locale}.`,
    };
    throw err;
  }

  return {
    audioBase64: audioData,
    mimeType: audioMime || 'audio/wav',
    language,
    locale,
    provider: 'gemini-tts' as const,
    model: TTS_MODEL_ID,
  };
}

export interface ExplainOptionsRequestPayload {
  situation?: unknown;
  scenarioContext?: unknown;
  language?: unknown;
  complexity?: unknown;
  consentAccepted?: unknown;
}

export async function runExplainOptionsAi(payload: ExplainOptionsRequestPayload) {
  validateConsent(payload.consentAccepted);

  const situation = sanitizeText(payload.situation, 1000);
  if (!situation || situation.length < 4) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_SITUATION',
      message: 'Please describe the hospital situation or select a scenario so CORE can explain your options.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);
  const complexity = normalizeComplexity(payload.complexity);
  const scenarioContext = sanitizeText(payload.scenarioContext, 800);

  const depthInstruction =
    complexity === 'extra_simple'
      ? 'DEPTH: QUICK ANSWER — Keep summary to 1–2 short calming sentences and each option headline under 12 words.'
      : complexity === 'detailed'
      ? 'DEPTH: DETAILED GUIDANCE — Provide thorough calm administrative context, clear trade-offs per option, who to talk to, and practical follow-up checks.'
      : 'DEPTH: SIMPLE STEP-BY-STEP — Provide 1 warm reassuring sentence plus 3–4 short practical options in easy everyday phrasing.';

  const systemInstruction = [
    `You are CORE Explain My Options, a calm non-clinical hospital administrative guidance assistant.`,
    `STRICT LANGUAGE REQUIREMENT: Write ALL JSON fields strictly in ${languageName(language)}.`,
    languageScriptRequirement(language),
    depthInstruction,
    `SAFETY & GROUNDING RULES:`,
    `1. Only give practical hospital administrative options (checking at Reception/Registration, using staff service lift if step-free lift is down, verifying token validity, asking a nurse/coordinator, requesting same-day buffer/reschedule).`,
    `2. NEVER diagnose, prescribe, alter medication/fasting orders, invent hospital schedules, or claim guaranteed slot availability.`,
    `3. If Step-Free / Lift Unavailable context is noted, NEVER recommend climbing stairs.`,
    `4. Frame everything clearly as helpful demonstration guidance to verify with hospital staff.`,
  ].join('\n');

  const promptText = [
    scenarioContext ? `[Active Fictional Demonstration Context: ${scenarioContext}]` : '',
    `Patient/Caregiver question or unexpected situation:\n"${situation}"`,
  ]
    .filter(Boolean)
    .join('\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('explain-options', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: promptText,
      config: {
        abortSignal,
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calmSummary: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  steps: { type: Type.STRING },
                  bestWhen: { type: Type.STRING },
                },
                required: ['title', 'steps'],
              },
            },
            whoToAsk: { type: Type.STRING },
            questionsToAsk: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safetyReminder: { type: Type.STRING },
          },
          required: ['calmSummary', 'options', 'whoToAsk', 'questionsToAsk', 'safetyReminder'],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  const rawOptions = Array.isArray(parsed.options) ? parsed.options : [];

  return {
    calmSummary: String(parsed.calmSummary ?? ''),
    options: rawOptions.slice(0, 4).map((opt: Record<string, unknown>) => ({
      title: String(opt?.title ?? ''),
      steps: String(opt?.steps ?? ''),
      bestWhen: opt?.bestWhen ? String(opt.bestWhen) : undefined,
    })),
    whoToAsk: String(parsed.whoToAsk ?? ''),
    questionsToAsk: Array.isArray(parsed.questionsToAsk)
      ? parsed.questionsToAsk.map(String).slice(0, 4)
      : [],
    safetyReminder: String(parsed.safetyReminder ?? ''),
    language,
    complexity,
  };
}

export interface TeachBackRequestPayload {
  userExplanation?: unknown;
  referenceExplanation?: unknown;
  stepPrompt?: unknown;
  language?: unknown;
  consentAccepted?: unknown;
}

export async function runTeachBackAi(payload: TeachBackRequestPayload) {
  validateConsent(payload.consentAccepted);

  const userExplanation = sanitizeText(payload.userExplanation, 900);
  const referenceExplanation = sanitizeText(payload.referenceExplanation, 900);
  const stepPrompt = sanitizeText(payload.stepPrompt, 500);

  if (!userExplanation || userExplanation.length < 3) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'EMPTY_TEACHBACK',
      message: 'Please type or speak your short explanation first so CORE can review it calmly with you.',
    };
    throw err;
  }

  if (!referenceExplanation) {
    const err: AiServiceHttpError = {
      status: 400,
      code: 'MISSING_REFERENCE',
      message: 'Missing reference guidance for Teach-Back comparison.',
    };
    throw err;
  }

  const language = normalizeLanguage(payload.language);

  const systemInstruction = [
    `You are CORE Teach-Back Guide, a deeply kind, respectful healthcare clarity helper.`,
    `STRICT LANGUAGE REQUIREMENT: Write ALL JSON fields strictly in ${languageName(language)}.`,
    languageScriptRequirement(language),
    `CRITICAL NON-JUDGMENTAL RULES:`,
    `1. Compare the patient's own-words explanation warmly against the Reference Practical Step.`,
    `2. NEVER assign numeric scores, grades, IQ/intelligence labels, medical competence percentages, or clinical risk classifications.`,
    `3. NEVER scold or say "you failed" or "wrong"—if an important practical detail was missed or slightly mixed up, praise what they noticed, gently clarify the missed detail in simpler words, and reassure them that asking staff twice is always welcome.`,
    `4. Set needsGentleClarification=true ONLY if a key safety or routing step (such as avoiding stairs in step-free mode, or checking in at Reception) is missing or contradicted; otherwise false.`,
    `5. Remind in confirmationNote that this reflection is just for personal clarity and never replaces staff confirmation.`,
  ].join('\n');

  const promptText = [
    stepPrompt ? `Question asked: ${stepPrompt}` : '',
    `Approved Reference Practical Step: ${referenceExplanation}`,
    `Patient/Caregiver's own-words summary: "${userExplanation}"`,
  ]
    .filter(Boolean)
    .join('\n');

  const ai = getGeminiClient();
  const response = await callWithExponentialBackoff('teach-back', (abortSignal) =>
    ai.models.generateContent({
      model: MODEL_ID,
      contents: promptText,
      config: {
        abortSignal,
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            needsGentleClarification: { type: Type.BOOLEAN },
            whatWasClear: { type: Type.STRING },
            gentleClarification: { type: Type.STRING },
            simplerVersion: { type: Type.STRING },
            confirmationNote: { type: Type.STRING },
          },
          required: ['needsGentleClarification', 'whatWasClear', 'simplerVersion', 'confirmationNote'],
        },
      },
    })
  );

  const parsed = safeJsonParse(response.text);
  return {
    needsGentleClarification: Boolean(parsed.needsGentleClarification),
    whatWasClear: String(parsed.whatWasClear ?? ''),
    gentleClarification: parsed.gentleClarification ? String(parsed.gentleClarification) : '',
    simplerVersion: String(parsed.simplerVersion ?? ''),
    confirmationNote: String(parsed.confirmationNote ?? ''),
    language,
  };
}


