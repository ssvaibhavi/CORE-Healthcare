import React from 'react';
import { Language, PageView, ShowcaseProgress } from '../types';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  FileCheck2,
  GitBranch,
  GraduationCap,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Users
} from 'lucide-react';

interface ShowcaseViewProps {
  currentLanguage: Language;
  progress: ShowcaseProgress;
  onToggleMilestone: (key: keyof ShowcaseProgress) => void;
  onResetShowcase: () => void;
  onPageChange: (page: PageView) => void;
  onOpenComfortMode: () => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  currentLanguage,
  progress,
  onToggleMilestone,
  onResetShowcase,
  onPageChange,
  onOpenComfortMode,
}) => {
  const milestones: Array<{
    key: keyof ShowcaseProgress;
    stepNum: number;
    title: Record<Language, string>;
    desc: Record<Language, string>;
    targetPage?: PageView;
    onLaunch: () => void;
    icon: React.ReactNode;
  }> = [
    {
      key: 'languageAndAccessibility',
      stepNum: 1,
      title: {
        kn: 'ಭಾಷೆ ಮತ್ತು ಕಂಫರ್ಟ್ ಸೆಟ್ಟಿಂಗ್ ಆಯ್ಕೆ',
        te: 'భాష మరియు కంఫర్ట్ సెట్టింగ్స్ ఎంపిక',
        en: '1. Choose Language & Accessibility Settings',
      },
      desc: {
        kn: 'ಕನ್ನಡ, ತೆಲುಗು ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಆರಿಸಿ ಮತ್ತು Accessibility Lab / Comfort Mode ಪರೀಕ್ಷಿಸಿ.',
        te: 'తెలుగు, కన్నడ లేదా ఇంగ్లీష్ ఎంచుకొని Accessibility Lab / Comfort Mode చూడండి.',
        en: 'Configure language, text size, contrast, or test a profile in Accessibility Lab.',
      },
      targetPage: 'accessibility-lab',
      onLaunch: () => {
        onToggleMilestone('languageAndAccessibility');
        onPageChange('accessibility-lab');
      },
      icon: <SlidersHorizontal className="w-5 h-5 text-[#8F7242]" />,
    },
    {
      key: 'carePathway',
      stepNum: 2,
      title: {
        kn: 'ವೈಯಕ್ತಿಕ ಆರೈಕೆ ಪಥ (CORE Intelligence)',
        te: 'వ్యక్తిగత ఆరోగ్య పథం (CORE Intelligence)',
        en: '2. Receive Personalized Care Pathway',
      },
      desc: {
        kn: 'ನಿಮ್ಮ ಭೇಟಿಯ ಅನುಭವಕ್ಕೆ ತಕ್ಕಂತೆ ನಿಯಮ-ಆಧಾರಿತ ಹಂತಗಳನ್ನು ರಚಿಸಿ.',
        te: 'మీ అనుభవానికి అనుగుణంగా వ్యక్తిగత దశలను రూపొందించుకోండి.',
        en: 'Complete optional onboarding and view transparent "Why am I seeing this?" rules.',
      },
      targetPage: 'intelligence',
      onLaunch: () => {
        onToggleMilestone('carePathway');
        onPageChange('intelligence');
      },
      icon: <Compass className="w-5 h-5 text-[#BEA06D]" />,
    },
    {
      key: 'careFlowProblem',
      stepNum: 3,
      title: {
        kn: 'ಆಸ್ಪತ್ರೆ ನ್ಯಾವಿಗೇಷನ್ ಸನ್ನಿವೇಶ (CORE CareFlow)',
        te: 'ఆసుపత్రి నావిగేషన్ సిమ్యులేటర్ (CORE CareFlow)',
        en: '3. Solve a Hospital-Navigation Problem',
      },
      desc: {
        kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮರೆತಾಗ ಅಥವಾ ನೋಂದಣಿ ಗೊಂದಲದಲ್ಲಿ ಶಾಖೆ-ನಿರ್ಧಾರ ಮರವನ್ನು ಬಳಸಿ.',
        te: 'అపాయింట్‌మెంట్ మర్చిపోయినా లేదా రిజిస్ట్రేషన్ కష్టమైనా డెసిషన్ ట్రీ వాడండి.',
        en: 'Step through a branching decision scenario and visualize "Show My Path".',
      },
      targetPage: 'careflow',
      onLaunch: () => {
        onToggleMilestone('careFlowProblem');
        onPageChange('careflow');
      },
      icon: <GitBranch className="w-5 h-5 text-[#C98897]" />,
    },
    {
      key: 'senseUnderstanding',
      stepNum: 4,
      title: {
        kn: 'ಸೂಚನೆಗಳ ತಿಳುವಳಿಕೆ (CORE Sense)',
        te: 'సూచనల అవగాహన (CORE Sense)',
        en: '4. Practice Understanding with CORE Sense',
      },
      desc: {
        kn: 'ಸರಳ ವಿವರಣೆ ಓದಿ, ಸಣ್ಣ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಹೇಳಿ.',
        te: 'సులభ వివరణ చదివి, చిన్న ప్రశ్నకు జవాబిచ్చి మీ మాటలలో చెప్పండి.',
        en: 'Complete a Plain-Language term check and Teach-Back reflection.',
      },
      targetPage: 'sense',
      onLaunch: () => {
        onToggleMilestone('senseUnderstanding');
        onPageChange('sense');
      },
      icon: <GraduationCap className="w-5 h-5 text-[#4A6347]" />,
    },
    {
      key: 'careCompassChecklist',
      stepNum: 5,
      title: {
        kn: 'ಸಿದ್ಧತಾ ಚೆಕ್‌ಲಿಸ್ಟ್ (CORE CareCompass)',
        te: 'సందర్శన తయారీ జాబితా (CORE CareCompass)',
        en: '5. Complete Visit Preparation Checklist',
      },
      desc: {
        kn: 'ದಾಖಲೆಗಳು, ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ (.ics) ಜ್ಞಾಪನೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ.',
        te: 'పత్రాలు, ప్రశ్నలు మరియు క్యాలెండర్ (.ics) రిమైండర్ సిద్ధం చేయండి.',
        en: 'Check organizational preparation tasks and optionally export an .ics reminder.',
      },
      targetPage: 'carecompass',
      onLaunch: () => {
        onToggleMilestone('careCompassChecklist');
        onPageChange('carecompass');
      },
      icon: <Sparkles className="w-5 h-5 text-[#8F7242]" />,
    },
    {
      key: 'visitPassport',
      stepNum: 6,
      title: {
        kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ರಚಿಸಿ',
        te: 'నా విజిట్ పాస్‌పోర్ట్ సిద్ధం చేయండి',
        en: '6. Generate a Visit Passport',
      },
      desc: {
        kn: 'ಪ್ರಿಂಟ್ ಅಥವಾ PDF ಆಗಿ ಉಳಿಸಬಹುದಾದ ಸುಂದರ ಆಸ್ಪತ್ರೆ ಭೇಟಿ ಕಾರ್ಡ್ ನೋಡಿ.',
        te: 'ప్రింట్ లేదా PDF చేసుకోగల ఆసుపత్రి సందర్శన కార్డును చూడండి.',
        en: 'Inspect your printable botanical appointment preparation card.',
      },
      targetPage: 'passport',
      onLaunch: () => {
        onToggleMilestone('visitPassport');
        onPageChange('passport');
      },
      icon: <FileCheck2 className="w-5 h-5 text-[#BEA06D]" />,
    },
    {
      key: 'caregiverHandoff',
      stepNum: 7,
      title: {
        kn: 'ಆರೈಕೆದಾರರ ಹ್ಯಾಂಡ್‌ಆಫ್ (CareCircle Connect)',
        te: 'సంరక్షకుడి హ్యాండ్‌ఆఫ్ (CareCircle Connect)',
        en: '7. Preview Patient-Consented Caregiver Handoff',
      },
      desc: {
        kn: 'ರೋಗಿಯ ಸ್ಪಷ್ಟ ಸಮ್ಮತಿಯೊಂದಿಗೆ ಮಾತ್ರ ಕುಟುಂಬಕ್ಕೆ ಕಾಣುವ ಸಾರಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ.',
        te: 'రోగి అనుమతితో మాత్రమే కుటుంబ సభ్యుడికి అందే సారాంశాన్ని చూడండి.',
        en: 'Approve consent and preview the exact downloadable non-clinical handoff summary.',
      },
      targetPage: 'carecircle',
      onLaunch: () => {
        onToggleMilestone('caregiverHandoff');
        onPageChange('carecircle');
      },
      icon: <Users className="w-5 h-5 text-[#C98897]" />,
    },
  ];

  const completedCount = milestones.filter((m) => progress[m.key]).length;
  const totalCount = milestones.length;
  const allCompleted = completedCount === totalCount;
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenComfortMode}
            className="compact-chip px-3.5 py-1.5 rounded-full bg-white border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] cursor-pointer"
          >
            {currentLanguage === 'kn' ? 'ಕಂಫರ್ಟ್ ಮೋಡ್' : currentLanguage === 'te' ? 'కంఫర్ట్ మోడ్' : 'Comfort Mode'}
          </button>

          <button
            type="button"
            onClick={onResetShowcase}
            className="compact-chip px-3.5 py-1.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : currentLanguage === 'te' ? 'రీసెట్' : 'Reset Journey'}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#BEA06D]" />
            <span>
              {currentLanguage === 'kn'
                ? '೭-ಹಂತದ ಕಾಲ್ಪನಿಕ ರೋಗಿ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ'
                : currentLanguage === 'te'
                ? '7-దశల కల్పిత రోగి ప్రదర్శన'
                : 'CORE 7-Step Fictional Demonstration Walkthrough'}
            </span>
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
            <WordReveal
              text={
                currentLanguage === 'kn'
                  ? 'ಸಂಪೂರ್ಣ ರೋಗಿ ಪಯಣ ಪ್ರದರ್ಶನ'
                  : currentLanguage === 'te'
                  ? 'సంపూర్ణ రోగి ప్రయాణ ప్రదర్శన'
                  : 'End-to-End Innovation Walkthrough'
              }
            />
          </h1>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {currentLanguage === 'kn'
              ? 'ಮಾನವ-ಕೇಂದ್ರಿತ ವಿನ್ಯಾಸ, ಪ್ರವೇಶಾವಕಾಶ ಮತ್ತು ಬುದ್ಧಿವಂತ ಮಾರ್ಗದರ್ಶನವು ಹೇಗೆ ಒಟ್ಟಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂಬುದನ್ನು ೭ ಹಂತಗಳಲ್ಲಿ ಅನುಭವಿಸಿ. ಎಲ್ಲಾ ಡೇಟಾ ಕಾಲ್ಪನಿಕವಾಗಿದೆ.'
              : currentLanguage === 'te'
              ? 'మానవ-కేంద్రీకృత డిజైన్, యాక్సెసిబిలిటీ మరియు అడాప్టివ్ గైడెన్స్ ఎలా కలిసి పనిచేస్తాయో 7 దశల్లో చూడండి. ఇది కల్పిత రోగి నమూనా మాత్రమే.'
              : 'Experience an end-to-end fictional rural patient journey across CORE’s adaptive intelligence, voice bridge, literacy support, and privacy-first caregiver tools.'}
          </p>
        </div>
      </Reveal>

      {/* Overall Showcase Progress Card */}
      <Reveal delay={80}>
        <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider">
              {currentLanguage === 'kn'
                ? 'ಪ್ರದರ್ಶನ ಪಯಣ ಪ್ರಗತಿ'
                : currentLanguage === 'te'
                ? 'ప్రదర్శన ప్రయాణ పురోగతి'
                : 'Showcase Journey Progress'}
            </span>
            <span className="text-sm font-bold text-[#3C3330] tabular-nums">
              {completedCount} / {totalCount} ({pct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6347] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Reveal>

      {/* 7 Interactive Milestones */}
      <div className="space-y-4">
        {milestones.map((m, idx) => {
          const done = progress[m.key];
          return (
            <Reveal key={m.key} delay={Math.min(idx * 90, 420)}>
            <div
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                done
                  ? 'bg-[#A2B29B]/15 border-[#4A6347]/60'
                  : 'bg-white border-[#BEA06D]/35 hover:border-[#BEA06D]'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => onToggleMilestone(m.key)}
                  aria-label={`Mark step ${m.stepNum} complete`}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    done
                      ? 'bg-[#4A6347] border-[#4A6347] text-white'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/40 text-[#8F7242]'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-5 h-5 check-pop" /> : m.icon}
                </button>
                <div className="space-y-1">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                    {m.title[currentLanguage]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3C3330]/80">{m.desc[currentLanguage]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onToggleMilestone(m.key)}
                  className="compact-chip px-3.5 py-2 rounded-full bg-white border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] cursor-pointer"
                >
                  {done
                    ? currentLanguage === 'kn'
                      ? 'ಪೂರ್ಣಗೊಂಡಿದೆ ✓'
                      : currentLanguage === 'te'
                      ? 'పూర్తయింది ✓'
                      : 'Completed ✓'
                    : currentLanguage === 'kn'
                    ? 'ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'పూర్తయినట్లు గుర్తించు'
                    : 'Mark Done'}
                </button>

                <button
                  type="button"
                  onClick={m.onLaunch}
                  className="py-2.5 px-5 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{currentLanguage === 'kn' ? 'ತೆರೆಯಿರಿ' : currentLanguage === 'te' ? 'తెరవండి' : 'Explore'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            </Reveal>
          );
        })}
      </div>

      {/* Step 8: Completed Journey Summary Card */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-8 text-center space-y-4 transition-all ${
          allCompleted
            ? 'bg-gradient-to-r from-[#A2B29B]/20 via-[#FCF9F5] to-[#E6C1C4]/25 border-[#4A6347] shadow-md'
            : 'bg-[#FCF9F5] border-[#BEA06D]/40'
        }`}
      >
        <Award className={`w-12 h-12 mx-auto ${allCompleted ? 'text-[#4A6347]' : 'text-[#BEA06D]'}`} />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
          {allCompleted
            ? currentLanguage === 'kn'
              ? 'ಅಭಿನಂದನೆಗಳು! ಸಂಪೂರ್ಣ CORE ಪಯಣ ಪೂರ್ಣಗೊಂಡಿದೆ'
              : currentLanguage === 'te'
              ? 'అభినందనలు! సంపూర్ణ CORE ప్రయాణం పూర్తయింది'
              : 'Journey Complete — Full CORE Ecosystem Explored'
            : currentLanguage === 'kn'
            ? 'ಹಂತ ೮: ಪೂರ್ಣಗೊಂಡ ಪಯಣ ಸಾರಾಂಶ'
            : currentLanguage === 'te'
            ? 'దశ 8: పూర్తయిన ప్రయాణ సారాంశం'
            : 'Step 8: Journey Completion Summary'}
        </h2>
        <p className="text-sm text-[#3C3330]/85 max-w-2xl mx-auto leading-relaxed">
          {currentLanguage === 'kn'
            ? `ನೀವು ${totalCount} ರಲ್ಲಿ ${completedCount} ಮೈಲಿಗಲ್ಲುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. CORE ಮಾನವ-ಕೇಂದ್ರಿತ ಪ್ರವೇಶಾವಕಾಶ, ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ, ಸ್ಪಷ್ಟ ತಿಳುವಳಿಕೆ ಮತ್ತು ರೋಗಿ-ನಿಯಂತ್ರಿತ ಗೌಪ್ಯತೆಯನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ತೋರಿಸುತ್ತದೆ.`
            : currentLanguage === 'te'
            ? `మీరు ${totalCount} లో ${completedCount} దశలను పూర్తి చేశారు. CORE మానవ-కేంద్రీకృత డిజైన్, వాయిస్ సహాయం మరియు రోగి-నియంత్రిత గోప్యతను ఒకే వేదికపై చూపుతుంది.`
            : `You have completed ${completedCount} of ${totalCount} demonstration milestones. Together, these modules demonstrate transparent personalization, multilingual voice accessibility, health literacy teach-back, and privacy-first caregiver handoff without compromising safety.`}
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onPageChange('insights')}
            className="py-2.5 px-6 rounded-full bg-white border-2 border-[#BEA06D] text-[#8F7242] hover:bg-[#BEA06D]/10 text-xs sm:text-sm font-bold cursor-pointer"
          >
            {currentLanguage === 'kn'
              ? 'CORE Insights ವಿಶ್ಲೇಷಣೆ ನೋಡಿ →'
              : currentLanguage === 'te'
              ? 'CORE Insights విశ్లేషణ చూడండి →'
              : 'Inspect CORE Insights Analytics →'}
          </button>
        </div>
      </div>
    </div>
  );
};
