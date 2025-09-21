'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Track } from '@/types';
import { safeLocalStorage, safeJsonParse, safeJsonStringify } from '@/lib/storage';

interface FavoritesContextType {
  favorites: Track[];
  addToFavorites: (track: Track) => void;
  removeFromFavorites: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  toggleFavorite: (track: Track) => void;
  isLoading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe localStorage access
  const getStoredFavorites = useCallback((): Track[] => {
    const savedFavorites = safeLocalStorage.getItem('kabutune-favorites');
    if (savedFavorites) {
      const parsed = safeJsonParse(savedFavorites, []);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  }, []);

  const saveFavorites = useCallback((favoritesToSave: Track[]) => {
    const jsonString = safeJsonStringify(favoritesToSave);
    if (jsonString) {
      const success = safeLocalStorage.setItem('kabutune-favorites', jsonString);
      if (!success) {
        setError('Failed to save favorites');
      }
    } else {
      setError('Failed to save favorites');
    }
  }, []);

  // Initialize favorites on mount
  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    setError(null);
    
    try {
      const storedFavorites = getStoredFavorites();
      setFavorites(storedFavorites);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Favorites initialized:', storedFavorites.length, 'tracks');
      }
    } catch (error) {
      console.error('Error initializing favorites:', error);
      setError('Failed to initialize favorites');
    } finally {
      setIsLoading(false);
    }
  }, [getStoredFavorites]);

  // Save favorites when they change
  useEffect(() => {
    if (mounted && !isLoading) {
      saveFavorites(favorites);
    }
  }, [favorites, mounted, isLoading, saveFavorites]);

  const addToFavorites = useCallback((track: Track) => {
    try {
      setFavorites(prev => {
        if (prev.some(fav => fav.id === track.id)) {
          return prev;
        }
        return [...prev, { ...track, isFavorite: true }];
      });
      setError(null);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Failed to add to favorites');
    }
  }, []);

  const removeFromFavorites = useCallback((trackId: string) => {
    try {
      setFavorites(prev => prev.filter(fav => fav.id !== trackId));
      setError(null);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError('Failed to remove from favorites');
    }
  }, []);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(fav => fav.id === trackId);
  }, [favorites]);

  const toggleFavorite = useCallback((track: Track) => {
    try {
      if (isFavorite(track.id)) {
        removeFromFavorites(track.id);
      } else {
        addToFavorites(track);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to toggle favorite');
    }
  }, [isFavorite, removeFromFavorites, addToFavorites]);

  // Clear error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const contextValue: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    error,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
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