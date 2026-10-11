import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App.jsx';
import '@/styles/globals.css';

// Restore a deep link saved by public/404.html on static hosts that lack
// SPA rewrites (see that file). No-op on hosts that rewrite properly.
try {
  const saved = sessionStorage.getItem('redirectPath');
  if (saved) {
    sessionStorage.removeItem('redirectPath');
    if (saved !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, '', saved);
    }
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register the service worker (production only) so the app is installable
// and runs standalone. Skipped in dev to avoid caching headaches.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* non-fatal: app still works without offline support */
    });
  });
}
