'use client';

import React, { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { TrackCard } from '@/components/TrackCard';
import { Track, SearchResponse, ApiError } from '@/types';
import { Music, Search, Heart } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

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
    <div className="min-h-screen bg-bg" style={{ paddingBottom: state.currentTrack ? '80px' : '0' }}>
      <div className="container py-8 sm:py-12 sm:py-16">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 sm:mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl sm:text-6xl font-bold text-text mb-4">
            KabuTune
          </h1>
          
          <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Discover and stream music from YouTube with a clean, simple interface.
          </p>

          <div className="max-w-lg mx-auto">
            <SearchBar onSearch={handleSearch} onCancel={handleCancel} isLoading={isLoading} />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-center p-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-text mb-2">Search</h3>
            <p className="text-sm text-text-muted">Find any song instantly</p>
          </div>
          <div className="text-center p-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-text mb-2">Favorites</h3>
            <p className="text-sm text-text-muted">Save your favorite tracks</p>
          </div>
          <div className="text-center p-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <Music className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-text mb-2">Stream</h3>
            <p className="text-sm text-text-muted">High-quality audio streaming</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && tracks.length === 0 && (
          <div className="text-center py-12">
            <div className="loading mx-auto mb-4"></div>
            <p className="text-text-muted">Searching...</p>
          </div>
        )}

        {/* Results */}
        {tracks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">
                Results
              </h2>
              <span className="text-sm text-text-muted bg-surface px-3 py-1 rounded-full">
                {tracks.length} tracks
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
              {tracks.map((track, index) => (
                <TrackCard key={`${track.id}-${index}`} track={track} />
              ))}
            </div>

            {nextPageToken && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {hasSearched && tracks.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center mx-auto mb-6">
              <Music className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">
              No results found
            </h3>
            <p className="text-text-muted mb-6">
              Try searching for a different term.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Music className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">
              Welcome to KabuTune
            </h3>
            <p className="text-text-muted mb-6">
              Start by searching for your favorite songs, artists, or albums.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-text-muted">
              <span className="px-3 py-1 bg-surface rounded-full">Try &quot;Ed Sheeran&quot;</span>
              <span className="px-3 py-1 bg-surface rounded-full">Try &quot;Shape of You&quot;</span>
              <span className="px-3 py-1 bg-surface rounded-full">Try &quot;Pop Music&quot;</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}