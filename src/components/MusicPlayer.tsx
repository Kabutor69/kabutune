'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  List
} from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { QueueList } from '@/components/QueueList';

export function MusicPlayer() {
  const {
    state,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume,
    setCurrentTime,
    toggleShuffle,
    toggleRepeat,
    audioRef,
  } = useMusicPlayer();

  const { currentTrack, isPlaying, currentTime, duration, volume, isShuffled, isRepeating, queue } = state;
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-border p-3 z-50">
        <div className="container">
          
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Track Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text text-sm truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-text-muted truncate">
                  {currentTrack.channel}
                </p>
              </div>
              <button
                onClick={() => setIsQueueOpen(true)}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface relative"
                title={`Queue (${queue.length})`}
              >
                <List className="h-4 w-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-3">
              <button
                onClick={prevTrack}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-lg bg-accent hover:bg-accent-hover flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-text-muted w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-text-muted w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-100"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text text-sm truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-text-muted truncate">
                  {currentTrack.channel}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-lg transition-colors ${
                    isShuffled 
                      ? 'text-accent bg-accent/10' 
                      : 'text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <button 
                  onClick={prevTrack} 
                  className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-lg bg-accent hover:bg-accent-hover flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                  )}
                </button>
                <button 
                  onClick={nextTrack} 
                  className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-lg transition-colors ${
                    isRepeating 
                      ? 'text-accent bg-accent/10' 
                      : 'text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  {isRepeating ? (
                    <Repeat1 className="h-4 w-4" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsQueueOpen(true)}
                  className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface relative"
                  title={`Queue (${queue.length})`}
                >
                  <List className="h-4 w-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full max-w-lg">
                <span className="text-xs text-text-muted w-12 text-right font-mono">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-100"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-text-muted w-12 font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
              <div className="w-24 relative">
                <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-100"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-text-muted w-8 font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Queue List Modal */}
      <QueueList 
        isOpen={isQueueOpen} 
        onClose={() => setIsQueueOpen(false)} 
      />
    </>
  );
}