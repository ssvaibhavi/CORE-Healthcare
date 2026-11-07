import React, { useState } from 'react';
import { Appointment, Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { VoiceCallSimulator } from '../components/VoiceCallSimulator';
import { WhatsAppSimulator } from '../components/WhatsAppSimulator';
import {
  Bell,
  PhoneCall,
  MessageSquare,
  Smartphone,
  Users,
  Shield,
  CheckCircle2,
  Play,
  Clock,
  Sparkles,
  Info,
  Save,
  UserCheck
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
    }, 4000);
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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          {currentLanguage === 'kn' ? 'ಸಕಾಲಿಕ ಜ್ಞಾಪನೆಗಳು' : currentLanguage === 'te' ? 'సమయానికి రిమైండర్లు' : 'Intelligent Reminders'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
          {t.reminders.title}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {t.reminders.subtitle}
        </p>
      </div>

      {/* Interactive Communication Simulator Strip (Live Interactive Demos) */}
      <div className="bg-gradient-to-r from-[#FCF9F5] via-white to-[#FCF9F5] border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {t.reminders.simulatorTitle}
            </span>
            <p className="text-sm font-semibold text-[#3C3330]">
              {currentLanguage === 'kn'
                ? 'ಗ್ರಾಮೀಣ ರೋಗಿಗಳಿಗೆ ಸಂದೇಶಗಳು ಹೇಗೆ ತಲುಪುತ್ತವೆ ಎಂಬುದನ್ನು ಈಗಲೇ ಪರೀಕ್ಷಿಸಿ:'
                : currentLanguage === 'te'
                ? 'గ్రామీణ రోగులకు సందేశాలు ఎలా చేరుతాయో ఇప్పుడే ప్రత్యక్షంగా పరీక్షించండి:'
                : 'Test how elderly patients experience multi-channel reminders in real life:'}
            </p>
          </div>
          <span className="text-xs bg-[#A2B29B]/30 text-[#4A6347] font-semibold px-3 py-1 rounded-full border border-[#A2B29B]/40">
            Interactive Test Hub
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Button 1: Simulate Phone Call */}
          <button
            onClick={() => setShowCallSimulator(true)}
            className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/15 active:scale-95 text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
              <PhoneCall className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span>{t.reminders.simulateCallBtn}</span>
            </div>
            <p className="text-xs text-[#3C3330]/75 mt-2">
              {currentLanguage === 'kn'
                ? 'ಫೋನ್ ಕರೆ ಬಂದು ಕನ್ನಡದಲ್ಲಿ ಓದಿ ಹೇಳುತ್ತದೆ. ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ೧ ಒತ್ತಿ ನೋಡಿ.'
                : currentLanguage === 'te'
                ? 'ఫోన్ కాల్ వచ్చి తెలుగులో మాట్లాడుతుంది. కీప్యాడ్‌లో 1 నొక్కండి.'
                : 'Experience incoming spoken phone call with keypad response.'}
            </p>
          </button>

          {/* Button 2: Simulate SMS */}
          <button
            onClick={() => setShowSmsModal(true)}
            className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/15 active:scale-95 text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>{t.reminders.simulateSmsBtn}</span>
            </div>
            <p className="text-xs text-[#3C3330]/75 mt-2">
              {currentLanguage === 'kn'
                ? 'ಸಾಮಾನ್ಯ ಫೋನ್‌ಗಳಲ್ಲಿ ಬರುವ ಕನ್ನಡ ಲಿಪಿಯ SMS ಸಂದೇಶ.'
                : currentLanguage === 'te'
                ? 'సాధారణ మొబైల్స్‌లో వచ్చే తెలుగు లిపి SMS.'
                : 'Inspect clear text SMS in native script.'}
            </p>
          </button>

          {/* Button 3: Simulate WhatsApp */}
          <button
            onClick={() => setShowWhatsAppSimulator(true)}
            className="p-4 rounded-2xl bg-white border-2 border-[#BEA06D] hover:bg-[#BEA06D]/15 active:scale-95 text-left transition-all shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-[#8F7242] font-bold text-sm">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>{t.reminders.simulateWhatsappBtn}</span>
            </div>
            <p className="text-xs text-[#3C3330]/75 mt-2">
              {currentLanguage === 'kn'
                ? 'ದೊಡ್ಡ ಚಿತ್ರ ಕಾರ್ಡ್ ಹಾಗೂ ಧ್ವನಿ ಸಂದೇಶ (Voice Note).'
                : currentLanguage === 'te'
                ? 'పెద్ద ఫోటో కార్డు మరియు వాయిస్ మెసేజ్.'
                : 'Inspect visual card with playable audio note.'}
            </p>
          </button>
        </div>
      </div>

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
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-semibold text-emerald-800 animate-in fade-in-50">
                  ✓ {t.reminders.preferencesSavedMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SMS Modal Preview */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#BEA06D] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-[#8F7242] font-bold text-sm">
                <MessageSquare className="w-5 h-5" />
                <span>Govt Hospital SMS</span>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#FCF9F5] rounded-2xl border border-gray-200 text-sm leading-relaxed text-[#3C3330]">
              {getSmsText()}
            </div>

            <div className="text-[11px] text-gray-500 text-center">
              {currentLanguage === 'kn'
                ? 'ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ರವಾನೆಯಾಗುವ ಸಂದೇಶದಿಂದ ರೋಗಿ ಸ್ವತಂತ್ರವಾಗಿ ಓದಬಹುದು ಅಥವಾ ಪರಿಚಿತರಿಂದ ಓದಿಸಿಕೊಳ್ಳಬಹುದು.'
                : currentLanguage === 'te'
                ? 'తెలుగు లిపిలో వచ్చే సందేశాన్ని రోగి స్వయంగా అర్థం చేసుకోవచ్చు.'
                : 'Native script prevents decoding confusion.'}
            </div>

            <button
              onClick={() => setShowSmsModal(false)}
              className="w-full py-2.5 bg-[#BEA06D] text-white rounded-xl font-bold text-xs"
            >
              Close SMS
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
