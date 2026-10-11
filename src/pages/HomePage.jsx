import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button.jsx';
import { InstrumentCard } from '@/features/instruments/InstrumentCard.jsx';
import { getAllInstruments } from '@/features/instruments/instrumentService.js';
import { useProgress } from '@/hooks/useProgress.js';

const QUICK_ACTIONS = [
  { to: '/videos', icon: '🎬', label: 'Video', tone: 'bg-amber-50 text-amber-700' },
  { to: '/guide', icon: '❓', label: 'Petunjuk', tone: 'bg-stone-100 text-stone-700' },
  { to: '/materials', icon: '📖', label: 'Materi', tone: 'bg-brand-50 text-brand-700', locked: true },
  { to: '/quiz', icon: '🧠', label: 'Kuis', tone: 'bg-wood-100 text-wood-800', locked: true },
];

export function HomePage() {
  const instruments = getAllInstruments();
  const { progress } = useProgress();
  const opened = progress.openedInstruments.length;
  const total = instruments.length;
  const pct = total ? Math.round((opened / total) * 100) : 0;

  return (
    <div className="space-y-6 px-4 py-5">
      {/* AR hero card */}
      <section className="overflow-hidden rounded-card bg-linear-to-br from-brand-700 via-brand-600 to-wood-700 p-5 text-white shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/25">
          🎵 Belajar dengan Augmented Reality
        </span>
        <h2 className="mt-3 text-xl font-extrabold leading-snug">
          Arahkan kamera ke gambar, lihat alat musik hidup
        </h2>
        <p className="mt-1 text-sm text-white/85">
          Bentuk, konsep bunyi, dan video memainkan alat musik — langsung di HP.
        </p>
        <div className="mt-4">
          <Button to="/ar" variant="accent" fullWidth size="lg">
            📷 Mulai Scan AR
          </Button>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="relative flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-center ring-1 ring-black/5 transition-transform active:scale-95"
            >
              {a.locked && (
                <span className="absolute right-1.5 top-1.5 text-xs" aria-hidden="true">
                  🔒
                </span>
              )}
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${a.tone} ${a.locked ? 'opacity-60' : ''}`}
              >
                {a.icon}
              </span>
              <span className="text-[11px] font-medium text-wood-700">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-card bg-white p-4 ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-wood-900">
              Progres belajar
            </h3>
            <p className="text-xs text-wood-500">
              {opened} dari {total} alat musik dijelajahi
            </p>
          </div>
          <span className="text-lg font-bold text-brand-700">{pct}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-wood-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* Instruments */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-base font-bold text-wood-900">Alat Musik</h3>
          <Link
            to="/instruments"
            className="text-sm font-semibold text-brand-700"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {instruments.map((it, i) => (
            <div key={it.id} className="w-44 shrink-0">
              <InstrumentCard instrument={it} index={i} compact />
            </div>
          ))}
        </div>
      </section>

      <p className="pt-2 text-center text-xs text-wood-400">
        <Link to="/about" className="hover:text-wood-600">
          Tentang aplikasi ini
        </Link>
      </p>
    </div>
  );
}
