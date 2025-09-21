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
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-t-3xl w-full max-w-md max-h-[80vh] flex flex-col border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Queue ({queue.length})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {queue.length > 0 && (
              <Button
                onClick={clearQueue}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
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
              <Music className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Your queue is empty
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-1">
                Add songs to start building your playlist
              </p>
            </div>
          ) : (
            <div className="p-2">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => handleTrackClick(index)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 shadow-lg'
                      : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index === currentIndex ? (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 text-white fill-current" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate text-sm ${
                      index === currentIndex
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
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
