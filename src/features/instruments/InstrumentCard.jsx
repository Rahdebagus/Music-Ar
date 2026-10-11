import { Link } from 'react-router-dom';
import { SmartImage } from '@/components/media/SmartImage.jsx';
import { Badge } from '@/components/ui/Badge.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { useBookmarks } from '@/hooks/useBookmarks.js';
import { cn } from '@/utils/cn.js';

/**
 * Card for a single instrument. Shows photo, name, region, category, and
 * actions (Detail / Coba AR) plus a bookmark toggle.
 */
export function InstrumentCard({ instrument, index = 0, compact = false }) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(instrument.id);

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-wood-100">
        <Link to={`/instruments/${instrument.id}`} aria-label={`Detail ${instrument.name}`}>
          <SmartImage
            src={instrument.thumbnail || instrument.image}
            alt={instrument.name}
            label={instrument.name}
            seed={index}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggle(instrument.id)}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur hover:bg-white"
        >
          <span className={bookmarked ? 'text-accent-500' : 'text-wood-400'}>
            {bookmarked ? '★' : '☆'}
          </span>
        </button>
        <div className="absolute left-2 top-2">
          <Badge tone="brand">{instrument.category}</Badge>
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col gap-2', compact ? 'p-3' : 'p-4')}>
        <div>
          <h3 className="font-semibold leading-tight text-wood-900">
            <Link to={`/instruments/${instrument.id}`} className="hover:text-brand-700">
              {instrument.name}
            </Link>
          </h3>
          <p className="text-xs text-wood-500">📍 {instrument.region}</p>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="wood">{instrument.playMethod}</Badge>
            <Badge tone="neutral">{instrument.soundSource}</Badge>
          </div>
        )}

        {compact ? (
          <div className="mt-auto pt-1">
            <Button to={`/ar?instrument=${instrument.id}`} variant="primary" size="sm" fullWidth>
              Coba AR
            </Button>
          </div>
        ) : (
          <div className="mt-auto flex gap-2 pt-2">
            <Button to={`/instruments/${instrument.id}`} variant="secondary" size="sm" fullWidth>
              Detail
            </Button>
            <Button to={`/ar?instrument=${instrument.id}`} variant="primary" size="sm" fullWidth>
              Coba AR
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
