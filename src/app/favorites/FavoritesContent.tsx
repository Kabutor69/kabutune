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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute -inset-2 border-4 border-primary-500/30 border-t-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    playAll(favorites);
  };

  return (
    <div className={`min-h-screen bg-background ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground fill-current" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Your Favorites
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {favorites.length === 0 ? 'No tracks yet' : `${favorites.length} saved tracks`}
                </p>
              </div>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="btn-primary flex items-center space-x-2 whitespace-nowrap"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play All</span>
              </button>
            )}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {favorites.length === 0
              ? 'No favorite tracks yet. Start by searching and adding songs to your favorites!'
              : `You have ${favorites.length} favorite track${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {favorites.map((track) => (
              <div key={track.id}>
                <TrackCard track={track} showFavorite={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-primary fill-current" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring music and add your favorite tracks to this collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="btn-primary flex items-center space-x-2"
              >
                <Music className="h-4 w-4" />
                <span>Start Searching</span>
              </Link>
              <Link
                href="/explore"
                className="btn-secondary flex items-center space-x-2"
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
