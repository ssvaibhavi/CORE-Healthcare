import React, { useState } from 'react';
import {
  ActiveDisruptionState,
  Appointment,
  CareCircleSharingSettings,
  Language,
  PageView
} from '../types';
import { CARE_JOURNEY_STAGES } from '../data/enhancementsData';
import { CAREGIVER_SITUATION_PRESETS, RECOVERY_SCENARIOS } from '../data/recoveryData';
import { downloadPlainTextSummary } from '../utils/calendarExport';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  Lock,
  Unlock,
  Calendar,
  MapPin,
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  Download,
  Printer,
  Clock,
  Copy,
  Check,
  MessageSquarePlus
} from 'lucide-react';

interface CareCircleViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  sharing: CareCircleSharingSettings;
  onUpdateSharing: (next: CareCircleSharingSettings) => void;
  completedTasks: Record<string, boolean>;
  activeDisruption?: ActiveDisruptionState;
  onPageChange: (page: PageView) => void;
}

export const CareCircleView: React.FC<CareCircleViewProps> = ({
  currentLanguage,
  appointment,
  sharing,
  onUpdateSharing,
  completedTasks,
  activeDisruption,
  onPageChange,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const caregiverName = appointment.caregiver?.name || 'Ramesh Gowda';
  const caregiverRelation = appointment.caregiver?.relation || 'Son';
  const activeScenario =
    activeDisruption && activeDisruption.scenarioId !== 'none'
      ? RECOVERY_SCENARIOS.find((s) => s.id === activeDisruption.scenarioId)
      : undefined;

  const handleGrantConsent = () => {
    onUpdateSharing({
      ...sharing,
      consentGranted: true,
      consentTimestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleRevokeConsent = () => {
    onUpdateSharing({
      ...sharing,
      consentGranted: false,
      consentTimestamp: undefined,
    });
  };

  const toggleField = (
    key: keyof Omit<CareCircleSharingSettings, 'consentGranted' | 'consentTimestamp'>
  ) => {
    onUpdateSharing({
      ...sharing,
      [key]: !sharing[key],
    });
  };

  const beforeTasks = CARE_JOURNEY_STAGES[0].tasks;

  const buildHandoffText = (): string => {
    const lines: string[] = [
      'CORE Connect — Patient-Consented Caregiver Handoff Summary',
      `Prepared For: ${caregiverName} (${caregiverRelation})`,
      `Patient Consent: Granted (${sharing.consentTimestamp || 'Current Session'})`,
      `Access Scope: ${sharing.handoffMode === '24_hours' ? '24-Hour Demonstration Window' : 'Current Session Only'}`,
      '------------------------------------------------------------',
    ];
    if (sharing.shareAppointmentOverview) {
      lines.push(`Hospital: ${appointment.hospitalName}`);
      lines.push(`Date & Time: ${appointment.date} (${appointment.dayOfWeek}) at ${appointment.time}`);
    }
    if (sharing.shareDirections) {
      lines.push(`Location: ${appointment.roomNumber}`);
      lines.push(`Directions: ${appointment.directions[currentLanguage]}`);
    }
    if (sharing.shareChecklist) {
      lines.push('Preparation Checklist:');
      beforeTasks.forEach((t) => {
        lines.push(`  [${completedTasks[t.id] ? 'x' : ' '}] ${t.label[currentLanguage]}`);
      });
    }
    if (sharing.shareReminders) {
      lines.push(
        `Reminder Channels: ${
          [
            appointment.reminderPreferences.voiceCall ? 'Voice Call' : '',
            appointment.reminderPreferences.sms ? 'Native SMS' : '',
            appointment.reminderPreferences.whatsapp ? 'WhatsApp' : '',
          ]
            .filter(Boolean)
            .join(', ') || 'None'
        }`
      );
    }
    if (sharing.situationNote?.trim()) {
      lines.push(`Current Administrative Situation Note: ${sharing.situationNote.trim()}`);
    }
    if (sharing.includeActiveDisruption && activeScenario) {
      lines.push(`Active Hospital Situation: ${activeScenario.title[currentLanguage]} — ${activeScenario.timelineAdjustmentNote[currentLanguage]}`);
    }
    lines.push('------------------------------------------------------------');
    lines.push('Note: Demonstration summary only. No sensitive clinical records included, no messages sent, and no public links generated.');
    return lines.join('\n');
  };

  const handleCopySummary = () => {
    const txt = buildHandoffText();
    navigator.clipboard?.writeText(txt).catch(() => {});
    setCopiedSummary(true);
    window.setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#8F7242] font-medium">
          {currentLanguage === 'kn'
            ? 'ರೋಗಿ-ನಿಯಂತ್ರಿತ ಹಂಚಿಕೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ'
            : currentLanguage === 'te'
            ? 'రోగి-నియంత్రిత భాగస్వామ్య డెమో'
            : 'Patient-Controlled Sharing Prototype · No Public Links'}
        </span>
      </div>

      {/* Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            CORE CareCircle
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
            <WordReveal
              text={
                currentLanguage === 'kn'
                  ? 'CareCircle — ಸಮ್ಮತಿ ಆಧಾರಿತ ಕುಟುಂಬ ನೆರವು'
                  : currentLanguage === 'te'
                  ? 'CareCircle — అనుమతితో కూడిన కుటుంబ సహాయం'
                  : 'CareCircle — Caregiver Support With Dignity'
              }
            />
          </h1>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {currentLanguage === 'kn'
              ? 'ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಕುಟುಂಬಸ್ಥರು ಯಾವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೋಡಬಹುದು ಎಂಬುದನ್ನು ನೀವೇ ಆಯ್ಕೆ ಮಾಡಿ.'
              : currentLanguage === 'te'
              ? 'మీ కుటుంబ సభ్యులు ఏ సమాచారం మాత్రమే చూడగలరో మీరే స్వయంగా నిర్ణయించుకోండి.'
              : 'Choose exactly which non-sensitive visit details your trusted caregiver can see — after your clear consent.'}
          </p>
        </div>
      </Reveal>

      {/* Prototype Privacy Banner */}
      <Reveal delay={70}>
        <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/40 flex items-start gap-3 text-xs sm:text-sm text-[#3C3330]">
          <Info className="w-5 h-5 text-[#8F7242] shrink-0 mt-0.5" />
          <p>
            {currentLanguage === 'kn'
              ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಸೂಚನೆ: ಈ ವಿಭಾಗವು ರೋಗಿಯ ನಿಯಂತ್ರಣವನ್ನು ತೋರಿಸುತ್ತದೆ. ಯಾವುದೇ ನಿಜವಾದ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ ಮತ್ತು ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಲಿಂಕ್ ರಚಿಸಲಾಗುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'డెమో గమనిక: ఇది రోగి నియంత్రణను చూపే ప్రోటోటైప్. బయటకు ఎలాంటి మెసేజ్లు పంపబడవు మరియు పబ్లిక్ లింకులు సృష్టించబడవు.'
              : 'Prototype Notice: This demonstrates patient-controlled sharing locally. No external messages are sent, no real hospital records are accessed, and no public sharing links are generated.'}
          </p>
        </div>
      </Reveal>

      {/* Step 1: Explicit Patient Consent Card */}
      <Reveal delay={110} variant="bloom">
        <div
          className={`rounded-3xl border-2 p-6 sm:p-8 shadow-sm transition-all ${
          sharing.consentGranted
            ? 'bg-[#A2B29B]/15 border-[#4A6347]/50'
            : 'bg-white border-[#BEA06D]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                sharing.consentGranted
                  ? 'bg-[#4A6347] text-white'
                  : 'bg-[#BEA06D]/20 text-[#8F7242]'
              }`}
            >
              {sharing.consentGranted ? (
                <Unlock className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F7242] block">
                {currentLanguage === 'kn'
                  ? 'ಹಂತ ೧: ರೋಗಿಯ ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ'
                  : currentLanguage === 'te'
                  ? 'దశ 1: రోగి స్పష్టమైన అనుమతి'
                  : 'Step 1: Patient Consent Gate'}
              </span>
              <h2 className="font-display text-2xl font-bold text-[#3C3330]">
                {sharing.consentGranted
                  ? currentLanguage === 'kn'
                    ? `${caregiverName} ಅವರಿಗೆ ಆಯ್ದ ವಿವರಗಳ ಅನುಮತಿ ನೀಡಲಾಗಿದೆ`
                    : currentLanguage === 'te'
                    ? `${caregiverName} గారికి ఎంచుకున్న వివరాల అనుమతి ఇవ్వబడింది`
                    : `Consent Granted for ${caregiverName} (${caregiverRelation})`
                  : currentLanguage === 'kn'
                  ? 'ಆರೈಕೆದಾರರ ಪೂರ್ವವೀಕ್ಷಣೆಗೆ ಸಮ್ಮತಿ ನೀಡಿ'
                  : currentLanguage === 'te'
                  ? 'సంరక్షకుడి వీక్షణకు అనుమతి ఇవ్వండి'
                  : 'Review & Grant Caregiver Sharing Consent'}
              </h2>
              <p className="text-xs sm:text-sm text-[#3C3330]/80">
                {sharing.consentGranted
                  ? currentLanguage === 'kn'
                    ? `ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಈ ಅನುಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದು (${sharing.consentTimestamp}).`
                    : currentLanguage === 'te'
                    ? `మీరు ఎప్పుడైనా ఈ అనుమతిని రద్దు చేయవచ్చు (${sharing.consentTimestamp}).`
                    : `You can adjust checkboxes or withdraw consent at any moment (${sharing.consentTimestamp}).`
                  : currentLanguage === 'kn'
                  ? 'ನೀವು ಅನುಮತಿ ನೀಡುವವರೆಗೆ ನಿಮ್ಮ ಯಾವುದೇ ಭೇಟಿ ವಿವರಗಳು ಆರೈಕೆದಾರರಿಗೆ ಕಾಣಿಸುವುದಿಲ್ಲ.'
                  : currentLanguage === 'te'
                  ? 'మీరు అనుమతి ఇచ్చే వరకు మీ వివరాలు సంరక్షకుడికి కనిపించవు.'
                  : 'Nothing is visible to the caregiver preview until you explicitly approve below.'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {sharing.consentGranted ? (
              <button
                onClick={handleRevokeConsent}
                className="py-3 px-6 rounded-full bg-white border-2 border-[#C98897] text-[#3C3330] hover:bg-[#E6C1C4]/25 font-bold text-sm transition-all cursor-pointer"
              >
                {currentLanguage === 'kn'
                  ? 'ಸಮ್ಮತಿ ಹಿಂಪಡೆಯಿರಿ'
                  : currentLanguage === 'te'
                  ? 'అనుమతి రద్దు చేయండి'
                  : 'Withdraw Consent'}
              </button>
            ) : (
              <button
                onClick={handleGrantConsent}
                className="py-3.5 px-7 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ನಾನು ಸಮ್ಮತಿ ನೀಡುತ್ತೇನೆ'
                    : currentLanguage === 'te'
                    ? 'నేను అనుమతి ఇస్తున్నాను'
                    : 'I Consent to Share Selected Info'}
                </span>
              </button>
            )}
          </div>
        </div>
        </div>
      </Reveal>

      {/* Main Split: Patient Controls (Left) + Live Caregiver Dashboard Prototype (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Patient-Controlled Information Sharing Toggles */}
        <div className="lg:col-span-5 bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#3C3330]">
            {currentLanguage === 'kn'
              ? 'ನೀವು ಹಂಚಿಕೊಳ್ಳಲು ಬಯಸುವ ವಿವರಗಳು'
              : currentLanguage === 'te'
              ? 'మీరు పంచుకోవాలనుకునే వివరాలు'
              : 'What Can Your Caregiver See?'}
          </h3>
          <p className="text-xs text-[#3C3330]/75">
            {currentLanguage === 'kn'
              ? 'ಸೂಕ್ಷ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಇಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'సున్నితమైన వైద్య రిపోర్టులు ఇక్కడ పంచుకోబడవు.'
              : 'Only non-sensitive visit logistics are listed here.'}
          </p>

          <div className="space-y-3 pt-1">
            {[
              {
                key: 'shareAppointmentOverview' as const,
                icon: <Calendar className="w-4 h-4 text-[#8F7242]" />,
                title: {
                  kn: 'ಮುಂಬರುವ ಭೇಟಿಯ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
                  te: 'రాబోయే అపాయింట్‌మెంట్ తేదీ & సమయం',
                  en: 'Upcoming Appointment Date & Time',
                },
              },
              {
                key: 'shareDirections' as const,
                icon: <MapPin className="w-4 h-4 text-[#C98897]" />,
                title: {
                  kn: 'ಆಸ್ಪತ್ರೆಯ ವಿಳಾಸ ಮತ್ತು ತಲುಪುವ ದಾರಿ',
                  te: 'ఆసుపత్రి చిరునామా మరియు దారి సూచనలు',
                  en: 'Hospital Location & Arrival Directions',
                },
              },
              {
                key: 'shareChecklist' as const,
                icon: <CheckCircle2 className="w-4 h-4 text-[#4A6347]" />,
                title: {
                  kn: 'ಭೇಟಿಗೆ ಮುನ್ನ ಸಿದ್ಧತಾ ಪಟ್ಟಿ',
                  te: 'సందర్శనకు ముందు తయారీ జాబితా',
                  en: 'Visit Preparation Checklist',
                },
              },
              {
                key: 'shareReminders' as const,
                icon: <Bell className="w-4 h-4 text-[#8F7242]" />,
                title: {
                  kn: 'ಜ್ಞಾಪನೆ ಆಯ್ಕೆಗಳು (Voice / SMS)',
                  te: 'రిమైండర్ ప్రాధాన్యతలు (Voice / SMS)',
                  en: 'Reminder Preferences',
                },
              },
            ].map((item) => {
              const checked = sharing[item.key];
              return (
                <label
                  key={item.key}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    checked
                      ? 'bg-[#FCF9F5] border-[#BEA06D]'
                      : 'bg-white border-[#BEA06D]/20 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-semibold text-[#3C3330]">
                      {item.title[currentLanguage]}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleField(item.key)}
                    className="w-5 h-5 accent-[#BEA06D]"
                  />
                </label>
              );
            })}
          </div>

          {/* Permission Scope Management */}
          <div className="pt-3 border-t border-[#BEA06D]/20 space-y-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಅನುಮತಿಯ ಅವಧಿ (Demo Permission)'
                  : currentLanguage === 'te'
                  ? 'అనుమతి వ్యవధి (Demo Permission)'
                  : 'Permission Scope (Demonstration)'}
              </span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'session_only' as const,
                  label: { kn: 'ಈ ಸೆಷನ್ ಮಾತ್ರ', te: 'ఈ సెషన్ మాత్రమే', en: 'Current Session Only' },
                },
                {
                  id: '24_hours' as const,
                  label: { kn: '೨೪ ಗಂಟೆಗಳ ಸಾರಾಂಶ', te: '24 గంటల వ్యవధి', en: '24-Hour Handoff Window' },
                },
              ].map((opt) => {
                const isSelected = (sharing.handoffMode || 'session_only') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateSharing({ ...sharing, handoffMode: opt.id })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient-Controlled Current Situation Note Composer */}
          <div className="pt-4 border-t border-[#BEA06D]/20 space-y-2.5">
            <label
              htmlFor="carecircle-situation-note"
              className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಪ್ರಸ್ತುತ ಆಸ್ಪತ್ರೆ ಸ್ಥಿತಿ ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)'
                  : currentLanguage === 'te'
                  ? 'ప్రస్తుత ఆసుపత్రి పరిస్థితి గమనిక (ఐచ్ఛికం)'
                  : 'Current Administrative Situation Note (Optional)'}
              </span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {CAREGIVER_SITUATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    onUpdateSharing({
                      ...sharing,
                      situationNote: preset.note[currentLanguage],
                    })
                  }
                  className="compact-chip text-[11px] px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 hover:border-[#C88F98] text-[#493C39] cursor-pointer"
                >
                  {preset.label[currentLanguage]}
                </button>
              ))}
            </div>

            <textarea
              id="carecircle-situation-note"
              rows={2}
              maxLength={320}
              value={sharing.situationNote || ''}
              onChange={(e) => onUpdateSharing({ ...sharing, situationNote: e.target.value })}
              placeholder={
                currentLanguage === 'kn'
                  ? 'ಉದಾ: ನಾನು ನೋಂದಣಿ ಕೌಂಟರ್ ಹುಡುಕಲು ಸಹಾಯ ಬೇಕಿದೆ...'
                  : currentLanguage === 'te'
                  ? 'ఉదా: నాకు రిజిస్ట్రేషన్ కౌంటర్ వద్ద సహాయం కావాలి...'
                  : 'E.g. Please meet me near Radiology after registration...'
              }
              className="w-full p-3 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-xs sm:text-sm text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />

            {activeScenario && (
              <label className="flex items-center gap-2 text-xs font-semibold text-[#3C3330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(sharing.includeActiveDisruption)}
                  onChange={() =>
                    onUpdateSharing({
                      ...sharing,
                      includeActiveDisruption: !sharing.includeActiveDisruption,
                    })
                  }
                  className="w-4 h-4 accent-[#BEA06D]"
                />
                <span>
                  {currentLanguage === 'kn'
                    ? `ಪ್ರಸ್ತುತ ಬದಲಾವಣೆ ಸೇರಿಸಿ: ${activeScenario.shortLabel[currentLanguage]}`
                    : currentLanguage === 'te'
                    ? `ప్రస్తుత మార్పును చేర్చండి: ${activeScenario.shortLabel[currentLanguage]}`
                    : `Include active change: ${activeScenario.shortLabel[currentLanguage]}`}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Right: Caregiver Dashboard Prototype Preview */}
        <div className="lg:col-span-7 bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6C1C4]/40 border border-[#C98897]/40 flex items-center justify-center text-[#8F7242]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider block">
                  {currentLanguage === 'kn'
                    ? 'ಆರೈಕೆದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪೂರ್ವವೀಕ್ಷಣೆ'
                    : currentLanguage === 'te'
                    ? 'సంరక్షకుడి డ్యాష్‌బోర్డ్ ప్రివ్యూ'
                    : 'Caregiver Dashboard Preview'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                  {caregiverName} ({caregiverRelation})
                </h3>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                sharing.consentGranted
                  ? 'bg-[#A2B29B]/20 border-[#4A6347]/40 text-[#4A6347]'
                  : 'bg-[#FCF9F5] border-[#BEA06D]/40 text-[#8F7242]'
              }`}
            >
              {sharing.consentGranted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>
                {sharing.consentGranted
                  ? currentLanguage === 'kn'
                    ? 'ಸಮ್ಮತಿ ಸಕ್ರಿಯ'
                    : currentLanguage === 'te'
                    ? 'అనుమతి ఉంది'
                    : 'Preview Unlocked'
                  : currentLanguage === 'kn'
                  ? 'ಸಮ್ಮತಿ ಅಗತ್ಯವಿದೆ'
                  : currentLanguage === 'te'
                  ? 'అనుమతి అవసరం'
                  : 'Hidden Until Consent'}
              </span>
            </span>
          </div>

          {!sharing.consentGranted ? (
            <div className="p-8 rounded-2xl bg-[#FCF9F5] border border-dashed border-[#BEA06D]/50 text-center space-y-3">
              <Lock className="w-10 h-10 text-[#BEA06D] mx-auto" />
              <h4 className="font-display text-xl font-bold text-[#3C3330]">
                {currentLanguage === 'kn'
                  ? 'ರೋಗಿಯ ಸಮ್ಮತಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ'
                  : currentLanguage === 'te'
                  ? 'రోగి అనుమతి కోసం వేచి ఉంది'
                  : 'Caregiver View Locked'}
              </h4>
              <p className="text-xs sm:text-sm text-[#3C3330]/75 max-w-md mx-auto">
                {currentLanguage === 'kn'
                  ? 'ಆರೈಕೆದಾರರು ಏನನ್ನು ನೋಡಬಹುದು ಎಂಬುದನ್ನು ಪರೀಕ್ಷಿಸಲು ಮೇಲಿನ "ನಾನು ಸಮ್ಮತಿ ನೀಡುತ್ತೇನೆ" ಬಟನ್ ಒತ್ತಿ.'
                  : currentLanguage === 'te'
                  ? 'సంరక్షకుడికి ఏమి కనిపిస్తుందో చూడటానికి పైనున్న "నేను అనుమతి ఇస్తున్నాను" బటన్ నొక్కండి.'
                  : 'Click "I Consent to Share Selected Info" above to preview what the caregiver sees.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 soft-fade-up">
              {/* 1. Upcoming Appointment Overview */}
              {sharing.shareAppointmentOverview && (
                <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
                  <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಮುಂಬರುವ ಭೇಟಿ'
                        : currentLanguage === 'te'
                        ? 'రాబోయే సందర్శన'
                        : 'Upcoming Visit Overview'}
                    </span>
                  </span>
                  <p className="text-base font-bold text-[#3C3330]">
                    {currentLanguage === 'kn'
                      ? appointment.hospitalNameKannada
                      : currentLanguage === 'te'
                      ? appointment.hospitalNameTelugu
                      : appointment.hospitalName}
                  </p>
                  <p className="text-sm text-[#3C3330]/85 tabular-nums">
                    {appointment.date} ({appointment.dayOfWeek}) · {appointment.time}
                  </p>
                </div>
              )}

              {/* 2. Navigation Directions */}
              {sharing.shareDirections && (
                <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
                  <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C98897]" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ತಲುಪುವ ಮಾರ್ಗ'
                        : currentLanguage === 'te'
                        ? 'దారి సూచనలు'
                        : 'Navigation Instructions'}
                    </span>
                  </span>
                  <p className="text-sm font-semibold text-[#3C3330]">{appointment.roomNumber}</p>
                  <p className="text-xs sm:text-sm text-[#3C3330]/80">
                    {appointment.directions[currentLanguage]}
                  </p>
                </div>
              )}

              {/* 3. Visit Preparation Checklist */}
              {sharing.shareChecklist && (
                <div className="p-4 rounded-2xl bg-[#A2B29B]/15 border border-[#A2B29B]/50 space-y-2">
                  <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಸಿದ್ಧತಾ ಚೆಕ್‌ಲಿಸ್ಟ್ ಸ್ಥಿತಿ'
                        : currentLanguage === 'te'
                        ? 'తయారీ జాబితా స్థితి'
                        : 'Preparation Checklist Status'}
                    </span>
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#3C3330]">
                    {beforeTasks.map((task) => (
                      <li key={task.id} className="flex items-start gap-2">
                        <span className="font-bold text-[#4A6347]">
                          {completedTasks[task.id] ? '✓' : '○'}
                        </span>
                        <span className={completedTasks[task.id] ? 'line-through opacity-70' : ''}>
                          {task.label[currentLanguage]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. Reminder Preferences */}
              {sharing.shareReminders && (
                <div className="p-4 rounded-2xl bg-[#E6C1C4]/20 border border-[#E6C1C4] space-y-1">
                  <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಜ್ಞಾಪನೆ ಆದ್ಯತೆಗಳು'
                        : currentLanguage === 'te'
                        ? 'రిమైండర్ ప్రాధాన్యతలు'
                        : 'Reminder Preferences'}
                    </span>
                  </span>
                  <p className="text-xs sm:text-sm text-[#3C3330]">
                    {appointment.reminderPreferences.voiceCall ? 'Voice Call · ' : ''}
                    {appointment.reminderPreferences.sms ? 'Native SMS · ' : ''}
                    {appointment.reminderPreferences.whatsapp ? 'WhatsApp' : ''}
                  </p>
                  <p className="text-xs text-[#8F7242]">
                    {appointment.caregiver?.notifyPolicy === 'unconfirmed_only'
                      ? currentLanguage === 'kn'
                        ? 'ರೋಗಿ ದೃಢೀಕರಿಸದಿದ್ದಾಗ ಮಾತ್ರ ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.'
                        : currentLanguage === 'te'
                        ? 'రోగి నిర్ధారించకపోతే మాత్రమే సమాచారం అందుతుంది.'
                        : 'Notified only if appointment remains unconfirmed.'
                      : currentLanguage === 'kn'
                      ? 'ಎಲ್ಲಾ ಜ್ಞಾಪನೆಗಳ ಪ್ರತಿ ಲಭ್ಯವಿದೆ.'
                      : currentLanguage === 'te'
                      ? 'అన్ని రిమైండర్ల కాపీ అందుబాటులో ఉంది.'
                      : 'Receives duplicate reminder alerts.'}
                  </p>
                </div>
              )}

              {!sharing.shareAppointmentOverview &&
                !sharing.shareDirections &&
                !sharing.shareChecklist &&
                !sharing.shareReminders && (
                  <p className="text-sm text-center text-[#3C3330]/75 py-6">
                    {currentLanguage === 'kn'
                      ? 'ಯಾವುದೇ ವಿವರಗಳನ್ನು ಹಂಚಿಕೆಗೆ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ.'
                      : currentLanguage === 'te'
                      ? 'పంచుకోవడానికి ఏ వివరాలూ ఎంచుకోబడలేదు.'
                      : 'No items are currently selected for sharing.'}
                  </p>
                )}

              <div className="pt-3 border-t border-[#BEA06D]/20 space-y-3">
                <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-2 no-print">
                  <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
                    {currentLanguage === 'kn'
                      ? 'ಆರೈಕೆದಾರರಿಗೆ ಕಾಣಿಸುವ ನಿಖರ ಹ್ಯಾಂಡ್‌ಆಫ್ ಪಠ್ಯ'
                      : currentLanguage === 'te'
                      ? 'సంరక్షకుడికి అందే ఖచ్చితమైన హ్యాండ్‌ఆఫ్ సారాంశం'
                      : 'Exact Consented Handoff Summary Preview'}
                  </span>
                  <pre className="text-xs text-[#3C3330]/85 whitespace-pre-wrap font-sans leading-relaxed bg-white p-3 rounded-xl border border-[#BEA06D]/20">
                    {buildHandoffText()}
                  </pre>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="compact-chip py-2 px-4 rounded-full bg-white border border-[#BEA06D] hover:bg-[#FCF9F5] text-[#3C3330] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSummary ? (
                        <Check className="w-3.5 h-3.5 text-[#4A6347]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#8F7242]" />
                      )}
                      <span>
                        {copiedSummary
                          ? currentLanguage === 'kn'
                            ? 'ಕಾಪಿ ಆಗಿದೆ'
                            : currentLanguage === 'te'
                            ? 'కాపీ అయింది'
                            : 'Copied Summary'
                          : currentLanguage === 'kn'
                          ? 'ಸಾರಾಂಶ ಕಾಪಿ ಮಾಡಿ'
                          : currentLanguage === 'te'
                          ? 'సారాంశం కాపీ చేయండి'
                          : 'Copy Summary'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadPlainTextSummary(buildHandoffText(), 'core-caregiver-handoff.txt')
                      }
                      className="compact-chip py-2 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {currentLanguage === 'kn'
                          ? 'ಹ್ಯಾಂಡ್‌ಆಫ್ ಸಾರಾಂಶ ಡೌನ್‌ಲೋಡ್'
                          : currentLanguage === 'te'
                          ? 'హ్యాండ్‌ఆఫ్ సారాంశం డౌన్‌లోడ్'
                          : 'Download Handoff Summary'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="compact-chip py-2 px-4 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>
                        {currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್' : currentLanguage === 'te' ? 'ప్రింట్' : 'Print Card'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onPageChange('reminders')}
                    className="compact-chip text-xs font-bold text-[#8F7242] hover:text-[#3C3330] inline-flex items-center gap-1 cursor-pointer underline"
                  >
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಜ್ಞಾಪನೆ ಸೆಟ್ಟಿಂಗ್‌ಗೆ ಹೋಗಿ'
                        : currentLanguage === 'te'
                        ? 'రిమైండర్ సెట్టింగ్స్ చూడండి'
                        : 'Configure Reminder Rules'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulated vs. Real Secure Caregiver Connection Explanation */}
      <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-xs space-y-2 text-xs sm:text-sm text-[#3C3330]/85 no-print">
        <h3 className="font-display text-xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಹಂಚಿಕೆ vs ನೈಜ ಸುರಕ್ಷಿತ ಸಂಪರ್ಕ'
            : currentLanguage === 'te'
            ? 'డెమో భాగస్వామ్యం vs నిజమైన సురక్షిత అనుసంధానం'
            : 'Simulated Local Handoff vs. Real Secure Backend Integration'}
        </h3>
        <p>
          {currentLanguage === 'kn'
            ? 'ಈ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಲ್ಲಿ, ರೋಗಿಯ ಅನುಮತಿ ಮತ್ತು ಹ್ಯಾಂಡ್‌ಆಫ್ ಪೂರ್ವವೀಕ್ಷಣೆಯು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ತಾತ್ಕಾಲಿಕವಾಗಿ ನಡೆಯುತ್ತದೆ; ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಲಿಂಕ್ ಅಥವಾ ಹೊರಗಿನ ಸರ್ವರ್‌ಗೆ ಮಾಹಿತಿ ಹೋಗುವುದಿಲ್ಲ. ನೈಜ ಆಸ್ಪತ್ರೆ ಬಳಕೆಯಲ್ಲಿ ಇದಕ್ಕೆ ದೃಢೀಕೃತ OTP/ಟೋಕನ್ ಮತ್ತು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಸರ್ವರ್ ಸಮ್ಮತಿ ದಾಖಲೆ ಅಗತ್ಯವಿರುತ್ತದೆ.'
            : currentLanguage === 'te'
            ? 'ఈ ప్రోటోటైప్‌లో రోగి అనుమతి మరియు హ్యాండ్‌ఆఫ్ ప్రివ్యూ మీ బ్రౌజర్‌లోనే స్థానికంగా ఉంటాయి; బయటి సర్వర్లకు డేటా పంపబడదు. నిజమైన ఆసుపత్రి వ్యవస్థలో OTP ఆధారిత ధృవీకరణ మరియు ఎన్‌క్రిప్టెడ్ బ్యాకెండ్ అనుమతి అవసరం ఉంటుంది.'
            : 'In this demonstration, consent toggles and handoff downloads operate strictly inside your browser without public URLs or external transmission. A production clinical connection would require verified OTP authentication, encrypted server-side consent tokens, and audited revocation logs.'}
        </p>
      </div>
    </div>
  );
};
