/**
 * App navigation model.
 *
 * TAB_ITEMS powers the bottom tab bar (the app's primary navigation). The
 * middle item (AR) is rendered as a raised center action.
 * SCREENS maps routes to the title/behavior the top AppBar shows.
 */
export const TAB_ITEMS = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/instruments', label: 'Jelajahi', icon: '🎶' },
  { to: '/ar', label: 'AR', icon: '📷', center: true },
  { to: '/materials', label: 'Materi', icon: '📖', locked: true },
  { to: '/quiz', label: 'Kuis', icon: '🧠', locked: true },
];

/** Static part of the AppBar config. Dynamic titles (e.g. instrument
 *  detail) are resolved in AppBar from the path. `back: true` shows a back
 *  arrow instead of the brand. */
export const SCREENS = {
  '/': { title: 'AR Alat Musik', brand: true },
  '/instruments': { title: 'Jelajahi Alat Musik' },
  '/materials': { title: 'Materi Belajar' },
  '/videos': { title: 'Video Materi', back: true },
  '/quiz': { title: 'Kuis' },
  '/guide': { title: 'Cara Menggunakan', back: true },
  '/about': { title: 'Tentang', back: true },
};
