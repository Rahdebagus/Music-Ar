import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout.jsx';
import { LoadingBlock } from '@/components/ui/Spinner.jsx';

import { HomePage } from '@/pages/HomePage.jsx';
import { InstrumentsPage } from '@/pages/InstrumentsPage.jsx';
import { InstrumentDetailPage } from '@/pages/InstrumentDetailPage.jsx';
import { VideosPage } from '@/pages/VideosPage.jsx';
import { GuidePage } from '@/pages/GuidePage.jsx';
import { AboutPage } from '@/pages/AboutPage.jsx';
import { NotFoundPage } from '@/pages/NotFoundPage.jsx';
import { ComingSoonPage } from '@/pages/ComingSoonPage.jsx';

// Materi & Kuis are temporarily LOCKED (content not ready). To re-enable,
// restore the real pages:
//   import { MaterialsPage } from '@/pages/MaterialsPage.jsx';
//   import { QuizPage } from '@/pages/QuizPage.jsx';
// and swap the two elements below back to <MaterialsPage /> / <QuizPage />.

// AR is the heaviest feature — split it into its own chunk so the rest of
// the site loads fast on mobile.
const ARPage = lazy(() =>
  import('@/pages/ARPage.jsx').then((m) => ({ default: m.ARPage }))
);

const withSuspense = (node) => (
  <Suspense fallback={<LoadingBlock label="Memuat halaman AR…" />}>
    {node}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'instruments', element: <InstrumentsPage /> },
      { path: 'instruments/:id', element: <InstrumentDetailPage /> },
      { path: 'materials', element: <ComingSoonPage title="Materi" /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'ar', element: withSuspense(<ARPage />) },
      { path: 'quiz', element: <ComingSoonPage title="Kuis" /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
