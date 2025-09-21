import { NextRequest, NextResponse } from 'next/server';
import { YouTubeRelatedResponse, SearchResponse, ApiError, Track } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' } as ApiError, { status: 400 });
    }

    const apiKey = process.env.YT_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' } as ApiError, { status: 500 });
    }

    // First get video details to extract channel and title for related search
    const videoInfoUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoInfoUrl.searchParams.set('key', apiKey);
    videoInfoUrl.searchParams.set('part', 'snippet');
    videoInfoUrl.searchParams.set('id', videoId);

    const videoInfoResponse = await fetch(videoInfoUrl.toString());
    if (!videoInfoResponse.ok) {
      throw new Error(`YouTube API error: ${videoInfoResponse.status}`);
    }

    const videoInfo = await videoInfoResponse.json();
    if (!videoInfo.items || videoInfo.items.length === 0) {
      throw new Error('Video not found');
    }

    const videoSnippet = videoInfo.items[0].snippet;
    
    // Search for related videos using the channel name and some keywords from title
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('key', apiKey);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoCategoryId', '10'); // Music category
    searchUrl.searchParams.set('maxResults', '10');
    
    // Create a more targeted search query for better related content
    const titleWords = videoSnippet.title.split(' ').slice(0, 3).join(' ');
    const channelName = videoSnippet.channelTitle;
    
    // Use more specific search strategies for better related content
    const searchStrategies = [
      `${titleWords}`, // Just the title words
      `${channelName}`, // Just the channel
      `${titleWords} ${channelName}`, // Title + channel
      `music ${titleWords}`, // Music + title
    ];
    
    // Pick the first strategy for consistency
    const searchQuery = searchStrategies[0];
    searchUrl.searchParams.set('q', searchQuery);

    const response = await fetch(searchUrl.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeRelatedResponse = await response.json();

    // Transform YouTube results to our Track format
    const tracks: Track[] = data.items
      .filter((item) => item.id.videoId !== videoId) // Exclude the current video
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: '0:00', // We'll get this from video details if needed
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

    const searchResponse: SearchResponse = {
      tracks,
    };

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Related videos API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related videos' } as ApiError,
      { status: 500 }
    );
  }
}
