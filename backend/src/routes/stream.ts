import { Router } from 'express';
import ytdl from '@distube/ytdl-core';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
    if (!ytdl.validateID(videoId)) return res.status(400).json({ error: 'Invalid video ID' });

    const videoInfo = await ytdl.getInfo(videoId);
    if (!videoInfo) return res.status(404).json({ error: 'Video not found' });

    const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    if (audioFormats.length === 0) return res.status(400).json({ error: 'No audio format available' });

    const format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    if (!format) return res.status(400).json({ error: 'No suitable audio format found' });

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

    const audioStream = ytdl(videoId, { format, requestOptions });
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


