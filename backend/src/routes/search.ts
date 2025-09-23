// GET /api/search: searches YouTube via yt-search and maps results to Track
import { Router } from 'express';
import ytSearch from 'yt-search';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const query = String(req.query.q || '');
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await ytSearch({ query, category: 'music' } as any);
    const tracks = (results.videos || []).slice(0, 20).map((v: any) => ({
      id: v.videoId,
      title: v.title,
      channel: v.author?.name ?? '',
      thumbnail: v.thumbnail,
      duration: v.timestamp || '0:00',
      durationSeconds: Number(v.seconds ?? 0),
      url: v.url,
      views: typeof v.views === 'number' ? v.views : undefined,
    }));

    return res.json({ tracks });
  } catch (err) {
    console.error('Search API error:', err);
    return res.status(500).json({ error: 'Failed to search for tracks' });
  }
});

export default router;


