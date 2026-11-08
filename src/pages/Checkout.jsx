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
      <div className="page">
        <h1 className="page-title">✓ Đặt hàng thành công</h1>
        <p>
          Mã đơn hàng của bạn: <strong>{placedOrder.id}</strong>
        </p>
        <p>Xem lại đơn hàng trong trang <Link to="/orders">Đơn hàng</Link>.</p>
        <Link to="/products" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Thanh toán</h1>
        <p>Giỏ hàng trống, không thể thanh toán.</p>
        <Link to="/products" className="btn btn-primary">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Thanh toán</h1>

      <div className="checkout-summary">
        {items.map((item) => (
          <p key={`${item.id}-${item.size}`}>
            {item.name} (size {item.size}) × {item.quantity} —{' '}
            {formatPrice(item.price * item.quantity)}
          </p>
        ))}
        <p className="cart-total">
          Tổng cộng: <strong>{formatPrice(total)}</strong>
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
        <button type="submit" className="btn btn-primary">
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
