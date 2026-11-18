import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { Language, PageView } from '../types';
import { COMPANION_PROMPTS } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  MessageCircleHeart,
  X,
  Send,
  Volume2,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  suggestedPage?: PageView;
  suggestedActionLabel?: string;
}

interface CoreCompanionProps {
  language: Language;
  currentPage: PageView;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  onPageChange: (page: PageView) => void;
  onOpenComfortMode: () => void;
  reduceMotion?: boolean;
  resetSignal?: number;
}

export const CoreCompanion: React.FC<CoreCompanionProps> = ({
  language,
  isOpen,
  onToggleOpen,
  onPageChange,
  onOpenComfortMode,
  reduceMotion = false,
  resetSignal = 0,
}) => {
  const getGreeting = (lang: Language): string => {
    if (lang === 'kn') {
      return 'ನಮಸ್ಕಾರ! ನಾನು CORE ಸಹಾಯಕ. ವೆಬ್‌ಸೈಟ್ ಬಳಸಲು, ಭಾಷೆ ಬದಲಾಯಿಸಲು ಅಥವಾ ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ಸಿದ್ಧವಾಗಲು ನಾನು ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.';
    }
    if (lang === 'te') {
      return 'నమస్కారం! నేను CORE సహాయకుడిని. వెబ్‌సైట్ ఉపయోగించడానికి, భాష మార్చడానికి లేదా మీ ఆసుపత్రి సందర్శనకు సిద్ధమవడానికి నేను మీకు సహాయం చేస్తాను.';
    }
    return 'Hello! I am CORE Companion. Ask me how to check your appointment, switch languages, prepare for your visit, or use accessibility tools.';
  };

  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'welcome',
      sender: 'companion',
      text: getGreeting(language),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `welcome-${language}-${resetSignal}`,
        sender: 'companion',
        text: getGreeting(language),
      },
    ]);
  }, [language, resetSignal]);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [messages, isTyping, isOpen, reduceMotion]);

  const matchQueryToResponse = (
    query: string
  ): { text: string; suggestedPage?: PageView; suggestedActionLabel?: string } => {
    const q = query.toLowerCase();

    if (
      q.includes('language') ||
      q.includes('kannada') ||
      q.includes('telugu') ||
      q.includes('ಭಾಷೆ') ||
      q.includes('భాష')
    ) {
      const prompt = COMPANION_PROMPTS.find((p) => p.id === 'change-language')!;
      return { text: prompt.answer[language] };
    }

    if (
      q.includes('bring') ||
      q.includes('document') ||
      q.includes('passport') ||
      q.includes('print') ||
      q.includes('pdf') ||
      q.includes('ತರಬೇಕು') ||
      q.includes('తీసుకురావాలి')
    ) {
      const prompt = COMPANION_PROMPTS.find((p) => p.id === 'what-to-bring')!;
      return {
        text: prompt.answer[language],
        suggestedPage: prompt.suggestedPage,
        suggestedActionLabel: prompt.suggestedActionLabel?.[language],
      };
    }

    if (
      q.includes('caregiver') ||
      q.includes('family') ||
      q.includes('son') ||
      q.includes('carecircle') ||
      q.includes('consent') ||
      q.includes('ಆರೈಕೆದಾರ') ||
      q.includes('సంరక్షకులు')
    ) {
      const prompt = COMPANION_PROMPTS.find((p) => p.id === 'caregiver-help')!;
      return {
        text: prompt.answer[language],
        suggestedPage: prompt.suggestedPage,
        suggestedActionLabel: prompt.suggestedActionLabel?.[language],
      };
    }

    if (
      q.includes('reminder') ||
      q.includes('sms') ||
      q.includes('whatsapp') ||
      q.includes('call') ||
      q.includes('ಜ್ಞಾಪನೆ') ||
      q.includes('రిమైండర్')
    ) {
      const prompt = COMPANION_PROMPTS.find((p) => p.id === 'find-reminders')!;
      return {
        text: prompt.answer[language],
        suggestedPage: prompt.suggestedPage,
        suggestedActionLabel: prompt.suggestedActionLabel?.[language],
      };
    }

    if (
      q.includes('clarity') ||
      q.includes('explain') ||
      q.includes('simple') ||
      q.includes('fast') ||
      q.includes('npo') ||
      q.includes('creatinine') ||
      q.includes('ಸರಳ') ||
      q.includes('వివరణ')
    ) {
      return {
        text:
          language === 'kn'
            ? '"ಸರಳವಾಗಿ ವಿವರಿಸಿ" (Explain It Simply) ಪುಟದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳನ್ನು ಸರಳ ಮತ್ತು ಅತಿ ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಓದಬಹುದು ಹಾಗೂ ಕೇಳಬಹುದು.'
            : language === 'te'
            ? '"సులభంగా వివరించండి" (Explain It Simply) పేజీలో ఆసుపత్రి సూచనలను సులభమైన తెలుగులో చదవవచ్చు మరియు వినవచ్చు.'
            : 'Open "Explain It Simply" to read or listen to common hospital wording in plain, easy-to-follow language.',
        suggestedPage: 'clarity',
        suggestedActionLabel:
          language === 'kn'
            ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ ತೆರೆಯಿರಿ'
            : language === 'te'
            ? 'సులభ వివరణ తెరవండి'
            : 'Open Explain It Simply',
      };
    }

    if (
      q.includes('journey') ||
      q.includes('checklist') ||
      q.includes('before') ||
      q.includes('during') ||
      q.includes('after') ||
      q.includes('ಪಯಣ') ||
      q.includes('ప్రయాణం')
    ) {
      return {
        text:
          language === 'kn'
            ? '"ನನ್ನ ಆರೈಕೆ ಪಯಣ" ಪುಟದಲ್ಲಿ ಭೇಟಿಗೆ ಮುನ್ನ, ಭೇಟಿಯ ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರ ಮಾಡಬೇಕಾದ ಹಂತಗಳ ಪಟ್ಟಿಯನ್ನು ಟಿಕ್ ಮಾಡಬಹುದು.'
            : language === 'te'
            ? '"నా ఆరోగ్య ప్రయాణం" పేజీలో సందర్శనకు ముందు, సమయంలో మరియు తర్వాత చేయవలసిన దశలను టిక్ చేయవచ్చు.'
            : 'Use "My Care Journey" to view Before, During, and After visit steps and check off tasks as you complete them.',
        suggestedPage: 'journey',
        suggestedActionLabel:
          language === 'kn'
            ? 'ನನ್ನ ಆರೈಕೆ ಪಯಣ ನೋಡಿ'
            : language === 'te'
            ? 'నా ఆరోగ్య ప్రయాణం చూడండి'
            : 'Open My Care Journey',
      };
    }

    if (
      q.includes('resched') ||
      q.includes('change date') ||
      q.includes('postpone') ||
      q.includes('slot') ||
      q.includes('ದಿನಾಂಕ') ||
      q.includes('తేదీ')
    ) {
      return {
        text:
          language === 'kn'
            ? 'ಬಸ್ ಅಥವಾ ಆರೋಗ್ಯ ಕಾರಣದಿಂದ ಭೇಟಿ ದಿನಾಂಕ ಬದಲಾಯಿಸಬೇಕಾದರೆ "ದಿನಾಂಕ ಬದಲಿಸಿ" ಪುಟದಲ್ಲಿ ಎರಡೇ ಹಂತಗಳಲ್ಲಿ ಹೊಸ ಸಮಯ ಆರಿಸಬಹುದು.'
            : language === 'te'
            ? 'ప్రయాణ కారణంగా తేదీ మార్చుకోవాలంటే "తేదీ మార్చండి" పేజీలో సులభంగా కొత్త సమయం ఎంచుకోవచ్చు.'
            : 'Need another day? Open "Reschedule" to pick a new morning or afternoon slot in two simple steps.',
        suggestedPage: 'reschedule',
        suggestedActionLabel:
          language === 'kn'
            ? 'ದಿನಾಂಕ ಬದಲಿಸಿ'
            : language === 'te'
            ? 'తేదీ మార్చండి'
            : 'Open Reschedule',
      };
    }

    if (
      q.includes('comfort') ||
      q.includes('text') ||
      q.includes('font') ||
      q.includes('contrast') ||
      q.includes('guided') ||
      q.includes('ಕಂಫರ್ಟ್') ||
      q.includes('అక్షర')
    ) {
      return {
        text:
          language === 'kn'
            ? 'ಅಕ್ಷರ ದೊಡ್ಡದು ಮಾಡಲು, ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಅಥವಾ ಹಿರಿಯರ ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ ಆನ್ ಮಾಡಲು ಮೇಲಿನ "Comfort Mode" ಬಟನ್ ಒತ್ತಿ.'
            : language === 'te'
            ? 'అక్షరాలు పెద్దవి చేయడానికి, హై-కాంట్రాస్ట్ లేదా గైడెడ్ మోడ్ ఆన్ చేయడానికి పైనున్న "Comfort Mode" నొక్కండి.'
            : 'You can enlarge text, switch to High Contrast, reduce animations, or turn on Elderly Guided Mode using Comfort Mode in the top bar.',
      };
    }

    if (
      q.includes('appointment') ||
      q.includes('scan') ||
      q.includes('check') ||
      q.includes('hear') ||
      q.includes('ಅಪಾಯಿಂಟ್') ||
      q.includes('అపాయింట్')
    ) {
      const prompt = COMPANION_PROMPTS.find((p) => p.id === 'check-appointment')!;
      return {
        text: prompt.answer[language],
        suggestedPage: prompt.suggestedPage,
        suggestedActionLabel: prompt.suggestedActionLabel?.[language],
      };
    }

    if (q.includes('help') || q.includes('asha') || q.includes('ಸಹಾಯ') || q.includes('సహాయం')) {
      return {
        text:
          language === 'kn'
            ? 'ಗ್ರಾಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ಆಸ್ಪತ್ರೆ ಸಹಾಯ ಕೇಂದ್ರದ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ "ಸಹಾಯ ಪಡೆಯಿರಿ" ಪುಟವನ್ನು ತೆರೆಯಿರಿ.'
            : language === 'te'
            ? 'గ్రామ ఆశా కార్యకర్త లేదా ఆసుపత్రి హెల్ప్ డెస్క్ మార్గదర్శనం కోసం "సహాయం పొందండి" పేజీని చూడండి.'
            : 'Visit "Get Help" for village ASHA worker support tips, hospital help-desk guidance, and reassuring steps.',
        suggestedPage: 'help',
        suggestedActionLabel:
          language === 'kn'
            ? 'ಸಹಾಯ ಪಡೆಯಿರಿ ಪುಟ'
            : language === 'te'
            ? 'సహాయం పొందండి పేజీ'
            : 'Open Get Help',
      };
    }

    // Gentle fallback
    return {
      text:
        language === 'kn'
          ? 'ನಾನು ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್, ಭಾಷೆ ಬದಲಾವಣೆ, ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್, CareCircle ಅಥವಾ ಜ್ಞಾಪನೆಗಳ ಬಗ್ಗೆ ನೆರವಾಗಬಲ್ಲೆ. ಕೆಳಗಿನ ಯಾವುದಾದರೂ ಪ್ರಶ್ನೆಯನ್ನು ಒತ್ತಿ ಅಥವಾ "ಸಹಾಯ ಪಡೆಯಿರಿ" ನೋಡಿ.'
          : language === 'te'
          ? 'నేను మీ అపాయింట్‌మెంట్, భాష మార్పు, విజిట్ పాస్‌పోర్ట్, CareCircle లేదా రిమైండర్ల గురించి సహాయం చేయగలను. దయచేసి క్రింది ప్రశ్నలలో ఒకదాన్ని ఎంచుకోండి.'
          : 'I can help you navigate My Appointment, Care Journey, Explain It Simply, CareCircle, Visit Passport, or Reminders. Try one of the quick questions below!',
      suggestedPage: 'appointment',
      suggestedActionLabel:
        language === 'kn'
          ? 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನೋಡಿ'
          : language === 'te'
          ? 'నా అపాయింట్‌మెంట్ చూడండి'
          : 'Go to My Appointment',
    };
  };

  const pushInteraction = (
    userText: string,
    matched: { text: string; suggestedPage?: PageView; suggestedActionLabel?: string }
  ) => {
    const userMsg: CompanionMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const delay = reduceMotion ? 40 : 280;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'companion',
          text: matched.text,
          suggestedPage: matched.suggestedPage,
          suggestedActionLabel: matched.suggestedActionLabel,
        },
      ]);
    }, delay);
  };

  const handlePromptClick = (promptId: string) => {
    const found = COMPANION_PROMPTS.find((p) => p.id === promptId);
    if (!found) return;
    pushInteraction(found.question[language], {
      text: found.answer[language],
      suggestedPage: found.suggestedPage,
      suggestedActionLabel: found.suggestedActionLabel?.[language],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputText.trim();
    if (!cleaned) return;
    setInputText('');
    const matched = matchQueryToResponse(cleaned);
    pushInteraction(cleaned, matched);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print flex flex-col items-end gap-3">
      {/* Companion Drawer */}
      {isOpen && (
        <div
          className="w-[calc(100vw-2.5rem)] sm:w-[400px] max-h-[78vh] bg-[#FCF9F5] border-2 border-[#BEA06D] rounded-3xl shadow-2xl overflow-hidden flex flex-col soft-fade-up"
          role="dialog"
          aria-label="CORE Companion"
        >
          {/* Drawer Header */}
          <div className="bg-white border-b border-[#BEA06D]/30 px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#BEA06D] bg-white shrink-0">
                <img
                  src={ASSETS.logoEmblem}
                  alt="CORE"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#3C3330] leading-none flex items-center gap-1.5">
                  <span>
                    {language === 'kn'
                      ? 'CORE ಸಹಾಯಕ'
                      : language === 'te'
                      ? 'CORE సహాయకుడు'
                      : 'CORE Companion'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
                </h3>
                <span className="text-[11px] text-[#8F7242] font-medium block mt-0.5">
                  {language === 'kn'
                    ? 'ಸರಳ ಮಾರ್ಗದರ್ಶನ ಸಹಾಯಕ'
                    : language === 'te'
                    ? 'సులభ మార్గదర్శక సహాయకుడు'
                    : 'Navigation & Visit Guide'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onPageChange('help');
                  onToggleOpen(false);
                }}
                className="compact-chip px-2.5 py-1.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/40 text-[#8F7242] hover:bg-[#BEA06D]/15 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ಸಹಾಯ' : language === 'te' ? 'సహాయం' : 'Get Help'}</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleOpen(false)}
                className="compact-chip p-1.5 rounded-full text-[#3C3330]/70 hover:text-[#3C3330] hover:bg-[#BEA06D]/15 cursor-pointer"
                aria-label="Close Companion"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Boundary Banner */}
          <div className="bg-[#E6C1C4]/25 border-b border-[#E6C1C4]/60 px-4 py-2 flex items-start gap-2 text-[11px] text-[#3C3330]/90">
            <ShieldAlert className="w-4 h-4 text-[#C98897] shrink-0 mt-0.5" />
            <span>
              {language === 'kn'
                ? 'ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ: ರೋಗನಿರ್ಣಯ ಅಥವಾ ಔಷಧಿ ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
                : language === 'te'
                ? 'మార్గదర్శనం కోసం మాత్రమే: వ్యాధి నిర్ధారణ లేదా మందుల సలహా ఇవ్వదు.'
                : 'Navigation guide only — does not diagnose conditions, prescribe medicines, or replace medical staff.'}
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#BEA06D] text-white rounded-br-xs'
                      : 'bg-white border border-[#BEA06D]/30 text-[#3C3330] rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.sender === 'companion' && (
                    <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-[#BEA06D]/15">
                      <button
                        type="button"
                        onClick={() => speechService.speak(msg.text, language)}
                        className="compact-chip px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 text-[11px] font-semibold text-[#8F7242] hover:bg-[#BEA06D]/15 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{language === 'kn' ? 'ಕೇಳಿ' : language === 'te' ? 'వినండి' : 'Listen'}</span>
                      </button>

                      {msg.suggestedPage && (
                        <button
                          type="button"
                          onClick={() => {
                            onPageChange(msg.suggestedPage!);
                            onToggleOpen(false);
                          }}
                          className="compact-chip px-3 py-1 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{msg.suggestedActionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start">
                <div className="bg-white border border-[#BEA06D]/30 rounded-2xl px-4 py-2.5 text-xs text-[#8F7242] flex items-center gap-1.5">
                  <span className={reduceMotion ? '' : 'animate-pulse'}>•</span>
                  <span className={reduceMotion ? '' : 'animate-pulse'}>•</span>
                  <span className={reduceMotion ? '' : 'animate-pulse'}>•</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-white border-t border-[#BEA06D]/25 px-4 pt-3 pb-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider">
                {language === 'kn'
                  ? 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು'
                  : language === 'te'
                  ? 'త్వరిత ప్రశ్నలు'
                  : 'Quick Questions'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onOpenComfortMode();
                  onToggleOpen(false);
                }}
                className="compact-chip text-[11px] font-semibold text-[#8F7242] underline hover:text-[#3C3330] cursor-pointer"
              >
                {language === 'kn' ? 'ಕಂಫರ್ಟ್ ಮೋಡ್' : language === 'te' ? 'కంఫర్ట్ మోడ్' : 'Comfort Mode'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMPANION_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handlePromptClick(prompt.id)}
                  className="compact-chip text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/35 text-[#3C3330] font-medium transition-colors cursor-pointer"
                >
                  {prompt.question[language]}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-t border-[#BEA06D]/20 p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'kn'
                  ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...'
                  : language === 'te'
                  ? 'మీ ప్రశ్నను టైప్ చేయండి...'
                  : 'Ask how to navigate CORE...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-xs sm:text-sm text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />
            <button
              type="submit"
              className="compact-chip p-2.5 rounded-xl bg-[#BEA06D] hover:bg-[#8F7242] text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Minimal Trigger Button */}
      <button
        type="button"
        onClick={() => onToggleOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-bold py-3 px-5 rounded-full shadow-xl shadow-[#BEA06D]/40 border-2 border-white/85 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
        aria-label={
          language === 'kn'
            ? 'CORE ಸಹಾಯಕ ತೆರೆಯಿರಿ'
            : language === 'te'
            ? 'CORE సహాయకుడిని తెరవండి'
            : 'Open CORE Companion'
        }
      >
        <MessageCircleHeart className="w-5 h-5 text-white shrink-0" />
        <span className="text-xs sm:text-sm font-semibold">
          {language === 'kn'
            ? 'CORE ಸಹಾಯಕ'
            : language === 'te'
            ? 'CORE సహాయకుడు'
            : 'CORE Companion'}
        </span>
      </button>
    </div>
  );
};
