import { Router } from 'express';
import ytdl from '@distube/ytdl-core';
import * as playdl from 'play-dl';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
    if (!ytdl.validateID(videoId)) return res.status(400).json({ error: 'Invalid video ID' });

    // Avoid a heavy getInfo call; let ytdl select audioonly internally with filter options

    // Default content type; most YouTube audio streams are webm/opus
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const baseHeaders: Record<string, string> = {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
      'referer': 'https://www.youtube.com/',
      'origin': 'https://www.youtube.com',
      // YouTube client headers help reduce 429 on some hosts
      'x-youtube-client-name': '1',
      'x-youtube-client-version': '2.20240722.01.00',
      ...(process.env.YT_COOKIE ? { cookie: process.env.YT_COOKIE } : {}),
    };

    const requestOptions: Record<string, unknown> = { headers: baseHeaders };

    let audioStream = ytdl(videoId, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions,
      highWaterMark: 1 << 25,
    });
    let retried = false;
    const handleError = async (err: unknown) => {
      console.error('ytdl stream error:', err);
      const statusCode = (err as any)?.statusCode;
      if (!retried && statusCode === 429) {
        retried = true;
        // Retry once with an alternate UA string
        const altHeaders = {
          ...baseHeaders,
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
        };
        const altReq = { headers: altHeaders } as Record<string, unknown>;
        audioStream = ytdl(videoId, {
          filter: 'audioonly',
          quality: 'highestaudio',
          requestOptions: altReq,
          highWaterMark: 1 << 25,
        });
        audioStream.on('error', handleError as any);
        audioStream.pipe(res);
        return;
      }
      if (!res.headersSent && statusCode === 429) {
        // Fallback to play-dl stream once
        try {
          const source = await playdl.stream(`https://www.youtube.com/watch?v=${videoId}`, {
            discordPlayerCompatibility: false,
            quality: 2,
            requestOptions: { headers: baseHeaders },
          } as any);
          // Map type to content-type
          const t = (source as any).type as string | undefined;
          if (!res.headersSent) {
            if (t === 'mp3') res.setHeader('Content-Type', 'audio/mpeg');
            else if (t === 'aac') res.setHeader('Content-Type', 'audio/aac');
            else res.setHeader('Content-Type', 'audio/webm');
          }
          (source.stream as any).on('error', handleError as any);
          (source.stream as any).pipe(res);
          return;
        } catch (e) {
          console.error('play-dl fallback failed:', e);
        }
      }
      if (!res.headersSent) {
        const status = statusCode === 429 ? 429 : 500;
        res.status(status).json({ error: status === 429 ? 'Rate limited by YouTube' : 'Failed to stream audio' });
      } else {
        res.end();
      }
    };
    audioStream.on('error', handleError as any);
    audioStream.pipe(res);
  } catch (err) {
    console.error('Stream API error:', err);
    return res.status(500).json({ error: 'Failed to stream audio' });
  }
});

export default router;


