import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/orderService';
import formatPrice from '../utils/formatPrice';
import { isEmail, isPhone, isNotEmpty } from '../utils/validators';

const EMPTY_FORM = { name: '', phone: '', email: '', address: '' };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !isNotEmpty(form.name) ||
      !isPhone(form.phone) ||
      !isEmail(form.email) ||
      !isNotEmpty(form.address)
    ) {
      setError('Vui lòng nhập đúng họ tên, số điện thoại (10 chữ số), email và địa chỉ.');
      return;
    }

    // ⚠️ Đặt hàng chỉ MÔ PHỎNG: lưu đơn vào LocalStorage, không gọi hệ thống thanh toán thật
    const newOrder = saveOrder({ customer: form, items, total });
    clearCart();
    setError('');
    setPlacedOrder(newOrder);
  };

  if (placedOrder) {
    return (
      <div className="container">
        <div className="page page-narrow" style={{ maxWidth: 560 }}>
          <div className="order-success">
            <span className="icon order-success-icon">check_circle</span>
            <h1 className="section-title">Đặt Hàng Thành Công</h1>
            <p>
              Mã đơn hàng của bạn: <strong>{placedOrder.id}</strong>
            </p>
            <p className="page-note">
              Đơn hàng chỉ là mô phỏng — theo dõi trong trang{' '}
              <Link to="/orders">Đơn hàng</Link>.
            </p>
            <Link to="/products" className="btn btn--dark">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="page">
          <div className="eyebrow">Thanh toán</div>
          <h1 className="section-title">Không Có Sản Phẩm Để Thanh Toán</h1>
          <div className="empty-state">
            <span className="icon">remove_shopping_cart</span>
            <p>Giỏ hàng trống, hãy thêm sản phẩm trước khi thanh toán.</p>
          </div>
          <Link to="/products" className="btn btn--dark" style={{ alignSelf: 'flex-start' }}>
            Xem sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Bước cuối cùng</div>
          <h1 className="section-title">Thanh Toán</h1>
        </div>

        <div className="checkout-summary">
          {items.map((item) => (
            <p key={`${item.id}-${item.size}`}>
              {item.name} (size {item.size}) × {item.quantity} —{' '}
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </p>
          ))}
          <p className="cart-total">
            Tổng cộng: <strong className="cart-total-value">{formatPrice(total)}</strong>
          </p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label>
            Họ và tên
            <input className="input" value={form.name} onChange={setField('name')} />
          </label>
          <label>
            Số điện thoại
            <input
              className="input"
              type="tel"
              value={form.phone}
              onChange={setField('phone')}
            />
          </label>
          <label>
            Email
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={setField('email')}
            />
          </label>
          <label>
            Địa chỉ giao hàng
            <input
              className="input"
              value={form.address}
              onChange={setField('address')}
            />
          </label>
          <button type="submit" className="btn btn--red">
            Xác nhận đặt hàng
          </button>
        </form>
      </div>
    </div>
  );
}
