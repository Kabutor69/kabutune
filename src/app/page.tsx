'use client';

import React, { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { TrackCard } from '@/components/TrackCard';
import { Track, SearchResponse, ApiError } from '@/types';
import { Loader2, Music } from 'lucide-react';
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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/20 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 sm:mb-24 animate-fade-in-up">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-modern-xl group-hover:shadow-blue-glow-lg transition-all duration-500 group-hover:scale-105">
                <Music className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
            KabuTune
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 sm:mb-16 max-w-4xl mx-auto px-4 leading-relaxed animate-fade-in-up">
            Discover and stream music from YouTube with a beautiful, modern interface. 
            <span className="block mt-2 text-base sm:text-lg text-primary-600 dark:text-primary-400 font-medium">
              Search for your favorite songs, artists, or albums and enjoy high-quality streaming.
            </span>
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up">
            <SearchBar onSearch={handleSearch} onCancel={handleCancel} isLoading={isLoading} />
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Smart Search</h3>
              <p className="text-sm text-muted-foreground text-center">Find any song, artist, or album instantly</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Favorites</h3>
              <p className="text-sm text-muted-foreground text-center">Save your favorite tracks for later</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">High Quality</h3>
              <p className="text-sm text-muted-foreground text-center">Stream in the best available quality</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card border-destructive/20 bg-destructive/5 backdrop-blur-sm p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-white" />
              </div>
              <p className="text-destructive text-center font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && tracks.length === 0 && (
          <div className="flex items-center justify-center py-20 animate-fade-in-up">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-modern-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground text-lg sm:text-xl font-medium">Kabutor is working...</span>
                <p className="text-sm text-muted-foreground mt-2">Searching for the best results</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {tracks.length > 0 && (
          <div className="mb-16 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Search Results
              </h2>
              <div className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                {tracks.length} tracks found
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
              {tracks.map((track, index) => (
                <div key={`${track.id}-${index}`} className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TrackCard track={track} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {nextPageToken && (
              <div className="text-center mt-16">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
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
          <div className="text-center py-20 animate-fade-in-up">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto shadow-modern">
                <Music className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-muted to-muted/50 rounded-3xl blur opacity-30"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              No results found
            </h3>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-6">
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
          <div className="text-center py-20 animate-fade-in-up">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 rounded-3xl flex items-center justify-center mx-auto shadow-modern">
                <Music className="h-12 w-12 text-primary-500" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur opacity-20 animate-pulse-slow"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 px-4">
              Welcome to KabuTune
            </h3>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto px-4 leading-relaxed mb-8">
              Start by searching for your favorite songs, artists, or albums.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Try "Ed Sheeran"</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Try "Shape of You"</span>
              <span className="px-3 py-1 bg-secondary/50 rounded-full">Try "Pop Music"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}