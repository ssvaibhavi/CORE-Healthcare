import React, { useState } from 'react';
import { Language, PageView } from '../types';
import {
  Compass,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Volume2,
  CalendarClock,
  BookOpen,
  Users,
  FileCheck2,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface DemoExperienceBarProps {
  language: Language;
  onPageChange: (page: PageView) => void;
  onSelectDemoPatient: () => void;
  onOpenComfortMode: () => void;
  onResetDemo: () => void;
}

export const DemoExperienceBar: React.FC<DemoExperienceBarProps> = ({
  language,
  onPageChange,
  onSelectDemoPatient,
  onOpenComfortMode,
  onResetDemo,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleResetClick = () => {
    onResetDemo();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const quickStops: Array<{
    id: string;
    label: Record<Language, string>;
    icon: React.ReactNode;
    onClick: () => void;
  }> = [
    {
      id: 'demo-voice',
      label: {
        kn: '೧. ಧ್ವನಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
        te: '1. వాయిస్ అపాయింట్‌మెంట్',
        en: '1. Hear Appointment',
      },
      icon: <Volume2 className="w-4 h-4 text-[#BEA06D]" />,
      onClick: () => {
        onSelectDemoPatient();
        onPageChange('appointment');
      },
    },
    {
      id: 'demo-journey',
      label: {
        kn: '೨. ಆರೈಕೆ ಪಯಣ',
        te: '2. ఆరోగ్య ప్రయాణం',
        en: '2. Care Journey',
      },
      icon: <CalendarClock className="w-4 h-4 text-[#8F7242]" />,
      onClick: () => onPageChange('journey'),
    },
    {
      id: 'demo-clarity',
      label: {
        kn: '೩. ಸರಳ ವಿವರಣೆ',
        te: '3. సులభ వివరణ',
        en: '3. Explain It Simply',
      },
      icon: <BookOpen className="w-4 h-4 text-[#4A6347]" />,
      onClick: () => onPageChange('clarity'),
    },
    {
      id: 'demo-carecircle',
      label: {
        kn: '೪. CareCircle ಸಮ್ಮತಿ',
        te: '4. CareCircle అనుమతి',
        en: '4. CareCircle',
      },
      icon: <Users className="w-4 h-4 text-[#C98897]" />,
      onClick: () => onPageChange('carecircle'),
    },
    {
      id: 'demo-passport',
      label: {
        kn: '೫. ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್',
        te: '5. విజిట్ పాస్‌పోర్ట్',
        en: '5. Visit Passport',
      },
      icon: <FileCheck2 className="w-4 h-4 text-[#8F7242]" />,
      onClick: () => onPageChange('passport'),
    },
    {
      id: 'demo-comfort',
      label: {
        kn: '೬. ಕಂಫರ್ಟ್ ಮೋಡ್',
        te: '6. కంఫర్ట్ మోడ్',
        en: '6. Comfort Mode',
      },
      icon: <SlidersHorizontal className="w-4 h-4 text-[#BEA06D]" />,
      onClick: onOpenComfortMode,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
      <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/40 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#8F7242]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider block">
                {language === 'kn'
                  ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾರ್ಗದರ್ಶಿ (Explore Demo)'
                  : language === 'te'
                  ? 'డెమో మార్గదర్శి (Explore Demo)'
                  : 'Explore Interactive Demo'}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {language === 'kn'
                  ? 'ಬಸಪ್ಪ ಗೌಡ (೬೦ ವರ್ಷ, ಮಂಡ್ಯ) ಅವರ ಸಂಪೂರ್ಣ ಆಸ್ಪತ್ರೆ ಪಯಣವನ್ನು ಪ್ರಯತ್ನಿಸಿ'
                  : language === 'te'
                  ? 'బసప్ప గౌడ (60 ఏళ్ళు, మండ్య) ఆసుపత్రి ప్రయాణాన్ని పూర్తిగా పరీక్షించండి'
                  : 'Walk Through Basappa Gowda’s Rural CT Scan Experience'}
              </h3>
              <p className="text-xs text-[#3C3330]/75 mt-0.5">
                {language === 'kn'
                  ? 'ಎಲ್ಲವೂ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾದರಿ ಡೇಟಾ; ಯಾವುದೇ ನಿಜವಾದ ರೋಗಿ ಮಾಹಿತಿಯನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.'
                  : language === 'te'
                  ? 'ఇది కేవలం నమూనా డేటా; ఎలాంటి నిజమైన రోగి సమాచారం సేవ్ చేయబడదు.'
                  : 'Realistic fictional demonstration data — nothing sensitive is stored in browser storage.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetClick}
              className="compact-chip py-2 px-4 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {language === 'kn'
                  ? 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ'
                  : language === 'te'
                  ? 'డెమో రీసెట్ చేయండి'
                  : 'Reset Demo'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="py-2.5 px-5 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>
                {language === 'kn'
                  ? expanded
                    ? 'ಹಂತಗಳನ್ನು ಮುಚ್ಚಿ'
                    : 'ಡೆಮೊ ಹಂತಗಳನ್ನು ನೋಡಿ'
                  : language === 'te'
                  ? expanded
                    ? 'దశలను మూసివేయండి'
                    : 'డెమో దశలు చూడండి'
                  : expanded
                  ? 'Hide Demo Steps'
                  : 'Explore Demo'}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {resetToast && (
          <div className="p-3 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347]/40 text-xs font-semibold text-[#4A6347] flex items-center gap-2 soft-fade-up">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {language === 'kn'
                ? 'ಎಲ್ಲಾ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಚೆಕ್‌ಲಿಸ್ಟ್‌ಗಳನ್ನು ಮೂಲ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.'
                : language === 'te'
                ? 'అన్ని డెమో సెట్టింగ్‌లు మరియు జాబితాలు మొదటి స్థితికి రీసెట్ చేయబడ్డాయి.'
                : 'Demo restored to initial fictional patient state, tasks, and default settings.'}
            </span>
          </div>
        )}

        {expanded && (
          <div className="pt-3 border-t border-[#BEA06D]/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 soft-fade-up">
            {quickStops.map((stop) => (
              <button
                key={stop.id}
                type="button"
                onClick={stop.onClick}
                className="p-3 rounded-2xl bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/30 hover:border-[#BEA06D] text-left transition-all flex flex-col gap-2 cursor-pointer"
              >
                {stop.icon}
                <span className="text-xs font-bold text-[#3C3330] leading-snug">
                  {stop.label[language]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
