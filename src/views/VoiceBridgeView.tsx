import React, { useState, useEffect, useRef } from 'react';
import { Appointment, ExplanationComplexity, Language, PageView } from '../types';
import { AiConsentNotice } from '../components/AiConsentNotice';
import { AiSkeletonLoader } from '../components/AiTrustLayer';
import { askCompanionAi, formatAiErrorMessage } from '../utils/aiClient';
import {
  detectInputLanguage,
  getLanguageShortName,
  getScriptFontClass,
  getSpeechRecognitionLocale,
} from '../utils/languageIntelligence';
import {
  getAudioLanguageBadge,
  LanguageVoiceSupport,
  resolveSpeechLanguage,
  speechService,
  SpeechPlaybackSnapshot,
  SpeechRate,
} from '../utils/speech';
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Send,
  Info,
  ShieldAlert,
  Sparkles,
  SquarePen,
  Check,
  Copy,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface VoiceBridgeViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onLanguageChange: (lang: Language) => void;
  onPageChange: (page: PageView) => void;
  reduceMotion?: boolean;
  complexity?: ExplanationComplexity;
  aiConsentGranted?: boolean;
  onAcceptAiConsent?: () => void;
}

interface VoiceTurn {
  id: string;
  speaker: 'user' | 'assistant' | 'error';
  text: string;
  language: Language;
  suggestedPage?: PageView;
  suggestedLabel?: string;
  safetyNotice?: string;
}

export const VoiceBridgeView: React.FC<VoiceBridgeViewProps> = ({
  currentLanguage,
  appointment,
  onLanguageChange,
  onPageChange,
  reduceMotion = false,
  complexity = 'simple',
  aiConsentGranted = false,
  onAcceptAiConsent,
}) => {
  const getInitialGreeting = (lang: Language) => {
    if (lang === 'kn') {
      return `ನಮಸ್ಕಾರ ${appointment.patientNameKannada} ರವರೇ. CORE VoiceBridge ಗೆ ಸ್ವಾಗತ. ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ, ಪಠ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಕೇಳಿಸಿರಿ.`;
    }
    if (lang === 'te') {
      return `నమస్కారం ${appointment.patientNameTelugu} గారూ. CORE VoiceBridge కి స్వాగతం. మైక్రోఫోన్ నొక్కి మాట్లాడండి, టెక్స్ట్ సరిచూసి సమాధానం వినండి.`;
    }
    return `Welcome to CORE VoiceBridge, ${appointment.patientName}. Tap the microphone to speak your question, review or edit the recognized text, send it to CORE AI, and listen to the response aloud.`;
  };

  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);
  const [recognitionNotice, setRecognitionNotice] = useState<string | null>(null);
  const [editableDraft, setEditableDraft] = useState('');
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const [lastSpokenLang, setLastSpokenLang] = useState<Language>(currentLanguage);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voiceComplexity, setVoiceComplexity] = useState<ExplanationComplexity>(complexity);
  const [speechRate, setSpeechRate] = useState<SpeechRate>(0.9);

  const [languageSupport, setLanguageSupport] = useState<Record<Language, LanguageVoiceSupport>>(() =>
    speechService.getAllLanguagesVoiceSupport()
  );
  const [playbackSnap, setPlaybackSnap] = useState<SpeechPlaybackSnapshot>(() =>
    speechService.getPlaybackSnapshot()
  );

  const [turns, setTurns] = useState<VoiceTurn[]>([
    {
      id: 'vb-init',
      speaker: 'assistant',
      text: getInitialGreeting(currentLanguage),
      language: currentLanguage,
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVoiceComplexity(complexity);
  }, [complexity]);

  // Keep greeting synced if no conversation started yet
  useEffect(() => {
    setTurns((prev) => {
      if (prev.length === 1 && prev[0].id === 'vb-init') {
        return [
          {
            id: 'vb-init',
            speaker: 'assistant',
            text: getInitialGreeting(currentLanguage),
            language: currentLanguage,
          },
        ];
      }
      return prev;
    });
  }, [currentLanguage, appointment]);

  useEffect(() => {
    const refreshSupport = () => {
      setLanguageSupport(speechService.getAllLanguagesVoiceSupport());
    };
    refreshSupport();
    const unsubVoices = speechService.subscribeVoices(refreshSupport);
    const unsub = speechService.subscribe((snap) => {
      setPlaybackSnap(snap);
      if (snap.lastError) {
        setRecognitionNotice(snap.lastError.message);
      }
    });

    return () => {
      unsub();
      unsubVoices();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup
        }
      }
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [turns, isThinking, reduceMotion]);

  const activeSupport = languageSupport[currentLanguage];
  const detection = detectInputLanguage(editableDraft);
  const mismatchedLang =
    detection.detected && detection.detected !== currentLanguage ? detection.detected : null;

  const visualState: 'listening' | 'thinking' | 'loading-audio' | 'speaking' | 'paused' | 'idle' = isListening
    ? 'listening'
    : isThinking
    ? 'thinking'
    : playbackSnap.status === 'loading'
    ? 'loading-audio'
    : playbackSnap.status === 'speaking'
    ? 'speaking'
    : playbackSnap.status === 'paused'
    ? 'paused'
    : 'idle';

  const speakResponse = (text: string, lang: Language, itemId: string) => {
    const audioLang = resolveSpeechLanguage(text, lang);
    setLastSpokenText(text);
    setLastSpokenLang(audioLang);
    setRecognitionNotice(null);
    speechService.clearError();
    speechService.speak(
      text,
      audioLang,
      {
        onError: (_reason, info) => {
          setRecognitionNotice(
            info?.message ||
              `No voice playback output succeeded for ${getAudioLanguageBadge(audioLang)} on this device. You can read the text above.`
          );
        },
      },
      {
        rate: speechRate,
        itemId,
        cloudConsentGranted: aiConsentGranted,
      }
    );
  };

  const handleSpeedChange = (nextRate: SpeechRate) => {
    setSpeechRate(nextRate);
    speechService.setRate(nextRate);
  };

  const handleSendToGemini = async (rawQuery: string) => {
    const cleaned = rawQuery.trim();
    if (!cleaned || isThinking) return;

    if (!aiConsentGranted) {
      setRecognitionNotice(
        currentLanguage === 'kn'
          ? 'ಮುಂದುವರೆಯಲು ದಯವಿಟ್ಟು ಕೆಳಗಿನ AI ಸಮ್ಮತಿಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ.'
          : currentLanguage === 'te'
          ? 'కొనసాగించడానికి దయచేసి క్రింద AI అనుమతిని ఆమోదించండి.'
          : 'Please accept AI guidance consent below before sending your voice/text question to Gemini.'
      );
      return;
    }

    setRecognitionNotice(null);
    const userTurn: VoiceTurn = {
      id: `u-${Date.now()}`,
      speaker: 'user',
      text: cleaned,
      language: currentLanguage,
    };

    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    setEditableDraft('');
    setIsThinking(true);

    try {
      const historyForApi = nextTurns
        .filter(
          (t): t is VoiceTurn & { speaker: 'user' | 'assistant' } =>
            (t.speaker === 'user' || t.speaker === 'assistant') && t.id !== 'vb-init'
        )
        .slice(-10)
        .map((t) => ({
          role: t.speaker === 'user' ? ('user' as const) : ('assistant' as const),
          text: t.text,
        }));

      const aiData = await askCompanionAi({
        message: cleaned,
        language: currentLanguage,
        complexity: voiceComplexity,
        voicePreferred: true,
        currentPage: 'voicebridge',
        pageContext: `User is inside CORE VoiceBridge speaking/typing in ${getLanguageShortName(
          currentLanguage
        )}. Sample patient context: ${appointment.testName} on ${appointment.date} at ${
          appointment.time
        } (only mention if the user asks about the sample demo card).`,
        history: historyForApi,
        consentAccepted: true,
      });

      const resolvedLang = aiData.responseLanguage || currentLanguage;
      const assistantTurnId = `a-${Date.now()}`;
      setTurns((prev) => [
        ...prev,
        {
          id: assistantTurnId,
          speaker: 'assistant',
          text: aiData.reply,
          language: resolvedLang,
          suggestedPage: aiData.suggestedPage,
          suggestedLabel: aiData.suggestedActionLabel,
          safetyNotice: aiData.safetyNotice,
        },
      ]);

      if (autoSpeakReplies) {
        speakResponse(aiData.reply, resolvedLang, assistantTurnId);
      } else {
        setLastSpokenText(aiData.reply);
        setLastSpokenLang(resolvedLang);
      }
    } catch (err) {
      setTurns((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          speaker: 'error',
          text: formatAiErrorMessage(err, currentLanguage),
          language: currentLanguage,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleToggleMic = () => {
    setRecognitionNotice(null);
    const SpeechRec = speechService.getSpeechRecognitionConstructor();

    if (!SpeechRec) {
      setRecognitionNotice(
        currentLanguage === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್ ಪರಿಸರದಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ Speech Recognition ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.'
          : currentLanguage === 'te'
          ? 'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ Speech Recognition అందుబాటులో లేదు. దయచేసి క్రింద టైప్ చేయండి.'
          : 'Browser Speech Recognition is not supported in this browser. Please type your question in the editable box below.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    try {
      // Stop playback cleanly before activating microphone
      speechService.stop();
      const recognition = new SpeechRec();
      const locale = getSpeechRecognitionLocale(currentLanguage);
      recognition.lang = locale;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const existingPrefix = editableDraft.trim();

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        let recognized = '';
        for (let i = 0; i < event.results.length; i++) {
          recognized += event.results[i][0]?.transcript || '';
        }
        const merged = existingPrefix
          ? `${existingPrefix} ${recognized.trim()}`
          : recognized.trim();
        setEditableDraft(merged);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errCode = event?.error || 'unknown';
        if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          setRecognitionNotice(
            currentLanguage === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.'
              : currentLanguage === 'te'
              ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి అనుమతి ఇవ్వండి లేదా టైప్ చేయండి.'
              : 'Microphone permission was denied. Enable mic access in browser settings or continue by typing below.'
          );
        } else if (errCode === 'language-not-supported') {
          setRecognitionNotice(
            currentLanguage === 'kn'
              ? `ಈ ಬ್ರೌಸರ್ ${locale} ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.`
              : currentLanguage === 'te'
              ? `ఈ బ్రౌజర్ ${locale} వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వదు. దయచేసి టైప్ చేయండి.`
              : `This browser does not support ${locale} speech recognition. You can continue typing below.`
          );
        } else {
          setRecognitionNotice(
            currentLanguage === 'kn'
              ? `ಧ್ವನಿ ಸೆರೆಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (${errCode}). ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`
              : currentLanguage === 'te'
              ? `వాయిస్ అందుకోలేకపోయాము (${errCode}). దయచేసి టైప్ చేయండి లేదా మళ్ళీ ప్రయత్నించండి.`
              : `Speech recognition ended (${errCode}). Edit or type your question below anytime.`
          );
        }
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setRecognitionNotice(
        'Unable to activate microphone in this browser environment. Please type your question below.'
      );
    }
  };

  const handleNewConversation = () => {
    speechService.stop();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
    setTurns([
      {
        id: 'vb-init',
        speaker: 'assistant',
        text: getInitialGreeting(currentLanguage),
        language: currentLanguage,
      },
    ]);
    setEditableDraft('');
    setRecognitionNotice(null);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      // ignore clipboard restriction
    }
  };

  const quickVoicePresets: Array<{ label: Record<Language, string>; prompt: Record<Language, string> }> = [
    {
      label: {
        kn: 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ಏನು ತರಬೇಕು?',
        te: 'ఆసుపత్రి సందర్శనకు ఏమి తీసుకురావాలి?',
        en: 'What should I bring to the hospital?',
      },
      prompt: {
        kn: 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ನಾನು ಯಾವ ದಾಖಲೆಗಳನ್ನು ತರಬೇಕು?',
        te: 'ఆసుపత్రి సందర్శనకు నేను ఏ పత్రాలు తీసుకురావాలి?',
        en: 'What documents should I bring for my hospital visit?',
      },
    },
    {
      label: {
        kn: 'OPD ಎಂದರೇನು? ಸರಳವಾಗಿ ಹೇಳಿ',
        te: 'OPD అంటే ఏమిటి? సులభంగా చెప్పండి',
        en: 'Explain OPD simply',
      },
      prompt: {
        kn: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ OPD ಎಂದರೇನು ಎಂಬುದನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಿ.',
        te: 'ఆసుపత్రిలో OPD అంటే ఏమిటో సులభంగా వివరించండి.',
        en: 'Explain what OPD means at a hospital in simple words.',
      },
    },
    {
      label: {
        kn: 'ಸಮಯ ಬದಲಾವಣೆ ಹೇಗೆ ಮಾಡುವುದು?',
        te: 'సమయం ఎలా మార్చుకోవాలి?',
        en: 'How do I reschedule my visit?',
      },
      prompt: {
        kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕವನ್ನು ಹೇಗೆ ಬದಲಾಯಿಸಬಹುದು?',
        te: 'నా అపాయింట్‌మెంట్ తేదీని ఎలా మార్చుకోవచ్చు?',
        en: 'How can I change or reschedule my hospital appointment date in CORE?',
      },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-7 soft-fade-up">
      {/* Top Navigation & Language Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#493C39] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn'
              ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ'
              : currentLanguage === 'te'
              ? 'హోమ్‌కు తిరిగి వెళ్ళండి'
              : 'Back to Home'}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {(['en', 'kn', 'te'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={`compact-chip px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                currentLanguage === lang
                  ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                  : 'bg-white border-[#BEA06D]/35 text-[#493C39] hover:border-[#C88F98]'
              }`}
            >
              {lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'te' ? 'తెలుగు' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C88F98]" />
          <span>CORE VoiceBridge · Gemini Multilingual Voice</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#493C39]">
          {currentLanguage === 'kn'
            ? 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಹಾಯಕ'
            : currentLanguage === 'te'
            ? 'బహుభాషా వాయిస్ సహాయకుడు'
            : 'Speak, Review & Listen in Your Language'}
        </h1>
        <p className="text-sm sm:text-base text-[#493C39]/80">
          {currentLanguage === 'kn'
            ? 'ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ, ಪಠ್ಯವನ್ನು ಸರಿಪಡಿಸಿ ಮತ್ತು Gemini ಉತ್ತರವನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ.'
            : currentLanguage === 'te'
            ? 'మైక్రోఫోన్ నొక్కి ప్రశ్న అడగండి, టెక్స్ట్ సరిచూసుకోండి మరియు Gemini సమాధానాన్ని వాయిస్‌లో వినండి.'
            : 'Tap the microphone to speak, edit recognized text before sending, receive Gemini answers in English, Kannada, or Telugu, and control spoken playback.'}
        </p>
      </div>

      {/* Honest Browser Voice Support Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 space-y-3">
        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#493C39]">
          <Info className="w-4 h-4 text-[#8A6D3F] shrink-0 mt-0.5" />
          <p className="font-semibold">
            {activeSupport.sttApiAvailable
              ? `Browser Speech Recognition is available for ${getLanguageShortName(
                  currentLanguage
                )} (${getSpeechRecognitionLocale(
                  currentLanguage
                )}) — microphone activates only when you tap Speak.`
              : 'Browser Speech Recognition API is not available in this browser environment — you can type freely below and use audio playback if supported.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {(['en', 'kn', 'te'] as const).map((langCode) => {
            const sup = languageSupport[langCode];
            const isSelected = langCode === currentLanguage;
            return (
              <div
                key={langCode}
                className={`p-3 rounded-xl border ${
                  isSelected
                    ? 'bg-white border-[#C88F98] shadow-xs'
                    : 'bg-white/70 border-[#BEA06D]/25'
                }`}
              >
                <div className="font-bold text-[#493C39]">
                  {getLanguageShortName(langCode)} ({getSpeechRecognitionLocale(langCode)})
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] text-[#493C39]/80">
                  <div>
                    Mic Input:{' '}
                    <span className="font-semibold text-[#4A6347]">
                      {sup.sttApiAvailable ? 'Browser API Ready' : 'Unsupported in Browser'}
                    </span>
                  </div>
                  <div>
                    Spoken Voice:{' '}
                    <span
                      className={`font-semibold ${
                        sup.nativeTtsVoiceAvailable || sup.cloudTtsAvailable
                          ? 'text-[#4A6347]'
                          : 'text-[#8A6D3F]'
                      }`}
                    >
                      {sup.nativeTtsVoiceAvailable
                        ? `Browser Voice (${sup.ttsVoiceName?.slice(0, 22)})`
                        : sup.cloudTtsAvailable
                        ? `${sup.cloudProviderLabel || 'Gemini TTS'} Ready`
                        : sup.ttsApiAvailable
                        ? 'No OS Voice Pack Detected'
                        : 'TTS Unsupported'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive VoiceBridge Console */}
      <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-8 shadow-md space-y-6">
        {/* Consent Gate when needed */}
        <AiConsentNotice
          language={currentLanguage}
          consentGranted={aiConsentGranted}
          onAcceptConsent={onAcceptAiConsent || (() => {})}
          compact
        />

        {/* Animated Rosewater Voice Stage: Idle / Listening (Blush) / Thinking / Speaking */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-5 p-5 rounded-2xl border transition-colors duration-300 ${
            visualState === 'listening'
              ? 'bg-[#E6C1C4]/25 border-[#C88F98]'
              : visualState === 'speaking'
              ? 'bg-[#A2B29B]/15 border-[#4A6347]/50'
              : 'bg-[#FCF9F5] border-[#BEA06D]/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {visualState === 'listening' && !reduceMotion && (
                <span className="absolute -inset-2.5 rounded-full bg-[#C88F98]/40 voice-ring pointer-events-none" />
              )}
              <button
                type="button"
                onClick={handleToggleMic}
                disabled={isThinking}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40 disabled:opacity-50 ${
                  visualState === 'listening'
                    ? 'bg-[#C88F98] text-white'
                    : activeSupport.sttApiAvailable
                    ? 'bg-[#BEA06D] hover:bg-[#8A6D3F] text-white'
                    : 'bg-white border-2 border-[#BEA06D]/50 text-[#8A6D3F]'
                }`}
                aria-label={isListening ? 'Stop microphone' : 'Activate microphone'}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7" />
                ) : activeSupport.sttApiAvailable ? (
                  <Mic className="w-7 h-7" />
                ) : (
                  <MicOff className="w-7 h-7" />
                )}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm sm:text-base font-bold text-[#493C39] flex flex-wrap items-center gap-2">
                <span>
                  {visualState === 'listening'
                    ? currentLanguage === 'kn'
                      ? 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ'
                      : currentLanguage === 'te'
                      ? 'వింటోంది... దయచేసి మాట్లాడండి'
                      : `Listening (${getSpeechRecognitionLocale(currentLanguage)})... Speak clearly`
                    : visualState === 'thinking'
                    ? currentLanguage === 'kn'
                      ? 'Gemini ಉತ್ತರ ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                      : currentLanguage === 'te'
                      ? 'Gemini సమాధానం సిద్ధం చేస్తోంది...'
                      : 'Thinking... Composing gentle response'
                    : visualState === 'loading-audio'
                    ? `Preparing Audio (${getAudioLanguageBadge(playbackSnap.activeLang || lastSpokenLang)})...`
                    : visualState === 'speaking'
                    ? `Speaking (${getAudioLanguageBadge(playbackSnap.activeLang || lastSpokenLang)})`
                    : visualState === 'paused'
                    ? `Audio paused (${getAudioLanguageBadge(playbackSnap.activeLang || lastSpokenLang)})`
                    : currentLanguage === 'kn'
                    ? `ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ (${getAudioLanguageBadge(currentLanguage)})`
                    : currentLanguage === 'te'
                    ? `మాట్లాడటానికి మైక్ నొక్కండి లేదా క్రింద టైప్ చేయండి (${getAudioLanguageBadge(currentLanguage)})`
                    : `Tap microphone to speak, or type below (${getAudioLanguageBadge(currentLanguage)})`}
                </span>
                {playbackSnap.activeEngineLabel && playbackSnap.status !== 'idle' && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#BEA06D]/35 text-[#8A6D3F]">
                    {playbackSnap.activeEngineLabel}
                  </span>
                )}
              </div>

              {/* Soft Waveform Animation (Active during Listening or Speaking, static when reduceMotion) */}
              <div className="flex items-center gap-1 h-6" aria-hidden="true">
                {visualState === 'loading-audio' ? (
                  <Loader2 className="w-4 h-4 text-[#C88F98] animate-spin" />
                ) : (
                  [1, 2, 3, 4, 5].map((bar) => (
                    <span
                      key={bar}
                      className={`w-1.5 rounded-full transition-all ${
                        visualState === 'listening'
                          ? 'bg-[#C88F98]'
                          : visualState === 'speaking'
                          ? 'bg-[#4A6347]'
                          : 'bg-[#BEA06D]'
                      } ${
                        (visualState === 'listening' || visualState === 'speaking') && !reduceMotion
                          ? 'wave-bar'
                          : 'h-2 opacity-40'
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Playback Controls: Pause / Resume / Replay / Stop / New Conversation */}
          <div className="flex flex-wrap items-center gap-2">
            {playbackSnap.status !== 'idle' && (
              <>
                {playbackSnap.status !== 'loading' && (
                  <button
                    type="button"
                    onClick={() =>
                      playbackSnap.status === 'paused'
                        ? speechService.resume()
                        : speechService.pause()
                    }
                    className="compact-chip py-2 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 text-xs font-bold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {playbackSnap.status === 'paused' ? (
                      <Play className="w-3.5 h-3.5" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" />
                    )}
                    <span>{playbackSnap.status === 'paused' ? 'Resume' : 'Pause'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => speechService.stop()}
                  className="compact-chip py-2 px-3.5 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                speakResponse(
                  lastSpokenText || getInitialGreeting(currentLanguage),
                  lastSpokenText ? lastSpokenLang : currentLanguage,
                  'vb-replay'
                )
              }
              className="compact-chip py-2 px-3.5 rounded-full bg-white hover:bg-[#BEA06D]/15 border border-[#BEA06D] text-xs font-bold text-[#8A6D3F] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಮತ್ತೆ ಕೇಳಿ'
                  : currentLanguage === 'te'
                  ? 'మళ్ళీ వినండి'
                  : 'Replay'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNewConversation}
              className="compact-chip py-2 px-3.5 rounded-full bg-white hover:bg-[#E6C1C4]/20 border border-[#BEA06D]/45 text-xs font-bold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5 text-[#C88F98]" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಹೊಸ ಚಾಟ್'
                  : currentLanguage === 'te'
                  ? 'కొత్త చాట్'
                  : 'New Conversation'}
              </span>
            </button>
          </div>
        </div>

        {/* Settings Strip: Explanation Length + Auto-Speak */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
          <div className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-xl p-0.5">
            {(
              [
                {
                  id: 'extra_simple' as ExplanationComplexity,
                  label: { en: 'Quick Answer', kn: 'ಚಿಕ್ಕ ಉತ್ತರ', te: 'చిన్న సమాధానం' },
                },
                {
                  id: 'simple' as ExplanationComplexity,
                  label: { en: 'Simple', kn: 'ಸರಳ', te: 'సులభం' },
                },
                {
                  id: 'detailed' as ExplanationComplexity,
                  label: { en: 'Detailed', kn: 'ವಿವರವಾದ', te: 'వివరంగా' },
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVoiceComplexity(opt.id)}
                className={`compact-chip px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  voiceComplexity === opt.id
                    ? 'bg-[#493C39] text-white'
                    : 'text-[#493C39]/80 hover:text-[#493C39]'
                }`}
              >
                {opt.label[currentLanguage]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Playback Speed Selector (0.75x / 0.9x / 1.0x) */}
            <div
              className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-xl p-0.5"
              role="group"
              aria-label="Audio playback speed"
            >
              <span className="px-2 text-[11px] font-semibold text-[#8A6D3F]">Speed:</span>
              {([0.75, 0.9, 1.0] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSpeedChange(r)}
                  className={`compact-chip px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    speechRate === r
                      ? 'bg-[#BEA06D] text-white'
                      : 'text-[#493C39]/80 hover:text-[#493C39]'
                  }`}
                >
                  {r === 1 ? '1.0x' : `${r}x`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoSpeakReplies((v) => !v)}
              className={`compact-chip px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                autoSpeakReplies
                  ? 'bg-[#A2B29B]/20 border-[#4A6347]/45 text-[#4A6347]'
                  : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#493C39]/75'
              }`}
            >
              {autoSpeakReplies ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeakReplies ? 'Auto-Speak Replies: On' : 'Auto-Speak Replies: Off'}</span>
            </button>
          </div>
        </div>

        {recognitionNotice && (
          <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#C88F98] text-xs sm:text-sm text-[#493C39] flex flex-wrap items-start justify-between gap-2.5">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <AlertCircle className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
              <span className="break-words">{recognitionNotice}</span>
            </div>
            {!aiConsentGranted && playbackSnap.lastError?.code === 'cloud-consent-required' && (
              <button
                type="button"
                onClick={() => {
                  onAcceptAiConsent?.();
                  speechService.setCloudConsentGranted(true);
                  setRecognitionNotice(null);
                  speechService.clearError();
                  speechService.replay();
                }}
                className="compact-chip px-3 py-1 rounded-full bg-[#4A6347] hover:bg-[#3b5038] text-white text-xs font-semibold cursor-pointer shrink-0"
              >
                Enable Gemini Voice
              </button>
            )}
          </div>
        )}

        {/* Editable Recognized Speech & Question Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSendToGemini(editableDraft);
          }}
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="voicebridge-editable-input"
              className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider"
            >
              {currentLanguage === 'kn'
                ? 'ಗುರುತಿಸಿದ ಧ್ವನಿ / ನಿಮ್ಮ ಪ್ರಶ್ನೆ (ಕಳುಹಿಸುವ ಮೊದಲು ತಿದ್ದುಪಡಿ ಮಾಡಬಹುದು)'
                : currentLanguage === 'te'
                ? 'గుర్తించిన మాట / మీ ప్రశ్న (పంపే ముందు సవరించవచ్చు)'
                : 'Recognized Speech / Your Question (Editable before sending)'}
            </label>
            {editableDraft && (
              <button
                type="button"
                onClick={() => setEditableDraft('')}
                className="text-xs font-semibold text-[#8A6D3F] underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {mismatchedLang && (
            <div className="p-2.5 rounded-xl bg-[#E6C1C4]/20 border border-[#C88F98]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span>
                Detected <strong>{getLanguageShortName(mismatchedLang)}</strong> input. Would you
                like to switch to {getLanguageShortName(mismatchedLang)} for the response?
              </span>
              <button
                type="button"
                onClick={() => onLanguageChange(mismatchedLang)}
                className="compact-chip px-3 py-1 rounded-lg bg-[#C88F98] text-white font-semibold cursor-pointer"
              >
                Switch to {getLanguageShortName(mismatchedLang)}
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <textarea
              id="voicebridge-editable-input"
              rows={2}
              value={editableDraft}
              onChange={(e) => setEditableDraft(e.target.value)}
              placeholder={
                currentLanguage === 'kn'
                  ? 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                  : currentLanguage === 'te'
                  ? 'మైక్ నొక్కి మాట్లాడండి లేదా ఇక్కడ టైప్ చేయండి...'
                  : 'Tap the microphone to dictate, or type your hospital navigation question here...'
              }
              className={`flex-1 px-4 py-3 rounded-2xl border border-[#BEA06D]/45 bg-[#FCF9F5] text-base text-[#322826] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#BEA06D] ${getScriptFontClass(
                editableDraft,
                currentLanguage
              )}`}
            />
            <button
              type="submit"
              disabled={!editableDraft.trim() || isThinking || !aiConsentGranted}
              className="px-6 py-3 rounded-2xl bg-[#BEA06D] hover:bg-[#8A6D3F] disabled:opacity-50 text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಕಳುಹಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'పంపండి'
                  : 'Ask CORE AI'}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Voice/Text Starters */}
        <div className="flex flex-wrap gap-2">
          {quickVoicePresets.map((preset, i) => (
            <button
              key={i}
              type="button"
              disabled={!aiConsentGranted || isThinking}
              onClick={() => void handleSendToGemini(preset.prompt[currentLanguage])}
              className="compact-chip px-3.5 py-2 rounded-xl bg-[#FCF9F5] hover:bg-[#E6C1C4]/20 disabled:opacity-50 border border-[#BEA06D]/35 text-xs sm:text-sm font-semibold text-[#493C39] cursor-pointer"
            >
              {preset.label[currentLanguage]}
            </button>
          ))}
        </div>

        {/* Accessible Conversation Transcript */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider block">
            {currentLanguage === 'kn'
              ? 'ಧ್ವನಿ ಮತ್ತು AI ಸಂಭಾಷಣೆ'
              : currentLanguage === 'te'
              ? 'వాయిస్ & AI సంభాషణ'
              : 'VoiceBridge Conversation'}
          </span>

          <div className="max-h-[420px] overflow-y-auto space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25">
            {turns.map((turn) => {
              const isPlayingThis =
                playbackSnap.activeId === turn.id && playbackSnap.status !== 'idle';
              const fontCls = getScriptFontClass(turn.text, turn.language);
              return (
                <div
                  key={turn.id}
                  className={`flex flex-col ${
                    turn.speaker === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[94%] rounded-2xl px-4 py-3.5 text-[15px] sm:text-base leading-[1.65] break-words ${fontCls} ${
                      turn.speaker === 'user'
                        ? 'bg-[#5B4944] text-white'
                        : turn.speaker === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-950'
                        : 'bg-white border border-[#BEA06D]/35 text-[#322826]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{turn.text}</p>
                    {turn.safetyNotice && (
                      <p className="mt-2 text-xs text-[#493C39]/75 italic border-t border-[#E6C1C4]/50 pt-1.5">
                        {turn.safetyNotice}
                      </p>
                    )}

                    {turn.speaker === 'assistant' && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#BEA06D]/15">
                        <button
                          type="button"
                          onClick={() =>
                            isPlayingThis
                              ? speechService.stop()
                              : speakResponse(turn.text, turn.language, turn.id)
                          }
                          className={`compact-chip px-3 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                            isPlayingThis
                              ? 'bg-[#C88F98] border-[#C88F98] text-white'
                              : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#8A6D3F]'
                          }`}
                        >
                          {isPlayingThis ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isPlayingThis
                              ? 'Stop Audio'
                              : turn.language === 'kn'
                              ? 'ಕೇಳಿ'
                              : turn.language === 'te'
                              ? 'వినండి'
                              : 'Listen'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleCopy(turn.text, turn.id)}
                          className="compact-chip px-3 py-1 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs font-semibold text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === turn.id ? (
                            <Check className="w-3.5 h-3.5 text-[#4A6347]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === turn.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        {turn.suggestedPage && (
                          <button
                            type="button"
                            onClick={() => onPageChange(turn.suggestedPage!)}
                            className="compact-chip px-3 py-1 rounded-lg bg-[#4A6347] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{turn.suggestedLabel || 'Open Section'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <AiSkeletonLoader label="Composing calm multilingual voice response..." />
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Non-Diagnostic Boundary */}
        <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#493C39]">
          <ShieldAlert className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
          <span>
            {currentLanguage === 'kn'
              ? 'VoiceBridge ವೆಬ್‌ಸೈಟ್ ನ್ಯಾವಿಗೇಷನ್ ಮತ್ತು ಭಾಷಾ ಸಹಾಯಕ್ಕಾಗಿ ಮಾತ್ರ. ಇದು ರೋಗನಿರ್ಣಯ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ನೀಡುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'VoiceBridge వెబ్‌సైట్ నావిగేషన్ కోసం మాత్రమే. ఇది వ్యాధి నిర్ధారణ లేదా వైద్య సలహా ఇవ్వదు.'
              : 'CORE VoiceBridge assists exclusively with healthcare navigation and clarity — never clinical diagnosis. Verify medical instructions with hospital staff.'}
          </span>
        </div>
      </div>
    </div>
  );
};
