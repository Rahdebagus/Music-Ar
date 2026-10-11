import { useMemo, useState } from 'react';
import { InstrumentCard } from '@/features/instruments/InstrumentCard.jsx';
import {
  getFilterOptions,
  searchInstruments,
} from '@/features/instruments/instrumentService.js';
import { EmptyState } from '@/components/ui/EmptyState.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';

const FILTER_DEFS = [
  { key: 'region', label: 'Daerah', optionsKey: 'regions' },
  { key: 'category', label: 'Jenis', optionsKey: 'categories' },
  { key: 'playMethod', label: 'Cara Dimainkan', optionsKey: 'playMethods' },
  { key: 'soundSource', label: 'Sumber Bunyi', optionsKey: 'soundSources' },
];

export function InstrumentsPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const options = useMemo(() => getFilterOptions(), []);

  const results = useMemo(
    () => searchInstruments(query, filters),
    [query, filters]
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  }
  function clearAll() {
    setFilters({});
    setQuery('');
  }

  return (
    <div className="container-page py-4">
      {/* Search + filters */}
      <div className="card-surface mb-5 p-4">
        <label className="relative block">
          <span className="sr-only">Cari alat musik</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wood-400">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, daerah, atau jenis…"
            className="w-full rounded-full border border-wood-200 bg-wood-50/60 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FILTER_DEFS.map((f) => (
            <select
              key={f.key}
              value={filters[f.key] || ''}
              onChange={(e) => setFilter(f.key, e.target.value)}
              aria-label={f.label}
              className={cn(
                'w-full rounded-xl border bg-white py-2 pl-3 pr-2 text-sm outline-none',
                filters[f.key]
                  ? 'border-brand-400 text-brand-700'
                  : 'border-wood-200 text-wood-700'
              )}
            >
              <option value="">{f.label}: Semua</option>
              {options[f.optionsKey].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}
        </div>

        {(activeFilterCount > 0 || query) && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-wood-500">
              {results.length} hasil
              {activeFilterCount > 0 && ` · ${activeFilterCount} filter aktif`}
            </p>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Reset filter
            </Button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="Tidak ada hasil"
          description="Coba ubah kata kunci atau reset filter."
          action={<Button onClick={clearAll}>Reset filter</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((it, i) => (
            <InstrumentCard key={it.id} instrument={it} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}
