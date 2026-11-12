import formatPrice from '../../../utils/formatPrice';
import './FreeShippingProgress.css';

const FREE_SHIPPING_THRESHOLD = 1500000;

/**
 * Thanh tiến độ miễn phí vận chuyển trong giỏ hàng.
 * @param {Object} props
 * @param {number} props.subtotal - Tổng tiền sản phẩm
 */
export default function FreeShippingProgress({ subtotal = 0 }) {
  const missing = FREE_SHIPPING_THRESHOLD - subtotal;
  const percentage = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const achieved = missing <= 0;

  return (
    <div className={`free-shipping-box${achieved ? ' achieved' : ''}`}>
      <div className="free-shipping-msg">
        <span className="icon">{achieved ? 'check_circle' : 'local_shipping'}</span>
        {achieved ? (
          <span>Chúc mừng! Bạn đã đủ điều kiện được <strong>Miễn Phí Vận Chuyển</strong>!</span>
        ) : (
          <span>
            Mua thêm <strong>{formatPrice(missing)}</strong> để nhận <strong>Miễn Phí Vận Chuyển</strong>!
          </span>
        )}
      </div>

      <div className="free-shipping-track" aria-hidden="true">
        <div
          className="free-shipping-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
