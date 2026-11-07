import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { speechService } from '../utils/speech';

interface AudioPlayerProps {
  textToSpeak: string;
  language: Language;
  title?: string;
  onFinished?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToSpeak,
  language,
  title,
  onFinished,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(
      textToSpeak,
      language,
      {
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onSentence: (_idx, sentence) => {
          setCurrentSentence(sentence);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSentence('');
          onFinished?.();
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
      },
      speechRate
    );
  };

  const handlePause = () => {
    speechService.pause();
    setIsPaused(true);
  };

  const handleReplay = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setTimeout(() => {
      handlePlay();
    }, 100);
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentence('');
  };

  const toggleRate = () => {
    const nextRate = speechRate === 0.9 ? 1.0 : speechRate === 1.0 ? 0.75 : 0.9;
    setSpeechRate(nextRate);
    if (isPlaying) {
      handleReplay();
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#FCF9F5] via-[#FFFFFF] to-[#FCF9F5] border-2 border-[#BEA06D]/60 rounded-3xl p-5 sm:p-7 shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Left: Big primary action button */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {!isPlaying || isPaused ? (
            <button
              onClick={handlePlay}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-semibold text-lg sm:text-xl py-4 px-8 rounded-full shadow-lg shadow-[#BEA06D]/30 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
              aria-label="Listen to appointment details"
            >
              <Volume2 className="w-7 h-7 shrink-0 animate-pulse" />
              <span>
                {language === 'kn'
                  ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ'
                  : language === 'te'
                  ? 'అపాయింట్‌మెంట్ వినండి'
                  : 'Listen to Appointment'}
              </span>
            </button>
          ) : (
            <button
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

          {/* Secondary control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              title="ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ / Replay"
              className="p-3.5 bg-white border border-[#BEA06D]/40 rounded-full text-[#3C3330] hover:text-[#8F7242] hover:bg-[#BEA06D]/10 active:scale-95 transition-all shadow-sm focus:outline-none"
              aria-label="Replay audio from start"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                title="ನಿಲ್ಲಿಸಿ / Stop"
                className="p-3.5 bg-white border border-[#BEA06D]/40 rounded-full text-[#3C3330] hover:text-red-700 hover:bg-red-50 active:scale-95 transition-all shadow-sm focus:outline-none"
                aria-label="Stop audio"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Audio Waveform & Speech Speed */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {isPlaying && !isPaused && (
            <div className="flex items-center gap-1.5 h-8 px-3 bg-[#A2B29B]/20 rounded-full border border-[#A2B29B]/40">
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-2" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-5" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-7" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-4" />
              <span className="w-1.5 bg-[#4A6347] rounded-full wave-bar h-2" />
              <span className="text-xs font-semibold text-[#4A6347] ml-2">
                {language === 'kn' ? 'ಧ್ವನಿ ಪ್ರಸಾರವಾಗುತ್ತಿದೆ' : language === 'te' ? 'ధ్వని వినిపిస్తోంది' : 'Voice Playing'}
              </span>
            </div>
          )}

          {/* Speech Pace Toggle (Elderly Friendly) */}
          <button
            onClick={toggleRate}
            className="text-xs font-medium px-3.5 py-2 bg-white border border-[#BEA06D]/40 rounded-full text-[#3C3330] hover:border-[#BEA06D] transition-colors"
          >
            {language === 'kn' ? 'ವೇಗ' : language === 'te' ? 'వేగం' : 'Speed'}:{' '}
            <span className="font-bold text-[#8F7242]">
              {speechRate === 0.75 ? '0.75x (Slow)' : speechRate === 0.9 ? '0.9x (Comfortable)' : '1.0x (Normal)'}
            </span>
          </button>
        </div>
      </div>

      {/* Visual Readout Box when speaking */}
      {currentSentence && (
        <div className="mt-5 p-4 bg-[#BEA06D]/10 border border-[#BEA06D]/30 rounded-2xl animate-in fade-in-50">
          <div className="flex items-start gap-2.5">
            <Volume2 className="w-5 h-5 text-[#8F7242] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-[#8F7242] block uppercase tracking-wider mb-1">
                {language === 'kn' ? 'ಈಗ ಓದಲಾಗುತ್ತಿರುವ ವಾಕ್ಯ' : language === 'te' ? 'ప్రస్తుతం చదువుతున్న వాక్యం' : 'Currently Speaking'}:
              </span>
              <p className="text-base sm:text-lg font-medium text-[#3C3330] leading-snug">
                "{currentSentence}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
