import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppBar } from './AppBar.jsx';
import { TabBar } from './TabBar.jsx';

/**
 * App shell: a phone-width column (top app bar · scrollable content · bottom
 * tab bar). The page never scrolls — only <main> does — which is what makes
 * it feel like an installed app rather than a web page. The AR route renders
 * its camera view as a full-screen overlay above this shell.
 */
export function Layout() {
  const location = useLocation();
  const scrollRef = useRef(null);

  // Reset the content scroll to top on every navigation (native behavior).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  const isAR = location.pathname === '/ar';

  return (
    <div className="app-shell">
      <AppBar />
      <main ref={scrollRef} className="app-scroll no-scrollbar">
        <div key={location.pathname} className={isAR ? '' : 'screen-enter'}>
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  );
}
