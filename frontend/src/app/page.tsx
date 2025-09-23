'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrackCard } from '@/components/TrackCard';
import { Track, SearchResponse, ApiError } from '@/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { 
  Search as SearchIcon, 
  Music,
  AlertCircle,
  X
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const { playTrack } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  const saveToSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query.trim();
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);
    setTracks([]);
    setNextPageToken(null);
    setHasSearched(true);
    saveToSearchHistory(searchTerm);

    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(searchTerm)}&limit=30&t=${Date.now()}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTracks(data.tracks || []);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const clearSearch = () => {
    setQuery("");
    setTracks([]);
    setHasSearched(false);
    setError(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handlePlay = (track: Track) => {
    playTrack(track);
  };

  const loadMore = async () => {
    if (!nextPageToken || isLoading || !query) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&pageToken=${nextPageToken}`);
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="px-0 sm:px-0 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md p-2">
            <SearchIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Search Music</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Find your favorite songs and artists</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for songs, artists, or albums..."
            className="w-full bg-gray-900/60 border border-gray-800 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text:white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => handleSearch()}
          disabled={isLoading || !query.trim()}
          className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
              Searching...
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && !hasSearched && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">Recent Searches</h3>
            <button
              onClick={clearSearchHistory}
              className="text-xs text-gray-400 hover:text-gray-200 underline"
            >
              Clear history
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 8).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(historyQuery)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md p-2">
              <SearchIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">
              {isLoading ? 'Searching...' : `Results for "${query}"`}
            </h2>
            {isLoading && (
              <div className="animate-spin w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
            )}
          </div>

          {tracks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlay(track)}
                  isFavorite={isFavorite(track.id)}
                  onToggleFavorite={() => toggleFavorite(track)}
                />
              ))}
            </div>
          )}

          {nextPageToken && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {!isLoading && tracks.length === 0 && !error && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;</p>
              <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && !error && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Start searching for music</p>
          <p className="text-gray-500 text-sm mt-2">Enter a song name, artist, or album above</p>
        </div>
      )}
    </div>
  );
}