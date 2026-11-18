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
  CheckCircle2,
  Award,
  Check
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
  const [visitedStops, setVisitedStops] = useState<Record<string, boolean>>({});
  const [resetToast, setResetToast] = useState(false);

  const handleResetClick = () => {
    onResetDemo();
    setVisitedStops({});
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const markAndRun = (id: string, fn: () => void) => {
    setVisitedStops((prev) => ({ ...prev, [id]: true }));
    fn();
  };

  const quickStops: Array<{
    id: string;
    step: string;
    label: Record<Language, string>;
    detail: Record<Language, string>;
    icon: React.ReactNode;
    onClick: () => void;
  }> = [
    {
      id: 'demo-comfort',
      step: '01',
      label: {
        kn: 'ಭಾಷೆ ಮತ್ತು ಕಂಫರ್ಟ್',
        te: 'భాష & కంఫర్ట్',
        en: 'Language & Comfort',
      },
      detail: {
        kn: 'ಅಕ್ಷರ ಗಾತ್ರ ಮತ್ತು ಭಾಷೆ',
        te: 'అక్షరాల సైజు & భాష',
        en: 'Text size & language',
      },
      icon: <SlidersHorizontal className="w-4 h-4 text-[#BEA06D]" />,
      onClick: onOpenComfortMode,
    },
    {
      id: 'demo-voice',
      step: '02',
      label: {
        kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ',
        te: 'అపాయింట్‌మెంట్ వినండి',
        en: 'Hear Appointment',
      },
      detail: {
        kn: 'ಧ್ವನಿ ಓದುಗ ಕಾರ್ಡ್',
        te: 'వాయిస్ రీడౌట్ కార్డు',
        en: 'Spoken appointment card',
      },
      icon: <Volume2 className="w-4 h-4 text-[#BEA06D]" />,
      onClick: () => {
        onSelectDemoPatient();
        onPageChange('appointment');
      },
    },
    {
      id: 'demo-clarity',
      step: '03',
      label: {
        kn: 'AI ಸರಳ ಮಾರ್ಗದರ್ಶನ',
        te: 'AI సులభ వివరణ',
        en: 'AI Clarity Guide',
      },
      detail: {
        kn: 'ಸೂಚನೆಗಳ ಸ್ಪಷ್ಟ ಅರ್ಥ',
        te: 'సూచనల సరళ అర్థం',
        en: 'Plain-language wording',
      },
      icon: <BookOpen className="w-4 h-4 text-[#4A6347]" />,
      onClick: () => onPageChange('clarity'),
    },
    {
      id: 'demo-passport',
      step: '04',
      label: {
        kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್',
        te: 'విజిట్ పాస్‌పోర్ట్',
        en: 'Visit Passport',
      },
      detail: {
        kn: 'ಪ್ರಿಂಟ್ / PDF ಕಾರ್ಡ್',
        te: 'ప్రింట్ / PDF కార్డు',
        en: 'Printable visit card',
      },
      icon: <FileCheck2 className="w-4 h-4 text-[#8F7242]" />,
      onClick: () => onPageChange('passport'),
    },
    {
      id: 'demo-journey',
      step: '05',
      label: {
        kn: 'ಆರೈಕೆ ಚೆಕ್‌ಲಿಸ್ಟ್',
        te: 'సంరక్షణ జాబితా',
        en: 'Care Checklist',
      },
      detail: {
        kn: 'ಮುನ್ನ · ಸಮಯ · ನಂತರ',
        te: 'ముందు · లోపల · తర్వాత',
        en: '3-stage prep timeline',
      },
      icon: <CalendarClock className="w-4 h-4 text-[#8F7242]" />,
      onClick: () => onPageChange('journey'),
    },
    {
      id: 'demo-carecircle',
      step: '06',
      label: {
        kn: 'ಆರೈಕೆದಾರರ ನೆರವು',
        te: 'సంరక్షకుల సహాయం',
        en: 'Caregiver Support',
      },
      detail: {
        kn: 'ಸಮ್ಮತಿ ಆಧಾರಿತ ಹಂಚಿಕೆ',
        te: 'అనుమతితో భాగస్వామ్యం',
        en: 'Consented CareCircle',
      },
      icon: <Users className="w-4 h-4 text-[#C98897]" />,
      onClick: () => onPageChange('carecircle'),
    },
    {
      id: 'demo-summary',
      step: '07',
      label: {
        kn: 'ಪಯಣದ ಸಾರಾಂಶ',
        te: 'ప్రయాణ సారాంశం',
        en: 'Journey Summary',
      },
      detail: {
        kn: '7-ಹಂತದ ಪ್ರದರ್ಶನ',
        te: '7-దశల పూర్తి పర్యటన',
        en: 'Full walkthrough & summary',
      },
      icon: <Award className="w-4 h-4 text-[#4A6347]" />,
      onClick: () => onPageChange('showcase'),
    },
  ];

  const visitedCount = quickStops.filter((s) => visitedStops[s.id]).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
      <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/40 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#8F7242]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider">
                  {language === 'kn'
                    ? '೭-ಹಂತದ ಮಾರ್ಗದರ್ಶಿತ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ (Explore Demo)'
                    : language === 'te'
                    ? '7-దశల డెమో పర్యటన (Explore Demo)'
                    : '7-Step Fictional Patient Demonstration'}
                </span>
                <span className="text-[11px] font-semibold text-[#4A6347] tabular-nums">
                  ({visitedCount}/7)
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {language === 'kn'
                  ? 'ಬಸಪ್ಪ ಗೌಡ (೬೦ ವರ್ಷ, ಮಂಡ್ಯ) ಅವರ ಸಂಪೂರ್ಣ ಆಸ್ಪತ್ರೆ ಪಯಣವನ್ನು ಪ್ರಯತ್ನಿಸಿ'
                  : language === 'te'
                  ? 'బసప్ప గౌడ (60 ఏళ్ళు, మండ్య) ఆసుపత్రి ప్రయాణాన్ని పూర్తిగా పరీక్షించండి'
                  : 'Walk Through Basappa Gowda’s Fictional CT Scan Journey'}
              </h3>
              <p className="text-xs text-[#3C3330]/75 mt-0.5">
                {language === 'kn'
                  ? 'ಎಲ್ಲವೂ ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಡೇಟಾ; ಯಾವುದೇ ನಿಜವಾದ ರೋಗಿ ಮಾಹಿತಿಯನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.'
                  : language === 'te'
                  ? 'ఇది కేవలం కల్పిత డెమో డేటా; ఎలాంటి నిజమైన రోగి సమాచారం సేవ్ చేయబడదు.'
                  : '100% fictional demonstration patient data — zero sensitive records stored or transmitted.'}
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
                    : '೭-ಹಂತದ ಡೆಮೊ ನೋಡಿ'
                  : language === 'te'
                  ? expanded
                    ? 'దశలను మూసివేయండి'
                    : '7-దశల డెమో చూడండి'
                  : expanded
                  ? 'Hide 7-Step Demo'
                  : 'Explore 7-Step Demo'}
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
                : 'Demo restored to initial fictional patient state, checklists, and default settings.'}
            </span>
          </div>
        )}

        {expanded && (
          <div className="pt-3 border-t border-[#BEA06D]/20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 soft-fade-up">
            {quickStops.map((stop) => {
              const visited = !!visitedStops[stop.id];
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => markAndRun(stop.id, stop.onClick)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    visited
                      ? 'bg-[#A2B29B]/15 border-[#4A6347]/50'
                      : 'bg-[#FCF9F5] hover:bg-[#BEA06D]/12 border-[#BEA06D]/30 hover:border-[#BEA06D]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-[#8F7242] tabular-nums">
                      {stop.step}
                    </span>
                    {visited ? (
                      <span className="w-4 h-4 rounded-full bg-[#4A6347] text-white flex items-center justify-center check-pop">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      stop.icon
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#3C3330] leading-snug block">
                      {stop.label[language]}
                    </span>
                    <span className="text-[10px] text-[#8F7242] block mt-0.5 leading-tight">
                      {stop.detail[language]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
