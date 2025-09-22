import { Router } from 'express';
import ytSearch from 'yt-search';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const query = String(req.query.q || '');
    const pageToken = String(req.query.pageToken || '');
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // yt-search does not use API key and has no page tokens; emulate paging later if needed
    const results = await ytSearch({ query, category: 'music' });
    const tracks = (results.videos || []).slice(0, 20).map((v: any) => ({
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
    console.error('Search API error:', err);
    return res.status(500).json({ error: 'Failed to search for tracks' });
  }
});

export default router;


