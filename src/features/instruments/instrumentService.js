import instruments from '@/data/instruments.json';

/**
 * Read-only access to instrument content. The JSON file is the single
 * source of truth (no database). Components never hardcode instrument data.
 */

export function getAllInstruments() {
  return instruments;
}

export function getInstrumentById(id) {
  return instruments.find((it) => it.id === id) || null;
}

export function getInstrumentPart(instrumentId, partId) {
  const it = getInstrumentById(instrumentId);
  return it?.parts?.find((p) => p.id === partId) || null;
}

/** Distinct values for building filter dropdowns. */
export function getFilterOptions() {
  const uniq = (key) =>
    Array.from(new Set(instruments.map((it) => it[key]).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b, 'id')
    );
  return {
    regions: uniq('region'),
    categories: uniq('category'),
    playMethods: uniq('playMethod'),
    soundSources: uniq('soundSource'),
  };
}

/**
 * Search + filter. All params optional.
 * filters: { region, category, playMethod, soundSource }
 */
export function searchInstruments(query = '', filters = {}) {
  const q = query.trim().toLowerCase();
  return instruments.filter((it) => {
    if (filters.region && it.region !== filters.region) return false;
    if (filters.category && it.category !== filters.category) return false;
    if (filters.playMethod && it.playMethod !== filters.playMethod) return false;
    if (filters.soundSource && it.soundSource !== filters.soundSource)
      return false;
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.region.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      (it.description || '').toLowerCase().includes(q)
    );
  });
}
