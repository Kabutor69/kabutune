import { Router } from 'express';
import ytdl from '@distube/ytdl-core';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
    if (!ytdl.validateID(videoId)) return res.status(400).json({ error: 'Invalid video ID' });

    // Avoid a heavy getInfo call; let ytdl select audioonly internally with filter options

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const requestOptions: Record<string, unknown> = {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
        ...(process.env.YT_COOKIE ? { cookie: process.env.YT_COOKIE } : {}),
      },
    };

    const audioStream = ytdl(videoId, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions,
      highWaterMark: 1 << 25,
    });
    audioStream.on('error', (err) => {
      console.error('ytdl stream error:', err);
      if (!res.headersSent) {
        const status = (err as any)?.statusCode === 429 ? 429 : 500;
        res.status(status).json({ error: status === 429 ? 'Rate limited by YouTube' : 'Failed to stream audio' });
      } else {
        res.end();
      }
    });
    audioStream.pipe(res);
  } catch (err) {
    console.error('Stream API error:', err);
    return res.status(500).json({ error: 'Failed to stream audio' });
  }
});

export default router;


