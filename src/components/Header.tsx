import React, { useState } from 'react';
import { ASSETS } from '../assets/images';
import { ComfortSettings, Language, PageView, TextSize } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Eye, Menu, X, SlidersHorizontal, Compass } from 'lucide-react';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
  comfortSettings: ComfortSettings;
  onTextSizeChange: (size: TextSize) => void;
  onHighContrastToggle: () => void;
  comfortOpen: boolean;
  onToggleComfortOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  currentPage,
  onPageChange,
  comfortSettings,
  onTextSizeChange,
  onHighContrastToggle,
  comfortOpen,
  onToggleComfortOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage];

  const allNavLinks: Array<{ id: PageView; label: string; essential?: boolean }> = [
    { id: 'home', label: t.nav.home, essential: true },
    { id: 'appointment', label: t.nav.myAppointment, essential: true },
    { id: 'reschedule', label: t.nav.reschedule },
    { id: 'reminders', label: t.nav.reminders },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'help', label: t.nav.getHelp, essential: true },
    { id: 'staff', label: t.nav.staffPortal },
  ];

  const navLinks = comfortSettings.simplifiedNav
    ? [
        { id: 'home' as PageView, label: t.nav.home },
        { id: 'appointment' as PageView, label: t.nav.myAppointment },
        {
          id: 'journey' as PageView,
          label:
            currentLanguage === 'kn'
              ? 'ಆರೈಕೆ ಪಯಣ'
              : currentLanguage === 'te'
              ? 'ఆరోగ్య ప్రయాణం'
              : 'My Care Journey',
        },
        { id: 'help' as PageView, label: t.nav.getHelp },
      ]
    : allNavLinks;

  const mobileExtraLinks: Array<{ id: PageView; label: string }> = comfortSettings.simplifiedNav
    ? []
    : [
        {
          id: 'journey',
          label:
            currentLanguage === 'kn'
              ? 'ನನ್ನ ಆರೈಕೆ ಪಯಣ'
              : currentLanguage === 'te'
              ? 'నా ఆరోగ్య ప్రయాణం'
              : 'My Care Journey',
        },
        {
          id: 'clarity',
          label:
            currentLanguage === 'kn'
              ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Clarity)'
              : currentLanguage === 'te'
              ? 'సులభంగా వివరించండి (Clarity)'
              : 'Explain It Simply',
        },
        {
          id: 'carecircle',
          label: 'CareCircle',
        },
        {
          id: 'passport',
          label:
            currentLanguage === 'kn'
              ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್'
              : currentLanguage === 'te'
              ? 'నా విజిట్ పాస్‌పోర్ట్'
              : 'My Visit Passport',
        },
      ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F5]/95 backdrop-blur-md border-b border-[#BEA06D]/30 transition-colors no-print">
      {/* Top utility bar for Accessibility & Comfort Mode */}
      <div className="bg-[#BEA06D]/15 border-b border-[#BEA06D]/20 px-4 py-1.5 text-xs text-[#3C3330]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#8F7242] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#A2B29B]" />
              {t.tagline}
            </span>
            {comfortSettings.guidedMode && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A6347]">
                <Compass className="w-3 h-3" />
                {currentLanguage === 'kn'
                  ? 'ಮಾರ್ಗದರ್ಶಿ ಸಕ್ರಿಯ'
                  : currentLanguage === 'te'
                  ? 'గైడెడ్ మోడ్ ఆన్'
                  : 'Guided Mode On'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onToggleComfortOpen}
              className={`compact-chip flex items-center gap-1.5 transition-colors py-0.5 px-2.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${
                comfortOpen
                  ? 'bg-[#BEA06D] text-white'
                  : 'text-[#3C3330] hover:text-[#8F7242]'
              }`}
              aria-expanded={comfortOpen}
              aria-label="Comfort Mode settings"
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${comfortOpen ? 'text-white' : 'text-[#BEA06D]'}`} />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಕಂಫರ್ಟ್ ಮೋಡ್'
                  : currentLanguage === 'te'
                  ? 'కంఫర్ట్ మోడ్'
                  : 'Comfort Mode'}
              </span>
            </button>

            <button
              onClick={onHighContrastToggle}
              className={`compact-chip flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${
                comfortSettings.highContrast ? 'bg-black text-yellow-300' : 'text-[#3C3330] hover:text-[#8F7242]'
              }`}
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-3.5 h-3.5 text-[#BEA06D]" />
              <span className="hidden sm:inline">{t.accessibility.highContrast}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Logo & Brand Lockup */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-3.5 text-left group shrink-0 focus:outline-none cursor-pointer"
            aria-label="CORE Home"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#BEA06D]/60 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={ASSETS.logoEmblem}
                alt="CORE Emblem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-[#3C3330] leading-none group-hover:text-[#8F7242] transition-colors">
                CORE
              </span>
              <span className="text-[10px] sm:text-xs text-[#8F7242] font-medium tracking-tight mt-0.5">
                {currentLanguage === 'kn' ? 'ಆರೋಗ್ಯ ಸೇತು' : currentLanguage === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Accessible Healthcare'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#3C3330]">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`compact-chip py-1 transition-colors whitespace-nowrap shrink-0 relative cursor-pointer ${
                  currentPage === item.id
                    ? 'text-[#8F7242] font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BEA06D] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Language Selector & Mobile Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent Three-Language Selector: Kannada | Telugu | English */}
            <div className="inline-flex items-center bg-white border-2 border-[#BEA06D]/40 rounded-full p-1 shadow-sm">
              <button
                onClick={() => onLanguageChange('kn')}
                className={`compact-chip px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentLanguage === 'kn'
                    ? 'bg-[#BEA06D] text-white shadow-sm font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
                aria-label="ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಿ (Select Kannada)"
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => onLanguageChange('te')}
                className={`compact-chip px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentLanguage === 'te'
                    ? 'bg-[#BEA06D] text-white shadow-sm font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
                aria-label="తెలుగు ఎంచుకోండి (Select Telugu)"
              >
                తెలుగు
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`compact-chip px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-[#BEA06D] text-white shadow-sm font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
                aria-label="Select English"
              >
                English
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden compact-chip p-2.5 rounded-xl border border-[#BEA06D]/30 text-[#3C3330] hover:bg-[#BEA06D]/10 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCF9F5] border-b border-[#BEA06D]/40 px-4 pt-3 pb-6 shadow-xl transition-all">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-xl font-medium text-base transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-[#BEA06D]/20 text-[#8F7242] font-semibold border-l-4 border-[#BEA06D]'
                    : 'text-[#3C3330] hover:bg-[#BEA06D]/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            {mobileExtraLinks.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#BEA06D]/20 grid grid-cols-2 gap-2">
                {mobileExtraLinks.map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => {
                      onPageChange(extra.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-left text-xs font-semibold border transition-colors cursor-pointer ${
                      currentPage === extra.id
                        ? 'bg-[#BEA06D] text-white border-[#BEA06D]'
                        : 'bg-white text-[#3C3330] border-[#BEA06D]/30'
                    }`}
                  >
                    {extra.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#BEA06D]/20 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider">
                {t.accessibility.textSize}:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onTextSizeChange('normal')}
                  className={`py-2 text-xs text-center rounded-lg border cursor-pointer ${
                    comfortSettings.textSize === 'normal' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-white text-[#3C3330]'
                  }`}
                >
                  {t.accessibility.normal}
                </button>
                <button
                  onClick={() => onTextSizeChange('large')}
                  className={`py-2 text-sm text-center rounded-lg border cursor-pointer ${
                    comfortSettings.textSize === 'large' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-white text-[#3C3330]'
                  }`}
                >
                  {t.accessibility.large}
                </button>
                <button
                  onClick={() => onTextSizeChange('xlarge')}
                  className={`py-2 text-base font-bold text-center rounded-lg border cursor-pointer ${
                    comfortSettings.textSize === 'xlarge' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-white text-[#3C3330]'
                  }`}
                >
                  {t.accessibility.extraLarge}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
