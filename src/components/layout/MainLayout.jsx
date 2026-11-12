import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ToastStack from '../common/Toast/ToastStack';
import ScrollToTop from '../common/ScrollToTop';
import BackToTop from '../common/BackToTop/BackToTop';

/** Bố cục chung: Navbar phía trên, nội dung trang ở giữa, Footer phía dưới. */
export default function MainLayout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastStack />
      <BackToTop />
    </div>
  );
}
