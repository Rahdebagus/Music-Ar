# COPILOT MASTER PLAN — WEB AR EDUKASI ALAT MUSIK

## 1. Tujuan Proyek

> **ATURAN UTAMA PROYEK:** aplikasi ini harus berjalan **tanpa database dan tanpa backend**. Semua materi, konfigurasi AR, quiz, metadata audio/video, dan daftar alat musik disimpan sebagai file statis lokal di project. Data progres pengguna yang sifatnya opsional disimpan di `localStorage` browser.

Bangun website edukasi alat musik berbasis **Web AR Image Tracking** menggunakan **MindAR + A-Frame**.

Website harus dapat dibuka langsung dari browser HP tanpa install aplikasi. Pengguna mengarahkan kamera ke gambar target pada buku/modul/poster, lalu konten AR muncul di atas gambar tersebut.

Fokus utama proyek:

1. Memperkenalkan bentuk alat musik secara utuh.
2. Menjelaskan konsep bunyi/resonansi/gelombang secara visual dan disertai suara.
3. Menampilkan video orang memainkan alat musik.
4. Menyediakan materi belajar biasa di luar mode AR.
5. Memberikan pengalaman belajar yang ringan, responsif, dan mudah digunakan di HP.

---

# 2. Teknologi Utama

Gunakan stack berikut:

- Frontend: React + Vite
- Styling: Tailwind CSS
- AR engine: MindAR Image Tracking
- 3D / AR scene: A-Frame
- Audio: HTML5 Audio + Web Audio API bila diperlukan
- Video: HTML5 Video
- Animasi UI: CSS / Framer Motion seperlunya
- Data materi: file JSON lokal di dalam project
- Konfigurasi target AR: JavaScript/JSON lokal
- Asset: gambar, audio, video, model GLB disimpan sebagai file statis
- Penyimpanan progres/quiz: `localStorage` browser
- Backend: **tidak digunakan**
- Database: **tidak digunakan**
- API server: **tidak digunakan**
- Deployment: Vercel / Netlify / GitHub Pages / hosting HTTPS statis lain

Catatan penting:

- Untuk kebutuhan scan gambar pada proyek ini gunakan **MindAR Image Tracking**.
- Jangan mencampur AR.js ke scene utama image tracking kecuali di masa depan memang dibuat fitur marker/location AR yang terpisah.
- Kamera browser membutuhkan HTTPS pada deployment production.
- Audio/video tidak boleh autoplay bersuara tanpa interaksi pengguna. Sediakan tombol Play.

---


# 2.1 Arsitektur Tanpa Database

Gunakan arsitektur full static:

```text
Browser HP
   ↓
React + Vite
   ↓
MindAR + A-Frame
   ↓
File JSON lokal + asset statis
   ├── images
   ├── audio
   ├── video
   ├── GLB / PNG
   └── targets.mind

Progress pengguna opsional
   ↓
localStorage browser
```

Tidak boleh membuat:
- MySQL
- PostgreSQL
- SQLite
- Firebase Database / Firestore
- Supabase Database
- MongoDB
- Laravel / Node API
- sistem login server
- tabel database

Jika konten perlu diperbarui, pengembang cukup mengubah file JSON atau asset di project lalu deploy ulang.

Contoh alur update konten:

```text
Tambah alat musik baru
→ tambahkan folder asset
→ tambahkan satu object ke instruments.json
→ tambahkan target ke targetRegistry.js
→ compile ulang targets.mind bila ada image target baru
→ build
→ deploy
```

# 3. Konsep Halaman Website

## 3.1 Beranda
Tujuan: menjadi landing page utama.

Isi:
- Hero section
- Judul proyek
- Deskripsi singkat
- Tombol `Mulai AR`
- Tombol `Pelajari Materi`
- Preview beberapa alat musik
- Penjelasan singkat cara menggunakan AR

CTA utama:

`Buka Kamera & Scan Gambar`

---

## 3.2 Jelajahi Alat Musik
Menampilkan semua alat musik yang tersedia.

Card alat musik berisi:
- Foto
- Nama alat musik
- Daerah asal
- Jenis alat musik
- Tombol Detail
- Tombol Coba AR

Tambahkan pencarian dan filter jika data sudah banyak.

Contoh filter:
- Daerah
- Cara dimainkan
- Jenis sumber bunyi

---

## 3.3 Detail Alat Musik
Halaman detail untuk satu alat musik.

Isi:
- Nama alat musik
- Foto alat musik
- Daerah asal
- Deskripsi
- Sejarah singkat
- Fungsi budaya
- Cara memainkan
- Bagian-bagian alat musik
- Konsep bunyi
- Jenis gelombang
- Audio suara asli
- Video demonstrasi
- Tombol `Lihat dalam AR`

---

## 3.4 Materi
Halaman pembelajaran non-AR.

Materi dibuat per topik:

### Materi A — Mengenal Alat Musik
Menjelaskan bentuk, nama, asal, fungsi, dan bagian alat musik.

### Materi B — Bagaimana Bunyi Terbentuk
Menjelaskan:
- sumber getaran
- resonansi
- medium rambat
- gelombang bunyi
- frekuensi
- amplitudo
- hubungan bagian alat musik dengan suara yang dihasilkan

### Materi C — Cara Memainkan
Berisi langkah dasar memainkan alat musik.

---

## 3.5 Video Materi
Halaman khusus kumpulan video.

Setiap video memiliki:
- Thumbnail
- Judul
- Nama alat musik
- Durasi
- Deskripsi singkat
- Tombol Play

Jenis video:
- Pengenalan alat musik
- Penjelasan bagian alat musik
- Orang memainkan alat musik
- Penjelasan konsep resonansi/bunyi

Video harus lazy-load agar halaman tetap ringan.

---

## 3.6 AR Scanner
Halaman inti aplikasi.

Route contoh:

`/ar`

UI sebelum kamera aktif:
- Judul: Scan Gambar Alat Musik
- Petunjuk singkat
- Tombol `Mulai Kamera`

Setelah kamera aktif:
- Kamera fullscreen
- Scan guide / frame
- Tombol Close
- Tombol Help
- Status `Arahkan kamera ke gambar`

Saat target berhasil dikenali:
- Hilangkan scan guide
- Munculkan konten AR sesuai target
- Munculkan toolbar AR

Toolbar:
- `🔊 Dengarkan Suara`
- `ℹ️ Penjelasan`
- `▶ Video`
- `↻ Reset`
- `✕ Keluar`

---

# 4. Tiga Jenis Pengalaman AR

Setiap alat musik memiliki tiga mode AR utama.

## AR MODE 1 — Bentuk Alat Musik

Tujuan:
Memperlihatkan keseluruhan alat musik dengan jelas.

Saat gambar target dipindai:
- tampilkan ilustrasi / PNG transparan / model 3D alat musik
- posisi mengikuti target image
- tambahkan nama alat musik
- tambahkan hotspot bagian penting

Contoh hotspot:
- badan alat
- lubang suara
- senar
- tabung resonansi
- pemukul

Saat hotspot ditekan:
- tampil popup kecil
- tampil nama bagian
- tampil fungsi bagian

Jika tersedia model 3D:
- format GLB
- model dapat diberi animasi rotasi ringan
- jangan membuat model terlalu berat

Fallback:
Gunakan PNG transparan resolusi tinggi jika model 3D belum tersedia.

---

## AR MODE 2 — Konsep Bunyi + Gelombang + Audio

Mode ini mengikuti konsep gambar referensi edukasi yang menampilkan hubungan alat musik, sumber bunyi, resonansi, dan gelombang.

Saat target dipindai:

1. Tampilkan ilustrasi alat musik.
2. Tandai bagian yang menghasilkan getaran.
3. Tampilkan animasi gelombang keluar dari alat musik.
4. Tampilkan label konsep.
5. Tampilkan tombol Play Suara.
6. Tampilkan popup penjelasan.

Contoh label:
- Sumber Getaran
- Resonator
- Arah Rambat Bunyi
- Gelombang Bunyi
- Udara sebagai Medium
- Frekuensi Dasar

Data konsep harus berasal dari JSON agar tiap alat musik bisa berbeda.

Contoh:

```json
{
  "waveType": "Gelombang longitudinal",
  "sourceOfVibration": "Kolom udara di dalam tabung",
  "resonator": "Badan/tabung alat musik",
  "medium": "Udara",
  "description": "Getaran menghasilkan perubahan tekanan udara yang merambat sebagai gelombang bunyi."
}
```

### Animasi Gelombang

Prioritas implementasi:

**Pilihan A — ringan**
- gunakan beberapa garis/kurva visual yang dianimasikan
- opacity dan scale bergerak dari sumber bunyi ke arah luar

**Pilihan B — lebih interaktif**
- gunakan Canvas 2D sebagai texture
- visualisasikan waveform yang bergerak
- bila audio dimainkan, Web Audio Analyser dapat digunakan untuk mengubah bentuk waveform

Untuk device low-end gunakan mode A sebagai fallback.

### Audio

Saat tombol `Dengarkan Suara` ditekan:
- play audio alat musik
- icon berubah menjadi Pause
- gelombang mulai bergerak

Saat audio berhenti:
- animasi gelombang kembali idle

Jika target hilang:
- pause audio
- pause animasi

---

## AR MODE 3 — Video Orang Memainkan Alat Musik

Saat target dipindai:
- tampilkan video plane di atas gambar target
- video tidak autoplay dengan suara
- tampil tombol `Play Video`

Kontrol:
- Play
- Pause
- Mute / Unmute
- Restart
- Fullscreen opsional

Video wajib:
- `playsinline`
- terkompresi untuk web
- poster image tersedia

Saat target hilang:
- pause video

Saat target ditemukan kembali:
- jangan autoplay bersuara
- tampilkan tombol play kembali bila diperlukan

---

# 5. Sistem Popup Penjelasan

Setiap AR target memiliki popup informasi.

Popup menggunakan HTML overlay di atas canvas AR, bukan semua teks dibuat sebagai objek 3D.

Keuntungan:
- teks lebih tajam
- mudah dibaca
- mudah scroll
- mudah responsif
- mudah diakses

Isi popup:
- Nama alat musik
- Asal
- Deskripsi singkat
- Cara memainkan
- Konsep bunyi
- Fakta menarik

Tombol:
- Tutup
- Selengkapnya

Jika `Selengkapnya` ditekan:
- arahkan ke halaman Detail Alat Musik

---

# 6. Sistem Multi Target

Gunakan satu file `.mind` yang berisi beberapa target image jika jumlah target masih wajar.

Contoh mapping:

```js
const targetRegistry = {
  0: {
    instrumentId: 'seruling-bambu',
    mode: 'instrument'
  },
  1: {
    instrumentId: 'seruling-bambu',
    mode: 'concept'
  },
  2: {
    instrumentId: 'seruling-bambu',
    mode: 'video'
  }
};
```

Dengan pola ini satu alat musik dapat memiliki tiga gambar target berbeda:

- Target 1 = bentuk alat musik
- Target 2 = konsep bunyi
- Target 3 = video demonstrasi

Atau satu gambar target dapat memiliki tombol pilihan Mode 1/2/3 jika desain modul menginginkan satu target saja.

Rekomendasi untuk buku/modul pendidikan:
Gunakan **3 target berbeda** agar pengguna langsung mendapatkan pengalaman yang sesuai halaman yang sedang dibaca.

---

# 7. Struktur Data

File:

`src/data/instruments.json`

Contoh:

```json
[
  {
    "id": "seruling-bambu",
    "name": "Seruling Bambu",
    "region": "Bali",
    "category": "Aerophone",
    "thumbnail": "/assets/instruments/seruling/thumbnail.webp",
    "image": "/assets/instruments/seruling/instrument.webp",
    "model": "/assets/instruments/seruling/model.glb",
    "audio": "/assets/instruments/seruling/sound.mp3",
    "video": "/assets/instruments/seruling/demo.mp4",
    "description": "Deskripsi singkat alat musik.",
    "history": "Sejarah singkat.",
    "howToPlay": "Cara memainkan.",
    "waveConcept": {
      "waveType": "Gelombang longitudinal",
      "sourceOfVibration": "Kolom udara",
      "resonator": "Tabung bambu",
      "medium": "Udara",
      "description": "Penjelasan konsep bunyi."
    },
    "parts": [
      {
        "id": "mouth-hole",
        "name": "Lubang Tiup",
        "description": "Tempat udara ditiup untuk menghasilkan getaran.",
        "position": { "x": 0, "y": 0.35, "z": 0.02 }
      }
    ]
  }
]
```

Jangan hardcode isi materi di komponen React.

---

# 8. Struktur Folder Modular

```text
src/
├── app/
│   ├── App.jsx
│   └── router.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── InstrumentsPage.jsx
│   ├── InstrumentDetailPage.jsx
│   ├── MaterialsPage.jsx
│   ├── VideosPage.jsx
│   ├── ARPage.jsx
│   ├── QuizPage.jsx
│   ├── GuidePage.jsx
│   └── AboutPage.jsx
│
├── features/
│   ├── ar/
│   │   ├── components/
│   │   │   ├── ARScene.jsx
│   │   │   ├── ARScannerGuide.jsx
│   │   │   ├── ARToolbar.jsx
│   │   │   ├── ARInfoPopup.jsx
│   │   │   ├── InstrumentOverlay.jsx
│   │   │   ├── ConceptOverlay.jsx
│   │   │   ├── VideoOverlay.jsx
│   │   │   └── Hotspot.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useMindAR.js
│   │   │   ├── useARAudio.js
│   │   │   └── useTargetTracking.js
│   │   │
│   │   ├── services/
│   │   │   ├── targetRegistry.js
│   │   │   └── arAssetLoader.js
│   │   │
│   │   └── wave/
│   │       ├── WaveVisualizer.js
│   │       └── WaveCanvas.js
│   │
│   ├── instruments/
│   │   ├── InstrumentCard.jsx
│   │   ├── InstrumentDetail.jsx
│   │   └── instrumentService.js
│   │
│   ├── materials/
│   ├── videos/
│   └── quiz/
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── MobileNav.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   └── media/
│
├── data/
│   ├── instruments.json
│   ├── materials.json
│   └── quiz.json
│
├── assets/
│   ├── ar/
│   │   └── targets.mind
│   ├── instruments/
│   ├── audio/
│   ├── video/
│   └── icons/
│
├── utils/
│   ├── media.js
│   ├── device.js
│   └── performance.js
│
└── styles/
    └── globals.css
```

---

# 9. Alur AR

```text
User membuka halaman AR
        ↓
Klik "Mulai Kamera"
        ↓
Minta permission kamera
        ↓
Initialize MindAR
        ↓
Load targets.mind
        ↓
Tampilkan scan guide
        ↓
Target ditemukan
        ↓
Baca targetIndex
        ↓
Cari konfigurasi target di targetRegistry
        ↓
Load data alat musik dari instruments.json
        ↓
Tampilkan AR sesuai mode target
        ↓
Tampilkan AR Toolbar
        ↓
User dapat:
   ├─ Play suara
   ├─ Buka penjelasan
   ├─ Play video
   └─ Interaksi hotspot
        ↓
Target hilang
        ↓
Pause audio/video
Hide konten interaktif
        ↓
Target ditemukan kembali
        ↓
Restore tampilan AR
```

---

# 10. Event AR yang Harus Ditangani

Implementasikan event berikut:

## `targetFound`
Saat target terdeteksi:
- set active target
- tampilkan overlay
- update judul alat musik
- tampilkan toolbar
- jalankan animasi visual yang aman

## `targetLost`
Saat target hilang:
- pause audio
- pause video
- hide popup
- jangan destroy seluruh scene jika tidak diperlukan
- tampilkan kembali scan guide

## `cameraReady`
- sembunyikan loading
- tampilkan scanner

## `cameraError`
- tampilkan pesan permission kamera
- berikan petunjuk membuka permission browser

---

# 11. State AR

Gunakan state yang sederhana dan jelas.

```js
const arState = {
  cameraStatus: 'idle',
  targetVisible: false,
  activeTargetIndex: null,
  activeInstrumentId: null,
  activeMode: null,
  audioPlaying: false,
  videoPlaying: false,
  infoOpen: false
};
```

Jangan membuat AR scene bergantung pada terlalu banyak global state.

---

# 12. Loading Strategy

Jangan preload semua asset berat.

Saat halaman AR dibuka:
1. load MindAR
2. load `.mind`
3. load asset ringan

Saat target ditemukan:
- lazy load audio terkait
- lazy load video terkait
- lazy load model GLB bila ada

Tambahkan cache browser.

---

# 13. Optimasi Mobile

Prioritas utama: stabil di HP kelas menengah dan low-end.

Aturan:
- target performa ±30 FPS
- hindari shadow realtime yang berat
- batasi polygon model 3D
- gunakan texture 1024 atau 2048 hanya bila diperlukan
- gunakan WebP/AVIF untuk gambar non-AR
- gunakan MP4 H.264 untuk kompatibilitas video
- lazy load video
- jangan menjalankan video dan audio yang tidak aktif
- pause semua media ketika target hilang
- hindari terlalu banyak entity A-Frame aktif sekaligus
- satu target aktif pada satu waktu untuk mode pembelajaran normal
- kurangi particle effect

Tambahkan deteksi device sederhana.

Mode Low Performance:
- matikan efek tambahan
- gunakan PNG dibanding model 3D berat
- gunakan wave animation sederhana

---

# 14. Kualitas Target Image

Gambar yang akan dijadikan target MindAR harus:
- memiliki detail yang jelas
- memiliki kontras yang baik
- tidak terlalu polos
- memiliki pola unik
- tidak didominasi area warna rata
- tidak terlalu blur
- tidak menggunakan desain yang sangat repetitif

Untuk halaman buku/modul:
- gunakan ilustrasi alat musik sebagai elemen utama
- tambahkan detail visual yang cukup di sekelilingnya
- hindari kertas terlalu glossy karena pantulan dapat mengganggu tracking

Compile target menjadi:

`public/assets/ar/targets.mind`

Simpan file target asli di folder terpisah agar dapat direcompile.

---

# 15. UX Kamera

Sebelum scan:

```text
┌────────────────────────────┐
│        SCAN ALAT MUSIK     │
│                            │
│    ┌──────────────────┐    │
│    │                  │    │
│    │  arahkan gambar  │    │
│    │  ke area ini     │    │
│    │                  │    │
│    └──────────────────┘    │
│                            │
│ Pastikan gambar terlihat   │
│ penuh dan pencahayaan baik │
└────────────────────────────┘
```

Saat target ditemukan:

```text
┌────────────────────────────┐
│                     [?] [X]│
│                            │
│        AR CONTENT          │
│                            │
│                            │
│  [🔊 Suara] [ℹ Info]      │
│       [▶ Video]            │
└────────────────────────────┘
```

Toolbar sebaiknya berada di HTML UI overlay dan tidak menempel seluruhnya ke object 3D.

---

# 16. Quiz / Evaluasi

Tambahkan halaman Quiz sebagai fitur edukasi tambahan.

Jenis pertanyaan:
- Nama alat musik
- Daerah asal
- Cara memainkan
- Bagian yang menghasilkan bunyi
- Jenis gelombang bunyi
- Fungsi resonator

Setelah selesai:
- tampilkan skor
- tampilkan jawaban benar/salah
- tombol ulangi

Simpan skor terakhir di localStorage.

Tidak perlu login pada versi pertama.

---

# 17. Halaman Petunjuk AR

Tambahkan halaman `Cara Menggunakan`.

Isi:
1. Buka menu AR.
2. Izinkan akses kamera.
3. Arahkan kamera ke gambar target.
4. Pastikan seluruh gambar terlihat.
5. Tunggu konten AR muncul.
6. Tekan tombol suara untuk mendengar instrumen.
7. Tekan tombol info untuk membaca penjelasan.
8. Tekan tombol video untuk melihat demonstrasi.

Tambahkan troubleshooting:
- kamera tidak muncul
- target tidak terdeteksi
- suara tidak berbunyi
- video tidak berjalan

---

# 18. Halaman Tentang

Isi:
- Tentang proyek
- Tujuan pembelajaran
- Latar belakang pembuatan
- Tim / pengembang
- Sumber materi
- Kredit audio/video/foto bila diperlukan

---

# 19. Fitur Tambahan yang Direkomendasikan

## A. Progress Belajar
Simpan secara lokal:
- alat musik yang sudah dibuka
- AR target yang sudah discan
- video yang sudah ditonton
- quiz yang sudah dikerjakan

## B. Fakta Menarik
Tambahkan kartu `Tahukah Kamu?` pada detail alat musik.

## C. Mode Bandingkan
Pilih dua alat musik lalu bandingkan:
- sumber getaran
- resonator
- teknik memainkan
- jenis bunyi

## D. Bookmark
Pengguna dapat menyimpan alat musik favorit di localStorage.

Fitur A dan Quiz lebih diprioritaskan dibanding fitur lainnya.

---

# 19.1 Pengelolaan Konten Tanpa Admin Database

Karena aplikasi tidak menggunakan database, **jangan membuat admin CRUD berbasis server**.

Untuk versi utama, pengelolaan konten dilakukan langsung melalui file project:

```text
src/data/instruments.json
src/data/materials.json
src/data/videos.json
src/data/quiz.json
src/features/ar/services/targetRegistry.js
public/assets/...
```

Jika nanti diperlukan halaman admin tanpa database, buat hanya sebagai **Local Content Editor**:
- membaca JSON lokal / file yang di-upload pengguna
- form untuk mengubah data
- preview konten
- export hasil menjadi file JSON
- import JSON

Catatan: perubahan dari Local Content Editor tidak otomatis tersimpan ke server dan tidak menjadi CRUD online permanen. Untuk memperbarui website publik, JSON hasil export tetap dimasukkan ke project lalu deploy ulang.

# 20. Desain Visual

Konsep:
- edukatif
- modern
- clean
- tidak terlihat seperti dashboard admin
- mobile first

Gunakan warna yang mengambil inspirasi dari budaya/alat musik tetapi tetap sederhana.

AR UI harus memiliki kontras tinggi agar tetap terlihat di atas kamera.

Gunakan:
- rounded card
- backdrop blur secukupnya
- bottom sheet untuk penjelasan di mobile
- icon sederhana
- font mudah dibaca

Jangan menaruh paragraf panjang langsung di atas kamera.

---

# 21. Accessibility

- Semua tombol memiliki label.
- Ukuran touch target minimal nyaman untuk HP.
- Sediakan subtitle/caption untuk video jika tersedia.
- Sediakan teks penjelasan untuk audio.
- Jangan bergantung pada warna saja untuk memberikan informasi.

---

# 22. Error Handling

Buat UI khusus untuk:

### Kamera Ditolak
Pesan:
`Akses kamera diperlukan untuk menggunakan fitur AR.`

Button:
`Coba Lagi`

### Browser Tidak Mendukung
Pesan:
`Browser ini belum mendukung fitur AR dengan baik. Gunakan Chrome/Safari versi terbaru.`

### Target Tidak Terdeteksi
Setelah beberapa detik tampil hint:
`Dekatkan kamera dan pastikan seluruh gambar terlihat.`

### Media Gagal Dimuat
Tampilkan:
`Konten belum dapat dimuat. Silakan coba kembali.`

---

# 23. Testing Wajib

Lakukan testing minimal pada:
- Android Chrome
- iPhone Safari
- desktop Chrome dengan webcam

Test case:
- permission kamera diterima
- permission kamera ditolak
- target ditemukan
- target hilang
- target ditemukan kembali
- audio play/pause
- video play/pause
- popup buka/tutup
- perpindahan target
- orientasi portrait
- orientasi landscape
- jaringan lambat
- device low-end

Pastikan tidak ada audio/video yang tetap berjalan setelah user keluar dari halaman AR.

---

# 24. Definition of Done

Sebuah fitur dianggap selesai jika:

- berjalan di mobile
- responsive
- tidak menyebabkan crash camera
- tidak ada console error kritis
- media berhenti ketika target hilang
- tombol dapat digunakan dengan satu tangan
- loading state tersedia
- error state tersedia
- asset tidak terlalu berat
- struktur komponen modular
- data tidak di-hardcode di komponen
- tidak ada koneksi database
- tidak ada endpoint backend
- seluruh konten dapat berjalan dari static hosting

---

# 25. Urutan Implementasi untuk Copilot

## PHASE 1 — Setup
1. Buat React + Vite project.
2. Setup Tailwind.
3. Install MindAR dan A-Frame.
4. Setup router.
5. Buat folder architecture sesuai dokumen.

## PHASE 2 — Website Dasar
1. Navbar.
2. Home.
3. Jelajahi alat musik.
4. Detail alat musik.
5. Materi.
6. Video.
7. Tentang.
8. Petunjuk.

Gunakan JSON lokal sebagai sumber data final. Jangan membuat database atau API backend.

## PHASE 3 — Basic AR
1. Buat halaman AR terpisah.
2. Minta permission camera hanya setelah user klik tombol.
3. Load MindAR.
4. Load `targets.mind`.
5. Tampilkan satu target demo.
6. Test `targetFound` / `targetLost`.

Jangan lanjut sebelum tracking stabil.

## PHASE 4 — Multi Target
1. Buat targetRegistry.
2. Mapping targetIndex.
3. Hubungkan ke instrument data.
4. Test beberapa target.

## PHASE 5 — AR Mode 1
1. Render PNG/model alat musik.
2. Tambahkan label nama.
3. Tambahkan hotspot.
4. Popup hotspot.

## PHASE 6 — AR Mode 2
1. Tambahkan concept data.
2. Tambahkan label sumber getaran.
3. Tambahkan animasi gelombang.
4. Tambahkan audio control.
5. Sinkronkan audio dengan wave animation.

## PHASE 7 — AR Mode 3
1. Tambahkan video texture/plane.
2. Tambahkan Play/Pause.
3. Pause saat targetLost.
4. Pastikan `playsinline` berjalan di iOS.

## PHASE 8 — AR Toolbar & Popup
1. Buat HTML overlay toolbar.
2. Buat bottom sheet info.
3. Hubungkan dengan active target.
4. Tambahkan Close / Reset.

## PHASE 9 — Quiz
1. Load quiz JSON.
2. Jawab pertanyaan.
3. Score.
4. Result.
5. Save localStorage.

## PHASE 10 — Performance
1. Audit ukuran asset.
2. Lazy-load media.
3. Pause inactive media.
4. Buat low-performance mode.
5. Test target ±30 FPS.

## PHASE 11 — Final QA
1. Android.
2. iOS.
3. Permission flow.
4. Multi target.
5. Slow connection.
6. Responsive.
7. Deploy HTTPS.

---

# 26. Instruksi Kerja untuk GitHub Copilot

Saat mengerjakan proyek ini:

1. Baca dokumen ini sebelum membuat atau mengubah fitur.
2. Kerjakan per phase.
3. Jangan membuat satu file besar.
4. Pisahkan komponen AR, audio, video, popup, dan data.
5. Jangan hardcode data alat musik di komponen.
6. Jangan mengubah arsitektur tanpa alasan jelas.
7. Jangan memasukkan backend pada versi pertama.
8. Pastikan scene AR di-cleanup saat route ditutup.
9. Hentikan camera stream saat keluar halaman AR.
10. Hentikan semua audio/video ketika halaman AR di-unmount.
11. Jangan autoplay audio dengan suara.
12. Optimalkan untuk mobile sebelum desktop.
13. Semua fitur berat harus lazy-load.
14. Setelah satu phase selesai, test sebelum melanjutkan.

---

# 27. Prompt Awal untuk Copilot

Gunakan prompt berikut setelah file ini berada di root project:

```text
Read COPILOT_AR_MUSIK_MINDAR.md completely before writing code.

Build this project phase by phase and do not skip architecture rules.
Start only with PHASE 1 and PHASE 2.

Requirements:
- React + Vite
- Tailwind CSS
- modular folder architecture
- mobile-first responsive UI
- prepare the project for MindAR Image Tracking + A-Frame
- use JSON-driven instrument content
- no backend yet
- do not implement the full AR system until the base website is stable

After finishing PHASE 1 and PHASE 2, provide:
1. files created
2. dependencies installed
3. routes available
4. manual testing checklist
5. next recommended phase

Do not rewrite unrelated files.
```

---

# 28. Prompt Copilot untuk Implementasi AR

Setelah website dasar selesai:

```text
Read COPILOT_AR_MUSIK_MINDAR.md again.

Now implement PHASE 3 and PHASE 4 only.

Create a dedicated AR feature module using MindAR Image Tracking + A-Frame.

Requirements:
- camera starts only after a user gesture
- use a separate AR page
- load /assets/ar/targets.mind
- support multiple targetIndex values
- implement targetRegistry
- implement targetFound and targetLost
- show scan guide before target detection
- show active target information in a lightweight HTML overlay
- properly cleanup MindAR, camera stream, audio, and video on unmount
- keep AR feature isolated from the rest of the website
- prioritize mobile performance

Do not yet implement complex visual effects.
First make target tracking stable.
```

---

# 29. Prompt Copilot untuk Tiga Mode AR

Setelah tracking stabil:

```text
Read COPILOT_AR_MUSIK_MINDAR.md.

Implement PHASE 5, PHASE 6, and PHASE 7 incrementally.

AR Mode 1:
- full instrument visualization
- hotspots
- part explanation popup

AR Mode 2:
- vibration source label
- resonance explanation
- animated sound wave
- Play/Pause instrument audio
- wave animation follows audio state

AR Mode 3:
- video of a person playing the instrument
- Play/Pause/Mute
- playsinline support
- pause when target is lost

All content must come from instruments.json and targetRegistry.
Do not hardcode individual instruments into AR components.
Keep each AR mode in a separate component.
```

---

# 30. Prioritas MVP

Versi pertama dianggap cukup jika sudah memiliki:

- Home
- Daftar alat musik
- Detail alat musik
- Materi
- Video materi
- AR scanner
- 3 jenis AR
- audio button
- popup penjelasan
- video play/pause
- petunjuk penggunaan
- tentang
- responsive mobile

Quiz dan progress belajar dapat masuk setelah MVP AR stabil.

---

# 31. Hasil Akhir yang Diharapkan

User membuka website dari HP.

User memilih `Mulai AR`.

Kamera terbuka.

User mengarahkan kamera ke halaman/gambar alat musik pada modul.

MindAR mengenali gambar.

Jika target adalah mode 1:
- alat musik tampil lengkap
- bagian penting dapat dijelaskan

Jika target adalah mode 2:
- konsep bunyi tampil
- gelombang bergerak
- user dapat menekan tombol suara
- popup menjelaskan proses terjadinya bunyi

Jika target adalah mode 3:
- video orang memainkan alat musik muncul
- user dapat memainkan atau menghentikan video

Semua pengalaman tetap terasa sebagai satu website edukasi yang konsisten, ringan, dan mudah digunakan.


# 26. Aturan Wajib untuk GitHub Copilot

Gunakan instruksi berikut di setiap prompt implementasi:

```text
PROJECT CONSTRAINTS:
- Do not create or use any database.
- Do not create a backend API.
- Do not use Firebase, Supabase, MySQL, PostgreSQL, MongoDB, SQLite, Prisma, Sequelize, Laravel API, Express API, or NestJS.
- The project must remain a static React + Vite web application.
- Read educational content from local JSON files.
- Read AR target mapping from local JS/JSON configuration.
- Store optional user progress only in localStorage.
- Store images, audio, video, GLB files, and targets.mind as static assets.
- Keep AR components modular.
- The final production build must be deployable to a static HTTPS host.
```

## Prompt Utama Copilot

```text
Build this project as a fully static educational Web AR application using React, Vite, MindAR Image Tracking, A-Frame, and Tailwind CSS.

There must be NO DATABASE and NO BACKEND API.

All instruments, materials, videos, quizzes, AR metadata, popup explanations, and target mappings must come from local JSON/JavaScript configuration files. Images, audio, videos, GLB models, and targets.mind must be served as static assets. Use localStorage only for optional learning progress, bookmarks, and quiz scores.

Keep the implementation modular. The AR scanner must support three content modes: instrument overview, sound-wave/concept visualization with audio, and performance video. Use HTML overlays for controls and explanation popups. Pause media on targetLost and restore the UI safely on targetFound. Optimize for mobile and target approximately 30 FPS on lower-end devices.

Do not introduce Firebase, Supabase, Prisma, SQL, MongoDB, Express, NestJS, Laravel, or any server-side dependency.
```
