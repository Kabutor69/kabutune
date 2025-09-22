export interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  durationSeconds?: number;
  url: string;
  views?: number;
  isFavorite?: boolean;
}

export interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
  nextPageToken?: string;
}

export interface YouTubeRelatedResponse {
  items: YouTubeSearchResult[];
}

export interface SearchResponse {
  tracks: Track[];
  nextPageToken?: string;
}

export interface ApiError {
  error: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  currentIndex: number;
  isShuffled: boolean;
  isRepeating: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  favorites: Track[];
  player: PlayerState;
}

export interface LocalStorageData {
  theme: 'light' | 'dark';
  favorites: Track[];
  playerState?: Partial<PlayerState>;
}
