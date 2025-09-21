import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { ApiError } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' } as ApiError, { status: 400 });
    }

    // Validate YouTube video ID
    if (!ytdl.validateID(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID' } as ApiError, { status: 400 });
    }

    // Get video info first to check if it's available
    const videoInfo = await ytdl.getInfo(videoId);
    
    if (!videoInfo) {
      return NextResponse.json({ error: 'Video not found' } as ApiError, { status: 404 });
    }

    // Get the best audio format
    const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    
    if (audioFormats.length === 0) {
      return NextResponse.json({ error: 'No audio format available' } as ApiError, { status: 400 });
    }

    // Choose the best quality audio format
    const format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    
    if (!format) {
      return NextResponse.json({ error: 'No suitable audio format found' } as ApiError, { status: 400 });
    }

    // Create audio stream
    const audioStream = ytdl(videoId, { format });

    // Set appropriate headers for audio streaming
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    });

    // Return the audio stream
    return new NextResponse(audioStream as unknown as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Stream API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json({ error: 'Video is unavailable' } as ApiError, { status: 404 });
      }
      if (error.message.includes('Private video')) {
        return NextResponse.json({ error: 'Video is private' } as ApiError, { status: 403 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to stream audio' } as ApiError,
      { status: 500 }
    );
  }
}
