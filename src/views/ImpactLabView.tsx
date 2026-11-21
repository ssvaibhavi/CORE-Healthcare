import React, { useState } from 'react';
import {
  ActiveDisruptionState,
  Language,
  PageView,
  SessionUsabilityMetrics,
} from '../types';
import { IMPACT_LAB_WORKFLOW_COMPARISON, RECOVERY_SCENARIOS } from '../data/recoveryData';
import { CARE_JOURNEY_STAGES } from '../data/enhancementsData';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  Footprints,
  HelpCircle,
  Info,
  MessageSquareHeart,
  Route,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface ImpactLabViewProps {
  currentLanguage: Language;
  sessionMetrics: SessionUsabilityMetrics;
  completedTasks: Record<string, boolean>;
  activeDisruption: ActiveDisruptionState;
  onToggleUnassistedCompletion: () => void;
  onPageChange: (page: PageView) => void;
}

export const ImpactLabView: React.FC<ImpactLabViewProps> = ({
  currentLanguage,
  sessionMetrics,
  completedTasks,
  activeDisruption,
  onToggleUnassistedCompletion,
  onPageChange,
}) => {
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const totalJourneyTasks = CARE_JOURNEY_STAGES.reduce(
    (sum, st) => sum + st.tasks.length,
    0
  );
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const checklistCompletionPct =
    totalJourneyTasks > 0 ? Math.round((completedCount / totalJourneyTasks) * 100) : 0;

  // Transparent elapsed time calculation strictly from real local session timestamps
  const endMs = sessionMetrics.journeyCompletedMs || Date.now();
  const rawElapsedSec = Math.max(1, Math.round((endMs - sessionMetrics.startedAtMs) / 1000));
  const elapsedDisplay =
    rawElapsedSec < 60
      ? `${rawElapsedSec}s`
      : `${Math.floor(rawElapsedSec / 60)}m ${rawElapsedSec % 60}s`;

  const withoutDemo = IMPACT_LAB_WORKFLOW_COMPARISON.withoutCore;
  const withDemo = IMPACT_LAB_WORKFLOW_COMPARISON.withCore;

  const activeScenario =
    activeDisruption.scenarioId !== 'none'
      ? RECOVERY_SCENARIOS.find((s) => s.id === activeDisruption.scenarioId)
      : undefined;

  // Transparent bar percentages for SVG chart
  const withoutMinutesPct = 100;
  const withMinutesPct = Math.round(
    (withDemo.estimatedMinutesDemo / withoutDemo.estimatedMinutesDemo) * 100
  );
  const withoutStepsPct = 100;
  const withStepsPct = Math.round((withDemo.stepsCount / withoutDemo.stepsCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('recovery')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#322826] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಸ್ಮಾರ್ಟ್ ರಿಕವರಿಗೆ ಮರಳಿ'
              : currentLanguage === 'te'
              ? 'స్మార్ట్ రికవరీకి తిరిగి వెళ్ళండి'
              : 'Back to Smart Recovery'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowFormulaInfo((v) => !v)}
          className="compact-chip py-1.5 px-4 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#8A6D3F] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಲೆಕ್ಕಾಚಾರದ ವಿವರಣೆ'
              : currentLanguage === 'te'
              ? 'లెక్కింపు వివరణ'
              : 'How Metrics Are Calculated'}
          </span>
        </button>
      </div>

      {/* Header */}
      <Reveal className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider inline-flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-[#C88F98]" />
          <span>
            {currentLanguage === 'kn'
              ? 'CORE ಇಂಪ್ಯಾಕ್ಟ್ ಲ್ಯಾಬ್ · ಶೈಕ್ಷಣಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ'
              : currentLanguage === 'te'
              ? 'CORE ఇంపాక్ట్ ల్యాబ్ · విద్యా ప్రోటోటైప్'
              : 'CORE Impact Lab · Academic Usability Comparison'}
          </span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#322826]">
          <WordReveal
            text={
              currentLanguage === 'kn'
                ? 'ಮಾರ್ಗದರ್ಶನವಿಲ್ಲದ ಭೇಟಿ ಮತ್ತು CORE ಹೊಂದಾಣಿಕೆಯ ಭೇಟಿ — ಪಾರದರ್ಶಕ ಹೋಲಿಕೆ'
                : currentLanguage === 'te'
                ? 'మార్గదర్శకత్వం లేని ఆసుపత్రి సందర్శన vs CORE అనుకూల ప్రయాణం'
                : 'Without CORE vs. With Guided Adaptive CORE'
            }
          />
        </h1>
        <p className="text-sm sm:text-base text-[#493C39]/80 leading-relaxed">
          {currentLanguage === 'kn'
            ? 'ಈ ಪುಟವು ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪ್ರವಾಹದ ಹಂತಗಳು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಬ್ರೌಸರ್ ಸೆಷನ್‌ನ ನೈಜ ಕೌಂಟರ್‌ಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ — ಯಾವುದೇ ಕಲ್ಪಿತ ಆಸ್ಪತ್ರೆ ಅಧ್ಯಯನ ಅಂಕಿಅಂಶಗಳಲ್ಲ.'
            : currentLanguage === 'te'
            ? 'ఈ పేజీ కల్పిత వర్క్‌ఫ్లో దశలను మరియు మీ ప్రస్తుత బ్రౌజర్ సెషన్‌లో జరిగిన నిజమైన కౌంటర్లను మాత్రమే చూపిస్తుంది — ఎలాంటి నకిలీ క్లినికల్ గణాంకాలు లేవు.'
            : 'Compares fictional baseline friction against guided adaptive support alongside your real in-session interaction counters. Never presents fictional numbers as real hospital outcomes.'}
        </p>
      </Reveal>

      {/* Honest Academic & Non-Clinical Trial Disclosure Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FCF9F5] border-2 border-[#BEA06D]/50 flex items-start gap-3 text-xs sm:text-sm text-[#322826]">
        <ShieldCheck className="w-5 h-5 text-[#4A6347] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-[#4A6347] block">
            {currentLanguage === 'kn'
              ? 'ಪಾರದರ್ಶಕತಾ ಪ್ರಕಟಣೆ: ಶೈಕ್ಷಣಿಕ ಪ್ರೋಟೋಟೈಪ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ (ನೈಜ ಕ್ಲಿನಿಕಲ್ ಡೇಟಾ ಅಲ್ಲ)'
              : currentLanguage === 'te'
              ? 'పారదర్శకత గమనిక: విద్యా ప్రోటోటైప్ ప్రదర్శన (నిజమైన క్లినికల్ ట్రయల్ డేటా కాదు)'
              : 'Transparency Notice: Academic Prototype Demonstration — Not Real Clinical Research Data'}
          </strong>
          <p className="text-[#493C39]/85 leading-relaxed">
            {currentLanguage === 'kn'
              ? 'ಎಡಭಾಗದ "ಸಾಮಾನ್ಯ" ಮಾನದಂಡಗಳು ವಿನ್ಯಾಸ ಚಿಂತನೆಯ (Design Thinking) ಕಾಲ್ಪನಿಕ ಉದಾಹರಣೆಗಳಾಗಿವೆ. ಕೆಳಗಿನ "ಪ್ರಸ್ತುತ ಸೆಷನ್" ಕೌಂಟರ್‌ಗಳು ನೀವು ಈಗ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾಡಿದ ನಿಜವಾದ ಕ್ರಿಯೆಗಳಿಂದ ಲೆಕ್ಕಹಾಕಲ್ಪಡುತ್ತವೆ.'
              : currentLanguage === 'te'
              ? 'ఎడమవైపు ఉన్న "సాధారణ" అంచనాలు కేవలం కల్పిత డిజైన్ థింకింగ్ నమూనాలు. దిగువ ఉన్న "ప్రస్తుత సెషన్" కౌంటర్లు ఈ బ్రౌజర్‌లో మీరు చేసిన నిజమైన చర్యల నుండి లెక్కించబడ్డాయి.'
              : 'Baseline workflow comparisons illustrate fictional design-thinking assumptions. Live Session Usability Counters below are computed strictly from real interactions in this browser session (zero fabricated statistics, zero PII stored).'}
          </p>
        </div>
      </div>

      {/* Expandable Transparent Formula Breakdown */}
      {showFormulaInfo && (
        <div className="p-5 rounded-3xl bg-white border border-[#BEA06D]/45 space-y-3 text-xs sm:text-sm text-[#322826] soft-fade-up">
          <div className="flex items-center gap-2 font-bold text-[#8A6D3F]">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              {currentLanguage === 'kn'
                ? 'ಪ್ರಸ್ತುತ ಸೆಷನ್ ಕೌಂಟರ್ ಸೂತ್ರಗಳು'
                : currentLanguage === 'te'
                ? 'ప్రస్తుత సెషన్ కౌంటర్ సూత్రాలు'
                : 'Exact Live Session Calculation Formulas'}
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#493C39]">
            <li className="p-3 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
              <strong>Navigation Steps Taken:</strong> Count of page transitions (`sessionMetrics.navigationStepsTaken`).
            </li>
            <li className="p-3 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
              <strong>Checklist Completion Rate:</strong> `completedCount ({completedCount}) / totalTasks ({totalJourneyTasks}) = {checklistCompletionPct}%`.
            </li>
            <li className="p-3 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
              <strong>Route Recalculations:</strong> Count of dynamic Dijkstra disruption triggers or accessible toggles (`{sessionMetrics.routeRecalculations}`).
            </li>
            <li className="p-3 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
              <strong>Session Elapsed Duration:</strong> Wall-clock difference between session start and latest completion (`{elapsedDisplay}`).
            </li>
          </ul>
        </div>
      )}

      {/* Live Current-Session Usability Telemetry Cards */}
      <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಬ್ರೌಸರ್ ಸೆಷನ್ (ನೈಜ ಕೌಂಟರ್‌ಗಳು)'
                : currentLanguage === 'te'
                ? 'మీ ప్రస్తుత బ్రౌజర్ సెషన్ (నిజమైన కౌంటర్లు)'
                : 'Live In-Session Usability Counters'}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#322826]">
              {currentLanguage === 'kn'
                ? 'ಈ ಸೆಷನ್‌ನಲ್ಲಿ CORE ಬಳಕೆಯ ವಿವರ'
                : currentLanguage === 'te'
                ? 'ఈ సెషన్‌లో మీ CORE వినియోగ గణాంకాలు'
                : 'Measured Actions During Your Current Walkthrough'}
            </h2>
          </div>

          {activeScenario && (
            <div className="px-3.5 py-1.5 rounded-full bg-[#E6C1C4]/30 border border-[#C88F98] text-xs font-bold text-[#322826]">
              {activeScenario.title[currentLanguage]}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <Footprints className="w-4 h-4 text-[#8A6D3F]" />
            <div className="font-display text-3xl font-bold text-[#322826] tabular-nums">
              {sessionMetrics.navigationStepsTaken}
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? 'ನ್ಯಾವಿಗೇಷನ್ ಹಂತಗಳು'
                : currentLanguage === 'te'
                ? 'నావిగేషన్ దశలు'
                : 'Navigation Steps Taken'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-[#4A6347]" />
            <div className="font-display text-3xl font-bold text-[#4A6347] tabular-nums">
              {checklistCompletionPct}%
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? `ಪಟ್ಟಿ ಪೂರ್ಣತೆ (${completedCount}/${totalJourneyTasks})`
                : currentLanguage === 'te'
                ? `జాబితా పూర్తి (${completedCount}/${totalJourneyTasks})`
                : `Tasks Completed (${completedCount}/${totalJourneyTasks})`}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <Route className="w-4 h-4 text-[#C88F98]" />
            <div className="font-display text-3xl font-bold text-[#322826] tabular-nums">
              {sessionMetrics.routeRecalculations}
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? 'ಮಾರ್ಗ ಮರುಲೆಕ್ಕಾಚಾರಗಳು'
                : currentLanguage === 'te'
                ? 'మార్గపు మళ్లింపులు'
                : 'Route Recalculations'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <MessageSquareHeart className="w-4 h-4 text-[#8A6D3F]" />
            <div className="font-display text-3xl font-bold text-[#322826] tabular-nums">
              {sessionMetrics.clarificationRequests}
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? 'ಸ್ಪಷ್ಟೀಕರಣ ವಿನಂತಿಗಳು'
                : currentLanguage === 'te'
                ? 'స్పష్టత ప్రశ్నలు'
                : 'Clarification Requests'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <Sparkles className="w-4 h-4 text-[#4A6347]" />
            <div className="font-display text-3xl font-bold text-[#322826] tabular-nums">
              {sessionMetrics.teachBackAttempts}
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? 'ಟೀಚ್-ಬ್ಯಾಕ್ ಪ್ರಯತ್ನಗಳು'
                : currentLanguage === 'te'
                ? 'టీచ్-బ్యాక్ ప్రయత్నాలు'
                : 'Teach-Back Checks'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-1">
            <Clock className="w-4 h-4 text-[#8A6D3F]" />
            <div className="font-display text-3xl font-bold text-[#322826] tabular-nums">
              {elapsedDisplay}
            </div>
            <div className="text-[11px] font-semibold text-[#493C39]/80">
              {currentLanguage === 'kn'
                ? 'ಕಾರ್ಯ ಅವಧಿ'
                : currentLanguage === 'te'
                ? 'సెషన్ సమయం'
                : 'Session Time Elapsed'}
            </div>
          </div>
        </div>

        {/* Unassisted Completion Self-Report Toggle */}
        <div className="p-4 rounded-2xl bg-[#A2B29B]/15 border border-[#4A6347]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <UserCheck className="w-5 h-5 text-[#4A6347] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#322826] block">
                {currentLanguage === 'kn'
                  ? 'ಬೇರೆಯವರ ಸಹಾಯವಿಲ್ಲದೆ ಈ ಪಯಣವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಯಿತೇ?'
                  : currentLanguage === 'te'
                  ? 'మరొకరి సహాయం లేకుండానే ఈ ప్రయాణాన్ని అర్థం చేసుకోగలిగారా?'
                  : 'Task Clarity Check: Completed Fictional Journey Without Outside Staff Assistance?'}
              </span>
              <span className="text-xs text-[#493C39]/80">
                {currentLanguage === 'kn'
                  ? 'ಡೆಮೊ ಪ್ರದರ್ಶಕರು ಅಥವಾ ರೋಗಿಗಳು ಈ ಸ್ವಯಂ-ಪರಿಶೀಲನೆಯನ್ನು ಟಾಗಲ್ ಮಾಡಬಹುದು.'
                  : currentLanguage === 'te'
                  ? 'డెమో పరిశీలకులు లేదా వినియోగదారులు దీనిని ఎంచుకోవచ్చు.'
                  : 'Used in usability evaluation demos to note whether instructions alone felt sufficient.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleUnassistedCompletion}
            aria-pressed={sessionMetrics.completedWithoutAssistance}
            className={`py-2 px-4 rounded-full text-xs font-bold border-2 transition-colors shrink-0 cursor-pointer ${
              sessionMetrics.completedWithoutAssistance
                ? 'bg-[#4A6347] border-[#4A6347] text-white'
                : 'bg-white border-[#BEA06D]/50 text-[#493C39] hover:border-[#4A6347]'
            }`}
          >
            {sessionMetrics.completedWithoutAssistance
              ? currentLanguage === 'kn'
                ? 'ಹೌದು — ಸ್ವತಂತ್ರವಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ'
                : currentLanguage === 'te'
                ? 'అవును — స్వయంగా పూర్తయింది'
                : 'Marked: Completed Independently'
              : currentLanguage === 'kn'
              ? 'ಸ್ವತಂತ್ರ ಪೂರ್ಣತೆ ಗುರುತಿಸಿ'
              : currentLanguage === 'te'
              ? 'స్వయంగా పూర్తి అని గుర్తించండి'
              : 'Mark Completed Without Assistance'}
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison: Without CORE vs With Guided CORE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unassisted Workflow */}
        <div className="bg-[#FCF9F5] border-2 border-[#E6C1C4] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#9E4958] uppercase tracking-wider">
              {currentLanguage === 'kn'
                ? 'CORE ಇಲ್ಲದ ಸಾಮಾನ್ಯ ವಿಧಾನ (ಕಾಲ್ಪನಿಕ)'
                : currentLanguage === 'te'
                ? 'CORE లేని సాధారణ విధానం (నమూనా)'
                : 'Baseline Fictional Workflow (Without CORE)'}
            </span>
            <span className="text-xs font-bold text-[#9E4958] tabular-nums">
              {withoutDemo.stepsCount} steps · ~{withoutDemo.estimatedMinutesDemo} min demo
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-[#322826]">
            {withoutDemo.title[currentLanguage]}
          </h3>

          <ul className="space-y-2.5 text-sm text-[#493C39]">
            {withoutDemo.frictionPoints[currentLanguage].map((point, idx) => (
              <li
                key={idx}
                className="p-3 rounded-2xl bg-white border border-[#E6C1C4]/70 leading-relaxed break-words"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Guided Adaptive CORE */}
        <div className="bg-white border-2 border-[#4A6347]/55 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider">
              {currentLanguage === 'kn'
                ? 'CORE ಮಾರ್ಗದರ್ಶಿತ ಹೊಂದಾಣಿಕೆಯ ವಿಧಾನ'
                : currentLanguage === 'te'
                ? 'CORE అనుకూల మార్గదర్శక విధానం'
                : 'Guided Adaptive Workflow (With CORE)'}
            </span>
            <span className="text-xs font-bold text-[#4A6347] tabular-nums">
              {withDemo.stepsCount} steps · ~{withDemo.estimatedMinutesDemo} min demo
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-[#322826]">
            {withDemo.title[currentLanguage]}
          </h3>

          <ul className="space-y-2.5 text-sm text-[#322826]">
            {withDemo.benefits[currentLanguage].map((benefit, idx) => (
              <li
                key={idx}
                className="p-3 rounded-2xl bg-[#A2B29B]/14 border border-[#4A6347]/35 flex items-start gap-2.5 leading-relaxed break-words"
              >
                <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0 mt-1" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Clean SVG Chart Comparison (Fictional Design Comparison) */}
      <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ದೃಶ್ಯ ಹೋಲಿಕೆ (ಕಾಲ್ಪನಿಕ ವಿನ್ಯಾಸ ಮಾದರಿ)'
                : currentLanguage === 'te'
                ? 'దృశ్య పోలిక (నమూనా డిజైన్ మోడల్)'
                : 'Visual Workflow Comparison (Fictional Design Baseline)'}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#322826]">
              {currentLanguage === 'kn'
                ? 'ದಾರಿ ಹುಡುಕಾಟದ ಹಂತಗಳು ಮತ್ತು ಅಂದಾಜು ಸಮಯದ ಹೋಲಿಕೆ'
                : currentLanguage === 'te'
                ? 'ఆసుపత్రి దశలు & అంచనా సమయపు పోలిక'
                : 'Estimated Fictional Confusion-Point Steps & Visit Prep Duration'}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#493C39]/70">
            Fictional Baseline Model — Not Hospital Audit Data
          </span>
        </div>

        <svg
          viewBox="0 0 760 210"
          role="img"
          aria-label="Fictional workflow comparison chart between unassisted visit and guided CORE journey"
          className="w-full h-auto block"
        >
          {/* Metric 1: Confusion / Counter Transfers */}
          <text x="16" y="30" fill="#322826" fontSize="13" fontWeight="700">
            {currentLanguage === 'kn'
              ? 'ಭೇಟಿ ಹಂತಗಳು / ಕೌಂಟರ್ ಗೊಂದಲದ ಬಿಂದುಗಳು'
              : currentLanguage === 'te'
              ? 'సందర్శన దశలు / కౌంటర్ మలుపులు'
              : 'Workflow Handoffs & Desk Backtracking Points (Fictional Baseline)'}
          </text>
          <rect x="16" y="42" width="540" height="22" rx="11" fill="#F3EAE3" />
          <rect
            x="16"
            y="42"
            width={5.4 * withoutStepsPct}
            height="22"
            rx="11"
            fill="#C88F98"
          />
          <text x="570" y="57" fill="#9E4958" fontSize="12" fontWeight="700">
            {withoutDemo.stepsCount} steps (Without CORE)
          </text>

          <rect x="16" y="72" width="540" height="22" rx="11" fill="#F3EAE3" />
          <rect
            x="16"
            y="72"
            width={5.4 * withStepsPct}
            height="22"
            rx="11"
            fill="#4A6347"
          />
          <text x="570" y="87" fill="#4A6347" fontSize="12" fontWeight="700">
            {withDemo.stepsCount} steps (With Guided CORE)
          </text>

          {/* Metric 2: Estimated Orientation Time */}
          <text x="16" y="130" fill="#322826" fontSize="13" fontWeight="700">
            {currentLanguage === 'kn'
              ? 'ಅಂದಾಜು ದಿಕ್ಕು ಹುಡುಕುವ ಸಮಯ (ನಿಮಿಷಗಳು · ಕಾಲ್ಪನಿಕ)'
              : currentLanguage === 'te'
              ? 'అంచనా మార్గదర్శన సమయం (నిమిషాలు · నమూనా)'
              : 'Estimated Check-In & Orientation Time (Fictional Scenario Comparison)'}
          </text>
          <rect x="16" y="142" width="540" height="22" rx="11" fill="#F3EAE3" />
          <rect
            x="16"
            y="142"
            width={5.4 * withoutMinutesPct}
            height="22"
            rx="11"
            fill="#C88F98"
          />
          <text x="570" y="157" fill="#9E4958" fontSize="12" fontWeight="700">
            ~{withoutDemo.estimatedMinutesDemo} min (Without CORE)
          </text>

          <rect x="16" y="172" width="540" height="22" rx="11" fill="#F3EAE3" />
          <rect
            x="16"
            y="172"
            width={5.4 * withMinutesPct}
            height="22"
            rx="11"
            fill="#4A6347"
          />
          <text x="570" y="187" fill="#4A6347" fontSize="12" fontWeight="700">
            ~{withDemo.estimatedMinutesDemo} min (With Guided CORE)
          </text>
        </svg>

        <div className="pt-3 border-t border-[#BEA06D]/20 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onPageChange('recovery')}
            className="py-2.5 px-5 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn'
                ? 'ಇನ್ನೊಂದು ಸನ್ನಿವೇಶ ಪರೀಕ್ಷಿಸಿ'
                : currentLanguage === 'te'
                ? 'మరో పరిస్థితిని పరీక్షించండి'
                : 'Try Another Disruption Scenario'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onPageChange('insights')}
            className="py-2.5 px-5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/50 hover:border-[#8A6D3F] text-xs sm:text-sm font-semibold text-[#493C39] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentLanguage === 'kn'
                ? 'CORE ಒಳನೋಟಗಳ ಪುಟ ತೆರೆಯಿರಿ'
                : currentLanguage === 'te'
                ? 'CORE ఇన్‌సైట్స్ పేజీ చూడండి'
                : 'View CORE Insights'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
