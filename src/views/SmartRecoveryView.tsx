import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveDisruptionState,
  DisruptionScenarioId,
  ExplanationComplexity,
  Language,
  PageView,
} from '../types';
import { RECOVERY_SCENARIOS } from '../data/recoveryData';
import { HospitalNodeId } from '../data/hospitalMapData';
import { computeAdaptiveRoute } from '../utils/wayfinding';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import { HospitalFloorMap } from '../components/HospitalFloorMap';
import { ExplainOptionsPanel } from '../components/ExplainOptionsPanel';
import { TeachBackPanel } from '../components/TeachBackPanel';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Compass,
  HeartHandshake,
  MessageCircleHeart,
  RotateCcw,
  Route,
  ShieldAlert,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';

interface SmartRecoveryViewProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeDisruption: ActiveDisruptionState;
  onUpdateDisruption: (next: ActiveDisruptionState) => void;
  onClearDisruption: () => void;
  onPageChange: (page: PageView) => void;
  onOpenCompanionWithPrompt: (prompt: string, targetLanguage?: Language) => void;
  onRouteRecalculated: () => void;
  onTeachBackAttempt: () => void;
  onClarificationRequested: () => void;
  onMarkJourneyCompleted?: () => void;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  initialComplexity?: ExplanationComplexity;
  reduceMotion?: boolean;
}

const ADAPTING_JOURNEY_STEPS: Array<{
  id: string;
  stepNum: number;
  title: Record<Language, string>;
}> = [
  {
    id: 'step-1-lang',
    stepNum: 1,
    title: {
      en: 'Pick Language',
      kn: 'ಭಾಷೆ ಆಯ್ಕೆ',
      te: 'భాష ఎంపిక',
    },
  },
  {
    id: 'step-2-scenario',
    stepNum: 2,
    title: {
      en: 'Pick Fictional Scenario',
      kn: 'ಸನ್ನಿವೇಶ ಆರಿಸಿ',
      te: 'సన్నివేశం ఎంచుకోండి',
    },
  },
  {
    id: 'step-3-nav',
    stepNum: 3,
    title: {
      en: 'Begin Navigation',
      kn: 'ನಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ',
      te: 'నావిగేషన్ ప్రారంభించండి',
    },
  },
  {
    id: 'step-4-disrupt',
    stepNum: 4,
    title: {
      en: 'Encounter Disruption',
      kn: 'ತೊಂದರೆ ಗುರುತಿಸಿ',
      te: 'ఆటంకం ఎదుర్కోండి',
    },
  },
  {
    id: 'step-5-reroute',
    stepNum: 5,
    title: {
      en: 'Dynamic Route Update',
      kn: 'ಬದಲಿ ದಾರಿ ಲೆಕ್ಕ',
      te: 'కొత్త మార్గం లెక్కింపు',
    },
  },
  {
    id: 'step-6-ai',
    stepNum: 6,
    title: {
      en: 'Explain / Companion',
      kn: 'AI ಮಾರ್ಗದರ್ಶನ',
      te: 'AI వివరణ',
    },
  },
  {
    id: 'step-7-teachback',
    stepNum: 7,
    title: {
      en: 'Teach-Back Clarity',
      kn: 'ತಿಳುವಳಿಕೆ ಖಚಿತತೆ',
      te: 'టీచ్-బ్యాక్ పరిశీలన',
    },
  },
  {
    id: 'step-8-sync',
    stepNum: 8,
    title: {
      en: 'Journey & Caregiver',
      kn: 'ಪಯಣ ಮತ್ತು ಕುಟುಂಬ',
      te: 'ప్రయాణం & సంరక్షకులు',
    },
  },
  {
    id: 'step-9-impact',
    stepNum: 9,
    title: {
      en: 'View Impact Summary',
      kn: 'ಫಲಿತಾಂಶ ಸಾರಾಂಶ',
      te: 'ఫలితాల సారాంశం',
    },
  },
];

export const SmartRecoveryView: React.FC<SmartRecoveryViewProps> = ({
  currentLanguage,
  onLanguageChange,
  activeDisruption,
  onUpdateDisruption,
  onClearDisruption,
  onPageChange,
  onOpenCompanionWithPrompt,
  onRouteRecalculated,
  onTeachBackAttempt,
  onClarificationRequested,
  onMarkJourneyCompleted,
  aiConsentGranted,
  onAcceptAiConsent,
  initialComplexity = 'simple',
  reduceMotion = false,
}) => {
  const selectedScenarioId: Exclude<DisruptionScenarioId, 'none'> =
    activeDisruption.scenarioId === 'none' ? 'lift_unavailable' : activeDisruption.scenarioId;

  const activeScenario =
    RECOVERY_SCENARIOS.find((s) => s.id === selectedScenarioId) || RECOVERY_SCENARIOS[0];

  const [startId, setStartId] = useState<HospitalNodeId>(activeScenario.defaultStart);
  const [destinationId, setDestinationId] = useState<HospitalNodeId>(
    activeScenario.defaultDestination
  );
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(
    activeScenario.defaultAccessibleOnly
  );
  const [manualBlockedEdges, setManualBlockedEdges] = useState<string[]>(
    activeDisruption.blockedEdgeIds.length > 0
      ? activeDisruption.blockedEdgeIds
      : activeScenario.blockedEdgeIds
  );

  // Feature 10: Interactive 9-step walkthrough state (Resettable)
  const [completedJourneySteps, setCompletedJourneySteps] = useState<Record<string, boolean>>({
    'step-1-lang': true,
    'step-2-scenario': activeDisruption.scenarioId !== 'none',
  });

  const markStep = (id: string) => {
    setCompletedJourneySteps((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  // Sync map defaults whenever active scenario changes cleanly
  useEffect(() => {
    setStartId(activeScenario.defaultStart);
    setDestinationId(activeScenario.defaultDestination);
    setAccessibleOnly(activeScenario.defaultAccessibleOnly);
    setManualBlockedEdges(
      activeDisruption.scenarioId === activeScenario.id &&
        activeDisruption.blockedEdgeIds.length > 0
        ? activeDisruption.blockedEdgeIds
        : activeScenario.blockedEdgeIds
    );
  }, [activeScenario.id]);

  const routeComparison = useMemo(
    () =>
      computeAdaptiveRoute(startId, destinationId, {
        accessibleOnly,
        disabledEdgeIds: manualBlockedEdges,
      }),
    [startId, destinationId, accessibleOnly, manualBlockedEdges]
  );

  const handleSelectScenario = (scenarioId: Exclude<DisruptionScenarioId, 'none'>) => {
    const picked = RECOVERY_SCENARIOS.find((s) => s.id === scenarioId);
    if (!picked) return;
    setStartId(picked.defaultStart);
    setDestinationId(picked.defaultDestination);
    setAccessibleOnly(picked.defaultAccessibleOnly);
    setManualBlockedEdges(picked.blockedEdgeIds);
    onUpdateDisruption({
      scenarioId: picked.id,
      blockedEdgeIds: picked.blockedEdgeIds,
      recommendedDestination: picked.defaultDestination,
      updatedAt: new Date().toLocaleTimeString(),
    });
    onRouteRecalculated();
    markStep('step-2-scenario');
    markStep('step-4-disrupt');
    markStep('step-5-reroute');
  };

  const handleResetWalkthrough = () => {
    onClearDisruption();
    setStartId('entrance');
    setDestinationId('radiology');
    setAccessibleOnly(true);
    setManualBlockedEdges([]);
    setCompletedJourneySteps({ 'step-1-lang': true });
  };

  const handleSpeakCalmPlan = () => {
    const text = `${activeScenario.title[currentLanguage]}. ${activeScenario.calmExplanation[currentLanguage]} ${activeScenario.timelineAdjustmentNote[currentLanguage]}`;
    speechService.speak(text, resolveSpeechLanguage(text, currentLanguage));
  };

  const handleAskCompanionWhy = () => {
    markStep('step-6-ai');
    onClarificationRequested();
    const prompt =
      currentLanguage === 'kn'
        ? `ನಾನು "${activeScenario.title.kn}" ಸನ್ನಿವೇಶದಲ್ಲಿದ್ದೇನೆ. ನನ್ನ ದಾರಿ ಏಕೆ ಬದಲಾಗಿದೆ ಮತ್ತು ಈಗ ಸುರಕ್ಷಿತವಾಗಿ ಏನು ಮಾಡಬೇಕು ಎಂದು ಸರಳವಾಗಿ ವಿವರಿಸಿ.`
        : currentLanguage === 'te'
        ? `నేను "${activeScenario.title.te}" పరిస్థితిలో ఉన్నాను. నా దారి ఎందుకు మారింది మరియు ఇప్పుడు సురಕ್ಷితంగా ఏమి చేయాలో సులభంగా వివరించండి.`
        : `I encountered "${activeScenario.title.en}" (${routeComparison.reason.en}). Why did my route or plan change, and what is the safest calm step next?`;
    onOpenCompanionWithPrompt(prompt, currentLanguage);
  };

  const completedWalkthroughCount = ADAPTING_JOURNEY_STEPS.filter(
    (s) => completedJourneySteps[s.id]
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('navigator')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#322826] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಸ್ಮಾರ್ಟ್ ನ್ಯಾವಿಗೇಟರ್‌ಗೆ ಮರಳಿ'
              : currentLanguage === 'te'
              ? 'స్మార్ట్ నావిగేటర్‌కు తిరిగి వెళ్ళండి'
              : 'Back to Smart Navigator'}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange('impact-lab')}
            className="compact-chip py-1.5 px-4 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#4A6347]" />
            <span>
              {currentLanguage === 'kn'
                ? 'ಇಂಪ್ಯಾಕ್ಟ್ ಲ್ಯಾಬ್ ನೋಡಿ'
                : currentLanguage === 'te'
                ? 'ఇంపాక్ట్ ల్యాబ్ చూడండి'
                : 'Open Impact Lab'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetWalkthrough}
            className="compact-chip py-1.5 px-4 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 hover:border-[#C88F98] text-xs font-semibold text-[#8A6D3F] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'kn'
                ? 'ಸಿಮ್ಯುಲೇಶನ್ ಮರುಹೊಂದಿಸಿ'
                : currentLanguage === 'te'
                ? 'సిమ్యులేషన్ రీసెట్'
                : 'Reset Scenarios'}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Editorial Banner */}
      <Reveal className="bg-white border border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C88F98]" />
              <span>
                {currentLanguage === 'kn'
                  ? 'CORE ಸ್ಮಾರ್ಟ್ ರಿಕವರಿ · ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆಗಳಿಗೆ ಮಾರ್ಗದರ್ಶಿ'
                  : currentLanguage === 'te'
                  ? 'CORE స్మార్ట్ రికవరీ · ఊహించని మార్పులకు సహాయం'
                  : 'CORE Smart Recovery · Adaptive Care Intelligence'}
              </span>
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#322826] leading-tight">
              <WordReveal
                text={
                  currentLanguage === 'kn'
                    ? 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಯೋಜನೆ ಬದಲಾದರೂ ಶಾಂತವಾಗಿ ಸರಿಯಾದ ದಾರಿ ಪಡೆಯಿರಿ'
                    : currentLanguage === 'te'
                    ? 'ఆసుపత్రిలో ప్లాన్ మారినా కంగారు లేకుండా సరైన దారి పొందండి'
                    : 'A Hospital Journey That Adapts Calmly When Plans Change'
                }
              />
            </h1>

            <p className="text-sm sm:text-base text-[#493C39]/85 leading-relaxed">
              {currentLanguage === 'kn'
                ? 'ಕೊಠಡಿ ಬದಲಾದರೆ, ಲಿಫ್ಟ್ ಬಂದ್ ಆದರೆ ಅಥವಾ ಬಸ್ ತಡವಾದರೆ CORE ತಕ್ಷಣ ನಿಮ್ಮ ಮಾರ್ಗ, ಸಮಯದ ಪಟ್ಟಿ ಮತ್ತು ಕುಟುಂಬದ ಟಿಪ್ಪಣಿಯನ್ನು ಹೊಂದಿಸುತ್ತದೆ. (ಎಲ್ಲಾ ಸನ್ನಿವೇಶಗಳು ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಳು — ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ).'
                : currentLanguage === 'te'
                ? 'గది మారినా, లిఫ్ట్ ఆగినా లేదా బస్సు ఆలస్యమైనా CORE వెంటనే మీ దారి, ప్రణాళిక మరియు కుటుంబ సారాంశాన్ని మారుస్తుంది. (అన్నీ కల్పిత నమూనా పరిస్థితులు మాత్రమే — వైద్య సలహా కాదు).'
                : 'When a room moves, an accessible lift stops, or a rural bus runs late, CORE recalculates safe step-free routes, adapts your journey steps, and helps check your understanding gently. Fictional scenarios — not medical advice.'}
            </p>
          </div>

          <div className="bg-[#FCF9F5] border border-[#BEA06D]/40 rounded-2xl p-4 space-y-2.5 shrink-0 min-w-[240px]">
            <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? '೧. ಭಾಷೆ ಬದಲಿಸಿ ಪರೀಕ್ಷಿಸಿ'
                : currentLanguage === 'te'
                ? '1. భాషను మార్చి చూడండి'
                : 'Step 1 · Switch Language Live'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['en', 'kn', 'te'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang);
                    markStep('step-1-lang');
                  }}
                  className={`compact-chip px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                    currentLanguage === lang
                      ? 'bg-[#4A6347] border-[#4A6347] text-white'
                      : 'bg-white border-[#BEA06D]/40 text-[#493C39] hover:border-[#C88F98]'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'kn' ? 'ಕನ್ನಡ' : 'తెలుగు'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSpeakCalmPlan}
              className="w-full py-2 px-3 rounded-xl bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಪ್ರಸ್ತುತ ಯೋಜನೆ ಆಲಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'ప్రస్తుత ప్లాన్ వినండి'
                  : 'Listen to Calm Plan'}
              </span>
            </button>
          </div>
        </div>

        {/* Non-Clinical Safety Reminder Strip */}
        <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/22 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#493C39]">
          <ShieldAlert className="w-4 h-4 text-[#9E4958] shrink-0 mt-0.5" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಸುರಕ್ಷತಾ ಸೂಚನೆ: ಇದು ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ. ತುರ್ತು ಅನಾರೋಗ್ಯ ಅಥವಾ ವೈದ್ಯಕೀಯ ನಿರ್ಧಾರಗಳಿಗೆ ಯಾವಾಗಲೂ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ಅಥವಾ ವೈದ್ಯರನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.'
              : currentLanguage === 'te'
              ? 'భద్రతా గమనిక: ఇది కల్పిత ఆసుపత్రి ప్రోటోటైప్. అత్యవసర పరిస్థితులు లేదా వైద్య నిర్ణయాల కోసం ఎల్లప్పుడూ ఆసుపత్రి సిబ్బందిని లేదా డాక్టర్‌ను సంప్రదించండి.'
              : 'Safety Reminder: Fictional educational demonstration only. For urgent symptoms or medical decisions, speak directly with qualified clinicians at the hospital.'}
          </span>
        </div>
      </Reveal>

      {/* Feature 10: Interactive 9-Step "A Journey That Adapts" Showcase Tracker */}
      <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ · ೯ ಹಂತಗಳು'
                : currentLanguage === 'te'
                ? 'ఇంటరాక్టివ్ షోకేస్ · 9 దశలు'
                : 'A Journey That Adapts · 9-Step Walkthrough'}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#322826]">
              {currentLanguage === 'kn'
                ? 'CORE ಅನಿರೀಕ್ಷಿತ ಸನ್ನಿವೇಶದಲ್ಲಿ ಹೇಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ ನೋಡಿ'
                : currentLanguage === 'te'
                ? 'అనుకోని మార్పుల్లో CORE ఎలా సహాయం చేస్తుందో వరుసగా చూడండి'
                : `Interactive Showcase Progress (${completedWalkthroughCount}/9)`}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              markStep('step-9-impact');
              onMarkJourneyCompleted?.();
              onPageChange('impact-lab');
            }}
            className="py-2 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>
              {currentLanguage === 'kn'
                ? 'ಇಂಪ್ಯಾಕ್ಟ್ ಸಾರಾಂಶ ನೋಡಿ'
                : currentLanguage === 'te'
                ? 'ఇంపాక్ట్ సారాంశం చూడండి'
                : 'Finish & View Impact Lab'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {ADAPTING_JOURNEY_STEPS.map((st) => {
            const done = !!completedJourneySteps[st.id];
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => markStep(st.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  done
                    ? 'bg-[#A2B29B]/18 border-[#4A6347] text-[#322826]'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#493C39]/80 hover:border-[#BEA06D]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-[#8A6D3F] tabular-nums">
                    0{st.stepNum}
                  </span>
                  {done && (
                    <span className="w-4 h-4 rounded-full bg-[#4A6347] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold leading-snug break-words">
                  {st.title[currentLanguage]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature 1: Fictional Disruption Scenario Selector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? '೨. ಕಾಲ್ಪನಿಕ ಅಡಚಣೆ ಸನ್ನಿವೇಶವನ್ನು ಆರಿಸಿ (6 ಆಯ್ಕೆಗಳು)'
                : currentLanguage === 'te'
                ? '2. కల్పిత ఆటంక సన్నివేశాన్ని ఎంచుకోండి (6 ఎంపికలు)'
                : 'Step 2 · Choose a Fictional Unexpected Disruption Scenario'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
              {currentLanguage === 'kn'
                ? 'ಯಾವ ಬದಲಾವಣೆಯನ್ನು ಅನುಕರಿಸಬೇಕು?'
                : currentLanguage === 'te'
                ? 'ఏ పరిస్థితిని పరీక్షించాలి?'
                : 'Select What Unexpectedly Changed During the Visit'}
            </h2>
          </div>

          {activeDisruption.scenarioId !== 'none' && (
            <span className="text-xs font-bold text-[#4A6347] inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ನ್ಯಾವಿಗೇಟರ್, ಟೈಮ್‌ಲೈನ್ ಮತ್ತು CareCircle ಗೆ ಸಿಂಕ್ ಆಗಿದೆ'
                  : currentLanguage === 'te'
                  ? 'నావిగేటర్, టైమ్‌లైన్ & CareCircle కు సింక్ అయింది'
                  : 'Synced across Navigator, Journey & CareCircle'}
              </span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {RECOVERY_SCENARIOS.map((sc) => {
            const isSelected = sc.id === activeScenario.id;
            const isActiveGlobally = activeDisruption.scenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-4 sm:p-5 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-[#C88F98] shadow-sm'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/35 hover:border-[#BEA06D]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6D3F]">
                      {sc.code}
                    </span>
                    {isActiveGlobally ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4A6347] text-white">
                        {currentLanguage === 'kn'
                          ? 'ಸಕ್ರಿಯ'
                          : currentLanguage === 'te'
                          ? 'సక్రియం'
                          : 'Active'}
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6C1C4]/50 text-[#493C39]">
                        {currentLanguage === 'kn' ? 'ಆಯ್ಕೆಯಾಗಿದೆ' : currentLanguage === 'te' ? 'ఎంపిక' : 'Selected'}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#322826] leading-snug break-words">
                    {sc.title[currentLanguage]}
                  </h3>
                  <p className="text-xs text-[#493C39]/85 leading-relaxed break-words">
                    {sc.fictionalSituation[currentLanguage]}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#BEA06D]/20 text-[11px] font-semibold text-[#4A6347] flex items-center justify-between">
                  <span>
                    {currentLanguage === 'kn'
                      ? 'ಈ ಸನ್ನಿವೇಶ ಸಕ್ರಿಯಗೊಳಿಸಿ'
                      : currentLanguage === 'te'
                      ? 'ఈ సన్నివేశాన్ని ప్రారంభించండి'
                      : 'Activate & Recalculate'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scenario Adapted Guidance Summary Card */}
      <div className="bg-white border-2 border-[#BEA06D]/50 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#BEA06D]/25 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9E4958]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಪ್ರಸ್ತುತ ಸನ್ನಿವೇಶ ಮತ್ತು ಶಾಂತ ಪರಿಹಾರ'
                  : currentLanguage === 'te'
                  ? 'ప్రస్తుత పరిస్థితి & ప్రశాంత పరిష్కారం'
                  : `Selected Recovery Scenario · ${activeScenario.title.en}`}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#322826] break-words">
              {activeScenario.title[currentLanguage]}
            </h3>
            <p className="text-sm text-[#322826]/90 leading-relaxed max-w-3xl break-words">
              {activeScenario.calmExplanation[currentLanguage]}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAskCompanionWhy}
              className="py-2.5 px-4 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <MessageCircleHeart className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'AI ಕೇಳಿ: ದಾರಿ ಏಕೆ ಬದಲಾಗಿದೆ?'
                  : currentLanguage === 'te'
                  ? 'AI ని అడగండి: దారి ఎందుకు మారింది?'
                  : 'Ask Companion: Why Did My Plan Change?'}
              </span>
            </button>
          </div>
        </div>

        {/* Before vs Adapted Steps Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeScenario.adaptedStepTitles.map((diff) => (
            <div
              key={diff.step}
              className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-2"
            >
              <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider">
                {currentLanguage === 'kn'
                  ? `ಹಂತ ${diff.step} ಹೊಂದಾಣಿಕೆ`
                  : currentLanguage === 'te'
                  ? `దశ ${diff.step} మార్పు`
                  : `Adapted Step ${diff.step}`}
              </span>
              <p className="text-xs text-[#493C39]/70 line-through break-words">
                {diff.original[currentLanguage]}
              </p>
              <p className="text-sm font-bold text-[#4A6347] break-words">
                {diff.revised[currentLanguage]}
              </p>
              <p className="text-xs text-[#322826]/85 break-words">{diff.whyChanged[currentLanguage]}</p>
            </div>
          ))}
        </div>

        {/* Questions to Ask at Hospital + Cross-Module Sync Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-2">
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಕೇಳಲು ಸರಳ ಮಾತುಗಳು'
                : currentLanguage === 'te'
                ? 'కౌంటర్ వద్ద అడగడానికి సులభ మాటలు'
                : 'Simple Questions You Can Ask Staff'}
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#322826]">
              {activeScenario.askAtHospital[currentLanguage].map((q, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-snug break-words">
                  <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider block">
                {currentLanguage === 'kn'
                  ? 'ಸಂಪರ್ಕಿತ CORE ವಿಭಾಗಗಳು'
                  : currentLanguage === 'te'
                  ? 'అనుసంధానిత CORE మాడ్యూల్స్'
                  : 'Connected CORE Modules (Live Sync)'}
              </span>
              <p className="text-xs text-[#493C39]/85 leading-relaxed">
                {activeScenario.timelineAdjustmentNote[currentLanguage]}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  markStep('step-8-sync');
                  onPageChange('journey');
                }}
                className="compact-chip py-2 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#322826] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Route className="w-3.5 h-3.5 text-[#4A6347]" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಹೊಂದಿಕೊಂಡ ಟೈಮ್‌ಲೈನ್ ನೋಡಿ'
                    : currentLanguage === 'te'
                    ? 'మారిన టైమ్‌లైన్ చూడండి'
                    : 'View Adapted Timeline'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  markStep('step-8-sync');
                  onPageChange('carecircle');
                }}
                className="compact-chip py-2 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#C88F98] text-xs font-semibold text-[#322826] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#C88F98]" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'CareCircle ಸಾರಾಂಶ ನವೀಕರಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'CareCircle నోట్ అప్డేట్ చేయండి'
                    : 'Share Note via CareCircle'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Embedded Live Dynamic Dijkstra Floor Map */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
            {currentLanguage === 'kn'
              ? '೩–೫. ಲೈವ್ ಬದಲಿ ಆಸ್ಪತ್ರೆ ಮಾರ್ಗ (Step-Free Safe Routing)'
              : currentLanguage === 'te'
              ? '3–5. లైవ్ ప్రత్యామ్నాయ ఆసుపత్రి మార్గం (మెట్లు లేని భద్రత)'
              : 'Dynamic Step-Free Hospital Route Recalculation'}
          </h2>
          <span className="text-xs font-semibold text-[#8A6D3F]">
            {routeComparison.reason[currentLanguage]}
          </span>
        </div>

        <HospitalFloorMap
          language={currentLanguage}
          startId={startId}
          destinationId={destinationId}
          accessibleOnly={accessibleOnly}
          route={routeComparison.revisedRoute}
          baselineRoute={routeComparison.baselineRoute}
          disabledEdgeIds={manualBlockedEdges}
          disruptionReason={routeComparison.reason[currentLanguage]}
          routeChanged={routeComparison.routeChanged}
          noAccessibleRouteFound={routeComparison.noAccessibleRouteFound}
          onStartChange={(id) => {
            setStartId(id);
            markStep('step-3-nav');
          }}
          onDestinationChange={(id) => {
            setDestinationId(id);
            markStep('step-3-nav');
          }}
          onToggleAccessible={() => {
            setAccessibleOnly((prev) => !prev);
            onRouteRecalculated();
          }}
          onSwapLocations={() => {
            setStartId(destinationId);
            setDestinationId(startId);
          }}
          onSimulatePreset={(edgeIds) => {
            setManualBlockedEdges(edgeIds);
            const matchedId: DisruptionScenarioId = edgeIds.includes('lift-vertical')
              ? 'lift_unavailable'
              : edgeIds.includes('reception-waiting')
              ? 'corridor_blocked'
              : 'dept_changed';
            onUpdateDisruption({
              scenarioId: matchedId,
              blockedEdgeIds: edgeIds,
              recommendedDestination: destinationId,
              updatedAt: new Date().toLocaleTimeString(),
            });
            onRouteRecalculated();
            markStep('step-4-disrupt');
            markStep('step-5-reroute');
          }}
          onResetSimulation={() => {
            setManualBlockedEdges([]);
            onClearDisruption();
          }}
          reduceMotion={reduceMotion}
        />
      </div>

      {/* Feature 3 + Feature 4: Explain My Options & Teach-Back Side-by-Side / Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ExplainOptionsPanel
          language={currentLanguage}
          defaultSituation={activeScenario.fictionalSituation[currentLanguage]}
          scenarioContext={`Active disruption: ${activeScenario.title.en}. Map status: ${routeComparison.reason.en}`}
          initialComplexity={initialComplexity}
          aiConsentGranted={aiConsentGranted}
          onAcceptAiConsent={onAcceptAiConsent}
          onOptionsGenerated={() => {
            markStep('step-6-ai');
            onClarificationRequested();
          }}
        />

        <TeachBackPanel
          language={currentLanguage}
          stepPrompt={activeScenario.teachBackPrompt[currentLanguage]}
          referenceExplanation={activeScenario.teachBackReference[currentLanguage]}
          quickChoices={activeScenario.teachBackQuickChoices}
          aiConsentGranted={aiConsentGranted}
          onAcceptAiConsent={onAcceptAiConsent}
          onAttemptRecorded={() => {
            markStep('step-7-teachback');
            onTeachBackAttempt();
          }}
        />
      </div>

      {/* Completion Banner for Fictional Journey */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#A2B29B]/18 border-2 border-[#4A6347]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HeartHandshake className="w-6 h-6 text-[#4A6347] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-[#322826]">
              {currentLanguage === 'kn'
                ? 'ಈ ಕಾಲ್ಪನಿಕ ಸನ್ನಿವೇಶದ ಮಾರ್ಗದರ್ಶನ ಪೂರ್ಣಗೊಂಡಿದೆಯೇ?'
                : currentLanguage === 'te'
                ? 'ఈ కల్పిత పరిస్థితి మార్గదర్శనం పూర్తయిందా?'
                : 'Ready to Mark This Fictional Journey Clear & View Usability Summary?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#493C39]/85">
              {currentLanguage === 'kn'
                ? 'ಇಂಪ್ಯಾಕ್ಟ್ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಈ ಸೆಷನ್‌ನ ನೈಜ ಹಂತಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಆಸ್ಪತ್ರೆ ಪದ್ಧತಿಯ ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ನೋಡಿ.'
                : currentLanguage === 'te'
                ? 'ఇంపాక్ట్ ల్యాబ్‌లో ఈ సెషన్‌లో మీరు చేసిన దశలు మరియు సాధారణ ఆసుపత్రి విధానం మధ్య తేడాను చూడండి.'
                : 'Inspect live session usability counters (navigation steps, route recalculations, and clarity checks) inside CORE Impact Lab.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            markStep('step-9-impact');
            onMarkJourneyCompleted?.();
            onPageChange('impact-lab');
          }}
          className="py-3 px-6 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಪೂರ್ಣಗೊಳಿಸಿ · Impact Lab ನೋಡಿ'
              : currentLanguage === 'te'
              ? 'పూర్తి చేసి Impact Lab చూడండి'
              : 'Complete & Open Impact Lab'}
          </span>
        </button>
      </div>
    </div>
  );
};
