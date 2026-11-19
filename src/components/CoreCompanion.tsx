import React, { useState, useRef, useEffect } from 'react';
import { CoreMonogramMark } from './BotanicalMotifs';
import { AiConsentNotice } from './AiConsentNotice';
import { AiTrustHeader, AiTrustFooter, AiSkeletonLoader } from './AiTrustLayer';
import { ComfortSettings, ExplanationComplexity, Language, PageView } from '../types';
import { askCompanionAi, formatAiErrorMessage, translateAiText } from '../utils/aiClient';
import {
  detectInputLanguage,
  getLanguageShortName,
  getScriptFontClass,
  getSpeechRecognitionLocale,
} from '../utils/languageIntelligence';
import {
  getAudioLanguageBadge,
  resolveSpeechLanguage,
  speechService,
  SpeechPlaybackSnapshot,
  SpeechRate,
} from '../utils/speech';
import {
  MessageCircleHeart,
  X,
  Send,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Minus,
  AlertCircle,
  Compass,
  CheckCircle2,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Languages,
  BookOpen,
  Zap,
  FileText,
  SquarePen,
  Loader2,
} from 'lucide-react';

interface MessageTranslation {
  language: Language;
  text: string;
  verificationNote?: string;
}

interface CompanionMessage {
  id: string;
  sender: 'user' | 'assistant' | 'error';
  text: string;
  responseLanguage?: Language;
  detectedInputLang?: Language;
  suggestedPage?: PageView;
  suggestedActionLabel?: string;
  followUpQuestion?: string;
  safetyNotice?: string;
  translation?: MessageTranslation;
}

interface GuidedWorkflow {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  primaryModule: PageView;
  steps: Array<{
    id: string;
    label: Record<Language, string>;
    detail: Record<Language, string>;
    targetPage?: PageView;
    actionLabel?: Record<Language, string>;
    opensSearch?: boolean;
  }>;
}

const GUIDED_WORKFLOWS: GuidedWorkflow[] = [
  {
    id: 'prepare-visit',
    title: {
      en: 'Preparing for a hospital visit',
      kn: 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ಸಿದ್ಧತೆ',
      te: 'ఆసుపత్రి సందర్శనకు తయారీ',
    },
    summary: {
      en: 'Walk step-by-step through Before/During/After preparation and print your Visit Summary.',
      kn: 'ಭೇಟಿಗೆ ಮುನ್ನ, ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರದ ಸಿದ್ಧತೆಗಳನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿ.',
      te: 'సందర్శనకు ముందు, సమయంలో మరియు తర్వాత ఏర్పాట్లను వరుసగా పూర్తి చేయండి.',
    },
    primaryModule: 'journey',
    steps: [
      {
        id: 'prep-1',
        label: {
          en: 'Open My Care Journey timeline',
          kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ ತೆರೆಯಿರಿ',
          te: 'నా ఆరోగ్య ప్రయాణం తెరవండి',
        },
        detail: {
          en: 'Review the Before My Visit checklist and check off completed items.',
          kn: 'ಭೇಟಿಗೆ ಮುನ್ನ ಮಾಡಬೇಕಾದ ಸಿದ್ಧತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಗುರುತು ಹಾಕಿ.',
          te: 'సందర్శనకు ముందు చేయాల్సిన జాబితాను చూసి టిక్ చేయండి.',
        },
        targetPage: 'journey',
        actionLabel: { en: 'Open Care Journey', kn: 'ಆರೈಕೆ ಪಯಣ ತೆರೆಯಿರಿ', te: 'ఆరోగ్య ప్రయాణం తెరవండి' },
      },
      {
        id: 'prep-2',
        label: {
          en: 'Check CareCompass documents & calendar reminder',
          kn: 'CareCompass ನಲ್ಲಿ ದಾಖಲೆಗಳು ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ನೋಡಿ',
          te: 'CareCompass లో పత్రాలు & క్యాలెండర్ చూడండి',
        },
        detail: {
          en: 'Confirm your ID card, referral slip, and download an optional .ics reminder.',
          kn: 'ಗುರುತಿನ ಚೀಟಿ, ಶಿಫಾರಸು ಪತ್ರ ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ ಸಿದ್ಧಪಡಿಸಿ.',
          te: 'గుర్తింపు కార్డు, రిఫరల్ చీటీ మరియు క్యాలెండర్ రిమైండర్ సిద్ధం చేయండి.',
        },
        targetPage: 'carecompass',
        actionLabel: { en: 'Open CareCompass', kn: 'CareCompass ತೆರೆಯಿರಿ', te: 'CareCompass తెరవండి' },
      },
      {
        id: 'prep-3',
        label: {
          en: 'Save or print your CORE Visit Summary',
          kn: 'ನಿಮ್ಮ ವಿಸಿಟ್ ಸಾರಾಂಶವನ್ನು ಪ್ರಿಂಟ್ ಅಥವಾ ಉಳಿಸಿ',
          te: 'మీ విజిట్ సారాంశాన్ని ప్రింట్ లేదా సేవ్ చేయండి',
        },
        detail: {
          en: 'Keep completed items and doctor questions ready in one printable sheet.',
          kn: 'ಪೂರ್ಣಗೊಂಡ ಕೆಲಸಗಳು ಮತ್ತು ವೈದ್ಯರ ಪ್ರಶ್ನೆಗಳನ್ನು ಒಂದೇ ಹಾಳೆಯಲ್ಲಿ ಉಳಿಸಿ.',
          te: 'పూర్తయిన పనులు మరియు డాక్టర్ ప్రశ్నలను ఒకే కార్డులో సేవ్ చేయండి.',
        },
        targetPage: 'passport',
        actionLabel: { en: 'Open Visit Passport', kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್', te: 'విజిట్ పాస్‌పోర్ట్' },
      },
    ],
  },
  {
    id: 'understand-instructions',
    title: {
      en: 'Understanding appointment instructions',
      kn: 'ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು',
      te: 'అపాయింట్‌మెంట్ సూచనలను అర్థం చేసుకోవడం',
    },
    summary: {
      en: 'Turn unfamiliar hospital terms or SMS phrases into clear plain language and verify with CORE Sense.',
      kn: 'ಕಷ್ಟಕರ ಆಸ್ಪತ್ರೆ ಪದಗಳನ್ನು ಸರಳ ಮಾತಿನಲ್ಲಿ ಓದಿ ಮತ್ತು ಕೇಳಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
      te: 'కష్టమైన ఆసుపత్రి పదాలను సులభ భాషలో అర్థం చేసుకోండి.',
    },
    primaryModule: 'clarity',
    steps: [
      {
        id: 'inst-1',
        label: {
          en: 'Simplify wording in CORE Clarity AI',
          kn: 'CORE Clarity AI ನಲ್ಲಿ ಸೂಚನೆಯನ್ನು ಸರಳಗೊಳಿಸಿ',
          te: 'CORE Clarity AI లో సూచనలను సులభంగా మార్చుకోండి',
        },
        detail: {
          en: 'Paste your hospital text or choose a verified reference term like NPO or Block B.',
          kn: 'ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಉದಾಹರಣೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          te: 'మీ ఆసుపత్రి టెక్స్ట్ ఇవ్వండి లేదా ఉదాహరణ ఎంచుకోండి.',
        },
        targetPage: 'clarity',
        actionLabel: { en: 'Open Explain It Simply', kn: 'ಸರಳ ವಿವರಣೆ ತೆರೆಯಿರಿ', te: 'సులభ వివరణ తెరవండి' },
      },
      {
        id: 'inst-2',
        label: {
          en: 'Practice understanding in CORE Sense',
          kn: 'CORE Sense ನಲ್ಲಿ ತಿಳುವಳಿಕೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ',
          te: 'CORE Sense లో అవగాహనను సరిచూసుకోండి',
        },
        detail: {
          en: 'Review the 5-step hospital sequence and Teach-Back comprehension check.',
          kn: '5-ಹಂತದ ಆಸ್ಪತ್ರೆ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.',
          te: '5-దశల ఆసుపత్రి క్రమాన్ని చూడండి.',
        },
        targetPage: 'sense',
        actionLabel: { en: 'Open CORE Sense', kn: 'CORE Sense ತೆರೆಯಿರಿ', te: 'CORE Sense తెరవండి' },
      },
      {
        id: 'inst-3',
        label: {
          en: 'Confirm unclear details with hospital staff',
          kn: 'ಅಸ್ಪಷ್ಟ ಅಂಶಗಳನ್ನು ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ',
          te: 'సందేహాలను ఆసుపత్రి సిబ్బందితో ధృవీకరించుకోండి',
        },
        detail: {
          en: 'Use the generated questions list or open Get Help for guidance counters.',
          kn: 'ಸಹಾಯ ಪುಟದಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರದ ಮಾಹಿತಿಯನ್ನು ನೋಡಿ.',
          te: 'సహాయ పేజీలో ఆసుపత్రి మార్గదర్శక వివరాలను చూడండి.',
        },
        targetPage: 'help',
        actionLabel: { en: 'Open Get Help', kn: 'ಸಹಾಯ ಪಡೆಯಿರಿ', te: 'సహాయం పొందండి' },
      },
    ],
  },
  {
    id: 'organize-consultation',
    title: {
      en: 'Organizing an upcoming consultation',
      kn: 'ಮುಂಬರುವ ಭೇಟಿಯನ್ನು ವ್ಯವಸ್ಥಿತಗೊಳಿಸುವುದು',
      te: 'రాబోయే కన్సల్టేషన్‌ను నిర్వహించడం',
    },
    summary: {
      en: 'Hear your demo appointment card aloud, review reminder options, or reschedule calmly.',
      kn: 'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾರ್ಡ್ ಕೇಳಿ, ಜ್ಞಾಪನೆಗಳನ್ನು ನೋಡಿ ಅಥವಾ ದಿನಾಂಕ ಬದಲಾಯಿಸಿ.',
      te: 'మీ అపాయింట్‌మెంట్ వివరాలు వినండి, రిమైండర్లు చూడండి లేదా తేదీ మార్చండి.',
    },
    primaryModule: 'appointment',
    steps: [
      {
        id: 'org-1',
        label: {
          en: 'Listen to appointment date & room',
          kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ಮತ್ತು ಕೊಠಡಿಯನ್ನು ಆಲಿಸಿ',
          te: 'అపాయింట్‌మెంట్ తేదీ మరియు గదిని వినండి',
        },
        detail: {
          en: 'Open Hear My Appointment to play spoken readout in your preferred language.',
          kn: 'ಧ್ವನಿ ಓದುಗದಿಂದ ದಿನಾಂಕ ಮತ್ತು ವಿಭಾಗವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿ.',
          te: 'వాయిస్ ద్వారా తేదీ మరియు విభాగం వివరాలు వినండి.',
        },
        targetPage: 'appointment',
        actionLabel: { en: 'Open Hear Appointment', kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ', te: 'అపాయింట్‌మెంట్ వినండి' },
      },
      {
        id: 'org-2',
        label: {
          en: 'Set reminder channels or change date if needed',
          kn: 'ಜ್ಞಾಪನೆಗಳನ್ನು ಹೊಂದಿಸಿ ಅಥವಾ ಅಗತ್ಯವಿದ್ದರೆ ದಿನಾಂಕ ಬದಲಿಸಿ',
          te: 'రిమైండర్లు సెటప్ చేయండి లేదా తేదీని మార్చండి',
        },
        detail: {
          en: 'Check Reminders or step through the 5-step Reschedule flow.',
          kn: 'ಜ್ಞಾಪನೆ ವಿಧಾನಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          te: 'రిమైండర్ మరియు తేదీ మార్పు ఎంపికలను చూడండి.',
        },
        targetPage: 'reminders',
        actionLabel: { en: 'Open Reminders', kn: 'ಜ್ಞಾಪನೆಗಳು ತೆರೆಯಿರಿ', te: 'రిమైండర్లు తెరవండి' },
      },
      {
        id: 'org-3',
        label: {
          en: 'Check Reschedule flow if transport is difficult',
          kn: 'ಪ್ರಯಾಣ ಕಷ್ಟವಾದರೆ ದಿನಾಂಕ ಬದಲಾವಣೆ ನೋಡಿ',
          te: 'ప్రయాణం కష్టమైతే తేదీ మార్పు చూడండి',
        },
        detail: {
          en: 'Pick a morning or afternoon slot cleanly without extra trips.',
          kn: 'ನಿಮಗೆ ಅನುಕೂಲವಾದ ಸಮಯವನ್ನು ಆರಿಸಿ.',
          te: 'మీకు అనువైన సమయాన్ని ఎంచుకోండి.',
        },
        targetPage: 'reschedule',
        actionLabel: { en: 'Open Reschedule', kn: 'ದಿನಾಂಕ ಬದಲಿಸಿ', te: 'తేదీ మార్చండి' },
      },
    ],
  },
  {
    id: 'caregiver-support',
    title: {
      en: 'Getting caregiver support',
      kn: 'ಆರೈಕೆದಾರರ ನೆರವು ಪಡೆಯುವುದು',
      te: 'సంరక్షకుల సహాయం పొందడం',
    },
    summary: {
      en: 'Share non-clinical visit timing and preparation items with family only when you grant consent.',
      kn: 'ನಿಮ್ಮ ಅನುಮತಿಯೊಂದಿಗೆ ಮಾತ್ರ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಭೇಟಿಯ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
      te: 'మీ అనుమతితో మాత్రమే కుటుంబ సభ్యులతో సందర్శన వివరాలను పంచుకోండి.',
    },
    primaryModule: 'carecircle',
    steps: [
      {
        id: 'cg-1',
        label: {
          en: 'Review privacy controls in CareCircle',
          kn: 'CareCircle ನಲ್ಲಿ ಗೌಪ್ಯತಾ ನಿಯಂತ್ರಣಗಳನ್ನು ನೋಡಿ',
          te: 'CareCircle లో గోప్యతా నియంత్రణలను చూడండి',
        },
        detail: {
          en: 'Choose exactly which sections (timing, directions, checklist) a caregiver can view.',
          kn: 'ಕುಟುಂಬದವರಿಗೆ ಯಾವ ವಿವರ ಕಾಣಿಸಬೇಕು ಎಂಬುದನ್ನು ನೀವೇ ಆಯ್ಕೆಮಾಡಿ.',
          te: 'సంరక్షకుడికి ఏ వివరాలు కనిపించాలో మీరే ఎంచుకోండి.',
        },
        targetPage: 'carecircle',
        actionLabel: { en: 'Open CareCircle', kn: 'CareCircle ತೆರೆಯಿರಿ', te: 'CareCircle తెరవండి' },
      },
      {
        id: 'cg-2',
        label: {
          en: 'Preview caregiver story adaptation',
          kn: 'ಆರೈಕೆದಾರರ ಕಥೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ನೋಡಿ',
          te: 'సంరక్షకుడి కేర్ స్టోరీ చూడండి',
        },
        detail: {
          en: 'See how CORE adapts when a family member assists an older parent.',
          kn: 'ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಸಹಾಯ ಮಾಡುವ ಕಾಲ್ಪನಿಕ ಪಯಣವನ್ನು ನೋಡಿ.',
          te: 'సంరక్షకుడికి CORE ఎలా సహాయపడుతుందో చూడండి.',
        },
        targetPage: 'stories',
        actionLabel: { en: 'Open Care Stories', kn: 'ಆರೈಕೆ ಕಥೆಗಳು', te: 'కేర్ స్టోరీస్' },
      },
    ],
  },
  {
    id: 'find-features',
    title: {
      en: 'Finding relevant website features',
      kn: 'ವೆಬ್‌ಸೈಟ್ ಸೌಲಭ್ಯಗಳನ್ನು ಹುಡುಕುವುದು',
      te: 'వెబ్‌సైట్ ఫీచర్లను కనుగొనడం',
    },
    summary: {
      en: 'Search across every CORE page, language toggle, FAQ, and accessibility setting instantly.',
      kn: 'CORE ನ ಎಲ್ಲಾ ವಿಭಾಗಗಳು, ಭಾಷೆ ಮತ್ತು ಪ್ರವೇಶ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ತಕ್ಷಣ ಹುಡುಕಿ.',
      te: 'CORE లోని అన్ని విభాగాలు, భాష మరియు సెట్టింగ్స్‌ను వెంటనే వెతకండి.',
    },
    primaryModule: 'intelligence',
    steps: [
      {
        id: 'find-1',
        label: {
          en: 'Use CORE Smart Search',
          kn: 'CORE ಸ್ಮಾರ್ಟ್ ಹುಡುಕಾಟ ಬಳಸಿ',
          te: 'CORE స్మార్ట్ సెర్చ్ వాడండి',
        },
        detail: {
          en: 'Search modules, settings, and FAQs instantly with keyboard or tap.',
          kn: 'ಯಾವುದೇ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಒಂದೇ ಪದದಿಂದ ಹುಡುಕಿ.',
          te: 'ఏ ఫీచర్‌నైనా వెంటనే వెతకండి.',
        },
        opensSearch: true,
        actionLabel: { en: 'Open Smart Search', kn: 'ಹುಡುಕಾಟ ತೆರೆಯಿರಿ', te: 'సెర్చ్ తెరవండి' },
      },
      {
        id: 'find-2',
        label: {
          en: 'Try CORE Intelligence 6-question path',
          kn: 'CORE Intelligence ಮಾರ್ಗದರ್ಶಿ ಬಳಸಿ',
          te: 'CORE Intelligence దారిని చూడండి',
        },
        detail: {
          en: 'Answer optional questions to reorder CORE modules around your goal.',
          kn: 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ CORE ಹಂತಗಳನ್ನು ಜೋಡಿಸಿಕೊಳ್ಳಿ.',
          te: 'మీ అవసరానికి అనుగుణంగా CORE దశలను పొందండి.',
        },
        targetPage: 'intelligence',
        actionLabel: { en: 'Open CORE Intelligence', kn: 'Intelligence ತೆರೆಯಿರಿ', te: 'Intelligence తెరవండి' },
      },
    ],
  },
];

interface PageContextEntry {
  title: Record<Language, string>;
  contextSummary: string;
  prompts: Array<Record<Language, string>>;
}

const PAGE_CONTEXT_CONFIG: Record<PageView, PageContextEntry> = {
  home: {
    title: { en: 'Home Overview', kn: 'ಮುಖಪುಟ', te: 'హోమ్ పేజీ' },
    contextSummary: 'User is on the CORE Home page viewing accessibility overview, quick actions, and module directory.',
    prompts: [
      {
        en: 'What should I bring for my hospital visit?',
        kn: 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ನಾನು ಏನು ತರಬೇಕು?',
        te: 'ఆసుపత్రి సందర్శనకు నేను ఏమి తీసుకురావాలి?',
      },
      {
        en: 'How do I turn on larger text and voice guidance?',
        kn: 'ದೊಡ್ಡ ಅಕ್ಷರ ಮತ್ತು ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಹೇಗೆ ಆನ್ ಮಾಡುವುದು?',
        te: 'పెద్ద అక్షరాలు మరియు వాయిస్ సహాయం ఎలా ఆన్ చేయాలి?',
      },
      {
        en: 'Where do I start the 7-step demo walkthrough?',
        kn: '೭-ಹಂತದ ಡೆಮೊ ಎಲ್ಲಿಂದ ಪ್ರಾರಂಭಿಸಬೇಕು?',
        te: '7-దశల డెమో ఎక్కడ నుండి ప్రారంభించాలి?',
      },
    ],
  },
  appointment: {
    title: { en: 'Hear My Appointment', kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ', te: 'అపాయింట్‌మెంట్ వినండి' },
    contextSummary: 'User is viewing Hear My Appointment (spoken appointment readout, hospital counter directions, and demo attendance confirmation).',
    prompts: [
      {
        en: 'What do the preparation steps on this appointment card mean?',
        kn: 'ಈ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾರ್ಡ್‌ನ ಸಿದ್ಧತಾ ನಿಯಮಗಳ ಅರ್ಥವೇನು?',
        te: 'ఈ అపాయింట్‌మెంట్ కార్డులోని తయారీ సూచనల అర్థం ఏమిటి?',
      },
      {
        en: 'How do I confirm or change my visit slot?',
        kn: 'ನನ್ನ ಭೇಟಿಯನ್ನು ದೃಢೀಕರಿಸುವುದು ಅಥವಾ ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?',
        te: 'నా సందర్శనను నిర్ధారించడం లేదా మార్చడం ఎలా?',
      },
      {
        en: 'How do I turn on voice playback speed or Kannada audio?',
        kn: 'ಧ್ವನಿ ವೇಗ ಅಥವಾ ಕನ್ನಡ ಆಡಿಯೋ ಹೇಗೆ ಬದಲಾಯಿಸುವುದು?',
        te: 'వాయిస్ వేగం లేదా తెలుగు ఆడియో ఎలా మార్చాలి?',
      },
    ],
  },
  journey: {
    title: { en: 'My Care Journey', kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ', te: 'నా ఆరోగ్య ప్రయాణం' },
    contextSummary: 'User is in My Care Journey (Before, During, After hospital visit timeline and optional AI organizational checklist builder).',
    prompts: [
      {
        en: 'What happens at the hospital registration desk during the visit?',
        kn: 'ಭೇಟಿಯ ಸಮಯದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಏನಾಗುತ್ತದೆ?',
        te: 'సందర్శన సమయంలో ఆసుపత్రి రిజిస్ట్రేషన్ కౌంటర్ వద్ద ఏమి జరుగుతుంది?',
      },
      {
        en: 'What should I keep ready after finishing a hospital test?',
        kn: 'ಪರೀಕ್ಷೆ ಮುಗಿದ ನಂತರ ನಾನು ಏನು ಗಮನಿಸಬೇಕು?',
        te: 'పరీక్ష పూర్తయిన తర్వాత నేను ఏమి గమనించాలి?',
      },
      {
        en: 'Can I print my completed checklist as a Visit Summary?',
        kn: 'ಪೂರ್ಣಗೊಂಡ ಪಟ್ಟಿಯನ್ನು ವಿಸಿಟ್ ಸಾರಾಂಶವಾಗಿ ಪ್ರಿಂಟ್ ಮಾಡಬಹುದೇ?',
        te: 'పూర్తయిన జాబితాను విజిట్ సారాంశంగా ప్రింట్ చేయవచ్చా?',
      },
    ],
  },
  clarity: {
    title: { en: 'CORE Clarity AI', kn: 'CORE Clarity ಸರಳ ವಿವರಣೆ', te: 'CORE Clarity సులభ వివరణ' },
    contextSummary: 'User is in CORE Clarity AI / Explain It Simply (turning complex hospital phrases and abbreviations into plain Kannada, Telugu, or English).',
    prompts: [
      {
        en: 'Explain what registration counter & OPD mean simply',
        kn: 'ನೋಂದಣಿ ಕೌಂಟರ್ ಮತ್ತು OPD ಎಂದರೇನು?',
        te: 'రిజిస్ట్రేషన్ కౌంటర్ మరియు OPD అంటే ఏమిటి?',
      },
      {
        en: 'What questions should I ask staff about fasting instructions?',
        kn: 'ಉಪವಾಸ ಸೂಚನೆ ಬಗ್ಗೆ ಸಿಬ್ಬಂದಿಗೆ ಯಾವ ಪ್ರಶ್ನೆ ಕೇಳಬೇಕು?',
        te: 'ఉపవాస సూచన గురించి సిబ్బందిని ఏ ప్రశ్నలు అడగాలి?',
      },
      {
        en: 'How do I verify an AI simplification safely?',
        kn: 'AI ನೀಡಿದ ವಿವರಣೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?',
        te: 'AI ఇచ్చిన వివరణను సురక్షితంగా సరిచూసుకోవడం ఎలా?',
      },
    ],
  },
  carecircle: {
    title: { en: 'CareCircle Support', kn: 'CareCircle ಕುಟುಂಬ ನೆರವು', te: 'CareCircle కుటుంబ సహాయం' },
    contextSummary: 'User is in CareCircle (patient-consented non-clinical caregiver summary preview and downloadable handoff card).',
    prompts: [
      {
        en: 'What information is hidden from caregivers by default?',
        kn: 'ಆರೈಕೆದಾರರಿಂದ ಯಾವ ಮಾಹಿತಿಯನ್ನು ಮರೆಮಾಡಲಾಗಿದೆ?',
        te: 'సంరక్షకుల నుండి ఏ సమాచారం దాచి ఉంచబడింది?',
      },
      {
        en: 'Can I withdraw caregiver consent at any time?',
        kn: 'ನಾನು ಯಾವಾಗ ಬೇಕಾದರೂ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದೇ?',
        te: 'నేను ఎప్పుడైనా అనుమతిని రద్దు చేయవచ్చా?',
      },
      {
        en: 'Does CareCircle send external messages right now?',
        kn: 'CareCircle ಈಗ ಹೊರಗಿನ ಸಂದೇಶಗಳನ್ನು ಕಳುಹಿಸುತ್ತದೆಯೇ?',
        te: 'CareCircle ఇప్పుడు బయటికి మెసేజ్లు పంపుతుందా?',
      },
    ],
  },
  passport: {
    title: { en: 'My Visit Passport', kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್', te: 'నా విజిట్ పాస్‌పోర్ట్' },
    contextSummary: 'User is viewing My Visit Passport (printable/saveable bilingual hospital visit card with QR demo preview and checklist).',
    prompts: [
      {
        en: 'How do I save or print My Visit Passport as a PDF?',
        kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಅನ್ನು PDF ಆಗಿ ಉಳಿಸುವುದು ಹೇಗೆ?',
        te: 'విజిట్ పాస్‌పోర్ట్‌ను PDF గా సేవ్ చేయడం ఎలా?',
      },
      {
        en: 'Which papers should I carry alongside this card?',
        kn: 'ಈ ಕಾರ್ಡ್ ಜೊತೆಗೆ ಯಾವ ಕಾಗದಗಳನ್ನು ತೆಗೆದುಕೊಂಡು ಹೋಗಬೇಕು?',
        te: 'ఈ కార్డుతో పాటు ఏ పత్రాలు తీసుకువెళ్ళాలి?',
      },
      {
        en: 'Who can I show this passport to at the hospital?',
        kn: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಈ ಪಾಸ್‌ಪೋರ್ಟ್ ಅನ್ನು ಯಾರಿಗೆ ತೋರಿಸಬಹುದು?',
        te: 'ఆసుపత్రిలో ఈ పాస్‌పోర్ట్‌ను ఎవరికి చూపించవచ్చు?',
      },
    ],
  },
  reminders: {
    title: { en: 'Reminders & Alerts', kn: 'ಜ್ಞಾಪನೆಗಳು', te: 'రిమైండర్లు' },
    contextSummary: 'User is on the Reminders page exploring local calendar (.ics) export, browser reminder preview, and simulated Voice/SMS/WhatsApp demonstrations.',
    prompts: [
      {
        en: 'Which reminder tools work locally vs. require hospital telecom setup?',
        kn: 'ಯಾವ ಜ್ಞಾಪನೆಗಳು ಈಗಲೇ ಕೆಲಸ ಮಾಡುತ್ತವೆ ಮತ್ತು ಯಾವುದಕ್ಕೆ ಆಸ್ಪತ್ರೆ ಸೇವೆ ಬೇಕು?',
        te: 'ఏ రిమైండర్లు ఇప్పుడే పనిచేస్తాయి, వేటికి ఆసుపత్రి నెట్‌వర్క్ అవసరం?',
      },
      {
        en: 'How do I save a calendar (.ics) reminder on my phone?',
        kn: 'ನನ್ನ ಫೋನ್‌ನಲ್ಲಿ ಕ್ಯಾಲೆಂಡರ್ (.ics) ಜ್ಞಾಪನೆ ಉಳಿಸುವುದು ಹೇಗೆ?',
        te: 'నా ఫోన్‌లో క్యాలೆಂಡర్ (.ics) రిమైండర్ సేవ్ చేయడం ఎలా?',
      },
    ],
  },
  reschedule: {
    title: { en: 'Reschedule Request', kn: 'ದಿನಾಂಕ ಬದಲಾವಣೆ', te: 'తేదీ మార్పు' },
    contextSummary: 'User is in the 5-step Reschedule flow selecting an alternative morning or afternoon hospital slot (demo state).',
    prompts: [
      {
        en: 'What should I verify with the hospital before changing a scan date?',
        kn: 'ದಿನಾಂಕ ಬದಲಾಯಿಸುವ ಮೊದಲು ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಏನು ಪರಿಶೀಲಿಸಬೇಕು?',
        te: 'తేదీ మార్చే ముందు ఆసుపత్రిలో ఏమి నిర్ధారించుకోవాలి?',
      },
      {
        en: 'How do I pick an easier morning transport slot?',
        kn: 'ಪ್ರಯಾಣಕ್ಕೆ ಸುಲಭವಾದ ಬೆಳಗಿನ ಸಮಯ ಹೇಗೆ ಆರಿಸುವುದು?',
        te: 'ప్రయాణానికి సులభమైన ఉదయం సమయాన్ని ఎలా ఎంచుకోవాలి?',
      },
    ],
  },
  carecompass: {
    title: { en: 'CORE CareCompass', kn: 'CORE CareCompass ಪಟ್ಟಿ', te: 'CORE CareCompass జాబితా' },
    contextSummary: 'User is in CORE CareCompass (editable categorized preparation checklist, .ics calendar export, and local browser notifications).',
    prompts: [
      {
        en: 'What does "Verify With Clinic" mean on checklist items?',
        kn: 'ಪಟ್ಟಿಯಲ್ಲಿ "ಆಸ್ಪತ್ರೆಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ" ಎಂದರೇನು?',
        te: 'జాబితాలో "క్లినిక్‌లో నిర్ధారించండి" అంటే ఏమిటి?',
      },
      {
        en: 'How do I add or reorder my own visit reminders?',
        kn: 'ನನ್ನ ಸ್ವಂತ ಜ್ಞಾಪನೆಗಳನ್ನು ಸೇರಿಸುವುದು ಅಥವಾ ಕ್ರಮ ಬದಲಿಸುವುದು ಹೇಗೆ?',
        te: 'నా స్వంత రిమైండర్లను జోడించడం లేదా క్రమం మార్చడం ఎలా?',
      },
    ],
  },
  careflow: {
    title: { en: 'CORE CareFlow', kn: 'CORE CareFlow ಮಾರ್ಗ', te: 'CORE CareFlow మార్గం' },
    contextSummary: 'User is in CORE CareFlow stepping through hospital-navigation hurdle decision trees (lost slip, delayed bus, wrong counter).',
    prompts: [
      {
        en: 'What should I do if I arrive late to a hospital counter?',
        kn: 'ಆಸ್ಪತ್ರೆ ಕೌಂಟರ್‌ಗೆ ತಡವಾಗಿ ತಲುಪಿದರೆ ಏನು ಮಾಡಬೇಕು?',
        te: 'ఆసుపత్రి కౌంటర్‌కు ఆలస్యంగా వెళితే ఏమి చేయాలి?',
      },
      {
        en: 'Where should I ask if my referral slip is misplaced?',
        kn: 'ಶಿಫಾರಸು ಚೀಟಿ ಕಳೆದುಹೋದರೆ ಎಲ್ಲಿ ವಿಚಾರಿಸಬೇಕು?',
        te: 'రిఫరల్ చీటీ పోతే ఎక్కడ అడగాలి?',
      },
    ],
  },
  intelligence: {
    title: { en: 'CORE Intelligence', kn: 'CORE ವೈಯಕ್ತಿಕ ಮಾರ್ಗ', te: 'CORE వ్యక్తిగత మార్గం' },
    contextSummary: 'User is in CORE Intelligence configuring a rule-based adaptive navigation pathway.',
    prompts: [
      {
        en: 'How does CORE Intelligence order my steps?',
        kn: 'CORE Intelligence ನನ್ನ ಹಂತಗಳನ್ನು ಹೇಗೆ ಜೋಡಿಸುತ್ತದೆ?',
        te: 'CORE Intelligence నా దశలను ఎలా క్రమబద్ధీకరిస్తుంది?',
      },
    ],
  },
  voicebridge: {
    title: { en: 'CORE VoiceBridge', kn: 'CORE ಧ್ವನಿ ಸೇತು', te: 'CORE వాయిస్ బ్రిడ్జ్' },
    contextSummary: 'User is in CORE VoiceBridge exploring speech synthesis, microphone speech input, and text fallbacks.',
    prompts: [
      {
        en: 'What if my browser does not have a Kannada or Telugu voice?',
        kn: 'ನನ್ನ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ ಅಥವಾ ತೆಲುಗು ಧ್ವನಿ ಇಲ್ಲದಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?',
        te: 'నా బ్రౌజర్‌లో తెలుగు లేదా కన్నడ వాయిస్ లేకపోతే ఏమి చేయాలి?',
      },
    ],
  },
  sense: {
    title: { en: 'CORE Sense', kn: 'CORE Sense ತಿಳುವಳಿಕೆ', te: 'CORE Sense అవగాహన' },
    contextSummary: 'User is in CORE Sense practicing plain-language quizzes and Teach-Back comprehension checks.',
    prompts: [
      {
        en: 'How does the Teach-Back method help patients?',
        kn: 'Teach-Back ವಿಧಾನವು ರೋಗಿಗಳಿಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?',
        te: 'Teach-Back పద్ధతి రోగులకు ఎలా సహాయపడుతుంది?',
      },
    ],
  },
  stories: {
    title: { en: 'Care Stories', kn: 'ಆರೈಕೆ ಕಥೆಗಳು', te: 'కేర్ స్టోరీస్' },
    contextSummary: 'User is reading interactive fictional Care Stories demonstrating low-literacy, senior, and caregiver adaptations.',
    prompts: [
      {
        en: 'How does Comfort Mode adapt for elderly patients?',
        kn: 'ಹಿರಿಯ ರೋಗಿಗಳಿಗೆ ಕಂಫರ್ಟ್ ಮೋಡ್ ಹೇಗೆ ಬದಲಾಗುತ್ತದೆ?',
        te: 'వృద్ధుల కోసం కంఫర్ట్ మోడ్ ఎలా మారుతుంది?',
      },
    ],
  },
  showcase: {
    title: { en: '7-Step Walkthrough', kn: '೭-ಹಂತದ ಪ್ರದರ್ಶನ', te: '7-దశల ప్రదర్శన' },
    contextSummary: 'User is in the CORE Innovation Walkthrough tracking fictional patient milestones.',
    prompts: [
      {
        en: 'What is included in this fictional demonstration flow?',
        kn: 'ಈ ಕಾಲ್ಪನಿಕ ಪ್ರದರ್ಶನದಲ್ಲಿ ಏನೆಲ್ಲಾ ಒಳಗೊಂಡಿದೆ?',
        te: 'ఈ కల్పిత డెమో ప్రయాణంలో ఏమి ఉన్నాయి?',
      },
    ],
  },
  'accessibility-lab': {
    title: { en: 'Accessibility Lab', kn: 'ಪ್ರವೇಶ್ಯತೆ ಪ್ರಯೋಗಾಲಯ', te: 'యాక్సెసిబిలిటీ ల్యాబ్' },
    contextSummary: 'User is in Accessibility Lab comparing 5 live accessibility and motion profiles.',
    prompts: [
      {
        en: 'How do large text and reduced motion settings persist?',
        kn: 'ದೊಡ್ಡ ಅಕ್ಷರ ಮತ್ತು ಚಲನೆ ಕಡಿಮೆ ಮಾಡುವ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಹೇಗೆ ಉಳಿಯುತ್ತವೆ?',
        te: 'పెద్ద అక్షరాలు మరియు తక్కువ మోషన్ సెట్టింగ్స్ ఎలా సేవ్ అవుతాయి?',
      },
    ],
  },
  insights: {
    title: { en: 'CORE Insights', kn: 'CORE ವಿಶ್ಲೇಷಣೆ', te: 'CORE విశ్లేషణ' },
    contextSummary: 'User is inspecting CORE Insights ethical zero-PII demonstration analytics.',
    prompts: [
      {
        en: 'Why does CORE avoid storing personal health analytics?',
        kn: 'CORE ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಡೇಟಾವನ್ನು ಏಕೆ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ?',
        te: 'CORE వ్యక్తిగత ఆరోగ్య డేటాను ఎందుకు సేకరించదు?',
      },
    ],
  },
  'how-it-works': {
    title: { en: 'How CORE Works', kn: 'CORE ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', te: 'CORE ఎలా పనిచేస్తుంది' },
    contextSummary: 'User is viewing How CORE Works technical and accessibility overview.',
    prompts: [
      {
        en: 'How does CORE help people who cannot read English SMS?',
        kn: 'ಇಂಗ್ಲಿಷ್ SMS ಓದಲು ಬಾರದವರಿಗೆ CORE ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?',
        te: 'ఇంగ్లీష్ SMS చదవలేని వారికి CORE ఎలా సహాయపడుతుంది?',
      },
    ],
  },
  help: {
    title: { en: 'Get Help & Counters', kn: 'ಸಹಾಯ ಮತ್ತು ಕೌಂಟರ್‌ಗಳು', te: 'సహాయం & కౌంటర్లు' },
    contextSummary: 'User is on Get Help looking for hospital helpdesk guidance and ASHA worker support info.',
    prompts: [
      {
        en: 'Who can help me at a government hospital reception?',
        kn: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯ ಸ್ವಾಗತ ಕೌಂಟರ್‌ನಲ್ಲಿ ನನಗೆ ಯಾರು ಸಹಾಯ ಮಾಡುತ್ತಾರೆ?',
        te: 'ప్రభుత్వ ఆసుపత్రి రిసెప్షన్‌లో నాకు ఎవరు సహాయం చేస్తారు?',
      },
    ],
  },
  about: {
    title: { en: 'About CORE', kn: 'CORE ಕುರಿತು', te: 'CORE గురించి' },
    contextSummary: 'User is reading About CORE mission and inclusive healthcare accessibility principles.',
    prompts: [
      {
        en: 'What is CORE’s mission for rural patients?',
        kn: 'ಗ್ರಾಮೀಣ ರೋಗಿಗಳಿಗೆ CORE ನ ಉದ್ದೇಶವೇನು?',
        te: 'గ్రామీణ రోగుల కోసం CORE లక్ష్యం ఏమిటి?',
      },
    ],
  },
  staff: {
    title: { en: 'Hospital Desk Prototype', kn: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ವಿಭಾಗ', te: 'ఆసుపత్రి సిబ్బంది విభాగం' },
    contextSummary: 'User is viewing the simulated Hospital Staff Desk prototype.',
    prompts: [
      {
        en: 'What external systems are needed to connect this to a real hospital?',
        kn: 'ಇದನ್ನು ನಿಜವಾದ ಆಸ್ಪತ್ರೆಗೆ ಜೋಡಿಸಲು ಯಾವ ವ್ಯವಸ್ಥೆ ಬೇಕು?',
        te: 'దీనిని నిజమైన ఆసుపత్రికి అనుసంధానించడానికి ఏమి అవసరం?',
      },
    ],
  },
};

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#322826]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

const FormattedAssistantMessage: React.FC<{
  text: string;
  fontClass?: string;
}> = ({ text, fontClass = 'font-body' }) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push(
        <h4
          key={`h-${i}`}
          className="font-display text-lg sm:text-[19px] font-bold text-[#322826] leading-snug pt-2 first:pt-0"
        >
          {renderInlineFormatting(headingMatch[2])}
        </h4>
      );
      i += 1;
      continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1.5 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="pl-0.5 leading-[1.7]">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1.5 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="pl-0.5 leading-[1.7]">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push(
      <p key={`p-${i}`} className="leading-[1.7]">
        {renderInlineFormatting(paraLines.join(' '))}
      </p>
    );
  }

  return (
    <div
      className={`space-y-3 text-[15.5px] sm:text-[16.5px] leading-[1.7] text-[#322826] break-words ${fontClass}`}
    >
      {blocks}
    </div>
  );
};

interface CoreCompanionProps {
  language: Language;
  currentPage: PageView;
  comfortSettings: ComfortSettings;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  onPageChange: (page: PageView) => void;
  onOpenComfortMode: () => void;
  onOpenSearch?: () => void;
  onUpdateComplexity?: (next: ExplanationComplexity) => void;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  reduceMotion?: boolean;
  resetSignal?: number;
}

export const CoreCompanion: React.FC<CoreCompanionProps> = ({
  language,
  currentPage,
  comfortSettings,
  isOpen,
  onToggleOpen,
  onPageChange,
  onOpenComfortMode,
  onOpenSearch,
  onUpdateComplexity,
  aiConsentGranted,
  onAcceptAiConsent,
  reduceMotion = false,
  resetSignal = 0,
}) => {
  const getGreeting = (lang: Language): string => {
    if (lang === 'kn') {
      return 'ನಮಸ್ಕಾರ! ನಾನು CORE AI ಸಹಾಯಕ (Google Gemini ಆಧಾರಿತ). ಆಸ್ಪತ್ರೆ ಭೇಟಿಯ ಸಿದ್ಧತೆ, ಪದಗಳ ಸರಳ ವಿವರಣೆ ಮತ್ತು ವೆಬ್‌ಸೈಟ್ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ನಾನು ನೆರವಾಗಬಲ್ಲೆ. (ಗಮನಿಸಿ: ನಾನು ವೈದ್ಯರಲ್ಲ).';
    }
    if (lang === 'te') {
      return 'నమస్కారం! నేను CORE AI సహాయకుడిని (Google Gemini ఆధారితం). ఆసుపత్రి సందర్శన తయారీ, పదాల సులభ వివరణ మరియు వెబ్‌సైట్ నావిగేషన్‌లో నేను సహాయం చేస్తాను. (గమనిక: నేను డాక్టర్‌ని కాదు).';
    }
    return 'Hello! I am CORE AI Companion (powered by Google Gemini). Ask any hospital navigation or preparation question, switch explanation depth above, or tap the microphone to speak. I am an AI guide, not a clinician.';
  };

  // Synchronized chat response language (defaults to site language; can be overridden per-chat without changing site UI)
  const [chatLanguage, setChatLanguage] = useState<Language>(language);
  const [localComplexity, setLocalComplexity] = useState<ExplanationComplexity>(
    comfortSettings.explanationComplexity || 'simple'
  );

  const [mode, setMode] = useState<'guide' | 'chat'>('chat');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(GUIDED_WORKFLOWS[0].id);
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>({});
  const [stepTip, setStepTip] = useState<{ text: string; safety?: string } | null>(null);
  const [tipLoading, setTipLoading] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);

  const [messages, setMessages] = useState<CompanionMessage[]>([
    { id: 'welcome', sender: 'assistant', text: getGreeting(language), responseLanguage: language },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [safetyInfoOpen, setSafetyInfoOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [dismissedMismatchForLang, setDismissedMismatchForLang] = useState<Language | null>(null);

  // Message actions state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [translateMenuOpenId, setTranslateMenuOpenId] = useState<string | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [actionFeedbackError, setActionFeedbackError] = useState<string | null>(null);

  // Voice dictation & TTS state
  const [isListening, setIsListening] = useState(false);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<SpeechRate>(0.9);
  const [playbackSnap, setPlaybackSnap] = useState<SpeechPlaybackSnapshot>(() =>
    speechService.getPlaybackSnapshot()
  );
  const recognitionRef = useRef<any>(null);

  const [mobileViewport, setMobileViewport] = useState<{ height: number; offsetTop: number } | null>(
    null
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageStartRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const pendingReplyScrollRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeComplexity: ExplanationComplexity =
    comfortSettings.explanationComplexity || localComplexity;

  // Keep chatLanguage synchronized whenever global site language changes
  useEffect(() => {
    setChatLanguage(language);
    setDismissedMismatchForLang(null);
    setMessages((prev) => {
      // If user hasn't started chatting yet, refresh welcome greeting cleanly in the new language
      if (prev.length === 1 && (prev[0].id === 'welcome' || prev[0].id.startsWith('welcome-'))) {
        return [
          {
            id: `welcome-${language}-${resetSignal}`,
            sender: 'assistant',
            text: getGreeting(language),
            responseLanguage: language,
          },
        ];
      }
      return prev;
    });
  }, [language, resetSignal]);

  useEffect(() => {
    if (resetSignal > 0) {
      speechService.stop();
      setMessages([
        {
          id: `welcome-${language}-${resetSignal}`,
          sender: 'assistant',
          text: getGreeting(language),
          responseLanguage: language,
        },
      ]);
      setLastFailedPrompt(null);
      setCompletedStepIds({});
      setStepTip(null);
      setTipError(null);
      setSafetyInfoOpen(false);
      setSuggestionsOpen(false);
      setDismissedMismatchForLang(null);
      setVoiceStatusMessage(null);
      setActionFeedbackError(null);
    }
  }, [resetSignal, language]);

  // Subscribe to speech playback state and async browser voice changes
  useEffect(() => {
    const unsub = speechService.subscribe((snap) => {
      setPlaybackSnap(snap);
      if (snap.lastError) {
        setVoiceStatusMessage(snap.lastError.message);
      }
    });
    const unsubVoices = speechService.subscribeVoices(() => {
      // Keep snapshot voice availability fresh when async voices finish loading
    });
    return () => {
      unsub();
      unsubVoices();
    };
  }, []);

  // Cleanup active mic on close/unmount
  useEffect(() => {
    if (!isOpen && isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
      setIsListening(false);
    }
  }, [isOpen, isListening]);

  // Track mobile visualViewport so virtual keyboard never obscures chat composer
  useEffect(() => {
    if (!isOpen || isMinimized || typeof window === 'undefined') {
      setMobileViewport(null);
      return;
    }

    const updateViewport = () => {
      if (window.innerWidth >= 640) {
        setMobileViewport(null);
        return;
      }
      const vv = window.visualViewport;
      if (vv) {
        setMobileViewport({
          height: Math.round(vv.height),
          offsetTop: Math.round(vv.offsetTop),
        });
      } else {
        setMobileViewport({
          height: window.innerHeight,
          offsetTop: 0,
        });
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, [isOpen, isMinimized]);

  const scrollToBottom = (force = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (force || isNearBottomRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  const handleMessagesScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentTop = container.scrollTop;
    if (currentTop < lastScrollTopRef.current - 8) {
      pendingReplyScrollRef.current = false;
    }
    lastScrollTopRef.current = currentTop;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nearBottom = distanceFromBottom <= 88;
    isNearBottomRef.current = nearBottom;
    setShowScrollToBottom(!nearBottom && messages.length > 1);
  };

  useEffect(() => {
    if (!isOpen || isMinimized || mode !== 'chat') return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    if (lastMsg.sender === 'user') {
      scrollToBottom(true);
      return;
    }

    if (pendingReplyScrollRef.current || isNearBottomRef.current) {
      pendingReplyScrollRef.current = false;
      const startEl = latestMessageStartRef.current;
      if (startEl && lastMsg.id !== 'welcome' && !lastMsg.id.startsWith('welcome-')) {
        const targetTop = Math.max(0, startEl.offsetTop - 16);
        container.scrollTo({
          top: targetTop,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      } else {
        scrollToBottom(false);
      }
    }
  }, [messages, isOpen, isMinimized, mode, reduceMotion]);

  useEffect(() => {
    if (isLoading && isOpen && !isMinimized && mode === 'chat' && isNearBottomRef.current) {
      scrollToBottom(false);
    }
  }, [isLoading, isOpen, isMinimized, mode]);

  const activePageCtx = PAGE_CONTEXT_CONFIG[currentPage] || PAGE_CONTEXT_CONFIG.home;
  const activeWorkflow =
    GUIDED_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || GUIDED_WORKFLOWS[0];

  const wfCompletedCount = activeWorkflow.steps.filter((s) => completedStepIds[s.id]).length;
  const wfTotal = activeWorkflow.steps.length;
  const wfPct = Math.round((wfCompletedCount / wfTotal) * 100);
  const wfAllDone = wfCompletedCount === wfTotal;

  // Detect live language mismatch as user types or dictates
  const detection = detectInputLanguage(inputText);
  const suggestedInputLanguage: Language | null =
    detection.detected &&
    detection.detected !== chatLanguage &&
    dismissedMismatchForLang !== detection.detected
      ? detection.detected
      : null;

  const handleSelectComplexity = (next: ExplanationComplexity) => {
    setLocalComplexity(next);
    onUpdateComplexity?.(next);
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
    setMessages([
      {
        id: `welcome-${chatLanguage}-${Date.now()}`,
        sender: 'assistant',
        text: getGreeting(chatLanguage),
        responseLanguage: chatLanguage,
      },
    ]);
    setLastFailedPrompt(null);
    setDismissedMismatchForLang(null);
    setTranslateMenuOpenId(null);
    setActionFeedbackError(null);
    setVoiceStatusMessage(null);
  };

  const toggleGuidedStep = (stepId: string) => {
    setCompletedStepIds((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleGetGentleWorkflowTip = async (clarifyMore = false) => {
    if (!aiConsentGranted || tipLoading) return;
    setTipLoading(true);
    setTipError(null);
    try {
      const prompt = clarifyMore
        ? `Please simplify your guidance even more in 2 very short encouraging sentences for this hospital preparation goal: "${activeWorkflow.title.en}". Do not invent appointments or give medical advice.`
        : `Give a short, warm 2-sentence orientation tip for someone working on: "${activeWorkflow.title.en}". Mention which CORE step helps most without inventing bookings or medical conclusions.`;

      const res = await askCompanionAi({
        message: prompt,
        language: chatLanguage,
        complexity: clarifyMore ? 'extra_simple' : activeComplexity,
        guidedMode: true,
        voicePreferred: comfortSettings.readAloud,
        currentPage,
        pageContext: activePageCtx.contextSummary,
        history: [],
        consentAccepted: true,
      });
      setStepTip({ text: res.reply, safety: res.safetyNotice });
    } catch (err) {
      setTipError(formatAiErrorMessage(err, chatLanguage));
    } finally {
      setTipLoading(false);
    }
  };

  const sendMessageToGemini = async (
    rawText: string,
    options: {
      isRetry?: boolean;
      overrideLanguage?: Language;
      overrideComplexity?: ExplanationComplexity;
      actionIntent?: 'chat' | 'simplify' | 'elaborate';
      suppressUserBubble?: boolean;
    } = {}
  ) => {
    const cleaned = rawText.trim();
    if (!cleaned || isLoading) return;
    if (!aiConsentGranted) {
      setSafetyInfoOpen(true);
      return;
    }

    const targetLang = options.overrideLanguage || chatLanguage;
    const targetComplexity = options.overrideComplexity || activeComplexity;
    const inputDetection = detectInputLanguage(cleaned);

    const baseMessages = options.isRetry
      ? messages.filter((m, idx) => !(idx === messages.length - 1 && m.sender === 'error'))
      : messages;

    const nextMessages: CompanionMessage[] =
      options.isRetry || options.suppressUserBubble
        ? baseMessages
        : [
            ...baseMessages,
            {
              id: `u-${Date.now()}`,
              sender: 'user',
              text: cleaned,
              detectedInputLang: inputDetection.detected ?? undefined,
            },
          ];

    pendingReplyScrollRef.current = true;
    isNearBottomRef.current = true;
    setSuggestionsOpen(false);
    setTranslateMenuOpenId(null);
    setActionFeedbackError(null);
    setMessages(nextMessages);

    if (!options.isRetry && !options.suppressUserBubble) {
      setInputText('');
      setDismissedMismatchForLang(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    setLastFailedPrompt(null);
    setIsLoading(true);

    try {
      // Send clean conversation turns (excluding welcome/error bubbles) only after explicit consent
      const historyForApi = nextMessages
        .filter(
          (m): m is CompanionMessage & { sender: 'user' | 'assistant' } =>
            (m.sender === 'user' || m.sender === 'assistant') &&
            m.id !== 'welcome' &&
            !m.id.startsWith('welcome-')
        )
        .slice(-10)
        .map((m) => ({ role: m.sender, text: m.text }));

      const aiData = await askCompanionAi({
        message: cleaned,
        language: targetLang,
        complexity: targetComplexity,
        actionIntent: options.actionIntent || 'chat',
        guidedMode: comfortSettings.guidedMode,
        voicePreferred: comfortSettings.readAloud,
        currentPage,
        pageContext: activePageCtx.contextSummary,
        history: historyForApi,
        consentAccepted: true,
      });

      const resolvedLang = aiData.responseLanguage || targetLang;
      const mismatchedSourceLang =
        !options.suppressUserBubble &&
        inputDetection.detected &&
        inputDetection.detected !== resolvedLang
          ? inputDetection.detected
          : undefined;

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: aiData.reply,
          responseLanguage: resolvedLang,
          detectedInputLang: mismatchedSourceLang,
          suggestedPage: aiData.suggestedPage,
          suggestedActionLabel: aiData.suggestedActionLabel,
          followUpQuestion: aiData.followUpQuestion,
          safetyNotice: aiData.safetyNotice,
        },
      ]);
    } catch (err) {
      const msg = formatAiErrorMessage(err, targetLang);
      setLastFailedPrompt(cleaned);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'error',
          text: msg,
          responseLanguage: targetLang,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      setActionFeedbackError('Clipboard access is restricted in this browser.');
    }
  };

  const handleTranslateMessage = async (msg: CompanionMessage, targetLang: Language) => {
    if (!aiConsentGranted) {
      setSafetyInfoOpen(true);
      return;
    }
    if (translatingId) return;

    setTranslatingId(msg.id);
    setTranslateMenuOpenId(null);
    setActionFeedbackError(null);

    try {
      const res = await translateAiText({
        text: msg.text,
        targetLanguage: targetLang,
        consentAccepted: true,
      });

      setMessages((prev) =>
        prev.map((item) =>
          item.id === msg.id
            ? {
                ...item,
                translation: {
                  language: res.targetLanguage,
                  text: res.translatedText,
                  verificationNote: res.verificationNote,
                },
              }
            : item
        )
      );
    } catch (err) {
      setActionFeedbackError(formatAiErrorMessage(err, chatLanguage));
    } finally {
      setTranslatingId(null);
    }
  };

  const handleToggleVoiceDictation = () => {
    setVoiceStatusMessage(null);
    const SpeechRec = speechService.getSpeechRecognitionConstructor();

    if (!SpeechRec) {
      setVoiceStatusMessage(
        chatLanguage === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.'
          : chatLanguage === 'te'
          ? 'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ వాయిస్ రికగ్నిషన్ లేదు. దయచేసి క్రింద టైప్ చేయండి.'
          : 'Browser Speech Recognition is not supported here. Please type your question below.'
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
      // Stop any ongoing TTS before listening
      speechService.stop();
      const recognition = new SpeechRec();
      const locale = getSpeechRecognitionLocale(chatLanguage);
      recognition.lang = locale;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const baseDraft = inputText.trim();

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0]?.transcript || '';
        }
        const combined = baseDraft ? `${baseDraft} ${transcript.trim()}` : transcript.trim();
        setInputText(combined);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 108)}px`;
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errCode = event?.error || 'unknown';
        if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          setVoiceStatusMessage(
            chatLanguage === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.'
              : chatLanguage === 'te'
              ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి అనుమతి ఇవ్వండి లేదా టైప్ చేయండి.'
              : 'Microphone permission was denied. Allow mic access or continue by typing below.'
          );
        } else if (errCode === 'language-not-supported') {
          setVoiceStatusMessage(
            chatLanguage === 'kn'
              ? `ಈ ಬ್ರೌಸರ್ ${locale} ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.`
              : chatLanguage === 'te'
              ? `ఈ బ్రౌజర్ ${locale} వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వదు. దయచేసి టైప్ చేయండి.`
              : `This browser does not support ${locale} voice dictation. Please type your question below.`
          );
        } else {
          setVoiceStatusMessage(
            chatLanguage === 'kn'
              ? `ಧ್ವನಿ ಸೆರೆಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (${errCode}). ದಯವಿಟ್ಟು ಮತ್ತೆ ಒತ್ತಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.`
              : chatLanguage === 'te'
              ? `వాయిస్ అందుకోలేకపోయాము (${errCode}). దయచేసి మళ్ళీ ప్రయత్నించండి లేదా టైప్ చేయండి.`
              : `Voice input stopped (${errCode}). You can edit/type your question below.`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatusMessage(
        chatLanguage === 'kn'
          ? 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.'
          : chatLanguage === 'te'
          ? 'మైక్రోఫోన్ ప్రారంభించలేకపోయాము. దయచేసి టైప్ చేయండి.'
          : 'Could not start microphone in this browser environment. Please type below.'
      );
    }
  };

  const handleListenToggle = (text: string, lang: Language, itemId: string) => {
    if (playbackSnap.activeId === itemId && playbackSnap.status !== 'idle') {
      speechService.stop();
      return;
    }
    setVoiceStatusMessage(null);
    speechService.clearError();
    const audioLang = resolveSpeechLanguage(text, lang);
    speechService.speak(
      text,
      audioLang,
      {
        onError: (_reason, info) => {
          setVoiceStatusMessage(
            info?.message ||
              `Browser voice playback is unavailable for ${getAudioLanguageBadge(audioLang)} on this device.`
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

  const handleSpeechRateChange = (nextRate: SpeechRate) => {
    setSpeechRate(nextRate);
    speechService.setRate(nextRate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessageToGemini(inputText);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 108)}px`;
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessageToGemini(inputText);
    }
  };

  const latestMessageIndex = messages.length - 1;

  const mobileOverlayStyle: React.CSSProperties | undefined =
    isOpen && !isMinimized && mobileViewport
      ? {
          top: `${mobileViewport.offsetTop + 8}px`,
          height: `${Math.max(320, mobileViewport.height - 16)}px`,
          left: '8px',
          right: '8px',
        }
      : undefined;

  return (
    <>
      {isOpen && !isMinimized && (
        <div
          style={mobileOverlayStyle}
          className={`fixed z-50 no-print flex flex-col bg-[#FCF9F5] border border-[#BEA06D]/75 rounded-3xl shadow-2xl overflow-hidden modal-soft-enter companion-drawer-transition ${
            mobileViewport ? 'w-auto' : 'inset-2 sm:inset-auto sm:bottom-5 sm:right-5'
          } ${
            isExpanded
              ? 'sm:w-[min(600px,calc(100vw-2.5rem))] sm:h-[min(86dvh,850px)]'
              : 'sm:w-[min(540px,calc(100vw-2.5rem))] sm:h-[min(80dvh,720px)]'
          }`}
          role="dialog"
          aria-modal="false"
          aria-label="CORE AI Companion"
        >
          {/* Compact Top Header */}
          <div className="shrink-0 bg-white border-b border-[#BEA06D]/25 px-3.5 py-2.5 sm:px-5 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <CoreMonogramMark size="sm" />
                <div className="min-w-0">
                  <div className="font-display text-lg sm:text-xl font-bold text-[#493C39] leading-none flex items-center gap-1.5 truncate">
                    <span className="truncate">
                      {chatLanguage === 'kn'
                        ? 'CORE AI ಸಹಾಯಕ'
                        : chatLanguage === 'te'
                        ? 'CORE AI సహాయకుడు'
                        : 'CORE Companion'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#8A6D3F] font-medium block mt-0.5 truncate">
                    {activePageCtx.title[language]}
                    {chatLanguage !== language && (
                      <> · AI: {getLanguageShortName(chatLanguage)}</>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {mode === 'chat' && (
                  <button
                    type="button"
                    onClick={handleNewConversation}
                    className="compact-chip min-h-[36px] px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 text-[#493C39] hover:border-[#C88F98] hover:text-[#8A6D3F] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    title={
                      chatLanguage === 'kn'
                        ? 'ಹೊಸ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ'
                        : chatLanguage === 'te'
                        ? 'కొత్త సంభాషణ ప్రారంభించండి'
                        : 'Start a New Conversation'
                    }
                  >
                    <SquarePen className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                    <span className="hidden xs:inline">
                      {chatLanguage === 'kn'
                        ? 'ಹೊಸ ಚಾಟ್'
                        : chatLanguage === 'te'
                        ? 'కొత్త చాట్'
                        : 'New Conversation'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onPageChange('voicebridge');
                    onToggleOpen(false);
                  }}
                  className="compact-chip min-h-[36px] px-2.5 py-1 rounded-full bg-[#A2B29B]/20 text-[#4A6347] hover:bg-[#A2B29B]/35 text-[11px] font-semibold hidden sm:inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  title="Open full CORE VoiceBridge workspace"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {chatLanguage === 'kn' ? 'ಧ್ವನಿ' : chatLanguage === 'te' ? 'వాయిస్' : 'VoiceBridge'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="compact-chip min-w-[36px] min-h-[36px] rounded-full text-[#493C39]/75 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 inline-flex items-center justify-center cursor-pointer"
                  aria-label="Minimize Companion"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded((e) => !e)}
                  className="compact-chip min-w-[36px] min-h-[36px] rounded-full text-[#493C39]/75 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 hidden sm:inline-flex items-center justify-center cursor-pointer"
                  aria-label={isExpanded ? 'Restore default chat size' : 'Expand chat window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleOpen(false)}
                  className="compact-chip min-w-[36px] min-h-[36px] rounded-full text-[#493C39]/75 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 inline-flex items-center justify-center cursor-pointer"
                  aria-label="Close Companion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Compact Mode Tabs + Collapsible Safety Trigger */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-xl p-0.5 flex-1 sm:flex-initial">
                <button
                  type="button"
                  onClick={() => setMode('chat')}
                  className={`compact-chip flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    mode === 'chat'
                      ? 'bg-[#C88F98] text-white shadow-xs'
                      : 'text-[#493C39] hover:bg-[#E6C1C4]/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {chatLanguage === 'kn'
                      ? 'CORE AI ಕೇಳಿ'
                      : chatLanguage === 'te'
                      ? 'CORE AI అడగండి'
                      : 'Ask CORE AI'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('guide')}
                  className={`compact-chip flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    mode === 'guide'
                      ? 'bg-[#BEA06D] text-white shadow-xs'
                      : 'text-[#493C39] hover:bg-[#E6C1C4]/20'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {chatLanguage === 'kn'
                      ? 'ಹಂತ ಮಾರ್ಗದರ್ಶಿ'
                      : chatLanguage === 'te'
                      ? 'దశల సహాయం'
                      : 'Step Guide'}
                  </span>
                </button>
              </div>

              {mode === 'chat' && (
                <button
                  type="button"
                  onClick={() => setSafetyInfoOpen((s) => !s)}
                  aria-expanded={safetyInfoOpen}
                  className={`compact-chip py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                    safetyInfoOpen
                      ? 'bg-[#E6C1C4]/30 border-[#C88F98] text-[#493C39]'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#8A6D3F] hover:border-[#C88F98]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                  <span>
                    {chatLanguage === 'kn'
                      ? 'ಸುರಕ್ಷತೆ'
                      : chatLanguage === 'te'
                      ? 'భద్రత'
                      : 'Safety & Info'}
                  </span>
                  {safetyInfoOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              )}
            </div>

            {/* Compact Chat Preferences Bar: Response Depth (Quick / Simple / Detailed) & AI Language */}
            {mode === 'chat' && (
              <div className="mt-2 pt-2 border-t border-[#BEA06D]/15 flex flex-wrap items-center justify-between gap-2">
                {/* 3 Explanation Settings */}
                <div
                  className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-lg p-0.5"
                  role="group"
                  aria-label="Explanation Depth"
                >
                  {(
                    [
                      {
                        id: 'extra_simple' as ExplanationComplexity,
                        icon: <Zap className="w-3 h-3 shrink-0" />,
                        label: { en: 'Quick Answer', kn: 'ಚಿಕ್ಕ ಉತ್ತರ', te: 'చిన్న సమాధానం' },
                      },
                      {
                        id: 'simple' as ExplanationComplexity,
                        icon: <BookOpen className="w-3 h-3 shrink-0" />,
                        label: { en: 'Simple', kn: 'ಸರಳ', te: 'సులభం' },
                      },
                      {
                        id: 'detailed' as ExplanationComplexity,
                        icon: <FileText className="w-3 h-3 shrink-0" />,
                        label: { en: 'Detailed', kn: 'ವಿವರವಾದ', te: 'వివరంగా' },
                      },
                    ] as const
                  ).map((opt) => {
                    const active = activeComplexity === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectComplexity(opt.id)}
                        className={`compact-chip px-2 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#493C39] text-white'
                            : 'text-[#493C39]/80 hover:text-[#493C39] hover:bg-[#E6C1C4]/20'
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label[chatLanguage]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explicit AI Response Language Control (chat-only; preserves global site language unless user switches site) */}
                <div
                  className="inline-flex items-center bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-lg p-0.5"
                  role="group"
                  aria-label="AI Response Language"
                >
                  {(['en', 'kn', 'te'] as const).map((langOpt) => (
                    <button
                      key={langOpt}
                      type="button"
                      onClick={() => {
                        setChatLanguage(langOpt);
                        setDismissedMismatchForLang(null);
                      }}
                      className={`compact-chip px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        chatLanguage === langOpt
                          ? 'bg-[#BEA06D] text-white'
                          : 'text-[#493C39]/80 hover:text-[#493C39]'
                      }`}
                    >
                      {langOpt === 'en' ? 'EN' : langOpt === 'kn' ? 'ಕನ್ನಡ' : 'తెలుగు'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Safety, Screen Context & Consent Banner */}
            {mode === 'chat' && (
              <div className="graceful-expand" data-open={safetyInfoOpen ? 'true' : 'false'}>
                <div>
                  <div className="mt-2.5 pt-2.5 border-t border-[#BEA06D]/20 space-y-2">
                    <div className="p-2.5 rounded-xl bg-[#E6C1C4]/22 border border-[#E6C1C4]/70 flex items-start gap-2 text-xs text-[#493C39] leading-relaxed">
                      <ShieldAlert className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                      <span>
                        {chatLanguage === 'kn'
                          ? 'AI ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ: ರೋಗನಿರ್ಣಯ, ಔಷಧಿ ಪ್ರಮಾಣ ಅಥವಾ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ. ಪ್ರಮುಖ ವಿವರಗಳನ್ನು ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ.'
                          : chatLanguage === 'te'
                          ? 'AI మార్గదర్శనం మాత్రమే: వ్యాధి నిర్ధారణ, మందుల మోతాదు లేదా అత్యవసర సలహాలు ఇవ్వదు. ముఖ్య వివరాలను ఆసుపత్రి సిబ్బందితో ధృవీకరించండి.'
                          : 'AI Guide Only — cannot diagnose conditions, prescribe medicines, or access confidential records. Verify medical instructions with hospital staff.'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                      <span className="text-[#8A6D3F] font-medium">
                        Context: <strong className="text-[#493C39]">{activePageCtx.title[language]}</strong>
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenComfortMode();
                            onToggleOpen(false);
                          }}
                          className="compact-chip text-xs font-semibold text-[#8A6D3F] underline hover:text-[#493C39] cursor-pointer"
                        >
                          {chatLanguage === 'kn'
                            ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
                            : chatLanguage === 'te'
                            ? 'సెట్టింగ్స్'
                            : 'Settings'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onPageChange('help');
                            onToggleOpen(false);
                          }}
                          className="compact-chip text-xs font-semibold text-[#C88F98] hover:text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>
                            {chatLanguage === 'kn' ? 'ಸಹಾಯ' : chatLanguage === 'te' ? 'సహాయం' : 'Get Help'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <AiConsentNotice
                      language={chatLanguage}
                      consentGranted={aiConsentGranted}
                      onAcceptConsent={onAcceptAiConsent}
                      compact
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {mode === 'guide' ? (
            /* MODE 1: INTERACTIVE STEP GUIDE */
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-5 space-y-4 bg-[#FCF9F5]">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider block">
                  {language === 'kn'
                    ? '೧. ನಿಮಗೆ ಬೇಕಾದ ಸಹಾಯವನ್ನು ಆರಿಸಿ'
                    : language === 'te'
                    ? '1. మీకు కావాల్సిన పనిని ఎంచుకోండి'
                    : '1. Choose what you would like help with'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {GUIDED_WORKFLOWS.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => {
                        setSelectedWorkflowId(wf.id);
                        setStepTip(null);
                        setTipError(null);
                      }}
                      className={`compact-chip text-left px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                        wf.id === selectedWorkflowId
                          ? 'bg-[#493C39] text-white border-[#493C39]'
                          : 'bg-white border-[#BEA06D]/35 text-[#493C39] hover:border-[#C88F98]'
                      }`}
                    >
                      {wf.title[language]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#BEA06D]/40 rounded-2xl p-4 sm:p-5 space-y-3.5 soft-fade-up">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-display text-lg sm:text-xl font-bold text-[#493C39] leading-snug">
                      {activeWorkflow.title[language]}
                    </h4>
                    <p className="text-sm text-[#493C39]/85 leading-relaxed">
                      {activeWorkflow.summary[language]}
                    </p>
                  </div>
                  <span className="text-xs font-bold tabular-nums text-[#4A6347] shrink-0">
                    {wfCompletedCount}/{wfTotal}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A6347] rounded-full transition-all duration-500"
                    style={{ width: `${wfPct}%` }}
                  />
                </div>

                <div className="space-y-2.5">
                  {activeWorkflow.steps.map((step, idx) => {
                    const done = !!completedStepIds[step.id];
                    return (
                      <div
                        key={step.id}
                        className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                          done
                            ? 'bg-[#A2B29B]/14 border-[#4A6347]/50'
                            : 'bg-[#FCF9F5] border-[#BEA06D]/25'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleGuidedStep(step.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                              done
                                ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                                : 'bg-white border-[#BEA06D]/60 text-transparent'
                            }`}
                            aria-label={`Mark step ${idx + 1} completed`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-1">
                            <span
                              className={`text-sm font-bold block ${
                                done ? 'line-through text-[#493C39]/60' : 'text-[#493C39]'
                              }`}
                            >
                              {idx + 1}. {step.label[language]}
                            </span>
                            <p className="text-xs sm:text-sm text-[#493C39]/80 mt-0.5 leading-relaxed">
                              {step.detail[language]}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          {step.opensSearch && onOpenSearch ? (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleOpen(false);
                                onOpenSearch();
                              }}
                              className="compact-chip py-1.5 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#C88F98] text-xs font-semibold text-[#8A6D3F] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>{step.actionLabel?.[language] || 'Open Smart Search'}</span>
                            </button>
                          ) : step.targetPage ? (
                            <button
                              type="button"
                              onClick={() => {
                                onPageChange(step.targetPage!);
                                onToggleOpen(false);
                              }}
                              className="compact-chip py-1.5 px-3.5 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>{step.actionLabel?.[language] || 'Open Feature'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {wfAllDone && (
                  <div className="p-3.5 rounded-xl bg-[#A2B29B]/18 border border-[#4A6347]/60 space-y-2 soft-fade-up">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#4A6347] check-pop">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {language === 'kn'
                          ? 'ಮಾರ್ಗದರ್ಶಿ ಹಂತಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ'
                          : language === 'te'
                          ? 'మార్గదర్శక దశలు పూర్తయ్యాయి'
                          : 'Workflow Steps Completed'}
                      </span>
                    </div>
                    <p className="text-xs text-[#493C39]/85">
                      {language === 'kn'
                        ? `"${activeWorkflow.title[language]}" ಗಾಗಿ ಎಲ್ಲಾ ${wfTotal} ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ಅಂತಿಮ ಸಾರಾಂಶಕ್ಕಾಗಿ ನನ್ನ ಆರೈಕೆ ಪಯಣ ನೋಡಿ.`
                        : language === 'te'
                        ? `"${activeWorkflow.title[language]}" కోసం ${wfTotal} దశలూ పూర్తి చేశారు. పూర్తి సారాంశం కోసం నా ఆరోగ్య ప్రయాణం చూడండి.`
                        : `You walked through all ${wfTotal} organizational steps for "${activeWorkflow.title[language]}". Open My Care Journey to print your Visit Summary.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onPageChange('journey');
                        onToggleOpen(false);
                      }}
                      className="compact-chip py-1.5 px-3 rounded-full bg-[#4A6347] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {language === 'kn'
                          ? 'ಭೇಟಿ ಸಾರಾಂಶ ನೋಡಿ'
                          : language === 'te'
                          ? 'విజిట్ సారాంశం చూడండి'
                          : 'View Visit Summary'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                {!aiConsentGranted && (
                  <AiConsentNotice
                    language={chatLanguage}
                    consentGranted={aiConsentGranted}
                    onAcceptConsent={onAcceptAiConsent}
                    compact
                  />
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={!aiConsentGranted || tipLoading}
                    onClick={() => void handleGetGentleWorkflowTip(false)}
                    className="compact-chip py-2 px-4 rounded-full bg-[#C88F98] hover:bg-[#b07680] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {chatLanguage === 'kn'
                        ? 'ಈ ಕೆಲಸಕ್ಕೆ ಸರಳ AI ಸಲಹೆ ಪಡೆಯಿರಿ'
                        : chatLanguage === 'te'
                        ? 'ఈ పని కోసం సులభ AI సూచన పొందండి'
                        : 'Get Gentle Gemini Tip for This Task'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenComfortMode();
                      onToggleOpen(false);
                    }}
                    className="compact-chip text-xs font-semibold text-[#8A6D3F] underline cursor-pointer"
                  >
                    {language === 'kn'
                      ? 'ಅನುಭವ ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
                      : language === 'te'
                      ? 'కంఫర్ట్ సెట్టింగ్స్'
                      : 'Experience Settings'}
                  </button>
                </div>

                {tipLoading && (
                  <AiSkeletonLoader
                    label={
                      chatLanguage === 'kn'
                        ? 'ಸರಳ ಭಾಷೆಯ ಸಲಹೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
                        : chatLanguage === 'te'
                        ? 'సులభ భాషా సూచన సిద్ధం అవుతోంది...'
                        : 'Preparing plain-language step tip...'
                    }
                  />
                )}

                {tipError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-900">
                    {tipError}
                  </div>
                )}

                {stepTip && !tipLoading && (
                  <div className="p-4 rounded-2xl bg-white border border-[#BEA06D]/40 space-y-2.5 soft-fade-up">
                    <AiTrustHeader
                      language={chatLanguage}
                      label={
                        chatLanguage === 'kn'
                          ? 'AI ಹಂತದ ಸಲಹೆ · Gemini'
                          : chatLanguage === 'te'
                          ? 'AI దశ సూచన · Gemini'
                          : 'AI Step Tip · Gemini'
                      }
                      onAskClarification={() => void handleGetGentleWorkflowTip(true)}
                      onListen={() =>
                        handleListenToggle(stepTip.text, chatLanguage, 'workflow-tip')
                      }
                      isSpeaking={
                        playbackSnap.activeId === 'workflow-tip' && playbackSnap.status !== 'idle'
                      }
                      clarifyDisabled={tipLoading}
                    />
                    <FormattedAssistantMessage
                      text={stepTip.text}
                      fontClass={getScriptFontClass(stepTip.text, chatLanguage)}
                    />
                    <AiTrustFooter language={chatLanguage} uncertaintyNote={stepTip.safety} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* MODE 2: SPACIOUS CONVERSATIONAL MULTILINGUAL GEMINI COMPANION */
            <>
              <div
                ref={scrollContainerRef}
                onScroll={handleMessagesScroll}
                className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 sm:px-6 sm:py-5 space-y-4 bg-[#FCF9F5]"
              >
                {!aiConsentGranted && (
                  <AiConsentNotice
                    language={chatLanguage}
                    consentGranted={aiConsentGranted}
                    onAcceptConsent={onAcceptAiConsent}
                    compact
                  />
                )}

                {messages.map((msg, index) => {
                  const isLatest = index === latestMessageIndex;
                  const isGeneratedAssistant =
                    msg.sender === 'assistant' &&
                    msg.id !== 'welcome' &&
                    !msg.id.startsWith('welcome-');
                  const msgLang = resolveSpeechLanguage(
                    msg.text,
                    msg.responseLanguage || chatLanguage
                  );
                  const msgFontClass = getScriptFontClass(msg.text, msgLang);
                  const isPlayingOriginal =
                    playbackSnap.activeId === msg.id && playbackSnap.status !== 'idle';
                  const isPlayingTranslation =
                    playbackSnap.activeId === `${msg.id}-tr` && playbackSnap.status !== 'idle';

                  return (
                    <div
                      key={msg.id}
                      ref={isLatest ? latestMessageStartRef : undefined}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-2xl shadow-xs break-words ${
                          msg.sender === 'user'
                            ? 'max-w-[88%] sm:max-w-[82%] px-4 py-3 sm:px-5 sm:py-3.5 bg-[#5B4944] text-white rounded-br-md'
                            : msg.sender === 'error'
                            ? 'w-full max-w-[96%] px-4 py-3.5 sm:px-5 sm:py-4 bg-red-50 border border-red-200 text-red-950 rounded-bl-md'
                            : 'w-full max-w-[98%] sm:max-w-[95%] px-4 py-4 sm:px-5 sm:py-4.5 bg-white border border-[#BEA06D]/35 text-[#322826] rounded-bl-md'
                        }`}
                      >
                        {isGeneratedAssistant && (
                          <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[#BEA06D]/20 text-[11px] font-semibold text-[#4A6347]">
                            <span className="inline-flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                              <span>
                                {msgLang === 'kn'
                                  ? 'AI ಉತ್ತರ · Gemini · ಕನ್ನಡ'
                                  : msgLang === 'te'
                                  ? 'AI సమాధానం · Gemini · తెలుగు'
                                  : 'AI Response · Gemini · English'}
                              </span>
                            </span>
                            <span className="text-[#8A6D3F] font-medium">
                              {msgLang === 'kn'
                                ? 'ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ'
                                : msgLang === 'te'
                                ? 'సిబ్బందితో నిర్ధారించండి'
                                : 'Verify With Staff'}
                            </span>
                          </div>
                        )}

                        {msg.sender === 'error' && (
                          <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5 text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>
                              {msgLang === 'kn'
                                ? 'AI ಸೇವಾ ಸೂಚನೆ'
                                : msgLang === 'te'
                                ? 'AI సేవా గమనిక'
                                : 'AI Service Notice'}
                            </span>
                          </div>
                        )}

                        {msg.sender === 'assistant' ? (
                          <div className="space-y-3">
                            {msg.translation && (
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6D3F] block">
                                Original Answer ({getLanguageShortName(msgLang)})
                              </span>
                            )}
                            <FormattedAssistantMessage text={msg.text} fontClass={msgFontClass} />
                          </div>
                        ) : (
                          <p
                            className={`whitespace-pre-line text-[15.5px] sm:text-[16.5px] leading-[1.65] ${getScriptFontClass(
                              msg.text,
                              msgLang
                            )} ${msg.sender === 'user' ? 'text-white' : 'text-red-950'}`}
                          >
                            {msg.text}
                          </p>
                        )}

                        {/* Optional Mismatch Re-Answer Hint if user submitted another script without switching chat language */}
                        {isGeneratedAssistant && msg.detectedInputLang && (
                          <div className="mt-3 p-2.5 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-[#493C39]">
                              Your question appeared to be in{' '}
                              <strong>{getLanguageShortName(msg.detectedInputLang)}</strong>.
                            </span>
                            <button
                              type="button"
                              disabled={translatingId === msg.id}
                              onClick={() => {
                                setChatLanguage(msg.detectedInputLang!);
                                void handleTranslateMessage(msg, msg.detectedInputLang!);
                              }}
                              className="compact-chip px-2.5 py-1 rounded-lg bg-[#C88F98] hover:bg-[#b27882] text-white font-semibold cursor-pointer whitespace-nowrap"
                            >
                              Translate to {getLanguageShortName(msg.detectedInputLang)}
                            </button>
                          </div>
                        )}

                        {/* Clearly Separated Translated Version Block */}
                        {msg.translation && (
                          <div className="mt-4 pt-3.5 border-t-2 border-dashed border-[#BEA06D]/35 bg-[#FCF9F5]/80 rounded-xl p-3.5 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6347] inline-flex items-center gap-1.5">
                                <Languages className="w-3.5 h-3.5 text-[#BEA06D]" />
                                <span>
                                  Translated Version ·{' '}
                                  {getLanguageShortName(msg.translation.language)}
                                </span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleListenToggle(
                                      msg.translation!.text,
                                      msg.translation!.language,
                                      `${msg.id}-tr`
                                    )
                                  }
                                  className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/35 text-[11px] font-semibold text-[#8A6D3F] hover:border-[#C88F98] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                >
                                  {isPlayingTranslation ? (
                                    <VolumeX className="w-3 h-3 text-[#C88F98]" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                  <span>{isPlayingTranslation ? 'Stop Audio' : 'Listen'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleCopyText(msg.translation!.text, `${msg.id}-tr`)
                                  }
                                  className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/35 text-[11px] font-semibold text-[#493C39] hover:border-[#C88F98] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                >
                                  {copiedId === `${msg.id}-tr` ? (
                                    <Check className="w-3 h-3 text-[#4A6347]" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>{copiedId === `${msg.id}-tr` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>

                            <FormattedAssistantMessage
                              text={msg.translation.text}
                              fontClass={getScriptFontClass(
                                msg.translation.text,
                                msg.translation.language
                              )}
                            />
                            {msg.translation.verificationNote && (
                              <p className="text-[11px] text-[#493C39]/75 italic">
                                {msg.translation.verificationNote}
                              </p>
                            )}
                          </div>
                        )}

                        {msg.followUpQuestion && (
                          <button
                            type="button"
                            disabled={!aiConsentGranted || isLoading}
                            onClick={() => void sendMessageToGemini(msg.followUpQuestion!)}
                            className={`mt-3.5 text-left text-sm text-[#6E542D] bg-[#FCF9F5] border border-[#BEA06D]/45 hover:border-[#C88F98] px-3.5 py-2.5 rounded-xl block w-full cursor-pointer transition-colors leading-snug ${getScriptFontClass(
                              msg.followUpQuestion,
                              msgLang
                            )}`}
                          >
                            {msg.followUpQuestion}
                          </button>
                        )}

                        {msg.safetyNotice && (
                          <p
                            className={`mt-3 text-xs text-[#493C39]/80 italic border-t border-[#E6C1C4]/50 pt-2 leading-relaxed ${getScriptFontClass(
                              msg.safetyNotice,
                              msgLang
                            )}`}
                          >
                            {msg.safetyNotice}
                          </p>
                        )}

                        {/* Full AI Response Actions Toolbar */}
                        {isGeneratedAssistant && (
                          <div className="mt-3.5 pt-2.5 border-t border-[#BEA06D]/15 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Listen / Stop Audio */}
                              <button
                                type="button"
                                onClick={() => handleListenToggle(msg.text, msgLang, msg.id)}
                                className={`compact-chip px-2.5 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                                  isPlayingOriginal
                                    ? 'bg-[#C88F98] border-[#C88F98] text-white'
                                    : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#8A6D3F] hover:bg-[#E6C1C4]/20'
                                }`}
                              >
                                {isPlayingOriginal ? (
                                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>
                                  {isPlayingOriginal
                                    ? msgLang === 'kn'
                                      ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ'
                                      : msgLang === 'te'
                                      ? 'ఆడియో ఆపండి'
                                      : 'Stop Audio'
                                    : msgLang === 'kn'
                                    ? 'ಕೇಳಿ'
                                    : msgLang === 'te'
                                    ? 'వినండి'
                                    : 'Listen'}
                                </span>
                              </button>

                              {/* Dedicated Stop Audio button whenever any speech is active on this message or globally */}
                              {playbackSnap.status !== 'idle' && !isPlayingOriginal && (
                                <button
                                  type="button"
                                  onClick={() => speechService.stop()}
                                  className="compact-chip px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                >
                                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                                  <span>Stop Audio</span>
                                </button>
                              )}

                              {/* Copy */}
                              <button
                                type="button"
                                onClick={() => void handleCopyText(msg.text, msg.id)}
                                className="compact-chip px-2.5 py-1.5 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs font-semibold text-[#493C39] hover:border-[#C88F98] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3.5 h-3.5 text-[#4A6347] shrink-0" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-[#8A6D3F] shrink-0" />
                                )}
                                <span>
                                  {copiedId === msg.id
                                    ? msgLang === 'kn'
                                      ? 'ನಕಲಿಸಲಾಗಿದೆ'
                                      : msgLang === 'te'
                                      ? 'కాపీ అయింది'
                                      : 'Copied'
                                    : msgLang === 'kn'
                                    ? 'ನಕಲಿಸಿ'
                                    : msgLang === 'te'
                                    ? 'కాపీ'
                                    : 'Copy'}
                                </span>
                              </button>

                              {/* Simplify */}
                              <button
                                type="button"
                                disabled={!aiConsentGranted || isLoading}
                                onClick={() =>
                                  void sendMessageToGemini(
                                    `Please simplify this explanation into 2 or 3 very short, reassuring sentences: "${msg.text.slice(
                                      0,
                                      500
                                    )}"`,
                                    {
                                      overrideLanguage: msgLang,
                                      overrideComplexity: 'extra_simple',
                                      actionIntent: 'simplify',
                                      suppressUserBubble: true,
                                    }
                                  )
                                }
                                className="compact-chip px-2.5 py-1.5 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs font-semibold text-[#493C39] hover:border-[#C88F98] disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <Zap className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                                <span>
                                  {msgLang === 'kn'
                                    ? 'ಸರಳಗೊಳಿಸಿ'
                                    : msgLang === 'te'
                                    ? 'సులభతరం చేయండి'
                                    : 'Simplify'}
                                </span>
                              </button>

                              {/* Explain Further */}
                              <button
                                type="button"
                                disabled={!aiConsentGranted || isLoading}
                                onClick={() =>
                                  void sendMessageToGemini(
                                    `Please explain this previous guidance in greater detail with organized headings and practical steps: "${msg.text.slice(
                                      0,
                                      500
                                    )}"`,
                                    {
                                      overrideLanguage: msgLang,
                                      overrideComplexity: 'detailed',
                                      actionIntent: 'elaborate',
                                      suppressUserBubble: true,
                                    }
                                  )
                                }
                                className="compact-chip px-2.5 py-1.5 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs font-semibold text-[#493C39] hover:border-[#C88F98] disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#8A6D3F] shrink-0" />
                                <span>
                                  {msgLang === 'kn'
                                    ? 'ಇನ್ನಷ್ಟು ವಿವರಿಸಿ'
                                    : msgLang === 'te'
                                    ? 'మరింత వివరించండి'
                                    : 'Explain Further'}
                                </span>
                              </button>

                              {/* Translate */}
                              <button
                                type="button"
                                disabled={!aiConsentGranted || translatingId === msg.id}
                                onClick={() =>
                                  setTranslateMenuOpenId((curr) =>
                                    curr === msg.id ? null : msg.id
                                  )
                                }
                                className={`compact-chip px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap disabled:opacity-50 ${
                                  translateMenuOpenId === msg.id
                                    ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                                    : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#493C39] hover:border-[#C88F98]'
                                }`}
                              >
                                <Languages className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {translatingId === msg.id
                                    ? 'Translating...'
                                    : msgLang === 'kn'
                                    ? 'ಭಾಷಾಂತರಿಸಿ'
                                    : msgLang === 'te'
                                    ? 'అనువదించండి'
                                    : 'Translate'}
                                </span>
                              </button>

                              {msg.suggestedPage && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onPageChange(msg.suggestedPage!);
                                    onToggleOpen(false);
                                  }}
                                  className="compact-chip px-3 py-1.5 rounded-lg bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                >
                                  <span>
                                    {msg.suggestedActionLabel || activePageCtx.title[language]}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Target Language Selector for Translate Action */}
                            {translateMenuOpenId === msg.id && (
                              <div className="p-2 rounded-xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-semibold text-[#8A6D3F]">Translate to:</span>
                                {(['en', 'kn', 'te'] as const).map((tLang) => (
                                  <button
                                    key={tLang}
                                    type="button"
                                    onClick={() => void handleTranslateMessage(msg, tLang)}
                                    className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/40 hover:border-[#C88F98] font-semibold text-[#493C39] cursor-pointer"
                                  >
                                    {getLanguageShortName(tLang)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Listen action for initial welcome message too */}
                        {msg.sender === 'assistant' && !isGeneratedAssistant && (
                          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#BEA06D]/15">
                            <button
                              type="button"
                              onClick={() => handleListenToggle(msg.text, msgLang, msg.id)}
                              className="compact-chip px-2.5 py-1 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/35 text-xs font-semibold text-[#8A6D3F] hover:bg-[#E6C1C4]/20 inline-flex items-center gap-1 cursor-pointer"
                            >
                              {isPlayingOriginal ? (
                                <VolumeX className="w-3.5 h-3.5 text-[#C88F98]" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {isPlayingOriginal
                                  ? 'Stop Audio'
                                  : msgLang === 'kn'
                                  ? 'ಕೇಳಿ'
                                  : msgLang === 'te'
                                  ? 'వినండి'
                                  : 'Listen'}
                              </span>
                            </button>
                          </div>
                        )}

                        {msg.sender === 'error' && lastFailedPrompt && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              void sendMessageToGemini(lastFailedPrompt, { isRetry: true })
                            }
                            className="mt-2.5 text-sm font-bold text-red-800 underline disabled:opacity-50 cursor-pointer"
                          >
                            {msgLang === 'kn'
                              ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
                              : msgLang === 'te'
                              ? 'మళ్ళీ ప్రయత్నించండి'
                              : 'Retry'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <AiSkeletonLoader
                    label={
                      chatLanguage === 'kn'
                        ? 'CORE AI ಉತ್ತರ ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                        : chatLanguage === 'te'
                        ? 'CORE AI సమాధానం సిద్ధం చేస్తోంది...'
                        : 'CORE AI is composing a gentle response...'
                    }
                  />
                )}

                {actionFeedbackError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                    {actionFeedbackError}
                  </div>
                )}

                {showScrollToBottom && (
                  <div className="sticky bottom-2 flex justify-end pointer-events-none">
                    <button
                      type="button"
                      onClick={() => scrollToBottom(true)}
                      className="pointer-events-auto compact-chip px-3 py-1.5 rounded-full bg-[#493C39]/90 hover:bg-[#493C39] text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>
                        {chatLanguage === 'kn'
                          ? 'ಹೊಸ ಉತ್ತರ'
                          : chatLanguage === 'te'
                          ? 'కొత్త సందేశం'
                          : 'Latest'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Compact Bottom Composer, Voice Playback/Listening Bar & Collapsible Suggestions */}
              <div className="shrink-0 bg-white border-t border-[#BEA06D]/25">
                {/* Active TTS Playback Bar (Language badge + Pause / Resume / Replay / Stop / Speed) */}
                {playbackSnap.status !== 'idle' && (
                  <div className="px-3.5 sm:px-5 py-2 bg-[#FCF9F5] border-b border-[#BEA06D]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[#493C39] font-semibold">
                      {playbackSnap.status === 'loading' ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#C88F98] animate-spin shrink-0" />
                      ) : (
                        <div className="flex items-center gap-0.5 h-4" aria-hidden="true">
                          {[1, 2, 3, 4].map((b) => (
                            <span
                              key={b}
                              className={`w-1 rounded-full bg-[#C88F98] ${
                                playbackSnap.status === 'speaking' && !reduceMotion
                                  ? 'wave-bar'
                                  : 'h-2 opacity-60'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span>
                        {playbackSnap.status === 'loading'
                          ? `Preparing ${getAudioLanguageBadge(playbackSnap.activeLang || chatLanguage)}`
                          : playbackSnap.status === 'paused'
                          ? `Paused (${getAudioLanguageBadge(playbackSnap.activeLang || chatLanguage)})`
                          : `Speaking: ${getAudioLanguageBadge(playbackSnap.activeLang || chatLanguage)}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Speed Pills (0.75x / 0.9x / 1.0x) */}
                      <div
                        className="inline-flex items-center bg-white border border-[#BEA06D]/30 rounded-lg p-0.5"
                        role="group"
                        aria-label="Audio speed"
                      >
                        {([0.75, 0.9, 1.0] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleSpeechRateChange(r)}
                            className={`compact-chip px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              speechRate === r
                                ? 'bg-[#BEA06D] text-white'
                                : 'text-[#493C39]/80 hover:text-[#493C39]'
                            }`}
                          >
                            {r === 1 ? '1.0x' : `${r}x`}
                          </button>
                        ))}
                      </div>

                      {playbackSnap.status !== 'loading' && (
                        <button
                          type="button"
                          onClick={() =>
                            playbackSnap.status === 'paused'
                              ? speechService.resume()
                              : speechService.pause()
                          }
                          className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/35 text-[#493C39] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          {playbackSnap.status === 'paused' ? (
                            <Play className="w-3 h-3" />
                          ) : (
                            <Pause className="w-3 h-3" />
                          )}
                          <span>{playbackSnap.status === 'paused' ? 'Resume' : 'Pause'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => speechService.replay()}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/35 text-[#8A6D3F] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => speechService.stop()}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-[#C88F98] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <VolumeX className="w-3 h-3" />
                        <span>Stop</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Gentle Blush Listening State Bar */}
                {isListening && (
                  <div className="px-3.5 sm:px-5 py-2 bg-[#E6C1C4]/28 border-b border-[#C88F98]/50 flex items-center justify-between gap-2 text-xs text-[#493C39]">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        {!reduceMotion && (
                          <span className="voice-ring absolute inline-flex h-full w-full rounded-full bg-[#C88F98]" />
                        )}
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C88F98]" />
                      </span>
                      <span className="font-semibold">
                        Listening in {getLanguageShortName(chatLanguage)}... Speak clearly, then
                        review or edit below.
                      </span>
                    </div>
                    <div className="flex items-center gap-1 h-4" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <span
                          key={bar}
                          className={`w-1 rounded-full bg-[#C88F98] ${
                            !reduceMotion ? 'wave-bar' : 'h-2 opacity-60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Error / Missing OS Voice Pack Notice */}
                {voiceStatusMessage && (
                  <div className="px-3.5 sm:px-5 py-2.5 bg-[#E6C1C4]/18 border-b border-[#C88F98]/50 flex items-start justify-between gap-2.5 text-xs text-[#493C39]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{voiceStatusMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceStatusMessage(null);
                        speechService.clearError();
                      }}
                      className="text-[#8A6D3F] font-semibold underline shrink-0 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Live Mixed-Language Input Detection Choice Banner */}
                {suggestedInputLanguage && (
                  <div className="px-3.5 sm:px-5 py-2 bg-[#E6C1C4]/20 border-b border-[#C88F98]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#493C39] font-medium">
                      {suggestedInputLanguage === 'kn'
                        ? 'Kannada detected · Would you like the answer in Kannada?'
                        : suggestedInputLanguage === 'te'
                        ? 'Telugu detected · Would you like the answer in Telugu?'
                        : 'English detected · Would you like the answer in English?'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setChatLanguage(suggestedInputLanguage);
                          setDismissedMismatchForLang(null);
                        }}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-[#C88F98] hover:bg-[#b27882] text-white font-semibold cursor-pointer whitespace-nowrap"
                      >
                        Answer in {getLanguageShortName(suggestedInputLanguage)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDismissedMismatchForLang(suggestedInputLanguage)}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-white border border-[#BEA06D]/35 text-[#493C39] font-semibold cursor-pointer whitespace-nowrap"
                      >
                        Keep {getLanguageShortName(chatLanguage)}
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible Suggestions Header Strip */}
                <div className="px-3.5 sm:px-5 py-1.5 border-b border-[#BEA06D]/15 bg-[#FCF9F5]/75 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSuggestionsOpen((s) => !s)}
                    aria-expanded={suggestionsOpen}
                    className="compact-chip py-1 px-2 rounded-lg text-xs font-semibold text-[#8A6D3F] hover:text-[#493C39] hover:bg-[#E6C1C4]/20 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C88F98] shrink-0" />
                    <span>
                      {chatLanguage === 'kn'
                        ? 'ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು'
                        : chatLanguage === 'te'
                        ? 'సూచించిన ప్రశ్నలు'
                        : 'Suggestions'}
                    </span>
                    <span className="text-[11px] text-[#493C39]/65 tabular-nums">
                      ({activePageCtx.prompts.length})
                    </span>
                    {suggestionsOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="text-[11px] text-[#493C39]/70 truncate">
                    {chatLanguage === 'kn'
                      ? 'AI ಮಾರ್ಗದರ್ಶಿ · ವೈದ್ಯರಲ್ಲ'
                      : chatLanguage === 'te'
                      ? 'AI గైడ్ · డాక్టర్ కాదు'
                      : 'AI Guide · Verify clinical care with staff'}
                  </span>
                </div>

                {/* Expandable Suggestions Drawer */}
                <div className="graceful-expand" data-open={suggestionsOpen ? 'true' : 'false'}>
                  <div>
                    <div className="px-3.5 sm:px-5 py-2.5 bg-[#FCF9F5]/50 border-b border-[#BEA06D]/15 flex flex-wrap gap-2">
                      {activePageCtx.prompts.map((promptObj, idx) => (
                        <button
                          key={`${currentPage}-ctx-${idx}`}
                          type="button"
                          disabled={!aiConsentGranted || isLoading}
                          onClick={() => void sendMessageToGemini(promptObj[chatLanguage])}
                          className="compact-chip text-left text-xs sm:text-[13px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#E6C1C4]/20 disabled:opacity-50 border border-[#BEA06D]/35 text-[#493C39] font-medium transition-colors cursor-pointer"
                        >
                          {promptObj[chatLanguage]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message Composer Input with Integrated Microphone Button */}
                <form
                  onSubmit={handleSubmit}
                  className="px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-end gap-2 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
                >
                  <button
                    type="button"
                    onClick={handleToggleVoiceDictation}
                    disabled={isLoading}
                    aria-label={isListening ? 'Stop voice input' : 'Speak question with microphone'}
                    title={
                      isListening
                        ? 'Stop listening'
                        : `Speak in ${getLanguageShortName(chatLanguage)}`
                    }
                    className={`compact-chip min-w-[44px] min-h-[44px] p-2.5 rounded-xl border inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isListening
                        ? 'bg-[#E6C1C4]/50 border-[#C88F98] text-[#493C39]'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/45 text-[#8A6D3F] hover:border-[#C88F98] hover:bg-[#E6C1C4]/20'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-[#C88F98]" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    maxLength={1200}
                    disabled={!aiConsentGranted || isLoading}
                    value={inputText}
                    onChange={handleTextareaChange}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder={
                      !aiConsentGranted
                        ? chatLanguage === 'kn'
                          ? 'ಮೊದಲು ಮೇಲಿನ AI ಸಮ್ಮತಿಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ...'
                          : chatLanguage === 'te'
                          ? 'ముందుగా పైన AI అనుమతిని ఆమోదించండి...'
                          : 'Accept AI consent above to ask...'
                        : chatLanguage === 'kn'
                        ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಬಳಸಿ...'
                        : chatLanguage === 'te'
                        ? 'మీ ప్రశ్నను టైప్ చేయండి లేదా మైక్ వాడండి...'
                        : 'Ask a question or tap mic to speak...'
                    }
                    className={`flex-1 min-h-[44px] max-h-[108px] resize-none px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/45 bg-[#FCF9F5] text-base text-[#322826] leading-snug focus:outline-none focus:ring-2 focus:ring-[#BEA06D] disabled:opacity-60 ${getScriptFontClass(
                      inputText,
                      chatLanguage
                    )}`}
                  />

                  <button
                    type="submit"
                    disabled={!aiConsentGranted || isLoading || !inputText.trim()}
                    className="compact-chip min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-[#C88F98] hover:bg-[#b27882] disabled:opacity-50 text-white inline-flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Send message to AI Companion"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* Compact Minimized Bar or Closed Floating Trigger */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 no-print flex items-center gap-2">
          {isOpen && isMinimized ? (
            <div className="bg-white border border-[#BEA06D]/70 rounded-full shadow-lg px-3.5 py-2 flex items-center gap-2.5 modal-soft-enter">
              <CoreMonogramMark size="sm" />
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="compact-chip text-xs sm:text-sm font-semibold text-[#493C39] hover:text-[#8A6D3F] cursor-pointer pr-1"
              >
                {language === 'kn'
                  ? 'CORE AI ತೆರೆಯಿರಿ'
                  : language === 'te'
                  ? 'CORE AI తెరవండి'
                  : 'Restore CORE Companion'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMinimized(false);
                  onToggleOpen(false);
                }}
                className="compact-chip p-1.5 rounded-full text-[#493C39]/70 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 cursor-pointer"
                aria-label="Close Companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onToggleOpen(true);
                setIsMinimized(false);
              }}
              className="flex items-center gap-2.5 bg-[#493C39] hover:bg-[#C88F98] active:scale-95 text-white font-semibold py-3 px-5 rounded-full shadow-lg border border-[#BEA06D]/70 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
              aria-label="Open CORE AI Companion"
            >
              <MessageCircleHeart className="w-5 h-5 text-[#E6C1C4] shrink-0" />
              <span className="text-xs sm:text-sm">
                {language === 'kn'
                  ? 'CORE ಸಹಾಯಕ & ಮಾರ್ಗದರ್ಶಿ'
                  : language === 'te'
                  ? 'CORE సహాయకుడు & గైడ్'
                  : 'CORE Companion & Guide'}
              </span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
