// GET /api/news: aggregates and caches RSS news items
import { Router } from 'express';
import Parser from 'rss-parser';

const router = Router();
const parser = new Parser();

type NewsItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  creator?: string;
  categories?: string[];
};

let cached: { items: NewsItem[]; at: number } | null = null;
const CACHE_MS = 5 * 60 * 1000;

const DEFAULT_FEEDS = [
  'https://www.theverge.com/rss/index.xml',
  'https://www.engadget.com/rss.xml',
  'https://pitchfork.com/rss/reviews/albums/',
  'https://www.rollingstone.com/music/music-news/feed/'
];

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    const feedsParam = String(req.query.feeds || '');
    const feeds = feedsParam
      ? feedsParam.split(',').map((u) => u.trim()).filter(Boolean)
      : DEFAULT_FEEDS;

    if (cached && now - cached.at < CACHE_MS) {
      return res.json({ items: cached.items });
    }

    const results: NewsItem[] = [];
    await Promise.all(
      feeds.map(async (url) => {
        try {
          const feed = await parser.parseURL(url);
          for (const item of feed.items.slice(0, 10)) {
            const entry: NewsItem = {
              title: item.title || '',
              link: item.link || '',
            };
            if (item.isoDate) entry.isoDate = item.isoDate;
            if (item.pubDate) entry.pubDate = item.pubDate;
            if ((item as any).contentSnippet) entry.contentSnippet = (item as any).contentSnippet as string;
            if ((item as any).creator) entry.creator = (item as any).creator as string;
            if (Array.isArray(item.categories)) entry.categories = item.categories as string[];
            results.push(entry);
          }
        } catch (e) {
          console.warn('Failed to parse feed', url, e);
        }
      })
    );

    results.sort((a, b) => {
      const da = a.isoDate ? Date.parse(a.isoDate) : (a.pubDate ? Date.parse(a.pubDate) : 0);
      const db = b.isoDate ? Date.parse(b.isoDate) : (b.pubDate ? Date.parse(b.pubDate) : 0);
      return db - da;
    });

    cached = { items: results.slice(0, 40), at: now };
    return res.json({ items: cached.items });
  } catch (err) {
    console.error('News API error:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;


