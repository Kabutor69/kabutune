// API router: wires subroutes and health endpoint
import { Router } from 'express';
import search from './search';
import related from './related';
import stream from './stream';
import news from './news';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/search', search);
router.use('/related', related);
router.use('/stream', stream);
router.use('/news', news);

export default router;
