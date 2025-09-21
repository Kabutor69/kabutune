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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/20 ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-24 animate-fade-in-up">
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-modern-xl group-hover:shadow-blue-glow-lg transition-all duration-500 group-hover:scale-105">
                <Music className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-6">
            Explore Music
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 sm:mb-16 max-w-4xl mx-auto px-4 leading-relaxed">
            Discover trending songs, new releases, and curated playlists
            <span className="block mt-2 text-base sm:text-lg text-primary-600 dark:text-primary-400 font-medium">
              Find your next favorite track from our carefully curated collections.
            </span>
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 animate-fade-in-up">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-modern-xl">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground text-lg sm:text-xl font-medium">Kabutor is working...</span>
                <p className="text-sm text-muted-foreground mt-2">Loading curated content</p>
              </div>
            </div>
          </div>
        )}

        {/* Explore Sections */}
        {!isLoading && (
          <div className="space-y-20">
            {sections.map((section, index) => (
              <div key={index} className="space-y-8 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center shadow-modern-xl group-hover:shadow-blue-glow transition-all duration-300`}>
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {section.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                        {section.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.tracks.length > 0 ? `${section.tracks.length} tracks available` : 'Coming soon'}
                      </p>
                    </div>
                  </div>
                  {section.tracks.length > 0 && (
                    <button
                      onClick={() => handlePlayAll(section.tracks)}
                      className="btn-primary flex items-center space-x-3"
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
                      <div key={`${track.id}-${trackIndex}`} className="animate-fade-in-scale" style={{ animationDelay: `${trackIndex * 0.1}s` }}>
                        <TrackCard track={track} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="relative mb-8">
                      <div className={`w-24 h-24 bg-gradient-to-br ${section.gradient} bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto shadow-modern`}>
                        <div className="text-primary-500">
                          {section.icon}
                        </div>
                      </div>
                      <div className={`absolute -inset-2 bg-gradient-to-br ${section.gradient} rounded-3xl blur opacity-20 animate-pulse-slow`}></div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 px-4">
                      Coming Soon
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto px-4 leading-relaxed mb-6">
                      Kabutor is working on bringing you the best {section.title.toLowerCase()} content.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-secondary/50 rounded-full">Curated Playlists</span>
                      <span className="px-3 py-1 bg-secondary/50 rounded-full">Trending Tracks</span>
                      <span className="px-3 py-1 bg-secondary/50 rounded-full">New Releases</span>
                    </div>
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
