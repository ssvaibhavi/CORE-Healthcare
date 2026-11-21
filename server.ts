import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  checkRateLimit,
  getLastAiDiagnostic,
  getTtsCapabilities,
  mapGeminiError,
  runClarityAi,
  runCompanionAi,
  runExplainOptionsAi,
  runSmartJourneyAi,
  runTeachBackAi,
  runTranslateAi,
  runTtsAi,
} from './server/geminiService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    const keyConfigured =
      Boolean(process.env.GEMINI_API_KEY?.trim()) &&
      process.env.GEMINI_API_KEY?.trim() !== 'MY_GEMINI_API_KEY';
    const ttsCaps = getTtsCapabilities();

    res.json({
      ok: true,
      service: 'CORE Rosewater API',
      aiConfigured: keyConfigured,
      ttsConfigured: ttsCaps.cloudTtsConfigured,
      ttsProviders: ttsCaps.providers,
      lastAiDiagnostic: getLastAiDiagnostic(),
    });
  });

  app.post('/api/ai/companion', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runCompanionAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/clarity', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runClarityAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/smart-journey', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runSmartJourneyAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/translate', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runTranslateAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/explain-options', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runExplainOptionsAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/teach-back', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runTeachBackAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  app.post('/api/ai/tts', async (req, res) => {
    const clientIp = req.ip || 'local';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.status(429).json({
        error: 'RATE_LIMITED',
        message: `Too many speech requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      });
      return;
    }

    try {
      const result = await runTtsAi(req.body ?? {});
      res.json({ ok: true, data: result });
    } catch (err) {
      const mapped = mapGeminiError(err, { operation: 'tts' });
      res.status(mapped.status).json({ error: mapped.code, message: mapped.message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: { server: httpServer },
        ws: { server: httpServer },
        allowedHosts: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`CORE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CORE server:', err);
  process.exit(1);
});
