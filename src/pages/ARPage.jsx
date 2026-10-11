import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARScene } from '@/features/ar/components/ARScene.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { getInstrumentById } from '@/features/instruments/instrumentService.js';
import { canRunAR, isSecureContextForCamera } from '@/utils/device.js';
import { shouldUseLowPerformance } from '@/utils/performance.js';

const TIPS = [
  'Izinkan akses kamera saat diminta.',
  'Arahkan ke gambar alat musik pada modul/poster.',
  'Pastikan gambar terlihat penuh & pencahayaan cukup.',
];

export function ARPage() {
  const [running, setRunning] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const preferId = params.get('instrument');
  const preferred = preferId ? getInstrumentById(preferId) : null;
  const lowPerf = useMemo(() => shouldUseLowPerformance(), []);
  const supported = canRunAR() && isSecureContextForCamera();

  function handleExit(destination) {
    setRunning(false);
    if (destination) navigate(destination);
  }

  if (running) {
    return (
      <ARScene
        lowPerf={lowPerf}
        preferInstrumentId={preferId}
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="container-page flex min-h-[70vh] max-w-xl flex-col items-center justify-center py-10 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-600 text-4xl text-white shadow-lg">
        📷
      </div>
      <h1 className="mt-6 text-2xl font-bold text-wood-900 sm:text-3xl">
        Scan Gambar Alat Musik
      </h1>
      <p className="mt-2 text-sm text-wood-600">
        Siapkan modul/poster, lalu mulai kamera untuk memunculkan konten AR.
      </p>

      {preferred && (
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
          🎯 Fokus: {preferred.name}
        </span>
      )}

      <ul className="mt-6 w-full space-y-2 text-left">
        {TIPS.map((t, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl bg-white p-3 text-sm text-wood-700 ring-1 ring-black/5"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            {t}
          </li>
        ))}
      </ul>

      {!supported && (
        <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
          ⚠️ Perangkat/browser ini mungkin belum mendukung AR, atau halaman
          tidak dibuka lewat HTTPS. Kamu tetap bisa mencoba — pesan bantuan akan
          muncul bila gagal.
        </p>
      )}

      <div className="mt-7 flex w-full flex-col gap-3">
        <Button size="lg" onClick={() => setRunning(true)}>
          📷 Mulai Kamera
        </Button>
        <Button variant="ghost" to="/guide">
          Butuh bantuan? Lihat petunjuk
        </Button>
      </div>

      <p className="mt-4 text-xs text-wood-500">
        Kamera hanya aktif setelah kamu menekan tombol di atas.
      </p>
    </div>
  );
}
