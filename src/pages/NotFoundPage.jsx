import { EmptyState } from '@/components/ui/EmptyState.jsx';
import { Button } from '@/components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon="🧭"
        title="Halaman tidak ditemukan"
        description="Tautan mungkin salah atau halaman telah dipindahkan."
        action={<Button to="/">Kembali ke Beranda</Button>}
      />
    </div>
  );
}
