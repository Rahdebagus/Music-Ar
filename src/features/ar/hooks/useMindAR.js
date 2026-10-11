import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureMindAR } from '../services/scriptLoader.js';
import { TARGETS_MIND_PATH, getTargetConfig } from '../services/targetRegistry.js';
import { assetUrl } from '@/utils/media.js';
import { canRunAR, isSecureContextForCamera } from '@/utils/device.js';

/**
 * Orchestrates the MindAR + A-Frame lifecycle for the AR page.
 *
 * Responsibilities:
 *  - lazy-load A-Frame + MindAR (only on user gesture)
 *  - verify targets.mind exists before touching the camera
 *  - start the MindAR system and wire camera + target events
 *  - expose the active target (index + instrument + mode)
 *  - fully clean up on exit/unmount: stop the system, stop the camera
 *    stream, and let callers pause their own media
 *
 * The <a-scene> is only rendered once `sceneMounted` is true, so the camera
 * is never initialized before the user asks for it.
 */
export function useMindAR({ onTargetFound, onTargetLost, onCameraReady } = {}) {
  const sceneRef = useRef(null);
  const startedRef = useRef(false);
  const listenersRef = useRef([]);

  const [status, setStatus] = useState('idle'); // idle|checking|starting|scanning|error|stopped
  const [errorType, setErrorType] = useState(null); // unsupported|no-mind|camera|load
  const [sceneMounted, setSceneMounted] = useState(false);
  const [activeTargetIndex, setActiveTargetIndex] = useState(null);

  // Keep latest callbacks without retriggering the start effect.
  const cbRef = useRef({});
  cbRef.current = { onTargetFound, onTargetLost, onCameraReady };

  const getSystem = useCallback(() => {
    const scene = sceneRef.current;
    return scene?.systems?.['mindar-image-system'] || null;
  }, []);

  /** Stop everything MindAR/camera-related. Safe to call multiple times. */
  const teardown = useCallback(() => {
    const scene = sceneRef.current;
    const system = getSystem();
    try {
      system?.stop?.();
    } catch {
      /* ignore */
    }
    // Belt-and-suspenders: stop any camera track MindAR may still hold.
    try {
      const stream = system?.video?.srcObject;
      stream?.getTracks?.().forEach((t) => t.stop());
    } catch {
      /* ignore */
    }
    // Remove target listeners.
    listenersRef.current.forEach(({ el, type, fn }) =>
      el.removeEventListener(type, fn)
    );
    listenersRef.current = [];
    if (scene) {
      scene.removeEventListener('arReady', scene.__arReady);
      scene.removeEventListener('arError', scene.__arError);
    }
    startedRef.current = false;
  }, [getSystem]);

  /** User gesture entry point: check support, verify .mind, mount scene. */
  const requestStart = useCallback(async () => {
    setErrorType(null);

    if (!canRunAR() || !isSecureContextForCamera()) {
      setErrorType('unsupported');
      setStatus('error');
      return;
    }

    setStatus('checking');
    // Verify the compiled target file is actually present & binary.
    try {
      const res = await fetch(assetUrl(TARGETS_MIND_PATH), { cache: 'no-store' });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || type.includes('text/html')) {
        setErrorType('no-mind');
        setStatus('error');
        return;
      }
    } catch {
      setErrorType('no-mind');
      setStatus('error');
      return;
    }

    try {
      await ensureMindAR();
    } catch {
      setErrorType('load');
      setStatus('error');
      return;
    }

    setStatus('starting');
    setSceneMounted(true); // triggers the start effect below once <a-scene> mounts
  }, []);

  const stop = useCallback(() => {
    teardown();
    setSceneMounted(false);
    setActiveTargetIndex(null);
    setStatus('idle');
  }, [teardown]);

  const reset = useCallback(() => {
    setActiveTargetIndex(null);
    cbRef.current.onTargetLost?.();
  }, []);

  // Start the MindAR system once the scene element is in the DOM & loaded.
  useEffect(() => {
    if (!sceneMounted || startedRef.current) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let cancelled = false;

    const wireAndStart = () => {
      if (cancelled || startedRef.current) return;
      startedRef.current = true;

      // Camera ready / error events from MindAR.
      const onReady = () => {
        if (cancelled) return;
        setStatus('scanning');
        cbRef.current.onCameraReady?.();
      };
      const onErr = () => {
        if (cancelled) return;
        setErrorType('camera');
        setStatus('error');
      };
      scene.__arReady = onReady;
      scene.__arError = onErr;
      scene.addEventListener('arReady', onReady);
      scene.addEventListener('arError', onErr);

      // Per-target found/lost listeners.
      const targetEls = scene.querySelectorAll('[data-target-index]');
      targetEls.forEach((el) => {
        const index = Number(el.getAttribute('data-target-index'));
        const foundFn = () => {
          setActiveTargetIndex(index);
          cbRef.current.onTargetFound?.(index, getTargetConfig(index));
        };
        const lostFn = () => {
          setActiveTargetIndex((cur) => (cur === index ? null : cur));
          cbRef.current.onTargetLost?.(index, getTargetConfig(index));
        };
        el.addEventListener('targetFound', foundFn);
        el.addEventListener('targetLost', lostFn);
        listenersRef.current.push(
          { el, type: 'targetFound', fn: foundFn },
          { el, type: 'targetLost', fn: lostFn }
        );
      });

      // Kick off the MindAR engine (opens the camera).
      try {
        const system = scene.systems?.['mindar-image-system'];
        const maybe = system?.start?.();
        if (maybe && typeof maybe.catch === 'function') {
          maybe.catch(() => onErr());
        }
      } catch {
        onErr();
      }
    };

    if (scene.hasLoaded) {
      wireAndStart();
    } else {
      scene.addEventListener('loaded', wireAndStart, { once: true });
    }

    return () => {
      cancelled = true;
      scene.removeEventListener('loaded', wireAndStart);
    };
  }, [sceneMounted]);

  // Final safety net: tear down on unmount.
  useEffect(() => teardown, [teardown]);

  return {
    sceneRef,
    status,
    errorType,
    sceneMounted,
    activeTargetIndex,
    activeTarget: activeTargetIndex == null
      ? null
      : { index: activeTargetIndex, ...getTargetConfig(activeTargetIndex) },
    requestStart,
    stop,
    reset,
  };
}
