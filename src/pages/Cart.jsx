import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import formatPrice from '../utils/formatPrice';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Giỏ hàng</h1>
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="btn btn-primary">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Giỏ hàng</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={`${item.id}-${item.size}`} className="cart-row">
            <span className="cart-row-name">
              {item.name} — size {item.size}
            </span>
            <span className="cart-row-price">{formatPrice(item.price)}</span>

            <div className="quantity-controls">
              <button
                type="button"
                aria-label="Giảm số lượng"
                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                aria-label="Tăng số lượng"
                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <span className="cart-row-subtotal">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => removeItem(item.id, item.size)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <p className="cart-total">
          Tổng cộng: <strong>{formatPrice(total)}</strong>
        </p>
        <div className="cart-footer-actions">
          <button type="button" className="btn btn-outline" onClick={clearCart}>
            Xóa tất cả
          </button>
          <Link to="/checkout" className="btn btn-primary">
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}
