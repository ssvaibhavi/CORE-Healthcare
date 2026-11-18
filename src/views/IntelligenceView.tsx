import React, { useState } from 'react';
import {
  ComfortSettings,
  IntelligenceProfile,
  Language,
  PageView
} from '../types';
import { buildPersonalizedPathway } from '../utils/intelligenceEngine';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Edit3
} from 'lucide-react';

interface IntelligenceViewProps {
  currentLanguage: Language;
  profile: IntelligenceProfile;
  onUpdateProfile: (next: IntelligenceProfile) => void;
  onLanguageChange: (lang: Language) => void;
  onApplyComfortPatch: (patch: Partial<ComfortSettings>) => void;
  onPageChange: (page: PageView) => void;
  onResetProfile: () => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  currentLanguage,
  profile,
  onUpdateProfile,
  onLanguageChange,
  onApplyComfortPatch,
  onPageChange,
  onResetProfile,
}) => {
  const [editingOnboarding, setEditingOnboarding] = useState<boolean>(!profile.completedOnboarding);
  const [openWhyIds, setOpenWhyIds] = useState<Record<string, boolean>>({});
  const [comfortAppliedToast, setComfortAppliedToast] = useState<boolean>(false);

  const pathway = buildPersonalizedPathway(profile);

  const toggleWhy = (id: string) => {
    setOpenWhyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      completedOnboarding: true,
    });
    if (profile.preferredLanguage !== currentLanguage) {
      onLanguageChange(profile.preferredLanguage);
    }
    setEditingOnboarding(false);
  };

  const handleApplyRecommendedComfort = () => {
    onApplyComfortPatch(pathway.recommendedComfort);
    setComfortAppliedToast(true);
    setTimeout(() => setComfortAppliedToast(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onResetProfile();
              setEditingOnboarding(true);
            }}
            className="compact-chip px-3 py-1.5 rounded-full border border-[#BEA06D]/40 bg-white text-xs font-semibold text-[#8F7242] hover:bg-[#FCF9F5] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : currentLanguage === 'te' ? 'రీసెట్ చేయండి' : 'Reset Preferences'}
            </span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>CORE Intelligence</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ವೈಯಕ್ತೀಕರಿಸಿದ ರೋಗಿ ಮಾರ್ಗದರ್ಶಿ ಎಂಜಿನ್'
            : currentLanguage === 'te'
            ? 'వ్యక్తిగతీకరించిన రోగి మార్గదర్శక ఇంజిన్'
            : 'Adaptive Patient Navigation Engine'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ನಿಮ್ಮ ಭಾಷೆ ಮತ್ತು ಅನುಕೂಲಕ್ಕೆ ತಕ್ಕಂತೆ ಆಸ್ಪತ್ರೆ ಪಯಣದ ಹಂತಗಳನ್ನು ಸುಲಭವಾಗಿ ಹೊಂದಿಸಿಕೊಳ್ಳಿ.'
            : currentLanguage === 'te'
            ? 'మీ భాష మరియు సౌకర్యానికి అనుగుణంగా ఆసుపత్రి ప్రయాణ దశలను సులభంగా మార్చుకోండి.'
            : 'Answer a few optional navigation questions so CORE adapts step detail, reading comfort, and pathway order to your needs.'}
        </p>
      </div>

      {/* Transparency & AI Personalization Rule Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#A2B29B]/15 border border-[#4A6347]/40 flex items-start gap-3 text-xs sm:text-sm text-[#3C3330]">
        <ShieldCheck className="w-5 h-5 text-[#4A6347] shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p>{pathway.explanation[currentLanguage]}</p>
          <p className="text-xs text-[#493C39]/80">
            {currentLanguage === 'kn'
              ? 'CORE AI ವೈಯಕ್ತೀಕರಣ: ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆ, ಪಠ್ಯ ಗಾತ್ರ, ವಿವರಣೆಯ ಸರಳತೆ (Comfort Mode ನಲ್ಲಿ) ಮತ್ತು ಧ್ವನಿ ಬೆಂಬಲವು AI ಉತ್ತರಗಳನ್ನು ರೂಪಿಸುತ್ತವೆ — ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲಿಂಗ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.'
              : currentLanguage === 'te'
              ? 'CORE AI వ్యక్తిగతీకరణ: మీరు ఎంచుకున్న భాష, టెక్స్ట్ సైజు, వివరణ శైలి (Comfort Mode లో) మరియు వాయిస్ సహాయం మాత్రమే AI సమాధానాలను మార్చుతాయి — ఎలాంటి వైద్య ప్రొఫైలింగ్ చేయబడదు.'
              : 'AI Personalization without Profiling: Your Comfort Mode preferences (preferred language, text size, AI explanation style, guided navigation, and read-aloud) shape how CORE AI explains information. CORE never infers medical conditions or builds hidden health profiles, and you can reset anytime.'}
          </p>
        </div>
      </div>

      {/* Onboarding Questionnaire (Optional & Editable Anytime) */}
      {editingOnboarding ? (
        <form
          onSubmit={handleCompleteOnboarding}
          className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 soft-fade-up"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
                {currentLanguage === 'kn'
                  ? 'ಐಚ್ಛಿಕ ಸ್ವಾಗತ ಪ್ರಶ್ನಾವಳಿ'
                  : currentLanguage === 'te'
                  ? 'ఐచ్ఛిక స్వాగత ప్రశ్నావళి'
                  : 'Optional Navigation Onboarding'}
              </span>
              <h2 className="font-display text-2xl font-bold text-[#3C3330]">
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಅನುಕೂಲಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ'
                  : currentLanguage === 'te'
                  ? 'మీ సౌకర్యాలను ఎంచుకోండి'
                  : 'Tailor Your CORE Experience'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Q1: Comfortable Language */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೧. ನಿಮಗೆ ಯಾವ ಭಾಷೆ ಹೆಚ್ಚು ಅನುಕೂಲವಾಗಿದೆ?'
                  : currentLanguage === 'te'
                  ? '1. మీకు ఏ భాషలో చూడటం సౌకర్యంగా ఉంటుంది?'
                  : '1. What language are you most comfortable using?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['kn', 'te', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, preferredLanguage: lang })}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      profile.preferredLanguage === lang
                        ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'te' ? 'తెలుగు' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Visiting for self or helping someone */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೨. ನಿಮಗಾಗಿ ನೋಡುತ್ತಿದ್ದೀರಾ ಅಥವಾ ಬೇರೆಯವರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದೀರಾ?'
                  : currentLanguage === 'te'
                  ? '2. మీ కోసమా లేక మరొకరికి సహాయం చేస్తున్నారా?'
                  : '2. Are you visiting for yourself or helping someone else?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'self' as const,
                    label: { kn: 'ನನಗಾಗಿ (Self)', te: 'నా కోసం (Self)', en: 'For Myself' },
                  },
                  {
                    id: 'caregiver' as const,
                    label: { kn: 'ಬೇರೆಯವರಿಗೆ ಸಹಾಯ', te: 'ఇతరులకు సహాయం', en: 'Helping Someone Else' },
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, visitorRole: opt.id })}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      profile.visitorRole === opt.id
                        ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: First hospital visit */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೩. ಇದು ನಿಮ್ಮ ಮೊದಲ ಆಸ್ಪತ್ರೆ ಭೇಟಿಯೇ?'
                  : currentLanguage === 'te'
                  ? '3. ఇది మీ మొదటి ఆసుపత్రి సందర్శనా?'
                  : '3. Is this your first hospital visit?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    val: true,
                    label: { kn: 'ಹೌದು, ಮೊದಲ ಭೇಟಿ', te: 'అవును, మొదటిసారి', en: 'Yes, First Visit' },
                  },
                  {
                    val: false,
                    label: { kn: 'ಇಲ್ಲ, ಹಿಂದೆ ಬಂದಿದ್ದೇನೆ', te: 'కాదు, ముందే వచ్చాను', en: 'No, Visited Before' },
                  },
                ].map((opt) => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, firstHospitalVisit: opt.val })}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      profile.firstHospitalVisit === opt.val
                        ? 'bg-[#4A6347] border-[#4A6347] text-white shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Step-by-step assistance */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೪. ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ ಬಯಸುತ್ತೀರಾ?'
                  : currentLanguage === 'te'
                  ? '4. దశల వారీ సహాయం కావాలా?'
                  : '4. Would you prefer step-by-step assistance?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    val: true,
                    label: { kn: 'ಹೌದು, ಹಂತ-ಹಂತವಾಗಿ', te: 'అవును, దశల వారీగా', en: 'Yes, Step-by-Step' },
                  },
                  {
                    val: false,
                    label: { kn: 'ಸರಳ ತ್ವರಿತ ನೋಟ', te: 'త్వరిత వీక్షణ చాలు', en: 'Streamlined View' },
                  },
                ].map((opt) => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, preferStepByStep: opt.val })}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      profile.preferStepByStep === opt.val
                        ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5: Larger text or voice guidance */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೫. ದೊಡ್ಡ ಅಕ್ಷರ ಅಥವಾ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಬೇಕೇ?'
                  : currentLanguage === 'te'
                  ? '5. పెద్ద అక్షరాలు లేదా వాయిస్ సహాయం కావాలా?'
                  : '5. Do you need larger text or voice guidance?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'both' as const, label: { kn: 'ದೊಡ್ಡ ಅಕ್ಷರ + ಧ್ವನಿ', te: 'పెద్ద అక్షరాలు + వాయిస్', en: 'Large Text & Voice' } },
                  { id: 'voice_first' as const, label: { kn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ', te: 'వాయిస్ సహాయం', en: 'Voice Guidance' } },
                  { id: 'large_text' as const, label: { kn: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು', te: 'పెద్ద అక్షరాలు', en: 'Larger Text' } },
                  { id: 'standard' as const, label: { kn: 'ಸಾಮಾನ್ಯ ಪ್ರದರ್ಶನ', te: 'సాధారణ సెట్టింగ్', en: 'Standard Display' } },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, supportNeeds: opt.id })}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      profile.supportNeeds === opt.id
                        ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-xs'
                        : 'bg-[#FCF9F5] border-[#BEA06D]/30 text-[#3C3330]'
                    }`}
                  >
                    {opt.label[currentLanguage]}
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: Assistance goal */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3C3330] block">
                {currentLanguage === 'kn'
                  ? '೬. ನಿಮಗೆ ಯಾವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನೆರವು ಬೇಕು?'
                  : currentLanguage === 'te'
                  ? '6. మీకు ఏ అపాయింట్‌మెంట్ సహాయం కావాలి?'
                  : '6. What kind of appointment assistance do you need?'}
              </label>
              <select
                value={profile.assistanceGoal}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    assistanceGoal: e.target.value as IntelligenceProfile['assistanceGoal'],
                  })
                }
                className="w-full p-3 rounded-xl border-2 border-[#BEA06D]/40 bg-[#FCF9F5] text-sm font-semibold text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
              >
                <option value="full_support">
                  {currentLanguage === 'kn'
                    ? 'ಸಂಪೂರ್ಣ ಭೇಟಿ ಸಿದ್ಧತೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ'
                    : currentLanguage === 'te'
                    ? 'పూర్తి సందర్శన తయారీ & మార్గదర్శి'
                    : 'Full Visit Preparation & Guidance'}
                </option>
                <option value="check_details">
                  {currentLanguage === 'kn'
                    ? 'ದಿನಾಂಕ ಮತ್ತು ಕೊಠಡಿ ವಿವರ ಪರಿಶೀಲನೆ'
                    : currentLanguage === 'te'
                    ? 'తేదీ మరియు గది వివరాలు చూడటం'
                    : 'Check Appointment Date & Room Details'}
                </option>
                <option value="understand_terms">
                  {currentLanguage === 'kn'
                    ? 'ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು'
                    : currentLanguage === 'te'
                    ? 'ఆసుపత్రి సూచనలను సులభంగా అర్థం చేసుకోవడం'
                    : 'Understand Hospital Terms & Instructions'}
                </option>
                <option value="prepare_visit">
                  {currentLanguage === 'kn'
                    ? 'ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ರಯಾಣ ಪಟ್ಟಿ'
                    : currentLanguage === 'te'
                    ? 'పత్రాలు మరియు ప్రయాణ జాబితా'
                    : 'Organize Documents & Travel Checklist'}
                </option>
                <option value="reschedule">
                  {currentLanguage === 'kn'
                    ? 'ದಿನಾಂಕ / ಸಮಯ ಬದಲಾವಣೆ'
                    : currentLanguage === 'te'
                    ? 'తేదీ / సమయం మార్పు'
                    : 'Reschedule My Appointment Slot'}
                </option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#BEA06D]/20 flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              className="py-3.5 px-8 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold text-sm sm:text-base shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ನನ್ನ ವೈಯಕ್ತಿಕ ಆರೈಕೆ ಪಥವನ್ನು ರಚಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'నా వ్యక్తిగత ఆరోగ్య పథాన్ని చూడండి'
                  : 'Generate My Personalized Care Pathway'}
              </span>
            </button>
          </div>
        </form>
      ) : (
        /* Personalized Care Pathway Display */
        <div className="space-y-6 soft-fade-up">
          {/* Pathway Mode Banner */}
          <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
                {currentLanguage === 'kn'
                  ? 'ವೈಯಕ್ತೀಕರಿಸಿದ ಆರೈಕೆ ಪಥ'
                  : currentLanguage === 'te'
                  ? 'వ్యక్తిగతీకరించిన మార్గదర్శక పథం'
                  : 'Personalized Care Pathway'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
                {pathway.modeLabel[currentLanguage]}
              </h2>
              <p className="text-xs text-[#3C3330]/75">
                {profile.visitorRole === 'caregiver'
                  ? currentLanguage === 'kn'
                    ? 'ಆರೈಕೆದಾರರ ಸಹಾಯ ದೃಷ್ಟಿಕೋನ ಸಕ್ರಿಯವಾಗಿದೆ'
                    : currentLanguage === 'te'
                    ? 'సంరక్షకుల సహాయ మోడ్ సిద్ధంగా ఉంది'
                    : 'Caregiver accompaniment mode included'
                  : currentLanguage === 'kn'
                  ? 'ಸ್ವತಂತ್ರ ರೋಗಿ ಮಾರ್ಗದರ್ಶನ'
                  : currentLanguage === 'te'
                  ? 'స్వతంత్ర రోగి మార్గదర్శనం'
                  : 'Independent patient navigation'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleApplyRecommendedComfort}
                className="py-2.5 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಸೂಚಿಸಿದ ಕಂಫರ್ಟ್ ಮೋಡ್ ಅನ್ವಯಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'సూచించిన కంఫర్ట్ మోడ్ వర్తింపజేయండి'
                    : 'Apply Suggested Comfort Settings'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEditingOnboarding(true)}
                className="py-2.5 px-4 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/40 text-xs font-semibold text-[#8F7242] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಆದ್ಯತೆಗಳನ್ನು ಬದಲಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'ప్రాధాన్యతలు మార్చండి'
                    : 'Modify Preferences'}
                </span>
              </button>
            </div>
          </div>

          {comfortAppliedToast && (
            <div className="p-3.5 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347] text-xs sm:text-sm font-semibold text-[#4A6347] flex items-center gap-2 soft-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಆಯ್ಕೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಪಠ್ಯ ಗಾತ್ರ, ಧ್ವನಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ.'
                  : currentLanguage === 'te'
                  ? 'మీ ఎంపికలకు అనుగుణంగా టెక్స్ట్ సైజు, వాయిస్ మరియు గైడెడ్ మోడ్ మార్చబడ్డాయి.'
                  : 'Applied suggested text size, read-aloud, and guided navigation settings to CORE Comfort Mode.'}
              </span>
            </div>
          )}

          {/* Visual Connected Care Pathway Cards */}
          <div className="space-y-4">
            {pathway.steps.map((step, index) => {
              const showWhy = !!openWhyIds[step.id];
              return (
                <div
                  key={step.id}
                  className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-5 sm:p-6 shadow-xs botanical-card-hover space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#FCF9F5] border-2 border-[#BEA06D] flex items-center justify-center font-display text-xl font-bold text-[#8F7242] shrink-0">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/30 text-[#8F7242]">
                            {step.detailLevel === 'detailed'
                              ? currentLanguage === 'kn'
                                ? 'ವಿವರವಾದ ಮಾರ್ಗದರ್ಶಿ'
                                : currentLanguage === 'te'
                                ? 'వివరమైన దశ'
                                : 'Detailed Step'
                              : currentLanguage === 'kn'
                              ? 'ತ್ವರಿತ ಹಂತ'
                              : currentLanguage === 'te'
                              ? 'త్వరిత దశ'
                              : 'Streamlined Step'}
                          </span>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3C3330]">
                          {step.title[currentLanguage]}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#3C3330]/80 leading-relaxed">
                          {step.description[currentLanguage]}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPageChange(step.targetPage)}
                        className="py-2.5 px-5 rounded-full bg-[#BEA06D] hover:bg-[#8F7242] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>
                          {currentLanguage === 'kn' ? 'ಈ ಹಂತ ತೆರೆಯಿರಿ' : currentLanguage === 'te' ? 'ఈ దశ తెరవండి' : 'Open Step'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWhy(step.id)}
                        aria-expanded={showWhy}
                        className="compact-chip text-xs font-semibold text-[#8F7242] hover:text-[#3C3330] inline-flex items-center gap-1 underline cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>
                          {currentLanguage === 'kn'
                            ? 'ನನಗೆ ಇದು ಏಕೆ ಕಾಣುತ್ತಿದೆ?'
                            : currentLanguage === 'te'
                            ? 'నాకు ఇది ఎందుకు కనిపిస్తోంది?'
                            : 'Why am I seeing this?'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {showWhy && (
                    <div className="p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 text-xs text-[#3C3330]/85 soft-fade-up">
                      <strong className="text-[#8F7242]">
                        {currentLanguage === 'kn' ? 'ಪಾರದರ್ಶಕ ನಿಯಮ: ' : currentLanguage === 'te' ? 'పారదర్శక నియమం: ' : 'Rule Explanation: '}
                      </strong>
                      {step.whySeeingThis[currentLanguage]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
