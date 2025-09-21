'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Track } from '@/types';

interface FavoritesContextType {
  favorites: Track[];
  addToFavorites: (track: Track) => void;
  removeFromFavorites: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  toggleFavorite: (track: Track) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedFavorites = localStorage.getItem('kabutune-favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kabutune-favorites', JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const addToFavorites = (track: Track) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === track.id)) {
        return prev;
      }
      return [...prev, { ...track, isFavorite: true }];
    });
  };

  const removeFromFavorites = (trackId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== trackId));
  };

  const isFavorite = (trackId: string) => {
    return favorites.some(fav => fav.id === trackId);
  };

  const toggleFavorite = (track: Track) => {
    if (isFavorite(track.id)) {
      removeFromFavorites(track.id);
    } else {
      addToFavorites(track);
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
