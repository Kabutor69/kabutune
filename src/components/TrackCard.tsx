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
      className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handlePlay}
    >
      <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
        <Image
          src={track.thumbnail}
          alt={track.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform scale-0 group-hover:scale-100 transition-all duration-300 hover:scale-110">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 fill-current ml-0.5" />
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                isFavorite(track.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-white hover:text-red-400'
              }`}
            />
          </button>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black/60 backdrop-blur-sm rounded-md sm:rounded-lg text-white text-xs font-medium">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Track Info */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 text-xs sm:text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {track.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {track.channel}
        </p>
      </div>
    </div>
  );
}
