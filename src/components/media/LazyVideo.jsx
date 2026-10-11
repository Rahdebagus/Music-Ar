import { useRef, useState } from 'react';
import { assetUrl } from '@/utils/media.js';
import { SmartImage } from './SmartImage.jsx';
import { cn } from '@/utils/cn.js';

/**
 * Lazy HTML5 video: shows a poster + play button and only attaches the
 * <source> after the user taps play (keeps pages light, no autoplay sound).
 * Gracefully shows a message if the file can't be loaded.
 */
export function LazyVideo({
  src,
  poster,
  label,
  seed = 0,
  className,
  onPlay,
  autoLoad = false,
}) {
  const videoRef = useRef(null);
  const [active, setActive] = useState(autoLoad);
  const [error, setError] = useState(false);

  async function handleStart() {
    setActive(true);
    // Wait a tick for the <video> to mount, then play.
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (v) {
        v.play().catch(() => {
          /* user can press the native control */
        });
      }
    });
    onPlay?.();
  }

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-card bg-stone-900',
        className
      )}
    >
      {!active ? (
        <>
          <SmartImage
            src={poster}
            alt={label || 'Pratinjau video'}
            label={label}
            seed={seed}
            className="opacity-80"
          />
          <button
            type="button"
            onClick={handleStart}
            aria-label={`Putar video${label ? ': ' + label : ''}`}
            className="absolute inset-0 grid place-items-center bg-black/25 transition-colors hover:bg-black/35"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-2xl text-brand-700 shadow-lg">
              ▶
            </span>
          </button>
        </>
      ) : error ? (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/80">
          Konten belum dapat dimuat. Pastikan file video tersedia lalu coba
          kembali.
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster={poster ? assetUrl(poster) : undefined}
          onError={() => setError(true)}
          className="h-full w-full bg-black"
        >
          {src && <source src={assetUrl(src)} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
