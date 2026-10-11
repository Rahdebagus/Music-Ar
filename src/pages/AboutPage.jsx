export function AboutPage() {
  return (
    <div className="container-page py-4">
      <div className="space-y-5 text-sm leading-relaxed text-wood-700">
        <section className="card-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-wood-900">
            Tentang
          </h2>
          <p>
            AR Alat Musik adalah media pembelajaran interaktif untuk mengenal
            alat musik tradisional Indonesia. Dengan teknologi Augmented Reality
            (AR) berbasis web, siswa dapat mengarahkan kamera HP ke gambar pada
            modul dan langsung melihat bentuk alat musik, memahami bagaimana
            bunyi terbentuk, serta menonton video cara memainkannya.
          </p>
        </section>

        <section className="card-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-wood-900">
            Tujuan Pembelajaran
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Mengenal bentuk dan bagian alat musik tradisional.</li>
            <li>Memahami konsep bunyi, getaran, resonansi, dan gelombang.</li>
            <li>Mengamati cara memainkan alat musik melalui video.</li>
            <li>Belajar secara mandiri, ringan, dan menyenangkan di HP.</li>
          </ul>
        </section>

        <section className="card-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-wood-900">
            Latar Belakang
          </h2>
          <p>
            Proyek ini dibuat sebagai sarana edukasi yang memadukan budaya dan
            sains. Aplikasi berjalan sepenuhnya di browser tanpa server maupun
            basis data, sehingga mudah diakses dan dibagikan hanya dengan sebuah
            tautan.
          </p>
        </section>

        <section className="card-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-wood-900">
            Kredit &amp; Sumber
          </h2>
          <p>
            Materi disusun untuk tujuan pendidikan. Aset gambar, audio, dan video
            alat musik dapat ditambahkan oleh pengembang modul. Teknologi AR
            menggunakan MindAR (Image Tracking) dan A-Frame, dengan antarmuka
            dibangun memakai React, Vite, dan Tailwind CSS.
          </p>
          <p className="mt-2 text-xs text-wood-500">
            Cantumkan kredit audio/video/foto pihak ketiga di sini bila
            digunakan.
          </p>
        </section>
      </div>
    </div>
  );
}
