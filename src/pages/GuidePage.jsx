import { useState } from 'react';
import { Button } from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';

const STEPS = [
  'Buka menu AR (tombol "Mulai AR").',
  'Izinkan akses kamera saat browser meminta.',
  'Arahkan kamera ke gambar target pada modul/poster.',
  'Pastikan seluruh gambar terlihat penuh dan pencahayaan cukup.',
  'Tunggu beberapa saat hingga konten AR muncul.',
  'Tekan tombol 🔊 untuk mendengar suara instrumen.',
  'Tekan tombol ℹ️ untuk membaca penjelasan.',
  'Tekan tombol ▶ untuk melihat video demonstrasi.',
];

const TROUBLE = [
  {
    q: 'Kamera tidak muncul',
    a: 'Pastikan kamu membuka situs lewat HTTPS dan sudah mengizinkan akses kamera. Cek ikon gembok di address bar → Izin → Kamera → Izinkan, lalu muat ulang halaman.',
  },
  {
    q: 'Target tidak terdeteksi',
    a: 'Dekatkan kamera, pastikan seluruh gambar terlihat dan tidak buram. Hindari pantulan cahaya pada kertas glossy serta bayangan yang menutupi gambar.',
  },
  {
    q: 'Suara tidak berbunyi',
    a: 'Pastikan volume HP tidak senyap. Pada beberapa HP, suara baru aktif setelah kamu menekan tombol Play. Coba tekan 🔊 sekali lagi.',
  },
  {
    q: 'Video tidak berjalan',
    a: 'Tekan tombol ▶ untuk memulai (video tidak diputar otomatis). Jika gagal, periksa koneksi internet lalu coba kembali.',
  },
];

export function GuidePage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="container-page py-4">
      <p className="mb-5 text-sm text-wood-600">
        Panduan singkat memakai fitur AR dan mengatasi masalah umum.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-wood-900">
            Langkah-langkah
          </h2>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-wood-700">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Button to="/ar" variant="accent" fullWidth>
              📷 Mulai AR
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-wood-900">
            Masalah &amp; Solusi
          </h2>
          <div className="space-y-2">
            {TROUBLE.map((t, i) => (
              <div key={i} className="card-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-wood-900">
                    {t.q}
                  </span>
                  <span
                    className={cn(
                      'text-wood-400 transition-transform',
                      open === i && 'rotate-180'
                    )}
                  >
                    ▾
                  </span>
                </button>
                {open === i && (
                  <p className="border-t border-stone-100 px-4 py-3 text-sm text-wood-700">
                    {t.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
