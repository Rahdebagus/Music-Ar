import { cn } from '@/utils/cn.js';

const TONES = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  wood: 'bg-wood-100 text-wood-800 ring-wood-300',
  accent: 'bg-amber-50 text-amber-700 ring-amber-200',
  neutral: 'bg-stone-100 text-stone-700 ring-stone-200',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5',
        'text-xs font-medium ring-1 ring-inset',
        TONES[tone] || TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
