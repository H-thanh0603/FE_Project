import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import ToastStack from '../common/Toast/ToastStack';
import ScrollToTop from '../common/ScrollToTop';
import BackToTop from '../common/BackToTop/BackToTop';
import MiniCartDrawer from '../cart/MiniCartDrawer/MiniCartDrawer';

function PageFallback() {
  return (
    <div className="container">
      <div className="page" role="status" aria-live="polite">
        <p className="page-note">Đang tải trang...</p>
      </div>
    </div>
  );
}

/** Bố cục chung: Navbar phía trên, nội dung trang ở giữa, Footer phía dưới. */
export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="container main-content">
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ToastStack />
      <MiniCartDrawer />
      <BackToTop />
    </div>
  );
}
