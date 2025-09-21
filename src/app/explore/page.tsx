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
    <div className={`min-h-screen bg-background ${state.currentTrack ? 'pb-24' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Explore Music
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover trending songs, new releases, and curated playlists.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <span className="text-muted-foreground font-medium">Loading...</span>
                <p className="text-sm text-muted-foreground mt-1">Loading curated content</p>
              </div>
            </div>
          </div>
        )}

        {/* Explore Sections */}
        {!isLoading && (
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={index} className="space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <div className="text-primary-foreground">
                        {section.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
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
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Play All</span>
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {section.tracks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {section.tracks.map((track, trackIndex) => (
                      <div key={`${track.id}-${trackIndex}`}>
                        <TrackCard track={track} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <div className="text-primary">
                        {section.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Coming Soon
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      We&apos;re working on bringing you the best {section.title.toLowerCase()} content.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-muted rounded-full">Curated Playlists</span>
                      <span className="px-3 py-1 bg-muted rounded-full">Trending Tracks</span>
                      <span className="px-3 py-1 bg-muted rounded-full">New Releases</span>
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
