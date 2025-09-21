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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            KabuTune
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Discover and stream music from YouTube with a beautiful, modern interface
          </p>
          <SearchBar onSearch={handleSearch} onCancel={handleCancel} isLoading={isLoading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl p-6 mb-8">
            <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && tracks.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg">Kabutor is working...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {tracks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
              Search Results
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {tracks.map((track, index) => (
                <TrackCard key={`${track.id}-${index}`} track={track} />
              ))}
            </div>

            {/* Load More Button */}
            {nextPageToken && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl sm:rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {hasSearched && tracks.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Music className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try searching for a different term or check your spelling.
            </p>
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Music className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 px-4">
              Welcome to KabuTune
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
              Start by searching for your favorite songs, artists, or albums.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}