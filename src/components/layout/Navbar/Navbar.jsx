import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          👟 ShoeStore
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
            🛒 Giỏ hàng
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <button type="button" className="btn btn-outline" onClick={logout}>
              Xin chào, {user.name} — Đăng xuất
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
