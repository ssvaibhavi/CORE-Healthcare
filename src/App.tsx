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
import { INITIAL_APPOINTMENTS } from './data/mockAppointments';
import {
  Appointment,
  CareCircleSharingSettings,
  ComfortSettings,
  Language,
  PageView
} from './types';
import { speechService } from './utils/speech';

const DEFAULT_COMFORT_SETTINGS: ComfortSettings = {
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  simplifiedNav: false,
  largeButtons: false,
  readAloud: true,
  guidedMode: false,
};

const DEFAULT_CARECIRCLE_SHARING: CareCircleSharingSettings = {
  consentGranted: false,
  consentTimestamp: undefined,
  shareAppointmentOverview: true,
  shareChecklist: true,
  shareReminders: true,
  shareDirections: true,
};

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('kn');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [comfortSettings, setComfortSettings] = useState<ComfortSettings>(DEFAULT_COMFORT_SETTINGS);
  const [comfortOpen, setComfortOpen] = useState<boolean>(false);
  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(INITIAL_APPOINTMENTS[0]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [careCircleSharing, setCareCircleSharing] = useState<CareCircleSharingSettings>(
    DEFAULT_CARECIRCLE_SHARING
  );
  const [demoResetSignal, setDemoResetSignal] = useState<number>(0);

  // Sync accessibility classes to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', comfortSettings.highContrast);
    root.classList.toggle('reduce-motion', comfortSettings.reduceMotion);
    root.classList.toggle('large-targets', comfortSettings.largeButtons);
  }, [comfortSettings.highContrast, comfortSettings.reduceMotion, comfortSettings.largeButtons]);

  // Scroll to top on page switch
  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: comfortSettings.reduceMotion ? 'auto' : 'smooth',
    });
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
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
  };

  const handleResetDemo = () => {
    speechService.stop();
    setAppointments(INITIAL_APPOINTMENTS);
    setSelectedAppointment(INITIAL_APPOINTMENTS[0]);
    setCompletedTasks({});
    setCareCircleSharing(DEFAULT_CARECIRCLE_SHARING);
    setComfortSettings(DEFAULT_COMFORT_SETTINGS);
    setComfortOpen(false);
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
      />

      {/* Functional CORE Comfort Mode Drawer */}
      <ComfortModePanel
        isOpen={comfortOpen}
        onClose={() => setComfortOpen(false)}
        language={currentLanguage}
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
            onSelectPatient={handleSelectPatientById}
            onOpenComfortMode={() => setComfortOpen(true)}
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
          />
        )}

        {currentPage === 'journey' && (
          <CareJourneyView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'clarity' && (
          <ClarityView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'carecircle' && (
          <CareCircleView
            currentLanguage={currentLanguage}
            appointment={selectedAppointment}
            sharing={careCircleSharing}
            onUpdateSharing={setCareCircleSharing}
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
      </main>

      {/* Floating Minimal CORE Companion Assistant */}
      <CoreCompanion
        language={currentLanguage}
        currentPage={currentPage}
        isOpen={companionOpen}
        onToggleOpen={setCompanionOpen}
        onPageChange={handlePageChange}
        onOpenComfortMode={() => setComfortOpen(true)}
        reduceMotion={comfortSettings.reduceMotion}
        resetSignal={demoResetSignal}
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
