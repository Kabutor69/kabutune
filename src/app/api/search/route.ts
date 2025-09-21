import { NextRequest, NextResponse } from 'next/server';
import { YouTubeSearchResponse, SearchResponse, ApiError, Track } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const pageToken = searchParams.get('pageToken');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' } as ApiError, { status: 400 });
    }

    const apiKey = process.env.YT_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' } as ApiError, { status: 500 });
    }

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('key', apiKey);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoCategoryId', '10'); // Music category
    searchUrl.searchParams.set('maxResults', '20');
    searchUrl.searchParams.set('q', query);
    
    if (pageToken) {
      searchUrl.searchParams.set('pageToken', pageToken);
    }

    const response = await fetch(searchUrl.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeSearchResponse = await response.json();

    // Transform YouTube results to our Track format
    const tracks: Track[] = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: '0:00', // We'll get this from video details if needed
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    const searchResponse: SearchResponse = {
      tracks,
      nextPageToken: data.nextPageToken,
    };

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search for tracks' } as ApiError,
      { status: 500 }
    );
  }
}
