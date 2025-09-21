'use client';

import React from 'react';
import { X, Play, Trash2, Music } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/components/ui/Button';

interface QueueListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueueList({ isOpen, onClose }: QueueListProps) {
  const { state, clearQueue } = useMusicPlayer();
  const { queue, currentIndex } = state;

  const handleTrackClick = (index: number) => {
    // Directly set the current index to play the track
    const track = queue[index];
    if (track) {
      // Create a custom event to communicate with the context
      const event = new CustomEvent('setCurrentIndex', { detail: { index } });
      window.dispatchEvent(event);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-background/95 backdrop-blur rounded-t-lg w-full max-w-md max-h-[80vh] flex flex-col border-t border-border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Queue ({queue.length})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {queue.length > 0 && (
              <Button
                onClick={clearQueue}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Queue Content */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">
                Your queue is empty
              </p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Add songs to start building your playlist
              </p>
            </div>
          ) : (
            <div className="p-2">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => handleTrackClick(index)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                    index === currentIndex
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index === currentIndex ? (
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary-foreground fill-current" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate text-sm ${
                      index === currentIndex
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mt-1">
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
