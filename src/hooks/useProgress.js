import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

/**
 * Learning progress stored locally (no backend).
 * Tracks which instruments were opened, which AR targets were scanned,
 * which videos were watched, and quiz completion.
 */
const KEY = 'ar-music:progress';

const EMPTY = {
  openedInstruments: [],
  scannedTargets: [],
  watchedVideos: [],
  completedQuiz: false,
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage(KEY, EMPTY);

  const addTo = useCallback(
    (field, id) => {
      setProgress((prev) => {
        const base = { ...EMPTY, ...prev };
        const list = Array.isArray(base[field]) ? base[field] : [];
        if (list.includes(id)) return base;
        return { ...base, [field]: [...list, id] };
      });
    },
    [setProgress]
  );

  const markInstrumentOpened = useCallback(
    (id) => addTo('openedInstruments', id),
    [addTo]
  );
  const markTargetScanned = useCallback(
    (id) => addTo('scannedTargets', id),
    [addTo]
  );
  const markVideoWatched = useCallback(
    (id) => addTo('watchedVideos', id),
    [addTo]
  );
  const markQuizCompleted = useCallback(
    () => setProgress((prev) => ({ ...EMPTY, ...prev, completedQuiz: true })),
    [setProgress]
  );

  const reset = useCallback(() => setProgress(EMPTY), [setProgress]);

  const safe = { ...EMPTY, ...progress };
  return {
    progress: safe,
    markInstrumentOpened,
    markTargetScanned,
    markVideoWatched,
    markQuizCompleted,
    reset,
  };
}
