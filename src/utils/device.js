/**
 * Lightweight device / capability detection. No external deps.
 * Used to decide AR support and to enable a low-performance mode on
 * weaker phones (fewer effects, PNG instead of 3D, simpler waves).
 */

export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/** getUserMedia requires a secure context (https) except on localhost. */
export function isSecureContextForCamera() {
  if (!isBrowser()) return false;
  if (window.isSecureContext) return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export function hasCameraApi() {
  return (
    isBrowser() &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

export function hasWebGL() {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export function isIOS() {
  if (!isBrowser()) return false;
  const ua = navigator.userAgent || '';
  // iPadOS 13+ reports as Mac; detect via touch points.
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isMobile() {
  if (!isBrowser()) return false;
  return /Android|iPhone|iPad|iPod|Mobile|Opera Mini/i.test(
    navigator.userAgent || ''
  );
}

/**
 * Whether AR can realistically run here. We still let the user try
 * (and surface a friendly error on failure), but this gates UI hints.
 */
export function canRunAR() {
  return hasCameraApi() && hasWebGL();
}

/**
 * Heuristic for "low-end" devices. Conservative: only flags clearly weak
 * hardware so we don't needlessly degrade the experience.
 */
export function isLowEndDevice() {
  if (!isBrowser()) return false;
  const mem = navigator.deviceMemory; // GB, Chrome only
  const cores = navigator.hardwareConcurrency;
  if (typeof mem === 'number' && mem <= 3) return true;
  if (typeof cores === 'number' && cores <= 4) return true;
  return false;
}

export function prefersReducedMotion() {
  if (!isBrowser() || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
