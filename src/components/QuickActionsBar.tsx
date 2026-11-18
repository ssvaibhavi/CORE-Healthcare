import React from 'react';
import { Language, PageView } from '../types';
import {
  Sparkles,
  Compass,
  CalendarClock,
  Globe,
  SlidersHorizontal,
  Users
} from 'lucide-react';

interface QuickActionsBarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onPageChange: (page: PageView) => void;
  onOpenCompanion: () => void;
  onOpenComfortMode: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  currentLanguage,
  onLanguageChange,
  onPageChange,
  onOpenCompanion,
  onOpenComfortMode,
}) => {
  const actions: Array<{
    id: string;
    label: Record<Language, string>;
    sub: Record<Language, string>;
    icon: React.ReactNode;
    onClick: () => void;
    tone: string;
  }> = [
    {
      id: 'qa-ai',
      label: {
        en: 'Ask CORE AI',
        kn: 'CORE AI ಕೇಳಿ',
        te: 'CORE AI అడగండి',
      },
      sub: {
        en: 'Contextual guide',
        kn: 'ತ್ವರಿತ ಮಾರ್ಗದರ್ಶನ',
        te: 'త్వరిత సహాయం',
      },
      icon: <Sparkles className="w-4 h-4 text-[#C88F98]" />,
      onClick: onOpenCompanion,
      tone: 'border-[#E6C1C4] hover:border-[#C88F98]',
    },
    {
      id: 'qa-prep',
      label: {
        en: 'Prepare for a Visit',
        kn: 'ಭೇಟಿಗೆ ಸಿದ್ಧರಾಗಿ',
        te: 'సందర్శనకు సిద్ధం కండి',
      },
      sub: {
        en: 'Checklist & .ics',
        kn: 'ಪಟ್ಟಿ & ಕ್ಯಾಲೆಂಡರ್',
        te: 'జాబితా & క్యాలెండర్',
      },
      icon: <Compass className="w-4 h-4 text-[#8A6D3F]" />,
      onClick: () => onPageChange('carecompass'),
      tone: 'border-[#BEA06D]/45 hover:border-[#BEA06D]',
    },
    {
      id: 'qa-journey',
      label: {
        en: 'My Care Journey',
        kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ',
        te: 'నా ఆరోగ్య ప్రయాణం',
      },
      sub: {
        en: 'Before · During · After',
        kn: 'ಮುನ್ನ · ಸಮಯ · ನಂತರ',
        te: 'ముందు · లోపల · తర్వాత',
      },
      icon: <CalendarClock className="w-4 h-4 text-[#4A6347]" />,
      onClick: () => onPageChange('journey'),
      tone: 'border-[#A2B29B]/60 hover:border-[#4A6347]',
    },
    {
      id: 'qa-comfort',
      label: {
        en: 'Comfort Mode',
        kn: 'ಕಂಫರ್ಟ್ ಮೋಡ್',
        te: 'కంఫర్ట్ మోడ్',
      },
      sub: {
        en: 'Text size & motion',
        kn: 'ಅಕ್ಷರ ಮತ್ತು ಚಲನೆ',
        te: 'అక్షరాలు & మోషన్',
      },
      icon: <SlidersHorizontal className="w-4 h-4 text-[#8A6D3F]" />,
      onClick: onOpenComfortMode,
      tone: 'border-[#BEA06D]/45 hover:border-[#BEA06D]',
    },
    {
      id: 'qa-caregiver',
      label: {
        en: 'Caregiver Support',
        kn: 'ಆರೈಕೆದಾರರ ನೆರವು',
        te: 'సంరక్షకుల సహాయం',
      },
      sub: {
        en: 'Consented CareCircle',
        kn: 'ಸಮ್ಮತಿ ಹಂಚಿಕೆ',
        te: 'అనుమతి భాగస్వామ్యం',
      },
      icon: <Users className="w-4 h-4 text-[#C88F98]" />,
      onClick: () => onPageChange('carecircle'),
      tone: 'border-[#E6C1C4] hover:border-[#C88F98]',
    },
  ];

  return (
    <section
      aria-label={
        currentLanguage === 'kn'
          ? 'CORE ತ್ವರಿತ ಕ್ರಿಯೆಗಳು'
          : currentLanguage === 'te'
          ? 'CORE త్వరిత చర్యలు'
          : 'CORE Quick Actions'
      }
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print"
    >
      <div className="bg-white/90 border border-[#BEA06D]/35 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-widest">
              {currentLanguage === 'kn'
                ? 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು (Quick Actions)'
                : currentLanguage === 'te'
                ? 'త్వరిత చర్యలు (Quick Actions)'
                : 'CORE Quick Actions'}
            </span>
          </div>

          {/* Direct Quick Language Switcher */}
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#BEA06D] shrink-0" />
            <span className="text-[11px] font-medium text-[#493C39]/75">
              {currentLanguage === 'kn' ? 'ಭಾಷೆ:' : currentLanguage === 'te' ? 'భాష:' : 'Language:'}
            </span>
            <div className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/35 rounded-full p-0.5">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                  { code: 'te', label: 'తెలుగు' },
                ] as const
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onLanguageChange(item.code)}
                  className={`compact-chip px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                    currentLanguage === item.code
                      ? 'bg-[#BEA06D] text-white'
                      : 'text-[#493C39] hover:text-[#8A6D3F]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {actions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`group p-3.5 rounded-2xl bg-[#FCF9F5]/80 hover:bg-white border ${act.tone} text-left transition-all duration-300 active:scale-[0.98] flex items-start gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D]`}
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-[#BEA06D]/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                {act.icon}
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#493C39] block leading-snug">
                  {act.label[currentLanguage]}
                </span>
                <span className="text-[11px] text-[#8A6D3F] block mt-0.5 leading-tight">
                  {act.sub[currentLanguage]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
