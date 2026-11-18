import { ComfortSettings, IntelligenceProfile, Language, PageView } from '../types';

export interface PathwayStep {
  id: string;
  order: number;
  targetPage: PageView;
  title: Record<Language, string>;
  description: Record<Language, string>;
  detailLevel: 'detailed' | 'streamlined';
  whySeeingThis: Record<Language, string>;
}

export interface PersonalizationSummary {
  modeLabel: Record<Language, string>;
  explanation: Record<Language, string>;
  recommendedComfort: Partial<ComfortSettings>;
  steps: PathwayStep[];
}

/**
 * Deterministic, transparent rule-based personalization engine.
 * Never infers disease, diagnosis, or medical risk from navigation preferences.
 */
export function buildPersonalizedPathway(profile: IntelligenceProfile): PersonalizationSummary {
  const isDetailed = profile.firstHospitalVisit || profile.preferStepByStep;
  const steps: PathwayStep[] = [];
  let order = 1;

  // Step 1: Voice or direct appointment review
  steps.push({
    id: 'step-appointment',
    order: order++,
    targetPage: profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both' ? 'voicebridge' : 'appointment',
    detailLevel: isDetailed ? 'detailed' : 'streamlined',
    title:
      profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both'
        ? {
            kn: 'ಧ್ವನಿಯ ಮೂಲಕ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ (VoiceBridge)',
            te: 'వాయిస్ ద్వారా అపాయింట్‌మెంట్ వినండి (VoiceBridge)',
            en: 'Hear Your Appointment via VoiceBridge',
          }
        : {
            kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಳ ಪರಿಶೀಲಿಸಿ',
            te: 'అపాయింట్‌మెంట్ తేదీ మరియు గదిని చూడండి',
            en: 'Verify Appointment Date, Room & Time',
          },
    description: isDetailed
      ? {
          kn: 'ಮೊದಲು ದಿನಾಂಕ, ಸಮಯ, ಕೊಠಡಿ ಸಂಖ್ಯೆ ಮತ್ತು ತಲುಪುವ ಮಾರ್ಗವನ್ನು ನಿಧಾನವಾಗಿ ಆಲಿಸಿ ಅಥವಾ ಓದಿ.',
          te: 'ముందుగా తేదీ, సమయం, గది నంబర్ మరియు దారిని నెమ్మదిగా వినండి లేదా చదవండి.',
          en: 'Start by hearing or reading your scheduled date, reporting time, room number, and gate-to-desk directions slowly.',
        }
      : {
          kn: 'ನಿಮ್ಮ ಸಮಯ ಮತ್ತು ಕೊಠಡಿಯನ್ನು ತ್ವರಿತವಾಗಿ ದೃಢೀಕರಿಸಿ.',
          te: 'మీ సమయం మరియు గదిని త్వరగా నిర్ధారించుకోండి.',
          en: 'Quickly confirm your date, reporting slot, and department desk.',
        },
    whySeeingThis: {
      kn:
        profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both'
          ? 'ನೀವು ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದರಿಂದ VoiceBridge ಹಂತವನ್ನು ಮೊದಲು ತೋರಿಸಲಾಗಿದೆ.'
          : 'ಭೇಟಿಯ ಮೂಲ ವಿವರಗಳನ್ನು ಖಚಿತಪಡಿಸಲು ಇದು ಮೊದಲ ಹಂತವಾಗಿದೆ.',
      te:
        profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both'
          ? 'మీరు వాయిస్ సహాయాన్ని ఎంచుకున్నందున VoiceBridge దశ మొదటగా చూపబడింది.'
          : 'సందర్శన వివరాలను నిర్ధారించుకోవడానికి ఇది మొదటి దశ.',
      en:
        profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both'
          ? 'Selected because you requested voice guidance for navigation.'
          : 'Shown first so core appointment timing and room details are verified upfront.',
    },
  });

  // Step 2: Understanding instructions (prioritized for first-time visitors or understand_terms)
  if (isDetailed || profile.assistanceGoal === 'understand_terms') {
    steps.push({
      id: 'step-sense',
      order: order++,
      targetPage: 'sense',
      detailLevel: 'detailed',
      title: {
        kn: 'ಆಸ್ಪತ್ರೆ ನಿಯಮಗಳನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ (CORE Sense)',
        te: 'ఆసుపత్రి నిబంధనలను సులభంగా అర్థం చేసుకోండి (CORE Sense)',
        en: 'Understand Clinic Steps & Terms (CORE Sense)',
      },
      description: {
        kn: 'ದಾಖಲಾತಿ ಹಂತಗಳು, ಉಪವಾಸ ಸೂಚನೆಗಳು ಮತ್ತು ಸಣ್ಣ ತಿಳುವಳಿಕೆ ಪರಿಶೀಲನೆಯನ್ನು ನೋಡಿ.',
        te: 'రిజిస్ట్రేషన్ దశలు, ఉపవాస సూచనలు మరియు చిన్న అవగాహన తనిఖీని చూడండి.',
        en: 'Review plain-language administrative steps, visual arrival sequences, and quick check-in questions.',
      },
      whySeeingThis: {
        kn: profile.firstHospitalVisit
          ? 'ಇದು ನಿಮ್ಮ ಮೊದಲ ಆಸ್ಪತ್ರೆ ಭೇಟಿಯಾಗಿರುವುದರಿಂದ ಸರಳ ವಿವರಣೆ ಹಂತವನ್ನು ಸೇರಿಸಲಾಗಿದೆ.'
          : 'ನೀವು ಸೂಚನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ನೆರವು ಕೇಳಿದ್ದೀರಿ.',
        te: profile.firstHospitalVisit
          ? 'ఇది మీ మొదటి ఆసుపత్రి సందర్శన కాబట్టి ఈ వివరాల దశ జతచేయబడింది.'
          : 'మీరు సూచనలను సులభంగా అర్థం చేసుకునే సహాయం కోరారు.',
        en: profile.firstHospitalVisit
          ? 'Added because you noted this is a first hospital visit — extra context reduces desk confusion.'
          : 'Added because you asked for help understanding hospital instructions.',
      },
    });
  }

  // Step 3: Preparation / Reschedule based on goal
  if (profile.assistanceGoal === 'reschedule') {
    steps.push({
      id: 'step-reschedule',
      order: order++,
      targetPage: 'reschedule',
      detailLevel: isDetailed ? 'detailed' : 'streamlined',
      title: {
        kn: 'ಹೊಸ ದಿನಾಂಕ ಅಥವಾ ಸಮಯವನ್ನು ಆರಿಸಿ',
        te: 'కొత్త తేదీ లేదా సమయం ఎంచుకోండి',
        en: 'Pick a Convenient New Slot',
      },
      description: {
        kn: 'ಬಸ್ ಅಥವಾ ಮನೆಯ ಅನುಕೂಲಕ್ಕೆ ತಕ್ಕಂತೆ ಬೆಳಗ್ಗೆ ಅಥವಾ ಮಧ್ಯಾಹ್ನದ ಸಮಯವನ್ನು ಬದಲಾಯಿಸಿ.',
        te: 'ప్రయాణ సౌకర్యాన్ని బట్టి ఉదయం లేదా మధ్యాహ్నం సమయాన్ని మార్చుకోండి.',
        en: 'Switch to another morning or afternoon slot in two simple steps without hospital queue delays.',
      },
      whySeeingThis: {
        kn: 'ನೀವು ದಿನಾಂಕ ಬದಲಾಯಿಸುವ ನೆರವು ಆರಿಸಿದ್ದೀರಿ.',
        te: 'మీరు అపాయింట్‌మెంట్ తేదీ మార్చే సహాయం ఎంచుకున్నారు.',
        en: 'Prioritized because your selected goal was rescheduling an appointment.',
      },
    });
  } else {
    steps.push({
      id: 'step-compass',
      order: order++,
      targetPage: 'carecompass',
      detailLevel: isDetailed ? 'detailed' : 'streamlined',
      title: {
        kn: 'ಭೇಟಿ ಸಿದ್ಧತಾ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ (CareCompass)',
        te: 'సందర్శన తయారీ జాబితా సిద్ధం చేయండి (CareCompass)',
        en: 'Prepare Checklist & Documents (CareCompass)',
      },
      description: isDetailed
        ? {
            kn: 'ತರಬೇಕಾದ ಕಾಗದಪತ್ರಗಳು, ಪ್ರಯಾಣದ ಸಮಯ ಮತ್ತು ವೈದ್ಯರನ್ನು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ.',
            te: 'తీసుకురావలసిన పత్రాలు, ప్రయాణ సమయం మరియు డాక్టర్‌ను అడిగే ప్రశ్నలను సిద్ధం చేసుకోండి.',
            en: 'Organize documents to verify with the clinic, travel timings, and questions you wish to ask.',
          }
        : {
            kn: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಸಮಯದ ಜ್ಞಾಪನೆ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.',
            te: 'ముఖ్యమైన పత్రాలు మరియు సమయ రిమైండర్ మాత్రమే చూడండి.',
            en: 'Quickly check off documents and save an offline/calendar reminder.',
          },
      whySeeingThis: {
        kn: profile.firstHospitalVisit
          ? 'ಮೊದಲ ಭೇಟಿಗೆ ಕಾಗದಪತ್ರ ಮತ್ತು ಪ್ರಯಾಣದ ಸಿದ್ಧತೆ ಸ್ಪಷ್ಟವಾಗಿರಲು ಈ ಪಟ್ಟಿ ನೆರವಾಗುತ್ತದೆ.'
          : 'ನೀವು ಸಿದ್ಧತಾ ಪಟ್ಟಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ.',
        te: profile.firstHospitalVisit
          ? 'మొదటి సందర్శనలో పత్రాలు మరియు ప్రయాణం సులభంగా ఉండేందుకు ఈ జాబితా చూపబడింది.'
          : 'మీరు తయారీ సహాయాన్ని ఎంచుకున్నారు.',
        en: profile.firstHospitalVisit
          ? 'Tailored with full travel & document prompts because this is a first visit.'
          : 'Included as a streamlined organizational checklist for your appointment.',
      },
    });
  }

  // Step 4: Caregiver Handoff if helping someone else OR Visit Passport
  if (profile.visitorRole === 'caregiver') {
    steps.push({
      id: 'step-connect',
      order: order++,
      targetPage: 'carecircle',
      detailLevel: isDetailed ? 'detailed' : 'streamlined',
      title: {
        kn: 'ರೋಗಿಯ ಸಮ್ಮತಿಯೊಂದಿಗೆ CareCircle ಹಂಚಿಕೆ ಪರಿಶೀಲಿಸಿ',
        te: 'రోగి అనుమతితో CareCircle వివరాలను చూడండి',
        en: 'Review Patient-Consented Caregiver Handoff',
      },
      description: {
        kn: 'ಹಿರಿಯರ ಸ್ವಾಭಿಮಾನ ಕಾಪಾಡುತ್ತಾ ಕೇವಲ ಅಗತ್ಯವಿರುವ ಭೇಟಿ ವಿವರಗಳನ್ನು ಮಾತ್ರ ನೋಡಿ ಹಾಗೂ ಪ್ರಿಂಟ್ ಮಾಡಿ.',
        te: 'వృద్ధుల ఆత్మగౌరవాన్ని కాపాడుతూ అనుమతించిన వివరాలను మాత్రమే చూడండి & ప్రింట్ చేయండి.',
        en: 'Preview only non-sensitive visit logistics approved by the patient and export a handoff card.',
      },
      whySeeingThis: {
        kn: 'ನೀವು ಬೇರೆಯವರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದೇನೆ ಎಂದು ತಿಳಿಸಿದ್ದರಿಂದ ಸಮ್ಮತಿ-ಆಧಾರಿತ CareCircle ಸೇರಿಸಲಾಗಿದೆ.',
        te: 'మీరు మరొకరికి సహాయం చేస్తున్నట్లు చెప్పినందున CareCircle దశ చూపబడింది.',
        en: 'Shown because you indicated you are assisting another person with their hospital visit.',
      },
    });
  }

  steps.push({
    id: 'step-passport',
    order: order++,
    targetPage: 'passport',
    detailLevel: isDetailed ? 'detailed' : 'streamlined',
    title: {
      kn: 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಪ್ರಿಂಟ್ / ಉಳಿಸಿ',
      te: 'నా విజిట్ పాస్‌పోర్ట్ ప్రింట్ / సేవ్ చేయండి',
      en: 'Print or Save Your Visit Passport',
    },
    description: {
      kn: 'ದಿನಾಂಕ, ಕೊಠಡಿ ಸಂಖ್ಯೆ, ತಲುಪುವ ದಾರಿ ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ಒಂದೇ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.',
      te: 'తేదీ, గది నంబర్, దారి మరియు ప్రశ్నలను ఒకే కార్డులో తీసుకోండి.',
      en: 'Carry one calm, clear sheet with your timing, room directions, and personal questions.',
    },
    whySeeingThis: {
      kn: 'ಕಾಗದದ ಕಾರ್ಡ್ ಇಟ್ಟುಕೊಳ್ಳುವುದರಿಂದ ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ ಇದ್ದಾಗಲೂ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಸುಲಭವಾಗುತ್ತದೆ.',
      te: 'కాగితపు కార్డు ఉంటే నెట్‌వర్క్ లేకపోయినా ఆసుపత్రిలో సులభంగా చూపించవచ్చు.',
      en: 'Recommended so you have an offline-friendly summary card during hospital check-in.',
    },
  });

  const recommendedComfort: Partial<ComfortSettings> = {
    guidedMode: profile.preferStepByStep,
    simplifiedNav: profile.firstHospitalVisit || profile.preferStepByStep,
    textSize:
      profile.supportNeeds === 'large_text' || profile.supportNeeds === 'both' ? 'large' : 'normal',
    largeButtons: profile.supportNeeds === 'large_text' || profile.supportNeeds === 'both',
    readAloud: profile.supportNeeds === 'voice_first' || profile.supportNeeds === 'both',
  };

  return {
    modeLabel: isDetailed
      ? {
          kn: 'ವಿವರವಾದ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ ಪಥ',
          te: 'వివరమైన దశల వారీ మార్గదర్శి పథం',
          en: 'Guided First-Time / Step-by-Step Pathway',
        }
      : {
          kn: 'ಸರಳೀಕೃತ ತ್ವರಿತ ಭೇಟಿ ಪಥ',
          te: 'సులభమైన వేగవంతమైన సందర్శన పథం',
          en: 'Streamlined Experienced-Visitor Pathway',
        },
    explanation: {
      kn: 'ಈ ಮಾರ್ಗವನ್ನು ಕೇವಲ ನಿಮ್ಮ ಭಾಷೆ, ಸಹಾಯದ ಅಗತ್ಯ ಮತ್ತು ಮೊದಲ ಭೇಟಿಯ ಆಯ್ಕೆಯ ನಿಯಮಗಳಿಂದ ರಚಿಸಲಾಗಿದೆ — ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಅಪಾಯ ಅಥವಾ ರೋಗವನ್ನು ಊಹಿಸಲಾಗುವುದಿಲ್ಲ.',
      te: 'ఈ మార్గం మీ భాష, సహాయ ప్రాధాన్యతలు మరియు సందర్శన అనుభవం ఆధారంగా మాత్రమే రూపొందించబడింది — ఎటువంటి వ్యాధి లేదా వైద్య ప్రమాదాన్ని అంచనా వేయదు.',
      en: 'Generated purely by deterministic navigation rules from your language, step-by-step, and accompaniment preferences — never inferring health conditions or medical risk.',
    },
    recommendedComfort,
    steps,
  };
}
