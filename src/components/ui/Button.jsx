import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn.js';

const VARIANTS = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary:
    'bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50 active:bg-brand-100',
  accent:
    'bg-accent-500 text-wood-900 hover:bg-accent-600 active:bg-accent-600 shadow-sm',
  ghost: 'bg-transparent text-wood-700 hover:bg-wood-100 active:bg-wood-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const SIZES = {
  sm: 'text-sm px-3 py-2 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

/**
 * Button that renders as <button>, a router <Link> (to), or an <a> (href).
 * Touch targets are comfortable for one-handed mobile use.
 */
export function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  fullWidth = false,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-semibold',
    'transition-colors select-none min-h-11',
    'disabled:opacity-50 disabled:pointer-events-none',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth && 'w-full',
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  const Comp = as || 'button';
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
