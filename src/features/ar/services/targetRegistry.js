/**
 * Maps a MindAR target image index (its position in targets.mind) to the
 * instrument it represents and which AR experience to show.
 *
 * AR modes:
 *   'instrument' → Mode 1: full instrument overview (3D model / image) + hotspots
 *   'concept'    → Mode 2: sound/wave concept + audio
 *   'video'      → Mode 3: performance video
 *
 * CURRENT TEST SETUP: only ONE target (index 0 → Suling Bambu, 3D model),
 * matching the single compiled image in public/assets/ar/targets.mind.
 *
 * To add more targets later: append images to the compile list (same order)
 * and add entries here — e.g.:
 *   1: { instrumentId: 'suling-bambu', mode: AR_MODES.CONCEPT },
 *   2: { instrumentId: 'suling-bambu', mode: AR_MODES.VIDEO },
 * No other code changes are required.
 */

export const AR_MODES = {
  INSTRUMENT: 'instrument',
  CONCEPT: 'concept',
  VIDEO: 'video',
};

export const MODE_META = {
  instrument: { label: 'Bentuk Alat Musik', icon: '🎸' },
  concept: { label: 'Konsep Bunyi', icon: '🌊' },
  video: { label: 'Video Memainkan', icon: '🎬' },
};

/** Compiled multi-target file (relative to the site root; see media.assetUrl). */
export const TARGETS_MIND_PATH = '/assets/ar/targets.mind';

export const targetRegistry = {
  0: { instrumentId: 'suling-bambu', mode: AR_MODES.INSTRUMENT },
};

export function getTargetConfig(index) {
  return targetRegistry[index] || null;
}

export function getTargetCount() {
  return Object.keys(targetRegistry).length;
}

/** All target indices, ascending — used to render one entity per target. */
export function getTargetIndices() {
  return Object.keys(targetRegistry)
    .map(Number)
    .sort((a, b) => a - b);
}
