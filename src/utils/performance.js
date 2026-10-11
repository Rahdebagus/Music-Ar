/**
 * Performance helpers: a small FPS meter and the low-performance decision.
 * The AR scene can read the FPS meter to drop effects if frame rate sags.
 */
import { isLowEndDevice, prefersReducedMotion } from './device.js';

const LOW_PERF_KEY = 'ar-music:lowPerf';

/**
 * Returns true when the app should run in "low performance" mode:
 * user override (localStorage) OR a weak device OR reduced-motion.
 */
export function shouldUseLowPerformance() {
  try {
    const override = localStorage.getItem(LOW_PERF_KEY);
    if (override === 'on') return true;
    if (override === 'off') return false;
  } catch {
    /* localStorage may be unavailable (private mode) — ignore */
  }
  return isLowEndDevice() || prefersReducedMotion();
}

export function setLowPerformanceOverride(value /* 'on' | 'off' | null */) {
  try {
    if (value === null) localStorage.removeItem(LOW_PERF_KEY);
    else localStorage.setItem(LOW_PERF_KEY, value);
  } catch {
    /* ignore */
  }
}

/**
 * Simple requestAnimationFrame FPS sampler.
 * const fps = createFpsMeter(); fps.start(); ... fps.value; fps.stop();
 */
export function createFpsMeter() {
  let raf = null;
  let last = 0;
  let frames = 0;
  let acc = 0;
  const meter = { value: 60, running: false };

  function tick(now) {
    if (!meter.running) return;
    if (last) {
      acc += now - last;
      frames += 1;
      if (acc >= 500) {
        meter.value = Math.round((frames * 1000) / acc);
        acc = 0;
        frames = 0;
      }
    }
    last = now;
    raf = requestAnimationFrame(tick);
  }

  meter.start = () => {
    if (meter.running) return;
    meter.running = true;
    last = 0;
    raf = requestAnimationFrame(tick);
  };
  meter.stop = () => {
    meter.running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };
  return meter;
}
