# AR Alat Musik — Web AR Edukasi Alat Musik

Website edukasi alat musik tradisional berbasis **Web AR Image Tracking**
(MindAR + A-Frame). Berjalan langsung di browser HP, **tanpa instal aplikasi,
tanpa backend, tanpa database**. Semua konten berasal dari file JSON/asset
statis; progres belajar opsional disimpan di `localStorage`.

Stack: **React + Vite + Tailwind CSS v4**, **MindAR Image Tracking**, **A-Frame**.

---

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173  (buka juga di HP via alamat LAN yang tampil)
```

Build & pratinjau produksi:

```bash
npm run build
npm run preview
```

> **Kamera butuh HTTPS.** `localhost` dianggap aman oleh browser, jadi webcam
> desktop berfungsi di `npm run dev`. Untuk menguji AR di HP lewat jaringan
> lokal (alamat `http://192.168.x.x`), browser akan memblokir kamera karena
> bukan HTTPS. Opsi:
> - deploy ke host HTTPS (Vercel/Netlify/GitHub Pages), lalu buka di HP; atau
> - jalankan dev dengan sertifikat lokal, mis. pasang `@vitejs/plugin-basic-ssl`
>   dan tambahkan ke `vite.config.js`.

---

## Fitur

- **Beranda, Jelajahi (cari + filter), Detail, Materi, Video, Kuis, Petunjuk,
  Tentang** — semua JSON-driven, mobile-first.
- **AR Scanner** dengan 3 mode per alat musik:
  1. **Bentuk alat musik** + hotspot bagian (popup penjelasan).
  2. **Konsep bunyi**: label sumber getaran/resonator, animasi gelombang, dan
     tombol suara (waveform live via Web Audio).
  3. **Video** orang memainkan alat musik (play/pause/mute, `playsinline`).
- **Kuis** dengan skor tersimpan di `localStorage`.
- **Progress belajar & bookmark** di `localStorage`.
- Media di-*pause* otomatis saat target hilang / keluar halaman AR; kamera
  dihentikan saat keluar.

---

## Agar AR benar-benar berjalan (langkah yang Anda lakukan)

Kode AR sudah lengkap, tetapi butuh **aset nyata** yang hanya bisa Anda sediakan:

### 1) `targets.mind` (wajib)
Kompilasi gambar target menjadi `public/assets/ar/targets.mind`.
Lihat **`public/assets/ar/README.md`** untuk langkah memakai MindAR Image
Target Compiler. Urutan gambar harus sama dengan `targetIndex` di
`src/features/ar/services/targetRegistry.js`.

Tanpa file ini, halaman AR menampilkan pesan "AR belum dikonfigurasi".

### 2) Aset per alat musik (opsional tapi disarankan)
Letakkan di `public/assets/instruments/<id>/`:

| File             | Dipakai untuk                              |
| ---------------- | ------------------------------------------ |
| `thumbnail.webp` | kartu di galeri/beranda                    |
| `instrument.png` | gambar (transparan) pada AR mode 1 & 2     |
| `poster.webp`    | poster video                               |
| `sound.mp3`      | suara instrumen (AR mode 2 & detail)       |
| `demo.mp4`       | video memainkan (AR mode 3 & halaman video)|
| `model.glb`      | (opsional) model 3D                        |

`<id>` = nilai `id` pada `src/data/instruments.json` (mis. `suling-bambu`).
Jika aset belum ada, situs tetap tampil dengan **placeholder** otomatis.

---

## Mengelola konten (tanpa database)

Semua konten ada di file statis — ubah file lalu `build` & deploy ulang:

```
src/data/instruments.json        # daftar & detail alat musik (+ hotspot, konsep bunyi)
src/data/materials.json          # materi A/B/C
src/data/videos.json             # daftar video
src/data/quiz.json               # soal kuis
src/features/ar/services/targetRegistry.js   # mapping targetIndex → instrumen + mode
public/assets/...                # gambar, audio, video, targets.mind
```

**Menambah alat musik baru:**
1. Tambah folder aset di `public/assets/instruments/<id>/`.
2. Tambah satu objek ke `instruments.json`.
3. Tambah entri target (3 mode) ke `targetRegistry.js`.
4. Tambahkan gambar target ke daftar compile, lalu buat ulang `targets.mind`.
5. `npm run build` → deploy.

---

## Deploy (static hosting HTTPS)

Build menghasilkan folder `dist/` statis.

- **Vercel / Netlify:** set build `npm run build`, output `dist`. Tambahkan
  aturan rewrite SPA (semua path → `/index.html`). Netlify: `_redirects`
  berisi `/* /index.html 200`. Vercel: rewrites ke `/index.html`.
- **GitHub Pages:** sudah disertakan `public/404.html` sebagai SPA fallback.
  Jika di-deploy pada sub-path (`/nama-repo/`), set `base` di `vite.config.js`
  dan sesuaikan path di `404.html`.

---

## Struktur folder (ringkas)

```
src/
├── app/            # App + router
├── pages/          # satu file per halaman
├── features/
│   ├── ar/         # komponen, hooks, services, wave untuk AR
│   ├── instruments/
│   ├── materials/
│   ├── videos/
│   └── quiz/
├── components/     # layout, ui, media (dipakai lintas fitur)
├── data/           # JSON konten (sumber kebenaran)
├── hooks/          # localStorage, progress, bookmarks
├── utils/          # media, device, performance, cn
└── styles/         # globals.css (Tailwind v4 + token tema)
```

---

## Catatan teknis

- **A-Frame & MindAR dimuat dari CDN** saat halaman AR dibuka (bukan di-bundle),
  agar sisa situs tetap ringan. Lihat `src/features/ar/services/scriptLoader.js`.
- Kamera **hanya** aktif setelah pengguna menekan "Mulai Kamera".
- Satu target aktif pada satu waktu (`maxTrack: 1`) untuk performa.
- **Mode performa rendah** otomatis pada perangkat lemah / `prefers-reduced-motion`
  (efek wave disederhanakan).
- **Belum diverifikasi di perangkat nyata.** Build lolos & situs non-AR berjalan
  di browser; tracking AR perlu `targets.mind` nyata dan pengujian di HP
  (Android Chrome / iPhone Safari).
```
