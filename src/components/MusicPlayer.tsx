'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  List,
  Heart
} from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { QueueList } from '@/components/QueueList';
import { NowPlayingSheet } from '@/components/NowPlayingSheet';

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
  const { isFavorite, toggleFavorite } = useFavorites();

  const { currentTrack, isPlaying, currentTime, duration, volume, isRepeating, queue } = state;
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  // Auto-dismiss error toast after 4s
  useEffect(() => {
    // You can add error state management here if needed
  }, []);

  if (!currentTrack) {
    return null;
  }

  const currentIsFavorite = isFavorite(currentTrack.id);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
    return `${minutes}:${seconds}`;
  };

  const getPlaybackIcon = () => {
    if (isRepeating) {
      return <Repeat className="w-5 h-5" />;
    }
    return <Repeat className="w-5 h-5 opacity-50" />;
  };

  const cyclePlaybackMode = () => {
    toggleRepeat();
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>

      <audio ref={audioRef} preload="metadata" />
      <div className="fixed bottom-0 left-0 w-full bg-black/90 text-cyan-300 shadow-2xl z-40 border-t border-gray-800">
        <div className="w-full bg-gray-800 h-1">
          <div className="h-full bg-cyan-500 transition-all duration-100" style={{ width: `${progressPercentage}%` }} />
        </div>

        <div className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-14 h-14 rounded-lg object-cover" />
            </div>
            <div className="min-w-0 flex-1" onClick={() => setShowNowPlaying(true)}>
              <p className="font-semibold text-sm truncate" title={currentTrack.title}>{currentTrack.title}</p>
              <p className="text-xs text-gray-400 truncate" title={currentTrack.channel}>{currentTrack.channel}</p>
            </div>
            <button 
              aria-label={currentIsFavorite ? "Remove from favorites" : "Add to favorites"} 
              title={currentIsFavorite ? "Remove from favorites" : "Add to favorites"} 
              onClick={() => toggleFavorite(currentTrack)} 
              className={`transition-colors ${currentIsFavorite ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-red-400"}`}
            >
              <Heart className={`w-5 h-5 ${currentIsFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3 max-w-md">
            <div className="flex gap-4 items-center mb-2">
              <button 
                aria-label={`Playback mode: ${isRepeating ? 'repeat' : 'normal'}`} 
                title={`Playback mode: ${isRepeating ? 'repeat' : 'normal'}`} 
                onClick={cyclePlaybackMode} 
                className={`transition-colors ${isRepeating ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {getPlaybackIcon()}
              </button>
              <button 
                onClick={prevTrack} 
                className="text-gray-300 hover:text-cyan-400 transition-colors" 
                disabled={queue.length <= 1}
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                aria-label={isPlaying ? "Pause" : "Play"} 
                title={isPlaying ? "Pause" : "Play"} 
                onClick={togglePlayPause} 
                className="bg-cyan-500 text-black px-3 py-3 rounded-full hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-lg" 
                  disabled={false}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button 
                aria-label="Next" 
                title="Next" 
                onClick={nextTrack} 
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              <button 
                onClick={toggleShuffle} 
                className="text-gray-500 hover:text-gray-300 transition-colors" 
                title="Shuffle queue"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full">
              <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <input 
                  type="range" 
                  min={0} 
                  max={duration || 0} 
                  value={currentTime} 
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value))} 
                  className="slider w-full" 
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${progressPercentage}%, #374151 ${progressPercentage}%, #374151 100%)`
                  }} 
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-1/3 justify-end">
            <div className="flex items-center gap-2">
              <button 
                aria-label={volume === 0 ? "Unmute" : "Mute"} 
                title={volume === 0 ? "Unmute" : "Mute"} 
                onClick={() => setVolume(volume > 0 ? 0 : 1)} 
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min={0} 
                max={1} 
                step={0.01} 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))} 
                className="w-24 slider" 
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                }} 
              />
            </div>

            <span className="text-xs text-gray-400 hidden md:block">{queue.length} in queue</span>

            <button 
              onClick={() => setIsQueueOpen(!isQueueOpen)} 
              className={`transition-colors ${isQueueOpen ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Queue */}
      <QueueList isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />

      {/* Now Playing Sheet for Mobile */}
      <NowPlayingSheet 
        isOpen={showNowPlaying} 
        onClose={() => setShowNowPlaying(false)} 
        track={currentTrack} 
        isPlaying={isPlaying} 
        progress={currentTime} 
        duration={duration} 
        onTogglePlay={togglePlayPause} 
        onSeek={setCurrentTime} 
        onNext={nextTrack} 
        onPrev={prevTrack} 
      />
    </>
  );
}