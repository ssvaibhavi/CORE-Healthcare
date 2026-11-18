import { CareCompassTask, ComfortSettings, Language, PageView } from '../types';

/* =========================================================
   FEATURE 3: CORE SENSE (Health Literacy & Understanding)
   ========================================================= */

export interface SenseModule {
  id: string;
  term: Record<Language, string>;
  category: Record<Language, string>;
  plainExplanation: Record<Language, string>;
  quizQuestion: Record<Language, string>;
  quizOptions: Array<{
    id: string;
    label: Record<Language, string>;
    isCorrect: boolean;
    feedback: Record<Language, string>;
  }>;
  teachBackPrompt: Record<Language, string>;
  teachBackKeywords: string[];
  referenceSummary: Record<Language, string>;
}

export const SENSE_MODULES: SenseModule[] = [
  {
    id: 'sense-registration',
    term: {
      kn: 'OPD Registration & Token Slip (ನೋಂದಣಿ ಚೀಟಿ)',
      te: 'OPD Registration & Token Slip (నమోదు చీటీ)',
      en: 'OPD Registration & Token Slip',
    },
    category: {
      kn: 'ಆಸ್ಪತ್ರೆ ದಾಖಲಾತಿ ಹಂತ',
      te: 'ఆసుపత్రి నమోదు దశ',
      en: 'Hospital Administrative Step',
    },
    plainExplanation: {
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ಬಂದ ನಂತರ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಗುರುತುಪಡಿಸಲು ಸ್ವಾಗತ ಕೌಂಟರ್‌ನಲ್ಲಿ ನೀಡುವ ಸರದಿ ಸಂಖ್ಯೆಯ ಚೀಟಿ. ಇದನ್ನು ತೋರಿಸಿದರೆ ಮಾತ್ರ ಸ್ಕ್ಯಾನ್ ಕೊಠಡಿಗೆ ಕರೆಯುತ್ತಾರೆ.',
      te: 'ఆసుపత్రికి వచ్చిన తర్వాత మీ పేరు నమోదు చేసి ఇచ్చే వరుస నంబర్ చీటీ. దీనిని చూపిస్తేనే మిమ్మల్ని స్కాన్ లేదా డాక్టర్ గదిలోకి పిలుస్తారు.',
      en: 'A queue number slip given at the front registration counter after arriving. Showing this slip lets the department desk call your name in order.',
    },
    quizQuestion: {
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ತಲುಪಿದ ತಕ್ಷಣ ನೀವು ಏನು ಮಾಡಬೇಕು?',
      te: 'ఆసుపత్రికి చేరుకున్న వెంటనే మీరు ఏమి చేయాలి?',
      en: 'What should you do right after arriving at the hospital?',
    },
    quizOptions: [
      {
        id: 'opt-wait',
        label: {
          kn: 'ಯಾರಿಗೂ ತಿಳಿಸದೆ ನೇರವಾಗಿ ಸ್ಕ್ಯಾನ್ ಯಂತ್ರದ ಬಳಿ ಕಾಯುವುದು',
          te: 'ఎవరికీ చెప్పకుండా నేరుగా స్కాన్ గది బయట కూర్చోవడం',
          en: 'Wait silently outside without checking in at the counter',
        },
        isCorrect: false,
        feedback: {
          kn: 'ಹಾಗೆ ಮಾಡಿದರೆ ನಿಮ್ಮ ಹೆಸರು ಸರದಿಯಲ್ಲಿ ದಾಖಲಾಗುವುದಿಲ್ಲ. ಮೊದಲು ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆಯಿರಿ.',
          te: 'అలా చేస్తే మీ పేరు నమోదు కాదు. ముందుగా రిజిస్ట్రేషన్ కౌంటర్‌లో టోకెన్ తీసుకోండి.',
          en: 'If you do not check in first, staff will not know you arrived. Always register at the desk for your token slip.',
        },
      },
      {
        id: 'opt-desk',
        label: {
          kn: 'ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ / ಚೀಟಿ ತೋರಿಸಿ ಟೋಕನ್ ಪಡೆಯುವುದು',
          te: 'రిజిస్ట్రేషన్ కౌంటర్ వద్ద విజిట్ పాస్‌పోర్ట్ / చీటీ చూపించి టోకెన్ తీసుకోవడం',
          en: 'Show my Visit Passport or referral slip at the registration desk for a token',
        },
        isCorrect: true,
        feedback: {
          kn: 'ಸರಿಯಾದ ಉತ್ತರ! ಮೊದಲು ಕೌಂಟರ್‌ನಲ್ಲಿ ಟೋಕನ್ ಪಡೆದರೆ ಸಿಬ್ಬಂದಿ ನಿಮ್ಮನ್ನು ಸುಲಭವಾಗಿ ಕರೆಯುತ್ತಾರೆ.',
          te: 'సరైన సమాధానం! ముందు టోకెన్ తీసుకుంటే సిబ్బంది మిమ్మల్ని సులభంగా పిలుస్తారు.',
          en: 'Exactly right! Checking in first gives you a queue token so staff know you are waiting.',
        },
      },
    ],
    teachBackPrompt: {
      kn: 'ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ಬರೆಯಿರಿ: ಆಸ್ಪತ್ರೆ ಗೇಟ್ ತಲುಪಿದ ಮೇಲೆ ನೀವು ಮೊದಲ ಕೆಲಸವಾಗಿ ಏನು ಮಾಡುತ್ತೀರಿ?',
      te: 'మీ సొంత మాటలలో రాయండి: ఆసుపత్రికి చేరుకున్న తర్వాత మీరు మొదటి పనిగా ఏమి చేస్తారు?',
      en: 'In your own words, what is the first administrative step you will take when reaching the hospital?',
    },
    teachBackKeywords: ['desk', 'counter', 'register', 'registration', 'token', 'slip', 'passport', 'check', 'show', 'ಕೌಂಟರ್', 'ಟೋಕನ್', 'ನೋಂದಣಿ', 'ಪಾಸ್', 'కౌంటర్', 'టోకెన్', 'నమోదు', 'చూపించి'],
    referenceSummary: {
      kn: 'ಆದರ್ಶ ಸಾರಾಂಶ: "ನಾನು ಸ್ವಾಗತ ಕೌಂಟರ್‌ನಲ್ಲಿ ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೋರಿಸಿ ಸರದಿ ಟೋಕನ್ ಪಡೆಯುತ್ತೇನೆ."',
      te: 'సరైన సారాంశం: "నేను రిజిస్ట్రేషన్ కౌంటర్ వద్ద నా పాస్‌పోర్ట్ చూపించి టోకెన్ తీసుకుంటాను."',
      en: 'Reference summary: "I will check in at the registration counter with my referral slip/Visit Passport to get a queue token."',
    },
  },
  {
    id: 'sense-reporting',
    term: {
      kn: 'Reporting Time vs Scan Time (ಹಾಜರಾತಿ ಸಮಯ)',
      te: 'Reporting Time vs Scan Time (హాజరు సమయం)',
      en: 'Reporting Time vs. Scan Time',
    },
    category: {
      kn: 'ಸಮಯದ ತಿಳುವಳಿಕೆ',
      te: 'సమయ అవగాహన',
      en: 'Scheduling Clarity',
    },
    plainExplanation: {
      kn: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಸಮಯ ಬೆಳಗ್ಗೆ ೧೦:೩೦ ಆಗಿದ್ದರೆ, ಹಾಜರಾತಿ ಸಮಯ ಬೆಳಗ್ಗೆ ೧೦:೦೦ ಗಂಟೆಯಾಗಿರುತ್ತದೆ. ಕಾಗದಪತ್ರ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಿದ್ಧತೆಗಾಗಿ ೩೦ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಬರಬೇಕು.',
      te: 'మీ స్కాన్ సమయం 10:30 అయితే, హాజరు సమయం 10:00 అవుతుంది. పత్రాల తనిఖీ మరియు ఏర్పాట్ల కోసం 30 నిమిషాల ముందే రావాలి.',
      en: 'Reporting time is usually 30 minutes before your actual scan slot so staff have calm time to verify your papers and prepare you.',
    },
    quizQuestion: {
      kn: 'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ 10:30 AM ಆಗಿದ್ದರೆ, ನೀವು ಎಷ್ಟು ಗಂಟೆಗೆ ಆಸ್ಪತ್ರೆಗೆ ತಲುಪುವುದು ಸೂಕ್ತ?',
      te: 'మీ అపాయింట్‌మెంట్ 10:30 AM అయితే, మీరు ఎన్ని గంటలకు చేరుకోవాలి?',
      en: 'If your scheduled slot is 10:30 AM, when should you aim to arrive at the desk?',
    },
    quizOptions: [
      {
        id: 'opt-early',
        label: {
          kn: '೧೦:೦೦ AM (೩೦ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ)',
          te: '10:00 AM (30 నిమిషాల ముందుగా)',
          en: '10:00 AM (30 minutes earlier)',
        },
        isCorrect: true,
        feedback: {
          kn: 'ಚೆನ್ನಾಗಿದೆ! ೩೦ ನಿಮಿಷ ಮುಂಚೆ ಬಂದರೆ ಗಡಿಬಿಡಿ ಇರುವುದಿಲ್ಲ.',
          te: 'బాగుంది! 30 నిమిషాల ముందు వస్తే హడావిడి లేకుండా పని పూర్తవుతుంది.',
          en: 'Correct! Arriving 30 minutes early avoids rush and protects your scan slot.',
        },
      },
      {
        id: 'opt-exact',
        label: {
          kn: '೧೦:೪೫ AM (ಸ್ವಲ್ಪ ತಡವಾಗಿ)',
          te: '10:45 AM (కొంచెం ఆలస్యంగా)',
          en: '10:45 AM (after the slot starts)',
        },
        isCorrect: false,
        feedback: {
          kn: 'ತಡವಾದರೆ ನಿಮ್ಮ ಸರದಿ ತಪ್ಪಿಹೋಗುವ ಸಾಧ್ಯತೆ ಇರುತ್ತದೆ.',
          te: 'ఆలస్యమైతే మీ వంతు మిస్ అయ్యే అవకాశం ఉంది.',
          en: 'Arriving late may cause your slot to be reassigned to another patient.',
        },
      },
    ],
    teachBackPrompt: {
      kn: 'ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಹೇಳಿ: ಸ್ಕ್ಯಾನ್ ಸಮಯಕ್ಕಿಂತ ಮುಂಚಿತವಾಗಿ ಏಕೆ ಬರಬೇಕು?',
      te: 'మీ మాటలలో చెప్పండి: స్కాన్ సమయానికి ముందుగా ఎందుకు రావాలి?',
      en: 'In your own words, why is arriving 30 minutes before the appointment time helpful?',
    },
    teachBackKeywords: ['early', '30', 'check', 'paper', 'prepare', 'register', 'time', 'slot', 'ಮುಂಚೆ', '೩೦', 'ಸಿದ್ಧತೆ', 'కಾಗದ', 'ముందు', '30', 'నమోదు', 'సిద్ధం'],
    referenceSummary: {
      kn: 'ಆದರ್ಶ ಸಾರಾಂಶ: "ನೋಂದಣಿ, ಕಾಗದಪತ್ರ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಿದ್ಧತೆಗಾಗಿ ೩೦ ನಿಮಿಷ ಮುಂಚೆ ತಲುಪಬೇಕು."',
      te: 'సరైన సారాంశం: "నమోదు మరియు పత్రాల తనిఖీ కోసం 30 నిమిషాల ముందే చేరుకోవాలి."',
      en: 'Reference summary: "Arriving 30 minutes early leaves comfortable time for registration and paperwork checks."',
    },
  },
  {
    id: 'sense-followup',
    term: {
      kn: 'Report Collection & Follow-Up (ವರದಿ ಸಂಗ್ರಹಣೆ)',
      te: 'Report Collection & Follow-Up (రిపోర్ట్ సేకరణ)',
      en: 'Report Collection & Follow-Up Desk',
    },
    category: {
      kn: 'ಭೇಟಿಯ ನಂತರದ ಪ್ರಕ್ರಿಯೆ',
      te: 'సందర్శన తర్వాత దశ',
      en: 'Post-Visit Process',
    },
    plainExplanation: {
      kn: 'ಪರೀಕ್ಷೆ ಮುಗಿದ ತಕ್ಷಣ ವರದಿ ಸಿಗದಿರಬಹುದು. ವರದಿಯನ್ನು ಯಾವ ದಿನಾಂಕದಂದು, ಯಾವ ಕೌಂಟರ್‌ನಿಂದ ಪಡೆಯಬೇಕು ಮತ್ತು ನಂತರ ಯಾವ ವೈದ್ಯರಿಗೆ ತೋರಿಸಬೇಕು ಎಂಬುದನ್ನು ಕೇಳಿ ಬರೆದಿಟ್ಟುಕೊಳ್ಳಬೇಕು.',
      te: 'స్కాన్ పూర్తయిన వెంటనే రిపోర్ట్ రాకపోవచ్చు. ఏ తేదీన, ఏ కౌంటర్ వద్ద రిపోర్ట్ తీసుకోవాలో మరియు తర్వాత ఏ డాక్టర్‌ను కలవాలో అడిగి రాసుకోవాలి.',
      en: 'Diagnostic reports often take several hours or a day to prepare. Always ask at the desk when and where to collect your printed report before going home.',
    },
    quizQuestion: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಮುಗಿದ ತಕ್ಷಣ ಮನೆಗೆ ಹೊರಡುವ ಮುನ್ನ ಏನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಬೇಕು?',
      te: 'స్కాన్ పూర్తయ్యాక ఇంటికి వెళ్ళే ముందు ఏమి అడిగి తెలుసుకోవాలి?',
      en: 'Before leaving the hospital after your scan, what should you confirm?',
    },
    quizOptions: [
      {
        id: 'opt-ask-report',
        label: {
          kn: 'ವರದಿ ಯಾವಾಗ ಮತ್ತು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ ಎಂಬ ದಿನಾಂಕವನ್ನು ಕೇಳುವುದು',
          te: 'రిపోర్ట్ ఎప్పుడు మరియు ఎక్కడ ఇస్తారో తేదీని అడగడం',
          en: 'Ask when and where to collect the report and when to see the doctor',
        },
        isCorrect: true,
        feedback: {
          kn: 'ಅತ್ಯುತ್ತಮ! ಇದರಿಂದ ವೃಥಾ ಆಸ್ಪತ್ರೆಗೆ ಅಲೆದಾಡುವುದು ತಪ್ಪುತ್ತದೆ.',
          te: 'చాలా మంచిది! దీనివల్ల అనవసరంగా ఆసుపత్రికి తిరగాల్సిన అవసరం తప్పుతుంది.',
          en: 'Great! Confirming collection details saves an extra unnecessary hospital trip.',
        },
      },
      {
        id: 'opt-leave',
        label: {
          kn: 'ಏನನ್ನೂ ಕೇಳದೆ ಮನೆಗೆ ಹೋಗಿ ಕಾಯುವುದು',
          te: 'ఏమీ అడగకుండా ఇంటికి వెళ్లిపోవడం',
          en: 'Leave without asking about report collection',
        },
        isCorrect: false,
        feedback: {
          kn: 'ಕೇಳದೆ ಹೋದರೆ ವರದಿ ಎಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬೇಕು ಎಂಬ ಗೊಂದಲವಾಗುತ್ತದೆ.',
          te: 'అడగకుండా వెళితే రిపోర్ట్ ఎక్కడ తీసుకోవాలో తెలియక ఇబ్బంది పడతారు.',
          en: 'Without confirming collection dates, you may return on the wrong day.',
        },
      },
    ],
    teachBackPrompt: {
      kn: 'ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಬರೆಯಿರಿ: ಪರೀಕ್ಷೆ ಮುಗಿದ ನಂತರ ಆಸ್ಪತ್ರೆಯಿಂದ ಹೊರಡುವ ಮುನ್ನ ನೀವು ಏನು ಕೇಳುತ್ತೀರಿ?',
      te: 'మీ మాటలలో రాయండి: పరీక్ష పూర్తయిన తర్వాత ఆసుపత్రి నుండి వెళ్ళే ముందు ఏమి అడుగుతారు?',
      en: 'In your own words, what question will you ask staff before leaving after your test?',
    },
    teachBackKeywords: ['when', 'where', 'report', 'collect', 'date', 'doctor', 'follow', 'ವರದಿ', 'ಯಾವಾಗ', 'ಎಲ್ಲಿ', 'ದಿನಾಂಕ', 'రిపోర్ట్', 'ఎప్పుడు', 'ఎక్కడ', 'డాక్టర్'],
    referenceSummary: {
      kn: 'ಆದರ್ಶ ಸಾರಾಂಶ: "ನನ್ನ ವರದಿ ಯಾವ ದಿನ, ಯಾವ ಕೌಂಟರ್‌ನಲ್ಲಿ ಸಿಗುತ್ತದೆ ಮತ್ತು ಮುಂದಿನ ಭೇಟಿ ಯಾವಾಗ ಎಂದು ಕೇಳುತ್ತೇನೆ."',
      te: 'సరైన సారాంశం: "నా రిపోర్ట్ ఏ రోజు, ఏ కౌంటర్ వద్ద ఇస్తారో మరియు డాక్టర్‌ను ఎప్పుడు కలవాలో అడుగుతాను."',
      en: 'Reference summary: "I will ask which day and counter to collect my report from, and when to return for follow-up."',
    },
  },
];

export const HOSPITAL_PROCESS_SEQUENCE = [
  {
    step: 1,
    title: { kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಣ', te: 'అపాయింట్‌మెంట్ నిర్ధారణ', en: 'Appointment Confirmation' },
    desc: { kn: 'ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಖಚಿತಪಡಿಸಿ', te: 'తేదీ, సమయం నిర్ధారించండి', en: 'Confirm date & slot' },
  },
  {
    step: 2,
    title: { kn: 'ಆಸ್ಪತ್ರೆ ಪ್ರವೇಶ', te: 'ఆసుపత్రికి చేరుకోవడం', en: 'Hospital Arrival' },
    desc: { kn: '೩೦ ನಿಮಿಷ ಮುಂಚೆ ಬನ್ನಿ', te: '30 నిమిషాల ముందు రండి', en: 'Arrive 30 mins early' },
  },
  {
    step: 3,
    title: { kn: 'ನೋಂದಣಿ ಕೌಂಟರ್', te: 'నమోదు కౌంటర్', en: 'Registration' },
    desc: { kn: 'ಟೋಕನ್ ಚೀಟಿ ಪಡೆಯಿರಿ', te: 'టోకెన్ చీటీ తీసుకోండి', en: 'Collect queue token' },
  },
  {
    step: 4,
    title: { kn: 'ಪರೀಕ್ಷೆ / ಸಮಾಲೋಚನೆ', te: 'పరీక్ష / సంప్రదింపు', en: 'Consultation / Scan' },
    desc: { kn: 'ಸರದಿಯಲ್ಲಿ ಒಳಗೆ ಹೋಗಿ', te: 'వరుసలో లోపలికి వెళ్ళండి', en: 'Attend when called' },
  },
  {
    step: 5,
    title: { kn: 'ವರದಿ ಮತ್ತು ಮುಂದಿನ ಭೇಟಿ', te: 'రిపోర్ట్ & తదుపరి భేటీ', en: 'Follow-Up' },
    desc: { kn: 'ವರದಿ ದಿನಾಂಕ ಕೇಳಿ ತಿಳಿಯಿರಿ', te: 'రిపోర్ట్ తేదీ తెలుసుకోండి', en: 'Confirm report date' },
  },
];

/* =========================================================
   FEATURE 4: CORE CARECOMPASS (Intelligent Visit Preparation)
   ========================================================= */

export interface CareCompassPreset {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  tasks: Array<{
    id: string;
    category: CareCompassTask['category'];
    source: 'generic' | 'clinic_verify';
    text: Record<Language, string>;
  }>;
}

export const CARECOMPASS_PRESETS: CareCompassPreset[] = [
  {
    id: 'ct-scan',
    title: {
      kn: 'ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ಭೇಟಿ (Abdominal CT Scan)',
      te: 'సిటి స్కాన్ సందర్శన (Abdominal CT Scan)',
      en: 'Diagnostic CT Scan Visit',
    },
    subtitle: {
      kn: 'ಉಪವಾಸ, ರಕ್ತ ಪರೀಕ್ಷೆ ವರದಿ ಮತ್ತು ಪ್ರಯಾಣ ಸಿದ್ಧತೆ',
      te: 'ఉపవాసం, రక్త పరీక్ష రిపోర్టు మరియు ప్రయాణ సన్నద్ధత',
      en: 'Fasting preparation, lab documents & clinic verification items',
    },
    tasks: [
      {
        id: 'cc-ct-1',
        category: 'documents',
        source: 'clinic_verify',
        text: {
          kn: 'ವೈದ್ಯರ ಸ್ಕ್ಯಾನ್ ಚೀಟಿ, ಗುರುತಿನ ಚೀಟಿ ಮತ್ತು ಇತ್ತೀಚಿನ Creatinine ವರದಿ ಪರಿಶೀಲಿಸಿ (ಆಸ್ಪತ್ರೆಯ ನಿಯಮ ದೃಢಪಡಿಸಿ)',
          te: 'డాక్టర్ చీటీ, గుర్తింపు కార్డు మరియు ఇటీవలి Creatinine రిపోర్ట్ సిద్ధం చేయండి (క్లినిక్‌తో నిర్ధారించండి)',
          en: 'Verify Doctor Referral Slip, Photo ID & recent Creatinine blood report with the clinic desk',
        },
      },
      {
        id: 'cc-ct-2',
        category: 'questions',
        source: 'generic',
        text: {
          kn: 'ಸ್ಕ್ಯಾನ್ ನಂತರ ನಾನು ಯಾವಾಗ ಊಟ ಮಾಡಬಹುದು ಮತ್ತು ವರದಿ ಯಾವಾಗ ಸಿಗುತ್ತದೆ ಎಂದು ಕೇಳಲು ಗುರುತಿಡಿ',
          te: 'స్కాన్ తర్వాత ఎప్పుడు భోజనం చేయవచ్చు మరియు రిపోర్ట్ ఎప్పుడు ఇస్తారో అడిగే ప్రశ్నలు నోట్ చేయండి',
          en: 'Prepare questions to ask staff: when to resume food and when/where to collect the report',
        },
      },
      {
        id: 'cc-ct-3',
        category: 'travel',
        source: 'generic',
        text: {
          kn: 'ಬೆಳಗಿನ ಬಸ್ ಅಥವಾ ಆಟೋ ಸಮಯವನ್ನು ೪೫ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ತಲುಪುವಂತೆ ಯೋಜಿಸಿ',
          te: 'ఉదయం బస్సు లేదా ఆటో సమయాన్ని 45 నిమిషాల ముందుగా చేరుకునేలా ప్లాన్ చేయండి',
          en: 'Arrange morning transport so you reach the campus 30–45 minutes early',
        },
      },
      {
        id: 'cc-ct-4',
        category: 'reminders',
        source: 'clinic_verify',
        text: {
          kn: '೪ ಗಂಟೆ ಉಪವಾಸದ ಸಮಯದ ಬಗ್ಗೆ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಯೊಂದಿಗೆ ಹೊಂದಿಸಿ ಜ್ಞಾಪನೆ ಇರಿಸಿ',
          te: '4 గంటల ఉపవాస నియమాన్ని ఆసుపత్రి సూచనతో సరిచూసుకుని రిమైండర్ పెట్టుకోండి',
          en: 'Confirm exact fasting hours required by your clinic and set a morning reminder',
        },
      },
      {
        id: 'cc-ct-5',
        category: 'accessibility',
        source: 'generic',
        text: {
          kn: 'ಗಾಲಿಕುರ್ಚಿ (Wheelchair) ಅಥವಾ ಕನ್ನಡ/ತೆಲುಗು ಸಹಾಯಕರು ಬೇಕಿದ್ದರೆ ಪ್ರವೇಶ ದ್ವಾರದಲ್ಲೇ ಕೇಳಲು ಸಿದ್ಧತೆ',
          te: 'వీల్‌చైర్ లేదా తెలుగు/కన్నడ సహాయం అవసరమైతే గేట్ వద్దే అడగడానికి సిద్ధం అవ్వండి',
          en: 'Note if wheelchair support or regional-language assistance is needed at reception',
        },
      },
      {
        id: 'cc-ct-6',
        category: 'caregiver',
        source: 'generic',
        text: {
          kn: 'ಜೊತೆಗೆ ಬರುವ ಕುಟುಂಬದವರಿಗೆ CareCircle ಅಥವಾ ಪ್ರಿಂಟ್ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಪ್ರತಿ ನೀಡಿ',
          te: 'తోడుగా వచ్చే కుటుంబ సభ్యుడికి CareCircle వివరాలు లేదా పాస్‌పోర్ట్ కాపీ ఇవ్వండి',
          en: 'Share your arrival timing and Block directions with your chosen companion',
        },
      },
    ],
  },
  {
    id: 'ultrasound',
    title: {
      kn: 'ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನ್ (Ultrasound Visit)',
      te: 'అల్ట్రాసౌండ్ స్కాన్ (Ultrasound Visit)',
      en: 'Ultrasound Scan Visit',
    },
    subtitle: {
      kn: 'ನೀರು ಕುಡಿಯುವ ಸಿದ್ಧತೆ ಮತ್ತು ವರದಿ ಕಾಗದಪತ್ರಗಳು',
      te: 'నీరు త్రాగే ఏర్పాట్లు మరియు పత్రాల జాబితా',
      en: 'Hydration timing, clothing comfort & referral document prep',
    },
    tasks: [
      {
        id: 'cc-usg-1',
        category: 'documents',
        source: 'clinic_verify',
        text: {
          kn: 'ವೈದ್ಯರ ಚೀಟಿ ಮತ್ತು ಹಳೆಯ ಅಲ್ಟ್ರಾಸೌಂಡ್ ವರದಿಗಳನ್ನು ಚೀಲದಲ್ಲಿ ಇಡಿ (ಆಸ್ಪತ್ರೆ ನಿಯಮ ಪರಿಶೀಲಿಸಿ)',
          te: 'డాక్టర్ చీటీ మరియు పాత అల్ట్రాసౌండ్ రిపోర్టులు సిద్ధం చేయండి (క్లినిక్‌తో సరిచూడండి)',
          en: 'Verify referral paper, ID, and prior ultrasound films required by the clinic',
        },
      },
      {
        id: 'cc-usg-2',
        category: 'reminders',
        source: 'clinic_verify',
        text: {
          kn: 'ಸ್ಕ್ಯಾನ್‌ಗೆ ೧ ಗಂಟೆ ಮುಂಚೆ ನೀರು ಕುಡಿಯುವ ನಿಯಮ ನಿಮ್ಮ ಪರೀಕ್ಷೆಗೆ ಅನ್ವಯಿಸುತ್ತದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿ',
          te: 'స్కాన్‌కు 1 గంట ముందు నీరు త్రాగే నియమం మీ పరీక్షకు వర్తిస్తుందో లేదో నిర్ధారించుకోండి',
          en: 'Check with clinic whether full-bladder water intake applies to your specific scan',
        },
      },
      {
        id: 'cc-usg-3',
        category: 'travel',
        source: 'generic',
        text: {
          kn: 'ಆರಾಮದಾಯಕ, ಸಡಿಲವಾದ ಬಟ್ಟೆ ಧರಿಸಿ ಮತ್ತು ಶುದ್ಧ ಕುಡಿಯುವ ನೀರಿನ ಬಾಟಲಿ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ',
          te: 'వదులుగా సౌకర్యవంతమైన దుస్తులు ధరించి, మంచినీటి బాటిల్ వెంట తీసుకెళ్ళండి',
          en: 'Wear comfortable two-piece clothing and carry a clean drinking water bottle',
        },
      },
      {
        id: 'cc-usg-4',
        category: 'questions',
        source: 'generic',
        text: {
          kn: 'ವರದಿ ತಕ್ಷಣ ಸಿಗುತ್ತದೆಯೇ ಅಥವಾ ಮರುದಿನ ಬರಬೇಕೇ ಎಂದು ಕೇಳಲು ಪ್ರಶ್ನೆ ಸೇರಿಸಿ',
          te: 'రిపోర్ట్ వెంటనే ఇస్తారా లేదా మరుసటి రోజు రావాలా అని అడగడానికి నోట్ చేయండి',
          en: 'Note question for staff: Will the printed report be ready the same day?',
        },
      },
    ],
  },
  {
    id: 'opd-checkup',
    title: {
      kn: 'ಸಾಮಾನ್ಯ ಹೊರರೋಗಿ ತಪಾಸಣೆ (OPD Check-up)',
      te: 'సాధారణ అవుట్‌పేషెంట్ తనిఖీ (OPD Check-up)',
      en: 'General Outpatient Consultation',
    },
    subtitle: {
      kn: 'ಮಾತ್ರೆಗಳ ಪಟ್ಟಿ, ರೋಗಲಕ್ಷಣಗಳ ಟಿಪ್ಪಣಿ ಮತ್ತು ಟೋಕನ್ ತಯಾರಿ',
      te: 'మందుల జాబితా మరియు డాక్టర్‌ను అడిగే ప్రశ్నల తయారీ',
      en: 'Medication list packing, appointment reminders & visit logistics',
    },
    tasks: [
      {
        id: 'cc-opd-1',
        category: 'documents',
        source: 'generic',
        text: {
          kn: 'ಪ್ರಸ್ತುತ ಸೇವಿಸುತ್ತಿರುವ ಎಲ್ಲಾ ಔಷಧಿ ಚೀಟಿ ಅಥವಾ ಮಾತ್ರೆಗಳ ಕವರ್‌ಗಳನ್ನು ಜೊತೆಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ',
          te: 'ప్రస్తుతం వాడుతున్న అన్ని మందుల చీటీలు లేదా మందుల ప్యాకెట్లు వెంట తీసుకెళ్ళండి',
          en: 'Carry a list or original strips of all current regular medicines to show the doctor',
        },
      },
      {
        id: 'cc-opd-2',
        category: 'questions',
        source: 'generic',
        text: {
          kn: 'ವೈದ್ಯರಿಗೆ ತಿಳಿಸಬೇಕಾದ ೨–೩ ಮುಖ್ಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಪಾಸ್‌ಪೋರ್ಟ್‌ನಲ್ಲಿ ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ',
          te: 'డాక్టర్‌ను అడగాల్సిన 2-3 ముఖ్యమైన ప్రశ్నలను పాస్‌పోర్ట్‌లో రాసుకోండి',
          en: 'Write down 2–3 priority questions you want to ask during the consultation',
        },
      },
      {
        id: 'cc-opd-3',
        category: 'travel',
        source: 'generic',
        text: {
          kn: 'OPD ಕೌಂಟರ್‌ಗೆ ಬೆಳಗ್ಗೆ ಬೇಗನೆ ತಲುಪಲು ಪ್ರಯಾಣದ ವ್ಯವಸ್ಥೆ ಖಚಿತಪಡಿಸಿ',
          te: 'OPD కౌంటర్‌కు ఉదయం త్వరగా చేరుకోవడానికి ప్రయాణ ఏర్పాట్లు చేసుకోండి',
          en: 'Confirm transport timing to arrive ahead of morning OPD token rush',
        },
      },
      {
        id: 'cc-opd-4',
        category: 'accessibility',
        source: 'clinic_verify',
        text: {
          kn: 'ಹಿರಿಯ ನಾಗರಿಕರ ಪ್ರತ್ಯೇಕ ಸರದಿ ಕೌಂಟರ್ (Senior Citizen Desk) ಸೌಲಭ್ಯವಿದೆಯೇ ಎಂದು ವಿಚಾರಿಸಿ',
          te: 'సీనియర్ సిటిజన్లకు ప్రత్యేక కౌంటర్ ఉందో లేదో రిసెప్షన్‌లో కనుక్కోండి',
          en: 'Ask hospital reception if a dedicated Senior Citizen queue desk is available',
        },
      },
    ],
  },
];

/* =========================================================
   FEATURE 5: CORE CAREFLOW (Interactive Decision-Tree Simulator)
   ========================================================= */

export interface CareFlowNode {
  id: string;
  title: Record<Language, string>;
  prompt: Record<Language, string>;
  explanation: Record<Language, string>;
  options?: Array<{
    id: string;
    label: Record<Language, string>;
    nextNodeId: string;
  }>;
  recommendedPage?: PageView;
  recommendedLabel?: Record<Language, string>;
}

export interface CareFlowScenario {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  startNodeId: string;
  nodes: Record<string, CareFlowNode>;
}

export const CAREFLOW_SCENARIOS: CareFlowScenario[] = [
  {
    id: 'forgot-details',
    title: {
      kn: 'ನಾನು ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳನ್ನು ಮರೆತಿದ್ದೇನೆ',
      te: 'నేను నా అపాయింట్‌మెంట్ వివరాలను మర్చిపోయాను',
      en: 'I forgot my appointment details.',
    },
    subtitle: {
      kn: 'SMS ಕಳೆದುಹೋಗಿದ್ದರೆ ಅಥವಾ ಸಮಯ ನೆನಪಿಲ್ಲದಿದ್ದರೆ ಹಂತ-ಹಂತದ ದಾರಿ',
      te: 'SMS పోయినా లేదా సమయం గుర్తులేకపోయినా దశల వారీ మార్గం',
      en: 'Find out how to calmly recover your date, time, and room information.',
    },
    startNodeId: 'fd-start',
    nodes: {
      'fd-start': {
        id: 'fd-start',
        title: { kn: 'ಹಂತ ೧: ನಿಮ್ಮ ಬಳಿ ಏನಿದೆ?', te: 'దశ 1: మీ వద్ద ఏముంది?', en: 'Step 1: What do you have handy?' },
        prompt: {
          kn: 'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರ ಮರೆತಾಗ, ನಿಮ್ಮ ಬಳಿ ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಅಥವಾ ಹಳೆಯ ಚೀಟಿ ಇದೆಯೇ?',
          te: 'మీ అపాయింట్‌మెంట్ వివరాలు మర్చిపోయినప్పుడు, మీ దగ్గర స్మార్ట్‌ఫೋన్ లేదా పాత చీటీ ఉందా?',
          en: 'Do you currently have access to your phone number / referral paper, or are you starting without any paper?',
        },
        explanation: {
          kn: 'ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಗೆ ತಕ್ಕಂತೆ CORE ಸುಲಭವಾದ ಮಾರ್ಗವನ್ನು ತೋರಿಸುತ್ತದೆ.',
          te: 'మీ దగ్గర ఉన్న వివరాలను బట్టి CORE సరైన దారిని చూపుతుంది.',
          en: 'CORE adapts the recovery steps depending on whether you have your phone, paper slip, or need family help.',
        },
        options: [
          {
            id: 'fd-opt-phone',
            label: {
              kn: 'ನನ್ನ ಬಳಿ ಫೋನ್ / 4-ಅಂಕಿಯ PIN ಇದೆ',
              te: 'నా దగ్గర ఫోన్ నంబర్ / 4-అంకెల PIN ఉంది',
              en: 'I have my phone / 4-digit PIN or name',
            },
            nextNodeId: 'fd-voice-check',
          },
          {
            id: 'fd-opt-paper-lost',
            label: {
              kn: 'ಫೋನ್‌ನಲ್ಲಿ ಓದಲು ಕಷ್ಟವಾಗುತ್ತಿದೆ / ಚೀಟಿ ಇಲ್ಲ',
              te: 'ఫోన్‌లో చదవడం కష్టంగా ఉంది / చీటీ లేదు',
              en: 'I cannot read SMS easily or lost my slip',
            },
            nextNodeId: 'fd-helper-check',
          },
        ],
      },
      'fd-voice-check': {
        id: 'fd-voice-check',
        title: { kn: 'ಹಂತ ೨: ಧ್ವನಿ ಅಥವಾ ದೃಶ್ಯ ಕಾರ್ಡ್', te: 'దశ 2: వాయిస్ లేదా కార్డు', en: 'Step 2: Choose Voice or Card Lookup' },
        prompt: {
          kn: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಕೇಳಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ಪ್ರಿಂಟ್ ಕಾರ್ಡ್ ನೋಡಲು ಬಯಸುತ್ತೀರಾ?',
          te: 'మీరు వివరాలను వాయిస్‌లో వినాలనుకుంటున్నారా లేదా ప్రింట్ కార్డు చూడాలనుకుంటున్నారా?',
          en: 'Would you prefer to hear the appointment spoken aloud or view/print a clear summary card?',
        },
        explanation: {
          kn: 'ನಮ್ಮ ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪುಟದಲ್ಲಿ ಕನ್ನಡ ಮತ್ತು ತೆಲುಗು ಧ್ವನಿಯಲ್ಲಿ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಕೇಳಬಹುದು.',
          te: 'మా నా అపాయింట్‌మెంట్ పేజీలో తెలుగు మరియు కన్నడలో అన్ని వివరాలను వినవచ్చు.',
          en: 'Voice-first playback speaks your date, hospital block, and preparation instructions aloud.',
        },
        options: [
          {
            id: 'fd-opt-listen',
            label: { kn: 'ಧ್ವನಿಯಲ್ಲಿ ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೇಳಿ', te: 'వాయిస్‌లో నా అపాయింట్‌మెంట్ వినాలి', en: 'Hear appointment read aloud in my language' },
            nextNodeId: 'fd-end-appointment',
          },
          {
            id: 'fd-opt-passport',
            label: { kn: 'ಆಸ್ಪತ್ರೆಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಲು ಕಾರ್ಡ್ ಪಡೆಯಿರಿ', te: 'ఆసుపత్రికి తీసుకెళ్ళడానికి కార్డు కావాలి', en: 'Get a printable Visit Passport card' },
            nextNodeId: 'fd-end-passport',
          },
        ],
      },
      'fd-helper-check': {
        id: 'fd-helper-check',
        title: { kn: 'ಹಂತ ೨: ಸಹಾಯದ ಆಯ್ಕೆ', te: 'దశ 2: సహాయం ఎంచుకోండి', en: 'Step 2: Guided Human or Caregiver Help' },
        prompt: {
          kn: 'ಕುಟುಂಬದವರ ಜೊತೆಗಿರುವಿರಾ ಅಥವಾ ಗ್ರಾಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ / ಆಸ್ಪತ್ರೆ ಸಹಾಯ ಬೇಕೇ?',
          te: 'మీ పక్కన కుటుంబ సభ్యులు ఉన్నారా లేదా ఆశా కార్యకర్త / ఆసుపత్రి సహాయం కావాలా?',
          en: 'Is a trusted family member nearby, or would you like village ASHA / hospital desk guidance?',
        },
        explanation: {
          kn: 'ದಾಖಲೆಗಳು ಕಳೆದುಹೋದಾಗಲೂ ಶಾಂತವಾಗಿ ಹತ್ತಿರದ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಹೆಸರು-ಫೋನ್ ಸಂಖ್ಯೆ ನೀಡಿ ಪರಿಶೀಲಿಸಬಹುದು.',
          te: 'కాగితం పోయినా కంగారు పడకుండా ఆశా కార్యకర్త లేదా రిజిస్ట్రేషన్ డెస్క్ వద్ద పేరు-ఫోన్ నంబర్ ద్వారా వివరాలు పొందవచ్చు.',
          en: 'Even if a paper slip is misplaced, hospital registration desks and village ASHA workers can guide verification calmly.',
        },
        options: [
          {
            id: 'fd-opt-caregiver',
            label: { kn: 'ಕುಟುಂಬದವರು / CareCircle ನೆರವು ಪಡೆಯಿರಿ', te: 'కుటుంబ సభ్యులు / CareCircle సహాయం', en: 'Use CareCircle with my family member' },
            nextNodeId: 'fd-end-carecircle',
          },
          {
            id: 'fd-opt-asha',
            label: { kn: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಮತ್ತು ಆಸ್ಪತ್ರೆ ಸಹಾಯ ಮಾರ್ಗ ನೋಡಿ', te: 'ఆశా కార్యకర్త & హాస్పిటల్ సహాయం చూడాలి', en: 'View ASHA & Hospital Help Desk steps' },
            nextNodeId: 'fd-end-help',
          },
        ],
      },
      'fd-end-appointment': {
        id: 'fd-end-appointment',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ', te: 'తదుపరి దశ: నా అపాయింట్‌మెంట్ వినండి', en: 'Outcome: Listen to Appointment Summary' },
        prompt: {
          kn: '"ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್" ಪುಟವನ್ನು ತೆರೆದು ದೊಡ್ಡ ಪ್ಲೇ ಬಟನ್ ಒತ್ತಿ. ದಿನಾಂಕ, ಕೊಠಡಿ ಮತ್ತು ಸಿದ್ಧತೆ ವಿವರಗಳು ಕೇಳಿಸುತ್ತವೆ.',
          te: '"నా అపాయింట్‌మెంట్" పేజీని తెరిచి ప్లే బటన్ నొక్కండి. తేదీ, గది మరియు జాగ్రత్తలు వినిపిస్తాయి.',
          en: 'Open My Appointment and press the large Play button to hear your fictional demonstration date, room, and directions.',
        },
        explanation: {
          kn: 'ಇದು ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾದರಿ — ನೈಜ ಆಸ್ಪತ್ರೆ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ನಿಮ್ಮ ನೋಂದಾಯಿತ ಫೋನ್ ಮೂಲಕ ವಿವರ ಪಡೆಯಲಾಗುತ್ತದೆ.',
          te: 'ఇది డెమో నమూనా — నిజమైన ఆసుపత్రిలో మీ రిజిస్టర్డ్ ఫోన్ ద్వారా వివరాలు వస్తాయి.',
          en: 'Demonstration outcome: in live clinical integration, your registered phone or token recovers your schedule securely.',
        },
        recommendedPage: 'appointment',
        recommendedLabel: { kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ತೆರೆಯಿರಿ', te: 'నా అపాయింట్‌మెంట్ తెరవండి', en: 'Open My Appointment' },
      },
      'fd-end-passport': {
        id: 'fd-end-passport',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್', te: 'తదుపరి దశ: విజిట్ పాస్‌పోర్ట్', en: 'Outcome: Print Visit Passport' },
        prompt: {
          kn: 'ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಪುಟದಲ್ಲಿ ನಿಮ್ಮ ಭೇಟಿಯ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಒಂದೇ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಪ್ರಿಂಟ್ ಅಥವಾ PDF ಆಗಿ ಉಳಿಸಬಹುದು.',
          te: 'విజిట్ పాస్‌పోర్ట్ పేజీలో అన్ని వివరాలను ఒకే కార్డుగా ప్రింట్ లేదా PDF సేవ్ చేయవచ్చు.',
          en: 'Generate a printable Visit Passport card so you never have to memorize or search SMS messages again.',
        },
        explanation: {
          kn: 'ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದಾಗಲೂ ಕಾಗದದ ಕಾರ್ಡ್ ತೋರಿಸಲು ಬಹಳ ಉಪಯುಕ್ತ.',
          te: 'నెట్‌వర్క్ లేని చోట కూడా కాగితపు కార్డు చూపించడం సులభం.',
          en: 'Carrying a printed passport helps at hospital gates with weak mobile reception.',
        },
        recommendedPage: 'passport',
        recommendedLabel: { kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ನೋಡಿ', te: 'నా విజిట్ పాస్‌పోర్ట్ చూడండి', en: 'Open My Visit Passport' },
      },
      'fd-end-carecircle': {
        id: 'fd-end-carecircle',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: CareCircle ಹಂಚಿಕೆ', te: 'తదుపరి దశ: CareCircle సహాయం', en: 'Outcome: Patient-Controlled CareCircle' },
        prompt: {
          kn: 'CareCircle ನಲ್ಲಿ ನಿಮ್ಮ ಅನುಮತಿಯೊಂದಿಗೆ ಮಾತ್ರ ಮಗ/ಮಗಳಿಗೆ ಭೇಟಿ ಸಮಯ ಮತ್ತು ತಲುಪುವ ದಾರಿಯನ್ನು ತೋರಿಸಬಹುದು.',
          te: 'CareCircle లో మీ అనుమతితో మాత్రమే కుటుంబ సభ్యుడికి తేదీ మరియు దారిని చూపించవచ్చు.',
          en: 'Grant explicit consent in CareCircle so your companion sees only the visit time, room, and checklist.',
        },
        explanation: {
          kn: 'ರೋಗಿಯ ಸ್ವಾಭಿಮಾನ ಮತ್ತು ಗೌಪ್ಯತೆಗೆ ಮೊದಲ ಆದ್ಯತೆ.',
          te: 'రోగి ఆత్మగౌరవం మరియు గోప్యతకు మొదటి ప్రాధాన్యత.',
          en: 'No external messages are sent in this prototype; all sharing toggles stay local.',
        },
        recommendedPage: 'carecircle',
        recommendedLabel: { kn: 'CareCircle ತೆರೆಯಿರಿ', te: 'CareCircle తెరవండి', en: 'Open CareCircle' },
      },
      'fd-end-help': {
        id: 'fd-end-help',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ಸಹಾಯ ಮತ್ತು ಆಶಾ ನೆರವು', te: 'తదుపరి దశ: సహాయం & ఆశా మార్గదర్శనం', en: 'Outcome: ASHA & Hospital Desk Guidance' },
        prompt: {
          kn: 'ನಿಮ್ಮ ಗ್ರಾಮದ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ಆಸ್ಪತ್ರೆ ನೋಂದಣಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಗ್ರಾಮದ ಹೆಸರನ್ನು ತಿಳಿಸಿ ನೆರವು ಪಡೆಯಿರಿ.',
          te: 'మీ గ్రామ ఆశా కార్యకర్త లేదా ఆసుపత్రి రిజిస్ట్రేషన్ కౌంటర్‌లో మీ పేరు చెప్పి వివరాలు తెలుసుకోండి.',
          en: 'Follow the calm step-by-step guidance in Get Help to connect with your village ASHA worker or hospital registration desk.',
        },
        explanation: {
          kn: 'ಯಾವುದೇ ತಪ್ಪಾದ ಫೋನ್ ಸಂಖ್ಯೆಗಳಿಗೆ ಕರೆ ಮಾಡುವ ಬದಲು ಅಧಿಕೃತ ಸಹಾಯ ಕೇಂದ್ರದ ಮಾರ್ಗ ಅನುಸರಿಸಿ.',
          te: 'తప్పుడు నంబర్లకు ఫోన్ చేయకుండా అధికారిక సహాయ కేంద్రాన్ని సంప్రదించండి.',
          en: 'CORE replaces guesswork with clear, dignified human support steps.',
        },
        recommendedPage: 'help',
        recommendedLabel: { kn: 'ಸಹಾಯ ಪಡೆಯಿರಿ ಪುಟ ತೆರೆಯಿರಿ', te: 'సహాయం పొందండి తెరవండి', en: 'Open Get Help' },
      },
    },
  },
  {
    id: 'cant-understand-reg',
    title: {
      kn: 'ನನಗೆ ಆಸ್ಪತ್ರೆ ನೋಂದಣಿ ಸೂಚನೆಗಳು ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ',
      te: 'నాకు ఆసుపత్రి రిజిస్ట్రేషన్ సూచనలు అర్థం కావడం లేదు',
      en: 'I cannot understand the registration instructions.',
    },
    subtitle: {
      kn: 'ಇಂಗ್ಲಿಷ್ ಪದಗಳು, ಕೌಂಟರ್ ಸಂಖ್ಯೆ ಅಥವಾ ಫಾರ್ಮ್ ಗೊಂದಲ ಬಗೆಹರಿಸಿ',
      te: 'ఇంగ్లీష్ పదాలు లేదా కౌంటర్ గందరగోళాన్ని సులభంగా పరిష్కరించండి',
      en: 'Break down English hospital terms and queue steps into plain language.',
    },
    startNodeId: 'reg-start',
    nodes: {
      'reg-start': {
        id: 'reg-start',
        title: { kn: 'ಹಂತ ೧: ಯಾವ ಭಾಗ ಕಷ್ಟವಾಗಿದೆ?', te: 'దశ 1: ఏ విషయం కష్టంగా ఉంది?', en: 'Step 1: What feels confusing?' },
        prompt: {
          kn: 'ಆಸ್ಪತ್ರೆ ಕಾಗದದಲ್ಲಿರುವ ಇಂಗ್ಲಿಷ್ ಪದಗಳು ಅರ್ಥವಾಗುತ್ತಿಲ್ಲವೇ ಅಥವಾ ಕೌಂಟರ್‌ಗೆ ಹೋಗುವ ಕ್ರಮ ತಿಳಿಯುತ್ತಿಲ್ಲವೇ?',
          te: 'కాగితంపై ఉన్న ఇంగ్లీష్ పదాలు అర్థం కావడం లేదా లేదా ఏ కౌంటర్‌కు వెళ్ళాలో తెలియదా?',
          en: 'Are the medical/English words on your slip unclear, or are you unsure about the arrival and counter sequence?',
        },
        explanation: {
          kn: 'CORE ನಲ್ಲಿ ಪದಗಳ ಸರಳ ಅರ್ಥ ಮತ್ತು ಚಿತ್ರರೂಪದ ಹಂತಗಳೆರಡೂ ಲಭ್ಯವಿವೆ.',
          te: 'CORE లో పదాల అర్థం మరియు దశల వారీ చిత్రాలు రెండూ ఉన్నాయి.',
          en: 'We can translate hard terms or show the 5-step hospital registration flow.',
        },
        options: [
          {
            id: 'reg-opt-words',
            label: { kn: 'ಇಂಗ್ಲಿಷ್ ಸೂಚನೆಗಳ ಅರ್ಥ ತಿಳಿಯಬೇಕು (NPO, Creatinine ಇತ್ಯಾದಿ)', te: 'ఇంగ్లీష్ పదాల అర్థం కావాలి (NPO, Creatinine మొదలైనవి)', en: 'The English phrases on my slip are confusing' },
            nextNodeId: 'reg-end-clarity',
          },
          {
            id: 'reg-opt-steps',
            label: { kn: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಮೊದಲಿಗೆ ಎಲ್ಲಿ ಹೋಗಬೇಕು ಎಂದು ತಿಳಿಯಬೇಕು', te: 'ఆసుపత్రిలో ముందు ఎక్కడికి వెళ్ళాలో తెలుసుకోవాలి', en: 'I am unsure which desk to go to first' },
            nextNodeId: 'reg-end-sense',
          },
        ],
      },
      'reg-end-clarity': {
        id: 'reg-end-clarity',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ಸರಳವಾಗಿ ವಿವರಿಸಿ (Clarity)', te: 'తదుపరి దశ: సులభంగా వివరించండి (Clarity)', en: 'Outcome: Explain It Simply' },
        prompt: {
          kn: 'Clarity ಪುಟದಲ್ಲಿ "ಸರಳ" ಮತ್ತು "ಅತಿ ಸರಳ" ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ ಹಾಗೂ ಓದಿ ತಿಳಿಯಿರಿ.',
          te: 'Clarity పేజీలో "సులభ" మరియు "అతి సులభ" తెలుగులో చదివి మరియు విని తెలుసుకోండి.',
          en: 'Open CORE Clarity to switch between Simple and Extra Simple explanations with audio playback.',
        },
        explanation: {
          kn: 'ಗಮನಿಸಿ: ಇವು ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ವಿವರಣೆಗಳು; ಅಂತಿಮ ದೃಢೀಕರಣಕ್ಕಾಗಿ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಿ.',
          te: 'గమనిక: ఇవి నమూనా వివరణలు మాత్రమే; తుది నిర్ధారణ కోసం ఆసుపత్రి సిబ్బందిని అడగండి.',
          en: 'Always confirm clinic-specific rules directly with the registration desk.',
        },
        recommendedPage: 'clarity',
        recommendedLabel: { kn: 'CORE Clarity ತೆರೆಯಿರಿ', te: 'CORE Clarity తెరవండి', en: 'Open Explain It Simply' },
      },
      'reg-end-sense': {
        id: 'reg-end-sense',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: CORE Sense ದೃಶ್ಯ ಮಾರ್ಗದರ್ಶಿ', te: 'తదుపరి దశ: CORE Sense దృశ్య మార్గదర్శి', en: 'Outcome: Visual Registration Sequence' },
        prompt: {
          kn: 'CORE Sense ಪುಟದಲ್ಲಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಣ → ಪ್ರವೇಶ → ನೋಂದಣಿ → ಪರೀಕ್ಷೆ ಹಂತಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.',
          te: 'CORE Sense పేజీలో అపాయింట్‌మెంట్ నిర్ధారణ → ఆసుపత్రి ప్రవేశం → నమోదు దశలను చూడండి.',
          en: 'Explore CORE Sense to view the 5-step hospital workflow diagram and practice a quick check-in question.',
        },
        explanation: {
          kn: 'ಹಂತಗಳನ್ನು ಮೊದಲೇ ನೋಡಿದರೆ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಭಯ ಮತ್ತು ಗೊಂದಲ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
          te: 'ముందుగానే దశలు తెలుసుకుంటే ఆసుపత్రిలో కంగారు తగ్గుతుంది.',
          en: 'Seeing the exact administrative order builds calm confidence before arrival.',
        },
        recommendedPage: 'sense',
        recommendedLabel: { kn: 'CORE Sense ತೆರೆಯಿರಿ', te: 'CORE Sense తెరవండి', en: 'Open CORE Sense' },
      },
    },
  },
  {
    id: 'accompany-elder',
    title: {
      kn: 'ಹಿರಿಯ ಸಂಬಂಧಿಕರಿಗೆ ನಾನು ಸಹಾಯ ಮಾಡಬೇಕಿದೆ',
      te: 'వృద్ధులైన మా బంధువును నేను ఆసుపత్రికి తీసుకెళ్ళాలి',
      en: 'I need help accompanying an elderly relative.',
    },
    subtitle: {
      kn: 'ಗೌಪ್ಯತೆ, ಸಿದ್ಧತೆ ಮತ್ತು ಪ್ರಯಾಣದ ಹಂತಗಳನ್ನು ಸಂಘಟಿಸಿ',
      te: 'అనుమతి, తయారీ మరియు ప్రయాణ దశలను సులభంగా నిర్వహించండి',
      en: 'Coordinate consent-first support, checklists, and large-print tools.',
    },
    startNodeId: 'acc-start',
    nodes: {
      'acc-start': {
        id: 'acc-start',
        title: { kn: 'ಹಂತ ೧: ಯಾವ ರೀತಿಯ ಸಹಾಯ ಬೇಕು?', te: 'దశ 1: ఎలాంటి సహాయం కావాలి?', en: 'Step 1: How are you helping today?' },
        prompt: {
          kn: 'ನೀವು ಹಿರಿಯರ ಜೊತೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುತ್ತಿದ್ದೀರಾ ಅಥವಾ ದೂರದಿಂದಲೇ ಜ್ಞಾಪನೆ/ಸಿದ್ಧತೆ ನೋಡಿಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
          te: 'మీరు వారితో ఆసుపత్రికి వెళుతున్నారా లేదా ఇంటి నుండి తయారీని చూస్తున్నారా?',
          en: 'Are you accompanying them physically to the clinic, or coordinating visit timing remotely with their consent?',
        },
        explanation: {
          kn: 'ಹಿರಿಯರು ಸಾಧ್ಯವಾದಷ್ಟು ಸ್ವತಂತ್ರವಾಗಿ ಭಾಗವಹಿಸುವಂತೆ ಪ್ರೋತ್ಸಾಹಿಸುವುದು CORE ಉದ್ದೇಶ.',
          te: 'వృద్ధులు ఆత్మగౌరవంతో భాగస్వామ్యం అయ్యేలా చూడటమే CORE లక్ష్యం.',
          en: 'CORE balances caregiver coordination with patient autonomy and consent.',
        },
        options: [
          {
            id: 'acc-opt-remote',
            label: { kn: 'ರೋಗಿಯ ಸಮ್ಮತಿಯೊಂದಿಗೆ ಭೇಟಿ ಸಮಯ ಮತ್ತು ಪಟ್ಟಿ ಪರಿಶೀಲಿಸಿ', te: 'రోగి అనుమతితో సమయం మరియు జాబితా చూడాలి', en: 'Review consented schedule & printable handoff' },
            nextNodeId: 'acc-end-connect',
          },
          {
            id: 'acc-opt-prep',
            label: { kn: 'ಪ್ರಯಾಣ, ಗಾಲಿಕುರ್ಚಿ ಮತ್ತು ದಾಖಲೆ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ', te: 'ప్రయాణం, వీల్‌చైర్ & పత్రాల జాబితా సిద్ధం చేయాలి', en: 'Organize documents, travel & accessibility checklist' },
            nextNodeId: 'acc-end-compass',
          },
        ],
      },
      'acc-end-connect': {
        id: 'acc-end-connect',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: CareCircle ಹ್ಯಾಂಡ್‌ಆಫ್', te: 'తదుపరి దశ: CareCircle హ్యాండ్‌ఆఫ్', en: 'Outcome: Privacy-First CareCircle Handoff' },
        prompt: {
          kn: 'ರೋಗಿಯು ಸಮ್ಮತಿ ನೀಡಿದ ನಂತರ ಮಾತ್ರ ಸಮಯ, ಕೊಠಡಿ ಮತ್ತು ಸಿದ್ಧತಾ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
          te: 'రోగి అనుమతి ఇచ్చిన తర్వాత మాత్రమే సమయం, గది మరియు జాబితాను చూసి డౌన్‌లోడ్ చేసుకోండి.',
          en: 'Open CareCircle to inspect exact consent toggles and download a clean non-clinical handoff summary.',
        },
        explanation: {
          kn: 'ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಲಿಂಕ್ ರಚಿಸಲಾಗುವುದಿಲ್ಲ.',
          te: 'పబ్లిక్ లింకులు ఏవీ సృష్టించబడవు.',
          en: 'Zero public URLs are created; sharing remains strictly patient-controlled.',
        },
        recommendedPage: 'carecircle',
        recommendedLabel: { kn: 'CareCircle ತೆರೆಯಿರಿ', te: 'CareCircle తెరవండి', en: 'Open CareCircle' },
      },
      'acc-end-compass': {
        id: 'acc-end-compass',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: CareCompass ಭೇಟಿ ಸಿದ್ಧತೆ', te: 'తదుపరి దశ: CareCompass సందర్శన తయారీ', en: 'Outcome: Organize with CareCompass' },
        prompt: {
          kn: 'CareCompass ನಲ್ಲಿ ದಾಖಲೆಗಳು, ಪ್ರಯಾಣ, ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆಯನ್ನು ಹೊಂದಿಸಿ.',
          te: 'CareCompass లో పత్రాలు, ప్రయాణం, ప్రశ్నలు మరియు క్యాలెండర్ రిమైండర్ సెట్ చేయండి.',
          en: 'Use CareCompass to customize accessibility needs, add custom items, and export a calendar reminder.',
        },
        explanation: {
          kn: 'ದಾಖಲೆಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ಜೋಡಿಸುವುದರಿಂದ ಆಸ್ಪತ್ರೆ ಗೇಟ್ ಒತ್ತಡ ತಪ್ಪುತ್ತದೆ.',
          te: 'పత్రాలను ముందే సిద్ధం చేసుకుంటే ఆసుపత్రిలో శ్రమ తగ్గుతుంది.',
          en: 'Clear distinction is kept between generic tips and clinic-verified rules.',
        },
        recommendedPage: 'carecompass',
        recommendedLabel: { kn: 'CareCompass ತೆರೆಯಿರಿ', te: 'CareCompass తెరవండి', en: 'Open CareCompass' },
      },
    },
  },
  {
    id: 'need-reschedule',
    title: {
      kn: 'ನಾನು ನನ್ನ ಭೇಟಿಯ ದಿನಾಂಕವನ್ನು ಬದಲಾಯಿಸಬೇಕಿದೆ',
      te: 'నేను నా అపాయింట్‌మెంట్ తేదీని మార్చుకోవాలి',
      en: 'I need to reschedule my visit.',
    },
    subtitle: {
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ವ್ಯರ್ಥವಾಗಿ ಹೋಗುವ ಬದಲು ಸುಲಭವಾಗಿ ಹೊಸ ಸಮಯ ಆರಿಸಿ',
      te: 'ఆసుపత్రికి వెళ్ళకుండానే సులభంగా కొత్త సమయం ఎంచుకోండి',
      en: 'Avoid wasted travel by selecting another morning or afternoon slot.',
    },
    startNodeId: 'res-start',
    nodes: {
      'res-start': {
        id: 'res-start',
        title: { kn: 'ಹಂತ ೧: ಬದಲಾವಣೆಯ ಕಾರಣ', te: 'దశ 1: మార్పు కారణం', en: 'Step 1: What happened?' },
        prompt: {
          kn: 'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ಇನ್ನೂ ಬರಬೇಕಾಗಿದೆಯೇ ಅಥವಾ ಈಗಾಗಲೇ ತಪ್ಪಿಹೋಗಿದೆಯೇ?',
          te: 'మీ అపాయింట్‌మెంట్ తేదీ ఇంకా రావాల్సి ఉందా లేదా ఇప్పటికే దాటిపోయిందా?',
          en: 'Is your appointment still upcoming, or did you already miss the date due to travel or confusion?',
        },
        explanation: {
          kn: 'ಎರಡೂ ಸಂದರ್ಭಗಳಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಆಸ್ಪತ್ರೆ ಕ್ಯೂನಲ್ಲಿ ನಿಲ್ಲದೆ ಸುಲಭ ಆಯ್ಕೆ ಮಾಡಬಹುದು.',
          te: 'రెండు సందర్భాల్లోనూ మళ్ళీ ఆసుపత్రి క్యూలో నిలబడాల్సిన పని లేకుండా సులభంగా మార్చుకోవచ్చు.',
          en: 'Patients often make unnecessary round trips just to rebook. Here is how CORE helps.',
        },
        options: [
          {
            id: 'res-opt-upcoming',
            label: { kn: 'ಮುಂದಿನ ದಿನಾಂಕ ಬೇಕು / ಉಪವಾಸ ಮಾಡಲು ಆಗಲಿಲ್ಲ', te: 'వేరే తేదీ కావాలి / ఉపవాసం కుదరలేదు', en: 'Pick a new upcoming date (or fasting was broken)' },
            nextNodeId: 'res-end-slots',
          },
          {
            id: 'res-opt-remind',
            label: { kn: 'ಮುಂದಿನ ಬಾರಿ ಮರೆಯದಿರಲು ಧ್ವನಿ ಜ್ಞಾಪನೆ ಬೇಕು', te: 'మళ్ళీ మర్చిపోకుండా వాయిస్ రిమైండర్ కావాలి', en: 'Set up stronger voice reminders so it is not missed' },
            nextNodeId: 'res-end-reminders',
          },
        ],
      },
      'res-end-slots': {
        id: 'res-end-slots',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ೨ ಹಂತಗಳಲ್ಲಿ ದಿನಾಂಕ ಬದಲಿಸಿ', te: 'తదుపరి దశ: 2 దశల్లో తేదీ మార్చండి', en: 'Outcome: 2-Step Easy Reschedule' },
        prompt: {
          kn: 'ದಿನಾಂಕ ಬದಲಿಸಿ ಪುಟದಲ್ಲಿ ನಿಮಗೆ ಅನುಕೂಲವಾಗುವ ಬೆಳಗ್ಗೆ ಅಥವಾ ಮಧ್ಯಾಹ್ನದ ಸಮಯವನ್ನು ಒತ್ತಿ ದೃಢೀಕರಿಸಿ.',
          te: 'తేదీ మార్చండి పేజీలో మీకు వీలైన ఉదయం లేదా మధ్యాహ్న సమయాన్ని ఎంచుకోండి.',
          en: 'Open Reschedule to select a convenient date and morning/afternoon slot in this demonstration.',
        },
        explanation: {
          kn: 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಗಮನಿಸಿ: ನೈಜ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಇದು ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್ ವ್ಯವಸ್ಥೆಗೆ ಸಂಪರ್ಕ ಹೊಂದಿರುತ್ತದೆ.',
          te: 'డెమో గమనిక: నిజమైన ఆసుపత్రిలో ఇది బుకింగ్ సిస్టమ్‌తో అనుసంధానమై ఉంటుంది.',
          en: 'Simulation note: live hospital scheduling requires HIS backend integration.',
        },
        recommendedPage: 'reschedule',
        recommendedLabel: { kn: 'ದಿನಾಂಕ ಬದಲಿಸಿ ತೆರೆಯಿರಿ', te: 'తేదీ మార్చండి తెరవండి', en: 'Open Reschedule' },
      },
      'res-end-reminders': {
        id: 'res-end-reminders',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ಧ್ವನಿ ಮತ್ತು SMS ಜ್ಞಾಪನೆಗಳು', te: 'తదుపరి దశ: వాయిస్ & SMS రిమైండర్లు', en: 'Outcome: Native Voice & SMS Reminders' },
        prompt: {
          kn: 'ಜ್ಞಾಪನೆಗಳು ಪುಟದಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತ ಕನ್ನಡ/ತೆಲುಗು ಫೋನ್ ಕರೆ ಮತ್ತು SMS ಆಯ್ಕೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.',
          te: 'రిమైండర్లు పేజీలో ఆటోమేటిక్ తెలుగు/కన్నడ ఫోన్ కాల్ మరియు SMS అలర్ట్‌లను పరీక్షించండి.',
          en: 'Visit Reminders to test automated spoken phone calls and native-script SMS alerts.',
        },
        explanation: {
          kn: 'ಧ್ವನಿ ಕರೆಯಿಂದ ಓದು ಬಾರದ ಹಿರಿಯರಿಗೂ ಸಮಯ ಮರೆಯುವುದಿಲ್ಲ.',
          te: 'వాయిస్ కాల్ ద్వారా చదువు రాని వృద్ధులకు కూడా సమయం గుర్తుంటుంది.',
          en: 'Voice calls work even on basic feature phones without internet.',
        },
        recommendedPage: 'reminders',
        recommendedLabel: { kn: 'ಜ್ಞಾಪನೆಗಳು ತೆರೆಯಿರಿ', te: 'రిమైండర్లు తెరవండి', en: 'Open Reminders' },
      },
    },
  },
  {
    id: 'after-consultation',
    title: {
      kn: 'ತಪಾಸಣೆ ಮುಗಿದ ನಂತರ ಏನು ಮಾಡಬೇಕೆಂದು ತಿಳಿಯುತ್ತಿಲ್ಲ',
      te: 'పరీక్ష / డాక్టర్ కన్సల్టేషన్ తర్వాత ఏమి చేయాలో తెలియడం లేదు',
      en: 'I do not know what to do after my consultation.',
    },
    subtitle: {
      kn: 'ವರದಿ ಪಡೆಯುವ ದಿನ, ಮುಂದಿನ ಭೇಟಿ ಮತ್ತು ಜ್ಞಾಪನೆ ಕ್ರಮಗಳು',
      te: 'రిపోర్ట్ సేకరణ, తదుపరి సందర్శన మరియు రిమైండర్ దశలు',
      en: 'Clear steps for report collection, follow-up reminders, and sharing updates.',
    },
    startNodeId: 'aft-start',
    nodes: {
      'aft-start': {
        id: 'aft-start',
        title: { kn: 'ಹಂತ ೧: ನಿಮ್ಮ ಭೇಟಿಯ ನಂತರದ ಅಗತ್ಯ', te: 'దశ 1: సందర్శన తర్వాత అవసరం', en: 'Step 1: What do you need next?' },
        prompt: {
          kn: 'ಪರೀಕ್ಷಾ ವರದಿ ತೆಗೆದುಕೊಳ್ಳುವ ಹಂತವನ್ನು ತಿಳಿಯಬೇಕೇ ಅಥವಾ ಮುಂದಿನ ಭೇಟಿಗೆ ಸಿದ್ಧವಾಗಬೇಕೇ?',
          te: 'రిపోర్ట్ ఎప్పుడు తీసుకోవాలో తెలుసుకోవాలా లేదా తదుపరి సందర్శనకు సిద్ధమవ్వాలా?',
          en: 'Do you want to review post-visit steps and report collection, or organize your follow-up reminder?',
        },
        explanation: {
          kn: 'ಭೇಟಿಯ ನಂತರದ ಸರಳ ಹಂತಗಳು ಮತ್ತೊಮ್ಮೆ ತಪ್ಪಿದ ಭೇಟಿಗಳನ್ನು ತಡೆಯುತ್ತವೆ.',
          te: 'సందర్శన తర్వాత స్పష్టమైన దశలు తదుపరి భేటీని మర్చిపోకుండా సహాయపడతాయి.',
          en: 'Clear wrap-up steps help prevent missed diagnostic follow-ups.',
        },
        options: [
          {
            id: 'aft-opt-journey',
            label: { kn: '"ಭೇಟಿಯ ನಂತರ" ಚೆಕ್‌ಲಿಸ್ಟ್ ನೋಡಿ', te: '"సందర్శన తర్వాత" జాబితా చూడాలి', en: 'See the "After My Visit" checklist steps' },
            nextNodeId: 'aft-end-journey',
          },
          {
            id: 'aft-opt-compass',
            label: { kn: 'ವರದಿ ಪಡೆಯುವ ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ ಸೇರಿಸಿ', te: 'రిపోర్ట్ సేకరణ క్యాలెండర్ రిమైండర్ పెట్టాలి', en: 'Save a follow-up reminder & checklist' },
            nextNodeId: 'aft-end-compass',
          },
        ],
      },
      'aft-end-journey': {
        id: 'aft-end-journey',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ನನ್ನ ಆರೈಕೆ ಪಯಣ', te: 'తదుపరి దశ: నా ఆరోగ్య ప్రయాణం', en: 'Outcome: Review After My Visit Stage' },
        prompt: {
          kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ ಪುಟದಲ್ಲಿ ೩ನೇ ಹಂತವಾದ "ಭೇಟಿಯ ನಂತರ" ವಿಭಾಗವನ್ನು ತೆರೆದು ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ಟಿಕ್ ಮಾಡಿ.',
          te: 'నా ఆరోగ్య ప్రయాణం పేజీలో "సందర్శన తర్వాత" దశను తెరిచి ప్రతి అంశాన్ని టిక్ చేయండి.',
          en: 'Open My Care Journey and expand Stage 3 ("After My Visit") to hear and check off report-collection steps.',
        },
        explanation: {
          kn: 'ಪ್ರಗತಿ ಪಟ್ಟಿಯು ನೀವು ಪೂರ್ಣಗೊಳಿಸಿದ ಹಂತಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸುತ್ತದೆ.',
          te: 'ప్రోగ్రెస్ బార్ మీరు పూర్తి చేసిన దశలను స్పష్టంగా చూపుతుంది.',
          en: 'Completing wrap-up checklists keeps both patient and family aligned.',
        },
        recommendedPage: 'journey',
        recommendedLabel: { kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ ತೆರೆಯಿರಿ', te: 'నా ఆరోగ్య ప్రయాణం తెరవండి', en: 'Open My Care Journey' },
      },
      'aft-end-compass': {
        id: 'aft-end-compass',
        title: { kn: 'ಮುಂದಿನ ಹಂತ: ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ', te: 'తదుపరి దశ: క్యాలెండర్ రిమైండర్', en: 'Outcome: Export Follow-Up Reminder' },
        prompt: {
          kn: 'CareCompass ನಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ವರದಿ ಸಂಗ್ರಹಣೆಗಾಗಿ ಕ್ಯಾಲೆಂಡರ್ (.ics) ಅಥವಾ ಬ್ರೌಸರ್ ಜ್ಞಾಪನೆಯನ್ನು ಉಳಿಸಿ.',
          te: 'CareCompass లో మీ రిపోర్ట్ సేకరణ కోసం క్యాలెండర్ (.ics) రిమైండర్‌ను సేవ్ చేసుకోండి.',
          en: 'Use CareCompass to add a custom report-collection task and download a calendar reminder.',
        },
        explanation: {
          kn: 'ಇದು ಸಂಪೂರ್ಣವಾಗಿ ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಕೆಲಸ ಮಾಡುವ ಸಿದ್ಧತಾ ಸಾಧನವಾಗಿದೆ.',
          te: 'ఇది ఆఫ్‌లైన్‌లో కూడా పనిచేసే సులభమైన సాధనం.',
          en: 'Calendar files work locally on your device without server storage.',
        },
        recommendedPage: 'carecompass',
        recommendedLabel: { kn: 'CareCompass ತೆರೆಯಿರಿ', te: 'CareCompass తెరవండి', en: 'Open CareCompass' },
      },
    },
  },
];

/* =========================================================
   FEATURE 7: CORE ACCESSIBILITY LAB (Usability Scenarios)
   ========================================================= */

export interface AccessibilityLabProfile {
  id: string;
  title: Record<Language, string>;
  scenarioNote: Record<Language, string>;
  recommendedLanguage?: Language;
  comfortPatch: ComfortSettings;
  supportedNeeds: Array<Record<Language, string>>;
}

export const LAB_PROFILES: AccessibilityLabProfile[] = [
  {
    id: 'first-time-digital',
    title: {
      kn: 'ಮೊದಲ ಬಾರಿ ಡಿಜಿಟಲ್ ಬಳಕೆದಾರ ಸನ್ನಿವೇಶ',
      te: 'మొదటిసారి డిజిటల్ వినియోగదారు దృశ్యం',
      en: 'First-Time Digital User Scenario',
    },
    scenarioNote: {
      kn: 'ನ್ಯಾವಿಗೇಷನ್ ಕಡಿಮೆ ಗೊಂದಲವಿರುವಂತೆ ಸರಳ ಮೆನು ಮತ್ತು ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
      te: 'మెనూ గందరగోళం లేకుండా సరళమైన బటన్లు మరియు దశల వారీ సహాయాన్ని చూపుతుంది.',
      en: 'Configured to reduce top-bar visual choices and guide the user one calm step at a time.',
    },
    comfortPatch: {
      textSize: 'large',
      highContrast: false,
      reduceMotion: false,
      simplifiedNav: true,
      largeButtons: true,
      readAloud: true,
      guidedMode: true,
    },
    supportedNeeds: [
      { kn: 'ಸರಳೀಕೃತ 4-ಲಿಂಕ್ ಮೆನು', te: 'సరళమైన 4-లింక్ మెనూ', en: 'Simplified 4-link navigation bar' },
      { kn: 'ದೊಡ್ಡ ಸ್ಪರ್ಶ ಬಟನ್‌ಗಳು (52px+)', te: 'పెద్ద టచ్ బటన్లు (52px+)', en: 'Enlarged 52px+ interactive buttons' },
      { kn: 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ ಪಟ್ಟಿ', te: 'దశల వారీ మార్గదర్శి బార్', en: 'Step-by-step Guided Mode bar' },
    ],
  },
  {
    id: 'older-large-text',
    title: {
      kn: 'ದೊಡ್ಡ ಅಕ್ಷರ ಮತ್ತು ಶಾಂತ ಪರದೆ ಆದ್ಯತೆ',
      te: 'పెద్ద అక్షరాలు మరియు ప్రశాంత స్క్రీన్ ప్రాధాన్యత',
      en: 'Older Adult Large-Text & Calm Motion Scenario',
    },
    scenarioNote: {
      kn: 'ಕಣ್ಣಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಲು A++ ಅಕ್ಷರ, ದೊಡ್ಡ ಬಟನ್ ಮತ್ತು ಕಡಿಮೆ ಚಲನೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತದೆ.',
      te: 'కంటికి స్పష్టంగా కనిపించేందుకు A++ అక్షరాలు, పెద్ద బటన్లు మరియు తక్కువ కదలికలు.',
      en: 'Prioritizes A++ typography, large touch zones, and zero distracting animations.',
    },
    comfortPatch: {
      textSize: 'xlarge',
      highContrast: false,
      reduceMotion: true,
      simplifiedNav: false,
      largeButtons: true,
      readAloud: true,
      guidedMode: false,
    },
    supportedNeeds: [
      { kn: 'ಅತ್ಯಂತ ದೊಡ್ಡ ಅಕ್ಷರ ಗಾತ್ರ (A++)', te: 'చాలా పెద్ద అక్షరాలు (A++)', en: 'Extra-large A++ typography scaling' },
      { kn: 'ಚಲನೆ ರಹಿತ ಶಾಂತ ಪ್ರದರ್ಶನ', te: 'కదలికలు లేని ప్రశాంత స్క్రీన్', en: 'Reduced-motion calm transitions' },
      { kn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಸಕ್ರಿಯ', te: 'వాయిస్ సహాయం ఆన్', en: 'Spoken audio confirmation support' },
    ],
  },
  {
    id: 'kannada-patient',
    title: {
      kn: 'ಕನ್ನಡ ಭಾಷಾ ಪ್ರಧಾನ ರೋಗಿ ಸನ್ನಿವೇಶ',
      te: 'కన్నడ భాషా ప్రాధాన్య రోగి దృశ్యం',
      en: 'Kannada-Speaking Patient Scenario',
    },
    scenarioNote: {
      kn: 'ಸಂಪೂರ್ಣ ವೆಬ್‌ಸೈಟ್ ಕನ್ನಡ ಲಿಪಿಗೆ ಮತ್ತು ಕನ್ನಡ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ.',
      te: 'మొత్తం వెబ్‌సైట్ కన్నడ లిపి మరియు వాయిస్ సహాయంలోకి మారుతుంది.',
      en: 'Switches all labels, Clarity terms, and spoken readouts natively to Kannada.',
    },
    recommendedLanguage: 'kn',
    comfortPatch: {
      textSize: 'large',
      highContrast: false,
      reduceMotion: false,
      simplifiedNav: true,
      largeButtons: true,
      readAloud: true,
      guidedMode: true,
    },
    supportedNeeds: [
      { kn: 'ಕನ್ನಡ UI ಮತ್ತು Noto Sans Kannada ಲಿಪಿ', te: 'కన్నడ లిపి మరియు స్పష్టమైన ఫాంట్', en: 'Native Kannada script typography' },
      { kn: 'ಸರಳ ಕನ್ನಡ ಧ್ವನಿ ವಿವರಣೆ', te: 'సులభమైన కన్నడ వాయిస్ వివరణ', en: 'Plain-language Kannada spoken readout' },
      { kn: 'ಮಾರ್ಗದರ್ಶಿ ಹಂತಗಳು ಸಕ್ರಿಯ', te: 'దశల వారీ సహాయం ఆన్', en: 'Guided step bar for first visits' },
    ],
  },
  {
    id: 'telugu-caregiver',
    title: {
      kn: 'ತೆಲುಗು ಭಾಷಾ ಆರೈಕೆದಾರ ಸನ್ನಿವೇಶ',
      te: 'తెలుగు భాషా సంరక్షకుల దృశ్యం',
      en: 'Telugu-Speaking Caregiver Scenario',
    },
    scenarioNote: {
      kn: 'ತೆಲುಗು ಭಾಷೆಯಲ್ಲಿ ತ್ವರಿತವಾಗಿ ವೇಳಾಪಟ್ಟಿ, CareCircle ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್ ನೋಡಲು ಅನುಕೂಲ.',
      te: 'తెలుగులో త్వరగా సమయం, CareCircle అనుమతి మరియు పాస్‌పోర్ట్ చూడటానికి అనుకూలం.',
      en: 'Configures Telugu language with balanced typography for coordinating care smoothly.',
    },
    recommendedLanguage: 'te',
    comfortPatch: {
      textSize: 'normal',
      highContrast: false,
      reduceMotion: false,
      simplifiedNav: false,
      largeButtons: false,
      readAloud: true,
      guidedMode: false,
    },
    supportedNeeds: [
      { kn: 'ಸಂಪೂರ್ಣ ತೆಲುಗು ಇಂಟರ್‌ಫೇಸ್', te: 'పూర్తి తెలుగు ఇంటర్‌ఫేస్', en: 'Complete Telugu UI and checklists' },
      { kn: 'CareCircle ಹ್ಯಾಂಡ್‌ಆಫ್ ಪೂರ್ವವೀಕ್ಷಣೆ', te: 'CareCircle హ్యాండ్‌ఆఫ్ ప్రివ్యూ', en: 'Consented Caregiver Handoff workflow' },
      { kn: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಪ್ರಿಂಟ್ ಸಿದ್ಧತೆ', te: 'పాస్‌పోర్ట్ ప్రింట్ సన్నద్ధత', en: 'Printable Telugu Visit Passport' },
    ],
  },
  {
    id: 'keyboard-navigator',
    title: {
      kn: 'ಕೀಬೋರ್ಡ್ ಮತ್ತು ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಬಳಕೆದಾರ ಸನ್ನಿವೇಶ',
      te: 'కీబోర్డ్ మరియు హై-కాంట్రాస్ట్ వినియోగదారు దృశ్యం',
      en: 'Keyboard Navigation & High-Contrast Scenario',
    },
    scenarioNote: {
      kn: 'ಗರಿಷ್ಠ ಕಾಂಟ್ರಾಸ್ಟ್, ಸ್ಪಷ್ಟ ಫೋಕಸ್ ಉಂಗುರಗಳು ಮತ್ತು Tab/Enter ಕೀಬೋರ್ಡ್ ನ್ಯಾವಿಗೇಷನ್ ತೋರಿಸುತ್ತದೆ.',
      te: 'అధిక కాంట్రాస్ట్, స్పష్టమైన ఫోకస్ రింగులు మరియు Tab/Enter కీబోర్డ్ నావిగేషన్ చూపుతుంది.',
      en: 'Applies high-contrast colors, reduced motion, and clear keyboard focus indicators.',
    },
    comfortPatch: {
      textSize: 'large',
      highContrast: true,
      reduceMotion: true,
      simplifiedNav: false,
      largeButtons: true,
      readAloud: false,
      guidedMode: false,
    },
    supportedNeeds: [
      { kn: 'ಗರಿಷ್ಠ ಕಾಂಟ್ರಾಸ್ಟ್ ಕಪ್ಪು/ಹಳದಿ ಬಣ್ಣ', te: 'హై-కాంట్రాస్ట్ నలుపు/పసుపు రంగులు', en: 'High-contrast accessible palette' },
      { kn: 'ಸ್ಪಷ್ಟ Tab ಫೋಕಸ್ ಮತ್ತು ARIA ಲೇಬಲ್‌ಗಳು', te: 'స్పష్టమైన Tab ఫోకస్ మరియు ARIA లేబుల్స్', en: 'Semantic buttons, ARIA labels & focus rings' },
      { kn: 'ಶೂನ್ಯ ಆನಿಮೇಷನ್ ಅಡೆತಡೆ', te: 'జీరో యానిమేషన్ అంతరాయం', en: 'Zero distracting motion transitions' },
    ],
  },
];

/* =========================================================
   FEATURE 8: CORE INSIGHTS (Fictional Usability Demo Dataset)
   ========================================================= */

export interface InsightsSegment {
  id: string;
  languageFilter: 'all' | Language;
  groupFilter: 'all' | 'first_time' | 'returning' | 'caregiver';
  completionRatePct: number;
  avgStepsPerAction: number;
  avgCompletionSeconds: number;
  languageDistribution: Array<{ label: string; pct: number; color: string }>;
  accessibilityUsage: Array<{ label: Record<Language, string>; pct: number }>;
  commonDifficulties: Array<{ label: Record<Language, string>; frequencyPct: number }>;
}

export const INSIGHTS_DEMO_SEGMENTS: InsightsSegment[] = [
  {
    id: 'all-all',
    languageFilter: 'all',
    groupFilter: 'all',
    completionRatePct: 86,
    avgStepsPerAction: 3.4,
    avgCompletionSeconds: 74,
    languageDistribution: [
      { label: 'Kannada (ಕನ್ನಡ)', pct: 46, color: '#BEA06D' },
      { label: 'Telugu (తెలుగు)', pct: 32, color: '#A2B29B' },
      { label: 'English', pct: 22, color: '#C98897' },
    ],
    accessibilityUsage: [
      { label: { kn: 'ಧ್ವನಿ ಓದುವಿಕೆ (Read-Aloud)', te: 'వాయిస్ సహాయం (Read-Aloud)', en: 'Voice Read-Aloud Support' }, pct: 68 },
      { label: { kn: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು (A+ / A++)', te: 'పెద్ద అక్షరాలు (A+ / A++)', en: 'Large Text (A+ / A++)' }, pct: 54 },
      { label: { kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ (Guided Mode)', te: 'గైడెడ్ మోడ్ (Guided Mode)', en: 'Elderly Guided Mode' }, pct: 41 },
      { label: { kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ (High Contrast)', te: 'హై కాంట్రాస్ట్ మోడ్', en: 'High-Contrast Mode' }, pct: 19 },
    ],
    commonDifficulties: [
      { label: { kn: 'ಇಂಗ್ಲಿಷ್ ಉಪವಾಸ ಪದಗಳು (NPO) ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು', te: 'ఇంగ్లీష్ ఉపవాస పదాలు (NPO) అర్థం చేసుకోవడం', en: 'Decoding English fasting acronyms (NPO)' }, frequencyPct: 52 },
      { label: { kn: 'ನೋಂದಣಿ ಕೌಂಟರ್ ಮತ್ತು ಬ್ಲಾಕ್ ಹುಡುಕುವುದು', te: 'రిజిస్ట్రేషన్ కౌంటర్ మరియు బ్లాక్ కనుగొనడం', en: 'Finding registration counter vs. scan room' }, frequencyPct: 38 },
      { label: { kn: 'ವರದಿ ಪಡೆಯುವ ದಿನಾಂಕ ಮರೆಯುವುದು', te: 'రిపోర్ట్ సేకరణ తేదీ మర్చిపోవడం', en: 'Uncertainty around report collection timing' }, frequencyPct: 29 },
    ],
  },
  {
    id: 'kn-first_time',
    languageFilter: 'kn',
    groupFilter: 'first_time',
    completionRatePct: 81,
    avgStepsPerAction: 4.1,
    avgCompletionSeconds: 92,
    languageDistribution: [
      { label: 'Kannada (ಕನ್ನಡ)', pct: 100, color: '#BEA06D' },
    ],
    accessibilityUsage: [
      { label: { kn: 'ಧ್ವನಿ ಓದುವಿಕೆ (Read-Aloud)', te: 'వాయిస్ సహాయం', en: 'Voice Read-Aloud Support' }, pct: 79 },
      { label: { kn: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು (A+ / A++)', te: 'పెద్ద అక్షరాలు', en: 'Large Text (A+ / A++)' }, pct: 64 },
      { label: { kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ (Guided Mode)', te: 'గైడెడ్ మోడ్', en: 'Elderly Guided Mode' }, pct: 58 },
      { label: { kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್', te: 'హై కాంట్రాస్ట్', en: 'High-Contrast Mode' }, pct: 24 },
    ],
    commonDifficulties: [
      { label: { kn: 'ಕ್ರಿಯೇಟಿನಿನ್ ವರದಿ ಏಕೆ ಬೇಕು ಎಂಬ ಗೊಂದಲ', te: 'క్రియాటినిన్ రిపోర్ట్ గందరగోళం', en: 'Why prior Creatinine blood test is needed' }, frequencyPct: 58 },
      { label: { kn: '೩೦ ನಿಮಿಷ ಮುಂಚೆ ತಲುಪುವ ಅವಶ್ಯಕತೆ', te: '30 నిమిషాలు ముందు రావడం', en: 'Difference between reporting time and scan slot' }, frequencyPct: 44 },
      { label: { kn: 'ದಿನಾಂಕ ಬದಲಾವಣೆ ಖಚಿತಪಡಿಸುವಿಕೆ', te: 'తేదీ మార్పు నిర్ధారణ', en: 'Confirming rescheduled slot timing' }, frequencyPct: 27 },
    ],
  },
  {
    id: 'te-caregiver',
    languageFilter: 'te',
    groupFilter: 'caregiver',
    completionRatePct: 93,
    avgStepsPerAction: 2.8,
    avgCompletionSeconds: 56,
    languageDistribution: [
      { label: 'Telugu (తెలుగు)', pct: 100, color: '#A2B29B' },
    ],
    accessibilityUsage: [
      { label: { kn: 'ಧ್ವನಿ ಓದುವಿಕೆ', te: 'వాయిస్ సహాయం', en: 'Voice Read-Aloud Support' }, pct: 49 },
      { label: { kn: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು', te: 'పెద్ద అక్షరాలు', en: 'Large Text (A+ / A++)' }, pct: 38 },
      { label: { kn: 'ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್', te: 'గైడెడ్ మోడ్', en: 'Elderly Guided Mode' }, pct: 29 },
      { label: { kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್', te: 'హై కాంట్రాస్ట్', en: 'High-Contrast Mode' }, pct: 14 },
    ],
    commonDifficulties: [
      { label: { kn: 'ಆಸ್ಪತ್ರೆ ಗೇಟ್‌ನಿಂದ ವಿಭಾಗ ತಲುಪುವ ದಾರಿ', te: 'గేటు నుండి విభాగానికి దారి', en: 'Gate-to-block walking directions inside campus' }, frequencyPct: 36 },
      { label: { kn: 'ರೋಗಿ ಸಮ್ಮತಿ ಹಂಚಿಕೆ ಆಯ್ಕೆಗಳು', te: 'రోగి అనుమతి సెట్టింగ్స్', en: 'Understanding consent-based sharing toggles' }, frequencyPct: 22 },
      { label: { kn: 'ಕ್ಯಾಲೆಂಡರ್ ಜ್ಞಾಪನೆ ಉಳಿಸುವುದು', te: 'క్యాలెండర్ రిమైండర్ సేవ్ చేయడం', en: 'Saving offline calendar reminders' }, frequencyPct: 18 },
    ],
  },
];

export const INSIGHTS_IMPROVEMENTS = [
  {
    id: 'imp-npo',
    metricRef: { kn: '೫೨% ಜನರಿಗೆ NPO ಗೊಂದಲ', te: '52% మందికి NPO గందరగోళం', en: '52% struggled with English fasting acronyms' },
    action: {
      kn: 'CORE Clarity ಮತ್ತು CORE Sense ನಲ್ಲಿ "Extra Simple" ಒಂದು ವಾಕ್ಯದ ಆಹಾರ ನಿಯಮ ಹಾಗೂ ಧ್ವನಿ ವಿವರಣೆಯನ್ನು ಮೊದಲಿಗೆ ತೋರಿಸುವುದು.',
      te: 'CORE Clarity మరియు Sense లో "అతి సులభ" ఒకే వాక్యపు ఆహార నియమం మరియు వాయిస్ వివరణను ముందుగా చూపించడం.',
      en: 'Surface "Extra Simple" one-sentence dietary instructions directly inside Appointment cards and Sense quizzes.',
    },
  },
  {
    id: 'imp-desk',
    metricRef: { kn: '೩೮% ಜನರಿಗೆ ಕೌಂಟರ್ ಹುಡುಕುವ ಕಷ್ಟ', te: '38% మందికి కౌంటర్ కనుగొనే కష్టం', en: '38% unsure about registration vs. scan desk' },
    action: {
      kn: 'CORE Sense ದೃಶ್ಯ ಹಂತಗಳು ಮತ್ತು ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್‌ನಲ್ಲಿ ಬ್ಲಾಕ್/ಕೊಠಡಿ ಸಂಖ್ಯೆಯನ್ನು ದೊಡ್ಡ ಅಕ್ಷರಗಳಲ್ಲಿ ಪ್ರಿಂಟ್ ಮಾಡುವುದು.',
      te: 'CORE Sense దృశ్య దశలు మరియు విజిట్ పాస్‌పోర్ట్‌లో బ్లాక్/గది నంబర్‌ను పెద్దగా ప్రింట్ చేయడం.',
      en: 'Highlight Block & Room numbers in Visit Passport and pair them with the 5-step visual arrival diagram.',
    },
  },
  {
    id: 'imp-first-visit',
    metricRef: { kn: 'ಮೊದಲ ಭೇಟಿದಾರರಿಗೆ 4.1 ಹಂತಗಳು', te: 'మొదటి సందర్శకులకు 4.1 దశలు', en: '4.1 avg steps for first-time visitors' },
    action: {
      kn: 'CORE Intelligence ಮೂಲಕ ಮೊದಲ ಭೇಟಿದಾರರಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸರಳ ನ್ಯಾವಿಗೇಷನ್ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ಮೋಡ್ ಸೂಚಿಸುವುದು.',
      te: 'CORE Intelligence ద్వారా మొదటి సందర్శకులకు సులభ మెనూ మరియు గైడెడ్ మోడ్ సూచించడం.',
      en: 'Use CORE Intelligence onboarding to automatically offer Simplified Navigation + Guided Mode to first-time visitors.',
    },
  },
];
