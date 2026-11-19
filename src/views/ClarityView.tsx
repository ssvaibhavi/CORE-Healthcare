import React, { useState, useMemo, useEffect } from 'react';
import { AiConsentNotice } from '../components/AiConsentNotice';
import { AiTrustHeader, AiTrustFooter, AiSkeletonLoader } from '../components/AiTrustLayer';
import { Reveal, WordReveal } from '../components/Reveal';
import { ExplanationComplexity, Language, PageView } from '../types';
import { CLARITY_EXAMPLES, ClarityItem } from '../data/enhancementsData';
import { simplifyWithClarityAi, ClarityAiResponse, AiClientError } from '../utils/aiClient';
import {
  getAudioLanguageBadge,
  resolveSpeechLanguage,
  speechService,
  SpeechPlaybackSnapshot,
  SpeechRate,
} from '../utils/speech';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquareQuote
} from 'lucide-react';

interface ClarityViewProps {
  currentLanguage: Language;
  complexity?: ExplanationComplexity;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  onPageChange: (page: PageView) => void;
}

const SAMPLE_AI_INPUTS = [
  'Report at Radiology Block B 30 mins prior with prior reports and recent serum creatinine values; keep hydration normal unless instructed otherwise.',
  'Collect your OPD token at Counter 4, confirm fasting status at the reception desk, and wait in Zone A for your turn.',
  'Bring a valid photo ID, referral slip, and an accompanying caregiver if you need assistance returning home after the scan.',
];

export const ClarityView: React.FC<ClarityViewProps> = ({
  currentLanguage,
  complexity = 'simple',
  aiConsentGranted,
  onAcceptAiConsent,
  onPageChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<ClarityItem>(CLARITY_EXAMPLES[0]);
  const [level, setLevel] = useState<'simple' | 'extraSimple'>(
    complexity === 'extra_simple' ? 'extraSimple' : 'simple'
  );
  const [smsQuery, setSmsQuery] = useState('');
  const [speechRate, setSpeechRate] = useState<SpeechRate>(0.9);
  const [playbackSnap, setPlaybackSnap] = useState<SpeechPlaybackSnapshot>(() =>
    speechService.getPlaybackSnapshot()
  );
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = speechService.subscribe((snap) => {
      setPlaybackSnap(snap);
      if (snap.lastError) {
        setAudioNotice(snap.lastError.message);
      }
    });
    const unsubVoices = speechService.subscribeVoices(() => {
      // keep reactive to async voice availability changes
    });
    return () => {
      unsub();
      unsubVoices();
      speechService.stop();
    };
  }, []);

  // Live Gemini CORE Clarity AI state
  const [customInput, setCustomInput] = useState('');
  const [aiResult, setAiResult] = useState<ClarityAiResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Curated Reference Priority check against verified offline guidance
  const matchedCuratedRef = useMemo(() => {
    const q = customInput.toLowerCase().trim();
    if (q.length < 3) return null;
    if (q.includes('npo') || q.includes('fast')) return CLARITY_EXAMPLES.find((i) => i.id === 'npo-4hrs') || null;
    if (q.includes('creatinine') || q.includes('egfr')) return CLARITY_EXAMPLES.find((i) => i.id === 'creatinine') || null;
    if (q.includes('block b') || q.includes('30 min')) return CLARITY_EXAMPLES.find((i) => i.id === 'arrive-early') || null;
    if (q.includes('metal') || q.includes('jewel')) return CLARITY_EXAMPLES.find((i) => i.id === 'remove-metal') || null;
    if (q.includes('bladder') || q.includes('ultrasound')) return CLARITY_EXAMPLES.find((i) => i.id === 'ultrasound-bladder') || null;
    return null;
  }, [customInput]);

  const activeText =
    level === 'simple'
      ? selectedItem.simple[currentLanguage]
      : selectedItem.extraSimple[currentLanguage];

  const handleListen = (textToSpeak: string, itemId: string) => {
    const isSameActive = playbackSnap.activeId === itemId && playbackSnap.status !== 'idle';
    if (isSameActive) {
      speechService.stop();
      return;
    }
    setAudioNotice(null);
    speechService.clearError();
    const audioLang = resolveSpeechLanguage(textToSpeak, currentLanguage);
    speechService.speak(
      textToSpeak,
      audioLang,
      {
        onError: (_reason, info) => {
          setAudioNotice(info?.message || null);
        },
      },
      {
        rate: speechRate,
        itemId,
        cloudConsentGranted: aiConsentGranted,
      }
    );
  };

  const handleRateChange = (nextRate: SpeechRate) => {
    setSpeechRate(nextRate);
    speechService.setRate(nextRate);
  };

  const handleMatchPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    const q = smsQuery.toLowerCase().trim();
    if (!q) return;

    const matched = CLARITY_EXAMPLES.find((item) => {
      const hay = `${item.originalPhrase} ${item.category.en} ${item.simple.en}`.toLowerCase();
      if (q.includes('fast') || q.includes('eat') || q.includes('npo') || q.includes('food')) {
        return item.id === 'npo-4hrs';
      }
      if (q.includes('creat') || q.includes('blood') || q.includes('lab') || q.includes('egfr')) {
        return item.id === 'creatinine';
      }
      if (q.includes('block') || q.includes('room') || q.includes('30') || q.includes('early')) {
        return item.id === 'arrive-early';
      }
      if (q.includes('metal') || q.includes('watch') || q.includes('jewel')) {
        return item.id === 'remove-metal';
      }
      if (q.includes('ultrasound') || q.includes('bladder') || q.includes('urine')) {
        return item.id === 'ultrasound-bladder';
      }
      if (q.includes('water') || q.includes('hydrat') || q.includes('after')) {
        return item.id === 'post-hydration';
      }
      return hay.includes(q);
    });

    if (matched) {
      setSelectedItem(matched);
      speechService.stop();
    }
  };

  const runClarityRequest = async (overrideComplexity?: ExplanationComplexity) => {
    const cleaned = customInput.trim();
    if (!cleaned || !aiConsentGranted || aiLoading) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const data = await simplifyWithClarityAi({
        instructionText: cleaned,
        language: currentLanguage,
        complexity: overrideComplexity || complexity,
        consentAccepted: true,
      });
      setAiResult(data);
    } catch (err) {
      setAiError(
        err instanceof AiClientError
          ? err.message
          : 'Unable to reach Gemini Clarity AI right now.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSimplifyWithAi = async (e: React.FormEvent) => {
    e.preventDefault();
    await runClarityRequest();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 soft-fade-up">
      {/* Top Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            speechService.stop();
            onPageChange('home');
          }}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8A6D3F] hover:text-[#493C39] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#C88F98] font-medium">
          {currentLanguage === 'kn'
            ? 'ಪರಿಶೀಲಿಸಿದ ಉದಾಹರಣೆಗಳು + CORE Clarity AI'
            : currentLanguage === 'te'
            ? 'నమూనా ఉదాహరణలు + CORE Clarity AI'
            : 'Curated Examples · Live Gemini AI Simplifier'}
        </span>
      </div>

      {/* Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#C88F98] uppercase tracking-widest block">
            CORE Clarity AI
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#493C39] text-balance">
            <WordReveal
              text={
                currentLanguage === 'kn'
                  ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Explain It Simply)'
                  : currentLanguage === 'te'
                  ? 'సులభంగా వివరించండి (Explain It Simply)'
                  : 'Explain It Simply'
              }
            />
          </h1>
          <p className="text-sm sm:text-base text-[#493C39]/80">
            {currentLanguage === 'kn'
              ? 'ಕಷ್ಟಕರ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಉದಾಹರಣೆ ಆಯ್ಕೆಮಾಡಿ — ಕನ್ನಡ, ತೆಲುಗು ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟ ಅರ್ಥ ಪಡೆಯಿರಿ.'
              : currentLanguage === 'te'
              ? 'కష్టమైన ఆసుపత్రి సూచనలను ఇవ్వండి లేదా నమూనా ఎంచుకోండి — తెలుగు, కన్నడ లేదా ఇంగ్లీషులో సులభ అర్థం పొందండి.'
              : 'Enter non-clinical hospital instructions for live AI plain-language clarification, or explore curated examples below.'}
          </p>
        </div>
      </Reveal>

      {/* LIVE GEMINI CLARITY AI SECTION */}
      <Reveal delay={100} variant="bloom">
        <section className="bg-white border border-[#BEA06D]/50 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C88F98] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ನೇರ Gemini ಭಾಷಾ ಸರಳೀಕರಣ'
                    : currentLanguage === 'te'
                    ? 'లైవ్ Gemini భాషా సరళీకరణ'
                    : 'Live Gemini Language Simplification'}
                </span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39]">
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಸ್ವಂತ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಯನ್ನು ಸರಳಗೊಳಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'మీ ఆసుపత్రి సూచనను సులభంగా మార్చుకోండి'
                  : 'Simplify Any Non-Clinical Hospital Instruction'}
              </h2>
            </div>
            <span className="text-xs font-medium text-[#8A6D3F] bg-[#FCF9F5] border border-[#BEA06D]/30 px-3 py-1 rounded-full">
              {currentLanguage === 'kn' ? 'ಭಾಷೆ: ಕನ್ನಡ' : currentLanguage === 'te' ? 'భాష: తెలుగు' : 'Output: English'} · {complexity.replace('_', ' ')}
            </span>
          </div>

          <AiConsentNotice
            language={currentLanguage}
            consentGranted={aiConsentGranted}
            onAcceptConsent={onAcceptAiConsent}
          />

          <form onSubmit={handleSimplifyWithAi} className="space-y-3">
            <label className="text-xs font-semibold text-[#493C39] block">
              {currentLanguage === 'kn'
                ? 'ಆಸ್ಪತ್ರೆ ಕಾಗದ ಅಥವಾ SMS ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ವೈಯಕ್ತಿಕ ID/ಫೋನ್ ಸಂಖ್ಯೆ ಬೇಡ):'
                : currentLanguage === 'te'
                ? 'ఆసుపత్రి సూచనను ఇక్కడ టైప్ చేయండి (వ్యక్తిగత ఫోన్ నంబర్/IDలు ఇవ్వకండి):'
                : 'Paste or type non-clinical administrative or preparation text (do not include personal IDs or phone numbers):'}
            </label>
            <textarea
              rows={3}
              maxLength={1200}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., Report at Radiology Block B 30 mins prior with prior reports and serum creatinine slip..."
              className="w-full p-4 rounded-2xl border border-[#BEA06D]/40 bg-[#FCF9F5] text-sm text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
            />

            {/* Curated Reference Priority Banner */}
            {matchedCuratedRef && (
              <div className="p-4 rounded-2xl bg-[#A2B29B]/14 border border-[#4A6347]/45 text-xs sm:text-sm text-[#493C39] space-y-1 soft-fade-up">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider">
                    {currentLanguage === 'kn'
                      ? 'ಪರಿಶೀಲಿಸಿದ ಉಲ್ಲೇಖ ಹೊಂದಾಣಿಕೆ · ಆಫ್‌ಲೈನ್ ಆದ್ಯತೆ'
                      : currentLanguage === 'te'
                      ? 'ధృవీకరించబడిన రిఫరెన్స్ · ఆఫ్‌లైన్ ప్రాధాన్యత'
                      : 'Verified Reference Match · Offline Preferred'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(matchedCuratedRef)}
                    className="compact-chip text-xs font-semibold text-[#4A6347] underline cursor-pointer"
                  >
                    {currentLanguage === 'kn'
                      ? 'ಕೆಳಗಿನ ಪಟ್ಟಿಯಲ್ಲಿ ತೋರಿಸಿ ↓'
                      : currentLanguage === 'te'
                      ? 'క్రింది జాబితాలో చూపించు ↓'
                      : 'Highlight in Reference Panel ↓'}
                  </button>
                </div>
                <p className="font-medium">
                  &ldquo;{matchedCuratedRef.originalPhrase}&rdquo; → {matchedCuratedRef.simple[currentLanguage]}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[#8A6D3F]">
                  {currentLanguage === 'kn' ? 'ಉದಾಹರಣೆ ಪ್ರಯತ್ನಿಸಿ:' : currentLanguage === 'te' ? 'నమూనా ప్రయత్నించండి:' : 'Try example:'}
                </span>
                {SAMPLE_AI_INPUTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomInput(sample)}
                    className="compact-chip text-[11px] px-2.5 py-1 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/30 hover:border-[#C88F98] text-[#493C39] cursor-pointer"
                  >
                    {currentLanguage === 'kn' ? `ನಮೂನೆ ${idx + 1}` : currentLanguage === 'te' ? `నమూనా ${idx + 1}` : `Sample ${idx + 1}`}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!aiConsentGranted || aiLoading || customInput.trim().length < 4}
                className="py-3 px-6 rounded-full bg-[#C88F98] hover:bg-[#b07680] active:scale-[0.98] disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {aiLoading
                    ? currentLanguage === 'kn'
                      ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...'
                      : currentLanguage === 'te'
                      ? 'వివరిస్తోంది...'
                      : 'Simplifying with Gemini...'
                    : currentLanguage === 'kn'
                    ? 'AI ಮೂಲಕ ಸರಳಗೊಳಿಸಿ'
                    : currentLanguage === 'te'
                    ? 'AI తో సులభంగా మార్చండి'
                    : 'Simplify with Clarity AI'}
                </span>
              </button>
            </div>
          </form>

          {aiLoading && (
            <AiSkeletonLoader
              label={
                currentLanguage === 'kn'
                  ? 'ಆಸ್ಪತ್ರೆ ಪದಗಳನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಲಾಗುತ್ತಿದೆ...'
                  : currentLanguage === 'te'
                  ? 'ఆసుపత్రి సూచనలను సులభ తెలుగులోకి మారుస్తున్నాము...'
                  : 'Translating hospital wording into calm plain language...'
              }
            />
          )}

          {aiError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{aiError}</span>
            </div>
          )}

          {aiResult && !aiLoading && (
            <div className="p-6 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 space-y-5 soft-bloom">
              <AiTrustHeader
                language={currentLanguage}
                label={
                  currentLanguage === 'kn'
                    ? 'AI-ರಚಿತ ಸರಳ ವಿವರಣೆ · Google Gemini'
                    : currentLanguage === 'te'
                    ? 'AI సులభ వివరణ · Google Gemini'
                    : 'AI-Generated Clarification · Google Gemini'
                }
                onAskClarification={() => void runClarityRequest('extra_simple')}
                clarifyDisabled={aiLoading || !aiConsentGranted}
                onListen={() =>
                  handleListen(
                    `${aiResult.shortExplanation}. ${aiResult.plainExplanation}`,
                    'clarity-ai-result'
                  )
                }
                isSpeaking={
                  playbackSnap.activeId === 'clarity-ai-result' && playbackSnap.status !== 'idle'
                }
              />

              {/* AI Output Audio Transport & Speed Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-[#BEA06D]/30 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#8A6D3F] uppercase tracking-wider">
                    Audio Language:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/40 font-semibold text-[#493C39]">
                    {getAudioLanguageBadge(
                      resolveSpeechLanguage(
                        `${aiResult.shortExplanation}. ${aiResult.plainExplanation}`,
                        currentLanguage
                      )
                    )}
                  </span>
                  {playbackSnap.activeId === 'clarity-ai-result' && playbackSnap.status !== 'idle' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          playbackSnap.status === 'paused'
                            ? speechService.resume()
                            : speechService.pause()
                        }
                        className="compact-chip px-2.5 py-1 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/40 font-semibold text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                      >
                        {playbackSnap.status === 'paused' ? (
                          <Play className="w-3 h-3" />
                        ) : (
                          <Pause className="w-3 h-3" />
                        )}
                        <span>{playbackSnap.status === 'paused' ? 'Resume' : 'Pause'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => speechService.replay()}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-[#FCF9F5] border border-[#BEA06D]/40 font-semibold text-[#8A6D3F] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => speechService.stop()}
                        className="compact-chip px-2.5 py-1 rounded-lg bg-[#C88F98] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <VolumeX className="w-3 h-3" />
                        <span>Stop</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-lg p-0.5">
                  <span className="text-[11px] font-semibold text-[#8A6D3F] px-1.5">Speed</span>
                  {([0.75, 0.9, 1.0] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRateChange(r)}
                      className={`compact-chip px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                        speechRate === r ? 'bg-[#BEA06D] text-white' : 'text-[#493C39]/80'
                      }`}
                    >
                      {r === 1 ? '1.0x' : `${r}x`}
                    </button>
                  ))}
                </div>
              </div>

              {audioNotice && (
                <div className="p-3 rounded-xl bg-[#E6C1C4]/22 border border-[#C88F98] text-xs text-[#493C39] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                    <span>{audioNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioNotice(null);
                      speechService.clearError();
                    }}
                    className="font-semibold text-[#8A6D3F] underline shrink-0 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E6C1C4]/70 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#C88F98] uppercase tracking-wider block">
                    {currentLanguage === 'kn' ? 'ಸಂಕ್ಷಿಪ್ತ ಸಾರಾಂಶ' : currentLanguage === 'te' ? 'చిన్న సారాంశం' : 'Shorter Summary'}
                  </span>
                  <p className="font-display text-xl font-bold text-[#493C39] leading-snug">
                    {aiResult.shortExplanation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#A2B29B]/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider block">
                    {currentLanguage === 'kn'
                      ? 'ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ (KN)'
                      : currentLanguage === 'te'
                      ? 'ఎంచుకున్న భాషలో (TE)'
                      : `In Selected Language (${currentLanguage.toUpperCase()})`}
                  </span>
                  <p className="text-sm font-medium text-[#493C39] leading-relaxed">
                    {aiResult.translatedExplanation}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#BEA06D]/30 space-y-2">
                <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
                  {currentLanguage === 'kn'
                    ? 'ಸರಳ ಭಾಷೆಯ ವಿವರಣೆ'
                    : currentLanguage === 'te'
                    ? 'సులభ భాషా వివరణ'
                    : 'Plain-Language Explanation'}
                </span>
                <p className="text-sm sm:text-base text-[#493C39] leading-relaxed">
                  {aiResult.plainExplanation}
                </p>
              </div>

              {aiResult.stepByStepSummary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
                    {currentLanguage === 'kn'
                      ? 'ಹಂತ-ಹಂತದ ಸಾರಾಂಶ'
                      : currentLanguage === 'te'
                      ? 'దశల వారీ సారాంశం'
                      : 'Step-by-Step Summary'}
                  </span>
                  <ol className="space-y-1.5 text-sm text-[#493C39] list-decimal list-inside bg-white p-4 rounded-2xl border border-[#BEA06D]/25">
                    {aiResult.stepByStepSummary.map((st, idx) => (
                      <li key={idx}>{st}</li>
                    ))}
                  </ol>
                </div>
              )}

              {aiResult.questionsForProvider.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>
                      {currentLanguage === 'kn'
                        ? 'ನಿಮ್ಮ ವೈದ್ಯರು ಅಥವಾ ಸಿಬ್ಬಂದಿಗೆ ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು'
                        : currentLanguage === 'te'
                        ? 'మీ డాక్టర్ లేదా సిబ్బందిని అడగగల ప్రశ్నలు'
                        : 'Questions You Can Ask Your Healthcare Provider'}
                    </span>
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#493C39] list-disc list-inside bg-[#A2B29B]/12 p-4 rounded-2xl border border-[#A2B29B]/45">
                    {aiResult.questionsForProvider.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <AiTrustFooter
                language={currentLanguage}
                uncertaintyNote={aiResult.uncertaintyNote}
                verificationDisclaimer={aiResult.verificationDisclaimer}
              />
            </div>
          )}
        </section>
      </Reveal>

      {/* CURATED OFFLINE-SAFE EXAMPLES */}
      <Reveal delay={160}>
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39]">
              {currentLanguage === 'kn'
                ? 'ಪರಿಶೀಲಿಸಿದ ಸಾಮಾನ್ಯ ಉದಾಹರಣೆಗಳು'
                : currentLanguage === 'te'
                ? 'ధృవీకరించబడిన సాధారణ ఉదాహరణలు'
                : 'Verified Offline Reference Examples'}
            </h2>
          </div>

          <form
            onSubmit={handleMatchPhrase}
            className="bg-white border border-[#BEA06D]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A6D3F] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={smsQuery}
                onChange={(e) => setSmsQuery(e.target.value)}
                placeholder={
                  currentLanguage === 'kn'
                    ? 'ಉದಾಹರಣೆಗೆ ಹುಡುಕಿ: NPO, Creatinine, Block B, metal, water...'
                    : currentLanguage === 'te'
                    ? 'ఉదాహరణకు వెతకండి: NPO, Creatinine, Block B, metal, water...'
                    : 'Find curated example (e.g., NPO, Creatinine, Block B, metal, water)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#BEA06D]/30 bg-[#FCF9F5] text-sm text-[#493C39] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#BEA06D] hover:bg-[#8A6D3F] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
            >
              {currentLanguage === 'kn' ? 'ಸೂಚನೆ ಹುಡುಕಿ' : currentLanguage === 'te' ? 'సూచన వెతకండి' : 'Find Match'}
            </button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2.5">
              {CLARITY_EXAMPLES.map((item) => {
                const active = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      speechService.stop();
                      setAudioNotice(null);
                      setSelectedItem(item);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E6C1C4]/25 border-[#C88F98] shadow-xs'
                        : 'bg-white border-[#BEA06D]/25 hover:border-[#BEA06D]/60'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
                      {item.category[currentLanguage]}
                    </span>
                    <p className="text-sm font-semibold text-[#493C39] mt-1 leading-snug">
                      "{item.originalPhrase}"
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-white border border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
                <span className="text-xs font-semibold text-[#8A6D3F] uppercase tracking-wider block">
                  {currentLanguage === 'kn'
                    ? 'ಮೂಲ ಆಸ್ಪತ್ರೆ ಸೂಚನೆ (ಇಂಗ್ಲಿಷ್)'
                    : currentLanguage === 'te'
                    ? 'అసలు ఆసుపత్రి సూచన (ఇంగ్లీష్)'
                    : 'Original Hospital Instruction'}
                </span>
                <p className="text-sm sm:text-base font-medium text-[#493C39]">
                  "{selectedItem.originalPhrase}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-2xl">
                <button
                  onClick={() => {
                    speechService.stop();
                    setAudioNotice(null);
                    setLevel('simple');
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    level === 'simple'
                      ? 'bg-[#BEA06D] text-white shadow-xs'
                      : 'text-[#493C39] hover:text-[#8A6D3F]'
                  }`}
                >
                  {currentLanguage === 'kn' ? 'ಸರಳ ವಿವರಣೆ' : currentLanguage === 'te' ? 'సులభ వివరణ' : 'Simple Explanation'}
                </button>

                <button
                  onClick={() => {
                    speechService.stop();
                    setAudioNotice(null);
                    setLevel('extraSimple');
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    level === 'extraSimple'
                      ? 'bg-[#4A6347] text-white shadow-xs'
                      : 'text-[#493C39] hover:text-[#4A6347]'
                  }`}
                >
                  {currentLanguage === 'kn' ? 'ಅತಿ ಸರಳ ವಿವರಣೆ' : currentLanguage === 'te' ? 'అతి సులభ వివరణ' : 'Extra Simple'}
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#A2B29B]/15 border border-[#A2B29B]/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {level === 'simple' ? 'Simple Explanation' : 'Extra Simple Explanation'}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#BEA06D]/35 text-[#493C39]">
                    {getAudioLanguageBadge(resolveSpeechLanguage(activeText, currentLanguage))}
                  </span>
                </div>

                <p className="font-display text-2xl sm:text-3xl font-bold text-[#322826] leading-snug">
                  {activeText}
                </p>

                {(() => {
                  const refItemId = `clarity-ref-${selectedItem.id}-${level}`;
                  const isRefActive =
                    playbackSnap.activeId === refItemId && playbackSnap.status !== 'idle';
                  const isRefPaused = isRefActive && playbackSnap.status === 'paused';

                  return (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleListen(activeText, refItemId)}
                            className={`py-2.5 px-5 rounded-full font-bold text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer ${
                              isRefActive
                                ? 'bg-[#C88F98] hover:bg-[#b07680] text-white'
                                : 'bg-[#BEA06D] hover:bg-[#8A6D3F] text-white'
                            }`}
                          >
                            {isRefActive ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                            <span>
                              {isRefActive
                                ? currentLanguage === 'kn'
                                  ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ'
                                  : currentLanguage === 'te'
                                  ? 'వాయిస్ ఆపండి'
                                  : 'Stop Listening'
                                : currentLanguage === 'kn'
                                ? 'ವಿವರಣೆಯನ್ನು ಆಲಿಸಿ'
                                : currentLanguage === 'te'
                                ? 'వివరణను వినండి'
                                : 'Listen to Explanation'}
                            </span>
                          </button>

                          {isRefActive && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  isRefPaused ? speechService.resume() : speechService.pause()
                                }
                                className="compact-chip py-2 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 text-xs font-bold text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
                              >
                                {isRefPaused ? (
                                  <Play className="w-3.5 h-3.5" />
                                ) : (
                                  <Pause className="w-3.5 h-3.5" />
                                )}
                                <span>{isRefPaused ? 'Resume' : 'Pause'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => speechService.replay()}
                                className="compact-chip py-2 px-3.5 rounded-full bg-white border border-[#BEA06D]/45 text-xs font-bold text-[#8A6D3F] inline-flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Replay</span>
                              </button>
                            </>
                          )}
                        </div>

                        <div className="inline-flex items-center gap-1 bg-white border border-[#BEA06D]/30 rounded-full p-0.5">
                          <span className="text-[11px] font-semibold text-[#8A6D3F] pl-2 pr-1">
                            Speed
                          </span>
                          {([0.75, 0.9, 1.0] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => handleRateChange(r)}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                                speechRate === r ? 'bg-[#BEA06D] text-white' : 'text-[#493C39]/80'
                              }`}
                            >
                              {r === 1 ? '1.0x' : `${r}x`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {audioNotice && (
                        <div className="p-3 rounded-xl bg-white border border-[#C88F98] text-xs text-[#493C39] flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-[#C88F98] shrink-0 mt-0.5" />
                            <span>{audioNotice}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAudioNotice(null);
                              speechService.clearError();
                            }}
                            className="font-semibold text-[#8A6D3F] underline shrink-0 cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-3 text-xs text-[#493C39]/90 leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-[#C88F98] shrink-0 mt-0.5" />
                <p>
                  {currentLanguage === 'kn'
                    ? 'ಗಮನಿಸಿ: ಇವು ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ಸರಳ ವಿವರಣೆಗಳಾಗಿವೆ. ಯಾವುದೇ ಔಷಧಿ ಪ್ರಮಾಣ ಬದಲಾವಣೆ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಂದೇಹವಿದ್ದರೆ ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
                    : currentLanguage === 'te'
                    ? 'గమనిక: ఇవి అవగాహన కోసం రూపొందించబడిన నమూనా వివరణలు మాత్రమే. మందుల మోతాదు లేదా వైద్య సందేహాల కోసం డాక్టర్‌ను అడిగి నిర్ధారించుకోండి.'
                    : 'Important Note: Always verify medication dosages or unclear medical directions directly with your doctor or hospital staff.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C88F98]" />
                    <span>CORE Sense</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[#493C39]/85">
                    {currentLanguage === 'kn'
                      ? 'ನಿಮ್ಮ ತಿಳುವಳಿಕೆಯನ್ನು ಸರಳ ರಸಪ್ರಶ್ನೆ ಮತ್ತು Teach-Back ನೊಂದಿಗೆ ಪರೀಕ್ಷಿಸಿ.'
                      : currentLanguage === 'te'
                      ? 'మీ అవగాహనను సులభ క్విజ్ మరియు Teach-Back తో సరిచూసుకోండి.'
                      : 'Practice with an interactive comprehension quiz, Teach-Back reflection, and 5-step hospital sequence.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    speechService.stop();
                    onPageChange('sense');
                  }}
                  className="py-2.5 px-4 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Practice in CORE Sense</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
