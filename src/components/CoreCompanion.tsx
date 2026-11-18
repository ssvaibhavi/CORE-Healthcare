import React, { useState, useRef, useEffect } from 'react';
import { CoreMonogramMark } from './BotanicalMotifs';
import { AiConsentNotice } from './AiConsentNotice';
import { AiTrustHeader, AiTrustFooter, AiSkeletonLoader } from './AiTrustLayer';
import { ComfortSettings, Language, PageView } from '../types';
import { askCompanionAi, AiClientError } from '../utils/aiClient';
import { speechService } from '../utils/speech';
import {
  MessageCircleHeart,
  X,
  Send,
  Volume2,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Mic,
  Maximize2,
  Minimize2,
  Minus,
  AlertCircle,
  Compass,
  CheckCircle2,
  Check,
  Search
} from 'lucide-react';

interface CompanionMessage {
  id: string;
  sender: 'user' | 'assistant' | 'error';
  text: string;
  suggestedPage?: PageView;
  suggestedActionLabel?: string;
  followUpQuestion?: string;
  safetyNotice?: string;
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
        te: 'నా ఫోన్‌లో క్యాలెండర్ (.ics) రిమైండర్ సేవ్ చేయడం ఎలా?',
      },
      {
        en: 'How does the caregiver safety-net policy work?',
        kn: 'ಆರೈಕೆದಾರರ ಸುರಕ್ಷತಾ ಜ್ಞಾಪನೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?',
        te: 'సంరక్షకుడి సేఫ్టీ-నెట్ విధానం ఎలా పనిచేస్తుంది?',
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
      {
        en: 'Does changing the date here update a live hospital server?',
        kn: 'ಇಲ್ಲಿ ದಿನಾಂಕ ಬದಲಾಯಿಸಿದರೆ ಆಸ್ಪತ್ರೆ ಸರ್ವರ್ ನವೀಕರಣವಾಗುತ್ತದೆಯೇ?',
        te: 'ఇక్కడ తేదీ మారిస్తే ఆసుపత్రి సర్వర్‌లో మారుతుందా?',
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

interface CoreCompanionProps {
  language: Language;
  currentPage: PageView;
  comfortSettings: ComfortSettings;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  onPageChange: (page: PageView) => void;
  onOpenComfortMode: () => void;
  onOpenSearch?: () => void;
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
  aiConsentGranted,
  onAcceptAiConsent,
  reduceMotion = false,
  resetSignal = 0,
}) => {
  const getGreeting = (lang: Language): string => {
    if (lang === 'kn') {
      return 'ನಮಸ್ಕಾರ! ನಾನು CORE AI ಸಹಾಯಕ (Google Gemini ಆಧಾರಿತ). ವೆಬ್‌ಸೈಟ್ ನ್ಯಾವಿಗೇಷನ್, ಭೇಟಿ ಸಿದ್ಧತೆ, ಪ್ರವೇಶ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ಪದಗಳ ಸರಳ ವಿವರಣೆಗೆ ನಾನು ನಿಮಗೆ ನೆರವಾಗಬಲ್ಲೆ. (ಗಮನಿಸಿ: ನಾನು ವೈದ್ಯರಲ್ಲ).';
    }
    if (lang === 'te') {
      return 'నమస్కారం! నేను CORE AI సహాయకుడిని (Google Gemini ఆధారితం). వెబ్‌సైట్ నావిగేషన్, సందర్శన తయారీ మరియు యాక్సెసిబిలిటీ సెట్టింగ్స్‌లో నేను సహాయం చేస్తాను. (గమనిక: నేను డాక్టర్‌ని కాదు).';
    }
    return 'Hello! I am CORE AI Companion (powered by Google Gemini). Switch to "Guide Me Through It" for interactive step-by-step help, or ask any navigation & clarity question here. I am an AI guide, not a clinician.';
  };

  const [mode, setMode] = useState<'guide' | 'chat'>('guide');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(GUIDED_WORKFLOWS[0].id);
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>({});
  const [stepTip, setStepTip] = useState<{ text: string; safety?: string } | null>(null);
  const [tipLoading, setTipLoading] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);

  const [messages, setMessages] = useState<CompanionMessage[]>([
    { id: 'welcome', sender: 'assistant', text: getGreeting(language) },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `welcome-${language}-${resetSignal}`,
        sender: 'assistant',
        text: getGreeting(language),
      },
    ]);
    setLastFailedPrompt(null);
    if (resetSignal > 0) {
      setCompletedStepIds({});
      setStepTip(null);
      setTipError(null);
    }
  }, [language, resetSignal]);

  useEffect(() => {
    if (isOpen && !isMinimized && mode === 'chat') {
      endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized, mode, reduceMotion]);

  const activePageCtx = PAGE_CONTEXT_CONFIG[currentPage] || PAGE_CONTEXT_CONFIG.home;

  const activeWorkflow =
    GUIDED_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || GUIDED_WORKFLOWS[0];

  const wfCompletedCount = activeWorkflow.steps.filter((s) => completedStepIds[s.id]).length;
  const wfTotal = activeWorkflow.steps.length;
  const wfPct = Math.round((wfCompletedCount / wfTotal) * 100);
  const wfAllDone = wfCompletedCount === wfTotal;

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
        language,
        complexity: clarifyMore ? 'extra_simple' : comfortSettings.explanationComplexity || 'simple',
        guidedMode: true,
        voicePreferred: comfortSettings.readAloud,
        currentPage,
        pageContext: activePageCtx.contextSummary,
        history: [],
        consentAccepted: true,
      });
      setStepTip({ text: res.reply, safety: res.safetyNotice });
    } catch (err) {
      setTipError(
        err instanceof AiClientError
          ? err.message
          : language === 'kn'
          ? 'ಈಗ Gemini ಸಲಹೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.'
          : language === 'te'
          ? 'ప్రస్తుతం Gemini సూచన పొందడం సాధ్యం కాలేదు.'
          : 'Unable to fetch Gemini tip right now.'
      );
    } finally {
      setTipLoading(false);
    }
  };

  const sendMessageToGemini = async (rawText: string) => {
    const cleaned = rawText.trim();
    if (!cleaned || isLoading) return;
    if (!aiConsentGranted) return;

    const userMsg: CompanionMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: cleaned,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setLastFailedPrompt(null);
    setIsLoading(true);

    try {
      const historyForApi = nextMessages
        .filter((m): m is CompanionMessage & { sender: 'user' | 'assistant' } =>
          m.sender === 'user' || m.sender === 'assistant'
        )
        .slice(-8)
        .map((m) => ({ role: m.sender, text: m.text }));

      const aiData = await askCompanionAi({
        message: cleaned,
        language,
        complexity: comfortSettings.explanationComplexity || 'simple',
        guidedMode: comfortSettings.guidedMode,
        voicePreferred: comfortSettings.readAloud,
        currentPage,
        pageContext: activePageCtx.contextSummary,
        history: historyForApi,
        consentAccepted: true,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: aiData.reply,
          suggestedPage: aiData.suggestedPage,
          suggestedActionLabel: aiData.suggestedActionLabel,
          followUpQuestion: aiData.followUpQuestion,
          safetyNotice: aiData.safetyNotice,
        },
      ]);
    } catch (err) {
      const msg =
        err instanceof AiClientError
          ? err.message
          : 'Unable to reach CORE AI right now. Please try again.';
      setLastFailedPrompt(cleaned);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'error',
          text: msg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessageToGemini(inputText);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print flex flex-col items-end gap-3">
      {/* Companion Drawer */}
      {isOpen && (
        <div
          className={`bg-[#FCF9F5] border border-[#BEA06D]/70 rounded-3xl shadow-xl overflow-hidden flex flex-col modal-soft-enter transition-all duration-300 ${
            isMinimized
              ? 'w-[300px] sm:w-[340px]'
              : isExpanded
              ? 'w-[calc(100vw-2rem)] sm:w-[560px] max-h-[85vh]'
              : 'w-[calc(100vw-2.25rem)] sm:w-[430px] max-h-[80vh]'
          }`}
          role="dialog"
          aria-label="CORE AI Companion"
        >
          {/* Drawer Header */}
          <div className="bg-white border-b border-[#BEA06D]/25 px-4 py-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CoreMonogramMark size="sm" />
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#493C39] leading-none flex items-center gap-1.5">
                  <span>
                    {language === 'kn'
                      ? 'CORE AI ಸಹಾಯಕ'
                      : language === 'te'
                      ? 'CORE AI సహాయకుడు'
                      : 'CORE Companion'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C88F98]" />
                </h3>
                <span className="text-[11px] text-[#8A6D3F] font-medium block mt-0.5">
                  {language === 'kn'
                    ? 'ಮಾರ್ಗದರ್ಶಕ · ವೈದ್ಯರಲ್ಲ'
                    : language === 'te'
                    ? 'మార్గదర్శి · డాక్టర్ కాదు'
                    : 'Guided Assistant · Not a Clinician'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onPageChange('voicebridge');
                  onToggleOpen(false);
                }}
                className="compact-chip px-2 py-1 rounded-full bg-[#A2B29B]/20 text-[#4A6347] hover:bg-[#A2B29B]/35 text-[11px] font-semibold hidden sm:inline-flex items-center gap-1 cursor-pointer"
                title={language === 'kn' ? 'ಧ್ವನಿ ಸೇತು ತೆರೆಯಿರಿ' : language === 'te' ? 'వాయిస్ బ్రిడ్జ్ తెరవండి' : 'Open CORE VoiceBridge'}
              >
                <Mic className="w-3 h-3" />
                <span>{language === 'kn' ? 'ಧ್ವನಿ' : language === 'te' ? 'వాయిస్' : 'Voice'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized((m) => !m)}
                className="compact-chip p-1.5 rounded-full text-[#493C39]/70 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 cursor-pointer"
                aria-label={isMinimized ? 'Restore Companion' : 'Minimize Companion'}
                title={isMinimized ? 'Restore' : 'Minimize'}
              >
                <Minus className="w-4 h-4" />
              </button>

              {!isMinimized && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((e) => !e)}
                  className="compact-chip p-1.5 rounded-full text-[#493C39]/70 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 cursor-pointer"
                  aria-label={isExpanded ? 'Compact size' : 'Expand size'}
                  title={isExpanded ? 'Compact' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleOpen(false)}
                className="compact-chip p-1.5 rounded-full text-[#493C39]/70 hover:text-[#493C39] hover:bg-[#E6C1C4]/25 cursor-pointer"
                aria-label="Close Companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode Switcher: Guide Me Through It | Ask CORE AI */}
              <div className="bg-white border-b border-[#BEA06D]/20 px-4 py-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('guide')}
                  className={`compact-chip flex-1 py-2 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'guide'
                      ? 'bg-[#BEA06D] text-white shadow-xs'
                      : 'bg-[#FCF9F5] text-[#493C39] hover:bg-[#E6C1C4]/20'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>
                    {language === 'kn'
                      ? 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ'
                      : language === 'te'
                      ? 'దశల వారీ సహాయం'
                      : 'Guide Me Through It'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('chat')}
                  className={`compact-chip flex-1 py-2 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'chat'
                      ? 'bg-[#C88F98] text-white shadow-xs'
                      : 'bg-[#FCF9F5] text-[#493C39] hover:bg-[#E6C1C4]/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'kn'
                      ? 'CORE AI ಕೇಳಿ'
                      : language === 'te'
                      ? 'CORE AI అడగండి'
                      : 'Ask CORE AI'}
                  </span>
                </button>
              </div>

              {mode === 'guide' ? (
                /* MODE 1: INTERACTIVE "GUIDE ME THROUGH IT" WORKFLOW */
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCF9F5]">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
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
                          className={`compact-chip text-left px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
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

                  {/* Selected Workflow Card */}
                  <div className="bg-white border border-[#BEA06D]/40 rounded-2xl p-4 space-y-3.5 soft-fade-up">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-display text-lg font-bold text-[#493C39] leading-snug">
                          {activeWorkflow.title[language]}
                        </h4>
                        <p className="text-xs text-[#493C39]/80 leading-relaxed">
                          {activeWorkflow.summary[language]}
                        </p>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-[#4A6347] shrink-0">
                        {wfCompletedCount}/{wfTotal}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4A6347] rounded-full transition-all duration-500"
                        style={{ width: `${wfPct}%` }}
                      />
                    </div>

                    {/* Interactive Steps */}
                    <div className="space-y-2.5">
                      {activeWorkflow.steps.map((step, idx) => {
                        const done = !!completedStepIds[step.id];
                        return (
                          <div
                            key={step.id}
                            className={`p-3 rounded-xl border transition-all space-y-2 ${
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
                                  className={`text-xs font-bold block ${
                                    done ? 'line-through text-[#493C39]/60' : 'text-[#493C39]'
                                  }`}
                                >
                                  {idx + 1}. {step.label[language]}
                                </span>
                                <p className="text-[11px] text-[#493C39]/75 mt-0.5">
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
                                  className="compact-chip py-1 px-3 rounded-full bg-white border border-[#BEA06D]/45 hover:border-[#C88F98] text-[11px] font-semibold text-[#8A6D3F] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>{step.actionLabel?.[language] || 'Open Smart Search'}</span>
                                </button>
                              ) : step.targetPage ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onPageChange(step.targetPage!);
                                    onToggleOpen(false);
                                  }}
                                  className="compact-chip py-1 px-3 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{step.actionLabel?.[language] || 'Open Feature'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Accomplishment Summary */}
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
                        <p className="text-[11px] text-[#493C39]/85">
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
                          className="compact-chip py-1.5 px-3 rounded-full bg-[#4A6347] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>
                            {language === 'kn'
                              ? 'ಭೇಟಿ ಸಾರಾಂಶ ನೋಡಿ'
                              : language === 'te'
                              ? 'విజిట్ సారాంశం చూడండి'
                              : 'View Visit Summary'}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Optional Gemini Natural-Language Guidance for Current Workflow */}
                  <div className="space-y-2.5">
                    <AiConsentNotice
                      language={language}
                      consentGranted={aiConsentGranted}
                      onAcceptConsent={onAcceptAiConsent}
                      compact
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={!aiConsentGranted || tipLoading}
                        onClick={() => void handleGetGentleWorkflowTip(false)}
                        className="compact-chip py-2 px-4 rounded-full bg-[#C88F98] hover:bg-[#b07680] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {language === 'kn'
                            ? 'ಈ ಕೆಲಸಕ್ಕೆ ಸರಳ AI ಸಲಹೆ ಪಡೆಯಿರಿ'
                            : language === 'te'
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
                        className="compact-chip text-[11px] font-semibold text-[#8A6D3F] underline cursor-pointer"
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
                          language === 'kn'
                            ? 'ಸರಳ ಭಾಷೆಯ ಸಲಹೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
                            : language === 'te'
                            ? 'సులభ భాషా సూచన సిద్ధం అవుతోంది...'
                            : 'Preparing plain-language step tip...'
                        }
                      />
                    )}

                    {tipError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                        {tipError}
                      </div>
                    )}

                    {stepTip && !tipLoading && (
                      <div className="p-4 rounded-2xl bg-white border border-[#BEA06D]/40 space-y-2.5 soft-fade-up">
                        <AiTrustHeader
                          language={language}
                          label={
                            language === 'kn'
                              ? 'AI ಹಂತದ ಸಲಹೆ · Gemini'
                              : language === 'te'
                              ? 'AI దశ సూచన · Gemini'
                              : 'AI Step Tip · Gemini'
                          }
                          onAskClarification={() => void handleGetGentleWorkflowTip(true)}
                          onListen={() => speechService.speak(stepTip.text, language)}
                          clarifyDisabled={tipLoading}
                        />
                        <p className="text-xs sm:text-sm text-[#493C39] leading-relaxed">{stepTip.text}</p>
                        <AiTrustFooter language={language} uncertaintyNote={stepTip.safety} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MODE 2: CONVERSATIONAL GEMINI AI COMPANION */
                <>
                  {/* Safety Boundary Banner */}
                  <div className="bg-[#E6C1C4]/25 border-b border-[#E6C1C4]/60 px-4 py-2 flex items-start gap-2 text-[11px] text-[#493C39]/90">
                    <ShieldAlert className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                    <span>
                      {language === 'kn'
                        ? 'AI ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ: ರೋಗನಿರ್ಣಯ, ಔಷಧಿ ಪ್ರಮಾಣ ಅಥವಾ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ.'
                        : language === 'te'
                        ? 'AI మార్గదర్శనం మాత్రమే: వ్యాధి నిర్ధారణ, మందుల మోతాదు లేదా అత్యవసర సలహాలు ఇవ్వదు.'
                        : 'AI Guide Only — cannot diagnose conditions, adjust medicines, or verify hospital bookings. Confirm medical details with clinic staff.'}
                    </span>
                  </div>

                  {/* Active Module Context Indicator */}
                  <div className="bg-[#FCF9F5] border-b border-[#BEA06D]/20 px-4 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-[#8A6D3F] font-semibold">
                      {language === 'kn'
                        ? 'ಪ್ರಸ್ತುತ ಪುಟ:'
                        : language === 'te'
                        ? 'ప్రస్తుత స్క్రీన్:'
                        : 'Current Screen:'}{' '}
                      <strong className="text-[#493C39]">{activePageCtx.title[language]}</strong>
                    </span>
                    <span className="text-[10px] text-[#4A6347] font-medium">
                      {language === 'kn'
                        ? 'ಸಂದರ್ಭ-ಜಾಗೃತ ಸಹಾಯ'
                        : language === 'te'
                        ? 'సందర్భానుసార సహాయం'
                        : 'Context-Aware Guide'}
                    </span>
                  </div>

                  {/* Session Consent Notice */}
                  <div className="px-4 pt-3">
                    <AiConsentNotice
                      language={language}
                      consentGranted={aiConsentGranted}
                      onAcceptConsent={onAcceptAiConsent}
                      compact
                    />
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
                          className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#BEA06D] text-white'
                              : msg.sender === 'error'
                              ? 'bg-red-50 border border-red-200 text-red-900'
                              : 'bg-white border border-[#BEA06D]/30 text-[#493C39]'
                          }`}
                        >
                          {msg.sender === 'assistant' && msg.id !== `welcome-${language}-${resetSignal}` && msg.id !== 'welcome' && (
                            <div className="mb-2">
                              <AiTrustHeader
                                language={language}
                                label={
                                  language === 'kn'
                                    ? 'AI ಉತ್ತರ · Gemini'
                                    : language === 'te'
                                    ? 'AI సమాధానం · Gemini'
                                    : 'AI-Generated · Gemini'
                                }
                                onAskClarification={
                                  aiConsentGranted && !isLoading
                                    ? () =>
                                        void sendMessageToGemini(
                                          `Please explain your previous guidance more simply and note anything I should double-check with hospital staff.`
                                        )
                                    : undefined
                                }
                                onListen={() => speechService.speak(msg.text, language)}
                              />
                            </div>
                          )}

                          {msg.sender === 'error' && (
                            <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-red-700">
                              <AlertCircle className="w-4 h-4" />
                              <span>
                                {language === 'kn'
                                  ? 'AI ಸೇವಾ ಸೂಚನೆ'
                                  : language === 'te'
                                  ? 'AI సేవా గమనిక'
                                  : 'AI Service Notice'}
                              </span>
                            </div>
                          )}

                          <p className="whitespace-pre-line">{msg.text}</p>

                          {msg.followUpQuestion && (
                            <button
                              type="button"
                              disabled={!aiConsentGranted || isLoading}
                              onClick={() => void sendMessageToGemini(msg.followUpQuestion!)}
                              className="mt-2.5 text-left text-xs text-[#8A6D3F] bg-[#FCF9F5] border border-[#BEA06D]/35 hover:border-[#C88F98] px-3 py-1.5 rounded-xl block w-full cursor-pointer transition-colors"
                            >
                              {msg.followUpQuestion}
                            </button>
                          )}

                          {msg.safetyNotice && (
                            <p className="mt-2 text-[11px] text-[#493C39]/75 italic border-t border-[#E6C1C4]/50 pt-1.5">
                              {msg.safetyNotice}
                            </p>
                          )}

                          {msg.sender === 'assistant' && (
                            <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-[#BEA06D]/15">
                              <button
                                type="button"
                                onClick={() => speechService.speak(msg.text, language)}
                                className="compact-chip px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 text-[11px] font-semibold text-[#8A6D3F] hover:bg-[#E6C1C4]/20 inline-flex items-center gap-1 cursor-pointer"
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
                                  <span>{msg.suggestedActionLabel || activePageCtx.title[language]}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}

                          {msg.sender === 'error' && lastFailedPrompt && (
                            <button
                              type="button"
                              onClick={() => void sendMessageToGemini(lastFailedPrompt)}
                              className="mt-2 text-xs font-bold text-red-800 underline cursor-pointer"
                            >
                              {language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : language === 'te' ? 'మళ్ళీ ప్రయత్నించండి' : 'Retry'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <AiSkeletonLoader
                        label={
                          language === 'kn'
                            ? 'CORE AI ಉತ್ತರ ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                            : language === 'te'
                            ? 'CORE AI సమాధానం సిద్ధం చేస్తోంది...'
                            : 'CORE AI is composing a gentle response...'
                        }
                      />
                    )}
                    <div ref={endRef} />
                  </div>

                  {/* Contextual Starter Prompts */}
                  <div className="bg-white border-t border-[#BEA06D]/20 px-4 pt-3 pb-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider">
                        {language === 'kn'
                          ? 'ಈ ಪುಟಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳು'
                          : language === 'te'
                          ? 'ఈ స్క్రీన్ కోసం సూచన ప్రశ్నలు'
                          : `Suggested for ${activePageCtx.title.en}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenComfortMode();
                            onToggleOpen(false);
                          }}
                          className="compact-chip text-[11px] font-semibold text-[#8A6D3F] underline hover:text-[#493C39] cursor-pointer"
                        >
                          {language === 'kn' ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' : language === 'te' ? 'సెట్టింగ్స్' : 'Settings'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onPageChange('help');
                            onToggleOpen(false);
                          }}
                          className="compact-chip text-[11px] font-semibold text-[#C88F98] hover:text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>{language === 'kn' ? 'ಸಹಾಯ' : language === 'te' ? 'సహాయం' : 'Get Help'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {activePageCtx.prompts.map((promptObj, idx) => (
                        <button
                          key={`${currentPage}-ctx-${idx}`}
                          type="button"
                          disabled={!aiConsentGranted || isLoading}
                          onClick={() => void sendMessageToGemini(promptObj[language])}
                          className="compact-chip text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-[#FCF9F5] hover:bg-[#E6C1C4]/25 disabled:opacity-50 border border-[#BEA06D]/30 text-[#493C39] font-medium transition-colors cursor-pointer"
                        >
                          {promptObj[language]}
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
                      maxLength={1200}
                      disabled={!aiConsentGranted || isLoading}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        !aiConsentGranted
                          ? language === 'kn'
                            ? 'ಮೊದಲು ಮೇಲಿನ AI ಸಮ್ಮತಿಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ...'
                            : language === 'te'
                            ? 'ముందుగా పైన AI అనుమతిని ఆమోదించండి...'
                            : 'Accept AI consent above to ask...'
                          : language === 'kn'
                          ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...'
                          : language === 'te'
                          ? 'మీ ప్రశ్నను టైప్ చేయండి...'
                          : 'Ask about navigation, visit prep, or terms...'
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-xs sm:text-sm text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D] disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={!aiConsentGranted || isLoading || !inputText.trim()}
                      className="compact-chip p-2.5 rounded-xl bg-[#C88F98] hover:bg-[#b27882] disabled:opacity-50 text-white transition-colors cursor-pointer"
                      aria-label="Send message to AI Companion"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating Rosewater Trigger Button */}
      <button
        type="button"
        onClick={() => {
          onToggleOpen(!isOpen);
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
    </div>
  );
};
