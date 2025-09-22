import { Router } from 'express';
import ytSearch from 'yt-search';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    const q = String(req.query.q || '');
    if (!videoId && !q) return res.status(400).json({ error: 'Video ID or q is required' });

    let results: any;
    if (q) {
      results = await ytSearch({ query: q, category: 'music' });
    } else {
      // fallback: derive a short token from videoId (not calling getInfo to avoid 429)
      const token = videoId.slice(0, 5);
      results = await ytSearch({ query: token, category: 'music' });
    }
    const tracks = (results.videos || [])
      .filter((v: any) => !videoId || v.videoId !== videoId)
      .slice(0, 10)
      .map((v: any) => ({
        id: v.videoId,
        title: v.title,
        channel: v.author?.name ?? '',
        thumbnail: v.thumbnail,
        duration: v.timestamp || '0:00',
        durationSeconds: Number(v.seconds ?? 0),
        url: v.url,
      }));

    return res.json({ tracks });
  } catch (err) {
    console.error('Related videos API error:', err);
    return res.status(500).json({ error: 'Failed to fetch related videos' });
  }
});

export default router;


