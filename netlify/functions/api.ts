import {
  checkRateLimit,
  mapGeminiError,
  runClarityAi,
  runCompanionAi,
  runSmartJourneyAi,
  runTranslateAi,
} from '../../server/geminiService.ts';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');

  if (req.method === 'GET' && (pathname === '/health' || pathname === '')) {
    const keyConfigured =
      Boolean(process.env.GEMINI_API_KEY?.trim()) &&
      process.env.GEMINI_API_KEY?.trim() !== 'MY_GEMINI_API_KEY';

    return jsonResponse({
      ok: true,
      service: 'CORE Rosewater Netlify API',
      aiConfigured: keyConfigured,
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, 405);
  }

  const clientIp =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for') ||
    'netlify';

  const limit = checkRateLimit(clientIp);
  if (!limit.allowed) {
    return jsonResponse(
      {
        error: 'RATE_LIMITED',
        message: `Too many AI requests. Please wait ${limit.retryAfterSec} seconds and try again.`,
      },
      429
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'INVALID_JSON', message: 'Invalid JSON request body.' }, 400);
  }

  try {
    if (pathname === '/ai/companion') {
      const data = await runCompanionAi(body);
      return jsonResponse({ ok: true, data });
    }
    if (pathname === '/ai/clarity') {
      const data = await runClarityAi(body);
      return jsonResponse({ ok: true, data });
    }
    if (pathname === '/ai/smart-journey') {
      const data = await runSmartJourneyAi(body);
      return jsonResponse({ ok: true, data });
    }
    if (pathname === '/ai/translate') {
      const data = await runTranslateAi(body);
      return jsonResponse({ ok: true, data });
    }
    return jsonResponse({ error: 'NOT_FOUND', message: 'Unknown AI endpoint.' }, 404);
  } catch (err) {
    const mapped = mapGeminiError(err);
    return jsonResponse({ error: mapped.code, message: mapped.message }, mapped.status);
  }
}
