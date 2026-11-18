import React, { useState, useEffect, useRef } from 'react';
import { Appointment, Language, PageView } from '../types';
import { CLARITY_EXAMPLES } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  Send,
  Info,
  ShieldAlert,
  Sparkles,
  Languages
} from 'lucide-react';

interface VoiceBridgeViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onLanguageChange: (lang: Language) => void;
  onPageChange: (page: PageView) => void;
  reduceMotion?: boolean;
}

interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'bridge';
  text: string;
  suggestedPage?: PageView;
  suggestedLabel?: string;
}

export const VoiceBridgeView: React.FC<VoiceBridgeViewProps> = ({
  currentLanguage,
  appointment,
  onLanguageChange,
  onPageChange,
  reduceMotion = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [lastSpokenInstruction, setLastSpokenInstruction] = useState<string>('');
  const [availableVoiceSummary, setAvailableVoiceSummary] = useState<{
    hasSpeechRecognition: boolean;
    hasNativeVoiceForLang: boolean;
  }>({
    hasSpeechRecognition: false,
    hasNativeVoiceForLang: false,
  });

  const recognitionRef = useRef<any>(null);

  const getInitialGreeting = (lang: Language) => {
    if (lang === 'kn') {
      return `ನಮಸ್ಕಾರ ${appointment.patientNameKannada} ರವರೇ. CORE VoiceBridge ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್, ಭಾಷೆ ಬದಲಾವಣೆ ಅಥವಾ ಸರಳ ವಿವರಣೆಗಾಗಿ ಕೆಳಗಿನ ಮೈಕ್ ಅಥವಾ ಬಟನ್ ಬಳಸಿ.`;
    }
    if (lang === 'te') {
      return `నమస్కారం ${appointment.patientNameTelugu} గారూ. CORE VoiceBridge కి స్వాగతం. మీ అపాయింట్‌మెంట్ వివరాలు, భాష మార్పు లేదా సులభ వివరణ కోసం మైక్ లేదా బటన్లను ఉపయోగించండి.`;
    }
    return `Welcome to CORE VoiceBridge, ${appointment.patientName}. Use the microphone if supported, or tap a voice command below to navigate, switch languages, or hear simpler explanations.`;
  };

  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    {
      id: 'vb-init',
      speaker: 'bridge',
      text: getInitialGreeting(currentLanguage),
    },
  ]);

  useEffect(() => {
    const win = window as any;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    const checkVoices = () => {
      const voices = speechService.getVoices();
      const langPrefix = currentLanguage;
      const hasNative = voices.some((v) =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );
      setAvailableVoiceSummary({
        hasSpeechRecognition: Boolean(SpeechRec),
        hasNativeVoiceForLang: hasNative,
      });
    };

    checkVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup error
        }
      }
      speechService.stop();
    };
  }, [currentLanguage]);

  const speakAndAppend = (
    text: string,
    lang: Language,
    suggestedPage?: PageView,
    suggestedLabel?: string
  ) => {
    setLastSpokenInstruction(text);
    setTranscript((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        speaker: 'bridge',
        text,
        suggestedPage,
        suggestedLabel,
      },
    ]);
    speechService.speak(text, lang);
  };

  const processCommand = (rawQuery: string) => {
    const cleaned = rawQuery.trim();
    if (!cleaned) return;

    setTranscript((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, speaker: 'user', text: cleaned },
    ]);

    const q = cleaned.toLowerCase();

    // Language switching commands
    if (q.includes('kannada') || q.includes('ಕನ್ನಡ') || q.includes('కన్నడ')) {
      onLanguageChange('kn');
      speakAndAppend(
        'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ' +
          appointment.date +
          ', ಸಮಯ ' +
          appointment.time +
          '.',
        'kn',
        'appointment',
        'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನೋಡಿ'
      );
      return;
    }

    if (q.includes('telugu') || q.includes('తెలుగు') || q.includes('ತೆಲುಗು')) {
      onLanguageChange('te');
      speakAndAppend(
        'భాషను తెలుగులోకి మార్చడం జరిగింది. మీ అపాయింట్‌మెంట్ తేదీ ' +
          appointment.date +
          ', సమయం ' +
          appointment.time +
          '.',
        'te',
        'appointment',
        'నా అపాయింట్‌మెంట్ చూడండి'
      );
      return;
    }

    if (q.includes('english') || q.includes('ಇಂಗ್ಲಿಷ್') || q.includes('ఇంగ్లీష్')) {
      onLanguageChange('en');
      speakAndAppend(
        `Switched to English. Your sample appointment is on ${appointment.date} at ${appointment.time} in ${appointment.roomNumber}.`,
        'en',
        'appointment',
        'Open My Appointment'
      );
      return;
    }

    // Repeat command
    if (q.includes('repeat') || q.includes('again') || q.includes('ಮತ್ತೆ') || q.includes('మళ్ళీ')) {
      const toRepeat = lastSpokenInstruction || getInitialGreeting(currentLanguage);
      speakAndAppend(toRepeat, currentLanguage);
      return;
    }

    // Simpler explanation command
    if (q.includes('simple') || q.includes('explain') || q.includes('fast') || q.includes('ಸರಳ') || q.includes('సులభ')) {
      const simpleNote = CLARITY_EXAMPLES[0].extraSimple[currentLanguage];
      speakAndAppend(
        simpleNote,
        currentLanguage,
        'clarity',
        currentLanguage === 'kn'
          ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ ತೆರೆಯಿರಿ'
          : currentLanguage === 'te'
          ? 'సులభ వివరణ తెరవండి'
          : 'Open Explain It Simply'
      );
      return;
    }

    // Reschedule
    if (q.includes('resched') || q.includes('change date') || q.includes('ದಿನಾಂಕ ಬದಲಿಸಿ') || q.includes('తేదీ మార్చ')) {
      const msg =
        currentLanguage === 'kn'
          ? 'ದಿನಾಂಕ ಬದಲಾವಣೆ ಪುಟಕ್ಕೆ ಹೋಗಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ. ಅಲ್ಲಿ ಬೆಳಗ್ಗೆ ಅಥವಾ ಮಧ್ಯಾಹ್ನದ ಸಮಯ ಆರಿಸಬಹುದು.'
          : currentLanguage === 'te'
          ? 'తేదీ మార్చడానికి క్రింది బటన్ నొక్కండి. ఉదయం లేదా మధ్యాహ్నం సమయం ఎంచుకోవచ్చు.'
          : 'Use the button below to open Reschedule and select a new morning or afternoon slot.';
      speakAndAppend(
        msg,
        currentLanguage,
        'reschedule',
        currentLanguage === 'kn' ? 'ದಿನಾಂಕ ಬದಲಿಸಿ' : currentLanguage === 'te' ? 'తేదీ మార్చండి' : 'Open Reschedule'
      );
      return;
    }

    // Visit Passport / Documents
    if (q.includes('passport') || q.includes('document') || q.includes('bring') || q.includes('ಪಾಸ್') || q.includes('పాస్')) {
      const msg =
        currentLanguage === 'kn'
          ? 'ನಿಮ್ಮ ಗುರುತಿನ ಚೀಟಿ, ವೈದ್ಯರ ಚೀಟಿ ಮತ್ತು ಕ್ರಿಯೇಟಿನಿನ್ ವರದಿಯನ್ನು ತನ್ನಿ. ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಪುಟದಲ್ಲಿ ಪ್ರಿಂಟ್ ಮಾಡಬಹುದು.'
          : currentLanguage === 'te'
          ? 'మీ గుర్తింపు కార్డు, డాక్టర్ చీటీ మరియు క్రియాటినిన్ రిపోర్ట్ తీసుకురండి. విజిట్ పాస్‌పోర్ట్ పేజీలో ప్రింట్ చేయవచ్చు.'
          : 'Bring your ID card, doctor referral slip, and Creatinine report. Open My Visit Passport to print a summary card.';
      speakAndAppend(
        msg,
        currentLanguage,
        'passport',
        currentLanguage === 'kn' ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್' : currentLanguage === 'te' ? 'నా విజిట్ పాస్‌పోర్ట్' : 'Open Visit Passport'
      );
      return;
    }

    // Appointment details / navigation
    if (
      q.includes('appointment') ||
      q.includes('when') ||
      q.includes('room') ||
      q.includes('where') ||
      q.includes('ಅಪಾಯಿಂಟ್') ||
      q.includes('అపాయింట్')
    ) {
      const msg =
        currentLanguage === 'kn'
          ? `ನಿಮ್ಮ ಪರೀಕ್ಷೆ: ${appointment.testNameKannada}. ದಿನಾಂಕ: ${appointment.date}, ${appointment.time}. ಸ್ಥಳ: ${appointment.roomNumber}. ${appointment.directions.kn}`
          : currentLanguage === 'te'
          ? `మీ పరీక్ష: ${appointment.testNameTelugu}. తేదీ: ${appointment.date}, ${appointment.time}. గది: ${appointment.roomNumber}. ${appointment.directions.te}`
          : `Your appointment for ${appointment.testName} is on ${appointment.date} at ${appointment.time}, in ${appointment.roomNumber}. ${appointment.directions.en}`;
      speakAndAppend(
        msg,
        currentLanguage,
        'appointment',
        currentLanguage === 'kn' ? 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್' : currentLanguage === 'te' ? 'నా అపాయింట్‌మెంట్' : 'Open My Appointment'
      );
      return;
    }

    // CareFlow / help
    if (q.includes('help') || q.includes('lost') || q.includes('careflow') || q.includes('ಸಹಾಯ') || q.includes('సహాయం')) {
      const msg =
        currentLanguage === 'kn'
          ? 'ನಿರ್ಧಾರ ಮಾರ್ಗದರ್ಶಿಗಾಗಿ CareFlow ಅಥವಾ ಆಶಾ ಸಹಾಯಕ್ಕಾಗಿ "ಸಹಾಯ ಪಡೆಯಿರಿ" ಪುಟವನ್ನು ತೆರೆಯಬಹುದು.'
          : currentLanguage === 'te'
          ? 'సరైన దారి తెలుసుకోవడానికి CareFlow లేదా ఆశా సహాయం కోసం "సహాయం పొందండి" తెరవవచ్చు.'
          : 'You can open CareFlow for step-by-step problem solving or Get Help for ASHA and hospital desk guidance.';
      speakAndAppend(
        msg,
        currentLanguage,
        'careflow',
        currentLanguage === 'kn' ? 'CareFlow ತೆರೆಯಿರಿ' : currentLanguage === 'te' ? 'CareFlow తెరవండి' : 'Open CareFlow'
      );
      return;
    }

    // Default navigation helper
    const fallback =
      currentLanguage === 'kn'
        ? 'ನಾನು ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಸಮಯ, ಸರಳ ವಿವರಣೆ, ದಿನಾಂಕ ಬದಲಾವಣೆ, ಪಾಸ್‌ಪೋರ್ಟ್ ಅಥವಾ ಭಾಷೆ ಬದಲಾವಣೆಯಲ್ಲಿ ನೆರವಾಗುತ್ತೇನೆ.'
        : currentLanguage === 'te'
        ? 'నేను అపాయింట్‌మెంట్ సమయం, సులభ వివరణ, తేదీ మార్పు, పాస్‌పోర్ట్ లేదా భాష మార్చడంలో సహాయం చేయగలను.'
        : 'I can help navigate appointments, explain instructions simply, switch languages, or open your Visit Passport. Try one of the voice presets below.';
    speakAndAppend(fallback, currentLanguage);
  };

  const handleToggleMic = () => {
    setRecognitionError(null);
    const win = window as any;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setRecognitionError(
        currentLanguage === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ (Speech Recognition) ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಬಟನ್ ಅಥವಾ ಟೈಪಿಂಗ್ ಬಳಸಿ.'
          : currentLanguage === 'te'
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. దయచేసి క్రింది బటన్లు లేదా టెక్స్ట్ ఇన్‌పుట్ ఉపయోగించండి.'
          : 'Browser Speech Recognition API is not supported in this browser environment. Please use the text command bar or quick chips below.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang =
        currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const spokenText = event.results?.[0]?.[0]?.transcript || '';
        setIsListening(false);
        if (spokenText) {
          processCommand(spokenText);
        }
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
        setRecognitionError(
          currentLanguage === 'kn'
            ? `ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶ ಅಥವಾ ಭಾಷಾ ಬೆಂಬಲ ಲಭ್ಯವಿಲ್ಲ (${event.error}). ಪಠ್ಯ ಆಯ್ಕೆಯನ್ನು ಬಳಸಿ.`
            : currentLanguage === 'te'
            ? `మైక్రోఫోన్ లేదా భాషా మద్దతు అందుబాటులో లేదు (${event.error}). టెక్స్ట్ ఇన్‌పుట్ ఉపయోగించండి.`
            : `Speech recognition could not capture audio (${event.error}). You can use text commands below anytime.`
        );
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setRecognitionError(
        currentLanguage === 'kn'
          ? 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯ ಬಾಕ್ಸ್ ಬಳಸಿ.'
          : currentLanguage === 'te'
          ? 'మైక్రోఫోన్ ప్రారంభించలేకపోయాము. దయచేసి టెక్స్ట్ బాక్స్ ఉపయోగించండి.'
          : 'Unable to start microphone in this preview context. Please use the text alternatives below.'
      );
    }
  };

  const handleRepeatLast = () => {
    const text = lastSpokenInstruction || getInitialGreeting(currentLanguage);
    speechService.speak(text, currentLanguage);
  };

  const quickVoicePresets: Array<{ label: Record<Language, string>; command: string }> = [
    {
      label: { kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಯಾವಾಗ?', te: 'నా అపాయింట్‌మెంట్ ఎప్పుడు?', en: 'When is my appointment?' },
      command: 'When is my appointment?',
    },
    {
      label: { kn: 'ಸರಳ ವಿವರಣೆ ಕೊಡಿ', te: 'సులభంగా వివరించండి', en: 'Give me a simpler explanation' },
      command: 'Give me a simpler explanation',
    },
    {
      label: { kn: 'ಏನು ತರಬೇಕು? (Passport)', te: 'ఏమి తీసుకురావాలి? (Passport)', en: 'What should I bring?' },
      command: 'What should I bring? passport',
    },
    {
      label: { kn: 'ದಿನಾಂಕ ಬದಲಾಯಿಸಿ', te: 'తేదీ మార్చండి', en: 'I need to reschedule' },
      command: 'reschedule',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          {(['kn', 'te', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={`compact-chip px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                currentLanguage === lang
                  ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                  : 'bg-white border-[#BEA06D]/35 text-[#3C3330]'
              }`}
            >
              {lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'te' ? 'తెలుగు' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>CORE VoiceBridge</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ'
            : currentLanguage === 'te'
            ? 'బహుభాషా వాయిస్ మార్గదర్శి'
            : 'Multilingual Conversational Accessibility'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಧ್ವನಿ ಆಜ್ಞೆಗಳು ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಭಾಷೆ ಬದಲಿಸಿ, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೇಳಿ ಮತ್ತು ವಿವರಣೆ ಪುನರಾವರ್ತಿಸಿ.'
            : currentLanguage === 'te'
            ? 'వాయిస్ లేదా టెక్స్ట్ ద్వారా భాష మార్చండి, అపాయింట్‌మెంట్ వినండి మరియు మళ్ళీ రిపీట్ చేయండి.'
            : 'Navigate appointments, switch languages, request simpler instructions, or repeat audio guidance using voice or accessible text controls.'}
        </p>
      </div>

      {/* Honest Browser Support Disclosure */}
      <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 flex items-start gap-3 text-xs sm:text-sm text-[#3C3330]">
        <Info className="w-5 h-5 text-[#8F7242] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            {availableVoiceSummary.hasSpeechRecognition
              ? currentLanguage === 'kn'
                ? 'ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಪತ್ತೆಯಾಗಿದೆ — ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ.'
                : currentLanguage === 'te'
                ? 'బ్రౌజర్ వాయిస్ రికగ్నిషన్ అందుబాటులో ఉంది — మైక్రోఫోన్ అనుమతి అవసరం.'
                : 'Browser Speech Recognition API detected (microphone permission required).'
              : currentLanguage === 'kn'
              ? 'ಈ ಬ್ರೌಸರ್ ಪರಿಸರದಲ್ಲಿ Speech Recognition ಲಭ್ಯವಿಲ್ಲ — ಕೆಳಗಿನ ಪಠ್ಯ ಮತ್ತು ತ್ವರಿತ ಧ್ವನಿ ಬಟನ್‌ಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.'
              : currentLanguage === 'te'
              ? 'ఈ బ్రౌజర్‌లో Speech Recognition మద్దతు లేదు — క్రింది టెక్స్ట్ మరియు త్వరిత బటన్లు పూర్తిగా పనిచేస్తాయి.'
              : 'Speech Recognition API is unavailable in this browser environment — text commands and spoken audio presets remain fully active.'}
          </p>
          {!availableVoiceSummary.hasNativeVoiceForLang && (
            <p className="text-xs text-[#8F7242]">
              {currentLanguage === 'kn'
                ? 'ಗಮನಿಸಿ: ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯ ಕನ್ನಡ ಧ್ವನಿ ಪ್ಯಾಕ್ ಇಲ್ಲದಿದ್ದರೆ, CORE ಸುರಕ್ಷಿತ ಪ್ರಗತಿ ಪಠ್ಯವನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.'
                : currentLanguage === 'te'
                ? 'గమనిక: మీ పరికరంలో తెలుగు వాయిస్ ప్యాక్ లేకపోతే, CORE దృశ్య వాయిస్ ప్లేబ్యాక్ చూపిస్తుంది.'
                : `OS Voice Disclosure: No native ${currentLanguage.toUpperCase()} TTS voice pack was reported by this device, so audio playback may rely on default fallback pacing.`}
            </p>
          )}
        </div>
      </div>

      {/* Main VoiceBridge Console */}
      <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Mic & Waveform Stage */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30">
          <div className="flex items-center gap-5">
            <div className="relative">
              {isListening && !reduceMotion && (
                <span className="absolute -inset-2 rounded-full bg-[#C98897]/40 voice-ring pointer-events-none" />
              )}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40 ${
                  isListening
                    ? 'bg-[#C98897] text-white'
                    : availableVoiceSummary.hasSpeechRecognition
                    ? 'bg-[#BEA06D] hover:bg-[#8F7242] text-white'
                    : 'bg-white border-2 border-[#BEA06D]/50 text-[#8F7242]'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice command'}
              >
                {isListening ? <Mic className="w-7 h-7" /> : availableVoiceSummary.hasSpeechRecognition ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-[#A2B29B]'
                  }`}
                />
                <span className="text-sm font-bold text-[#3C3330]">
                  {isListening
                    ? currentLanguage === 'kn'
                      ? 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ'
                      : currentLanguage === 'te'
                      ? 'వింటోంది... దయచేసి మాట్లాడండి'
                      : 'Listening... Speak clearly'
                    : currentLanguage === 'kn'
                    ? 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ'
                    : currentLanguage === 'te'
                    ? 'మాట్లాడటానికి మైక్ నొక్కండి లేదా క్రింద టైప్ చేయండి'
                    : 'Tap mic to speak or use text commands'}
                </span>
              </div>

              {/* Subtle Waveform Bars */}
              <div className="flex items-center gap-1 h-7" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1.5 rounded-full bg-[#BEA06D] transition-all ${
                      isListening && !reduceMotion ? 'wave-bar' : 'h-2 opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRepeatLast}
              className="py-2.5 px-4 rounded-full bg-white hover:bg-[#BEA06D]/15 border border-[#BEA06D] text-xs font-bold text-[#8F7242] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಕೊನೆಯ ಸೂಚನೆ ಮತ್ತೆ ಕೇಳಿ'
                  : currentLanguage === 'te'
                  ? 'చివరి సూచన మళ్ళీ వినండి'
                  : 'Repeat Last Instruction'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => processCommand('simple')}
              className="py-2.5 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn' ? 'ಇನ್ನಷ್ಟು ಸರಳವಾಗಿ' : currentLanguage === 'te' ? 'మరింత సులభంగా' : 'Simpler Words'}
              </span>
            </button>
          </div>
        </div>

        {recognitionError && (
          <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/30 border border-[#C98897] text-xs text-[#3C3330] font-medium">
            {recognitionError}
          </div>
        )}

        {/* Accessible Transcript Panel */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn'
              ? 'ಸಂಭಾಷಣೆ ಲಿಪ್ಯಂತರ (Accessible Transcript)'
              : currentLanguage === 'te'
              ? 'సంభాషణ ట్రాన్స్‌క్రిప్ట్ (Transcript)'
              : 'Accessible Voice Transcript'}
          </span>

          <div className="max-h-72 overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
            {transcript.map((entry) => (
              <div
                key={entry.id}
                className={`flex flex-col ${
                  entry.speaker === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    entry.speaker === 'user'
                      ? 'bg-[#BEA06D] text-white'
                      : 'bg-white border border-[#BEA06D]/30 text-[#3C3330]'
                  }`}
                >
                  <p>{entry.text}</p>
                  {entry.speaker === 'bridge' && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#BEA06D]/15">
                      <button
                        type="button"
                        onClick={() => speechService.speak(entry.text, currentLanguage)}
                        className="compact-chip px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 text-[11px] font-semibold text-[#8F7242] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{currentLanguage === 'kn' ? 'ಕೇಳಿ' : currentLanguage === 'te' ? 'వినండి' : 'Speak Aloud'}</span>
                      </button>

                      {entry.suggestedPage && (
                        <button
                          type="button"
                          onClick={() => onPageChange(entry.suggestedPage!)}
                          className="compact-chip px-3 py-1 rounded-full bg-[#4A6347] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{entry.suggestedLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Voice Action Presets & Text Alternative Input */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickVoicePresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => processCommand(preset.command)}
                className="compact-chip px-3.5 py-2 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/40 text-xs font-semibold text-[#3C3330] cursor-pointer"
              >
                {preset.label[currentLanguage]}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              processCommand(textInput);
              setTextInput('');
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                currentLanguage === 'kn'
                  ? 'ಧ್ವನಿ ಬದಲಿಗೆ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ಕನ್ನಡ, Telugu, appointment, repeat)...'
                  : currentLanguage === 'te'
                  ? 'వాయిస్ బదులుగా ఇక్కడ టైప్ చేయండి (ఉదా: తెలుగు, Kannada, appointment)...'
                  : 'Type a navigation command (e.g., "Switch to Kannada", "appointment", "reschedule", "repeat")...'
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentLanguage === 'kn' ? 'ಕಳುಹಿಸಿ' : currentLanguage === 'te' ? 'పంపండి' : 'Send'}
              </span>
            </button>
          </form>
        </div>

        {/* Non-Diagnostic Boundary */}
        <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#3C3330]">
          <ShieldAlert className="w-4 h-4 text-[#C98897] shrink-0 mt-0.5" />
          <span>
            {currentLanguage === 'kn'
              ? 'VoiceBridge ವೆಬ್‌ಸೈಟ್ ನ್ಯಾವಿಗೇಷನ್ ಮತ್ತು ಭಾಷಾ ಸಹಾಯಕ್ಕಾಗಿ ಮಾತ್ರ. ಇದು ರೋಗನಿರ್ಣಯ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ನೀಡುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'VoiceBridge వెబ్‌సైట్ నావిగేషన్ కోసం మాత్రమే. ఇది వ్యాధి నిర్ధారణ లేదా వైద్య సలహా ఇవ్వదు.'
              : 'CORE VoiceBridge assists exclusively with healthcare navigation and preparation clarity — never clinical diagnosis.'}
          </span>
        </div>
      </div>
    </div>
  );
};
