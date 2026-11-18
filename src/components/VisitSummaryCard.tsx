import React, { useState } from 'react';
import { Appointment, Language, PageView } from '../types';
import { CARE_JOURNEY_STAGES } from '../data/enhancementsData';
import { SmartJourneyAiTask } from '../utils/aiClient';
import { downloadPlainTextSummary } from '../utils/calendarExport';
import {
  CheckCircle2,
  Circle,
  Printer,
  Download,
  HelpCircle,
  Users,
  ShieldAlert,
  Plus,
  FileCheck2
} from 'lucide-react';

interface VisitSummaryCardProps {
  language: Language;
  appointment: Appointment;
  completedTasks: Record<string, boolean>;
  aiTasks: SmartJourneyAiTask[];
  onPageChange: (page: PageView) => void;
}

const DEFAULT_CAREGIVER_CHECKS: Record<Language, string[]> = {
  en: [
    'Confirm who will accompany or pick up after the hospital visit',
    'Verify hospital gate/building landmark and bus timing',
    'Ensure phone ringtone is audible on visit morning',
  ],
  kn: [
    'ಆಸ್ಪತ್ರೆಗೆ ಜೊತೆಯಲ್ಲಿ ಬರುವ ಕುಟುಂಬದವರನ್ನು ಖಚಿತಪಡಿಸಿ',
    'ಬಸ್ ಸಮಯ ಮತ್ತು ಆಸ್ಪತ್ರೆಯ ವಿಭಾಗದ ದಾರಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    'ಭೇಟಿಯ ಬೆಳಗ್ಗೆ ಫೋನ್ ರಿಂಗ್ ಕೇಳಿಸುವಂತೆ ಇಡಿ',
  ],
  te: [
    'ఆసుపత్రికి తోడుగా వచ్చే కుటుంబ సభ్యుడిని నిర్ధారించుకోండి',
    'బస్సు సమయం మరియు ఆసుపత్రి విభాగం దారిని సరిచూసుకోండి',
    'సందర్శన ఉదయం ఫోన్ రింగ్‌టోన్ గట్టిగా ఉండేలా చూసుకోండి',
  ],
};

export const VisitSummaryCard: React.FC<VisitSummaryCardProps> = ({
  language,
  appointment,
  completedTasks,
  aiTasks,
  onPageChange,
}) => {
  const [questions, setQuestions] = useState<string[]>([
    language === 'kn'
      ? 'ನನ್ನ ವರದಿ ಯಾವಾಗ ಮತ್ತು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?'
      : language === 'te'
      ? 'నా రిపోర్ట్ ఎప్పుడు మరియు ఎక్కడ లభిస్తుంది?'
      : 'When and where do I collect my diagnostic report?',
    language === 'kn'
      ? 'ಪರೀಕ್ಷೆ ಮುಗಿದ ನಂತರ ನಾನು ಯಾವಾಗ ಆಹಾರ ಸೇವಿಸಬಹುದು?'
      : language === 'te'
      ? 'పరీక్ష పూర్తయిన తర్వాత నేను ఎప్పుడు భోజనం చేయవచ్చు?'
      : 'When can I eat or drink normally after my visit?',
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [caregiverChecks, setCaregiverChecks] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
  });
  const [includeVisitTiming, setIncludeVisitTiming] = useState(false);

  // Merge timeline + any custom Smart Journey tasks
  const timelineItems = CARE_JOURNEY_STAGES.flatMap((stage) =>
    stage.tasks.map((task) => ({
      id: task.id,
      label: task.label[language],
      done: !!completedTasks[task.id],
    }))
  );

  const customItems = aiTasks.map((t) => ({
    id: t.id,
    label: t.label,
    done: t.completed,
  }));

  const allItems = [...timelineItems, ...customItems];
  const doneItems = allItems.filter((item) => item.done);
  const remainingItems = allItems.filter((item) => !item.done);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newQuestion.trim();
    if (!cleaned) return;
    setQuestions((prev) => [...prev, cleaned]);
    setNewQuestion('');
  };

  const buildDownloadableSummary = (): string => {
    const lines: string[] = [
      'CORE — Organizational Visit Summary',
      '------------------------------------------------------------',
      `Completed Preparation Tasks (${doneItems.length}):`,
      ...(doneItems.length > 0
        ? doneItems.map((i) => `  [x] ${i.label}`)
        : ['  (None marked completed yet)']),
      '',
      `Remaining Organizational Tasks (${remainingItems.length}):`,
      ...(remainingItems.length > 0
        ? remainingItems.map((i) => `  [ ] ${i.label}`)
        : ['  (All listed organizational steps checked)']),
      '',
      'Questions to Ask Clinic / Doctor:',
      ...questions.map((q, idx) => `  ${idx + 1}. ${q}`),
      '',
      'Optional Caregiver Checklist:',
      ...DEFAULT_CAREGIVER_CHECKS[language].map(
        (item, idx) => `  [${caregiverChecks[idx] ? 'x' : ' '}] ${item}`
      ),
    ];

    if (includeVisitTiming) {
      lines.push('');
      lines.push('Explicitly Approved Visit Timing Note (Fictional Demo Sample):');
      lines.push(`  Hospital: ${appointment.hospitalName}`);
      lines.push(`  Scheduled Slot: ${appointment.date} at ${appointment.time} (${appointment.roomNumber})`);
    }

    lines.push('');
    lines.push('------------------------------------------------------------');
    lines.push(
      'Notice: Completing organizational checklist items does not indicate medical readiness or clinical clearance. Confirm all preparation requirements with hospital staff.'
    );
    return lines.join('\n');
  };

  return (
    <section className="bg-white border border-[#BEA06D]/55 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 print-passport-only">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BEA06D]/25 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>CORE Visit Summary</span>
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39]">
            {language === 'kn'
              ? 'ನಿಮ್ಮ ಭೇಟಿಯ ಸಂಘಟಿತ ಸಾರಾಂಶ ಕಾರ್ಡ್'
              : language === 'te'
              ? 'మీ సందర్శన సంక్షిప్త సారాంశ కార్డు'
              : 'Your Printable Visit Preparation Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-[#493C39]/75">
            {language === 'kn'
              ? 'ಪೂರ್ಣಗೊಂಡ ಕೆಲಸಗಳು, ಬಾಕಿ ಉಳಿದಿರುವ ಸಿದ್ಧತೆ ಮತ್ತು ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳ ಒಟ್ಟು ನೋಟ.'
              : language === 'te'
              ? 'పూర్తయిన పనులు, మిగిలిన ఏర్పాట్లు మరియు డాక్టర్‌ను అడగాల్సిన ప్రశ్నల సారాంశం.'
              : 'An organized overview of completed items, remaining prep steps, clinician questions, and optional caregiver support.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="compact-chip py-2.5 px-4 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>

          <button
            type="button"
            onClick={() =>
              downloadPlainTextSummary('core-visit-summary.txt', buildDownloadableSummary())
            }
            className="compact-chip py-2.5 px-4 rounded-full bg-[#FCF9F5] hover:bg-[#E6C1C4]/25 border border-[#BEA06D]/50 text-[#493C39] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#8A6D3F]" />
            <span>Download (.txt)</span>
          </button>
        </div>
      </div>

      {/* Completed vs Remaining Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-[#A2B29B]/14 border border-[#A2B29B]/55 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#4A6347] uppercase tracking-wider">
            <span>Completed Tasks</span>
            <span className="tabular-nums">{doneItems.length}</span>
          </div>
          {doneItems.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#493C39]">
              {doneItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0 mt-0.5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#493C39]/70 italic">
              Check off any tasks in your Care Journey timeline above to see them summarized here.
            </p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
            <span>Remaining Organizational Tasks</span>
            <span className="tabular-nums">{remainingItems.length}</span>
          </div>
          {remainingItems.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#493C39]">
              {remainingItems.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#BEA06D] shrink-0 mt-0.5" />
                  <span>{item.label}</span>
                </li>
              ))}
              {remainingItems.length > 6 && (
                <li className="text-xs text-[#8A6D3F] font-medium">
                  + {remainingItems.length - 6} more items in timeline
                </li>
              )}
            </ul>
          ) : (
            <p className="text-xs text-[#4A6347] font-medium">
              All listed organizational tasks have been checked off.
            </p>
          )}
        </div>
      </div>

      {/* Questions + Optional Caregiver Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E6C1C4]/75 space-y-3">
          <span className="text-xs font-bold text-[#C88F98] uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions to Ask Hospital Staff</span>
          </span>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#493C39] list-disc list-inside">
            {questions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
          <form onSubmit={handleAddQuestion} className="flex items-center gap-2 pt-1 no-print">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Add a question for your doctor..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-xs text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />
            <button
              type="submit"
              className="compact-chip py-2 px-3 rounded-xl bg-[#C88F98] hover:bg-[#b07680] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#BEA06D]/35 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C88F98]" />
              <span>Optional Caregiver Checklist</span>
            </span>
            <button
              type="button"
              onClick={() => onPageChange('carecircle')}
              className="compact-chip text-[11px] font-semibold text-[#4A6347] underline cursor-pointer no-print"
            >
              Open CareCircle
            </button>
          </div>

          <div className="space-y-2">
            {DEFAULT_CAREGIVER_CHECKS[language].map((item, idx) => (
              <label key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#493C39] cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!caregiverChecks[idx]}
                  onChange={() =>
                    setCaregiverChecks((prev) => ({ ...prev, [idx]: !prev[idx] }))
                  }
                  className="mt-1 accent-[#4A6347]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-[#BEA06D]/20 no-print">
            <label className="flex items-start gap-2 text-xs text-[#493C39]/80 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVisitTiming}
                onChange={(e) => setIncludeVisitTiming(e.target.checked)}
                className="mt-0.5 accent-[#BEA06D]"
              />
              <span>
                Explicitly include sample hospital &amp; time in my downloaded summary (excluded by default for privacy)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy & Non-Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#E6C1C4]/20 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#493C39]">
        <ShieldAlert className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
        <span>
          Privacy &amp; Medical Clarity Note: This summary contains only your organizational checklist and no sensitive clinical records. Checking off preparation steps helps organize your visit and does not represent medical readiness or hospital confirmation.
        </span>
      </div>
    </section>
  );
};
