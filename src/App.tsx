import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { HearAppointmentView } from './views/HearAppointmentView';
import { RescheduleView } from './views/RescheduleView';
import { RemindersView } from './views/RemindersView';
import { HowItWorksView } from './views/HowItWorksView';
import { GetHelpView } from './views/GetHelpView';
import { AboutView } from './views/AboutView';
import { StaffDashboardView } from './views/StaffDashboardView';
import { INITIAL_APPOINTMENTS } from './data/mockAppointments';
import { Appointment, Language, PageView, TextSize } from './types';
import { HelpCircle, Volume2 } from 'lucide-react';
import { speechService } from './utils/speech';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('kn');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(INITIAL_APPOINTMENTS[0]);

  // Sync high contrast class to root element
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Scroll to top on page switch
  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    // Announce language change
    const msg =
      lang === 'kn'
        ? 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಯಾಗಿದೆ.'
        : lang === 'te'
        ? 'తెలుగు భాష ఎంచుకోబడింది.'
        : 'Language set to English.';
    speechService.speak(msg, lang);
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
    if (textSize === 'large') return 'text-lg [&_h1]:text-5xl [&_h2]:text-4xl [&_p]:text-lg [&_button]:text-lg';
    if (textSize === 'xlarge') return 'text-xl [&_h1]:text-6xl [&_h2]:text-5xl [&_p]:text-xl [&_button]:text-xl';
    return '';
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-200 ${
        currentLanguage === 'kn' ? 'font-kannada' : currentLanguage === 'te' ? 'font-telugu' : 'font-body'
      } ${getTextSizeClass()}`}
    >
      {/* Top Header with Navigation, Language Selector, and Accessibility */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
      />

      {/* Main Page View Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            currentLanguage={currentLanguage}
            onPageChange={handlePageChange}
            onSelectPatient={handleSelectPatientById}
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
              setCurrentPage('appointment');
            }}
            onUpdateAppointment={handleUpdateAppointment}
            onAddAppointment={handleAddAppointment}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Quick Floating Get Help Navigation Button */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() => handlePageChange('help')}
          className="flex items-center gap-2.5 bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-bold py-3 px-5 rounded-full shadow-xl shadow-[#BEA06D]/40 border-2 border-white/80 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#BEA06D]/40"
          title={currentLanguage === 'kn' ? 'ಸಹಾಯ ಪಡೆಯಿರಿ' : currentLanguage === 'te' ? 'సహాయం పొందండి' : 'Get Help'}
          aria-label={currentLanguage === 'kn' ? 'ಸಹಾಯ ಪಡೆಯಿರಿ' : currentLanguage === 'te' ? 'సహాయం పొందండి' : 'Get Help'}
        >
          <HelpCircle className="w-5 h-5 text-white" />
          <span className="text-xs sm:text-sm font-semibold">
            {currentLanguage === 'kn' ? 'ಸಹಾಯ ಪಡೆಯಿರಿ' : currentLanguage === 'te' ? 'సహాయం పొందండి' : 'Get Help'}
          </span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
