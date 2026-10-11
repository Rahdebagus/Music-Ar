import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllVideos,
  getVideoTypes,
} from '@/features/videos/videoService.js';
import { LazyVideo } from '@/components/media/LazyVideo.jsx';
import { Badge } from '@/components/ui/Badge.jsx';
import { useProgress } from '@/hooks/useProgress.js';
import { formatDuration } from '@/utils/media.js';
import { cn } from '@/utils/cn.js';

export function VideosPage() {
  const all = getAllVideos();
  const types = useMemo(() => ['Semua', ...getVideoTypes()], []);
  const [type, setType] = useState('Semua');
  const { markVideoWatched } = useProgress();

  const videos = type === 'Semua' ? all : all.filter((v) => v.type === type);

  return (
    <div className="container-page py-4">
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              t === type
                ? 'bg-brand-600 text-white'
                : 'bg-white text-wood-700 ring-1 ring-black/5 hover:bg-wood-50'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {videos.map((v, i) => (
          <article key={v.id} className="card-surface overflow-hidden">
            <LazyVideo
              src={v.src}
              poster={v.poster}
              label={v.title}
              seed={i}
              onPlay={() => markVideoWatched(v.id)}
            />
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="brand">{v.type}</Badge>
                <span className="text-xs text-wood-500">
                  ⏱ {formatDuration(v.duration)}
                </span>
              </div>
              <h2 className="font-semibold text-wood-900">{v.title}</h2>
              <p className="text-sm text-wood-600">{v.description}</p>
              <Link
                to={`/instruments/${v.instrumentId}`}
                className="inline-block text-sm font-medium text-brand-700 hover:underline"
              >
                {v.instrumentName} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
