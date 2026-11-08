import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

/** Bố cục chung: Navbar phía trên, nội dung trang ở giữa, Footer phía dưới. */
export default function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
