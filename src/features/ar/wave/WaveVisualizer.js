import { WaveCanvas } from './WaveCanvas.js';

/**
 * Returns a cached Web Audio analyser graph for an <audio> element.
 *
 * Why cache on the element: `createMediaElementSource` may be called only
 * ONCE per media element, and once an element is routed through Web Audio,
 * closing that AudioContext permanently silences the element. So we build the
 * graph a single time, stash it on the element, keep it for the element's
 * lifetime, and never close it here. Returns null if Web Audio is unavailable
 * or the element was already captured elsewhere (→ synthetic wave fallback).
 */
function getAnalyserForElement(audioEl) {
  if (!audioEl) return null;
  if (audioEl.__waveGraph) return audioEl.__waveGraph.analyser;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const source = ctx.createMediaElementSource(audioEl);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioEl.__waveGraph = { ctx, analyser, source };
    return analyser;
  } catch {
    return null;
  }
}

/**
 * WaveVisualizer — connects an <audio> element to a WaveCanvas.
 * On capable devices the drawn wave reflects the real sound (via a cached
 * analyser); otherwise it shows a light synthetic wave.
 *
 *   const viz = new WaveVisualizer(canvasEl, audioEl, { lowPerf });
 *   viz.start(); viz.setActive(isPlaying); ... viz.destroy();
 */
export class WaveVisualizer {
  constructor(canvas, audioEl, { color = '#0d9488', lowPerf = false } = {}) {
    this.wave = new WaveCanvas(canvas, { color, lowPerf });
    this.audioEl = audioEl;
    this.lowPerf = lowPerf;

    if (!lowPerf) {
      const analyser = getAnalyserForElement(audioEl);
      this.wave.setAnalyser(analyser);
    }
  }

  start() {
    this.wave.start();
  }

  setActive(active) {
    // Browsers require a user gesture to resume a suspended AudioContext.
    const graph = this.audioEl?.__waveGraph;
    if (active && graph?.ctx?.state === 'suspended') {
      graph.ctx.resume().catch(() => {});
    }
    this.wave.setActive(active);
  }

  /** Stops only the canvas animation. The audio graph is intentionally left
      intact so the element keeps producing sound after this HUD unmounts. */
  destroy() {
    this.wave.stop();
  }
}
