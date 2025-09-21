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
      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
      onClick={handlePlay}
    >
      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
        <Image
          src={track.thumbnail}
          alt={track.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:scale-110">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 fill-current ml-0.5" />
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                isFavorite(track.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-white hover:text-red-400'
              }`}
            />
          </button>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/70 backdrop-blur-md rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-semibold">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 text-sm sm:text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {track.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {track.channel}
        </p>
      </div>
    </div>
  );
}
