// GET /api/download/:id: downloads audio with filename via stream pipeline
import { Router } from 'express';
import ytdl from '@distube/ytdl-core';
import * as playdl from 'play-dl';
import { pipeline } from 'stream';
import { promisify } from 'util';

const router = Router();
const pump = promisify(pipeline);

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    const title = String(req.query.title || 'audio');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
    if (!ytdl.validateID(videoId)) return res.status(400).json({ error: 'Invalid video ID' });

    const safeTitle = title.replace(/[^a-z0-9\-_. ]/gi, '').trim() || 'audio';
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.webm"`);
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Cache-Control', 'no-cache');

    const baseHeaders: Record<string, string> = {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
      'referer': 'https://www.youtube.com/',
      'origin': 'https://www.youtube.com',
    };

    const requestOptions: Record<string, unknown> = { headers: baseHeaders };

    let source = ytdl(videoId, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions,
      highWaterMark: 1 << 25,
    });

    const onError = async () => {
      try {
        const alt = await playdl.stream(`https://www.youtube.com/watch?v=${videoId}`, {
          discordPlayerCompatibility: false,
          quality: 2,
        } as any);
        await pump(alt.stream as any, res);
      } catch {
        if (!res.headersSent) res.status(500).json({ error: 'Failed to download audio' });
      }
    };

    source.on('error', onError as any);
    await pump(source as any, res);
  } catch (err) {
    if (!res.headersSent) return res.status(500).json({ error: 'Failed to download audio' });
  }
});

export default router;


