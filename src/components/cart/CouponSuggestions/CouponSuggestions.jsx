import { COUPONS } from '../../../services/couponService';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import './CouponSuggestions.css';

/**
 * Hiển thị danh sách mã voucher có sẵn và cho phép áp dụng nhanh bằng 1 click.
 */
export default function CouponSuggestions() {
  const { coupon, applyCoupon, total } = useCart();
  const { showToast } = useToast();

  const handleApply = (code) => {
    const res = applyCoupon(code);
    if (res.ok) {
      showToast(`Áp dụng thành công mã ${code}!`);
    } else {
      showToast(res.error || 'Không thể áp dụng mã');
    }
  };

  return (
    <div className="coupon-suggestions">
      <div className="coupon-suggestions-title">
        <span className="icon">sell</span>
        Mã ưu đãi gợi ý cho bạn
      </div>

      <div className="coupon-suggestions-list">
        {COUPONS.map((c) => {
          const isApplied = coupon?.code === c.code;
          const eligible = total >= c.minSubtotal;

          return (
            <div key={c.code} className="coupon-ticket">
              <div className="coupon-ticket-info">
                <span className="coupon-ticket-code">{c.code}</span>
                <span className="coupon-ticket-desc">{c.label}</span>
              </div>
              <button
                type="button"
                className={`coupon-ticket-btn${isApplied ? ' applied' : ''}`}
                onClick={() => handleApply(c.code)}
                disabled={isApplied || !eligible}
              >
                {isApplied
                  ? 'Đã áp dụng'
                  : eligible
                    ? 'Áp dụng'
                    : 'Chưa đủ điều kiện'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
