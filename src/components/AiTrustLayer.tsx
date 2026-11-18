import React from 'react';
import { Language } from '../types';
import { Sparkles, ShieldAlert, AlertTriangle, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface AiTrustHeaderProps {
  language: Language;
  label?: string;
  onAskClarification?: () => void;
  onListen?: () => void;
  isSpeaking?: boolean;
  clarifyDisabled?: boolean;
}

export const AiTrustHeader: React.FC<AiTrustHeaderProps> = ({
  language,
  label,
  onAskClarification,
  onListen,
  isSpeaking = false,
  clarifyDisabled = false,
}) => {
  const defaultLabel =
    language === 'kn'
      ? 'AI-ರಚಿತ ವಿವರಣೆ · ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ'
      : language === 'te'
      ? 'AI-రూపొందించిన వివరణ · సిబ్బందితో ధృవీకరించండి'
      : 'AI-Generated Explanation · Verify With Staff';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#BEA06D]/25 pb-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#4A6347] uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-[#C88F98] shrink-0" />
        <span>{label || defaultLabel}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onAskClarification && (
          <button
            type="button"
            disabled={clarifyDisabled}
            onClick={onAskClarification}
            className="compact-chip py-1 px-3 rounded-full bg-white border border-[#C88F98]/60 hover:bg-[#E6C1C4]/20 disabled:opacity-50 text-[#493C39] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C88F98]" />
            <span>
              {language === 'kn'
                ? 'ಇನ್ನಷ್ಟು ಸರಳವಾಗಿ ಕೇಳಿ'
                : language === 'te'
                ? 'మరింత స్పష్టత అడగండి'
                : 'Request Clarification'}
            </span>
          </button>
        )}

        {onListen && (
          <button
            type="button"
            onClick={onListen}
            className="compact-chip py-1 px-3.5 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>
              {isSpeaking
                ? language === 'kn'
                  ? 'ನಿಲ್ಲಿಸಿ'
                  : language === 'te'
                  ? 'ఆపండి'
                  : 'Stop'
                : language === 'kn'
                ? 'ಆಲಿಸಿ'
                : language === 'te'
                ? 'వినండి'
                : 'Listen'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

interface AiTrustFooterProps {
  language: Language;
  uncertaintyNote?: string;
  verificationDisclaimer?: string;
}

export const AiTrustFooter: React.FC<AiTrustFooterProps> = ({
  language,
  uncertaintyNote,
  verificationDisclaimer,
}) => {
  const defaultVerify =
    language === 'kn'
      ? 'ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಸೂಚನೆಗಳು, ಸಮಯ ಮತ್ತು ಔಷಧಿ ವಿವರಗಳನ್ನು ದಯವಿಟ್ಟು ಅರ್ಹ ಆರೋಗ್ಯ ಸಿಬ್ಬಂದಿ ಅಥವಾ ವೈದ್ಯರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
      : language === 'te'
      ? 'ముఖ్యమైన వైద్య సూచనలు, సమయం మరియు మందుల వివరాలను దయచేసి ఆసుపత్రి సిబ్బంది లేదా డాక్టర్‌తో ధృవీకరించుకోండి.'
      : 'Please verify important clinical instructions, schedules, and medication directions directly with a qualified healthcare professional.';

  return (
    <div className="space-y-2.5 pt-1">
      {uncertaintyNote && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">
              {language === 'kn'
                ? 'ಮಾಹಿತಿ ಮಿತಿ ಸೂಚನೆ: '
                : language === 'te'
                ? 'అదనపు స్పష్టత అవసరం: '
                : 'Information Sufficiency Notice: '}
            </strong>
            <span>{uncertaintyNote}</span>
          </div>
        </div>
      )}

      <div className="p-3.5 rounded-xl bg-[#E6C1C4]/22 border border-[#E6C1C4] text-xs text-[#493C39] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
        <span>{verificationDisclaimer || defaultVerify}</span>
      </div>
    </div>
  );
};

export const AiSkeletonLoader: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div
      className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-3 soft-fade-up"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-[#8A6D3F]">
        <Sparkles className="w-3.5 h-3.5 text-[#C88F98]" />
        <span>{label || 'Composing calm plain-language guidance...'}</span>
      </div>
      <div className="h-4 w-3/4 rounded-lg skeleton-ivory" />
      <div className="h-4 w-full rounded-lg skeleton-ivory" />
      <div className="h-4 w-5/6 rounded-lg skeleton-ivory" />
    </div>
  );
};
