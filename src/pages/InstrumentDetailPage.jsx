import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInstrumentById } from '@/features/instruments/instrumentService.js';
import { getVideosByInstrument } from '@/features/videos/videoService.js';
import { SmartImage } from '@/components/media/SmartImage.jsx';
import { LazyVideo } from '@/components/media/LazyVideo.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Badge } from '@/components/ui/Badge.jsx';
import { EmptyState } from '@/components/ui/EmptyState.jsx';
import { useProgress } from '@/hooks/useProgress.js';
import { useBookmarks } from '@/hooks/useBookmarks.js';
import { assetUrl } from '@/utils/media.js';

function Section({ title, children }) {
  return (
    <section className="card-surface p-5">
      <h2 className="mb-2 text-lg font-semibold text-wood-900">{title}</h2>
      <div className="text-sm leading-relaxed text-wood-700">{children}</div>
    </section>
  );
}

function AudioPlayer({ src, name }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  function toggle() {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => setError(true));
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={error}
        aria-label={playing ? 'Jeda suara' : `Dengarkan suara ${name}`}
        className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-xl text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
      >
        {playing ? '⏸' : '🔊'}
      </button>
      <div className="text-sm text-wood-600">
        {error ? (
          <span className="text-red-600">Audio belum tersedia.</span>
        ) : (
          <span>{playing ? 'Memutar suara…' : 'Dengarkan suara asli'}</span>
        )}
      </div>
      <audio
        ref={ref}
        src={src ? assetUrl(src) : undefined}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}

export function InstrumentDetailPage() {
  const { id } = useParams();
  const instrument = getInstrumentById(id);
  const { markInstrumentOpened } = useProgress();
  const { isBookmarked, toggle } = useBookmarks();

  useEffect(() => {
    if (instrument) markInstrumentOpened(instrument.id);
  }, [instrument, markInstrumentOpened]);

  if (!instrument) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon="🎻"
          title="Alat musik tidak ditemukan"
          description="Mungkin tautannya salah atau datanya telah berubah."
          action={<Button to="/instruments">Kembali ke daftar</Button>}
        />
      </div>
    );
  }

  const videos = getVideosByInstrument(instrument.id);
  const wc = instrument.waveConcept || {};
  const bookmarked = isBookmarked(instrument.id);

  return (
    <div className="container-page py-4">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Media column */}
        <div className="lg:col-span-2">
          <div className="card-surface overflow-hidden">
            <div className="aspect-[4/3] bg-wood-100">
              <SmartImage
                src={instrument.image || instrument.thumbnail}
                alt={instrument.name}
                label={instrument.name}
              />
            </div>
            <div className="space-y-4 p-4">
              <AudioPlayer src={instrument.audio} name={instrument.name} />
              <Button to={`/ar?instrument=${instrument.id}`} variant="accent" fullWidth size="lg">
                📷 Lihat dalam AR
              </Button>
            </div>
          </div>
        </div>

        {/* Info column */}
        <div className="space-y-5 lg:col-span-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{instrument.category}</Badge>
              <Badge tone="wood">{instrument.playMethod}</Badge>
              <button
                type="button"
                onClick={() => toggle(instrument.id)}
                aria-pressed={bookmarked}
                className="ml-auto inline-flex items-center gap-1 rounded-full bg-wood-100 px-3 py-1 text-sm font-medium text-wood-700 hover:bg-wood-200"
              >
                <span className={bookmarked ? 'text-accent-500' : ''}>
                  {bookmarked ? '★' : '☆'}
                </span>
                {bookmarked ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-wood-900">
              {instrument.name}
            </h1>
            <p className="mt-1 text-wood-500">📍 {instrument.region}</p>
            <p className="mt-3 leading-relaxed text-wood-700">
              {instrument.description}
            </p>
          </div>

          {instrument.funFact && (
            <div className="rounded-card bg-amber-50 p-4 ring-1 ring-amber-200">
              <p className="text-sm font-semibold text-amber-800">
                💡 Tahukah Kamu?
              </p>
              <p className="mt-1 text-sm text-amber-900/90">
                {instrument.funFact}
              </p>
            </div>
          )}

          <Section title="Cara Memainkan">{instrument.howToPlay}</Section>

          {instrument.history && (
            <Section title="Sejarah Singkat">{instrument.history}</Section>
          )}
          {instrument.culturalFunction && (
            <Section title="Fungsi Budaya">{instrument.culturalFunction}</Section>
          )}

          {/* Parts */}
          {instrument.parts?.length > 0 && (
            <Section title="Bagian-bagian Alat Musik">
              <ul className="space-y-2">
                {instrument.parts.map((p) => (
                  <li key={p.id} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    <span>
                      <span className="font-medium text-wood-900">{p.name}</span>
                      {' — '}
                      {p.description}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Wave concept */}
          <Section title="Konsep Bunyi & Gelombang">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Fact label="Jenis Gelombang" value={wc.waveType} />
              <Fact label="Sumber Getaran" value={wc.sourceOfVibration} />
              <Fact label="Resonator" value={wc.resonator} />
              <Fact label="Medium Rambat" value={wc.medium} />
            </dl>
            {wc.description && (
              <p className="mt-3 rounded-xl bg-brand-50 p-3 text-brand-900/90">
                {wc.description}
              </p>
            )}
          </Section>
        </div>
      </div>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-wood-900">
            Video Demonstrasi
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((v, i) => (
              <div key={v.id} className="card-surface overflow-hidden">
                <LazyVideo src={v.src} poster={v.poster} label={v.title} seed={i} />
                <div className="p-4">
                  <h3 className="font-semibold text-wood-900">{v.title}</h3>
                  <p className="text-sm text-wood-600">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-xl bg-wood-50 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-wood-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-wood-900">{value}</dd>
    </div>
  );
}
