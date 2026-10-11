import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMindAR } from '../hooks/useMindAR.js';
import { useARAudio } from '../hooks/useARAudio.js';
import { useTargetTracking } from '../hooks/useTargetTracking.js';
import {
  AR_MODES,
  getTargetConfig,
  getTargetIndices,
} from '../services/targetRegistry.js';
import { getInstrumentById } from '@/features/instruments/instrumentService.js';
import { getInstrumentPart } from '@/features/instruments/instrumentService.js';
import { InstrumentOverlay } from './Hotspot.jsx';
import { ConceptOverlay } from './ConceptOverlay.jsx';
import { VideoOverlay } from './VideoOverlay.jsx';
import { ConceptHud } from './ConceptHud.jsx';
import { ARScannerGuide } from './ARScannerGuide.jsx';
import { ARToolbar } from './ARToolbar.jsx';
import { ARInfoPopup } from './ARInfoPopup.jsx';
import { useProgress } from '@/hooks/useProgress.js';
import { assetUrl } from '@/utils/media.js';
import { cn } from '@/utils/cn.js';
import { TARGETS_MIND_PATH } from '../services/targetRegistry.js';

/**
 * The live AR experience: builds the A-Frame/MindAR scene (one entity per
 * registered target) and layers HTML controls on top. `onExit` returns the
 * user to the pre-scan screen / previous page. All media is paused and the
 * camera is released on exit and on unmount (handled by the hooks).
 */
export function ARScene({ lowPerf = false, preferInstrumentId, onExit }) {
  const { markTargetScanned } = useProgress();
  const audio = useARAudio();

  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [modelStatus, setModelStatus] = useState(''); // '', 'loaded', 'error'

  const indices = useMemo(() => getTargetIndices(), []);
  // Any target whose instrument has a video gets a (lazy) hidden <video>,
  // so audio+video controls work even in the 3D-model (instrument) mode.
  const videoIndices = useMemo(
    () =>
      indices.filter(
        (i) => getInstrumentById(getTargetConfig(i)?.instrumentId)?.video
      ),
    [indices]
  );

  const hidePlane = (index) => {
    const p = document.getElementById(`ar-vplane-${index}`);
    if (p) p.setAttribute('visible', 'false');
  };

  const handleTargetFound = useCallback(
    (index, config) => {
      setSelectedPart(null);
      if (config?.instrumentId) markTargetScanned(config.instrumentId);
    },
    [markTargetScanned]
  );

  const handleTargetLost = useCallback(() => {
    // Pause everything tied to the lost target.
    audio.pause();
    const vids = document.querySelectorAll('[data-ar-video]');
    vids.forEach((v) => v.pause());
    document
      .querySelectorAll('[id^="ar-vplane-"]')
      .forEach((p) => p.setAttribute('visible', 'false'));
    setVideoPlaying(false);
    setInfoOpen(false);
    setSelectedPart(null);
  }, [audio]);

  const {
    sceneRef,
    status,
    errorType,
    activeTarget,
    sceneMounted,
    requestStart,
    stop,
    reset: resetTracking,
  } = useMindAR({
    onTargetFound: handleTargetFound,
    onTargetLost: handleTargetLost,
  });

  const { instrument, mode, modeMeta } = useTargetTracking(activeTarget);

  // Start on mount (ARPage only renders ARScene after the user tapped start).
  useEffect(() => {
    requestStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hotspot taps (Mode 1): delegate click events from the scene.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !sceneMounted) return;
    const onClick = (e) => {
      const el = e.target;
      if (el?.classList?.contains('ar-hotspot')) {
        const partId = el.getAttribute('data-part-id');
        const instId = el.getAttribute('data-instrument-id');
        const part = getInstrumentPart(instId, partId);
        if (part) {
          setSelectedPart(part);
          setInfoOpen(true);
        }
      }
    };
    scene.addEventListener('click', onClick);
    return () => scene.removeEventListener('click', onClick);
  }, [sceneMounted, sceneRef]);

  // Diagnostic: track whether the 3D model actually loads (events bubble to
  // the scene). Surfaced as a small badge so issues are visible on-device.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !sceneMounted) return;
    const onLoaded = () => setModelStatus('loaded');
    const onError = () => setModelStatus('error');
    scene.addEventListener('model-loaded', onLoaded);
    scene.addEventListener('model-error', onError);
    return () => {
      scene.removeEventListener('model-loaded', onLoaded);
      scene.removeEventListener('model-error', onError);
    };
  }, [sceneMounted, sceneRef]);

  // Keep the active video element's play state in sync with UI. Works for any
  // active target whose instrument has a video (not only the VIDEO mode).
  const activeVideoEl = () =>
    activeTarget != null && instrument?.video
      ? document.getElementById(`ar-video-${activeTarget.index}`)
      : null;

  useEffect(() => {
    const v = activeVideoEl();
    if (!v) return;
    const onPlay = () => setVideoPlaying(true);
    const onPause = () => setVideoPlaying(false);
    const onEnded = () => setVideoPlaying(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTarget?.index]);

  const toggleAudio = useCallback(() => {
    if (instrument) audio.toggle(instrument.audio);
  }, [audio, instrument]);

  const toggleVideo = useCallback(() => {
    const v = activeVideoEl();
    if (!v || activeTarget == null) return;
    const plane = document.getElementById(`ar-vplane-${activeTarget.index}`);
    if (v.paused) {
      // Pause instrument audio so the two don't overlap.
      audio.pause();
      v.muted = muted;
      if (plane) plane.setAttribute('visible', 'true');
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, audio, activeTarget?.index, instrument]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const v = activeVideoEl();
      if (v) v.muted = next;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTarget?.index]);

  const handleReset = useCallback(() => {
    audio.stop();
    const v = activeVideoEl();
    if (v) {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    if (activeTarget != null) hidePlane(activeTarget.index);
    // Reset the 3D model's rotation/scale back to the fitted default.
    const modelEl = sceneRef.current?.querySelector('[ar-model-control]');
    modelEl?.components?.['ar-model-control']?.resetTransform();
    setInfoOpen(false);
    setSelectedPart(null);
    resetTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, resetTracking, activeTarget?.index]);

  const handleExit = useCallback(
    (destination) => {
      audio.stop();
      stop();
      onExit?.(typeof destination === 'string' ? destination : undefined);
    },
    [audio, stop, onExit]
  );

  const handleRetry = useCallback(() => {
    stop();
    // Re-run support/.mind checks and restart.
    requestStart();
  }, [stop, requestStart]);

  const showGuide = status === 'scanning' && !activeTarget;
  const starting = status === 'checking' || status === 'starting';

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Hidden, lazy videos used as textures for Mode 3 planes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0"
      >
        {videoIndices.map((i) => {
          const inst = getInstrumentById(getTargetConfig(i).instrumentId);
          return (
            <video
              key={i}
              id={`ar-video-${i}`}
              data-ar-video=""
              src={inst?.video ? assetUrl(inst.video) : undefined}
              poster={inst?.poster ? assetUrl(inst.poster) : undefined}
              preload="none"
              playsInline
              muted
              crossOrigin="anonymous"
            />
          );
        })}
      </div>

      {/* The A-Frame + MindAR scene (rendered only after start). */}
      {sceneMounted && (
        <a-scene
          ref={sceneRef}
          mindar-image={`imageTargetSrc: ${assetUrl(
            TARGETS_MIND_PATH
          )}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; maxTrack: 1`}
          renderer="colorManagement: true; toneMapping: none"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          embedded="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <a-camera
            position="0 0 0"
            look-controls="enabled: false"
            cursor="rayOrigin: mouse; fuse: false"
            raycaster="objects: .ar-hotspot; far: 10000"
          ></a-camera>

          {/* Bright, even lighting so the model is clearly visible on any
              device / room (scenes have no lights by default). Virtual lights
              illuminate the model regardless of the real room's darkness. */}
          <a-entity light="type: ambient; intensity: 1.6"></a-entity>
          <a-entity light="type: hemisphere; color: #ffffff; groundColor: #b8a98f; intensity: 1.0"></a-entity>
          <a-entity light="type: directional; intensity: 1.3" position="1 2 1"></a-entity>
          <a-entity light="type: directional; intensity: 0.7" position="-1 1 -1"></a-entity>

          {indices.map((i) => {
            const cfg = getTargetConfig(i);
            const inst = getInstrumentById(cfg.instrumentId);
            if (!inst) return null;
            return (
              <a-entity
                key={i}
                data-target-index={i}
                mindar-image-target={`targetIndex: ${i}`}
              >
                {cfg.mode === AR_MODES.INSTRUMENT && (
                  <InstrumentOverlay instrument={inst} />
                )}
                {cfg.mode === AR_MODES.CONCEPT && (
                  <ConceptOverlay instrument={inst} lowPerf={lowPerf} />
                )}
                {cfg.mode === AR_MODES.VIDEO && <VideoOverlay index={i} />}

                {/* On-demand video plane: for non-VIDEO targets that still
                    have a video, hidden until the user taps the Video button. */}
                {cfg.mode !== AR_MODES.VIDEO && inst.video && (
                  <a-video
                    id={`ar-vplane-${i}`}
                    src={`#ar-video-${i}`}
                    visible="false"
                    position="0 0.95 0.05"
                    width="1"
                    height="0.5625"
                    material="shader: flat"
                  ></a-video>
                )}
              </a-entity>
            );
          })}
        </a-scene>
      )}

      {/* ---- HTML overlay layer ---- */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Top bar */}
        <div
          className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-3"
          style={{ paddingTop: 'calc(0.6rem + var(--safe-top))' }}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
              {activeTarget && modeMeta
                ? `${modeMeta.icon} ${instrument?.name} · ${modeMeta.label}`
                : 'Scan Alat Musik'}
            </span>
            {modelStatus && (
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-semibold text-white',
                  modelStatus === 'loaded' ? 'bg-green-600/80' : 'bg-red-600/80'
                )}
              >
                3D: {modelStatus}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleExit('/guide')}
              aria-label="Bantuan"
              className="grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur"
            >
              ?
            </button>
            <button
              type="button"
              onClick={() => handleExit()}
              aria-label="Keluar dari AR"
              className="grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Starting / camera loading */}
        {starting && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-6 py-5 text-white">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="text-sm">Menyiapkan kamera…</p>
            </div>
          </div>
        )}

        {/* Error states */}
        {status === 'error' && (
          <ARError errorType={errorType} onRetry={handleRetry} onExit={() => handleExit()} />
        )}

        {/* Scan guide */}
        {showGuide && <ARScannerGuide />}

        {/* Concept HUD (Mode 2) */}
        {activeTarget && mode === AR_MODES.CONCEPT && instrument && (
          <ConceptHud
            instrument={instrument}
            audioEl={audio.audioEl}
            playing={audio.playing}
            lowPerf={lowPerf}
          />
        )}

        {/* Toolbar */}
        {activeTarget && (
          <ARToolbar
            showAudio={!!instrument?.audio}
            showVideo={!!instrument?.video}
            audioPlaying={audio.playing}
            videoPlaying={videoPlaying}
            muted={muted}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleMute={toggleMute}
            onInfo={() => {
              setSelectedPart(null);
              setInfoOpen(true);
            }}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Info / part popup */}
      <ARInfoPopup
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        instrument={instrument}
        part={selectedPart}
      />
    </div>
  );
}

const ERROR_CONTENT = {
  unsupported: {
    icon: '🚫',
    title: 'Perangkat belum mendukung AR',
    body: 'Browser ini belum mendukung kamera/AR dengan baik, atau halaman tidak dibuka melalui HTTPS. Gunakan Chrome (Android) atau Safari (iPhone) versi terbaru, dan pastikan alamatnya diawali https://.',
    retry: false,
  },
  'no-mind': {
    icon: '🗂️',
    title: 'AR belum dikonfigurasi',
    body: 'File "targets.mind" belum ada. Buat dulu lewat halaman kompilasi (1 klik), simpan ke public/assets/ar/targets.mind, lalu tekan Coba Lagi.',
    retry: true,
    compileLink: true,
  },
  camera: {
    icon: '📷',
    title: 'Akses kamera diperlukan',
    body: 'Akses kamera diperlukan untuk menggunakan fitur AR. Izinkan kamera melalui ikon gembok di address bar, lalu coba lagi.',
    retry: true,
  },
  load: {
    icon: '📡',
    title: 'Gagal memuat komponen AR',
    body: 'Komponen AR gagal dimuat. Periksa koneksi internet lalu coba kembali.',
    retry: true,
  },
};

function ARError({ errorType, onRetry, onExit }) {
  const c = ERROR_CONTENT[errorType] || ERROR_CONTENT.load;
  return (
    <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-black/80 px-6">
      <div className="w-full max-w-sm rounded-card bg-white p-6 text-center">
        <div className="text-4xl">{c.icon}</div>
        <h2 className="mt-3 text-lg font-bold text-wood-900">{c.title}</h2>
        <p className="mt-2 text-sm text-wood-600">{c.body}</p>
        {c.compileLink && (
          <a
            href="/compile.html"
            target="_blank"
            rel="noopener"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-bold text-wood-900 hover:bg-accent-600"
          >
            🛠️ Buka Pembuat targets.mind
          </a>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onExit}
            className="flex-1 rounded-full bg-wood-100 px-4 py-2.5 text-sm font-semibold text-wood-800 hover:bg-wood-200"
          >
            Keluar
          </button>
          {c.retry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
