'use client';

import React, { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { TrackCard } from '@/components/TrackCard';
import { Track, SearchResponse, ApiError } from '@/types';
import { Loader2, Music, Search, Heart, X } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Home() {
  const { state } = useMusicPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setTracks([]);
    setNextPageToken(null);
    setHasSearched(true);
    setCurrentQuery(query);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data: SearchResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Search failed');
      }

      const searchData = data as SearchResponse;
      setTracks(searchData.tracks);
      setNextPageToken(searchData.nextPageToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(false);
    setError(null);
  };

  const loadMore = async () => {
    if (!nextPageToken || isLoading || !currentQuery) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(currentQuery)}&pageToken=${nextPageToken}`);
      const data: SearchResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Load more failed');
      }

      const searchData = data as SearchResponse;
      setTracks(prev => [...prev, ...searchData.tracks]);
      setNextPageToken(searchData.nextPageToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            KabuTune
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover and stream music from YouTube with a clean, modern interface.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} onCancel={handleCancel} isLoading={isLoading} />
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-muted border border-border">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Smart Search</h3>
              <p className="text-sm text-muted-foreground text-center">Find any song, artist, or album instantly</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-muted border border-border">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Favorites</h3>
              <p className="text-sm text-muted-foreground text-center">Save your favorite tracks for later</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-muted border border-border">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-foreground">High Quality</h3>
              <p className="text-sm text-muted-foreground text-center">Stream in the best available quality</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                <X className="h-3 w-3 text-destructive-foreground" />
              </div>
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && tracks.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <span className="text-muted-foreground font-medium">Searching...</span>
                <p className="text-sm text-muted-foreground mt-1">Finding the best results</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {tracks.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Search Results
              </h2>
              <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {tracks.length} tracks found
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {tracks.map((track, index) => (
                <div key={`${track.id}-${index}`}>
                  <TrackCard track={track} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {nextPageToken && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Tracks'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {hasSearched && tracks.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              No results found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Try searching for a different term or check your spelling.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Welcome to KabuTune
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start by searching for your favorite songs, artists, or albums.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-muted rounded-full">Try &quot;Ed Sheeran&quot;</span>
              <span className="px-3 py-1 bg-muted rounded-full">Try &quot;Shape of You&quot;</span>
              <span className="px-3 py-1 bg-muted rounded-full">Try &quot;Pop Music&quot;</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}