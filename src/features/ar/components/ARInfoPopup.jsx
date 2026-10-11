import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Badge } from '@/components/ui/Badge.jsx';

/**
 * Bottom-sheet explanation over the AR scene. HTML (not 3D text) so it reads
 * crisply and scrolls. Shows either a selected part's detail or the full
 * instrument explanation.
 */
export function ARInfoPopup({ open, onClose, instrument, part }) {
  const navigate = useNavigate();
  if (!instrument) return null;
  const wc = instrument.waveConcept || {};

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={part ? part.name : instrument.name}
    >
      {part ? (
        <div className="space-y-2">
          <Badge tone="accent">Bagian alat musik</Badge>
          <p className="text-sm leading-relaxed text-wood-700">
            {part.description}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{instrument.category}</Badge>
            <Badge tone="wood">📍 {instrument.region}</Badge>
            <Badge tone="neutral">{instrument.playMethod}</Badge>
          </div>

          <p className="text-sm leading-relaxed text-wood-700">
            {instrument.description}
          </p>

          <InfoRow title="Cara Memainkan" body={instrument.howToPlay} />
          <InfoRow title="Konsep Bunyi" body={wc.description} />

          {instrument.funFact && (
            <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
              <p className="text-xs font-semibold text-amber-800">
                💡 Tahukah Kamu?
              </p>
              <p className="mt-1 text-sm text-amber-900/90">
                {instrument.funFact}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Tutup
            </Button>
            <Button
              fullWidth
              onClick={() => navigate(`/instruments/${instrument.id}`)}
            >
              Selengkapnya →
            </Button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

function InfoRow({ title, body }) {
  if (!body) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-wood-900">{title}</h3>
      <p className="mt-0.5 text-sm leading-relaxed text-wood-700">{body}</p>
    </div>
  );
}
