import { Router } from 'express';
import ytSearch from 'yt-search';
import ytdl from '@distube/ytdl-core';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });

    // Use ytdl-core to get the video title without API limits
    const info = await ytdl.getInfo(videoId);
    const title = info.videoDetails.title;
    const author = info.videoDetails.author?.name || '';

    const query = `${title.split(' ').slice(0, 3).join(' ')} ${author}`.trim();
    const results = await ytSearch({ query, category: 'music' });
    const tracks = (results.videos || [])
      .filter((v: any) => v.videoId !== videoId)
      .slice(0, 10)
      .map((v: any) => ({
        id: v.videoId,
        title: v.title,
        channel: v.author?.name ?? '',
        thumbnail: v.thumbnail,
        duration: v.timestamp || '0:00',
        url: v.url,
      }));

    return res.json({ tracks });
  } catch (err) {
    console.error('Related videos API error:', err);
    return res.status(500).json({ error: 'Failed to fetch related videos' });
  }
});

export default router;


