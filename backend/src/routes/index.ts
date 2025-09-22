import { Router } from 'express';
import search from './search';
import related from './related';
import stream from './stream';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/search', search);
router.use('/related', related);
router.use('/stream', stream);

export default router;
