import { cn } from '@/utils/cn.js';
import { AR_MODES } from '../services/targetRegistry.js';

/**
 * HTML overlay toolbar shown while a target is active. Buttons adapt to the
 * active mode (sound for concept, video for video mode, info always).
 * Sits above the camera canvas with high-contrast styling.
 */
export function ARToolbar({
  mode,
  audioPlaying,
  videoPlaying,
  onToggleAudio,
  onToggleVideo,
  onToggleMute,
  muted,
  onInfo,
  onReset,
}) {
  return (
    <div
      className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-6"
      style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
    >
      <div className="flex items-center gap-2 rounded-full bg-black/55 p-2 backdrop-blur">
        {mode === AR_MODES.CONCEPT && (
          <ToolButton
            label={audioPlaying ? 'Jeda' : 'Suara'}
            icon={audioPlaying ? '⏸' : '🔊'}
            active={audioPlaying}
            onClick={onToggleAudio}
          />
        )}

        {mode === AR_MODES.VIDEO && (
          <>
            <ToolButton
              label={videoPlaying ? 'Jeda' : 'Video'}
              icon={videoPlaying ? '⏸' : '▶'}
              active={videoPlaying}
              onClick={onToggleVideo}
            />
            <ToolButton
              label={muted ? 'Suara' : 'Bisu'}
              icon={muted ? '🔇' : '🔈'}
              onClick={onToggleMute}
            />
          </>
        )}

        <ToolButton label="Info" icon="ℹ️" onClick={onInfo} />
        <ToolButton label="Reset" icon="↻" onClick={onReset} />
      </div>
    </div>
  );
}

function ToolButton({ label, icon, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-w-16 flex-col items-center gap-0.5 rounded-full px-3 py-2 text-white transition-colors',
        active ? 'bg-accent-500 text-wood-900' : 'hover:bg-white/15'
      )}
    >
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
