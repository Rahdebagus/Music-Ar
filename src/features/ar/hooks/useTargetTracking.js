import { useMemo } from 'react';
import { getInstrumentById } from '@/features/instruments/instrumentService.js';
import { MODE_META } from '../services/targetRegistry.js';

/**
 * Resolves a raw active target ({ index, instrumentId, mode }) into the full
 * instrument record plus mode metadata, so UI components receive ready-to-use
 * data instead of looking things up themselves.
 */
export function useTargetTracking(activeTarget) {
  return useMemo(() => {
    if (!activeTarget) {
      return { instrument: null, mode: null, modeMeta: null, index: null };
    }
    return {
      index: activeTarget.index,
      mode: activeTarget.mode,
      modeMeta: MODE_META[activeTarget.mode] || null,
      instrument: getInstrumentById(activeTarget.instrumentId),
    };
  }, [activeTarget]);
}
