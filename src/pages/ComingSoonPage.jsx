import { EmptyState } from '@/components/ui/EmptyState.jsx';
import { Button } from '@/components/ui/Button.jsx';

/**
 * Placeholder for features that are temporarily locked (content not ready).
 * Routed in place of the real page; swap the route back in router.jsx to
 * re-enable. Keeps the tab visible but clearly "coming soon".
 */
export function ComingSoonPage({ title = 'Fitur', note }) {
  return (
    <div className="container-page py-10">
      <EmptyState
        icon="🔒"
        title={`${title} segera hadir`}
        description={
          note ||
          'Bagian ini sedang disiapkan dan dikunci sementara. Nantikan pembaruannya ya!'
        }
        action={<Button to="/">Kembali ke Beranda</Button>}
      />
    </div>
  );
}
