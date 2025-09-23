// GET /api/related/:id: returns related tracks via Piped (or by q)
import { Router } from 'express';
import { fetch } from 'undici';

const router = Router();

const PIPED_BASE = process.env.PIPED_BASE || 'https://piped.video';

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    const q = String(req.query.q || '');
    if (!videoId && !q) return res.status(400).json({ error: 'Video ID or q is required' });

    let data: any[] = [];
    if (q) {
      const s = await fetch(`${PIPED_BASE}/api/v1/search?q=${encodeURIComponent(q)}&filter=music&region=US`);
      data = s.ok ? (await s.json() as any[]) : [];
    } else {
      const r = await fetch(`${PIPED_BASE}/api/v1/related/${encodeURIComponent(videoId)}`);
      data = r.ok ? (await r.json() as any[]) : [];
    }

    const tracks = Array.isArray(data) ? data
      .filter((v: any) => v && v.id && v.id !== videoId)
      .slice(0, 10)
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
    console.error('Related videos API error:', err);
    return res.status(500).json({ error: 'Failed to fetch related videos' });
  }
});

export default router;


