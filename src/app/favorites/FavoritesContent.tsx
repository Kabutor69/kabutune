'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrackCard } from '@/components/TrackCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Heart, Music, Play } from 'lucide-react';

export function FavoritesContent() {
  const [mounted, setMounted] = useState(false);
  const { favorites } = useFavorites();
  const { playAll, state } = useMusicPlayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    playAll(favorites);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mr-6">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Favorites
              </h1>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg whitespace-nowrap"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Play All</span>
              </button>
            )}
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {favorites.length === 0
              ? 'No favorite tracks yet. Start by searching and adding songs to your favorites!'
              : `You have ${favorites.length} favorite track${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {favorites.map((track) => (
              <TrackCard key={track.id} track={track} showFavorite={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Heart className="h-12 w-12 text-blue-500 fill-current" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 px-4">
              No favorites yet
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-lg mx-auto px-4 leading-relaxed">
              Start exploring music and add your favorite tracks to this collection.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Music className="h-5 w-5 mr-3" />
              Start Searching
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
