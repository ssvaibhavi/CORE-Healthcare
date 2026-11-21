import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ComfortModePanel } from './components/ComfortModePanel';
import { GuidedModeBar } from './components/GuidedModeBar';
import { CoreCompanion } from './components/CoreCompanion';
import { HomeView } from './views/HomeView';
import { HearAppointmentView } from './views/HearAppointmentView';
import { RescheduleView } from './views/RescheduleView';
import { RemindersView } from './views/RemindersView';
import { HowItWorksView } from './views/HowItWorksView';
import { GetHelpView } from './views/GetHelpView';
import { AboutView } from './views/AboutView';
import { StaffDashboardView } from './views/StaffDashboardView';
import { CareJourneyView } from './views/CareJourneyView';
import { ClarityView } from './views/ClarityView';
import { CareCircleView } from './views/CareCircleView';
import { VisitPassportView } from './views/VisitPassportView';
import { IntelligenceView } from './views/IntelligenceView';
import { VoiceBridgeView } from './views/VoiceBridgeView';
import { SenseView } from './views/SenseView';
import { CareCompassView } from './views/CareCompassView';
import { CareFlowView } from './views/CareFlowView';
import { AccessibilityLabView } from './views/AccessibilityLabView';
import { InsightsView } from './views/InsightsView';
import { ShowcaseView } from './views/ShowcaseView';
import { CareStoriesView } from './views/CareStoriesView';
import { SmartSearchModal } from './components/SmartSearchModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { INITIAL_APPOINTMENTS } from './data/mockAppointments';
import {
  Appointment,
  CareCircleSharingSettings,
  ComfortSettings,
  IntelligenceProfile,
  Language,
  PageView,
  ShowcaseProgress
} from './types';
import {
  getAudioLanguageBadge,
  speechService,
  SpeechErrorInfo,
  SpeechPlaybackSnapshot,
} from './utils/speech';
import { AudioProgressBar } from './components/AudioProgressBar';
import { AlertCircle, Loader2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

const DEFAULT_COMFORT_SETTINGS: ComfortSettings = {
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  motionMode: 'full',
  simplifiedNav: false,
  largeButtons: false,
  readAloud: true,
  guidedMode: false,
  explanationComplexity: 'simple',
};

const LANGUAGE_STORAGE_KEY = 'core_ui_language';
const UI_PREFS_STORAGE_KEY = 'core_ui_preferences';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'kn' || saved === 'te') {
      return saved;
    }
  } catch {
    // Ignore storage read restrictions
  }
  return 'en';
}

function getInitialComfortSettings(): ComfortSettings {
  if (typeof window === 'undefined') return DEFAULT_COMFORT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(UI_PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_COMFORT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ComfortSettings>;
    const motionMode =
      parsed.motionMode === 'full' || parsed.motionMode === 'gentle' || parsed.motionMode === 'none'
        ? parsed.motionMode
        : parsed.reduceMotion === true
        ? 'none'
        : 'full';
    return {
      textSize:
        parsed.textSize === 'normal' || parsed.textSize === 'large' || parsed.textSize === 'xlarge'
          ? parsed.textSize
          : 'normal',
      highContrast: typeof parsed.highContrast === 'boolean' ? parsed.highContrast : false,
      motionMode,
      reduceMotion: motionMode === 'none',
      simplifiedNav: typeof parsed.simplifiedNav === 'boolean' ? parsed.simplifiedNav : false,
      largeButtons: typeof parsed.largeButtons === 'boolean' ? parsed.largeButtons : false,
      readAloud: typeof parsed.readAloud === 'boolean' ? parsed.readAloud : true,
      guidedMode: typeof parsed.guidedMode === 'boolean' ? parsed.guidedMode : false,
      explanationComplexity:
        parsed.explanationComplexity === 'extra_simple' ||
        parsed.explanationComplexity === 'simple' ||
        parsed.explanationComplexity === 'detailed'
          ? parsed.explanationComplexity
          : 'simple',
    };
  } catch {
    return DEFAULT_COMFORT_SETTINGS;
  }
}

const DEFAULT_CARECIRCLE_SHARING: CareCircleSharingSettings = {
  consentGranted: false,
  consentTimestamp: undefined,
  shareAppointmentOverview: true,
  shareChecklist: true,
  shareReminders: true,
  shareDirections: true,
  handoffMode: 'session_only',
};

const DEFAULT_INTELLIGENCE_PROFILE: IntelligenceProfile = {
  completedOnboarding: false,
  preferredLanguage: 'en',
  visitorRole: 'self',
  firstHospitalVisit: true,
  preferStepByStep: true,
  supportNeeds: 'both',
  assistanceGoal: 'full_support',
};

const DEFAULT_SHOWCASE_PROGRESS: ShowcaseProgress = {
  languageAndAccessibility: false,
  carePathway: false,
  careFlowProblem: false,
  senseUnderstanding: false,
  careCompassChecklist: false,
  visitPassport: false,
  caregiverHandoff: false,
};

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [comfortSettings, setComfortSettings] = useState<ComfortSettings>(getInitialComfortSettings);
  const [comfortOpen, setComfortOpen] = useState<boolean>(false);
  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [aiConsentGranted, setAiConsentGranted] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(INITIAL_APPOINTMENTS[0]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [careCircleSharing, setCareCircleSharing] = useState<CareCircleSharingSettings>(
    DEFAULT_CARECIRCLE_SHARING
  );
  const [intelligenceProfile, setIntelligenceProfile] = useState<IntelligenceProfile>(
    DEFAULT_INTELLIGENCE_PROFILE
  );
  const [showcaseProgress, setShowcaseProgress] = useState<ShowcaseProgress>(
    DEFAULT_SHOWCASE_PROGRESS
  );
  const [sessionActionsCount, setSessionActionsCount] = useState<number>(0);
  const [demoResetSignal, setDemoResetSignal] = useState<number>(0);
  const [globalAudioError, setGlobalAudioError] = useState<SpeechErrorInfo | null>(null);
  const [globalPlaybackSnap, setGlobalPlaybackSnap] = useState<SpeechPlaybackSnapshot>(() =>
    speechService.getPlaybackSnapshot()
  );

  useEffect(() => {
    return speechService.subscribe((snap) => {
      setGlobalPlaybackSnap(snap);
      setGlobalAudioError(snap.lastError);
    });
  }, []);

  useEffect(() => {
    speechService.setCloudConsentGranted(aiConsentGranted);
  }, [aiConsentGranted]);

  const effectiveMotionMode =
    comfortSettings.motionMode ?? (comfortSettings.reduceMotion ? 'none' : 'full');

  // Sync non-PII UI display preferences only (never health info or chat content)
  useEffect(() => {
    try {
      const uiOnlyPrefs: ComfortSettings = {
        textSize: comfortSettings.textSize,
        highContrast: comfortSettings.highContrast,
        reduceMotion: effectiveMotionMode === 'none',
        motionMode: effectiveMotionMode,
        simplifiedNav: comfortSettings.simplifiedNav,
        largeButtons: comfortSettings.largeButtons,
        readAloud: comfortSettings.readAloud,
        guidedMode: comfortSettings.guidedMode,
        explanationComplexity: comfortSettings.explanationComplexity,
      };
      window.localStorage.setItem(UI_PREFS_STORAGE_KEY, JSON.stringify(uiOnlyPrefs));
    } catch {
      // Ignore storage write errors
    }
  }, [comfortSettings, effectiveMotionMode]);

  // Sync accessibility classes to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', comfortSettings.highContrast);
    root.classList.toggle('reduce-motion', effectiveMotionMode === 'none');
    root.classList.toggle('gentle-motion', effectiveMotionMode === 'gentle');
    root.classList.toggle('large-targets', comfortSettings.largeButtons);
  }, [comfortSettings.highContrast, effectiveMotionMode, comfortSettings.largeButtons]);

  // Global keyboard shortcuts: Escape closes overlays; Ctrl/Cmd+K opens Smart Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setComfortOpen(false);
        setCompanionOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top on page switch + track non-PII session progress
  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    setSessionActionsCount((c) => c + 1);
    if (page === 'passport') {
      setShowcaseProgress((prev) => ({ ...prev, visitPassport: true }));
    }
    window.scrollTo({
      top: 0,
      behavior: effectiveMotionMode === 'none' ? 'auto' : 'smooth',
    });
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore storage write errors
    }
    setShowcaseProgress((prev) => ({ ...prev, languageAndAccessibility: true }));
    setSessionActionsCount((c) => c + 1);
    if (comfortSettings.readAloud) {
      const msg =
        lang === 'kn'
          ? 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಯಾಗಿದೆ.'
          : lang === 'te'
          ? 'తెలుగు భాష ఎంచుకోబడింది.'
          : 'Language set to English.';
      speechService.speak(msg, lang);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
    setSessionActionsCount((c) => c + 1);
  };

  const handleResetDemo = () => {
    speechService.stop();
    try {
      window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      window.localStorage.removeItem(UI_PREFS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    setCurrentLanguage('en');
    setAppointments(INITIAL_APPOINTMENTS);
    setSelectedAppointment(INITIAL_APPOINTMENTS[0]);
    setCompletedTasks({});
    setCareCircleSharing(DEFAULT_CARECIRCLE_SHARING);
    setComfortSettings(DEFAULT_COMFORT_SETTINGS);
    setIntelligenceProfile(DEFAULT_INTELLIGENCE_PROFILE);
    setShowcaseProgress(DEFAULT_SHOWCASE_PROGRESS);
    setAiConsentGranted(false);
    setSessionActionsCount(0);
    setComfortOpen(false);
    setSearchOpen(false);
    setDemoResetSignal((c) => c + 1);
  };

  const handleConfirmAttendance = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'confirmed',
              confirmedAt: new Date().toLocaleString(),
              history: [
                ...apt.history,
                {
                  timestamp: new Date().toLocaleString(),
                  action: 'Attendance confirmed by patient',
                  actionKannada: 'ರೋಗಿಯು ಹಾಜರಾತಿ ಖಚಿತಪಡಿಸಿದ್ದಾರೆ',
                  actionTelugu: 'రోగి తన హాజరును ధ్రువీకరించారు',
                  author: 'Patient Self-Service',
                },
              ],
            }
          : apt
      )
    );

    if (selectedAppointment.id === id) {
      setSelectedAppointment((prev) => ({
        ...prev,
        status: 'confirmed',
        confirmedAt: new Date().toLocaleString(),
      }));
    }
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAppointment(updated);
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    setSelectedAppointment(newApt);
  };

  const handleSelectPatientById = (id: string) => {
    const found = appointments.find((a) => a.id === id);
    if (found) {
      setSelectedAppointment(found);
    }
  };

  const handleSearchAppointment = (query: string) => {
    const clean = query.trim().toLowerCase();
    const found = appointments.find(
      (a) =>
        a.patientPhone.includes(clean) ||
        a.pin === clean ||
        a.patientName.toLowerCase().includes(clean)
    );
    if (found) {
      setSelectedAppointment(found);
    }
  };

  // Text size container scale
  const getTextSizeClass = () => {
    if (comfortSettings.textSize === 'large') {
      return 'text-lg [&_h1]:text-5xl [&_h2]:text-4xl [&_p]:text-lg [&_button]:text-lg';
    }
    if (comfortSettings.textSize === 'xlarge') {
      return 'text-xl [&_h1]:text-6xl [&_h2]:text-5xl [&_p]:text-xl [&_button]:text-xl';
    }
    return '';
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-200 ${
        currentLanguage === 'kn' ? 'font-kannada' : currentLanguage === 'te' ? 'font-telugu' : 'font-body'
      } ${getTextSizeClass()}`}
    >
      {/* Top Header with Navigation, Language Selector, and Comfort Mode */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        comfortSettings={comfortSettings}
        onTextSizeChange={(sz) => setComfortSettings((prev) => ({ ...prev, textSize: sz }))}
        onHighContrastToggle={() =>
          setComfortSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
        }
        comfortOpen={comfortOpen}
        onToggleComfortOpen={() => setComfortOpen((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Functional CORE Experience Settings Drawer */}
      <ComfortModePanel
        isOpen={comfortOpen}
        onClose={() => setComfortOpen(false)}
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
        settings={comfortSettings}
        onUpdateSettings={setComfortSettings}
        onResetComfort={() => setComfortSettings(DEFAULT_COMFORT_SETTINGS)}
      />

      {/* Elderly Step-by-Step Guided Mode Bar */}
      {comfortSettings.guidedMode && (
        <GuidedModeBar
          language={currentLanguage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onExitGuidedMode={() =>
            setComfortSettings((prev) => ({ ...prev, guidedMode: false }))
          }
        />
      )}

      {/* Main Page View Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            onLanguageChange={handleLanguageChange}
            onSelectPatient={handleSelectPatientById}
            onOpenComfortMode={() => setComfortOpen(true)}
            onOpenCompanion={() => setCompanionOpen(true)}
            onResetDemo={handleResetDemo}
          />
        )}

        {currentPage === 'appointment' && (
          <HearAppointmentView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onConfirmAttendance={handleConfirmAttendance}
            onPageChange={handlePageChange}
            onSearchAppointment={handleSearchAppointment}
            allAppointments={appointments}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
            aiConsentGranted={aiConsentGranted}
            onAcceptAiConsent={() => setAiConsentGranted(true)}
          />
        )}

        {currentPage === 'journey' && (
          <CareJourneyView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
            onPageChange={handlePageChange}
            complexity={comfortSettings.explanationComplexity}
            aiConsentGranted={aiConsentGranted}
            onAcceptAiConsent={() => setAiConsentGranted(true)}
          />
        )}

        {currentPage === 'clarity' && (
          <ClarityView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            complexity={comfortSettings.explanationComplexity}
            aiConsentGranted={aiConsentGranted}
            onAcceptAiConsent={() => setAiConsentGranted(true)}
          />
        )}

        {currentPage === 'carecircle' && (
          <CareCircleView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            sharing={careCircleSharing}
            onUpdateSharing={(next) => {
              setCareCircleSharing(next);
              if (next.consentGranted) {
                setShowcaseProgress((prev) => ({ ...prev, caregiverHandoff: true }));
              }
              setSessionActionsCount((c) => c + 1);
            }}
            completedTasks={completedTasks}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'passport' && (
          <VisitPassportView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'reschedule' && (
          <RescheduleView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'reminders' && (
          <RemindersView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'help' && (
          <GetHelpView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'staff' && (
          <StaffDashboardView
            currentLanguage={currentLanguage}
            appointments={appointments}
            onSelectAppointment={(apt) => {
              setSelectedAppointment(apt);
              handlePageChange('appointment');
            }}
            onUpdateAppointment={handleUpdateAppointment}
            onAddAppointment={handleAddAppointment}
            onPageChange={handlePageChange}
          />
        )}
        {currentPage === 'intelligence' && (
          <IntelligenceView
            currentLanguage={currentLanguage}
            profile={intelligenceProfile}
            onUpdateProfile={(next) => {
              setIntelligenceProfile(next);
              if (next.completedOnboarding) {
                setShowcaseProgress((prev) => ({ ...prev, carePathway: true }));
              }
              setSessionActionsCount((c) => c + 1);
            }}
            onLanguageChange={handleLanguageChange}
            onApplyComfortPatch={(patch) => {
              setComfortSettings((prev) => ({ ...prev, ...patch }));
              setShowcaseProgress((prev) => ({ ...prev, languageAndAccessibility: true }));
            }}
            onPageChange={handlePageChange}
            onResetProfile={() => setIntelligenceProfile(DEFAULT_INTELLIGENCE_PROFILE)}
          />
        )}

        {currentPage === 'voicebridge' && (
          <VoiceBridgeView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onLanguageChange={handleLanguageChange}
            onPageChange={handlePageChange}
            reduceMotion={effectiveMotionMode === 'none'}
            complexity={comfortSettings.explanationComplexity}
            aiConsentGranted={aiConsentGranted}
            onAcceptAiConsent={() => setAiConsentGranted(true)}
          />
        )}

        {currentPage === 'sense' && (
          <SenseView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            onSenseCompleted={() => {
              setShowcaseProgress((prev) => ({ ...prev, senseUnderstanding: true }));
              setSessionActionsCount((c) => c + 1);
            }}
          />
        )}

        {currentPage === 'carecompass' && (
          <CareCompassView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            onPageChange={handlePageChange}
            onChecklistInteracted={() => {
              setShowcaseProgress((prev) => ({ ...prev, careCompassChecklist: true }));
              setSessionActionsCount((c) => c + 1);
            }}
          />
        )}

        {currentPage === 'careflow' && (
          <CareFlowView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            onDecisionCompleted={() => {
              setShowcaseProgress((prev) => ({ ...prev, careFlowProblem: true }));
              setSessionActionsCount((c) => c + 1);
            }}
          />
        )}

        {currentPage === 'accessibility-lab' && (
          <AccessibilityLabView
            currentLanguage={currentLanguage}
            currentComfort={comfortSettings}
            onApplyComfort={(next) => {
              setComfortSettings(next);
              setShowcaseProgress((prev) => ({ ...prev, languageAndAccessibility: true }));
              setSessionActionsCount((c) => c + 1);
            }}
            onLanguageChange={handleLanguageChange}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'insights' && (
          <InsightsView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            sessionActionsCount={sessionActionsCount}
          />
        )}

        {currentPage === 'showcase' && (
          <ShowcaseView
            currentLanguage={currentLanguage}
            progress={showcaseProgress}
            onToggleMilestone={(key) =>
              setShowcaseProgress((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            onResetShowcase={() => setShowcaseProgress(DEFAULT_SHOWCASE_PROGRESS)}
            onPageChange={handlePageChange}
            onOpenComfortMode={() => setComfortOpen(true)}
          />
        )}

        {currentPage === 'stories' && (
          <CareStoriesView
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onApplyComfortPatch={(patch) => {
              setComfortSettings((prev) => ({ ...prev, ...patch }));
              setShowcaseProgress((prev) => ({ ...prev, languageAndAccessibility: true }));
            }}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Offline Status Toast (shows only when browser reports offline) */}
      <OfflineIndicator language={currentLanguage} />

      {/* Global Compact Audio Player & Unavailable-Voice Notice for pages without inline audio strips */}
      {(globalPlaybackSnap.status !== 'idle' || globalAudioError) &&
        !companionOpen &&
        currentPage !== 'appointment' &&
        currentPage !== 'clarity' &&
        currentPage !== 'voicebridge' && (
          <div
            role="region"
            aria-label="Audio playback controls"
            aria-live="polite"
            className="fixed bottom-20 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-auto sm:w-[360px] z-40 no-print bg-[#FCF9F5] border border-[#BEA06D]/70 rounded-2xl shadow-lg p-3.5 space-y-2.5 text-xs text-[#493C39] modal-soft-enter"
          >
            {globalPlaybackSnap.status !== 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {globalPlaybackSnap.status === 'loading' ? (
                      <Loader2 className="w-4 h-4 text-[#C88F98] animate-spin shrink-0" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#4A6347] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-[#3C3330] truncate">
                        {globalPlaybackSnap.status === 'loading'
                          ? currentLanguage === 'kn'
                            ? 'ಧ್ವನಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...'
                            : currentLanguage === 'te'
                            ? 'వాయిస్ సిద్ధమవుతోంది...'
                            : 'Generating Audio...'
                          : getAudioLanguageBadge(globalPlaybackSnap.activeLang || currentLanguage)}
                      </div>
                      {globalPlaybackSnap.activeEngineLabel && (
                        <div className="text-[11px] font-medium text-[#8A6D3F] truncate">
                          {globalPlaybackSnap.activeEngineLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {globalPlaybackSnap.status !== 'loading' && (
                      <button
                        type="button"
                        onClick={() =>
                          globalPlaybackSnap.status === 'paused'
                            ? speechService.resume()
                            : speechService.pause()
                        }
                        aria-label={
                          globalPlaybackSnap.status === 'paused' ? 'Resume audio' : 'Pause audio'
                        }
                        className="compact-chip px-2.5 py-1 rounded-full bg-white border border-[#BEA06D]/45 font-bold text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                      >
                        {globalPlaybackSnap.status === 'paused' ? (
                          <Play className="w-3 h-3" />
                        ) : (
                          <Pause className="w-3 h-3" />
                        )}
                        <span>{globalPlaybackSnap.status === 'paused' ? 'Play' : 'Pause'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => speechService.stop()}
                      aria-label="Stop audio"
                      className="compact-chip px-2.5 py-1 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <VolumeX className="w-3 h-3" />
                      <span>
                        {currentLanguage === 'kn'
                          ? 'ನಿಲ್ಲಿಸಿ'
                          : currentLanguage === 'te'
                          ? 'ఆపండి'
                          : 'Stop'}
                      </span>
                    </button>
                  </div>
                </div>

                {(globalPlaybackSnap.status === 'speaking' ||
                  globalPlaybackSnap.status === 'paused') && (
                  <AudioProgressBar
                    snapshot={globalPlaybackSnap}
                    language={globalPlaybackSnap.activeLang || currentLanguage}
                    compact
                  />
                )}
              </div>
            )}

            {globalAudioError && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
                <div className="flex items-start gap-2 flex-1 min-w-[180px]">
                  <AlertCircle className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                  <span className="leading-relaxed break-words">{globalAudioError.message}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {globalAudioError.code === 'cloud-consent-required' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAiConsentGranted(true);
                        speechService.setCloudConsentGranted(true);
                        speechService.clearError();
                        speechService.replay();
                      }}
                      className="px-3 py-1 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white font-semibold cursor-pointer"
                    >
                      {currentLanguage === 'kn'
                        ? 'Gemini ಧ್ವನಿ ಸಕ್ರಿಯಗೊಳಿಸಿ'
                        : currentLanguage === 'te'
                        ? 'Gemini వాయిస్ ఆన్ చేయండి'
                        : 'Enable Gemini Voice'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => speechService.clearError()}
                    className="font-semibold text-[#8A6D3F] underline shrink-0 cursor-pointer"
                  >
                    {currentLanguage === 'kn' ? 'ಮುಚ್ಚಿ' : currentLanguage === 'te' ? 'మూసివేయండి' : 'Dismiss'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Universal CORE Smart Search Overlay */}
      <SmartSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        language={currentLanguage}
        complexity={comfortSettings.explanationComplexity}
        aiConsentGranted={aiConsentGranted}
        onAcceptAiConsent={() => setAiConsentGranted(true)}
        onPageChange={handlePageChange}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setComfortOpen(true)}
      />

      {/* Floating Rosewater CORE AI Companion Assistant */}
      <CoreCompanion
        language={currentLanguage}
        currentPage={currentPage}
        isOpen={companionOpen}
        onToggleOpen={setCompanionOpen}
        onPageChange={handlePageChange}
        onOpenComfortMode={() => setComfortOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        comfortSettings={comfortSettings}
        onUpdateComplexity={(next) =>
          setComfortSettings((prev) => ({ ...prev, explanationComplexity: next }))
        }
        reduceMotion={effectiveMotionMode === 'none'}
        resetSignal={demoResetSignal}
        aiConsentGranted={aiConsentGranted}
        onAcceptAiConsent={() => setAiConsentGranted(true)}
      />

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
