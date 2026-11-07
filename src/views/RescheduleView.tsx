import React, { useState } from 'react';
import { Appointment, AvailableSlot, Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MOCK_AVAILABLE_SLOTS } from '../data/mockAppointments';
import { speechService } from '../utils/speech';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Building2,
  MapPin,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface RescheduleViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onUpdateAppointment: (updated: Appointment) => void;
  onPageChange: (page: PageView) => void;
}

export const RescheduleView: React.FC<RescheduleViewProps> = ({
  currentLanguage,
  appointment,
  onUpdateAppointment,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('transport');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSpeakingSummary, setIsSpeakingSummary] = useState<boolean>(false);

  // Filter slots
  const morningSlots = MOCK_AVAILABLE_SLOTS.filter((s) => s.period === 'morning');
  const afternoonSlots = MOCK_AVAILABLE_SLOTS.filter((s) => s.period === 'afternoon');

  const speakStepVoice = (stepNum: number) => {
    let text = '';
    if (stepNum === 1) {
      text =
        currentLanguage === 'kn'
          ? `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ${appointment.date}, ಬೆಳಗ್ಗೆ ${appointment.time}. ಬದಲಾಯಿಸಲು ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಿ.`
          : currentLanguage === 'te'
          ? `మీ ప్రస్తుత అపాయింట్‌మెంట్ ${appointment.date}, ఉదయం ${appointment.time}. మార్చుకోవడానికి తదుపరి దశకు వెళ్ళండి.`
          : `Your current appointment is ${appointment.date} at ${appointment.time}. Proceed to request change.`;
    } else if (stepNum === 2) {
      text =
        currentLanguage === 'kn'
          ? 'ಹೊಸ ದಿನಾಂಕ ಮತ್ತು ಸಮಯವನ್ನು ಆರಿಸಿ. ಬೆಳಗಿನ ಅಥವಾ ಮಧ್ಯಾಹ್ನದ ಸಮಯ ಲಭ್ಯವಿದೆ.'
          : currentLanguage === 'te'
          ? 'కొత్త తేదీ మరియు సమయం ఎంచుకోండి. ఉదయం లేదా మధ్యాహ్నం సమయాలు అందుబాటులో ఉన్నాయి.'
          : 'Please select a new date and time from the available slots.';
    } else if (stepNum === 3) {
      text =
        currentLanguage === 'kn'
          ? 'ದಿನಾಂಕ ಬದಲಾವಣೆಯ ಕಾರಣವನ್ನು ತಿಳಿಸಿ.'
          : currentLanguage === 'te'
          ? 'తేదీ మార్పునకు గల కారణాన్ని ఎంచుకోండి.'
          : 'Please select a reason for rescheduling.';
    } else if (stepNum === 4) {
      text =
        currentLanguage === 'kn'
          ? `ಹೊಸ ದಿನಾಂಕ ${selectedSlot?.date}, ಸಮಯ ${selectedSlot?.time}. ದೃಢೀಕರಿಸಲು ಬಟನ್ ಒತ್ತಿ.`
          : currentLanguage === 'te'
          ? `కొత్త తేదీ ${selectedSlot?.date}, సమయం ${selectedSlot?.time}. నిర్ధారించడానికి బటన్ నొక్కండి.`
          : `Review your new appointment for ${selectedSlot?.date} at ${selectedSlot?.time}. Confirm to finalize.`;
    }
    if (text) {
      speechService.speak(text, currentLanguage);
    }
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    // Announce selected slot
    const announcement =
      currentLanguage === 'kn'
        ? `ನೀವು ${slot.date}, ${slot.time} ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ.`
        : currentLanguage === 'te'
        ? `మీరు ${slot.date}, ${slot.time} ఎంచుకున్నారు.`
        : `Selected slot: ${slot.date} at ${slot.time}.`;
    speechService.speak(announcement, currentLanguage);
  };

  const handleConfirmReschedule = () => {
    if (!selectedSlot) return;

    const updated: Appointment = {
      ...appointment,
      date: selectedSlot.date,
      time: selectedSlot.time,
      status: 'rescheduled',
      history: [
        ...appointment.history,
        {
          timestamp: new Date().toLocaleString(),
          action: `Rescheduled to ${selectedSlot.date} ${selectedSlot.time}`,
          actionKannada: `ಹೊಸ ದಿನಾಂಕಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ: ${selectedSlot.date} ${selectedSlot.time}`,
          actionTelugu: `తేదీ మార్చబడింది: ${selectedSlot.date} ${selectedSlot.time}`,
          author: 'Patient Self-Service (CORE)',
        },
      ],
    };

    onUpdateAppointment(updated);
    setIsSuccess(true);
    setCurrentStep(5);

    // Read out new updated summary
    const successSpeech =
      currentLanguage === 'kn'
        ? `ಅಭಿನಂದನೆಗಳು ${appointment.patientNameKannada} ರವರೇ. ನಿಮ್ಮ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕವನ್ನು ${selectedSlot.date}, ${selectedSlot.time} ಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಮಗ ರಮೇಶ್‌ಗೆ ಹೊಸ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.`
        : currentLanguage === 'te'
        ? `అభినందనలు ${appointment.patientNameTelugu} గారూ. మీ సిటి స్కాన్ తేదీ ${selectedSlot.date}, ${selectedSlot.time} కి విజయవంతంగా మార్చబడింది.`
        : `Success. Your CT scan has been rescheduled to ${selectedSlot.date} at ${selectedSlot.time}. Confirmation sent to your phone.`;

    speechService.speak(successSpeech, currentLanguage);
  };

  const reasonsList = [
    { id: 'transport', label: t.reschedule.reasonTransport },
    { id: 'relative', label: t.reschedule.reasonRelative },
    { id: 'health', label: t.reschedule.reasonHealth },
    { id: 'conflict', label: t.reschedule.reasonConflict },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Speech helper */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          {currentLanguage === 'kn' ? 'ಸರಳ ೫-ಹಂತಗಳ ಮರುನಿಗದಿ' : currentLanguage === 'te' ? 'సరళమైన 5 దశల ప్రక్రియ' : 'Simple 5-Step Process'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
          {t.reschedule.title}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80 max-w-xl mx-auto">
          {t.reschedule.subtitle}
        </p>
      </div>

      {/* 5-Step Progress Indicator (Clean, Uncluttered, Accessible) */}
      <div className="bg-white border border-[#BEA06D]/30 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-[#3C3330]/70 overflow-x-auto pb-1 gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center gap-1.5 shrink-0 ${
                currentStep === step
                  ? 'text-[#8F7242] font-bold'
                  : currentStep > step
                  ? 'text-[#4A6347]'
                  : 'text-[#3C3330]/40'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === step
                    ? 'bg-[#BEA06D] text-white shadow'
                    : currentStep > step
                    ? 'bg-[#A2B29B] text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step}
              </span>
              <span className="hidden sm:inline">
                {step === 1 && (currentLanguage === 'kn' ? 'ಪ್ರಸ್ತುತ' : currentLanguage === 'te' ? 'ప్రస్తుత' : 'Current')}
                {step === 2 && (currentLanguage === 'kn' ? 'ಹೊಸ ದಿನಾಂಕ' : currentLanguage === 'te' ? 'కొత్త తేదీ' : 'New Date')}
                {step === 3 && (currentLanguage === 'kn' ? 'ಕಾರಣ' : currentLanguage === 'te' ? 'కారణం' : 'Reason')}
                {step === 4 && (currentLanguage === 'kn' ? 'ಪರಿಶೀಲನೆ' : currentLanguage === 'te' ? 'సమీక్ష' : 'Review')}
                {step === 5 && (currentLanguage === 'kn' ? 'ದೃಢೀಕರಣ' : currentLanguage === 'te' ? 'ఖరారు' : 'Confirmed')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: View Existing Appointment */}
      {currentStep === 1 && (
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#3C3330]">
              {t.reschedule.currentDetails}
            </h2>
            <button
              onClick={() => speakStepVoice(1)}
              className="p-2.5 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30 transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#BEA06D]/20 pb-3">
              <div>
                <span className="text-xs text-[#8F7242] font-semibold uppercase">
                  {currentLanguage === 'kn' ? 'ರೋಗಿ' : currentLanguage === 'te' ? 'రోగి' : 'Patient'}
                </span>
                <p className="font-bold text-lg text-[#3C3330]">
                  {currentLanguage === 'kn' ? appointment.patientNameKannada : currentLanguage === 'te' ? appointment.patientNameTelugu : appointment.patientName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8F7242] font-semibold uppercase">
                  {currentLanguage === 'kn' ? 'ಪರೀಕ್ಷೆ' : currentLanguage === 'te' ? 'పరీక్ష' : 'Procedure'}
                </span>
                <p className="font-bold text-base text-[#3C3330]">
                  {currentLanguage === 'kn' ? appointment.testNameKannada : currentLanguage === 'te' ? appointment.testNameTelugu : appointment.testName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-xs text-[#8F7242] font-semibold uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.appointment.dateLabel}
                </span>
                <p className="text-xl font-bold text-[#3C3330]">
                  {appointment.date} ({appointment.dayOfWeek})
                </p>
              </div>
              <div>
                <span className="text-xs text-[#8F7242] font-semibold uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.appointment.timeLabel}
                </span>
                <p className="text-xl font-bold text-[#BEA06D]">
                  {appointment.time}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentStep(2);
              speakStepVoice(2);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] active:scale-[0.98] text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>{t.appointment.iNeedToChangeBtn}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* STEP 2: Choose Available Slot */}
      {currentStep === 2 && (
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#3C3330]">
              {t.reschedule.selectNewDate}
            </h2>
            <button
              onClick={() => speakStepVoice(2)}
              className="p-2.5 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30 transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#8F7242] font-medium">
            {currentLanguage === 'kn'
              ? 'ಆಸ್ಪತ್ರೆಯ ರೇಡಿಯಾಲಜಿ ವಿಭಾಗದಲ್ಲಿ ಲಭ್ಯವಿರುವ ದಿನಾಂಕಗಳು (ಖಾಲಿ ಸ್ಲಾಟ್‌ಗಳು):'
              : currentLanguage === 'te'
              ? 'హాస్పిటల్ రేడియాలజీ విభాగంలో ఖాళీగా ఉన్న సమయాలు:'
              : 'Fictional available hospital radiology slots:'}
          </p>

          {/* Morning Slots */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#3C3330] uppercase tracking-wider block">
              🌅 {t.reschedule.morningSlots}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {morningSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedSlot?.id === slot.id
                      ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-sm'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/30 hover:border-[#BEA06D]'
                  }`}
                >
                  <p className="font-bold text-base text-[#3C3330]">{slot.date}</p>
                  <p className="text-xs text-[#3C3330]/75">{slot.day}</p>
                  <p className="text-lg font-bold text-[#8F7242] mt-1">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#3C3330] uppercase tracking-wider block">
              ☀️ {t.reschedule.afternoonSlots}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {afternoonSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedSlot?.id === slot.id
                      ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-sm'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/30 hover:border-[#BEA06D]'
                  }`}
                >
                  <p className="font-bold text-base text-[#3C3330]">{slot.date}</p>
                  <p className="text-xs text-[#3C3330]/75">{slot.day}</p>
                  <p className="text-lg font-bold text-[#8F7242] mt-1">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="pt-4 border-t border-[#BEA06D]/20 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-3 px-5 rounded-xl border border-[#BEA06D]/40 text-[#3C3330] hover:bg-[#FCF9F5] font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.reschedule.backBtn}</span>
            </button>

            <button
              disabled={!selectedSlot}
              onClick={() => {
                setCurrentStep(3);
                speakStepVoice(3);
              }}
              className={`py-3.5 px-7 rounded-2xl font-bold text-base flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                selectedSlot
                  ? 'bg-[#BEA06D] hover:bg-[#8F7242] text-white active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentLanguage === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : currentLanguage === 'te' ? 'తదుపరి దశ' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Reason for Rescheduling */}
      {currentStep === 3 && (
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#3C3330]">
              {t.reschedule.selectReason}
            </h2>
            <button
              onClick={() => speakStepVoice(3)}
              className="p-2.5 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30 transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {reasonsList.map((reason) => (
              <label
                key={reason.id}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                  selectedReason === reason.id
                    ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-xs'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/30 hover:border-[#BEA06D]'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                  className="w-5 h-5 accent-[#BEA06D]"
                />
                <span className="text-base font-semibold text-[#3C3330]">
                  {reason.label}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-[#BEA06D]/20 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-3 px-5 rounded-xl border border-[#BEA06D]/40 text-[#3C3330] hover:bg-[#FCF9F5] font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.reschedule.backBtn}</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(4);
                speakStepVoice(4);
              }}
              className="py-3.5 px-7 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-base flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <span>{currentLanguage === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : currentLanguage === 'te' ? 'సమీక్షించండి' : 'Review Selection'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review and Confirm */}
      {currentStep === 4 && selectedSlot && (
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#3C3330]">
              {t.reschedule.reviewTitle}
            </h2>
            <button
              onClick={() => speakStepVoice(4)}
              className="p-2.5 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30 transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison of Old vs New Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 opacity-80">
              <span className="text-xs font-semibold text-gray-500 uppercase block">
                {currentLanguage === 'kn' ? 'ಹಿಂದಿನ ದಿನಾಂಕ (ರದ್ದು)' : currentLanguage === 'te' ? 'పాత తేదీ (రద్దు)' : 'Previous Slot (Cancelling)'}
              </span>
              <p className="line-through text-base font-bold text-gray-700 mt-1">
                {appointment.date} · {appointment.time}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#BEA06D]/15 border-2 border-[#BEA06D] shadow-xs">
              <span className="text-xs font-bold text-[#8F7242] uppercase block">
                {currentLanguage === 'kn' ? 'ಹೊಸ ಆಯ್ಕೆಯ ದಿನಾಂಕ' : currentLanguage === 'te' ? 'కొత్త ఎంపిక తేదీ' : 'New Selected Slot'}
              </span>
              <p className="text-xl font-bold text-[#3C3330] mt-1">
                {selectedSlot.date} · {selectedSlot.time}
              </p>
              <p className="text-xs text-[#8F7242]">{selectedSlot.day}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/30 text-xs text-[#3C3330]/80 space-y-1">
            <p className="font-semibold text-[#8F7242]">
              {currentLanguage === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಸೂಚನೆಗಳು:' : currentLanguage === 'te' ? 'ఆటోమేటిక్ నోటిఫికేషన్లు:' : 'Automated Notifications:'}
            </p>
            <p>• {currentLanguage === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಹೊಸ ಕನ್ನಡ SMS ಬರುತ್ತದೆ.' : currentLanguage === 'te' ? 'మీ మొబైల్ నంబర్‌కు కొత్త తెలుగు SMS వస్తుంది.' : 'Updated confirmation SMS sent to patient.'}</p>
            <p>• {currentLanguage === 'kn' ? 'ನಿಮ್ಮ ಅಧಿಕೃತ ಹಿತೈಷಿ ರಮೇಶ್‌ಗೂ ಹೊಸ ದಿನಾಂಕದ ಮಾಹಿತಿ ಹೋಗುತ್ತದೆ.' : currentLanguage === 'te' ? 'మీ సంరక్షకుడికి కూడా కొత్త సమాచారం వెళుతుంది.' : 'Caregiver informed of the new date.'}</p>
          </div>

          <div className="pt-4 border-t border-[#BEA06D]/20 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="py-3 px-5 rounded-xl border border-[#BEA06D]/40 text-[#3C3330] hover:bg-[#FCF9F5] font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.reschedule.backBtn}</span>
            </button>

            <button
              onClick={handleConfirmReschedule}
              className="py-4 px-8 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>{t.reschedule.confirmChangeBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Success & Spoken Summary */}
      {currentStep === 5 && selectedSlot && (
        <div className="bg-white border-2 border-emerald-600/40 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-[#3C3330]">
              {t.reschedule.successTitle}
            </h2>
            <p className="text-base text-[#3C3330]/85 max-w-lg mx-auto leading-relaxed">
              {t.reschedule.successMessage}
            </p>
          </div>

          {/* New Appointment Card Highlight */}
          <div className="p-6 rounded-2xl bg-[#FCF9F5] border-2 border-[#BEA06D] max-w-md mx-auto text-left space-y-3 shadow-sm">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn' ? 'ನವೀಕರಿಸಿದ ಸ್ಕ್ಯಾನ್ ವಿವರ' : currentLanguage === 'te' ? 'నవీకరించబడిన స్కాన్ వివరాలు' : 'Updated Scan Details'}
            </span>
            <p className="font-bold text-xl text-[#3C3330]">
              {currentLanguage === 'kn' ? appointment.testNameKannada : currentLanguage === 'te' ? appointment.testNameTelugu : appointment.testName}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <div>
                <span className="text-xs text-gray-500">{t.appointment.dateLabel}:</span>
                <p className="font-bold text-[#3C3330]">{selectedSlot.date}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{t.appointment.timeLabel}:</span>
                <p className="font-bold text-[#8F7242]">{selectedSlot.time}</p>
              </div>
            </div>
          </div>

          {/* Audio Replay Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                const speech =
                  currentLanguage === 'kn'
                    ? `ನಿಮ್ಮ ಹೊಸ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ${selectedSlot.date}, ಸಮಯ ${selectedSlot.time}. ವಿಕ್ಟೋರಿಯಾ ಆಸ್ಪತ್ರೆ ರೇಡಿಯಾಲಜಿ ವಿಭಾಗದಲ್ಲಿ ಹಾಜರಾಗಿ.`
                    : currentLanguage === 'te'
                    ? `మీ కొత్త సిటి స్కాన్ తేదీ ${selectedSlot.date}, సమయం ${selectedSlot.time}. హాస్పిటల్ రేడియాలజీ విభాగానికి చేరుకోండి.`
                    : `Your new appointment is confirmed for ${selectedSlot.date} at ${selectedSlot.time}.`;
                speechService.speak(speech, currentLanguage);
              }}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#BEA06D]/20 hover:bg-[#BEA06D]/30 text-[#8F7242] font-semibold text-sm transition-colors cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{t.reschedule.listenNewSummary}</span>
            </button>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#BEA06D]/20 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onPageChange('appointment')}
              className="py-3.5 px-7 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm shadow cursor-pointer transition-all"
            >
              {currentLanguage === 'kn' ? 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾರ್ಡ್ ನೋಡಿ' : currentLanguage === 'te' ? 'నా అపాయింట్‌మెంట్ కార్డు చూడండి' : 'View Updated Appointment Card'}
            </button>

            <button
              onClick={() => onPageChange('home')}
              className="py-3.5 px-7 rounded-2xl bg-white border border-[#BEA06D]/40 text-[#3C3330] hover:bg-[#FCF9F5] font-semibold text-sm cursor-pointer transition-all"
            >
              {t.reschedule.returnToHomeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
