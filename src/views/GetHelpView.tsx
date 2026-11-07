import React, { useState } from 'react';
import { Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speechService } from '../utils/speech';
import {
  Phone,
  PhoneCall,
  HeartHandshake,
  HelpCircle,
  Volume2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface GetHelpViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
}

export const GetHelpView: React.FC<GetHelpViewProps> = ({
  currentLanguage,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [simulatedCalling, setSimulatedCalling] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSpeakFaq = (q: string, a: string) => {
    speechService.speak(`${q}. ${a}`, currentLanguage);
  };

  const handleHelplineCall = () => {
    setSimulatedCalling(true);
    const speech =
      currentLanguage === 'kn'
        ? 'ನಮಸ್ಕಾರ, CORE ರೋಗಿ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರಕ್ಕೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ, ಪರೀಕ್ಷಾ ನಿಯಮಗಳು ಅಥವಾ ತಲುಪುವ ಮಾರ್ಗದ ಬಗ್ಗೆ ನಿಮ್ಮ ಗ್ರಾಮದ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಹಾಗೂ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯ ನೆರವು ಲಭ್ಯವಿದೆ.'
        : currentLanguage === 'te'
        ? 'నమస్కారం, CORE రోగి మార్గదర్శక కేంద్రానికి స్వాగతం. మీ స్కాన్ తేదీ, నిబంధనలు లేదా హాస్పిటల్ మార్గం గురించి మీ గ్రామ ఆశా కార్యకర్త మరియు సిబ్బంది సహాయం అందుబాటులో ఉంది.'
        : 'Welcome to the CORE Patient Guidance Center. You can receive guidance regarding scan dates, fasting rules, or hospital directions through village ASHA workers and staff.';
    speechService.speak(speech, currentLanguage, {
      onEnd: () => setSimulatedCalling(false),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          {currentLanguage === 'kn' ? 'ಸಹಾಯ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ' : currentLanguage === 'te' ? 'సహాయం మరియు మద్దతు' : 'Patient Support'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
          {t.help.title}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {t.help.subtitle}
        </p>
      </div>

      {/* Primary Patient Guidance Center Banner */}
      <div className="bg-gradient-to-r from-[#FCF9F5] via-white to-[#FCF9F5] border-2 border-[#BEA06D] rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {t.help.tollFreeCardTitle}
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330] flex items-center justify-center sm:justify-start gap-3">
              <HeartHandshake className="w-8 h-8 text-[#A2B29B]" />
              <span>{t.help.tollFreeNumber}</span>
            </p>
            <p className="text-xs text-[#3C3330]/75 flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="w-4 h-4 text-[#BEA06D]" />
              <span>{t.help.tollFreeHours}</span>
            </p>
          </div>

          <button
            onClick={handleHelplineCall}
            className="py-4 px-8 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-bold text-base shadow-lg shadow-[#BEA06D]/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            <span>{simulatedCalling ? (currentLanguage === 'kn' ? 'ಆಲಿಸುತ್ತಿದ್ದೀರಿ...' : currentLanguage === 'te' ? 'వింటున్నారు...' : 'Playing Guidance...') : t.help.callNowBtn}</span>
          </button>
        </div>
      </div>

      {/* Village ASHA Healthcare Worker Assistance Card */}
      <div className="bg-white border border-[#BEA06D]/30 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-[#E6C1C4]/40 border border-[#E6C1C4] flex items-center justify-center text-[#C98897] shrink-0">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="font-display text-2xl font-bold text-[#3C3330]">
            {t.help.ashaCardTitle}
          </h3>
          <p className="text-sm text-[#3C3330]/80 leading-relaxed">
            {t.help.ashaCardDesc}
          </p>
          <div className="pt-2 text-xs text-[#8F7242] font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>
              {currentLanguage === 'kn'
                ? 'ನಿಮ್ಮ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ (PHC) ಸಂಪರ್ಕಿಸಿ.'
                : currentLanguage === 'te'
                ? 'మీ గ్రామ పంచాయతీ ప్రాథమిక ఆరోగ్య కేంద్రంలో (PHC) సంప్రదించండి.'
                : 'Coordinated via your Gram Panchayat Primary Health Center (PHC).'}
            </span>
          </div>
        </div>
      </div>

      {/* Voice-Guided FAQs Accordion */}
      <div className="space-y-4">
        <h3 className="font-display text-2xl font-bold text-[#3C3330]">
          {t.help.faqsTitle}
        </h3>

        <div className="space-y-3">
          {t.help.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#BEA06D]/30 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <div
                  onClick={() => toggleFaq(index)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FCF9F5] transition-colors"
                >
                  <span className="font-bold text-base text-[#3C3330] leading-snug">
                    {faq.q}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakFaq(faq.q, faq.a);
                      }}
                      className="p-2 rounded-full bg-[#BEA06D]/15 text-[#8F7242] hover:bg-[#BEA06D]/30"
                      title="Read FAQ aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#8F7242]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#3C3330]/85 leading-relaxed border-t border-[#BEA06D]/15 bg-[#FCF9F5]/40 animate-in fade-in-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
