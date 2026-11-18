import React from 'react';
import { Language } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  language: Language;
  compact?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  language,
  compact = false,
}) => {
  const isOnline = useOnlineStatus();

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
          isOnline
            ? 'bg-[#A2B29B]/20 border-[#A2B29B]/50 text-[#4A6347]'
            : 'bg-amber-100 border-amber-400 text-amber-900'
        }`}
        title={
          isOnline
            ? 'Online — Full demonstration active'
            : 'Offline — Static guidance and non-sensitive checklists remain available'
        }
      >
        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        <span>
          {isOnline
            ? language === 'kn'
              ? 'ಆನ್‌ಲೈನ್'
              : language === 'te'
              ? 'ఆన్‌లైన్'
              : 'Online'
            : language === 'kn'
            ? 'ಆಫ್‌ಲೈನ್ ಮಾರ್ಗದರ್ಶಿ'
            : language === 'te'
            ? 'ఆఫ్‌లైన్ మోడ్'
            : 'Offline Guide'}
        </span>
      </span>
    );
  }

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 left-5 z-40 max-w-xs bg-[#211B19] text-white border-2 border-[#BEA06D] rounded-2xl px-4 py-3 shadow-xl flex items-start gap-2.5 text-xs no-print"
    >
      <WifiOff className="w-4 h-4 text-[#BEA06D] shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <span className="font-bold block text-[#FCF9F5]">
          {language === 'kn'
            ? 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ (Offline)'
            : language === 'te'
            ? 'ఇంటర్నెట్ లేదు (Offline Mode)'
            : 'Offline Guidance Mode'}
        </span>
        <span className="text-gray-300 leading-snug block">
          {language === 'kn'
            ? 'ಸಂಗ್ರಹಿಸಿದ ಸಾಮಾನ್ಯ ಸಿದ್ಧತಾ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಚೆಕ್‌ಲಿಸ್ಟ್‌ಗಳು ಲಭ್ಯವಿವೆ. ರೋಗಿ ದಾಖಲೆಗಳನ್ನು ಕ್ಯಾಶ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.'
            : language === 'te'
            ? 'సేవ్ చేసిన సాధారణ మార్గదర్శకాలు అందుబాటులో ఉన్నాయి. సున్నితమైన రికార్డులు క్యాష్ చేయబడవు.'
            : 'Static preparation guidance remains available. Patient records and sensitive data are never cached.'}
        </span>
      </div>
    </div>
  );
};
