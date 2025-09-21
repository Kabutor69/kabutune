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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Your Favorites
              </h1>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl sm:rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play All</span>
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            {favorites.length === 0
              ? 'No favorite tracks yet. Start by searching and adding songs to your favorites!'
              : `You have ${favorites.length} favorite track${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {favorites.map((track) => (
              <TrackCard key={track.id} track={track} showFavorite={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-red-500 fill-current" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 px-4">
              No favorites yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Start exploring music and add your favorite tracks to this collection.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Music className="h-4 w-4 mr-2" />
              Start Searching
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
