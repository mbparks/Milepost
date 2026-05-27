/**
 * milepost-proxy: a tiny CORS-permissive proxy for Cloudflare Workers.
 *
 * Deploy in about a minute:
 *   1. Sign in or create a free account at https://dash.cloudflare.com
 *   2. Workers & Pages, then Create, then "Start from Hello World"
 *   3. Name it whatever you like (e.g. milepost-proxy)
 *   4. Paste this entire file as the worker source, click Deploy
 *   5. Copy the worker URL Cloudflare gives you. It will look like:
 *        https://milepost-proxy.YOUR-NAME.workers.dev
 *   6. In Milepost Settings, set CORS Proxy to:
 *        https://milepost-proxy.YOUR-NAME.workers.dev/?url=
 *      (note the trailing /?url= so Milepost can append the encoded target URL)
 *   7. Save Settings, reload milepost-status.html, run probes again.
 *
 * Why bother:
 *   Public CORS proxies are individually unreliable. AllOrigins gets overloaded
 *   during peak hours and either times out or stops responding. corsproxy.io
 *   maintains an internal blocklist of upstream hosts it classifies as
 *   "commercial APIs" and returns HTTP 403 for them (Yahoo Finance, Stooq,
 *   Frankfurter, Apple Marketing Tools, arXiv all hit this). Together the
 *   public layer leaves persistent gaps in Milepost captures.
 *
 *   Cloudflare's free Workers tier gives you 100,000 requests/day, runs at the
 *   edge near the user, and most importantly runs YOUR code. There's no
 *   third-party blocklist, no scheduled maintenance, no rate-limiting against
 *   you specifically. Once Milepost points at your worker, every CORS-blocked
 *   source becomes reachable.
 *
 * Usage:
 *   GET https://YOUR-WORKER.workers.dev/?url=https%3A%2F%2Fhost%2Fpath
 *   Returns the upstream response body with Access-Control-Allow-Origin: *.
 *
 * Security note: this proxy is open by default. Anyone who guesses the worker
 *   URL can use it to fetch any HTTP(S) URL through your free-tier quota. For
 *   personal use this is usually fine (your URL is hard to guess, and the
 *   100K/day cap caps the damage), but you can restrict it to your own origin
 *   by uncommenting the ALLOWED_ORIGINS block below.
 */

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

// Optional: restrict to specific origins. Edit and uncomment to enable.
// const ALLOWED_ORIGINS = ['https://mbparks.com'];

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Uncomment to enforce origin restriction:
    // const origin = request.headers.get('Origin') || '';
    // if (!ALLOWED_ORIGINS.includes(origin)) {
    //   return text('Forbidden: origin not allowed', 403);
    // }

    const reqUrl = new URL(request.url);
    const target = reqUrl.searchParams.get('url');
    if (!target) return text('Missing ?url= query parameter', 400);

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch (_) {
      return text('Invalid url parameter (must be a full URL)', 400);
    }
    if (!ALLOWED_PROTOCOLS.includes(targetUrl.protocol)) {
      return text('Only http(s) URLs are supported', 400);
    }

    try {
      const upstream = await fetch(target, {
        method: 'GET',
        headers: {
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Language': request.headers.get('Accept-Language') || 'en',
          'User-Agent': 'Mozilla/5.0 (compatible; Milepost/1.0; +https://github.com/)',
        },
        redirect: 'follow',
        cf: { cacheTtl: 30, cacheEverything: false },
      });
      const body = await upstream.arrayBuffer();
      const responseHeaders = corsHeaders();
      responseHeaders.set('Content-Type', upstream.headers.get('Content-Type') || 'application/octet-stream');
      return new Response(body, { status: upstream.status, headers: responseHeaders });
    } catch (e) {
      return text(`Upstream fetch failed: ${e.message}`, 502);
    }
  },
};

function corsHeaders() {
  const h = new Headers();
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  h.set('Cache-Control', 'no-cache');
  return h;
}

function text(msg, status) {
  const headers = corsHeaders();
  headers.set('Content-Type', 'text/plain');
  return new Response(msg, { status, headers });
}
