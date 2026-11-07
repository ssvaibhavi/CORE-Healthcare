import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    myAppointment: string;
    reschedule: string;
    reminders: string;
    howItWorks: string;
    getHelp: string;
    about: string;
    staffPortal: string;
  };
  accessibility: {
    textSize: string;
    highContrast: string;
    voiceAssistance: string;
    normal: string;
    large: string;
    extraLarge: string;
    close: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    hearAppointmentBtn: string;
    viewAppointmentBtn: string;
    scenarioPill: string;
    scenarioTitle: string;
    scenarioDesc: string;
    tryDemoBtn: string;
  };
  howItHelps: {
    sectionTitle: string;
    sectionSubtitle: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      actionText: string;
    }>;
  };
  appointment: {
    title: string;
    subtitle: string;
    lookupTitle: string;
    lookupDesc: string;
    phoneLabel: string;
    pinLabel: string;
    searchBtn: string;
    quickDemoFill: string;
    detailsTitle: string;
    testLabel: string;
    dateLabel: string;
    timeLabel: string;
    hospitalLabel: string;
    roomLabel: string;
    directionsLabel: string;
    preparationTitle: string;
    listenBtn: string;
    pauseBtn: string;
    replayBtn: string;
    playingAudioLabel: string;
    statusLabel: string;
    unconfirmed: string;
    confirmed: string;
    rescheduled: string;
    iWillAttendBtn: string;
    iNeedToChangeBtn: string;
    confirmedNotice: string;
    changeNotice: string;
    emergencyCallBtn: string;
  };
  reschedule: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    currentDetails: string;
    selectNewDate: string;
    morningSlots: string;
    afternoonSlots: string;
    selectReason: string;
    reasonTransport: string;
    reasonRelative: string;
    reasonHealth: string;
    reasonConflict: string;
    reviewTitle: string;
    confirmChangeBtn: string;
    backBtn: string;
    successTitle: string;
    successMessage: string;
    spokenSummaryPrompt: string;
    listenNewSummary: string;
    returnToHomeBtn: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    channelsTitle: string;
    smsOption: string;
    smsDesc: string;
    voiceCallOption: string;
    voiceCallDesc: string;
    whatsappOption: string;
    whatsappDesc: string;
    caregiverOption: string;
    caregiverDesc: string;
    intervalsTitle: string;
    sevenDays: string;
    oneDay: string;
    fourHours: string;
    sameDayMorning: string;
    caregiverCardTitle: string;
    caregiverNameLabel: string;
    caregiverPhoneLabel: string;
    caregiverRelationLabel: string;
    caregiverRuleLabel: string;
    ruleAlways: string;
    ruleUnconfirmedOnly: string;
    savePreferencesBtn: string;
    preferencesSavedMsg: string;
    simulatorTitle: string;
    simulateCallBtn: string;
    simulateSmsBtn: string;
    simulateWhatsappBtn: string;
  };
  howItWorksPage: {
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      desc: string;
    }>;
    ruralFocusTitle: string;
    ruralFocusDesc: string;
  };
  help: {
    title: string;
    subtitle: string;
    tollFreeCardTitle: string;
    tollFreeNumber: string;
    tollFreeHours: string;
    callNowBtn: string;
    ashaCardTitle: string;
    ashaCardDesc: string;
    faqsTitle: string;
    faqs: Array<{
      q: string;
      a: string;
    }>;
  };
  about: {
    title: string;
    tagline: string;
    philosophyTitle: string;
    philosophyQuote: string;
    philosophyDesc: string;
    problemTitle: string;
    problemStory: string;
    pillarsTitle: string;
    pillars: Array<{
      title: string;
      desc: string;
    }>;
  };
  staff: {
    title: string;
    subtitle: string;
    demoNotice: string;
    statsTotal: string;
    statsUnconfirmed: string;
    statsRescheduled: string;
    statsCaregivers: string;
    filterAll: string;
    filterUnconfirmed: string;
    filterRescheduled: string;
    searchPlaceholder: string;
    colPatient: string;
    colTest: string;
    colDate: string;
    colLanguage: string;
    colStatus: string;
    colActions: string;
    triggerCallBtn: string;
    rescheduleBtn: string;
    viewDetailsBtn: string;
    newAppointmentBtn: string;
  };
  footer: {
    mission: string;
    quickLinks: string;
    contactSupport: string;
    tollFree: string;
    districtOffices: string;
    disclaimer: string;
    privacyPledge: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  kn: {
    appName: "CORE",
    tagline: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುವ ಆರೋಗ್ಯ ಸೇವೆ",
    nav: {
      home: "ಮುಖಪುಟ",
      myAppointment: "ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
      reschedule: "ದಿನಾಂಕ ಬದಲಾವಣೆ",
      reminders: "ಜ್ಞಾಪನೆಗಳು",
      howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
      getHelp: "ಸಹಾಯ ಪಡೆಯಿರಿ",
      about: "CORE ಬಗ್ಗೆ",
      staffPortal: "ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ",
    },
    accessibility: {
      textSize: "ಅಕ್ಷರದ ಗಾತ್ರ",
      highContrast: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್",
      voiceAssistance: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
      normal: "ಸಾಮಾನ್ಯ",
      large: "ದೊಡ್ಡದು",
      extraLarge: "ಅತ್ಯಂತ ದೊಡ್ಡದು",
      close: "ಮುಚ್ಚಿ",
    },
    hero: {
      headline: "ನಿಮ್ಮನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ಕಾಳಜಿ",
      subtitle: "ನಿಮ್ಮ ಆಸ್ಪತ್ರೆಯ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ ಮತ್ತು ನಿಮಗೆ ಬೇಕಾದ ನೆರವು ಪಡೆಯಿರಿ — ನಿಮ್ಮದೇ ಆದ ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ.",
      hearAppointmentBtn: "ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ",
      viewAppointmentBtn: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನೋಡಿ",
      scenarioPill: "ಗ್ರಾಮೀಣ ಹಿರಿಯರ ನೈಜ ಸನ್ನಿವೇಶ",
      scenarioTitle: "ಬಸಪ್ಪ ಗೌಡರ (೬೦ ವರ್ಷ) ಕಥೆ",
      scenarioDesc: "ಇಂಗ್ಲಿಷ್ SMS ಓದಲು ಬಾರದೆ CT ಸ್ಕ್ಯಾನ್ ತಪ್ಪಿಹೋಗುತ್ತಿದ್ದ ಪರಿಸ್ಥಿತಿಯನ್ನು CORE ಧ್ವನಿ ಸಂದೇಶ ಮತ್ತು ಕನ್ನಡದ ಮೂಲಕ ಸಂಪೂರ್ಣವಾಗಿ ನಿವಾರಿಸುತ್ತದೆ.",
      tryDemoBtn: "ಬಸಪ್ಪನವರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪರಿಶೀಲಿಸಿ",
    },
    howItHelps: {
      sectionTitle: "CORE ಹೇಗೆ ನಿಮಗೆ ನೆರವಾಗುತ್ತದೆ?",
      sectionSubtitle: "ತಂತ್ರಜ್ಞಾನಕ್ಕೆ ರೋಗಿ ಹೊಂದಿಕೊಳ್ಳಬೇಕಿಲ್ಲ, ರೋಗಿಯ ಅಗತ್ಯಕ್ಕೆ ತಂತ್ರಜ್ಞಾನ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.",
      cards: [
        {
          id: "hear",
          title: "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ",
          description: "ಓದುವ ಕಷ್ಟವಿಲ್ಲದೆ ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ, ಸಮಯ ಹಾಗೂ ನಿಯಮಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿ ತಿಳಿಯಿರಿ.",
          actionText: "ಧ್ವನಿ ಸಂದೇಶ ಆಲಿಸಿ",
        },
        {
          id: "remind",
          title: "ಜ್ಞಾಪನೆ ಮರೆಯಬೇಡಿ",
          description: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಕನ್ನಡದಲ್ಲಿ ಆಡಿಯೋ ಕರೆ ಅಥವಾ SMS ಮೂಲಕ ಸಕಾಲಿಕ ಜ್ಞಾಪನೆ ತಲುಪುತ್ತದೆ.",
          actionText: "ಜ್ಞಾಪನೆ ಆಯ್ಕೆಗಳು",
        },
        {
          id: "reschedule",
          title: "ಸುಲಭವಾಗಿ ದಿನಾಂಕ ಬದಲಾಯಿಸಿ",
          description: "ಆಸ್ಪತ್ರೆಗೆ ಮತ್ತೆ ಮತ್ತೆ ಅಲೆಯದೆ, ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಕೆಲವೇ ಸರಳ ಹಂತಗಳಲ್ಲಿ ಹೊಸ ದಿನಾಂಕ ಆರಿಸಿ.",
          actionText: "ದಿನಾಂಕ ಬದಲಾಯಿಸಿ",
        },
        {
          id: "help",
          title: "ತಕ್ಷಣ ನೆರವು ಪಡೆಯಿರಿ",
          description: "ಯಾವುದೇ ಸಂದೇಹವಿದ್ದರೂ ಉಚಿತ ಸಹಾಯವಾಣಿ ಅಥವಾ ನಿಮ್ಮ ಗ್ರಾಮದ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರ ನೆರವು ಪಡೆಯಿರಿ.",
          actionText: "ಸಹಾಯ ಕೇಂದ್ರ",
        },
      ],
    },
    appointment: {
      title: "ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
      subtitle: "ಕನ್ನಡದಲ್ಲಿ ವಿವರಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ",
      lookupTitle: "ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
      lookupDesc: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ೪-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
      phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      pinLabel: "೪-ಅಂಕಿಯ ಸುಲಭ ಕೋಡ್",
      searchBtn: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಹುಡುಕಿ",
      quickDemoFill: "ಬಸಪ್ಪ ಗೌಡರ ವಿವರ ತುಂಬಿ (ಡೆಮೊ)",
      detailsTitle: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾರ್ಡ್",
      testLabel: "ಪರೀಕ್ಷೆ / ಸ್ಕ್ಯಾನ್ ವಿವರ",
      dateLabel: "ದಿನಾಂಕ",
      timeLabel: "ಸಮಯ",
      hospitalLabel: "ಆಸ್ಪತ್ರೆಯ ಹೆಸರು",
      roomLabel: "ವಿಭಾಗ ಮತ್ತು ಕೊಠಡಿ",
      directionsLabel: "ತಲುಪುವ ಮಾರ್ಗ",
      preparationTitle: "ಪರೀಕ್ಷೆಗೆ ಮುನ್ನ ಪಾಲಿಸಬೇಕಾದ ನಿಯಮಗಳು (ಆಸ್ಪತ್ರೆ ಅನುಮೋದಿತ)",
      listenBtn: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ",
      pauseBtn: "ವಿರಾಮಗೊಳಿಸಿ",
      replayBtn: "ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ",
      playingAudioLabel: "ಕನ್ನಡದಲ್ಲಿ ವಿವರಗಳನ್ನು ಓದಲಾಗುತ್ತಿದೆ...",
      statusLabel: "ಸ್ಥಿತಿ",
      unconfirmed: "ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ",
      confirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ (ನಾನು ಹಾಜರಾಗುತ್ತೇನೆ)",
      rescheduled: "ಹೊಸ ದಿನಾಂಕ ನಿಗದಿಯಾಗಿದೆ",
      iWillAttendBtn: "ನಾನು ಖಂಡಿತ ಹಾಜರಾಗುತ್ತೇನೆ",
      iNeedToChangeBtn: "ದಿನಾಂಕ ಬದಲಾಯಿಸಬೇಕು",
      confirmedNotice: "ಧನ್ಯವಾದಗಳು! ನೀವು ಹಾಜರಾಗುವ ಮಾಹಿತಿಯನ್ನು ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಿಸಲಾಗಿದೆ.",
      changeNotice: "ದಿನಾಂಕ ಬದಲಾವಣೆ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೀರಿ...",
      emergencyCallBtn: "ಆಸ್ಪತ್ರೆಗೆ ನೇರ ಕರೆ ಮಾಡಿ",
    },
    reschedule: {
      title: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ ಬದಲಾವಣೆ",
      subtitle: "ಸರಳ ಮತ್ತು ಗೌರವಾನ್ವಿತ ಮರುನಿಗದಿ ಪ್ರಕ್ರಿಯೆ",
      step1: "೧. ಪ್ರಸ್ತುತ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
      step2: "೨. ಬದಲಾವಣೆ ವಿನಂತಿ",
      step3: "೩. ಹೊಸ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
      step4: "೪. ಪರಿಶೀಲನೆ",
      step5: "೫. ಹೊಸ ದೃಢೀಕರಣ",
      currentDetails: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ನಿಗದಿತ ಸ್ಕ್ಯಾನ್",
      selectNewDate: "ನಿಮಗೆ ಅನುಕೂಲಕರವಾದ ಹೊಸ ದಿನಾಂಕ ಆರಿಸಿ",
      morningSlots: "ಬೆಳಗಿನ ಸಮಯ (ಖಾಲಿ ಇರುವ ಸ್ಲಾಟ್‌ಗಳು)",
      afternoonSlots: "ಮಧ್ಯಾಹ್ನದ ಸಮಯ (ಖಾಲಿ ಇರುವ ಸ್ಲಾಟ್‌ಗಳು)",
      selectReason: "ದಿನಾಂಕ ಬದಲಾವಣೆಯ ಕಾರಣ ತಿಳಿಸಿ (ಐಚ್ಛಿಕ)",
      reasonTransport: "ವಾಹನ ಅಥವಾ ಬಸ್ ಸೌಲಭ್ಯವಿಲ್ಲ",
      reasonRelative: "ಜೊತೆಯಲ್ಲಿ ಬರಲು ಕುಟುಂಬಸ್ಥರು ಲಭ್ಯವಿಲ್ಲ",
      reasonHealth: "ಆರೋಗ್ಯದಲ್ಲಿ ಏರುಪೇರು / ಪ್ರಯಾಣಿಸಲು ಅಸಾಧ್ಯ",
      reasonConflict: "ಬೇರೆ ಪ್ರಮುಖ ಕೆಲಸದ ಕಾರಣ",
      reviewTitle: "ಹೊಸ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪರಿಶೀಲನೆ",
      confirmChangeBtn: "ಹೊಸ ದಿನಾಂಕವನ್ನು ಅಂತಿಮಗೊಳಿಸಿ",
      backBtn: "ಹಿಂದಕ್ಕೆ",
      successTitle: "ಹೊಸ ದಿನಾಂಕ ಯಶಸ್ವಿಯಾಗಿ ನಿಗದಿಯಾಗಿದೆ!",
      successMessage: "ನಿಮ್ಮ ಹೊಸ ದಿನಾಂಕವನ್ನು ಆಸ್ಪತ್ರೆಯ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ನವೀಕರಿಸಲಾಗಿದೆ. ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬದವರಿಗೆ SMS ಕಳುಹಿಸಲಾಗಿದೆ.",
      spokenSummaryPrompt: "ಹೊಸ ವಿವರಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
      listenNewSummary: "ಹೊಸ ವಿವರ ಆಲಿಸಿ",
      returnToHomeBtn: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    },
    reminders: {
      title: "ಬುದ್ಧಿವಂತ ಜ್ಞಾಪನೆ ವ್ಯವಸ್ಥೆ",
      subtitle: "ಸಂದೇಶ ತಪ್ಪಿಹೋಗದಂತೆ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಮಾಧ್ಯಮದಲ್ಲಿ ಜ್ಞಾಪನೆ ಪಡೆಯಿರಿ",
      channelsTitle: "ಜ್ಞಾಪನೆ ಪಡೆಯುವ ಮಾಧ್ಯಮಗಳು",
      smsOption: "ಕನ್ನಡ SMS ಸಂದೇಶ",
      smsDesc: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ನೇರ ಸಂದೇಶ ಬರುತ್ತದೆ.",
      voiceCallOption: "ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಕರೆ (IVR)",
      voiceCallDesc: "ಆಸ್ಪತ್ರೆಯಿಂದ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡುವ ಫೋನ್ ಕರೆ ಬರುತ್ತದೆ.",
      whatsappOption: "ವಾಟ್ಸಾಪ್ ಆಡಿಯೋ ನೋಟ್ & ಕಾರ್ಡ್",
      whatsappDesc: "ದೊಡ್ಡ ಚಿತ್ರ ಹಾಗೂ ಧ್ವನಿ ಸಂದೇಶದೊಂದಿಗೆ ವಾಟ್ಸಾಪ್ ಮಾಹಿತಿ.",
      caregiverOption: "ಕುಟುಂಬದ ಹಿತೈಷಿ / ಆರೈಕೆದಾರರ ನೆರವು",
      caregiverDesc: "ನೀವು ಪ್ರತಿಕ್ರಿಯಿಸದಿದ್ದಲ್ಲಿ ನಿಮ್ಮ ಮಗ ಅಥವಾ ಸಂಬಂಧಿಕರಿಗೆ ಮಾಹಿತಿ ತಿಳಿಸಲಾಗುತ್ತದೆ.",
      intervalsTitle: "ಜ್ಞಾಪನೆ ಕಳುಹಿಸುವ ಸಮಯಗಳು",
      sevenDays: "೭ ದಿನಗಳ ಮುಂಚಿತವಾಗಿ",
      oneDay: "೧ ದಿನದ ಮುಂಚಿತವಾಗಿ",
      fourHours: "೪ ಗಂಟೆಗಳ ಮುಂಚಿತವಾಗಿ",
      sameDayMorning: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನ ಮುಂಜಾನೆ ೭:೦೦ ಗಂಟೆಗೆ",
      caregiverCardTitle: "ಅಧಿಕೃತ ಆರೈಕೆದಾರರ ವಿವರಗಳು (Caregiver)",
      caregiverNameLabel: "ಆರೈಕೆದಾರರ ಹೆಸರು",
      caregiverPhoneLabel: "ಆರೈಕೆದಾರರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      caregiverRelationLabel: "ಸಂಬಂಧ",
      caregiverRuleLabel: "ಮಾಹಿತಿ ಕಳುಹಿಸುವ ನಿಯಮ",
      ruleAlways: "ಪ್ರತಿಯೊಂದು ಜ್ಞಾಪನೆಯ ಪ್ರತಿಯನ್ನು ಕಳುಹಿಸಿ",
      ruleUnconfirmedOnly: "ರೋಗಿ ೧೨ ಗಂಟೆಯೊಳಗೆ ದೃಢೀಕರಿಸದಿದ್ದಾಗ ಮಾತ್ರ ಕಳುಹಿಸಿ (ಸ್ವಾಭಿಮಾನ ರಕ್ಷಣೆ)",
      savePreferencesBtn: "ಆಯ್ಕೆಗಳನ್ನು ಉಳಿಸಿ",
      preferencesSavedMsg: "ನಿಮ್ಮ ಜ್ಞಾಪನೆ ಆಯ್ಕೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
      simulatorTitle: "ಜ್ಞಾಪನೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ (ಲೈವ್ ಡೆಮೊ)",
      simulateCallBtn: "ಕನ್ನಡ ಧ್ವನಿ ಕರೆ ಪರೀಕ್ಷಿಸಿ (IVR)",
      simulateSmsBtn: "ಕನ್ನಡ SMS ನೋಡಿ",
      simulateWhatsappBtn: "ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ನೋಡಿ",
    },
    howItWorksPage: {
      title: "CORE ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
      subtitle: "ಗ್ರಾಮೀಣ ಹಿರಿಯರ ಸ್ವಾಭಿಮಾನ ಮತ್ತು ಆರೋಗ್ಯ ಕಾಪಾಡುವ ಸರಳ ತಂತ್ರಜ್ಞಾನ",
      steps: [
        {
          number: "೧",
          title: "ಭಾಷೆಯ ಆಯ್ಕೆ",
          desc: "ರೋಗಿಯು ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಾದಾಗ ಅವರ ಆಡುಭಾಷೆಯನ್ನು (ಕನ್ನಡ / ತೆಲುಗು) ದಾಖಲಿಸಲಾಗುತ್ತದೆ.",
        },
        {
          number: "೨",
          title: "ಧ್ವನಿ ಸಂದೇಶ ರವಾನೆ",
          desc: "ಇಂಗ್ಲಿಷ್ ಕೇವಲ ಪಠ್ಯದ ಬದಲಾಗಿ, ರೋಗಿಯ ಭಾಷೆಯಲ್ಲೇ ಸ್ಪಷ್ಟವಾದ ಧ್ವನಿ ಕರೆ ಮತ್ತು ವಿವರ ರವಾನೆಯಾಗುತ್ತದೆ.",
        },
        {
          number: "೩",
          title: "ಒಂದು ಸ್ಪರ್ಶದ ದೃಢೀಕರಣ",
          desc: "ಫೋನ್ ಕರೆಯಲ್ಲಿ '೧ ಒತ್ತಿ' ಅಥವಾ ವೆಬ್‌ನಲ್ಲಿ ದೊಡ್ಡ ಬಟನ್ ಸ್ಪರ್ಶಿಸಿ ಹಾಜರಾತಿಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ.",
        },
        {
          number: "೪",
          title: "ಹಿತೈಷಿಗಳಿಗೆ ಮುಂಜಾಗ್ರತೆ",
          desc: "ರೋಗಿ ಸಂದೇಶ ಗಮನಿಸದಿದ್ದಲ್ಲಿ ಮಾತ್ರ ಅಧಿಕೃತ ಹಿತೈಷಿಗಳಿಗೆ ಮಾಹಿತಿ ಹೋಗಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ರದ್ದಾಗುವುದು ತಪ್ಪುತ್ತದೆ.",
        },
      ],
      ruralFocusTitle: "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ರೂಪಿಸಿದ ವೇದಿಕೆ",
      ruralFocusDesc: "ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್ ವೇಗವಿರುವ ಸಾಮಾನ್ಯ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ಗಳಲ್ಲಿಯೂ ಯಾವುದೇ ತೊಂದರೆಯಿಲ್ಲದೆ ಸರಾಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    },
    help: {
      title: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
      subtitle: "ನಿಮಗೆ ಯಾರಾದರೂ ಜೊತೆಯಾಗಿ ಸಹಾಯ ಮಾಡಬೇಕೆ? ನಾವು ಸದಾ ಸಿದ್ಧರಿದ್ದೇವೆ.",
      tollFreeCardTitle: "ಆಸ್ಪತ್ರೆ ಹಾಗೂ ರೋಗಿ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರ",
      tollFreeNumber: "ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ & ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ನೆರವು",
      tollFreeHours: "ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ೭:೦೦ ರಿಂದ ರಾತ್ರಿ ೯:೦೦ ವರೆಗೆ ಲಭ್ಯ",
      callNowBtn: "ಮಾರ್ಗದರ್ಶನ ಆಲಿಸಿ (ಆಡಿಯೋ)",
      ashaCardTitle: "ಗ್ರಾಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರ ಬೆಂಬಲ",
      ashaCardDesc: "ನಿಮ್ಮ ಗ್ರಾಮದ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ನಿಮ್ಮ ಮನೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನೆರವಾಗುತ್ತಾರೆ.",
      faqsTitle: "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೋತ್ತರಗಳು (FAQ)",
      faqs: [
        {
          q: "ನನಗೆ ಓದಲು ಬರೆಯಲು ಬರುವುದಿಲ್ಲ, ನಾನು ಇದನ್ನು ಹೇಗೆ ಬಳಸಬಹುದು?",
          a: "ನೀವು ಏನನ್ನೂ ಓದುವ ಅಗತ್ಯವಿಲ್ಲ. 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಆಲಿಸಿ' ಎಂಬ ದೊಡ್ಡ ಸ್ಪೀಕರ್ ಬಟನ್ ಒತ್ತಿದರೆ ಸಾಕು, ಸಂಪೂರ್ಣ ಮಾಹಿತಿಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಓದಿ ಹೇಳಲಾಗುತ್ತದೆ.",
        },
        {
          q: "ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ಬದಲಾಯಿಸಲು ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕೆ?",
          a: "ಇಲ್ಲ. 'ದಿನಾಂಕ ಬದಲಾಯಿಸಿ' ವಿಭಾಗದಲ್ಲಿ ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಹೊಸ ದಿನಾಂಕ ಆರಿಸಬಹುದು. ಆಸ್ಪತ್ರೆಗೆ ಅಲೆದಾಡುವ ಅಗತ್ಯವಿಲ್ಲ.",
        },
        {
          q: "ನನ್ನ ಮಗ ಅಥವಾ ಮಗಳಿಗೆ ಈ ಮಾಹಿತಿ ತಿಳಿಯುವುದು ಹೇಗೆ?",
          a: "ನೀವು ಅನುಮತಿ ನೀಡಿದರೆ ಮಾತ್ರ ಅವರ ಫೋನ್ ಸಂಖ್ಯೆಗೆ ಜ್ಞಾಪನೆ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
        },
      ],
    },
    about: {
      title: "CORE ವೇದಿಕೆಯ ಧ್ಯೇಯ",
      tagline: "ಆರೋಗ್ಯ ಸೇವೆ ಎಲ್ಲರ ಮಾತನ್ನು ಅರಿಯಬೇಕು",
      philosophyTitle: "ನಮ್ಮ ಮೂಲ ವಿನ್ಯಾಸ ತತ್ವ",
      philosophyQuote: "ಆರೋಗ್ಯ ರಕ್ಷಣೆಯು ರೋಗಿಯ ಸಾಮರ್ಥ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಹೊಂದಿಕೊಳ್ಳಬೇಕೇ ಹೊರತು, ತಂತ್ರಜ್ಞಾನಕ್ಕೆ ರೋಗಿ ಹೊಂದಿಕೊಳ್ಳಬೇಕೆಂದು ಒತ್ತಾಯಿಸಬಾರದು.",
      philosophyDesc: "ಭಾರತದ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಲಕ್ಷಾಂತರ ಹಿರಿಯರು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಯ ಕಾರಣದಿಂದ ಅಥವಾ ಡಿಜಿಟಲ್ ತಿಳಿವಳಿಕೆಯ ಕೊರತೆಯಿಂದ ಮುಖ್ಯವಾದ ಚಿಕಿತ್ಸೆ ಮತ್ತು ರೋಗನಿದಾನ ಪರೀಕ್ಷೆಗಳನ್ನು ಕಳೆದುಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ. CORE ಈ ಕಂದಕವನ್ನು ಮುಚ್ಚುವ ಗೌರವಾನ್ವಿತ ಪ್ರಯತ್ನ.",
      problemTitle: "ನಾವು ಪರಿಹರಿಸುತ್ತಿರುವ ನೈಜ ಸಮಸ್ಯೆ",
      problemStory: "೬೦ ವರ್ಷದ ಬಸಪ್ಪನವರಿಗೆ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ಇಂಗ್ಲಿಷ್ ಎಸ್ಸೆಮ್ಮೆಸ್‌ನಲ್ಲಿ ಬಂತು. ಅವರಿಗೆ ಇಂಗ್ಲಿಷ್ ಓದಲು ಬಾರದ ಕಾರಣ ಸಂಬಂಧಿಕರಿಗೆ ತೋರಿಸಿದರು. ಆದರೆ ಆ ವ್ಯಕ್ತಿ ಅದನ್ನು ಮರೆತಿದ್ದರಿಂದ ಬಸಪ್ಪನವರು ಸ್ಕ್ಯಾನ್ ಕಳೆದುಕೊಂಡರು. ಮತ್ತೆ ಆಸ್ಪತ್ರೆಗೆ ಬಸ್ ಹತ್ತಿ ಬರಬೇಕಾಯಿತು. CORE ನೊಂದಿಗೆ ಈ ಪರಿಸ್ಥಿತಿ ಮರುಕಳಿಸುವುದಿಲ್ಲ.",
      pillarsTitle: "ನಮ್ಮ ನಾಲ್ಕು ಮುಖ್ಯ ಆಧಾರಸ್ಥಂಭಗಳು",
      pillars: [
        {
          title: "ಧ್ವನಿಗೆ ಮೊದಲ ಆದ್ಯತೆ",
          desc: "ಅಕ್ಷರಗಳಿಗಿಂತ ಆಡುವ ಮಾತು ಮತ್ತು ಆಲಿಸುವ ಧ್ವನಿಗೆ ಅಗ್ರಸ್ಥಾನ.",
        },
        {
          title: "ಸ್ಥಳೀಯ ಭಾಷಾ ಸಮೃದ್ಧತೆ",
          desc: "ಕನ್ನಡ ಮತ್ತು ತೆಲುಗಿನಲ್ಲಿ ಸ್ಪಷ್ಟ, ಸ್ವಾಭಾವಿಕ ಆಡುನುಡಿಯ ಬಳಕೆ.",
        },
        {
          title: "ಹಿರಿಯರ ಸ್ವಾಭಿಮಾನ",
          desc: "ಇತರರ ಮೇಲೆ ಅತಿಯಾಗಿ ಅವಲಂಬಿತರಾಗದೆ ತಾವೇ ಸ್ವತಂತ್ರವಾಗಿ ನಿರ್ವಹಿಸುವ ಶಕ್ತಿ.",
        },
        {
          title: "ಸರಳ ಮತ್ತು ಸ್ಪಷ್ಟ ವಿನ್ಯಾಸ",
          desc: "ಗೊಂದಲವಿಲ್ಲದ ದೊಡ್ಡ ಅಕ್ಷರಗಳು, ಪ್ರಶಾಂತ ಬಣ್ಣಗಳು ಮತ್ತು ಸುಲಭ ಗುಂಡಿಗಳು.",
        },
      ],
    },
    staff: {
      title: "ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣಾ ಫಲಕ",
      subtitle: "ಜಿಲ್ಲಾ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ — ರೇಡಿಯಾಲಜಿ ಮತ್ತು ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ವಿಭಾಗ",
      demoNotice: "ಗಮನಿಸಿ: ಇದು ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯ ಕಾರ್ಯವಿಧಾನವನ್ನು ತೋರಿಸುವ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ (ಡೆಮೊ) ಆಗಿದೆ.",
      statsTotal: "ಇಂದಿನ ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು",
      statsUnconfirmed: "ದೃಢೀಕರಣ ಬಾಕಿ (ಅಪಾಯದಲ್ಲಿರುವವರು)",
      statsRescheduled: "ದಿನಾಂಕ ಬದಲಾವಣೆ ವಿನಂತಿಗಳು",
      statsCaregivers: "ಹಿತೈಷಿಗಳಿಗೆ ಮುಟ್ಟಿಸಿದ ಸಂದೇಶಗಳು",
      filterAll: "ಎಲ್ಲಾ ರೋಗಿಗಳು",
      filterUnconfirmed: "ದೃಢೀಕರಣ ಬಾಕಿ",
      filterRescheduled: "ಮರುನಿಗದಿಗೊಂಡವು",
      searchPlaceholder: "ರೋಗಿಯ ಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹುಡುಕಿ...",
      colPatient: "ರೋಗಿಯ ಹೆಸರು ಮತ್ತು ವಯಸ್ಸು",
      colTest: "ಪರೀಕ್ಷಾ ವಿವರ",
      colDate: "ದಿನಾಂಕ & ಸಮಯ",
      colLanguage: "ಆಯ್ಕೆಯ ಭಾಷೆ",
      colStatus: "ಸ್ಥಿತಿ",
      colActions: "ಕ್ರಮಗಳು",
      triggerCallBtn: "ಧ್ವನಿ ಕರೆ ರವಾನಿಸಿ",
      rescheduleBtn: "ದಿನಾಂಕ ಬದಲಾಯಿಸಿ",
      viewDetailsBtn: "ವಿವರ ನೋಡಿ",
      newAppointmentBtn: "ಹೊಸ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಸೇರಿಸಿ",
    },
    footer: {
      mission: "CORE — ಗ್ರಾಮೀಣ ಮತ್ತು ಹಿರಿಯ ರೋಗಿಗಳಿಗೆ ಭಾಷಾ ಮತ್ತು ಧ್ವನಿ ಆಧಾರಿತ ಆರೋಗ್ಯ ಸಂಪರ್ಕ ವೇದಿಕೆ.",
      quickLinks: "ಮುಖ್ಯ ಕೊಂಡಿಗಳು",
      contactSupport: "ಸಂಪರ್ಕ ಮತ್ತು ಸಹಾಯ",
      tollFree: "ಜಿಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಆಸ್ಪತ್ರೆ ರೋಗಿ ಮಾಹಿತಿ ವಿಭಾಗ",
      districtOffices: "ಜಿಲ್ಲಾ ಸಾರ್ವಜನಿಕ ಆಸ್ಪತ್ರೆ ಮಾಹಿತಿ ಕೇಂದ್ರ",
      disclaimer: "ಇದು ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಸುಧಾರಣೆಗಾಗಿ ರೂಪಿಸಲಾದ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾದರಿಯಾಗಿದೆ. ಯಾವುದೇ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 108 ಅಥವಾ ಸ್ಥಳೀಯ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      privacyPledge: "ರೋಗಿಯ ಖಾಸಗಿತನ ಮತ್ತು ಗೌರವಕ್ಕೆ ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆ.",
    },
  },
  te: {
    appName: "CORE",
    tagline: "మీ భాషలో మాట్లాడే ఆరోగ్య సంరక్షణ",
    nav: {
      home: "హోమ్",
      myAppointment: "నా అపాయింట్‌మెంట్",
      reschedule: "తేదీ మార్పు",
      reminders: "రిమైండర్లు",
      howItWorks: "ఇది ఎలా పనిచేస్తుంది",
      getHelp: "సహాయం పొందండి",
      about: "CORE గురించి",
      staffPortal: "హాస్పిటల్ సిబ్బంది",
    },
    accessibility: {
      textSize: "అక్షర పరిమాణం",
      highContrast: "హై కాంట్రాస్ట్",
      voiceAssistance: "వాయిస్ సహాయం",
      normal: "సాధారణం",
      large: "పెద్దది",
      extraLarge: "చాలా పెద్దది",
      close: "మూసివేయి",
    },
    hero: {
      headline: "మిమ్మల్ని అర్థం చేసుకునే సంరక్షణ",
      subtitle: "మీ హాస్పిటల్ అపాయింట్‌మెంట్ వివరాలను సులభంగా అర్థం చేసుకోండి, వాయిస్ ద్వారా వినండి, అవసరమైన సహాయం పొందండి — మీ సొంత తెలుగు భాషలో.",
      hearAppointmentBtn: "నా అపాయింట్‌మెంట్ వినండి",
      viewAppointmentBtn: "అపాయింట్‌మెంట్ చూడండి",
      scenarioPill: "గ్రామీణ వృద్ధుల నిజ జీవిత సమస్య",
      scenarioTitle: "వెంకటప్ప నాయుడు (60 ఏళ్ళు) గారి అనుభవం",
      scenarioDesc: "ఇంగ్లీష్ SMS చదవడం రాకపోవడం వల్ల CT స్కాన్ కోల్పోయే సమస్యను CORE వాయిస్ కాల్స్ మరియు తెలుగు ద్వారా పూర్తిగా పరిష్కరిస్తుంది.",
      tryDemoBtn: "వెంకటప్ప గారి అపాయింట్‌మెంట్ చూడండి",
    },
    howItHelps: {
      sectionTitle: "CORE మీకు ఎలా సహాయపడుతుంది?",
      sectionSubtitle: "సాంకేతికతకు రోగి మారనవసరం లేదు, రోగి అవసరాలకు అనుగుణంగా సాంకేతికత మారాలి.",
      cards: [
        {
          id: "hear",
          title: "వాయిస్‌లో వినండి",
          description: "చదవడం రాకపోయినా మీ స్కాన్ తేదీ, సమయం మరియు తీసుకోవాల్సిన జాగ్రత్తలను స్పష్టమైన తెలుగులో వినండి.",
          actionText: "ఆడియో వినండి",
        },
        {
          id: "remind",
          title: "ముఖ్యమైన రిమైండర్ మిస్ కావద్దు",
          description: "మీ మొబైల్‌కు తెలుగులో ఆడియో కాల్ లేదా SMS ద్వారా సరైన సమయానికి రిమైండర్ అందుతుంది.",
          actionText: "రిమైండర్ సెట్టింగ్స్",
        },
        {
          id: "reschedule",
          title: "తేదీని సులభంగా మార్చుకోండి",
          description: "హాస్పిటల్ చుట్టూ తిరగాల్సిన అవసరం లేకుండా, ఇంట్లోనే కూర్చుని కొత్త తేదీని సులభంగా ఎంచుకోండి.",
          actionText: "తేదీ మార్చుకోండి",
        },
        {
          id: "help",
          title: "అవసరమైనప్పుడు సహాయం పొందండి",
          description: "ఏదైనా సందేహం ఉంటే ఉచిత హెల్ప్‌లైన్ లేదా మీ గ్రామ ఆశా కార్యకర్త సహాయం తీసుకోండి.",
          actionText: "సహాయ కేంద్రం",
        },
      ],
    },
    appointment: {
      title: "మీ హాస్పిటల్ అపాయింట్‌మెంట్",
      subtitle: "తెలుగులో వివరాలు వినండి మరియు నిర్ధారించండి",
      lookupTitle: "మీ వివరాలను చూడండి",
      lookupDesc: "మీ మొబైల్ నంబర్ లేదా 4-అంకెల కోడ్ నమోదు చేయండి",
      phoneLabel: "మొబైల్ నంబర్",
      pinLabel: "4-అంకెల సులభ కోడ్",
      searchBtn: "అపాయింట్‌మెంట్ కనుగొనండి",
      quickDemoFill: "నమూనా రోగి వివరాలు నింపండి (డెమో)",
      detailsTitle: "అపాయింట్‌మెంట్ వివరాల కార్డు",
      testLabel: "పరీక్ష / స్కాన్ వివరాలు",
      dateLabel: "తేదీ",
      timeLabel: "సమయం",
      hospitalLabel: "హాస్పిటల్ పేరు",
      roomLabel: "విభాగం మరియు గది",
      directionsLabel: "చేరుకునే మార్గం",
      preparationTitle: "పరీక్షకు ముందు పాటించవలసిన జాగ్రత్తలు (హాస్పిటల్ సూచనలు)",
      listenBtn: "అపాయింట్‌మెంట్ వినండి",
      pauseBtn: "ఆపండి",
      replayBtn: "మళ్ళీ వినండి",
      playingAudioLabel: "తెలుగులో వివరాలు చదువుతున్నాము...",
      statusLabel: "స్థితి",
      unconfirmed: "నిర్ధారణ పెండింగ్‌లో ఉంది",
      confirmed: "నిర్ధారించబడింది (నేను హాజరవుతాను)",
      rescheduled: "కొత్త తేదీ నిర్ణయించబడింది",
      iWillAttendBtn: "నేను ఖచ్చితంగా హాజరవుతాను",
      iNeedToChangeBtn: "నేను తేదీ మార్చాలి",
      confirmedNotice: "ధన్యవాదాలు! మీ రాక హాస్పిటల్ సిబ్బందికి నమోదు చేయబడింది.",
      changeNotice: "తేదీ మార్పు పేజీకి వెళ్తున్నారు...",
      emergencyCallBtn: "హాస్పిటల్ సిబ్బందితో మాట్లాడండి",
    },
    reschedule: {
      title: "అపాయింట్‌మెంట్ తేదీ మార్పు",
      subtitle: "సులభమైన మరియు గౌరవప్రదమైన ప్రక్రియ",
      step1: "1. ప్రస్తుత అపాయింట్‌మెంట్",
      step2: "2. మార్పు అభ్యర్థన",
      step3: "3. కొత్త తేదీ మరియు సమయం",
      step4: "4. సమీక్ష",
      step5: "5. కొత్త నిర్ధారణ",
      currentDetails: "మీ ప్రస్తుత అపాయింట్‌మెంట్ వివరాలు",
      selectNewDate: "మీకు అనువైన కొత్త తేదీని ఎంచుకోండి",
      morningSlots: "ఉదయం సమయం (ఖాళీగా ఉన్న సమయాలు)",
      afternoonSlots: "మధ్యాహ్నం సమయం (ఖాళీగా ఉన్న సమయాలు)",
      selectReason: "తేదీ మార్పుకు కారణం తెలపండి (ఐచ్ఛికం)",
      reasonTransport: "రవాణా లేదా బస్సు సౌకర్యం లేదు",
      reasonRelative: "తోడుగా రావడానికి బంధువులు అందుబాటులో లేరు",
      reasonHealth: "ఆరోగ్యం బాగాలేదు / ప్రయాణం చేయలేను",
      reasonConflict: "ఇతర ముఖ్యమైన పని కారణంగా",
      reviewTitle: "కొత్త అపాయింట్‌మెంట్ సమీక్ష",
      confirmChangeBtn: "కొత్త తేదీని ఖరారు చేయండి",
      backBtn: "వెనుకకు",
      successTitle: "కొత్త తేదీ విజయవంతంగా ఖరారైంది!",
      successMessage: "మీ కొత్త తేదీ హాస్పిటల్ సిస్టమ్‌లో అప్‌డేట్ చేయబడింది. మీకు మరియు మీ కుటుంబ సభ్యులకు SMS పంపబడింది.",
      spokenSummaryPrompt: "కొత్త వివరాలను వాయిస్ ద్వారా వినడానికి ఇక్కడ క్లిక్ చేయండి",
      listenNewSummary: "కొత్త వివరాలు వినండి",
      returnToHomeBtn: "హోమ్‌కు తిరిగి వెళ్ళండి",
    },
    reminders: {
      title: "తెలివైన రిమైండర్ వ్యవస్థ",
      subtitle: "సమాచారం మిస్ కాకుండా మీ ఇష్టమైన మాధ్యమంలో రిమైండర్ పొందండి",
      channelsTitle: "రిమైండర్ అందుకోవలసిన మాధ్యమాలు",
      smsOption: "తెలుగు SMS మెసేజ్",
      smsDesc: "మీ మొబైల్‌కు తెలుగు లిపిలో నేరుగా మెసేజ్ వస్తుంది.",
      voiceCallOption: "ఆటోమేటిక్ వాయిస్ కాల్ (IVR)",
      voiceCallDesc: "హాస్పిటల్ నుండి తెలుగులో మాట్లాడే ఫోన్ కాల్ వస్తుంది.",
      whatsappOption: "వాట్సాప్ ఆడియో నోట్ & కార్డు",
      whatsappDesc: "పెద్ద ఫోటో మరియు వాయిస్ మెసేజ్‌తో కూడిన వివరాలు.",
      caregiverOption: "కుటుంబ సభ్యుడు / సంరక్షకుడి సహాయం",
      caregiverDesc: "మీరు సమాధానం ఇవ్వకపోతే మీ అబ్బాయి లేదా బంధువుకు సమాచారం చేరుతుంది.",
      intervalsTitle: "రిమైండర్ పంపవలసిన సమయాలు",
      sevenDays: "7 రోజుల ముందు",
      oneDay: "1 రోజు ముందు",
      fourHours: "4 గంటల ముందు",
      sameDayMorning: "అపాయింట్‌మెంట్ రోజు ఉదయం 7:00 గంటలకు",
      caregiverCardTitle: "అధీకృత సంరక్షకుడి వివరాలు (Caregiver)",
      caregiverNameLabel: "సంరక్షకుడి పేరు",
      caregiverPhoneLabel: "మొబైల్ నంబర్",
      caregiverRelationLabel: "సంబంధం",
      caregiverRuleLabel: "సమాచారం పంపే నియమం",
      ruleAlways: "ప్రతి రిమైండర్ కాపీని పంపండి",
      ruleUnconfirmedOnly: "రోగి 12 గంటల్లో స్పందించనప్పుడు మాత్రమే పంపండి (రోగి ఆత్మగౌరవం కాపాడుతుంది)",
      savePreferencesBtn: "ఎంపికలను సేవ్ చేయండి",
      preferencesSavedMsg: "మీ రిమైండర్ ఎంపికలు విజయవంతంగా సేవ్ చేయబడ్డాయి!",
      simulatorTitle: "రిమైండర్ ప్రత్యక్ష డెమో",
      simulateCallBtn: "తెలుగు వాయిస్ కాల్ పరీక్షించండి (IVR)",
      simulateSmsBtn: "తెలుగు SMS చూడండి",
      simulateWhatsappBtn: "వాట్సాప్ మెసేజ్ చూడండి",
    },
    howItWorksPage: {
      title: "CORE ఎలా పనిచేస్తుంది?",
      subtitle: "గ్రామీణ వృద్ధుల ఆత్మగౌరవం మరియు ఆరోగ్యాన్ని కాపాడే సులభ సాంకేతికత",
      steps: [
        {
          number: "1",
          title: "భాష ఎంపిక",
          desc: "రోగి హాస్పిటల్‌లో చేరినప్పుడు వారి మాట్లాడే భాషను (తెలుగు / కన్నడ) నమోదు చేస్తారు.",
        },
        {
          number: "2",
          title: "వాయిస్ సందేశం",
          desc: "కేవలం ఇంగ్లీష్ టెక్స్ట్ కాకుండా, వారి భాషలోనే స్పష్టమైన ఫోన్ కాల్ మరియు ఆడియో అందుతుంది.",
        },
        {
          number: "3",
          title: "ఒక్క స్పర్శతో నిర్ధారణ",
          desc: "ఫోన్ కాల్లో '1 నొక్కండి' లేదా వెబ్‌సైట్‌లో పెద్ద బటన్ తాకి తమ రాకను తెలియజేస్తారు.",
        },
        {
          number: "4",
          title: "సంరక్షకుడికి ముందస్తు హెచ్చరిక",
          desc: "రోగి సందేశం గమనించకపోతే మాత్రమే అధీకృత సంరక్షకుడికి సమాచారం వెళ్లి అపాయింట్‌మెంట్ రద్దు కాకుండా చూస్తుంది.",
        },
      ],
      ruralFocusTitle: "గ్రామీణ ప్రాంతాల కోసం ప్రత్యేకంగా రూపొందించబడింది",
      ruralFocusDesc: "నెమ్మదిగా ఉండే 2G/3G ఇంటర్నెట్‌లోనూ మరియు సాధారణ స్మార్ట్‌ఫోన్లలోనూ సులువుగా పనిచేస్తుంది.",
    },
    help: {
      title: "సహాయం మరియు మద్దతు",
      subtitle: "మీకు ఎవరైనా సహాయం చేయాలా? మేము ఎల్లప్పుడూ సిద్ధంగా ఉన్నాము.",
      tollFreeCardTitle: "హాస్పిటల్ మరియు రోగి మార్గదర్శక కేంద్రం",
      tollFreeNumber: "జిల్లా హాస్పిటల్ & ఆశా కార్యకర్త సహాయం",
      tollFreeHours: "ప్రతిరోజూ ఉదయం 7:00 నుండి రాత్రి 9:00 వరకు అందుబాటులో ఉంది",
      callNowBtn: "సమాచారం వాయిస్‌లో వినండి",
      ashaCardTitle: "గ్రామ ఆశా కార్యకర్త సహాయం",
      ashaCardDesc: "మీ గ్రామంలోని ఆశా కార్యకర్త మీ ఇంటికి వచ్చి అపాయింట్‌మెంట్ వివరాలను అర్థం చేసుకోవడంలో సహాయం చేస్తారు.",
      faqsTitle: "తరచూ అడిగే ప్రశ్నలు (FAQ)",
      faqs: [
        {
          q: "నాకు చదవడం రాయడం రాదు, నేను దీన్ని ఎలా ఉపయోగించాలి?",
          a: "మీరు ఏమీ చదవవలసిన అవసరం లేదు. 'అపాయింట్‌మెంట్ వినండి' అనే పెద్ద స్పీకర్ బటన్ నొక్కితే మొత్తం సమాచారం తెలుగులో వినిపిస్తుంది.",
        },
        {
          q: "స్కాన్ తేదీ మార్చుకోవడానికి హాస్పిటల్‌కు వెళ్లాలా?",
          a: "అవసరం లేదు. 'తేదీ మార్పు' పేజీలో నిమిషాల వ్యవధిలో కొత్త తేదీని ఎంచుకోవచ్చు.",
        },
        {
          q: "ఈ సమాచారం నా కొడుకు లేదా కూతురికి ఎలా తెలుస్తుంది?",
          a: "మీరు అనుమతి ఇస్తే మాత్రమే వారి మొబైల్‌కు రిమైండర్ మెసేజ్ వెళుతుంది.",
        },
      ],
    },
    about: {
      title: "CORE వేదిక లక్ష్యం",
      tagline: "ఆరోగ్య సంరక్షణ అందరి భాషలో మాట్లాడాలి",
      philosophyTitle: "మా ప్రధాన రూపకల్పన సిద్ధాంతం",
      philosophyQuote: "ఆరోగ్య సంరక్షణ రోగి సామర్థ్యాలకు అనుగుణంగా మారాలి కానీ, సాంకేతికతకు రోగి అలవాటు పడాలని డిమాండ్ చేయకూడదు.",
      philosophyDesc: "భారతదేశంలోని గ్రామీణ ప్రాంతాలలో వేలాది మంది వృద్ధులు ఇంగ్లీష్ భాష రాకపోవడం మరియు డిజిటల్ పరిజ్ఞానం లేకపోవడం వల్ల కీలకమైన స్కానింగ్‌లు మరియు చికిత్సలను కోల్పోతున్నారు. CORE వారి ఆత్మగౌరవాన్ని కాపాడే ప్రయత్నం.",
      problemTitle: "మేము పరిష్కరిస్తున్న వాస్తవ సమస్య",
      problemStory: "60 ఏళ్ళ వెంకటప్ప గారికి CT స్కాన్ తేదీ ఇంగ్లీష్ SMSలో వచ్చింది. అది అర్థం కాక బంధువుకు చూపించారు, కానీ వారు మర్చిపోవడం వల్ల స్కాన్ మిస్ అయ్యింది. మళ్ళీ హాస్పిటల్ చుట్టూ తిరగాల్సి వచ్చింది. COREతో ఈ సమస్య ఇక రాదు.",
      pillarsTitle: "మా నాలుగు మూలస్తంభాలు",
      pillars: [
        {
          title: "వాయిస్ ప్రాధాన్యత",
          desc: "అక్షరాల కంటే మాట్లాడే మాట మరియు వినే ధ్వనికి మొదటి స్థానం.",
        },
        {
          title: "ప్రాంతీయ భాషా స్పష్టత",
          desc: "తెలుగు మరియు కన్నడలో సహజమైన, స్పష్టమైన భాషా వినియోగం.",
        },
        {
          title: "వృద్ధుల ఆత్మగౌరవం",
          desc: "ఇతరులపై ఆధారపడకుండా స్వతంత్రంగా తమ ఆరోగ్యాన్ని నిర్వహించుకునే శక్తి.",
        },
        {
          title: "సులభమైన స్పష్టమైన డిజైన్",
          desc: "గందరగోళం లేని పెద్ద అక్షరాలు, ప్రశాంతమైన రంగులు మరియు పెద్ద బటన్లు.",
        },
      ],
    },
    staff: {
      title: "హాస్పిటల్ సిబ్బంది నిర్వహణ ప్యానెల్",
      subtitle: "జిల్లా ప్రభుత్వ హాస్పిటల్ — రేడియాలజీ మరియు CT స్కాన్ విభాగం",
      demoNotice: "గమనిక: ఇది హాస్పిటల్ సిబ్బంది వర్క్‌ఫ్లోను చూపే డెమో ప్యానెల్.",
      statsTotal: "నేటి మొత్తం స్కాన్లు",
      statsUnconfirmed: "నిర్ధారణ పెండింగ్ (రిస్క్‌లో ఉన్నవారు)",
      statsRescheduled: "తేదీ మార్పు అభ్యర్థనలు",
      statsCaregivers: "సంరక్షకులకు చేరిన సందేశాలు",
      filterAll: "అందరు రోగులు",
      filterUnconfirmed: "నిర్ధారణ పెండింగ్",
      filterRescheduled: "తేదీ మారినవి",
      searchPlaceholder: "రోగి పేరు లేదా మొబైల్ నంబర్ వెతకండి...",
      colPatient: "రోగి పేరు మరియు వయస్సు",
      colTest: "పరీక్ష వివరాలు",
      colDate: "తేదీ & సమయం",
      colLanguage: "ప్రాధాన్య భాష",
      colStatus: "స్థితి",
      colActions: "చర్యలు",
      triggerCallBtn: "వాయిస్ కాల్ పంపండి",
      rescheduleBtn: "తేదీ మార్చండి",
      viewDetailsBtn: "వివరాలు చూడండి",
      newAppointmentBtn: "కొత్త అపాయింట్‌మెంట్ జోడించండి",
    },
    footer: {
      mission: "CORE — గ్రామీణ మరియు వృద్ధ రోగులకు భాష మరియు వాయిస్ ఆధారిత ఆరోగ్య సంరక్షణ వేదిక.",
      quickLinks: "ముఖ్యమైన లింకులు",
      contactSupport: "సంప్రదించండి",
      tollFree: "జిల్లా ప్రభుత్వ హాస్పిటల్ రోగి సమాచార విభాగం",
      districtOffices: "జిల్లా ప్రభుత్వ హాస్పిటల్ సమాచార కేంద్రం",
      disclaimer: "ఇది ప్రజారోగ్య అవగాహన కోసం రూపొందించబడిన డెమో నమూనా. అత్యవసర పరిస్థితుల్లో 108 లేదా స్థానిక వైద్యుడిని సంప్రదించండి.",
      privacyPledge: "రోగి వ్యక్తిగత గోప్యత మరియు గౌరవానికి మా అత్యున్నత ప్రాధాన్యత.",
    },
  },
  en: {
    appName: "CORE",
    tagline: "Healthcare that speaks your language.",
    nav: {
      home: "Home",
      myAppointment: "My Appointment",
      reschedule: "Reschedule",
      reminders: "Reminders",
      howItWorks: "How It Works",
      getHelp: "Get Help",
      about: "About CORE",
      staffPortal: "Hospital Staff",
    },
    accessibility: {
      textSize: "Text Size",
      highContrast: "High Contrast",
      voiceAssistance: "Voice Assistance",
      normal: "Standard",
      large: "Large",
      extraLarge: "Extra Large",
      close: "Close",
    },
    hero: {
      headline: "Care that understands you.",
      subtitle: "Your healthcare journey, made simpler. Understand appointments, receive reminders, and get the help you need — in your own language.",
      hearAppointmentBtn: "Hear My Appointment",
      viewAppointmentBtn: "View My Appointment",
      scenarioPill: "Real-World Rural Patient Scenario",
      scenarioTitle: "Basappa Gowda's Story (60 Years Old)",
      scenarioDesc: "Preventing missed CT scans caused by unread English SMS notifications through clear spoken voice calls and native Kannada communication.",
      tryDemoBtn: "Explore Basappa's Appointment",
    },
    howItHelps: {
      sectionTitle: "How CORE Helps You",
      sectionSubtitle: "Healthcare should adapt to the patient's abilities, not demand that the patient adapt to technology.",
      cards: [
        {
          id: "hear",
          title: "Hear Your Appointment",
          description: "Listen to test dates, times, and hospital preparation instructions read aloud naturally in Kannada, Telugu, or English.",
          actionText: "Listen to Audio",
        },
        {
          id: "remind",
          title: "Never Miss a Reminder",
          description: "Receive timely automated voice phone calls, native SMS, and optional WhatsApp notes before your scan.",
          actionText: "Manage Reminders",
        },
        {
          id: "reschedule",
          title: "Change Appointment Easily",
          description: "Choose a new available hospital slot in 5 simple steps without travelling to the hospital or waiting in queues.",
          actionText: "Change Date",
        },
        {
          id: "help",
          title: "Receive Help When You Need It",
          description: "One-touch toll-free helpline support in your language, backed by village ASHA healthcare workers.",
          actionText: "Get Assistance",
        },
      ],
    },
    appointment: {
      title: "Your Diagnostic Appointment",
      subtitle: "Understand details with natural voice readout and simple confirmation",
      lookupTitle: "Verify & Retrieve Appointment",
      lookupDesc: "Enter your registered phone number or 4-digit card PIN",
      phoneLabel: "Phone Number",
      pinLabel: "4-Digit Simplified PIN",
      searchBtn: "Retrieve Appointment",
      quickDemoFill: "Fill Basappa Gowda (Demo)",
      detailsTitle: "Patient Diagnostic Card",
      testLabel: "Diagnostic Procedure",
      dateLabel: "Scheduled Date",
      timeLabel: "Reporting Time",
      hospitalLabel: "Hospital & Location",
      roomLabel: "Department & Room",
      directionsLabel: "Arrival Directions",
      preparationTitle: "Hospital-Approved Preparation Instructions",
      listenBtn: "Listen to My Appointment",
      pauseBtn: "Pause Audio",
      replayBtn: "Replay Audio",
      playingAudioLabel: "Playing appointment details aloud in selected language...",
      statusLabel: "Status",
      unconfirmed: "Confirmation Pending",
      confirmed: "Confirmed (Patient Attending)",
      rescheduled: "Rescheduled to New Slot",
      iWillAttendBtn: "I Will Attend",
      iNeedToChangeBtn: "I Need to Change My Appointment",
      confirmedNotice: "Thank you! Your attendance has been logged for hospital staff.",
      changeNotice: "Redirecting to simple rescheduling...",
      emergencyCallBtn: "Direct Hospital Help Desk",
    },
    reschedule: {
      title: "Reschedule Your Appointment",
      subtitle: "A dignified 5-step rescheduling process that requires no repeated registration",
      step1: "1. Current Appointment",
      step2: "2. Request Change",
      step3: "3. Choose Available Slot",
      step4: "4. Review New Time",
      step5: "5. Confirmed",
      currentDetails: "Current Scheduled Scan",
      selectNewDate: "Select a New Date That Works for You",
      morningSlots: "Morning Slots (Available)",
      afternoonSlots: "Afternoon Slots (Available)",
      selectReason: "Reason for Rescheduling (Optional)",
      reasonTransport: "No transport or bus available on that day",
      reasonRelative: "Family member or caregiver unavailable to accompany",
      reasonHealth: "Feeling unwell / unable to travel",
      reasonConflict: "Other important commitment",
      reviewTitle: "Review Your New Appointment",
      confirmChangeBtn: "Confirm New Appointment",
      backBtn: "Previous Step",
      successTitle: "Appointment Successfully Rescheduled!",
      successMessage: "Your new slot has been registered with the hospital radiology department. Confirmation sent via SMS and voice call.",
      spokenSummaryPrompt: "Click below to hear your updated appointment read aloud",
      listenNewSummary: "Hear Updated Appointment",
      returnToHomeBtn: "Return to Home",
    },
    reminders: {
      title: "Intelligent Reminder System",
      subtitle: "Multi-channel reminders designed so critical diagnostic tests are never overlooked",
      channelsTitle: "Configurable Notification Channels",
      smsOption: "Native Language SMS",
      smsDesc: "Direct text message delivered in native Kannada or Telugu script.",
      voiceCallOption: "Automated Voice Phone Call (IVR)",
      voiceCallDesc: "Spoken phone call in patient's preferred language with simple keypad response.",
      whatsappOption: "WhatsApp Voice Note & Visual Card",
      whatsappDesc: "Rich visual appointment card with playable audio note.",
      caregiverOption: "Authorized Caregiver Support",
      caregiverDesc: "Safety net notification sent to trusted family member if unconfirmed.",
      intervalsTitle: "Configurable Reminder Schedule",
      sevenDays: "7 days prior to scan",
      oneDay: "24 hours prior to scan",
      fourHours: "4 hours prior to scan",
      sameDayMorning: "Morning of appointment (7:00 AM)",
      caregiverCardTitle: "Authorized Caregiver Settings",
      caregiverNameLabel: "Caregiver Full Name",
      caregiverPhoneLabel: "Caregiver Phone Number",
      caregiverRelationLabel: "Relationship to Patient",
      caregiverRuleLabel: "Notification Policy",
      ruleAlways: "Send duplicate copy of all notifications",
      ruleUnconfirmedOnly: "Notify ONLY if patient has not responded within 12 hours (Dignity First)",
      savePreferencesBtn: "Save Reminder Preferences",
      preferencesSavedMsg: "Preferences saved! Active reminders configured for this appointment.",
      simulatorTitle: "Interactive Communication Simulator",
      simulateCallBtn: "Simulate Voice Phone Call (IVR)",
      simulateSmsBtn: "Preview SMS Delivery",
      simulateWhatsappBtn: "Preview WhatsApp Card",
    },
    howItWorksPage: {
      title: "How CORE Solves the Barrier",
      subtitle: "Bridging the literacy, language, and digital divide for elderly rural patients",
      steps: [
        {
          number: "1",
          title: "Language Recorded at Intake",
          desc: "Hospital records the patient's mother tongue (Kannada, Telugu, or English) during initial registration.",
        },
        {
          number: "2",
          title: "Voice-First Communication",
          desc: "Instead of cryptic text SMS, the patient receives automated spoken phone calls in their language.",
        },
        {
          number: "3",
          title: "One-Touch Confirmation",
          desc: "Patients confirm attendance by pressing 1 on keypad or touching a large high-contrast button on screen.",
        },
        {
          number: "4",
          title: "Caregiver Fallback with Dignity",
          desc: "Caregivers are only alerted if an appointment remains unconfirmed, preserving patient independence.",
        },
      ],
      ruralFocusTitle: "Engineered for Rural Realities",
      ruralFocusDesc: "Optimized for basic 2G/3G connectivity, low-cost Android smartphones, and elderly touch ergonomics.",
    },
    help: {
      title: "Get Patient Help & Support",
      subtitle: "Human assistance is always one touch away when technology feels daunting",
      tollFreeCardTitle: "Hospital & Patient Guidance Center",
      tollFreeNumber: "District Hospital & ASHA Worker Support",
      tollFreeHours: "Open every day: 7:00 AM – 9:00 PM IST",
      callNowBtn: "Listen to Guidance (Audio)",
      ashaCardTitle: "Village ASHA Worker Assistance",
      ashaCardDesc: "Accredited Social Health Activists (ASHA workers) in your gram panchayat can visit to explain instructions in person.",
      faqsTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "What if I cannot read what is on the screen?",
          a: "You do not need to read. Every screen has a large speaker button. Tap 'Listen to My Appointment' to hear all instructions spoken clearly in Kannada, Telugu, or English.",
        },
        {
          q: "Can I reschedule without visiting the hospital?",
          a: "Yes. Use the 'Reschedule' page to choose an available new date and time from home in 5 simple steps.",
        },
        {
          q: "Will my caregiver see all my private medical details?",
          a: "No. Caregivers only receive appointment timing and reminder alerts. You control whether they are notified always or only if you miss confirming.",
        },
      ],
    },
    about: {
      title: "About CORE Platform",
      tagline: "Healthcare that speaks your language.",
      philosophyTitle: "Our Foundational Philosophy",
      philosophyQuote: "Healthcare should adapt to the patient's abilities, not demand that the patient adapt to technology.",
      philosophyDesc: "In rural India, millions of elderly citizens miss life-saving diagnostic scans and treatments not due to lack of medical facilities, but because hospital communication relies on English-only SMS and complex digital portals. CORE re-imagines healthcare communication with voice, native script, and patient dignity at the core.",
      problemTitle: "The Problem We Solve",
      problemStory: "Consider Basappa Gowda, a 60-year-old grandfather in rural Karnataka scheduled for an abdominal CT scan at Victoria District Hospital. His appointment arrived in an English text SMS. Unable to read it, he relied on a neighbor who forgot. Basappa missed the scan, took a 40km bus trip, and suffered weeks of diagnostic delay. CORE eliminates this failure mode entirely.",
      pillarsTitle: "Our Four Core Pillars",
      pillars: [
        {
          title: "Voice-First Architecture",
          desc: "Spoken instructions take precedence over written text across every workflow.",
        },
        {
          title: "Native Script Localization",
          desc: "Pristine Kannada, Telugu, and English without machine-translated jargon.",
        },
        {
          title: "Elderly Independence & Dignity",
          desc: "Empowering patients to understand and decide on their own health.",
        },
        {
          title: "Calm, Accessible Aesthetics",
          desc: "Warm ivory, vintage botanicals, and high-contrast readable typography.",
        },
      ],
    },
    staff: {
      title: "Hospital Radiology Staff Dashboard",
      subtitle: "Government District Hospital — CT & Radiology Department",
      demoNotice: "Simulation Portal: Managing outpatient diagnostic appointments and accessible communication.",
      statsTotal: "Total Scheduled Scans",
      statsUnconfirmed: "Unconfirmed (At Risk)",
      statsRescheduled: "Reschedule Requests",
      statsCaregivers: "Caregiver Alerts Dispatched",
      filterAll: "All Patients",
      filterUnconfirmed: "Unconfirmed",
      filterRescheduled: "Rescheduled",
      searchPlaceholder: "Search patient by name, phone or ID...",
      colPatient: "Patient Details",
      colTest: "Diagnostic Procedure",
      colDate: "Appointment Slot",
      colLanguage: "Preferred Language",
      colStatus: "Attendance Status",
      colActions: "Staff Actions",
      triggerCallBtn: "Send Voice Call",
      rescheduleBtn: "Reschedule Slot",
      viewDetailsBtn: "View Record",
      newAppointmentBtn: "New Diagnostic Appointment",
    },
    footer: {
      mission: "CORE is an accessible, multilingual healthcare communication platform for rural and elderly patients in India.",
      quickLinks: "Quick Navigation",
      contactSupport: "Patient Support & Helplines",
      tollFree: "District Government Hospital Patient Guidance Center",
      districtOffices: "District Government Hospital Diagnostic Center",
      disclaimer: "Demonstration prototype built for digital healthcare accessibility. In an emergency, dial 108 or visit your nearest hospital.",
      privacyPledge: "Patient privacy, autonomy, and dignity are protected by design.",
    },
  },
};
