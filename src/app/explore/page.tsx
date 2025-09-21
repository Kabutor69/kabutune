'use client';

import React, { useState, useEffect } from 'react';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Music, TrendingUp, Clock, Star, Play } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ExploreSection {
  title: string;
  tracks: Track[];
  icon: React.ReactNode;
  gradient: string;
}

export default function ExplorePage() {
  const { playAll, state } = useMusicPlayer();
  const [sections, setSections] = useState<ExploreSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading trending content
    const loadExploreContent = async () => {
      setIsLoading(true);
      
      // Mock data for now - in a real app, you'd fetch from APIs
      const mockSections: ExploreSection[] = [
        {
          title: 'Trending Now',
          tracks: [],
          icon: <TrendingUp className="h-5 w-5" />,
          gradient: 'from-red-500 to-orange-500'
        },
        {
          title: 'New Releases',
          tracks: [],
          icon: <Clock className="h-5 w-5" />,
          gradient: 'from-green-500 to-emerald-500'
        },
        {
          title: 'Top Hits',
          tracks: [],
          icon: <Star className="h-5 w-5" />,
          gradient: 'from-purple-500 to-pink-500'
        },
        {
          title: 'Discover',
          tracks: [],
          icon: <Music className="h-5 w-5" />,
          gradient: 'from-blue-500 to-indigo-500'
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setSections(mockSections);
        setIsLoading(false);
      }, 1000);
    };

    loadExploreContent();
  }, []);

  const handlePlayAll = (tracks: Track[]) => {
    if (tracks.length > 0) {
      playAll(tracks);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Explore Music
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Discover trending songs, new releases, and curated playlists
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg">Kabutor is working...</span>
            </div>
          </div>
        )}

        {/* Explore Sections */}
        {!isLoading && (
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={index} className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      {section.icon}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  {section.tracks.length > 0 && (
                    <button
                      onClick={() => handlePlayAll(section.tracks)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Play All</span>
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {section.tracks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                    {section.tracks.map((track, trackIndex) => (
                      <TrackCard key={`${track.id}-${trackIndex}`} track={track} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className={`w-20 h-20 bg-gradient-to-br ${section.gradient} bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      {section.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 px-4">
                      Coming Soon
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
                      Kabutor is working on bringing you the best {section.title.toLowerCase()} content.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
