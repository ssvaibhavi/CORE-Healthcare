import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import {
  AiClientError,
  formatAiErrorMessage,
  submitTeachBackAi,
  TeachBackAiResponse,
} from '../utils/aiClient';
import { resolveSpeechLanguage, speechService } from '../utils/speech';
import { AiConsentNotice } from './AiConsentNotice';
import { AiSkeletonLoader, AiTrustFooter, AiTrustHeader } from './AiTrustLayer';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  HeartHandshake,
  MessageSquareHeart,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';

export interface TeachBackQuickChoice {
  id: string;
  label: Record<Language, string>;
  capturesKeyPoint: boolean;
}

interface TeachBackPanelProps {
  language: Language;
  stepPrompt: string;
  referenceExplanation: string;
  quickChoices?: TeachBackQuickChoice[];
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  onAttemptRecorded?: () => void;
}

export const TeachBackPanel: React.FC<TeachBackPanelProps> = ({
  language,
  stepPrompt,
  referenceExplanation,
  quickChoices = [],
  aiConsentGranted,
  onAcceptAiConsent,
  onAttemptRecorded,
}) => {
  const [userWords, setUserWords] = useState<string>('');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<TeachBackAiResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Reset form gently when scenario prompt changes
  useEffect(() => {
    setUserWords('');
    setSelectedChoiceId(null);
    setAiFeedback(null);
    setErrorMsg(null);
  }, [stepPrompt, referenceExplanation]);

  useEffect(() => {
    return speechService.subscribe((snap) => {
      setIsSpeaking(snap.status === 'speaking' || snap.status === 'loading');
    });
  }, []);

  const selectedChoice = quickChoices.find((c) => c.id === selectedChoiceId);

  const handleSelectQuickChoice = (choice: TeachBackQuickChoice) => {
    setSelectedChoiceId(choice.id);
    onAttemptRecorded?.();
  };

  const handleSubmitOwnWords = async () => {
    const cleaned = userWords.trim();
    if (!cleaned || !aiConsentGranted) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await submitTeachBackAi({
        userExplanation: cleaned,
        referenceExplanation,
        stepPrompt,
        language,
        consentAccepted: aiConsentGranted,
      });
      setAiFeedback(response);
      onAttemptRecorded?.();
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

  const handleListenReference = () => {
    if (isSpeaking) {
      speechService.stop();
      return;
    }
    const textToSpeak = aiFeedback
      ? [
          aiFeedback.whatWasClear,
          aiFeedback.gentleClarification,
          aiFeedback.simplerVersion,
        ]
          .filter(Boolean)
          .join(' ')
      : referenceExplanation;
    const effectiveLang = resolveSpeechLanguage(textToSpeak, aiFeedback?.language || language);
    speechService.speak(textToSpeak, effectiveLang);
  };

  return (
    <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A6347] uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-[#C88F98]" />
            <span>
              {language === 'kn'
                ? 'CORE ಟೀಚ್-ಬ್ಯಾಕ್ (ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಖಚಿತಪಡಿಸಿ)'
                : language === 'te'
                ? 'CORE టీచ్-బ్యాక్ (మీ మాటల్లో నిర్ధారించుకోండి)'
                : 'CORE Teach-Back Clarity Check (Supportive, No Scores)'}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#322826]">
            {language === 'kn'
              ? 'ಹಂತವು ಸ್ಪಷ್ಟವಾಗಿದೆಯೇ ಎಂದು ಶಾಂತವಾಗಿ ಪರಿಶೀಲಿಸಿ'
              : language === 'te'
              ? 'తదుపరి దశ స్పష్టంగా అర్థమైందో ప్రశాంతంగా సరిచూసుకోండి'
              : 'Check Your Own Understanding — Gently & Without Judgment'}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleListenReference}
          className="compact-chip py-2 px-4 rounded-full bg-[#FCF9F5] border border-[#BEA06D]/45 hover:border-[#4A6347] text-xs font-semibold text-[#493C39] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#8A6D3F]" />
          <span>
            {language === 'kn'
              ? 'ಸಾರಾಂಶ ಆಲಿಸಿ'
              : language === 'te'
              ? 'సారాంశం వినండి'
              : 'Hear Key Step'}
          </span>
        </button>
      </div>

      {/* Reassurance that there are NO intelligence/competence scores */}
      <div className="p-3 rounded-2xl bg-[#A2B29B]/14 border border-[#4A6347]/30 flex items-center gap-2 text-xs text-[#322826]">
        <ShieldCheck className="w-4 h-4 text-[#4A6347] shrink-0" />
        <span>
          {language === 'kn'
            ? 'ಇದು ಪರೀಕ್ಷೆ ಅಲ್ಲ — ಯಾವುದೇ ಅಂಕಗಳು ಅಥವಾ ತೀರ್ಪುಗಳಿಲ್ಲ. ಮುಂದಿನ ಹಂತ ನಿಮಗೆ ಸ್ಪಷ್ಟವಾಗಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಲು ಮಾತ್ರ.'
            : language === 'te'
            ? 'ఇది పరీక్ష కాదు — ఎటువంటి మార్కులు లేదా తీర్పులు ఉండవు. తదుపరి దశ మీకు సులభంగా అర్థమైందో చూడటానికి మాత్రమే.'
            : 'No scores, grades, or judgments are ever assigned. Teach-Back helps ensure our directions are clear for you.'}
        </span>
      </div>

      {/* Step Prompt Question */}
      <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/35 space-y-2">
        <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-wider block">
          {language === 'kn'
            ? 'ಸರಳ ಪರಿಶೀಲನಾ ಪ್ರಶ್ನೆ'
            : language === 'te'
            ? 'సులభమైన అవగాహన ప్రశ్న'
            : 'Practical Next-Step Check'}
        </span>
        <p className="text-sm font-semibold text-[#322826] leading-relaxed break-words">
          {stepPrompt}
        </p>
      </div>

      {/* Optional Quick Multiple-Choice Check (accessible without typing) */}
      {quickChoices.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#493C39] block">
            {language === 'kn'
              ? 'ಟೈಪ್ ಮಾಡದೆಯೇ ಒಂದು ಆಯ್ಕೆ ಸ್ಪರ್ಶಿಸಿ:'
              : language === 'te'
              ? 'టైప్ చేయకుండానే ఒక ఎంపికను తాకండి:'
              : 'Option 1 — Tap what matches your plan (no typing needed):'}
          </span>
          <div className="grid grid-cols-1 gap-2">
            {quickChoices.map((choice) => {
              const selected = selectedChoiceId === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectQuickChoice(choice)}
                  aria-pressed={selected}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    selected
                      ? choice.capturesKeyPoint
                        ? 'bg-[#A2B29B]/20 border-[#4A6347] text-[#322826]'
                        : 'bg-[#E6C1C4]/25 border-[#C88F98] text-[#322826]'
                      : 'bg-[#FCF9F5] border-[#BEA06D]/35 text-[#493C39] hover:border-[#BEA06D]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selected
                        ? choice.capturesKeyPoint
                          ? 'bg-[#4A6347] border-[#4A6347] text-white'
                          : 'bg-[#C88F98] border-[#C88F98] text-white'
                        : 'border-[#BEA06D]/50 bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold leading-snug break-words">
                    {choice.label[language]}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedChoice && (
            <div
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed soft-fade-up ${
                selectedChoice.capturesKeyPoint
                  ? 'bg-[#A2B29B]/15 border-[#4A6347]/45 text-[#322826]'
                  : 'bg-[#FCF9F5] border-[#C88F98] text-[#322826]'
              }`}
            >
              {selectedChoice.capturesKeyPoint ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A6347] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A6347] block mb-0.5">
                      {language === 'kn'
                        ? 'ಬಹಳ ಚೆನ್ನಾಗಿದೆ — ನೀವು ಮುಖ್ಯ ಹಂತವನ್ನು ಸರಿಯಾಗಿ ಹಿಡಿದಿದ್ದೀರಿ.'
                        : language === 'te'
                        ? 'చాలా బాగుంది — మీరు ముఖ్యమైన దశను సరిగ్గా గుర్తుంచుకున్నారు.'
                        : 'That captures the key step clearly.'}
                    </strong>
                    <span>{referenceExplanation}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <strong className="text-[#8A6D3F] block">
                    {language === 'kn'
                      ? 'ಇದನ್ನು ಇನ್ನಷ್ಟು ಸರಳವಾಗಿ ಹೀಗೆ ನೆನಪಿಡಿ:'
                      : language === 'te'
                      ? 'దీనిని మరింత సులభంగా ఇలా గుర్తుంచుకోండి:'
                      : 'Thank you for checking — here is an easier reminder:'}
                  </strong>
                  <p>{referenceExplanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Option 2: Explain In Patient's Own Words via Gemini Teach-Back */}
      <div className="pt-3 border-t border-[#BEA06D]/25 space-y-3">
        <label
          htmlFor="teachback-own-words"
          className="text-xs font-bold text-[#493C39] flex items-center gap-1.5"
        >
          <MessageSquareHeart className="w-4 h-4 text-[#C88F98]" />
          <span>
            {language === 'kn'
              ? 'ಆಯ್ಕೆ ೨ — ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ಬರೆಯಿರಿ (Gemini ಶಾಂತ ಪ್ರತಿಕ್ರಿಯೆ):'
              : language === 'te'
              ? 'ఎంపిక 2 — మీ సొంత మాటల్లో రాయండి (Gemini శాంత ప్రతిస్పందన):'
              : 'Option 2 — Share in your own words (AI checks gently for clarity):'}
          </span>
        </label>

        <textarea
          id="teachback-own-words"
          rows={2}
          value={userWords}
          onChange={(e) => setUserWords(e.target.value)}
          placeholder={
            language === 'kn'
              ? 'ಉದಾ: ನಾನು ನೆಲ ಮಹಡಿ ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಕೇಳುತ್ತೇನೆ...'
              : language === 'te'
              ? 'ఉదా: నేను గ్రౌండ్ రిసెప్షన్‌లో సిబ్బంది సహాయం అడుగుతాను...'
              : 'Example: I will wait at Reception and ask staff for help rather than taking stairs...'
          }
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#BEA06D]/50 bg-[#FCF9F5] text-sm text-[#322826] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
        />

        <AiConsentNotice
          language={language}
          consentGranted={aiConsentGranted}
          onAcceptConsent={onAcceptAiConsent}
          compact
        />

        <button
          type="button"
          disabled={!aiConsentGranted || loading || !userWords.trim()}
          onClick={handleSubmitOwnWords}
          className="py-2.5 px-5 rounded-full bg-[#4A6347] hover:bg-[#384d36] disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {loading
              ? language === 'kn'
                ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
                : language === 'te'
                ? 'సరిచూస్తున్నాము...'
                : 'Checking Gently...'
              : language === 'kn'
              ? 'ನನ್ನ ತಿಳುವಳಿಕೆ ಪರಿಶೀಲಿಸಿ'
              : language === 'te'
              ? 'నా అవగాహనను సరిచూడండి'
              : 'Check My Understanding'}
          </span>
        </button>

        {loading && (
          <AiSkeletonLoader
            label={
              language === 'kn'
                ? 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಶಾಂತವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
                : language === 'te'
                ? 'మీ సమాధానాన్ని ప్రశాంతంగా సరిచూస్తున్నాము...'
                : 'Reviewing your explanation with supportive plain language...'
            }
          />
        )}

        {errorMsg && !loading && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-[#E6C1C4]/25 border border-[#C88F98] space-y-2 text-xs sm:text-sm text-[#322826]"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#9E4958] shrink-0 mt-0.5" />
              <p className="leading-relaxed break-words">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={handleSubmitOwnWords}
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

        {aiFeedback && !loading && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF9F5] border border-[#4A6347]/40 space-y-3 soft-fade-up">
            <AiTrustHeader
              language={language}
              label={
                language === 'kn'
                  ? 'ಸಹಾಯಕ ಟೀಚ್-ಬ್ಯಾಕ್ ಪ್ರತಿಕ್ರಿಯೆ'
                  : language === 'te'
                  ? 'సహాయక టీచ్-బ్యాక్ ప్రతిస్పందన'
                  : 'Supportive Teach-Back Reflection'
              }
              onListen={handleListenReference}
              isSpeaking={isSpeaking}
            />

            <div className="p-3 rounded-xl bg-[#A2B29B]/18 border border-[#4A6347]/35 text-xs sm:text-sm text-[#322826]">
              <strong className="text-[#4A6347] block mb-0.5">
                {language === 'kn'
                  ? 'ನೀವು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿದ್ದು:'
                  : language === 'te'
                  ? 'మీరు స్పష్టంగా చెప్పిన అంశం:'
                  : 'What you explained clearly:'}
              </strong>
              <p className="break-words">{aiFeedback.whatWasClear}</p>
            </div>

            {aiFeedback.gentleClarification && (
              <div className="p-3 rounded-xl bg-white border border-[#C88F98]/55 text-xs sm:text-sm text-[#322826]">
                <strong className="text-[#8A6D3F] block mb-0.5">
                  {language === 'kn'
                    ? 'ಸಹಾಯಕ ಸಣ್ಣ ಸ್ಪಷ್ಟೀಕರಣ:'
                    : language === 'te'
                    ? 'ఒక చిన్న ప్రశాంత స్పష్టత:'
                    : 'One helpful detail to keep in mind:'}
                </strong>
                <p className="break-words">{aiFeedback.gentleClarification}</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-white border border-[#BEA06D]/40 text-xs sm:text-sm text-[#322826]">
              <strong className="text-[#8A6D3F] block mb-0.5">
                {language === 'kn'
                  ? 'ನೆನಪಿಡಲು ಸುಲಭ ಸಾರಾಂಶ:'
                  : language === 'te'
                  ? 'గుర్తుంచుకోవడానికి సులభ సారాంశం:'
                  : 'Clear Step-by-Step Reminder:'}
              </strong>
              <p className="break-words">{aiFeedback.simplerVersion}</p>
            </div>

            <AiTrustFooter
              language={language}
              verificationDisclaimer={aiFeedback.confirmationNote}
            />
          </div>
        )}
      </div>
    </div>
  );
};
