import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { useCompare } from '../../../context/CompareContext';
import SearchAutocomplete from '../../common/SearchAutocomplete/SearchAutocomplete';
import './Navbar.css';

const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { productIds: compareIds } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.pathname === '/products') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') ?? '');
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (term) => {
    const trimmed = term.trim();
    setMobileMenuOpen(false);
    if (!trimmed) return;
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Miễn phí vận chuyển toàn quốc từ 1.500.000₫</span>
          <span>Hotline: 0968 656 866</span>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar-inner">
          <button
            type="button"
            className="nav-menu-toggle"
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="icon">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>

          <Link to="/" className="logo" title="Về trang chủ KINETIC">
            <img src="/images/logo.svg" alt="KINETIC" />
          </Link>

          <nav className="nav-links" aria-label="Điều hướng chính">
            <NavLink to="/" end className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink
              to="/wishlist"
              className={navLinkClass}
              title="Xem danh sách sản phẩm yêu thích"
            >
              Yêu thích
            </NavLink>
            <NavLink to="/compare" className={navLinkClass}>
              So sánh
              {compareIds.length > 0 && <span className="cart-badge">{compareIds.length}</span>}
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Đơn hàng
            </NavLink>
          </nav>

          <div className="nav-search">
            <SearchAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Tìm giày, thương hiệu..."
            />
          </div>

          <div className="nav-actions">
            <Link
              to="/notifications"
              className="notif-link"
              aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : 'Thông báo'}
              title={unreadCount > 0 ? `Xem thông báo (${unreadCount} chưa đọc)` : 'Xem thông báo'}
            >
              <span className="icon">notifications</span>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </Link>
            <button
              type="button"
              className="cart-link"
              onClick={openDrawer}
              aria-label={itemCount > 0 ? `Mở giỏ hàng, ${itemCount} sản phẩm` : 'Mở giỏ hàng'}
            >
              <span className="icon">shopping_bag</span>
              <span className="cart-link-text">Giỏ hàng</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <div className="nav-auth-desktop">
              {user ? (
                <>
                  <Link to="/profile" className="btn btn--light">
                    <span className="icon" style={{ fontSize: 16 }}>person</span>
                    {user.name}
                  </Link>
                  <button type="button" className="btn btn--light" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn--light">
                  <span className="icon" style={{ fontSize: 16 }}>person</span>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            id="mobile-nav-drawer"
            className="mobile-nav-drawer"
            aria-label="Menu di động"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-nav-head">
              <img src="/images/logo.svg" alt="KINETIC" className="mobile-nav-logo" />
              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Đóng menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="icon">close</span>
              </button>
            </div>

            <div className="mobile-nav-search">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
                placeholder="Tìm giày, thương hiệu..."
              />
            </div>

            <nav className="mobile-nav-links" aria-label="Điều hướng di động">
              <NavLink to="/" end className={navLinkClass}>
                Trang chủ
              </NavLink>
              <NavLink to="/products" className={navLinkClass}>
                Sản phẩm
              </NavLink>
              <NavLink to="/wishlist" className={navLinkClass}>
                Yêu thích
              </NavLink>
              <NavLink to="/compare" className={navLinkClass}>
                So sánh {compareIds.length > 0 ? `(${compareIds.length})` : ''}
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                Đơn hàng
              </NavLink>
              <NavLink to="/notifications" className={navLinkClass}>
                Thông báo {unreadCount > 0 ? `(${unreadCount})` : ''}
              </NavLink>
            </nav>

            <div className="mobile-nav-auth">
              {user ? (
                <>
                  <Link to="/profile" className="btn btn--light" style={{ width: '100%' }}>
                    <span className="icon" style={{ fontSize: 16 }}>person</span>
                    {user.name}
                  </Link>
                  <button
                    type="button"
                    className="btn btn--dark"
                    style={{ width: '100%' }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn--red" style={{ width: '100%' }}>
                  <span className="icon" style={{ fontSize: 16 }}>person</span>
                  Đăng nhập
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
