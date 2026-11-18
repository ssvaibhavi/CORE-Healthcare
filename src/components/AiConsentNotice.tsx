import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Sparkles, Check } from 'lucide-react';

interface AiConsentNoticeProps {
  language: Language;
  consentGranted: boolean;
  onAcceptConsent: () => void;
  compact?: boolean;
}

export const AiConsentNotice: React.FC<AiConsentNoticeProps> = ({
  language,
  consentGranted,
  onAcceptConsent,
  compact = false,
}) => {
  if (consentGranted) {
    return (
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#A2B29B]/18 border border-[#A2B29B]/55 text-[11px] text-[#4A6347]">
        <span className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>
            {language === 'kn'
              ? 'AI ಬಳಕೆಗೆ ಸಮ್ಮತಿ ನೀಡಲಾಗಿದೆ · ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಂಖ್ಯೆ ನಮೂದಿಸಬೇಡಿ'
              : language === 'te'
              ? 'AI సహాయానికి అనుమతి ఉంది · వ్యక్తిగత వైద్య IDలు ఇవ్వవద్దు'
              : 'AI guidance enabled for this session · Please avoid entering private IDs or health reports'}
          </span>
        </span>
        <span className="font-semibold uppercase tracking-wider text-[10px] shrink-0">
          Gemini AI
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/55 ${
        compact ? 'p-3.5 space-y-2.5' : 'p-5 space-y-3'
      } soft-fade-up`}
    >
      <div className="flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#493C39] block">
            {language === 'kn'
              ? 'AI ಸಹಾಯಕ ಸಮ್ಮತಿ ಮತ್ತು ಗೌಪ್ಯತೆ ಸೂಚನೆ'
              : language === 'te'
              ? 'AI సహాయం కోసం అనుమతి మరియు గోప్యతా సూచన'
              : 'Permission Required Before Sending Text to Gemini AI'}
          </span>
          <p className="text-[11px] sm:text-xs text-[#493C39]/80 leading-relaxed">
            {language === 'kn'
              ? 'ನೀವು ಟೈಪ್ ಮಾಡುವ ಪಠ್ಯವನ್ನು ಮಾತ್ರ CORE ಸರ್ವರ್ ಮೂಲಕ Google Gemini ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ಫೋನ್ ಸಂಖ್ಯೆ, ಆಧಾರ್ ಅಥವಾ ವೈಯಕ್ತಿಕ ರೋಗಿ ವರದಿಗಳನ್ನು ನಮೂದಿಸಬೇಡಿ. AI ವೈದ್ಯರಲ್ಲ.'
              : language === 'te'
              ? 'మీరు టైప్ చేసిన ప్రశ్న మాత్రమే CORE సర్వర్ ద్వారా Google Gemini కి పంపబడుతుంది. దయచేసి ఫోన్ నంబర్లు లేదా వ్యక్తిగత రికార్డులు ఇవ్వకండి. AI డాక్టర్ కాదు.'
              : 'Only the non-personal question or instruction you enter is sent securely via CORE’s server to Google Gemini. Please do not include phone numbers, hospital IDs, or private records. Conversations are not saved, and AI is not a medical professional.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAcceptConsent}
        className="w-full sm:w-auto py-2 px-4 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Check className="w-3.5 h-3.5" />
        <span>
          {language === 'kn'
            ? 'ನಾನು ಒಪ್ಪುತ್ತೇನೆ — AI ಸಹಾಯ ಬಳಸಿ'
            : language === 'te'
            ? 'నేను అంగీకరిస్తున్నాను — AI సహాయం వాడండి'
            : 'I Understand — Enable AI Assistance'}
        </span>
      </button>
    </div>
  );
};
