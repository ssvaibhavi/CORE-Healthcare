import React, { useState } from 'react';
import { Reveal, WordReveal, GracefulExpand } from '../components/Reveal';
import { ComfortSettings, Language, PageView } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Info,
  SlidersHorizontal,
  Sparkles,
  Users,
  Volume2
} from 'lucide-react';
import { speechService } from '../utils/speech';

interface CareStoriesViewProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onApplyComfortPatch: (patch: Partial<ComfortSettings>) => void;
  onPageChange: (page: PageView) => void;
}

interface StoryChoice {
  id: string;
  label: Record<Language, string>;
  adaptationNote: Record<Language, string>;
  targetPage: PageView;
  actionLabel: Record<Language, string>;
  comfortPatch?: Partial<ComfortSettings>;
  languageTarget?: Language;
}

interface FictionalStoryPersona {
  id: string;
  badge: Record<Language, string>;
  title: Record<Language, string>;
  personaSubtitle: Record<Language, string>;
  challenge: Record<Language, string>;
  stages: Array<{
    step: string;
    heading: Record<Language, string>;
    detail: Record<Language, string>;
  }>;
  choices: StoryChoice[];
}

const FICTIONAL_STORIES: FictionalStoryPersona[] = [
  {
    id: 'elder-kannada',
    badge: {
      en: 'Fictional Persona 01 · Older Adult',
      kn: 'ಕಾಲ್ಪನಿಕ ಪಾತ್ರ 01 · ಹಿರಿಯ ನಾಗರಿಕರು',
      te: 'కల్పిత పాత్ర 01 · వృద్ధ రోగి',
    },
    title: {
      en: 'Older Adult Who Prefers Kannada & Larger Text',
      kn: 'ಕನ್ನಡ ಮತ್ತು ದೊಡ್ಡ ಅಕ್ಷರಗಳನ್ನು ಬಯಸುವ ಹಿರಿಯರು',
      te: 'కన్నడ మరియు పెద్ద అక్షరాలను ఇష్టపడే వృద్ధులు',
    },
    personaSubtitle: {
      en: 'Illustrative demo character · Rural outpatient returning for a diagnostic scan',
      kn: 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪಾತ್ರ · ಸ್ಕ್ಯಾನ್ ತಪಾಸಣೆಗೆ ಬರುವ ಗ್ರಾಮೀಣ ಹಿರಿಯರು',
      te: 'నమూనా పాత్ర · స్కాన్ కోసం వచ్చే గ్రామీణ వృద్ధులు',
    },
    challenge: {
      en: 'Small English text on a phone screen feels tiring and stressful. He wants calm Kannada labels, extra-large readable type, and spoken confirmation.',
      kn: 'ಮೊಬೈಲ್ ಪರದೆಯ ಚಿಕ್ಕ ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳು ಕಣ್ಣಿಗೆ ಆಯಾಸ ತರುತ್ತವೆ. ಅವರಿಗೆ ಸ್ಪಷ್ಟ ಕನ್ನಡ, ದೊಡ್ಡ ಅಕ್ಷರ ಮತ್ತು ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಬೇಕು.',
      te: 'ఫోన్ స్క్రీన్‌పై చిన్న ఇంగ్లీష్ అక్షరాలు చదవడం కష్టంగా ఉంది. ఆయనకు పెద్ద అక్షరాలు, కన్నడ భాష మరియు వాయిస్ సహాయం కావాలి.',
    },
    stages: [
      {
        step: 'Stage 01 · Arrival',
        heading: {
          en: 'Switching from small English cards to calm native script',
          kn: 'ಚಿಕ್ಕ ಇಂಗ್ಲಿಷ್ ಪದಗಳಿಂದ ಸ್ಪಷ್ಟ ಕನ್ನಡಕ್ಕೆ ಬದಲಾವಣೆ',
          te: 'చిన్న ఇంగ్లీష్ అక్షరాల నుండి స్పష్టమైన మాతృభాషకు మార్పు',
        },
        detail: {
          en: 'Instead of parsing abbreviations alone, CORE presents larger typography, gentler pacing, and voice playback.',
          kn: 'ಸಂಕೀರ್ಣ ಪದಗಳ ಬದಲು ದೊಡ್ಡ ಅಕ್ಷರಗಳು ಮತ್ತು ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸುವ ಸೌಲಭ್ಯ ಸಿಗುತ್ತದೆ.',
          te: 'కష్టమైన పదాలకు బదులుగా పెద్ద అక్షరాలు మరియు వాయిస్ వినిపించే సౌకర్యం ఉంటుంది.',
        },
      },
      {
        step: 'Stage 02 · Adaptation',
        heading: {
          en: 'Extra-Large Text + Extra Simple Language + Spoken Audio',
          kn: 'ದೊಡ್ಡ ಅಕ್ಷರ + ಅತಿ ಸರಳ ವಿವರಣೆ + ಧ್ವನಿ ಓದುಗ',
          te: 'పెద్ద అక్షరాలు + అతి సులభ వివరణ + వాయిస్ సహాయం',
        },
        detail: {
          en: 'Try the interactive options below to see how CORE immediately updates typography, voice readout, and navigation.',
          kn: 'ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಒತ್ತಿ CORE ಪರದೆ ಹೇಗೆ ಬದಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನೇರವಾಗಿ ನೋಡಿ.',
          te: 'కింది ఎంపికలను నొక్కి CORE స్క్రీన్ ఎలా మారుతుందో ప్రత్యక్షంగా చూడండి.',
        },
      },
    ],
    choices: [
      {
        id: 'apply-elder-kn',
        label: {
          en: 'Apply Kannada + Extra-Large Text + Extra Simple AI Style',
          kn: 'ಕನ್ನಡ + ದೊಡ್ಡ ಅಕ್ಷರ + ಅತಿ ಸರಳ AI ಶೈಲಿ ಅನ್ವಯಿಸಿ',
          te: 'కన్నడ + పెద్ద అక్షరాలు + అతి సులభ AI శైలి వర్తింపజేయండి',
        },
        adaptationNote: {
          en: 'CORE switches UI language to Kannada, scales text to Extra Large, enables Read-Aloud & Large Buttons, and sets AI responses to Extra Simple.',
          kn: 'CORE ತಕ್ಷಣ ಕನ್ನಡ ಭಾಷೆ, ಅತಿ ದೊಡ್ಡ ಅಕ್ಷರ, ದೊಡ್ಡ ಬಟನ್‌ಗಳು ಮತ್ತು ಅತಿ ಸರಳ AI ವಿವರಣೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತದೆ.',
          te: 'CORE వెంటనే కన్నడ భాష, చాలా పెద్ద అక్షరాలు మరియు అతి సులభ AI శైలిని సిద్ధం చేస్తుంది.',
        },
        targetPage: 'appointment',
        actionLabel: {
          en: 'Open Hear My Appointment',
          kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ ತೆರೆಯಿರಿ',
          te: 'నా అపాయింట్‌మెంట్ వినండి తెరవండి',
        },
        languageTarget: 'kn',
        comfortPatch: {
          textSize: 'xlarge',
          largeButtons: true,
          readAloud: true,
          explanationComplexity: 'extra_simple',
        },
      },
      {
        id: 'apply-elder-voice',
        label: {
          en: 'Keep Current Language + Use VoiceBridge & Gentle Motion',
          kn: 'ಪ್ರಸ್ತುತ ಭಾಷೆಯೊಂದಿಗೆ VoiceBridge ಮತ್ತು ಸೌಮ್ಯ ಚಲನೆ ಬಳಸಿ',
          te: 'ప్రస్తుత భాషతో VoiceBridge & సౌమ్య యానిమేషన్ వాడండి',
        },
        adaptationNote: {
          en: 'CORE lowers visual motion to Gentle Motion and opens CORE VoiceBridge for hands-free spoken guidance.',
          kn: 'CORE ಚಲನೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ VoiceBridge ತೆರೆಯುತ್ತದೆ.',
          te: 'CORE కదలికలను తగ్గించి వాయిస్ సహాయం కోసం VoiceBridge తెరుస్తుంది.',
        },
        targetPage: 'voicebridge',
        actionLabel: {
          en: 'Launch CORE VoiceBridge',
          kn: 'CORE ವಾಯ್ಸ್‌ಬ್ರಿಡ್ಜ್ ತೆರೆಯಿರಿ',
          te: 'CORE వాయిస్‌బ್ರಿడ్జ్ తెరవండి',
        },
        comfortPatch: {
          motionMode: 'gentle',
          reduceMotion: false,
          readAloud: true,
        },
      },
    ],
  },
  {
    id: 'first-time-visitor',
    badge: {
      en: 'Fictional Persona 02 · First-Time Visitor',
      kn: 'ಕಾಲ್ಪನಿಕ ಪಾತ್ರ 02 · ಮೊದಲ ಭೇಟಿಗಾರರು',
      te: 'కల్పిత పాత్ర 02 · మొదటిసారి సందర్శకుడు',
    },
    title: {
      en: 'First-Time Hospital Visitor Needing Step-by-Step Guidance',
      kn: 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ ಬಯಸುವ ಮೊದಲ ಆಸ್ಪತ್ರೆ ಭೇಟಿಗಾರರು',
      te: 'దశల వారీ సహాయం కావాల్సిన మొదటిసారి ఆసుపత్రి సందర్శకులు',
    },
    personaSubtitle: {
      en: 'Illustrative demo character · Unfamiliar with counters, blocks, and terminology',
      kn: 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪಾತ್ರ · ಆಸ್ಪತ್ರೆ ಕೌಂಟರ್‌ಗಳು ಮತ್ತು ನಿಯಮಗಳ ಪರಿಚಯವಿಲ್ಲದವರು',
      te: 'నమూనా పాత్ర · ఆసుపత్రి కౌంటర్లు మరియు నియమాలు కొత్తగా ఉన్నవారు',
    },
    challenge: {
      en: 'Seeing words like "Block B", "NPO", or "Counter 4" creates anxiety before leaving home. She wants every step broken down sequentially.',
      kn: '"NPO", "Block B", "Counter 4" ಪದಗಳು ಗೊಂದಲ ತರುತ್ತವೆ. ಅವರಿಗೆ ಪ್ರತಿ ಹಂತವೂ ಒಂದಾದ ಮೇಲೊಂದರಂತೆ ಸ್ಪಷ್ಟವಾಗಿ ಬೇಕು.',
      te: '"NPO", "Block B", "Counter 4" వంటి పదాలు ఆందోళన కలిగిస్తాయి. ప్రతి పనిని వరుస క్రమంలో తెలుసుకోవాలనుకుంటున్నారు.',
    },
    stages: [
      {
        step: 'Stage 01 · Understanding Terms',
        heading: {
          en: 'Turning hospital phrases into everyday instructions',
          kn: 'ಆಸ್ಪತ್ರೆ ಪದಗಳನ್ನು ದೈನಂದಿನ ಮಾತಿನಲ್ಲಿ ವಿವರಿಸುವುದು',
          te: 'ఆసుపత్రి పదాలను సులభమైన రోజువారీ మాటల్లోకి మార్చడం',
        },
        detail: {
          en: 'CORE Clarity AI translates administrative terms alongside verified reference examples and suggests staff questions.',
          kn: 'CORE Clarity AI ಕಷ್ಟದ ಪದಗಳನ್ನು ಸರಳಗೊಳಿಸಿ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳನ್ನು ನೀಡುತ್ತದೆ.',
          te: 'CORE Clarity AI కష్టమైన పదాలను విడమరిచి సిబ్బందిని అడగాల్సిన ప్రశ్నలను సూచిస్తుంది.',
        },
      },
      {
        step: 'Stage 02 · Guided Bar & Sequence',
        heading: {
          en: 'Enabling Guided Mode & 3-Stage Care Journey',
          kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ ಮತ್ತು 3-ಹಂತದ ಆರೈಕೆ ಪಯಣ',
          te: 'గైడెడ్ మోడ్ మరియు 3-దశల ఆరోగ్య ప్రయాణం',
        },
        detail: {
          en: 'Guided Mode pins a calm progress strip at the top while My Care Journey organizes Before, During, and After tasks.',
          kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಸ್ಪಷ್ಟ ಹಂತಗಳನ್ನು ತೋರಿಸುತ್ತದೆ ಮತ್ತು ಆರೈಕೆ ಪಯಣ ಸಿದ್ಧತೆಯನ್ನು ಜೋಡಿಸುತ್ತದೆ.',
          te: 'గైడెడ్ మోడ్ పైన దశల వారీ దారిని చూపిస్తుంది, ఆరోగ్య ప్రయాణం పనులను క్రమబద్ధీకరిస్తుంది.',
        },
      },
    ],
    choices: [
      {
        id: 'enable-guided-journey',
        label: {
          en: 'Enable Guided Mode + Simplified Navigation & Open Care Journey',
          kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ + ಸರಳ ಮೆನು ಆನ್ ಮಾಡಿ ಆರೈಕೆ ಪಯಣ ತೆರೆಯಿರಿ',
          te: 'గైడెడ్ మోడ్ + సరళ మెనూ ఆన్ చేసి ఆరోగ్య ప్రయాణం తెరవండి',
        },
        adaptationNote: {
          en: 'CORE activates the Guided Mode step bar, simplifies header links to essential tasks, and prepares Before/During/After visit checklists.',
          kn: 'CORE ಮಾರ್ಗದರ್ಶಿ ಬಾರ್ ಅನ್ನು ಆನ್ ಮಾಡಿ ಮುಖ್ಯ ಮೆನುವನ್ನು ಸರಳಗೊಳಿಸುತ್ತದೆ.',
          te: 'CORE గైడెడ్ మోడ్‌ను ప్రారంభించి మెనూను సులభతరం చేస్తుంది.',
        },
        targetPage: 'journey',
        actionLabel: {
          en: 'Go to My Care Journey',
          kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣಕ್ಕೆ ಹೋಗಿ',
          te: 'నా ఆరోగ్య ప్రయాణానికి వెళ్ళండి',
        },
        comfortPatch: {
          guidedMode: true,
          simplifiedNav: true,
        },
      },
      {
        id: 'open-clarity-first',
        label: {
          en: 'Open Explain It Simply (CORE Clarity AI) First',
          kn: 'ಮೊದಲು ಸರಳವಾಗಿ ವಿವರಿಸಿ (CORE Clarity AI) ತೆರೆಯಿರಿ',
          te: 'ముందుగా సులభంగా వివరించండి (CORE Clarity AI) తెరవండి',
        },
        adaptationNote: {
          en: 'Takes the visitor straight to plain-language explanations of common hospital SMS instructions.',
          kn: 'ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳ ಸರಳ ವಿವರಣೆ ಪುಟಕ್ಕೆ ನೇರವಾಗಿ ಕರೆದೊಯ್ಯುತ್ತದೆ.',
          te: 'ఆసుపత్రి సూచనల సులభ వివరణ పేజీకి నేరుగా తీసుకువెళుతుంది.',
        },
        targetPage: 'clarity',
        actionLabel: {
          en: 'Open CORE Clarity AI',
          kn: 'CORE Clarity AI ತೆರೆಯಿರಿ',
          te: 'CORE Clarity AI తెరవండి',
        },
      },
    ],
  },
  {
    id: 'family-caregiver',
    badge: {
      en: 'Fictional Persona 03 · Family Caregiver',
      kn: 'ಕಾಲ್ಪನಿಕ ಪಾತ್ರ 03 · ಕುಟುಂಬ ಆರೈಕೆದಾರರು',
      te: 'కల్పిత పాత్ర 03 · కుటుంబ సంరక్షకుడు',
    },
    title: {
      en: 'Caregiver Helping a Parent Prepare for a Consultation',
      kn: 'ಪೋಷಕರ ಆಸ್ಪತ್ರೆ ಭೇಟಿಗೆ ನೆರವಾಗುವ ಕುಟುಂಬದ ಸದಸ್ಯರು',
      te: 'తల్లిదండ్రుల ఆసుపత్రి సందర్శనకు సహాయం చేసే సంరక్షకుడు',
    },
    personaSubtitle: {
      en: 'Illustrative demo character · Coordinating documents, transit, and reminders respectfully',
      kn: 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪಾತ್ರ · ದಾಖಲೆಗಳು, ಪ್ರಯಾಣ ಮತ್ತು ಜ್ಞಾಪನೆಗಳನ್ನು ಗೌರವದಿಂದ ಜೋಡಿಸುವುದು',
      te: 'నమూనా పాత్ర · పత్రాలు, ప్రయాణం మరియు రిమైండర్లను సమన్వయం చేయడం',
    },
    challenge: {
      en: 'Working in a nearby town, he wants to help his father keep documents and timings organized without taking away his father’s independence or sharing private health details unnecessarily.',
      kn: 'ಬೇರೆ ಊರಿನಲ್ಲಿರುವ ಮಗ, ತಂದೆಯ ಸ್ವಾಭಿಮಾನಕ್ಕೆ ಧಕ್ಕೆಯಾಗದಂತೆ ಕೇವಲ ಭೇಟಿಯ ಸಮಯ ಮತ್ತು ದಾಖಲೆ ಸಿದ್ಧತೆಯಲ್ಲಿ ನೆರವಾಗಲು ಬಯಸುತ್ತಾರೆ.',
      te: 'పక్క ఊరిలో ఉండే కొడుకు, తన తండ్రి స్వేచ్ఛకు భంగం కలగకుండా కేవలం సందర్శన సమయం మరియు పత్రాల ఏర్పాట్లలో సహాయం చేయాలనుకుంటున్నారు.',
    },
    stages: [
      {
        step: 'Stage 01 · Consented Sharing',
        heading: {
          en: 'Patient-approved handoff without exposing medical records',
          kn: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆ ಬಹಿರಂಗಪಡಿಸದೆ ಸಮ್ಮತಿ ಆಧಾರಿತ ಹಂಚಿಕೆ',
          te: 'వైద్య రికార్డులు చూపకుండా అనుమతితో మాత్రమే పంచుకోవడం',
        },
        detail: {
          en: 'CareCircle Connect only builds a caregiver summary when the patient toggles consent on and chooses what to share.',
          kn: 'ರೋಗಿಯ ಒಪ್ಪಿಗೆ ಇದ್ದಾಗ ಮಾತ್ರ CareCircle ಭೇಟಿಯ ಸಾರಾಂಶವನ್ನು ತೋರಿಸುತ್ತದೆ.',
          te: 'రోగి అనుమతి ఇచ్చినప్పుడు మాత్రమే CareCircle సారాంశాన్ని రూపొందిస్తుంది.',
        },
      },
      {
        step: 'Stage 02 · Printable Visit Summary',
        heading: {
          en: 'Creating a shared Visit Passport & calendar reminder',
          kn: 'ಪ್ರಿಂಟ್ ಮಾಡಬಹುದಾದ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ',
          te: 'ప్రింట్ చేయగల విజిట్ పాస్‌పోర్ట్ మరియు క్యాలెండర్ రిమైండర్',
        },
        detail: {
          en: 'Export an .ics calendar event in CareCompass or print a Visit Passport card for travel morning.',
          kn: 'ಪ್ರಯಾಣದ ಬೆಳಗ್ಗೆಯ ಸಿದ್ಧತೆಗಾಗಿ ಕಾರ್ಡ್ ಪ್ರಿಂಟ್ ಅಥವಾ ಕ್ಯಾಲೆಂಡರ್ ಫೈಲ್ ಉಳಿಸಬಹುದು.',
          te: 'ప్రయాణ ఉదయం కోసం కార్డు ప్రింట్ లేదా క్యాలెండర్ రిమైండర్ సేవ్ చేయవచ్చు.',
        },
      },
    ],
    choices: [
      {
        id: 'caregiver-detailed-carecircle',
        label: {
          en: 'Set Detailed Style + Open CareCircle Caregiver Handoff',
          kn: 'ವಿವರವಾದ AI ಶೈಲಿ + CareCircle ಹಂಚಿಕೆ ಪುಟ ತೆರೆಯಿರಿ',
          te: 'వివరమైన AI శైలి + CareCircle పేజీ తెరవండి',
        },
        adaptationNote: {
          en: 'Sets AI explanations to Detailed for thorough planning and opens CareCircle so the caregiver can inspect consent-first sharing controls.',
          kn: 'AI ವಿವರಣೆಯನ್ನು ವಿವರವಾದ ಮಟ್ಟಕ್ಕೆ ಹೊಂದಿಸಿ CareCircle ತೆರೆಯುತ್ತದೆ.',
          te: 'AI శైలిని వివరంగా ఉంచి CareCircle నియంత్రణలను తెరుస్తుంది.',
        },
        targetPage: 'carecircle',
        actionLabel: {
          en: 'Open CareCircle',
          kn: 'CareCircle ತೆರೆಯಿರಿ',
          te: 'CareCircle తెరవండి',
        },
        comfortPatch: {
          explanationComplexity: 'detailed',
          simplifiedNav: false,
        },
      },
      {
        id: 'caregiver-passport',
        label: {
          en: 'Prepare Printable Visit Passport & Clinician Questions',
          kn: 'ಪ್ರಿಂಟ್ ಮಾಡಬಹುದಾದ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೆರೆಯಿರಿ',
          te: 'ప్రింట్ చేయగల విజిట్ పాస్‌పోర్ట్ తెరవండి',
        },
        adaptationNote: {
          en: 'Opens the printable Visit Passport so both parent and caregiver can organize documents and doctor questions together.',
          kn: 'ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಸಿದ್ಧಪಡಿಸಲು ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೆರೆಯುತ್ತದೆ.',
          te: 'పత్రాలు మరియు ప్రశ్నలను సిద్ధం చేయడానికి విజిట్ పాస్‌పోర్ట్ తెరుస్తుంది.',
        },
        targetPage: 'passport',
        actionLabel: {
          en: 'Open Visit Passport',
          kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೆರೆಯಿರಿ',
          te: 'విజిట్ పాస్‌పోర్ట్ తెరవండి',
        },
      },
    ],
  },
];

export const CareStoriesView: React.FC<CareStoriesViewProps> = ({
  currentLanguage,
  onLanguageChange,
  onApplyComfortPatch,
  onPageChange,
}) => {
  const [activePersonaId, setActivePersonaId] = useState<string>(FICTIONAL_STORIES[0].id);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [appliedBanner, setAppliedBanner] = useState<string | null>(null);

  const activeStory =
    FICTIONAL_STORIES.find((s) => s.id === activePersonaId) || FICTIONAL_STORIES[0];

  const handleSelectStory = (id: string) => {
    setActivePersonaId(id);
    setSelectedChoice(null);
    setAppliedBanner(null);
  };

  const handleApplyChoice = (choice: StoryChoice) => {
    setSelectedChoice(choice);
    if (choice.comfortPatch) {
      onApplyComfortPatch(choice.comfortPatch);
    }
    if (choice.languageTarget && choice.languageTarget !== currentLanguage) {
      onLanguageChange(choice.languageTarget);
    }
    setAppliedBanner(choice.adaptationNote[choice.languageTarget || currentLanguage]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#493C39] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#C88F98] font-medium">
          CORE Care Stories · Fictional Interactive Demos
        </span>
      </div>

      {/* Editorial Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest block">
            CORE Care Stories
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#493C39] text-balance">
            <WordReveal
              text={
                currentLanguage === 'kn'
                  ? 'ಸಂವಾದಾತ್ಮಕ ಆರೈಕೆ ಕಥೆಗಳು'
                  : currentLanguage === 'te'
                  ? 'ఇంటరాక్టివ్ కేర్ స్టోరీస్'
                  : 'Interactive Patient & Caregiver Journeys'
              }
            />
          </h1>
          <p className="text-sm sm:text-base text-[#493C39]/80">
            {currentLanguage === 'kn'
              ? 'ಮೂರು ಕಾಲ್ಪನಿಕ ಪಾತ್ರಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ ಮತ್ತು ಅವರ ಆಯ್ಕೆಗಳಿಗೆ ತಕ್ಕಂತೆ CORE ಹೇಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಿ.'
              : currentLanguage === 'te'
              ? 'మూడు కల్పిత పాత్రలలో ఒకదాన్ని ఎంచుకుని, వారి అవసరాలకు అనుగుణంగా CORE ఎలా మారుతుందో చూడండి.'
              : 'Select one of three fictional demonstration personas below to make real choices and watch CORE adapt live.'}
          </p>
        </div>
      </Reveal>

      {/* Honest Fictional Demo Notice */}
      <Reveal delay={80}>
        <div className="p-4 rounded-2xl bg-[#E6C1C4]/22 border border-[#E6C1C4] flex items-start gap-3 text-xs sm:text-sm text-[#493C39]">
          <Info className="w-5 h-5 text-[#C88F98] shrink-0 mt-0.5" />
          <p>
            <strong>Fictional Demonstration Notice:</strong> All three personas below are illustrative design scenarios created to show how CORE adapts text size, language, guided navigation, and caregiver handoffs. They do not represent real patients or clinical study data.
          </p>
        </div>
      </Reveal>

      {/* 3 Persona Selector Cards (Staggered) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FICTIONAL_STORIES.map((story, idx) => {
          const active = story.id === activePersonaId;
          const Icon =
            story.id === 'elder-kannada'
              ? Volume2
              : story.id === 'first-time-visitor'
              ? Compass
              : Users;

          return (
            <Reveal key={story.id} delay={idx * 130} variant="bloom" className="h-full">
              <button
                type="button"
                onClick={() => handleSelectStory(story.id)}
                className={`w-full h-full text-left p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 cursor-pointer botanical-card-hover ${
                  active
                    ? 'bg-white border-[#C88F98] shadow-sm'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/35 hover:border-[#BEA06D]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#E6C1C4]/80 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#8A6D3F]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#C88F98]">
                      {story.badge[currentLanguage]}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#493C39] leading-snug">
                    {story.title[currentLanguage]}
                  </h2>
                  <p className="text-xs text-[#493C39]/75 leading-relaxed">
                    {story.personaSubtitle[currentLanguage]}
                  </p>
                </div>

                <span className="text-xs font-bold text-[#8A6D3F] inline-flex items-center gap-1 pt-2 border-t border-[#BEA06D]/20">
                  <span>{active ? 'Selected Story' : 'Explore Story'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Expanded Interactive Story Canvas */}
      <Reveal delay={120} variant="bloom">
        <section
          key={activeStory.id}
          className="bg-white border border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 soft-bloom"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C88F98] uppercase tracking-wider block">
                {activeStory.badge[currentLanguage]}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39]">
                {activeStory.title[currentLanguage]}
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                speechService.speak(
                  `${activeStory.title[currentLanguage]}. ${activeStory.challenge[currentLanguage]}`,
                  currentLanguage
                )
              }
              className="compact-chip py-2 px-4 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 text-xs font-semibold text-[#8A6D3F] hover:bg-[#E6C1C4]/20 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Story</span>
            </button>
          </div>

          {/* Challenge */}
          <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#E6C1C4]/75 space-y-1.5">
            <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
              Fictional Scenario Context
            </span>
            <p className="text-sm sm:text-base text-[#493C39] leading-relaxed">
              {activeStory.challenge[currentLanguage]}
            </p>
          </div>

          {/* Story Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeStory.stages.map((st, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#BEA06D]/30 space-y-2"
              >
                <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
                  {st.step}
                </span>
                <h3 className="font-display text-xl font-bold text-[#493C39]">
                  {st.heading[currentLanguage]}
                </h3>
                <p className="text-xs sm:text-sm text-[#493C39]/80 leading-relaxed">
                  {st.detail[currentLanguage]}
                </p>
              </div>
            ))}
          </div>

          <div className="rosewater-divider" />

          {/* Interactive Choices */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C88F98]" />
              <span>Make a Choice &amp; Adapt CORE Live</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStory.choices.map((choice) => {
                const isSelected = selectedChoice?.id === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleApplyChoice(choice)}
                    className={`p-5 rounded-2xl border text-left transition-all space-y-2 cursor-pointer botanical-card-hover ${
                      isSelected
                        ? 'bg-[#A2B29B]/15 border-[#4A6347] shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/35 hover:border-[#C88F98]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm text-[#493C39] leading-snug">
                        {choice.label[currentLanguage]}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#4A6347] shrink-0 check-pop" />
                      )}
                    </div>
                    <p className="text-xs text-[#493C39]/75 leading-relaxed">
                      {choice.adaptationNote[currentLanguage]}
                    </p>
                  </button>
                );
              })}
            </div>

            <GracefulExpand isOpen={Boolean(selectedChoice && appliedBanner)}>
              {selectedChoice && (
                <div className="mt-3 p-5 rounded-2xl bg-[#A2B29B]/18 border border-[#4A6347]/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#4A6347] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider block">
                        Live Adaptation Applied
                      </span>
                      <p className="text-xs sm:text-sm text-[#493C39]">{appliedBanner}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPageChange(selectedChoice.targetPage)}
                    className="py-2.5 px-5 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedChoice.actionLabel[selectedChoice.languageTarget || currentLanguage]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </GracefulExpand>
          </div>
        </section>
      </Reveal>
    </div>
  );
};
