'use client';

import React, { useState, useEffect } from 'react';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Music, TrendingUp, Clock, Star, Play } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ExploreSection {
  title: string;
  tracks: Track[];
  icon: React.ReactNode;
}

export default function ExplorePage() {
  const { playAll, state } = useMusicPlayer();
  const [sections, setSections] = useState<ExploreSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExploreContent = async () => {
      setIsLoading(true);
      
      const mockSections: ExploreSection[] = [
        {
          title: 'Trending Now',
          tracks: [],
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'New Releases',
          tracks: [],
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: 'Top Hits',
          tracks: [],
          icon: <Star className="h-5 w-5" />
        },
        {
          title: 'Discover',
          tracks: [],
          icon: <Music className="h-5 w-5" />
        }
      ];

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
            Explore Music
          </h1>
          <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Discover trending songs, new releases, and curated playlists.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="loading mx-auto mb-4"></div>
            <p className="text-text-muted">Loading content...</p>
          </div>
        )}

        {/* Explore Sections */}
        {!isLoading && (
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="space-y-6">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <div className="text-white">
                        {section.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-text">
                        {section.title}
                      </h2>
                      <p className="text-sm text-text-muted mt-1">
                        {section.tracks.length > 0 ? `${section.tracks.length} tracks available` : 'Coming soon'}
                      </p>
                    </div>
                  </div>
                  {section.tracks.length > 0 && (
                    <button
                      onClick={() => handlePlayAll(section.tracks)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Play All</span>
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {section.tracks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
                    {section.tracks.map((track, trackIndex) => (
                      <TrackCard key={`${track.id}-${trackIndex}`} track={track} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <div className="text-accent">
                        {section.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text mb-3">
                      Coming Soon
                    </h3>
                    <p className="text-text-muted mb-6 max-w-md mx-auto">
                      We&apos;re working on bringing you the best {section.title.toLowerCase()} content.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-text-muted">
                      <span className="px-3 py-1 bg-surface rounded-full">Curated Playlists</span>
                      <span className="px-3 py-1 bg-surface rounded-full">Trending Tracks</span>
                      <span className="px-3 py-1 bg-surface rounded-full">New Releases</span>
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