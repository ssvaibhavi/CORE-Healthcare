import React from 'react';
import { CoreMonogramMark } from './BotanicalMotifs';
import { Appointment, Language } from '../types';
import { ComputedRoute } from '../utils/wayfinding';
import { STAGE_1_CHECKLIST, STAGE_4_STAFF_QUESTIONS } from '../data/navigatorContent';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import {
  Accessibility,
  CheckCircle2,
  Download,
  FileText,
  HelpCircle,
  MapPin,
  Printer,
  ShieldAlert,
  Volume2,
} from 'lucide-react';

interface NavigationCardPrintableProps {
  language: Language;
  appointment: Appointment;
  route: ComputedRoute;
  completedChecklist: Record<string, boolean>;
  selectedQuestions: Record<string, boolean>;
  customQuestions: string[];
  onCardPrintedOrSaved?: () => void;
}

export const NavigationCardPrintable: React.FC<NavigationCardPrintableProps> = ({
  language,
  appointment,
  route,
  completedChecklist,
  selectedQuestions,
  customQuestions,
  onCardPrintedOrSaved,
}) => {
  const patientName =
    language === 'kn'
      ? appointment.patientNameKannada
      : language === 'te'
      ? appointment.patientNameTelugu
      : appointment.patientName;

  const activeQuestions: string[] = [
    ...STAGE_4_STAFF_QUESTIONS.filter((q) => selectedQuestions[q.id]).map((q) => q.text[language]),
    ...customQuestions,
  ];

  const handlePrintPdf = () => {
    onCardPrintedOrSaved?.();
    window.print();
  };

  const handleDownloadTxt = () => {
    onCardPrintedOrSaved?.();
    const lines = [
      'CORE SMART HOSPITAL NAVIGATOR — PERSONALIZED NAVIGATION CARD',
      'FICTIONAL DEMONSTRATION CARD — NOT A CONFIRMED HOSPITAL BOOKING',
      '==============================================================',
      `Visitor / Patient (Demo): ${patientName}`,
      `Appointment Reference: ${appointment.id} | ${appointment.date} ${appointment.time}`,
      `Selected Department / Destination: ${route.destination.name[language]}`,
      `Starting Point: ${route.start.name[language]}`,
      `Route Preference: ${
        route.accessibleOnly
          ? 'Step-Free Accessible Route (Uses Accessible Lift, Avoids Stairs)'
          : 'Standard Shortest Route'
      }`,
      `Estimated Distance / Walk: ${route.totalMeters}m (~${route.estimatedMinutes} min)`,
      '',
      'STEP-BY-STEP ARRIVAL ROUTE:',
      ...(route.steps.length > 0
        ? route.steps.map(
            (s) => `${s.stepNumber}. ${s.instruction[language].simple} (${s.from.shortLabel[language]} -> ${s.to.shortLabel[language]})`
          )
        : [`Already at ${route.destination.name[language]}`]),
      '',
      'PREPARATION CHECKLIST:',
      ...STAGE_1_CHECKLIST.map(
        (item) => `[${completedChecklist[item.id] ? 'DONE' : 'TODO'}] ${item.label[language]}`
      ),
      '',
      'QUESTIONS FOR HOSPITAL STAFF:',
      ...(activeQuestions.length > 0
        ? activeQuestions.map((q, idx) => `${idx + 1}. ${q}`)
        : ['None added yet']),
      '',
      'Note: All map layouts and patient samples in CORE are fictional demonstrations.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CORE-Navigation-Card-${appointment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleListenCard = () => {
    const stepsText = route.steps.map((s) => s.instruction[language].simple).join('. ');
    const spoken =
      language === 'kn'
        ? `CORE ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್. ${patientName}. ತಲುಪಬೇಕಾದ ವಿಭಾಗ: ${route.destination.name.kn}. ದಾರಿ: ${stepsText}`
        : language === 'te'
        ? `CORE నావిగేషన్ కార్డు. ${patientName}. వెళ్ళవలసిన విభాగం: ${route.destination.name.te}. దారి: ${stepsText}`
        : `CORE Navigation Card for ${patientName}. Destination: ${route.destination.name.en}. Route preference: ${
            route.accessibleOnly ? 'Step-Free Accessible Lift Route' : 'Standard Route'
          }. ${stepsText}`;
    speechService.speak(spoken, resolveSpeechLanguage(spoken, language));
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <h3 className="font-display text-2xl font-bold text-[#322826]">
          {language === 'kn'
            ? 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ CORE ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್'
            : language === 'te'
            ? 'మీ వ్యక్తిగత CORE నావిగేషన్ కార్డు'
            : 'Personalized CORE Navigation Card'}
        </h3>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleListenCard}
            className="compact-chip py-2 px-4 rounded-full bg-white border border-[#BEA06D] text-[#8A6D3F] hover:bg-[#FCF9F5] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ಕಾರ್ಡ್ ಆಲಿಸಿ' : language === 'te' ? 'కార్డు వినండి' : 'Listen to Card'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="compact-chip py-2 px-4 rounded-full bg-white border border-[#4A6347]/50 text-[#4A6347] hover:bg-[#A2B29B]/15 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? '.txt ಉಳಿಸಿ' : language === 'te' ? '.txt డౌన్‌లోడ్' : 'Download .txt'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="py-2.5 px-5 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>
              {language === 'kn'
                ? 'ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ'
                : language === 'te'
                ? 'ప్రింట్ / PDF సేవ్ చేయండి'
                : 'Print / Save PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Printable Rosewater Navigation Card */}
      <div className="print-passport-only bg-white border-2 border-[#BEA06D] rounded-[28px] shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#FCF9F5] via-[#E6C1C4]/25 to-[#FCF9F5] border-b border-[#BEA06D]/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <CoreMonogramMark size="md" />
            <div>
              <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-widest block">
                CORE Smart Navigator · Travel Sheet
              </span>
              <h4 className="font-display text-2xl sm:text-3xl font-bold text-[#322826]">
                {patientName}
              </h4>
              <p className="text-xs text-[#493C39]/80">
                {appointment.date} ({appointment.time}) · Ref: {appointment.id}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#BEA06D]/45 text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6D3F] block">
              {language === 'kn'
                ? 'ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಕಾರ್ಡ್'
                : language === 'te'
                ? 'కల్పిత నమూనా కార్డు'
                : 'Fictional Demonstration Card'}
            </span>
            <p className="text-xs font-bold text-[#322826] mt-0.5">
              {route.destination.name[language]}
            </p>
            <p className="text-[11px] text-[#4A6347] font-semibold">
              {route.accessibleOnly
                ? language === 'kn'
                  ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ದಾರಿ'
                  : language === 'te'
                  ? 'మెట్లు లేని లిఫ్ట్ మార్గం'
                  : 'Accessible Lift Route'
                : language === 'kn'
                ? 'ಸಾಮಾನ್ಯ ದಾರಿ'
                : language === 'te'
                ? 'సాధారణ మార్గం'
                : 'Standard Route'}
            </p>
          </div>
        </div>

        {/* Body Grid */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Selected Department & Route Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
              <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C88F98]" />
                <span>
                  {language === 'kn'
                    ? 'ಆಯ್ದ ವಿಭಾಗ ಮತ್ತು ದಾರಿ'
                    : language === 'te'
                    ? 'ఎంచుకున్న విభాగం & మార్గం'
                    : 'Department & Route Path'}
                </span>
              </span>
              <p className="font-display text-xl font-bold text-[#322826]">
                {route.start.shortLabel[language]} → {route.destination.name[language]}
              </p>
              <p className="text-xs text-[#493C39]/80 tabular-nums">
                {route.totalMeters} m · ~{route.estimatedMinutes}{' '}
                {language === 'kn' ? 'ನಿಮಿಷ' : language === 'te' ? 'నిమిషాలు' : 'min walk'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
              <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                <Accessibility className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn'
                    ? 'ಪ್ರವೇಶ್ಯತೆ ಆದ್ಯತೆ'
                    : language === 'te'
                    ? 'సౌకర్య ప్రాధాన్యత'
                    : 'Accessibility Preference'}
                </span>
              </span>
              <p className="text-sm font-bold text-[#322826]">
                {route.accessibleOnly
                  ? language === 'kn'
                    ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ಮಾರ್ಗ (ಮೆಟ್ಟಿಲುಗಳನ್ನು ತಪ್ಪಿಸಲಾಗಿದೆ)'
                    : language === 'te'
                    ? 'మెట్లు లేని లిఫ్ట్ మార్గం (మెట్లు తప్పించబడ్డాయి)'
                    : 'Step-Free Route via Accessible Lift (Avoids Stairs)'
                  : language === 'kn'
                  ? 'ಸಾಮಾನ್ಯ ಕಡಿಮೆ ದೂರದ ಮಾರ್ಗ'
                  : language === 'te'
                  ? 'సాధారణ దగ్గరి మార్గం'
                  : 'Standard Shortest Path'}
              </p>
              <p className="text-xs text-[#493C39]/80">
                {route.destination.accessibilityNote[language]}
              </p>
            </div>
          </div>

          {/* Step-by-step arrival steps */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#BEA06D]/35 bg-white space-y-2.5">
            <h5 className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C88F98]" />
              <span>
                {language === 'kn'
                  ? 'ಹಂತ-ಹಂತದ ಆಗಮನ ದಾರಿ'
                  : language === 'te'
                  ? 'దశలవారీ ఆసుపత్రి మార్గం'
                  : 'Step-by-Step Arrival Route (Demo Layout)'}
              </span>
            </h5>
            <ol className="space-y-1.5 text-sm text-[#322826] list-decimal pl-5">
              {route.steps.length > 0 ? (
                route.steps.map((step) => (
                  <li key={step.edgeId} className="leading-relaxed">
                    {step.instruction[language].simple}
                  </li>
                ))
              ) : (
                <li>{route.destination.description[language]}</li>
              )}
            </ol>
          </div>

          {/* Checklist & Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#BEA06D]/30 bg-[#FCF9F5] space-y-2.5">
              <h5 className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>
                  {language === 'kn'
                    ? 'ಸಿದ್ಧತಾ ಪಟ್ಟಿ'
                    : language === 'te'
                    ? 'తయారీ జాబితా'
                    : 'Preparation Checklist'}
                </span>
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#322826]">
                {STAGE_1_CHECKLIST.map((item) => {
                  const done = !!completedChecklist[item.id];
                  return (
                    <li key={item.id} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          done ? 'text-[#4A6347]' : 'text-[#BEA06D]/50'
                        }`}
                      />
                      <span className={done ? 'font-semibold' : 'text-[#493C39]/80'}>
                        {item.label[language]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-[#BEA06D]/30 bg-[#FCF9F5] space-y-2.5">
              <h5 className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#C88F98]" />
                <span>
                  {language === 'kn'
                    ? 'ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು'
                    : language === 'te'
                    ? 'సిబ్బందిని అడిగే ప్రశ్నలు'
                    : 'Questions for Hospital Staff'}
                </span>
              </h5>
              {activeQuestions.length > 0 ? (
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#322826] list-disc pl-4">
                  {activeQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#493C39]/75 italic">
                  {language === 'kn'
                    ? 'ಹಂತ 4 ರಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
                    : language === 'te'
                    ? 'దశ 4 లో ప్రశ్నలను ఎంచుకోండి.'
                    : 'Select or add questions in Stage 4 to include them here.'}
                </p>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-3 border-t border-[#BEA06D]/25 flex items-start gap-2 text-xs text-[#493C39]/80">
            <ShieldAlert className="w-4 h-4 text-[#BEA06D] shrink-0 mt-0.5" />
            <p>
              {language === 'kn'
                ? 'ಗಮನಿಸಿ: ಇದು ಕಲಿಕಾ ಮತ್ತು ಪ್ರವೇಶ್ಯತೆ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ರಚಿಸಿದ ಕಾಲ್ಪನಿಕ ಮಾರ್ಗದರ್ಶಿ ಕಾರ್ಡ್. ಇದು ದೃಢೀಕೃತ ಆಸ್ಪತ್ರೆ ಬುಕಿಂಗ್ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ.'
                : language === 'te'
                ? 'గమనిక: ఇది అవగాహన మరియు నమూనా ప్రదర్శన కోసం రూపొందించిన కల్పిత కార్డు మాత్రమే. ఇది నిజమైన ఆసుపత్రి బుకింగ్ లేదా వైద్య సలహా కాదు.'
                : 'Fictional Demonstration Notice: This CORE Navigation Card uses fictional hospital layout data for accessibility prototyping. It is not a confirmed hospital booking or medical instruction.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
