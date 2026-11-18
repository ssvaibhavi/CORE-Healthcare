import React from 'react';
import { CaseStudyEditorialPlate } from './BotanicalMotifs';
import { Reveal } from './Reveal';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AlertCircle, CheckCircle, Volume2, ArrowRight } from 'lucide-react';

interface ScenarioSpotlightProps {
  language: Language;
  onExploreDemo: () => void;
  onPageChange: (page: PageView) => void;
}

export const ScenarioSpotlight: React.FC<ScenarioSpotlightProps> = ({
  language,
  onExploreDemo,
  onPageChange,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <Reveal>
      <section className="my-16 bg-white border border-[#BEA06D]/35 rounded-3xl p-6 sm:p-10 shadow-xs overflow-hidden relative">
        {/* Decorative Rosewater & champagne hairline */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#BEA06D]/45 via-[#C88F98] to-[#A2B29B]/45" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image-Free Editorial Folio Plate */}
          <div className="lg:col-span-5">
            <CaseStudyEditorialPlate language={language} />
          </div>

          {/* Right Column: Contrast Between Traditional Failure & CORE Solution */}
          <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block mb-1">
              {t.hero.scenarioPill}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330] leading-tight">
              {t.hero.scenarioTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#3C3330]/80 mt-2 leading-relaxed">
              {t.hero.scenarioDesc}
            </p>
          </div>

          {/* Comparison Cards: Before vs CORE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* The Old Broken Way */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/60 space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-semibold text-xs uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{language === 'kn' ? 'ಹಳೆಯ ಪದ್ಧತಿಯ ಸಮಸ್ಯೆ' : language === 'te' ? 'పాత విధానంలో సమస్య' : 'Traditional SMS Failure'}</span>
              </div>
              <ul className="text-xs text-red-950/80 space-y-1.5 list-disc list-inside">
                <li>{language === 'kn' ? 'ಇಂಗ್ಲಿಷ್ ಪಠ್ಯ ಓದಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ' : language === 'te' ? 'ఇంగ్లీష్ టెక్స్ట్ చదవడం రాదు' : 'English text-only SMS creates instant barrier'}</li>
                <li>{language === 'kn' ? 'ನೆರೆಯವರು ಮರೆತಾಗ ಸ್ಕ್ಯಾನ್ ತಪ್ಪಿಹೋಗುತ್ತದೆ' : language === 'te' ? 'బంధువులు మర్చిపోతే స్కాన్ మిస్' : 'Caregiver overlooks notification'}</li>
                <li>{language === 'kn' ? 'ಮತ್ತೆ ಬಸ್ ಹತ್ತಿ ೪೦ ಕಿಮೀ ಅಲೆಯಬೇಕು' : language === 'te' ? 'మళ్ళీ 40 కిమీ ప్రయాణించాల్సి వస్తుంది' : 'Must make repeat bus journeys to reschedule'}</li>
              </ul>
            </div>

            {/* The CORE Way */}
            <div className="p-4 rounded-2xl bg-[#A2B29B]/20 border border-[#A2B29B]/50 space-y-2">
              <div className="flex items-center gap-2 text-[#4A6347] font-semibold text-xs uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-[#4A6347] shrink-0" />
                <span>{language === 'kn' ? 'CORE ಪರಿಹಾರ' : language === 'te' ? 'CORE పరిష్కారం' : 'CORE Solution'}</span>
              </div>
              <ul className="text-xs text-[#211B19] space-y-1.5 list-disc list-inside">
                <li>{language === 'kn' ? 'ಕನ್ನಡದಲ್ಲೇ ನೇರ ಧ್ವನಿ ಕರೆ ಮತ್ತು ವಿವರ' : language === 'te' ? 'తెలుగులోనే స్పష్టమైన వాయిస్ కాల్' : 'Direct spoken voice calls in native language'}</li>
                <li>{language === 'kn' ? 'ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ೧ ಒತ್ತಿ ಹಾಜರಾತಿ ಖಚಿತ' : language === 'te' ? 'కీప్యాడ్‌లో 1 నొక్కి హాజరు నిర్ధారణ' : 'One-touch keypad confirmation'}</li>
                <li>{language === 'kn' ? 'ಮನೆಯಿಂದಲೇ ೫ ಹಂತಗಳಲ್ಲಿ ಸುಲಭ ಮರುನಿಗದಿ' : language === 'te' ? 'ఇంట్లోనే 5 దశల్లో రీషెడ్యూల్' : '5-step dignified home rescheduling'}</li>
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreDemo}
              className="py-3 px-6 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-[#BEA06D]/30 transition-all cursor-pointer focus:outline-none"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.hero.tryDemoBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onPageChange('how-it-works')}
              className="py-3 px-6 rounded-full bg-white hover:bg-[#FCF9F5] border border-[#BEA06D]/40 text-[#3C3330] font-medium text-sm transition-colors cursor-pointer"
            >
              {t.nav.howItWorks}
            </button>
          </div>
        </div>
        </div>
      </section>
    </Reveal>
  );
};
