import { useEffect, useRef } from 'react';
import { WaveVisualizer } from '../wave/WaveVisualizer.js';

/**
 * HTML heads-up strip for Mode 2 (concept). Shows a live sound-wave canvas
 * (driven by the instrument audio when playing) plus a one-line concept hint.
 * Rendered over the camera; the 3D rings in the scene complement this.
 */
export function ConceptHud({ instrument, audioEl, playing, lowPerf }) {
  const canvasRef = useRef(null);
  const vizRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !audioEl) return;
    const viz = new WaveVisualizer(canvasRef.current, audioEl, { lowPerf });
    vizRef.current = viz;
    viz.start();
    return () => {
      viz.destroy();
      vizRef.current = null;
    };
  }, [audioEl, lowPerf]);

  useEffect(() => {
    vizRef.current?.setActive(playing);
  }, [playing]);

  const wc = instrument?.waveConcept || {};

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 px-3"
      style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
    >
      <div className="mx-auto max-w-md rounded-2xl bg-black/55 p-3 text-white backdrop-blur">
        <p className="text-xs font-medium text-brand-200">
          {playing ? '🔊 Memutar — amati gelombangnya' : 'Tekan 🔊 untuk mendengar & melihat gelombang'}
        </p>
        <canvas ref={canvasRef} className="mt-1 h-16 w-full" />
        <p className="mt-1 text-[11px] leading-snug text-white/80">
          {wc.waveType ? `${wc.waveType} · ` : ''}
          {wc.sourceOfVibration}
        </p>
      </div>
    </div>
  );
}
