import React, { useState } from 'react';
import { Play, Pause, CheckCheck, Calendar, Clock, MapPin, X } from 'lucide-react';
import { Appointment, Language } from '../types';
import { speechService } from '../utils/speech';

interface WhatsAppSimulatorProps {
  appointment: Appointment;
  language: Language;
  onClose: () => void;
  onConfirmAttendance: () => void;
  onRequestReschedule: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  appointment,
  language,
  onClose,
  onConfirmAttendance,
  onRequestReschedule,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getAudioText = () => {
    if (language === 'kn') {
      return `ನಮಸ್ಕಾರ ಬಸಪ್ಪನವರೇ, ವಿಕ್ಟೋರಿಯಾ ಆಸ್ಪತ್ರೆಯಿಂದ ನಿಮ್ಮ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ನವೆಂಬರ್ ೧೨, ಗುರುವಾರ ಬೆಳಗ್ಗೆ ೧೦:೩೦ಕ್ಕೆ ನಿಗದಿಯಾಗಿದೆ. ಪರೀಕ್ಷೆಗೆ ೪ ಗಂಟೆ ಮುನ್ನ ಊಟ ಮಾಡಬಾರದು. ನೀವು ಹಾಜರಾಗುವುದನ್ನು ತಿಳಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ.`;
    } else if (language === 'te') {
      return `నమస్కారం వెంకటప్ప గారూ, విక్టోరియా హాస్పిటల్ నుండి మీ సిటి స్కాన్ తేదీ నవంబర్ 12, గురువారం ఉదయం 10:30కి నిర్ణయించబడింది. 4 గంటల ముందు ఏమీ తినకూడదు. మీ రాకను నిర్ధారించడానికి క్రింది బటన్ నొక్కండి.`;
    } else {
      return `Hello Basappa Gowda. Your CT scan at Victoria District Hospital is scheduled for Thursday, Nov 12 at 10:30 AM. Fasting 4 hours required. Please tap below to confirm.`;
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speechService.speak(getAudioText(), language, {
        onEnd: () => setIsPlayingAudio(false),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0B141B] text-white rounded-[32px] shadow-2xl border-2 border-emerald-600/40 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* WhatsApp Top Header */}
        <div className="bg-[#1F2C34] px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              CORE
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Victoria Hospital Alerts</h4>
              <span className="text-[10px] text-emerald-400">Official Healthcare Account ✓</span>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#0B141B] text-xs">
          <div className="text-center">
            <span className="px-2.5 py-1 bg-[#182229] rounded-md text-[10px] text-gray-400">
              TODAY
            </span>
          </div>

          {/* Voice Note Bubble */}
          <div className="bg-[#005C4B] text-white p-3 rounded-2xl rounded-tl-none max-w-[90%] shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAudio}
                className="w-10 h-10 rounded-full bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-[#005C4B] flex items-center justify-center shadow shrink-0 cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1 h-4">
                  <span className={`w-1 bg-white/80 rounded-full ${isPlayingAudio ? 'wave-bar' : 'h-3'}`} />
                  <span className={`w-1 bg-white/80 rounded-full ${isPlayingAudio ? 'wave-bar' : 'h-2'}`} />
                  <span className={`w-1 bg-white/80 rounded-full ${isPlayingAudio ? 'wave-bar' : 'h-4'}`} />
                  <span className={`w-1 bg-white/80 rounded-full ${isPlayingAudio ? 'wave-bar' : 'h-3'}`} />
                  <span className={`w-1 bg-white/80 rounded-full ${isPlayingAudio ? 'wave-bar' : 'h-2'}`} />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-100">
                  <span>{isPlayingAudio ? 'Playing...' : 'Voice Note (0:18)'}</span>
                  <span className="flex items-center gap-0.5">
                    10:30 AM <CheckCheck className="w-3 h-3 text-cyan-300" />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-emerald-100 italic border-t border-emerald-400/20 pt-1.5">
              {language === 'kn' ? '👆 ಧ್ವನಿ ಸಂದೇಶ ಆಲಿಸಲು ಪ್ಲೇ ಬಟನ್ ಒತ್ತಿ' : language === 'te' ? '👆 ఆడియో వినడానికి ప్లే బటన్ నొక్కండి' : '👆 Tap play to hear appointment details'}
            </p>
          </div>

          {/* Visual Appointment Card Bubble */}
          <div className="bg-[#1F2C34] text-white p-3.5 rounded-2xl rounded-tl-none max-w-[95%] shadow border border-white/5 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>{appointment.testName}</span>
            </div>

            <div className="space-y-1 text-xs text-gray-200">
              <p className="font-semibold text-white text-sm">
                {language === 'kn' ? appointment.patientNameKannada : language === 'te' ? appointment.patientNameTelugu : appointment.patientName}
              </p>
              <p className="flex items-center gap-1.5 text-gray-300">
                <Clock className="w-3.5 h-3.5 text-[#BEA06D]" />
                <span>{appointment.date} ({appointment.dayOfWeek}) · {appointment.time}</span>
              </p>
              <p className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{appointment.roomNumber}</span>
              </p>
            </div>

            <div className="p-2 bg-black/30 rounded-lg text-[11px] text-amber-200 border border-amber-500/20">
              ⚠️ {appointment.preparationInstructions[language][0]}
            </div>

            {/* Quick Action Buttons inside message */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onConfirmAttendance();
                  onClose();
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-white text-xs cursor-pointer shadow"
              >
                {language === 'kn' ? '✓ ನಾನು ಹಾಜರಾಗುತ್ತೇನೆ' : language === 'te' ? '✓ నేను హాజరవుతాను' : '✓ I Will Attend'}
              </button>
              <button
                onClick={() => {
                  onRequestReschedule();
                  onClose();
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-gray-200 text-xs cursor-pointer"
              >
                {language === 'kn' ? 'ದಿನಾಂಕ ಬದಲಾವಣೆ ಮಾಡಿ' : language === 'te' ? 'తేదీ మార్చండి' : 'Reschedule Appointment'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1F2C34] text-center border-t border-white/10">
          <p className="text-[10px] text-gray-400">
            {language === 'kn'
              ? 'ಆಸ್ಪತ್ರೆಯ ವಾಟ್ಸಾಪ್ ನೋಟಿಫಿಕೇಶನ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ'
              : language === 'te'
              ? 'హాస్పిటల్ వాట్సాప్ నోటిఫికేషన్ డెమో'
              : 'Simulated WhatsApp notification preview'}
          </p>
        </div>
      </div>
    </div>
  );
};
