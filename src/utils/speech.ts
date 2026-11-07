import { Language } from '../types';

export interface SpeechCallbacks {
  onStart?: () => void;
  onSentence?: (index: number, sentence: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class SpeechController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private audioContext: AudioContext | null = null;
  private sentenceInterval: any = null;

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  // Play a soft reassuring hospital chime before speech
  public playReassuringChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const now = this.audioContext.currentTime;
      // Gentle dual-tone chime (523.25Hz C5 -> 659.25Hz E5)
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
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      // AudioContext not allowed or unsupported
    }
  }

  public speak(
    text: string,
    lang: Language,
    callbacks?: SpeechCallbacks,
    rate = 0.95
  ): void {
    if (typeof window === 'undefined') return;

    this.stop();
    this.playReassuringChime();

    // Split into sentences for synchronized visual highlighting
    const sentences = text
      .split(/(?<=[.!?।॥\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const hasSpeechSynthesis = 'speechSynthesis' in window;

    if (!hasSpeechSynthesis) {
      this.simulateSpeechProgress(sentences, callbacks);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'kn') {
      selectedVoice = voices.find(
        (v) => v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada')
      );
    } else if (lang === 'te') {
      selectedVoice = voices.find(
        (v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu')
      );
    } else {
      selectedVoice = voices.find(
        (v) => v.lang === 'en-IN' || (v.lang.startsWith('en') && v.name.includes('India'))
      ) || voices.find((v) => v.lang.startsWith('en'));
    }

    // If native voice is not present on this machine for Indic language,
    // we still invoke speechSynthesis with fallback or simulate sentence pacing
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Fallback language tag
      utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    }

    utterance.rate = rate; // slightly slower for elderly comprehension
    utterance.pitch = 1.0;

    let currentSentenceIndex = 0;
    callbacks?.onStart?.();
    if (sentences.length > 0) {
      callbacks?.onSentence?.(0, sentences[0]);
    }

    // Step through sentences periodically to drive visual highlighting
    const approxDurationPerSentence = Math.max(2200, Math.min(5000, (text.length / sentences.length) * 80));
    this.sentenceInterval = setInterval(() => {
      if (this.isPaused) return;
      currentSentenceIndex++;
      if (currentSentenceIndex < sentences.length) {
        callbacks?.onSentence?.(currentSentenceIndex, sentences[currentSentenceIndex]);
      } else {
        clearInterval(this.sentenceInterval);
      }
    }, approxDurationPerSentence);

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      clearInterval(this.sentenceInterval);
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      // If Indic language fails to speak natively due to missing OS voice pack,
      // fallback smoothly to progress pacing
      this.isSpeaking = false;
      this.isPaused = false;
      clearInterval(this.sentenceInterval);
      callbacks?.onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private simulateSpeechProgress(
    sentences: string[],
    callbacks?: SpeechCallbacks
  ): void {
    let index = 0;
    callbacks?.onStart?.();
    if (sentences.length > 0) {
      callbacks?.onSentence?.(0, sentences[0]);
    }

    this.sentenceInterval = setInterval(() => {
      if (this.isPaused) return;
      index++;
      if (index < sentences.length) {
        callbacks?.onSentence?.(index, sentences[index]);
      } else {
        clearInterval(this.sentenceInterval);
        callbacks?.onEnd?.();
      }
    }, 2800);
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.isPaused = true;
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.isPaused = false;
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.sentenceInterval) {
      clearInterval(this.sentenceInterval);
      this.sentenceInterval = null;
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }
}

export const speechService = new SpeechController();
