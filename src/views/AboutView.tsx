import React from 'react';
import { ASSETS } from '../assets/images';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Heart,
  Globe,
  Volume2,
  Shield,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Users
} from 'lucide-react';

interface AboutViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  currentLanguage,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          {t.tagline}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3C3330]">
          {t.about.title}
        </h1>
        <p className="text-base sm:text-lg text-[#3C3330]/80">
          {t.about.philosophyQuote}
        </p>
      </div>

      {/* Hero Visual Composition with Logo & Rural Care Scene */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-[#BEA06D]/30 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#BEA06D]/15 rounded-full text-xs font-bold text-[#8F7242]">
            <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
            <span>{t.about.philosophyTitle}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330] leading-snug">
            "{t.about.philosophyQuote}"
          </h2>

          <p className="text-sm sm:text-base text-[#3C3330]/85 leading-relaxed">
            {t.about.philosophyDesc}
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-2 border-[#BEA06D]/40 shadow-md aspect-[4/3] bg-[#FCF9F5]">
          <img
            src={ASSETS.heroElderlyCare}
            alt="Healthcare worker helping an elderly grandfather"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* The Problem We Are Solving (The 60-Year-Old Rural Patient Story) */}
      <div className="bg-[#FCF9F5] border-2 border-[#BEA06D]/40 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ನೈಜ ರೋಗಿ ಸನ್ನಿವೇಶ' : currentLanguage === 'te' ? 'నిజమైన రోగి కేస్ స్టడీ' : 'The Real User Scenario'}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
            {t.about.problemTitle}
          </h3>
        </div>

        <p className="text-base text-[#3C3330]/90 leading-relaxed max-w-3xl">
          {t.about.problemStory}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#BEA06D]/20">
          <div className="space-y-1">
            <span className="text-xs font-bold text-red-700 block">The Bottleneck</span>
            <p className="text-xs text-[#3C3330]/80">English SMS assumes text literacy, smartphone fluency, and instant comprehension.</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 block">The Ripple Effect</span>
            <p className="text-xs text-[#3C3330]/80">Missed diagnostic windows lead to late-stage cancer or disease progression.</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#4A6347] block">The CORE Resolution</span>
            <p className="text-xs text-[#3C3330]/80">Voice-first automated spoken phone calls in Kannada and Telugu restore direct patient independence.</p>
          </div>
        </div>
      </div>

      {/* Four Core Pillars */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ನಮ್ಮ ತತ್ವಗಳು' : currentLanguage === 'te' ? 'మా సూత్రాలు' : 'Our Foundations'}
          </span>
          <h3 className="font-display text-3xl font-bold text-[#3C3330]">
            {t.about.pillarsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-[#BEA06D]/30 rounded-3xl shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/30 flex items-center justify-center text-[#8F7242] font-bold">
                0{idx + 1}
              </div>
              <h4 className="font-display text-lg font-bold text-[#3C3330]">
                {pillar.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#3C3330]/80 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Botanical Rest Element */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[#BEA06D]/30 bg-white text-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#BEA06D] mx-auto shadow-sm">
          <img
            src={ASSETS.logoEmblem}
            alt="CORE Logo Emblem"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="font-display text-2xl font-bold text-[#3C3330] max-w-lg mx-auto">
          "Healthcare that speaks your language."
        </p>
        <p className="text-xs text-[#8F7242] font-medium">
          Kannada (ಕನ್ನಡ) · Telugu (తెలుగు) · English
        </p>
        <div className="pt-2">
          <button
            onClick={() => onPageChange('appointment')}
            className="py-3 px-8 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm shadow cursor-pointer transition-all inline-flex items-center gap-2"
          >
            <span>{t.hero.viewAppointmentBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
