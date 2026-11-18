import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ExplanationComplexity, Language, PageView } from '../types';
import {
  CORE_SEARCH_ENTRIES,
  SearchCategory,
  SearchEntry
} from '../data/searchIndex';
import { askCompanionAi, AiClientError } from '../utils/aiClient';
import { AiConsentNotice } from './AiConsentNotice';
import {
  Search,
  X,
  ArrowRight,
  SlidersHorizontal,
  Globe,
  Sparkles,
  BookOpen,
  HelpCircle,
  Loader2,
  CornerDownLeft
} from 'lucide-react';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  complexity?: ExplanationComplexity;
  aiConsentGranted: boolean;
  onAcceptAiConsent: () => void;
  onPageChange: (page: PageView) => void;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="bg-[#E6C1C4]/65 text-[#322826] rounded px-0.5 font-semibold">
        {match}
      </mark>
      {after}
    </>
  );
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  language,
  complexity = 'simple',
  aiConsentGranted,
  onAcceptAiConsent,
  onPageChange,
  onLanguageChange,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{
    reply: string;
    suggestedPage?: PageView;
    suggestedActionLabel?: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setAiSuggestion(null);
      setAiError(null);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    const filteredByCat = CORE_SEARCH_ENTRIES.filter((entry) =>
      category === 'all' ? true : entry.category === category
    );

    if (!clean) return filteredByCat;

    return filteredByCat.filter((entry) => {
      const hay = [
        entry.title.en,
        entry.title.kn,
        entry.title.te,
        entry.description.en,
        entry.description.kn,
        entry.description.te,
        entry.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return clean.split(/\s+/).every((token) => hay.includes(token));
    });
  }, [query, category]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, category]);

  const executeEntry = (entry: SearchEntry) => {
    if (entry.actionType === 'navigate' && entry.targetPage) {
      onPageChange(entry.targetPage);
    } else if (entry.actionType === 'settings') {
      onOpenSettings();
    } else if (entry.actionType === 'language' && entry.targetLang) {
      onLanguageChange(entry.targetLang);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      executeEntry(results[activeIndex]);
    }
  };

  const handleAskGeminiSearch = async () => {
    const cleaned = query.trim();
    if (!cleaned || !aiConsentGranted || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    setAiSuggestion(null);
    try {
      const res = await askCompanionAi({
        message: `Which CORE page or accessibility feature helps a user searching for: "${cleaned}"? Give a 1-2 sentence navigation answer and suggestedPage.`,
        language,
        complexity,
        currentPage: 'home',
        history: [],
        consentAccepted: true,
      });
      setAiSuggestion({
        reply: res.reply,
        suggestedPage: res.suggestedPage,
        suggestedActionLabel: res.suggestedActionLabel,
      });
    } catch (err) {
      setAiError(
        err instanceof AiClientError
          ? err.message
          : 'Unable to ask Gemini right now.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories: Array<{ id: SearchCategory; label: Record<Language, string> }> = [
    { id: 'all', label: { en: 'All', kn: 'ಎಲ್ಲಾ', te: 'అన్నీ' } },
    { id: 'modules', label: { en: 'CORE Modules', kn: 'ವಿಭಾಗಗಳು', te: 'మాడ్యూల్స్' } },
    { id: 'preparation', label: { en: 'Visit Prep', kn: 'ಸಿದ್ಧತೆ', te: 'తయారీ' } },
    { id: 'accessibility', label: { en: 'Accessibility & Language', kn: 'ಭಾಷೆ & ಸೌಲಭ್ಯ', te: 'యాక్సెసిబిలిటీ' } },
    { id: 'faq', label: { en: 'Common Questions', kn: 'ಪ್ರಶ್ನೆಗಳು', te: 'ప్రశ్నలు' } },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#322826]/45 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16 no-print"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="CORE Smart Search"
    >
      <div
        className="w-full max-w-2xl bg-[#FCF9F5] border border-[#BEA06D]/70 rounded-3xl shadow-2xl overflow-hidden modal-soft-enter"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Header */}
        <div className="bg-white border-b border-[#BEA06D]/25 p-4 sm:p-5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C88F98] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'kn'
                ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್, ಭಾಷೆ, ಸಿದ್ಧತೆ, CareCircle ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ...'
                : language === 'te'
                ? 'అపాయింట్‌మెంట్, భాష, తయారీ, CareCircle లేదా ప్రశ్నలు వెతకండి...'
                : 'Search CORE modules, visit prep, CareCircle, settings, or FAQs...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-[#493C39] placeholder-[#493C39]/45 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="compact-chip text-xs text-[#8A6D3F] hover:text-[#493C39] px-2 py-1 cursor-pointer"
            >
              {language === 'kn' ? 'ಅಳಿಸಿ' : language === 'te' ? 'తొలగించు' : 'Clear'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="compact-chip p-1.5 rounded-full text-[#493C39]/70 hover:bg-[#E6C1C4]/25 cursor-pointer"
            aria-label="Close Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#FCF9F5] border-b border-[#BEA06D]/20 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`compact-chip px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                category === cat.id
                  ? 'bg-[#BEA06D] text-white'
                  : 'bg-white border border-[#BEA06D]/30 text-[#493C39] hover:border-[#C88F98]'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>

        {/* Deterministic Search Results */}
        <div className="max-h-[55vh] overflow-y-auto p-3 sm:p-4 space-y-2">
          {results.length > 0 ? (
            results.map((entry, idx) => {
              const selected = idx === activeIndex;
              const Icon =
                entry.actionType === 'settings'
                  ? SlidersHorizontal
                  : entry.actionType === 'language'
                  ? Globe
                  : entry.category === 'faq'
                  ? HelpCircle
                  : BookOpen;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => executeEntry(entry)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    selected
                      ? 'bg-white border-[#C88F98] shadow-xs'
                      : 'bg-white/75 border-[#BEA06D]/25 hover:border-[#BEA06D]/60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FCF9F5] border border-[#E6C1C4]/80 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#8A6D3F]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[#493C39] leading-snug">
                        {highlightMatch(entry.title[language], query)}
                      </div>
                      <p className="text-xs text-[#493C39]/75 line-clamp-2 mt-0.5">
                        {highlightMatch(entry.description[language], query)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      selected ? 'text-[#C88F98] translate-x-0.5' : 'text-[#8A6D3F]/60'
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center space-y-4 bg-white rounded-2xl border border-[#BEA06D]/25">
              <p className="text-sm font-semibold text-[#493C39]">
                {language === 'kn'
                  ? `"${query}" ಗೆ ನೇರ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ.`
                  : language === 'te'
                  ? `"${query}" కోసం నేరుగా ఫలితాలు దొరకలేదు.`
                  : `No direct menu match found for "${query}".`}
              </p>
              <p className="text-xs text-[#493C39]/75 max-w-md mx-auto">
                {language === 'kn'
                  ? '“appointment”, “reschedule”, “CareCircle”, “Kannada”, ಅಥವಾ “contrast” ಹುಡುಕಿ, ಅಥವಾ Gemini ಸಹಾಯ ಕೇಳಿ.'
                  : language === 'te'
                  ? '“appointment”, “reschedule”, “CareCircle”, “Telugu”, లేదా “contrast” వెతకండి, లేదా Gemini ను అడగండి.'
                  : 'Try searching for “appointment”, “reschedule”, “CareCircle”, “Kannada”, “contrast”, or ask Gemini to point you to the right CORE tool.'}
              </p>

              <div className="max-w-md mx-auto text-left">
                <AiConsentNotice
                  language={language}
                  consentGranted={aiConsentGranted}
                  onAcceptConsent={onAcceptAiConsent}
                  compact
                />
              </div>

              <button
                type="button"
                disabled={!aiConsentGranted || aiLoading}
                onClick={() => void handleAskGeminiSearch()}
                className="py-2.5 px-5 rounded-full bg-[#C88F98] hover:bg-[#b07680] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>
                  {language === 'kn'
                    ? 'ಸೂಕ್ತ ವಿಭಾಗ ಹುಡುಕಲು Gemini ಕೇಳಿ'
                    : language === 'te'
                    ? 'సరైన ఫీచర్ కోసం Gemini ను అడగండి'
                    : 'Ask Gemini to Match Feature'}
                </span>
              </button>

              {aiError && (
                <p className="text-xs text-red-700">{aiError}</p>
              )}

              {aiSuggestion && (
                <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/40 text-left space-y-2.5 soft-fade-up">
                  <span className="text-[10px] font-bold text-[#4A6347] uppercase tracking-wider block">
                    {language === 'kn'
                      ? 'AI ನ್ಯಾವಿಗೇಷನ್ ಸಲಹೆ · ಮುಂದುವರಿಯುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ'
                      : language === 'te'
                      ? 'AI నావిగేషన్ సూచన · ముందుకెళ్ళే ముందు సరిచూసుకోండి'
                      : 'AI Navigation Suggestion · Verify Before Proceeding'}
                  </span>
                  <p className="text-xs sm:text-sm text-[#493C39]">{aiSuggestion.reply}</p>
                  {aiSuggestion.suggestedPage && (
                    <button
                      type="button"
                      onClick={() => {
                        onPageChange(aiSuggestion.suggestedPage!);
                        onClose();
                      }}
                      className="py-2 px-4 rounded-full bg-[#4A6347] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{aiSuggestion.suggestedActionLabel || `Open ${aiSuggestion.suggestedPage}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard Footer Hint */}
        <div className="bg-white border-t border-[#BEA06D]/20 px-4 py-2.5 flex items-center justify-between text-[11px] text-[#8A6D3F]">
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft className="w-3 h-3" />
            <span>
              {language === 'kn'
                ? 'ತೆರೆಯಲು ↑ ↓ ಮತ್ತು Enter ಬಳಸಿ · ಮುಚ್ಚಲು Esc ಒತ್ತಿ'
                : language === 'te'
                ? 'తెరవడానికి ↑ ↓ మరియు Enter వాడండి · మూయడానికి Esc నొక్కండి'
                : 'Use ↑ ↓ arrows and Enter to open · Esc to close'}
            </span>
          </span>
          <span className="tabular-nums font-medium">
            {results.length}{' '}
            {language === 'kn' ? 'ಫಲಿತಾಂಶಗಳು' : language === 'te' ? 'ఫలితాలు' : 'matches'}
          </span>
        </div>
      </div>
    </div>
  );
};
