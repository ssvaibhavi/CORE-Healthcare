import React, { useState } from 'react';
import { Language } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="compact-chip inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white text-[11px] font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
      >
        <Download className="w-3 h-3" />
        <span>
          {language === 'kn' ? 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್' : language === 'te' ? 'యాప్ ఇన్‌స్టాల్' : 'Install App'}
        </span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="compact-chip inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#BEA06D]/40 text-[#8F7242] hover:bg-[#FCF9F5] text-[11px] font-semibold cursor-pointer"
        >
          <Smartphone className="w-3 h-3" />
          <span>{language === 'kn' ? 'ಆ್ಯಪ್ ಉಳಿಸಿ' : language === 'te' ? 'యాప్ సేవ్' : 'Add App'}</span>
        </button>

        {showGuide && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 no-print">
            <div className="w-full max-w-sm bg-white border-2 border-[#BEA06D] rounded-3xl p-6 shadow-2xl space-y-4 modal-soft-enter">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-[#3C3330]">
                  {language === 'kn'
                    ? 'iPhone / iPad ನಲ್ಲಿ ಉಳಿಸಿ'
                    : language === 'te'
                    ? 'iPhone / iPad లో సేవ్ చేయండి'
                    : 'Save CORE on iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  className="compact-chip p-1 text-[#3C3330]/70 hover:text-[#3C3330] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#3C3330]/85 leading-relaxed">
                {language === 'kn'
                  ? '1. Safari ಬ್ರೌಸರ್ ಕೆಳಭಾಗದಲ್ಲಿರುವ Share ಬಟನ್ ಒತ್ತಿ. 2. "Add to Home Screen" ಆಯ್ಕೆಮಾಡಿ.'
                  : language === 'te'
                  ? '1. Safari లో Share బటన్ నొక్కండి. 2. "Add to Home Screen" ఎంచుకోండి.'
                  : '1. Tap the Share button in Safari. 2. Scroll down and tap "Add to Home Screen" for quick offline-ready access to static guidance.'}
              </p>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#BEA06D] text-white text-xs font-bold cursor-pointer"
              >
                {language === 'kn' ? 'ಸರಿ' : language === 'te' ? 'సరే' : 'Got It'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
