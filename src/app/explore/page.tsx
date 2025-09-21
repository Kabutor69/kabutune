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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-24">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Music className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Explore Music
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 sm:mb-16 max-w-3xl mx-auto px-4 leading-relaxed">
            Discover trending songs, new releases, and curated playlists
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-medium">Kabutor is working...</span>
            </div>
          </div>
        )}

        {/* Explore Sections */}
        {!isLoading && (
          <div className="space-y-20">
            {sections.map((section, index) => (
              <div key={index} className="space-y-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      {section.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  {section.tracks.length > 0 && (
                    <button
                      onClick={() => handlePlayAll(section.tracks)}
                      className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl sm:rounded-3xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      <span>Play All</span>
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {section.tracks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                    {section.tracks.map((track, trackIndex) => (
                      <TrackCard key={`${track.id}-${trackIndex}`} track={track} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className={`w-24 h-24 bg-gradient-to-br ${section.gradient} bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                      {section.icon}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 px-4">
                      Coming Soon
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto px-4 leading-relaxed">
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
