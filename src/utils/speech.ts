import { Language } from '../types';
import { AiClientError, fetchAiHealthStatus, formatAiErrorMessage, synthesizeCloudSpeech } from './aiClient';

export type SpeechRate = 0.75 | 0.9 | 1.0;

export type SpeechErrorCode =
  | 'unsupported'
  | 'voice-unavailable'
  | 'voice-error'
  | 'cloud-consent-required'
  | 'cloud-unavailable';

export interface SpeechErrorInfo {
  code: SpeechErrorCode;
  language: Language;
  locale: 'en-IN' | 'kn-IN' | 'te-IN';
  message: string;
}

export interface SpeechCallbacks {
  onStart?: () => void;
  onSentence?: (index: number, sentence: string) => void;
  onEnd?: () => void;
  onError?: (reason: 'unsupported' | 'voice-error' | 'voice-unavailable', info?: SpeechErrorInfo) => void;
}

export interface SpeakOptions {
  rate?: number;
  itemId?: string;
  cloudConsentGranted?: boolean;
}

export type SpeechStatus = 'idle' | 'loading' | 'speaking' | 'paused';

export interface SpeechPlaybackSnapshot {
  status: SpeechStatus;
  activeId: string | null;
  activeLang: Language | null;
  activeLocale: 'en-IN' | 'kn-IN' | 'te-IN' | null;
  activeVoiceName: string | null;
  activeSource: 'browser' | 'cloud' | null;
  activeEngineLabel: string | null;
  activeText: string | null;
  rate: number;
  lastError: SpeechErrorInfo | null;
}

export interface LanguageVoiceSupport {
  language: Language;
  locale: 'en-IN' | 'kn-IN' | 'te-IN';
  ttsApiAvailable: boolean;
  nativeTtsVoiceAvailable: boolean;
  ttsVoiceName?: string;
  cloudTtsAvailable: boolean;
  cloudProviderLabel?: string;
  sttApiAvailable: boolean;
}

const KANNADA_SCRIPT_REGEX = /[\u0C80-\u0CFF]/g;
const TELUGU_SCRIPT_REGEX = /[\u0C00-\u0C7F]/g;
const LATIN_WORDS_REGEX = /[a-zA-Z]{2,}/g;

export function getTtsLocale(lang: Language): 'en-IN' | 'kn-IN' | 'te-IN' {
  if (lang === 'kn') return 'kn-IN';
  if (lang === 'te') return 'te-IN';
  return 'en-IN';
}

export function getAudioLanguageBadge(lang: Language): string {
  if (lang === 'kn') return 'ಕನ್ನಡ (kn-IN)';
  if (lang === 'te') return 'తెలుగు (te-IN)';
  return 'English (en-IN)';
}

export function getCloudProviderDisplayLabel(
  providers: readonly ('google-cloud-tts' | 'gemini-tts')[]
): string | undefined {
  if (providers.includes('google-cloud-tts')) {
    return 'Google Cloud TTS';
  }
  if (providers.includes('gemini-tts')) {
    return 'Gemini TTS';
  }
  return undefined;
}

function base64ToBlobUrl(base64: string, mimeType: string): string | null {
  try {
    if (typeof window === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return null;
    }
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export function stripMarkdownForSpeech(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve the true spoken language from the actual text script first so that:
 * 1) Kannada answers are ALWAYS spoken in kn-IN even when site UI is English.
 * 2) Telugu answers are ALWAYS spoken in te-IN even when site UI is English.
 * 3) English-only text uses en-IN rather than passing English prose into a regional voice.
 */
export function resolveSpeechLanguage(rawText: string, preferredLang: Language): Language {
  const text = stripMarkdownForSpeech(rawText);
  if (!text) return preferredLang;

  const knCount = (text.match(KANNADA_SCRIPT_REGEX) ?? []).length;
  const teCount = (text.match(TELUGU_SCRIPT_REGEX) ?? []).length;
  const latinCount = (text.match(LATIN_WORDS_REGEX) ?? []).length;

  if (knCount >= 2 && knCount >= teCount) {
    return 'kn';
  }
  if (teCount >= 2 && teCount > knCount) {
    return 'te';
  }
  if (knCount === 1 && teCount === 0 && latinCount === 0) {
    return 'kn';
  }
  if (teCount === 1 && knCount === 0 && latinCount === 0) {
    return 'te';
  }

  // If preferred language is Kannada or Telugu, but text is purely Latin words (e.g. untranslated English copy),
  // keep speech matched to the text's English words.
  if (knCount === 0 && teCount === 0 && latinCount >= 2) {
    return 'en';
  }

  return preferredLang;
}

export interface VoiceLike {
  lang: string;
  name: string;
  localService?: boolean;
  default?: boolean;
}

/**
 * Pure, strict language-matched voice selector.
 * NEVER returns an English or unrelated fallback voice when 'kn' or 'te' is requested.
 */
export function selectVoiceForLanguage<T extends VoiceLike>(
  lang: Language,
  voices: readonly T[]
): T | undefined {
  if (!voices || voices.length === 0) return undefined;

  const norm = (v: T) => ({
    voice: v,
    lang: (v.lang || '').toLowerCase().replace(/_/g, '-').trim(),
    name: (v.name || '').toLowerCase(),
  });

  const normalized = voices.map(norm);

  if (lang === 'kn') {
    return (
      normalized.find((x) => x.lang === 'kn-in')?.voice ||
      normalized.find((x) => x.lang === 'kn' || x.lang.startsWith('kn-'))?.voice ||
      normalized.find(
        (x) => x.name.includes('kannada') && !x.lang.startsWith('en') && !x.lang.startsWith('te')
      )?.voice
    );
  }

  if (lang === 'te') {
    return (
      normalized.find((x) => x.lang === 'te-in')?.voice ||
      normalized.find((x) => x.lang === 'te' || x.lang.startsWith('te-'))?.voice ||
      normalized.find(
        (x) => x.name.includes('telugu') && !x.lang.startsWith('en') && !x.lang.startsWith('kn')
      )?.voice
    );
  }

  // English preference: en-IN -> India English -> any en* voice
  return (
    normalized.find((x) => x.lang === 'en-in')?.voice ||
    normalized.find(
      (x) => (x.lang === 'en' || x.lang.startsWith('en-')) && x.name.includes('india')
    )?.voice ||
    normalized.find((x) => x.lang === 'en' || x.lang.startsWith('en-'))?.voice
  );
}

/**
 * Split long responses into short sentence-aligned chunks (~190 chars max)
 * so Chromium Web Speech does not hit the ~15s single-utterance silence bug
 * and speed/pause/stop remain responsive.
 */
export function splitSpeechChunks(rawText: string, maxLen = 190): string[] {
  const clean = stripMarkdownForSpeech(rawText);
  if (!clean) return [];

  const sentences = clean
    .split(/(?<=[.!?।॥])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
      continue;
    }

    // Wrap long sentences cleanly on clause punctuation or spaces
    let remaining = sentence;
    while (remaining.length > maxLen) {
      const slice = remaining.slice(0, maxLen);
      let splitAt = Math.max(slice.lastIndexOf(','), slice.lastIndexOf(';'), slice.lastIndexOf(':'));
      if (splitAt < Math.floor(maxLen * 0.45)) {
        splitAt = slice.lastIndexOf(' ');
      }
      if (splitAt <= 0) {
        splitAt = maxLen;
      }
      const head = remaining.slice(0, splitAt + 1).trim();
      if (head) chunks.push(head);
      remaining = remaining.slice(splitAt + 1).trim();
    }
    if (remaining) chunks.push(remaining);
  }

  return chunks;
}

export function formatUnavailableVoiceMessage(
  lang: Language,
  cloudAvailableButNeedsConsent: boolean
): string {
  const locale = getTtsLocale(lang);
  if (lang === 'kn') {
    return cloudAvailableButNeedsConsent
      ? `ಈ ಸಾಧನ ಅಥವಾ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ (${locale}) ಧ್ವನಿ ಪ್ಯಾಕ್ ಇಲ್ಲ. ಇಂಗ್ಲಿಷ್ ಧ್ವನಿಯಲ್ಲಿ ಕನ್ನಡವನ್ನು ತಪ್ಪಾಗಿ ಓದುವುದನ್ನು CORE ತಪ್ಪಿಸುತ್ತದೆ. ದಯವಿಟ್ಟು ಮೇಲಿನ AI ಆಡಿಯೋ ಸಮ್ಮತಿಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ ಅಥವಾ ಸಾಧನದ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಕನ್ನಡ TTS ಧ್ವನಿಯನ್ನು ಸ್ಥಾಪಿಸಿ.`
      : `ಈ ಸಾಧನ ಅಥವಾ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ (${locale}) ಧ್ವನಿ ಪ್ಯಾಕ್ ಸ್ಥಾಪಿಸಲಾಗಿಲ್ಲ. ಕನ್ನಡ ಉತ್ತರವನ್ನು ಇಂಗ್ಲಿಷ್ ಧ್ವನಿಯಲ್ಲಿ ತಪ್ಪಾಗಿ ಓದುವುದನ್ನು CORE ತಪ್ಪಿಸುತ್ತದೆ — ದಯವಿಟ್ಟು ಮೇಲಿನ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಓದಿ ಅಥವಾ ಸಾಧನದಲ್ಲಿ ಕನ್ನಡ TTS ಧ್ವನಿಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.`;
  }
  if (lang === 'te') {
    return cloudAvailableButNeedsConsent
      ? `ఈ పరికరం లేదా బ్రౌజర్‌లో తెలుగు (${locale}) వాయిస్ ప్యాక్ లేదు. తెలుగు సమాధానాన్ని ఇంగ్లీష్ వాయిస్‌లో తప్పుగా చదవకుండా CORE ఆపింది. దయచేసి పైన AI ఆడియో అనుమతి ఇవ్వండి లేదా పరికరంలో తెలుగు TTS వాయిస్‌ను ఇన్‌స్టాల్ చేయండి.`
      : `ఈ పరికరం లేదా బ్రౌజర్‌లో తెలుగు (${locale}) వాయిస్ ప్యాక్ అందుబాటులో లేదు. తెలుగు సమాధానాన్ని ఇంగ్లీష్ వాయిస్‌లో తప్పుగా చదవకుండా CORE ఆపింది — దయచేసి పైన ఉన్న తెలుగు టెక్స్ట్ చదవండి లేదా పరికరంలో తెలుగు TTS వాయిస్ ఎనేబుల్ చేయండి.`;
  }
  return cloudAvailableButNeedsConsent
    ? `No native ${locale} speech voice was detected in this browser. Accept AI guidance consent to use optional Cloud speech when available, or enable a ${locale} voice in your OS accessibility settings.`
    : `No native ${locale} speech voice was detected in this browser. Spoken audio is unavailable for this language on the current device, while full written guidance remains visible above.`;
}

function clampSpeechRate(rate?: number): number {
  if (typeof rate !== 'number' || !Number.isFinite(rate)) return 0.9;
  return Math.min(1.25, Math.max(0.75, Math.round(rate * 100) / 100));
}

class SpeechController {
  private status: SpeechStatus = 'idle';
  private activeId: string | null = null;
  private activeLang: Language | null = null;
  private activeLocale: 'en-IN' | 'kn-IN' | 'te-IN' | null = null;
  private activeVoiceName: string | null = null;
  private activeSource: 'browser' | 'cloud' | null = null;
  private activeEngineLabel: string | null = null;
  private activeText: string | null = null;
  private currentRate = 0.9;
  private lastError: SpeechErrorInfo | null = null;

  private activeSessionToken = 0;
  private activeChunks: string[] = [];
  private activeChunkIndex = 0;
  private activeCallbacks: SpeechCallbacks | undefined = undefined;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private cloudTtsAvailableCache = false;
  private cloudProvidersCache: Array<'google-cloud-tts' | 'gemini-tts'> = [];
  private globalCloudConsentGranted = false;
  private audioContext: AudioContext | null = null;

  private lastSpokenParams: {
    rawText: string;
    lang: Language;
    callbacks?: SpeechCallbacks;
    options: SpeakOptions;
  } | null = null;

  private listeners = new Set<(snap: SpeechPlaybackSnapshot) => void>();
  private voiceListeners = new Set<() => void>();
  private voicesListenerAttached = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.attachVoicesChangedListener();
      void this.refreshCloudCapabilities();
    }
  }

  public setCloudConsentGranted(granted: boolean): void {
    this.globalCloudConsentGranted = Boolean(granted);
    this.voiceListeners.forEach((cb) => cb());
  }

  public getCloudConsentGranted(): boolean {
    return this.globalCloudConsentGranted;
  }

  private attachVoicesChangedListener(): void {
    if (
      this.voicesListenerAttached ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }
    const handleVoicesChanged = () => {
      this.voiceListeners.forEach((cb) => cb());
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
    this.voicesListenerAttached = true;
  }

  public async refreshCloudCapabilities(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const health = await fetchAiHealthStatus();
      this.cloudTtsAvailableCache = health.ttsConfigured;
      this.cloudProvidersCache = health.ttsProviders ?? [];
      this.voiceListeners.forEach((cb) => cb());
      return health.ttsConfigured;
    } catch {
      return this.cloudTtsAvailableCache;
    }
  }

  private emit(): void {
    const snap = this.getPlaybackSnapshot();
    this.listeners.forEach((cb) => cb(snap));
  }

  public getPlaybackSnapshot(): SpeechPlaybackSnapshot {
    return {
      status: this.status,
      activeId: this.activeId,
      activeLang: this.activeLang,
      activeLocale: this.activeLocale,
      activeVoiceName: this.activeVoiceName,
      activeSource: this.activeSource,
      activeEngineLabel: this.activeEngineLabel,
      activeText: this.activeText,
      rate: this.currentRate,
      lastError: this.lastError,
    };
  }

  public subscribe(listener: (snap: SpeechPlaybackSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getPlaybackSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeVoices(listener: () => void): () => void {
    this.attachVoicesChangedListener();
    this.voiceListeners.add(listener);
    return () => {
      this.voiceListeners.delete(listener);
    };
  }

  public clearError(): void {
    if (this.lastError) {
      this.lastError = null;
      this.emit();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.attachVoicesChangedListener();
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  public getSpeechRecognitionConstructor(): any | null {
    if (typeof window === 'undefined') return null;
    const win = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return win.SpeechRecognition || win.webkitSpeechRecognition || null;
  }

  public getVoiceAvailability(lang: Language): {
    speechSupported: boolean;
    nativeVoiceAvailable: boolean;
    cloudTtsAvailable: boolean;
    cloudProviderLabel?: string;
    voiceName?: string;
    locale: 'en-IN' | 'kn-IN' | 'te-IN';
  } {
    const locale = getTtsLocale(lang);
    const cloudProviderLabel = getCloudProviderDisplayLabel(this.cloudProvidersCache);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        speechSupported: false,
        nativeVoiceAvailable: false,
        cloudTtsAvailable: this.cloudTtsAvailableCache,
        cloudProviderLabel,
        locale,
      };
    }
    const voices = this.getVoices();
    const match = selectVoiceForLanguage(lang, voices);

    return {
      speechSupported: true,
      nativeVoiceAvailable: Boolean(match),
      cloudTtsAvailable: this.cloudTtsAvailableCache,
      cloudProviderLabel,
      voiceName: match?.name,
      locale,
    };
  }

  public getAllLanguagesVoiceSupport(): Record<Language, LanguageVoiceSupport> {
    const sttApiAvailable = Boolean(this.getSpeechRecognitionConstructor());
    const langs: Language[] = ['en', 'kn', 'te'];
    const result = {} as Record<Language, LanguageVoiceSupport>;
    for (const lang of langs) {
      const tts = this.getVoiceAvailability(lang);
      result[lang] = {
        language: lang,
        locale: tts.locale,
        ttsApiAvailable: tts.speechSupported,
        nativeTtsVoiceAvailable: tts.nativeVoiceAvailable,
        ttsVoiceName: tts.voiceName,
        cloudTtsAvailable: tts.cloudTtsAvailable,
        cloudProviderLabel: tts.cloudProviderLabel,
        sttApiAvailable,
      };
    }
    return result;
  }

  private async waitBrieflyForAsyncVoices(maxWaitMs = 260): Promise<SpeechSynthesisVoice[]> {
    const initial = this.getVoices();
    if (initial.length > 0 || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return initial;
    }

    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        window.speechSynthesis.removeEventListener?.('voiceschanged', done);
        window.clearTimeout(timer);
        resolve(window.speechSynthesis.getVoices());
      };
      const timer = window.setTimeout(done, maxWaitMs);
      window.speechSynthesis.addEventListener?.('voiceschanged', done);
    });
  }

  public playReassuringChime(): void {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        void this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.25);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.4);

      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.09, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {
      // AudioContext blocked or unsupported
    }
  }

  public speak(
    rawText: string,
    lang: Language,
    callbacks?: SpeechCallbacks,
    rateOrOptions: number | SpeakOptions = 0.9,
    legacyItemId?: string
  ): void {
    if (typeof window === 'undefined') return;
    const cleanText = stripMarkdownForSpeech(rawText);
    if (!cleanText) return;

    const options: SpeakOptions =
      typeof rateOrOptions === 'number'
        ? { rate: rateOrOptions, itemId: legacyItemId }
        : rateOrOptions;

    const resolvedRate = clampSpeechRate(options.rate ?? this.currentRate);
    const resolvedLang = resolveSpeechLanguage(cleanText, lang);
    const locale = getTtsLocale(resolvedLang);

    // Stop any previous speech session cleanly
    this.stopInternal(false);
    this.activeSessionToken += 1;
    const token = this.activeSessionToken;

    this.currentRate = resolvedRate;
    this.lastError = null;
    this.lastSpokenParams = {
      rawText,
      lang: resolvedLang,
      callbacks,
      options: { ...options, rate: resolvedRate },
    };

    const hasSpeechSynthesis = 'speechSynthesis' in window;
    const immediateVoices = hasSpeechSynthesis ? this.getVoices() : [];

    // Fast path: if voices are loaded synchronously (or SpeechSynthesis unavailable), avoid awaiting so Safari keeps gesture context
    if (!hasSpeechSynthesis || immediateVoices.length > 0) {
      this.startWithVoices(token, cleanText, resolvedLang, locale, immediateVoices, callbacks, options);
      return;
    }

    // Async voice discovery path for Chromium initial load before voiceschanged fires
    this.status = 'loading';
    this.activeId = options.itemId ?? null;
    this.activeLang = resolvedLang;
    this.activeLocale = locale;
    this.activeText = cleanText;
    this.emit();

    void this.waitBrieflyForAsyncVoices(260).then((loadedVoices) => {
      if (token !== this.activeSessionToken) return;
      this.startWithVoices(token, cleanText, resolvedLang, locale, loadedVoices, callbacks, options);
    });
  }

  private startWithVoices(
    token: number,
    cleanText: string,
    lang: Language,
    locale: 'en-IN' | 'kn-IN' | 'te-IN',
    voices: SpeechSynthesisVoice[],
    callbacks?: SpeechCallbacks,
    options: SpeakOptions = {}
  ): void {
    if (token !== this.activeSessionToken) return;

    const matchedVoice = selectVoiceForLanguage(lang, voices);
    if (matchedVoice) {
      const chunks = splitSpeechChunks(cleanText, 190);
      if (chunks.length === 0) return;

      this.playReassuringChime();
      this.activeChunks = chunks;
      this.activeChunkIndex = 0;
      this.activeCallbacks = callbacks;
      this.currentVoice = matchedVoice;
      this.activeId = options.itemId ?? null;
      this.activeLang = lang;
      this.activeLocale = locale;
      this.activeVoiceName = matchedVoice.name;
      this.activeSource = 'browser';
      this.activeEngineLabel = `Browser Voice (${matchedVoice.name})`;
      this.activeText = cleanText;
      this.status = 'speaking';
      this.emit();

      callbacks?.onStart?.();
      this.speakChunkAt(0, token);
      return;
    }

    // No language-matched native browser voice exists!
    // STRICT RULE: NEVER fall back to an English voice for Kannada or Telugu.
    void this.handleMissingNativeVoice(token, cleanText, lang, locale, callbacks, options);
  }

  private speakChunkAt(index: number, token: number): void {
    if (token !== this.activeSessionToken) return;
    if (index >= this.activeChunks.length) {
      const cb = this.activeCallbacks;
      this.resetState(true);
      cb?.onEnd?.();
      return;
    }

    const chunk = this.activeChunks[index];
    this.activeChunkIndex = index;

    const utterance = new SpeechSynthesisUtterance(chunk);
    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
      utterance.lang = this.currentVoice.lang || this.activeLocale || 'en-IN';
    } else {
      utterance.lang = this.activeLocale || 'en-IN';
    }
    utterance.rate = this.currentRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (token !== this.activeSessionToken) return;
      this.status = 'speaking';
      this.emit();
      this.activeCallbacks?.onSentence?.(index, chunk);
    };

    utterance.onend = () => {
      if (token !== this.activeSessionToken) return;
      this.speakChunkAt(index + 1, token);
    };

    utterance.onerror = (event) => {
      if (token !== this.activeSessionToken) return;
      const reason = event?.error;
      if (reason === 'canceled' || reason === 'interrupted') {
        return;
      }

      const lang = this.activeLang || 'en';
      const locale = getTtsLocale(lang);
      const errInfo: SpeechErrorInfo = {
        code: 'voice-error',
        language: lang,
        locale,
        message: formatUnavailableVoiceMessage(lang, false),
      };
      this.lastError = errInfo;
      const cb = this.activeCallbacks;
      this.resetState(true);
      cb?.onError?.('voice-error', errInfo);
      cb?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  private async handleMissingNativeVoice(
    token: number,
    cleanText: string,
    lang: Language,
    locale: 'en-IN' | 'kn-IN' | 'te-IN',
    callbacks?: SpeechCallbacks,
    options: SpeakOptions = {}
  ): Promise<void> {
    const cloudConfigured = await this.refreshCloudCapabilities();
    if (token !== this.activeSessionToken) return;

    const hasSpeechSynthesis =
      typeof window !== 'undefined' && 'speechSynthesis' in window;
    const hasConsent = options.cloudConsentGranted ?? this.globalCloudConsentGranted;

    if (cloudConfigured && hasConsent) {
      const pendingLabel =
        getCloudProviderDisplayLabel(this.cloudProvidersCache) || 'Gemini TTS';
      this.status = 'loading';
      this.activeId = options.itemId ?? null;
      this.activeLang = lang;
      this.activeLocale = locale;
      this.activeSource = 'cloud';
      this.activeVoiceName = pendingLabel;
      this.activeEngineLabel = pendingLabel;
      this.activeText = cleanText;
      this.emit();

      try {
        const res = await synthesizeCloudSpeech({
          text: cleanText,
          language: lang,
          rate: this.currentRate,
          consentAccepted: true,
        });
        if (token !== this.activeSessionToken) return;

        const mime = res.mimeType || 'audio/wav';
        const objectUrl = base64ToBlobUrl(res.audioBase64, mime);
        const audioSrc = objectUrl || `data:${mime};base64,${res.audioBase64}`;
        if (objectUrl) {
          this.currentObjectUrl = objectUrl;
        }

        const audio = new Audio(audioSrc);
        audio.preload = 'auto';
        audio.playbackRate = this.currentRate;
        this.currentAudio = audio;
        this.activeCallbacks = callbacks;

        const engineLabel =
          res.provider === 'google-cloud-tts'
            ? `Google Cloud TTS (${res.locale})`
            : `Gemini TTS (${res.model || 'gemini-3.8-flash-lite-tts'})`;
        this.activeVoiceName = engineLabel;
        this.activeEngineLabel = engineLabel;

        audio.onloadedmetadata = () => {
          if (token !== this.activeSessionToken) return;
          audio.playbackRate = this.currentRate;
        };

        audio.onplay = () => {
          if (token !== this.activeSessionToken) return;
          audio.playbackRate = this.currentRate;
          this.status = 'speaking';
          this.emit();
          callbacks?.onStart?.();
          callbacks?.onSentence?.(0, cleanText);
        };

        audio.onended = () => {
          if (token !== this.activeSessionToken) return;
          this.resetState(true);
          callbacks?.onEnd?.();
        };

        audio.onerror = () => {
          if (token !== this.activeSessionToken) return;
          const errInfo: SpeechErrorInfo = {
            code: 'cloud-unavailable',
            language: lang,
            locale,
            message: `Audio playback failed for ${getAudioLanguageBadge(lang)}. Please tap Replay or verify browser audio output.`,
          };
          this.lastError = errInfo;
          this.resetState(true);
          callbacks?.onError?.('voice-error', errInfo);
          callbacks?.onEnd?.();
        };

        await audio.play();
        return;
      } catch (err) {
        if (token !== this.activeSessionToken) return;
        const isAutoplayBlocked =
          err instanceof DOMException && err.name === 'NotAllowedError';
        const message = isAutoplayBlocked
          ? `Your browser paused automatic playback for ${getAudioLanguageBadge(lang)}. Tap Listen or Play to start the audio.`
          : err instanceof AiClientError
          ? formatAiErrorMessage(err, lang)
          : formatUnavailableVoiceMessage(lang, false);
        const errInfo: SpeechErrorInfo = {
          code: 'cloud-unavailable',
          language: lang,
          locale,
          message,
        };
        this.lastError = errInfo;
        this.resetState(true);
        callbacks?.onError?.('voice-error', errInfo);
        callbacks?.onEnd?.();
        return;
      }
    }

    // Either Cloud TTS is not configured, OR Cloud TTS needs user consent, OR Web Speech lacks a voice for kn/te
    const needsConsent = cloudConfigured && !hasConsent;
    const errCode: SpeechErrorCode = !hasSpeechSynthesis
      ? 'unsupported'
      : needsConsent
      ? 'cloud-consent-required'
      : 'voice-unavailable';

    const errInfo: SpeechErrorInfo = {
      code: errCode,
      language: lang,
      locale,
      message: formatUnavailableVoiceMessage(lang, needsConsent),
    };

    this.lastError = errInfo;
    this.resetState(true);
    callbacks?.onError?.(hasSpeechSynthesis ? 'voice-unavailable' : 'unsupported', errInfo);
    callbacks?.onEnd?.();
  }

  public setRate(nextRate: number): void {
    const clamped = clampSpeechRate(nextRate);
    this.currentRate = clamped;
    if (this.lastSpokenParams) {
      this.lastSpokenParams.options.rate = clamped;
    }

    if (this.currentAudio) {
      this.currentAudio.playbackRate = clamped;
      this.emit();
      return;
    }

    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      (this.status === 'speaking' || this.status === 'paused') &&
      this.currentVoice &&
      this.activeChunks.length > 0
    ) {
      // Restart cleanly from the active chunk at the updated speed
      const resumeIndex = Math.min(this.activeChunkIndex, this.activeChunks.length - 1);
      const token = (this.activeSessionToken += 1);
      window.speechSynthesis.cancel();
      this.status = 'speaking';
      this.emit();
      this.speakChunkAt(resumeIndex, token);
      return;
    }

    this.emit();
  }

  public pause(): void {
    if (this.status !== 'speaking') return;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.status = 'paused';
      this.emit();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.status = 'paused';
      this.emit();
    }
  }

  public resume(): void {
    if (this.status !== 'paused') return;
    if (this.currentAudio) {
      void this.currentAudio.play();
      this.status = 'speaking';
      this.emit();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.status = 'speaking';
      this.emit();
    }
  }

  public replay(): void {
    if (this.lastSpokenParams) {
      const { rawText, lang, callbacks, options } = this.lastSpokenParams;
      this.speak(rawText, lang, callbacks, { ...options, rate: this.currentRate });
    }
  }

  public stop(): void {
    this.stopInternal(true);
  }

  private revokeCurrentObjectUrl(): void {
    if (this.currentObjectUrl) {
      try {
        URL.revokeObjectURL(this.currentObjectUrl);
      } catch {
        // ignore cleanup error
      }
      this.currentObjectUrl = null;
    }
  }

  private stopInternal(clearErrorToo: boolean): void {
    this.activeSessionToken += 1;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore audio teardown errors
      }
      this.currentAudio = null;
    }
    this.revokeCurrentObjectUrl();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (clearErrorToo) {
      this.lastError = null;
    }
    this.resetState(true);
  }

  private resetState(emitSnapshot: boolean): void {
    this.revokeCurrentObjectUrl();
    this.status = 'idle';
    this.activeId = null;
    this.activeLang = null;
    this.activeLocale = null;
    this.activeVoiceName = null;
    this.activeSource = null;
    this.activeEngineLabel = null;
    this.activeText = null;
    this.activeChunks = [];
    this.activeChunkIndex = 0;
    this.activeCallbacks = undefined;
    this.currentVoice = null;
    this.currentAudio = null;
    if (emitSnapshot) {
      this.emit();
    }
  }
}

export const speechService = new SpeechController();
