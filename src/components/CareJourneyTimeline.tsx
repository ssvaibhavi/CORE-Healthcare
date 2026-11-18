import React, { useState } from 'react';
import { Appointment, Language } from '../types';
import { CARE_JOURNEY_STAGES } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  CalendarClock,
  Building2,
  HeartHandshake,
  Sparkles,
  Check
} from 'lucide-react';

interface CareJourneyTimelineProps {
  language: Language;
  appointment: Appointment;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
}

export const CareJourneyTimeline: React.FC<CareJourneyTimelineProps> = ({
  language,
  appointment,
  completedTasks,
  onToggleTask,
}) => {
  const [expandedStage, setExpandedStage] = useState<'before' | 'during' | 'after'>('before');

  const totalTasks = CARE_JOURNEY_STAGES.reduce((sum, st) => sum + st.tasks.length, 0);
  const completedCount = CARE_JOURNEY_STAGES.reduce(
    (sum, st) => sum + st.tasks.filter((task) => completedTasks[task.id]).length,
    0
  );
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const stageIcons = {
    before: <CalendarClock className="w-6 h-6 text-[#8F7242]" />,
    during: <Building2 className="w-6 h-6 text-[#C98897]" />,
    after: <HeartHandshake className="w-6 h-6 text-[#4A6347]" />,
  };

  const handleListenStage = (stageId: 'before' | 'during' | 'after') => {
    const stage = CARE_JOURNEY_STAGES.find((s) => s.id === stageId);
    if (!stage) return;
    const taskText = stage.tasks.map((t, idx) => `${idx + 1}. ${t.label[language]}`).join(' ');
    speechService.speak(
      `${stage.title[language]}. ${stage.guidance[language]} ${taskText}`,
      language
    );
  };

  return (
    <div className="bg-white border-2 border-[#BEA06D]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 soft-fade-up">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BEA06D]/20 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
            <span>
              {language === 'kn'
                ? 'ನನ್ನ ಆರೈಕೆ ಪಯಣ'
                : language === 'te'
                ? 'నా ఆరోగ్య ప్రయాణం'
                : 'My Care Journey'}
            </span>
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
            {language === 'kn'
              ? `${appointment.patientNameKannada} ರವರ ಭೇಟಿಯ ಮಾರ್ಗದರ್ಶಿ`
              : language === 'te'
              ? `${appointment.patientNameTelugu} గారి సందర్శన ప్రణాళిక`
              : `Step-by-Step Care Journey`}
          </h3>
          <p className="text-xs sm:text-sm text-[#3C3330]/80">
            {language === 'kn'
              ? 'ಪ್ರತಿ ಹಂತವನ್ನು ತೆರೆದು ಪೂರ್ಣಗೊಂಡ ಸಿದ್ಧತೆಗಳನ್ನು ಗುರುತು ಹಾಕಿ.'
              : language === 'te'
              ? 'ప్రతి దశను తెరిచి పూర్తయిన ఏర్పాట్లపై టిక్ చేయండి.'
              : 'Expand each stage below and check off preparation steps as you complete them.'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-2xl p-4 min-w-[210px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#8F7242]">
              {language === 'kn' ? 'ಸಿದ್ಧತೆ ಪ್ರಗತಿ' : language === 'te' ? 'తయారీ పురోగతి' : 'Preparation Progress'}
            </span>
            <span className="tabular-nums text-[#3C3330]">
              {completedCount} / {totalTasks}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#BEA06D]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6347] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {completedCount === totalTasks && (
            <span className="text-[11px] font-semibold text-[#4A6347] flex items-center gap-1 check-pop">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'kn'
                ? 'ಎಲ್ಲಾ ಸಿದ್ಧತೆ ಪೂರ್ಣಗೊಂಡಿದೆ!'
                : language === 'te'
                ? 'అన్ని ఏర్పాట్లు పూర్తయ్యాయి!'
                : 'All visit steps completed!'}
            </span>
          )}
        </div>
      </div>

      {/* 3-Stage Interactive Timeline */}
      <div className="relative space-y-4">
        {CARE_JOURNEY_STAGES.map((stage, index) => {
          const isOpen = expandedStage === stage.id;
          const stageDoneCount = stage.tasks.filter((t) => completedTasks[t.id]).length;
          const stageComplete = stageDoneCount === stage.tasks.length;

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border-2 transition-all overflow-hidden ${
                isOpen
                  ? 'border-[#BEA06D] bg-[#FCF9F5]/60 shadow-sm'
                  : 'border-[#BEA06D]/25 bg-white hover:border-[#BEA06D]/60'
              }`}
            >
              {/* Stage Header Button */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedStage(isOpen ? (stage.id === 'before' ? 'during' : 'before') : stage.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedStage(stage.id);
                  }
                }}
                aria-expanded={isOpen}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#BEA06D]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${
                      stageComplete
                        ? 'bg-[#A2B29B]/30 border-[#4A6347]'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/40'
                    }`}
                  >
                    {stageComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-[#4A6347] check-pop" />
                    ) : (
                      stageIcons[stage.id]
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#8F7242] font-semibold">
                      <span>0{index + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {stageDoneCount}/{stage.tasks.length}{' '}
                        {language === 'kn' ? 'ಪೂರ್ಣ' : language === 'te' ? 'పూర్తి' : 'done'}
                      </span>
                    </div>
                    <h4 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                      {stage.title[language]}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3C3330]/75">
                      {stage.subtitle[language]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListenStage(stage.id);
                    }}
                    className="compact-chip p-2.5 rounded-full bg-white border border-[#BEA06D]/40 text-[#8F7242] hover:bg-[#BEA06D]/15 cursor-pointer"
                    title={language === 'kn' ? 'ಈ ಹಂತ ಆಲಿಸಿ' : language === 'te' ? 'ఈ దశ వినండి' : 'Listen to this stage'}
                    aria-label={language === 'kn' ? 'ಈ ಹಂತ ಆಲಿಸಿ' : language === 'te' ? 'ఈ దశ వినండి' : 'Listen to this stage'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#8F7242]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#8F7242]" />
                  )}
                </div>
              </div>

              {/* Expanded Stage Body */}
              {isOpen && (
                <div className="px-4 sm:px-6 pb-6 pt-2 space-y-4 border-t border-[#BEA06D]/20 bg-white soft-fade-up">
                  <div className="p-3.5 rounded-xl bg-[#E6C1C4]/20 border border-[#E6C1C4]/70 text-xs sm:text-sm text-[#3C3330] leading-relaxed">
                    {stage.guidance[language]}
                  </div>

                  {/* Interactive Checklist */}
                  <div className="space-y-2.5">
                    {stage.tasks.map((task) => {
                      const checked = !!completedTasks[task.id];
                      return (
                        <label
                          key={task.id}
                          className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                            checked
                              ? 'bg-[#A2B29B]/15 border-[#4A6347]/50'
                              : 'bg-[#FCF9F5] border-[#BEA06D]/25 hover:border-[#BEA06D]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              checked
                                ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                                : 'bg-white border-[#BEA06D]/60 text-transparent'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggleTask(task.id)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <span
                              className={`text-sm sm:text-base font-semibold block ${
                                checked ? 'line-through text-[#3C3330]/65' : 'text-[#3C3330]'
                              }`}
                            >
                              {task.label[language]}
                            </span>
                            <span className="text-xs text-[#8F7242] block mt-0.5">
                              {task.helper[language]}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
