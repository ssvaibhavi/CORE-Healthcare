import React from 'react';
import { Language } from '../types';
import { formatAudioTime, SpeechPlaybackSnapshot, speechService } from '../utils/speech';

interface AudioProgressBarProps {
  snapshot: SpeechPlaybackSnapshot;
  language?: Language;
  compact?: boolean;
}

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  snapshot,
  language,
  compact = false,
}) => {
  if (snapshot.status !== 'speaking' && snapshot.status !== 'paused') {
    return null;
  }

  const effectiveLang = language || snapshot.activeLang || 'en';
  const pct = Math.min(100, Math.max(0, snapshot.progressPercent || 0));
  const isTimeMode =
    snapshot.progressMode === 'time' &&
    typeof snapshot.durationSec === 'number' &&
    snapshot.durationSec > 0;
  const isChunkMode =
    snapshot.progressMode === 'chunks' &&
    typeof snapshot.currentChunk === 'number' &&
    typeof snapshot.totalChunks === 'number' &&
    snapshot.totalChunks > 0;

  const progressLabel = isTimeMode
    ? `${formatAudioTime(snapshot.currentTimeSec)} / ${formatAudioTime(snapshot.durationSec)}`
    : isChunkMode
    ? effectiveLang === 'kn'
      ? `ಭಾಗ ${snapshot.currentChunk}/${snapshot.totalChunks}`
      : effectiveLang === 'te'
      ? `భాగం ${snapshot.currentChunk}/${snapshot.totalChunks}`
      : `Part ${snapshot.currentChunk}/${snapshot.totalChunks}`
    : `${pct}%`;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTimeMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    speechService.seekToPercent(ratio * 100);
  };

  return (
    <div className={`w-full flex items-center gap-2.5 ${compact ? 'pt-1' : 'pt-2'}`}>
      <div
        role="progressbar"
        aria-label="Audio playback progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        onClick={handleTrackClick}
        title={isTimeMode ? 'Click to seek audio position' : undefined}
        className={`flex-1 rounded-full bg-[#BEA06D]/20 overflow-hidden ${
          compact ? 'h-1.5' : 'h-2'
        } ${isTimeMode ? 'cursor-pointer' : ''}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-150 ${
            snapshot.status === 'paused' ? 'bg-[#C88F98]' : 'bg-[#4A6347]'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums text-[#8A6D3F] shrink-0">
        {progressLabel}
      </span>
    </div>
  );
};
