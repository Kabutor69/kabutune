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

    const audioStream = ytdl(videoId, { format });
    audioStream.pipe(res);
  } catch (err) {
    console.error('Stream API error:', err);
    return res.status(500).json({ error: 'Failed to stream audio' });
  }
});

export default router;


