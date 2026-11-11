import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import formatPrice from '../../../utils/formatPrice';
import './CouponInput.css';

/**
 * Ô nhập mã giảm giá (mô phỏng). Khi đã áp dụng thì hiển thị mã và số tiền tiết kiệm.
 */
export default function CouponInput() {
  const { coupon, discount, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = applyCoupon(code);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    setCode('');
  };

  if (coupon) {
    return (
      <div className="coupon-applied">
        <span className="icon">sell</span>
        <span className="coupon-applied-copy">
          <strong>{coupon.code}</strong>
          <span className="coupon-applied-note">
            {coupon.label} · Tiết kiệm {formatPrice(discount)}
          </span>
        </span>
        <button
          type="button"
          className="address-text-button"
          onClick={() => {
            removeCoupon();
            setError('');
          }}
        >
          Bỏ mã
        </button>
      </div>
    );
  }

  return (
    <form className="coupon-form" onSubmit={handleSubmit} noValidate>
      <label className="coupon-form-row">
        <span className="field-label">Mã giảm giá</span>
        <span className="coupon-form-input">
          <input
            className="input"
            placeholder="Ví dụ: WELCOME10"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setError('');
            }}
          />
          <button type="submit" className="btn btn--outline">Áp dụng</button>
        </span>
      </label>
      {error && <span className="field-error" role="alert">{error}</span>}
    </form>
  );
}
