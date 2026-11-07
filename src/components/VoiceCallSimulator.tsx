import React, { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, Mic, Volume2, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { Language, Appointment } from '../types';
import { speechService } from '../utils/speech';

interface VoiceCallSimulatorProps {
  appointment: Appointment;
  language: Language;
  onConfirmAttendance: () => void;
  onRequestReschedule: () => void;
  onClose: () => void;
}

export const VoiceCallSimulator: React.FC<VoiceCallSimulatorProps> = ({
  appointment,
  language,
  onConfirmAttendance,
  onRequestReschedule,
  onClose,
}) => {
  const [callState, setCallState] = useState<'ringing' | 'active' | 'confirmed' | 'rescheduled' | 'ended'>('ringing');
  const [keypadPressed, setKeypadPressed] = useState<number | null>(null);

  const getCallScript = () => {
    if (language === 'kn') {
      return `ನಮಸ್ಕಾರ ${appointment.patientNameKannada} ರವರೇ. ಇದು ${appointment.hospitalNameKannada} ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ವಿಭಾಗದಿಂದ ಸ್ವಯಂಚಾಲಿತ ಕರೆ. ನಿಮ್ಮ ಹೊಟ್ಟೆಯ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ನವೆಂಬರ್ ೧೨, ಗುರುವಾರ ಬೆಳಗ್ಗೆ ೧೦ ಗಂಟೆ ೩೦ ನಿಮಿಷಕ್ಕೆ ನಿಗದಿಯಾಗಿದೆ. ನೀವು ಹಾಜರಾಗುವುದಾದರೆ ಫೋನ್‌ನಲ್ಲಿ ಒಂದು ಒತ್ತಿರಿ. ದಿನಾಂಕ ಬದಲಾಯಿಸಬೇಕಾದರೆ ಎರಡು ಒತ್ತಿರಿ.`;
    } else if (language === 'te') {
      return `నమస్కారం ${appointment.patientNameTelugu} గారూ. ఇది ${appointment.hospitalNameTelugu} సిటి స్కాన్ విభాగం నుండి ఆటోమేటిక్ కాల్. మీ పొట్ట సిటి స్కాన్ తేదీ నవంబర్ 12, గురువారం ఉదయం 10 గంటల 30 నిమిషాలకు నిర్ణయించబడింది. మీరు ఖచ్చితంగా హాజరవుతారంటే దయచేసి 1 నొక్కండి. తేదీ మార్చుకోవాలనుకుంటే 2 నొక్కండి.`;
    } else {
      return `Hello ${appointment.patientName}. This is an automated reminder call from ${appointment.hospitalName} Radiology Department. Your Abdominal CT scan is scheduled for Thursday, November 12th at 10:30 AM. Press 1 to confirm your attendance. Press 2 to request rescheduling.`;
    }
  };

  const handleAnswer = () => {
    setCallState('active');
    const script = getCallScript();
    speechService.speak(script, language, {
      onEnd: () => {
        // finished reading IVR
      },
    });
  };

  const handleKeyPress = (digit: number) => {
    setKeypadPressed(digit);
    speechService.stop();

    if (digit === 1) {
      setCallState('confirmed');
      const confirmSpeech =
        language === 'kn'
          ? 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಹಾಜರಾತಿಯನ್ನು ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಿಸಲಾಗಿದೆ. ಪರೀಕ್ಷೆಗೆ ೪ ಗಂಟೆ ಮುಂಚೆ ಊಟ ಮಾಡಬೇಡಿ.'
          : language === 'te'
          ? 'ధన్యవాదాలు. మీ రాక హాస్పిటల్‌కు నమోదు చేయబడింది. స్కాన్‌కు 4 గంటల ముందు ఏమీ తినవద్దు.'
          : 'Thank you. Your attendance has been confirmed. Please remember 4 hours fasting before your scan.';
      speechService.speak(confirmSpeech, language);
      onConfirmAttendance();
    } else if (digit === 2) {
      setCallState('rescheduled');
      const rescheduleSpeech =
        language === 'kn'
          ? 'ಸರಿ, ನಿಮ್ಮ ದಿನಾಂಕ ಬದಲಾವಣೆ ವಿನಂತಿಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ನಮ್ಮ ಸಿಬ್ಬಂದಿ ಅಥವಾ ಮೊಬೈಲ್ ಮೂಲಕ ಹೊಸ ದಿನಾಂಕ ಆರಿಸಿ.'
          : language === 'te'
          ? 'సరే, మీ తేదీ మార్పు అభ్యర్థన నమోదు చేయబడింది. దయచేసి కొత్త తేదీని ఎంచుకోండి.'
          : 'Understood. Your reschedule request has been registered. Redirecting to select a new slot.';
      speechService.speak(rescheduleSpeech, language);
      setTimeout(() => {
        onRequestReschedule();
      }, 2500);
    }
  };

  const handleHangup = () => {
    speechService.stop();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#211B19] text-white rounded-[36px] shadow-2xl border-4 border-[#BEA06D]/50 overflow-hidden flex flex-col justify-between p-6 min-h-[580px] animate-in zoom-in-95">
        {/* Top Phone Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-[#BEA06D]/20 border border-[#BEA06D] mx-auto flex items-center justify-center mb-3">
            <PhoneCall className="w-8 h-8 text-[#BEA06D] animate-bounce" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#BEA06D] font-semibold">
            {language === 'kn' ? 'ಆಸ್ಪತ್ರೆಯ ಒಳಬರುವ ಧ್ವನಿ ಕರೆ' : language === 'te' ? 'హాస్పిటల్ ఇన్‌కమింగ్ కాల్' : 'Incoming Hospital IVR Call'}
          </span>
          <h3 className="text-xl font-bold mt-1 text-white">
            {appointment.hospitalName}
          </h3>
          <p className="text-xs text-gray-300 mt-0.5">
            1800-425-CORE · CT & Radiology Desk
          </p>
        </div>

        {/* State Content */}
        {callState === 'ringing' && (
          <div className="text-center my-auto py-6">
            <p className="text-base text-gray-200 font-medium mb-2">
              {language === 'kn'
                ? 'ಕನ್ನಡದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಜ್ಞಾಪನೆ ಕರೆ ಬರುತ್ತಿದೆ...'
                : language === 'te'
                ? 'తెలుగులో హాస్పిటల్ రిమైండర్ కాల్ వస్తోంది...'
                : 'Hospital voice reminder call ringing in selected language...'}
            </p>
            <span className="inline-block px-3 py-1 bg-[#A2B29B]/30 text-[#A2B29B] text-xs rounded-full">
              {language === 'kn' ? 'ಗ್ರಾಮೀಣ ಹಿರಿಯರಿಗೆ ಓದುವ ಅಗತ್ಯವಿಲ್ಲ' : language === 'te' ? 'చదవాల్సిన అవసరం లేదు' : 'No Reading Required'}
            </span>
          </div>
        )}

        {callState === 'active' && (
          <div className="text-center my-auto py-4 bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-1.5 h-6 mb-3">
              <span className="w-1.5 bg-[#BEA06D] rounded-full wave-bar h-2" />
              <span className="w-1.5 bg-[#BEA06D] rounded-full wave-bar h-5" />
              <span className="w-1.5 bg-[#BEA06D] rounded-full wave-bar h-6" />
              <span className="w-1.5 bg-[#BEA06D] rounded-full wave-bar h-3" />
            </div>

            <p className="text-sm text-gray-200 leading-relaxed font-medium mb-4">
              "{getCallScript()}"
            </p>

            {/* Interactive Keypad */}
            <div className="pt-2">
              <span className="text-xs text-[#BEA06D] font-bold block mb-2">
                {language === 'kn' ? 'ದಯವಿಟ್ಟು ಬಟನ್ ಒತ್ತಿ:' : language === 'te' ? 'దయచేసి కీ నొక్కండి:' : 'Press Keypad Button:'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleKeyPress(1)}
                  className="py-3 px-2 bg-emerald-700/80 hover:bg-emerald-600 active:scale-95 text-white rounded-xl font-bold text-sm border border-emerald-400 flex flex-col items-center justify-center transition-all cursor-pointer"
                >
                  <span className="text-2xl font-mono">1</span>
                  <span className="text-[11px] font-normal mt-0.5">
                    {language === 'kn' ? 'ಹಾಜರಾಗುತ್ತೇನೆ' : language === 'te' ? 'హాజరవుతాను' : 'I Will Attend'}
                  </span>
                </button>

                <button
                  onClick={() => handleKeyPress(2)}
                  className="py-3 px-2 bg-amber-700/80 hover:bg-amber-600 active:scale-95 text-white rounded-xl font-bold text-sm border border-amber-400 flex flex-col items-center justify-center transition-all cursor-pointer"
                >
                  <span className="text-2xl font-mono">2</span>
                  <span className="text-[11px] font-normal mt-0.5">
                    {language === 'kn' ? 'ದಿನಾಂಕ ಬದಲಾವಣೆ' : language === 'te' ? 'తేదీ మార్చాలి' : 'Reschedule'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {callState === 'confirmed' && (
          <div className="text-center my-auto py-4 bg-emerald-950/60 rounded-2xl p-5 border border-emerald-500/40">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-white">
              {language === 'kn' ? 'ಹಾಜರಾತಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ!' : language === 'te' ? 'హాజరు ఖరారైంది!' : 'Attendance Confirmed!'}
            </h4>
            <p className="text-xs text-emerald-200 mt-1">
              {language === 'kn'
                ? 'ಕೀಪ್ಯಾಡ್‌ನಲ್ಲಿ ೧ ಒತ್ತಿ ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಖಚಿತಪಡಿಸಿದ್ದೀರಿ.'
                : language === 'te'
                ? 'కీప్యాడ్‌లో 1 నొక్కి మీరు హాజరును నిర్ధారించారు.'
                : 'Keypad response "1" received and recorded in hospital system.'}
            </p>
          </div>
        )}

        {callState === 'rescheduled' && (
          <div className="text-center my-auto py-4 bg-amber-950/60 rounded-2xl p-5 border border-amber-500/40">
            <Calendar className="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-white">
              {language === 'kn' ? 'ದಿನಾಂಕ ಬದಲಾವಣೆ ವಿನಂತಿ ದಾಖಲಾಗಿದೆ' : language === 'te' ? 'తేదీ మార్పు నమోదు చేయబడింది' : 'Reschedule Logged'}
            </h4>
            <p className="text-xs text-amber-200 mt-1">
              {language === 'kn'
                ? 'ಹೊಸ ದಿನಾಂಕ ಆರಿಸಲು ಸ್ಕ್ರೀನ್‌ಗೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...'
                : language === 'te'
                ? 'కొత్త తేదీ ఎంచుకోవడానికి రీడైరెక్ట్ అవుతోంది...'
                : 'Redirecting to available slot picker...'}
            </p>
          </div>
        )}

        {/* Bottom Call Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-around">
          {callState === 'ringing' ? (
            <>
              <button
                onClick={handleHangup}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 flex items-center justify-center text-white shadow-lg shadow-red-600/40 transition-all cursor-pointer"
                title="Decline"
                aria-label="Decline Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 flex items-center justify-center text-white shadow-lg shadow-emerald-600/40 transition-all animate-pulse cursor-pointer"
                title="Answer Call"
                aria-label="Answer Call"
              >
                <Phone className="w-7 h-7" />
              </button>
            </>
          ) : (
            <button
              onClick={handleHangup}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <PhoneOff className="w-5 h-5" />
              <span>{language === 'kn' ? 'ಕರೆ ಮುಕ್ತಾಯಗೊಳಿಸಿ' : language === 'te' ? 'కాల్ ముగించండి' : 'End Call'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
