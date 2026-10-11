import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn.js';

/**
 * Mobile-first bottom sheet (slides up from the bottom on phones, becomes a
 * centered dialog on larger screens). Used for AR info popups and detail
 * panels. Closes on Escape and backdrop click; locks body scroll while open.
 */
export function BottomSheet({ open, onClose, title, children, maxHeight = '80vh' }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the sheet for keyboard/screen-reader users.
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Panel informasi'}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        style={{ maxHeight }}
        className={cn(
          'relative w-full max-w-lg overflow-y-auto outline-none',
          'rounded-t-3xl bg-white sm:rounded-3xl',
          'animate-[slideUp_0.25s_ease-out] shadow-2xl'
        )}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-stone-100 bg-white/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-stone-200 sm:hidden" />
          {title && (
            <h2 className="text-base font-semibold text-wood-900">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-wood-500 hover:bg-wood-100"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:.6}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
