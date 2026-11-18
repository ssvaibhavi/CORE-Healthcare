import React from 'react';
import { Appointment, Language, PageView } from '../types';
import { CareJourneyTimeline } from '../components/CareJourneyTimeline';
import { ArrowLeft, ArrowRight, FileCheck2, Sparkles, BookOpen } from 'lucide-react';

interface CareJourneyViewProps {
  currentLanguage: Language;
  appointment: Appointment;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  onPageChange: (page: PageView) => void;
}

export const CareJourneyView: React.FC<CareJourneyViewProps> = ({
  currentLanguage,
  appointment,
  completedTasks,
  onToggleTask,
  onPageChange,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Navigation Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#8F7242] font-medium">
          {currentLanguage === 'kn'
            ? 'ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಆರೈಕೆ ಮಾರ್ಗದರ್ಶಿ'
            : currentLanguage === 'te'
            ? 'నమూనా ఆరోగ్య ప్రయాణ మార్గదర్శి'
            : 'Sample Patient Journey · Fictional Demonstration'}
        </span>
      </div>

      {/* Main Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          CORE Care Journey
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ನನ್ನ ಆರೈಕೆ ಪಯಣ'
            : currentLanguage === 'te'
            ? 'నా ఆరోగ్య ప్రయాణం'
            : 'My Care Journey'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಯ ಮುನ್ನ, ಭೇಟಿಯ ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರದ ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ಶಾಂತವಾಗಿ ನಿರ್ವಹಿಸಿ.'
            : currentLanguage === 'te'
            ? 'ఆసుపత్రి సందర్శనకు ముందు, సమయంలో మరియు తర్వాత ప్రతి అడుగును ప్రశాంతంగా నిర్వహించండి.'
            : 'Navigate before, during, and after your diagnostic visit in calm, reassuring steps.'}
        </p>
      </div>

      {/* Interactive Timeline */}
      <CareJourneyTimeline
        language={currentLanguage}
        appointment={appointment}
        completedTasks={completedTasks}
        onToggleTask={onToggleTask}
      />

      {/* Quick Next-Step Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onPageChange('clarity')}
          className="p-5 bg-white border border-[#BEA06D]/40 hover:border-[#BEA06D] rounded-2xl text-left flex items-center justify-between gap-4 transition-all cursor-pointer botanical-card-hover"
        >
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-[#BEA06D] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-base text-[#3C3330] block">
                {currentLanguage === 'kn' ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Explain It Simply)' : currentLanguage === 'te' ? 'సులభంగా వివరించండి' : 'Explain Instructions Simply'}
              </span>
              <span className="text-xs text-[#3C3330]/75">
                {currentLanguage === 'kn' ? 'ಉಪವಾಸ ಮತ್ತು ರಕ್ತ ಪರೀಕ್ಷೆ ನಿಯಮಗಳ ಅರ್ಥ' : currentLanguage === 'te' ? 'ఉపవాసం మరియు రక్త పరీక్ష నియమాల అర్థం' : 'Understand hospital wording in plain language'}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8F7242] shrink-0" />
        </button>

        <button
          onClick={() => onPageChange('passport')}
          className="p-5 bg-white border border-[#BEA06D]/40 hover:border-[#BEA06D] rounded-2xl text-left flex items-center justify-between gap-4 transition-all cursor-pointer botanical-card-hover"
        >
          <div className="flex items-start gap-3">
            <FileCheck2 className="w-6 h-6 text-[#4A6347] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-base text-[#3C3330] block">
                {currentLanguage === 'kn' ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ರಚಿಸಿ' : currentLanguage === 'te' ? 'నా విజిట్ పాస్‌పోర్ట్ చూడండి' : 'Generate My Visit Passport'}
              </span>
              <span className="text-xs text-[#3C3330]/75">
                {currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್ ಅಥವಾ PDF ರೂಪದಲ್ಲಿ ಉಳಿಸಿ' : currentLanguage === 'te' ? 'ప్రింట్ లేదా PDF గా సేవ్ చేయండి' : 'Print or save your hospital travel card as PDF'}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#8F7242] shrink-0" />
        </button>
      </div>
    </div>
  );
};
