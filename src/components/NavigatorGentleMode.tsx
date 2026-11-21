import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { ComputedRoute } from '../utils/wayfinding';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  HeartHandshake,
  MessageCircleHeart,
  RotateCcw,
  Volume2,
  X,
} from 'lucide-react';

interface NavigatorGentleModeProps {
  language: Language;
  route: ComputedRoute;
  onExitGentleMode: () => void;
  onAskCompanion: (prompt: string) => void;
  onFinishJourney: () => void;
}

export const NavigatorGentleMode: React.FC<NavigatorGentleModeProps> = ({
  language,
  route,
  onExitGentleMode,
  onAskCompanion,
  onFinishJourney,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const steps = route.steps;
  const totalSteps = steps.length;

  useEffect(() => {
    setStepIdx(0);
  }, [route.start.id, route.destination.id, route.accessibleOnly]);

  const activeStep = steps[stepIdx];
  const currentInstruction = activeStep
    ? activeStep.instruction[language].extraSimple
    : language === 'kn'
    ? `ನೀವು ಈಗಾಗಲೇ ${route.destination.name.kn} ನಲ್ಲಿಯೇ ಇದ್ದೀರಿ.`
    : language === 'te'
    ? `మీరు ఇప్పటికే ${route.destination.name.te} వద్ద ఉన్నారు.`
    : `You are already at ${route.destination.name.en}.`;

  useEffect(() => {
    if (!autoSpeak) return;
    const audioLang = resolveSpeechLanguage(currentInstruction, language);
    speechService.speak(currentInstruction, audioLang);
  }, [stepIdx, autoSpeak, currentInstruction, language]);

  const handleRepeatAudio = () => {
    const audioLang = resolveSpeechLanguage(currentInstruction, language);
    speechService.speak(currentInstruction, audioLang);
  };

  const progressPct =
    totalSteps <= 1 ? 100 : Math.round(((stepIdx + 1) / totalSteps) * 100);

  return (
    <section
      aria-label="Gentle Guidance Mode"
      className="bg-white border-2 border-[#4A6347]/55 rounded-3xl p-5 sm:p-8 shadow-lg space-y-6 max-w-3xl mx-auto soft-fade-up"
    >
      {/* Top Reassurance Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BEA06D]/25 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#A2B29B]/20 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-[#4A6347]" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A6347] block">
              {language === 'kn'
                ? 'ಶಾಂತ ಮಾರ್ಗದರ್ಶನ ಮೋಡ್ (Gentle Guidance)'
                : language === 'te'
                ? 'నెమ్మది మార్గదర్శన మోడ్ (Gentle Guidance)'
                : 'Gentle Guidance Mode · Opt-In Focus View'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
              {route.start.shortLabel[language]} → {route.destination.shortLabel[language]}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitGentleMode}
          className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/50 text-sm font-bold text-[#493C39] hover:border-[#C88F98] inline-flex items-center gap-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>
            {language === 'kn'
              ? 'ಸಾಮಾನ್ಯ ವೀಕ್ಷಣೆಗೆ ಹಿಂತಿರುಗಿ'
              : language === 'te'
              ? 'సాధారణ వీక్షణకు వెళ్ళండి'
              : 'Exit Gentle Mode'}
          </span>
        </button>
      </div>

      {/* Clear Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold text-[#493C39] tabular-nums">
          <span>
            {totalSteps === 0
              ? language === 'kn'
                ? 'ಹಂತ 1 / 1'
                : language === 'te'
                ? 'దశ 1 / 1'
                : 'Step 1 of 1'
              : language === 'kn'
              ? `ಹಂತ ${stepIdx + 1} / ${totalSteps}`
              : language === 'te'
              ? `దశ ${stepIdx + 1} / ${totalSteps}`
              : `Step ${stepIdx + 1} of ${totalSteps}`}
          </span>
          <span className="text-[#4A6347]">{progressPct}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 overflow-hidden">
          <div
            className="h-full bg-[#4A6347] transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Single Focused Instruction Card */}
      <div className="bg-[#FCF9F5] border-2 border-[#BEA06D]/50 rounded-3xl p-6 sm:p-8 space-y-5">
        {activeStep && (
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#8A6D3F]">
            <span>{activeStep.from.name[language]}</span>
            <span>→</span>
            <span className="text-[#4A6347]">{activeStep.to.name[language]}</span>
          </div>
        )}

        <p className="font-display text-2xl sm:text-4xl font-bold text-[#322826] leading-snug">
          {currentInstruction}
        </p>

        {activeStep && (
          <p className="text-base sm:text-lg text-[#493C39]/85 leading-relaxed">
            {activeStep.instruction[language].simple}
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#493C39] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-5 h-5 accent-[#4A6347] cursor-pointer"
            />
            <span>
              {language === 'kn'
                ? 'ಪ್ರತಿ ಹಂತವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದಿ'
                : language === 'te'
                ? 'ప్రతి దశను స్వయంగా చదివి వినిపించండి'
                : 'Read each step aloud automatically'}
            </span>
          </label>

          <span className="text-xs text-[#8A6D3F] font-semibold inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {language === 'kn'
              ? 'ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ನಕ್ಷೆ'
              : language === 'te'
              ? 'నమూనా ప్రదర్శన మార్గం'
              : 'Fictional demo guidance'}
          </span>
        </div>
      </div>

      {/* Large High-Contrast Accessible Action Buttons (>=56px min height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={handleRepeatAudio}
          className="min-h-[58px] px-6 py-3.5 rounded-2xl bg-[#BEA06D] hover:bg-[#8A6D3F] text-white font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
        >
          <Volume2 className="w-6 h-6 shrink-0" />
          <span>
            {language === 'kn'
              ? 'ಮತ್ತೆ ಆಲಿಸಿ (Repeat Audio)'
              : language === 'te'
              ? 'మళ్ళీ వినండి (Repeat Audio)'
              : 'Repeat Instruction Audio'}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            onAskCompanion(
              language === 'kn'
                ? `ನಾನು ಈಗ "${currentInstruction}" ಹಂತದಲ್ಲಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸರಳವಾಗಿ ವಿವರಿಸಿ.`
                : language === 'te'
                ? `నేను ప్రస్తుతం "${currentInstruction}" దశలో ఉన్నాను. దయచేసి సులభంగా వివరించండి.`
                : `I am currently on this step: "${currentInstruction}". Please explain simply what to look for next.`
            )
          }
          className="min-h-[58px] px-6 py-3.5 rounded-2xl bg-white border-2 border-[#C88F98] hover:bg-[#E6C1C4]/20 text-[#322826] font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <MessageCircleHeart className="w-6 h-6 text-[#C88F98] shrink-0" />
          <span>
            {language === 'kn'
              ? 'AI ಸಹಾಯಕ ಕೇಳಿ'
              : language === 'te'
              ? 'AI ని అడగండి'
              : 'Ask Companion Help'}
          </span>
        </button>
      </div>

      {/* Large Back / Next Step Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#BEA06D]/25">
        <button
          type="button"
          disabled={stepIdx === 0}
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          className="min-h-[56px] px-6 py-3 rounded-2xl border-2 border-[#BEA06D]/50 bg-white disabled:opacity-40 text-[#322826] font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'kn' ? 'ಹಿಂದಿನ ಹಂತ' : language === 'te' ? 'వెనుక దశ' : 'Back'}</span>
        </button>

        {stepIdx < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStepIdx((i) => Math.min(totalSteps - 1, i + 1))}
            className="min-h-[56px] px-8 py-3 rounded-2xl bg-[#4A6347] hover:bg-[#384d36] text-white font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>{language === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : language === 'te' ? 'తదుపరి దశ' : 'Next Step'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => setStepIdx(0)}
              className="min-h-[56px] px-5 py-3 rounded-2xl border border-[#BEA06D]/50 bg-[#FCF9F5] text-[#493C39] font-bold text-base inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{language === 'kn' ? 'ಮೊದಲಿನಿಂದ' : language === 'te' ? 'మొదటి నుండి' : 'Restart'}</span>
            </button>
            <button
              type="button"
              onClick={onFinishJourney}
              className="min-h-[56px] px-7 py-3 rounded-2xl bg-[#4A6347] hover:bg-[#384d36] text-white font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {language === 'kn'
                  ? 'ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ'
                  : language === 'te'
                  ? 'నావిగేషన్ కార్డు చూడండి'
                  : 'Open Navigation Card'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
