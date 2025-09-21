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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/20 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-16 sm:mb-20 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg-xl group-hover:shadow-blue-glow-lg transition-all duration-500 group-hover:scale-105">
                  <Heart className="h-8 w-8 text-white fill-current" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Your Favorites
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {favorites.length === 0 ? 'No tracks yet' : `${favorites.length} saved tracks`}
                </p>
              </div>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="btn-primary flex items-center space-x-3 whitespace-nowrap"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Play All</span>
              </button>
            )}
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {favorites.length === 0
              ? 'No favorite tracks yet. Start by searching and adding songs to your favorites!'
              : `You have ${favorites.length} favorite track${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {favorites.map((track, index) => (
              <div key={track.id} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <TrackCard track={track} showFavorite={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Heart className="h-12 w-12 text-primary-500 fill-current" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur opacity-20 animate-pulse-slow"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 px-4">
              No favorites yet
            </h3>
            <p className="text-lg text-muted-foreground mb-8 sm:mb-12 max-w-lg mx-auto px-4 leading-relaxed">
              Start exploring music and add your favorite tracks to this collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="btn-primary flex items-center space-x-3"
              >
                <Music className="h-5 w-5" />
                <span>Start Searching</span>
              </Link>
              <Link
                href="/explore"
                className="btn-secondary flex items-center space-x-3"
              >
                <Heart className="h-5 w-5" />
                <span>Explore Music</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
