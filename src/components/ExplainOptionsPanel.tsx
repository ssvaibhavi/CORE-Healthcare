import React, { useEffect, useState } from 'react';
import { ExplanationComplexity, Language } from '../types';
import {
  AiClientError,
  askExplainOptionsAi,
  ExplainOptionsAiResponse,
  formatAiErrorMessage,
} from '../utils/aiClient';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import { AiConsentNotice } from './AiConsentNotice';
import { AiSkeletonLoader, AiTrustFooter, AiTrustHeader } from './AiTrustLayer';
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  HelpCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface ExplainOptionsPanelProps {
  language: Language;
  defaultSituation: string;
  scenarioContext?: string;
  initialComplexity?: ExplanationComplexity;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  onOptionsGenerated?: () => void;
}

export const ExplainOptionsPanel: React.FC<ExplainOptionsPanelProps> = ({
  language,
  defaultSituation,
  scenarioContext,
  initialComplexity = 'simple',
  aiConsentGranted,
  onAcceptAiConsent,
  onOptionsGenerated,
}) => {
  const [complexity, setComplexity] = useState<ExplanationComplexity>(initialComplexity);
  const [situationText, setSituationText] = useState<string>(defaultSituation);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainOptionsAiResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync default situation when user selects a different disruption scenario
  useEffect(() => {
    setSituationText(defaultSituation);
    setResult(null);
    setErrorMsg(null);
  }, [defaultSituation]);

  useEffect(() => {
    return speechService.subscribe((snap) => {
      setIsSpeaking(snap.status === 'speaking' || snap.status === 'loading');
    });
  }, []);

  const handleGenerateOptions = async (overrideComplexity?: ExplanationComplexity) => {
    const activeDepth = overrideComplexity || complexity;
    if (overrideComplexity) {
      setComplexity(overrideComplexity);
    }

    const cleaned = situationText.trim() || defaultSituation.trim();
    if (!cleaned) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await askExplainOptionsAi({
        situation: cleaned,
        scenarioContext,
        language,
        complexity: activeDepth,
        consentAccepted: aiConsentGranted,
      });
      setResult(response);
      onOptionsGenerated?.();
    } catch (err) {
      if (err instanceof AiClientError) {
        setErrorMsg(formatAiErrorMessage(err, language));
      } else {
        setErrorMsg(formatAiErrorMessage(err, language));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleListenSummary = () => {
    if (!result) return;
    if (isSpeaking) {
      speechService.stop();
      return;
    }

    const spokenLines = [
      result.calmSummary,
      ...result.options.map((opt, idx) => `${idx + 1}. ${opt.title}. ${opt.steps}`),
      result.whoToAsk,
      result.safetyReminder,
    ].filter(Boolean);

    const joined = spokenLines.join(' ');
    const effectiveLang = resolveSpeechLanguage(joined, result.language || language);
    speechService.speak(joined, effectiveLang);
  };

  const depthOptions: Array<{
    id: ExplanationComplexity;
    label: Record<Language, string>;
    hint: Record<Language, string>;
  }> = [
    {
      id: 'extra_simple',
      label: {
        en: 'Quick Calm Summary',
        kn: 'ತ್ವರಿತ ಸರಳ ಸಾರಾಂಶ',
        te: 'త్వరిత సులభ సారాంశం',
      },
      hint: {
        en: '2–3 short sentences',
        kn: '೨–೩ ಚಿಕ್ಕ ಸಾಲುಗಳು',
        te: '2–3 చిన్న వాక్యాలు',
      },
    },
    {
      id: 'simple',
      label: {
        en: 'Simple Step-by-Step',
        kn: 'ಸರಳ ಹಂತ-ಹಂತ',
        te: 'సులభ దశలవారీ',
      },
      hint: {
        en: 'Clear practical paths',
        kn: 'ಸ್ಪಷ್ಟ ಮುಂದಿನ ಕ್ರಮಗಳು',
        te: 'స్పష్టమైన తదుపరి దశలు',
      },
    },
    {
      id: 'detailed',
      label: {
        en: 'Detailed Guidance',
        kn: 'ವಿವರವಾದ ಮಾರ್ಗದರ್ಶನ',
        te: 'వివరమైన మార్గదర్శనం',
      },
      hint: {
        en: 'Includes desk questions',
        kn: 'ಕೌಂಟರ್ ಪ್ರಶ್ನೆಗಳ ಸಹಿತ',
        te: 'కౌంటర్ ప్రశ్నలతో సహా',
      },
    },
  ];

  return (
    <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#C88F98]" />
          <span>
            {language === 'kn'
              ? 'CORE ನನ್ನ ಆಯ್ಕೆಗಳನ್ನು ವಿವರಿಸಿ (Explain My Options)'
              : language === 'te'
              ? 'CORE నా ఎంపికలను వివరించండి (Explain My Options)'
              : 'CORE Explain My Options (Calm AI Support)'}
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#322826]">
          {language === 'kn'
            ? 'ಯೋಜನೆ ಬದಲಾದಾಗ ಮುಂದಿನ ಸುರಕ್ಷಿತ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಿ'
            : language === 'te'
            ? 'పరిస్థితి మారినప్పుడు సురక్షితమైన తదుపరి ఎంపికలు చూడండి'
            : 'See Calm, Practical Next Steps Without Guesswork'}
        </h3>
        <p className="text-xs sm:text-sm text-[#493C39]/80 leading-relaxed">
          {language === 'kn'
            ? 'ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ತಕ್ಕಂತೆ ತ್ವರಿತ ಸಾರಾಂಶ, ಹಂತ-ಹಂತ ಅಥವಾ ವಿವರವಾದ ಆಯ್ಕೆಗಳನ್ನು ಆರಿಸಿ. ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಗುರುತಿನ ಸಂಖ್ಯೆಗಳನ್ನು ನಮೂದಿಸಬೇಡಿ.'
            : language === 'te'
            ? 'మీ పరిస్థితికి అనుగుణంగా త్వరిత సారాంశం, దశలవారీ లేదా వివరమైన మార్గదర్శనం ఎంచుకోండి. దయచేసి వ్యక్తిగత ID నంబర్లు ఇవ్వకండి.'
            : 'Choose how detailed you want your explanation. Non-clinical navigation guidance only—avoid entering personal phone numbers or IDs.'}
        </p>
      </div>

      {/* Explanation Depth Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
          {language === 'kn'
            ? 'ವಿವರಣೆಯ ಆಳ (Explanation Depth)'
            : language === 'te'
            ? 'వివరణ లోతు (Explanation Depth)'
            : 'Choose Explanation Depth'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {depthOptions.map((opt) => {
            const active = complexity === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setComplexity(opt.id);
                  if (result && aiConsentGranted) {
                    handleGenerateOptions(opt.id);
                  }
                }}
                aria-pressed={active}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-[#4A6347] border-[#4A6347] text-white shadow-xs'
                    : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#493C39] hover:border-[#C88F98]'
                }`}
              >
                <span className="text-xs font-bold block">{opt.label[language]}</span>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    active ? 'text-white/85' : 'text-[#8A6D3F]'
                  }`}
                >
                  {opt.hint[language]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Situation Composer */}
      <div className="space-y-1.5">
        <label
          htmlFor="explain-options-input"
          className="text-xs font-bold text-[#493C39] block"
        >
          {language === 'kn'
            ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆಸ್ಪತ್ರೆ ಪರಿಸ್ಥಿತಿ (ಅಗತ್ಯವಿದ್ದರೆ ಬದಲಿಸಿ)'
            : language === 'te'
            ? 'ప్రస్తుత ఆసుపత్రి పరిస్థితి (అవసరమైతే మార్చండి)'
            : 'What changed right now? (Editable fictional situation)'}
        </label>
        <textarea
          id="explain-options-input"
          rows={3}
          value={situationText}
          onChange={(e) => setSituationText(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#BEA06D]/50 bg-[#FCF9F5] text-sm text-[#322826] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
        />
      </div>

      {/* Consent Notice & Action */}
      <AiConsentNotice
        language={language}
        consentGranted={aiConsentGranted}
        onAcceptConsent={onAcceptAiConsent}
        compact
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!aiConsentGranted || loading || !situationText.trim()}
          onClick={() => handleGenerateOptions()}
          className="py-2.5 px-5 rounded-full bg-[#C88F98] hover:bg-[#b27882] disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {loading
              ? language === 'kn'
                ? 'ಆಯ್ಕೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
                : language === 'te'
                ? 'ఎంపికలను సిద్ధం చేస్తున్నాము...'
                : 'Preparing Calm Options...'
              : language === 'kn'
              ? 'ನನ್ನ ಮುಂದಿನ ಆಯ್ಕೆಗಳನ್ನು ತೋರಿಸಿ'
              : language === 'te'
              ? 'నా తదుపరి ఎంపికలను చూపండి'
              : 'Explain My Options'}
          </span>
        </button>

        {result && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleGenerateOptions('extra_simple')}
            className="py-2 px-4 rounded-full bg-[#FCF9F5] hover:bg-[#BEA06D]/15 border border-[#BEA06D]/45 text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8A6D3F]" />
            <span>
              {language === 'kn'
                ? 'ಇನ್ನಷ್ಟು ಚಿಕ್ಕದಾಗಿ ಮಾಡಿ'
                : language === 'te'
                ? 'మరింత సులభంగా చూపండి'
                : 'Make Shorter'}
            </span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <AiSkeletonLoader
          label={
            language === 'kn'
              ? 'Google Gemini ಮೂಲಕ ಸುಲಭ ಆಯ್ಕೆಗಳನ್ನು ರೂಪಿಸಲಾಗುತ್ತಿದೆ...'
              : language === 'te'
              ? 'Google Gemini తో సులభమైన ఎంపికలను సిద్ధం చేస్తున్నాము...'
              : 'Organizing calm practical hospital options via Google Gemini...'
          }
        />
      )}

      {/* Honest Error Notice with Retry (Never Fake Fallback) */}
      {errorMsg && !loading && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#E6C1C4]/25 border border-[#C88F98] space-y-2.5 text-xs sm:text-sm text-[#322826]"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#9E4958] shrink-0 mt-0.5" />
            <p className="leading-relaxed break-words">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateOptions()}
            className="py-1.5 px-4 rounded-full bg-[#C88F98] hover:bg-[#b27882] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {language === 'kn'
                ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
                : language === 'te'
                ? 'మళ్ళీ ప్రయత్నించండి'
                : 'Retry'}
            </span>
          </button>
        </div>
      )}

      {/* AI Output */}
      {result && !loading && (
        <div className="p-5 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 space-y-4 soft-fade-up">
          <AiTrustHeader
            language={language}
            onListen={handleListenSummary}
            isSpeaking={isSpeaking}
            onAskClarification={() => handleGenerateOptions('extra_simple')}
            clarifyDisabled={loading}
          />

          <p className="text-sm sm:text-base font-semibold text-[#322826] leading-relaxed break-words">
            {result.calmSummary}
          </p>

          <div className="space-y-2.5">
            {result.options.map((opt, idx) => (
              <div
                key={`${opt.title}-${idx}`}
                className="p-3.5 rounded-2xl bg-white border border-[#BEA06D]/30 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#4A6347] text-white text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-[#322826] break-words">{opt.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#493C39]/90 leading-relaxed pl-8 break-words">
                  {opt.steps}
                </p>
                {opt.bestWhen && (
                  <p className="text-[11px] font-medium text-[#8A6D3F] pl-8 break-words">
                    {opt.bestWhen}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#A2B29B]/15 border border-[#4A6347]/35 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A6347]">
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'kn'
                    ? 'ಯಾರನ್ನು ಕೇಳಬೇಕು'
                    : language === 'te'
                    ? 'ఎవరిని అడగాలి'
                    : 'Who to Ask'}
                </span>
              </div>
              <p className="text-xs text-[#322826] leading-relaxed break-words">{result.whoToAsk}</p>
            </div>

            {result.questionsToAsk.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#BEA06D]/35 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A6D3F]">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {language === 'kn'
                      ? 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಕೇಳಲು ಸರಳ ಪ್ರಶ್ನೆಗಳು'
                      : language === 'te'
                      ? 'కౌంటర్‌లో అడగడానికి సులభ ప్రశ్నలు'
                      : 'Helpful Questions to Ask Staff'}
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-[#322826]">
                  {result.questionsToAsk.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-1.5 leading-snug break-words">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6347] shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <AiTrustFooter
            language={language}
            verificationDisclaimer={result.safetyReminder}
          />
        </div>
      )}
    </div>
  );
};
