import React, { useState } from 'react';
import { ComfortSettings, Language, PageView } from '../types';
import { LAB_PROFILES, AccessibilityLabProfile } from '../data/phase2Data';
import { CLARITY_EXAMPLES } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  Keyboard,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Volume2
} from 'lucide-react';

interface AccessibilityLabViewProps {
  currentLanguage: Language;
  currentComfort: ComfortSettings;
  onApplyComfort: (next: ComfortSettings) => void;
  onLanguageChange: (lang: Language) => void;
  onPageChange: (page: PageView) => void;
}

export const AccessibilityLabView: React.FC<AccessibilityLabViewProps> = ({
  currentLanguage,
  currentComfort,
  onApplyComfort,
  onLanguageChange,
  onPageChange,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<AccessibilityLabProfile>(LAB_PROFILES[0]);
  const [savedBackup, setSavedBackup] = useState<{
    comfort: ComfortSettings;
    lang: Language;
  } | null>(null);
  const [appliedToast, setAppliedToast] = useState(false);

  const previewLang = selectedProfile.recommendedLanguage || currentLanguage;
  const sampleInstruction = CLARITY_EXAMPLES[0].simple[previewLang];

  const handleApplyLive = () => {
    if (!savedBackup) {
      setSavedBackup({ comfort: currentComfort, lang: currentLanguage });
    }
    onApplyComfort(selectedProfile.comfortPatch);
    if (selectedProfile.recommendedLanguage) {
      onLanguageChange(selectedProfile.recommendedLanguage);
    }
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3500);
  };

  const handleRestoreBackup = () => {
    if (!savedBackup) return;
    onApplyComfort(savedBackup.comfort);
    onLanguageChange(savedBackup.lang);
    setSavedBackup(null);
  };

  const accessibilityChecklist = [
    {
      id: 'chk-lang',
      label: {
        kn: 'ತ್ರಿಭಾಷಾ ಸ್ಥಳೀಯ ಲಿಪಿ (ಕನ್ನಡ / ತೆಲುಗು / English)',
        te: 'త్రిభాషా స్థానిక లిపి (తెలుగు / కన్నడ / English)',
        en: 'Native Kannada, Telugu & English Typography',
      },
      active: true,
    },
    {
      id: 'chk-scale',
      label: {
        kn: 'ಪಠ್ಯ ಗಾತ್ರ ವಿಸ್ತರಣೆ (A / A+ / A++)',
        te: 'టెక్స్ట్ సైజ్ స్కేలింగ్ (A / A+ / A++)',
        en: 'Dynamic Text Scaling (A / A+ / A++)',
      },
      active: selectedProfile.comfortPatch.textSize !== 'normal',
    },
    {
      id: 'chk-contrast',
      label: {
        kn: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಬಣ್ಣಗಳು',
        te: 'హై కాంట్రాస్ట్ రంగులు',
        en: 'High-Contrast Visual Palette',
      },
      active: selectedProfile.comfortPatch.highContrast,
    },
    {
      id: 'chk-motion',
      label: {
        kn: 'ಕಡಿಮೆ ಚಲನೆ (Reduced Motion)',
        te: 'తక్కువ కదలికలు (Reduced Motion)',
        en: 'Reduced Motion & Zero Distraction',
      },
      active: selectedProfile.comfortPatch.reduceMotion,
    },
    {
      id: 'chk-targets',
      label: {
        kn: 'ದೊಡ್ಡ ಸ್ಪರ್ಶ ಬಟನ್‌ಗಳು (52px+)',
        te: 'పెద్ద టచ్ బటన్లు (52px+)',
        en: 'Large Interactive Touch Targets (52px+)',
      },
      active: selectedProfile.comfortPatch.largeButtons,
    },
    {
      id: 'chk-voice',
      label: {
        kn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಬೆಂಬಲ',
        te: 'వాయిస్ మార్గదర్శక మద్దతు',
        en: 'Spoken Read-Aloud Support',
      },
      active: selectedProfile.comfortPatch.readAloud,
    },
    {
      id: 'chk-nav',
      label: {
        kn: 'ಸರಳ ನ್ಯಾವಿಗೇಷನ್ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ಬಾರ್',
        te: 'సరళమైన మెనూ & గైడెడ్ బార్',
        en: 'Simplified Navigation & Guided Mode',
      },
      active: selectedProfile.comfortPatch.simplifiedNav || selectedProfile.comfortPatch.guidedMode,
    },
  ];

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

        {savedBackup && (
          <button
            type="button"
            onClick={handleRestoreBackup}
            className="compact-chip py-2 px-4 rounded-full bg-white border border-[#BEA06D] text-xs font-bold text-[#8F7242] hover:bg-[#FCF9F5] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'kn'
                ? 'ನನ್ನ ಮೂಲ ಸೆಟ್ಟಿಂಗ್‌ಗೆ ಮರಳಿ'
                : currentLanguage === 'te'
                ? 'నా మునుపటి సెట్టింగ్స్‌కు వెళ్ళండి'
                : 'Restore My Previous Settings'}
            </span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>CORE Accessibility Lab</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ಹೊಂದಾಣಿಕೆಯ ಇಂಟರ್‌ಫೇಸ್ ಪ್ರಯೋಗಾಲಯ'
            : currentLanguage === 'te'
            ? 'అడాప్టివ్ యాక్సెసిబిలిటీ ప్రయోగశాల'
            : 'Adaptive Interface Testing Lab'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಒಂದೇ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಯು ವಿವಿಧ ಬಳಕೆಯ ಅಗತ್ಯಗಳಿಗೆ ತಕ್ಕಂತೆ ಹೇಗೆ ಬದಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಹೋಲಿಸಿ ನೋಡಿ.'
            : currentLanguage === 'te'
            ? 'ఒకే ఆసుపత్రి సూచన వివిధ వినియోగ అవసరాలకు తగ్గట్టుగా ఎలా మారుతుందో పోల్చి చూడండి.'
            : 'Switch between configurable usability scenarios to compare how the exact same instruction adapts across visual, language, and interaction preferences.'}
        </p>
      </div>

      {/* Profile Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {LAB_PROFILES.map((profile) => {
          const active = selectedProfile.id === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelectedProfile(profile)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                active
                  ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-md'
                  : 'bg-white border-[#BEA06D]/30 text-[#3C3330] hover:border-[#BEA06D]'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold leading-snug">
                {profile.title[currentLanguage]}
              </span>
              <span className={`text-[11px] ${active ? 'text-white/90' : 'text-[#8F7242]'}`}>
                {profile.supportedNeeds[0][currentLanguage]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Live Preview vs Standard Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulated Adaptive Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 shadow-md space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider block">
                  {currentLanguage === 'kn'
                    ? 'ಸನ್ನಿವೇಶ ಪೂರ್ವವೀಕ್ಷಣೆ'
                    : currentLanguage === 'te'
                    ? 'సెట్టింగ్ ప్రివ్యూ'
                    : 'Configured Scenario Preview'}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#3C3330]">
                  {selectedProfile.title[currentLanguage]}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleApplyLive}
                className="py-2.5 px-5 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಇದನ್ನು ವೆಬ್‌ಸೈಟ್‌ಗೆ ಅನ್ವಯಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'వెబ్‌సైట్‌కు వర్తింపజేయండి'
                    : 'Apply Scenario Live'}
                </span>
              </button>
            </div>

            {appliedToast && (
              <div className="p-3 rounded-2xl bg-[#A2B29B]/20 border border-[#4A6347] text-xs font-semibold text-[#4A6347] flex items-center gap-2 soft-fade-up">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಸನ್ನಿವೇಶ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಲೈವ್ ಆಗಿ ಅನ್ವಯಿಸಲಾಗಿದೆ!'
                    : currentLanguage === 'te'
                    ? 'ఈ ప్రొఫైల్ లైవ్‌లో వర్తింపజేయబడింది!'
                    : 'Profile applied live across CORE! Click "Restore My Previous Settings" above anytime.'}
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#3C3330]/80">
              {selectedProfile.scenarioNote[currentLanguage]}
            </p>

            {/* Preview Box Reflecting Actual Adaptive Settings */}
            <div
              className={`rounded-2xl p-5 sm:p-6 border-2 transition-all space-y-4 ${
                selectedProfile.comfortPatch.highContrast
                  ? 'bg-black text-white border-yellow-400'
                  : 'bg-[#FCF9F5] text-[#3C3330] border-[#BEA06D]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    selectedProfile.comfortPatch.highContrast ? 'text-yellow-300' : 'text-[#8F7242]'
                  }`}
                >
                  {previewLang === 'kn'
                    ? 'ಆಸ್ಪತ್ರೆ ಸೂಚನೆ ಪೂರ್ವವೀಕ್ಷಣೆ'
                    : previewLang === 'te'
                    ? 'ఆసుపత్రి సూచన ప్రివ్యూ'
                    : 'Hospital Instruction Card Preview'}
                </span>
                {selectedProfile.comfortPatch.simplifiedNav && (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedProfile.comfortPatch.highContrast
                        ? 'bg-yellow-300 text-black'
                        : 'bg-[#A2B29B]/30 text-[#4A6347]'
                    }`}
                  >
                    {previewLang === 'kn' ? 'ಸರಳ ಮೆನು' : previewLang === 'te' ? 'సరళ మెనూ' : '4-Link Nav'}
                  </span>
                )}
              </div>

              <p
                className={`font-semibold leading-relaxed ${
                  selectedProfile.comfortPatch.textSize === 'xlarge'
                    ? 'text-xl sm:text-2xl'
                    : selectedProfile.comfortPatch.textSize === 'large'
                    ? 'text-lg sm:text-xl'
                    : 'text-sm sm:text-base'
                }`}
              >
                {sampleInstruction}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => speechService.speak(sampleInstruction, previewLang)}
                  className={`rounded-full font-bold inline-flex items-center gap-2 cursor-pointer transition-all focus:outline-none focus:ring-4 ${
                    selectedProfile.comfortPatch.largeButtons ? 'py-4 px-7 text-base' : 'py-2.5 px-5 text-xs'
                  } ${
                    selectedProfile.comfortPatch.highContrast
                      ? 'bg-yellow-400 text-black focus:ring-yellow-200'
                      : 'bg-[#BEA06D] text-white focus:ring-[#BEA06D]/40'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {previewLang === 'kn'
                      ? 'ವಿವರಣೆ ಆಲಿಸಿ'
                      : previewLang === 'te'
                      ? 'వివరణ వినండి'
                      : 'Listen Aloud'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/25 text-xs text-[#3C3330]/75 flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-[#8F7242] shrink-0 mt-0.5" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಪ್ರತಿಯೊಬ್ಬ ವ್ಯಕ್ತಿಯ ಅಗತ್ಯಗಳು ಭಿನ್ನವಾಗಿರುತ್ತವೆ; ಇವು ಕೇವಲ ಪರೀಕ್ಷಾ ಸನ್ನಿವೇಶಗಳೇ ಹೊರತು ಗುಂಪಿನ ಮೇಲಿನ ಊಹೆಗಳಲ್ಲ.'
                  : currentLanguage === 'te'
                  ? 'ప్రతి వ్యక్తి అవసరాలు భిన్నంగా ఉంటాయి; ఇవి కేవలం పరీక్షా నమూనాలు మాత్రమే.'
                  : 'Design Ethics Note: These are configurable usability test scenarios—never assumptions that every person in a group shares the same preferences.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Feature Support Matrix & Keyboard Guide */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border-2 border-[#BEA06D]/35 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#3C3330]">
              {currentLanguage === 'kn'
                ? 'ಸಕ್ರಿಯ ಪ್ರವೇಶಾವಕಾಶ ವೈಶಿಷ್ಟ್ಯಗಳು'
                : currentLanguage === 'te'
                ? 'యాక్సెసిబిలిటీ ఫీచర్ల జాబితా'
                : 'Accessibility Feature Matrix'}
            </h3>

            <div className="space-y-2.5">
              {accessibilityChecklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                    item.active
                      ? 'bg-[#A2B29B]/15 border-[#4A6347]/50 font-semibold text-[#3C3330]'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/20 text-[#3C3330]/60'
                  }`}
                >
                  <span>{item.label[currentLanguage]}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      item.active ? 'bg-[#4A6347] text-white' : 'bg-white border border-[#BEA06D]/30 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#BEA06D]/35 rounded-3xl p-5 shadow-xs space-y-2.5 text-xs text-[#3C3330]/85">
            <div className="flex items-center gap-2 font-bold text-[#8F7242] uppercase tracking-wider">
              <Keyboard className="w-4 h-4" />
              <span>
                {currentLanguage === 'kn'
                  ? 'ಕೀಬೋರ್ಡ್ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು'
                  : currentLanguage === 'te'
                  ? 'కీబోర్డ్ షార్ట్‌కట్‌లు'
                  : 'Keyboard Accessibility'}
              </span>
            </div>
            <p>
              {currentLanguage === 'kn'
                ? 'ಬಟನ್‌ಗಳ ನಡುವೆ ಚಲಿಸಲು Tab, ಆಯ್ಕೆಮಾಡಲು Enter/Space ಮತ್ತು ಯಾವುದೇ ಪ್ಯಾನಲ್‌ನಿಂದ ಹೊರಬರಲು Esc ಒತ್ತಿ.'
                : currentLanguage === 'te'
                ? 'బటన్ల మధ్య మారడానికి Tab, ఎంచుకోవడానికి Enter/Space మరియు మూసివేయడానికి Esc నొక్కండి.'
                : 'Navigate interactively with Tab / Shift+Tab, activate controls with Enter or Space, and close Comfort Mode or Companion drawers cleanly with Esc.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
