import { Language } from '../types';

export interface SpeechCallbacks {
  onStart?: () => void;
  onSentence?: (index: number, sentence: string) => void;
  onEnd?: () => void;
  onError?: (reason: 'unsupported' | 'voice-error') => void;
}

export type SpeechStatus = 'idle' | 'speaking' | 'paused';

export interface SpeechPlaybackSnapshot {
  status: SpeechStatus;
  activeId: string | null;
  activeLang: Language | null;
  activeText: string | null;
}

export interface LanguageVoiceSupport {
  language: Language;
  ttsApiAvailable: boolean;
  nativeTtsVoiceAvailable: boolean;
  ttsVoiceName?: string;
  sttApiAvailable: boolean;
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

class SpeechController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private status: SpeechStatus = 'idle';
  private activeId: string | null = null;
  private activeLang: Language | null = null;
  private activeText: string | null = null;
  private lastSpokenParams: {
    text: string;
    lang: Language;
    callbacks?: SpeechCallbacks;
    rate: number;
    itemId?: string;
  } | null = null;
  private audioContext: AudioContext | null = null;
  private sentenceInterval: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(snap: SpeechPlaybackSnapshot) => void>();

  private emit() {
    const snap = this.getPlaybackSnapshot();
    this.listeners.forEach((cb) => cb(snap));
  }

  public getPlaybackSnapshot(): SpeechPlaybackSnapshot {
    return {
      status: this.status,
      activeId: this.activeId,
      activeLang: this.activeLang,
      activeText: this.activeText,
    };
  }

  public subscribe(listener: (snap: SpeechPlaybackSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getPlaybackSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
    voiceName?: string;
  } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { speechSupported: false, nativeVoiceAvailable: false };
    }
    const voices = window.speechSynthesis.getVoices();
    const match =
      lang === 'kn'
        ? voices.find(
            (v) => v.lang.toLowerCase().startsWith('kn') || v.name.toLowerCase().includes('kannada')
          )
        : lang === 'te'
        ? voices.find(
            (v) => v.lang.toLowerCase().startsWith('te') || v.name.toLowerCase().includes('telugu')
          )
        : voices.find(
            (v) =>
              v.lang.toLowerCase() === 'en-in' ||
              (v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('india'))
          ) || voices.find((v) => v.lang.toLowerCase().startsWith('en'));

    return {
      speechSupported: true,
      nativeVoiceAvailable: Boolean(match),
      voiceName: match?.name,
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
        ttsApiAvailable: tts.speechSupported,
        nativeTtsVoiceAvailable: tts.nativeVoiceAvailable,
        ttsVoiceName: tts.voiceName,
        sttApiAvailable,
      };
    }
    return result;
  }

  // Play a soft reassuring chime before speech
  public playReassuringChime(): void {
    try {
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
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch {
      // AudioContext not allowed or unsupported
    }
  }

  public speak(
    rawText: string,
    lang: Language,
    callbacks?: SpeechCallbacks,
    rate = 0.95,
    itemId?: string
  ): void {
    if (typeof window === 'undefined') return;
    const text = stripMarkdownForSpeech(rawText);
    if (!text) return;

    this.stop();
    this.lastSpokenParams = { text: rawText, lang, callbacks, rate, itemId };
    this.playReassuringChime();

    const sentences = text
      .split(/(?<=[.!?।॥\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const hasSpeechSynthesis = 'speechSynthesis' in window;
    if (!hasSpeechSynthesis) {
      this.status = 'idle';
      this.activeId = null;
      this.activeLang = null;
      this.activeText = null;
      this.emit();
      callbacks?.onError?.('unsupported');
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'kn') {
      selectedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('kn') || v.name.toLowerCase().includes('kannada')
      );
    } else if (lang === 'te') {
      selectedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('te') || v.name.toLowerCase().includes('telugu')
      );
    } else {
      selectedVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === 'en-in' ||
            (v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('india'))
        ) || voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;

    let currentSentenceIndex = 0;
    this.status = 'speaking';
    this.activeId = itemId ?? null;
    this.activeLang = lang;
    this.activeText = text;
    this.emit();

    callbacks?.onStart?.();
    if (sentences.length > 0) {
      callbacks?.onSentence?.(0, sentences[0]);
    }

    const approxDurationPerSentence = Math.max(
      2200,
      Math.min(5000, (text.length / Math.max(1, sentences.length)) * 80)
    );
    this.sentenceInterval = setInterval(() => {
      if (this.status === 'paused') return;
      currentSentenceIndex++;
      if (currentSentenceIndex < sentences.length) {
        callbacks?.onSentence?.(currentSentenceIndex, sentences[currentSentenceIndex]);
      } else if (this.sentenceInterval) {
        clearInterval(this.sentenceInterval);
        this.sentenceInterval = null;
      }
    }, approxDurationPerSentence);

    utterance.onstart = () => {
      this.status = 'speaking';
      this.emit();
    };

    utterance.onend = () => {
      this.clearTimersAndReset();
      callbacks?.onEnd?.();
    };

    utterance.onerror = (event) => {
      const cancelled = event?.error === 'canceled' || event?.error === 'interrupted';
      this.clearTimersAndReset();
      if (!cancelled) {
        callbacks?.onError?.('voice-error');
      }
      callbacks?.onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private clearTimersAndReset(): void {
    if (this.sentenceInterval) {
      clearInterval(this.sentenceInterval);
      this.sentenceInterval = null;
    }
    this.status = 'idle';
    this.activeId = null;
    this.activeLang = null;
    this.activeText = null;
    this.currentUtterance = null;
    this.emit();
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.status === 'speaking') {
      window.speechSynthesis.pause();
      this.status = 'paused';
      this.emit();
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.status === 'paused') {
      window.speechSynthesis.resume();
      this.status = 'speaking';
      this.emit();
    }
  }

  public replay(): void {
    if (this.lastSpokenParams) {
      const { text, lang, callbacks, rate, itemId } = this.lastSpokenParams;
      this.speak(text, lang, callbacks, rate, itemId);
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.clearTimersAndReset();
  }
}

export const speechService = new SpeechController();
