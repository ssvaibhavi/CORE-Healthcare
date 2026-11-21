import React, { useState } from 'react';
import { Language } from '../types';
import { RouteStep } from '../utils/wayfinding';
import { ComprehensionCheckItem } from '../data/navigatorContent';
import { speechService, resolveSpeechLanguage } from '../utils/speech';
import {
  Check,
  CheckCircle2,
  HelpCircle,
  MessageCircleHeart,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';

export type StepDepth = 'standard' | 'simple' | 'extraSimple';

interface NavigatorStepCardProps {
  step: RouteStep;
  language: Language;
  depth: StepDepth;
  onDepthChange: (depth: StepDepth) => void;
  understood: boolean;
  onToggleUnderstood: () => void;
  onAskClarification: (step: RouteStep) => void;
}

export const NavigatorStepCard: React.FC<NavigatorStepCardProps> = ({
  step,
  language,
  depth,
  onDepthChange,
  understood,
  onToggleUnderstood,
  onAskClarification,
}) => {
  const depthText = step.instruction[language][depth];
  const landmark = step.instruction[language].landmark;

  const handleListen = () => {
    const audioLang = resolveSpeechLanguage(depthText, language);
    speechService.speak(depthText, audioLang);
  };

  const depthLabels: Array<{ id: StepDepth; label: Record<Language, string> }> = [
    { id: 'standard', label: { en: 'Standard', kn: 'ಸಾಮಾನ್ಯ', te: 'సాధారణ' } },
    { id: 'simple', label: { en: 'Simple', kn: 'ಸರಳ', te: 'సులభం' } },
    { id: 'extraSimple', label: { en: 'Extra-Simple', kn: 'ಅತಿ ಸರಳ', te: 'అతి సులభం' } },
  ];

  return (
    <article
      className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3.5 ${
        understood
          ? 'bg-[#A2B29B]/15 border-[#4A6347]/55'
          : 'bg-white border-[#BEA06D]/40'
      }`}
    >
      {/* Top Metadata Strip (Zero pill sandwiches — clean hairline typography) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
          <span className="tabular-nums">
            {language === 'kn' ? `ಹಂತ ${step.stepNumber}` : language === 'te' ? `దశ ${step.stepNumber}` : `Step ${step.stepNumber}`}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#322826] normal-case font-semibold">
            {step.from.shortLabel[language]} → {step.to.shortLabel[language]}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-medium">{step.meters} m</span>
          {step.isLiftRide && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#4A6347]">
                {language === 'kn' ? 'ಸುಲಭ ಲಿಫ್ಟ್' : language === 'te' ? 'యాక్సెసిబుల్ లిఫ్ట్' : 'Accessible Lift'}
              </span>
            </>
          )}
        </div>

        {/* Complexity Depth Selector */}
        <div
          role="group"
          aria-label="Instruction simplicity level"
          className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/35 rounded-full p-0.5"
        >
          {depthLabels.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onDepthChange(opt.id)}
              className={`compact-chip px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                depth === opt.id
                  ? 'bg-[#BEA06D] text-white'
                  : 'text-[#493C39] hover:text-[#8A6D3F]'
              }`}
            >
              {opt.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Instruction */}
      <p className="text-base sm:text-lg font-medium text-[#322826] leading-relaxed">
        {depthText}
      </p>

      <div className="text-xs text-[#8A6D3F] font-medium">
        {language === 'kn' ? 'ಗುರುತು:' : language === 'te' ? 'గుర్తు:' : 'Signpost landmark:'}{' '}
        <span className="text-[#322826] font-semibold">{landmark}</span>
      </div>

      {/* Action Buttons: Listen, Understand, Ask Companion */}
      <div className="pt-2 border-t border-[#BEA06D]/20 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleListen}
          className="compact-chip py-2 px-3.5 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/45 text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>{language === 'kn' ? 'ಆಲಿಸಿ' : language === 'te' ? 'వినండి' : 'Listen'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleUnderstood}
          aria-pressed={understood}
          className={`compact-chip py-2 px-3.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
            understood
              ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
              : 'bg-white border-[#4A6347]/45 text-[#4A6347] hover:bg-[#A2B29B]/20'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>
            {understood
              ? language === 'kn'
                ? 'ಅರ್ಥವಾಗಿದೆ'
                : language === 'te'
                ? 'అర్థమైంది'
                : 'Understood'
              : language === 'kn'
              ? 'ಅರ್ಥವಾಯಿತು ಎಂದು ಗುರುತಿಸಿ'
              : language === 'te'
              ? 'అర్థమైంది అని గుర్తించండి'
              : 'Mark as Understood'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onAskClarification(step)}
          className="compact-chip py-2 px-3.5 rounded-full bg-white hover:bg-[#E6C1C4]/25 border border-[#C88F98]/60 text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <MessageCircleHeart className="w-3.5 h-3.5 text-[#C88F98]" />
          <span>
            {language === 'kn'
              ? 'AI ಸಹಾಯಕ ಕೇಳಿ'
              : language === 'te'
              ? 'AI ని వివరణ అడగండి'
              : 'Ask Companion'}
          </span>
        </button>
      </div>
    </article>
  );
};

interface NavigatorComprehensionCardProps {
  item: ComprehensionCheckItem;
  language: Language;
}

export const NavigatorComprehensionCard: React.FC<NavigatorComprehensionCardProps> = ({
  item,
  language,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const selectedOpt = item.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="bg-[#FCF9F5] border border-[#BEA06D]/40 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
        <HelpCircle className="w-4 h-4 text-[#C88F98]" />
        <span>
          {language === 'kn'
            ? 'ಸರಳ ತಿಳುವಳಿಕೆ ಪರಿಶೀಲನೆ (ವೈದ್ಯಕೀಯವಲ್ಲ)'
            : language === 'te'
            ? 'చిన్న అవగాహన ప్రశ్న (వైద్యపరం కాదు)'
            : 'Short Navigation Check (Non-Clinical)'}
        </span>
      </div>

      <p className="text-sm sm:text-base font-bold text-[#322826] leading-snug">
        {item.question[language]}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {item.options.map((opt) => {
          const isPicked = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedOptionId(opt.id)}
              className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isPicked
                  ? opt.isCorrect
                    ? 'bg-[#A2B29B]/25 border-[#4A6347] text-[#322826]'
                    : 'bg-[#E6C1C4]/30 border-[#C88F98] text-[#322826]'
                  : 'bg-white border-[#BEA06D]/35 hover:border-[#BEA06D] text-[#322826]'
              }`}
            >
              <span>{opt.label[language]}</span>
              {isPicked &&
                (opt.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#C88F98] shrink-0" />
                ))}
            </button>
          );
        })}
      </div>

      {selectedOpt && (
        <div
          className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-2 soft-fade-up ${
            selectedOpt.isCorrect
              ? 'bg-[#A2B29B]/20 text-[#322826]'
              : 'bg-white border border-[#C88F98]/50 text-[#322826]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8A6D3F] shrink-0 mt-0.5" />
          <span>{item.explanation[language]}</span>
        </div>
      )}
    </div>
  );
};
