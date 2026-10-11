import { NavLink } from 'react-router-dom';
import { TAB_ITEMS } from './navItems.js';
import { cn } from '@/utils/cn.js';

/**
 * Bottom tab bar — the app's primary navigation. The middle item (AR) is a
 * raised center action. Part of the app-shell flex column (not fixed), with
 * safe-area padding for phones with a home indicator.
 */
export function TabBar() {
  return (
    <nav
      className="z-30 shrink-0 border-t border-wood-100 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
      aria-label="Navigasi utama"
    >
      <ul className="grid grid-cols-5 items-end">
        {TAB_ITEMS.map((item) =>
          item.center ? (
            <li key={item.to} className="flex justify-center">
              <NavLink
                to={item.to}
                aria-label={item.label}
                className="flex flex-col items-center"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        '-mt-5 grid h-14 w-14 place-items-center rounded-full text-2xl shadow-lg ring-4 ring-white transition-transform',
                        isActive
                          ? 'scale-105 bg-accent-600 text-white'
                          : 'bg-accent-500 text-wood-900'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="pb-1 text-[10px] font-semibold text-wood-700">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ) : (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
                    item.locked
                      ? 'text-wood-400'
                      : isActive
                        ? 'text-brand-700'
                        : 'text-wood-500'
                  )
                }
              >
                <span className="relative text-xl" aria-hidden="true">
                  {item.icon}
                  {item.locked && (
                    <span className="absolute -right-2 -top-1 text-[10px]">
                      🔒
                    </span>
                  )}
                </span>
                {item.label}
              </NavLink>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
