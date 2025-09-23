// GET /api/search: proxies Piped search and maps results to Track
import { Router } from 'express';
import { fetch } from 'undici';

const router = Router();

const PIPED_BASE = process.env.PIPED_BASE || 'https://piped.video';

router.get('/', async (req, res) => {
  try {
    const query = String(req.query.q || '');
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const url = `${PIPED_BASE}/api/v1/search?q=${encodeURIComponent(query)}&filter=music&region=US`;
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(502).json({ error: 'Upstream search failed' });
    }
    const data = await r.json();
    const tracks = Array.isArray(data) ? data
      .filter((item: any) => item && (item.type === 'video' || typeof item.duration === 'number'))
      .slice(0, 30)
      .map((v: any) => ({
        id: v.id,
        title: v.title,
        channel: v.uploader || v.uploaderName || '',
        thumbnail: (v.thumbnails && v.thumbnails[0]) || v.thumbnail || '',
        duration: v.duration ? new Date(v.duration * 1000).toISOString().slice(14, 19) : '0:00',
        durationSeconds: v.duration || 0,
        url: `https://www.youtube.com/watch?v=${v.id}`,
      })) : [];

    return res.json({ tracks });
  } catch (err) {
    console.error('Search API error:', err);
    return res.status(500).json({ error: 'Failed to search for tracks' });
  }
});

export default router;


