import { DisruptionScenarioId, Language } from '../types';
import { HospitalNodeId } from './hospitalMapData';

export interface RecoveryScenarioDefinition {
  id: Exclude<DisruptionScenarioId, 'none'>;
  code: string;
  title: Record<Language, string>;
  shortLabel: Record<Language, string>;
  fictionalSituation: Record<Language, string>;
  calmExplanation: Record<Language, string>;
  blockedEdgeIds: string[];
  defaultStart: HospitalNodeId;
  defaultDestination: HospitalNodeId;
  defaultAccessibleOnly: boolean;
  timelineAdjustmentNote: Record<Language, string>;
  timelineStageHighlight: 'before' | 'during' | 'after';
  adaptedStepTitles: Array<{
    step: number;
    original: Record<Language, string>;
    revised: Record<Language, string>;
    whyChanged: Record<Language, string>;
  }>;
  askAtHospital: Record<Language, string[]>;
  teachBackPrompt: Record<Language, string>;
  teachBackReference: Record<Language, string>;
  teachBackQuickChoices: Array<{
    id: string;
    label: Record<Language, string>;
    capturesKeyPoint: boolean;
  }>;
}

export const RECOVERY_SCENARIOS: RecoveryScenarioDefinition[] = [
  {
    id: 'dept_changed',
    code: 'Scenario A',
    title: {
      en: 'Department / Room Changed',
      kn: 'ವಿಭಾಗ ಅಥವಾ ಕೊಠಡಿ ಬದಲಾಗಿದೆ',
      te: 'విభాగం లేదా గది మారింది',
    },
    shortLabel: {
      en: 'Dept Changed',
      kn: 'ವಿಭಾಗ ಬದಲಾವಣೆ',
      te: 'విభాగం మార్పు',
    },
    fictionalSituation: {
      en: 'You planned to visit Radiology (Level 1), but the fictional desk sign says your blood & imaging prep check moved to the Laboratory corridor instead.',
      kn: 'ನೀವು ರೇಡಿಯಾಲಜಿ (ಮಹಡಿ 1) ವಿಭಾಗಕ್ಕೆ ಹೋಗಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ, ಆದರೆ ಇಂದಿನ ತಪಾಸಣೆಯನ್ನು ಪ್ರಯೋಗಾಲಯ (Laboratory) ಕೌಂಟರ್‌ಗೆ ಸ್ಥಳಾಂತರಿಸಲಾಗಿದೆ.',
      te: 'మీరు రేడియాలజీ (లెవెల్ 1) కు వెళ్ళాలనుకున్నారు, కానీ ఈరోజు తనిఖీని ల్యాబొరేటరీ (Laboratory) విభాగానికి మార్చారని బోర్డు చూపుతోంది.',
    },
    calmExplanation: {
      en: 'Hospital wing rooms shift occasionally for equipment maintenance. Your queue token stays valid—you simply update your indoor route to the Laboratory counter.',
      kn: 'ಯಂತ್ರಗಳ ನಿರ್ವಹಣೆಗಾಗಿ ಕೆಲವೊಮ್ಮೆ ಕೊಠಡಿ ಬದಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ಟೋಕನ್ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ — ಈಗ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ನೇರ ದಾರಿ ಅನುಸರಿಸಿ.',
      te: 'యంత్రాల నిర్వహణ వల్ల కొన్నిసార్లు గదులు మారుతుంటాయి. మీ టోకెన్ అలాగే ఉంటుంది — ఇప్పుడు ల్యాబొరేటరీకి వెళ్లే దారిని అనుసరించండి.',
    },
    blockedEdgeIds: [],
    defaultStart: 'waiting',
    defaultDestination: 'laboratory',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'during',
    timelineAdjustmentNote: {
      en: 'Fictional visit re-routed from Radiology to Laboratory on Level 1; registration counter check remains valid.',
      kn: 'ರೇಡಿಯಾಲಜಿ ಬದಲು ಪ್ರಯೋಗಾಲಯಕ್ಕೆ (ಮಹಡಿ 1) ಮಾರ್ಗ ಬದಲಾಯಿಸಲಾಗಿದೆ; ನೋಂದಣಿ ಚೀಟಿ ಮಾನ್ಯವಾಗಿದೆ.',
      te: 'రేడియాలజీ బదులుగా ల్యాబొరేటరీ (లెవెల్ 1) కు మార్చబడింది; మీ రిజిస్ట్రేషన్ చీటీ అలాగే పనిచేస్తుంది.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Check in at Registration Counter',
          kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆಯಿರಿ',
          te: 'రిజిస్ట్రేషన్ కౌంటర్‌లో టోకెన్ తీసుకోండి',
        },
        revised: {
          en: 'Keep existing Registration Token (no re-queue needed)',
          kn: 'ನಿಮ್ಮ ಹಳೆಯ ನೋಂದಣಿ ಟೋಕನ್ ಇಟ್ಟುಕೊಳ್ಳಿ (ಮತ್ತೆ ಸಾಲಿನಲ್ಲಿ ನಿಲ್ಲಬೇಕಿಲ್ಲ)',
          te: 'మీ పాత రిజిస్ట్రేషన్ టోకెన్‌ను ఉంచుకోండి (మళ్ళీ లైన్‌లో నిలబడనక్కర్లేదు)',
        },
        whyChanged: {
          en: 'You already checked in—only the destination room moved on Level 1.',
          kn: 'ನೀವು ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಿ — ಕೇವಲ ಕೊಠಡಿ ಮಾತ್ರ ಬದಲಾಗಿದೆ.',
          te: 'మీరు ఇప్పటికే నమోదు చేసుకున్నారు — కేవలం గది మాత్రమే మారింది.',
        },
      },
      {
        step: 2,
        original: {
          en: 'Go left out of Lift to Radiology',
          kn: 'ಲಿಫ್ಟ್‌ನಿಂದ ಎಡಕ್ಕೆ ರೇಡಿಯಾಲಜಿಗೆ ಹೋಗಿ',
          te: 'లిఫ్ట్ నుండి ఎడమవైపు రేడియాలజీకి వెళ్ళండి',
        },
        revised: {
          en: 'Turn right out of Lift Landing to Laboratory Counter',
          kn: 'ಲಿಫ್ಟ್‌ನಿಂದ ಬಲಕ್ಕೆ ತಿರುಗಿ ಪ್ರಯೋಗಾಲಯ (Laboratory) ಕೌಂಟರ್‌ಗೆ ಹೋಗಿ',
          te: 'లిఫ్ట్ నుండి కుడివైపు తిరిగి ల్యాబొరేటరీ (Laboratory) కౌంటర్‌కు వెళ్ళండి',
        },
        whyChanged: {
          en: 'Redirected to Laboratory wing as indicated in this fictional update.',
          kn: 'ಹೊಸ ಕೊಠಡಿ ಬದಲಾವಣೆಗೆ ತಕ್ಕಂತೆ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಮಾರ್ಗ ಬದಲಿಸಲಾಗಿದೆ.',
          te: 'కొత్త గది మార్పు ప్రకారం ల్యాబొరేటరీకి దారిని మార్చాము.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'Does my existing token number stay valid at the Laboratory counter?',
        'Can staff confirm if I need a new sticker or the same slip?',
      ],
      kn: [
        'ನನ್ನ ಹಳೆಯ ಟೋಕನ್ ಸಂಖ್ಯೆ ಪ್ರಯೋಗಾಲಯದಲ್ಲಿಯೂ ನಡೆಯುತ್ತದೆಯೇ?',
        'ಹೊಸ ಚೀಟಿ ಬೇಕೇ ಅಥವಾ ಇದೇ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಸಾಕೇ?',
      ],
      te: [
        'నా పాత టోకెన్ నంబర్ ల్యాబొరేటరీ కౌంటర్‌లో కూడా చెల్లుతుందా?',
        'కొత్త చీటీ అవసరమా లేక ఇదే చీటీ సరిపోతుందా?',
      ],
    },
    teachBackPrompt: {
      en: 'Because the department shifted from Radiology to Laboratory, where will you turn after exiting the Accessible Lift on Level 1, and do you need a brand-new registration token?',
      kn: 'ವಿಭಾಗವು ರೇಡಿಯಾಲಜಿಯಿಂದ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಬದಲಾದ ಕಾರಣ, 1ನೇ ಮಹಡಿಯಲ್ಲಿ ಲಿಫ್ಟ್‌ನಿಂದ ಹೊರಬಂದು ನೀವು ಯಾವ ಕಡೆಗೆ ತಿರುಗುತ್ತೀರಿ?',
      te: 'విభాగం రేడియాలజీ నుండి ల్యాబొరేటరీకి మారినందున, 1వ అంతస్తులో లిఫ్ట్ నుండి బయటకు వచ్చి మీరు ఎటువైపు తిరుగుతారు?',
    },
    teachBackReference: {
      en: 'Keep my existing registration token and turn right from the Level 1 Lift Landing to reach the Laboratory.',
      kn: 'ನನ್ನ ಹಳೆಯ ಟೋಕನ್ ಇಟ್ಟುಕೊಂಡು 1ನೇ ಮಹಡಿಯಲ್ಲಿ ಲಿಫ್ಟ್‌ನಿಂದ ಬಲಕ್ಕೆ ತಿರುಗಿ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಹೋಗುತ್ತೇನೆ.',
      te: 'నా పాత టోకెన్‌ను ఉంచుకుని, 1వ అంతస్తు లిఫ్ట్ నుండి కుడివైపు తిరిగి ల్యాబొరేటరీకి వెళ్తాను.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-dept-ok',
        label: {
          en: 'Keep my token and turn right after the Level 1 lift to Laboratory',
          kn: 'ಹಳೆಯ ಟೋಕನ್ ಇಟ್ಟುಕೊಂಡು ಲಿಫ್ಟ್ ನಂತರ ಬಲಕ್ಕೆ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಹೋಗುವುದು',
          te: 'పాత టోకెన్‌తో లిఫ్ట్ నుండి కుడివైపు ల్యాబొరేటరీకి వెళ్ళడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-dept-miss',
        label: {
          en: 'Go back outside and restart a new token',
          kn: 'ಹೊರಗೆ ಹೋಗಿ ಮತ್ತೆ ಹೊಸ ಟೋಕನ್ ಪಡೆಯುವುದು',
          te: 'బయటికి వెళ్ళి మళ్ళీ కొత్త టోకెన్ తీసుకోవడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
  {
    id: 'lift_unavailable',
    code: 'Scenario B',
    title: {
      en: 'Accessible Lift Unavailable',
      kn: 'ಸುಲಭ ಲಿಫ್ಟ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಬಂದ್ ಆಗಿದೆ',
      te: 'యాక్సెసిబుల్ లిఫ్ట్ తాత్కాలికంగా అందుబాటులో లేదు',
    },
    shortLabel: {
      en: 'Lift Unavailable',
      kn: 'ಲಿಫ್ಟ್ ಬಂದ್',
      te: 'లిఫ్ట్ సమస్య',
    },
    fictionalSituation: {
      en: 'You selected Step-Free Access (avoid stairs), and the fictional West Accessible Lift is temporarily stopped for maintenance while you are heading to Level 1 Radiology.',
      kn: 'ನೀವು ಮೆಟ್ಟಿಲು ರಹಿತ ದಾರಿ (Step-Free) ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ. ಆದರೆ 1ನೇ ಮಹಡಿಯ ರೇಡಿಯಾಲಜಿಗೆ ಹೋಗುವ ಸುಲಭ ಲಿಫ್ಟ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಂತಿದೆ.',
      te: 'మీరు మెట్లు లేని మార్గాన్ని ఎంచుకున్నారు. కానీ 1వ అంతస్తు రేడియాలజీకి వెళ్ళే లిఫ్ట్ తాత్కాలికంగా ఆగిపోయింది.',
    },
    calmExplanation: {
      en: 'CORE respects your Step-Free Access choice and will NEVER route you up stairs. When no step-free path reaches Level 1, ask Ground Reception for a staff-assisted service lift or ground-level support.',
      kn: 'CORE ನಿಮ್ಮ ಮೆಟ್ಟಿಲು ರಹಿತ ಆಯ್ಕೆಯನ್ನು ಗೌರವಿಸುತ್ತದೆ ಮತ್ತು ಎಂದಿಗೂ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ. ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಅಥವಾ ನೆಲ ಮಹಡಿ ಸಹಾಯ ಕೇಳಿ.',
      te: 'CORE మీ స్టెప్-ఫ్రీ ఎంపికను గౌರವಿಸುತ್ತದೆ మరియు ఎప్పుడూ మెట్లను సూచించదు. రిసెప్షన్ వద్ద సిబ్బంది సర్వీస్ లిఫ్ట్ లేదా గ్రౌండ్ ఫ్లోర్ సహాయం అడగండి.',
    },
    blockedEdgeIds: ['lift-vertical'],
    defaultStart: 'entrance',
    defaultDestination: 'radiology',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'during',
    timelineAdjustmentNote: {
      en: 'Accessible Lift paused: wait calmly at Ground Reception for staff service-lift assistance instead of climbing stairs.',
      kn: 'ಲಿಫ್ಟ್ ಬಂದ್: ಮೆಟ್ಟಿಲು ಹತ್ತಬೇಡಿ. ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಸಹಾಯಕ್ಕಾಗಿ ಕಾಯಿರಿ.',
      te: 'లిఫ్ట్ ఆగిపోయింది: మెట్లు ఎక్కవద్దు. రిసెప్షన్ వద్ద సిబ్బంది సహాయం కోసం వేచి ఉండండి.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Walk to West Lift and ride to Level 1',
          kn: 'ಪಶ್ಚಿಮ ಲಿಫ್ಟ್ ಮೂಲಕ 1ನೇ ಮಹಡಿಗೆ ಹೋಗಿ',
          te: 'వెస్ట్ లిఫ్ట్ ద్వారా 1వ అంతస్తుకు వెళ్ళండి',
        },
        revised: {
          en: 'Stop at Ground Reception — ask for Service Elevator or Wheelchair Desk',
          kn: 'ನೆಲ ಮಹಡಿ ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿಯೇ ನಿಂತು ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಸಹಾಯ ಕೇಳಿ (ಮೆಟ್ಟಿಲು ಬೇಡ)',
          te: 'గ్రౌండ్ రిసెప్షన్ వద్ద ఆగి, సిబ్బంది లిఫ్ట్ సహాయం అడగండి (మెట్లు ఎక్కవద్దు)',
        },
        whyChanged: {
          en: 'Step-free path to Level 1 is currently paused; safety rules forbid suggesting stairs.',
          kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ದಾರಿ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಸುರಕ್ಷತೆಗಾಗಿ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಸೂಚಿಸಿಲ್ಲ.',
          te: 'స్టెప్-ఫ్రీ దారి లేనందున భద్రత కోసం మెట్లను సూచించడం లేదు.',
        },
      },
      {
        step: 2,
        original: {
          en: 'Proceed unassisted to Radiology',
          kn: 'ಸ್ವಯಂ ಆಗಿ ರೇಡಿಯಾಲಜಿಗೆ ಹೋಗಿ',
          te: 'మీరే రేడియాలజీకి వెళ్ళండి',
        },
        revised: {
          en: 'Wait in Ground Waiting Area while staff bring escort or confirm reschedule option',
          kn: 'ಸಿಬ್ಬಂದಿ ಬರುವವರೆಗೆ ನೆಲ ಮಹಡಿ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ',
          te: 'సిబ్బంది వచ్చేవరకు గ్రౌండ్ వెయిటింగ్ ఏరియాలో కూర్చుని వేచి ఉండండి',
        },
        whyChanged: {
          en: 'Prevents exhausting walking when elevator access is temporarily closed.',
          kn: 'ಲಿಫ್ಟ್ ಇಲ್ಲದ ಸಮಯದಲ್ಲಿ ಸುಸ್ತಾಗುವ ನಡಿಗೆಯನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.',
          te: 'లిఫ్ట్ లేని సమయంలో అనవసరమైన నడకను తగ్గిస్తుంది.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'I require step-free access—can an attendant escort me via the staff service lift?',
        'Can a nurse or technician check if ground-floor registration can hold my token?',
      ],
      kn: [
        'ನನಗೆ ಮೆಟ್ಟಿಲು ಹತ್ತಲು ಸಾಧ್ಯವಿಲ್ಲ — ದಯವಿಟ್ಟು ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಸಹಾಯ ನೀಡಬಹುದೇ?',
        'ನಾನು ಬರುವವರೆಗೆ ನನ್ನ ಟೋಕನ್ ಕಾಯ್ದಿರಿಸಬಹುದೇ?',
      ],
      te: [
        'నేను మెట్లు ఎక్కలేను — దయచేసి సిబ్బంది సర్వీస్ లిఫ్ట్ సహాయం అందించగలరా?',
        'నేను చేరుకునే వరకు నా టోకెన్‌ను అలాగే ఉంచగలరా?',
      ],
    },
    teachBackPrompt: {
      en: 'Because the main Accessible Lift is out of service while Step-Free Access is ON, what is your safe next action instead of using stairs?',
      kn: 'ಸುಲಭ ಲಿಫ್ಟ್ ಕೆಲಸ ಮಾಡದಿದ್ದಾಗ, ಮೆಟ್ಟಿಲುಗಳನ್ನು ಹತ್ತುವ ಬದಲು ನೀವು ಸುರಕ್ಷಿತವಾಗಿ ಏನು ಮಾಡಬೇಕು?',
      te: 'యాక్సెసిబుల్ లిఫ్ట్ పనిచేయని సమయంలో, మెట్లు ఎక్కకుండా మీరు ఏమి చేయాలి?',
    },
    teachBackReference: {
      en: 'Do not climb stairs; ask Ground Reception for staff service-lift assistance or wait comfortably in the Ground Waiting Area.',
      kn: 'ಮೆಟ್ಟಿಲು ಹತ್ತಬೇಡಿ; ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಸಹಾಯ ಕೇಳಿ ಮತ್ತು ನೆಲ ಮಹಡಿಯಲ್ಲಿ ಕುಳಿತು ಕಾಯಿರಿ.',
      te: 'మెట్లు ఎక్కకండి; రిసెప్షన్‌లో సిబ్బంది లిఫ్ట్ సహాయం అడిగి గ్రౌండ్ వెయిటింగ్ ఏరియాలో వేచి ఉండండి.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-lift-ok',
        label: {
          en: 'Stay on Ground floor and ask Reception for a staff lift escort',
          kn: 'ನೆಲ ಮಹಡಿಯಲ್ಲಿಯೇ ಇದ್ದು ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಕೇಳುವುದು',
          te: 'గ్రౌండ్ ఫ్లోర్‌లో ఉండి రిసెప్షన్‌ను సిబ్బంది లిఫ్ట్ అడగడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-lift-miss',
        label: {
          en: 'Climb Stairwell A even though Step-Free mode is required',
          kn: 'ಕಷ್ಟವಾದರೂ ಮೆಟ್ಟಿಲುಗಳ ಮೂಲಕ ಹತ್ತುವುದು',
          te: 'కష్టమైనా మెట్లు ఎక్కి పైకి వెళ్ళడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
  {
    id: 'corridor_blocked',
    code: 'Scenario B2',
    title: {
      en: 'Waiting Hall Corridor Blocked (Step-Free Detour)',
      kn: 'ನಿರೀಕ್ಷಣಾ ಹಾಲ್ ದಾರಿ ಮುಚ್ಚಿದೆ (ಪರ್ಯಾಯ ದಾರಿ)',
      te: 'వెయిటింగ్ హాల్ దారి మూసివేయబడింది (ప్రత్యామ్నాయ దారి)',
    },
    shortLabel: {
      en: 'Corridor Detour',
      kn: 'ಕಾರಿಡಾರ್ ಬದಲಿ ದಾರಿ',
      te: 'కారిడార్ మళ్లింపు',
    },
    fictionalSituation: {
      en: 'The usual straight passage past Reception into the Waiting Area is temporarily cordoned off for floor cleaning while you walk toward Radiology.',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದ ಮೂಲಕ ಹೋಗುವ ನೇರ ದಾರಿ ಶುಚಿಗೊಳಿಸುವ ಸಲುವಾಗಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ಮುಚ್ಚಿದೆ.',
      te: 'రిసెప్షన్ నుండి వెయిటింగ్ ఏరియాకు వెళ్లే నేరుగా మార్గం శుభ్రపరచడం కోసం తాత్కాలికంగా మూసివేయబడింది.',
    },
    calmExplanation: {
      en: 'CORE checks the hospital floor graph and finds an alternate 100% step-free corridor directly from Reception along the West Hall to the Accessible Lift.',
      kn: 'CORE ತಕ್ಷಣ ನಕ್ಷೆಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಪಶ್ಚಿಮ ಕಾರಿಡಾರ್ ಮೂಲಕ ನೇರವಾಗಿ ಸುಲಭ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗುವ ಮೆಟ್ಟಿಲು ರಹಿತ ಬದಲಿ ದಾರಿಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
      te: 'CORE మ్యాప్‌ను పరిశీలించి రిసెప్షన్ నుండి వెస్ట్ బైపాస్ కారిడార్ ద్వారా నేరుగా లిఫ్ట్‌కు వెళ్లే మెట్లు లేని ప్రత్యామ్నాయ మార్గాన్ని చూపుతుంది.',
    },
    blockedEdgeIds: ['reception-waiting'],
    defaultStart: 'entrance',
    defaultDestination: 'radiology',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'during',
    timelineAdjustmentNote: {
      en: 'Using West Bypass Corridor directly from Reception to Accessible Lift (step-free, ~10m longer).',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ನೇರವಾಗಿ ಪಶ್ಚಿಮ ಬೈಪಾಸ್ ಮೂಲಕ ಲಿಫ್ಟ್‌ಗೆ ಬದಲಿ ದಾರಿ.',
      te: 'రిసెప్షన్ నుండి వెస్ట్ బైపాస్ ద్వారా నేరుగా లిఫ్ట్‌కు ప్రత్యామ్నాయ మార్గం.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Reception -> Waiting Area -> Accessible Lift',
          kn: 'ಸ್ವಾಗತ -> ನಿರೀಕ್ಷಣಾ ಸ್ಥಳ -> ಲಿಫ್ಟ್',
          te: 'రిసెప్షన్ -> వెయిటింగ్ ఏరియా -> లిఫ్ట్',
        },
        revised: {
          en: 'Reception -> West Bypass Hall (step-free) -> Accessible Lift',
          kn: 'ಸ್ವಾಗತ -> ಪಶ್ಚಿಮ ಬೈಪಾಸ್ ಕಾರಿಡಾರ್ -> ಸುಲಭ ಲಿಫ್ಟ್',
          te: 'రిసెప్షన్ -> వెస్ట్ బైపాస్ కారిడార్ -> యాక్సెసిబుల్ లిఫ్ట్',
        },
        whyChanged: {
          en: 'Central corridor is closed; West Bypass reaches the lift without passing Waiting Area.',
          kn: 'ಮಧ್ಯದ ಹಾಲ್ ಮುಚ್ಚಿರುವುದರಿಂದ ಬದಲಿ ಪಶ್ಚಿಮ ಕಾರಿಡಾರ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.',
          te: 'మధ్య కారిడార్ మూసి ఉన్నందున పడమటి బైపాస్ ఎంచుకోబడింది.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'Is the West Bypass Corridor to the Accessible Lift open for wheelchairs right now?',
      ],
      kn: [
        'ಲಿಫ್ಟ್‌ಗೆ ಹೋಗುವ ಪಶ್ಚಿಮ ಬೈಪಾಸ್ ದಾರಿ ಈಗ ತೆರೆದಿದೆಯೇ?',
      ],
      te: [
        'లిఫ్ట్‌కు వెళ్లే వెస్ట్ బైపాస్ దారి ఇప్పుడు తెరిచి ఉందా?',
      ],
    },
    teachBackPrompt: {
      en: 'Since the straight Waiting Hall corridor is closed, which step-free bypass path takes you from Reception to the Accessible Lift?',
      kn: 'ನೇರ ಹಾಲ್ ದಾರಿ ಮುಚ್ಚಿರುವುದರಿಂದ ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗಲು ನೀವು ಯಾವ ಬದಲಿ ದಾರಿಯನ್ನು ಬಳಸುತ್ತೀರಿ?',
      te: 'నేరుగా వెళ్ళే దారి మూసి ఉన్నందున రిసెప్షన్ నుండి లిఫ్ట్‌కు ఏ ప్రత్యామ్నాయ దారిని ఉపయోగిస్తారు?',
    },
    teachBackReference: {
      en: 'Follow the West Bypass Corridor directly from Reception to the Accessible Lift (still step-free).',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಪಶ್ಚಿಮ ಬೈಪಾಸ್ ಕಾರಿಡಾರ್ ಮೂಲಕ ನೇರವಾಗಿ ಸುಲಭ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗುತ್ತೇನೆ.',
      te: 'రిసెప్షన్ నుండి వెస్ట్ బైపాస్ కారిడార్ ద్వారా నేరుగా లిఫ్ట్ వద్దకు వెళ్తాను.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-corr-ok',
        label: {
          en: 'Use West Bypass Hall directly from Reception to Lift',
          kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಪಶ್ಚಿಮ ಬೈಪಾಸ್ ಮೂಲಕ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗುವುದು',
          te: 'రిసెప్షన్ నుండి వెస్ట్ బైపాస్ ద్వారా లిఫ్ట్‌కు వెళ్ళడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-corr-miss',
        label: {
          en: 'Walk past the closed floor barrier anyway',
          kn: 'ಮುಚ್ಚಿರುವ ದಾರಿಯಲ್ಲೇ ಒಳಗೆ ನುಗ್ಗುವುದು',
          te: 'మూసివేసిన దారిలోనే నడవడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
  {
    id: 'language_barrier',
    code: 'Scenario C',
    title: {
      en: 'Language Barrier at Desk',
      kn: 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಭಾಷೆಯ ತೊಂದರೆ',
      te: 'కౌంటర్ వద్ద భాషా ఇబ్బంది',
    },
    shortLabel: {
      en: 'Language Help',
      kn: 'ಭಾಷಾ ಸಹಾಯ',
      te: 'భాషా సహాయం',
    },
    fictionalSituation: {
      en: 'Desk signage or staff instructions are only available in English or unfamiliar words, making it hard to confirm your queue token and test prep.',
      kn: 'ಕೌಂಟರ್‌ನಲ್ಲಿರುವ ಫಲಕ ಅಥವಾ ಸಿಬ್ಬಂದಿಯ ಮಾತು ಕೇವಲ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದ್ದು ನಿಮಗೆ ಕನ್ನಡ ಅಥವಾ ತೆಲುಗಿನಲ್ಲಿ ಅರ್ಥವಾಗಲು ಕಷ್ಟವಾಗುತ್ತಿದೆ.',
      te: 'కౌంటర్ వద్ద బోర్డులు లేదా సిబ్బంది మాటలు కేవలం ఇంగ్లీష్‌లో ఉండి మీకు సరిగ్గా అర్థం కావడం లేదు.',
    },
    calmExplanation: {
      en: 'Switch CORE to Kannada or Telugu audio + show your translated Visit Passport or CareCircle card at the counter so staff see your block and test clearly.',
      kn: 'CORE ನಲ್ಲಿ ಕನ್ನಡ ಅಥವಾ ತೆಲುಗು ಧ್ವನಿ ಆಲಿಸಿ ಮತ್ತು ನಿಮ್ಮ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಾರ್ಡ್ ತೋರಿಸಿ — ಸಿಬ್ಬಂದಿಗೆ ಎಲ್ಲಾ ವಿವರ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸುತ್ತದೆ.',
      te: 'CORE లో తెలుగు లేదా కన్నడ ఆడియో వినండి మరియు మీ విజిట్ పాస్‌పోర్ట్ కార్డును కౌంటర్ వద్ద చూపించండి.',
    },
    blockedEdgeIds: [],
    defaultStart: 'entrance',
    defaultDestination: 'registration',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'before',
    timelineAdjustmentNote: {
      en: 'Language support active: Show your trilingual Visit Passport at Reception/Registration and use Listen audio.',
      kn: 'ಭಾಷಾ ನೆರವು ಸಕ್ರಿಯ: ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಕನ್ನಡ/ಇಂಗ್ಲಿಷ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಾರ್ಡ್ ತೋರಿಸಿ.',
      te: 'భాషా సహాయం సిద్ధం: కౌంటర్ వద్ద మీ తెలుగు/ఇంగ్లీష్ పాస్‌పోర్ట్ కార్డును చూపించండి.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Speak rapid English requests at Reception',
          kn: 'ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ವಿವರ ಕೇಳಲು ಪ್ರಯತ್ನಿಸಿ',
          te: 'ఇంగ్లీష్‌లో వివరాలు అడగడానికి ప్రయత్నించండి',
        },
        revised: {
          en: 'Show Bilingual Visit Passport / CareCircle Summary + Play Audio Prompt',
          kn: 'ದ್ವಿಭಾಷಾ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಾರ್ಡ್ ತೋರಿಸಿ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯ ಬಳಸಿ',
          te: 'ద్విభాషా విజిట్ పాస్‌పోర్ట్ కార్డును చూపించి వాయిస్ సహాయం ఉపయోగించండి',
        },
        whyChanged: {
          en: 'Removes stress of translating hospital terms on the spot.',
          kn: 'ಸ್ಥಳದಲ್ಲೇ ಕಷ್ಟದ ಪದಗಳನ್ನು ಅನುವಾದಿಸುವ ಒತ್ತಡವನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.',
          te: 'కౌంటర్ వద్ద మాటలు అర్థం కాకపోయే ఒత్తిడిని తగ్గిస్తుంది.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'Is a Kannada or Telugu speaking volunteer available at Desk 1?',
        'Can you please circle my token number and room on this paper card?',
      ],
      kn: [
        'ಇಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಸಹಾಯ ಮಾಡುವ ಸ್ವಯಂಸೇವಕರು ಇದ್ದಾರೆಯೇ?',
        'ದಯವಿಟ್ಟು ನನ್ನ ಟೋಕನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಕೊಠಡಿ ಸಂಖ್ಯೆಯನ್ನು ಚೀಟಿಯಲ್ಲಿ ಬರೆದು ಕೊಡಿ.',
      ],
      te: [
        'ఇక్కడ తెలుగులో సహాయం చేసే వాలంటీర్ ఉన్నారా?',
        'దయచేసి నా టోకెన్ నంబర్ మరియు గది నంబర్‌ను కాగితంపై రాసి ఇవ్వగలరా?',
      ],
    },
    teachBackPrompt: {
      en: 'If staff directions at the Registration Counter are hard to follow in English, what two CORE tools can you show or play right away?',
      kn: 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಭಾಷೆ ಅರ್ಥವಾಗದಿದ್ದರೆ ನೀವು ತಕ್ಷಣ ಯಾವ ಎರಡು CORE ಸಾಧನಗಳನ್ನು ಬಳಸಬಹುದು?',
      te: 'కౌంటర్ వద్ద భాష అర్థం కాకపోతే మీరు వెంటనే ఏ రెండు CORE మార్గాలను ఉపయోగించవచ్చు?',
    },
    teachBackReference: {
      en: 'Show my Visit Passport summary card (or ask them to write the room number) and play Kannada/Telugu voice playback.',
      kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಾರ್ಡ್ ತೋರಿಸಿ ಮತ್ತು ಕನ್ನಡ ಅಥವಾ ತೆಲುಗು ಧ್ವನಿ ಸಹಾಯ ಬಳಸಿ ಕೇಳುತ್ತೇನೆ.',
      te: 'నా విజిట్ పాస్‌పోర్ట్ కార్డు చూపించి తెలుగు లేదా కన్నడ వాయిస్ ప్లేబ్యాక్‌ను వింటాను.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-lang-ok',
        label: {
          en: 'Show my Visit Passport card & use Kannada/Telugu audio',
          kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೋರಿಸಿ ಕನ್ನಡ/ತೆಲುಗು ಧ್ವನಿ ಕೇಳುವುದು',
          te: 'విజిట్ పాస్‌పోర్ట్ చూపించి తెలుగు/కన్నడ వాయిస్ వినడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-lang-miss',
        label: {
          en: 'Guess the room number without verifying',
          kn: 'ಕೇಳದೆ ಸುಮ್ಮನೆ ಯಾವುದೋ ಕೊಠಡಿಗೆ ಹೋಗುವುದು',
          te: 'అడగకుండానే ఏదో ఒక గదికి వెళ్ళడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
  {
    id: 'missing_details',
    code: 'Scenario D',
    title: {
      en: 'Missing Slip or Forgot Details',
      kn: 'ಚೀಟಿ ಕಳೆದಿದೆ ಅಥವಾ ವಿವರ ಮರೆತಿದೆ',
      te: 'చీటీ మర్చిపోయారు లేదా వివరాలు గుర్తులేవు',
    },
    shortLabel: {
      en: 'Missing Details',
      kn: 'ಚೀಟಿ ಮರೆತಿದೆ',
      te: 'వివరాలు మర్చిపోయారు',
    },
    fictionalSituation: {
      en: 'You arrived near the hospital entrance without your SMS slip or cannot remember which diagnostic block/room your fictional scan is booked in.',
      kn: 'ನೀವು ಆಸ್ಪತ್ರೆ ದ್ವಾರಕ್ಕೆ ಬಂದಿದ್ದೀರಿ, ಆದರೆ ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ SMS ಅಥವಾ ಕೊಠಡಿ ಸಂಖ್ಯೆ ನೆನಪಿಲ್ಲ.',
      te: 'మీరు ఆసుపత్రికి వచ్చారు కానీ మీ అపాయింట్‌మెంట్ SMS లేదా గది నంబర్ గుర్తులేదు.',
    },
    calmExplanation: {
      en: 'Do not panic or turn back home right away. Visit Reception or Registration Counter with your name, registered phone number, and Photo ID—or check My Appointment via PIN lookup.',
      kn: 'ಗಾಬರಿಯಾಗಿ ಮನೆಗೆ ವಾಪಸ್ ಹೋಗಬೇಡಿ. ನಿಮ್ಮ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಗುರುತಿನ ಚೀಟಿಯೊಂದಿಗೆ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ ಅಥವಾ PIN ಮೂಲಕ ಕೇಳಿ.',
      te: 'కంగారు పడి వెనక్కి వెళ్ళకండి. మీ పేరు, ఫోన్ నంబర్ మరియు ID తో రిజిస్ట్రేషన్ కౌంటర్‌లో అడగండి లేదా PIN ద్వారా వివరాలు వినండి.',
    },
    blockedEdgeIds: [],
    defaultStart: 'entrance',
    defaultDestination: 'reception',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'before',
    timelineAdjustmentNote: {
      en: 'Recovery mode: Stop at Reception Desk first to verify phone/name before joining the scan queue.',
      kn: 'ಮರುಪಡೆಯುವಿಕೆ: ಮೊದಲು ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ ನೀಡಿ ವಿವರ ದೃಢಪಡಿಸಿ.',
      te: 'రికవరీ దశ: ముందుగా రిసెప్షన్ వద్ద పేరు మరియు ఫోన్ నంబర్‌తో వివరాలు నిర్ధారించుకోండి.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Walk straight to Level 1 Scan Desk',
          kn: 'ನೇರವಾಗಿ 1ನೇ ಮಹಡಿ ಸ್ಕ್ಯಾನ್ ಕೊಠಡಿಗೆ ಹೋಗಿ',
          te: 'నేరుగా 1వ అంతస్తు స్కాన్ గదికి వెళ్ళండి',
        },
        revised: {
          en: 'Pause at Ground Reception Desk with Phone / Photo ID to verify block & time',
          kn: 'ಮೊದಲು ನೆಲ ಮಹಡಿ ಸ್ವಾಗತ/ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಫೋನ್ ಮತ್ತು ಗುರುತಿನ ಚೀಟಿ ತೋರಿಸಿ ವಿವರ ಪಡೆಯಿರಿ',
          te: 'ముందుగా గ్రౌండ్ రిసెప్షన్ వద్ద ఫోన్ నంబర్ మరియు ID చూపించి గది నంబర్ తెలుసుకోండి',
        },
        whyChanged: {
          en: 'Prevents waiting outside the wrong department without a valid slip.',
          kn: 'ತಪ್ಪು ಕೊಠಡಿಯ ಹೊರಗೆ ಅನಾವಶ್ಯಕವಾಗಿ ಕಾಯುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.',
          te: 'తప్పు గది బయట వేచి ఉండకుండా కాపాడుతుంది.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'I misplaced my slip—can you look up today’s booking using my phone number and Photo ID?',
        'Could you write my room number and token clearly for my companion?',
      ],
      kn: [
        'ನನ್ನ ಚೀಟಿ ಕಳೆದಿದೆ — ನನ್ನ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯಿಂದ ಇಂದಿನ ಸಮಯ ನೋಡಬಹುದೇ?',
        'ದಯವಿಟ್ಟು ಕೊಠಡಿ ಸಂಖ್ಯೆಯನ್ನು ಬರೆದುಕೊಡಿ.',
      ],
      te: [
        'నా చీటీ మర్చిపోయాను — నా ఫోన్ నంబర్ మరియు ID తో ఈరోజు వివరాలు చూడగలరా?',
        'దయచేసి గది నంబర్‌ను కాగితంపై రాసి ఇవ్వగలరా?',
      ],
    },
    teachBackPrompt: {
      en: 'If you forget your appointment slip at the hospital gate, where should you go first and what two details help staff verify you?',
      kn: 'ನೀವು ಚೀಟಿ ಮರೆತಿದ್ದರೆ ಮೊದಲು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು ಮತ್ತು ಸಿಬ್ಬಂದಿಗೆ ಏನು ತೋರಿಸಬೇಕು?',
      te: 'మీరు చీటీ మర్చిపోతే ముందు ఎక్కడికి వెళ్ళాలి మరియు సిబ్బందికి ఏ వివరాలు చెప్పాలి?',
    },
    teachBackReference: {
      en: 'Go to Ground Reception / Registration Counter first and share my name, registered phone number, or Photo ID.',
      kn: 'ಮೊದಲು ಸ್ವಾಗತ/ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ಹೋಗಿ ನನ್ನ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಗುರುತಿನ ಚೀಟಿ ತೋರಿಸುತ್ತೇನೆ.',
      te: 'ముందుగా రిసెప్షన్ / రిజిస్ట్రేషన్ కౌంటర్‌కు వెళ్ళి నా పేరు, ఫోన్ నంబర్ మరియు ID చూపిస్తాను.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-miss-ok',
        label: {
          en: 'Check at Reception/Registration with my phone number & ID',
          kn: 'ಸ್ವಾಗತ ಕೌಂಟರ್‌ನಲ್ಲಿ ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ID ತೋರಿಸಿ ಪರಿಶೀಲಿಸುವುದು',
          te: 'రిసెప్షన్ వద్ద ఫోన్ నంబర్ & ID చూపించి వివరాలు పొందడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-miss-no',
        label: {
          en: 'Go straight home without asking anyone at the desk',
          kn: 'ಯಾರನ್ನೂ ಕೇಳದೆ ಮನೆಗೆ ವಾಪಸ್ ಹೋಗುವುದು',
          te: 'ఎవరినీ అడగకుండా ఇంటికి తిరిగి వెళ్ళడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
  {
    id: 'delayed_arrival',
    code: 'Scenario E',
    title: {
      en: 'Running Late / Bus Delayed',
      kn: 'ಬಸ್ ತಡವಾಗಿದೆ / ತಲುಪಲು ವಿಳಂಬ',
      te: 'బస్సు ఆలస్యం / ఆలస్యంగా చేరుకోవడం',
    },
    shortLabel: {
      en: 'Delayed Arrival',
      kn: 'ತಡವಾಗಿ ಆಗಮನ',
      te: 'ఆలస్యమైన రాక',
    },
    fictionalSituation: {
      en: 'Your morning rural bus is 35 minutes behind schedule. You worry your diagnostic slot may be lost before you reach Registration.',
      kn: 'ನಿಮ್ಮ ಗ್ರಾಮದ ಬಸ್ 35 ನಿಮಿಷ ತಡವಾಗಿದೆ. ಆಸ್ಪತ್ರೆಗೆ ತಲುಪುವಷ್ಟರಲ್ಲಿ ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಸಮಯ ತಪ್ಪಿಹೋಗಬಹುದೇ ಎಂಬ ಆತಂಕವಿದೆ.',
      te: 'మీ ఉదయం బస్సు 35 నిమిషాలు ఆలస్యమైంది. మీరు చేరుకునేలోపు మీ స్కాన్ సమయం పోతుందేమో అని ఆందోళనగా ఉంది.',
    },
    calmExplanation: {
      en: 'Many outpatient radiology desks can move you to a later same-day buffer or clean next-day morning slot. Check in calmly at Registration as soon as you arrive—or preview afternoon/next-day slots in Reschedule.',
      kn: 'ಹಲವು ಕೌಂಟರ್‌ಗಳು ತಡವಾಗಿ ಬಂದವರಿಗೆ ಅದೇ ದಿನದ ಮಧ್ಯಾಹ್ನದ ಸಮಯ ಅಥವಾ ಮರುದಿನದ ಬೆಳಗಿನ ಸಮಯ ನೀಡುತ್ತವೆ. ತಲುಪಿದ ತಕ್ಷಣ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ತಿಳಿಸಿ.',
      te: 'చాలా విభాగాలు ఆలస్యమైన వారికి అదే రోజు మధ్యాహ్నం లేదా మరుసటి రోజు ఉదయం అవకాశం ఇస్తాయి. రాగానే రిజిస్ట్రేషన్ కౌంటర్‌లో చెప్పండి.',
    },
    blockedEdgeIds: [],
    defaultStart: 'entrance',
    defaultDestination: 'registration',
    defaultAccessibleOnly: true,
    timelineStageHighlight: 'before',
    timelineAdjustmentNote: {
      en: 'Delayed arrival plan: Report immediately to Registration Counter first (do not skip directly to scan room); use Reschedule if slot moved.',
      kn: 'ತಡವಾದ ಯೋಜನೆ: ಮೊದಲು ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಹಾಜರಿ ತಿಳಿಸಿ; ಅಗತ್ಯವಿದ್ದರೆ ಮರುನಿಗದಿ ಪುಟ ಬಳಸಿ.',
      te: 'ఆలస్య ప్రణాళిక: రాగానే రిజిస్ట్రేషన్ కౌంటర్‌లో చెప్పండి; అవసరమైతే రీషెడ్యూల్ చేయండి.',
    },
    adaptedStepTitles: [
      {
        step: 1,
        original: {
          en: 'Arrive 30 mins early -> Registration -> Scan',
          kn: '30 ನಿಮಿಷ ಮುಂಚೆ ಬಂದು ನೋಂದಾಯಿಸಿ',
          te: '30 నిమిషాల ముందు వచ్చి నమోదు చేసుకోండి',
        },
        revised: {
          en: 'Check in politely at Registration -> Ask for Same-Day Late Buffer or Next Slot',
          kn: 'ತಲುಪಿದ ತಕ್ಷಣ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ತಿಳಿಸಿ -> ಅದೇ ದಿನದ ಮುಂದಿನ ಸಮಯ ಕೇಳಿ',
          te: 'రాగానే రిజిస్ట్రేషన్ కౌంటర్‌లో చెప్పి అదే రోజు మధ్యాహ్నం లేదా తదుపరి స్లాట్ అడగండి',
        },
        whyChanged: {
          en: 'Avoids a wasted round trip—staff can often accommodate delayed rural patients.',
          kn: 'ದೂರದಿಂದ ಬಂದ ರೋಗಿಗಳಿಗೆ ವ್ಯರ್ಥ ಪ್ರಯಾಣವಾಗುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.',
          te: 'దూరం నుండి వచ్చే వారికి వృధా ప్రయాణం కాకుండా కాపాడుతుంది.',
        },
      },
    ],
    askAtHospital: {
      en: [
        'My bus was delayed by 35 minutes—can my slot fit into today’s afternoon buffer?',
        'If I must return another day, which morning slot is open and can you mark my card?',
      ],
      kn: [
        'ನನ್ನ ಬಸ್ 35 ನಿಮಿಷ ತಡವಾಗಿದೆ — ಇಂದು ಮಧ್ಯಾಹ್ನದೊಳಗೆ ಪರೀಕ್ಷೆ ಮಾಡಲು ಸಾಧ್ಯವೇ?',
        'ಬೇರೆ ದಿನ ಬರಬೇಕಾದರೆ ಬೆಳಗಿನ ಸಮಯವನ್ನು ಬರೆದುಕೊಡಬಹುದೇ?',
      ],
      te: [
        'నా బస్సు 35 నిమిషాలు ఆలస్యమైంది — ఈరోజు మధ్యాహ్నం నా పరీక్ష చేయగలరా?',
        'వేరే రోజు రావాల్సి వస్తే ఉదయం సమయం కార్డుపై రాసి ఇవ్వగలరా?',
      ],
    },
    teachBackPrompt: {
      en: 'If your morning bus is 35 minutes late, should you go home immediately or check in at Registration first to ask for a buffer slot?',
      kn: 'ನಿಮ್ಮ ಬಸ್ 35 ನಿಮಿಷ ತಡವಾದರೆ ಮನೆಗೆ ಹೋಗಬೇಕೇ ಅಥವಾ ಮೊದಲು ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಸಮಯ ಕೇಳಬೇಕೇ?',
      te: 'మీ బస్సు 35 నిమిషాలు ఆలస్యమైతే ఇంటికి తిరిగి వెళ్లాలా లేక ముందు రిజిస్ట్రేషన్ కౌంటర్‌లో అడగాలా?',
    },
    teachBackReference: {
      en: 'Check in at Registration first and politely ask if an afternoon buffer slot or quick reschedule is possible.',
      kn: 'ಮೊದಲು ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಹಾಜರಾಗಿ ಅದೇ ದಿನದ ಮುಂದಿನ ಸಮಯ ಅಥವಾ ಹೊಸ ದಿನಾಂಕ ಕೇಳುತ್ತೇನೆ.',
      te: 'ముందుగా రిజిస్ట్రేషన్ కౌంటర్‌లో చెప్పి మధ్యాహ్నం అవకాశం లేదా కొత్త తేదీ అడుగుతాను.',
    },
    teachBackQuickChoices: [
      {
        id: 'tb-delay-ok',
        label: {
          en: 'Check at Registration for a same-day buffer or reschedule',
          kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಅದೇ ದಿನದ ಮುಂದಿನ ಸಮಯ ಕೇಳುವುದು',
          te: 'రిజిస్ట్రేషన్ కౌంటర్‌లో మధ్యాహ్నం స్లాట్ లేదా కొత్త తేదీ అడగడం',
        },
        capturesKeyPoint: true,
      },
      {
        id: 'tb-delay-no',
        label: {
          en: 'Turn back without checking with Registration',
          kn: 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಕೇಳದೆಯೇ ಹಿಂತಿರುಗಿ ಹೋಗುವುದು',
          te: 'కౌంటర్‌లో అడగకుండానే వెనక్కి వెళ్లిపోవడం',
        },
        capturesKeyPoint: false,
      },
    ],
  },
];

export const CAREGIVER_SITUATION_PRESETS: Array<{
  id: string;
  label: Record<Language, string>;
  note: Record<Language, string>;
}> = [
  {
    id: 'help-registration',
    label: {
      en: 'Help locating registration counter',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್ ಹುಡುಕಲು ಸಹಾಯ',
      te: 'రిజిస్ట్రేషన్ కౌంటర్ దగ్గర సహాయం',
    },
    note: {
      en: 'I have arrived near the Main Entrance and need a little help locating the Registration Counter.',
      kn: 'ನಾನು ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿದ್ದೇನೆ — ನೋಂದಣಿ ಕೌಂಟರ್ ಹುಡುಕಲು ದಯವಿಟ್ಟು ಜೊತೆಯಾಗಿ ಬನ್ನಿ.',
      te: 'నేను ప్రధాన ద్వారం వద్ద ఉన్నాను — రిజిస్ట్రేషన్ కౌంటర్ కనుగొనడానికి దయచేసి సహాయం చేయండి.',
    },
  },
  {
    id: 'lift-service-issue',
    label: {
      en: 'Lift on planned route out of service',
      kn: 'ಲಿಫ್ಟ್ ಬಂದ್ ಆಗಿದೆ',
      te: 'లిఫ్ట్ పనిచేయడం లేదు',
    },
    note: {
      en: 'The Accessible Lift on my planned route is temporarily out of service; I am waiting safely near Ground Reception for staff escort.',
      kn: 'ನನ್ನ ದಾರಿಯ ಸುಲಭ ಲಿಫ್ಟ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಬಂದ್ ಆಗಿದೆ; ನಾನು ನೆಲ ಮಹಡಿ ಸ್ವಾಗತ ಕೇಂದ್ರದ ಬಳಿ ಕಾಯುತ್ತಿದ್ದೇನೆ.',
      te: 'నా దారిలోని లిఫ్ట్ తాత్కాలికంగా ఆగిపోయింది; నేను గ్రౌండ్ రిసెప్షన్ వద్ద సిబ్బంది సహాయం కోసం వేచి ఉన్నాను.',
    },
  },
  {
    id: 'meet-radiology',
    label: {
      en: 'Meet near Radiology after registration',
      kn: 'ನೋಂದಣಿ ನಂತರ ರೇಡಿಯಾಲಜಿ ಬಳಿ ಭೇಟಿಯಾಗಿ',
      te: 'నమోదు తర్వాత రేడియాలజీ వద్ద కలవండి',
    },
    note: {
      en: 'Please meet me near the Level 1 Radiology Waiting Hall after I complete Registration.',
      kn: 'ನೋಂದಣಿ ಮುಗಿದ ನಂತರ ದಯವಿಟ್ಟು 1ನೇ ಮಹಡಿಯ ರೇಡಿಯಾಲಜಿ ಬಳಿ ಭೇಟಿಯಾಗಿ.',
      te: 'రిజిస్ట్రేషన్ పూర్తయిన తర్వాత దయచేసి 1వ అంతస్తు రేడియాలజీ వద్ద కలవండి.',
    },
  },
];

export const IMPACT_LAB_WORKFLOW_COMPARISON = {
  withoutCore: {
    title: {
      en: 'Typical Unassisted Text-Heavy Journey',
      kn: 'ಮಾರ್ಗದರ್ಶನ ಇಲ್ಲದ ಸಾಮಾನ್ಯ ಆಸ್ಪತ್ರೆ ಭೇಟಿ',
      te: 'మార్గదర్శకత్వం లేని సాధారణ ఆసుపత్రి ప్రయాణం',
    },
    stepsCount: 9,
    estimatedMinutesDemo: 28,
    frictionPoints: {
      en: [
        'Small English-only SMS abbreviation ("NPO / Diag Wing B-304") causes counter confusion',
        'Patients queue twice at the wrong desk before finding Registration',
        'When a lift or room closes, stair signs cause exhaustion or missed slots',
        'Caregivers lack a simple summary and repeatedly ask staff at busy windows',
      ],
      kn: [
        'ಕೇವಲ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿರುವ SMS ಪದಗಳಿಂದ ಕೌಂಟರ್ ಬಳಿ ಗೊಂದಲ',
        'ಸರಿಯಾದ ಡೆಸ್ಕ್ ಸಿಗದೆ ಎರಡು ಬಾರಿ ಸಾಲಿನಲ್ಲಿ ನಿಲ್ಲಬೇಕಾಗುತ್ತದೆ',
        'ಲಿಫ್ಟ್ ಅಥವಾ ಕೊಠಡಿ ಬದಲಾದಾಗ ಮೆಟ್ಟಿಲು ಹತ್ತಿ ಸುಸ್ತಾಗುತ್ತದೆ',
        'ಕುಟುಂಬದವರಿಗೆ ಸ್ಪಷ್ಟ ಸಾರಾಂಶ ಇರುವುದಿಲ್ಲ',
      ],
      te: [
        'కేవలం ఇంగ్లీష్‌లో ఉన్న సంక్షిప్త SMS పదాల వల్ల కౌంటర్ వద్ద గందరగోళం',
        'సరైన డెస్క్ తెలియక రెండుసార్లు క్యూలో నిలబడాల్సి వస్తుంది',
        'లిఫ్ట్ లేదా గది మారినప్పుడు మెట్ల వల్ల అలసట మరియు ఆలస్యం',
        'కుటుంబ సభ్యుల వద్ద స్పష్టమైన సందర్శన వివరాలు ఉండవు',
      ],
    },
  },
  withCore: {
    title: {
      en: 'Guided CORE Multilingual Adaptive Journey',
      kn: 'CORE ಬಹುಭಾಷಾ ಮತ್ತು ಬದಲಾಗುವ ಮಾರ್ಗದರ್ಶಿ',
      te: 'CORE బహుభాషా అనుకూల ప్రయాణం',
    },
    stepsCount: 5,
    estimatedMinutesDemo: 11,
    benefits: {
      en: [
        'Instant Kannada, Telugu, or English audio + plain-language checklist before leaving home',
        'Step-free indoor route map avoids stairs and recalculates when corridors close',
        'Calm "Explain My Options" + non-judgmental Teach-Back checks practical readiness',
        'Consented CareCircle summary gives family exact non-clinical arrival details',
      ],
      kn: [
        'ಮನೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನವೇ ಕನ್ನಡ, ತೆಲುಗು ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಧ್ವನಿ ಮತ್ತು ಸರಳ ಪಟ್ಟಿ',
        'ದಾರಿ ಮುಚ್ಚಿದಾಗ ತಕ್ಷಣ ಬದಲಿ ಮೆಟ್ಟಿಲು-ರಹಿತ ಮಾರ್ಗವನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತದೆ',
        'Teach-Back ಮತ್ತು Explain Options ಗೊಂದಲವನ್ನು ಶಾಂತವಾಗಿ ಪರಿಹರಿಸುತ್ತವೆ',
        'ಸಮ್ಮತಿ ಆಧಾರಿತ CareCircle ಸಾರಾಂಶ ಕುಟುಂಬಕ್ಕೆ ನೆರವಾಗುತ್ತದೆ',
      ],
      te: [
        'ఇంటి నుండి బయలుదేరే ముందే తెలుగు, కన్నడ లేదా ఇంగ్లీష్‌లో వాయిస్ మరియు జాబితా',
        'దారి మూసి ఉన్నప్పుడు తక్షణమే మెట్లు లేని ప్రత్యామ్నాయ మార్గాన్ని చూపుతుంది',
        'Teach-Back మరియు Explain Options ద్వారా సందేహాలను ప్రశాంతంగా తీరుస్తుంది',
        'అనుమతితో కూడిన CareCircle సారాంశం కుటుంబ సభ్యులకు స్పష్టతనిస్తుంది',
      ],
    },
  },
};
