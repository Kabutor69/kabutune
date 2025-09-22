'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { Track, PlayerState } from '@/types';

type PlayerAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track | null }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'TOGGLE_PLAY_PAUSE' }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'ADD_TO_QUEUE'; payload: Track[] }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_QUEUE'; payload: Track[] }
  | { type: 'CLEANUP_QUEUE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' };

interface MusicPlayerContextType {
  state: PlayerState;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  addToQueue: (tracks: Track[]) => void;
  playAll: (tracks: Track[]) => void;
  clearQueue: () => void;
  removeFromQueue: (trackId: string) => void;
  shuffleQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  queue: [],
  currentIndex: -1,
  isShuffled: false,
  isRepeating: false,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        isPlaying: true,
      };
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
        currentTrack: state.queue[action.payload] || null,
        isPlaying: true,
      };
    case 'TOGGLE_PLAY_PAUSE':
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };
    case 'SET_CURRENT_TIME':
      return {
        ...state,
        currentTime: action.payload,
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
      };
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
      };
    case 'ADD_TO_QUEUE':
      // Filter out duplicates and limit queue size for memory efficiency
      const newTracks = action.payload.filter(track => 
        !state.queue.some(existing => existing.id === track.id)
      );
      const updatedQueue = [...state.queue, ...newTracks];
      // Keep only last 10 tracks for memory efficiency
      const limitedQueue = updatedQueue.slice(-10);
      return {
        ...state,
        queue: limitedQueue,
      };
    case 'NEXT_TRACK':
      if (state.queue.length === 0) return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.isRepeating) {
          return {
            ...state,
            currentIndex: 0,
            currentTrack: state.queue[0],
            isPlaying: true,
          };
        }
        // If no repeat and at end, stay at current track but keep playing
        // The auto-generation will handle adding more tracks
        return {
          ...state,
          isPlaying: true,
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex],
        isPlaying: true,
      };
    case 'PREV_TRACK':
      if (state.queue.length === 0) return state;
      const prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        return {
          ...state,
          currentIndex: state.queue.length - 1,
          currentTrack: state.queue[state.queue.length - 1],
          isPlaying: true,
        };
      }
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex],
        isPlaying: true,
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: [],
        currentIndex: -1,
        currentTrack: null,
        isPlaying: false,
      };
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.payload,
        currentIndex: 0,
        currentTrack: action.payload[0] || null,
        isPlaying: action.payload.length > 0,
      };
    case 'TOGGLE_SHUFFLE':
      return {
        ...state,
        isShuffled: !state.isShuffled,
      };
    case 'TOGGLE_REPEAT':
      return {
        ...state,
        isRepeating: !state.isRepeating,
      };
    case 'CLEANUP_QUEUE':
      // Keep only current track and next 20 tracks for memory efficiency
      const currentIndex = state.currentIndex;
      const startIndex = Math.max(0, currentIndex - 5); // Keep 5 tracks before current
      const endIndex = Math.min(state.queue.length, currentIndex + 20); // Keep 20 tracks after current
      const cleanedQueue = state.queue.slice(startIndex, endIndex);
      const newCurrentIndex = currentIndex - startIndex;
      return {
        ...state,
        queue: cleanedQueue,
        currentIndex: newCurrentIndex,
        currentTrack: cleanedQueue[newCurrentIndex] || null,
      };
    default:
      return state;
  }
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

  // Load player state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kabutune-player');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.volume !== undefined) {
          dispatch({ type: 'SET_VOLUME', payload: parsed.volume });
        }
      } catch (error) {
        console.error('Failed to load player state:', error);
      }
    }
  }, []);

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('kabutune-player', JSON.stringify({ volume: state.volume }));
  }, [state.volume]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleEnded = () => {
      // Always try to play next track for nonstop playback
      if (state.queue.length > 0 && state.currentIndex < state.queue.length - 1) {
        // Play next track in queue
        dispatch({ type: 'NEXT_TRACK' });
      } else if (state.currentTrack) {
        // At end of queue - fetch more tracks and continue
        console.log('End of queue reached, fetching more tracks...');
        fetchRelatedTracks(state.currentTrack.id).then(() => {
          // After fetching, try to play next track
          setTimeout(() => {
            dispatch({ type: 'NEXT_TRACK' });
          }, 1000); // Small delay to ensure tracks are added
        });
      }
    };

    const handlePlay = () => {
      dispatch({ type: 'SET_PLAYING', payload: true });
    };

    const handlePause = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [state.currentTrack, state.queue, state.currentIndex]);

  // Update audio source when current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    audio.src = `${API_BASE}/api/stream/${state.currentTrack.id}`;
    audio.load();
  }, [state.currentTrack]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.volume;
  }, [state.volume]);

  const fetchRelatedTracks = async (videoId: string) => {
    try {
      const q = state.currentTrack ? encodeURIComponent(`${state.currentTrack.title} ${state.currentTrack.channel}`) : '';
      const response = await fetch(`${API_BASE}/api/related/${videoId}${q ? `?q=${q}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        if (data.tracks && data.tracks.length > 0) {
          dispatch({ type: 'ADD_TO_QUEUE', payload: data.tracks });
        }
      }
    } catch (error) {
      console.error('Failed to fetch related tracks:', error);
    }
  };

  // Auto-generate queue when it's getting low
  const checkAndGenerateQueue = useCallback(() => {
    if (state.currentTrack) {
      const remaining = state.queue.length - state.currentIndex - 1;
      if (remaining <= 2) {
        console.log('Only', remaining, 'tracks left, fetching more (target queue size 10)...');
        fetchRelatedTracks(state.currentTrack.id);
      }
    }
  }, [state.currentTrack, state.queue.length, state.currentIndex]);

  // Auto-generate queue when current track changes
  useEffect(() => {
    checkAndGenerateQueue();
  }, [state.currentTrack, state.currentIndex, state.queue.length, checkAndGenerateQueue]);

  // Aggressive queue generation - ensure we refill when 2 or fewer tracks left
  useEffect(() => {
    if (state.currentTrack && state.queue.length > 0) {
      const tracksLeft = state.queue.length - state.currentIndex - 1;
      if (tracksLeft <= 2) {
        console.log(`Only ${tracksLeft} tracks left, fetching more...`);
        fetchRelatedTracks(state.currentTrack.id);
      }
    }
  }, [state.currentIndex, state.queue.length, state.currentTrack]);

  // Cleanup queue periodically for memory efficiency (cap at 10)
  useEffect(() => {
    if (state.queue.length > 10) {
      console.log('Queue getting large, cleaning up...');
      dispatch({ type: 'CLEANUP_QUEUE' });
    }
  }, [state.queue.length]);

  // Listen for queue track selection events
  useEffect(() => {
    const handleSetCurrentIndex = (event: CustomEvent) => {
      const { index } = event.detail;
      dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
    };

    window.addEventListener('setCurrentIndex', handleSetCurrentIndex as EventListener);
    return () => {
      window.removeEventListener('setCurrentIndex', handleSetCurrentIndex as EventListener);
    };
  }, []);

  const playTrack = (track: Track) => {
    // Check if track is already in queue
    const existingIndex = state.queue.findIndex(t => t.id === track.id);
    if (existingIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: existingIndex });
      return;
    }

    // Clear current queue and set new queue with just this track
    // This ensures playing from pages clears the queue and generates new related tracks
    dispatch({ type: 'SET_QUEUE', payload: [track] });
    
    // Ensure it starts playing immediately
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const togglePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const prevTrack = () => {
    dispatch({ type: 'PREV_TRACK' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const setCurrentTime = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
  };

  const addToQueue = (tracks: Track[]) => {
    // Filter out tracks that already exist in queue
    const newTracks = tracks.filter(track => 
      !state.queue.some(existingTrack => existingTrack.id === track.id)
    );
    
    if (newTracks.length > 0) {
      console.log(`Adding ${newTracks.length} new tracks to queue (${tracks.length - newTracks.length} duplicates skipped)`);
      dispatch({ type: 'ADD_TO_QUEUE', payload: newTracks });
    } else {
      console.log('All tracks already in queue, skipping');
    }
  };

  const playAll = (tracks: Track[]) => {
    if (tracks.length === 0) return;
    
    // Clear current queue and set new queue
    dispatch({ type: 'CLEAR_QUEUE' });
    dispatch({ type: 'SET_QUEUE', payload: tracks });
    dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 });
    
    // Start playing immediately
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const clearQueue = () => {
    dispatch({ type: 'CLEAR_QUEUE' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const removeFromQueue = (trackId: string) => {
    const newQueue = state.queue.filter(track => track.id !== trackId);
    dispatch({ type: 'SET_QUEUE', payload: newQueue });
    
    // If we removed the current track, move to next or stop
    if (state.currentTrack?.id === trackId) {
      if (newQueue.length > 0) {
        const newIndex = Math.min(state.currentIndex, newQueue.length - 1);
        dispatch({ type: 'SET_CURRENT_INDEX', payload: newIndex });
      } else {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: null });
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    }
  };

  const shuffleQueue = () => {
    const shuffledQueue = [...state.queue];
    for (let i = shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
    }
    dispatch({ type: 'SET_QUEUE', payload: shuffledQueue });
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        state,
        playTrack,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setVolume,
        setCurrentTime,
        addToQueue,
        playAll,
        clearQueue,
        removeFromQueue,
        shuffleQueue,
        toggleShuffle,
        toggleRepeat,
        audioRef,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
