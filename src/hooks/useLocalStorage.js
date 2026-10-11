import { useCallback, useEffect, useState } from 'react';

/**
 * useLocalStorage — persistent state backed by localStorage.
 * - Safe in private mode / SSR (all access wrapped in try/catch).
 * - Syncs across tabs via the `storage` event.
 * - Accepts a function updater like useState.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota / disabled — keep state in memory only */
        }
        return next;
      });
    },
    [key]
  );

  // Keep multiple tabs / components in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === key) setStored(readValue());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, readValue]);

  return [stored, setValue];
}
