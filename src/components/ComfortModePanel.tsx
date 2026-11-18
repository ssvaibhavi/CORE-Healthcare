import React from 'react';
import { ComfortSettings, Language } from '../types';
import {
  Type,
  Eye,
  Sparkles,
  Volume2,
  Compass,
  Maximize2,
  SlidersHorizontal,
  RotateCcw,
  X,
  Check
} from 'lucide-react';

interface ComfortModePanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  settings: ComfortSettings;
  onUpdateSettings: (next: ComfortSettings) => void;
  onResetComfort: () => void;
}

export const ComfortModePanel: React.FC<ComfortModePanelProps> = ({
  isOpen,
  onClose,
  language,
  settings,
  onUpdateSettings,
  onResetComfort,
}) => {
  if (!isOpen) return null;

  const labels = {
    title: {
      kn: 'CORE ಕಂಫರ್ಟ್ ಮೋಡ್ (ಸರಳ ಬಳಕೆ)',
      te: 'CORE కంఫర్ట్ మోడ్ (సులభ సెట్టింగ్స్)',
      en: 'CORE Comfort Mode',
    },
    subtitle: {
      kn: 'ನಿಮ್ಮ ಕಣ್ಣಿಗೆ ಮತ್ತು ಬಳಕೆಗೆ ಹಿತವೆನಿಸುವಂತೆ ಪರದೆಯನ್ನು ಹೊಂದಿಸಿಕೊಳ್ಳಿ.',
      te: 'మీ కంటికి మరియు వినియోగానికి అనుకూలంగా స్క్రీన్‌ను మార్చుకోండి.',
      en: 'Tailor text size, contrast, motion, and guidance to suit your comfort.',
    },
    textSize: {
      kn: 'ಅಕ್ಷರದ ಗಾತ್ರ',
      te: 'అక్షరాల పరిమాణం',
      en: 'Text Size',
    },
    normal: { kn: 'ಸಾಮಾನ್ಯ', te: 'సాధారణం', en: 'Standard' },
    large: { kn: 'ದೊಡ್ಡದು', te: 'పెద్దది', en: 'Large' },
    xlarge: { kn: 'ಅತ್ಯಂತ ದೊಡ್ಡದು', te: 'చాలా పెద్దది', en: 'Extra Large' },
    highContrast: {
      title: { kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಓದುವಿಕೆ', te: 'హై కాంట్రాస్ట్ రీడింగ్', en: 'High-Contrast Reading Mode' },
      desc: { kn: 'ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಲು ಕಪ್ಪು ಹಿನ್ನೆಲೆ ಮತ್ತು ಹಳದಿ/ಬಿಳಿ ಅಕ್ಷರಗಳು', te: 'స్పష్టంగా కనిపించడానికి నలుపు రంగు నేపథ్యం', en: 'Crisp high-contrast colors for stronger visibility' },
    },
    reduceMotion: {
      title: { kn: 'ಚಲನೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ', te: 'యానిమేషన్లు తగ్గించండి', en: 'Reduce Animations' },
      desc: { kn: 'ಕಣ್ಣಿಗೆ ಆಯಾಸವಾಗದಂತೆ ಪರದೆಯ ಚಲನೆಗಳನ್ನು ನಿಲ್ಲಿಸುತ್ತದೆ', te: 'కంటికి శ్రమ లేకుండా కదలికలను తగ్గిస్తుంది', en: 'Turns off transitions and gentle motion effects' },
    },
    simplifiedNav: {
      title: { kn: 'ಸರಳ ನ್ಯಾವಿಗೇಷನ್', te: 'సరళమైన మెనూ', en: 'Simplified Navigation Mode' },
      desc: { kn: 'ಪ್ರಮುಖ ಬಟನ್‌ಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಿ ಗೊಂದಲ ತಪ್ಪಿಸುತ್ತದೆ', te: 'ముఖ్యమైన బటన్లను మాత్రమే చూపిస్తుంది', en: 'Focuses header on essential patient actions only' },
    },
    largeButtons: {
      title: { kn: 'ದೊಡ್ಡ ಸ್ಪರ್ಶ ಬಟನ್‌ಗಳು', te: 'పెద్ద బటన్లు', en: 'Larger Interactive Buttons' },
      desc: { kn: 'ಬೆರಳಿನಿಂದ ಒತ್ತಲು ಸುಲಭವಾಗುವಂತೆ ಬಟನ್‌ಗಳನ್ನು ದೊಡ್ಡದಾಗಿಸುತ್ತದೆ', te: 'నొక్కడానికి సులభంగా ఉండేలా బటన్లను పెద్దది చేస్తుంది', en: 'Increases button height and touch target spacing' },
    },
    readAloud: {
      title: { kn: 'ಸ್ವಯಂ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ', te: 'వాయిస్ సహాయం (Read-Aloud)', en: 'Read-Aloud Guidance' },
      desc: { kn: 'ಭಾಷೆ ಅಥವಾ ಹಂತ ಬದಲಾದಾಗ ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸುತ್ತದೆ', te: 'కొత్త పేజీ లేదా దశకు వెళ్ళినప్పుడు వాయిస్‌లో చెబుతుంది', en: 'Speaks helpful confirmations on supported browsers' },
    },
    guidedMode: {
      title: { kn: 'ಹಿರಿಯರ ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ (Guided Mode)', te: 'గైడెడ్ మోడ్ (దశల వారీ సహాయం)', en: 'Elderly Guided Mode' },
      desc: { kn: 'ದೊಡ್ಡ ಕೆಲಸಗಳನ್ನು ಚಿಕ್ಕ ಸರಳ ಹಂತಗಳಾಗಿ ವಿಭಜಿಸಿ ದಾರಿ ತೋರಿಸುತ್ತದೆ', te: 'ప్రతి పనిని చిన్న సులభమైన దశలుగా విభజించి చూపిస్తుంది', en: 'Adds a calm step-by-step assistant bar across your visit' },
    },
    reset: { kn: 'ಮೂಲ ಸೆಟ್ಟಿಂಗ್‌ಗೆ ಮರಳಿ', te: 'సాధారణ స్థితికి మార్చండి', en: 'Reset Comfort Settings' },
    done: { kn: 'ಮುಗಿಸಿ', te: 'పూర్తయింది', en: 'Done' },
  };

  const toggle = (key: keyof Omit<ComfortSettings, 'textSize'>) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div
      className="bg-white border-b-2 border-[#BEA06D]/40 shadow-lg transition-all soft-fade-up no-print"
      role="region"
      aria-label={labels.title[language]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#BEA06D]/15 border border-[#BEA06D]/30 flex items-center justify-center text-[#8F7242] shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {labels.title[language]}
              </h3>
              <p className="text-xs sm:text-sm text-[#3C3330]/80">
                {labels.subtitle[language]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onResetComfort}
              className="compact-chip px-3 py-1.5 rounded-lg border border-[#BEA06D]/30 text-xs font-medium text-[#8F7242] hover:bg-[#FCF9F5] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{labels.reset[language]}</span>
            </button>
            <button
              onClick={onClose}
              className="compact-chip px-3.5 py-1.5 rounded-lg bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              aria-label={labels.done[language]}
            >
              <X className="w-3.5 h-3.5" />
              <span>{labels.done[language]}</span>
            </button>
          </div>
        </div>

        {/* Text Size Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-[#8F7242]" />
            <span className="text-sm font-semibold text-[#3C3330]">{labels.textSize[language]}</span>
          </div>
          <div className="inline-flex rounded-xl border border-[#BEA06D]/30 p-1 bg-white">
            {(['normal', 'large', 'xlarge'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => onUpdateSettings({ ...settings, textSize: sz })}
                className={`compact-chip px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  sz === 'normal' ? 'text-xs' : sz === 'large' ? 'text-sm' : 'text-base font-semibold'
                } ${
                  settings.textSize === sz
                    ? 'bg-[#BEA06D] text-white shadow-xs'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
              >
                {labels[sz][language]} {sz === 'normal' ? '(A)' : sz === 'large' ? '(A+)' : '(A++)'}
              </button>
            ))}
          </div>
        </div>

        {/* Functional Toggle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              key: 'guidedMode' as const,
              icon: <Compass className="w-5 h-5 text-[#8F7242]" />,
              title: labels.guidedMode.title[language],
              desc: labels.guidedMode.desc[language],
              highlight: true,
            },
            {
              key: 'highContrast' as const,
              icon: <Eye className="w-5 h-5 text-[#8F7242]" />,
              title: labels.highContrast.title[language],
              desc: labels.highContrast.desc[language],
            },
            {
              key: 'largeButtons' as const,
              icon: <Maximize2 className="w-5 h-5 text-[#8F7242]" />,
              title: labels.largeButtons.title[language],
              desc: labels.largeButtons.desc[language],
            },
            {
              key: 'simplifiedNav' as const,
              icon: <Sparkles className="w-5 h-5 text-[#8F7242]" />,
              title: labels.simplifiedNav.title[language],
              desc: labels.simplifiedNav.desc[language],
            },
            {
              key: 'readAloud' as const,
              icon: <Volume2 className="w-5 h-5 text-[#8F7242]" />,
              title: labels.readAloud.title[language],
              desc: labels.readAloud.desc[language],
            },
            {
              key: 'reduceMotion' as const,
              icon: <SlidersHorizontal className="w-5 h-5 text-[#8F7242]" />,
              title: labels.reduceMotion.title[language],
              desc: labels.reduceMotion.desc[language],
            },
          ].map((item) => {
            const active = settings[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggle(item.key)}
                role="switch"
                aria-checked={active}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${
                  active
                    ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-xs'
                    : item.highlight
                    ? 'bg-[#FCF9F5] border-[#BEA06D]/40 hover:border-[#BEA06D]'
                    : 'bg-white border-[#BEA06D]/25 hover:border-[#BEA06D]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <span className="text-sm font-bold text-[#3C3330] block">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#3C3330]/75 leading-snug block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    active
                      ? 'bg-[#4A6347] border-[#4A6347] text-white'
                      : 'bg-white border-[#BEA06D]/40 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
