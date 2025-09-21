'use client';

import React from 'react';
import { X, Play, Trash2, Music } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface QueueListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueueList({ isOpen, onClose }: QueueListProps) {
  const { state, clearQueue } = useMusicPlayer();
  const { queue, currentIndex } = state;

  const handleTrackClick = (index: number) => {
    const track = queue[index];
    if (track) {
      const event = new CustomEvent('setCurrentIndex', { detail: { index } });
      window.dispatchEvent(event);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-bg/95 backdrop-blur rounded-t-lg w-full max-w-md max-h-[80vh] flex flex-col border-t border-border shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text">
              Queue ({queue.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Queue Content */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-text-muted" />
              </div>
              <p className="text-text-muted text-center">
                Your queue is empty
              </p>
              <p className="text-sm text-text-muted text-center mt-1">
                Add songs to start building your playlist
              </p>
            </div>
          ) : (
            <div className="p-2">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => handleTrackClick(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    index === currentIndex
                      ? 'bg-accent/10 border border-accent/20'
                      : 'hover:bg-surface'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index === currentIndex ? (
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-current" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-text-muted">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate text-sm ${
                      index === currentIndex
                        ? 'text-accent'
                        : 'text-text'
                    }`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-text-muted truncate mt-1">
                      {track.channel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}