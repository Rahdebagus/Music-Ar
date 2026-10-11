import { useLocation, useNavigate } from 'react-router-dom';
import { SCREENS } from './navItems.js';
import { getInstrumentById } from '@/features/instruments/instrumentService.js';
import { useInstallPrompt } from '@/hooks/useInstallPrompt.js';

/**
 * Contextual top app bar (native-style):
 *  - Home shows the app brand + an optional Install action.
 *  - Sub-screens show a back arrow + a centered title.
 * Titles come from SCREENS; the instrument detail title is resolved from data.
 */
export function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { canInstall, promptInstall } = useInstallPrompt();

  const path = location.pathname;
  const config = resolveScreen(path);

  return (
    <header
      className="z-30 flex h-14 shrink-0 items-center gap-1 border-b border-wood-100 bg-wood-50/95 px-2 backdrop-blur"
      style={{ paddingTop: 'var(--safe-top)', height: 'calc(3.5rem + var(--safe-top))' }}
    >
      {config.brand ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2 pl-1">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow-sm">
              🎵
            </span>
            <span className="truncate font-bold leading-tight text-wood-900">
              {config.title}
            </span>
          </div>
          {canInstall && (
            <button
              type="button"
              onClick={promptInstall}
              className="mr-1 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              ⬇ Pasang
            </button>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => (config.back ? navigate(-1) : navigate('/'))}
            aria-label="Kembali"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-wood-700 hover:bg-wood-100"
          >
            {config.back ? '‹' : '🏠'}
          </button>
          <h1 className="flex-1 truncate text-center text-base font-semibold text-wood-900">
            {config.title}
          </h1>
          <span className="h-10 w-10 shrink-0" aria-hidden="true" />
        </>
      )}
    </header>
  );
}

function resolveScreen(path) {
  if (SCREENS[path]) return SCREENS[path];
  if (path.startsWith('/instruments/')) {
    const id = path.split('/')[2];
    const inst = getInstrumentById(id);
    return { title: inst ? inst.name : 'Detail', back: true };
  }
  if (path === '/ar') return { title: 'AR Scanner' };
  return { title: 'AR Alat Musik', brand: true };
}
