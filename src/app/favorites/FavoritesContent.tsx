'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrackCard } from '@/components/TrackCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Heart, Music, Play, AlertTriangle, RefreshCw } from 'lucide-react';

export function FavoritesContent() {
  const [mounted, setMounted] = useState(false);
  const { favorites, isLoading, error } = useFavorites();
  const { playAll, state } = useMusicPlayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="container py-8">
          <div className="flex items-center justify-center py-16">
            <div className="loading"></div>
          </div>
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
    <div className="min-h-screen bg-bg" style={{ paddingBottom: state.currentTrack ? '80px' : '0' }}>
      <div className="container py-8 sm:py-12 sm:py-16">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 font-medium">Error loading favorites</p>
            </div>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary mt-3 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-12 sm:mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-text">
                  Your Favorites
                </h1>
                <p className="text-sm text-text-muted mt-1">
                  {favorites.length === 0 ? 'No tracks yet' : `${favorites.length} saved tracks`}
                </p>
              </div>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="btn btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play All</span>
              </button>
            )}
          </div>
          <p className="text-lg text-text-muted">
            {favorites.length === 0
              ? 'No favorite tracks yet. Start by searching and adding songs to your favorites!'
              : `You have ${favorites.length} favorite track${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {favorites.map((track) => (
              <TrackCard key={track.id} track={track} showFavorite={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-accent fill-current" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">
              No favorites yet
            </h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Start exploring music and add your favorite tracks to this collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="btn btn-primary flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                <span>Start Searching</span>
              </Link>
              <Link
                href="/explore"
                className="btn btn-secondary flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                <span>Explore Music</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}