import React from 'react';
import { Language, PageView } from '../types';
import { speechService } from '../utils/speech';
import { Compass, Volume2, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface GuidedModeBarProps {
  language: Language;
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
  onExitGuidedMode: () => void;
}

export const GuidedModeBar: React.FC<GuidedModeBarProps> = ({
  language,
  currentPage,
  onPageChange,
  onExitGuidedMode,
}) => {
  const steps: Array<{
    step: number;
    page: PageView;
    title: Record<Language, string>;
    voicePrompt: Record<Language, string>;
  }> = [
    {
      step: 1,
      page: 'appointment',
      title: {
        kn: 'ಹಂತ ೧: ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ',
        te: 'దశ 1: అపాయింట్‌మెంట్ వినండి',
        en: 'Step 1: Hear Appointment',
      },
      voicePrompt: {
        kn: 'ಹಂತ ಒಂದು. ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ಮತ್ತು ಸಮಯವನ್ನು ಆಲಿಸಲು ಈ ಬಟನ್ ಒತ್ತಿ.',
        te: 'దశ ఒకటి. మీ అపాయింట్‌మెంట్ తేదీ మరియు సమయాన్ని వినడానికి ఈ బటన్ నొక్కండి.',
        en: 'Step one. Open your appointment card and listen to your date, time, and directions.',
      },
    },
    {
      step: 2,
      page: 'journey',
      title: {
        kn: 'ಹಂತ ೨: ಸಿದ್ಧತಾ ಪಟ್ಟಿ',
        te: 'దశ 2: తయారీ జాబితా',
        en: 'Step 2: Care Journey',
      },
      voicePrompt: {
        kn: 'ಹಂತ ಎರಡು. ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುವ ಮುನ್ನ ಮಾಡಬೇಕಾದ ಸಿದ್ಧತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
        te: 'దశ రెండు. ఆసుపత్రికి వెళ్ళే ముందు చేయవలసిన ఏర్పాట్లను తనిఖీ చేయండి.',
        en: 'Step two. Review your Before, During, and After visit checklist.',
      },
    },
    {
      step: 3,
      page: 'clarity',
      title: {
        kn: 'ಹಂತ ೩: ಸರಳ ವಿವರಣೆ',
        te: 'దశ 3: సులభ వివరణ',
        en: 'Step 3: Explain Simply',
      },
      voicePrompt: {
        kn: 'ಹಂತ ಮೂರು. ಉಪವಾಸ ಅಥವಾ ಪರೀಕ್ಷಾ ನಿಯಮಗಳನ್ನು ಅತಿ ಸರಳ ಭಾಷೆಯಲ್ಲಿ ತಿಳಿಯಿರಿ.',
        te: 'దశ మూడు. ఉపవాసం లేదా పరీక్ష నిబంధనలను సులభంగా అర్థం చేసుకోండి.',
        en: 'Step three. Understand hospital instructions in extra simple words.',
      },
    },
    {
      step: 4,
      page: 'passport',
      title: {
        kn: 'ಹಂತ ೪: ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್',
        te: 'దశ 4: విజిట్ పాస్‌పోర్ట్',
        en: 'Step 4: Visit Passport',
      },
      voicePrompt: {
        kn: 'ಹಂತ ನಾಲ್ಕು. ಆಸ್ಪತ್ರೆಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಲು ನಿಮ್ಮ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಸಿದ್ಧಪಡಿಸಿ.',
        te: 'దశ నాలుగు. ఆసుపత్రికి తీసుకెళ్ళడానికి మీ విజిట్ పాస్‌పోర్ట్ సిద్ధం చేసుకోండి.',
        en: 'Step four. View and print your personal Visit Passport card.',
      },
    },
  ];

  const activeIdx = Math.max(
    0,
    steps.findIndex((s) => s.page === currentPage)
  );
  const currentStepObj = steps[activeIdx];
  const nextStepObj = steps[(activeIdx + 1) % steps.length];

  const handleListenGuide = () => {
    speechService.speak(currentStepObj.voicePrompt[language], language);
  };

  return (
    <div className="bg-[#211B19] text-white border-b-2 border-[#BEA06D] py-4 px-4 sm:px-6 lg:px-8 no-print soft-fade-up">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#BEA06D]" />
            <span className="text-sm sm:text-base font-bold text-[#FCF9F5]">
              {language === 'kn'
                ? 'ಹಿರಿಯರ ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ (Guided Mode)'
                : language === 'te'
                ? 'సులభ మార్గదర్శి మోడ్ (Guided Mode)'
                : 'Elderly Guided Mode — Step-by-Step Support'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleListenGuide}
              className="compact-chip px-3.5 py-1.5 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {language === 'kn' ? 'ಈ ಹಂತ ಕೇಳಿ' : language === 'te' ? 'ఈ దశ వినండి' : 'Speak Guide'}
              </span>
            </button>
            <button
              onClick={onExitGuidedMode}
              className="compact-chip px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-xs flex items-center gap-1 cursor-pointer"
              aria-label="Exit Guided Mode"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಮುಚ್ಚಿ' : language === 'te' ? 'ఆపు' : 'Exit'}</span>
            </button>
          </div>
        </div>

        {/* 4 Large Step Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {steps.map((s) => {
            const isActive = currentPage === s.page;
            return (
              <button
                key={s.step}
                onClick={() => {
                  onPageChange(s.page);
                  speechService.speak(s.voicePrompt[language], language);
                }}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#BEA06D] border-white text-white font-bold shadow-sm'
                    : 'bg-white/10 border-white/15 text-gray-200 hover:bg-white/20'
                }`}
              >
                <span className="text-xs sm:text-sm leading-snug">{s.title[language]}</span>
                {isActive ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#BEA06D]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Step Nudge */}
        <div className="flex items-center justify-between text-xs text-gray-300 pt-0.5">
          <span>{currentStepObj.voicePrompt[language]}</span>
          <button
            onClick={() => onPageChange(nextStepObj.page)}
            className="compact-chip text-[#BEA06D] hover:text-white font-bold underline shrink-0 ml-3 cursor-pointer"
          >
            {language === 'kn' ? 'ಮುಂದಿನ ಹಂತ →' : language === 'te' ? 'తదుపరి దశ →' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
};
