import React, { useState } from 'react';
import { CoreMonogramMark } from '../components/BotanicalMotifs';
import { Appointment, Language, PageView } from '../types';
import { speechService } from '../utils/speech';
import {
  ArrowLeft,
  Printer,
  Volume2,
  Calendar,
  Clock,
  Building2,
  MapPin,
  FileText,
  HelpCircle,
  Bell,
  Check,
  Plus,
  ShieldAlert
} from 'lucide-react';

interface VisitPassportViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  onPageChange: (page: PageView) => void;
}

export const VisitPassportView: React.FC<VisitPassportViewProps> = ({
  currentLanguage,
  appointment,
  onPageChange,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    'doc-id': true,
    'doc-slip': true,
    'doc-creat': false,
    'doc-old': false,
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, boolean>>({
    'q-report': true,
    'q-food': true,
    'q-medicine': false,
  });

  const [customQuestion, setCustomQuestion] = useState('');
  const [customQuestionsList, setCustomQuestionsList] = useState<string[]>([]);

  const docsChecklist = [
    {
      id: 'doc-id',
      label: {
        kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ / ಗುರುತಿನ ಚೀಟಿ',
        te: 'ఆధార్ కార్డు / గుర్తింపు కార్డు',
        en: 'Government Photo ID (Aadhaar / Voter ID)',
      },
    },
    {
      id: 'doc-slip',
      label: {
        kn: 'ವೈದ್ಯರ ಸ್ಕ್ಯಾನ್ ಶಿಫಾರಸು ಚೀಟಿ',
        te: 'డాక్టర్ స్కాన్ రిఫరల్ చీటీ',
        en: 'Doctor Referral Slip / Hospital Card',
      },
    },
    {
      id: 'doc-creat',
      label: {
        kn: 'ಇತ್ತೀಚಿನ ಕ್ರಿಯೇಟಿನಿನ್ ರಕ್ತ ಪರೀಕ್ಷೆ ವರದಿ',
        te: 'ఇటీవలి క్రియాటినిన్ రక్త పరీక్ష రిపోర్ట్',
        en: 'Recent Serum Creatinine Blood Report',
      },
    },
    {
      id: 'doc-old',
      label: {
        kn: 'ಹಳೆಯ ಎಕ್ಸ್-ರೇ, ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಔಷಧಿ ಚೀಟಿಗಳು',
        te: 'పాత ఎక్స్-రే, స్కాన్ మరియు మందుల చీటీలు',
        en: 'Previous Scans, Prescriptions & Discharge Notes',
      },
    },
  ];

  const doctorQuestions = [
    {
      id: 'q-report',
      label: {
        kn: 'ನನ್ನ ಸ್ಕ್ಯಾನ್ ವರದಿ ಯಾವಾಗ ಮತ್ತು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
        te: 'నా స్కాన్ రిపోర్ట్ ఎప్పుడు మరియు ఎక్కడ లభిస్తుంది?',
        en: 'When and where can I collect my diagnostic report?',
      },
    },
    {
      id: 'q-food',
      label: {
        kn: 'ಸ್ಕ್ಯಾನ್ ಮುಗಿದ ನಂತರ ನಾನು ಯಾವಾಗ ಊಟ ಮಾಡಬಹುದು?',
        te: 'స్కాన్ పూర్తయిన తర్వాత నేను ఎప్పుడు భోజనం చేయవచ్చు?',
        en: 'When is it okay for me to eat after the scan finishes?',
      },
    },
    {
      id: 'q-medicine',
      label: {
        kn: 'ನನ್ನ ದೈನಂದಿನ ಮಾತ್ರೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮುನ್ನ ತೆಗೆದುಕೊಳ್ಳಬಹುದೇ?',
        te: 'నా రోజువారీ మాత్రలను స్కాన్‌కు ముందు వేసుకోవచ్చా?',
        en: 'Should I take my usual morning tablets before coming?',
      },
    },
  ];

  const nonClinicalReminders = {
    kn: [
      'ನಿಗದಿತ ಸಮಯಕ್ಕಿಂತ ೩೦ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಆಸ್ಪತ್ರೆಗೆ ತಲುಪಿ.',
      'ಆರಾಮದಾಯಕ, ಸಡಿಲವಾದ ಬಟ್ಟೆ ಧರಿಸಿ; ಲೋಹದ ಆಭರಣಗಳನ್ನು ಮನೆಯಲ್ಲಿಯೇ ಇಡಿ.',
      'ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಕುಟುಂಬದ ಒಬ್ಬರನ್ನು ಜೊತೆಯಲ್ಲಿ ಕರೆದುಕೊಂಡು ಬನ್ನಿ.',
    ],
    te: [
      'నిర్ణయించిన సమయానికి 30 నిమిషాల ముందు ఆసుపత్రికి చేరుకోండి.',
      'వదులుగా సౌకర్యవంతమైన దుస్తులు ధరించండి; ఆభరణాలు ఇంట్లోనే ఉంచండి.',
      'వీలైతే కుటుంబ సభ్యులలో ఒకరిని తోడుగా తీసుకురండి.',
    ],
    en: [
      'Arrive 30 minutes before your scheduled reporting time.',
      'Wear loose comfortable clothing and leave metallic jewelry at home.',
      'Bring a trusted companion or drinking water for after the visit if comfortable.',
    ],
  };

  const patientName =
    currentLanguage === 'kn'
      ? appointment.patientNameKannada
      : currentLanguage === 'te'
      ? appointment.patientNameTelugu
      : appointment.patientName;

  const hospitalName =
    currentLanguage === 'kn'
      ? appointment.hospitalNameKannada
      : currentLanguage === 'te'
      ? appointment.hospitalNameTelugu
      : appointment.hospitalName;

  const testName =
    currentLanguage === 'kn'
      ? appointment.testNameKannada
      : currentLanguage === 'te'
      ? appointment.testNameTelugu
      : appointment.testName;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customQuestion.trim();
    if (!trimmed) return;
    setCustomQuestionsList([...customQuestionsList, trimmed]);
    setCustomQuestion('');
  };

  const handleListenPassport = () => {
    const summary =
      currentLanguage === 'kn'
        ? `ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್. ರೋಗಿ: ${patientName}. ಪರೀಕ್ಷೆ: ${testName}. ದಿನಾಂಕ: ${appointment.date}, ${appointment.time}. ಆಸ್ಪತ್ರೆ: ${hospitalName}, ${appointment.roomNumber}. ${appointment.directions.kn}`
        : currentLanguage === 'te'
        ? `నా విజిట్ పాస్‌పోర్ట్. రోగి: ${patientName}. పరీక్ష: ${testName}. తేదీ: ${appointment.date}, ${appointment.time}. ఆసుపత్రి: ${hospitalName}, ${appointment.roomNumber}. ${appointment.directions.te}`
        : `My Visit Passport. Patient: ${patientName}. Test: ${testName}. Date: ${appointment.date} at ${appointment.time}. Hospital: ${hospitalName}, ${appointment.roomNumber}. ${appointment.directions.en}`;
    speechService.speak(summary, currentLanguage);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleListenPassport}
            className="py-2.5 px-5 rounded-full bg-white border border-[#BEA06D] text-[#8F7242] hover:bg-[#FCF9F5] font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಪಾಸ್‌ಪೋರ್ಟ್ ಆಲಿಸಿ' : currentLanguage === 'te' ? 'పాస్‌పోర్ట్ వినండి' : 'Listen to Passport'}
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-6 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ' : currentLanguage === 'te' ? 'ప్రింట్ / PDF సేవ్ చేయండి' : 'Print / Save as PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Page Title (hidden when printing) */}
      <div className="text-center space-y-2 no-print">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          CORE Visit Passport
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್'
            : currentLanguage === 'te'
            ? 'నా విజిట్ పాస్‌పోర్ట్'
            : 'My Visit Passport'}
        </h1>
        <p className="text-sm text-[#3C3330]/80 max-w-xl mx-auto">
          {currentLanguage === 'kn'
            ? 'ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡುವಾಗ ಕೈಯಲ್ಲಿಟ್ಟುಕೊಳ್ಳಬಹುದಾದ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಸಿದ್ಧತಾ ಕಾರ್ಡ್.'
            : currentLanguage === 'te'
            ? 'ఆసుపత్రికి వెళ్ళేటప్పుడు మీ వెంట ఉంచుకోగల వ్యక్తిగత తయారీ కార్డు.'
            : 'A personalized, printable botanical preparation card to carry with you on your visit.'}
        </p>
      </div>

      {/* The Printable Passport Card */}
      <div className="print-passport-only bg-white border-2 border-[#BEA06D] rounded-[28px] shadow-xl overflow-hidden">
        {/* Top Gold Band */}
        <div className="bg-gradient-to-r from-[#FCF9F5] via-[#E6C1C4]/25 to-[#FCF9F5] border-b-2 border-[#BEA06D]/40 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CoreMonogramMark size="lg" />
            <div>
              <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-widest block">
                CORE · Healthcare Visit Passport
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
                {patientName}
              </h2>
              <p className="text-xs text-[#3C3330]/80">
                {testName}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#BEA06D]/50 text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7242] block">
              {currentLanguage === 'kn' ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾದರಿ' : currentLanguage === 'te' ? 'నమూనా ప్రోటోటైప్' : 'Sample Demonstration'}
            </span>
            <p className="text-xs font-semibold text-[#3C3330] tabular-nums">
              Ref: {appointment.id}
            </p>
            <p className="text-[11px] text-[#3C3330]/75">
              {currentLanguage === 'kn' ? 'ದೃಢೀಕೃತ ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್ ಅಲ್ಲ' : currentLanguage === 'te' ? 'ధృవీకరించిన బుకింగ్ కాదు' : 'Not a confirmed hospital booking'}
            </p>
          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 sm:p-8 space-y-7">
          {/* Date, Time & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {currentLanguage === 'kn' ? 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ' : currentLanguage === 'te' ? 'తేదీ మరియు సమయం' : 'Date & Time'}
                </span>
              </span>
              <p className="font-display text-xl font-bold text-[#3C3330] tabular-nums">
                {appointment.date} ({appointment.dayOfWeek})
              </p>
              <p className="text-base font-bold text-[#8F7242] flex items-center gap-1.5 tabular-nums">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>
                  {currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಮತ್ತು ಕೊಠಡಿ' : currentLanguage === 'te' ? 'ఆసుపత్రి & గది' : 'Hospital & Location'}
                </span>
              </span>
              <p className="text-base font-bold text-[#3C3330]">{hospitalName}</p>
              <p className="text-xs font-semibold text-[#8F7242]">{appointment.roomNumber}</p>
            </div>
          </div>

          {/* Directions */}
          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1.5">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C98897]" />
              <span>
                {currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆಯೊಳಗೆ ತಲುಪುವ ದಾರಿ' : currentLanguage === 'te' ? 'ఆసుపత్రిలో దారి సూచనలు' : 'Location & Directions'}
              </span>
            </span>
            <p className="text-sm font-medium text-[#3C3330] leading-relaxed">
              {appointment.directions[currentLanguage]}
            </p>
          </div>

          {/* Documents & Questions Two-Column Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documents Checklist */}
            <div className="p-5 rounded-2xl border border-[#BEA06D]/35 bg-white space-y-3">
              <h3 className="font-display text-xl font-bold text-[#3C3330] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#BEA06D]" />
                <span>
                  {currentLanguage === 'kn' ? 'ತರಬೇಕಾದ ದಾಖಲೆಗಳು' : currentLanguage === 'te' ? 'తీసుకురావలసిన పత్రాలు' : 'Documents to Bring'}
                </span>
              </h3>

              <div className="space-y-2">
                {docsChecklist.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  return (
                    <label
                      key={doc.id}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FCF9F5] cursor-pointer text-sm text-[#3C3330]"
                    >
                      <span
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked
                            ? 'bg-[#4A6347] border-[#4A6347] text-white'
                            : 'bg-white border-[#BEA06D]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setCheckedDocs({ ...checkedDocs, [doc.id]: !isChecked })
                        }
                        className="sr-only"
                      />
                      <span className={isChecked ? 'font-semibold' : ''}>
                        {doc.label[currentLanguage]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Questions to Ask the Healthcare Professional */}
            <div className="p-5 rounded-2xl border border-[#BEA06D]/35 bg-white space-y-3">
              <h3 className="font-display text-xl font-bold text-[#3C3330] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#C98897]" />
                <span>
                  {currentLanguage === 'kn' ? 'ವೈದ್ಯರನ್ನು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು' : currentLanguage === 'te' ? 'డాక్టర్‌ను అడగవలసిన ప్రశ్నలు' : 'Questions to Ask Staff'}
                </span>
              </h3>

              <div className="space-y-2">
                {doctorQuestions.map((q) => {
                  const isChecked = !!selectedQuestions[q.id];
                  return (
                    <label
                      key={q.id}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FCF9F5] cursor-pointer text-sm text-[#3C3330]"
                    >
                      <span
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked
                            ? 'bg-[#BEA06D] border-[#BEA06D] text-white'
                            : 'bg-white border-[#BEA06D]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedQuestions({
                            ...selectedQuestions,
                            [q.id]: !isChecked,
                          })
                        }
                        className="sr-only"
                      />
                      <span>{q.label[currentLanguage]}</span>
                    </label>
                  );
                })}

                {customQuestionsList.map((cq, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FCF9F5] text-sm text-[#3C3330]"
                  >
                    <Check className="w-4 h-4 text-[#BEA06D] shrink-0 mt-0.5" />
                    <span>{cq}</span>
                  </div>
                ))}
              </div>

              {/* Add Custom Question (hidden on print) */}
              <form onSubmit={handleAddQuestion} className="flex gap-2 pt-1 no-print">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={
                    currentLanguage === 'kn'
                      ? 'ನಿಮ್ಮದೇ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ...'
                      : currentLanguage === 'te'
                      ? 'మీ ప్రశ్నను జతచేయండి...'
                      : 'Add your own question...'
                  }
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#BEA06D]/40 bg-[#FCF9F5] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
                <button
                  type="submit"
                  className="compact-chip px-3 py-2 rounded-xl bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'kn' ? 'ಸೇರಿಸಿ' : currentLanguage === 'te' ? 'జోడించు' : 'Add'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Important Non-Clinical Reminders */}
          <div className="p-5 rounded-2xl bg-[#A2B29B]/15 border border-[#A2B29B]/50 space-y-2.5">
            <h3 className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಪ್ರಮುಖ ಸಾಮಾನ್ಯ ಜ್ಞಾಪನೆಗಳು'
                  : currentLanguage === 'te'
                  ? 'ముఖ్యమైన సాధారణ సూచనలు'
                  : 'Important Non-Clinical Reminders'}
              </span>
            </h3>
            <ul className="space-y-1.5 text-sm text-[#3C3330]">
              {nonClinicalReminders[currentLanguage].map((rem, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#4A6347] font-bold">•</span>
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Print Disclaimer Footer */}
          <div className="pt-4 border-t border-[#BEA06D]/25 flex items-start gap-2.5 text-xs text-[#3C3330]/75">
            <ShieldAlert className="w-4 h-4 text-[#BEA06D] shrink-0 mt-0.5" />
            <p>
              {currentLanguage === 'kn'
                ? 'CORE ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಕಾರ್ಡ್: ಇದು ರೋಗಿ ಸಿದ್ಧತೆಗಾಗಿ ರೂಪಿಸಲಾದ ಮಾದರಿಯಾಗಿದೆ. ಇದು ದೃಢೀಕೃತ ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ.'
                : currentLanguage === 'te'
                ? 'CORE నమూనా కార్డు: ఇది రోగి తయారీ కోసం రూపొందించబడిన ప్రోటోటైప్. ఇది ధృవీకరించబడిన ఆసుపత్రి బుకింగ్ లేదా వైద్య సలహా కాదు.'
                : 'CORE Demonstration Card: Sample preparation passport generated for accessibility demonstration. Does not represent a confirmed hospital booking or clinical advice.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
