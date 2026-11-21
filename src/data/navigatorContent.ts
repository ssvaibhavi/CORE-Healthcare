import { Language } from '../types';
import { HospitalNodeId } from './hospitalMapData';

export interface StageDescriptor {
  number: 1 | 2 | 3 | 4 | 5;
  title: Record<Language, string>;
  shortTitle: Record<Language, string>;
  subtitle: Record<Language, string>;
}

export const NAVIGATOR_STAGES: StageDescriptor[] = [
  {
    number: 1,
    title: {
      en: 'Before Leaving Home',
      kn: 'ಮನೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ',
      te: 'ఇంటి నుండి బయలుదేరే ముందు',
    },
    shortTitle: { en: 'Home Prep', kn: 'ಮನೆ ಸಿದ್ಧತೆ', te: 'ఇంటి తయారీ' },
    subtitle: {
      en: 'Review your fictional appointment details, pack documents, and confirm readiness.',
      kn: 'ನಿಮ್ಮ ಕಾಲ್ಪನಿಕ ಭೇಟಿ ವಿವರಗಳು, ದಾಖಲೆಗಳು ಮತ್ತು ಸಿದ್ಧತಾ ಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
      te: 'మీ నమూనా అపాయింట్‌మెంట్ వివరాలు, పత్రాలు మరియు తయారీ జాబితాను చూడండి.',
    },
  },
  {
    number: 2,
    title: {
      en: 'Arriving at the Hospital',
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ತಲುಪಿದಾಗ',
      te: 'ఆసుపత్రికి చేరుకున్నప్పుడు',
    },
    shortTitle: { en: 'Arrival & Desk', kn: 'ಆಗಮನ ಮತ್ತು ನೋಂದಣಿ', te: 'రాక & నమోదు' },
    subtitle: {
      en: 'See what happens at Reception and Registration, then choose which department to visit.',
      kn: 'ಸ್ವಾಗತ ಮತ್ತು ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಏನಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಿ, ನಿಮ್ಮ ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ.',
      te: 'రిసెప్షన్ మరియు రిజిస్ట్రేషన్ వద్ద ఏమి జరుగుతుందో చూసి, మీ విభాగాన్ని ఎంచుకోండి.',
    },
  },
  {
    number: 3,
    title: {
      en: 'Finding the Department',
      kn: 'ವಿಭಾಗವನ್ನು ಹುಡುಕುವುದು',
      te: 'విభాగాన్ని కనుగొనడం',
    },
    shortTitle: { en: 'Wayfinding Map', kn: 'ದಾರಿ ನಕ್ಷೆ', te: 'మార్గం మ్యాప్' },
    subtitle: {
      en: 'Explore the fictional demonstration floor map with step-free Accessible Lift routing.',
      kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ಸುಲಭ ಲಿಫ್ಟ್ ದಾರಿಯೊಂದಿಗೆ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ನಕ್ಷೆಯನ್ನು ಅನುಸರಿಸಿ.',
      te: 'మెట్లు లేని యాక్సెసిబుల్ లిఫ్ట్ మార్గంతో నమూనా ఆసుపత్రి మ్యాప్‌ను అనుసరించండి.',
    },
  },
  {
    number: 4,
    title: {
      en: 'Consultation Preparation',
      kn: 'ಸಮಾಲೋಚನೆಗೆ ಸಿದ್ಧತೆ',
      te: 'కన్సల్టేషన్ తయారీ',
    },
    shortTitle: { en: 'Questions & Tips', kn: 'ಪ್ರಶ್ನೆಗಳು', te: 'ప్రశ్నలు & సూచనలు' },
    subtitle: {
      en: 'Organize clear questions for hospital staff and practice a short clarity check.',
      kn: 'ವೈದ್ಯರು ಮತ್ತು ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿಕೊಳ್ಳಿ.',
      te: 'డాక్టర్లు మరియు సిబ్బందిని అడగవలసిన ప్రశ్నలను సిద్ధం చేసుకోండి.',
    },
  },
  {
    number: 5,
    title: {
      en: 'After the Visit & Navigation Card',
      kn: 'ಭೇಟಿಯ ನಂತರ & ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್',
      te: 'సందర్శన తర్వాత & నావిగేషన్ కార్డు',
    },
    shortTitle: { en: 'Summary Card', kn: 'ಸಾರಾಂಶ ಕಾರ್ಡ್', te: 'సారాంశం కార్డు' },
    subtitle: {
      en: 'Organize follow-up notes and print or save your personalized CORE Navigation Card.',
      kn: 'ಮುಂದಿನ ಹಂತಗಳನ್ನು ಜೋಡಿಸಿ, ನಿಮ್ಮ ವೈಯಕ್ತಿಕ CORE ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್ ಪ್ರಿಂಟ್ ಮಾಡಿ.',
      te: 'తదుపరి సూచనలను సేవ్ చేసి, మీ వ్యక్తిగత CORE నావిగేషన్ కార్డును ప్రింట్ చేయండి.',
    },
  },
];

export interface PrepCheckItem {
  id: string;
  label: Record<Language, string>;
  helper: Record<Language, string>;
}

export const STAGE_1_CHECKLIST: PrepCheckItem[] = [
  {
    id: 'nav-prep-id',
    label: {
      en: 'Carry a Government Photo ID card (e.g., Aadhaar or Voter ID)',
      kn: 'ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ (ಆಧಾರ್ ಅಥವಾ ವೋಟರ್ ಐಡಿ) ತೆಗೆದುಕೊಳ್ಳಿ',
      te: 'ప్రభుత్వ గుర్తింపు కార్డు (ఆధార్ లేదా ఓటర్ కార్డు) తీసుకోండి',
    },
    helper: {
      en: 'Shown briefly at the Registration Counter to print your hospital slip.',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಚೀಟಿ ಪಡೆಯಲು ತೋರಿಸಬೇಕು.',
      te: 'రిజిస్ట్రేషన్ కౌంటర్‌లో ఆసుపత్రి చీటీ తీసుకోవడానికి చూపించాలి.',
    },
  },
  {
    id: 'nav-prep-referral',
    label: {
      en: 'Pack your doctor referral letter and old test reports',
      kn: 'ವೈದ್ಯರ ಶಿಫಾರಸು ಪತ್ರ ಮತ್ತು ಹಳೆಯ ಪರೀಕ್ಷಾ ವರದಿಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ',
      te: 'డాక్టర్ రిఫరల్ లెటర్ మరియు పాత రిపోర్టులను దగ్గర ఉంచుకోండి',
    },
    helper: {
      en: 'Keeps staff from repeating tests or asking you to come back another day.',
      kn: 'ಮತ್ತೆ ಅದೇ ಪರೀಕ್ಷೆ ಮಾಡುವುದನ್ನು ಅಥವಾ ಪುನಃ ಬರುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.',
      te: 'మళ్ళీ అదే పరీక్షలు చేయాల్సిన అవసరం లేకుండా సహాయపడుతుంది.',
    },
  },
  {
    id: 'nav-prep-prepnote',
    label: {
      en: 'Confirm any pre-visit timing or food/water notes with clinic staff',
      kn: 'ಭೇಟಿಗೆ ಮುನ್ನ ಆಹಾರ ಅಥವಾ ಸಮಯದ ಸೂಚನೆಗಳನ್ನು ಆಸ್ಪತ್ರೆಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿ',
      te: 'సందర్శనకు ముందు ఆహారం లేదా సమయ సూచనలను ఆసుపత్రితో నిర్ధారించుకోండి',
    },
    helper: {
      en: 'Always follow the hospital staff’s exact instructions rather than guessing.',
      kn: 'ಯಾವಾಗಲೂ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯ ನಿಖರ ಸೂಚನೆಗಳನ್ನೇ ಅನುಸರಿಸಿ.',
      te: 'ఎల్లప్పుడూ ఆసుపత్రి సిబ్బంది ఇచ్చిన ఖచ్చితమైన సూచనలను అనుసరించండి.',
    },
  },
  {
    id: 'nav-prep-companion',
    label: {
      en: 'Bring drinking water, a small cloth bag, or a trusted family companion if helpful',
      kn: 'ಕುಡಿಯುವ ನೀರು, ಚಿಕ್ಕ ಚೀಲ ಅಥವಾ ಕುಟುಂಬದ ಒಬ್ಬರನ್ನು ಜೊತೆಯಲ್ಲಿ ಕರೆತನ್ನಿ',
      te: 'త్రాగునీరు, చిన్న సంచి లేదా వీలైతే కుటుంబ సభ్యుడిని తోడుగా తీసుకురండి',
    },
    helper: {
      en: 'Helps keep paperwork safe and reduces walking stress.',
      kn: 'ಕಾಗದಪತ್ರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಲು ಮತ್ತು ವಿಶ್ರಾಂತಿಗೆ ಸಹಾಯವಾಗುತ್ತದೆ.',
      te: 'పత్రాలను భద్రంగా ఉంచుకోవడానికి మరియు సహాయానికి ఉపయోగపడుతుంది.',
    },
  },
];

export interface ArrivalStepInfo {
  stepNum: string;
  nodeId: HospitalNodeId;
  title: Record<Language, string>;
  standard: Record<Language, string>;
  simple: Record<Language, string>;
  extraSimple: Record<Language, string>;
}

export const STAGE_2_ARRIVAL_OVERVIEW: ArrivalStepInfo[] = [
  {
    stepNum: '01',
    nodeId: 'entrance',
    title: {
      en: 'Enter at Main Entrance',
      kn: 'ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರದಿಂದ ಒಳಬನ್ನಿ',
      te: 'ప్రధాన ద్వారం నుండి లోపలికి రండి',
    },
    standard: {
      en: 'Use the step-free Main Entrance ramp. Volunteer greeters near the doorway can point you to Reception or offer wheelchair help.',
      kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ಮುಖ್ಯ ದ್ವಾರದ ಮೂಲಕ ಒಳಬನ್ನಿ. ಬಾಗಿಲ ಹತ್ತಿರದ ಸ್ವಯಂಸೇವಕರು ಸ್ವಾಗತ ಕೇಂದ್ರವನ್ನು ತೋರಿಸುತ್ತಾರೆ.',
      te: 'మెట్లు లేని ప్రధాన ద్వారం గుండా లోపలికి రండి. గేటు వద్ద ఉన్న వాలంటీర్లు మీకు రిసెప్షన్ దారిని చూపిస్తారు.',
    },
    simple: {
      en: 'Walk in through the wide step-free Main Entrance and ask volunteers if you need a wheelchair or chair.',
      kn: 'ಮುಖ್ಯ ದ್ವಾರದಿಂದ ಒಳಬನ್ನಿ; ಕುರ್ಚಿ ಅಥವಾ ದಾರಿ ಬೇಕಿದ್ದರೆ ಸ್ವಯಂಸೇವಕರನ್ನು ಕೇಳಿ.',
      te: 'ప్రధాన ద్వారం నుండి లోపలికి వచ్చి అవసరమైతే వాలంటీర్ల సహాయం అడగండి.',
    },
    extraSimple: {
      en: 'Go in through the Main Entrance.',
      kn: 'ಮುಖ್ಯ ದ್ವಾರದಿಂದ ಒಳಗೆ ಹೋಗಿ.',
      te: 'మెయిన్ ఎంట్రన్స్ నుండి లోపలికి వెళ్ళండి.',
    },
  },
  {
    stepNum: '02',
    nodeId: 'reception',
    title: {
      en: 'Check in at Reception',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ವಿಚಾರಿಸಿ',
      te: 'రిసెప్షన్‌లో అడగండి',
    },
    standard: {
      en: 'Show your fictional demo referral or appointment name at Reception. Staff confirm which queue or window you need today.',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ ಭೇಟಿಯ ವಿವರ ಅಥವಾ ಶಿಫಾರಸು ಪತ್ರ ತೋರಿಸಿ. ಸಿಬ್ಬಂದಿ ಸರಿಯಾದ ಕೌಂಟರ್ ತಿಳಿಸುತ್ತಾರೆ.',
      te: 'రిసెప్షన్ డెస్క్ వద్ద మీ అపాయింట్‌మెంట్ లేదా రిఫరల్ చీటీ చూపించండి. మీరు ఏ కౌంటర్‌కు వెళ్ళాలో సిబ్బంది చెబుతారు.',
    },
    simple: {
      en: 'Show your paper or name at Reception to find out which counter handles your visit.',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ ಚೀಟಿ ತೋರಿಸಿ ಯಾವ ಕೌಂಟರ್‌ಗೆ ಹೋಗಬೇಕು ಎಂದು ತಿಳಿದುಕೊಳ್ಳಿ.',
      te: 'రిసెప్షన్ వద్ద మీ చీటీ చూపించి ఏ కౌంటర్‌కు వెళ్ళాలో తెలుసుకోండి.',
    },
    extraSimple: {
      en: 'Show your paper at Reception.',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಚೀಟಿ ತೋರಿಸಿ.',
      te: 'రిసెప్షన్‌లో చీటీ చూపించండి.',
    },
  },
  {
    stepNum: '03',
    nodeId: 'registration',
    title: {
      en: 'Collect Token at Registration Counter',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆಯಿರಿ',
      te: 'రిజిస్ట్రేషన్ కౌంటర్‌లో టోకెన్ తీసుకోండి',
    },
    standard: {
      en: 'At the Registration Counter (East Bay), show your ID card and referral slip. You receive a visit token slip before sitting in the Waiting Area.',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಗುರುತಿನ ಚೀಟಿ ತೋರಿಸಿ ಟೋಕನ್ ಪಡೆಯಿರಿ. ನಂತರ ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶದಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      te: 'రిజిస్ట్రేషన్ కౌంటర్ వద్ద మీ ఐడి కార్డు చూపించి టోకెన్ తీసుకోండి. తర్వాత వెయిటింగ్ ఏరియాలో కూర్చోండి.',
    },
    simple: {
      en: 'Get your visit token at the Registration Counter, then rest in the Waiting Area until your turn.',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆದು, ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶದಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      te: 'రిజిస్ట్రేషన్ కౌంటర్‌లో టోకెన్ తీసుకుని, వెయిటింగ్ ఏరియాలో వేచి ఉండండి.',
    },
    extraSimple: {
      en: 'Get a token at Registration, then wait.',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆಯಿರಿ.',
      te: 'రిజిస్ట్రేషన్‌లో టోకెన్ తీసుకోండి.',
    },
  },
];

export interface ComprehensionCheckItem {
  id: string;
  question: Record<Language, string>;
  options: Array<{
    id: string;
    label: Record<Language, string>;
    isCorrect: boolean;
  }>;
  explanation: Record<Language, string>;
}

export const NAVIGATOR_COMPREHENSION_CHECKS: ComprehensionCheckItem[] = [
  {
    id: 'comp-desk',
    question: {
      en: 'Quick Check (Non-Clinical): After entering through the Main Entrance, which counter helps you check in first?',
      kn: 'ತ್ವರಿತ ಪರೀಕ್ಷೆ: ಮುಖ್ಯ ದ್ವಾರದಿಂದ ಒಳಬಂದ ನಂತರ ನೀವು ಮೊದಲು ಯಾವ ಕೌಂಟರ್‌ನಲ್ಲಿ ವಿಚಾರಿಸಬೇಕು?',
      te: 'చిన్న ప్రశ్న: ప్రధాన ద్వారం నుండి లోపలికి వచ్చిన తర్వాత మీరు ముందుగా ఏ డెస్క్ వద్ద అడగాలి?',
    },
    options: [
      {
        id: 'opt-pharmacy',
        label: {
          en: 'Pharmacy (Medicine counter)',
          kn: 'ಔಷಧಾಲಯ (Pharmacy)',
          te: 'ఫార్మసీ (మందుల దుకాణం)',
        },
        isCorrect: false,
      },
      {
        id: 'opt-reception',
        label: {
          en: 'Reception & Registration Counter',
          kn: 'ಸ್ವಾಗತ ಮತ್ತು ನೋಂದಣಿ ಕೌಂಟರ್',
          te: 'రిసెప్షన్ & రిజిస్ట్రేషన్ కౌంటర్',
        },
        isCorrect: true,
      },
      {
        id: 'opt-exit',
        label: {
          en: 'Wait outside at the gate',
          kn: 'ಗೇಟ್ ಹೊರಗಡೆಯೇ ಕಾಯಿರಿ',
          te: 'బయట గేటు వద్దే ఆగండి',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Reception points you in the right direction, and the Registration Counter issues your token before you wait.',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರ ದಾರಿ ತೋರಿಸುತ್ತದೆ ಮತ್ತು ನೋಂದಣಿ ಕೌಂಟರ್ ನಿಮಗೆ ಟೋಕನ್ ನೀಡುತ್ತದೆ.',
      te: 'రిసెప్షన్ మీకు దారి చూపిస్తుంది, మరియు రిజిస్ట్రేషన్ కౌంటర్ మీ టోకెన్ ఇస్తుంది.',
    },
  },
  {
    id: 'comp-accessible',
    question: {
      en: 'Quick Check (Non-Clinical): If stairs are uncomfortable for you or a family elder, which route option should you turn on?',
      kn: 'ತ್ವರಿತ ಪರೀಕ್ಷೆ: ಮೆಟ್ಟಿಲು ಹತ್ತುವುದು ಕಷ್ಟವಾದರೆ ನಕ್ಷೆಯಲ್ಲಿ ಯಾವ ಆಯ್ಕೆಯನ್ನು ಆನ್ ಮಾಡಬೇಕು?',
      te: 'చిన్న ప్రశ్న: మెట్లు ఎక్కడం కష్టంగా ఉంటే మీరు మ్యాప్‌లో ఏ ఆప్షన్ ఆన్ చేయాలి?',
    },
    options: [
      {
        id: 'opt-lift',
        label: {
          en: 'Accessible Step-Free Route (uses Accessible Lift)',
          kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ಸುಲಭ ದಾರಿ (Accessible Lift)',
          te: 'మెట్లు లేని సులభ మార్గం (Accessible Lift)',
        },
        isCorrect: true,
      },
      {
        id: 'opt-stairs',
        label: {
          en: 'Shortest Stairway Shortcut',
          kn: 'ಮೆಟ್ಟಿಲುಗಳ ಶಾರ್ಟ್‌ಕಟ್ ದಾರಿ',
          te: 'మెట్ల షార్ట్‌కట్ మార్గం',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Turning on the Accessible Route automatically hides all stair paths and guides you through the step-free Accessible Lift.',
      kn: 'ಸುಲಭ ದಾರಿ ಆಯ್ಕೆಯು ಮೆಟ್ಟಿಲುಗಳನ್ನು ತಪ್ಪಿಸಿ ನೇರವಾಗಿ ಲಿಫ್ಟ್ ಮೂಲಕ ದಾರಿ ತೋರಿಸುತ್ತದೆ.',
      te: 'యాక్సెసిబుల్ మార్గం మెట్లను తప్పించి నేరుగా లిఫ్ట్ ద్వారా దారిని చూపిస్తుంది.',
    },
  },
];

export const STAGE_4_STAFF_QUESTIONS: Array<{ id: string; text: Record<Language, string> }> = [
  {
    id: 'sq-when-report',
    text: {
      en: 'When and from which counter should we collect the test or scan report?',
      kn: 'ಪರೀಕ್ಷಾ ವರದಿಯನ್ನು ಯಾವಾಗ ಮತ್ತು ಯಾವ ಕೌಂಟರ್‌ನಿಂದ ಪಡೆಯಬೇಕು?',
      te: 'పరీక్ష రిపోర్ట్‌ను ఎప్పుడు మరియు ఏ కౌంటర్ నుండి తీసుకోవాలి?',
    },
  },
  {
    id: 'sq-next-step',
    text: {
      en: 'Should we return to the Consultation Room today or schedule a follow-up?',
      kn: 'ನಾವು ಇಂದೇ ವೈದ್ಯರ ಕೊಠಡಿಗೆ ಮರಳಿ ಬರಬೇಕೇ ಅಥವಾ ಮುಂದಿನ ದಿನಾಂಕ ತೆಗೆದುಕೊಳ್ಳಬೇಕೇ?',
      te: 'మేము ఈరోజే డాక్టర్ గదికి తిరిగి రావాలా లేదా తదుపరి తేదీ తీసుకోవాలా?',
    },
  },
  {
    id: 'sq-eat-water',
    text: {
      en: 'Is it okay to eat food or drink water right after finishing this test?',
      kn: 'ಈ ಪರೀಕ್ಷೆ ಮುಗಿದ ತಕ್ಷಣ ಆಹಾರ ಅಥವಾ ನೀರು ಸೇವಿಸಬಹುದೇ?',
      te: 'ఈ పరీక్ష పూర్తయిన వెంటనే ఆహారం తినవచ్చా లేదా నీరు త్రాగవచ్చా?',
    },
  },
  {
    id: 'sq-written-note',
    text: {
      en: 'Could you please write the next counter or timing clearly on our visit slip?',
      kn: 'ಮುಂದಿನ ಕೌಂಟರ್ ಅಥವಾ ಸಮಯವನ್ನು ದಯವಿಟ್ಟು ನಮ್ಮ ಚೀಟಿಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯುವಿರಾ?',
      te: 'తదుపరి కౌంటర్ లేదా సమయాన్ని దయచేసి మా చీటీపై స్పష్టంగా రాసి ఇస్తారా?',
    },
  },
];

export const STAGE_5_AFTER_VISIT: PrepCheckItem[] = [
  {
    id: 'after-written',
    label: {
      en: 'Ask staff for written counter or follow-up timing before leaving the room',
      kn: 'ಕೊಠಡಿಯಿಂದ ಹೊರಬರುವ ಮುನ್ನ ಮುಂದಿನ ಸೂಚನೆಯನ್ನು ಬರೆದುಕೊಡಲು ಕೇಳಿ',
      te: 'గది నుండి బయటకు వచ్చే ముందు తదుపరి సూచనలను రాసి ఇవ్వమని అడగండి',
    },
    helper: {
      en: 'Written notes prevent confusion when you reach home.',
      kn: 'ಮನೆಗೆ ಹೋದ ನಂತರ ಯಾವುದೇ ಗೊಂದಲವಾಗದಿರಲು ಬರೆದ ಚೀಟಿ ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
      te: 'ఇంటికి వెళ్ళిన తర్వాత గందరగోళం లేకుండా రాతపూర్వక నోట్స్ సహాయపడతాయి.',
    },
  },
  {
    id: 'after-pharmacy',
    label: {
      en: 'Check if you need to visit Pharmacy or Laboratory Pickup before exiting',
      kn: 'ಆಸ್ಪತ್ರೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ ಔಷಧಾಲಯ ಅಥವಾ ವರದಿ ಕೌಂಟರ್ ಭೇಟಿ ಅಗತ್ಯವಿದೆಯೇ ನೋಡಿ',
      te: 'బయలుదేరే ముందు ఫార్మసీ లేదా రిపోర్ట్ కౌంటర్‌కు వెళ్ళాలా అని సరిచూసుకోండి',
    },
    helper: {
      en: 'Both Pharmacy (Ground East) and Laboratory (Level 1) are shown on your CORE Map.',
      kn: 'ಔಷಧಾಲಯ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಎರಡರ ದಾರಿಯೂ CORE ನಕ್ಷೆಯಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
      te: 'ఫార్మసీ మరియు ల్యాబ్ రెండింటి దారులు CORE మ్యాప్‌లో ఉన్నాయి.',
    },
  },
  {
    id: 'after-family',
    label: {
      en: 'Share your saved Navigation Card summary with a trusted family member if desired',
      kn: 'ಬಯಸಿದರೆ ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್ ಮಾಹಿತಿಯನ್ನು ತೋರಿಸಿ',
      te: 'మీరు కోరుకుంటే మీ కుటుంబ సభ్యులకు సేవ్ చేసిన నావిగేషన్ కార్డును చూపించండి',
    },
    helper: {
      en: 'Only shares what you choose to print or save locally — zero automatic transmission.',
      kn: 'ನೀವು ಪ್ರಿಂಟ್ ಅಥವಾ ಸೇವ್ ಮಾಡಿದ ಮಾಹಿತಿ ಮಾತ್ರ ಲಭ್ಯವಿರುತ್ತದೆ.',
      te: 'మీరు ప్రింట్ లేదా సేవ్ చేసిన వివరాలు మాత్రమే ఉంటాయి — ఆటోమేటిక్ షేరింగ్ ఉండదు.',
    },
  },
];

export interface AcademicDemoStep {
  id: string;
  targetStage?: 1 | 2 | 3 | 4 | 5;
  label: Record<Language, string>;
}

export const DESIGN_THINKING_DEMO_STEPS: AcademicDemoStep[] = [
  {
    id: 'dt-1-lang',
    targetStage: 1,
    label: {
      en: '1. Select Language (English / ಕನ್ನಡ / తెలుగు)',
      kn: '1. ಭಾಷೆ ಆಯ್ಕೆ (English / ಕನ್ನಡ / తెలుగు)',
      te: '1. భాషను ఎంచుకోండి (English / ಕನ್ನಡ / తెలుగు)',
    },
  },
  {
    id: 'dt-2-apt',
    targetStage: 1,
    label: {
      en: '2. Review Fictional Appointment Details',
      kn: '2. ಕಾಲ್ಪನಿಕ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರ ಪರಿಶೀಲಿಸಿ',
      te: '2. నమూనా అపాయింట్‌మెంట్ వివరాలు చూడండి',
    },
  },
  {
    id: 'dt-3-prep',
    targetStage: 1,
    label: {
      en: '3. Complete Before-Visit Preparation Checklist',
      kn: '3. ಭೇಟಿಗೆ ಮುನ್ನ ಸಿದ್ಧತಾ ಪಟ್ಟಿ ಪೂರ್ಣಗೊಳಿಸಿ',
      te: '3. సందర్శనకు ముందు తయారీ జాబితా పూర్తి చేయండి',
    },
  },
  {
    id: 'dt-4-arrive',
    targetStage: 2,
    label: {
      en: '4. Enter Fictional Hospital & Check Registration',
      kn: '4. ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪ್ರವೇಶ ಮತ್ತು ನೋಂದಣಿ ಹಂತ',
      te: '4. నమూనా ఆసుపత్రి ప్రవేశం & రిజిస్ట్రేషన్ చూడండి',
    },
  },
  {
    id: 'dt-5-dept',
    targetStage: 2,
    label: {
      en: '5. Choose Department (Radiology / Lab / Pharmacy / Doctor)',
      kn: '5. ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ರೇಡಿಯಾಲಜಿ / ಲ್ಯಾಬ್ / ಔಷಧಾಲಯ)',
      te: '5. విభాగాన్ని ఎంచుకోండి (రేడియాలజీ / ల్యాబ్ / ఫార్మసీ)',
    },
  },
  {
    id: 'dt-6-route',
    targetStage: 3,
    label: {
      en: '6. Follow Interactive Floor Route & Accessibility Toggle',
      kn: '6. ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ ಮತ್ತು ಸುಲಭ ಲಿಫ್ಟ್ ದಾರಿ ನೋಡಿ',
      te: '6. ఫ్లోర్ మ్యాప్ & యాక్సెసిబుల్ లిఫ్ట్ మార్గాన్ని చూడండి',
    },
  },
  {
    id: 'dt-7-ai',
    targetStage: 3,
    label: {
      en: '7. Ask CORE AI Companion About the Route',
      kn: '7. ದಾರಿಯ ಕುರಿತು CORE AI ಸಹಾಯಕವನ್ನು ಕೇಳಿ',
      te: '7. మార్గం గురించి CORE AI సహాయకుడిని అడగండి',
    },
  },
  {
    id: 'dt-8-journey',
    targetStage: 4,
    label: {
      en: '8. Prepare Consultation Questions & Wrap Up Visit',
      kn: '8. ವೈದ್ಯರ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಭೇಟಿಯ ನಂತರದ ಹಂತ',
      te: '8. కన్సల్టేషన్ ప్రశ్నలు & సందర్శన ముగింపు',
    },
  },
  {
    id: 'dt-9-card',
    targetStage: 5,
    label: {
      en: '9. View / Print Personalized Navigation Card',
      kn: '9. ವೈಯಕ್ತಿಕ CORE ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್ ಪ್ರಿಂಟ್ ಮಾಡಿ',
      te: '9. వ్యక్తిగత CORE నావిగేషన్ కార్డును ప్రింట్ చేయండి',
    },
  },
];

export const COMPANION_NAV_PROMPTS: Array<Record<Language, string>> = [
  {
    en: 'Where should I go after entering the hospital?',
    kn: 'ಆಸ್ಪತ್ರೆಗೆ ಪ್ರವೇಶಿಸಿದ ನಂತರ ನಾನು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?',
    te: 'ఆసుపత్రిలోకి ప్రవేశించిన తర్వాత నేను ఎక్కడికి వెళ్ళాలి?',
  },
  {
    en: 'How do I find the radiology department?',
    kn: 'ರೇಡಿಯಾಲಜಿ ವಿಭಾಗವನ್ನು ನಾನು ಹೇಗೆ ಹುಡುಕುವುದು?',
    te: 'రేడియాలజీ విభాగాన్ని నేను ఎలా కనుగొనాలి?',
  },
  {
    en: 'What happens at registration?',
    kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಏನಾಗುತ್ತದೆ?',
    te: 'రిజిస్ట్రేషన్ కౌంటర్ వద్ద ఏమి జరుగుతుంది?',
  },
  {
    en: 'What should I do if I cannot find my appointment details?',
    kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳು ಸಿಗದಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?',
    te: 'నా అపాయింట్‌మెంట్ వివరాలు కనిపించకపోతే ఏమి చేయాలి?',
  },
  {
    en: 'Can you explain these instructions in Kannada?',
    kn: 'ಈ ಮಾರ್ಗದರ್ಶನ ಸೂಚನೆಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಸರಳವಾಗಿ ವಿವರಿಸುವಿರಾ?',
    te: 'ఈ సూచనలను కన్నడలో లేదా సులభంగా వివరించగలరా?',
  },
];
