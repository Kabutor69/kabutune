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

const formatDuration = (duration: string): string => {
  if (!duration || duration === '0:00' || duration === '0') return '--:--';
  
  if (duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    } else if (parts.length === 2) {
      return duration;
    }
  }
  
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
    try {
      toggleFavorite(track);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="card cursor-pointer group" onClick={handlePlay}>
      <div className="relative aspect-square bg-surface">
        <Image
          src={track.thumbnail}
          alt={track.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          unoptimized
          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200">
            <Play className="h-5 w-5 text-accent fill-current ml-0.5" />
          </div>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-200 ${
                isFavorite(track.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-white hover:text-red-400'
              }`}
            />
          </button>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Track Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-medium text-text text-sm leading-tight line-clamp-2">
          {track.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-1">
          {track.channel}
        </p>
      </div>
    </div>
  );
}