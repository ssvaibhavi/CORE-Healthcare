import React, { useState } from 'react';
import { Language, PageView } from '../types';
import { INSIGHTS_DEMO_SEGMENTS, INSIGHTS_IMPROVEMENTS } from '../data/phase2Data';
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Footprints,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface InsightsViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
  sessionActionsCount: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  currentLanguage,
  onPageChange,
  sessionActionsCount,
}) => {
  const [segmentId, setSegmentId] = useState<string>('all-all');
  const [showMetricInfo, setShowMetricInfo] = useState<boolean>(false);

  const segment =
    INSIGHTS_DEMO_SEGMENTS.find((s) => s.id === segmentId) || INSIGHTS_DEMO_SEGMENTS[0];

  const segmentOptions = [
    {
      id: 'all-all',
      label: {
        kn: 'ಎಲ್ಲಾ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಸನ್ನಿವೇಶಗಳು (Demo Set)',
        te: 'అన్ని డెమో నమూనాలు (All Demo Data)',
        en: 'All Fictional Demo Scenarios',
      },
    },
    {
      id: 'kn-first_time',
      label: {
        kn: 'ಕನ್ನಡ — ಮೊದಲ ಆಸ್ಪತ್ರೆ ಭೇಟಿದಾರರು',
        te: 'కన్నడ — మొదటిసారి సందర్శకులు',
        en: 'Kannada — First-Time Visitors',
      },
    },
    {
      id: 'te-caregiver',
      label: {
        kn: 'ತೆಲುಗು — ಆರೈಕೆದಾರರ ಬೆಂಬಲ',
        te: 'తెలుగు — సంరక్షకుల సహాయం',
        en: 'Telugu — Caregiver Support',
      },
    },
  ];

  // SVG Donut Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset =
    circumference - (segment.completionRatePct / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
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

        <button
          type="button"
          onClick={() => setShowMetricInfo(!showMetricInfo)}
          className="compact-chip px-3.5 py-1.5 rounded-full bg-white border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] hover:bg-[#FCF9F5] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಮೆಟ್ರಿಕ್ ವಿವರಣೆ'
              : currentLanguage === 'te'
              ? 'కొలమానాల వివరణ'
              : 'How Metrics Are Defined'}
          </span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>CORE Insights</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ನೈತಿಕ ಬಳಕೆಯ ಅನುಕೂಲ ವಿಶ್ಲೇಷಣೆ'
            : currentLanguage === 'te'
            ? 'నైతిక వినియోగదారు విశ్లేషణ (Analytics)'
            : 'Ethical Usability Analytics Dashboard'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಖಾಸಗಿ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯ ಬದಲು ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಸುಲಭತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುವ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್.'
            : currentLanguage === 'te'
            ? 'వ్యక్తిగత వైద్య సమాచారం కాకుండా వెబ్‌సైట్ సౌలభ్యాన్ని అంచనా వేసే డెమో డ్యాష్‌ಬోర్డ్.'
            : 'Evaluates interface usability, language preferences, and accessibility needs — never tracking private medical details.'}
        </p>
      </div>

      {/* Ethical & Fictional Dataset Disclosure */}
      <div className="p-4 rounded-2xl bg-[#FCF9F5] border-2 border-[#BEA06D]/45 flex items-start gap-3 text-xs sm:text-sm text-[#3C3330]">
        <ShieldCheck className="w-5 h-5 text-[#4A6347] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {currentLanguage === 'kn'
              ? 'ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಡೇಟಾಸೆಟ್ — ನೈಜ ಬಳಕೆದಾರರ ಮಾಹಿತಿಯಲ್ಲ'
              : currentLanguage === 'te'
              ? 'నమూనా డెమో డేటాసెట్ — నిజమైన రోగుల గణాంకాలు కావు'
              : 'Fictional Demonstration Dataset — Not Real User or Clinical Research Statistics'}
          </p>
          <p className="text-xs text-[#3C3330]/80">
            {currentLanguage === 'kn'
              ? 'ಭವಿಷ್ಯದಲ್ಲಿ ನೈಜ ಬಳಕೆಯ ಡೇಟಾ ಸಂಗ್ರಹಿಸುವಾಗ ರೋಗಿಯ ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ ಕಡ್ಡಾಯವಾಗಿರುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ ಗುರುತಿಸುವ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'భవిష్యత్తులో నిజమైన డేటా సేకరించాలంటే స్పష్టమైన అనుమతి తప్పనిసరి మరియు ఎలాంటి వ్యక్తిగత వైద్య సమాచారం సేకరించబడదు.'
              : 'In future real-world deployment, collecting actual usability telemetry would require explicit informed consent and exclude all identifying health information.'}
          </p>
        </div>
      </div>

      {showMetricInfo && (
        <div className="bg-white border border-[#BEA06D]/40 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#3C3330]/85 soft-fade-up">
          <div>
            <strong className="text-[#8F7242] block mb-1">Task Completion %</strong>
            {currentLanguage === 'kn'
              ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸುವುದು ಅಥವಾ ಚೆಕ್‌ಲಿಸ್ಟ್ ಪೂರ್ಣಗೊಳಿಸುವ ದರ.'
              : currentLanguage === 'te'
              ? 'అపాయింట్‌మెంట్ వినడం లేదా జాబితా పూర్తి చేసే శాతం.'
              : 'Share of fictional walkthroughs finishing a navigation goal cleanly.'}
          </div>
          <div>
            <strong className="text-[#8F7242] block mb-1">Avg Steps & Time</strong>
            {currentLanguage === 'kn'
              ? 'ಒಂದು ಕಾರ್ಯವನ್ನು ಮುಗಿಸಲು ತೆಗೆದುಕೊಂಡ ಸರಾಸರಿ ಕ್ಲಿಕ್‌ಗಳು ಮತ್ತು ಸೆಕೆಂಡುಗಳು.'
              : currentLanguage === 'te'
              ? 'ఒక పనిని పూర్తి చేయడానికి పట్టిన సగటు క్లిక్‌లు మరియు సమయం.'
              : 'Measures cognitive simplicity — fewer clicks and calmer completion pace.'}
          </div>
          <div>
            <strong className="text-[#8F7242] block mb-1">Local Session Counter</strong>
            {currentLanguage === 'kn'
              ? `ಈ ಸೆಷನ್‌ನಲ್ಲಿ ನೀವು ಪರೀಕ್ಷಿಸಿದ ಹಂತಗಳು: ${sessionActionsCount}`
              : currentLanguage === 'te'
              ? `ఈ సెషన్‌లో మీరు చూసిన దశలు: ${sessionActionsCount}`
              : `Non-identifying demo interactions explored in this session: ${sessionActionsCount}`}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#BEA06D]/30 rounded-2xl p-3">
        <div className="flex flex-wrap gap-2">
          {segmentOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSegmentId(opt.id)}
              className={`compact-chip px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                segmentId === opt.id
                  ? 'bg-[#BEA06D] text-white'
                  : 'bg-[#FCF9F5] text-[#3C3330] hover:bg-[#BEA06D]/15'
              }`}
            >
              {opt.label[currentLanguage]}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-[#4A6347] px-3">
          {currentLanguage === 'kn'
            ? `ಈ ಸೆಷನ್ ಕ್ರಿಯೆಗಳು: ${sessionActionsCount}`
            : currentLanguage === 'te'
            ? `ఈ సెషన్ చర్యలు: ${sessionActionsCount}`
            : `Live Demo Interactions: ${sessionActionsCount}`}
        </span>
      </div>

      {/* Top KPI Cards + SVG Completion Ring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: SVG Task Completion Gauge */}
        <div className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm flex items-center gap-5">
          <svg width="104" height="104" viewBox="0 0 104 104" className="shrink-0">
            <circle
              cx="52"
              cy="52"
              r={radius}
              fill="none"
              stroke="#F2EAE0"
              strokeWidth="10"
            />
            <circle
              cx="52"
              cy="52"
              r={radius}
              fill="none"
              stroke="#4A6347"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 52 52)"
              className="transition-all duration-500"
            />
            <text
              x="52"
              y="57"
              textAnchor="middle"
              className="fill-[#3C3330] font-bold text-lg"
            >
              {segment.completionRatePct}%
            </text>
          </svg>
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಕಾರ್ಯ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ'
                : currentLanguage === 'te'
                ? 'పని పూర్తి శాతం'
                : 'Task Completion Rate'}
            </span>
            <p className="text-xs text-[#3C3330]/75 mt-1">
              {currentLanguage === 'kn'
                ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಗುರಿಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ ದರ'
                : currentLanguage === 'te'
                ? 'డెమో లక్ష్యాలను పూర్తి చేసిన సగటు శాతం'
                : 'Simulated navigation goal completion across sample tasks'}
            </p>
          </div>
        </div>

        {/* KPI 2: Avg Steps */}
        <div className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex items-center justify-center shrink-0">
            <Footprints className="w-6 h-6 text-[#BEA06D]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಸರಾಸರಿ ಹಂತಗಳು'
                : currentLanguage === 'te'
                ? 'సగటు దశలు'
                : 'Avg. Steps per Action'}
            </span>
            <p className="font-display text-4xl font-bold text-[#3C3330] tabular-nums mt-1">
              {segment.avgStepsPerAction}
            </p>
            <p className="text-xs text-[#3C3330]/75 mt-0.5">
              {currentLanguage === 'kn'
                ? 'ಪ್ರತಿ ಕಾರ್ಯಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಕ್ಲಿಕ್‌ಗಳು'
                : currentLanguage === 'te'
                ? 'ఒక పనికి పట్టిన సగటు క్లిక్‌లు'
                : 'Average taps to reach appointment audio or reschedule'}
            </p>
          </div>
        </div>

        {/* KPI 3: Scenario Time */}
        <div className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#C98897]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಸನ್ನಿವೇಶ ಪೂರ್ಣ ಸಮಯ'
                : currentLanguage === 'te'
                ? 'సగటు పూర్తి సమయం'
                : 'Scenario Completion Time'}
            </span>
            <p className="font-display text-4xl font-bold text-[#3C3330] tabular-nums mt-1">
              {segment.avgCompletionSeconds}s
            </p>
            <p className="text-xs text-[#3C3330]/75 mt-0.5">
              {currentLanguage === 'kn'
                ? 'ಶಾಂತವಾದ ಆಲಿಸುವಿಕೆ ಮತ್ತು ಓದುವ ಸಮಯ'
                : currentLanguage === 'te'
                ? 'వాయిస్ విని అర్థం చేసుకోవడానికి పట్టిన సమయం'
                : 'Simulated average duration including voice guidance'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid: Accessibility Usage + Navigation Difficulties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessibility Options Used */}
        <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#3C3330]">
            {currentLanguage === 'kn'
              ? 'ಬಳಸಲಾದ ಪ್ರವೇಶಾವಕಾಶ ಆಯ್ಕೆಗಳು'
              : currentLanguage === 'te'
              ? 'ఉపయోగించిన యాక్సెసిబిలిటీ సెట్టింగ్స్'
              : 'Accessibility Options Used (Demo)'}
          </h3>
          <div className="space-y-3">
            {segment.accessibilityUsage.map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#3C3330]">
                  <span>{row.label[currentLanguage]}</span>
                  <span className="tabular-nums text-[#8F7242]">{row.pct}%</span>
                </div>
                <div className="w-full h-3 bg-[#FCF9F5] border border-[#BEA06D]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#BEA06D] rounded-full transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Language Preference Distribution Bar */}
          <div className="pt-4 border-t border-[#BEA06D]/20 space-y-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಭಾಷಾ ಆಯ್ಕೆ ವಿತರಣೆ'
                : currentLanguage === 'te'
                ? 'భాషా ప్రాధాన్యత పంపిణీ'
                : 'Language Distribution (Fictional Dataset)'}
            </span>
            <div className="flex h-4 rounded-full overflow-hidden border border-[#BEA06D]/30">
              {segment.languageDistribution.map((item) => (
                <div
                  key={item.label}
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  title={`${item.label}: ${item.pct}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#3C3330]/80 pt-1">
              {segment.languageDistribution.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}: {item.pct}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Encountered Navigation Difficulties */}
        <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#3C3330]">
            {currentLanguage === 'kn'
              ? 'ಪ್ರಮುಖ ನ್ಯಾವಿಗೇಷನ್ ಅಡೆತಡೆಗಳು'
              : currentLanguage === 'te'
              ? 'ఎక్కువగా ఎదురయ్యే నావిగేషన్ ఇబ్బందులు'
              : 'Frequently Observed Navigation Friction'}
          </h3>
          <div className="space-y-3.5">
            {segment.commonDifficulties.map((diff, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#3C3330]">
                  <span>{diff.label[currentLanguage]}</span>
                  <span className="tabular-nums text-[#C98897] font-bold">{diff.frequencyPct}%</span>
                </div>
                <div className="w-full h-3 bg-[#FCF9F5] border border-[#E6C1C4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C98897] rounded-full transition-all duration-500"
                    style={{ width: `${diff.frequencyPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Can Improve Panel */}
      <div className="bg-white border-2 border-[#A2B29B]/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-[#4A6347]" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
            {currentLanguage === 'kn'
              ? 'ನಾವು ಏನನ್ನು ಸುಧಾರಿಸಬಹುದು? (What We Can Improve)'
              : currentLanguage === 'te'
              ? 'మనం ఇంకా ఏమి మెరుగుపరచవచ్చు? (What We Can Improve)'
              : 'What We Can Improve'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INSIGHTS_IMPROVEMENTS.map((imp) => (
            <div
              key={imp.id}
              className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-2"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4A6347] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {imp.metricRef[currentLanguage]}
              </span>
              <p className="text-xs sm:text-sm text-[#3C3330]/90 leading-relaxed">
                {imp.action[currentLanguage]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
