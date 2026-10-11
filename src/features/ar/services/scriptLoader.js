/**
 * Loads A-Frame and MindAR (Image Tracking) from CDN at runtime, only when
 * the AR page needs them. Keeping these heavy libraries out of the main
 * bundle keeps the rest of the (non-AR) site light and fast on mobile.
 *
 * Load order matters: A-Frame must be ready before MindAR's A-Frame build.
 * Promises are cached so repeated navigations don't re-inject scripts.
 */

// Pinned versions known to work together.
const AFRAME_SRC = 'https://aframe.io/releases/1.5.0/aframe.min.js';
const MINDAR_SRC =
  'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';

const cache = new Map();

function loadScript(src) {
  if (cache.has(src)) return cache.get(src);

  const promise = new Promise((resolve, reject) => {
    // Already present (e.g. added by a previous mount)?
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing && existing.dataset.loaded === 'true') {
      resolve();
      return;
    }
    const el = existing || document.createElement('script');
    el.src = src;
    el.async = true;
    el.dataset.src = src;
    el.addEventListener('load', () => {
      el.dataset.loaded = 'true';
      resolve();
    });
    el.addEventListener('error', () =>
      reject(new Error(`Gagal memuat skrip: ${src}`))
    );
    if (!existing) document.head.appendChild(el);
  });

  cache.set(src, promise);
  return promise;
}

/** Ensure A-Frame is available on window.AFRAME. */
export async function ensureAFrame() {
  if (typeof window !== 'undefined' && window.AFRAME) return;
  await loadScript(AFRAME_SRC);
}

/**
 * Ensure A-Frame + MindAR (image-aframe) are loaded and registered.
 * Resolves once the `mindar-image` system/component is available.
 */
export async function ensureMindAR() {
  await ensureAFrame();
  // MindAR registers A-Frame components on load.
  if (
    typeof window !== 'undefined' &&
    window.AFRAME &&
    window.AFRAME.systems &&
    window.AFRAME.systems['mindar-image-system']
  ) {
    return;
  }
  await loadScript(MINDAR_SRC);
}
