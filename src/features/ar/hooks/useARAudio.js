import { useCallback, useEffect, useRef, useState } from 'react';
import { assetUrl } from '@/utils/media.js';

/**
 * Owns a single HTMLAudioElement for the AR instrument sound.
 * - Lazy: the src is only set when play() is first called.
 * - Exposes the element so the WaveVisualizer can tap it via Web Audio.
 * - Guarantees the audio is paused on unmount (no sound leaking out of AR).
 */
export function useARAudio() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  // Create the element once.
  if (!audioRef.current && typeof Audio !== 'undefined') {
    const a = new Audio();
    a.preload = 'none';
    a.crossOrigin = 'anonymous'; // same-origin assets → enables analyser
    audioRef.current = a;
  }

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setError(true);
      setPlaying(false);
    };
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);
    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
      a.pause();
      a.src = '';
    };
  }, []);

  const loadSrc = useCallback((src) => {
    const a = audioRef.current;
    if (!a || !src) return;
    const url = assetUrl(src);
    if (a.dataset?.src !== url) {
      a.src = url;
      if (a.dataset) a.dataset.src = url;
      setError(false);
    }
  }, []);

  const play = useCallback(
    (src) => {
      const a = audioRef.current;
      if (!a) return;
      if (src) loadSrc(src);
      a.play().catch(() => setError(true));
    },
    [loadSrc]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(
    (src) => {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) play(src);
      else pause();
    },
    [play, pause]
  );

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    try {
      a.currentTime = 0;
    } catch {
      /* ignore */
    }
  }, []);

  return { audioEl: audioRef.current, playing, error, play, pause, toggle, stop, loadSrc };
}
