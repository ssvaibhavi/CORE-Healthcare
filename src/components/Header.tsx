import React, { useState, useEffect, useRef } from 'react';
import { CoreMonogramMark } from './BotanicalMotifs';
import { ComfortSettings, Language, PageView, TextSize } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { OfflineIndicator } from './OfflineIndicator';
import { PWAInstallButton } from './PWAInstallButton';
import { Eye, Menu, X, SlidersHorizontal, Compass, Sparkles, ChevronDown, Search } from 'lucide-react';

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
  onOpenSearch?: () => void;
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
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suiteMenuOpen, setSuiteMenuOpen] = useState(false);
  const suiteRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLanguage];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSuiteMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (suiteRef.current && !suiteRef.current.contains(e.target as Node)) {
        setSuiteMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const suiteLinks: Array<{ id: PageView; label: string; tag?: string }> = [
    {
      id: 'showcase',
      label:
        currentLanguage === 'kn'
          ? 'CORE ನಾವೀನ್ಯತೆ ಪ್ರದರ್ಶನ (Showcase)'
          : currentLanguage === 'te'
          ? 'CORE ఇన్నోవేషన్ షోకేస్'
          : 'Innovation Showcase (8-Step)',
      tag: 'Demo',
    },
    {
      id: 'stories',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಆರೈಕೆ ಕಥೆಗಳು (Care Stories)'
          : currentLanguage === 'te'
          ? 'CORE కేర్ స్టోరీస్ (Care Stories)'
          : 'CORE Care Stories (Personas)',
    },
    {
      id: 'intelligence',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಇಂಟೆಲಿಜೆನ್ಸ್ (ವೈಯಕ್ತಿಕ ಮಾರ್ಗ)'
          : currentLanguage === 'te'
          ? 'CORE ఇంటెలిజెన్స్ (వ్యక్తిగత దారి)'
          : 'CORE Intelligence (Adaptive Path)',
    },
    {
      id: 'voicebridge',
      label:
        currentLanguage === 'kn'
          ? 'CORE ವಾಯ್ಸ್‌ಬ್ರಿಡ್ಜ್ (ಧ್ವನಿ ಸೇತು)'
          : currentLanguage === 'te'
          ? 'CORE వాయిస్‌బ్రిడ్జ్ (వాయిస్ సహాయం)'
          : 'CORE VoiceBridge (Speech Bridge)',
    },
    {
      id: 'sense',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಸೆನ್ಸ್ (ತಿಳುವಳಿಕೆ ಮತ್ತು ರಸಪ್ರಶ್ನೆ)'
          : currentLanguage === 'te'
          ? 'CORE సెన్స్ (అవగాహన & క్విజ్)'
          : 'CORE Sense (Teach-Back & Quiz)',
    },
    {
      id: 'carecompass',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಕೇರ್‌ಕಂಪಾಸ್ (ಸಿದ್ಧತಾ ಯೋಜನೆ)'
          : currentLanguage === 'te'
          ? 'CORE కేర్‌కంపాస్ (సన్నద్ధత)'
          : 'CORE CareCompass (Visit Prep)',
    },
    {
      id: 'careflow',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಕೇರ್‌ಫ್ಲೋ (ನಿರ್ಧಾರ ಮಾರ್ಗದರ್ಶಿ)'
          : currentLanguage === 'te'
          ? 'CORE కేర్‌ఫ్లో (నిర్ణయ వృక్షం)'
          : 'CORE CareFlow (Decision Tree)',
    },
    {
      id: 'accessibility-lab',
      label:
        currentLanguage === 'kn'
          ? 'ಪ್ರವೇಶ್ಯತೆ ಪ್ರಯೋಗಾಲಯ (Lab)'
          : currentLanguage === 'te'
          ? 'యాక్సెసిబిలిటీ ల్యాబ్ (Lab)'
          : 'Accessibility Lab',
    },
    {
      id: 'insights',
      label:
        currentLanguage === 'kn'
          ? 'CORE ಒಳನೋಟಗಳು (Insights)'
          : currentLanguage === 'te'
          ? 'CORE ఇన్‌సైట్స్ (విశ్లేషణ)'
          : 'CORE Insights (Usability Analytics)',
    },
  ];

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
        ...suiteLinks.map((s) => ({ id: s.id, label: s.label })),
      ];

  return (
    <header className="sticky top-0 z-40 max-w-full overflow-x-clip bg-[#FCF9F5]/95 backdrop-blur-md border-b border-[#BEA06D]/30 transition-colors no-print">
      {/* Top utility bar for Accessibility & Comfort Mode */}
      <div className="bg-[#BEA06D]/15 border-b border-[#BEA06D]/20 px-3 sm:px-4 py-1.5 text-xs text-[#3C3330]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-medium text-[#8F7242] truncate max-w-[210px] sm:max-w-none">
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

          <div className="flex items-center flex-wrap justify-end gap-2 sm:gap-3">
            <OfflineIndicator language={currentLanguage} compact />
            <PWAInstallButton language={currentLanguage} />

            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="compact-chip flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-white/85 border border-[#BEA06D]/40 text-[#493C39] hover:border-[#C88F98] hover:text-[#8A6D3F] font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                aria-label={
                  currentLanguage === 'kn'
                    ? 'CORE ಸ್ಮಾರ್ಟ್ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ'
                    : currentLanguage === 'te'
                    ? 'CORE స్మార్ట్ సెర్చ్ తెరవండి'
                    : 'Open CORE Smart Search (Ctrl+K)'
                }
              >
                <Search className="w-3 h-3 text-[#BEA06D]" />
                <span>
                  {currentLanguage === 'kn' ? 'ಹುಡುಕಿ' : currentLanguage === 'te' ? 'వెతకండి' : 'Search'}
                </span>
                <kbd className="hidden md:inline text-[10px] text-[#8A6D3F]/80 font-sans">⌘K</kbd>
              </button>
            )}

            {!comfortSettings.simplifiedNav && (
              <div className="relative" ref={suiteRef}>
                <button
                  type="button"
                  onClick={() => setSuiteMenuOpen((o) => !o)}
                  className={`compact-chip flex items-center gap-1 py-0.5 px-2.5 rounded-full font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${
                    suiteLinks.some((s) => s.id === currentPage)
                      ? 'bg-[#4A6347] text-white'
                      : 'bg-white/80 border border-[#BEA06D]/40 text-[#8F7242] hover:bg-[#BEA06D]/15'
                  }`}
                  aria-expanded={suiteMenuOpen}
                  aria-haspopup="menu"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {currentLanguage === 'kn'
                      ? 'CORE ಸೂಟ್'
                      : currentLanguage === 'te'
                      ? 'CORE సూట్'
                      : 'CORE Suite'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {suiteMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 bg-[#FCF9F5] border-2 border-[#BEA06D] rounded-2xl shadow-xl p-2 z-50 space-y-1"
                  >
                    {suiteLinks.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onPageChange(item.id);
                          setSuiteMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          currentPage === item.id
                            ? 'bg-[#BEA06D] text-white'
                            : 'text-[#3C3330] hover:bg-[#BEA06D]/15'
                        }`}
                      >
                        <span className="leading-snug">{item.label}</span>
                        {item.tag && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              currentPage === item.id
                                ? 'bg-white/25 text-white'
                                : 'bg-[#4A6347]/15 text-[#4A6347]'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-20 py-2 gap-2 sm:gap-3 min-w-0">
          {/* Zone 1: Logo & Brand Lockup */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group shrink-0 focus:outline-none cursor-pointer"
            aria-label="CORE Home"
          >
            <CoreMonogramMark size="md" className="group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-3xl font-bold tracking-wider text-[#493C39] leading-none group-hover:text-[#8A6D3F] transition-colors">
                CORE
              </span>
              <span className="text-[10px] sm:text-xs text-[#C88F98] font-medium tracking-tight mt-0.5 whitespace-nowrap">
                {currentLanguage === 'kn' ? 'ಆರೋಗ್ಯ ಸೇತು' : currentLanguage === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Rosewater Care'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center flex-wrap gap-x-3.5 xl:gap-x-6 gap-y-1 text-[13px] xl:text-sm font-medium text-[#3C3330] min-w-0">
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Prominent Three-Language Selector: English | Kannada | Telugu */}
            <div className="inline-flex items-center bg-white border-2 border-[#BEA06D]/40 rounded-full p-0.5 sm:p-1 shadow-sm">
              <button
                onClick={() => onLanguageChange('en')}
                className={`compact-chip px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-[#BEA06D] text-white shadow-sm font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
                aria-label="Select English"
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('kn')}
                className={`compact-chip px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
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
                className={`compact-chip px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  currentLanguage === 'te'
                    ? 'bg-[#BEA06D] text-white shadow-sm font-semibold'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
                aria-label="తెలుగు ఎంచుకోండి (Select Telugu)"
              >
                తెలుగు
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
