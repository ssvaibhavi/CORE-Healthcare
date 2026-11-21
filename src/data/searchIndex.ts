import { Language, PageView } from '../types';

export type SearchCategory = 'all' | 'modules' | 'preparation' | 'accessibility' | 'faq';

export interface SearchEntry {
  id: string;
  category: Exclude<SearchCategory, 'all'>;
  title: Record<Language, string>;
  description: Record<Language, string>;
  keywords: string;
  actionType: 'navigate' | 'settings' | 'language';
  targetPage?: PageView;
  targetLang?: Language;
}

export const CORE_SEARCH_ENTRIES: SearchEntry[] = [
  {
    id: 'smart-recovery',
    category: 'modules',
    title: {
      en: 'CORE Smart Recovery (Adaptive Route & Disruptions)',
      kn: 'CORE ಸ್ಮಾರ್ಟ್ ರಿಕವರಿ (ದಾರಿ ಬದಲಾವಣೆ ಮತ್ತು ಪರಿಹಾರ)',
      te: 'CORE స్మార్ట్ రికవరీ (దారి మార్పు & సహాయం)',
    },
    description: {
      en: 'Simulate lift closures, room changes, language barriers, dynamic route replanning, Explain My Options, and Teach-Back.',
      kn: 'ಲಿಫ್ಟ್ ಬಂದ್, ಕೊಠಡಿ ಬದಲಾವಣೆ, ಬದಲಿ ದಾರಿ ಲೆಕ್ಕ, ಆಯ್ಕೆ ವಿವರಣೆ ಮತ್ತು ಟೀಚ್-ಬ್ಯಾಕ್ ಪರಿಶೀಲನೆ.',
      te: 'లిఫ్ట్ ఆగిపోవడం, గది మార్పు, ప్రత్యామ్నాయ దారి, ఎంపికల వివరణ మరియు టీచ్-బ్యాక్ పరిశీలన.',
    },
    keywords: 'smart recovery disruption lift unavailable room changed route replanning teach back explain options delayed',
    actionType: 'navigate',
    targetPage: 'recovery',
  },
  {
    id: 'impact-lab',
    category: 'modules',
    title: {
      en: 'CORE Impact Lab (Live Usability & Workflow Comparison)',
      kn: 'CORE ಇಂಪ್ಯಾಕ್ಟ್ ಲ್ಯಾಬ್ (ಬಳಕೆ ಸುಲಭತೆಯ ಹೋಲಿಕೆ)',
      te: 'CORE ఇంపాక్ట్ ల్యాబ్ (వినియోగ పోలిక)',
    },
    description: {
      en: 'Compare unassisted hospital visits with guided adaptive CORE workflows alongside transparent live session counters.',
      kn: 'ಮಾರ್ಗದರ್ಶನವಿಲ್ಲದ ಭೇಟಿ ಮತ್ತು CORE ಪಯಣದ ನಡುವಿನ ವ್ಯತ್ಯಾಸ ಹಾಗೂ ಸೆಷನ್ ಅಂಕಿಅಂಶಗಳು.',
      te: 'సాధారణ సందర్శన మరియు CORE ప్రయాణం మధ్య పోలిక & లైవ్ సెషన్ కౌంటర్లు.',
    },
    keywords: 'impact lab metrics comparison usability analytics without core with core evaluation',
    actionType: 'navigate',
    targetPage: 'impact-lab',
  },
  {
    id: 'smart-navigator',
    category: 'modules',
    title: {
      en: 'CORE Smart Hospital Navigator (Floor Map & Journey)',
      kn: 'CORE ಸ್ಮಾರ್ಟ್ ಆಸ್ಪತ್ರೆ ನ್ಯಾವಿಗೇಟರ್ (ಮಹಡಿ ನಕ್ಷೆ)',
      te: 'CORE స్మార్ట్ హాస్పిటల్ నావిగేటర్ (ఫ్లోర్ మ్యాప్)',
    },
    description: {
      en: '5-stage guided visit journey, interactive floor map, step-free lift routing, Gentle Guidance Mode, and printable Navigation Card.',
      kn: '5-ಹಂತದ ಆಸ್ಪತ್ರೆ ಪಯಣ, ನಕ್ಷೆ, ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ದಾರಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್.',
      te: '5-దశల ఆసుపత్రి ప్రయాణం, ఫ్లోర్ మ్యాప్, మెట్లు లేని లిఫ్ట్ మార్గం మరియు నావిగేషన్ కార్డు.',
    },
    keywords: 'smart navigator hospital floor map directions radiology pharmacy lab lift accessible route gentle mode navigation card',
    actionType: 'navigate',
    targetPage: 'navigator',
  },
  {
    id: 'hear-appointment',
    category: 'modules',
    title: {
      en: 'Hear My Appointment',
      kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ',
      te: 'నా అపాయింట్‌మెంట్ వినండి',
    },
    description: {
      en: 'Listen to scheduled scan date, room number, and preparation notes aloud.',
      kn: 'ನಿಗದಿತ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ, ಕೊಠಡಿ ಮತ್ತು ಸೂಚನೆಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ.',
      te: 'మీ స్కాన్ తేదీ, గది నంబర్ మరియు సూచనలను వాయిస్‌లో వినండి.',
    },
    keywords: 'hear appointment audio voice listen date time room pin lookup scan confirm attendance',
    actionType: 'navigate',
    targetPage: 'appointment',
  },
  {
    id: 'care-journey',
    category: 'preparation',
    title: {
      en: 'My Care Journey & Smart Checklist',
      kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ ಮತ್ತು ಸಿದ್ಧತಾ ಪಟ್ಟಿ',
      te: 'నా ఆరోగ్య ప్రయాణం & తయారీ జాబితా',
    },
    description: {
      en: 'Before, During, and After visit timeline plus editable AI preparation checklists and printable summary.',
      kn: 'ಭೇಟಿಗೆ ಮುನ್ನ, ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರದ ಹಂತಗಳು ಹಾಗೂ ಸಿದ್ಧತಾ ಪಟ್ಟಿ.',
      te: 'సందర్శనకు ముందు, సమయంలో మరియు తర్వాత దశలు & తయారీ జాబితా.',
    },
    keywords: 'care journey timeline smart checklist before during after visit summary prepare hospital',
    actionType: 'navigate',
    targetPage: 'journey',
  },
  {
    id: 'clarity',
    category: 'preparation',
    title: {
      en: 'Explain It Simply (CORE Clarity AI)',
      kn: 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (CORE Clarity AI)',
      te: 'సులభంగా వివరించండి (CORE Clarity AI)',
    },
    description: {
      en: 'Translate confusing hospital jargon (NPO, Creatinine, Block B) into calm plain words.',
      kn: 'ಕಷ್ಟಕರ ಆಸ್ಪತ್ರೆ ಪದಗಳನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
      te: 'కష్టమైన ఆసుపత్రి పదాలను సులభ భాషలో అర్థం చేసుకోండి.',
    },
    keywords: 'explain simply clarity ai jargon sms npo creatinine fasting counter terminology simplify',
    actionType: 'navigate',
    targetPage: 'clarity',
  },
  {
    id: 'care-stories',
    category: 'modules',
    title: {
      en: 'Care Stories (Interactive Fictional Demos)',
      kn: 'ಆರೈಕೆ ಕಥೆಗಳು (ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪಯಣಗಳು)',
      te: 'కేర్ స్టోరీస్ (నమూనా ప్రయాణాలు)',
    },
    description: {
      en: 'Explore 3 fictional patient and caregiver stories showing how CORE adapts in real time.',
      kn: 'ಹಿರಿಯರು, ಮೊದಲ ಭೇಟಿಗಾರರು ಮತ್ತು ಆರೈಕೆದಾರರಿಗಾಗಿ 3 ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಪಯಣಗಳು.',
      te: 'వృద్ధులు, మొదటిసారి సందర్శకులు మరియు సంరక్షకుల కోసం 3 నమూనా కథలు.',
    },
    keywords: 'care stories personas older adult first time visitor caregiver adaptation demo story',
    actionType: 'navigate',
    targetPage: 'stories',
  },
  {
    id: 'carecircle',
    category: 'preparation',
    title: {
      en: 'CareCircle — Caregiver Support & Consent',
      kn: 'CareCircle — ಆರೈಕೆದಾರರ ನೆರವು ಮತ್ತು ಸಮ್ಮತಿ',
      te: 'CareCircle — సంరక్షకుల సహాయం & అనుమతి',
    },
    description: {
      en: 'Share non-clinical visit timing and checklist with a trusted family member only with consent.',
      kn: 'ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ಮಾತ್ರ ಕುಟುಂಬದವರಿಗೆ ಭೇಟಿ ವಿವರ ಹಂಚಿಕೊಳ್ಳಿ.',
      te: 'మీ అనుమతితో మాత్రమే కుటుంబ సభ్యులకు సందర్శన వివరాలు పంపండి.',
    },
    keywords: 'carecircle caregiver family member son daughter consent handoff share summary',
    actionType: 'navigate',
    targetPage: 'carecircle',
  },
  {
    id: 'visit-passport',
    category: 'preparation',
    title: {
      en: 'My Visit Passport (Printable Card)',
      kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್',
      te: 'నా విజిట్ పాస్‌పోర్ట్',
    },
    description: {
      en: 'Organize documents, questions for your doctor, and print or save a PDF travel card.',
      kn: 'ದಾಖಲೆಗಳು, ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಪ್ರಿಂಟ್ ಮಾಡಬಹುದಾದ ಕಾರ್ಡ್.',
      te: 'పత్రాలు, డాక్టర్‌ను అడగాల్సిన ప్రశ్నలు మరియు ప్రింట్ చేయగల కార్డు.',
    },
    keywords: 'visit passport print pdf card documents id referral questions doctor travel',
    actionType: 'navigate',
    targetPage: 'passport',
  },
  {
    id: 'reschedule',
    category: 'preparation',
    title: {
      en: 'Reschedule Appointment',
      kn: 'ದಿನಾಂಕ ಬದಲಾಯಿಸಿ',
      te: 'తేదీ మార్పు (Reschedule)',
    },
    description: {
      en: 'Pick a morning or afternoon hospital slot in 5 calm steps without repeated trips.',
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ಅಲೆದಾಡದೆ ಸುಲಭ 5 ಹಂತಗಳಲ್ಲಿ ಹೊಸ ದಿನಾಂಕ ಆರಿಸಿ.',
      te: 'ఆసుపత్రి చుట్టూ తిరగకుండా 5 దశల్లో కొత్త తేదీని ఎంచుకోండి.',
    },
    keywords: 'reschedule change date time slot morning afternoon transport travel bus',
    actionType: 'navigate',
    targetPage: 'reschedule',
  },
  {
    id: 'reminders',
    category: 'preparation',
    title: {
      en: 'Reminders & Voice Call Settings',
      kn: 'ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಧ್ವನಿ ಕರೆ ಸೆಟ್ಟಿಂಗ್ಸ್',
      te: 'రిమైండర్లు & వాయిస్ కాల్ సెట్టింగ్స్',
    },
    description: {
      en: 'Preview automated IVR voice calls, native SMS, WhatsApp cards, and reminder timing.',
      kn: 'ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಕರೆ, ಸ್ಥಳೀಯ SMS ಮತ್ತು ವಾಟ್ಸಾಪ್ ಜ್ಞಾಪನೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ.',
      te: 'వాయిస్ కాల్, తెలుగు SMS మరియు వాట్సాప్ రిమైండర్ డెమో చూడండి.',
    },
    keywords: 'reminders voice call ivr sms whatsapp notification alert caregiver',
    actionType: 'navigate',
    targetPage: 'reminders',
  },
  {
    id: 'intelligence',
    category: 'modules',
    title: {
      en: 'CORE Intelligence (Adaptive Pathway)',
      kn: 'CORE ಇಂಟೆಲಿಜೆನ್ಸ್ (ವೈಯಕ್ತಿಕ ಮಾರ್ಗ)',
      te: 'CORE ఇంటెలిజెన్స్ (వ్యక్తిగత దారి)',
    },
    description: {
      en: 'Answer 6 transparent navigation questions to reorder steps for first-time or caregiver visits.',
      kn: '೬ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಮಾರ್ಗದರ್ಶಿ ಪಡೆಯಿರಿ.',
      te: '6 సులభ ప్రశ్నలతో మీ వ్యక్తిగత ఆసుపత్రి దారిని పొందండి.',
    },
    keywords: 'intelligence adaptive pathway onboarding first visit personalization rules',
    actionType: 'navigate',
    targetPage: 'intelligence',
  },
  {
    id: 'voicebridge',
    category: 'accessibility',
    title: {
      en: 'CORE VoiceBridge (Speech Assistant)',
      kn: 'CORE ವಾಯ್ಸ್‌ಬ್ರಿಡ್ಜ್ (ಧ್ವನಿ ಸೇತು)',
      te: 'CORE వాయిస్‌బ್ರಿడ్జ్ (వాయిస్ సహాయం)',
    },
    description: {
      en: 'Speak or tap quick voice phrases in English, Kannada, or Telugu.',
      kn: 'ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಅಥವಾ ತೆಲುಗಿನಲ್ಲಿ ಮಾತನಾಡಿ ಸಹಾಯ ಪಡೆಯಿರಿ.',
      te: 'ఇంగ్లీష్, కన్నడ లేదా తెలుగులో మాట్లాడి సహాయం పొందండి.',
    },
    keywords: 'voicebridge microphone speech audio spoken voice recognition listen',
    actionType: 'navigate',
    targetPage: 'voicebridge',
  },
  {
    id: 'sense',
    category: 'modules',
    title: {
      en: 'CORE Sense (Teach-Back & Literacy Quiz)',
      kn: 'CORE ಸೆನ್ಸ್ (ತಿಳುವಳಿಕೆ ಮತ್ತು ರಸಪ್ರಶ್ನೆ)',
      te: 'CORE సెన్స్ (అవగాహన & క్విజ్)',
    },
    description: {
      en: 'Check understanding with gentle questions and a 5-step clinic visit flow.',
      kn: 'ಸರಳ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು 5-ಹಂತದ ಆಸ್ಪತ್ರೆ ಭೇಟಿ ಚಿತ್ರದೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಿ.',
      te: 'సులభమైన క్విజ్ మరియు 5-దశల ఆసుపత్రి ప్రక్రియను చూడండి.',
    },
    keywords: 'sense quiz teach back comprehension literacy steps clinic process',
    actionType: 'navigate',
    targetPage: 'sense',
  },
  {
    id: 'carecompass',
    category: 'preparation',
    title: {
      en: 'CORE CareCompass (.ics Calendar Export)',
      kn: 'CORE ಕೇರ್‌ಕಂಪಾಸ್ (ಕ್ಯಾಲೆಂಡರ್ ಉಳಿಸಿ)',
      te: 'CORE కేర్‌కంపాస్ (క్యాలెండర్ ఎగుమతి)',
    },
    description: {
      en: 'Manage visit documents and export a calendar reminder file (.ics).',
      kn: 'ಭೇಟಿಯ ಸಿದ್ಧತಾ ಪಟ್ಟಿ ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ (.ics) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
      te: 'సందర్శన జాబితా మరియు క్యాలెండర్ రిమైండర్ (.ics) డౌన్‌లోడ్ చేయండి.',
    },
    keywords: 'carecompass calendar ics export checklist readiness gauge',
    actionType: 'navigate',
    targetPage: 'carecompass',
  },
  {
    id: 'careflow',
    category: 'modules',
    title: {
      en: 'CORE CareFlow (Clinic Decision Guide)',
      kn: 'CORE ಕೇರ್‌ಫ್ಲೋ (ಆಸ್ಪತ್ರೆ ನಿರ್ಧಾರ ಮಾರ್ಗದರ್ಶಿ)',
      te: 'CORE కేర్‌ఫ్లో (ఆసుపత్రి నిర్ణయ వృక్షం)',
    },
    description: {
      en: 'Interactive step-by-step guidance if a queue is delayed or a counter is unclear.',
      kn: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ವಿಳಂಬವಾದರೆ ಅಥವಾ ಕೊಠಡಿ ತಿಳಿಯದಿದ್ದರೆ ಸರಳ ಪರಿಹಾರಗಳು.',
      te: 'ఆసుపత్రిలో ఆలస్యం లేదా గది సందేహం ఉంటే దశలవారీ సహాయం.',
    },
    keywords: 'careflow decision tree delayed missed counter help clinic confusion',
    actionType: 'navigate',
    targetPage: 'careflow',
  },
  {
    id: 'experience-settings',
    category: 'accessibility',
    title: {
      en: 'CORE Experience Settings (Comfort Mode)',
      kn: 'CORE ಅನುಭವ ಸೆಟ್ಟಿಂಗ್‌ಗಳು (ಕಂಫರ್ಟ್ ಮೋಡ್)',
      te: 'CORE ఎక్స్‌పీరియన్స్ సెట్టింగ్స్ (కంఫర్ట్ మోడ్)',
    },
    description: {
      en: 'Adjust text size, high contrast, Full Elegance / Gentle / No Motion, voice, and AI style.',
      kn: 'ಅಕ್ಷರ ಗಾತ್ರ, ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್, ಚಲನೆ ವೇಗ, ಧ್ವನಿ ಮತ್ತು AI ಸರಳತೆ ಹೊಂದಿಸಿ.',
      te: 'అక్షర సైజు, హై కాంట్రాస్ట్, యానిమేషన్, వాయిస్ మరియు AI శైలిని మార్చుకోండి.',
    },
    keywords: 'settings comfort mode text size font large contrast motion animation reduced voice guided complexity',
    actionType: 'settings',
  },
  {
    id: 'a11y-lab',
    category: 'accessibility',
    title: {
      en: 'Accessibility Lab (Compare UI Profiles)',
      kn: 'ಪ್ರವೇಶ್ಯತೆ ಪ್ರಯೋಗಾಲಯ (Accessibility Lab)',
      te: 'యాక్సెసిబిలిటీ ల్యాబ్ (Accessibility Lab)',
    },
    description: {
      en: 'Preview 5 elder-friendly and low-literacy interface configurations live.',
      kn: '5 ಹಿರಿಯ ಸ್ನೇಹಿ ಮತ್ತು ಸರಳ ಓದುವಿಕೆ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.',
      te: '5 యాక్సెసిబిలిటీ మరియు వృద్ధుల స్నేహపూర్వక మోడ్‌లను చూడండి.',
    },
    keywords: 'accessibility lab profiles vision motor literacy elder preview test',
    actionType: 'navigate',
    targetPage: 'accessibility-lab',
  },
  {
    id: 'lang-kn',
    category: 'accessibility',
    title: {
      en: 'Switch Language to Kannada (ಕನ್ನಡ)',
      kn: 'ಕನ್ನಡ ಭಾಷೆಗೆ ಬದಲಿಸಿ',
      te: 'భాషను కన్నడకు మార్చండి',
    },
    description: {
      en: 'Display the full CORE interface and voice support in Kannada.',
      kn: 'ಸಂಪೂರ್ಣ CORE ವೇದಿಕೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ ಮತ್ತು ಕೇಳಿ.',
      te: 'మొత్తం CORE వెబ్‌సైట్‌ను కన్నడ భాషలోకి మార్చుకోండి.',
    },
    keywords: 'kannada language ಕನ್ನಡ switch translate local script',
    actionType: 'language',
    targetLang: 'kn',
  },
  {
    id: 'lang-te',
    category: 'accessibility',
    title: {
      en: 'Switch Language to Telugu (తెలుగు)',
      kn: 'ತೆಲುಗು ಭಾಷೆಗೆ ಬದಲಿಸಿ',
      te: 'తెలుగు భాషలోకి మార్చండి',
    },
    description: {
      en: 'Display the full CORE interface and voice support in Telugu.',
      kn: 'ಸಂಪೂರ್ಣ CORE ವೇದಿಕೆಯನ್ನು ತೆಲುಗಿನಲ್ಲಿ ನೋಡಿ ಮತ್ತು ಕೇಳಿ.',
      te: 'మొత్తం CORE వెబ్‌సైట్‌ను తెలుగులో చూడండి మరియు వినండి.',
    },
    keywords: 'telugu language తెలుగు switch translate local script',
    actionType: 'language',
    targetLang: 'te',
  },
  {
    id: 'lang-en',
    category: 'accessibility',
    title: {
      en: 'Switch Language to English',
      kn: 'ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗೆ ಬದಲಿಸಿ',
      te: 'ఇంగ్లీష్ భాషలోకి మార్చండి',
    },
    description: {
      en: 'Display the full CORE interface and voice support in English.',
      kn: 'ಸಂಪೂರ್ಣ CORE ವೇದಿಕೆಯನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ನೋಡಿ.',
      te: 'మొత్తం CORE వెబ్‌సైట్‌ను ఇంగ్లీష్‌లో చూడండి.',
    },
    keywords: 'english language default switch',
    actionType: 'language',
    targetLang: 'en',
  },
  {
    id: 'faq-read',
    category: 'faq',
    title: {
      en: 'FAQ: What if I cannot read the hospital text?',
      kn: 'ಪ್ರಶ್ನೆ: ಪರದೆಯ ಮೇಲಿರುವ ಪದಗಳನ್ನು ಓದಲು ಆಗದಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?',
      te: 'ప్రశ్న: స్క్రీన్‌పై ఉన్న టెక్స్ట్ చదవలేకపోతే ఏమి చేయాలి?',
    },
    description: {
      en: 'Every key card includes spoken audio via Hear My Appointment & CORE VoiceBridge.',
      kn: 'ಪ್ರತಿ ಮಾಹಿತಿಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಲು ಸ್ಪೀಕರ್ ಬಟನ್ ಲಭ್ಯವಿದೆ.',
      te: 'ప్రతి వివరాలను వాయిస్‌లో వినడానికి స్పీకర్ బటన్ అందుబాటులో ఉంది.',
    },
    keywords: 'faq cannot read illiterate audio speaker button help desk asha',
    actionType: 'navigate',
    targetPage: 'help',
  },
  {
    id: 'faq-reschedule',
    category: 'faq',
    title: {
      en: 'FAQ: Can I reschedule without visiting the hospital?',
      kn: 'ಪ್ರಶ್ನೆ: ಆಸ್ಪತ್ರೆಗೆ ಹೋಗದೆ ದಿನಾಂಕ ಬದಲಾಯಿಸಬಹುದೇ?',
      te: 'ప్రశ్న: ఆసుపత్రికి వెళ్ళకుండా తేదీని మార్చుకోవచ్చా?',
    },
    description: {
      en: 'Yes — open Reschedule Appointment to view demo slots and change your date in 5 steps.',
      kn: 'ಹೌದು — ದಿನಾಂಕ ಬದಲಾವಣೆ ವಿಭಾಗದಲ್ಲಿ ಮನೆಯಿಂದಲೇ ಹೊಸ ಸಮಯ ಆರಿಸಬಹುದು.',
      te: 'అవును — తేదీ మార్పు పేజీలో ఇంటి నుండే కొత్త సమయాన్ని ఎంచుకోవచ్చు.',
    },
    keywords: 'faq reschedule without visiting hospital transport change date bus',
    actionType: 'navigate',
    targetPage: 'reschedule',
  },
  {
    id: 'staff-portal',
    category: 'modules',
    title: {
      en: 'Hospital Staff Dashboard (Demo)',
      kn: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣಾ ಫಲಕ (ಡೆಮೊ)',
      te: 'హాస్పిటల్ సిబ్బంది ప్యానెల్ (డెమో)',
    },
    description: {
      en: 'Outpatient radiology demonstration view for managing patient language & follow-up reminders.',
      kn: 'ರೋಗಿಗಳ ಭಾಷೆ ಮತ್ತು ಧ್ವನಿ ಕರೆಗಳನ್ನು ನಿರ್ವಹಿಸುವ ಸಿಬ್ಬಂದಿ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ.',
      te: 'రోగుల భాష మరియు రిమైండర్లను చూసే సిబ్బంది డెమో.',
    },
    keywords: 'staff hospital portal radiology clinic dashboard',
    actionType: 'navigate',
    targetPage: 'staff',
  },
];
