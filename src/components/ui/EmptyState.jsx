import { cn } from '@/utils/cn.js';

export function EmptyState({ icon = '🔍', title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card',
        'bg-white/60 px-6 py-12 text-center ring-1 ring-black/5',
        className
      )}
    >
      <div className="mb-3 text-4xl" aria-hidden="true">
        {icon}
      </div>
      {title && (
        <h3 className="text-lg font-semibold text-wood-900">{title}</h3>
      )}
      {description && (
        <p className="mt-1 max-w-sm text-sm text-wood-600">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
