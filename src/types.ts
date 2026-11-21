export type Language = 'kn' | 'te' | 'en';

export type TextSize = 'normal' | 'large' | 'xlarge';

export type PageView =
  | 'home'
  | 'appointment'
  | 'reschedule'
  | 'reminders'
  | 'how-it-works'
  | 'help'
  | 'about'
  | 'staff'
  | 'journey'
  | 'clarity'
  | 'carecircle'
  | 'passport'
  | 'intelligence'
  | 'voicebridge'
  | 'sense'
  | 'carecompass'
  | 'careflow'
  | 'accessibility-lab'
  | 'insights'
  | 'showcase'
  | 'stories'
  | 'navigator'
  | 'recovery'
  | 'impact-lab';

export type DisruptionScenarioId =
  | 'none'
  | 'dept_changed'
  | 'lift_unavailable'
  | 'language_barrier'
  | 'missing_details'
  | 'delayed_arrival'
  | 'corridor_blocked';

export interface ActiveDisruptionState {
  scenarioId: DisruptionScenarioId;
  blockedEdgeIds: string[];
  recommendedDestination?:
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
  updatedAt?: string;
}

export interface SessionUsabilityMetrics {
  navigationStepsTaken: number;
  routeRecalculations: number;
  clarificationRequests: number;
  teachBackAttempts: number;
  completedWithoutAssistance: boolean;
  startedAtMs: number;
  journeyCompletedMs?: number;
}

export interface NavigatorPromptRequest {
  id: number;
  prompt: string;
  targetLanguage?: Language;
}

export interface AppCompanionContextSnapshot {
  currentPage: PageView;
  activeScenario: DisruptionScenarioId;
  scenarioTitle?: string;
  routeChanged?: boolean;
  routeSummary?: string;
  routeChangeReason?: string;
  noAccessibleRoute?: boolean;
  accessibleOnly?: boolean;
  comfortSummary?: string;
}

export type ExplanationComplexity = 'extra_simple' | 'simple' | 'detailed';
export type MotionMode = 'full' | 'gentle' | 'none';

export interface ComfortSettings {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  motionMode?: MotionMode;
  simplifiedNav: boolean;
  largeButtons: boolean;
  readAloud: boolean;
  guidedMode: boolean;
  explanationComplexity?: ExplanationComplexity;
}

export interface CareCircleSharingSettings {
  consentGranted: boolean;
  consentTimestamp?: string;
  shareAppointmentOverview: boolean;
  shareChecklist: boolean;
  shareReminders: boolean;
  shareDirections: boolean;
  handoffMode?: 'session_only' | '24_hours';
  situationNote?: string;
  includeActiveDisruption?: boolean;
}

export interface IntelligenceProfile {
  completedOnboarding: boolean;
  preferredLanguage: Language;
  visitorRole: 'self' | 'caregiver';
  firstHospitalVisit: boolean;
  preferStepByStep: boolean;
  supportNeeds: 'standard' | 'large_text' | 'voice_first' | 'both';
  assistanceGoal: 'check_details' | 'prepare_visit' | 'reschedule' | 'understand_terms' | 'full_support';
}

export interface CareCompassTask {
  id: string;
  category: 'documents' | 'questions' | 'travel' | 'reminders' | 'accessibility' | 'caregiver';
  source: 'generic' | 'clinic_verify' | 'user_added';
  completed: boolean;
  text: string;
}

export interface ShowcaseProgress {
  languageAndAccessibility: boolean;
  carePathway: boolean;
  careFlowProblem: boolean;
  senseUnderstanding: boolean;
  careCompassChecklist: boolean;
  visitPassport: boolean;
  caregiverHandoff: boolean;
}

export interface CaregiverInfo {
  name: string;
  phone: string;
  relation: string;
  notifyPolicy: 'always' | 'unconfirmed_only';
  isVerified: boolean;
  notifiedCount: number;
  lastNotified?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  pin: string; // 4-digit simplified PIN for rural patients
  patientName: string;
  patientNameKannada: string;
  patientNameTelugu: string;
  patientAge: number;
  patientPhone: string;
  patientVillage: string;
  patientDistrict: string;
  preferredLanguage: Language;
  
  testName: string;
  testNameKannada: string;
  testNameTelugu: string;
  testCategory: string; // e.g., 'CT Scan', 'Radiology'
  
  hospitalName: string;
  hospitalNameKannada: string;
  hospitalNameTelugu: string;
  department: string;
  roomNumber: string;
  doctorName: string;
  
  date: string; // YYYY-MM-DD
  time: string; // e.g., '10:30 AM'
  dayOfWeek: string;
  
  preparationInstructions: {
    en: string[];
    kn: string[];
    te: string[];
  };
  
  directions: {
    en: string;
    kn: string;
    te: string;
  };

  status: 'unconfirmed' | 'confirmed' | 'rescheduled' | 'cancelled';
  confirmedAt?: string;
  
  reminderPreferences: {
    sms: boolean;
    voiceCall: boolean;
    whatsapp: boolean;
    caregiver: boolean;
  };
  
  reminderIntervals: Array<'7_days' | '1_day' | '4_hours' | 'same_day_morning'>;
  
  caregiver?: CaregiverInfo;
  
  history: Array<{
    timestamp: string;
    action: string;
    actionKannada: string;
    actionTelugu: string;
    author: string;
  }>;
}

export interface AvailableSlot {
  id: string;
  date: string;
  day: string;
  time: string;
  period: 'morning' | 'afternoon';
  isAvailable: boolean;
}
