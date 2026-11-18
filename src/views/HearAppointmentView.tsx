import React, { useState } from 'react';
import { CoreMonogramMark } from '../components/BotanicalMotifs';
import { Appointment, Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AudioPlayer } from '../components/AudioPlayer';
import { CareJourneyTimeline } from '../components/CareJourneyTimeline';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HeartHandshake,
  BookOpen,
  FileCheck2,
  Users
} from 'lucide-react';

interface HearAppointmentViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onConfirmAttendance: (id: string) => void;
  onPageChange: (page: PageView) => void;
  onSearchAppointment: (query: string) => void;
  allAppointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
}

export const HearAppointmentView: React.FC<HearAppointmentViewProps> = ({
  currentLanguage,
  appointment,
  onConfirmAttendance,
  onPageChange,
  allAppointments,
  onSelectAppointment,
  completedTasks,
  onToggleTask,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [searchInput, setSearchInput] = useState('');
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  // Build the complete natural spoken speech text in the selected language
  const getFullSpokenText = (): string => {
    if (currentLanguage === 'kn') {
      return `ನಮಸ್ಕಾರ ${appointment.patientNameKannada} ರವರೇ. ನಿಮ್ಮ ${appointment.hospitalNameKannada} ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳು ಹೀಗಿವೆ. ಪರೀಕ್ಷೆ: ${appointment.testNameKannada}. ದಿನಾಂಕ: ${appointment.date}, ${appointment.dayOfWeek}. ಸಮಯ: ಬೆಳಗ್ಗೆ ${appointment.time}. ಆಸ್ಪತ್ರೆಯ ವಿಭಾಗ: ${appointment.roomNumber}. ಪರೀಕ್ಷೆಗೆ ಮುನ್ನ ಪಾಲಿಸಬೇಕಾದ ನಿಯಮಗಳು: ${appointment.preparationInstructions.kn.join(' ')} ${appointment.directions.kn} ಧನ್ಯವಾದಗಳು.`;
    } else if (currentLanguage === 'te') {
      return `నమస్కారం ${appointment.patientNameTelugu} గారూ. మీ ${appointment.hospitalNameTelugu} అపాయింట్‌మెంట్ వివరాలు: పరీక్ష: ${appointment.testNameTelugu}. తేదీ: ${appointment.date}, ${appointment.dayOfWeek}. సమయం: ఉదయం ${appointment.time}. విభాగం: ${appointment.roomNumber}. ముఖ్యమైన జాగ్రత్తలు: ${appointment.preparationInstructions.te.join(' ')} ${appointment.directions.te} ధన్యవాదాలు.`;
    } else {
      return `Hello ${appointment.patientName}. Here are your appointment details for ${appointment.hospitalName}. Test: ${appointment.testName}. Scheduled Date: ${appointment.date}, ${appointment.dayOfWeek} at ${appointment.time}. Department: ${appointment.roomNumber}. Preparation instructions: ${appointment.preparationInstructions.en.join(' ')} Directions: ${appointment.directions.en} Thank you.`;
    }
  };

  const handleConfirm = () => {
    onConfirmAttendance(appointment.id);
    setConfirmedSuccess(true);
  };

  const patientDisplayName =
    currentLanguage === 'kn'
      ? appointment.patientNameKannada
      : currentLanguage === 'te'
      ? appointment.patientNameTelugu
      : appointment.patientName;

  const testDisplayName =
    currentLanguage === 'kn'
      ? appointment.testNameKannada
      : currentLanguage === 'te'
      ? appointment.testNameTelugu
      : appointment.testName;

  const hospitalDisplayName =
    currentLanguage === 'kn'
      ? appointment.hospitalNameKannada
      : currentLanguage === 'te'
      ? appointment.hospitalNameTelugu
      : appointment.hospitalName;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header & Verification Bar */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ಧ್ವನಿ ಆಧಾರಿತ ವಿವರಗಳು' : currentLanguage === 'te' ? 'వాయిస్ ఆధారిత వివరాలు' : 'Voice-First Information'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
            <WordReveal text={t.appointment.title} />
          </h1>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {t.appointment.subtitle}
          </p>
        </div>
      </Reveal>

      {/* Simplified Patient Switcher / Verification Box */}
      <Reveal delay={70}>
        <div className="bg-white border border-[#BEA06D]/30 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider block">
              {t.appointment.lookupTitle}
            </span>
            <p className="text-sm text-[#3C3330]/80 mt-0.5">
              {t.appointment.lookupDesc}
            </p>
          </div>

          {/* Quick Demo Pre-fills for ease of testing */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {allAppointments.map((apt) => (
              <button
                key={apt.id}
                onClick={() => {
                  onSelectAppointment(apt);
                  setConfirmedSuccess(false);
                }}
                className={`text-xs px-3.5 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                  appointment.id === apt.id
                    ? 'bg-[#BEA06D] text-white border-[#BEA06D] shadow-sm'
                    : 'bg-[#FCF9F5] text-[#3C3330] border-[#BEA06D]/30 hover:border-[#BEA06D]'
                }`}
              >
                {apt.patientName} ({apt.preferredLanguage.toUpperCase()})
              </button>
            ))}
          </div>
        </div>
        </div>
      </Reveal>

      {/* Main Appointment Card */}
      <Reveal delay={120} variant="bloom">
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl shadow-lg overflow-hidden transition-all">
        {/* Card Header Strip with Gold Accents */}
        <div className="bg-[#FCF9F5] border-b border-[#BEA06D]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CoreMonogramMark size="md" />
            <div>
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
                {t.appointment.detailsTitle}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
                {patientDisplayName}
              </h2>
              <span className="text-xs text-[#3C3330]/70">
                {currentLanguage === 'kn' ? `ವಯಸ್ಸು: ${appointment.patientAge} ವರ್ಷ` : currentLanguage === 'te' ? `వయస్సు: ${appointment.patientAge} ఏళ్ళు` : `Age: ${appointment.patientAge} Years`} · {appointment.patientVillage}, {appointment.patientDistrict}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {appointment.status === 'confirmed' ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#A2B29B]/25 border border-[#A2B29B] text-[#4A6347] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#4A6347]" />
                <span>{t.appointment.confirmed}</span>
              </div>
            ) : appointment.status === 'rescheduled' ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-bold text-xs">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{t.appointment.rescheduled}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-300 text-orange-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>{t.appointment.unconfirmed}</span>
              </div>
            )}
          </div>
        </div>

        {/* VOICE-FIRST AUDIO PLAYER (The Heart of the Experience) */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FCF9F5] via-white to-[#FCF9F5] border-b border-[#BEA06D]/30">
          <AudioPlayer
            textToSpeak={getFullSpokenText()}
            language={currentLanguage}
          />
        </div>

        {/* Appointment Grid Details with Big Accessible Typography */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Diagnostic Test */}
            <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1.5">
              <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#BEA06D]" />
                {t.appointment.testLabel}
              </span>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {testDisplayName}
              </p>
              <span className="text-xs text-[#3C3330]/70 block">
                {appointment.testCategory} · Dr. Suresh Patil
              </span>
            </div>

            {/* Box 2: Date & Reporting Time */}
            <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1.5">
              <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#BEA06D]" />
                {t.appointment.dateLabel} & {t.appointment.timeLabel}
              </span>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {appointment.date} ({appointment.dayOfWeek})
              </p>
              <p className="text-lg font-bold text-[#8F7242]">
                {appointment.time}{' '}
                <span className="text-xs font-normal text-[#3C3330]/70">
                  ({currentLanguage === 'kn' ? 'ಬೆಳಗ್ಗೆ' : currentLanguage === 'te' ? 'ఉదయం' : 'Morning'})
                </span>
              </p>
            </div>

            {/* Box 3: Hospital & Department */}
            <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1.5">
              <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#BEA06D]" />
                {t.appointment.hospitalLabel}
              </span>
              <p className="text-lg font-bold text-[#3C3330]">
                {hospitalDisplayName}
              </p>
              <p className="text-xs text-[#3C3330]/80">
                {appointment.department}
              </p>
            </div>

            {/* Box 4: Room & Directions */}
            <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1.5">
              <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                {t.appointment.roomLabel}
              </span>
              <p className="text-base font-bold text-[#3C3330]">
                {appointment.roomNumber}
              </p>
              <p className="text-xs text-[#3C3330]/80 leading-relaxed">
                {appointment.directions[currentLanguage]}
              </p>
            </div>
          </div>

          {/* Hospital-Approved Preparation Instructions (Clear Visual Cards) */}
          <div className="p-6 rounded-2xl bg-[#E6C1C4]/20 border border-[#E6C1C4] space-y-4">
            <div className="flex items-center gap-2 text-[#8F7242] font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-[#C98897]" />
              <span>{t.appointment.preparationTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {appointment.preparationInstructions[currentLanguage].map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white/90 rounded-xl border border-[#E6C1C4]/60 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#BEA06D] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-[#3C3330] leading-snug">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation & Reschedule Action Buttons (Big, High-Touch Targets) */}
          <div className="pt-4 border-t border-[#BEA06D]/20 space-y-4">
            {confirmedSuccess || appointment.status === 'confirmed' ? (
              <div className="p-5 rounded-2xl bg-[#A2B29B]/20 border border-[#A2B29B] text-center space-y-2 animate-in fade-in-50">
                <CheckCircle2 className="w-10 h-10 text-[#4A6347] mx-auto" />
                <h4 className="text-lg font-bold text-[#211B19]">
                  {t.appointment.confirmedNotice}
                </h4>
                <p className="text-xs text-[#3C3330]/80">
                  {currentLanguage === 'kn'
                    ? 'ನಿಮ್ಮ ಹಾಜರಾತಿಯನ್ನು ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ವಿಭಾಗಕ್ಕೆ ದಾಖಲಿಸಲಾಗಿದೆ. ಸ್ಕ್ಯಾನ್ ದಿನದಂದು ನಿಯಮ ಪಾಲಿಸಿ.'
                    : currentLanguage === 'te'
                    ? 'మీ రాక హాస్పిటల్ సిబ్బందికి నమోదు చేయబడింది. దయచేసి చెప్పిన జాగ్రత్తలు పాటించండి.'
                    : 'Attendance registered. Reminder will be dispatched on the morning of your scan.'}
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleConfirm}
                className="py-5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-lg sm:text-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400"
              >
                <CheckCircle2 className="w-7 h-7" />
                <span>{t.appointment.iWillAttendBtn}</span>
              </button>

              <button
                onClick={() => onPageChange('reschedule')}
                className="py-5 px-6 rounded-2xl bg-white hover:bg-amber-50 active:scale-[0.98] border-2 border-amber-600 text-amber-900 font-bold text-lg sm:text-xl shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <Calendar className="w-7 h-7 text-amber-600" />
                <span>{t.appointment.iNeedToChangeBtn}</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Helpful Caregiver and Assistance Info */}
      <Reveal delay={140}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 bg-white border border-[#BEA06D]/30 rounded-2xl flex items-start gap-4">
          <HeartHandshake className="w-8 h-8 text-[#BEA06D] shrink-0 mt-1" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn' ? 'ಆರೈಕೆದಾರರ ರಕ್ಷಣೆ' : currentLanguage === 'te' ? 'సంరక్షకుడి సహాయం' : 'Caregiver Safety Net'}
            </span>
            <p className="text-sm font-semibold text-[#3C3330]">
              {appointment.caregiver?.name} ({appointment.caregiver?.relation})
            </p>
            <p className="text-xs text-[#3C3330]/75">
              {currentLanguage === 'kn'
                ? 'ನೀವು ದೃಢೀಕರಿಸದಿದ್ದಾಗ ಮಾತ್ರ ನಿಮ್ಮ ಮಗನಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.'
                : currentLanguage === 'te'
                ? 'మీరు స్పందించకపోతే మాత్రమే మీ కుమారుడికి సమాచారం పంపబడుతుంది.'
                : 'Notified only if unconfirmed within 12 hours.'}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#BEA06D]/30 rounded-2xl flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn' ? 'ಸಹಾಯ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ' : currentLanguage === 'te' ? 'సహాయం & మార్గదర్శకత్వం' : 'Patient Support'}
            </span>
            <p className="text-sm font-semibold text-[#3C3330]">
              {currentLanguage === 'kn' ? 'ಗ್ರಾಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಹಾಗೂ ಆಸ್ಪತ್ರೆ ನೆರವು' : currentLanguage === 'te' ? 'గ్రామ ఆశా కార్యకర్త & హాస్పిటల్ సహాయం' : 'Hospital & ASHA Worker Guidance'}
            </p>
            <p className="text-xs text-[#3C3330]/75">
              {currentLanguage === 'kn'
                ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಯಾವುದೇ ಸಂದೇಹವಿದ್ದರೂ ನೆರವು ಪಡೆಯಿರಿ.'
                : currentLanguage === 'te'
                ? 'అపాయింట్‌మెంట్ వివరాలు అర్థం చేసుకోవడానికి సహాయం తీసుకోండి.'
                : 'Need guidance understanding your appointment or directions?'}
            </p>
          </div>
          <button
            onClick={() => onPageChange('help')}
            className="py-2.5 px-4 bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
          >
            {t.nav.getHelp} →
          </button>
        </div>
        </div>
      </Reveal>

      {/* Quick Patient Toolkit Shortcuts */}
      <Reveal delay={160}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onPageChange('clarity')}
            className="p-4 bg-white border border-[#BEA06D]/35 hover:border-[#BEA06D] rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer botanical-card-hover"
          >
            <BookOpen className="w-6 h-6 text-[#4A6347] shrink-0" />
            <div>
              <span className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn' ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ' : currentLanguage === 'te' ? 'సులభంగా వివరించండి' : 'Explain It Simply'}
              </span>
              <span className="text-xs text-[#3C3330]/75">
                {currentLanguage === 'kn' ? 'ಸೂಚನೆಗಳ ಸುಲಭ ಅರ್ಥ ಕೇಳಿ' : currentLanguage === 'te' ? 'సూచనలను సులభంగా వినండి' : 'Hear hospital terms clearly'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPageChange('passport')}
            className="p-4 bg-white border border-[#BEA06D]/35 hover:border-[#BEA06D] rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer botanical-card-hover"
          >
            <FileCheck2 className="w-6 h-6 text-[#BEA06D] shrink-0" />
            <div>
              <span className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn' ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್' : currentLanguage === 'te' ? 'నా విజిట్ పాస్‌పోర్ట్' : 'My Visit Passport'}
              </span>
              <span className="text-xs text-[#3C3330]/75">
                {currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್ / PDF ಸಿದ್ಧತಾ ಕಾರ್ಡ್' : currentLanguage === 'te' ? 'ప్రింట్ / PDF కార్డు పొందండి' : 'Print or save preparation card'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPageChange('carecircle')}
            className="p-4 bg-white border border-[#BEA06D]/35 hover:border-[#BEA06D] rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer botanical-card-hover"
          >
            <Users className="w-6 h-6 text-[#C98897] shrink-0" />
            <div>
              <span className="text-sm font-bold text-[#3C3330] block">
                CareCircle
              </span>
              <span className="text-xs text-[#3C3330]/75">
                {currentLanguage === 'kn' ? 'ಸಮ್ಮತಿ ಆಧಾರಿತ ಕುಟುಂಬ ನೆರವು' : currentLanguage === 'te' ? 'అనుమతితో కుటుంబ సహాయం' : 'Consent-based family sharing'}
              </span>
            </div>
          </button>
        </div>
      </Reveal>

      {/* Interactive 3-Stage Care Journey Timeline */}
      <Reveal delay={180}>
        <CareJourneyTimeline
          language={currentLanguage}
          appointment={appointment}
          completedTasks={completedTasks}
          onToggleTask={onToggleTask}
          onPageChange={onPageChange}
        />
      </Reveal>
    </div>
  );
};
