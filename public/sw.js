/* Minimal service worker for app-shell installability + light offline.
 * - Only touches same-origin GET requests.
 * - Never intercepts the camera, CDN (A-Frame/MindAR), range/media requests,
 *   or explicit no-store fetches (e.g. the targets.mind freshness check).
 * - Vite fingerprints asset filenames, so cache-first is safe for them.
 */
const CACHE = 'ar-musik-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // leave CDN alone
  if (request.headers.has('range')) return; // media seeking
  if (request.cache === 'no-store' || request.cache === 'reload') return;

  // App navigations: network-first with cached shell fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put('/', net.clone());
          return net;
        } catch {
          const cache = await caches.open(CACHE);
          return (await cache.match('/')) || Response.error();
        }
      })()
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(request);
      if (hit) return hit;
      try {
        const net = await fetch(request);
        if (net.ok && net.type === 'basic') cache.put(request, net.clone());
        return net;
      } catch {
        return hit || Response.error();
      }
    })()
  );
});
