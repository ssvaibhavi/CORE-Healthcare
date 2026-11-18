import { ExplanationComplexity, Language, PageView } from '../types';

export interface CompanionAiResponse {
  reply: string;
  suggestedPage?: PageView;
  suggestedActionLabel?: string;
  followUpQuestion?: string;
  safetyNotice?: string;
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
  const timer = window.setTimeout(() => controller.abort(), 45_000);

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
        json?.message || 'Unable to reach CORE AI right now.',
        json?.error || 'AI_REQUEST_FAILED',
        res.status
      );
    }

    return json.data as T;
  } catch (err) {
    if (err instanceof AiClientError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new AiClientError(
        'The AI request took too long. Please try again in a moment.',
        'AI_TIMEOUT',
        504
      );
    }
    throw new AiClientError(
      'Network error while reaching CORE AI service.',
      'AI_NETWORK_ERROR',
      503
    );
  } finally {
    window.clearTimeout(timer);
  }
}

export function askCompanionAi(params: {
  message: string;
  language: Language;
  complexity?: ExplanationComplexity;
  guidedMode?: boolean;
  voicePreferred?: boolean;
  currentPage: PageView;
  pageContext?: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  consentAccepted: boolean;
}): Promise<CompanionAiResponse> {
  return postAiEndpoint<CompanionAiResponse>('/api/ai/companion', params);
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
