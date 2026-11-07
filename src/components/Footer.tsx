import React from 'react';
import { ASSETS } from '../assets/images';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Phone, Heart, Globe, Shield, Sparkles } from 'lucide-react';

interface FooterProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onPageChange: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLanguage,
  onLanguageChange,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <footer className="bg-white border-t border-[#BEA06D]/30 pt-16 pb-12 text-[#3C3330] mt-auto">
      {/* Delicate gold divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-divider mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#BEA06D]/50 bg-[#FCF9F5]">
                <img
                  src={ASSETS.logoEmblem}
                  alt="CORE Emblem"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-bold tracking-wider text-[#3C3330]">
                  CORE
                </span>
                <p className="text-xs text-[#8F7242] font-medium leading-tight">
                  {t.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#3C3330]/80 leading-relaxed">
              {t.footer.mission}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8F7242]">
              <Shield className="w-4 h-4 text-[#A2B29B]" />
              <span>{t.footer.privacyPledge}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#3C3330] mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onPageChange('home')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('appointment')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.myAppointment}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('reschedule')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.reschedule}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('reminders')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.reminders}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('how-it-works')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('about')}
                  className="hover:text-[#8F7242] transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance & Helplines */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#3C3330] mb-4">
              {t.footer.contactSupport}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-xl">
                <span className="text-xs text-[#8F7242] block font-semibold">
                  {currentLanguage === 'kn' ? 'ಉಚಿತ ಸಹಾಯವಾಣಿ' : currentLanguage === 'te' ? 'ఉచిత హెల్ప్‌లైన్' : 'Toll-Free Patient Desk'}
                </span>
                <span className="text-base font-bold text-[#3C3330] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-4 h-4 text-[#A2B29B]" />
                  1800-425-CORE
                </span>
                <span className="text-[11px] text-[#3C3330]/70 block mt-1">
                  {currentLanguage === 'kn' ? 'ಬೆಳಿಗ್ಗೆ ೭:೦೦ ರಿಂದ ರಾತ್ರಿ ೯:೦೦ ವರೆಗೆ' : currentLanguage === 'te' ? 'ఉదయం 7 నుండి రాత్రి 9 వరకు' : 'Every day 7:00 AM – 9:00 PM IST'}
                </span>
              </div>

              <button
                onClick={() => onPageChange('help')}
                className="text-xs font-semibold text-[#8F7242] hover:text-[#3C3330] underline block"
              >
                {t.nav.getHelp} →
              </button>
            </div>
          </div>

          {/* Col 4: Language & Staff */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#3C3330] mb-4 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#BEA06D]" />
              {currentLanguage === 'kn' ? 'ಭಾಷಾ ಆಯ್ಕೆ' : currentLanguage === 'te' ? 'భాష మార్చుకోండి' : 'Choose Language'}
            </h4>
            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => onLanguageChange('kn')}
                className={`py-2 px-3 text-left rounded-lg text-sm border transition-all ${
                  currentLanguage === 'kn'
                    ? 'bg-[#BEA06D]/20 border-[#BEA06D] font-bold text-[#8F7242]'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/20 hover:border-[#BEA06D]'
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
              <button
                onClick={() => onLanguageChange('te')}
                className={`py-2 px-3 text-left rounded-lg text-sm border transition-all ${
                  currentLanguage === 'te'
                    ? 'bg-[#BEA06D]/20 border-[#BEA06D] font-bold text-[#8F7242]'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/20 hover:border-[#BEA06D]'
                }`}
              >
                తెలుగు (Telugu)
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 text-left rounded-lg text-sm border transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-[#BEA06D]/20 border-[#BEA06D] font-bold text-[#8F7242]'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/20 hover:border-[#BEA06D]'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => onPageChange('staff')}
              className="text-xs text-[#8F7242] bg-[#BEA06D]/10 hover:bg-[#BEA06D]/20 border border-[#BEA06D]/30 py-2 px-3 rounded-lg w-full text-center font-medium transition-colors"
            >
              🔒 {t.nav.staffPortal}
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#BEA06D]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#3C3330]/70">
          <p>{t.footer.disclaimer}</p>
          <div className="flex items-center gap-1 text-[#8F7242]">
            <span>Designed with care</span>
            <Heart className="w-3.5 h-3.5 fill-[#C98897] text-[#C98897]" />
            <span>for rural elderly patients</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
