/**
 * Tiny className joiner. Filters out falsy values so you can write:
 *   cn('base', isActive && 'active', disabled ? 'opacity-50' : null)
 * Avoids pulling in clsx/tailwind-merge for a project this size.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}
