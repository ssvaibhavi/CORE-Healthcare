import React, { useState } from 'react';
import { Language, PageView } from '../types';
import {
  HOSPITAL_PROCESS_SEQUENCE,
  SENSE_MODULES,
  SenseModule
} from '../data/phase2Data';
import { speechService } from '../utils/speech';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  MessageSquareText,
  ShieldAlert,
  Volume2
} from 'lucide-react';

interface SenseViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
  onSenseCompleted?: () => void;
}

export const SenseView: React.FC<SenseViewProps> = ({
  currentLanguage,
  onPageChange,
  onSenseCompleted,
}) => {
  const [selectedModule, setSelectedModule] = useState<SenseModule>(SENSE_MODULES[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<Record<string, string>>({});
  const [teachBackInputs, setTeachBackInputs] = useState<Record<string, string>>({});
  const [teachBackChecked, setTeachBackChecked] = useState<Record<string, boolean>>({});
  const [completedActivityIds, setCompletedActivityIds] = useState<Record<string, boolean>>({});

  const totalActivities = SENSE_MODULES.length * 2; // Quiz + Teach-back per module
  const completedCount = Object.values(completedActivityIds).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalActivities) * 100);

  const markActivityDone = (key: string) => {
    setCompletedActivityIds((prev) => {
      const next = { ...prev, [key]: true };
      if (Object.values(next).filter(Boolean).length >= 1) {
        onSenseCompleted?.();
      }
      return next;
    });
  };

  const handleQuizSelect = (moduleId: string, optionId: string, isCorrect: boolean) => {
    setSelectedQuizOption((prev) => ({ ...prev, [moduleId]: optionId }));
    if (isCorrect) {
      markActivityDone(`${moduleId}-quiz`);
    }
  };

  const handleTeachBackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = (teachBackInputs[selectedModule.id] || '').trim();
    if (!val) return;
    setTeachBackChecked((prev) => ({ ...prev, [selectedModule.id]: true }));
    markActivityDone(`${selectedModule.id}-teachback`);
  };

  const getTeachBackFeedback = (mod: SenseModule) => {
    const raw = (teachBackInputs[mod.id] || '').toLowerCase();
    const matchedKeywords = mod.teachBackKeywords.filter((kw) => raw.includes(kw.toLowerCase()));
    const hasMatch = matchedKeywords.length > 0;

    if (hasMatch) {
      return {
        positive: true,
        text:
          currentLanguage === 'kn'
            ? 'ಬಹಳ ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ವಿವರಣೆಯು ಆಸ್ಪತ್ರೆ ಕ್ರಮದ ಮುಖ್ಯ ಅಂಶಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಕೆಳಗಿನ ಆದರ್ಶ ಸಾರಾಂಶದೊಂದಿಗೆ ಹೋಲಿಸಿ ನೋಡಿ.'
            : currentLanguage === 'te'
            ? 'చాలా బాగుంది! మీ వివరణలో ముఖ్యమైన దశలు ఉన్నాయి. క్రింది సారాంశంతో సరిచూసుకోండి.'
            : 'Thoughtful summary! You captured key administrative steps from the reference guide. Compare with the reference summary below.',
      };
    }

    return {
      positive: false,
      text:
        currentLanguage === 'kn'
          ? 'ಉತ್ತಮ ಪ್ರಯತ್ನ! ಇನ್ನಷ್ಟು ಸ್ಪಷ್ಟತೆಗಾಗಿ ಕೆಳಗಿನ ಆದರ್ಶ ಸಾರಾಂಶವನ್ನು ಓದಿ ಅಥವಾ ಕೇಳಿ ನೋಡಿ.'
          : currentLanguage === 'te'
          ? 'మంచి ప్రయత్నం! మరింత స్పష్టత కోసం క్రింది సారాంశాన్ని చదవండి లేదా వినండి.'
          : 'Thank you for practicing! Review the reference summary below to reinforce the main administrative step.',
    };
  };

  const activeQuizChoice = selectedModule.quizOptions.find(
    (o) => o.id === selectedQuizOption[selectedModule.id]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPageChange('clarity')}
            className="compact-chip text-xs font-semibold text-[#8F7242] underline hover:text-[#3C3330] cursor-pointer"
          >
            {currentLanguage === 'kn'
              ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Clarity) ನೋಡಿ →'
              : currentLanguage === 'te'
              ? 'Explain It Simply (Clarity) చూడండి →'
              : 'Open Explain It Simply (Clarity) →'}
          </button>
        </div>
      </div>

      {/* Header + Progress Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#BEA06D]" />
            <span>CORE Sense</span>
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
            {currentLanguage === 'kn'
              ? 'ಆಸ್ಪತ್ರೆ ಮಾಹಿತಿ ತಿಳುವಳಿಕೆ ಸಂಗಾತಿ'
              : currentLanguage === 'te'
              ? 'ఆసుపత్రి అవగాహన & అభ్యాస సహాయకుడు'
              : 'Health Literacy & Understanding Companion'}
          </h1>
          <p className="text-sm sm:text-base text-[#3C3330]/80">
            {currentLanguage === 'kn'
              ? 'ಕೇವಲ ಓದುವ ಬದಲು ಆಸ್ಪತ್ರೆಯ ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡು ಅಭ್ಯಾಸ ಮಾಡಿ.'
              : currentLanguage === 'te'
              ? 'కేవలం చదవడం కాకుండా ఆసుపత్రి నిబంధనలు మరియు దశలను అర్థం చేసుకుని అభ్యాసం చేయండి.'
              : 'Explore administrative terms, check your understanding, practice explaining in your own words, and see the visit sequence visually.'}
          </p>
        </div>

        {/* Learning Progress Card */}
        <div className="bg-white border-2 border-[#BEA06D]/40 rounded-2xl p-4 min-w-[230px] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#8F7242]">
              {currentLanguage === 'kn' ? 'ಕಲಿಕೆಯ ಪ್ರಗತಿ' : currentLanguage === 'te' ? 'అభ్యాస పురోగతి' : 'Learning Progress'}
            </span>
            <span className="tabular-nums text-[#3C3330]">
              {completedCount} / {totalActivities}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#BEA06D]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6347] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section A: Visual Explanation Sequence */}
      <section className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn' ? 'ದೃಶ್ಯ ವಿವರಣೆ ಕ್ರಮ' : currentLanguage === 'te' ? 'దృశ్య వివరణ క్రమం' : 'Visual Process Sequence'}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#3C3330]">
              {currentLanguage === 'kn'
                ? 'ಆಸ್ಪತ್ರೆ ಭೇಟಿಯ ೫ ಸರಳ ಹಂತಗಳು'
                : currentLanguage === 'te'
                ? 'ఆసుపత్రి సందర్శనలోని 5 దశలు'
                : 'How a Hospital Visit Flows Step by Step'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              const spoken = HOSPITAL_PROCESS_SEQUENCE.map(
                (s) => `${s.step}. ${s.title[currentLanguage]}: ${s.desc[currentLanguage]}`
              ).join(' ');
              speechService.speak(spoken, currentLanguage);
            }}
            className="compact-chip py-2 px-4 rounded-full bg-[#FCF9F5] border border-[#BEA06D] text-xs font-semibold text-[#8F7242] hover:bg-[#BEA06D]/15 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಎಲ್ಲಾ ಹಂತಗಳನ್ನು ಆಲಿಸಿ' : currentLanguage === 'te' ? 'అన్ని దశలు వినండి' : 'Listen to Sequence'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {HOSPITAL_PROCESS_SEQUENCE.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-[#BEA06D] text-white text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                {idx < HOSPITAL_PROCESS_SEQUENCE.length - 1 && (
                  <ArrowRight className="hidden lg:block w-4 h-4 text-[#BEA06D]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#3C3330]">{item.title[currentLanguage]}</h3>
                <p className="text-xs text-[#3C3330]/75 mt-0.5">{item.desc[currentLanguage]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section B: Plain-Language Explorer + Understand & Confirm + Teach-Back */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Term Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block px-1">
            {currentLanguage === 'kn'
              ? 'ಆಡಳಿತಾತ್ಮಕ ಪದಗಳನ್ನು ಆರಿಸಿ'
              : currentLanguage === 'te'
              ? 'ఆసుపత్రి పదాలను ఎంచుకోండి'
              : 'Plain-Language Explorer'}
          </span>

          <div className="space-y-2.5">
            {SENSE_MODULES.map((mod) => {
              const active = selectedModule.id === mod.id;
              const quizDone = !!completedActivityIds[`${mod.id}-quiz`];
              const tbDone = !!completedActivityIds[`${mod.id}-teachback`];
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                    active
                      ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-sm'
                      : 'bg-white border-[#BEA06D]/25 hover:border-[#BEA06D]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider">
                      {mod.category[currentLanguage]}
                    </span>
                    {(quizDone || tbDone) && (
                      <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0" />
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base text-[#3C3330]">
                    {mod.term[currentLanguage]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Learning Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Plain Explanation */}
          <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#8F7242] font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>
                  {currentLanguage === 'kn' ? 'ಸರಳ ವಿವರಣೆ' : currentLanguage === 'te' ? 'సులభ వివరణ' : 'Plain-Language Meaning'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  speechService.speak(
                    `${selectedModule.term[currentLanguage]}. ${selectedModule.plainExplanation[currentLanguage]}`,
                    currentLanguage
                  )
                }
                className="compact-chip py-1.5 px-3.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/50 text-xs font-semibold text-[#8F7242] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{currentLanguage === 'kn' ? 'ಕೇಳಿ' : currentLanguage === 'te' ? 'వినండి' : 'Listen'}</span>
              </button>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#3C3330]">
              {selectedModule.term[currentLanguage]}
            </h3>
            <p className="text-sm sm:text-base text-[#3C3330]/90 leading-relaxed">
              {selectedModule.plainExplanation[currentLanguage]}
            </p>
          </div>

          {/* 2. Understand & Confirm */}
          <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#4A6347] font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಅರ್ಥಮಾಡಿಕೊಂಡು ದೃಢೀಕರಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'అర్థం చేసుకుని నిర్ధారించండి'
                  : 'Understand & Confirm'}
              </span>
            </div>

            <p className="font-bold text-base text-[#3C3330]">
              {selectedModule.quizQuestion[currentLanguage]}
            </p>

            <div className="space-y-2.5">
              {selectedModule.quizOptions.map((opt) => {
                const isSelected = selectedQuizOption[selectedModule.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleQuizSelect(selectedModule.id, opt.id, opt.isCorrect)}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#A2B29B]/20 border-[#4A6347] text-[#211B19] font-semibold'
                          : 'bg-[#E6C1C4]/30 border-[#C98897] text-[#211B19]'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/25 hover:border-[#BEA06D] text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                );
              })}
            </div>

            {activeQuizChoice && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-medium soft-fade-up ${
                  activeQuizChoice.isCorrect
                    ? 'bg-[#A2B29B]/15 border border-[#4A6347]/50 text-[#3C3330]'
                    : 'bg-[#E6C1C4]/25 border border-[#C98897]/60 text-[#3C3330]'
                }`}
              >
                {activeQuizChoice.feedback[currentLanguage]}
              </div>
            )}
          </div>

          {/* 3. Teach-Back Experience */}
          <form
            onSubmit={handleTeachBackSubmit}
            className="bg-white border border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-[#8F7242] font-bold text-xs uppercase tracking-wider">
              <MessageSquareText className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ ಹೇಳಿ (Teach-Back)'
                  : currentLanguage === 'te'
                  ? 'మీ మాటలలో చెప్పండి (Teach-Back)'
                  : 'Teach-Back Reflection'}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#3C3330]">
              {selectedModule.teachBackPrompt[currentLanguage]}
            </p>

            <textarea
              rows={3}
              value={teachBackInputs[selectedModule.id] || ''}
              onChange={(e) =>
                setTeachBackInputs((prev) => ({ ...prev, [selectedModule.id]: e.target.value }))
              }
              placeholder={
                currentLanguage === 'kn'
                  ? 'ಇಲ್ಲಿ ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ಬರೆಯಿರಿ...'
                  : currentLanguage === 'te'
                  ? 'ఇక్కడ మీ సొంత మాటలలో రాయండి...'
                  : 'Type what you would do in your own words...'
              }
              className="w-full p-3.5 rounded-2xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                {currentLanguage === 'kn'
                  ? 'ನನ್ನ ವಿವರಣೆ ಪರಿಶೀಲಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'నా వివరణ చూడండి'
                  : 'Check Against Reference Guide'}
              </button>
            </div>

            {teachBackChecked[selectedModule.id] && (
              <div className="space-y-3 pt-2 soft-fade-up">
                {(() => {
                  const fb = getTeachBackFeedback(selectedModule);
                  return (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                        fb.positive
                          ? 'bg-[#A2B29B]/15 border-[#4A6347]/50 text-[#3C3330]'
                          : 'bg-[#FCF9F5] border-[#BEA06D]/45 text-[#3C3330]'
                      }`}
                    >
                      <p className="font-semibold">{fb.text}</p>
                      <p className="mt-2 text-[#8F7242] font-medium">
                        {selectedModule.referenceSummary[currentLanguage]}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-2.5 text-xs text-[#3C3330]/90">
              <ShieldAlert className="w-4 h-4 text-[#C98897] shrink-0 mt-0.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಗಮನಿಸಿ: ಇದು ಕಲಿಕೆ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸಕ್ಕಾಗಿ ಮಾತ್ರ — ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿರುವ ದೃಢೀಕರಣವಲ್ಲ. ಸಂದೇಹವಿದ್ದರೆ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಿ.'
                  : currentLanguage === 'te'
                  ? 'గమనిక: ఇది అభ్యాసం కోసం మాత్రమే — ఇది వైద్య సలహా నిర్ధారణ కాదు. సందేహం ఉంటే ఆసుపత్రి సిబ్బందిని అడగండి.'
                  : 'Educational Note: Teach-Back uses curated reference matching for learning practice and is not proof of clinical understanding. Always verify medical instructions with hospital staff.'}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
