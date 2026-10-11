import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Full static app. No proxy/backend configured on purpose.
// Camera (getUserMedia) requires a secure context in production (HTTPS).
// For testing AR on a real phone over LAN during dev, serve over HTTPS
// (e.g. add @vitejs/plugin-basic-ssl) — see README.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // expose on LAN so a phone on the same network can open it
  },
  build: {
    target: 'es2020',
    // A-Frame / MindAR are loaded from CDN at runtime (AR route only),
    // so they stay out of the main bundle and the non-AR site stays light.
  },
});
