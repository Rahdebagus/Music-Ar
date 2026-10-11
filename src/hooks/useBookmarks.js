import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

/** Favorite instruments, stored locally. */
const KEY = 'ar-music:bookmarks';

export function useBookmarks() {
  const [ids, setIds] = useLocalStorage(KEY, []);

  const isBookmarked = useCallback(
    (id) => Array.isArray(ids) && ids.includes(id),
    [ids]
  );

  const toggle = useCallback(
    (id) =>
      setIds((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.includes(id)
          ? list.filter((x) => x !== id)
          : [...list, id];
      }),
    [setIds]
  );

  return { bookmarks: Array.isArray(ids) ? ids : [], isBookmarked, toggle };
}
