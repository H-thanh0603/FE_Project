import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import FreeShippingProgress from '../FreeShippingProgress/FreeShippingProgress';
import formatPrice from '../../../utils/formatPrice';
import './MiniCartDrawer.css';

export default function MiniCartDrawer() {
  const {
    items,
    itemCount,
    total,
    discount,
    updateQuantity,
    removeItem,
    isDrawerOpen,
    closeDrawer,
  } = useCart();
  const location = useLocation();

  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const finalTotal = Math.max(0, total - discount);

  return (
    <div
      className="mini-cart-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
    >
      <aside
        className="mini-cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
      >
        <div className="mini-cart-header">
          <div>
            <span className="mini-cart-eyebrow">GIỎ HÀNG NHANH</span>
            <h2 id="mini-cart-title" className="mini-cart-title">
              Giỏ hàng <span className="highlight">({itemCount})</span>
            </h2>
          </div>
          <button
            type="button"
            className="mini-cart-close"
            onClick={closeDrawer}
            aria-label="Đóng giỏ hàng"
          >
            <span className="icon">close</span>
          </button>
        </div>

        {items.length > 0 && (
          <div className="mini-cart-shipping">
            <FreeShippingProgress subtotal={total} />
          </div>
        )}

        <div className="mini-cart-body">
          {items.length === 0 ? (
            <div className="mini-cart-empty">
              <span className="icon">shopping_bag</span>
              <p>Giỏ hàng của bạn đang trống.</p>
              <Link to="/products" className="btn btn--dark" onClick={closeDrawer}>
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <ul className="mini-cart-list">
              {items.map((item) => {
                const productUrl = item.colorway
                  ? `/products/${item.id}?color=${encodeURIComponent(item.colorway)}`
                  : `/products/${item.id}`;
                return (
                  <li
                    key={`${item.id}-${item.size}-${item.colorway ?? ''}`}
                    className="mini-cart-item"
                  >
                    <Link
                      to={productUrl}
                      className="mini-cart-thumb"
                      onClick={closeDrawer}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="icon">image</span>
                      )}
                    </Link>

                    <div className="mini-cart-info">
                      <div className="mini-cart-item-top">
                        <Link
                          to={productUrl}
                          className="mini-cart-name"
                          onClick={closeDrawer}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          className="mini-cart-remove"
                          aria-label={`Xóa ${item.name}`}
                          onClick={() => removeItem(item.id, item.size, item.colorway)}
                        >
                          <span className="icon">delete</span>
                        </button>
                      </div>

                      <div className="mini-cart-meta">
                        Size <strong>{item.size}</strong>
                        {item.colorway && (
                          <>
                            {' · '}
                            <span>{item.colorway}</span>
                          </>
                        )}
                      </div>

                      <div className="mini-cart-item-bottom">
                        <div className="mini-cart-qty">
                          <button
                            type="button"
                            aria-label="Giảm số lượng"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1,
                                item.colorway,
                              )
                            }
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Tăng số lượng"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1,
                                item.colorway,
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <span className="mini-cart-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="mini-cart-footer">
            <div className="mini-cart-summary-row">
              <span>Tạm tính</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            {discount > 0 && (
              <div className="mini-cart-summary-row mini-cart-discount">
                <span>Giảm giá</span>
                <strong>−{formatPrice(discount)}</strong>
              </div>
            )}
            <div className="mini-cart-summary-row mini-cart-total-row">
              <span>Tổng cộng</span>
              <strong className="mini-cart-total-value">{formatPrice(finalTotal)}</strong>
            </div>
            <div className="mini-cart-actions">
              <Link to="/cart" className="btn btn--light" onClick={closeDrawer}>
                Xem giỏ hàng
              </Link>
              <Link to="/checkout" className="btn btn--primary" onClick={closeDrawer}>
                Thanh toán
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
