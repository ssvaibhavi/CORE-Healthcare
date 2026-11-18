import React from 'react';
import {
  ComfortSettings,
  ExplanationComplexity,
  Language,
  MotionMode
} from '../types';
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
  Check,
  BookOpen,
  Globe,
  Wind
} from 'lucide-react';

interface ComfortModePanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: ComfortSettings;
  onUpdateSettings: (next: ComfortSettings) => void;
  onResetComfort: () => void;
}

export const ComfortModePanel: React.FC<ComfortModePanelProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  settings,
  onUpdateSettings,
  onResetComfort,
}) => {
  if (!isOpen) return null;

  const activeMotionMode: MotionMode =
    settings.motionMode || (settings.reduceMotion ? 'none' : 'full');

  const setMotionMode = (mode: MotionMode) => {
    onUpdateSettings({
      ...settings,
      motionMode: mode,
      reduceMotion: mode === 'none',
    });
  };

  const labels = {
    title: {
      kn: 'CORE ಅನುಭವ ಸೆಟ್ಟಿಂಗ್‌ಗಳು (Comfort Mode)',
      te: 'CORE ఎక్స్‌పీరియన్స్ సెట్టింగ్స్ (Comfort Mode)',
      en: 'CORE Experience Settings',
    },
    subtitle: {
      kn: 'ಭಾಷೆ, ಅಕ್ಷರ ಗಾತ್ರ, ಕಾಂಟ್ರಾಸ್ಟ್, ಚಲನೆಯ ವೇಗ, ಧ್ವನಿ ಮತ್ತು AI ವಿವರಣೆಯನ್ನು ಒಂದೇ ಕಡೆ ಹೊಂದಿಸಿ.',
      te: 'భాష, టెక్స్ట్ సైజు, కాంట్రాస్ట్, యానిమేషన్, వాయిస్ మరియు AI శైలిని ఒకే చోట మార్చుకోండి.',
      en: 'One calm panel for language, text size, contrast, motion intensity, voice, and AI style. Only non-sensitive display choices are remembered.',
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
      title: { kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಓದುವಿಕೆ', te: 'హై కాంట్రాస్ట్ రీడింగ్', en: 'High-Contrast Reading' },
      desc: { kn: 'ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಲು ಕಪ್ಪು ಹಿನ್ನೆಲೆ ಮತ್ತು ಹಳದಿ/ಬಿಳಿ ಅಕ್ಷರಗಳು', te: 'స్పష్టంగా కనిపించడానికి నలుపు రంగు నేపథ్యం', en: 'Crisp black & high-contrast typography' },
    },
    simplifiedNav: {
      title: { kn: 'ಸರಳ ನ್ಯಾವಿಗೇಷನ್', te: 'సరళమైన మెనూ', en: 'Simplified Navigation' },
      desc: { kn: 'ಪ್ರಮುಖ ಬಟನ್‌ಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಿ ಗೊಂದಲ ತಪ್ಪಿಸುತ್ತದೆ', te: 'ముఖ్యమైన బటన్లను మాత్రమే చూపిస్తుంది', en: 'Focuses header on essential patient links' },
    },
    largeButtons: {
      title: { kn: 'ದೊಡ್ಡ ಸ್ಪರ್ಶ ಬಟನ್‌ಗಳು', te: 'పెద్ద బటన్లు', en: 'Larger Touch Targets' },
      desc: { kn: 'ಬೆರಳಿನಿಂದ ಒತ್ತಲು ಸುಲಭವಾಗುವಂತೆ ಬಟನ್‌ಗಳನ್ನು ದೊಡ್ಡದಾಗಿಸುತ್ತದೆ', te: 'నొక్కడానికి సులభంగా ఉండేలా బటన్లను పెద్దది చేస్తుంది', en: 'Expands button padding and tap height' },
    },
    readAloud: {
      title: { kn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ', te: 'వాయిస్ సహాయం', en: 'Voice Guidance (Read-Aloud)' },
      desc: { kn: 'ಭಾಷೆ ಬದಲಾದಾಗ ಮತ್ತು ಕೇಳಲು ಒತ್ತಿದಾಗ ಧ್ವನಿಯಲ್ಲಿ ಓದುತ್ತದೆ', te: 'భాష మారినప్పుడు మరియు అవసరమైనప్పుడు వాయిస్‌లో చదువుతుంది', en: 'Spoken feedback across supported devices' },
    },
    guidedMode: {
      title: { kn: 'ಹಿರಿಯರ ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್', te: 'గైడెడ్ నావిగేషన్ మోడ్', en: 'Guided Navigation Bar' },
      desc: { kn: 'ಕೆಲಸಗಳನ್ನು ಚಿಕ್ಕ ಹಂತಗಳಾಗಿ ತೋರಿಸುವ ಸಹಾಯಕ ಪಟ್ಟಿ', te: 'ప్రతి పనిని చిన్న దశలుగా చూపించే బార్', en: 'Calm step-by-step progress strip across pages' },
    },
    reset: { kn: 'ಮೂಲ ಸೆಟ್ಟಿಂಗ್‌ಗೆ ಮರಳಿ', te: 'సాధారణ స్థితికి మార్చండి', en: 'Reset Settings' },
    done: { kn: 'ಮುಗಿಸಿ', te: 'పూర్తయింది', en: 'Done' },
  };

  const toggle = (key: 'highContrast' | 'simplifiedNav' | 'largeButtons' | 'readAloud' | 'guidedMode') => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div
      className="bg-white border-b border-[#BEA06D]/45 shadow-lg transition-all modal-soft-enter no-print"
      role="region"
      aria-label={labels.title[language]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#BEA06D]/15 border border-[#BEA06D]/30 flex items-center justify-center text-[#8A6D3F] shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#493C39]">
                {labels.title[language]}
              </h3>
              <p className="text-xs sm:text-sm text-[#493C39]/80">
                {labels.subtitle[language]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onResetComfort}
              className="compact-chip px-3 py-1.5 rounded-lg border border-[#BEA06D]/30 text-xs font-medium text-[#8A6D3F] hover:bg-[#FCF9F5] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{labels.reset[language]}</span>
            </button>
            <button
              onClick={onClose}
              className="compact-chip px-3.5 py-1.5 rounded-lg bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              aria-label={labels.done[language]}
            >
              <X className="w-3.5 h-3.5" />
              <span>{labels.done[language]}</span>
            </button>
          </div>
        </div>

        {/* Row 1: Language & Motion Intensity (3 Modes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Language */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#8A6D3F]" />
              <div>
                <span className="text-sm font-semibold text-[#493C39] block">
                  {language === 'kn' ? 'ಭಾಷೆ' : language === 'te' ? 'భాష' : 'Language'}
                </span>
                <span className="text-[11px] text-[#493C39]/70 block">
                  English default for first-time visitors
                </span>
              </div>
            </div>
            <div className="inline-flex rounded-xl border border-[#BEA06D]/30 p-1 bg-white">
              {(
                [
                  { id: 'en' as Language, label: 'English' },
                  { id: 'kn' as Language, label: 'ಕನ್ನಡ' },
                  { id: 'te' as Language, label: 'తెలుగు' },
                ]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onLanguageChange(item.id)}
                  className={`compact-chip px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    language === item.id
                      ? 'bg-[#BEA06D] text-white shadow-xs'
                      : 'text-[#493C39] hover:text-[#8A6D3F]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Tier Animation Intensity */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
            <div className="flex items-center gap-2.5">
              <Wind className="w-5 h-5 text-[#4A6347]" />
              <div>
                <span className="text-sm font-semibold text-[#493C39] block">
                  {language === 'kn' ? 'ಚಲನೆಯ ವೇಗ (Animations)' : language === 'te' ? 'యానిమేషన్ స్థాయి' : 'Animation Intensity'}
                </span>
                <span className="text-[11px] text-[#493C39]/70 block">
                  Choose smooth reveals, subtle fade, or instant display
                </span>
              </div>
            </div>
            <div className="inline-flex rounded-xl border border-[#BEA06D]/30 p-1 bg-white">
              {(
                [
                  { id: 'full' as MotionMode, label: { en: 'Full Elegance', kn: 'ಪೂರ್ಣ ಸೌಮ್ಯ', te: 'పూర్తి శైలి' } },
                  { id: 'gentle' as MotionMode, label: { en: 'Gentle Motion', kn: 'ಲಘು ಚಲನೆ', te: 'తక్కువ కదలిక' } },
                  { id: 'none' as MotionMode, label: { en: 'No Motion', kn: 'ಚಲನೆ ಇಲ್ಲ', te: 'చలనం వద్దు' } },
                ]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMotionMode(opt.id)}
                  className={`compact-chip px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeMotionMode === opt.id
                      ? 'bg-[#4A6347] text-white shadow-xs'
                      : 'text-[#493C39] hover:text-[#4A6347]'
                  }`}
                >
                  {opt.label[language]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Text Size & AI Explanation Complexity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
            <div className="flex items-center gap-2.5">
              <Type className="w-5 h-5 text-[#8A6D3F]" />
              <span className="text-sm font-semibold text-[#493C39]">{labels.textSize[language]}</span>
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
                      : 'text-[#493C39] hover:text-[#8A6D3F]'
                  }`}
                >
                  {labels[sz][language]} {sz === 'normal' ? '(A)' : sz === 'large' ? '(A+)' : '(A++)'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#E6C1C4]/70">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#C88F98]" />
              <div>
                <span className="text-sm font-semibold text-[#493C39] block">
                  {language === 'kn' ? 'AI ವಿವರಣೆ ಮಟ್ಟ' : language === 'te' ? 'AI వివరణ స్థాయి' : 'AI Explanation Style'}
                </span>
                <span className="text-[11px] text-[#493C39]/70 block">
                  Shapes AI wording only (no health profiling)
                </span>
              </div>
            </div>
            <div className="inline-flex rounded-xl border border-[#BEA06D]/30 p-1 bg-white">
              {(
                [
                  { id: 'extra_simple' as ExplanationComplexity, label: { kn: 'ಅತಿ ಸರಳ', te: 'అతి సులభం', en: 'Extra Simple' } },
                  { id: 'simple' as ExplanationComplexity, label: { kn: 'ಸರಳ', te: 'సులభం', en: 'Simple' } },
                  { id: 'detailed' as ExplanationComplexity, label: { kn: 'ವಿವರವಾದ', te: 'వివరంగా', en: 'Detailed' } },
                ]
              ).map((opt) => {
                const active = (settings.explanationComplexity || 'simple') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, explanationComplexity: opt.id })}
                    className={`compact-chip px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#C88F98] text-white shadow-xs'
                        : 'text-[#493C39] hover:text-[#8A6D3F]'
                    }`}
                  >
                    {opt.label[language]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Functional Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              key: 'guidedMode' as const,
              icon: <Compass className="w-5 h-5 text-[#8A6D3F]" />,
              title: labels.guidedMode.title[language],
              desc: labels.guidedMode.desc[language],
              highlight: true,
            },
            {
              key: 'highContrast' as const,
              icon: <Eye className="w-5 h-5 text-[#8A6D3F]" />,
              title: labels.highContrast.title[language],
              desc: labels.highContrast.desc[language],
            },
            {
              key: 'readAloud' as const,
              icon: <Volume2 className="w-5 h-5 text-[#8A6D3F]" />,
              title: labels.readAloud.title[language],
              desc: labels.readAloud.desc[language],
            },
            {
              key: 'largeButtons' as const,
              icon: <Maximize2 className="w-5 h-5 text-[#8A6D3F]" />,
              title: labels.largeButtons.title[language],
              desc: labels.largeButtons.desc[language],
            },
            {
              key: 'simplifiedNav' as const,
              icon: <Sparkles className="w-5 h-5 text-[#8A6D3F]" />,
              title: labels.simplifiedNav.title[language],
              desc: labels.simplifiedNav.desc[language],
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
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${
                  active
                    ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-xs'
                    : item.highlight
                    ? 'bg-[#FCF9F5] border-[#BEA06D]/40 hover:border-[#BEA06D]'
                    : 'bg-white border-[#BEA06D]/25 hover:border-[#BEA06D]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#493C39] block leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#493C39]/75 leading-snug block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    active
                      ? 'bg-[#4A6347] border-[#4A6347] text-white'
                      : 'bg-white border-[#BEA06D]/40 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
