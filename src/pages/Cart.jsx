import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CouponInput from '../components/cart/CouponInput/CouponInput';
import FreeShippingProgress from '../components/cart/FreeShippingProgress/FreeShippingProgress';
import formatPrice from '../utils/formatPrice';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Cart() {
  useDocumentTitle('Giỏ hàng');
  const { items, updateQuantity, removeItem, total, clearCart, discount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="page">
          <div className="eyebrow">Giỏ hàng của bạn</div>
          <h1 className="section-title">Giỏ Hàng Trống</h1>
          <div className="empty-state">
            <span className="icon">shopping_bag</span>
            <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
          </div>
          <Link to="/products" className="btn btn--dark" style={{ alignSelf: 'flex-start' }}>
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Giỏ hàng của bạn</div>
          <h1 className="section-title">
            Giỏ Hàng <span className="highlight">({items.length})</span>
          </h1>
        </div>

        <FreeShippingProgress subtotal={total} />

        <ul className="cart-list">
          {items.map((item) => (
            <li key={`${item.id}-${item.size}`} className="cart-row">
              <Link to={`/products/${item.id}`} className="cart-row-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span className="icon" style={{ color: 'var(--color-muted)' }}>
                    image
                  </span>
                )}
              </Link>

              <div className="cart-row-info">
                <Link to={`/products/${item.id}`} className="cart-row-name">
                  {item.name}
                </Link>
                <div className="cart-row-size">
                  Kích cỡ: <strong>{item.size}</strong>
                </div>
              </div>

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
                className="btn btn--light"
                onClick={() => removeItem(item.id, item.size)}
              >
                <span className="icon" style={{ fontSize: 16 }}>delete</span>
                Xóa
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-coupon">
          <CouponInput />
        </div>

        <div className="cart-footer">
          <p className="cart-total">
            Tổng cộng: <strong className="cart-total-value">{formatPrice(total - discount)}</strong>
            {discount > 0 && (
              <span className="cart-discount-note">đã giảm {formatPrice(discount)}</span>
            )}
          </p>
          <div className="cart-footer-actions">
            <button type="button" className="btn btn--outline" onClick={clearCart}>
              Xóa tất cả
            </button>
            <Link to="/checkout" className="btn btn--red">
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
