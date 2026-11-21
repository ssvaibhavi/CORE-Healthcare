import React, { useState } from 'react';
import {
  ActiveDisruptionState,
  Appointment,
  ExplanationComplexity,
  Language,
  PageView
} from '../types';
import { CareJourneyTimeline } from '../components/CareJourneyTimeline';
import { AiConsentNotice } from '../components/AiConsentNotice';
import { AiTrustHeader, AiTrustFooter, AiSkeletonLoader } from '../components/AiTrustLayer';
import { VisitSummaryCard } from '../components/VisitSummaryCard';
import { Reveal, WordReveal } from '../components/Reveal';
import {
  generateSmartJourneyAi,
  SmartJourneyAiTask,
  AiClientError
} from '../utils/aiClient';
import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  Sparkles,
  BookOpen,
  Check,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface CareJourneyViewProps {
  currentLanguage: Language;
  complexity?: ExplanationComplexity;
  appointment: Appointment;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  onPageChange: (page: PageView) => void;
  activeDisruption?: ActiveDisruptionState;
  onClearDisruption?: () => void;
}

const STARTER_NEEDS: Record<Language, string[]> = {
  en: [
    "I am visiting a hospital for the first time and don't know what to prepare.",
    'I am accompanying my elderly parent for an outpatient consultation and need transport + desk steps.',
  ],
  kn: [
    'ನಾನು ಮೊದಲ ಬಾರಿ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ, ಏನು ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಬೇಕೆಂದು ಗೊತ್ತಿಲ್ಲ.',
    'ನನ್ನ ಹಿರಿಯ ಪೋಷಕರೊಂದಿಗೆ OPD ಭೇಟಿಗೆ ಹೋಗಲು ಬಸ್ ಮತ್ತು ದಾಖಲೆ ಯೋಜನೆ ಬೇಕು.',
  ],
  te: [
    'నేను మొదటిసారి ఆసుపత్రికి వెళ్తున్నాను, ఏమి సిద్ధం చేసుకోవాలో తెలియదు.',
    'నా తల్లిదండ్రులతో OPD సందర్శనకు ప్రయాణం మరియు పత్రాల జాబితా కావాలి.',
  ],
};

export const CareJourneyView: React.FC<CareJourneyViewProps> = ({
  currentLanguage,
  complexity = 'simple',
  appointment,
  completedTasks,
  onToggleTask,
  aiConsentGranted,
  onAcceptAiConsent,
  onPageChange,
  activeDisruption,
  onClearDisruption,
}) => {
  const [needText, setNeedText] = useState('');
  const [aiPlanTitle, setAiPlanTitle] = useState('');
  const [aiAdvisory, setAiAdvisory] = useState('');
  const [aiTasks, setAiTasks] = useState<SmartJourneyAiTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBuildSmartJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = needText.trim();
    if (!cleaned || !aiConsentGranted || loading) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await generateSmartJourneyAi({
        needDescription: cleaned,
        language: currentLanguage,
        complexity,
        consentAccepted: true,
      });
      setAiPlanTitle(res.planTitle);
      setAiAdvisory(res.advisoryNote);
      setAiTasks(res.tasks);
    } catch (err) {
      setErrorMsg(
        err instanceof AiClientError
          ? err.message
          : 'Unable to generate Smart Journey checklist right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAiTask = (id: string) => {
    setAiTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateAiTaskLabel = (id: string, label: string) => {
    setAiTasks((prev) => prev.map((t) => (t.id === id ? { ...t, label } : t)));
  };

  const removeAiTask = (id: string) => {
    setAiTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newTaskText.trim();
    if (!cleaned) return;
    setAiTasks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        category: 'custom',
        label: cleaned,
        helper:
          currentLanguage === 'kn'
            ? 'ನೀವು ಸೇರಿಸಿದ್ದು'
            : currentLanguage === 'te'
            ? 'మీరు జోడించినది'
            : 'Added by you',
        completed: false,
      },
    ]);
    setNewTaskText('');
  };

  const aiDoneCount = aiTasks.filter((t) => t.completed).length;
  const aiProgressPct = aiTasks.length > 0 ? Math.round((aiDoneCount / aiTasks.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 soft-fade-up">
      {/* Top Navigation Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#493C39] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#C88F98] font-medium">
          {currentLanguage === 'kn'
            ? 'ಸ್ಮಾರ್ಟ್ ಜರ್ನಿ + 3-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ'
            : currentLanguage === 'te'
            ? 'స్మార్ట్ జర్నీ + 3-దశల మార్గదర్శి'
            : 'CORE Smart Journey · Sample Patient Timeline'}
        </span>
      </div>

      {/* Main Heading */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest block">
            CORE Smart Journey
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#493C39] text-balance">
            <WordReveal
              text={
                currentLanguage === 'kn'
                  ? 'ನನ್ನ ಆರೈಕೆ ಪಯಣ'
                  : currentLanguage === 'te'
                  ? 'నా ఆరోగ్య ప్రయాణం'
                  : 'My Care Journey'
              }
            />
          </h1>
          <p className="text-sm sm:text-base text-[#493C39]/80">
            {currentLanguage === 'kn'
              ? 'ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ವಿವರಿಸಿ ವೈಯಕ್ತಿಕ ಸಿದ್ಧತಾ ಪಟ್ಟಿ ಪಡೆಯಿರಿ, ಅಥವಾ ಕೆಳಗಿನ 3-ಹಂತದ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಬಳಸಿ.'
              : currentLanguage === 'te'
              ? 'మీ అవసరాన్ని వివరించి తయారీ జాబితా పొందండి, లేదా క్రింది 3-దశల ప్రణాళికను ఉపయోగించండి.'
              : 'Describe your organizational need for an editable AI-suggested checklist, or step calmly through Before, During, and After your visit.'}
          </p>
        </div>
      </Reveal>

      {/* CORE Smart Journey — AI Organizational Checklist Builder */}
      <Reveal delay={100}>
        <section className="bg-white border border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#BEA06D]/20 pb-4">
            <div>
              <span className="text-xs font-bold text-[#C88F98] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'AI-ಸಹಾಯಿತ ಭೇಟಿ ಸಿದ್ಧತಾ ಪಟ್ಟಿ (ಐಚ್ಛಿಕ ಮತ್ತು ಸಂಪಾದಿಸಬಹುದಾದ)'
                    : currentLanguage === 'te'
                    ? 'AI-సహాయక సందర్శన జాబితా (ఐచ్ఛికం & మార్చుకోదగినది)'
                    : 'AI-Assisted Organizational Guidance (Optional & Editable)'}
                </span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39] mt-0.5">
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಭೇಟಿಗೆ ಸಹಾಯಕ ಪಟ್ಟಿ ರಚಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'మీ సందర్శనకు సహాయక జాబితా సిద్ధం చేయండి'
                  : 'Build Your Custom Visit Preparation List'}
              </h2>
            </div>
          </div>

          <AiConsentNotice
            language={currentLanguage}
            consentGranted={aiConsentGranted}
            onAcceptConsent={onAcceptAiConsent}
          />

          <form onSubmit={handleBuildSmartJourney} className="space-y-3">
            <textarea
              rows={2}
              maxLength={1000}
              value={needText}
              onChange={(e) => setNeedText(e.target.value)}
              placeholder={STARTER_NEEDS[currentLanguage][0]}
              className="w-full p-4 rounded-2xl border border-[#BEA06D]/35 bg-[#FCF9F5] text-sm text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {STARTER_NEEDS[currentLanguage].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNeedText(sample)}
                    className="compact-chip text-[11px] px-3 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/35 hover:border-[#C88F98] text-[#493C39] cursor-pointer"
                  >
                    {currentLanguage === 'kn'
                      ? `ಉದಾಹರಣೆ ${idx + 1}`
                      : currentLanguage === 'te'
                      ? `నమూనా ${idx + 1}`
                      : `Prompt ${idx + 1}`}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!aiConsentGranted || loading || needText.trim().length < 5}
                className="py-2.5 px-6 rounded-full bg-[#BEA06D] hover:bg-[#8A6D3F] disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {loading
                    ? currentLanguage === 'kn'
                      ? 'ಪಟ್ಟಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...'
                      : currentLanguage === 'te'
                      ? 'జాబితా సిద్ధమవుతోంది...'
                      : 'Preparing List...'
                    : currentLanguage === 'kn'
                    ? 'ಸಿದ್ಧತಾ ಹಂತಗಳನ್ನು ಸೂಚಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'తయారీ దశలను సూచించండి'
                    : 'Suggest Organizational Steps'}
                </span>
              </button>
            </div>
          </form>

          {loading && (
            <AiSkeletonLoader
              label={
                currentLanguage === 'kn'
                  ? 'ಸಂಪಾದಿಸಬಹುದಾದ ಭೇಟಿ ಸಿದ್ಧತಾ ಹಂತಗಳನ್ನು ಜೋಡಿಸಲಾಗುತ್ತಿದೆ...'
                  : currentLanguage === 'te'
                  ? 'సందర్శన తయారీ దశలను సిద్ధం చేస్తున్నాము...'
                  : 'Organizing editable visit preparation steps...'
              }
            />
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {aiTasks.length > 0 && !loading && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-4 soft-bloom">
              <AiTrustHeader
                language={currentLanguage}
                label={
                  currentLanguage === 'kn'
                    ? 'ಸಂಪಾದಿಸಬಹುದಾದ AI ಪಟ್ಟಿ · ಐಚ್ಛಿಕ ನೆರವು'
                    : currentLanguage === 'te'
                    ? 'మార్చుకోదగిన AI జాబితా · ఐచ్ఛిక సహాయం'
                    : 'Editable AI Checklist · Optional Aid'
                }
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#493C39]">
                    {aiPlanTitle}
                  </h3>
                </div>
                <div className="min-w-[180px] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#493C39]">
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ಪಟ್ಟಿ ಪ್ರಗತಿ'
                        : currentLanguage === 'te'
                        ? 'జాబితా పురోగతి'
                        : 'Checklist Progress'}
                    </span>
                    <span className="tabular-nums">{aiDoneCount}/{aiTasks.length}</span>
                  </div>
                  <div className="w-full h-2 bg-[#BEA06D]/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4A6347] rounded-full transition-all duration-500"
                      style={{ width: `${aiProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <AiTrustFooter
                language={currentLanguage}
                verificationDisclaimer={aiAdvisory}
              />

              <div className="space-y-2.5">
                {aiTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                      task.completed
                        ? 'bg-[#A2B29B]/18 border-[#4A6347]/50'
                        : 'bg-white border-[#BEA06D]/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAiTask(task.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-1 cursor-pointer transition-colors ${
                        task.completed
                          ? 'bg-[#4A6347] border-[#4A6347] text-white check-pop'
                          : 'bg-white border-[#BEA06D]/60 text-transparent'
                      }`}
                      aria-label="Toggle task completion"
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={task.label}
                        onChange={(e) => updateAiTaskLabel(task.id, e.target.value)}
                        className={`w-full bg-transparent text-sm font-semibold focus:outline-none focus:underline ${
                          task.completed ? 'line-through text-[#493C39]/60' : 'text-[#493C39]'
                        }`}
                      />
                      <span className="text-[11px] text-[#8A6D3F] block">
                        {task.category} · {task.helper}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAiTask(task.id)}
                      className="compact-chip p-1.5 text-[#493C39]/50 hover:text-red-700 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {aiDoneCount === aiTasks.length && aiTasks.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#4A6347] check-pop">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {currentLanguage === 'kn'
                      ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಕಸ್ಟಮ್ ಸಿದ್ಧತಾ ಅಂಶಗಳನ್ನು ಗುರುತು ಹಾಕಲಾಗಿದೆ.'
                      : currentLanguage === 'te'
                      ? 'మీ కస్టమ్ తయారీ అంశాలన్నీ పూర్తిగా టిక్ చేయబడ్డాయి.'
                      : 'All custom preparation items checked off.'}
                  </span>
                </div>
              )}

              <form onSubmit={addCustomTask} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={
                    currentLanguage === 'kn'
                      ? 'ನಿಮ್ಮ ಸ್ವಂತ ಜ್ಞಾಪನೆ ಸೇರಿಸಿ...'
                      : currentLanguage === 'te'
                      ? 'మీ స్వంత రిమైండర్ జోడించండి...'
                      : 'Add your own personal reminder...'
                  }
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#BEA06D]/35 bg-white text-xs sm:text-sm text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
                <button
                  type="submit"
                  className="compact-chip py-2 px-4 rounded-xl bg-[#4A6347] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'kn' ? 'ಸೇರಿಸಿ' : currentLanguage === 'te' ? 'జోడించు' : 'Add'}</span>
                </button>
              </form>
            </div>
          )}
        </section>
      </Reveal>

      {/* Interactive 3-Stage Timeline */}
      <Reveal delay={160}>
        <CareJourneyTimeline
          language={currentLanguage}
          appointment={appointment}
          completedTasks={completedTasks}
          onToggleTask={onToggleTask}
          onPageChange={onPageChange}
          activeDisruption={activeDisruption}
          onClearDisruption={onClearDisruption}
        />
      </Reveal>

      {/* CORE Visit Summary Card */}
      <Reveal delay={200} variant="bloom">
        <VisitSummaryCard
          language={currentLanguage}
          appointment={appointment}
          completedTasks={completedTasks}
          aiTasks={aiTasks}
          onPageChange={onPageChange}
        />
      </Reveal>

      {/* Quick Next-Step Links */}
      <Reveal delay={220}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onPageChange('clarity')}
            className="p-5 bg-white border border-[#BEA06D]/40 hover:border-[#C88F98] rounded-2xl text-left flex items-center justify-between gap-4 cursor-pointer botanical-card-hover"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-[#BEA06D] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-base text-[#493C39] block">
                  {currentLanguage === 'kn' ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Explain It Simply)' : currentLanguage === 'te' ? 'సులభంగా వివరించండి' : 'Explain Instructions Simply'}
                </span>
                <span className="text-xs text-[#493C39]/75">
                  {currentLanguage === 'kn' ? 'ಉಪವಾಸ ಮತ್ತು ರಕ್ತ ಪರೀಕ್ಷೆ ನಿಯಮಗಳ ಅರ್ಥ' : currentLanguage === 'te' ? 'ఉపవాసం మరియు రక్త పరీక్ష నియమాల అర్థం' : 'Simplify hospital wording with CORE Clarity AI'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#8A6D3F] shrink-0" />
          </button>

          <button
            onClick={() => onPageChange('passport')}
            className="p-5 bg-white border border-[#BEA06D]/40 hover:border-[#C88F98] rounded-2xl text-left flex items-center justify-between gap-4 cursor-pointer botanical-card-hover"
          >
            <div className="flex items-start gap-3">
              <FileCheck2 className="w-6 h-6 text-[#4A6347] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-base text-[#493C39] block">
                  {currentLanguage === 'kn' ? 'ನನ್ನ ವಿಸಿಟ್ ಪಾಸ್‌ಪೋರ್ಟ್ ರಚಿಸಿ' : currentLanguage === 'te' ? 'నా విజిట్ పాస్‌పోర్ట్ చూడండి' : 'Generate My Visit Passport'}
                </span>
                <span className="text-xs text-[#493C39]/75">
                  {currentLanguage === 'kn' ? 'ಪ್ರಿಂಟ್ ಅಥವಾ PDF ರೂಪದಲ್ಲಿ ಉಳಿಸಿ' : currentLanguage === 'te' ? 'ప్రింట్ లేదా PDF గా సేవ్ చేయండి' : 'Print or save your hospital travel card as PDF'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#8A6D3F] shrink-0" />
          </button>
        </div>
      </Reveal>
    </div>
  );
};
