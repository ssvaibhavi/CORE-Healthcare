import { Language } from '../types';

export interface LanguageDetectionResult {
  detected: Language | null;
  confidence: 'high' | 'medium';
  script: 'kannada' | 'telugu' | 'latin' | 'mixed' | 'unknown';
}

const KANNADA_REGEX = /[\u0C80-\u0CFF]/g;
const TELUGU_REGEX = /[\u0C00-\u0C7F]/g;
const LATIN_WORD_REGEX = /[a-zA-Z]{2,}/g;

const ROMANIZED_KN_WORDS = new Set([
  'namaskara',
  'hegide',
  'hegiddira',
  'yavaga',
  'yavaaga',
  'aaspatre',
  'aaspate',
  'kannada',
  'nanna',
  'nimma',
  'dayavittu',
  'madbeku',
  'maadbeku',
  'helri',
  'heli',
  'banni',
  'hogbeku',
  'yaake',
  'ellide',
  'enu',
]);

const ROMANIZED_TE_WORDS = new Set([
  'namaskaram',
  'ela',
  'unnaru',
  'eppudu',
  'ekkadiki',
  'ekkada',
  'telugu',
  'naaku',
  'meeru',
  'dayachesi',
  'cheppandi',
  'cheyali',
  'aasupatri',
  'asupatri',
  'enduku',
  'emiti',
  'enti',
  'vellali',
]);

export function detectInputLanguage(rawText: string): LanguageDetectionResult {
  const text = rawText.trim();
  if (text.length < 2) {
    return { detected: null, confidence: 'medium', script: 'unknown' };
  }

  const knMatches = text.match(KANNADA_REGEX) ?? [];
  const teMatches = text.match(TELUGU_REGEX) ?? [];
  const latinWords = (text.match(LATIN_WORD_REGEX) ?? []).map((w) => w.toLowerCase());

  if (knMatches.length >= 2 && knMatches.length >= teMatches.length) {
    return {
      detected: 'kn',
      confidence: 'high',
      script: latinWords.length > 0 ? 'mixed' : 'kannada',
    };
  }

  if (teMatches.length >= 2 && teMatches.length > knMatches.length) {
    return {
      detected: 'te',
      confidence: 'high',
      script: latinWords.length > 0 ? 'mixed' : 'telugu',
    };
  }

  if (knMatches.length === 1 && latinWords.length === 0) {
    return { detected: 'kn', confidence: 'medium', script: 'kannada' };
  }

  if (teMatches.length === 1 && latinWords.length === 0) {
    return { detected: 'te', confidence: 'medium', script: 'telugu' };
  }

  if (latinWords.length >= 1) {
    let knHints = 0;
    let teHints = 0;
    for (const word of latinWords) {
      if (ROMANIZED_KN_WORDS.has(word)) knHints += 1;
      if (ROMANIZED_TE_WORDS.has(word)) teHints += 1;
    }

    if (knHints > 0 && knHints >= teHints) {
      return { detected: 'kn', confidence: 'medium', script: 'latin' };
    }
    if (teHints > 0 && teHints > knHints) {
      return { detected: 'te', confidence: 'medium', script: 'latin' };
    }

    // Require at least 2 Latin words or 6 Latin letters to confidently suggest English
    // so short medical abbreviations like "OPD" or "CT" don't falsely trigger mismatch banners
    const totalLatinChars = latinWords.join('').length;
    if (latinWords.length >= 2 || totalLatinChars >= 6) {
      return { detected: 'en', confidence: 'high', script: 'latin' };
    }
  }

  return { detected: null, confidence: 'medium', script: 'unknown' };
}

export function getLanguageNativeName(lang: Language): string {
  if (lang === 'kn') return 'ಕನ್ನಡ (Kannada)';
  if (lang === 'te') return 'తెలుగు (Telugu)';
  return 'English';
}

export function getLanguageShortName(lang: Language): string {
  if (lang === 'kn') return 'ಕನ್ನಡ';
  if (lang === 'te') return 'తెలుగు';
  return 'English';
}

export function getSpeechRecognitionLocale(lang: Language): string {
  if (lang === 'kn') return 'kn-IN';
  if (lang === 'te') return 'te-IN';
  return 'en-IN';
}

export function getScriptFontClass(text: string, fallbackLang: Language): string {
  if (KANNADA_REGEX.test(text)) return 'font-kannada';
  if (TELUGU_REGEX.test(text)) return 'font-telugu';
  if (fallbackLang === 'kn') return 'font-kannada';
  if (fallbackLang === 'te') return 'font-telugu';
  return 'font-body';
}
