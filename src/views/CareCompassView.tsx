import React, { useState } from 'react';
import { Appointment, CareCompassTask, Language, PageView } from '../types';
import { CARECOMPASS_PRESETS } from '../data/phase2Data';
import { downloadIcsReminder } from '../utils/calendarExport';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BellRing,
  CalendarPlus,
  Check,
  Compass,
  Plus,
  Printer,
  RotateCcw,
  ShieldAlert,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface CareCompassViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onPageChange: (page: PageView) => void;
  onChecklistInteracted?: () => void;
}

export const CareCompassView: React.FC<CareCompassViewProps> = ({
  currentLanguage,
  appointment,
  onPageChange,
  onChecklistInteracted,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CARECOMPASS_PRESETS[0].id);
  const [customVisitTitle, setCustomVisitTitle] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(appointment.date);
  const [visitTime, setVisitTime] = useState<string>(appointment.time);

  const buildTasksFromPreset = (presetId: string, lang: Language): CareCompassTask[] => {
    const preset = CARECOMPASS_PRESETS.find((p) => p.id === presetId) || CARECOMPASS_PRESETS[0];
    return preset.tasks.map((t) => ({
      id: t.id,
      category: t.category,
      source: t.source,
      completed: false,
      text: t.text[lang],
    }));
  };

  const [tasks, setTasks] = useState<CareCompassTask[]>(() =>
    buildTasksFromPreset(CARECOMPASS_PRESETS[0].id, currentLanguage)
  );
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] =
    useState<CareCompassTask['category']>('documents');
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);
  const [lastToggled, setLastToggled] = useState<{
    id: string;
    text: string;
    completed: boolean;
  } | null>(null);

  const handlePresetSwitch = (presetId: string) => {
    setSelectedPresetId(presetId);
    setTasks(buildTasksFromPreset(presetId, currentLanguage));
    setLastToggled(null);
    onChecklistInteracted?.();
  };

  const toggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    if (target) {
      setLastToggled({ id, text: target.text, completed: !target.completed });
    }
    onChecklistInteracted?.();
  };

  const handleUndoToggle = () => {
    if (!lastToggled) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === lastToggled.id ? { ...t, completed: !t.completed } : t))
    );
    setLastToggled(null);
  };

  const moveTask = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= tasks.length) return;
    const copy = [...tasks];
    const [removed] = copy.splice(idx, 1);
    copy.splice(target, 0, removed);
    setTasks(copy);
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newTaskText.trim();
    if (!cleaned) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        category: newTaskCategory,
        source: 'user_added',
        completed: false,
        text: cleaned,
      },
    ]);
    setNewTaskText('');
    onChecklistInteracted?.();
  };

  const handleExportCalendar = () => {
    const activePreset = CARECOMPASS_PRESETS.find((p) => p.id === selectedPresetId);
    const title = customVisitTitle.trim() || activePreset?.title[currentLanguage] || appointment.testName;
    downloadIcsReminder({
      title: `CORE Visit Prep: ${title}`,
      dateYmd: visitDate,
      timeStr: visitTime,
      location: `${appointment.hospitalName} — ${appointment.roomNumber}`,
      description:
        'Organizational preparation checklist created with CORE CareCompass. Verify clinic-specific instructions directly with your hospital desk.',
    });
    setReminderNotice(
      currentLanguage === 'kn'
        ? 'ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ (.ics) ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.'
        : currentLanguage === 'te'
        ? 'క్యాలెండర్ ఫైల్ (.ics) డౌన్‌లోడ్ చేయబడింది.'
        : 'Calendar reminder file (.ics) downloaded.'
    );
    setTimeout(() => setReminderNotice(null), 4000);
  };

  const handleLocalReminder = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('CORE CareCompass Reminder', {
          body: `${customVisitTitle.trim() || appointment.testName} · ${visitDate} ${visitTime}`,
        });
        setReminderNotice(
          currentLanguage === 'kn'
            ? 'ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆಯನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.'
            : currentLanguage === 'te'
            ? 'స్థానిక బ్రౌజర్ రిమైండర్ పంపబడింది.'
            : 'Local browser notification triggered.'
        );
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('CORE CareCompass Reminder', {
            body: `${customVisitTitle.trim() || appointment.testName} · ${visitDate} ${visitTime}`,
          });
          setReminderNotice(
            currentLanguage === 'kn'
              ? 'ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆ ಸಕ್ರಿಯವಾಗಿದೆ.'
              : currentLanguage === 'te'
              ? 'బ్రౌజర్ రిమైండర్ సెట్ చేయబడింది.'
              : 'Local browser notification triggered.'
          );
        } else {
          setReminderNotice(
            currentLanguage === 'kn'
              ? 'ಅಧಿಸೂಚನೆ ಅನುಮತಿ ಇಲ್ಲದಿರುವುದರಿಂದ ಇನ್-ಆಪ್ ಜ್ಞಾಪನೆ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.'
              : currentLanguage === 'te'
              ? 'నోటిఫికేషన్ అనుమతి లేకపోవడంతో ఇన్-యాప్ రిమైండర్ చూపబడింది.'
              : 'Browser notifications blocked; use the .ics Calendar Export or print checklist offline.'
          );
        }
      } else {
        setReminderNotice(
          currentLanguage === 'kn'
            ? 'ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ; .ics ಕ್ಯಾಲೆಂಡರ್ ಡೌನ್‌ಲೋಡ್ ಬಳಸಿ.'
            : currentLanguage === 'te'
            ? 'బ్రౌజర్ నోటిఫికేషన్ బ్లాక్ చేయబడింది; .ics క్యాలెండర్ డౌన్‌లోడ్ ఉపయోగించండి.'
            : 'Browser notifications are disabled in settings; please use the .ics Calendar Export.'
        );
      }
    } else {
      setReminderNotice(
        currentLanguage === 'kn'
          ? 'ಸ್ಥಳೀಯ ಅಧಿಸೂಚನೆ ಲಭ್ಯವಿಲ್ಲ; .ics ಕ್ಯಾಲೆಂಡರ್ ಡೌನ್‌ಲೋಡ್ ಬಳಸಿ.'
          : currentLanguage === 'te'
          ? 'స్థానిక నోటిఫికేషన్ అందుబాటులో లేదు; .ics క్యాలెండర్ ఫైల్ వాడండి.'
          : 'Notification API unavailable here; please use the .ics Calendar Export.'
      );
    }
    setTimeout(() => setReminderNotice(null), 5000);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const orgReadinessPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categoryLabels: Record<CareCompassTask['category'], Record<Language, string>> = {
    documents: { kn: 'ದಾಖಲೆಗಳು', te: 'పత్రాలు', en: 'Documents' },
    questions: { kn: 'ಪ್ರಶ್ನೆಗಳು', te: 'ప్రశ్నలు', en: 'Questions' },
    travel: { kn: 'ಪ್ರಯಾಣ', te: 'ప్రయాణం', en: 'Travel' },
    reminders: { kn: 'ಸಮಯ ಜ್ಞಾಪನೆ', te: 'సమయ రిమైండర్', en: 'Reminders' },
    accessibility: { kn: 'ಸಹಾಯ ಸೌಲಭ್ಯ', te: 'సహాయ సౌకర్యం', en: 'Accessibility' },
    caregiver: { kn: 'ಜೊತೆಗಾರರು', te: 'తోడుగా వచ్చేవారు', en: 'Caregiver' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLocalReminder}
            className="compact-chip py-2 px-4 rounded-full bg-white border border-[#BEA06D] text-xs font-semibold text-[#8F7242] hover:bg-[#FCF9F5] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'kn' ? 'ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆ' : currentLanguage === 'te' ? 'బ్రౌజర్ రిమైండర్' : 'Test Reminder'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleExportCalendar}
            className="compact-chip py-2 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್ (.ics)' : currentLanguage === 'te' ? 'క్యాలెండర్ (.ics)' : 'Export .ics'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="compact-chip py-2 px-4 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್' : currentLanguage === 'te' ? 'ప్రింట్' : 'Print'}</span>
          </button>
        </div>
      </div>

      {reminderNotice && (
        <div className="p-3.5 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347] text-xs sm:text-sm font-semibold text-[#4A6347] flex items-center gap-2 no-print soft-fade-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reminderNotice}</span>
        </div>
      )}

      {/* Header + Organizational Readiness Indicator */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#BEA06D]" />
              <span>CORE CareCompass</span>
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
              <WordReveal
                text={
                  currentLanguage === 'kn'
                    ? 'ಬುದ್ಧಿವಂತ ಭೇಟಿ ಸಿದ್ಧತಾ ಪಟ್ಟಿ'
                    : currentLanguage === 'te'
                    ? 'సందర్శన తయారీ జాబితా (CareCompass)'
                    : 'Intelligent Visit Preparation'
                }
              />
            </h1>
            <p className="text-sm text-[#3C3330]/80">
              {currentLanguage === 'kn'
                ? 'ನಿಮ್ಮ ಭೇಟಿಯ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ, ಕಾರ್ಯಗಳನ್ನು ಸೇರಿಸಿ, ಕ್ರಮ ಬದಲಿಸಿ ಮತ್ತು ಆಫ್‌ಲೈನ್‌ಗಾಗಿ ಉಳಿಸಿ.'
                : currentLanguage === 'te'
                ? 'మీ సందర్శన రకాన్ని ఎంచుకోండి, అంశాలను జతచేయండి, క్రమాన్ని మార్చండి మరియు సేవ్ చేయండి.'
                : 'Customize your editable preparation checklist with calendar export and offline printing.'}
            </p>
          </div>

        {/* Organizational Task Readiness Gauge (Explicitly Non-Clinical) */}
        <div className="bg-white border-2 border-[#BEA06D]/45 rounded-2xl p-4 min-w-[250px] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#8F7242]">
              {currentLanguage === 'kn'
                ? 'ಸಿದ್ಧತೆ ಪೂರ್ಣತೆ (ಸಂಘಟನಾತ್ಮಕ)'
                : currentLanguage === 'te'
                ? 'తయారీ పూర్తి (వ్యవస్థాపక)'
                : 'Organizational Task Progress'}
            </span>
            <span className="tabular-nums text-[#3C3330]">{orgReadinessPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#BEA06D]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6347] rounded-full transition-all duration-300"
              style={{ width: `${orgReadinessPct}%` }}
            />
          </div>
          <span className="text-[11px] text-[#3C3330]/70 block">
            {currentLanguage === 'kn'
              ? 'ಗಮನಿಸಿ: ಇದು ಕೇವಲ ಕಾರ್ಯಗಳ ಪಟ್ಟಿ — ವೈದ್ಯಕೀಯ ಫಿಟ್‌ನೆಸ್ ಅಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'గమనిక: ఇది కేవలం పనుల జాబితా మాత్రమే — వైద్య ఆరోగ్య స్థితి కాదు.'
              : 'Tracks organizational task checks only — not medical readiness or health status.'}
          </span>
        </div>
        </div>
      </Reveal>

      {/* Appointment Preset & Custom Visit Inputs */}
      <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CARECOMPASS_PRESETS.map((preset) => {
            const active = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSwitch(preset.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-xs'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/25 hover:border-[#BEA06D]'
                }`}
              >
                <span className="font-bold text-sm text-[#3C3330] block">
                  {preset.title[currentLanguage]}
                </span>
                <span className="text-xs text-[#3C3330]/75 block mt-0.5">
                  {preset.subtitle[currentLanguage]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#BEA06D]/20">
          <input
            type="text"
            value={customVisitTitle}
            onChange={(e) => setCustomVisitTitle(e.target.value)}
            placeholder={
              currentLanguage === 'kn'
                ? 'ಐಚ್ಛಿಕ: ನಿಮ್ಮ ಭೇಟಿಯ ಹೆಸರು ಬರೆಯಿರಿ...'
                : currentLanguage === 'te'
                ? 'ఐచ్ఛికం: మీ సందర్శన పేరు రాయండి...'
                : 'Optional custom appointment label...'
            }
            className="px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-sm text-[#3C3330]"
          />
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-sm text-[#3C3330]"
            aria-label="Appointment Date"
          />
          <input
            type="text"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-sm text-[#3C3330]"
            aria-label="Appointment Time"
          />
        </div>
      </div>

      {/* Editable Preparation Checklist */}
      <div className="print-passport-only bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#BEA06D]/20 pb-3">
          <h2 className="font-display text-2xl font-bold text-[#3C3330]">
            {customVisitTitle.trim() ||
              CARECOMPASS_PRESETS.find((p) => p.id === selectedPresetId)?.title[currentLanguage]}
          </h2>
          <span className="text-xs font-semibold text-[#8F7242] tabular-nums">
            {visitDate} · {visitTime}
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                task.completed
                  ? 'bg-[#A2B29B]/15 border-[#4A6347]/50'
                  : 'bg-[#FCF9F5] border-[#BEA06D]/25'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer flex-1">
                <span
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                      : 'bg-white border-[#BEA06D]/60 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="sr-only"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#BEA06D]/35 text-[#8F7242]">
                      {categoryLabels[task.category][currentLanguage]}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.source === 'clinic_verify'
                          ? 'bg-[#E6C1C4]/45 text-[#3C3330] border border-[#C98897]/50'
                          : 'bg-[#A2B29B]/25 text-[#4A6347]'
                      }`}
                    >
                      {task.source === 'clinic_verify'
                        ? currentLanguage === 'kn'
                          ? 'ಆಸ್ಪತ್ರೆಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ'
                          : currentLanguage === 'te'
                          ? 'క్లినిక్‌లో నిర్ధారించండి'
                          : 'Verify With Clinic'
                        : task.source === 'user_added'
                        ? currentLanguage === 'kn'
                          ? 'ನೀವು ಸೇರಿಸಿದ್ದು'
                          : currentLanguage === 'te'
                          ? 'మీరు జోడించినది'
                          : 'Added by You'
                        : currentLanguage === 'kn'
                        ? 'ಸಾಮಾನ್ಯ ಸಲಹೆ'
                        : currentLanguage === 'te'
                        ? 'సాధారణ సూచన'
                        : 'Generic Suggestion'}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold block ${
                      task.completed ? 'line-through text-[#3C3330]/60' : 'text-[#3C3330]'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              </label>

              {/* Reorder & Remove Controls */}
              <div className="flex items-center gap-1 self-end sm:self-center shrink-0 no-print">
                <button
                  type="button"
                  onClick={() => moveTask(idx, -1)}
                  disabled={idx === 0}
                  className="compact-chip p-1.5 rounded-lg bg-white border border-[#BEA06D]/30 text-[#8F7242] disabled:opacity-35 hover:bg-[#FCF9F5] cursor-pointer"
                  aria-label="Move task up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveTask(idx, 1)}
                  disabled={idx === tasks.length - 1}
                  className="compact-chip p-1.5 rounded-lg bg-white border border-[#BEA06D]/30 text-[#8F7242] disabled:opacity-35 hover:bg-[#FCF9F5] cursor-pointer"
                  aria-label="Move task down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="compact-chip p-1.5 rounded-lg bg-white border border-[#C98897]/40 text-[#C98897] hover:bg-[#E6C1C4]/25 cursor-pointer"
                  aria-label="Remove task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Task Form */}
        <form onSubmit={handleAddTask} className="pt-3 border-t border-[#BEA06D]/20 flex flex-col sm:flex-row gap-2.5 no-print">
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value as CareCompassTask['category'])}
            className="px-3 py-2.5 rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-xs font-semibold text-[#3C3330]"
          >
            {(Object.keys(categoryLabels) as Array<CareCompassTask['category']>).map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat][currentLanguage]}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={
              currentLanguage === 'kn'
                ? 'ಹೊಸ ಸಿದ್ಧತೆ ಅಥವಾ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ...'
                : currentLanguage === 'te'
                ? 'కొత్త అంశం లేదా ప్రశ్నను జోడించండి...'
                : 'Add a personal preparation note or question...'
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330]"
          />
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLanguage === 'kn' ? 'ಸೇರಿಸಿ' : currentLanguage === 'te' ? 'జోడించు' : 'Add Item'}</span>
          </button>
        </form>

        {lastToggled && (
          <div className="p-3.5 rounded-2xl bg-[#A2B29B]/16 border border-[#4A6347]/45 flex flex-wrap items-center justify-between gap-3 text-xs no-print soft-fade-up">
            <div className="flex items-center gap-2 text-[#4A6347] font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 check-pop" />
              <span>
                {lastToggled.completed
                  ? currentLanguage === 'kn'
                    ? `ಪೂರ್ಣಗೊಂಡಿತು: ${lastToggled.text}`
                    : currentLanguage === 'te'
                    ? `పూర్తయింది: ${lastToggled.text}`
                    : `Completed: ${lastToggled.text}`
                  : currentLanguage === 'kn'
                  ? `ಗುರುತು ತೆಗೆಯಲಾಗಿದೆ: ${lastToggled.text}`
                  : currentLanguage === 'te'
                  ? `టిక్ తొలగించబడింది: ${lastToggled.text}`
                  : `Unchecked: ${lastToggled.text}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndoToggle}
                className="compact-chip py-1 px-3 rounded-full bg-white border border-[#4A6347]/45 text-[#4A6347] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{currentLanguage === 'kn' ? 'ರದ್ದುಮಾಡಿ' : currentLanguage === 'te' ? 'రద్దు చేయండి' : 'Undo'}</span>
              </button>
              <button
                type="button"
                onClick={() => onPageChange('passport')}
                className="compact-chip py-1 px-3 rounded-full bg-[#4A6347] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಮುಂದೇನು: ಪಾಸ್‌ಪೋರ್ಟ್ →'
                    : currentLanguage === 'te'
                    ? 'తర్వాత: పాస్‌పోర్ట్ →'
                    : 'Next: Visit Passport'}
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Verification Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#3C3330]">
          <ShieldAlert className="w-4 h-4 text-[#C98897] shrink-0 mt-0.5" />
          <span>
            {currentLanguage === 'kn'
              ? '"ಆಸ್ಪತ್ರೆಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ" ಎಂದು ಗುರುತಿಸಲಾದ ನಿಯಮಗಳನ್ನು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಕ್ಲಿನಿಕ್ ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ.'
              : currentLanguage === 'te'
              ? '"క్లినిక్‌లో నిర్ధారించండి" అని ఉన్న అంశాలను మీ ఆసుపత్రి సిబ్బందితో తప్పనిసరిగా సరిచూసుకోండి.'
              : 'Items marked "Verify With Clinic" depend on your hospital department; always confirm exact fasting or document rules directly with your clinic.'}
          </span>
        </div>
      </div>
    </div>
  );
};
