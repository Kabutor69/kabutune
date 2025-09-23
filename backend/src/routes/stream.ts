// GET /api/stream/:id: streams audio via ytdl-core with play-dl then yt-dlp fallback
import { Router } from 'express';
import ytdl from '@distube/ytdl-core';
import * as playdl from 'play-dl';
import YTDlpWrap from 'yt-dlp-wrap';
import { spawnSync } from 'child_process';

const router = Router();

async function getDirectUrlWithYtDlp(videoId: string): Promise<string | null> {
  try {
    const ytDlp = new YTDlpWrap();
    const path = ytDlp.getBinaryPath();
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const result = spawnSync(path, [
      url,
      '-f', 'bestaudio[acodec^=opus]/bestaudio',
      '--get-url'
    ], { encoding: 'utf-8' });
    if (result.status === 0) {
      const out = (result.stdout || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).pop();
      return out || null;
    }
    return null;
  } catch {
    return null;
  }
}

router.get('/:id', async (req, res) => {
  try {
    const videoId = String(req.params.id || '');
    if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
    if (!ytdl.validateID(videoId)) return res.status(400).json({ error: 'Invalid video ID' });

    const baseHeaders: Record<string, string> = {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
      'referer': 'https://www.youtube.com/',
      'origin': 'https://www.youtube.com',
    };

    const requestOptions: Record<string, unknown> = { headers: baseHeaders };

    let audioStream = ytdl(videoId, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions,
      highWaterMark: 1 << 25,
    });

    let retried = false;
    const handleError = async (err: unknown) => {
      const statusCode = (err as any)?.statusCode;
      if (!retried && statusCode === 429) {
        retried = true;
        const altHeaders = {
          ...baseHeaders,
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
        };
        const altReq = { headers: altHeaders } as Record<string, unknown>;
        audioStream = ytdl(videoId, {
          filter: 'audioonly',
          quality: 'highestaudio',
          requestOptions: altReq,
          highWaterMark: 1 << 25,
        });
        audioStream.on('error', handleError as any);
        res.setHeader('Content-Type', 'audio/webm');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        audioStream.pipe(res);
        return;
      }
      try {
        const direct = await getDirectUrlWithYtDlp(videoId);
        if (direct && !res.headersSent) {
          res.setHeader('Cache-Control', 'public, max-age=600');
          return res.redirect(302, direct);
        }
      } catch {}
      try {
        const source = await playdl.stream(`https://www.youtube.com/watch?v=${videoId}`, {
          discordPlayerCompatibility: false,
          quality: 2,
        } as any);
        const t = (source as any).type as string | undefined;
        if (!res.headersSent) {
          if (t === 'mp3') res.setHeader('Content-Type', 'audio/mpeg');
          else if (t === 'aac') res.setHeader('Content-Type', 'audio/aac');
          else res.setHeader('Content-Type', 'audio/webm');
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
        (source.stream as any).on('error', async () => {
          const direct2 = await getDirectUrlWithYtDlp(videoId);
          if (direct2 && !res.headersSent) {
            res.setHeader('Cache-Control', 'public, max-age=600');
            return res.redirect(302, direct2);
          }
          if (!res.headersSent) res.status(500).json({ error: 'Failed to stream audio' });
        });
        (source.stream as any).pipe(res);
        return;
      } catch {}
      if (!res.headersSent) {
        res.status(statusCode === 429 ? 429 : 500).json({ error: statusCode === 429 ? 'Rate limited by YouTube' : 'Failed to stream audio' });
      }
    };

    audioStream.on('error', handleError as any);
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    audioStream.pipe(res);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to stream audio' });
  }
});

export default router;


