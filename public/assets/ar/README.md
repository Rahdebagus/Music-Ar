# Folder target AR

Butuh file **`targets.mind`** di folder ini:

```
public/assets/ar/targets.mind
```

## Cara tercepat (1 klik) — pakai target bawaan

Sudah disediakan gambar target **`target-suling.png`** di folder ini.

1. Jalankan `npm run dev`, lalu buka **http://localhost:5173/compile.html**
2. Klik **"Kompilasi target bawaan → unduh targets.mind"**, tunggu 100%.
3. Pindahkan `targets.mind` dari folder Unduhan ke **`public/assets/ar/targets.mind`**.
4. **Cetak / tampilkan `target-suling.png`**, buka menu **AR**, arahkan kamera →
   muncul model 3D **Suling Bambu** (`seruling_bambu_pbr.glb`).

> Kompilasi MindAR hanya bisa di browser (butuh TensorFlow.js), jadi langkah
> kompilasi dijalankan lewat halaman `/compile.html` di atas.

## Pakai gambar target sendiri

Di `/compile.html` ada pilihan **"pilih gambar sendiri"** (boleh beberapa,
urut sesuai `src/features/ar/services/targetRegistry.js`). Alternatif lain:
MindAR Image Target Compiler → https://hiukim.github.io/mind-ar-js-doc/tools/compile/

## Setup saat ini (1 target)

`targetRegistry.js` berisi **satu** target:

- index 0 → Suling Bambu, mode **bentuk (model 3D)**

Menambah target lagi nanti: tambahkan gambar ke daftar kompilasi (urut sama),
lalu tambahkan entri index-nya di `targetRegistry.js`.

> Tip tracking: cetak gambar target tidak mengilap, pencahayaan rata, dan
> pastikan seluruh gambar terlihat kamera.
