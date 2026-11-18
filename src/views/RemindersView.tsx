import React, { useState } from 'react';
import { Appointment, Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { VoiceCallSimulator } from '../components/VoiceCallSimulator';
import { WhatsAppSimulator } from '../components/WhatsAppSimulator';
import { Reveal, WordReveal } from '../components/Reveal';
import { downloadIcsReminder } from '../utils/calendarExport';
import {
  Bell,
  PhoneCall,
  MessageSquare,
  Smartphone,
  Users,
  CheckCircle2,
  Clock,
  Info,
  Save,
  CalendarPlus,
  BellRing,
  ServerCog
} from 'lucide-react';

interface RemindersViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onUpdateAppointment: (updated: Appointment) => void;
  onPageChange: (page: PageView) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  currentLanguage,
  appointment,
  onUpdateAppointment,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  // Modals for live simulators
  const [showCallSimulator, setShowCallSimulator] = useState(false);
  const [showWhatsAppSimulator, setShowWhatsAppSimulator] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);
  const [localToolNotice, setLocalToolNotice] = useState<string | null>(null);

  // Local state for preferences
  const [preferences, setPreferences] = useState(appointment.reminderPreferences);
  const [intervals, setIntervals] = useState<string[]>(appointment.reminderIntervals);
  const [caregiverName, setCaregiverName] = useState(appointment.caregiver?.name || 'Ramesh Gowda');
  const [caregiverPhone, setCaregiverPhone] = useState(appointment.caregiver?.phone || '98450 88991');
  const [caregiverRelation, setCaregiverRelation] = useState(appointment.caregiver?.relation || 'Son (ಮಗ)');
  const [caregiverPolicy, setCaregiverPolicy] = useState<'always' | 'unconfirmed_only'>(
    appointment.caregiver?.notifyPolicy || 'unconfirmed_only'
  );

  const toggleInterval = (intervalKey: string) => {
    if (intervals.includes(intervalKey)) {
      setIntervals(intervals.filter((i) => i !== intervalKey));
    } else {
      setIntervals([...intervals, intervalKey]);
    }
  };

  const handleSave = () => {
    const updated: Appointment = {
      ...appointment,
      reminderPreferences: preferences,
      reminderIntervals: intervals as any,
      caregiver: {
        name: caregiverName,
        phone: caregiverPhone,
        relation: caregiverRelation,
        notifyPolicy: caregiverPolicy,
        isVerified: true,
        notifiedCount: appointment.caregiver?.notifiedCount || 0,
        lastNotified: appointment.caregiver?.lastNotified,
      },
    };
    onUpdateAppointment(updated);
    setSavedSuccessNotice(true);
    setTimeout(() => {
      setSavedSuccessNotice(false);
    }, 4500);
  };

  const handleDownloadIcs = () => {
    downloadIcsReminder({
      title: `CORE Visit Reminder: ${appointment.testName}`,
      dateYmd: appointment.date,
      timeStr: appointment.time,
      location: `${appointment.hospitalName} — ${appointment.roomNumber}`,
      description: 'Exported locally from CORE Reminders (demonstration appointment). Confirm final timings directly with your hospital.',
    });
    setLocalToolNotice(
      currentLanguage === 'kn'
        ? 'ನಿಮ್ಮ ಸಾಧನಕ್ಕೆ .ics ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.'
        : currentLanguage === 'te'
        ? 'మీ పరికరానికి .ics క్యಾಲెండర్ రిమైండర్ ఫైల్ డౌన్‌లోడ్ చేయబడింది.'
        : 'Downloaded .ics calendar file locally to your device.'
    );
    setTimeout(() => setLocalToolNotice(null), 4500);
  };

  const handleBrowserNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setLocalToolNotice(
        currentLanguage === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳೀಯ ಅಧಿಸೂಚನೆ ಲಭ್ಯವಿಲ್ಲ; ದಯವಿಟ್ಟು .ics ಕ್ಯಾಲೆಂಡರ್ ಡೌನ್‌ಲೋಡ್ ಬಳಸಿ.'
          : currentLanguage === 'te'
          ? 'ఈ బ్రౌజర్‌లో నోటిఫికేషన్‌లు అందుబాటులో లేవు; .ics క్యಾಲెండర్ డౌన్‌లోడ్ వాడండి.'
          : 'Browser Notification API is unavailable in this environment; please use the .ics Calendar download.'
      );
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('CORE Local Visit Reminder', {
        body: `${appointment.testName} · ${appointment.date} at ${appointment.time}`,
      });
      setLocalToolNotice(
        currentLanguage === 'kn'
          ? 'ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆಯನ್ನು ತೋರಿಸಲಾಗಿದೆ (ಬಾಹ್ಯ SMS ಕಳುಹಿಸಿಲ್ಲ).'
          : currentLanguage === 'te'
          ? 'స్థానిక బ్రౌజర్ నోటిఫికేషన్ చూపబడింది (బయటికి SMS పంపలేదు).'
          : 'Local browser reminder displayed (no external carrier message sent).'
      );
    } else if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('CORE Local Visit Reminder', {
          body: `${appointment.testName} · ${appointment.date} at ${appointment.time}`,
        });
        setLocalToolNotice(
          currentLanguage === 'kn'
            ? 'ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆ ಸಕ್ರಿಯವಾಗಿದೆ.'
            : currentLanguage === 'te'
            ? 'స్థానిక బ్రౌజర్ రిమైండర్ చూపబడింది.'
            : 'Local browser notification permitted and displayed.'
        );
      } else {
        setLocalToolNotice(
          currentLanguage === 'kn'
            ? 'ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆ ಅನುಮತಿ ನೀಡಿಲ್ಲ; ದಯವಿಟ್ಟು .ics ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ ಬಳಸಿ.'
            : currentLanguage === 'te'
            ? 'నోటిఫికేషన్ అనుమతి ఇవ్వలేదు; .ics క్యಾಲెండర్ ఫైల్ ఉపయోగించండి.'
            : 'Notification permission declined; please use the working .ics Calendar Export instead.'
        );
      }
    } else {
      setLocalToolNotice(
        currentLanguage === 'kn'
          ? 'ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ; .ics ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.'
          : currentLanguage === 'te'
          ? 'బ్రౌజర్ నోటిఫికేషన్లు బ్లాక్ చేయబడ్డాయి; .ics క్యಾಲెండర్ డౌన్‌లోడ్ వాడండి.'
          : 'Browser notifications are blocked in site settings; please use the .ics Calendar download.'
      );
    }
    setTimeout(() => setLocalToolNotice(null), 5000);
  };

  // Plain Native SMS text for Basappa Gowda
  const getSmsText = () => {
    if (currentLanguage === 'kn') {
      return `ವಿಕ್ಟೋರಿಯಾ ಆಸ್ಪತ್ರೆ: ನಮಸ್ಕಾರ ಬಸಪ್ಪ ಗೌಡರೇ, ನಿಮ್ಮ ಹೊಟ್ಟೆಯ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ: ${appointment.date}, ${appointment.time}. ೪ ಗಂಟೆ ಉಪವಾಸ ಕಡ್ಡಾಯ. ಹಾಜರಾಗುವುದಾದರೆ 9845123456 ಗೆ YES ಎಂದು ಉತ್ತರಿಸಿ ಅಥವಾ CORE ಆಪ್ ನೋಡಿ.`;
    } else if (currentLanguage === 'te') {
      return `విక్టోరియా హాస్పిటల్: నమస్కారం వెంకటప్ప నాయుడు గారూ, మీ పొట్ట సిటి స్కాన్ తేదీ: ${appointment.date}, ${appointment.time}. 4 గంటల ముందు ఏమీ తినవద్దు. వివరాలకు CORE యాప్ చూడండి.`;
    } else {
      return `Victoria Hospital: Dear Basappa Gowda, your CT scan is on ${appointment.date} at ${appointment.time}. Fasting 4h required. Reply YES to confirm or visit CORE app.`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* View Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ಸಕಾಲಿಕ ಜ್ಞಾಪನೆಗಳು' : currentLanguage === 'te' ? 'సమయానికి రిమైండర్లు' : 'Reminders & Channel Previews'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
            <WordReveal text={t.reminders.title} />
          </h1>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {t.reminders.subtitle}
          </p>
        </div>
      </Reveal>

      {/* SECTION A: WORKING LOCAL DEVICE REMINDERS (.ics & Browser Notification) */}
      <Reveal delay={70}>
        <div className="bg-white border-2 border-[#A2B29B]/60 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A2B29B]/30 pb-3.5">
            <div>
              <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
                {currentLanguage === 'kn'
                  ? 'ಈಗಲೇ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಸ್ಥಳೀಯ ಸಾಧನಗಳು'
                  : currentLanguage === 'te'
                  ? 'ఇప్పుడే పనిచేసే స్థానిక సాధనాలు'
                  : 'Working Local Browser Reminders'}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                {currentLanguage === 'kn'
                  ? 'ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ (.ics) ಮತ್ತು ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆ'
                  : currentLanguage === 'te'
                  ? 'క్యాలెండర్ ఫైల్ (.ics) మరియు స్థానిక బ్రౌజర్ రిమైండర్'
                  : 'Save an Offline Calendar Reminder or Test Local Alert'}
              </h2>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#A2B29B]/25 text-[#4A6347] border border-[#4A6347]/30 shrink-0">
              {currentLanguage === 'kn' ? 'ಬಾಹ್ಯ ಸರ್ವರ್ ಅಗತ್ಯವಿಲ್ಲ' : currentLanguage === 'te' ? 'సెర్వర్ అవసరం లేదు' : 'Works Offline Locally'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="py-3 px-5 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ (.ics) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
                  : currentLanguage === 'te'
                  ? 'క్యాలెండర్ ఫైల్ (.ics) డౌన్‌లోడ్ చేయండి'
                  : 'Download Calendar Reminder (.ics)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleBrowserNotification()}
              className="py-3 px-5 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D] text-[#8F7242] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <BellRing className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆ ಪರೀಕ್ಷಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'బ్రౌజర్ నోటిఫికేషన్ పరీక్షించండి'
                  : 'Trigger Local Browser Notification'}
              </span>
            </button>
          </div>

          {localToolNotice && (
            <div className="p-3 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347]/50 text-xs sm:text-sm font-semibold text-[#4A6347] flex items-center gap-2 soft-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{localToolNotice}</span>
            </div>
          )}
        </div>
      </Reveal>

      {/* SECTION B: DEMONSTRATION PREVIEW SIMULATORS (NO EXTERNAL MESSAGE SENT) */}
      <Reveal delay={110}>
        <div className="bg-gradient-to-r from-[#FCF9F5] via-white to-[#FCF9F5] border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
                {t.reminders.simulatorTitle}
              </span>
              <p className="text-sm font-semibold text-[#3C3330]">
                {currentLanguage === 'kn'
                  ? 'ರೋಗಿಗಳಿಗೆ ಧ್ವನಿ ಕರೆ, SMS ಮತ್ತು ವಾಟ್ಸಾಪ್ ಹೇಗೆ ಕಾಣುತ್ತದೆ ಎಂಬುದನ್ನು ಇಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ:'
                  : currentLanguage === 'te'
                  ? 'రోగులకు ఫోన్ కాల్, SMS మరియు వాట్సాప్ ఎలా కనిపిస్తాయో ఇక్కడ చూడండి:'
                  : 'Interactive channel previews illustrating how elderly patients receive alerts:'}
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-900 font-bold px-3.5 py-1.5 rounded-full border border-amber-300 shrink-0">
              {currentLanguage === 'kn'
                ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪೂರ್ವವೀಕ್ಷಣೆ — ಹೊರಗಿನ ಸಂದೇಶ ಕಳುಹಿಸುವುದಿಲ್ಲ'
                : currentLanguage === 'te'
                ? 'డెమో ప్రివ్యూ — బయటికి మెసేజ్ పంపబడదు'
                : 'Demonstration Preview — No External Message Sent'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Button 1: Simulate Phone Call */}
            <button
              type="button"
              onClick={() => setShowCallSimulator(true)}
              className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/12 active:scale-[0.98] text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
                <PhoneCall className="w-5 h-5 text-emerald-700" />
                <span>{t.reminders.simulateCallBtn}</span>
              </div>
              <p className="text-xs text-[#3C3330]/75 mt-2">
                {currentLanguage === 'kn'
                  ? 'ಆನ್-ಸ್ಕ್ರೀನ್ ಧ್ವನಿ ಕರೆ ಪೂರ್ವವೀಕ್ಷಣೆ (ನಿಜವಾದ ಟೆಲಿಕಾಂ ಕರೆ ಅಲ್ಲ).'
                  : currentLanguage === 'te'
                  ? 'ఆన్-స్క్రీన్ వాయిస్ కాల్ డెమో (నిజమైన ఫోన్ కాల్ కాదు).'
                  : 'On-screen spoken IVR preview with keypad "1/2" flow (demo only).'}
              </p>
            </button>

            {/* Button 2: Simulate SMS */}
            <button
              type="button"
              onClick={() => setShowSmsModal(true)}
              className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/12 active:scale-[0.98] text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>{t.reminders.simulateSmsBtn}</span>
              </div>
              <p className="text-xs text-[#3C3330]/75 mt-2">
                {currentLanguage === 'kn'
                  ? 'ಕನ್ನಡ ಲಿಪಿಯ SMS ಸಂದೇಶದ ನಮೂನೆ ಪೂರ್ವವೀಕ್ಷಣೆ.'
                  : currentLanguage === 'te'
                  ? 'తెలుగు లిపి SMS సందేశ నమూనా ప్రివ్యూ.'
                  : 'Inspect sample native-script SMS layout locally (not sent via carrier).'}
              </p>
            </button>

            {/* Button 3: Simulate WhatsApp */}
            <button
              type="button"
              onClick={() => setShowWhatsAppSimulator(true)}
              className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/12 active:scale-[0.98] text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <span>{t.reminders.simulateWhatsappBtn}</span>
              </div>
              <p className="text-xs text-[#3C3330]/75 mt-2">
                {currentLanguage === 'kn'
                  ? 'ಚಿತ್ರ ಕಾರ್ಡ್ ಮತ್ತು ಧ್ವನಿ ಸಂದೇಶದ ಪೂರ್ವವೀಕ್ಷಣೆ.'
                  : currentLanguage === 'te'
                  ? 'చిత్ర కార్డు మరియు వాయిస్ మెసేజ్ ప్రివ్యూ.'
                  : 'Inspect card + Web Speech audio note preview (demo only).'}
              </p>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 flex items-start gap-2.5 text-xs text-[#3C3330]/85">
            <ServerCog className="w-4 h-4 text-[#8F7242] shrink-0 mt-0.5" />
            <span>
              {currentLanguage === 'kn'
                ? 'ಬಾಹ್ಯ ಸೇವಾ ಅಗತ್ಯತೆಗಳು: ನೈಜ ರೋಗಿಗಳಿಗೆ ಕರೆ, SMS ಮತ್ತು ವಾಟ್ಸಾಪ್ ಕಳುಹಿಸಲು SIP/PSTN ಧ್ವನಿ ಗೇಟ್‌ವೇ (Exotel/Twilio), TRAI DLT-ನೋಂದಾಯಿತ SMS ಪೂರೈಕೆದಾರ, Meta WhatsApp Business API ಮತ್ತು ಆಸ್ಪತ್ರೆ HIS ಅನುಮತಿ ಅಗತ್ಯವಿದೆ.'
                : currentLanguage === 'te'
                ? 'బాహ్య సేవల అవసరాలు: నిజమైన ఫోన్ కాల్స్, SMS మరియు వాట్సాప్ పంపడానికి Exotel/Twilio వాయిస్ గేట్‌వే, TRAI DLT SMS గేట్‌వే, WhatsApp Business API మరియు ఆసుపత్రి HIS అనుసంధానం అవసరం.'
                : 'External Provider Requirements: Live delivery to patients’ phones requires a PSTN/SIP Voice IVR gateway (e.g., Exotel/Twilio), a TRAI DLT-registered SMS carrier, Meta WhatsApp Business API, and authenticated hospital HIS/FHIR scheduling integration.'}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Communication Channels & Schedule */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Notification Channels */}
          <div className="bg-white border border-[#BEA06D]/30 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#3C3330] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#BEA06D]" />
              <span>{t.reminders.channelsTitle}</span>
            </h3>

            <div className="space-y-3">
              {/* Voice Call */}
              <label className="p-4 rounded-2xl border-2 border-[#BEA06D]/40 bg-[#FCF9F5] flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.voiceCall}
                  onChange={(e) => setPreferences({ ...preferences, voiceCall: e.target.checked })}
                  className="w-5 h-5 accent-[#BEA06D] mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[#3C3330] block">
                    {t.reminders.voiceCallOption} (Recommended for Rural Elderly)
                  </span>
                  <span className="text-xs text-[#3C3330]/75 block mt-0.5">
                    {t.reminders.voiceCallDesc}
                  </span>
                </div>
              </label>

              {/* SMS */}
              <label className="p-4 rounded-2xl border border-[#BEA06D]/30 bg-white flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                  className="w-5 h-5 accent-[#BEA06D] mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[#3C3330] block">
                    {t.reminders.smsOption}
                  </span>
                  <span className="text-xs text-[#3C3330]/75 block mt-0.5">
                    {t.reminders.smsDesc}
                  </span>
                </div>
              </label>

              {/* WhatsApp */}
              <label className="p-4 rounded-2xl border border-[#BEA06D]/30 bg-white flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.whatsapp}
                  onChange={(e) => setPreferences({ ...preferences, whatsapp: e.target.checked })}
                  className="w-5 h-5 accent-[#BEA06D] mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[#3C3330] block">
                    {t.reminders.whatsappOption}
                  </span>
                  <span className="text-xs text-[#3C3330]/75 block mt-0.5">
                    {t.reminders.whatsappDesc}
                  </span>
                </div>
              </label>

              {/* Caregiver Channel */}
              <label className="p-4 rounded-2xl border border-[#BEA06D]/30 bg-white flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.caregiver}
                  onChange={(e) => setPreferences({ ...preferences, caregiver: e.target.checked })}
                  className="w-5 h-5 accent-[#BEA06D] mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[#3C3330] block">
                    {t.reminders.caregiverOption}
                  </span>
                  <span className="text-xs text-[#3C3330]/75 block mt-0.5">
                    {t.reminders.caregiverDesc}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Configurable Reminder Schedule */}
          <div className="bg-white border border-[#BEA06D]/30 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#3C3330] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#BEA06D]" />
              <span>{t.reminders.intervalsTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: '7_days', label: t.reminders.sevenDays },
                { key: '1_day', label: t.reminders.oneDay },
                { key: '4_hours', label: t.reminders.fourHours },
                { key: 'same_day_morning', label: t.reminders.sameDayMorning },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    intervals.includes(item.key)
                      ? 'bg-[#BEA06D]/15 border-[#BEA06D] font-bold text-[#3C3330]'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/20 text-[#3C3330]/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={intervals.includes(item.key)}
                    onChange={() => toggleInterval(item.key)}
                    className="w-4 h-4 accent-[#BEA06D]"
                  />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authorized Caregiver Support */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BEA06D]/20 flex items-center justify-center text-[#8F7242]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#3C3330]">
                  {t.reminders.caregiverCardTitle}
                </h3>
                <span className="text-xs text-[#8F7242] font-semibold">
                  {currentLanguage === 'kn' ? 'ಸ್ವಾಭಿಮಾನ ರಕ್ಷಣೆಯೊಂದಿಗೆ ನೆರವು' : currentLanguage === 'te' ? 'ఆత్మగౌరవంతో కూడిన సంరక్షణ' : 'Assistance with Dignity'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#3C3330]/80 leading-relaxed">
              {currentLanguage === 'kn'
                ? 'ರೋಗಿಯು ತನ್ನ ವೈದ್ಯಕೀಯ ವಿವರಗಳ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣ ಹೊಂದಿರುತ್ತಾರೆ. ರೋಗಿ ಸಂದೇಶ ಗಮನಿಸದಿದ್ದರೆ ಮಾತ್ರ ಸಂಬಂಧಿಕರಿಗೆ ಮುನ್ನೆಚ್ಚರಿಕೆ ರವಾನೆಯಾಗುತ್ತದೆ.'
                : currentLanguage === 'te'
                ? 'రోగికి తన వివరాలపై పూర్తి హక్కు ఉంటుంది. రోగి గమనించకపోతే మాత్రమే బంధువుకు సమాచారం చేరుతుంది.'
                : 'The patient retains authority. Caregivers receive safety alerts only when patient has not confirmed.'}
            </p>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-[#3C3330] block mb-1">
                  {t.reminders.caregiverNameLabel}
                </label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330] font-medium focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3C3330] block mb-1">
                  {t.reminders.caregiverPhoneLabel}
                </label>
                <input
                  type="text"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330] font-medium focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3C3330] block mb-1">
                  {t.reminders.caregiverRelationLabel}
                </label>
                <input
                  type="text"
                  value={caregiverRelation}
                  onChange={(e) => setCaregiverRelation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330] font-medium focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
              </div>

              {/* Policy Selection: Dignity First */}
              <div>
                <label className="text-xs font-bold text-[#3C3330] block mb-2">
                  {t.reminders.caregiverRuleLabel}
                </label>
                <div className="space-y-2">
                  <label className="p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer bg-[#FCF9F5]">
                    <input
                      type="radio"
                      name="policy"
                      checked={caregiverPolicy === 'unconfirmed_only'}
                      onChange={() => setCaregiverPolicy('unconfirmed_only')}
                      className="w-4 h-4 accent-[#BEA06D] mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#3C3330] block">
                        {t.reminders.ruleUnconfirmedOnly}
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {currentLanguage === 'kn' ? 'ಹಿರಿಯ ರೋಗಿಯ ಸ್ವಾಭಿಮಾನಕ್ಕೆ ಮೊದಲ ಮನ್ನಣೆ.' : currentLanguage === 'te' ? 'వృద్ధుల ఆత్మగౌరవానికి మొదటి ప్రాధాన్యత.' : 'Protects independence; avoids unnecessary interference.'}
                      </span>
                    </div>
                  </label>

                  <label className="p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer bg-[#FCF9F5]">
                    <input
                      type="radio"
                      name="policy"
                      checked={caregiverPolicy === 'always'}
                      onChange={() => setCaregiverPolicy('always')}
                      className="w-4 h-4 accent-[#BEA06D] mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#3C3330] block">
                        {t.reminders.ruleAlways}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.reminders.savePreferencesBtn}</span>
              </button>

              {savedSuccessNotice && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-semibold text-emerald-800 soft-fade-up">
                  ✓{' '}
                  {currentLanguage === 'kn'
                    ? 'ಈ ಬ್ರೌಸರ್ ಸೆಷನ್‌ಗೆ ಮಾತ್ರ ಉಳಿಸಲಾಗಿದೆ (ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಸ್ಥಿತಿ).'
                    : currentLanguage === 'te'
                    ? 'ఈ బ్రౌజర్ సెషన్‌కు మాత్రమే సేవ్ చేయబడింది (డెమో మోడ్).'
                    : 'Saved in this browser session only (demonstration state — no carrier gateway connected).'}
                </div>
              )}

              <button
                type="button"
                onClick={() => onPageChange('carecircle')}
                className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] transition-colors cursor-pointer"
              >
                {currentLanguage === 'kn'
                  ? 'CareCircle ಸಮ್ಮತಿ ಮತ್ತು ಪೂರ್ವವೀಕ್ಷಣೆ ತೆರೆಯಿರಿ →'
                  : currentLanguage === 'te'
                  ? 'CareCircle అనుమతి & ప్రివ్యూ తెరవండి →'
                  : 'Open CareCircle Consent & Caregiver Preview →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Modal Preview */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#BEA06D] space-y-4 modal-soft-enter">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-[#8F7242] font-bold text-sm">
                <MessageSquare className="w-5 h-5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'SMS ನಮೂನೆ ಪೂರ್ವವೀಕ್ಷಣೆ'
                    : currentLanguage === 'te'
                    ? 'SMS నమూనా ప్రివ్యూ'
                    : 'SMS Demonstration Preview'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSmsModal(false)}
                className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
                aria-label="Close SMS preview"
              >
                ✕
              </button>
            </div>

            <span className="block text-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
              {currentLanguage === 'kn'
                ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾತ್ರ — ನೆಟ್‌ವರ್ಕ್ ಮೂಲಕ ಕಳುಹಿಸಿಲ್ಲ'
                : currentLanguage === 'te'
                ? 'డెమో మాత్రమే — బయటికి పంపబడలేదు'
                : 'Demo Preview — Not Sent Over Mobile Network'}
            </span>

            <div className="p-4 bg-[#FCF9F5] rounded-2xl border border-gray-200 text-sm leading-relaxed text-[#3C3330]">
              {getSmsText()}
            </div>

            <div className="text-[11px] text-gray-500 text-center">
              {currentLanguage === 'kn'
                ? 'ನೈಜ ರವಾನೆಗೆ TRAI DLT-ನೋಂದಾಯಿತ SMS ಗೇಟ್‌ವೇ ಅಗತ್ಯವಿದೆ.'
                : currentLanguage === 'te'
                ? 'నిజమైన SMS కోసం TRAI DLT గేట్‌వే అవసరం.'
                : 'Native script layout preview. Live SMS dispatch requires a DLT-registered telecom gateway.'}
            </div>

            <button
              type="button"
              onClick={() => setShowSmsModal(false)}
              className="w-full py-2.5 bg-[#BEA06D] text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              {currentLanguage === 'kn' ? 'SMS ಮುಚ್ಚಿ' : currentLanguage === 'te' ? 'SMS మూసివేయండి' : 'Close Preview'}
            </button>
          </div>
        </div>
      )}

      {/* Live Voice Call Simulator Modal */}
      {showCallSimulator && (
        <VoiceCallSimulator
          appointment={appointment}
          language={currentLanguage}
          onConfirmAttendance={() => {
            onUpdateAppointment({
              ...appointment,
              status: 'confirmed',
            });
          }}
          onRequestReschedule={() => {
            setShowCallSimulator(false);
            onPageChange('reschedule');
          }}
          onClose={() => setShowCallSimulator(false)}
        />
      )}

      {/* Live WhatsApp Simulator Modal */}
      {showWhatsAppSimulator && (
        <WhatsAppSimulator
          appointment={appointment}
          language={currentLanguage}
          onConfirmAttendance={() => {
            onUpdateAppointment({
              ...appointment,
              status: 'confirmed',
            });
          }}
          onRequestReschedule={() => {
            setShowWhatsAppSimulator(false);
            onPageChange('reschedule');
          }}
          onClose={() => setShowWhatsAppSimulator(false)}
        />
      )}
    </div>
  );
};
