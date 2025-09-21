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
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-3 sm:p-4 z-50 shadow-lg">
        <div className="container mx-auto">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Track Info */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-foreground truncate text-sm">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.channel}
                </p>
              </div>
              <button
                onClick={() => setIsQueueOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 relative"
                title={`Queue (${queue.length})`}
              >
                <List className="h-4 w-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <button
                onClick={prevTrack}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xs text-muted-foreground w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="slider absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-100"
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
                  className="slider absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center space-x-6">
            {/* Track Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 shadow-lg group">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground truncate text-sm group-hover:text-primary-600 transition-colors">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.channel}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Now Playing</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-4 flex-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-xl transition-all duration-200 group ${
                    isShuffled 
                      ? 'text-primary-500 bg-primary-100 dark:bg-primary-900/30 shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Shuffle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={prevTrack} 
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 group"
                >
                  <SkipBack className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 flex items-center justify-center shadow-lg-xl hover:shadow-blue-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                  ) : (
                    <Play className="h-6 w-6 text-white fill-current ml-0.5 group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button 
                  onClick={nextTrack} 
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 group"
                >
                  <SkipForward className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-xl transition-all duration-200 group ${
                    isRepeating 
                      ? 'text-primary-500 bg-primary-100 dark:bg-primary-900/30 shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {isRepeating ? (
                    <Repeat1 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Repeat className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button
                  onClick={() => setIsQueueOpen(true)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 relative group"
                  title={`Queue (${queue.length})`}
                >
                  <List className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                      {queue.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-3 w-full max-w-lg">
                <span className="text-xs text-muted-foreground w-12 text-right font-mono">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-100 shadow-lg"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="slider absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 group"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <VolumeX className="h-4 w-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
              <div className="w-28 relative">
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-100 shadow-lg"
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
                  className="slider absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 font-mono">
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
