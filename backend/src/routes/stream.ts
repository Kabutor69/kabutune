// GET /api/stream/:id: redirects to best audio stream URL from Piped
import { Router } from 'express';
import { fetch } from 'undici';

const router = Router();

const PIPED_BASE = process.env.PIPED_BASE || 'https://piped.video';

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });

    const r = await fetch(`${PIPED_BASE}/api/v1/streams/${encodeURIComponent(videoId)}`);
    if (!r.ok) return res.status(502).json({ error: 'Upstream streams failed' });
    const data = await r.json() as any;

    const streams: any[] = Array.isArray(data?.audioStreams) ? data.audioStreams : [];
    if (!streams.length) return res.status(404).json({ error: 'No audio streams found' });

    const opus = streams.find(s => /opus/i.test(s.codec || '') || /webm/i.test(s.container || ''));
    const best = opus || streams.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
    if (!best?.url) return res.status(404).json({ error: 'No valid stream URL' });

    res.setHeader('Cache-Control', 'public, max-age=600');
    return res.redirect(302, best.url);
  } catch (err) {
    console.error('Stream API error:', err);
    return res.status(500).json({ error: 'Failed to get stream' });
  }
});

export default router;


