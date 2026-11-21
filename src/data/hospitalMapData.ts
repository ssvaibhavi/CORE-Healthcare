import { Language } from '../types';

export type HospitalNodeId =
  | 'entrance'
  | 'reception'
  | 'registration'
  | 'waiting'
  | 'pharmacy'
  | 'lift'
  | 'west-stairs'
  | 'east-stairs'
  | 'lift-upper'
  | 'radiology'
  | 'laboratory'
  | 'consultation';

export type HospitalZone = 'ground-lobby' | 'transition' | 'diagnostic-wing';

export interface HospitalNode {
  id: HospitalNodeId;
  x: number;
  y: number;
  zone: HospitalZone;
  isDestination: boolean;
  isStairNode?: boolean;
  isLiftNode?: boolean;
  levelLabel: Record<Language, string>;
  name: Record<Language, string>;
  shortLabel: Record<Language, string>;
  description: Record<Language, string>;
  accessibilityNote: Record<Language, string>;
}

export interface InstructionDepthText {
  standard: string;
  simple: string;
  extraSimple: string;
  landmark: string;
}

export interface HospitalEdge {
  id: string;
  from: HospitalNodeId;
  to: HospitalNodeId;
  weightMeters: number;
  estimatedMinutes: number;
  viaStairs: boolean;
  isLiftRide?: boolean;
  forward: Record<Language, InstructionDepthText>;
  reverse: Record<Language, InstructionDepthText>;
}

export const HOSPITAL_NODES: Record<HospitalNodeId, HospitalNode> = {
  entrance: {
    id: 'entrance',
    x: 420,
    y: 446,
    zone: 'ground-lobby',
    isDestination: true,
    levelLabel: {
      en: 'Ground Entrance · Demo Wing',
      kn: 'ನೆಲ ಮಹಡಿ ಪ್ರವೇಶ · ಡೆಮೊ ವಿಭಾಗ',
      te: 'గ్రౌండ్ ఎంట్రన్స్ · డెమో వింగ్',
    },
    name: {
      en: 'Main Entrance',
      kn: 'ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರ',
      te: 'ప్రధాన ద్వారం (Main Entrance)',
    },
    shortLabel: {
      en: 'Main Entrance',
      kn: 'ಮುಖ್ಯ ದ್ವಾರ',
      te: 'మెయిన్ ఎంట్రన్స్',
    },
    description: {
      en: 'Step-free main entry porch with volunteer desk signage (fictional demonstration point).',
      kn: 'ಸ್ವಯಂಸೇವಕ ಸಹಾಯ ಫಲಕವಿರುವ ಸಮತಟ್ಟಾದ ಮುಖ್ಯ ಪ್ರವೇಶ (ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಸ್ಥಳ).',
      te: 'మెట్లు లేని ప్రధాన ద్వారం మరియు వాలంటీర్ సహాయ బోర్డు (నమూనా స్థలం).',
    },
    accessibilityNote: {
      en: 'Step-free ramp entry',
      kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ರ‍್ಯಾಂಪ್ ದಾರಿ',
      te: 'మెట్లు లేని ర్యాంప్ ప్రవేశం',
    },
  },
  reception: {
    id: 'reception',
    x: 420,
    y: 360,
    zone: 'ground-lobby',
    isDestination: true,
    levelLabel: {
      en: 'Ground Lobby · Desk 1',
      kn: 'ನೆಲ ಮಹಡಿ ಲಾಬಿ · ಡೆಸ್ಕ್ 1',
      te: 'గ్రౌండ్ లాబీ · డెస్క్ 1',
    },
    name: {
      en: 'Reception',
      kn: 'ಸ್ವಾಗತ ಕೇಂದ್ರ (Reception)',
      te: 'రిసెప్ಷన్ (Reception)',
    },
    shortLabel: {
      en: 'Reception',
      kn: 'ಸ್ವಾಗತ',
      te: 'రిసెప్షన్',
    },
    description: {
      en: 'Central orientation counter where staff verify your visit reason and point you to registration.',
      kn: 'ನಿಮ್ಮ ಭೇಟಿಯ ಉದ್ದೇಶವನ್ನು ಪರಿಶೀಲಿಸಿ ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ದಾರಿ ತೋರಿಸುವ ಕೇಂದ್ರ.',
      te: 'మీ సందర్శన వివరాలను చూసి రిజిస్ట్రేషన్ కౌంటర్ దారిని చూపించే ప్రధాన డెస్క్.',
    },
    accessibilityNote: {
      en: 'Step-free · Low counter window',
      kn: 'ಸಮತಟ್ಟಾದ ನೆಲ · ಸುಲಭ ಕೌಂಟರ್',
      te: 'మెట్లు లేవు · వీల్‌చైర్ అనుకూలం',
    },
  },
  registration: {
    id: 'registration',
    x: 615,
    y: 360,
    zone: 'ground-lobby',
    isDestination: true,
    levelLabel: {
      en: 'Ground Lobby · East Bay',
      kn: 'ನೆಲ ಮಹಡಿ · ಪೂರ್ವ ಕೌಂಟರ್',
      te: 'గ్రౌండ్ లాబీ · తూర్పు కౌంటర్',
    },
    name: {
      en: 'Registration Counter',
      kn: 'ನೋಂದಣಿ ಕೌಂಟರ್ (Registration)',
      te: 'రిజిస్ట్రేషన్ కౌంటర్',
    },
    shortLabel: {
      en: 'Registration',
      kn: 'ನೋಂದಣಿ',
      te: 'రిజిస్ట్రేషన్',
    },
    description: {
      en: 'Show ID and referral slip here to collect your token or stamped visit card.',
      kn: 'ಗುರುತಿನ ಚೀಟಿ ಮತ್ತು ಶಿಫಾರಸು ಪತ್ರ ತೋರಿಸಿ ಟೋಕನ್ ಪಡೆಯುವ ಸ್ಥಳ.',
      te: 'గుర్తింపు కార్డు మరియు రిఫరల్ చీటీ చూపించి టోకెన్ తీసుకునే కౌంటర్.',
    },
    accessibilityNote: {
      en: 'Step-free corridor with seating nearby',
      kn: 'ಸಮತಟ್ಟಾದ ದಾರಿ ಮತ್ತು ಹತ್ತಿರದಲ್ಲಿ ಆಸನಗಳು',
      te: 'సమతల మార్గం మరియు పక్కనే కుర్చీలు',
    },
  },
  waiting: {
    id: 'waiting',
    x: 420,
    y: 266,
    zone: 'ground-lobby',
    isDestination: true,
    levelLabel: {
      en: 'Ground Central Hall',
      kn: 'ನೆಲ ಮಹಡಿ ವಿಶ್ರಾಂತಿ ಹಾಲ್',
      te: 'గ్రౌండ్ వెయిటింగ్ హాల్',
    },
    name: {
      en: 'Waiting Area',
      kn: 'ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶ (Waiting Area)',
      te: 'వేచి ఉండే ప్రదేశం (Waiting Area)',
    },
    shortLabel: {
      en: 'Waiting Area',
      kn: 'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳ',
      te: 'వెయిటింగ్ ఏరియా',
    },
    description: {
      en: 'Shaded seating area with drinking water nearby before heading to wing counters.',
      kn: 'ಕೊಠಡಿ ಕರೆಗಾಗಿ ಕುಳಿತುಕೊಳ್ಳಲು ಆಸನಗಳು ಮತ್ತು ಕುಡಿಯುವ ನೀರಿನ ವ್ಯವಸ್ಥೆ ಇರುವ ಸ್ಥಳ.',
      te: 'వరుస కోసం కూర్చునే ప్రదేశం మరియు త్రాగునీటి వసతి ఉన్న హాల్.',
    },
    accessibilityNote: {
      en: 'Step-free · Wheelchair space available',
      kn: 'ಗಾಲಿಕುರ್ಚಿ ಸ್ಥಳಾವಕಾಶ ಲಭ್ಯವಿದೆ',
      te: 'వీల్‌చైర్ స్థలం అందుబాటులో ఉంది',
    },
  },
  pharmacy: {
    id: 'pharmacy',
    x: 685,
    y: 266,
    zone: 'ground-lobby',
    isDestination: true,
    levelLabel: {
      en: 'Ground Lobby · East Corner',
      kn: 'ನೆಲ ಮಹಡಿ · ಔಷಧಾಲಯ',
      te: 'గ్రౌండ్ లాబీ · ఫార్మసీ',
    },
    name: {
      en: 'Pharmacy',
      kn: 'ಔಷಧಾಲಯ (Pharmacy)',
      te: 'ఫార్మసీ (మందుల దుకాణం)',
    },
    shortLabel: {
      en: 'Pharmacy',
      kn: 'ಔಷಧಾಲಯ',
      te: 'ఫార్మసీ',
    },
    description: {
      en: 'Dispensary counter for prescribed medicines after your consultation.',
      kn: 'ವೈದ್ಯರ ಭೇಟಿಯ ನಂತರ ಔಷಧಿಗಳನ್ನು ಪಡೆಯುವ ವಿತರಣಾ ಕೌಂಟರ್.',
      te: 'డాక్టర్ సలహా తర్వాత మందులు తీసుకునే కౌంటర్.',
    },
    accessibilityNote: {
      en: 'Step-free Ground level access',
      kn: 'ನೆಲ ಮಹಡಿಯಲ್ಲಿ ಮೆಟ್ಟಿಲು ರಹಿತ ಪ್ರವೇಶ',
      te: 'గ్రౌండ్ ఫ్లోర్‌లో మెట్లు లేని ప్రవేశం',
    },
  },
  lift: {
    id: 'lift',
    x: 245,
    y: 266,
    zone: 'ground-lobby',
    isDestination: true,
    isLiftNode: true,
    levelLabel: {
      en: 'Ground Lobby · West Lift',
      kn: 'ನೆಲ ಮಹಡಿ · ಸುಲಭ ಲಿಫ್ಟ್',
      te: 'గ్రౌండ్ లాబీ · యాక్సెసిబుల్ లిఫ్ట్',
    },
    name: {
      en: 'Accessible Lift',
      kn: 'ಸುಲಭ ಲಿಫ್ಟ್ (Accessible Lift)',
      te: 'యాక్సెసిబుల్ లిఫ్ట్ (Accessible Lift)',
    },
    shortLabel: {
      en: 'Accessible Lift',
      kn: 'ಸುಲಭ ಲಿಫ್ಟ್',
      te: 'లిఫ్ట్',
    },
    description: {
      en: 'Wide elevator with handrails and audio floor announcement serving Upper Wing step-free.',
      kn: 'ಮೆಟ್ಟಿಲು ಹತ್ತದೆ ಮೇಲಿನ ಪರೀಕ್ಷಾ ವಿಭಾಗಕ್ಕೆ ಹೋಗಲು ವಿಶಾಲವಾದ ಲಿಫ್ಟ್.',
      te: 'మెట్లు ఎక్కకుండా పై విభాగానికి వెళ్ళేందుకు విశాలమైన లిఫ్ట్.',
    },
    accessibilityNote: {
      en: '100% step-free · Handrails & spacious cab',
      kn: 'ಸಂಪೂರ್ಣ ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್',
      te: 'పూర్తిగా మెట్లు లేనిది · హ్యాండ్‌రెయిల్స్ కలవు',
    },
  },
  'west-stairs': {
    id: 'west-stairs',
    x: 245,
    y: 186,
    zone: 'transition',
    isDestination: false,
    isStairNode: true,
    levelLabel: {
      en: 'Stairwell A (8 Steps)',
      kn: 'ಮೆಟ್ಟಿಲು ದಾರಿ A',
      te: 'మెట్ల మార్గం A',
    },
    name: {
      en: 'Central Staircase',
      kn: 'ಕೇಂದ್ರ ಮೆಟ್ಟಿಲುಗಳು',
      te: 'మధ్య మెట్లు',
    },
    shortLabel: {
      en: 'Stairs',
      kn: 'ಮೆಟ್ಟಿಲು',
      te: 'మెట్లు',
    },
    description: {
      en: 'Short flight of 8 stairs leading from Waiting Area to Upper Diagnostic Wing.',
      kn: 'ನಿರೀಕ್ಷಣಾ ಹಾಲ್‌ನಿಂದ ಮೇಲಿನ ವಿಭಾಗಕ್ಕೆ ಹೋಗುವ ೮ ಮೆಟ್ಟಿಲುಗಳು.',
      te: 'వెయిటింగ్ హాల్ నుండి పై డయాగ్నస్టిక్ వింగ్‌కు వెళ్ళే 8 మెట్లు.',
    },
    accessibilityNote: {
      en: 'Has stairs — bypassed in Step-Free Mode',
      kn: 'ಮೆಟ್ಟಿಲುಗಳಿವೆ — ಸುಲಭ ದಾರಿಯಲ್ಲಿ ತಪ್ಪಿಸಲಾಗಿದೆ',
      te: 'మెట్లు ఉన్నాయి — స్టెప్-ఫ్రీ మార్గంలో తప్పించబడుతుంది',
    },
  },
  'east-stairs': {
    id: 'east-stairs',
    x: 685,
    y: 186,
    zone: 'transition',
    isDestination: false,
    isStairNode: true,
    levelLabel: {
      en: 'East Staircase (8 Steps)',
      kn: 'ಪೂರ್ವ ಮೆಟ್ಟಿಲುಗಳು',
      te: 'తూర్పు మెట్లు',
    },
    name: {
      en: 'East Corridor Stairs',
      kn: 'ಪೂರ್ವ ಭಾಗದ ಮೆಟ್ಟಿಲುಗಳು',
      te: 'తూర్పు కారిడార్ మెట్లు',
    },
    shortLabel: {
      en: 'East Stairs',
      kn: 'ಪೂರ್ವ ಮೆಟ್ಟಿಲು',
      te: 'తూర్పు మెట్లు',
    },
    description: {
      en: 'Direct stairwell connecting Pharmacy corridor to Consultation Rooms.',
      kn: 'ಔಷಧಾಲಯದಿಂದ ಸಮಾಲೋಚನಾ ಕೊಠಡಿಗಳಿಗೆ ಹೋಗುವ ಮೆಟ್ಟಿಲುಗಳು.',
      te: 'ఫార్మసీ నుండి కన్సల్టేషన్ గదులకు వెళ్ళే మెట్లు.',
    },
    accessibilityNote: {
      en: 'Has stairs — bypassed in Step-Free Mode',
      kn: 'ಮೆಟ್ಟಿಲುಗಳಿವೆ — ಸುಲಭ ದಾರಿಯಲ್ಲಿ ತಪ್ಪಿಸಲಾಗಿದೆ',
      te: 'మెట్లు ఉన్నాయి — స్టెప్-ఫ్రీ మార్గంలో తప్పించబడుతుంది',
    },
  },
  'lift-upper': {
    id: 'lift-upper',
    x: 245,
    y: 112,
    zone: 'diagnostic-wing',
    isDestination: false,
    isLiftNode: true,
    levelLabel: {
      en: 'Level 1 · Lift Landing',
      kn: 'ಮಹಡಿ 1 · ಲಿಫ್ಟ್ ದ್ವಾರ',
      te: 'లెవెల్ 1 · లిఫ్ట్ లాండింగ్',
    },
    name: {
      en: 'Upper Wing Lift Landing',
      kn: 'ಮೇಲಿನ ವಿಭಾಗದ ಲಿಫ್ಟ್ ದ್ವಾರ',
      te: 'పై విభాగం లిఫ్ట్ లాండింగ్',
    },
    shortLabel: {
      en: 'Lift Exit',
      kn: 'ಲಿಫ್ಟ್ ಹೊರಬರುವಿಕೆ',
      te: 'లిఫ్ట్ ద్వారం',
    },
    description: {
      en: 'Level corridor opening directly between Radiology and Laboratory.',
      kn: 'ರೇಡಿಯಾಲಜಿ ಮತ್ತು ಪ್ರಯೋಗಾಲಯದ ನಡುವೆ ತೆರೆಯುವ ಸಮತಟ್ಟಾದ ಕಾರಿಡಾರ್.',
      te: 'రేడియాలజీ మరియు ల్యాబ్ మధ్య ఉండే సమతల కారిడార్.',
    },
    accessibilityNote: {
      en: 'Step-free landing',
      kn: 'ಮೆಟ್ಟಿಲು ರಹಿತ ಕಾರಿಡಾರ್',
      te: 'మెట్లు లేని కారిడార్',
    },
  },
  radiology: {
    id: 'radiology',
    x: 118,
    y: 112,
    zone: 'diagnostic-wing',
    isDestination: true,
    levelLabel: {
      en: 'Diagnostic Wing · Level 1',
      kn: 'ಪರೀಕ್ಷಾ ವಿಭಾಗ · ಮಹಡಿ 1',
      te: 'డయాగ్నస్టిక్ వింగ్ · లెవెల్ 1',
    },
    name: {
      en: 'Radiology',
      kn: 'ರೇಡಿಯಾಲಜಿ (CT / X-Ray)',
      te: 'రేడియాలజీ (CT / X-Ray)',
    },
    shortLabel: {
      en: 'Radiology',
      kn: 'ರೇಡಿಯಾಲಜಿ',
      te: 'రేడియాలజీ',
    },
    description: {
      en: 'CT Scan, X-Ray, and Ultrasound imaging reception & preparation rooms.',
      kn: 'ಸಿಟಿ ಸ್ಕ್ಯಾನ್, ಎಕ್ಸ್-ರೇ ಮತ್ತು ಅಲ್ಟ್ರಾಸೌಂಡ್ ಪರೀಕ್ಷಾ ವಿಭಾಗ.',
      te: 'సిటి స్కాన్, ఎక్స్-రే మరియు అల్ట్రాసౌండ్ స్కానింగ్ విభాగం.',
    },
    accessibilityNote: {
      en: 'Accessible via West Lift',
      kn: 'ಪಶ್ಚಿಮ ಲಿಫ್ಟ್ ಮೂಲಕ ಸುಲಭ ಪ್ರವೇಶ',
      te: 'లిఫ్ట్ ద్వారా సులభంగా చేరుకోవచ్చు',
    },
  },
  laboratory: {
    id: 'laboratory',
    x: 420,
    y: 112,
    zone: 'diagnostic-wing',
    isDestination: true,
    levelLabel: {
      en: 'Diagnostic Wing · Level 1',
      kn: 'ಪರೀಕ್ಷಾ ವಿಭಾಗ · ಮಹಡಿ 1',
      te: 'డయాగ్నస్టిక్ వింగ్ · లెవెల్ 1',
    },
    name: {
      en: 'Laboratory',
      kn: 'ಪ್ರಯೋಗಾಲಯ (Laboratory)',
      te: 'ల్యాబొరేటరీ (రక్త పరీక్షలు)',
    },
    shortLabel: {
      en: 'Laboratory',
      kn: 'ಪ್ರಯೋಗಾಲಯ',
      te: 'ల్యాబ్',
    },
    description: {
      en: 'Blood sample collection and diagnostic report pickup counter.',
      kn: 'ರಕ್ತ ಪರೀಕ್ಷೆ ಮಾದರಿ ಸಂಗ್ರಹಣೆ ಮತ್ತು ವರದಿ ವಿತರಣಾ ಕೇಂದ್ರ.',
      te: 'రక్త నమూనా సేకరణ మరియు రిపోర్ట్ సేకరణ కౌంటర్.',
    },
    accessibilityNote: {
      en: 'Accessible via West Lift & wide corridor',
      kn: 'ಲಿಫ್ಟ್ ಮತ್ತು ವಿಶಾಲ ಕಾರಿಡಾರ್ ಮೂಲಕ ಪ್ರವೇಶ',
      te: 'లిఫ్ట్ మరియు వెడల్పాటి కారిడార్ ద్వారా ప్రవేశం',
    },
  },
  consultation: {
    id: 'consultation',
    x: 685,
    y: 112,
    zone: 'diagnostic-wing',
    isDestination: true,
    levelLabel: {
      en: 'Doctor Suite · Level 1',
      kn: 'ವೈದ್ಯರ ಕೊಠಡಿಗಳು · ಮಹಡಿ 1',
      te: 'కన్సల్టేషన్ గదులు · లెవెల్ 1',
    },
    name: {
      en: 'Consultation Rooms',
      kn: 'ಸಮಾಲೋಚನಾ ಕೊಠಡಿಗಳು (Doctors)',
      te: 'కన్సల్టేషన్ గదులు (వైద్యుల గదులు)',
    },
    shortLabel: {
      en: 'Consultation',
      kn: 'ವೈದ್ಯರ ಕೊಠಡಿ',
      te: 'వైద్యుల గదులు',
    },
    description: {
      en: 'Outpatient consultation cabins where doctors review reports and answer questions.',
      kn: 'ವೈದ್ಯರು ನಿಮ್ಮ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಸಲಹೆ ನೀಡುವ ಕೊಠಡಿಗಳು.',
      te: 'డాక్టర్లు మీ రిపోర్టులను చూసి సలహాలు ఇచ్చే గదులు.',
    },
    accessibilityNote: {
      en: 'Step-free path available via Accessible Lift & Lab corridor',
      kn: 'ಸುಲಭ ಲಿಫ್ಟ್ ಮತ್ತು ಲ್ಯಾಬ್ ಕಾರಿಡಾರ್ ಮೂಲಕ ಮೆಟ್ಟಿಲು ರಹಿತ ದಾರಿ',
      te: 'యాక్సెసిబుల్ లిఫ్ట్ & ల్యాబ్ కారిడార్ ద్వారా మెట్లు లేని దారి',
    },
  },
};

export const SELECTABLE_DESTINATION_IDS: HospitalNodeId[] = [
  'entrance',
  'reception',
  'registration',
  'waiting',
  'radiology',
  'laboratory',
  'consultation',
  'pharmacy',
  'lift',
];

export const DEPARTMENT_QUICK_IDS: HospitalNodeId[] = [
  'radiology',
  'laboratory',
  'consultation',
  'pharmacy',
];

function makeStep(
  standard: string,
  simple: string,
  extraSimple: string,
  landmark: string
): InstructionDepthText {
  return { standard, simple, extraSimple, landmark };
}

export const HOSPITAL_EDGES: HospitalEdge[] = [
  {
    id: 'entrance-reception',
    from: 'entrance',
    to: 'reception',
    weightMeters: 16,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'Enter through the step-free Main Entrance and walk straight ahead ~16 m to the Reception Desk.',
        'Walk straight inside from the Main Entrance to reach the Reception Desk.',
        'Walk straight in to Reception.',
        'Volunteer Help Board'
      ),
      kn: makeStep(
        'ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರದಿಂದ ಒಳಗೆ ಬಂದು ಸುಮಾರು 16 ಮೀಟರ್ ನೇರವಾಗಿ ನಡೆದರೆ ಸ್ವಾಗತ ಕೇಂದ್ರ ಸಿಗುತ್ತದೆ.',
        'ಮುಖ್ಯ ದ್ವಾರದಿಂದ ಒಳಗೆ ನೇರವಾಗಿ ನಡೆದರೆ ಸ್ವಾಗತ ಕೇಂದ್ರ ತಲುಪುತ್ತೀರಿ.',
        'ನೇರವಾಗಿ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ನಡೆಯಿರಿ.',
        'ಸ್ವಯಂಸೇವಕ ಸಹಾಯ ಫಲಕ'
      ),
      te: makeStep(
        'ప్రధాన ద్వారం నుండి లోపలికి వచ్చి సుమారు 16 మీటర్లు నేరుగా నడిస్తే రిసెప్షన్ డెస్క్ వస్తుంది.',
        'ప్రధాన ద్వారం నుండి నేరుగా లోపలికి నడిస్తే రిసెప్షన్ వస్తుంది.',
        'నేరుగా రిసెప్షన్‌కు నడవండి.',
        'వాలంటీర్ హెల్ప్ బోర్డు'
      ),
    },
    reverse: {
      en: makeStep(
        'From Reception, walk straight toward the wide glass exit doors (~16 m) to reach the Main Entrance.',
        'Walk straight from Reception toward the exit doors to reach the Main Entrance.',
        'Walk straight out to Main Entrance.',
        'Exit Porch'
      ),
      kn: makeStep(
        'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ನೇರವಾಗಿ ಹೊರಬಾಗಿಲ ಕಡೆಗೆ ನಡೆದರೆ ಮುಖ್ಯ ಪ್ರವೇಶದ್ವಾರ ತಲುಪುತ್ತೀರಿ.',
        'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ನೇರವಾಗಿ ಹೊರದ್ವಾರದ ಕಡೆಗೆ ನಡೆಯಿರಿ.',
        'ಮುಖ್ಯ ದ್ವಾರಕ್ಕೆ ನೇರವಾಗಿ ನಡೆಯಿರಿ.',
        'ಹೊರಬರುವ ಬಾಗಿಲು'
      ),
      te: makeStep(
        'రిసెప్షన్ నుండి నేరుగా బయటి తలుపుల వైపు నడిస్తే ప్రధాన ద్వారం వస్తుంది.',
        'రిసెప్షన్ నుండి నేరుగా మెయిన్ ఎంట్రన్స్ వైపు నడవండి.',
        'మెయిన్ ఎంట్రన్స్‌కు వెళ్ళండి.',
        'బయటి పోర్చ్'
      ),
    },
  },
  {
    id: 'reception-registration',
    from: 'reception',
    to: 'registration',
    weightMeters: 22,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'At Reception, turn right along the wide ground corridor (~22 m) to the Registration Counter.',
        'Turn right at Reception and follow the wide hall to Registration.',
        'Turn right to Registration.',
        'East Bay Token Windows'
      ),
      kn: makeStep(
        'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಬಲಕ್ಕೆ ತಿರುಗಿ ವಿಶಾಲ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ 22 ಮೀಟರ್ ನಡೆದರೆ ನೋಂದಣಿ ಕೌಂಟರ್ ಸಿಗುತ್ತದೆ.',
        'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಬಲಕ್ಕೆ ತಿರುಗಿ ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ನಡೆಯಿರಿ.',
        'ಬಲಕ್ಕೆ ತಿರುಗಿ ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ಹೋಗಿ.',
        'ಟೋಕನ್ ಕಿಟಕಿಗಳು'
      ),
      te: makeStep(
        'రిసెప్షన్ వద్ద కుడివైపు తిరిగి కారిడార్‌లో 22 మీటర్లు నడిస్తే రిజిస్ట్రేషన్ కౌంటర్ వస్తుంది.',
        'రిసెప్షన్ నుండి కుడివైపు వెళితే రిజిస్ట్రేషన్ కౌంటర్ కనిపిస్తుంది.',
        'కుడివైపు రిజిస్ట్రేషన్‌కు వెళ్ళండి.',
        'టోకెన్ విండోలు'
      ),
    },
    reverse: {
      en: makeStep(
        'From the Registration Counter, walk left along the ground hall (~22 m) back to Reception.',
        'Walk left from Registration back toward the central Reception desk.',
        'Walk left back to Reception.',
        'Central Help Desk'
      ),
      kn: makeStep(
        'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಿಂದ ಎಡಕ್ಕೆ ತಿರುಗಿ ಕೇಂದ್ರ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಮರಳಿ ಬನ್ನಿ.',
        'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಿಂದ ಎಡಕ್ಕೆ ನಡೆದು ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಬನ್ನಿ.',
        'ಎಡಕ್ಕೆ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ನಡೆಯಿರಿ.',
        'ಮಧ್ಯದ ಸ್ವಾಗತ ಮೇಜು'
      ),
      te: makeStep(
        'రిజిస్ట్రేషన్ కౌంటర్ నుండి ఎడమవైపు నడిస్తే తిరిగి రిసెప్షన్ వద్దకు చేరుకుంటారు.',
        'రిజిస్ట్రేషన్ నుండి ఎడమవైపు రిసెప్షన్‌కు రండి.',
        'ఎడమవైపు రిసెప్షన్‌కు వెళ్ళండి.',
        'సెంట్రల్ డెస్క్'
      ),
    },
  },
  {
    id: 'reception-waiting',
    from: 'reception',
    to: 'waiting',
    weightMeters: 18,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'Continue straight past Reception (~18 m) into the central Waiting Area with shaded seating.',
        'Walk straight past Reception into the main Waiting Area.',
        'Go straight into Waiting Area.',
        'Drinking Water Fountain'
      ),
      kn: makeStep(
        'ಸ್ವಾಗತ ಕೇಂದ್ರವನ್ನು ದಾಟಿ ನೇರವಾಗಿ 18 ಮೀಟರ್ ನಡೆದರೆ ಕೇಂದ್ರ ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶ ತಲುಪುತ್ತೀರಿ.',
        'ಸ್ವಾಗತ ಕೇಂದ್ರದ ಮುಂದೆ ನೇರವಾಗಿ ನಡೆದರೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳ ಸಿಗುತ್ತದೆ.',
        'ನೇರವಾಗಿ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ.',
        'ಕುಡಿಯುವ ನೀರಿನ ಸ್ಥಳ'
      ),
      te: makeStep(
        'రిసెప్షన్ దాటి నేరుగా 18 మీటర్లు నడిస్తే ప్రధాన వెయిటింగ్ ఏరియా వస్తుంది.',
        'రిసెప్షన్ దాటి నేరుగా వెయిటింగ్ ఏరియాలోకి వెళ్ళండి.',
        'నేరుగా వెయిటింగ్ ఏరియాకు వెళ్ళండి.',
        'త్రాగునీటి వసతి'
      ),
    },
    reverse: {
      en: makeStep(
        'Walk straight back (~18 m) from the Waiting Area toward the Reception Desk.',
        'Walk straight from the Waiting Area back to Reception.',
        'Walk back to Reception.',
        'Main Lobby Sign'
      ),
      kn: makeStep(
        'ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶದಿಂದ ನೇರವಾಗಿ ಹಿಂದಕ್ಕೆ ನಡೆದರೆ ಸ್ವಾಗತ ಕೇಂದ್ರ ತಲುಪುತ್ತೀರಿ.',
        'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದಿಂದ ಹಿಂದಕ್ಕೆ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಬನ್ನಿ.',
        'ಹಿಂದೆ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಿ.',
        'ಮುಖ್ಯ ಲಾಬಿ ಫಲಕ'
      ),
      te: makeStep(
        'వెయిటింగ్ ఏరియా నుండి నేరుగా వెనక్కి నడిస్తే రిసెప్షన్ వద్దకు వస్తారు.',
        'వెయిటింగ్ ఏరియా నుండి తిరిగి రిసెప్షన్‌కు వెళ్ళండి.',
        'వెనక్కి రిసెప్షన్‌కు వెళ్ళండి.',
        'మెయిన్ లాబీ బోర్డు'
      ),
    },
  },
  {
    id: 'reception-lift',
    from: 'reception',
    to: 'lift',
    weightMeters: 48,
    estimatedMinutes: 2,
    viaStairs: false,
    forward: {
      en: makeStep(
        'Take the west lobby bypass corridor directly from Reception (~48 m, step-free detour) to the Accessible Lift.',
        'Walk left along the wide ground bypass corridor from Reception straight to the Accessible Lift.',
        'Use West Bypass to Accessible Lift.',
        'West Courtyard Ramp Sign'
      ),
      kn: makeStep(
        'ನಿರೀಕ್ಷಣಾ ಹಾಲ್ ಬದಲು ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಎಡಗಡೆಯ ಸಮತಟ್ಟಾದ ಬೈಪಾಸ್ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ 48 ಮೀಟರ್ ನಡೆದು ಸುಲಭ ಲಿಫ್ಟ್ ತಲುಪಿ.',
        'ಸ್ವಾಗತ ಕೇಂದ್ರದಿಂದ ಎಡಭಾಗದ ವಿಶಾಲ ಬೈಪಾಸ್ ದಾರಿಯಲ್ಲಿ ನೇರವಾಗಿ ಸುಲಭ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗಿ.',
        'ಎಡ ಬೈಪಾಸ್ ದಾರಿಯಲ್ಲಿ ಲಿಫ್ಟ್‌ಗೆ ಹೋಗಿ.',
        'ಪಶ್ಚಿಮ ಕಾರಿಡಾರ್ ಫಲಕ'
      ),
      te: makeStep(
        'వెయిటింగ్ హాల్ బదులుగా రిసెప్షన్ నుండి ఎడమవైపు ఉన్న సమతల బైపాస్ కారిడార్‌లో 48 మీటర్లు నడిచి యాక్సెసిబుల్ లిఫ్ట్‌కు చేరుకోండి.',
        'రిసెప్షన్ నుండి ఎడమవైపు ఉన్న మెట్లు లేని బైపాస్ దారిలో నేరుగా లిఫ్ట్ వద్దకు వెళ్ళండి.',
        'ఎడమ బైపాస్ దారిలో లిఫ్ట్‌కు వెళ్ళండి.',
        'వెస్ట్ బైపాస్ బోర్డు'
      ),
    },
    reverse: {
      en: makeStep(
        'Walk along the ground west bypass corridor (~48 m, step-free) from the Accessible Lift back to Reception.',
        'Take the flat west ground corridor from the Accessible Lift directly back to Reception.',
        'Use West Bypass back to Reception.',
        'Reception Help Desk'
      ),
      kn: makeStep(
        'ಸುಲಭ ಲಿಫ್ಟ್‌ನಿಂದ ಪಶ್ಚಿಮ ಸಮತಟ್ಟಾದ ಬೈಪಾಸ್ ದಾರಿಯ ಮೂಲಕ 48 ಮೀಟರ್ ನಡೆದು ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಬನ್ನಿ.',
        'ಲಿಫ್ಟ್‌ನಿಂದ ಬಲಗಡೆಯ ಸಮತಟ್ಟಾದ ದಾರಿಯಲ್ಲಿ ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಬನ್ನಿ.',
        'ಸ್ವಾಗತ ಕೇಂದ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
        'ಸ್ವಾಗತ ಡೆಸ್ಕ್'
      ),
      te: makeStep(
        'లిఫ్ట్ నుండి పడమటి బైపాస్ కారిడార్ ద్వారా 48 మీటర్లు నడిచి రిసెప్షన్ వద్దకు రండి.',
        'లిఫ్ట్ నుండి సమతల బైపాస్ దారిలో నేరుగా రిసెప్షన్‌కు రండి.',
        'రిసెప్షన్‌కు తిరిగి రండి.',
        'రిసెప్షన్ డెస్క్'
      ),
    },
  },
  {
    id: 'registration-pharmacy',
    from: 'registration',
    to: 'pharmacy',
    weightMeters: 18,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'From Registration Counter, continue straight north (~18 m) along the east wall to Pharmacy.',
        'Walk forward past Registration along the right wall to reach the Pharmacy.',
        'Walk forward to Pharmacy.',
        'Green Dispensary Sign'
      ),
      kn: makeStep(
        'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಿಂದ ಪೂರ್ವ ಗೋಡೆಯ ಪಕ್ಕದಲ್ಲಿ ನೇರವಾಗಿ 18 ಮೀಟರ್ ನಡೆದರೆ ಔಷಧಾಲಯ ಸಿಗುತ್ತದೆ.',
        'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಿಂದ ಮುಂದಕ್ಕೆ ನಡೆದರೆ ಔಷಧಾಲಯ ತಲುಪುತ್ತೀರಿ.',
        'ಮುಂದಕ್ಕೆ ಔಷಧಾಲಯಕ್ಕೆ ನಡೆಯಿರಿ.',
        'ಹಸಿರು ಔಷಧಾಲಯ ಫಲಕ'
      ),
      te: makeStep(
        'రిజిస్ట్రేషన్ కౌంటర్ నుండి తూర్పు గోడ వెంబడి 18 మీటర్లు ముందుకు నడిస్తే ఫార్మసీ వస్తుంది.',
        'రిజిస్ట్రేషన్ నుండి ముందుకు నడిస్తే ఫార్మసీ వస్తుంది.',
        'ముందుకు ఫార్మసీకి వెళ్ళండి.',
        'ఆకుపచ్చ ఫార్మసీ బోర్డు'
      ),
    },
    reverse: {
      en: makeStep(
        'Walk south from Pharmacy (~18 m) along the east corridor back to the Registration Counter.',
        'Walk back from Pharmacy along the east wall to Registration.',
        'Walk back to Registration.',
        'Token Windows'
      ),
      kn: makeStep(
        'ಔಷಧಾಲಯದಿಂದ ಹಿಂದಕ್ಕೆ 18 ಮೀಟರ್ ನಡೆದರೆ ನೋಂದಣಿ ಕೌಂಟರ್ ಸಿಗುತ್ತದೆ.',
        'ಔಷಧಾಲಯದಿಂದ ಹಿಂದಕ್ಕೆ ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ಬನ್ನಿ.',
        'ಹಿಂದೆ ನೋಂದಣಿ ಕೌಂಟರ್‌ಗೆ ಹೋಗಿ.',
        'ಟೋಕನ್ ಕಿಟಕಿ'
      ),
      te: makeStep(
        'ఫార్మసీ నుండి వెనక్కి 18 మీటర్లు నడిస్తే రిజిస్ట్రేషన్ కౌంటర్ వస్తుంది.',
        'ఫార్మసీ నుండి వెనక్కి రిజిస్ట్రేషన్‌కు వెళ్ళండి.',
        'వెనక్కి రిజిస్ట్రేషన్‌కు రండి.',
        'టోకెన్ కౌంటర్'
      ),
    },
  },
  {
    id: 'waiting-pharmacy',
    from: 'waiting',
    to: 'pharmacy',
    weightMeters: 28,
    estimatedMinutes: 2,
    viaStairs: false,
    forward: {
      en: makeStep(
        'From the Waiting Area, follow the step-free east corridor (~28 m) to the Pharmacy counter.',
        'Walk right from the Waiting Area along the flat hall to reach the Pharmacy.',
        'Walk right to Pharmacy.',
        'Dispensary Queue Rail'
      ),
      kn: makeStep(
        'ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶದಿಂದ ಬಲಕ್ಕೆ ಸಮತಟ್ಟಾದ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ 28 ಮೀಟರ್ ನಡೆದರೆ ಔಷಧಾಲಯ ತಲುಪುತ್ತೀರಿ.',
        'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದಿಂದ ಬಲಕ್ಕೆ ನೇರವಾಗಿ ನಡೆದರೆ ಔಷಧಾಲಯ ಸಿಗುತ್ತದೆ.',
        'ಬಲಕ್ಕೆ ಔಷಧಾಲಯಕ್ಕೆ ನಡೆಯಿರಿ.',
        'ಔಷಧ ವಿತರಣಾ ಕೌಂಟರ್'
      ),
      te: makeStep(
        'వెయిటింగ్ ఏరియా నుండి కుడివైపు ఉన్న సమతల కారిడార్‌లో 28 మీటర్లు నడిస్తే ఫార్మసీ వస్తుంది.',
        'వెయిటింగ్ ఏరియా నుండి కుడివైపు నేరుగా వెళితే ఫార్మసీ వస్తుంది.',
        'కుడివైపు ఫార్మసీకి వెళ్ళండి.',
        'మందుల కౌంటర్'
      ),
    },
    reverse: {
      en: makeStep(
        'From Pharmacy, walk west along the level hall (~28 m) into the central Waiting Area.',
        'Walk left from Pharmacy along the ground hall back to Waiting Area.',
        'Walk left to Waiting Area.',
        'Central Seating'
      ),
      kn: makeStep(
        'ಔಷಧಾಲಯದಿಂದ ಎಡಕ್ಕೆ 28 ಮೀಟರ್ ನಡೆದರೆ ಕೇಂದ್ರ ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶಕ್ಕೆ ಬರುತ್ತೀರಿ.',
        'ಔಷಧಾಲಯದಿಂದ ಎಡಕ್ಕೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ನಡೆಯಿರಿ.',
        'ಎಡಕ್ಕೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ.',
        'ಮಧ್ಯದ ಆಸನಗಳು'
      ),
      te: makeStep(
        'ఫార్మసీ నుండి ఎడమవైపు 28 మీటర్లు నడిస్తే వెయిటింగ్ ఏరియాలోకి చేరుకుంటారు.',
        'ఫార్మసీ నుండి ఎడమవైపు వెయిటింగ్ ఏరియాకు రండి.',
        'ఎడమవైపు వెయిటింగ్ ఏరియాకు వెళ్ళండి.',
        'కూర్చునే ప్రదేశం'
      ),
    },
  },
  {
    id: 'waiting-lift',
    from: 'waiting',
    to: 'lift',
    weightMeters: 20,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'From the Waiting Area, turn left along the wide step-free corridor (~20 m) to the Accessible Lift.',
        'Turn left from the Waiting Area to reach the Accessible Lift.',
        'Turn left to Accessible Lift.',
        'Sage-Green Lift Sign'
      ),
      kn: makeStep(
        'ನಿರೀಕ್ಷಣಾ ಪ್ರದೇಶದಿಂದ ಎಡಕ್ಕೆ ತಿರುಗಿ ವಿಶಾಲ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ 20 ಮೀಟರ್ ನಡೆದರೆ ಸುಲಭ ಲಿಫ್ಟ್ ಸಿಗುತ್ತದೆ.',
        'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದಿಂದ ಎಡಕ್ಕೆ ನಡೆದರೆ ಸುಲಭ ಲಿಫ್ಟ್ ತಲುಪುತ್ತೀರಿ.',
        'ಎಡಕ್ಕೆ ಲಿಫ್ಟ್ ಹತ್ತಿರ ಹೋಗಿ.',
        'ಹಸಿರು ಲಿಫ್ಟ್ ಫಲಕ'
      ),
      te: makeStep(
        'వెయిటింగ్ ఏరియా నుండి ఎడమవైపు తిరిగి 20 మీటర్లు నడిస్తే యాక్సెసిబుల్ లిఫ్ట్ వస్తుంది.',
        'వెయిటింగ్ ఏరియా నుండి ఎడమవైపు లిఫ్ట్ వద్దకు వెళ్ళండి.',
        'ఎడమవైపు లిఫ్ట్‌కు వెళ్ళండి.',
        'ఆకుపచ్చ లిఫ్ట్ బోర్డు'
      ),
    },
    reverse: {
      en: makeStep(
        'Step out at Ground Floor from the Lift and walk right (~20 m) to the Waiting Area.',
        'Walk right from the Lift doors to reach the central Waiting Area.',
        'Walk right to Waiting Area.',
        'Seating Hall'
      ),
      kn: makeStep(
        'ನೆಲ ಮಹಡಿಯಲ್ಲಿ ಲಿಫ್ಟ್‌ನಿಂದ ಹೊರಬಂದು ಬಲಕ್ಕೆ 20 ಮೀಟರ್ ನಡೆದರೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳ ಸಿಗುತ್ತದೆ.',
        'ಲಿಫ್ಟ್‌ನಿಂದ ಬಲಕ್ಕೆ ನಡೆದರೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಬರುತ್ತೀರಿ.',
        'ಬಲಕ್ಕೆ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಹೋಗಿ.',
        'ವಿಶ್ರಾಂತಿ ಹಾಲ್'
      ),
      te: makeStep(
        'గ్రౌండ్ ఫ్లోర్‌లో లిఫ్ట్ నుండి బయటకు వచ్చి కుడివైపు 20 మీటర్లు నడిస్తే వెయిటింగ్ ఏరియా వస్తుంది.',
        'లిఫ్ట్ నుండి కుడివైపు వెయిటింగ్ ఏరియాకు రండి.',
        'కుడివైపు వెయిటింగ్ ఏరియాకు వెళ్ళండి.',
        'వెయిటింగ్ హాల్'
      ),
    },
  },
  {
    id: 'lift-vertical',
    from: 'lift',
    to: 'lift-upper',
    weightMeters: 10,
    estimatedMinutes: 1,
    viaStairs: false,
    isLiftRide: true,
    forward: {
      en: makeStep(
        'Take the Accessible Lift one level up to Level 1 (Diagnostic Wing). Doors open step-free.',
        'Take the Accessible Lift up to Level 1 Diagnostic Wing — no stairs needed.',
        'Ride Lift up to Level 1.',
        'Lift Level 1 Audio Chime'
      ),
      kn: makeStep(
        'ಸುಲಭ ಲಿಫ್ಟ್ ಒಳಗೆ ಹೋಗಿ "Level 1" ಒತ್ತಿರಿ. ಮೇಲಿನ ಪರೀಕ್ಷಾ ವಿಭಾಗದಲ್ಲಿ ಬಾಗಿಲು ತೆರೆಯುತ್ತದೆ.',
        'ಮೆಟ್ಟಿಲು ಹತ್ತದೆ ಲಿಫ್ಟ್ ಮೂಲಕ 1ನೇ ಮಹಡಿಗೆ (Level 1) ಹೋಗಿ.',
        'ಲಿಫ್ಟ್‌ನಲ್ಲಿ 1ನೇ ಮಹಡಿಗೆ ಹೋಗಿ.',
        'ಲಿಫ್ಟ್ Level 1 ಧ್ವನಿ ಸೂಚನೆ'
      ),
      te: makeStep(
        'యాక్సెసిబుల్ లిఫ్ట్ ఎక్కి "Level 1" బటన్ నొక్కండి. మెట్లు లేకుండా పై విభాగానికి చేరుకుంటారు.',
        'మెట్లు ఎక్కకుండా లిఫ్ట్‌లో 1వ అంతస్తుకు (Level 1) వెళ్ళండి.',
        'లిఫ్ట్‌లో పై అంతస్తుకు వెళ్ళండి.',
        'లిఫ్ట్ Level 1 సూచన'
      ),
    },
    reverse: {
      en: makeStep(
        'Take the Accessible Lift down one level to Ground Lobby (Waiting & Reception level).',
        'Ride the Accessible Lift down to Ground Lobby — step-free.',
        'Ride Lift down to Ground.',
        'Ground Lobby Chime'
      ),
      kn: makeStep(
        'ಸುಲಭ ಲಿಫ್ಟ್‌ನಲ್ಲಿ "Ground" ಒತ್ತಿ ನೆಲ ಮಹಡಿಗೆ ಕೆಳಗೆ ಬನ್ನಿ.',
        'ಲಿಫ್ಟ್ ಮೂಲಕ ನೆಲ ಮಹಡಿಗೆ ಕೆಳಗೆ ಬನ್ನಿ.',
        'ಲಿಫ್ಟ್‌ನಲ್ಲಿ ಕೆಳಗೆ ಬನ್ನಿ.',
        'ನೆಲ ಮಹಡಿ ಸೂಚನೆ'
      ),
      te: makeStep(
        'యాక్సెసిబుల్ లిఫ్ట్‌లో "Ground" నొక్కి క్రింది లాబీకి రండి.',
        'లిఫ్ట్‌లో గ్రౌండ్ ఫ్లోర్‌కు క్రిందికి రండి.',
        'లిఫ్ట్‌లో క్రిందికి రండి.',
        'గ్రౌండ్ ఫ్లోర్ సూచన'
      ),
    },
  },
  {
    id: 'lift-upper-radiology',
    from: 'lift-upper',
    to: 'radiology',
    weightMeters: 16,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'Exit the Lift at Level 1 and turn left along the level corridor (~16 m) into Radiology.',
        'Step out of the Lift and turn left to enter the Radiology Department.',
        'Turn left to Radiology.',
        'CT / X-Ray Sign'
      ),
      kn: makeStep(
        'ಮೇಲಿನ ಲಿಫ್ಟ್‌ನಿಂದ ಹೊರಬಂದು ಎಡಕ್ಕೆ ತಿರುಗಿ 16 ಮೀಟರ್ ನಡೆದರೆ ರೇಡಿಯಾಲಜಿ ವಿಭಾಗ ಸಿಗುತ್ತದೆ.',
        'ಲಿಫ್ಟ್‌ನಿಂದ ಹೊರಬಂದು ಎಡಕ್ಕೆ ನಡೆದರೆ ರೇಡಿಯಾಲಜಿ ವಿಭಾಗ ತಲುಪುತ್ತೀರಿ.',
        'ಎಡಕ್ಕೆ ರೇಡಿಯಾಲಜಿಗೆ ಹೋಗಿ.',
        'CT / X-Ray ಫಲಕ'
      ),
      te: makeStep(
        'పై అంతస్తులో లిఫ్ట్ నుండి బయటకు వచ్చి ఎడమవైపు 16 మీటర్లు నడిస్తే రేడియాలజీ వస్తుంది.',
        'లిఫ్ట్ నుండి ఎడమవైపు తిరిగితే రేడియాలజీ విభాగం వస్తుంది.',
        'ఎడమవైపు రేడియాలజీకి వెళ్ళండి.',
        'CT / X-Ray బోర్డు'
      ),
    },
    reverse: {
      en: makeStep(
        'Leave Radiology and walk right along the flat Level 1 hall (~16 m) to the Accessible Lift.',
        'Turn right out of Radiology to reach the Accessible Lift doors.',
        'Walk right to Lift.',
        'Lift Landing'
      ),
      kn: makeStep(
        'ರೇಡಿಯಾಲಜಿಯಿಂದ ಹೊರಬಂದು ಬಲಕ್ಕೆ 16 ಮೀಟರ್ ನಡೆದರೆ ಸುಲಭ ಲಿಫ್ಟ್ ಸಿಗುತ್ತದೆ.',
        'ರೇಡಿಯಾಲಜಿಯಿಂದ ಬಲಕ್ಕೆ ನಡೆದು ಲಿಫ್ಟ್ ಹತ್ತಿರ ಬನ್ನಿ.',
        'ಬಲಕ್ಕೆ ಲಿಫ್ಟ್ ಹತ್ತಿರ ಹೋಗಿ.',
        'ಲಿಫ್ಟ್ ದ್ವಾರ'
      ),
      te: makeStep(
        'రేడియాలజీ నుండి బయటకు వచ్చి కుడివైపు 16 మీటర్లు నడిస్తే యాక్సెసిబుల్ లిఫ్ట్ వస్తుంది.',
        'రేడియాలజీ నుండి కుడివైపు లిఫ్ట్ వద్దకు రండి.',
        'కుడివైపు లిఫ్ట్‌కు వెళ్ళండి.',
        'లిఫ్ట్ తలుపు'
      ),
    },
  },
  {
    id: 'lift-upper-laboratory',
    from: 'lift-upper',
    to: 'laboratory',
    weightMeters: 20,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'Exit the Lift at Level 1 and turn right along the flat Level 1 hall (~20 m) to the Laboratory.',
        'Step out of the Lift and turn right to reach the Laboratory.',
        'Turn right to Laboratory.',
        'Sample Collection Desk'
      ),
      kn: makeStep(
        'ಮೇಲಿನ ಲಿಫ್ಟ್‌ನಿಂದ ಹೊರಬಂದು ಬಲಕ್ಕೆ ತಿರುಗಿ 20 ಮೀಟರ್ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ (Laboratory) ಸಿಗುತ್ತದೆ.',
        'ಲಿಫ್ಟ್‌ನಿಂದ ಬಲಕ್ಕೆ ತಿರುಗಿ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ ತಲುಪುತ್ತೀರಿ.',
        'ಬಲಕ್ಕೆ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಹೋಗಿ.',
        'ಮಾದರಿ ಸಂಗ್ರಹ ಡೆಸ್ಕ್'
      ),
      te: makeStep(
        'లిఫ్ట్ నుండి బయటకు వచ్చి కుడివైపు 20 మీటర్లు నడిస్తే ల్యాబొరేటరీ వస్తుంది.',
        'లిఫ్ట్ నుండి కుడివైపు నడిస్తే ల్యాబ్ వస్తుంది.',
        'కుడివైపు ల్యాబ్‌కు వెళ్ళండి.',
        'శాంపిల్ కలెక్షన్ డెస్క్'
      ),
    },
    reverse: {
      en: makeStep(
        'From the Laboratory, walk west along the Level 1 corridor (~20 m) to the Accessible Lift.',
        'Walk left from the Laboratory to reach the Accessible Lift doors.',
        'Walk left to Lift.',
        'Lift Landing'
      ),
      kn: makeStep(
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ಎಡಕ್ಕೆ 20 ಮೀಟರ್ ನಡೆದರೆ ಸುಲಭ ಲಿಫ್ಟ್ ಬಾಗಿಲು ಸಿಗುತ್ತದೆ.',
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ಎಡಕ್ಕೆ ನಡೆದರೆ ಲಿಫ್ಟ್ ಹತ್ತಿರ ಬರುತ್ತೀರಿ.',
        'ಎಡಕ್ಕೆ ಲಿಫ್ಟ್ ಹತ್ತಿರ ಹೋಗಿ.',
        'ಲಿಫ್ಟ್ ದ್ವಾರ'
      ),
      te: makeStep(
        'ల్యాబ్ నుండి ఎడమవైపు 20 మీటర్లు నడిస్తే యాక్సెసిబుల్ లిఫ్ట్ వస్తుంది.',
        'ల్యాబ్ నుండి ఎడమవైపు లిఫ్ట్ వద్దకు వెళ్ళండి.',
        'ఎడమవైపు లిఫ్ట్‌కు వెళ్ళండి.',
        'లిఫ్ట్ ద్వారం'
      ),
    },
  },
  {
    id: 'waiting-west-stairs',
    from: 'waiting',
    to: 'west-stairs',
    weightMeters: 12,
    estimatedMinutes: 1,
    viaStairs: true,
    forward: {
      en: makeStep(
        'From Waiting Area, walk left toward Stairwell A (~12 m) and climb 8 short stairs to Level 1.',
        'Take the central stairs near the Waiting Area up to Level 1.',
        'Go up Central Stairs.',
        'Staircase Handrail'
      ),
      kn: makeStep(
        'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದಿಂದ ಎಡಕ್ಕೆ ಇರುವ ಕೇಂದ್ರ ಮೆಟ್ಟಿಲುಗಳ (8 ಮೆಟ್ಟಿಲು) ಮೂಲಕ 1ನೇ ಮಹಡಿಗೆ ಹತ್ತಿರಿ.',
        'ನಿರೀಕ್ಷಣಾ ಸ್ಥಳದ ಹತ್ತಿರದ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಹತ್ತಿ ಮೇಲಕ್ಕೆ ಹೋಗಿ.',
        'ಕೇಂದ್ರ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಹತ್ತಿ.',
        'ಮೆಟ್ಟಿಲು ಹಿಡಿಕೆ'
      ),
      te: makeStep(
        'వెయిటింగ్ ఏరియా వద్ద ఉన్న మధ్య మెట్ల (8 మెట్లు) ద్వారా 1వ అంతస్తుకు ఎక్కండి.',
        'వెయిటింగ్ ఏరియా ప్రక్కనే ఉన్న మెట్లపైకి ఎక్కండి.',
        'మధ్య మెట్లు ఎక్కండి.',
        'మెట్ల హ్యాండ్‌రెయిల్'
      ),
    },
    reverse: {
      en: makeStep(
        'Walk carefully down the 8 steps of Stairwell A into the Ground Waiting Area.',
        'Go carefully down the central stairs into the Waiting Area.',
        'Go down Stairs to Waiting Area.',
        'Waiting Hall'
      ),
      kn: makeStep(
        'ಕೇಂದ್ರ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಕೆಳಗಿಳಿದು ನೆಲ ಮಹಡಿಯ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಬನ್ನಿ.',
        'ಮೆಟ್ಟಿಲುಗಳ ಮೂಲಕ ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಕೆಳಗೆ ಇಳಿಯಿರಿ.',
        'ಮೆಟ್ಟಿಲು ಇಳಿದು ನಿರೀಕ್ಷಣಾ ಸ್ಥಳಕ್ಕೆ ಬನ್ನಿ.',
        'ನಿರೀಕ್ಷಣಾ ಹಾಲ್'
      ),
      te: makeStep(
        'మధ్య మెట్లను జాగ్రత్తగా క్రిందికి దిగి గ్రౌండ్ వెయిటింగ్ ఏరియాలోకి రండి.',
        'మెట్ల ద్వారా క్రిందికి వెయిటింగ్ ఏరియాకు దిగండి.',
        'మెట్లు దిగి వెయిటింగ్ ఏరియాకు రండి.',
        'వెయిటింగ్ హాల్'
      ),
    },
  },
  {
    id: 'west-stairs-radiology',
    from: 'west-stairs',
    to: 'radiology',
    weightMeters: 16,
    estimatedMinutes: 1,
    viaStairs: true,
    forward: {
      en: makeStep(
        'At the top of Stairwell A, turn left and walk ~16 m into Radiology.',
        'After the stairs, turn left to enter Radiology.',
        'Turn left to Radiology.',
        'Radiology Reception'
      ),
      kn: makeStep(
        'ಮೆಟ್ಟಿಲು ಹತ್ತಿದ ನಂತರ ಎಡಕ್ಕೆ ತಿರುಗಿ 16 ಮೀಟರ್ ನಡೆದರೆ ರೇಡಿಯಾಲಜಿ ವಿಭಾಗ ಸಿಗುತ್ತದೆ.',
        'ಮೆಟ್ಟಿಲಿನ ನಂತರ ಎಡಕ್ಕೆ ತಿರುಗಿದರೆ ರೇಡಿಯಾಲಜಿ ಸಿಗುತ್ತದೆ.',
        'ಎಡಕ್ಕೆ ರೇಡಿಯಾಲಜಿಗೆ ಹೋಗಿ.',
        'ರೇಡಿಯಾಲಜಿ ದ್ವಾರ'
      ),
      te: makeStep(
        'మెట్లు ఎక్కిన తర్వాత ఎడమవైపు తిరిగి 16 మీటర్లు నడిస్తే రేడియాలజీ విభాగం వస్తుంది.',
        'మెట్ల తర్వాత ఎడమవైపు తిరిగితే రేడియాలజీ వస్తుంది.',
        'ఎడమవైపు రేడియాలజీకి వెళ్ళండి.',
        'రేడియాలజీ గేటు'
      ),
    },
    reverse: {
      en: makeStep(
        'Exit Radiology toward the central staircase landing (~16 m).',
        'Walk out of Radiology toward Stairwell A.',
        'Walk to Central Stairs.',
        'Stairwell A'
      ),
      kn: makeStep(
        'ರೇಡಿಯಾಲಜಿಯಿಂದ ಹೊರಬಂದು ಬಲಕ್ಕೆ 16 ಮೀಟರ್ ನಡೆದರೆ ಕೇಂದ್ರ ಮೆಟ್ಟಿಲು ತಲುಪುತ್ತೀರಿ.',
        'ರೇಡಿಯಾಲಜಿಯಿಂದ ಮೆಟ್ಟಿಲುಗಳ ಹತ್ತಿರ ನಡೆಯಿರಿ.',
        'ಮೆಟ್ಟಿಲುಗಳ ಹತ್ತಿರ ಹೋಗಿ.',
        'ಮೆಟ್ಟಿಲು ದಾರಿ'
      ),
      te: makeStep(
        'రేడియాలజీ నుండి బయటకు వచ్చి కుడివైపు నడిస్తే మధ్య మెట్లు వస్తాయి.',
        'రేడియాలజీ నుండి మెట్ల వద్దకు వెళ్ళండి.',
        'మెట్ల వద్దకు వెళ్ళండి.',
        'మధ్య మెట్లు'
      ),
    },
  },
  {
    id: 'west-stairs-laboratory',
    from: 'west-stairs',
    to: 'laboratory',
    weightMeters: 16,
    estimatedMinutes: 1,
    viaStairs: true,
    forward: {
      en: makeStep(
        'At the top of Stairwell A, walk straight ahead (~16 m) into the Laboratory.',
        'After the stairs, walk straight ahead to reach the Laboratory.',
        'Go straight to Laboratory.',
        'Lab Report Counter'
      ),
      kn: makeStep(
        'ಮೆಟ್ಟಿಲು ಹತ್ತಿದ ನಂತರ ನೇರವಾಗಿ 16 ಮೀಟರ್ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ ತಲುಪುತ್ತೀರಿ.',
        'ಮೆಟ್ಟಿಲಿನ ನಂತರ ನೇರವಾಗಿ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ ಸಿಗುತ್ತದೆ.',
        'ನೇರವಾಗಿ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಹೋಗಿ.',
        'ಲ್ಯಾಬ್ ಕೌಂಟರ್'
      ),
      te: makeStep(
        'మెట్లు ఎక్కిన తర్వాత నేరుగా 16 మీటర్లు నడిస్తే ల్యాబొరేటరీ వస్తుంది.',
        'మెట్ల తర్వాత నేరుగా నడిస్తే ల్యాబ్ వస్తుంది.',
        'నేరుగా ల్యాబ్‌కు వెళ్ళండి.',
        'ల్యాబ్ కౌంటర్'
      ),
    },
    reverse: {
      en: makeStep(
        'Walk left out of the Laboratory (~16 m) toward Stairwell A.',
        'Leave the Laboratory toward Stairwell A.',
        'Walk to Central Stairs.',
        'Stairwell A'
      ),
      kn: makeStep(
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ಹೊರಬಂದು ಕೇಂದ್ರ ಮೆಟ್ಟಿಲುಗಳ ಕಡೆಗೆ 16 ಮೀಟರ್ ನಡೆಯಿರಿ.',
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ಮೆಟ್ಟಿಲುಗಳ ಹತ್ತಿರ ಹೋಗಿ.',
        'ಮೆಟ್ಟಿಲು ಹತ್ತಿರ ಹೋಗಿ.',
        'ಮೆಟ್ಟಿಲು ದಾರಿ'
      ),
      te: makeStep(
        'ల్యాబ్ నుండి బయటకు వచ్చి మధ్య మెట్ల వద్దకు నడవండి.',
        'ల్యాబ్ నుండి మెట్ల వైపు వెళ్ళండి.',
        'మెట్ల వద్దకు వెళ్ళండి.',
        'మధ్య మెట్లు'
      ),
    },
  },
  {
    id: 'laboratory-consultation',
    from: 'laboratory',
    to: 'consultation',
    weightMeters: 26,
    estimatedMinutes: 1,
    viaStairs: false,
    forward: {
      en: makeStep(
        'From the Laboratory, continue east along the wide step-free Level 1 hall (~26 m) to Consultation Rooms.',
        'Walk straight right from the Laboratory along the flat hall to Consultation Rooms.',
        'Walk right to Consultation Rooms.',
        'Doctor Cabins 1–4'
      ),
      kn: makeStep(
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ಬಲಕ್ಕೆ ಸಮತಟ್ಟಾದ ಮಹಡಿ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ 26 ಮೀಟರ್ ನಡೆದರೆ ವೈದ್ಯರ ಸಮಾಲೋಚನಾ ಕೊಠಡಿಗಳು ಸಿಗುತ್ತವೆ.',
        'ಪ್ರಯೋಗಾಲಯದಿಂದ ನೇರವಾಗಿ ಬಲಕ್ಕೆ ನಡೆದರೆ ವೈದ್ಯರ ಕೊಠಡಿಗಳು ತಲುಪುತ್ತೀರಿ.',
        'ಬಲಕ್ಕೆ ವೈದ್ಯರ ಕೊಠಡಿಗಳಿಗೆ ಹೋಗಿ.',
        'ವೈದ್ಯರ ಕೊಠಡಿಗಳು 1–4'
      ),
      te: makeStep(
        'ల్యాబొరేటరీ నుండి కుడివైపు ఉన్న సమతల కారిడార్‌లో 26 మీటర్లు నడిస్తే కన్సల్టేషన్ గదులు వస్తాయి.',
        'ల్యాబ్ నుండి నేరుగా కుడివైపు వెళితే వైద్యుల గదులు వస్తాయి.',
        'కుడివైపు డాక్టర్ గదులకు వెళ్ళండి.',
        'డాక్టర్ గదులు 1–4'
      ),
    },
    reverse: {
      en: makeStep(
        'Leave Consultation Rooms and walk west along the flat Level 1 hall (~26 m) to the Laboratory.',
        'Walk left from Consultation Rooms along the flat hall to the Laboratory.',
        'Walk left to Laboratory.',
        'Blood Lab Hall'
      ),
      kn: makeStep(
        'ವೈದ್ಯರ ಕೊಠಡಿಗಳಿಂದ ಎಡಕ್ಕೆ 26 ಮೀಟರ್ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ ತಲುಪುತ್ತೀರಿ.',
        'ವೈದ್ಯರ ಕೊಠಡಿಯಿಂದ ಎಡಕ್ಕೆ ನಡೆದರೆ ಪ್ರಯೋಗಾಲಯ ಸಿಗುತ್ತದೆ.',
        'ಎಡಕ್ಕೆ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಹೋಗಿ.',
        'ರಕ್ತ ಪರೀಕ್ಷಾ ವಿಭಾಗ'
      ),
      te: makeStep(
        'కన్సల్టేషన్ గదుల నుండి ఎడమవైపు 26 మీటర్లు నడిస్తే ల్యాబొరేటరీ వస్తుంది.',
        'డాక్టర్ గదుల నుండి ఎడమవైపు ల్యాబ్‌కు రండి.',
        'ఎడమవైపు ల్యాబ్‌కు వెళ్ళండి.',
        'ల్యాబ్ కారిడార్'
      ),
    },
  },
  {
    id: 'pharmacy-east-stairs',
    from: 'pharmacy',
    to: 'east-stairs',
    weightMeters: 10,
    estimatedMinutes: 1,
    viaStairs: true,
    forward: {
      en: makeStep(
        'From the Pharmacy, take the East Staircase (~10 m) up 8 steps toward Consultation Rooms.',
        'Take the East Stairs right beside the Pharmacy up to Level 1.',
        'Go up East Stairs.',
        'East Stairwell'
      ),
      kn: makeStep(
        'ಔಷಧಾಲಯದ ಪಕ್ಕದ ಪೂರ್ವ ಮೆಟ್ಟಿಲುಗಳ ಮೂಲಕ 8 ಮೆಟ್ಟಿಲು ಹತ್ತಿ ಮೇಲಿನ ಕೊಠಡಿಗಳಿಗೆ ಹೋಗಿ.',
        'ಔಷಧಾಲಯದ ಹತ್ತಿರದ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಹತ್ತಿ ಮೇಲಕ್ಕೆ ಹೋಗಿ.',
        'ಪೂರ್ವ ಮೆಟ್ಟಿಲು ಹತ್ತಿ.',
        'ಪೂರ್ವ ಮೆಟ್ಟಿಲು ದ್ವಾರ'
      ),
      te: makeStep(
        'ఫార్మసీ పక్కన ఉన్న తూర్పు మెట్ల ద్వారా పైకి కన్సల్టేషన్ గదుల వైపు ఎక్కండి.',
        'ఫార్మసీ ప్రక్క మెట్ల ద్వారా పై అంతస్తుకు ఎక్కండి.',
        'తూర్పు మెట్లు ఎక్కండి.',
        'తూర్పు మెట్లు'
      ),
    },
    reverse: {
      en: makeStep(
        'Carefully walk down the East Staircase (~10 m) directly to the Ground Pharmacy counter.',
        'Go down the East Stairs right into the Pharmacy area.',
        'Go down East Stairs to Pharmacy.',
        'Pharmacy Counter'
      ),
      kn: makeStep(
        'ಪೂರ್ವ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಕೆಳಗಿಳಿದರೆ ನೇರವಾಗಿ ಔಷಧಾಲಯ ಸಿಗುತ್ತದೆ.',
        'ಮೆಟ್ಟಿಲು ಇಳಿದು ಔಷಧಾಲಯಕ್ಕೆ ಬನ್ನಿ.',
        'ಮೆಟ್ಟಿಲು ಇಳಿದು ಔಷಧಾಲಯಕ್ಕೆ ಹೋಗಿ.',
        'ಔಷಧಾಲಯ ಕೌಂಟರ್'
      ),
      te: makeStep(
        'తూర్పు మెట్లను క్రిందికి దిగితే నేరుగా ఫార్మసీ వస్తుంది.',
        'మెట్లు దిగి ఫార్మసీ వద్దకు రండి.',
        'మెట్లు దిగి ఫార్మసీకి వెళ్ళండి.',
        'ఫార్మసీ కౌంటర్'
      ),
    },
  },
  {
    id: 'east-stairs-consultation',
    from: 'east-stairs',
    to: 'consultation',
    weightMeters: 10,
    estimatedMinutes: 1,
    viaStairs: true,
    forward: {
      en: makeStep(
        'At the top of the East Staircase, step straight into Consultation Rooms (~10 m).',
        'At the top of the stairs, walk straight into the Consultation Rooms.',
        'Enter Consultation Rooms.',
        'Consultation Suite Door'
      ),
      kn: makeStep(
        'ಮೆಟ್ಟಿಲು ಹತ್ತಿದ ತಕ್ಷಣ ಎದುರಿನಲ್ಲಿಯೇ ವೈದ್ಯರ ಸಮಾಲೋಚನಾ ಕೊಠಡಿಗಳು ಇವೆ.',
        'ಮೆಟ್ಟಿಲಿನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ನೇರವಾಗಿ ವೈದ್ಯರ ಕೊಠಡಿಗಳಿಗೆ ಪ್ರವೇಶಿಸಿ.',
        'ವೈದ್ಯರ ಕೊಠಡಿಗಳಿಗೆ ಹೋಗಿ.',
        'ಸಮಾಲೋಚನಾ ಕೊಠಡಿ ದ್ವಾರ'
      ),
      te: makeStep(
        'మెట్లు ఎక్కిన వెంటనే ఎదురుగా కన్సల్టేషన్ గదులు ఉంటాయి.',
        'మెట్ల పైభాగంలో నేరుగా వైద్యుల గదుల్లోకి వెళ్ళండి.',
        'కన్సల్టేషన్ గదులకు వెళ్ళండి.',
        'డాక్టర్ గదుల ద్వారం'
      ),
    },
    reverse: {
      en: makeStep(
        'Exit Consultation Rooms toward the East Staircase landing (~10 m).',
        'Step out of Consultation Rooms to the East Staircase.',
        'Walk to East Stairs.',
        'East Stairwell'
      ),
      kn: makeStep(
        'ವೈದ್ಯರ ಕೊಠಡಿಗಳಿಂದ ಹೊರಬಂದು ಪೂರ್ವ ಮೆಟ್ಟಿಲುಗಳ ದ್ವಾರದ ಬಳಿ ಬನ್ನಿ.',
        'ವೈದ್ಯರ ಕೊಠಡಿಯಿಂದ ಪೂರ್ವ ಮೆಟ್ಟಿಲುಗಳ ಬಳಿ ಬನ್ನಿ.',
        'ಪೂರ್ವ ಮೆಟ್ಟಿಲು ಬಳಿ ಹೋಗಿ.',
        'ಪೂರ್ವ ಮೆಟ್ಟಿಲು'
      ),
      te: makeStep(
        'కన్సల్టేషన్ గదుల నుండి బయటకు వచ్చి తూర్పు మెట్ల వద్దకు రండి.',
        'డాక్టర్ గదుల నుండి తూర్పు మెట్ల వద్దకు వెళ్ళండి.',
        'తూర్పు మెట్ల వద్దకు వెళ్ళండి.',
        'తూర్పు మెట్లు'
      ),
    },
  },
];
