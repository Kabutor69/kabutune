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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-4 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Track Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-xs sm:text-sm">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentTrack.channel}
                </p>
              </div>
              <button
                onClick={() => setIsQueueOpen(true)}
                className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
                title={`Queue (${queue.length})`}
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
              <button
                onClick={prevTrack}
                className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 sm:w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100"
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
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 sm:w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {volume > 0 ? (
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100"
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
          <div className="hidden sm:flex items-center space-x-6">
            {/* Track Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentTrack.channel}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isShuffled 
                      ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' 
                      : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <button 
                  onClick={prevTrack} 
                  className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                  )}
                </button>
                <button 
                  onClick={nextTrack} 
                  className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isRepeating 
                      ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' 
                      : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                  className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
                  title={`Queue (${queue.length})`}
                >
                  <List className="h-4 w-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-3 w-full max-w-md">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100"
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
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
              <div className="w-24 relative">
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100"
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
