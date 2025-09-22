'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrackCard } from '@/components/TrackCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Heart, Music, Play, AlertCircle, RefreshCw } from 'lucide-react';

export function FavoritesContent() {
  const [mounted, setMounted] = useState(false);
  const { favorites, isLoading, error } = useFavorites();
  const { playAll } = useMusicPlayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    try {
      playAll(favorites);
    } catch (error) {
      console.error('Error playing all favorites:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="px-0 sm:px-0 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md p-2">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Your Favorites</h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                {favorites.length === 0 ? 'No tracks yet' : `${favorites.length} saved tracks`}
              </p>
            </div>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Play All</span>
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="flex-1">
              <p className="text-red-300 font-medium">Error loading favorites</p>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() => playAll([track])}
              isFavorite={true}
              onToggleFavorite={() => {}} // Already in favorites
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-3">
            No favorites yet
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start exploring music and add your favorite tracks to this collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Music className="h-4 w-4" />
              <span>Start Searching</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}