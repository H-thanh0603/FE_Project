import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { useNotifications } from '../context/NotificationContext';
import { saveOrder } from '../services/orderService';
import CouponInput from '../components/cart/CouponInput/CouponInput';
import formatPrice from '../utils/formatPrice';
import { isEmail, isPhone, isNotEmpty } from '../utils/validators';

const EMPTY_FORM = { name: '', phone: '', email: '', address: '' };
const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán trực tiếp cho đơn vị giao hàng.',
  },
  {
    id: 'bank-transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Bank',
  },
];
const CHECKOUT_STEPS = [
  { id: 'details', label: 'Thông tin nhận hàng' },
  { id: 'payment', label: 'Thanh toán' },
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
  const { items, total, clearCart, coupon, discount } = useCart();
  const { user } = useAuth();
  const { addresses } = useAddresses();
  const { pushNotification } = useNotifications();
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
  const [paymentId, setPaymentId] = useState('cod');
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const paymentMethod = PAYMENT_METHODS.find((method) => method.id === paymentId);
  const orderTotal = total - discount;

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
    setStep('payment');
  };

  const continueToReview = (event) => {
    event.preventDefault();
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán.');
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
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán.');
      setStep('payment');
      return;
    }

    const newOrder = saveOrder({
      customer: { ...form },
      items: [...items],
      subtotal: total,
      discount: {
        code: coupon?.code ?? null,
        amount: discount,
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
    pushNotification({
      title: 'Đặt hàng thành công',
      message: `Đơn ${newOrder.id} đã được tạo và đang chờ xác nhận.`,
      link: `/orders/${encodeURIComponent(newOrder.id)}`,
    });
  };

  if (placedOrder) {
    return (
      <div className="container checkout-success-container">
        <div className="page page-narrow checkout-success">
          <div className="order-success">
            <span className="icon order-success-icon">check_circle</span>
            <h1 className="section-title">Đặt Hàng Thành Công</h1>
            <p>
              Mã đơn hàng của bạn: <strong>{placedOrder.id}</strong>
            </p>
            <div className="order-success-actions">
              <Link to="/orders" className="btn btn--outline">Xem đơn hàng</Link>
              <Link to="/products" className="btn btn--dark">Tiếp tục mua sắm</Link>
            </div>
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

                <form
                  id="checkout-details-form"
                  className="form"
                  onSubmit={continueFromDetails}
                  noValidate
                >
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
                </form>
              </section>
            )}

            {step === 'payment' && (
              <section className="checkout-section">
                <div>
                  <h2 className="checkout-section-title">Thanh Toán</h2>
                  <p className="page-note">Chọn phương thức thanh toán cho đơn hàng.</p>
                </div>

                <form className="form" onSubmit={continueToReview}>
                  <fieldset className="checkout-choice-group checkout-payment-options">
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
                          {method.description && <span>({method.description})</span>}
                        </span>
                      </label>
                    ))}
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
                    <p>Họ và tên: {form.name}</p>
                    <p>Số điện thoại: {form.phone}</p>
                    <p>Email: {form.email}</p>
                    <p>Địa chỉ: {form.address}</p>
                  </div>
                  <div className="checkout-review-block">
                    <div className="checkout-review-heading">
                      <strong>Thanh toán</strong>
                      <button
                        type="button"
                        className="address-text-button"
                        onClick={() => setStep('payment')}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                    <p>{paymentMethod.name}</p>
                    {paymentMethod.description && <p>{paymentMethod.description}</p>}
                    <p className="checkout-simulation-note">Phương thức thanh toán chỉ được mô phỏng.</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {step !== 'payment' && (
            <aside className="checkout-summary" aria-label="Tóm tắt đơn hàng">
              <h2 className="checkout-section-title">
                {step === 'review' ? 'Chi Tiết Đơn Hàng' : 'Đơn Hàng Của Bạn'}
              </h2>
              <ul className="checkout-items">
                {items.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.colorway ?? ''}`}>
                    <span className="checkout-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="icon" aria-hidden="true">image</span>
                      )}
                    </span>
                    <span className="checkout-item-copy">
                      <strong>{item.name}</strong>
                      <span>
                        {item.colorway ? `${item.colorway} · ` : ''}Size {item.size} · Số lượng {item.quantity}
                      </span>
                      <span>{formatPrice(item.price)} / đôi</span>
                    </span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>
              <div className="checkout-coupon">
                <CouponInput />
              </div>
              <div className="checkout-totals">
                <p><span>Tạm tính</span><strong>{formatPrice(total)}</strong></p>
                {discount > 0 && (
                  <p className="checkout-discount">
                    <span>Giảm giá{coupon ? ` (${coupon.code})` : ''}</span>
                    <strong>-{formatPrice(discount)}</strong>
                  </p>
                )}
                <p className="checkout-grand-total">
                  <span>Tổng thanh toán</span>
                  <strong>{formatPrice(orderTotal)}</strong>
                </p>
              </div>
            </aside>
          )}
        </div>

        {step === 'details' && (
          <div className="checkout-actions checkout-bottom-actions">
            <button type="submit" form="checkout-details-form" className="btn btn--red">
              Tiếp tục: thanh toán
            </button>
          </div>
        )}
        {step === 'review' && (
          <div className="checkout-actions checkout-bottom-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setStep('payment')}
            >
              Quay lại
            </button>
            <button type="button" className="btn btn--red" onClick={placeOrder}>
              Đặt hàng mô phỏng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
