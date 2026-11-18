import React from 'react';
import { Language } from '../types';
import { Volume2, Calendar, Sparkles } from 'lucide-react';

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Handcrafted SVG botanical seal replacing all raster logo images.
 */
export const CoreMonogramMark: React.FC<MonogramProps> = ({
  size = 'md',
  className = '',
}) => {
  const dims =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';

  return (
    <div
      className={`${dims} rounded-full bg-[#FCF9F5] border border-[#BEA06D]/70 shadow-xs flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        <circle cx="32" cy="32" r="29" stroke="#BEA06D" strokeWidth="1" strokeOpacity="0.45" />
        <circle cx="32" cy="32" r="24" stroke="#E6C1C4" strokeWidth="0.9" strokeDasharray="2 2.5" />
        {/* Delicate sage & rosewater botanical sprig */}
        <path
          d="M17 44C21 37 23 30 22 21"
          stroke="#A2B29B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M22 28C18 27 16 24 17 21C20 21 22 24 22 28Z"
          fill="#A2B29B"
          fillOpacity="0.32"
          stroke="#A2B29B"
          strokeWidth="1"
        />
        <path
          d="M21 36C25 35 28 32 27 29C24 29 22 32 21 36Z"
          fill="#E6C1C4"
          fillOpacity="0.45"
          stroke="#C88F98"
          strokeWidth="1"
        />
        <circle cx="22" cy="19.5" r="2.2" fill="#C88F98" fillOpacity="0.85" />
        {/* Editorial Serif Monogram C */}
        <text
          x="39"
          y="40"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="28"
          fontWeight="600"
          fill="#493C39"
        >
          C
        </text>
      </svg>
    </div>
  );
};

/**
 * Pure SVG + CSS Editorial Hero Composition replacing raster photography.
 */
export const RosewaterHeroComposition: React.FC<{
  language: Language;
  onHearSample: () => void;
}> = ({ language, onHearSample }) => {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      {/* Subtle Rosewater & Sage ambient wash */}
      <div
        className="absolute -inset-6 rounded-[40px] opacity-65 blur-2xl -z-10"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(230, 193, 196, 0.42), transparent 55%), radial-gradient(circle at 82% 78%, rgba(162, 178, 155, 0.32), transparent 55%)',
        }}
        aria-hidden="true"
      />

      {/* Archival Rosewater Frame */}
      <div className="relative rounded-[32px] bg-[#FCF9F5] border border-[#BEA06D]/55 p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Fine ornamental inner hairline */}
        <div className="absolute inset-3 rounded-[24px] border border-[#E6C1C4]/65 pointer-events-none" />

        {/* Handcrafted SVG Botanical Line-Art Sprig (top right corner) */}
        <svg
          viewBox="0 0 180 180"
          className="absolute -top-3 -right-3 w-40 h-40 opacity-65 pointer-events-none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M155 12C132 45 118 82 115 135"
            stroke="#BEA06D"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M132 54C112 50 100 37 104 24C121 26 131 39 132 54Z"
            fill="#E6C1C4"
            fillOpacity="0.3"
            stroke="#C88F98"
            strokeWidth="1.1"
          />
          <path
            d="M122 86C140 82 152 69 148 56C132 58 123 71 122 86Z"
            fill="#A2B29B"
            fillOpacity="0.25"
            stroke="#A2B29B"
            strokeWidth="1.1"
          />
          <path
            d="M117 110C99 107 88 95 92 84C106 86 116 97 117 110Z"
            fill="#E6C1C4"
            fillOpacity="0.22"
            stroke="#C88F98"
            strokeWidth="1"
          />
          <circle cx="155" cy="12" r="3" fill="#C88F98" fillOpacity="0.7" />
        </svg>

        <div className="relative z-10 space-y-6">
          {/* Editorial Crest Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CoreMonogramMark size="sm" />
              <div>
                <span className="font-display text-lg font-semibold text-[#493C39] tracking-wide block leading-none">
                  CORE Rosewater
                </span>
                <span className="text-[11px] text-[#8A6D3F] font-medium block mt-1">
                  {language === 'kn'
                    ? 'ಸೌಮ್ಯ ಆರೈಕೆಯ ಕಲೆ'
                    : language === 'te'
                    ? 'సున్నితమైన సంరక్షణ కళ'
                    : 'The Art of Gentle Care'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#8A6D3F] tracking-wider uppercase">
              EN · ಕ · తె
            </span>
          </div>

          <div className="rosewater-divider" />

          {/* Calm Multilingual Spoken Preview Card */}
          <div className="bg-white/90 border border-[#BEA06D]/35 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8A6D3F]">
              <span className="font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C88F98]" />
                <span>
                  {language === 'kn'
                    ? 'ನೇರ ಧ್ವನಿ ಭೇಟಿ ಕಾರ್ಡ್'
                    : language === 'te'
                    ? 'వాయిస్ సందర్శన కార్డు'
                    : 'Voice-First Visit Card'}
                </span>
              </span>
              <span className="tabular-nums font-medium">10:30 AM</span>
            </div>

            <p className="font-display text-xl sm:text-2xl font-medium italic text-[#493C39] leading-snug">
              {language === 'kn'
                ? '“ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲೇ ಪ್ರತಿಯೊಂದು ಆಸ್ಪತ್ರೆ ಸೂಚನೆ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸುತ್ತದೆ.”'
                : language === 'te'
                ? '“మీ భాషలోనే ప్రతి ఆసుపత్రి సూచన స్పష్టంగా వినిపిస్తుంది.”'
                : '“When instructions speak softly in your mother tongue, hospital confusion gently fades.”'}
            </p>

            {/* Acoustic Waveform + Sample Listen */}
            <div className="pt-1 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 h-7" aria-hidden="true">
                <span className="w-1 rounded-full bg-[#C88F98] wave-bar" />
                <span className="w-1 rounded-full bg-[#BEA06D] wave-bar" />
                <span className="w-1 rounded-full bg-[#A2B29B] wave-bar" />
                <span className="w-1 rounded-full bg-[#BEA06D] wave-bar" />
                <span className="w-1 rounded-full bg-[#C88F98] wave-bar" />
              </div>

              <button
                type="button"
                onClick={onHearSample}
                className="compact-chip py-2 px-4 rounded-full bg-[#C88F98] hover:bg-[#b07680] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn'
                    ? 'ಮಾತು ಕೇಳಿ'
                    : language === 'te'
                    ? 'వాయిస్ వినండి'
                    : 'Hear Sample'}
                </span>
              </button>
            </div>
          </div>

          {/* Quiet Typographic Tri-Script Signature */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#493C39]/75">
            <span>English</span>
            <span aria-hidden="true">·</span>
            <span>ಕನ್ನಡ (Kannada)</span>
            <span aria-hidden="true">·</span>
            <span>తెలుగు (Telugu)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#4A6347] font-semibold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C88F98]" />
              <span>Gemini AI Enabled</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Editorial Botanical Plate replacing raster portrait in ScenarioSpotlight.
 */
export const CaseStudyEditorialPlate: React.FC<{ language: Language }> = ({ language }) => {
  return (
    <div className="relative rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/45 p-6 sm:p-7 space-y-5 overflow-hidden">
      {/* Subtle botanical arch SVG */}
      <svg
        viewBox="0 0 120 120"
        className="absolute -bottom-3 -right-3 w-32 h-32 opacity-45 pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M98 108C92 72 78 44 48 22" stroke="#BEA06D" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M78 60C62 56 54 44 59 34C73 36 80 48 78 60Z"
          fill="#E6C1C4"
          fillOpacity="0.35"
          stroke="#C88F98"
          strokeWidth="1"
        />
        <path
          d="M89 82C102 78 109 67 104 58C92 60 86 71 89 82Z"
          fill="#A2B29B"
          fillOpacity="0.3"
          stroke="#A2B29B"
          strokeWidth="1"
        />
      </svg>

      <div className="flex items-center justify-between border-b border-[#BEA06D]/25 pb-3">
        <span className="text-[11px] font-bold text-[#8A6D3F] uppercase tracking-widest">
          {language === 'kn'
            ? 'ರೋಗಿ ಅನುಭವ ಪತ್ರ'
            : language === 'te'
            ? 'రోగి కేస్ నోట్'
            : 'Patient Scenario Folio'}
        </span>
        <span className="text-xs font-serif italic text-[#C88F98]">No. 01</span>
      </div>

      <div className="space-y-1.5 relative z-10">
        <h4 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39]">
          {language === 'kn'
            ? 'ಬಸಪ್ಪ ಗೌಡ'
            : language === 'te'
            ? 'బసప్ప గౌడ'
            : 'Basappa Gowda'}
        </h4>
        <p className="text-xs sm:text-sm text-[#493C39]/80">
          {language === 'kn'
            ? '೬೦ ವರ್ಷ · ಚಿತ್ರದುರ್ಗ · ಗ್ರಾಮೀಣ ನಿವಾಸಿ'
            : language === 'te'
            ? '60 ఏళ్ళు · చిత్రదుర్గ · గ్రామీణ ప్రాంతం'
            : 'Age 60 · Rural Chitradurga · First-time diagnostic visitor'}
        </p>
      </div>

      <div className="gold-divider" />

      <dl className="grid grid-cols-2 gap-3 text-xs relative z-10">
        <div>
          <dt className="text-[#8A6D3F] font-semibold">
            {language === 'kn' ? 'ತಪಾಸಣೆ' : language === 'te' ? 'పరీక్ష' : 'Scheduled Exam'}
          </dt>
          <dd className="text-[#493C39] font-medium mt-0.5">
            {language === 'kn'
              ? 'ಕಾಂಟ್ರಾಸ್ಟ್ ಸಿಟಿ ಸ್ಕ್ಯಾನ್'
              : language === 'te'
              ? 'కాంట్రాస్ట్ సిటి స్కాన్'
              : 'Contrast CT Scan'}
          </dd>
        </div>
        <div>
          <dt className="text-[#8A6D3F] font-semibold">
            {language === 'kn' ? 'ಪ್ರಯಾಣ ದೂರ' : language === 'te' ? 'ప్రయాణ దూరం' : 'Round-Trip Bus'}
          </dt>
          <dd className="text-[#493C39] font-medium mt-0.5 tabular-nums">40 km</dd>
        </div>
      </dl>

      <blockquote className="text-xs sm:text-sm italic font-display text-[#493C39]/90 bg-white/80 border border-[#E6C1C4]/70 rounded-xl p-3.5 relative z-10">
        {language === 'kn'
          ? '“ಇಂಗ್ಲಿಷ್ SMS ಓದಲು ಆಗದೆ ನಾನು ಪರೀಕ್ಷೆಯನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೆ. ಈಗ ಧ್ವನಿ ಕರೆ ನನ್ನ ಕೈ ಹಿಡಿಯುತ್ತದೆ.”'
          : language === 'te'
          ? '“ఇంగ్లీష్ SMS చదవలేక పరీక్ష తప్పిపోయేది. ఇప్పుడు నా భాషలో వాయిస్ కాల్ ధైర్యం ఇస్తోంది.”'
          : '“An English SMS leaves a farmer guessing. A calm spoken call in his own voice builds dignity.”'}
      </blockquote>
    </div>
  );
};

/**
 * Horizontal Botanical Line-Art Editorial Banner replacing image banners in HowItWorks & About.
 */
export const BotanicalBannerPlate: React.FC<{
  kicker: string;
  quote: string;
  subtitle?: string;
}> = ({ kicker, quote, subtitle }) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#FCF9F5] via-white to-[#E6C1C4]/20 border border-[#BEA06D]/40 p-8 sm:p-10 overflow-hidden shadow-xs">
      <svg
        viewBox="0 0 260 140"
        className="absolute right-0 bottom-0 h-full w-64 opacity-40 pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M235 135C205 92 178 52 115 24" stroke="#BEA06D" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M180 70C156 64 146 46 154 34C174 37 184 53 180 70Z" fill="#E6C1C4" fillOpacity="0.38" stroke="#C88F98" strokeWidth="1" />
        <path d="M204 96C222 92 232 76 226 65C210 67 201 80 204 96Z" fill="#A2B29B" fillOpacity="0.32" stroke="#A2B29B" strokeWidth="1" />
        <path d="M150 48C136 42 132 28 141 21C154 24 157 37 150 48Z" fill="#A2B29B" fillOpacity="0.25" stroke="#A2B29B" strokeWidth="1" />
        <circle cx="115" cy="24" r="3" fill="#C88F98" fillOpacity="0.7" />
      </svg>

      <div className="relative z-10 max-w-2xl space-y-2.5">
        <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-widest block">
          {kicker}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#493C39] leading-snug">
          “{quote}”
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#493C39]/80 leading-relaxed pt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
