import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { saveOrder } from '../services/orderService';
import formatPrice from '../utils/formatPrice';
import { isEmail, isPhone, isNotEmpty } from '../utils/validators';

const EMPTY_FORM = { name: '', phone: '', email: '', address: '' };
const FREE_SHIPPING_THRESHOLD = 1500000;
const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    description: 'Dự kiến nhận trong 3–5 ngày',
    fee: 30000,
  },
  {
    id: 'express',
    name: 'Giao hàng nhanh',
    description: 'Dự kiến nhận trong 1–2 ngày',
    fee: 60000,
  },
];
const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán trực tiếp cho đơn vị giao hàng.',
  },
  {
    id: 'bank-transfer',
    name: 'Chuyển khoản ngân hàng (mô phỏng)',
    description: 'Không phát sinh giao dịch thật trong đồ án frontend.',
  },
];
const CHECKOUT_STEPS = [
  { id: 'details', label: 'Thông tin nhận hàng' },
  { id: 'delivery', label: 'Giao hàng & thanh toán' },
  { id: 'review', label: 'Xác nhận đơn hàng' },
];

function getCustomerError(form) {
  if (!isNotEmpty(form.name)) return 'Vui lòng nhập họ tên người nhận.';
  if (!isPhone(form.phone)) return 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
  if (!isEmail(form.email)) return 'Vui lòng nhập email hợp lệ.';
  if (!isNotEmpty(form.address)) return 'Vui lòng nhập địa chỉ giao hàng.';
  return '';
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addresses } = useAddresses();
  const defaultAddress = addresses.find((address) => address.isDefault);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? 'manual');
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    name: defaultAddress?.name ?? user?.name ?? '',
    phone: defaultAddress?.phone ?? user?.phone ?? '',
    email: user?.email ?? '',
    address: defaultAddress?.address ?? '',
  }));
  const [step, setStep] = useState('details');
  const [shippingId, setShippingId] = useState('standard');
  const [paymentId, setPaymentId] = useState('cod');
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const shippingMethod = SHIPPING_METHODS.find((method) => method.id === shippingId);
  const paymentMethod = PAYMENT_METHODS.find((method) => method.id === paymentId);
  const shippingCost =
    shippingId === 'standard' && total >= FREE_SHIPPING_THRESHOLD
      ? 0
      : shippingMethod.fee;
  const orderTotal = total + shippingCost;

  const setField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setError('');
  };

  const selectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setError('');
    if (addressId === 'manual') return;

    const address = addresses.find((item) => item.id === addressId);
    if (!address) return;
    setForm((previous) => ({
      ...previous,
      name: address.name,
      phone: address.phone,
      address: address.address,
    }));
  };

  const continueFromDetails = (event) => {
    event.preventDefault();
    const validationError = getCustomerError(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep('delivery');
  };

  const continueToReview = (event) => {
    event.preventDefault();
    if (!shippingMethod || !paymentMethod) {
      setError('Vui lòng chọn phương thức giao hàng và thanh toán.');
      return;
    }
    setError('');
    setStep('review');
  };

  const placeOrder = () => {
    const validationError = getCustomerError(form);
    if (validationError) {
      setError(validationError);
      setStep('details');
      return;
    }
    if (!shippingMethod || !paymentMethod) {
      setError('Vui lòng chọn phương thức giao hàng và thanh toán.');
      setStep('delivery');
      return;
    }

    const newOrder = saveOrder({
      customer: { ...form },
      items: [...items],
      subtotal: total,
      shipping: {
        id: shippingMethod.id,
        name: shippingMethod.name,
        cost: shippingCost,
      },
      payment: {
        id: paymentMethod.id,
        name: paymentMethod.name,
        simulated: true,
      },
      total: orderTotal,
      status: 'pending',
    });
    clearCart();
    setError('');
    setPlacedOrder(newOrder);
  };

  if (placedOrder) {
    return (
      <div className="container">
        <div className="page page-narrow checkout-success">
          <div className="order-success">
            <span className="icon order-success-icon">check_circle</span>
            <h1 className="section-title">Đặt Hàng Thành Công</h1>
            <p>
              Mã đơn hàng của bạn: <strong>{placedOrder.id}</strong>
            </p>
            <p className="page-note">
              Đơn hàng và phương thức thanh toán chỉ được mô phỏng, không có giao dịch thật.
            </p>
            <Link to="/orders" className="btn btn--outline">Xem đơn hàng</Link>
            <Link to="/products" className="btn btn--dark">Tiếp tục mua sắm</Link>
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
      <div className="page checkout-page">
        <div>
          <div className="eyebrow">Đặt hàng mô phỏng</div>
          <h1 className="section-title">Thanh Toán</h1>
        </div>

        <ol className="checkout-steps" aria-label="Các bước thanh toán">
          {CHECKOUT_STEPS.map((item, index) => {
            const active = item.id === step;
            const completed = CHECKOUT_STEPS.findIndex((entry) => entry.id === step) > index;
            return (
              <li
                key={item.id}
                className={`checkout-step${active ? ' active' : ''}${completed ? ' completed' : ''}`}
                aria-current={active ? 'step' : undefined}
              >
                <span className="checkout-step-number">{completed ? '✓' : index + 1}</span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="checkout-layout">
          <div className="checkout-main">
            {error && <p className="form-error" role="alert">{error}</p>}

            {step === 'details' && (
              <section className="checkout-section">
                <div>
                  <h2 className="checkout-section-title">Thông Tin Nhận Hàng</h2>
                  <p className="page-note">Nhập chính xác thông tin để giao hàng.</p>
                </div>

                <form className="form" onSubmit={continueFromDetails} noValidate>
                  {addresses.length > 0 && (
                    <label>
                      Chọn địa chỉ đã lưu
                      <select
                        className="input"
                        value={selectedAddressId}
                        onChange={(event) => selectAddress(event.target.value)}
                      >
                        <option value="manual">Nhập địa chỉ khác</option>
                        {addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.label} — {address.address}
                            {address.isDefault ? ' (Mặc định)' : ''}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label htmlFor="checkout-name">
                    Họ và tên
                    <input
                      id="checkout-name"
                      className="input"
                      autoComplete="name"
                      value={form.name}
                      onChange={setField('name')}
                    />
                  </label>
                  <label htmlFor="checkout-phone">
                    Số điện thoại
                    <input
                      id="checkout-phone"
                      className="input"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={setField('phone')}
                    />
                  </label>
                  <label htmlFor="checkout-email">
                    Email
                    <input
                      id="checkout-email"
                      className="input"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={setField('email')}
                    />
                  </label>
                  <label htmlFor="checkout-address">
                    Địa chỉ giao hàng
                    <textarea
                      id="checkout-address"
                      className="input checkout-address-input"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={setField('address')}
                      rows={3}
                    />
                  </label>
                  {user && (
                    <Link to="/addresses" className="checkout-address-link">
                      Quản lý sổ địa chỉ
                    </Link>
                  )}
                  <button type="submit" className="btn btn--red">
                    Tiếp tục: giao hàng & thanh toán
                  </button>
                </form>
              </section>
            )}

            {step === 'delivery' && (
              <section className="checkout-section">
                <div>
                  <h2 className="checkout-section-title">Giao Hàng & Thanh Toán</h2>
                  <p className="page-note">Chọn phương thức phù hợp cho đơn hàng.</p>
                </div>

                <form className="form" onSubmit={continueToReview}>
                  <fieldset className="checkout-choice-group">
                    <legend>Phương thức giao hàng</legend>
                    {SHIPPING_METHODS.map((method) => {
                      const fee =
                        method.id === 'standard' && total >= FREE_SHIPPING_THRESHOLD
                          ? 0
                          : method.fee;
                      return (
                        <label key={method.id} className="checkout-choice">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingId === method.id}
                            onChange={() => setShippingId(method.id)}
                          />
                          <span className="checkout-choice-copy">
                            <strong>{method.name}</strong>
                            <span>{method.description}</span>
                          </span>
                          <strong className="checkout-choice-price">
                            {fee === 0 ? 'Miễn phí' : formatPrice(fee)}
                          </strong>
                        </label>
                      );
                    })}
                  </fieldset>

                  <fieldset className="checkout-choice-group">
                    <legend>Phương thức thanh toán</legend>
                    {PAYMENT_METHODS.map((method) => (
                      <label key={method.id} className="checkout-choice">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentId === method.id}
                          onChange={() => setPaymentId(method.id)}
                        />
                        <span className="checkout-choice-copy">
                          <strong>{method.name}</strong>
                          <span>{method.description}</span>
                        </span>
                      </label>
                    ))}
                    <p className="checkout-simulation-note">
                      Không nhập thông tin thẻ hoặc chuyển khoản thật. Đây chỉ là lựa chọn giao diện.
                    </p>
                  </fieldset>

                  <div className="checkout-actions">
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => setStep('details')}
                    >
                      Quay lại
                    </button>
                    <button type="submit" className="btn btn--red">
                      Tiếp tục: xác nhận đơn
                    </button>
                  </div>
                </form>
              </section>
            )}

            {step === 'review' && (
              <section className="checkout-section">
                <div>
                  <h2 className="checkout-section-title">Xác Nhận Đơn Hàng</h2>
                  <p className="page-note">Kiểm tra lại thông tin trước khi đặt đơn mô phỏng.</p>
                </div>

                <div className="checkout-review">
                  <div className="checkout-review-block">
                    <div className="checkout-review-heading">
                      <strong>Người nhận</strong>
                      <button
                        type="button"
                        className="address-text-button"
                        onClick={() => setStep('details')}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                    <p>{form.name} · {form.phone}</p>
                    <p>{form.email}</p>
                    <p>{form.address}</p>
                  </div>
                  <div className="checkout-review-block">
                    <div className="checkout-review-heading">
                      <strong>Giao hàng & thanh toán</strong>
                      <button
                        type="button"
                        className="address-text-button"
                        onClick={() => setStep('delivery')}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                    <p>{shippingMethod.name}</p>
                    <p>{paymentMethod.name}</p>
                    <p className="checkout-simulation-note">Phương thức thanh toán chỉ được mô phỏng.</p>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => setStep('delivery')}
                  >
                    Quay lại
                  </button>
                  <button type="button" className="btn btn--red" onClick={placeOrder}>
                    Đặt hàng mô phỏng
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="checkout-summary" aria-label="Tóm tắt đơn hàng">
            <h2 className="checkout-section-title">Đơn Hàng Của Bạn</h2>
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`}>
                  <span>{item.name} (size {item.size}) × {item.quantity}</span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <div className="checkout-totals">
              <p><span>Tạm tính</span><strong>{formatPrice(total)}</strong></p>
              <p>
                <span>Phí giao hàng</span>
                <strong>{shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost)}</strong>
              </p>
              {shippingId === 'standard' && total >= FREE_SHIPPING_THRESHOLD && (
                <p className="checkout-simulation-note">
                  Đơn từ {formatPrice(FREE_SHIPPING_THRESHOLD)} được miễn phí giao hàng tiêu chuẩn.
                </p>
              )}
              <p className="checkout-grand-total">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
