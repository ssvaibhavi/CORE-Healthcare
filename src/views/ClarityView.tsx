import React, { useState } from 'react';
import { Language, PageView } from '../types';
import { CLARITY_EXAMPLES, ClarityItem } from '../data/enhancementsData';
import { speechService } from '../utils/speech';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

interface ClarityViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
}

export const ClarityView: React.FC<ClarityViewProps> = ({
  currentLanguage,
  onPageChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<ClarityItem>(CLARITY_EXAMPLES[0]);
  const [level, setLevel] = useState<'simple' | 'extraSimple'>('simple');
  const [smsQuery, setSmsQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeText =
    level === 'simple'
      ? selectedItem.simple[currentLanguage]
      : selectedItem.extraSimple[currentLanguage];

  const handleListen = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speechService.speak(activeText, currentLanguage, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
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
      setIsSpeaking(false);
      speechService.stop();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            speechService.stop();
            onPageChange('home');
          }}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#8F7242] font-medium">
          {currentLanguage === 'kn'
            ? 'ಪರಿಶೀಲಿಸಿದ ಸರಳ ಉದಾಹರಣೆಗಳು'
            : currentLanguage === 'te'
            ? 'ధృవీకరించబడిన సులభ ఉదాహరణలు'
            : 'Verified Demonstration Examples'}
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
          CORE Clarity
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ಸರಳವಾಗಿ ವಿವರಿಸಿ (Explain It Simply)'
            : currentLanguage === 'te'
            ? 'సులభంగా వివరించండి (Explain It Simply)'
            : 'Explain It Simply'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಆಸ್ಪತ್ರೆಯ ಕಷ್ಟಕರ ಇಂಗ್ಲಿಷ್ ಪದಗಳನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.'
            : currentLanguage === 'te'
            ? 'ఆసుపత్రిలోని కష్టమైన ఇంగ్లీష్ సూచనలను మీ భాషలో సులభంగా అర్థం చేసుకోండి.'
            : 'Select a common hospital instruction below to read or hear it in clear, everyday Kannada, Telugu, or English.'}
        </p>
      </div>

      {/* Optional SMS Phrase Finder */}
      <form
        onSubmit={handleMatchPhrase}
        className="bg-white border border-[#BEA06D]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8F7242] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={smsQuery}
            onChange={(e) => setSmsQuery(e.target.value)}
            placeholder={
              currentLanguage === 'kn'
                ? 'ಉದಾಹರಣೆಗೆ ಹುಡುಕಿ: NPO, Creatinine, Block B, metal, water...'
                : currentLanguage === 'te'
                ? 'ఉదాహరణకు వెతకండి: NPO, Creatinine, Block B, metal, water...'
                : 'Find instruction by keyword (e.g., NPO, Creatinine, Block B, metal, water)...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#BEA06D]/30 bg-[#FCF9F5] text-sm text-[#3C3330] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
          />
        </div>
        <button
          type="submit"
          className="py-2.5 px-5 rounded-xl bg-[#BEA06D] hover:bg-[#8F7242] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
        >
          {currentLanguage === 'kn' ? 'ಸೂಚನೆ ಹುಡುಕಿ' : currentLanguage === 'te' ? 'సూచన వెతకండి' : 'Find Match'}
        </button>
      </form>

      {/* Main Layout: Instruction Selector + Simplified Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: List of Common Hospital Instructions */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block px-1">
            {currentLanguage === 'kn'
              ? 'ಸಾಮಾನ್ಯ ಆಸ್ಪತ್ರೆ ಸೂಚನೆಗಳು'
              : currentLanguage === 'te'
              ? 'సాధారణ ఆసుపత్రి సూచనలు'
              : 'Common Hospital Instructions'}
          </span>

          <div className="space-y-2.5">
            {CLARITY_EXAMPLES.map((item) => {
              const active = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    speechService.stop();
                    setIsSpeaking(false);
                    setSelectedItem(item);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#BEA06D]/15 border-[#BEA06D] shadow-sm'
                      : 'bg-white border-[#BEA06D]/25 hover:border-[#BEA06D]/60'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#8F7242] uppercase tracking-wider block">
                    {item.category[currentLanguage]}
                  </span>
                  <p className="text-sm font-semibold text-[#3C3330] mt-1 leading-snug">
                    "{item.originalPhrase}"
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Simple vs Extra Simple Card */}
        <div className="lg:col-span-7 bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Original Hospital Slip Line */}
          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 space-y-1">
            <span className="text-xs font-semibold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ಮೂಲ ಆಸ್ಪತ್ರೆ ಸೂಚನೆ (ಇಂಗ್ಲಿಷ್)'
                : currentLanguage === 'te'
                ? 'అసలు ఆసుపత్రి సూచన (ఇంగ్లీష్)'
                : 'Original Hospital Instruction'}
            </span>
            <p className="text-sm sm:text-base font-medium text-[#3C3330]">
              "{selectedItem.originalPhrase}"
            </p>
          </div>

          {/* Two Explanation Levels Toggle */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
              {currentLanguage === 'kn'
                ? 'ವಿವರಣೆಯ ಮಟ್ಟವನ್ನು ಆರಿಸಿ'
                : currentLanguage === 'te'
                ? 'వివరణ స్థాయిని ఎంచుకోండి'
                : 'Choose Explanation Level'}
            </span>

            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FCF9F5] border border-[#BEA06D]/30 rounded-2xl">
              <button
                onClick={() => {
                  speechService.stop();
                  setIsSpeaking(false);
                  setLevel('simple');
                }}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  level === 'simple'
                    ? 'bg-[#BEA06D] text-white shadow-sm'
                    : 'text-[#3C3330] hover:text-[#8F7242]'
                }`}
              >
                {currentLanguage === 'kn'
                  ? 'ಸರಳ ವಿವರಣೆ'
                  : currentLanguage === 'te'
                  ? 'సులభ వివరణ'
                  : 'Simple Explanation'}
              </button>

              <button
                onClick={() => {
                  speechService.stop();
                  setIsSpeaking(false);
                  setLevel('extraSimple');
                }}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  level === 'extraSimple'
                    ? 'bg-[#4A6347] text-white shadow-sm'
                    : 'text-[#3C3330] hover:text-[#4A6347]'
                }`}
              >
                {currentLanguage === 'kn'
                  ? 'ಅತಿ ಸರಳ ವಿವರಣೆ'
                  : currentLanguage === 'te'
                  ? 'అతి సులభ వివరణ'
                  : 'Extra Simple'}
              </button>
            </div>
          </div>

          {/* Plain Language Result Box */}
          <div className="p-6 rounded-2xl bg-[#A2B29B]/15 border border-[#A2B29B]/60 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#4A6347] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {level === 'simple'
                    ? currentLanguage === 'kn'
                      ? 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಅರ್ಥ'
                      : currentLanguage === 'te'
                      ? 'సులభమైన భాషలో అర్థం'
                      : 'Simple Explanation'
                    : currentLanguage === 'kn'
                    ? 'ಅತಿ ಸರಳ ಒಂದೇ ವಾಕ್ಯದಲ್ಲಿ'
                    : currentLanguage === 'te'
                    ? 'అతి సులభమైన ఒకే వాక్యంలో'
                    : 'Extra Simple Explanation'}
                </span>
              </span>
            </div>

            <p className="font-display text-2xl sm:text-3xl font-bold text-[#211B19] leading-snug">
              {activeText}
            </p>

            {/* Listen to Explanation Button */}
            <div className="pt-2">
              <button
                onClick={handleListen}
                className={`py-3.5 px-7 rounded-full font-bold text-base shadow-md transition-all inline-flex items-center gap-2.5 cursor-pointer ${
                  isSpeaking
                    ? 'bg-[#C98897] hover:bg-[#a86574] text-white'
                    : 'bg-[#BEA06D] hover:bg-[#8F7242] text-white'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span>
                  {isSpeaking
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
            </div>
          </div>

          {/* Mandatory Clinical Safety Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#E6C1C4]/25 border border-[#E6C1C4] flex items-start gap-3 text-xs text-[#3C3330]/90 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-[#C98897] shrink-0 mt-0.5" />
            <p>
              {currentLanguage === 'kn'
                ? 'ಗಮನಿಸಿ: ಇವು ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ಸರಳ ವಿವರಣೆಗಳಾಗಿವೆ. ಯಾವುದೇ ಔಷಧಿ ಪ್ರಮಾಣ ಬದಲಾವಣೆ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಂದೇಹವಿದ್ದರೆ ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರು ಅಥವಾ ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
                : currentLanguage === 'te'
                ? 'గమనిక: ఇవి అవగాహన కోసం రూపొందించబడిన నమూనా వివరణలు మాత్రమే. మందుల మోతాదు లేదా వైద్య సందేహాల కోసం దయచేసి మీ డాక్టర్ లేదా ఆసుపత్రి సిబ్బందిని అడిగి నిర్ధారించుకోండి.'
                : 'Important Note: These are curated demonstration examples designed for clarity. Always verify medication dosages or unclear medical directions directly with your doctor or hospital staff.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
