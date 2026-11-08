import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

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
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="KINETIC" />
          </Link>

          <nav className="nav-links">
            <NavLink to="/" end className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>
              Yêu thích
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Đơn hàng
            </NavLink>
          </nav>

          <div className="nav-actions">
            <Link to="/cart" className="cart-link">
              <span className="icon">shopping_bag</span>
              Giỏ hàng
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="btn btn--light">
                  <span className="icon" style={{ fontSize: 16 }}>person</span>
                  {user.name}
                </Link>
                <button type="button" className="btn btn--light" onClick={logout}>
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
      </header>
    </>
  );
}
