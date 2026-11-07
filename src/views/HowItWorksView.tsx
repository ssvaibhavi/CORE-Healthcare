import React from 'react';
import { ASSETS } from '../assets/images';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speechService } from '../utils/speech';
import {
  Volume2,
  Globe,
  CheckCircle2,
  Users,
  Smartphone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Signal,
  BatteryCharging
} from 'lucide-react';

interface HowItWorksViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  currentLanguage,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const handleSpeakStep = (title: string, desc: string) => {
    speechService.speak(`${title}. ${desc}`, currentLanguage);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          {currentLanguage === 'kn' ? 'ಸರಳ ಪ್ರಕ್ರಿಯೆ' : currentLanguage === 'te' ? 'సరళమైన విధానం' : 'Patient-Centered Design'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {t.howItWorksPage.title}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {t.howItWorksPage.subtitle}
        </p>
      </div>

      {/* Visual Botanical Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#BEA06D]/30 shadow-md aspect-[16/6] bg-[#FCF9F5]">
        <img
          src={ASSETS.botanicalVoiceCare}
          alt="Vintage botanical illustration"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent flex items-center p-6 sm:p-10">
          <div className="max-w-md space-y-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider">
              {t.tagline}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
              {t.about.philosophyQuote}
            </h3>
          </div>
        </div>
      </div>

      {/* Numbered Steps with Voice Guidance */}
      <div className="space-y-6">
        {t.howItWorksPage.steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 bg-white border border-[#BEA06D]/30 hover:border-[#BEA06D] rounded-3xl shadow-sm transition-all flex flex-col sm:flex-row items-start gap-6 group"
          >
            {/* Step Number Circle */}
            <div className="w-14 h-14 rounded-2xl bg-[#BEA06D] text-white font-display text-2xl font-bold flex items-center justify-center shrink-0 shadow-md shadow-[#BEA06D]/20 group-hover:scale-105 transition-transform">
              {step.number}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                  {step.title}
                </h3>
                <button
                  onClick={() => handleSpeakStep(step.title, step.desc)}
                  className="p-2 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30 transition-colors"
                  title="Listen to this step"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm sm:text-base text-[#3C3330]/80 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rural Readiness & Connectivity Resilience */}
      <div className="p-8 bg-gradient-to-r from-[#FCF9F5] via-white to-[#FCF9F5] border-2 border-[#BEA06D]/40 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-[#8F7242]">
          <Signal className="w-6 h-6 text-[#A2B29B]" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
            {t.howItWorksPage.ruralFocusTitle}
          </h3>
        </div>
        <p className="text-sm text-[#3C3330]/85 leading-relaxed">
          {t.howItWorksPage.ruralFocusDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white rounded-2xl border border-[#BEA06D]/20 space-y-1">
            <span className="font-bold text-xs text-[#8F7242] block">Low-Bandwidth Resilient</span>
            <p className="text-xs text-[#3C3330]/75">Works cleanly over rural 2G/3G connections without heavy asset downloads.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#BEA06D]/20 space-y-1">
            <span className="font-bold text-xs text-[#8F7242] block">No Account Burden</span>
            <p className="text-xs text-[#3C3330]/75">No complex passwords or email registrations. 4-digit card PIN verification.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#BEA06D]/20 space-y-1">
            <span className="font-bold text-xs text-[#8F7242] block">Offline Phone Backup</span>
            <p className="text-xs text-[#3C3330]/75">Direct IVR voice calls reach even basic feature phones without smartphones.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => onPageChange('appointment')}
            className="py-3 px-6 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm shadow flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>{currentLanguage === 'kn' ? 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗೆ ಹೋಗಿ' : currentLanguage === 'te' ? 'నా అపాయింట్‌మెంట్‌కు వెళ్ళండి' : 'Try Appointment Experience'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
