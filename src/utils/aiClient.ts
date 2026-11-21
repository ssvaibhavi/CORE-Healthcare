import { AppCompanionContextSnapshot, ExplanationComplexity, Language, PageView } from '../types';

export interface CompanionAiResponse {
  reply: string;
  responseLanguage?: Language;
  suggestedPage?: PageView;
  suggestedActionLabel?: string;
  followUpQuestion?: string;
  safetyNotice?: string;
}

export interface TranslateAiResponse {
  translatedText: string;
  targetLanguage: Language;
  verificationNote?: string;
}

export interface ClarityAiResponse {
  plainExplanation: string;
  shortExplanation: string;
  stepByStepSummary: string[];
  translatedExplanation: string;
  questionsForProvider: string[];
  uncertaintyNote: string;
  verificationDisclaimer: string;
}

export interface SmartJourneyAiTask {
  id: string;
  category: string;
  label: string;
  helper: string;
  completed: boolean;
}

export interface SmartJourneyAiResponse {
  planTitle: string;
  advisoryNote: string;
  tasks: SmartJourneyAiTask[];
}

export interface ExplainOptionsAiOption {
  title: string;
  steps: string;
  bestWhen?: string;
}

export interface ExplainOptionsAiResponse {
  calmSummary: string;
  options: ExplainOptionsAiOption[];
  whoToAsk: string;
  questionsToAsk: string[];
  safetyReminder: string;
  language: Language;
  complexity: ExplanationComplexity;
}

export interface TeachBackAiResponse {
  needsGentleClarification: boolean;
  whatWasClear: string;
  gentleClarification: string;
  simplerVersion: string;
  confirmationNote: string;
  language: Language;
}

export class AiClientError extends Error {
  code: string;
  status: number;
  constructor(message: string, code = 'AI_ERROR', status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function postAiEndpoint<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok) {
      throw new AiClientError(
        json?.message || 'Unable to reach CORE AI right now. Please tap Retry in a few seconds.',
        json?.error || 'AI_REQUEST_FAILED',
        res.status
      );
    }

    return json.data as T;
  } catch (err) {
    if (err instanceof AiClientError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new AiClientError(
        'CORE AI took longer than expected to respond. Your question is still here — please tap Retry in a moment.',
        'AI_TIMEOUT',
        504
      );
    }
    throw new AiClientError(
      'Unable to connect to CORE AI right now. Please check your connection and tap Retry.',
      'AI_NETWORK_ERROR',
      503
    );
  } finally {
    window.clearTimeout(timer);
  }
}

export function formatAiErrorMessage(err: unknown, language: Language): string {
  const code = err instanceof AiClientError ? err.code : 'AI_NETWORK_ERROR';

  if (code === 'AI_SERVICE_BUSY' || code === 'AI_NETWORK_ERROR') {
    if (language === 'kn') {
      return 'Google Gemini ಸೇವೆಯಲ್ಲಿ ಈಗ ತಾತ್ಕಾಲಿಕವಾಗಿ ಹೆಚ್ಚಿನ ದಟ್ಟಣೆ ಇದೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕಳೆದುಹೋಗಿಲ್ಲ — ದಯವಿಟ್ಟು ಕೆಲವು ಸೆಕೆಂಡುಗಳ ನಂತರ "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" ಒತ್ತಿರಿ.';
    }
    if (language === 'te') {
      return 'Google Gemini సేవపై ప్రస్తుతం తాత్కాలిక రద్దీ ఎక్కువగా ఉంది. మీ ప్రశ్న అలాగే ఉంది — దయచేసి కొన్ని సెకన్ల తర్వాత "మళ్ళీ ప్రయత్నించండి" నొక్కండి.';
    }
    return 'Google Gemini is temporarily busy due to high demand. Your message was not lost — please wait a few seconds and tap Retry.';
  }

  if (code === 'AI_TIMEOUT') {
    if (language === 'kn') {
      return 'Google Gemini ಉತ್ತರಿಸಲು ನಿರೀಕ್ಷಿತಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು. ದಯವಿಟ್ಟು "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" ಒತ್ತಿರಿ ಅಥವಾ ಚಿಕ್ಕ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.';
    }
    if (language === 'te') {
      return 'Google Gemini సమాధానం ఇవ్వడానికి ఎక్కువ సమయం తీసుకుంది. దయచేసి "మళ్ళీ ప్రయత్నించండి" నొక్కండి లేదా చిన్న ప్రశ్న అడగండి.';
    }
    return 'Google Gemini took too long to respond. Please wait a moment and tap Retry, or try a shorter question.';
  }

  if (code === 'AI_QUOTA_EXCEEDED') {
    if (language === 'kn') {
      return 'Google Gemini API ಬಳಕೆಯ ಕೋಟಾ ತಾತ್ಕಾಲಿಕವಾಗಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ API ಪ್ಲಾನ್ ಪರಿಶೀಲಿಸಿ.';
    }
    if (language === 'te') {
      return 'Google Gemini API వినియోగ కోటా తాత్కాలికంగా పూర్తయింది. దయచేసి కొద్దిసేపటి తర్వాత మళ్ళీ ప్రయత్నించండి లేదా API ప్లాన్‌ను తనిఖీ చేయండి.';
    }
    if (err instanceof AiClientError && err.message) {
      return err.message;
    }
    return 'Google Gemini API quota is currently exhausted. Please try again later or check your API plan.';
  }

  if (code === 'AI_RATE_LIMITED' || code === 'RATE_LIMITED' || code === 'TTS_RATE_LIMITED') {
    if (language === 'kn') {
      return 'CORE AI ತಾತ್ಕಾಲಿಕ ವಿನಂತಿ ಮಿತಿಯನ್ನು ತಲುಪಿದೆ. ದಯವಿಟ್ಟು ಕೆಲವು ಸೆಕೆಂಡುಗಳು ಕಾದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
    }
    if (language === 'te') {
      return 'CORE AI తాత్కాలిక అభ్యర్థన పరిమితికి చేరుకుంది. దయచేసి కొన్ని సెకన్లు వేచి ఉండి మళ్ళీ ప్రయత్నించండి.';
    }
    if (err instanceof AiClientError && err.message) {
      return err.message;
    }
    return 'CORE AI reached a temporary request limit. Please wait a few seconds and tap Retry.';
  }

  if (code === 'AI_KEY_INVALID' || code === 'AI_PERMISSION_DENIED' || code === 'GEMINI_NOT_CONFIGURED') {
    if (language === 'kn') {
      return 'ಸರ್ವರ್ AI ದೃಢೀಕರಣ (Authentication) ದೋಷವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸರ್ವರ್ ಪರಿಸರದ API ಕೀ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.';
    }
    if (language === 'te') {
      return 'సర్వర్ AI ప్రమాణీకరణ (Authentication) లోపం ఏర్పడింది. దయచేసి సర్వర్ API కీ సెట్టింగ్‌లను తనిఖీ చేయండి.';
    }
    return err instanceof AiClientError && err.message
      ? err.message
      : 'Server AI authentication failed. Please check the configured API credentials.';
  }

  if (code === 'AI_MODEL_UNAVAILABLE') {
    if (language === 'kn') {
      return 'ಸಂರಚಿಸಲಾದ Gemini ಧ್ವನಿ/AI ಮಾದರಿ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯ ವಿವರಣೆಯನ್ನು ಓದಿ ಅಥವಾ ಆಡಳಿತಗಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ.';
    }
    if (language === 'te') {
      return 'కాన్ఫిగర్ చేసిన Gemini వాయిస్/AI మోడల్ అందుబాటులో లేదు లేదా మద్దతు లేదు. దయచేసి పై టెక్స్ట్‌ను చదవండి.';
    }
    return err instanceof AiClientError && err.message
      ? err.message
      : 'The configured Gemini model or audio format is unsupported or unavailable.';
  }

  if (code === 'TTS_INVALID_REQUEST' || code === 'TTS_EMPTY_AUDIO') {
    if (language === 'kn') {
      return 'ಧ್ವನಿ ಉತ್ಪಾದನೆ (TTS) ವಿನಂತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮೇಲಿನ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಓದಿ.';
    }
    if (language === 'te') {
      return 'వాయిస్ తయారీ (TTS) అభ్యర్థనను పూర్తి చేయలేకపోయాము. దయచేసి మళ్ళీ ప్రయత్నించండి లేదా పై తెలుగు టెక్స్ట్ చదవండి.';
    }
    return err instanceof AiClientError && err.message
      ? err.message
      : 'Speech synthesis could not process this audio request. Please try again or read the text above.';
  }

  if (err instanceof AiClientError && err.message) {
    return err.message;
  }

  if (language === 'kn') {
    return 'CORE AI ಸೇವೆಯನ್ನು ಈಗ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
  }
  if (language === 'te') {
    return 'CORE AI సేవను ప్రస్తుతం చేరుకోలేకపోయాము. దయచేసి కొద్దిసేపటి తర్వాత మళ్ళీ ప్రయత్నించండి.';
  }
  return 'Unable to reach CORE AI right now. Please try again shortly.';
}

export function askCompanionAi(params: {
  message: string;
  language: Language;
  complexity?: ExplanationComplexity;
  actionIntent?: 'chat' | 'simplify' | 'elaborate';
  guidedMode?: boolean;
  voicePreferred?: boolean;
  currentPage: PageView;
  pageContext?: string;
  appContext?: AppCompanionContextSnapshot;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  consentAccepted: boolean;
}): Promise<CompanionAiResponse> {
  return postAiEndpoint<CompanionAiResponse>('/api/ai/companion', params);
}

export function askExplainOptionsAi(params: {
  situation: string;
  scenarioContext?: string;
  language: Language;
  complexity?: ExplanationComplexity;
  consentAccepted: boolean;
}): Promise<ExplainOptionsAiResponse> {
  return postAiEndpoint<ExplainOptionsAiResponse>('/api/ai/explain-options', params);
}

export function submitTeachBackAi(params: {
  userExplanation: string;
  referenceExplanation: string;
  stepPrompt?: string;
  language: Language;
  consentAccepted: boolean;
}): Promise<TeachBackAiResponse> {
  return postAiEndpoint<TeachBackAiResponse>('/api/ai/teach-back', params);
}

export function translateAiText(params: {
  text: string;
  targetLanguage: Language;
  consentAccepted: boolean;
}): Promise<TranslateAiResponse> {
  return postAiEndpoint<TranslateAiResponse>('/api/ai/translate', params);
}

export function simplifyWithClarityAi(params: {
  instructionText: string;
  language: Language;
  complexity?: ExplanationComplexity;
  consentAccepted: boolean;
}): Promise<ClarityAiResponse> {
  return postAiEndpoint<ClarityAiResponse>('/api/ai/clarity', params);
}

export function generateSmartJourneyAi(params: {
  needDescription: string;
  language: Language;
  complexity?: ExplanationComplexity;
  consentAccepted: boolean;
}): Promise<SmartJourneyAiResponse> {
  return postAiEndpoint<SmartJourneyAiResponse>('/api/ai/smart-journey', params);
}

export interface TtsAiResponse {
  audioBase64: string;
  mimeType: string;
  language: Language;
  locale: 'en-IN' | 'kn-IN' | 'te-IN';
  provider: 'google-cloud-tts' | 'gemini-tts';
  model?: string;
}

export interface AiHealthStatus {
  aiConfigured: boolean;
  ttsConfigured: boolean;
  ttsProviders: Array<'google-cloud-tts' | 'gemini-tts'>;
}

let cachedHealthStatus: AiHealthStatus | null = null;
let pendingHealthPromise: Promise<AiHealthStatus> | null = null;

export async function fetchAiHealthStatus(forceRefresh = false): Promise<AiHealthStatus> {
  if (!forceRefresh && cachedHealthStatus) {
    return cachedHealthStatus;
  }
  if (!forceRefresh && pendingHealthPromise) {
    return pendingHealthPromise;
  }

  pendingHealthPromise = (async () => {
    try {
      const res = await fetch('/api/health');
      const json = await res.json().catch(() => ({}));
      const providers = Array.isArray(json?.ttsProviders)
        ? (json.ttsProviders.filter(
            (p: unknown) => p === 'google-cloud-tts' || p === 'gemini-tts'
          ) as Array<'google-cloud-tts' | 'gemini-tts'>)
        : [];
      const status: AiHealthStatus = {
        aiConfigured: Boolean(json?.aiConfigured),
        ttsConfigured: Boolean(json?.ttsConfigured),
        ttsProviders: providers,
      };
      cachedHealthStatus = status;
      return status;
    } catch {
      return (
        cachedHealthStatus || {
          aiConfigured: false,
          ttsConfigured: false,
          ttsProviders: [],
        }
      );
    } finally {
      pendingHealthPromise = null;
    }
  })();

  return pendingHealthPromise;
}

export function synthesizeCloudSpeech(params: {
  text: string;
  language: Language;
  rate?: number;
  consentAccepted: boolean;
}): Promise<TtsAiResponse> {
  return postAiEndpoint<TtsAiResponse>('/api/ai/tts', params);
}

