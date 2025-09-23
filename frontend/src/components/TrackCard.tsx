'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, MoreHorizontal, Heart, Clock, Music, Download } from 'lucide-react';
import { Track } from '@/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

type TrackCardProps = {
  track: Track;
  isActive?: boolean;
  isPlaying?: boolean;
  indexBadge?: string | number;
  onPlay: () => void;
  onAddToQueue?: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const formatTime = (seconds?: number) => {
  if (!seconds || seconds < 1) return "";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const parseDurationStringToSeconds = (duration?: string) => {
  if (!duration) return 0;
 
  const parts = duration.split(':').map((p) => parseInt(p, 10)).filter((n) => !Number.isNaN(n));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
};

const formatViews = (views?: number) => {
  if (!views) return "";
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return `${views}`;
};

export function TrackCard({
  track,
  isActive = false,
  isPlaying = false,
  indexBadge,
  onPlay,
  onAddToQueue,
  isFavorite,
  onToggleFavorite,
}: TrackCardProps) {
  const { addToQueue } = useMusicPlayer();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleAddToQueue = () => {
    if (onAddToQueue) onAddToQueue();
    else addToQueue([track]);
    setOpen(false);
  };

  const handleDownload = () => {
    const url = `${API_BASE}/api/download/${track.id}?title=${encodeURIComponent(track.title)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setOpen(false);
  };

  const durationSec = typeof track.durationSeconds === 'number' && track.durationSeconds > 0
    ? track.durationSeconds
    : parseDurationStringToSeconds(track.duration);

  return (
    <div
      className="group bg-gray-950/70 border border-gray-800 rounded-xl p-3 hover:bg-gray-900 hover:border-gray-700 transition-colors h-full flex flex-col shadow-sm hover:shadow-md"
      role="article"
      aria-label={`${track.title} by ${track.channel}`}
    >
      <div className="relative mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
          <button
            onClick={onPlay}
            className="bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-full shadow-lg"
            aria-label="Play"
            title="Play"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        {typeof indexBadge !== "undefined" && (
          <div className="absolute top-1.5 right-1.5 bg-black/70 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-semibold">
            {indexBadge}
          </div>
        )}
        {isActive && (
          <div className="absolute top-1.5 left-1.5 bg-cyan-500 text-black rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
            {isPlaying ? (
              <>
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
                Playing
              </>
            ) : (
              <>
                <Music className="w-3 h-3" />
                Paused
              </>
            )}
          </div>
        )}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5">
          {durationSec > 0 && (
            <span className="bg-black/70 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatTime(durationSec)}
            </span>
          )}
          {track.views && (
            <span className="bg-black/70 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-semibold">
              {formatViews(track.views)} views
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-[13px] font-semibold text-cyan-200/90 line-clamp-2 mb-0.5" title={track.title}>
          {track.title}
        </h3>
        <p className="text-[11px] text-gray-400 truncate mb-2" title={track.channel}>
          {track.channel}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorite
                ? "text-red-500 hover:bg-red-500/20"
                : "text-gray-500 hover:text-cyan-400 hover:bg-gray-800"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-gray-500 hover:text-cyan-400 hover:bg-gray-800 p-1.5 rounded-full transition-colors"
              aria-label="More options"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-20">
                <button
                  onClick={handleAddToQueue}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                >
                  Add to queue
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                >
                  <Download className="w-4 h-4" />
                  Download audio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}