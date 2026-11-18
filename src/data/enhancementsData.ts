import { Language, PageView } from '../types';

export interface JourneyTask {
  id: string;
  label: Record<Language, string>;
  helper: Record<Language, string>;
}

export interface JourneyStage {
  id: 'before' | 'during' | 'after';
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  guidance: Record<Language, string>;
  tasks: JourneyTask[];
}

export const CARE_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'before',
    title: {
      kn: 'ಭೇಟಿಗೆ ಮುನ್ನ (Before My Visit)',
      te: 'సందర్శనకు ముందు (Before My Visit)',
      en: 'Before My Visit',
    },
    subtitle: {
      kn: 'ಪರೀಕ್ಷೆಯ ಹಿಂದಿನ ದಿನ ಮತ್ತು ಮುಂಜಾನೆ ಮಾಡಬೇಕಾದ ಸರಳ ಸಿದ್ಧತೆಗಳು',
      te: 'పరీక్షకు ముందు రోజు మరియు ఉదయం చేయవలసిన సాధారణ ఏర్పాట్లు',
      en: 'Calm preparation the evening before and morning of your visit',
    },
    guidance: {
      kn: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕವನ್ನು ಖಚಿತಪಡಿಸಿ, ಹಳೆಯ ವರದಿಗಳನ್ನು ಒಂದು ಚೀಲದಲ್ಲಿ ಇಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ಆಸ್ಪತ್ರೆ ನೀಡಿದ ಆಹಾರ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ.',
      te: 'మీ స్కాన్ తేదీని నిర్ధారించుకోండి, పాత రిపోర్టులను ఒక బ్యాగ్‌లో సిద్ధంగా ఉంచుకోండి మరియు ఆసుపత్రి ఇచ్చిన ఆహార నియమాలను పాటించండి.',
      en: 'Confirm your visit date, gather previous reports in one folder, and follow the hospital-provided fasting guidance.',
    },
    tasks: [
      {
        id: 'task-fasting',
        label: {
          kn: 'ಪರೀಕ್ಷೆಗೆ ೪ ಗಂಟೆ ಮುಂಚೆ ಘನ ಆಹಾರ ಸೇವಿಸದಿರಲು ಸಿದ್ಧತೆ',
          te: 'స్కాన్‌కు 4 గంటల ముందు ఘన ఆహారం తీసుకోకుండా సిద్ధం అవ్వడం',
          en: 'Follow 4-hour pre-scan fasting instruction (plain water sips allowed)',
        },
        helper: {
          kn: 'ಆಸ್ಪತ್ರೆ ಅನುಮೋದಿತ ನಿಯಮ — ಸಂದೇಹವಿದ್ದರೆ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಿ',
          te: 'ఆసుపత్రి సూచన — సందేహం ఉంటే సిబ్బందిని అడగండి',
          en: 'Hospital-approved note — confirm with staff if you take morning tablets',
        },
      },
      {
        id: 'task-reports',
        label: {
          kn: 'ಹಳೆಯ ರಕ್ತ ಪರೀಕ್ಷೆ (Creatinine) ಮತ್ತು ವೈದ್ಯರ ಚೀಟಿ ಜೋಡಿಸಿ',
          te: 'పాత రక్త పరీక్ష (Creatinine) మరియు డాక్టర్ చీటీ సిద్ధం చేయడం',
          en: 'Pack Serum Creatinine lab report, previous scans, and ID card',
        },
        helper: {
          kn: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಪರೀಕ್ಷೆ ಮಾಡಿಸುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆ',
          te: 'ఆసుపత్రిలో మళ్ళీ పరీక్ష చేయాల్సిన అవసరం లేకుండా సహాయపడుతుంది',
          en: 'Helps radiology staff review your readiness quickly',
        },
      },
      {
        id: 'task-travel',
        label: {
          kn: 'ಬಸ್ ಅಥವಾ ವಾಹನದ ಸಮಯ ಮತ್ತು ಜೊತೆಗೆ ಬರುವವರನ್ನು ಖಚಿತಪಡಿಸಿ',
          te: 'బస్సు లేదా వాహన సమయం మరియు తోడుగా వచ్చే వారిని ఖరారు చేసుకోవడం',
          en: 'Plan morning transport to arrive 30 minutes before reporting time',
        },
        helper: {
          kn: 'ತಡವಾದರೆ ದಿನಾಂಕ ಬದಲಾವಣೆ ಪುಟದಲ್ಲಿ ಸುಲಭವಾಗಿ ಹೊಸ ಸಮಯ ಆರಿಸಬಹುದು',
          te: 'వీలు కాకపోతే రీషెడ్యూల్ పేజీలో సులభంగా కొత్త సమయం ఎంచుకోవచ్చు',
          en: 'If travel is difficult, use Reschedule to pick another morning or afternoon slot',
        },
      },
    ],
  },
  {
    id: 'during',
    title: {
      kn: 'ಭೇಟಿಯ ಸಮಯದಲ್ಲಿ (During My Visit)',
      te: 'సందర్శన సమయంలో (During My Visit)',
      en: 'During My Visit',
    },
    subtitle: {
      kn: 'ಆಸ್ಪತ್ರೆ ತಲುಪಿದ ನಂತರದ ಸರಳ ಹಂತಗಳು ಮತ್ತು ತಲುಪುವ ಮಾರ್ಗ',
      te: 'ఆసుపత్రికి చేరుకున్న తర్వాత చేయవలసిన సులభమైన దశలు',
      en: 'Arrival, desk check-in, and calm step-by-step guidance at the hospital',
    },
    guidance: {
      kn: 'ಮುಖ್ಯ ದ್ವಾರದಿಂದ ಎಡಕ್ಕೆ ಬ್ಲಾಕ್ B ಗೆ ಹೋಗಿ, ಕೊಠಡಿ ೧೦೪ರ ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ತೋರಿಸಿ.',
      te: 'ప్రధాన గేటు నుండి ఎడమవైపు బ్లాక్ B కి వెళ్లి, గది 104 రిసెప్షన్ వద్ద మీ విజిట్ పాస్‌పోర్ట్ చూపించండి.',
      en: 'Turn left from the main gate toward Block B, Room 104, and show your Visit Passport at the radiology reception.',
    },
    tasks: [
      {
        id: 'task-checkin',
        label: {
          kn: 'ಬ್ಲಾಕ್ B, ಕೊಠಡಿ ೧೦೪ರಲ್ಲಿ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ / ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ತೋರಿಸಿ',
          te: 'బ్లాక్ B, గది 104లో మీ విజిట్ పాస్‌పోర్ట్ / అపాయింట్‌మెంట్ చూపించడం',
          en: 'Check in at Diagnostic Wing, Block B, Room 104 reception desk',
        },
        helper: {
          kn: 'ಸಿಬ್ಬಂದಿಗೆ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆ (ಕನ್ನಡ / ತೆಲುಗು) ತಿಳಿಸಿ',
          te: 'సిబ్బందికి మీకు నచ్చిన భాష (తెలుగు / కన్నడ) తెలియజేయండి',
          en: 'You may request assistance in your preferred language at the desk',
        },
      },
      {
        id: 'task-metal',
        label: {
          kn: 'ಲೋಹದ ಆಭರಣ, ವಾಚ್ ಅಥವಾ ಕೀಲಿಗಳನ್ನು ಜೊತೆಯವರ ಬಳಿ ನೀಡಿ',
          te: 'లోహపు ఆభరణాలు, వాచ్ లేదా తాళాలు తోడుగా వచ్చిన వారికి ఇవ్వడం',
          en: 'Remove metallic items (watch, chains, keys) before entering scan room',
        },
        helper: {
          kn: 'ಸ್ಕ್ಯಾನ್ ಚಿತ್ರಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಬರಲು ಇದು ನೆರವಾಗುತ್ತದೆ',
          te: 'స్కాన్ చిత్రాలు స్పష్టంగా రావడానికి ఇది సహాయపడుతుంది',
          en: 'Keeps imaging clear and comfortable',
        },
      },
      {
        id: 'task-comfort',
        label: {
          kn: 'ಯಾವುದೇ ಅಲರ್ಜಿ ಅಥವಾ ಆತಂಕವಿದ್ದರೆ ಟೆಕ್ನಿಷಿಯನ್‌ಗೆ ತಿಳಿಸಿ',
          te: 'ఏదైనా అలర్జీ లేదా అసౌకర్యం ఉంటే టెక్నీషియన్‌కు చెప్పడం',
          en: 'Tell the technician if you feel anxious, cold, or have medicine allergies',
        },
        helper: {
          kn: 'ಸಿಬ್ಬಂದಿ ನಿಮ್ಮೊಂದಿಗೆ ಮೈಕ್ ಮೂಲಕ ಮಾತನಾಡುತ್ತಾರೆ',
          te: 'స్కాన్ సమయంలో సిబ్బంది మీతో మాట్లాడుతుంటారు',
          en: 'The radiology team can hear and speak with you throughout the scan',
        },
      },
    ],
  },
  {
    id: 'after',
    title: {
      kn: 'ಭೇಟಿಯ ನಂತರ (After My Visit)',
      te: 'సందర్శన తర్వాత (After My Visit)',
      en: 'After My Visit',
    },
    subtitle: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಮುಗಿದ ಬಳಿಕ ಮಾಡಬೇಕಾದ ಆರೈಕೆ ಮತ್ತು ವರದಿ ಸಂಗ್ರಹಣೆ',
      te: 'స్కాన్ పూర్తయిన తర్వాత తీసుకోవలసిన జాగ్రత్తలు మరియు రిపోర్ట్ సేకరణ',
      en: 'Post-visit hydration, report collection, and sharing updates peacefully',
    },
    guidance: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಮುಗಿದ ನಂತರ ಆಸ್ಪತ್ರೆಯ ನಿಯಮದಂತೆ ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವರದಿ ಪಡೆಯುವ ದಿನಾಂಕವನ್ನು ಕೇಳಿ ತಿಳಿದುಕೊಳ್ಳಿ.',
      te: 'స్కాన్ తర్వాత ఆసుపత్రి సూచన మేరకు తగినంత నీరు త్రాగండి మరియు రిపోర్ట్ ఎప్పుడు ఇస్తారో అడిగి తెలుసుకోండి.',
      en: 'Follow staff advice after your scan, ask when your report will be ready, and share updates only with trusted people you choose.',
    },
    tasks: [
      {
        id: 'task-water',
        label: {
          kn: 'ಪರೀಕ್ಷೆಯ ನಂತರ ಸಿಬ್ಬಂದಿ ಸೂಚಿಸಿದಂತೆ ಶುದ್ಧ ನೀರು ಕುಡಿಯಿರಿ',
          te: 'స్కాన్ తర్వాత సిబ్బంది సూచించినట్లుగా మంచి నీరు త్రాగండి',
          en: 'Drink plenty of water afterwards if advised by radiology staff',
        },
        helper: {
          kn: 'ವೈದ್ಯರು ದ್ರವ ಸೇವನೆ ಮಿತಿಗೊಳಿಸಿದ್ದರೆ ಮಾತ್ರ ಅವರ ಸಲಹೆ ಪಾಲಿಸಿ',
          te: 'డాక్టర్ నీటిపై పరిమితి చెబితే మాత్రమే వారి సలహా పాటించండి',
          en: 'Unless your doctor has advised fluid restriction',
        },
      },
      {
        id: 'task-report-date',
        label: {
          kn: 'ವರದಿ ಸಿದ್ಧವಾಗುವ ದಿನಾಂಕ ಮತ್ತು ವೈದ್ಯರ ಭೇಟಿ ಸಮಯವನ್ನು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ',
          te: 'రిపోర్ట్ సిద్ధమయ్యే తేదీ మరియు తదుపరి డాక్టర్ సందర్శన సమయం నోట్ చేసుకోండి',
          en: 'Confirm when and where to collect your diagnostic report',
        },
        helper: {
          kn: 'ಮತ್ತೆ ಆಸ್ಪತ್ರೆಗೆ ಬರುವ ಮೊದಲು ಧ್ವನಿ ಜ್ಞಾಪನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
          te: 'తదుపరి సందర్శన కోసం వాయిస్ రిమైండర్‌లను ఆన్ చేసుకోండి',
          en: 'Keep voice reminders active so follow-ups are never missed',
        },
      },
      {
        id: 'task-carecircle',
        label: {
          kn: 'ಬಯಸಿದಲ್ಲಿ CareCircle ಮೂಲಕ ಕುಟುಂಬದವರಿಗೆ ವರದಿ ದಿನಾಂಕ ತಿಳಿಸಿ',
          te: 'మీరు కోరుకుంటే CareCircle ద్వారా కుటుంబ సభ్యులకు తేదీ తెలియజేయండి',
          en: 'Optionally share follow-up reminder with your CareCircle',
        },
        helper: {
          kn: 'ಯಾವ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳಬೇಕು ಎಂಬುದು ಸಂಪೂರ್ಣ ನಿಮ್ಮ ನಿರ್ಧಾರ',
          te: 'ఏ సమాచారం పంచుకోవాలో పూర్తిగా మీ నియంత్రణలోనే ఉంటుంది',
          en: 'You stay in complete control of what is shared',
        },
      },
    ],
  },
];

export interface ClarityItem {
  id: string;
  originalPhrase: string;
  category: Record<Language, string>;
  simple: Record<Language, string>;
  extraSimple: Record<Language, string>;
}

export const CLARITY_EXAMPLES: ClarityItem[] = [
  {
    id: 'npo-4hrs',
    originalPhrase: 'NPO 4 hrs prior to Contrast CT Abdomen. Clear water sips allowed.',
    category: {
      kn: 'ಆಹಾರ ನಿಯಮ (Fasting)',
      te: 'ఆహార నియమం (Fasting)',
      en: 'Food & Fasting Instruction',
    },
    simple: {
      kn: 'ನಿಮ್ಮ ಹೊಟ್ಟೆಯ ಸಿಟಿ ಸ್ಕ್ಯಾನ್‌ಗೆ ೪ ಗಂಟೆಗಳ ಮುಂಚೆ ಯಾವುದೇ ಘನ ಆಹಾರ, ಕಾಫಿ, ಟೀ ಅಥವಾ ಹಾಲು ಕುಡಿಯಬಾರದು. ಬಾಯಾರಿಕೆಯಾದರೆ ಸ್ವಲ್ಪ ಶುದ್ಧ ನೀರು ಮಾತ್ರ ಕುಡಿಯಬಹುದು.',
      te: 'మీ పొట్ట సిటి స్కాన్ సమయానికి 4 గంటల ముందు నుండి ఎలాంటి ఘన ఆహారం, టీ, కాఫీ లేదా పాలు తీసుకోకూడదు. దాహం వేస్తే కొద్దిగా మంచి నీరు మాత్రమే త్రాగవచ్చు.',
      en: 'Do not eat solid food, tea, coffee, or milk for 4 hours before your CT scan. You may take small sips of plain water if thirsty.',
    },
    extraSimple: {
      kn: 'ಸ್ಕ್ಯಾನ್‌ಗೆ ೪ ಗಂಟೆ ಮುಂಚೆ ಊಟ ಮಾಡಬೇಡಿ. ಸ್ವಲ್ಪ ನೀರು ಮಾತ್ರ ಕುಡಿಯಿರಿ.',
      te: 'స్కాన్‌కు 4 గంటల ముందు భోజనం చేయవద్దు. కొద్దిగా నీరు మాత్రమే త్రాగండి.',
      en: 'Do not eat for 4 hours before your scan. Small sips of plain water are okay.',
    },
  },
  {
    id: 'creatinine',
    originalPhrase: 'Bring recent Serum Creatinine & eGFR lab report on day of scan.',
    category: {
      kn: 'ರಕ್ತ ಪರೀಕ್ಷಾ ವರದಿ',
      te: 'రక్త పరీక్ష రిపోర్ట్',
      en: 'Lab Document Requirement',
    },
    simple: {
      kn: 'ಕಾಂಟ್ರಾಸ್ಟ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮುನ್ನ ನಿಮ್ಮ ಕಿಡ್ನಿ ಆರೋಗ್ಯವನ್ನು ಖಚಿತಪಡಿಸಲು ಇತ್ತೀಚಿನ ಕ್ರಿಯೇಟಿನಿನ್ (Creatinine) ರಕ್ತ ಪರೀಕ್ಷಾ ವರದಿಯನ್ನು ತರಬೇಕು.',
      te: 'కాంట్రాస్ట్ స్కాన్ చేయడానికి ముందు మీ కిడ్నీలు సురక్షితంగా ఉన్నాయని నిర్ధారించడానికి ఇటీవలి క్రియాటినిన్ (Creatinine) రక్త పరీక్ష రిపోర్టును తీసుకురావాలి.',
      en: 'Please bring your recent Creatinine blood test paper. Doctors check this report to make sure the scan dye is safe for your kidneys.',
    },
    extraSimple: {
      kn: 'ನಿಮ್ಮ ಹಳೆಯ ಕ್ರಿಯೇಟಿನಿನ್ ರಕ್ತ ಪರೀಕ್ಷೆಯ ಕಾಗದವನ್ನು ಆಸ್ಪತ್ರೆಗೆ ತಪ್ಪದೇ ತನ್ನಿ.',
      te: 'మీ పాత క్రియాటినిన్ రక్త పరీక్ష పేపర్‌ను ఆసుపత్రికి తప్పకుండా తీసుకురండి.',
      en: 'Bring your blood test paper (Creatinine report) with you to the hospital.',
    },
  },
  {
    id: 'arrive-early',
    originalPhrase: 'Report 30 mins prior at Radiology Wing, Block B, Room 104 for IV prep.',
    category: {
      kn: 'ತಲುಪುವ ಸಮಯ ಮತ್ತು ಸ್ಥಳ',
      te: 'చేరుకోవలసిన సమయం & స్థలం',
      en: 'Arrival & Location',
    },
    simple: {
      kn: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಸಮಯಕ್ಕಿಂತ ೩೦ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಬ್ಲಾಕ್ B, ಕೊಠಡಿ ೧೦೪ಕ್ಕೆ ಬನ್ನಿ. ಕಾಗದಪತ್ರ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಿದ್ಧತೆಗೆ ಈ ಸಮಯ ಅಗತ್ಯವಿರುತ್ತದೆ.',
      te: 'మీ స్కాన్ సమయానికి 30 నిమిషాల ముందుగా బ్లాక్ B, గది 104 వద్దకు చేరుకోండి. పేరు నమోదు మరియు స్కాన్ ఏర్పాట్ల కోసం ఈ సమయం అవసరం.',
      en: 'Please arrive 30 minutes before your scan time at Block B, Room 104. Staff need this time to check your papers and prepare you comfortably.',
    },
    extraSimple: {
      kn: 'ನಿಮ್ಮ ಸಮಯಕ್ಕಿಂತ ಅರ್ಧ ಗಂಟೆ ಬೇಗ ಬ್ಲಾಕ್ B, ಕೊಠಡಿ ೧೦೪ಕ್ಕೆ ಬನ್ನಿ.',
      te: 'మీ సమయానికి అరగంట ముందు బ్లాక్ B, గది 104 దగ్గరకు రండి.',
      en: 'Reach Block B, Room 104 half an hour early.',
    },
  },
  {
    id: 'remove-metal',
    originalPhrase: 'Remove metallic jewelry, belt buckles, watches, and coins before imaging.',
    category: {
      kn: 'ಉಡುಪು ಮತ್ತು ಆಭರಣ ಸಲಹೆ',
      te: 'దుస్తులు & ఆభరణాల సూచన',
      en: 'Clothing & Comfort',
    },
    simple: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಒಳಗೆ ಹೋಗುವ ಮುನ್ನ ವಾಚ್, ಉಂಗುರ, ಸರ, ಬೆಲ್ಟ್ ಮತ್ತು ಜೇಬಿನಲ್ಲಿರುವ ನಾಣ್ಯಗಳನ್ನು ತೆಗೆದು ಜೊತೆಯವರಿಗೆ ನೀಡಿ. ಇದರಿಂದ ಸ್ಕ್ಯಾನ್ ಚಿತ್ರಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಬರುತ್ತವೆ.',
      te: 'స్కాన్ గదిలోకి వెళ్ళే ముందు వాచ్, ఉంగరాలు, గొలుసు, బెల్ట్ మరియు జేబులోని నాణేలను తీసి తోడుగా వచ్చిన వారికి ఇవ్వండి. దీనివల్ల స్కాన్ స్పష్టంగా వస్తుంది.',
      en: 'Before entering the scan room, take off your watch, chains, rings, belt, and coins. Give them to your family member so the scan pictures stay clear.',
    },
    extraSimple: {
      kn: 'ವಾಚ್, ಸರ, ಉಂಗುರ ಮತ್ತು ಚಿಲ್ಲರೆ ನಾಣ್ಯಗಳನ್ನು ಸ್ಕ್ಯಾನ್‌ಗೆ ಮುನ್ನ ತೆಗೆದಿಡಿ.',
      te: 'వాచ్, గొలుసు, ఉంగరాలు మరియు నాణేలను స్కాన్‌కు ముందు తీసి ఉంచండి.',
      en: 'Take off watch, jewelry, belt, and coins before the scan.',
    },
  },
  {
    id: 'post-hydration',
    originalPhrase: 'Maintain oral hydration post-contrast unless on fluid restriction.',
    category: {
      kn: 'ಸ್ಕ್ಯಾನ್ ನಂತರದ ಆರೈಕೆ',
      te: 'స్కాన్ తర్వాత జాగ్రత్త',
      en: 'After-Scan Care',
    },
    simple: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಮುಗಿದ ನಂತರ ದಿನವಿಡೀ ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಿರಿ. ವೈದ್ಯರು ನೀರು ಕಡಿಮೆ ಕುಡಿಯಲು ಹೇಳಿದ್ದರೆ ಮಾತ್ರ ಅವರ ಸೂಚನೆಯನ್ನು ಪಾಲಿಸಿ.',
      te: 'స్కాన్ పూర్తయిన తర్వాత రోజంతా తగినంత నీరు త్రాగండి. డాక్టర్ నీరు తక్కువ త్రాగమని చెప్పి ఉంటే మాత్రమే వారి సలహా పాటించండి.',
      en: 'After the scan finishes, drink extra water during the day unless your doctor has told you to limit fluids.',
    },
    extraSimple: {
      kn: 'ಸ್ಕ್ಯಾನ್ ಆದ ಮೇಲೆ ಚೆನ್ನಾಗಿ ನೀರು ಕುಡಿಯಿರಿ (ವೈದ್ಯರು ಬೇಡವೆಂದಿದ್ದರೆ ಹೊರತು).',
      te: 'స్కాన్ తర్వాత బాగా నీరు త్రాగండి (డాక్టర్ వద్దని చెబితే తప్ప).',
      en: 'Drink plenty of water after your scan unless your doctor told you not to.',
    },
  },
  {
    id: 'ultrasound-bladder',
    originalPhrase: 'Drink 4-5 glasses of water 1 hr before Ultrasound Pelvis; hold urine.',
    category: {
      kn: 'ಅಲ್ಟ್ರಾಸೌಂಡ್ ತಯಾರಿ',
      te: 'అల్ట్రాసౌండ్ తయారీ',
      en: 'Ultrasound Preparation',
    },
    simple: {
      kn: 'ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನ್‌ಗೆ ೧ ಗಂಟೆ ಮುಂಚೆ ೪ ರಿಂದ ೫ ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಆಗುವವರೆಗೆ ಮೂತ್ರ ವಿಸರ್ಜಿಸಬೇಡಿ. ಇದರಿಂದ ವೈದ್ಯರಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸುತ್ತದೆ.',
      te: 'అల్ట్రాసౌండ్ స్కాన్‌కు 1 గంట ముందు 4-5 గ్లాసుల నీరు త్రాగి, స్కాన్ అయ్యే వరకు మూత్రం ఆపుకోండి. దీనివల్ల స్కాన్ రిపోర్ట్ స్పష్టంగా వస్తుంది.',
      en: 'Drink 4 to 5 glasses of water 1 hour before your ultrasound and do not use the washroom until the scan finishes. This helps the scan show clear images.',
    },
    extraSimple: {
      kn: 'ಸ್ಕ್ಯಾನ್‌ಗೆ ೧ ಗಂಟೆ ಮುಂಚೆ ೪ ಲೋಟ ನೀರು ಕುಡಿದು ಮೂತ್ರ ತಡೆದಿರಿ.',
      te: 'స్కాన్‌కు 1 గంట ముందు 4 గ్లాసుల నీరు త్రాగి మూత్రం ఆపుకోండి.',
      en: 'Drink 4 glasses of water 1 hour before scan and hold urine until scan finishes.',
    },
  },
];

export interface CompanionPrompt {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
  suggestedPage?: PageView;
  suggestedActionLabel?: Record<Language, string>;
}

export const COMPANION_PROMPTS: CompanionPrompt[] = [
  {
    id: 'check-appointment',
    question: {
      kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಹೇಗೆ ಪರಿಶೀಲಿಸಲಿ?',
      te: 'నా అపాయింట్‌మెంట్ ఎలా చూడాలి?',
      en: 'How do I check my appointment?',
    },
    answer: {
      kn: 'ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿ "ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್" ಒತ್ತಿ. ಅಲ್ಲಿ ಬಸಪ್ಪ ಗೌಡ ಅಥವಾ ನಿಮ್ಮ ಹೆಸರನ್ನು ಆರಿಸಿ, ದೊಡ್ಡ "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ" ಬಟನ್ ಒತ್ತಿದರೆ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಬಹುದು.',
      te: 'పై మెనూలో "నా అపాయింట్‌మెంట్" నొక్కండి. అక్కడ మీ పేరు ఎంచుకుని, "అపాయింట్‌మెంట్ వినండి" బటన్ నొక్కితే అన్ని వివరాలు తెలుగులో వినిపిస్తాయి.',
      en: 'Tap "My Appointment" in the top bar. Choose your card and press the large "Listen to Appointment" button to hear your date, time, hospital room, and preparation rules.',
    },
    suggestedPage: 'appointment',
    suggestedActionLabel: {
      kn: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ತೆರೆಯಿರಿ',
      te: 'నా అపాయింట్‌మెంట్ తెరవండి',
      en: 'Open My Appointment',
    },
  },
  {
    id: 'change-language',
    question: {
      kn: 'ನಾನು ಭಾಷೆಯನ್ನು ಹೇಗೆ ಬದಲಾಯಿಸಲಿ?',
      te: 'నేను భాషను ఎలా మార్చాలి?',
      en: 'How do I change my language?',
    },
    answer: {
      kn: 'ಪರದೆಯ ಮೇಲ್ಭಾಗದ ಬಲಭಾಗದಲ್ಲಿ "ಕನ್ನಡ | తెలుగు | English" ಬಟನ್‌ಗಳಿವೆ. ನಿಮಗೆ ಬೇಕಾದ ಭಾಷೆಯ ಮೇಲೆ ಒತ್ತಿದರೆ ಇಡೀ ವೆಬ್‌ಸೈಟ್ ಮತ್ತು ಧ್ವನಿ ಆ ಭಾಷೆಗೆ ಬದಲಾಗುತ್ತದೆ.',
      te: 'స్క్రీన్ పైభాగంలో కుడివైపున "ಕನ್ನಡ | తెలుగు | English" బటన్లు ఉన్నాయి. మీకు కావలసిన భాషపై నొక్కితే మొత్తం వెబ్‌సైట్ మరియు వాయిస్ ఆ భాషలోకి మారుతుంది.',
      en: 'Look at the top-right corner of the navigation bar. Tap "ಕನ್ನಡ", "తెలుగు", or "English" at any time to switch all text and voice guidance immediately.',
    },
  },
  {
    id: 'what-to-bring',
    question: {
      kn: 'ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುವಾಗ ಏನು ತರಬೇಕು?',
      te: 'ఆసుపత్రికి వెళ్ళేటప్పుడు ఏమి తీసుకురావాలి?',
      en: 'What should I bring to a hospital visit?',
    },
    answer: {
      kn: 'ನಿಮ್ಮ ಗುರುತಿನ ಚೀಟಿ, ವೈದ್ಯರ ಚೀಟಿ, ಇತ್ತೀಚಿನ ಕ್ರಿಯೇಟಿನಿನ್ ರಕ್ತ ಪರೀಕ್ಷಾ ವರದಿ ಮತ್ತು ಹಳೆಯ ಸ್ಕ್ಯಾನ್ ಕಾಗದಗಳನ್ನು ತನ್ನಿ. "ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್" ಪುಟದಲ್ಲಿ ಸಂಪೂರ್ಣ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ ಪ್ರಿಂಟ್ ಮಾಡಬಹುದು.',
      te: 'మీ గుర్తింపు కార్డు, డాక్టర్ చీటీ, ఇటీవలి క్రియాటినిన్ రక్త పరీక్ష రిపోర్టు మరియు పాత స్కాన్ కాగితాలు తీసుకురండి. "నా విజిట్ పాస్‌పోర్ట్" పేజీలో పూర్తి జాబితా చూడవచ్చు.',
      en: 'Bring your ID card, doctor referral slip, recent Creatinine lab report, and past medical files. You can also print a neat checklist using "My Visit Passport".',
    },
    suggestedPage: 'passport',
    suggestedActionLabel: {
      kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ನೋಡಿ',
      te: 'నా విజిట్ పాస్‌పోర్ట్ చూడండి',
      en: 'Open My Visit Passport',
    },
  },
  {
    id: 'caregiver-help',
    question: {
      kn: 'ನನ್ನ ಆರೈಕೆದಾರರು (ಮಗ/ಮಗಳು) ಹೇಗೆ ನೆರವಾಗಬಹುದು?',
      te: 'నా సంరక్షకులు (కుమారుడు/కుమార్తె) ఎలా సహాయం చేయగలరు?',
      en: 'How can my caregiver help me?',
    },
    answer: {
      kn: 'CareCircle ಪುಟದಲ್ಲಿ ನೀವು ಅನುಮತಿ ನೀಡಿದರೆ ಮಾತ್ರ ನಿಮ್ಮ ಮಗ ಅಥವಾ ಸಂಬಂಧಿಕರು ಭೇಟಿ ಸಮಯ, ತಲುಪುವ ದಾರಿ ಮತ್ತು ಸಿದ್ಧತಾ ಪಟ್ಟಿಯನ್ನು ನೋಡಬಹುದು. ಯಾವ ಮಾಹಿತಿ ತೋರಿಸಬೇಕು ಎಂಬುದು ನಿಮ್ಮ ಕೈಯಲ್ಲಿರುತ್ತದೆ.',
      te: 'CareCircle పేజీలో మీరు అనుమతి ఇస్తేనే మీ కుమారుడు లేదా బంధువు అపాయింట్‌మెంట్ సమయం, దారి మరియు జాగ్రత్తల జాబితా చూడగలరు. ఏమి పంచుకోవాలో మీరే నిర్ణయించవచ్చు.',
      en: 'In "CareCircle", you give explicit consent and pick only the non-sensitive items (such as time, directions, or preparation checklist) your trusted family member can view.',
    },
    suggestedPage: 'carecircle',
    suggestedActionLabel: {
      kn: 'CareCircle ತೆರೆಯಿರಿ',
      te: 'CareCircle తెరవండి',
      en: 'Open CareCircle',
    },
  },
  {
    id: 'find-reminders',
    question: {
      kn: 'ನನ್ನ ಜ್ಞಾಪನೆಗಳು ಎಲ್ಲಿ ಕಾಣುತ್ತವೆ?',
      te: 'నా రిమైండర్లు ఎక్కడ ఉంటాయి?',
      en: 'Where do I find my reminders?',
    },
    answer: {
      kn: 'ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿ "ಜ್ಞಾಪನೆಗಳು" (Reminders) ಒತ್ತಿ. ಅಲ್ಲಿ ಧ್ವನಿ ಕರೆ (IVR), ಕನ್ನಡ SMS ಮತ್ತು ವಾಟ್ಸಾಪ್ ಜ್ಞಾಪನೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪರೀಕ್ಷಿಸಬಹುದು.',
      te: 'పై మెనూలో "రిమైండర్లు" (Reminders) నొక్కండి. అక్కడ వాయిస్ కాల్, తెలుగు SMS మరియు వాట్సాప్ రిమైండర్లను ఎంచుకోవచ్చు మరియు పరీక్షించవచ్చు.',
      en: 'Select "Reminders" in the navigation bar. There you can configure automated voice calls, native SMS, WhatsApp notes, and test live reminder previews.',
    },
    suggestedPage: 'reminders',
    suggestedActionLabel: {
      kn: 'ಜ್ಞಾಪನೆಗಳ ಪುಟಕ್ಕೆ ಹೋಗಿ',
      te: 'రిమైండర్ల పేజీకి వెళ్ళండి',
      en: 'Go to Reminders',
    },
  },
];

export const TOOLKIT_LABELS = {
  sectionKicker: {
    kn: 'ಹೆಚ್ಚುವರಿ ಕಾಳಜಿ ಸೌಲಭ್ಯಗಳು',
    te: 'ప్రత్యేక ఆరోగ్య సహాయక టూల్స్',
    en: 'CORE Patient Toolkit',
  },
  sectionTitle: {
    kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಪಯಣಕ್ಕೆ ಇನ್ನಷ್ಟು ನೆರವು',
    te: 'మీ ఆరోగ్య ప్రయాణానికి మరింత సులభమైన సహాయం',
    en: 'Tools Designed for Calm & Clarity',
  },
  sectionSubtitle: {
    kn: 'ಸರಳ ಭಾಷಾ ವಿವರಣೆ, ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ, ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಮತ್ತು ಕುಟುಂಬದವರ ಸಹಕಾರ.',
    te: 'సులభమైన వివరణ, దశల వారీ మార్గదర్శి, విజిట్ పాస్‌పోర్ట్ మరియు కుటుంబ సహకారం.',
    en: 'Explore step-by-step visit timelines, plain-language instruction explainers, printable visit passports, and patient-controlled caregiver support.',
  },
  items: [
    {
      id: 'journey' as PageView,
      title: {
        kn: 'ನನ್ನ ಆರೈಕೆ ಪಯಣ',
        te: 'నా ఆరోగ్య ప్రయాణం',
        en: 'My Care Journey',
      },
      desc: {
        kn: 'ಭೇಟಿಗೆ ಮುನ್ನ, ಭೇಟಿಯ ವೇಳೆ ಮತ್ತು ನಂತರದ ಸರಳ ಚೆಕ್‌ಲಿಸ್ಟ್ ಟೈಮ್‌ಲೈನ್.',
        te: 'సందర్శనకు ముందు, సమయంలో మరియు తర్వాత చేయవలసిన దశల వారీ జాబితా.',
        en: 'Interactive 3-stage timeline with completable preparation checklists.',
      },
      cta: {
        kn: 'ಪಯಣ ನೋಡಿ',
        te: 'ప్రయాణం చూడండి',
        en: 'Open Timeline',
      },
    },
    {
      id: 'clarity' as PageView,
      title: {
        kn: 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Clarity)',
        te: 'సులభంగా వివరించండి (Clarity)',
        en: 'Explain It Simply',
      },
      desc: {
        kn: 'ಕಷ್ಟಕರ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳನ್ನು ಸರಳ ಮತ್ತು ಅತಿ ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ.',
        te: 'కష్టమైన ఆసుపత్రి సూచనలను సులభమైన తెలుగులో అర్థం చేసుకోండి.',
        en: 'Translate confusing medical instructions into Simple or Extra Simple voice guides.',
      },
      cta: {
        kn: 'ಸರಳ ವಿವರಣೆ ಪಡೆಯಿರಿ',
        te: 'సులభ వివరణ చూడండి',
        en: 'Simplify Instructions',
      },
    },
    {
      id: 'carecircle' as PageView,
      title: {
        kn: 'CareCircle (ಕುಟುಂಬ ನೆರವು)',
        te: 'CareCircle (కుటుంబ సహాయం)',
        en: 'CareCircle Support',
      },
      desc: {
        kn: 'ನಿಮ್ಮ ಸಮ್ಮತಿಯೊಂದಿಗೆ ಮಾತ್ರ ಕುಟುಂಬಸ್ಥರಿಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮಾಹಿತಿ ತೋರಿಸಿ.',
        te: 'మీ అనుమతితోనే కుటుంబ సభ్యులకు అవసరమైన సమాచారాన్ని పంచుకోండి.',
        en: 'Consent-first sharing controls so caregivers help without removing independence.',
      },
      cta: {
        kn: 'ಸಮ್ಮತಿ ನಿರ್ವಹಿಸಿ',
        te: 'అనుమతులు చూడండి',
        en: 'Open CareCircle',
      },
    },
    {
      id: 'passport' as PageView,
      title: {
        kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್',
        te: 'నా విజిట్ పాస్‌పోర్ట్',
        en: 'My Visit Passport',
      },
      desc: {
        kn: 'ಪ್ರಿಂಟ್ ಅಥವಾ PDF ಮಾಡಬಹುದಾದ ಆಸ್ಪತ್ರೆ ಸಿದ್ಧತಾ ಕಾರ್ಡ್ ಮತ್ತು ಪ್ರಶ್ನೆ ಪಟ್ಟಿ.',
        te: 'ప్రింట్ లేదా PDF చేసుకోగల ఆసుపత్రి సన్నద్ధత కార్డు మరియు ప్రశ్నల జాబితా.',
        en: 'Printable botanical appointment card with directions, documents, and questions.',
      },
      cta: {
        kn: 'ಪಾಸ್‌ಪೋರ್ಟ್ ರಚಿಸಿ',
        te: 'పాస్‌పోర్ట్ చూడండి',
        en: 'View Passport',
      },
    },
  ],
};
