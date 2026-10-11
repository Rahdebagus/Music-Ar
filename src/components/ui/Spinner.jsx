import { cn } from '@/utils/cn.js';

export function Spinner({ className, label = 'Memuat…' }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span
        className={cn(
          'inline-block h-5 w-5 animate-spin rounded-full',
          'border-2 border-brand-200 border-t-brand-600',
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Full-area centered loading state. */
export function LoadingBlock({ label = 'Memuat…' }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-wood-600">
      <Spinner />
      <p className="text-sm">{label}</p>
    </div>
  );
}
