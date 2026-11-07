import React from 'react';
import { ASSETS } from '../assets/images';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Volume2, Calendar, Bell, Clock, Phone, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ScenarioSpotlight } from '../components/ScenarioSpotlight';

interface HomeViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
  onSelectPatient: (patientId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  onPageChange,
  onSelectPatient,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const handleCardClick = (cardId: string) => {
    if (cardId === 'hear') onPageChange('appointment');
    else if (cardId === 'remind') onPageChange('reminders');
    else if (cardId === 'reschedule') onPageChange('reschedule');
    else if (cardId === 'help') onPageChange('help');
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FCF9F5] via-[#FCF9F5] to-white border-b border-[#BEA06D]/20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Subtle Trust Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BEA06D]/15 border border-[#BEA06D]/30 text-xs font-semibold text-[#8F7242]">
                <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
                <span>{t.tagline}</span>
              </div>

              {/* Marquee Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3C3330] leading-[1.15] text-balance">
                {t.hero.headline}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-[#3C3330]/85 max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onPageChange('appointment')}
                  className="flex items-center justify-center gap-3 bg-[#BEA06D] hover:bg-[#8F7242] active:scale-[0.98] text-white font-semibold text-lg py-4 px-8 rounded-full shadow-lg shadow-[#BEA06D]/30 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
                  aria-label={t.hero.hearAppointmentBtn}
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>{t.hero.hearAppointmentBtn}</span>
                </button>

                <button
                  onClick={() => onPageChange('appointment')}
                  className="flex items-center justify-center gap-3 bg-white hover:bg-[#FCF9F5] active:scale-[0.98] border-2 border-[#BEA06D]/60 text-[#3C3330] hover:text-[#8F7242] font-semibold text-lg py-4 px-8 rounded-full shadow-sm transition-all cursor-pointer focus:outline-none"
                  aria-label={t.hero.viewAppointmentBtn}
                >
                  <Calendar className="w-6 h-6 text-[#BEA06D]" />
                  <span>{t.hero.viewAppointmentBtn}</span>
                </button>
              </div>

              {/* Quick Language Reassurance */}
              <div className="pt-3 flex items-center gap-3 text-xs text-[#8F7242] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A2B29B]" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಕನ್ನಡ, ತೆಲುಗು ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ.'
                    : currentLanguage === 'te'
                    ? 'తెలుగు, కన్నడ మరియు ఇంగ్లీషులో పూర్తి సమాచారం లభిస్తుంది.'
                    : 'Available natively in Kannada, Telugu, and English.'}
                </span>
              </div>
            </div>

            {/* Right Visual Composition with Logo & Rural Care Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background botanical glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#E6C1C4]/40 via-[#BEA06D]/20 to-[#A2B29B]/30 rounded-3xl blur-2xl -z-10" />

                {/* Main Image Frame */}
                <div className="rounded-3xl overflow-hidden border-2 border-[#BEA06D]/40 shadow-xl bg-white aspect-[4/3] sm:aspect-[16/10] relative">
                  <img
                    src={ASSETS.heroElderlyCare}
                    alt="Elderly rural patient receiving compassionate guidance"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Logo Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#BEA06D]/50 shadow-lg flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#BEA06D]/40">
                      <img
                        src={ASSETS.logoEmblem}
                        alt="CORE Emblem"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="pr-2">
                      <span className="font-display font-bold text-sm text-[#3C3330] block leading-none">CORE</span>
                      <span className="text-[10px] text-[#8F7242] font-medium">Accessibility</span>
                    </div>
                  </div>

                  {/* Bottom Caption Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FCF9F5]/95 backdrop-blur-sm p-3 rounded-2xl border border-[#BEA06D]/30 shadow-md">
                    <p className="text-xs sm:text-sm font-semibold text-[#3C3330] leading-snug">
                      {currentLanguage === 'kn'
                        ? '“ನನ್ನ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡಿದಾಗ ನನಗೆ ಧೈರ್ಯ ಬಂತು.”'
                        : currentLanguage === 'te'
                        ? '“నా ఫోన్‌లో తెలుగులోనే మాట్లాడినప్పుడు నాకు ఎంతో ధైర్యం వచ్చింది.”'
                        : '“When the phone spoke to me in my mother tongue, all confusion vanished.”'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* "How CORE Helps" Section — 4 Large Illustrated Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ಸರಳ ಸೌಲಭ್ಯಗಳು' : currentLanguage === 'te' ? 'సరళమైన సదుపాయాలు' : 'Simple Accessibility'}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
            {t.howItHelps.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {t.howItHelps.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.howItHelps.cards.map((card, idx) => {
            const icons = [
              <Volume2 key="hear" className="w-8 h-8 text-[#BEA06D]" />,
              <Bell key="remind" className="w-8 h-8 text-[#C98897]" />,
              <Calendar key="reschedule" className="w-8 h-8 text-[#A2B29B]" />,
              <Phone key="help" className="w-8 h-8 text-[#8F7242]" />,
            ];

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="group p-6 bg-white border border-[#BEA06D]/30 hover:border-[#BEA06D] rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer focus:outline-none"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {icons[idx]}
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#3C3330] group-hover:text-[#8F7242] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#3C3330]/80 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#BEA06D]/15 flex items-center justify-between text-sm font-semibold text-[#8F7242]">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-World Patient Scenario Spotlight (Basappa Gowda) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScenarioSpotlight
          language={currentLanguage}
          onExploreDemo={() => {
            onSelectPatient('APT-2026-4289');
            onPageChange('appointment');
          }}
          onPageChange={onPageChange}
        />
      </div>

      {/* Philosophical Reassurance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#BEA06D]/15 via-[#FCF9F5] to-[#A2B29B]/15 border border-[#BEA06D]/30 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <HeartHandshake className="w-12 h-12 text-[#8F7242] mx-auto" />
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330] max-w-2xl mx-auto">
            {t.about.philosophyQuote}
          </h3>
          <p className="text-sm sm:text-base text-[#3C3330]/80 max-w-xl mx-auto">
            {currentLanguage === 'kn'
              ? 'ಹಳ್ಳಿಯ ಬಡ ಹಿರಿಯರಿಗೆ ಆಸ್ಪತ್ರೆ ತಂತ್ರಜ್ಞಾನ ಹೊರೆಯಾಗಬಾರದು. ನಾವು ಪ್ರತಿ ಹಂತದಲ್ಲೂ ಗೌರವ ಮತ್ತು ಸರಳತೆಯನ್ನು ನೀಡುತ್ತೇವೆ.'
              : currentLanguage === 'te'
              ? 'గ్రామీణ ప్రాంతాల వృద్ధులకు సాంకేతికత భారంగా మారకూడదు. ప్రతి అడుగులో ఆత్మగౌరవం మరియు సులభతరం అందించడమే మా లక్ష్యం.'
              : 'Technology should never be a barrier to healing. We build for dignity, independence, and simplicity.'}
          </p>
        </div>
      </section>
    </div>
  );
};
