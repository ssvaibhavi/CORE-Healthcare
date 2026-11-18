import React from 'react';
import { RosewaterHeroComposition } from '../components/BotanicalMotifs';
import { Reveal, WordReveal } from '../components/Reveal';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TOOLKIT_LABELS } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  Volume2,
  Calendar,
  Bell,
  Phone,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CalendarClock,
  BookOpen,
  Users,
  FileCheck2,
  Compass,
  Mic,
  GraduationCap,
  GitBranch,
  SlidersHorizontal,
  BarChart3,
  Award
} from 'lucide-react';
import { ScenarioSpotlight } from '../components/ScenarioSpotlight';
import { DemoExperienceBar } from '../components/DemoExperienceBar';
import { QuickActionsBar } from '../components/QuickActionsBar';

interface HomeViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
  onLanguageChange?: (lang: Language) => void;
  onSelectPatient: (patientId: string) => void;
  onOpenComfortMode: () => void;
  onOpenCompanion?: () => void;
  onResetDemo: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  onPageChange,
  onLanguageChange,
  onSelectPatient,
  onOpenComfortMode,
  onOpenCompanion,
  onResetDemo,
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
      {/* Hero Section — CORE Rosewater Editorial */}
      <section className="relative overflow-hidden living-ivory-ambient border-b border-[#BEA06D]/25 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <Reveal delay={40}>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C88F98] tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
                  <span>CORE Rosewater</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#8A6D3F]">{t.tagline}</span>
                </div>
              </Reveal>

              {/* Marquee Headline with Delicate Word-by-Word Bloom */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#493C39] leading-[1.15] text-balance">
                <WordReveal text={t.hero.headline} />
              </h1>

              {/* Subtitle */}
              <Reveal delay={180}>
                <p className="text-base sm:text-lg lg:text-xl text-[#493C39]/85 max-w-2xl leading-relaxed">
                  {t.hero.subtitle}
                </p>
              </Reveal>

              {/* Two Prominent Action Buttons */}
              <Reveal delay={280}>
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => onPageChange('appointment')}
                    className="flex items-center justify-center gap-3 bg-[#BEA06D] hover:bg-[#8A6D3F] active:scale-[0.98] text-white font-semibold text-lg py-4 px-8 rounded-full shadow-sm transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
                    aria-label={t.hero.hearAppointmentBtn}
                  >
                    <Volume2 className="w-6 h-6" />
                    <span>{t.hero.hearAppointmentBtn}</span>
                  </button>

                  <button
                    onClick={() => onPageChange('appointment')}
                    className="flex items-center justify-center gap-3 bg-white hover:bg-[#FCF9F5] active:scale-[0.98] border border-[#C88F98]/70 text-[#493C39] hover:border-[#BEA06D] font-semibold text-lg py-4 px-8 rounded-full shadow-xs transition-all duration-300 cursor-pointer focus:outline-none"
                    aria-label={t.hero.viewAppointmentBtn}
                  >
                    <Calendar className="w-6 h-6 text-[#C88F98]" />
                    <span>{t.hero.viewAppointmentBtn}</span>
                  </button>
                </div>
              </Reveal>

              {/* Quick Language Reassurance */}
              <Reveal delay={360}>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#8A6D3F] font-medium">
                  <span>
                    {currentLanguage === 'kn'
                      ? 'ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಮತ್ತು ತೆಲುಗಿನಲ್ಲಿ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ.'
                      : currentLanguage === 'te'
                      ? 'ఇంగ్లీష్, కన్నడ మరియు తెలుగులో పూర్తి సమాచారం లభిస్తుంది.'
                      : 'Available natively in English, Kannada, and Telugu.'}
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Editorial SVG + CSS Botanical Composition (Zero Raster Photos) */}
            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <RosewaterHeroComposition
                  language={currentLanguage}
                  onHearSample={() => {
                    const sample =
                      currentLanguage === 'kn'
                        ? 'ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಧವಾರ ಬೆಳಗ್ಗೆ ಹತ್ತು ಮೂವತ್ತಕ್ಕೆ ಇದೆ.'
                        : currentLanguage === 'te'
                        ? 'నమస్కారం. మీ సిటి స్కాన్ అపాయింట్‌మెంట్ బుధవారం ఉదయం పదిన్నరకు ఉంది.'
                        : 'Hello. Your upcoming hospital appointment is scheduled for Wednesday morning at 10:30 AM.';
                    speechService.speak(sample, currentLanguage);
                  }}
                />
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Compact Non-Duplicative CORE Quick Actions */}
      <Reveal delay={60}>
        <QuickActionsBar
          currentLanguage={currentLanguage}
          onLanguageChange={(lang) => onLanguageChange?.(lang)}
          onPageChange={onPageChange}
          onOpenCompanion={() => onOpenCompanion?.()}
          onOpenComfortMode={onOpenComfortMode}
        />
      </Reveal>

      {/* "How CORE Helps" Section — 4 Staggered Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest block">
              {currentLanguage === 'kn' ? 'ಸರಳ ಸೌಲಭ್ಯಗಳು' : currentLanguage === 'te' ? 'సరళమైన సదుపాయాలు' : 'Gentle Accessibility'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#493C39] text-balance">
              {t.howItHelps.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#493C39]/80">
              {t.howItHelps.sectionSubtitle}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.howItHelps.cards.map((card, idx) => {
            const icons = [
              <Volume2 key="hear" className="w-7 h-7 text-[#BEA06D]" />,
              <Bell key="remind" className="w-7 h-7 text-[#C88F98]" />,
              <Calendar key="reschedule" className="w-7 h-7 text-[#A2B29B]" />,
              <Phone key="help" className="w-7 h-7 text-[#8A6D3F]" />,
            ];

            return (
              <Reveal key={card.id} delay={idx * 130}>
                <div
                  onClick={() => handleCardClick(card.id)}
                  className="group h-full p-6 bg-white border border-[#BEA06D]/30 hover:border-[#C88F98] rounded-3xl shadow-xs botanical-card-hover flex flex-col justify-between cursor-pointer focus:outline-none"
                >
                  <div className="space-y-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#FCF9F5] border border-[#E6C1C4]/70 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {icons[idx]}
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#493C39] group-hover:text-[#8A6D3F] transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-sm text-[#493C39]/80 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#BEA06D]/15 flex items-center justify-between text-sm font-semibold text-[#8A6D3F]">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Reveal>
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

      {/* CORE Patient Toolkit — Staggered Editorial Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest block">
              {TOOLKIT_LABELS.sectionKicker[currentLanguage]}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#493C39] text-balance">
              {TOOLKIT_LABELS.sectionTitle[currentLanguage]}
            </h2>
            <p className="text-sm sm:text-base text-[#493C39]/80">
              {TOOLKIT_LABELS.sectionSubtitle[currentLanguage]}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLKIT_LABELS.items.map((item, idx) => {
            const toolkitIcons = [
              <CalendarClock key="journey" className="w-7 h-7 text-[#8A6D3F]" />,
              <BookOpen key="clarity" className="w-7 h-7 text-[#4A6347]" />,
              <Users key="carecircle" className="w-7 h-7 text-[#C88F98]" />,
              <FileCheck2 key="passport" className="w-7 h-7 text-[#BEA06D]" />,
            ];

            return (
              <Reveal key={item.id} delay={idx * 140} className="h-full">
                <button
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  className="group w-full h-full text-left p-6 bg-white border border-[#BEA06D]/35 hover:border-[#C88F98] rounded-3xl shadow-xs botanical-card-hover flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                >
                  <div className="space-y-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-[#FCF9F5] border border-[#E6C1C4]/70 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {toolkitIcons[idx]}
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#493C39] group-hover:text-[#8A6D3F] transition-colors">
                      {item.title[currentLanguage]}
                    </h3>
                    <p className="text-sm text-[#493C39]/80 leading-relaxed">
                      {item.desc[currentLanguage]}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#BEA06D]/15 flex items-center justify-between text-sm font-semibold text-[#8A6D3F] w-full">
                    <span>{item.cta[currentLanguage]}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Explore Interactive Demo Bar with Reset Demo */}
      <Reveal delay={80}>
        <DemoExperienceBar
          language={currentLanguage}
          onPageChange={onPageChange}
          onSelectDemoPatient={() => onSelectPatient('APT-2026-4289')}
          onOpenComfortMode={onOpenComfortMode}
          onResetDemo={onResetDemo}
        />
      </Reveal>

      {/* Phase 2–4: CORE Advanced Innovation Suite */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಮುಂದುವರಿದ ಪ್ರವೇಶ್ಯತೆ ವ್ಯವಸ್ಥೆ'
                : currentLanguage === 'te'
                ? 'అధునాతన యాక్సెసిబిలిటీ సూట్'
                : 'Adaptive Accessibility Suite'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
              {currentLanguage === 'kn'
                ? 'CORE ನಾವೀನ್ಯತೆ ಮತ್ತು ಬುದ್ಧಿವಂತ ಮಾರ್ಗದರ್ಶನ'
                : currentLanguage === 'te'
                ? 'CORE ఇన్నోవేషన్ & అడాప్టివ్ మార్గదర్శకత్వం'
                : 'Intelligent & Inclusive Care Tools'}
            </h2>
            <p className="text-sm sm:text-base text-[#3C3330]/80">
              {currentLanguage === 'kn'
                ? 'ವೈಯಕ್ತಿಕ ಮಾರ್ಗ, ಧ್ವನಿ ಸೇತು, ತಿಳುವಳಿಕೆ ಪರೀಕ್ಷೆ, ನಿರ್ಧಾರ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಬೆಂಬಲ ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ.'
                : currentLanguage === 'te'
                ? 'వ్యక్తిగత దారి, వాయిస్ సహాయం, అవగాహన క్విజ్, నిర్ణయ వృక్షం మరియు ఆఫ్‌లైన్ సదుపాయం ఒకే చోట.'
                : 'Adaptive navigation pathways, multilingual speech guidance, Teach-Back literacy checks, decision trees, and usability testing.'}
            </p>
          </div>
        </Reveal>

        {/* Highlight Banner for 8-Step Innovation Showcase & Care Stories */}
        <Reveal delay={100}>
          <div className="mb-6 bg-gradient-to-r from-[#BEA06D]/20 via-[#FCF9F5] to-[#A2B29B]/20 border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BEA06D]/40 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#8F7242]" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
                  {currentLanguage === 'kn'
                    ? 'ಮೌಲ್ಯಮಾಪನ ಮಾರ್ಗದರ್ಶಿ • 8 ಹಂತಗಳು & ಆರೈಕೆ ಕಥೆಗಳು'
                    : currentLanguage === 'te'
                    ? 'మూల్యాంకన పర్యటన • 8 దశలు & కేర్ స్టోరీస్'
                    : 'Guided Walkthrough & Fictional Personas'}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#3C3330]">
                  {currentLanguage === 'kn'
                    ? 'CORE ನಾವೀನ್ಯತೆ ಪ್ರದರ್ಶನ ಮತ್ತು ಆರೈಕೆ ಕಥೆಗಳು'
                    : currentLanguage === 'te'
                    ? 'CORE ఇన్నోవేషన్ షోకేస్ మరియు కేర్ స్టోరీస్'
                    : 'CORE Innovation Showcase & Care Stories'}
                </h3>
                <p className="text-xs sm:text-sm text-[#3C3330]/80 max-w-2xl">
                  {currentLanguage === 'kn'
                    ? 'ಭಾಷೆ ಆಯ್ಕೆಯಿಂದ ಆರೈಕೆದಾರರ ಸಾರಾಂಶದವರೆಗೆ CORE ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಮತ್ತು ಕಾಲ್ಪನಿಕ ರೋಗಿ ಕಥೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.'
                    : currentLanguage === 'te'
                    ? 'భాష ఎంపిక నుండి సంరక్షకుల సారాంశం వరకు CORE ఫీచర్లు మరియు కల్పిత రోగి కథలను పరీక్షించండి.'
                    : 'Test the 8-step accessibility journey or explore 3 interactive fictional Care Stories to see how CORE adapts live.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onPageChange('stories')}
                className="py-3 px-5 rounded-full bg-white hover:bg-[#FCF9F5] border border-[#C88F98] text-[#493C39] text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#C88F98]" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಆರೈಕೆ ಕಥೆಗಳು'
                    : currentLanguage === 'te'
                    ? 'కేర్ స్టోరీస్'
                    : 'Care Stories'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onPageChange('showcase')}
                className="py-3 px-6 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಪ್ರದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'షోకేస్ ప్రారంభించండి'
                    : 'Launch Showcase'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* 8 Interactive Rosewater Suite Cards with Slow Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(
            [
              {
                id: 'intelligence' as PageView,
                icon: <Sparkles className="w-6 h-6 text-[#BEA06D]" />,
                title: 'CORE Intelligence',
                desc: {
                  kn: '6 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಂದ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಭೇಟಿ ಮಾರ್ಗವನ್ನು ಪಡೆಯಿರಿ.',
                  te: '6 సులభ ప్రశ్నలతో మీ వ్యక్తిగత ఆసుపత్రి దారిని పొందండి.',
                  en: 'Adaptive 6-question onboarding with transparent pathway reasoning.',
                },
              },
              {
                id: 'voicebridge' as PageView,
                icon: <Mic className="w-6 h-6 text-[#4A6347]" />,
                title: 'CORE VoiceBridge',
                desc: {
                  kn: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಂವಾದ, ಮರುಕೇಳುವಿಕೆ ಮತ್ತು ಸರಳ ವಿವರಣೆ.',
                  te: 'బహుభాషా వాయిస్ సంభాషణ, రిప్లే మరియు సులభ వివరణ.',
                  en: 'Multilingual speech recognition, spoken replay & text fallbacks.',
                },
              },
              {
                id: 'sense' as PageView,
                icon: <GraduationCap className="w-6 h-6 text-[#8A6D3F]" />,
                title: 'CORE Sense',
                desc: {
                  kn: 'ತಿಳುವಳಿಕೆ ರಸಪ್ರಶ್ನೆ, Teach-Back ಮತ್ತು 5-ಹಂತದ ಭೇಟಿ ಚಿತ್ರ.',
                  te: 'అవగాహన క్విజ్, Teach-Back మరియు 5-దశల ఆసుపత్రి మార్గదర్శి.',
                  en: 'Plain-language literacy quiz, Teach-Back & 5-step process map.',
                },
              },
              {
                id: 'carecompass' as PageView,
                icon: <Compass className="w-6 h-6 text-[#BEA06D]" />,
                title: 'CORE CareCompass',
                desc: {
                  kn: 'ಸಂಪಾದಿಸಬಹುದಾದ ಸಿದ್ಧತಾ ಪಟ್ಟಿ ಮತ್ತು .ics ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ.',
                  te: 'మార్చుకోగల సన్నద్ధత జాబితా మరియు .ics క్యాలెండర్ రిమైండర్.',
                  en: 'Categorized visit checklist, readiness gauge & .ics calendar export.',
                },
              },
              {
                id: 'careflow' as PageView,
                icon: <GitBranch className="w-6 h-6 text-[#C88F98]" />,
                title: 'CORE CareFlow',
                desc: {
                  kn: 'ಆಸ್ಪತ್ರೆಯ ವಿಳಂಬ ಅಥವಾ ಗೊಂದಲಕ್ಕೆ ಹಂತ-ಹಂತದ ನಿರ್ಧಾರ ವೃಕ್ಷ.',
                  te: 'ఆలస్యం లేదా గది సందేహాలకు దశలవారీ నిర్ణయ వృక్ష సహాయం.',
                  en: 'Interactive decision-tree simulator for common clinic hurdles.',
                },
              },
              {
                id: 'accessibility-lab' as PageView,
                icon: <SlidersHorizontal className="w-6 h-6 text-[#4A6347]" />,
                title: 'Accessibility Lab',
                desc: {
                  kn: '5 ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ನೇರವಾಗಿ ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಅನ್ವಯಿಸಿ.',
                  te: '5 విభిన్న యాక్సెసిబిలిటీ ప్రొఫైల్స్‌ను ప్రత్యక్షంగా పరీక్షించండి.',
                  en: 'Compare and live-test 5 accessibility & low-literacy UI profiles.',
                },
              },
              {
                id: 'insights' as PageView,
                icon: <BarChart3 className="w-6 h-6 text-[#8A6D3F]" />,
                title: 'CORE Insights',
                desc: {
                  kn: 'ವೈಯಕ್ತಿಕ ಡೇಟಾ ಇಲ್ಲದ ನೈತಿಕ ಬಳಕೆಯ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸುಧಾರಣೆಗಳು.',
                  te: 'వ్యక్తిగత డేటా లేని నైతిక వినియోగ విశ్లేషణ మరియు సూచనలు.',
                  en: 'Ethical, zero-PII demonstration usability metrics & charts.',
                },
              },
              {
                id: 'carecircle' as PageView,
                icon: <Users className="w-6 h-6 text-[#C88F98]" />,
                title: 'CORE Connect',
                desc: {
                  kn: 'ರೋಗಿಯ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ಮಾತ್ರ ಆರೈಕೆದಾರರ ಸಾರಾಂಶ ಡೌನ್‌ಲೋಡ್.',
                  te: 'రోగి అనుమతితో మాత్రమే సంరక్షకుల సారాంశం మరియు ప్రింట్.',
                  en: 'Consented caregiver handoff summary & downloadable .txt view.',
                },
              },
            ] as const
          ).map((mod, idx) => (
            <Reveal key={mod.id} delay={(idx % 4) * 120} className="h-full">
              <button
                type="button"
                onClick={() => onPageChange(mod.id)}
                className="group w-full h-full text-left p-5 bg-white border border-[#BEA06D]/30 hover:border-[#C88F98] rounded-3xl shadow-xs botanical-card-hover flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FCF9F5] border border-[#E6C1C4]/70 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {mod.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#493C39] group-hover:text-[#8A6D3F] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#493C39]/80 leading-relaxed">
                    {mod.desc[currentLanguage]}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-[#BEA06D]/15 flex items-center justify-between text-xs font-bold text-[#8A6D3F]">
                  <span>
                    {currentLanguage === 'kn' ? 'ತೆರೆಯಿರಿ' : currentLanguage === 'te' ? 'తెరవండి' : 'Explore'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophical Reassurance Banner */}
      <Reveal delay={120}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#E6C1C4]/25 via-[#FCF9F5] to-[#A2B29B]/20 border border-[#BEA06D]/35 rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <HeartHandshake className="w-12 h-12 text-[#C88F98] mx-auto" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39] max-w-2xl mx-auto text-balance">
              {t.about.philosophyQuote}
            </h3>
            <p className="text-sm sm:text-base text-[#493C39]/80 max-w-xl mx-auto">
              {currentLanguage === 'kn'
                ? 'ಹಳ್ಳಿಯ ಬಡ ಹಿರಿಯರಿಗೆ ಆಸ್ಪತ್ರೆ ತಂತ್ರಜ್ಞಾನ ಹೊರೆಯಾಗಬಾರದು. ನಾವು ಪ್ರತಿ ಹಂತದಲ್ಲೂ ಗೌರವ ಮತ್ತು ಸರಳತೆಯನ್ನು ನೀಡುತ್ತೇವೆ.'
                : currentLanguage === 'te'
                ? 'గ్రామీణ ప్రాంతాల వృద్ధులకు సాంకేతికత భారంగా మారకూడదు. ప్రతి అడుగులో ఆత్మగౌరవం మరియు సులభతరం అందించడమే మా లక్ష్యం.'
                : 'Technology should never be a barrier to healing. We build for dignity, independence, and simplicity.'}
            </p>
          </div>
        </section>
      </Reveal>
    </div>
  );
};
