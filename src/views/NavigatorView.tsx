import React, { useEffect, useMemo, useState } from 'react';
import { ActiveDisruptionState, Appointment, Language, PageView } from '../types';
import {
  DEPARTMENT_QUICK_IDS,
  HOSPITAL_NODES,
  HospitalNodeId,
} from '../data/hospitalMapData';
import { RECOVERY_SCENARIOS } from '../data/recoveryData';
import {
  COMPANION_NAV_PROMPTS,
  DESIGN_THINKING_DEMO_STEPS,
  NAVIGATOR_COMPREHENSION_CHECKS,
  NAVIGATOR_STAGES,
  STAGE_1_CHECKLIST,
  STAGE_2_ARRIVAL_OVERVIEW,
  STAGE_4_STAFF_QUESTIONS,
  STAGE_5_AFTER_VISIT,
} from '../data/navigatorContent';
import {
  buildNavigatorAiContextSummary,
  computeAdaptiveRoute,
  RouteStep,
} from '../utils/wayfinding';
import { HospitalFloorMap } from '../components/HospitalFloorMap';
import {
  NavigatorComprehensionCard,
  NavigatorStepCard,
  StepDepth,
} from '../components/NavigatorStepCard';
import { NavigatorGentleMode } from '../components/NavigatorGentleMode';
import { NavigationCardPrintable } from '../components/NavigationCardPrintable';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Compass,
  FlaskConical,
  HeartHandshake,
  HelpCircle,
  MessageCircleHeart,
  Navigation,
  Pill,
  Plus,
  Scan,
  Sparkles,
  Stethoscope,
  Volume2,
} from 'lucide-react';

interface NavigatorViewProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  appointment: Appointment;
  allAppointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onPageChange: (page: PageView) => void;
  onOpenCompanionWithPrompt: (prompt: string, targetLanguage?: Language) => void;
  onNavigatorContextChange: (summary: string) => void;
  activeDisruption?: ActiveDisruptionState;
  onUpdateDisruption?: (next: ActiveDisruptionState) => void;
  onRouteRecalculated?: () => void;
  reduceMotion?: boolean;
}

export const NavigatorView: React.FC<NavigatorViewProps> = ({
  currentLanguage,
  onLanguageChange,
  appointment,
  allAppointments,
  onSelectAppointment,
  onPageChange,
  onOpenCompanionWithPrompt,
  onNavigatorContextChange,
  activeDisruption,
  onUpdateDisruption,
  onRouteRecalculated,
  reduceMotion = false,
}) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [gentleModeActive, setGentleModeActive] = useState(false);

  // Wayfinding & Map state
  const [startId, setStartId] = useState<HospitalNodeId>('entrance');
  const [destinationId, setDestinationId] = useState<HospitalNodeId>(
    activeDisruption?.recommendedDestination || 'radiology'
  );
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(true);
  const [localDisabledEdges, setLocalDisabledEdges] = useState<string[]>([]);

  const disabledEdgeIds =
    activeDisruption && activeDisruption.blockedEdgeIds.length > 0
      ? activeDisruption.blockedEdgeIds
      : localDisabledEdges;

  // Step understanding & depth preferences
  const [stepDepth, setStepDepth] = useState<StepDepth>('simple');
  const [understoodSteps, setUnderstoodSteps] = useState<Record<string, boolean>>({});

  // Stage 1 & 5 checklists
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({
    'nav-prep-id': true,
  });
  const [afterVisitChecklist, setAfterVisitChecklist] = useState<Record<string, boolean>>({});

  // Stage 4 staff questions
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, boolean>>({
    'sq-when-report': true,
    'sq-next-step': true,
  });
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);

  // Feature 10: Design Thinking Academic Evaluation Mode (optional guided tracker)
  const [demoTrackerOpen, setDemoTrackerOpen] = useState(false);
  const [demoDoneSteps, setDemoDoneSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeDisruption?.recommendedDestination) {
      setDestinationId(activeDisruption.recommendedDestination);
    }
  }, [activeDisruption?.scenarioId, activeDisruption?.recommendedDestination]);

  const routeComparison = useMemo(
    () =>
      computeAdaptiveRoute(startId, destinationId, {
        accessibleOnly,
        disabledEdgeIds,
      }),
    [startId, destinationId, accessibleOnly, disabledEdgeIds]
  );

  const route = routeComparison.revisedRoute;

  // Sync live deterministic route summary to parent App -> CoreCompanion pageContext
  useEffect(() => {
    const summary = buildNavigatorAiContextSummary(
      route,
      stage,
      currentLanguage,
      routeComparison
    );
    onNavigatorContextChange(summary);
  }, [route, stage, currentLanguage, routeComparison, onNavigatorContextChange]);

  // Helper to mark Design Thinking walkthrough milestones naturally as user interacts
  const markDemoStep = (id: string) => {
    setDemoDoneSteps((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const handleToggleChecklist = (id: string) => {
    setCompletedChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
    markDemoStep('dt-3-prep');
  };

  const handleToggleAfterVisit = (id: string) => {
    setAfterVisitChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
    markDemoStep('dt-8-journey');
  };

  const handleDepartmentPick = (deptId: HospitalNodeId) => {
    setDestinationId(deptId);
    if (startId === deptId) {
      setStartId('entrance');
    }
    markDemoStep('dt-5-dept');
  };

  const handleSwapMapPoints = () => {
    setStartId(destinationId);
    setDestinationId(startId);
    markDemoStep('dt-6-route');
  };

  const handleAskCompanionRoute = (promptText: string, forceLang?: Language) => {
    markDemoStep('dt-7-ai');
    onOpenCompanionWithPrompt(promptText, forceLang);
  };

  const handleAskClarificationStep = (step: RouteStep) => {
    const stepText = step.instruction[currentLanguage][stepDepth];
    const prompt =
      currentLanguage === 'kn'
        ? `ದಯವಿಟ್ಟು ಈ ಆಸ್ಪತ್ರೆ ದಾರಿ ಹಂತವನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಿ: "${stepText}"`
        : currentLanguage === 'te'
        ? `దయచేసి ఈ ఆసుపత్రి మార్గ దశను సులభంగా వివరించండి: "${stepText}"`
        : `Please explain this navigation step clearly and tell me what landmark to look for: "${stepText}"`;
    handleAskCompanionRoute(prompt);
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customQuestionInput.trim();
    if (!cleaned) return;
    setCustomQuestions((prev) => [...prev, cleaned]);
    setCustomQuestionInput('');
    markDemoStep('dt-8-journey');
  };

  const getDeptIcon = (id: HospitalNodeId) => {
    if (id === 'radiology') return <Scan className="w-5 h-5 text-[#C88F98]" />;
    if (id === 'laboratory') return <FlaskConical className="w-5 h-5 text-[#4A6347]" />;
    if (id === 'pharmacy') return <Pill className="w-5 h-5 text-[#8A6D3F]" />;
    return <Stethoscope className="w-5 h-5 text-[#BEA06D]" />;
  };

  const patientName =
    currentLanguage === 'kn'
      ? appointment.patientNameKannada
      : currentLanguage === 'te'
      ? appointment.patientNameTelugu
      : appointment.patientName;

  const demoCompletedCount = DESIGN_THINKING_DEMO_STEPS.filter(
    (s) => demoDoneSteps[s.id]
  ).length;
  const demoAllDone = demoCompletedCount === DESIGN_THINKING_DEMO_STEPS.length;

  const prepCompletedCount = STAGE_1_CHECKLIST.filter(
    (item) => completedChecklist[item.id]
  ).length;

  const renderStageNavigationFooter = () => (
    <div className="pt-6 border-t border-[#BEA06D]/25 flex flex-wrap items-center justify-between gap-3 no-print">
      <button
        type="button"
        disabled={stage === 1}
        onClick={() => setStage((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4 | 5)}
        className="py-2.5 px-5 rounded-full bg-white border border-[#BEA06D]/45 disabled:opacity-40 text-sm font-semibold text-[#493C39] hover:border-[#BEA06D] inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {currentLanguage === 'kn'
            ? 'ಹಿಂದಿನ ಹಂತ'
            : currentLanguage === 'te'
            ? 'వెనుక దశ'
            : 'Previous Stage'}
        </span>
      </button>

      {stage < 5 ? (
        <button
          type="button"
          onClick={() => {
            const next = (stage + 1) as 1 | 2 | 3 | 4 | 5;
            setStage(next);
            if (next === 2) markDemoStep('dt-4-arrive');
            if (next === 3) markDemoStep('dt-6-route');
            if (next === 4) markDemoStep('dt-8-journey');
            if (next === 5) markDemoStep('dt-9-card');
          }}
          className="py-2.5 px-6 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-sm font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span>
            {currentLanguage === 'kn'
              ? 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ'
              : currentLanguage === 'te'
              ? 'తదుపరి దశకు వెళ్ళండి'
              : `Continue to Stage ${stage + 1}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setStage(1)}
          className="py-2.5 px-5 rounded-full bg-[#FCF9F5] border border-[#BEA06D] text-[#8A6D3F] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <span>
            {currentLanguage === 'kn'
              ? 'ಹಂತ 1 ರಿಂದ ಮರುಪರಿಶೀಲಿಸಿ'
              : currentLanguage === 'te'
              ? 'మొదటి దశ నుండి చూడండి'
              : 'Review from Stage 1'}
          </span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7 soft-fade-up">
      {/* Top Navigation & Opt-In Gentle Guidance Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#322826] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ'
              : currentLanguage === 'te'
              ? 'హోమ్‌కు తిరిగి వెళ్ళండి'
              : 'Back to Home'}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Opt-in Gentle Guidance Mode toggle */}
          <button
            type="button"
            onClick={() => setGentleModeActive((v) => !v)}
            aria-pressed={gentleModeActive}
            className={`py-2 px-4 rounded-full border-2 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              gentleModeActive
                ? 'bg-[#4A6347] border-[#4A6347] text-white'
                : 'bg-white border-[#4A6347]/50 text-[#4A6347] hover:bg-[#A2B29B]/15'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn'
                ? gentleModeActive
                  ? 'ಶಾಂತ ಮಾರ್ಗದರ್ಶನ: ಸಕ್ರಿಯ'
                  : 'ಶಾಂತ ಮಾರ್ಗದರ್ಶನ ಮೋಡ್ (Opt-In)'
                : currentLanguage === 'te'
                ? gentleModeActive
                  ? 'నెమ్మది మోడ్: ఆన్'
                  : 'నెమ్మది మార్గదర్శన మోడ్ (Opt-In)'
                : gentleModeActive
                ? 'Gentle Guidance Mode: ON'
                : 'Gentle Guidance Mode'}
            </span>
          </button>

          {/* Design Thinking Academic Evaluation Mode Toggle */}
          <button
            type="button"
            onClick={() => setDemoTrackerOpen((v) => !v)}
            aria-expanded={demoTrackerOpen}
            className="py-2 px-4 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/50 hover:border-[#BEA06D] text-xs sm:text-sm font-semibold text-[#8A6D3F] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#C88F98]" />
            <span>
              {currentLanguage === 'kn'
                ? `ಮೌಲ್ಯಮಾಪನ ಡೆಮೊ (${demoCompletedCount}/9)`
                : currentLanguage === 'te'
                ? `డిజైన్ థింకింగ్ డెమో (${demoCompletedCount}/9)`
                : `Academic Demo (${demoCompletedCount}/9)`}
            </span>
            {demoTrackerOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Editorial Header */}
      <header className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C88F98] uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#BEA06D]" />
              <span>CORE Smart Hospital Navigator</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#8A6D3F]">
                {currentLanguage === 'kn'
                  ? 'ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ'
                  : currentLanguage === 'te'
                  ? 'నమూనా ఆసుపత్రి మార్గదర్శి'
                  : 'Fictional Hospital Demonstration'}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#322826] leading-tight">
              {currentLanguage === 'kn'
                ? 'ಹಂತ-ಹಂತದ ಆಸ್ಪತ್ರೆ ದಾರಿ ಮತ್ತು ಭೇಟಿ ಮಾರ್ಗದರ್ಶಿ'
                : currentLanguage === 'te'
                ? 'దశలవారీ ఆసుపత్రి నావిగేషన్ & సందర్శన సహాయం'
                : 'Guided Step-by-Step Hospital Navigation'}
            </h1>

            <p className="text-sm sm:text-base text-[#493C39]/85 leading-relaxed">
              {currentLanguage === 'kn'
                ? 'ಮನೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ ಸಿದ್ಧತೆಯಿಂದ ಹಿಡಿದು ನೋಂದಣಿ, ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ದಾರಿ ಮತ್ತು ಪ್ರಿಂಟ್ ಮಾಡಬಹುದಾದ ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್‌ವರೆಗೆ ಶಾಂತ ಸಹಾಯ.'
                : currentLanguage === 'te'
                ? 'ఇంటి తయారీ నుండి రిజిస్ట్రేషన్, మెట్లు లేని లిఫ్ట్ మార్గం మరియు ప్రింట్ చేయగల నావిగేషన్ కార్డు వరకు ప్రశాంతమైన మార్గదర్శకత్వం.'
                : 'Prepare from home, understand arrival desks, follow an accessible step-free floor route, ask CORE AI in English, Kannada, or Telugu, and print your Navigation Card.'}
            </p>
          </div>

          {/* Direct Companion Ask Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleAskCompanionRoute(
                  currentLanguage === 'kn'
                    ? 'ಆಸ್ಪತ್ರೆಗೆ ಪ್ರವೇಶಿಸಿದ ನಂತರ ನಾನು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?'
                    : currentLanguage === 'te'
                    ? 'ఆసుపత్రిలోకి ప్రవేశించిన తర్వాత నేను ఎక్కడికి వెళ్ళాలి?'
                    : 'Where should I go after entering the hospital?'
                )
              }
              className="py-3 px-5 rounded-2xl bg-[#493C39] hover:bg-[#C88F98] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircleHeart className="w-4 h-4 text-[#E6C1C4]" />
              <span>
                {currentLanguage === 'kn'
                  ? 'AI ನಾವಿಗೇಟರ್ ಕೇಳಿ'
                  : currentLanguage === 'te'
                  ? 'AI నావిగేటర్‌ను అడగండి'
                  : 'Ask AI Navigation Guide'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStage(3);
                markDemoStep('dt-6-route');
              }}
              className="py-2.5 px-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/50 hover:border-[#4A6347] text-[#322826] text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#4A6347]" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ನೇರವಾಗಿ ನಕ್ಷೆಗೆ ಹೋಗಿ'
                  : currentLanguage === 'te'
                  ? 'నేరుగా ఫ్లోర్ మ్యాప్‌కు వెళ్ళండి'
                  : 'Jump to Floor Map (Stage 3)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPageChange('recovery')}
              className="py-2 px-5 rounded-2xl bg-[#E6C1C4]/25 border border-[#C88F98] hover:bg-[#E6C1C4]/45 text-[#493C39] text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8A6D3F]" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆ? Smart Recovery'
                  : currentLanguage === 'te'
                  ? 'ఆకస్మిక మార్పు ఉందా? Smart Recovery'
                  : 'Unexpected Change? Smart Recovery'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Feature 10: Collapsible Design Thinking Demonstration Walkthrough */}
      {demoTrackerOpen && (
        <section
          aria-label="Design Thinking Demonstration Checklist"
          className="bg-[#FCF9F5] border-2 border-[#BEA06D]/55 rounded-3xl p-5 sm:p-6 space-y-4 soft-fade-up no-print"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
                {currentLanguage === 'kn'
                  ? 'ಶೈಕ್ಷಣಿಕ ಮೌಲ್ಯಮಾಪನ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ (9 ಹಂತಗಳು)'
                  : currentLanguage === 'te'
                  ? 'అకడమిక్ డిజైన్ థింకింగ్ మూల్యాంకన డెమో (9 దశలు)'
                  : 'Academic Design Thinking Evaluation Mode (9 Steps)'}
              </span>
              <h2 className="font-display text-2xl font-bold text-[#322826]">
                {currentLanguage === 'kn'
                  ? 'ಸಂಪೂರ್ಣ ಸ್ಮಾರ್ಟ್ ನ್ಯಾವಿಗೇಟರ್ ಪಯಣವನ್ನು ಪರೀಕ್ಷಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'పూర్తి స్మార్ట్ నావిగేటర్ డెమో ప్రయాణాన్ని పరీక్షించండి'
                  : 'Walk Through the Complete 9-Step Fictional Evaluation'}
              </h2>
            </div>

            {/* Quick language picker inside academic walkthrough */}
            <div className="inline-flex items-center bg-white border border-[#BEA06D]/40 rounded-full p-0.5 self-start">
              {(['en', 'kn', 'te'] as const).map((langOpt) => (
                <button
                  key={langOpt}
                  type="button"
                  onClick={() => {
                    onLanguageChange(langOpt);
                    markDemoStep('dt-1-lang');
                  }}
                  className={`compact-chip px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                    currentLanguage === langOpt
                      ? 'bg-[#BEA06D] text-white'
                      : 'text-[#493C39]'
                  }`}
                >
                  {langOpt === 'en' ? 'English' : langOpt === 'kn' ? 'ಕನ್ನಡ' : 'తెలుగు'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {DESIGN_THINKING_DEMO_STEPS.map((stepItem) => {
              const done = !!demoDoneSteps[stepItem.id];
              return (
                <button
                  key={stepItem.id}
                  type="button"
                  onClick={() => {
                    markDemoStep(stepItem.id);
                    if (stepItem.targetStage) {
                      setStage(stepItem.targetStage);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-start gap-2.5 transition-all cursor-pointer ${
                    done
                      ? 'bg-[#A2B29B]/20 border-[#4A6347]/55 text-[#322826]'
                      : 'bg-white border-[#BEA06D]/30 hover:border-[#BEA06D] text-[#493C39]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      done ? 'bg-[#4A6347] text-white check-pop' : 'border border-[#BEA06D]'
                    }`}
                  >
                    {done && <Check className="w-3 h-3" />}
                  </span>
                  <span className="leading-snug">{stepItem.label[currentLanguage]}</span>
                </button>
              );
            })}
          </div>

          {demoAllDone ? (
            <div className="p-4 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347]/50 text-xs sm:text-sm text-[#322826] space-y-1">
              <strong className="text-[#4A6347] block">
                {currentLanguage === 'kn'
                  ? 'ಮೌಲ್ಯಮಾಪನ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪೂರ್ಣಗೊಂಡಿದೆ'
                  : currentLanguage === 'te'
                  ? 'అకడమిక్ మూల్యాంకన డెమో పూర్తయింది'
                  : 'Evaluation Walkthrough Complete (Fictional Prototype)'}
              </strong>
              <p>
                {currentLanguage === 'kn'
                  ? 'ಗಮನಿಸಿ: ಇದು ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ವಿನ್ಯಾಸ ಮತ್ತು ಮಾದರಿ ರೋಗಿ ದತ್ತಾಂಶದ ಮೇಲೆ ನಡೆಸಿದ ಶೈಕ್ಷಣಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ — ನಿಜವಾದ ಆಸ್ಪತ್ರೆ ಅಥವಾ ರೋಗಿ ಪರೀಕ್ಷೆಯಲ್ಲ.'
                  : currentLanguage === 'te'
                  ? 'గమనిక: ఇది కల్పిత ఆసుపత్రి లేఅవుట్ మరియు నమూనా రోగి డేటాపై చేసిన అకడమిక్ డెమో మాత్రమే — నిజమైన క్లినికల్ పరీక్ష కాదు.'
                  : 'Note: All steps were demonstrated using fictional hospital maps and sample profiles for design-thinking evaluation, not live clinical or patient testing.'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#493C39]/75">
              {currentLanguage === 'kn'
                ? 'ಈ ಮೋಡ್ ಶೈಕ್ಷಣಿಕ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಕಾಲ್ಪನಿಕ ಮಾದರಿಗಳನ್ನು ಬಳಸುತ್ತದೆ — ನಿಜವಾದ ರೋಗಿ ಪರೀಕ್ಷೆಯಲ್ಲ.'
                : currentLanguage === 'te'
                ? 'ఈ డెమో మోడ్ అకడమిక్ ప్రదర్శన కోసం కల్పిత డేటాను ఉపయోగిస్తుంది — నిజమైన రోగుల పరీక్ష కాదు.'
                : 'Interactive design-thinking evaluation checklist using fictional demonstration scenarios (not real clinical testing).'}
            </p>
          )}
        </section>
      )}

      {/* Feature 5: Gentle Guidance Focus Mode (Replaces multi-card grid cleanly while active) */}
      {gentleModeActive ? (
        <NavigatorGentleMode
          language={currentLanguage}
          route={route}
          onExitGentleMode={() => setGentleModeActive(false)}
          onAskCompanion={(prompt) => handleAskCompanionRoute(prompt)}
          onFinishJourney={() => {
            setGentleModeActive(false);
            setStage(5);
            markDemoStep('dt-9-card');
          }}
        />
      ) : (
        <>
          {/* 5-Stage Interactive Progress Stepper */}
          <nav
            aria-label="Smart Hospital Navigator Stages"
            className="bg-white border border-[#BEA06D]/35 rounded-3xl p-3 sm:p-4 no-print"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {NAVIGATOR_STAGES.map((st) => {
                const isActive = stage === st.number;
                const isPast = stage > st.number;
                return (
                  <button
                    key={st.number}
                    type="button"
                    onClick={() => {
                      setStage(st.number);
                      if (st.number === 2) markDemoStep('dt-4-arrive');
                      if (st.number === 3) markDemoStep('dt-6-route');
                      if (st.number === 4) markDemoStep('dt-8-journey');
                      if (st.number === 5) markDemoStep('dt-9-card');
                    }}
                    aria-current={isActive ? 'step' : undefined}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#493C39] border-[#493C39] text-white shadow-xs'
                        : isPast
                        ? 'bg-[#A2B29B]/15 border-[#4A6347]/45 text-[#322826]'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/25 hover:border-[#BEA06D] text-[#493C39]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 tabular-nums ${
                        isActive
                          ? 'bg-[#BEA06D] text-white'
                          : isPast
                          ? 'bg-[#4A6347] text-white'
                          : 'bg-white border border-[#BEA06D]/50 text-[#8A6D3F]'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : st.number}
                    </span>
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isActive ? 'text-[#E6C1C4]' : 'text-[#8A6D3F]'
                        }`}
                      >
                        {currentLanguage === 'kn'
                          ? `ಹಂತ ${st.number}`
                          : currentLanguage === 'te'
                          ? `దశ ${st.number}`
                          : `Stage ${st.number}`}
                      </span>
                      <span className="text-xs sm:text-sm font-bold leading-snug block truncate">
                        {st.shortTitle[currentLanguage]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* STAGE 1 — Before Leaving Home */}
          {stage === 1 && (
            <section className="bg-white border border-[#BEA06D]/40 rounded-3xl p-5 sm:p-8 space-y-6 soft-fade-up">
              <div className="space-y-1.5 border-b border-[#BEA06D]/20 pb-4">
                <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
                  {currentLanguage === 'kn'
                    ? 'ಹಂತ 1 · ಮನೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ'
                    : currentLanguage === 'te'
                    ? 'దశ 1 · ఇంటి నుండి బయలుదేరే ముందు'
                    : 'Stage 1 · Before Leaving Home'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                  {NAVIGATOR_STAGES[0].title[currentLanguage]}
                </h2>
                <p className="text-sm text-[#493C39]/80">
                  {NAVIGATOR_STAGES[0].subtitle[currentLanguage]}
                </p>
              </div>

              {/* Fictional Sample Patient / Visit Summary */}
              <div className="bg-[#FCF9F5] border border-[#BEA06D]/40 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
                      {currentLanguage === 'kn'
                        ? 'ಕಾಲ್ಪನಿಕ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮಾದರಿ'
                        : currentLanguage === 'te'
                        ? 'కల్పిత అపాయింట్‌మెంట్ నమూనా'
                        : 'Fictional Demonstration Appointment'}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#322826]">
                      {patientName} ·{' '}
                      {currentLanguage === 'kn'
                        ? appointment.testNameKannada
                        : currentLanguage === 'te'
                        ? appointment.testNameTelugu
                        : appointment.testName}
                    </h3>
                  </div>

                  {/* Switch sample fictional profile */}
                  <div className="flex flex-wrap gap-1.5">
                    {allAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => {
                          onSelectAppointment(apt);
                          markDemoStep('dt-2-apt');
                        }}
                        className={`compact-chip px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                          apt.id === appointment.id
                            ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                            : 'bg-white border-[#BEA06D]/40 text-[#493C39]'
                        }`}
                      >
                        {currentLanguage === 'kn'
                          ? apt.patientNameKannada
                          : currentLanguage === 'te'
                          ? apt.patientNameTelugu
                          : apt.patientName.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#322826]">
                  <div className="p-3 rounded-xl bg-white border border-[#BEA06D]/25 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#C88F98] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#8A6D3F] block">
                        {currentLanguage === 'kn' ? 'ದಿನಾಂಕ' : currentLanguage === 'te' ? 'తేదీ' : 'Date'}
                      </span>
                      <strong className="tabular-nums">{appointment.date}</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#BEA06D]/25 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#8A6D3F] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#8A6D3F] block">
                        {currentLanguage === 'kn' ? 'ಸಮಯ' : currentLanguage === 'te' ? 'సమయం' : 'Time'}
                      </span>
                      <strong className="tabular-nums">{appointment.time}</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#BEA06D]/25 flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#4A6347] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[11px] text-[#8A6D3F] block">
                        {currentLanguage === 'kn' ? 'ವಿಭಾಗ' : currentLanguage === 'te' ? 'విభాగం' : 'Demo Department'}
                      </span>
                      <strong className="truncate block">{appointment.testCategory}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Documents & Preparation Checklist */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#322826] flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#4A6347]" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಮನೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ ಸಿದ್ಧತಾ ಪಟ್ಟಿ'
                        : currentLanguage === 'te'
                        ? 'ఇంటి నుండి బయలుదేరే ముందు తయారీ జాబితా'
                        : 'Before-Leaving Preparation Checklist'}
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-[#4A6347] tabular-nums">
                    {prepCompletedCount}/{STAGE_1_CHECKLIST.length}{' '}
                    {currentLanguage === 'kn' ? 'ಸಿದ್ಧವಾಗಿದೆ' : currentLanguage === 'te' ? 'సిద్ధం' : 'ready'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STAGE_1_CHECKLIST.map((item) => {
                    const checked = !!completedChecklist[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleChecklist(item.id)}
                        aria-pressed={checked}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          checked
                            ? 'bg-[#A2B29B]/15 border-[#4A6347]/55'
                            : 'bg-white border-[#BEA06D]/35 hover:border-[#BEA06D]'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                            checked
                              ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                              : 'bg-[#FCF9F5] border-[#BEA06D]'
                          }`}
                        >
                          {checked && <Check className="w-4 h-4" />}
                        </span>
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-[#322826] block leading-snug">
                            {item.label[currentLanguage]}
                          </span>
                          <span className="text-xs text-[#493C39]/80 block leading-relaxed">
                            {item.helper[currentLanguage]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {renderStageNavigationFooter()}
            </section>
          )}

          {/* STAGE 2 — Arriving at the Hospital */}
          {stage === 2 && (
            <section className="bg-white border border-[#BEA06D]/40 rounded-3xl p-5 sm:p-8 space-y-6 soft-fade-up">
              <div className="space-y-1.5 border-b border-[#BEA06D]/20 pb-4">
                <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
                  {currentLanguage === 'kn'
                    ? 'ಹಂತ 2 · ಆಸ್ಪತ್ರೆಗೆ ತಲುಪಿದಾಗ'
                    : currentLanguage === 'te'
                    ? 'దశ 2 · ఆసుపత్రికి చేరుకున్నప్పుడు'
                    : 'Stage 2 · Arriving at the Hospital'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                  {NAVIGATOR_STAGES[1].title[currentLanguage]}
                </h2>
                <p className="text-sm text-[#493C39]/80">
                  {NAVIGATOR_STAGES[1].subtitle[currentLanguage]}
                </p>
              </div>

              {/* Registration Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STAGE_2_ARRIVAL_OVERVIEW.map((stepCard) => {
                  const text = stepCard.simple[currentLanguage];
                  return (
                    <div
                      key={stepCard.stepNum}
                      className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#8A6D3F] tabular-nums">
                          {currentLanguage === 'kn'
                            ? `ಹಂತ ${stepCard.stepNum}`
                            : currentLanguage === 'te'
                            ? `దశ ${stepCard.stepNum}`
                            : `Step ${stepCard.stepNum}`}
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#322826]">
                          {stepCard.title[currentLanguage]}
                        </h3>
                        <p className="text-sm text-[#493C39]/85 leading-relaxed">
                          {text}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          speechService.speak(text, resolveSpeechLanguage(text, currentLanguage))
                        }
                        className="compact-chip self-start py-1.5 px-3 rounded-full bg-white border border-[#BEA06D]/45 text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#BEA06D]" />
                        <span>
                          {currentLanguage === 'kn'
                            ? 'ಆಲಿಸಿ'
                            : currentLanguage === 'te'
                            ? 'వినండి'
                            : 'Listen'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Department Destination Selector */}
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-xl font-bold text-[#322826]">
                  {currentLanguage === 'kn'
                    ? 'ನೀವು ಯಾವ ವಿಭಾಗಕ್ಕೆ ಹೋಗಬೇಕು? (ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ)'
                    : currentLanguage === 'te'
                    ? 'మీరు ఏ విభాగానికి వెళ్ళాలి? (ఒకటి ఎంచుకోండి)'
                    : 'Choose Your Fictional Destination Department'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {DEPARTMENT_QUICK_IDS.map((deptId) => {
                    const node = HOSPITAL_NODES[deptId];
                    const selected = destinationId === deptId;
                    return (
                      <button
                        key={deptId}
                        type="button"
                        onClick={() => handleDepartmentPick(deptId)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all space-y-2 cursor-pointer ${
                          selected
                            ? 'bg-[#A2B29B]/20 border-[#4A6347] shadow-xs'
                            : 'bg-white border-[#BEA06D]/35 hover:border-[#C88F98]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/30 flex items-center justify-center">
                            {getDeptIcon(deptId)}
                          </div>
                          {selected && (
                            <span className="text-[11px] font-bold text-[#4A6347] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {currentLanguage === 'kn'
                                ? 'ಆಯ್ದದ್ದು'
                                : currentLanguage === 'te'
                                ? 'ఎంచుకోబడింది'
                                : 'Selected'}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-display text-lg font-bold text-[#322826] block">
                            {node.name[currentLanguage]}
                          </span>
                          <span className="text-xs text-[#493C39]/80 block mt-0.5 leading-snug">
                            {node.description[currentLanguage]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comprehension Check 1 */}
              <NavigatorComprehensionCard
                item={NAVIGATOR_COMPREHENSION_CHECKS[0]}
                language={currentLanguage}
              />

              {renderStageNavigationFooter()}
            </section>
          )}

          {/* STAGE 3 — Finding the Department (Interactive SVG Floor Map + Steps + AI Companion) */}
          {stage === 3 && (
            <section className="space-y-6 soft-fade-up">
              {/* Interactive Hospital Floor Map Component */}
              <HospitalFloorMap
                language={currentLanguage}
                startId={startId}
                destinationId={destinationId}
                accessibleOnly={accessibleOnly}
                route={route}
                baselineRoute={routeComparison.baselineRoute}
                disabledEdgeIds={disabledEdgeIds}
                disruptionReason={routeComparison.reason[currentLanguage]}
                routeChanged={routeComparison.routeChanged}
                noAccessibleRouteFound={routeComparison.noAccessibleRouteFound}
                onStartChange={(id) => {
                  setStartId(id);
                  markDemoStep('dt-6-route');
                }}
                onDestinationChange={(id) => {
                  setDestinationId(id);
                  markDemoStep('dt-5-dept');
                  markDemoStep('dt-6-route');
                }}
                onToggleAccessible={() => {
                  setAccessibleOnly((v) => !v);
                  markDemoStep('dt-6-route');
                }}
                onSwapLocations={handleSwapMapPoints}
                onSimulatePreset={(edges) => {
                  const same =
                    edges.length === disabledEdgeIds.length &&
                    edges.every((id) => disabledEdgeIds.includes(id));
                  const nextEdges = same ? [] : edges;
                  setLocalDisabledEdges(nextEdges);
                  if (onUpdateDisruption) {
                    if (nextEdges.length === 0) {
                      onUpdateDisruption({ scenarioId: 'none', blockedEdgeIds: [] });
                    } else if (nextEdges.includes('lift-vertical')) {
                      onUpdateDisruption({
                        scenarioId: 'lift_unavailable',
                        blockedEdgeIds: nextEdges,
                        recommendedDestination: destinationId,
                      });
                    } else {
                      onUpdateDisruption({
                        scenarioId: 'corridor_blocked',
                        blockedEdgeIds: nextEdges,
                        recommendedDestination: destinationId,
                      });
                    }
                  }
                  if (nextEdges.length > 0) {
                    onRouteRecalculated?.();
                  }
                  markDemoStep('dt-6-route');
                }}
                onResetSimulation={() => {
                  setLocalDisabledEdges([]);
                  onUpdateDisruption?.({ scenarioId: 'none', blockedEdgeIds: [] });
                }}
                reduceMotion={reduceMotion}
              />

              {activeDisruption && activeDisruption.scenarioId !== 'none' && (
                <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#493C39]">
                    {RECOVERY_SCENARIOS.find((s) => s.id === activeDisruption.scenarioId)?.title[
                      currentLanguage
                    ] || 'Active Disruption'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleAskCompanionRoute(
                        currentLanguage === 'kn'
                          ? 'ನನ್ನ ಆಸ್ಪತ್ರೆ ದಾರಿ ಏಕೆ ಬದಲಾಗಿದೆ ಮತ್ತು ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?'
                          : currentLanguage === 'te'
                          ? 'నా ఆసుపత్రి దారి ఎందుకు మారింది మరియు నేను ఇప్పుడు ఏమి చేయాలి?'
                          : 'Why did my route change and what should I do next?'
                      )
                    }
                    className="compact-chip py-1.5 px-4 rounded-full bg-[#493C39] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircleHeart className="w-3.5 h-3.5 text-[#E6C1C4]" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'AI ಗೆ "ದಾರಿ ಏಕೆ ಬದಲಾಯಿತು?" ಎಂದು ಕೇಳಿ'
                        : currentLanguage === 'te'
                        ? 'AI ని "దారి ఎందుకు మారింది?" అని అడగండి'
                        : 'Ask AI: Why did my route change?'}
                    </span>
                  </button>
                </div>
              )}

              {/* Feature 4: Understand My Next Step — Step-by-Step Instructions */}
              <div className="bg-white border border-[#BEA06D]/40 rounded-3xl p-5 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider block">
                      CORE Understand My Next Step
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                      {currentLanguage === 'kn'
                        ? 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ ಸೂಚನೆಗಳು'
                        : currentLanguage === 'te'
                        ? 'దశలవారీ నడక సూచనలు'
                        : 'Step-by-Step Walking Directions'}
                    </h2>
                  </div>

                  {/* Quick Global Simplicity Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#8A6D3F]">
                      {currentLanguage === 'kn'
                        ? 'ವಿವರಣಾ ಶೈಲಿ:'
                        : currentLanguage === 'te'
                        ? 'వివరణ స్థాయి:'
                        : 'Detail:'}
                    </span>
                    {(['standard', 'simple', 'extraSimple'] as StepDepth[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setStepDepth(d)}
                        className={`compact-chip px-3 py-1.5 rounded-full font-semibold border cursor-pointer ${
                          stepDepth === d
                            ? 'bg-[#493C39] border-[#493C39] text-white'
                            : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#493C39]'
                        }`}
                      >
                        {d === 'standard'
                          ? currentLanguage === 'kn'
                            ? 'ಸಾಮಾನ್ಯ'
                            : currentLanguage === 'te'
                            ? 'సాధారణ'
                            : 'Standard'
                          : d === 'simple'
                          ? currentLanguage === 'kn'
                            ? 'ಸರಳ'
                            : currentLanguage === 'te'
                            ? 'సులభం'
                            : 'Simple'
                          : currentLanguage === 'kn'
                          ? 'ಅತಿ ಸರಳ'
                          : currentLanguage === 'te'
                          ? 'అతి సులభం'
                          : 'Extra-Simple'}
                      </button>
                    ))}
                  </div>
                </div>

                {route.isSameLocation ? (
                  <div className="p-5 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347]/45 text-sm font-semibold text-[#322826]">
                    {currentLanguage === 'kn'
                      ? `ನಿಮ್ಮ ಆರಂಭ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ಒಂದೇ ಆಗಿದೆ (${route.start.name.kn}). ಬೇರೆ ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ.`
                      : currentLanguage === 'te'
                      ? `మీ ప్రారంభ మరియు గమ్య స్థానాలు ఒకేలా ఉన్నాయి (${route.start.name.te}). దయచేసి వేరే గదిని ఎంచుకోండి.`
                      : `Your starting point and destination are both ${route.start.name.en}. Choose another destination on the map above to see directions.`}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {route.steps.map((step) => {
                      const stepKey = `${route.accessibleOnly ? 'acc' : 'std'}-${step.edgeId}-${step.stepNumber}`;
                      return (
                        <NavigatorStepCard
                          key={stepKey}
                          step={step}
                          language={currentLanguage}
                          depth={stepDepth}
                          onDepthChange={setStepDepth}
                          understood={!!understoodSteps[stepKey]}
                          onToggleUnderstood={() =>
                            setUnderstoodSteps((prev) => ({
                              ...prev,
                              [stepKey]: !prev[stepKey],
                            }))
                          }
                          onAskClarification={handleAskClarificationStep}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Feature 3: Contextual Gemini AI Navigation Prompts */}
                <div className="bg-[#FCF9F5] border border-[#BEA06D]/40 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C88F98]" />
                      <h3 className="text-sm font-bold text-[#322826]">
                        {currentLanguage === 'kn'
                          ? 'CORE AI ಮಾರ್ಗದರ್ಶಕವನ್ನು ಈ ದಾರಿಯ ಬಗ್ಗೆ ಕೇಳಿ'
                          : currentLanguage === 'te'
                          ? 'ఈ దారి గురించి CORE AI నావిగేటర్‌ను అడగండి'
                          : 'Ask CORE AI Navigation Companion (Route-Aware)'}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-[#8A6D3F]">
                      {currentLanguage === 'kn'
                        ? 'Google Gemini · ಕಾಲ್ಪನಿಕ ನಕ್ಷೆ ಆಧಾರಿತ'
                        : currentLanguage === 'te'
                        ? 'Google Gemini · నమూనా మ్యాప్ ఆధారిత'
                        : 'Grounded strictly on this fictional map route'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {COMPANION_NAV_PROMPTS.map((qObj, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          handleAskCompanionRoute(
                            qObj[currentLanguage],
                            idx === 4 ? 'kn' : undefined
                          )
                        }
                        className="compact-chip text-left text-xs sm:text-[13px] px-3.5 py-2 rounded-xl bg-white hover:bg-[#E6C1C4]/25 border border-[#BEA06D]/40 text-[#322826] font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircleHeart className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                        <span>{qObj[currentLanguage]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Short Non-Clinical Accessibility Comprehension Check */}
                <NavigatorComprehensionCard
                  item={NAVIGATOR_COMPREHENSION_CHECKS[1]}
                  language={currentLanguage}
                />

                {renderStageNavigationFooter()}
              </div>
            </section>
          )}

          {/* STAGE 4 — Consultation Preparation */}
          {stage === 4 && (
            <section className="bg-white border border-[#BEA06D]/40 rounded-3xl p-5 sm:p-8 space-y-6 soft-fade-up">
              <div className="space-y-1.5 border-b border-[#BEA06D]/20 pb-4">
                <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
                  {currentLanguage === 'kn'
                    ? 'ಹಂತ 4 · ಸಮಾಲೋಚನೆಗೆ ಸಿದ್ಧತೆ'
                    : currentLanguage === 'te'
                    ? 'దశ 4 · కన్సల్టేషన్ తయారీ'
                    : 'Stage 4 · Consultation Preparation'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                  {NAVIGATOR_STAGES[3].title[currentLanguage]}
                </h2>
                <p className="text-sm text-[#493C39]/80">
                  {NAVIGATOR_STAGES[3].subtitle[currentLanguage]}
                </p>
              </div>

              {/* Selectable Questions for Hospital Staff */}
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-[#322826] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#C88F98]" />
                  <span>
                    {currentLanguage === 'kn'
                      ? 'ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್‌ಗೆ ಸೇರಿಸಲು ಪ್ರಶ್ನೆಗಳನ್ನು ಆರಿಸಿ'
                      : currentLanguage === 'te'
                      ? 'మీ నావిగేషన్ కార్డులో చేర్చడానికి ప్రశ్నలను ఎంచుకోండి'
                      : 'Select Helpful Questions to Bring to Staff'}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STAGE_4_STAFF_QUESTIONS.map((q) => {
                    const checked = !!selectedQuestions[q.id];
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuestions((prev) => ({
                            ...prev,
                            [q.id]: !prev[q.id],
                          }));
                          markDemoStep('dt-8-journey');
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          checked
                            ? 'bg-[#FCF9F5] border-[#BEA06D] shadow-xs'
                            : 'bg-white border-[#BEA06D]/30 hover:border-[#BEA06D]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            checked
                              ? 'bg-[#BEA06D] border-[#BEA06D] text-white check-pop'
                              : 'border-[#BEA06D]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-sm font-medium text-[#322826] leading-relaxed">
                          {q.text[currentLanguage]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Add custom question */}
                <form
                  onSubmit={handleAddCustomQuestion}
                  className="flex flex-col sm:flex-row gap-2.5 pt-2"
                >
                  <input
                    type="text"
                    value={customQuestionInput}
                    onChange={(e) => setCustomQuestionInput(e.target.value)}
                    maxLength={180}
                    placeholder={
                      currentLanguage === 'kn'
                        ? 'ನಿಮ್ಮದೇ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ (ಉದಾ: ನನ್ನ ವರದಿ ಎಷ್ಟು ಗಂಟೆಗೆ ಸಿಗುತ್ತದೆ?)'
                        : currentLanguage === 'te'
                        ? 'మీ స్వంత ప్రశ్నను ఇక్కడ రాయండి...'
                        : 'Add your own question for hospital staff...'
                    }
                    className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#BEA06D]/45 bg-[#FCF9F5] text-sm text-[#322826]"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಪ್ರಶ್ನೆ ಸೇರಿಸಿ'
                        : currentLanguage === 'te'
                        ? 'ప్రశ్న జోడించండి'
                        : 'Add Question'}
                    </span>
                  </button>
                </form>

                {customQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {customQuestions.map((cq, idx) => (
                      <div
                        key={idx}
                        className="px-3.5 py-2 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/40 text-xs font-semibold text-[#322826] flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-[#4A6347]" />
                        <span>{cq}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Clarity Link & AI Trigger */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider block">
                    {currentLanguage === 'kn'
                      ? 'ಪದಗಳ ಸರಳ ವಿವರಣೆ ಬೇಕೇ?'
                      : currentLanguage === 'te'
                      ? 'ఆసుపత్రి పదాల సులభ వివరణ కావాలా?'
                      : 'Confused by a term on a slip or hospital sign?'}
                  </span>
                  <p className="text-xs sm:text-sm text-[#493C39]/85">
                    {currentLanguage === 'kn'
                      ? 'ಅಸ್ಪಷ್ಟ ಆಸ್ಪತ್ರೆ ಪದಗಳನ್ನು CORE AI ಸಹಾಯಕವನ್ನು ಕೇಳಿ ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.'
                      : currentLanguage === 'te'
                      ? 'కష్టమైన ఆసుపత్రి పదాలను CORE AI సహాయకుడిని అడిగి సులభంగా తెలుసుకోండి.'
                      : 'Ask CORE AI Companion to explain administrative words or phrases calmly before your consultation.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleAskCompanionRoute(
                      currentLanguage === 'kn'
                        ? 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳು ಸಿಗದಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?'
                        : currentLanguage === 'te'
                        ? 'నా అపాయింట్‌మెంట్ వివరాలు కనిపించకపోతే ఏమి చేయాలి?'
                        : 'What should I do if I cannot find my appointment details?'
                    )
                  }
                  className="shrink-0 py-2.5 px-4 rounded-full bg-white border border-[#C88F98] text-[#322826] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircleHeart className="w-4 h-4 text-[#C88F98]" />
                  <span>
                    {currentLanguage === 'kn'
                      ? 'AI ಸ್ಪಷ್ಟೀಕರಣ ಪಡೆಯಿರಿ'
                      : currentLanguage === 'te'
                      ? 'AI వివరణ పొందండి'
                      : 'Ask AI for Clarity'}
                  </span>
                </button>
              </div>

              {renderStageNavigationFooter()}
            </section>
          )}

          {/* STAGE 5 — After the Visit & Personalized Navigation Card */}
          {stage === 5 && (
            <section className="space-y-6 soft-fade-up">
              {/* After Visit Checklist */}
              <div className="bg-white border border-[#BEA06D]/40 rounded-3xl p-5 sm:p-7 space-y-5 no-print">
                <div className="space-y-1.5 border-b border-[#BEA06D]/20 pb-4">
                  <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
                    {currentLanguage === 'kn'
                      ? 'ಹಂತ 5 · ಭೇಟಿಯ ನಂತರ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್'
                      : currentLanguage === 'te'
                      ? 'దశ 5 · సందర్శన తర్వాత & నావిగేషన్ కార్డు'
                      : 'Stage 5 · After the Visit & Navigation Card'}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                    {NAVIGATOR_STAGES[4].title[currentLanguage]}
                  </h2>
                  <p className="text-sm text-[#493C39]/80">
                    {NAVIGATOR_STAGES[4].subtitle[currentLanguage]}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STAGE_5_AFTER_VISIT.map((item) => {
                    const done = !!afterVisitChecklist[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleAfterVisit(item.id)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          done
                            ? 'bg-[#A2B29B]/15 border-[#4A6347]/55'
                            : 'bg-[#FCF9F5] border-[#BEA06D]/30 hover:border-[#BEA06D]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            done
                              ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                              : 'bg-white border-[#BEA06D]'
                          }`}
                        >
                          {done && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <div className="space-y-1">
                          <span className="text-xs sm:text-sm font-bold text-[#322826] block">
                            {item.label[currentLanguage]}
                          </span>
                          <span className="text-xs text-[#493C39]/80 block leading-relaxed">
                            {item.helper[currentLanguage]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Pharmacy / Lab exit route buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <span className="text-xs font-bold text-[#8A6D3F]">
                    {currentLanguage === 'kn'
                      ? 'ಭೇಟಿಯ ನಂತರದ ದಾರಿ ನೋಡಿ:'
                      : currentLanguage === 'te'
                      ? 'సందర్శన తర్వాత మార్గం చూడండి:'
                      : 'Quick follow-up route on map:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStartId('consultation');
                      setDestinationId('pharmacy');
                      setStage(3);
                    }}
                    className="compact-chip px-3.5 py-1.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#322826] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Accessibility className="w-3.5 h-3.5 text-[#4A6347]" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ವೈದ್ಯರ ಕೊಠಡಿ → ಔಷಧಾಲಯ'
                        : currentLanguage === 'te'
                        ? 'డాక్టర్ గది → ఫార్మసీ'
                        : 'Consultation → Pharmacy'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStartId('pharmacy');
                      setDestinationId('entrance');
                      setStage(3);
                    }}
                    className="compact-chip px-3.5 py-1.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#322826] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಔಷಧಾಲಯ → ಮುಖ್ಯ ದ್ವಾರ'
                        : currentLanguage === 'te'
                        ? 'ఫార్మసీ → ప్రధాన ద్వారం'
                        : 'Pharmacy → Main Entrance'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Feature 6: Personalized Printable Navigation Card */}
              <NavigationCardPrintable
                language={currentLanguage}
                appointment={appointment}
                route={route}
                completedChecklist={completedChecklist}
                selectedQuestions={selectedQuestions}
                customQuestions={customQuestions}
                onCardPrintedOrSaved={() => markDemoStep('dt-9-card')}
              />

              {renderStageNavigationFooter()}
            </section>
          )}
        </>
      )}
    </div>
  );
};
