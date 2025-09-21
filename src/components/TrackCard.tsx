'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { Track } from '@/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface TrackCardProps {
  track: Track;
  showFavorite?: boolean;
}

// Utility function to format duration
const formatDuration = (duration: string): string => {
  if (!duration || duration === '0:00' || duration === '0') return '--:--';
  
  // If duration is already in HH:MM:SS or MM:SS format, return as is
  if (duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 3) {
      // HH:MM:SS format
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    } else if (parts.length === 2) {
      // MM:SS format
      return duration;
    }
  }
  
  // If it's a number (seconds), convert to MM:SS or HH:MM:SS
  const totalSeconds = parseInt(duration);
  if (!isNaN(totalSeconds) && totalSeconds > 0) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  return duration;
};

export function TrackCard({ track, showFavorite = true }: TrackCardProps) {
  const { playTrack } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePlay = () => {
    playTrack(track);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  return (
    <div
      className="group card card-hover cursor-pointer animate-fade-in-scale"
      onClick={handlePlay}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/20 dark:to-accent-950/20">
        <Image
          src={track.thumbnail}
          alt={track.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-modern-xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:scale-110 group-hover:shadow-blue-glow">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 fill-current ml-0.5" />
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group/favorite"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                isFavorite(track.id)
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-white hover:text-red-400 group-hover/favorite:scale-110'
              }`}
            />
          </button>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm font-semibold shadow-modern">
          {formatDuration(track.duration)}
        </div>

        {/* Loading State Overlay */}
        <div className="absolute inset-0 bg-primary-500/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4 sm:p-5 space-y-2">
        <h3 className="font-bold text-foreground line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          {track.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors duration-300">
          {track.channel}
        </p>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>Available</span>
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to play
          </span>
        </div>
      </div>
    </div>
  );
}
