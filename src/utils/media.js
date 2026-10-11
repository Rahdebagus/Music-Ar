/**
 * Media helpers: safe asset URLs, placeholder fallbacks, formatting.
 * Keeps the site rendering even when real assets haven't been added yet.
 */

/**
 * Resolve an asset path. Paths in the JSON data are stored as
 * site-absolute (e.g. "/assets/instruments/seruling/thumbnail.webp").
 * We respect Vite's BASE_URL so the app works under a sub-path
 * (e.g. GitHub Pages project sites).
 */
export function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return base.endsWith('/') ? base + clean : base + '/' + clean;
}

/**
 * An inline SVG placeholder (data URI) so <img> never shows a broken icon
 * before real assets are dropped in. Label is drawn onto the tile.
 */
export function placeholderImage(label = 'Alat Musik', seed = 0) {
  const palettes = [
    ['#0f766e', '#99f6e4'],
    ['#96602f', '#e6d2b8'],
    ['#b45309', '#fde68a'],
    ['#115e59', '#5eead4'],
    ['#7c2d12', '#fdba74'],
  ];
  const [c1, c2] = palettes[Math.abs(seed) % palettes.length];
  const safe = String(label)
    .slice(0, 28)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <g fill="#ffffff" opacity="0.92" font-family="Inter,system-ui,sans-serif" text-anchor="middle">
    <text x="300" y="196" font-size="34">♪</text>
    <text x="300" y="250" font-size="26" font-weight="700">${safe}</text>
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Format seconds (number) or "m:ss" string into a tidy "m:ss" label. */
export function formatDuration(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const total = Math.max(0, Math.round(value));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
