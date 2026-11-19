import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Info, AlertCircle, Loader2 } from 'lucide-react';
import { Language } from '../types';
import {
  getAudioLanguageBadge,
  speechService,
  SpeechPlaybackSnapshot,
  SpeechRate,
} from '../utils/speech';

interface AudioPlayerProps {
  textToSpeak: string;
  language: Language;
  title?: string;
  cloudConsentGranted?: boolean;
  onFinished?: () => void;
}

const PLAYER_ID = 'hear-appointment-player';
const SPEED_OPTIONS: Array<{ rate: SpeechRate; label: Record<Language, string> }> = [
  { rate: 0.75, label: { en: '0.75x', kn: '0.75x', te: '0.75x' } },
  { rate: 0.9, label: { en: '0.9x', kn: '0.9x', te: '0.9x' } },
  { rate: 1.0, label: { en: '1.0x', kn: '1.0x', te: '1.0x' } },
];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToSpeak,
  language,
  cloudConsentGranted = false,
  onFinished,
}) => {
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<SpeechRate>(0.9);
  const [voiceInfo, setVoiceInfo] = useState(() => speechService.getVoiceAvailability(language));
  const [playback, setPlayback] = useState<SpeechPlaybackSnapshot>(() =>
    speechService.getPlaybackSnapshot()
  );

  useEffect(() => {
    const refreshVoiceInfo = () => {
      setVoiceInfo(speechService.getVoiceAvailability(language));
    };
    refreshVoiceInfo();
    const unsubVoices = speechService.subscribeVoices(refreshVoiceInfo);
    const unsubPlayback = speechService.subscribe((snap) => {
      setPlayback(snap);
      if (snap.activeId !== PLAYER_ID && snap.status === 'idle') {
        setCurrentSentence('');
      }
    });

    return () => {
      unsubVoices();
      unsubPlayback();
      speechService.stop();
    };
  }, [language]);

  const isThisActive = playback.activeId === PLAYER_ID && playback.status !== 'idle';
  const isPlaying = isThisActive && playback.status === 'speaking';
  const isPaused = isThisActive && playback.status === 'paused';
  const isLoading = isThisActive && playback.status === 'loading';

  const handlePlay = () => {
    if (isPaused) {
      speechService.resume();
      return;
    }

    speechService.speak(
      textToSpeak,
      language,
      {
        onSentence: (_idx, sentence) => {
          setCurrentSentence(sentence);
        },
        onEnd: () => {
          setCurrentSentence('');
          onFinished?.();
        },
      },
      {
        rate: speechRate,
        itemId: PLAYER_ID,
        cloudConsentGranted,
      }
    );
  };

  const handlePause = () => {
    speechService.pause();
  };

  const handleReplay = () => {
    speechService.stop();
    setCurrentSentence('');
    speechService.speak(
      textToSpeak,
      language,
      {
        onSentence: (_idx, sentence) => {
          setCurrentSentence(sentence);
        },
        onEnd: () => {
          setCurrentSentence('');
          onFinished?.();
        },
      },
      {
        rate: speechRate,
        itemId: PLAYER_ID,
        cloudConsentGranted,
      }
    );
  };

  const handleStop = () => {
    speechService.stop();
    setCurrentSentence('');
  };

  const handleRateSelect = (nextRate: SpeechRate) => {
    setSpeechRate(nextRate);
    speechService.setRate(nextRate);
  };

  const activeError =
    playback.lastError && playback.lastError.language === language ? playback.lastError : null;

  return (
    <div className="bg-gradient-to-r from-[#FCF9F5] via-[#FFFFFF] to-[#FCF9F5] border-2 border-[#BEA06D]/60 rounded-3xl p-5 sm:p-7 shadow-md transition-all">
      {/* Top Language & Voice Indicator Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#BEA06D]/20 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#8F7242] uppercase tracking-wider">
            {language === 'kn' ? 'ಆಡಿಯೋ ಭಾಷೆ:' : language === 'te' ? 'ఆడియో భాష:' : 'Audio Language:'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 font-semibold text-[#3C3330]">
            {getAudioLanguageBadge(language)}
          </span>
          {voiceInfo.nativeVoiceAvailable && voiceInfo.voiceName && (
            <span className="text-[11px] font-medium text-[#4A6347]">
              · {voiceInfo.voiceName}
            </span>
          )}
          {!voiceInfo.nativeVoiceAvailable && voiceInfo.cloudTtsAvailable && (
            <span className="text-[11px] font-medium text-[#4A6347]">
              · {cloudConsentGranted ? 'Cloud Speech Ready' : 'Cloud Speech Available'}
            </span>
          )}
        </div>

        {/* Speed Selector Pills (0.75x / 0.9x / 1.0x) */}
        <div
          className="inline-flex items-center gap-1 bg-[#FCF9F5] border border-[#BEA06D]/35 rounded-full p-1"
          role="group"
          aria-label="Playback speed"
        >
          <span className="text-[11px] font-semibold text-[#8F7242] pl-2 pr-1">
            {language === 'kn' ? 'ವೇಗ' : language === 'te' ? 'వేగం' : 'Speed'}
          </span>
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.rate}
              type="button"
              onClick={() => handleRateSelect(opt.rate)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                speechRate === opt.rate
                  ? 'bg-[#BEA06D] text-white'
                  : 'text-[#3C3330] hover:bg-[#BEA06D]/15'
              }`}
            >
              {opt.label[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Left: Primary Play / Pause / Resume + Secondary Replay & Stop */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {isLoading ? (
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-[#BEA06D]/80 text-white font-semibold text-lg sm:text-xl py-4 px-8 rounded-full shadow-md"
            >
              <Loader2 className="w-6 h-6 animate-spin shrink-0" />
              <span>
                {language === 'kn'
                  ? 'ಧ್ವನಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...'
                  : language === 'te'
                  ? 'వాయిస్ సిద్ధమవుతోంది...'
                  : 'Preparing Audio...'}
              </span>
            </button>
          ) : !isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-semibold text-lg sm:text-xl py-4 px-8 rounded-full shadow-lg shadow-[#BEA06D]/30 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
              aria-label={isPaused ? 'Resume spoken audio' : 'Listen to appointment details'}
            >
              {isPaused ? (
                <Play className="w-6 h-6 shrink-0" />
              ) : (
                <Volume2 className="w-7 h-7 shrink-0" />
              )}
              <span>
                {isPaused
                  ? language === 'kn'
                    ? 'ಮುಂದುವರಿಸಿ'
                    : language === 'te'
                    ? 'కొనసాగించండి'
                    : 'Resume Audio'
                  : language === 'kn'
                  ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ'
                  : language === 'te'
                  ? 'అపాయింట్‌మెంట్ వినండి'
                  : 'Listen to Appointment'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-[#C98897] hover:bg-[#a86574] active:scale-95 text-white font-semibold text-lg sm:text-xl py-4 px-8 rounded-full shadow-lg shadow-[#C98897]/30 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#C98897]/40"
              aria-label="Pause spoken audio"
            >
              <Pause className="w-7 h-7 shrink-0" />
              <span>
                {language === 'kn' ? 'ವಿರಾಮಗೊಳಿಸಿ' : language === 'te' ? 'ఆపండి' : 'Pause Audio'}
              </span>
            </button>
          )}

          {/* Secondary control buttons: Replay & Stop */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplay}
              title="Replay audio from start"
              className="p-3.5 bg-white border border-[#BEA06D]/40 rounded-full text-[#3C3330] hover:text-[#8F7242] hover:bg-[#BEA06D]/10 active:scale-95 transition-all shadow-sm focus:outline-none cursor-pointer"
              aria-label="Replay audio from start"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isThisActive && (
              <button
                type="button"
                onClick={handleStop}
                title="Stop audio"
                className="inline-flex items-center gap-1.5 px-4 py-3 bg-white border border-red-200 rounded-full text-red-700 hover:bg-red-50 active:scale-95 transition-all shadow-sm text-xs font-bold focus:outline-none cursor-pointer"
                aria-label="Stop audio"
              >
                <VolumeX className="w-4 h-4" />
                <span>{language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : language === 'te' ? 'ఆపివేయండి' : 'Stop'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Active Audio Waveform Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {isPlaying && (
            <div className="flex items-center gap-1.5 h-8 px-3.5 bg-[#A2B29B]/20 rounded-full border border-[#A2B29B]/40">
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-2" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-5" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-7" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-4" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-2" />
              <span className="text-xs font-semibold text-[#4A6347] ml-2">
                {language === 'kn'
                  ? 'ಕನ್ನಡ ಧ್ವನಿ ಚಾಲನೆಯಲ್ಲಿದೆ'
                  : language === 'te'
                  ? 'తెలుగు వాయిస్ ప్లే అవుతోంది'
                  : 'Voice Playing'}
              </span>
            </div>
          )}
          {isPaused && (
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/40 text-[#8F7242]">
              {language === 'kn' ? 'ವಿರಾಮದಲ್ಲಿದೆ' : language === 'te' ? 'నిలిపివేయబడింది' : 'Paused'}
            </span>
          )}
        </div>
      </div>

      {/* Visual Readout Box when speaking */}
      {currentSentence && (
        <div className="mt-5 p-4 bg-[#BEA06D]/10 border border-[#BEA06D]/30 rounded-2xl animate-in fade-in-50">
          <div className="flex items-start gap-2.5">
            <Volume2 className="w-5 h-5 text-[#8F7242] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-[#8F7242] block uppercase tracking-wider mb-1">
                {language === 'kn'
                  ? 'ಈಗ ಓದಲಾಗುತ್ತಿರುವ ವಾಕ್ಯ'
                  : language === 'te'
                  ? 'ప్రస్తుతం చదువుతున్న వాక్యం'
                  : 'Currently Speaking'}
                :
              </span>
              <p className="text-base sm:text-lg font-medium text-[#3C3330] leading-snug">
                &ldquo;{currentSentence}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Error Notice if user clicked Listen when requested language voice is missing */}
      {activeError && (
        <div className="mt-4 p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#C98897] text-xs sm:text-sm text-[#3C3330] flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#C98897] shrink-0 mt-0.5" />
            <span>{activeError.message}</span>
          </div>
          <button
            type="button"
            onClick={() => speechService.clearError()}
            className="text-xs font-semibold text-[#8F7242] underline shrink-0 cursor-pointer"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ' : language === 'te' ? 'మూసివేయండి' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Proactive Transparent Voice Support Notice */}
      {!activeError && (!voiceInfo.speechSupported || !voiceInfo.nativeVoiceAvailable) && !voiceInfo.cloudTtsAvailable && (
        <div className="mt-4 p-3 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs text-[#493C39]/85 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#8A6D3F] shrink-0 mt-0.5" />
          <span>
            {!voiceInfo.speechSupported
              ? language === 'kn'
                ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಓದುಗ (Speech Synthesis) ಲಭ್ಯವಿಲ್ಲ; ಪೂರ್ಣ ಲಿಖಿತ ವಿವರಗಳು ಕೆಳಗೆ ಲಭ್ಯವಿವೆ.'
                : language === 'te'
                ? 'ఈ బ్రౌజర్‌లో వాయిస్ రీడర్ అందుబాటులో లేదు; పూర్తి వివరాలు క్రింద చూడవచ్చు.'
                : 'Browser speech synthesis is unavailable on this device; full written instructions remain below.'
              : language === 'kn'
              ? 'ಈ ಸಾಧನದಲ್ಲಿ ಕನ್ನಡ (kn-IN) OS ಧ್ವನಿ ಪ್ಯಾಕ್ ಪತ್ತೆಯಾಗಿಲ್ಲ. ಕನ್ನಡವನ್ನು ಇಂಗ್ಲಿಷ್ ಧ್ವನಿಯಲ್ಲಿ ತಪ್ಪಾಗಿ ಓದುವುದನ್ನು CORE ತಪ್ಪಿಸುತ್ತದೆ.'
              : language === 'te'
              ? 'ఈ పరికరంలో తెలుగు (te-IN) OS వాయిస్ ప్యాక్ కనుగొనబడలేదు. తెలుగును ఇంగ్లీష్ వాయిస్‌లో తప్పుగా చదవకుండా CORE ఆపుతుంది.'
              : 'No native English (en-IN) OS voice pack was detected in this browser.'}
          </span>
        </div>
      )}
    </div>
  );
};
