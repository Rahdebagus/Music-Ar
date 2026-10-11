import { useState } from 'react';
import { assetUrl, placeholderImage } from '@/utils/media.js';
import { cn } from '@/utils/cn.js';

/**
 * <img> wrapper that:
 * - resolves asset paths against BASE_URL,
 * - lazy-loads and decodes async,
 * - falls back to an inline SVG placeholder if the asset is missing
 *   (so the site renders before real images are added).
 */
export function SmartImage({
  src,
  alt = '',
  label,
  seed = 0,
  className,
  imgClassName,
  ...props
}) {
  const [failed, setFailed] = useState(false);
  const resolved = src ? assetUrl(src) : '';
  const showPlaceholder = !resolved || failed;
  const finalSrc = showPlaceholder
    ? placeholderImage(label || alt || 'Alat Musik', seed)
    : resolved;

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('block h-full w-full object-cover', imgClassName, className)}
      {...props}
    />
  );
}
