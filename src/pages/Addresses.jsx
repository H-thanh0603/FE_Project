import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { isNotEmpty, isPhone } from '../utils/validators';

function createEmptyForm(user) {
  return {
    label: 'Nhà riêng',
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: '',
  };
}

export default function Addresses() {
  const { user } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useAddresses();
  const [form, setForm] = useState(() => createEmptyForm(user));
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const setField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setError('');
    setMessage('');
  };

  const resetForm = () => {
    setForm(createEmptyForm(user));
    setEditingId(null);
    setError('');
  };

  const handleEdit = (address) => {
    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
    });
    setEditingId(address.id);
    setError('');
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isNotEmpty(form.label) || !isNotEmpty(form.name) || !isNotEmpty(form.address)) {
      setError('Vui lòng nhập nhãn, họ tên người nhận và địa chỉ.');
      return;
    }
    if (!isPhone(form.phone)) {
      setError('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
      return;
    }

    const savedAddress = {
      label: form.label.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    if (editingId) {
      updateAddress(editingId, savedAddress);
      setMessage('Đã cập nhật địa chỉ.');
    } else {
      addAddress(savedAddress);
      setMessage('Đã thêm địa chỉ.');
    }
    setForm(createEmptyForm(user));
    setEditingId(null);
    setError('');
  };

  const handleDelete = (addressId) => {
    deleteAddress(addressId);
    setConfirmDeleteId(null);
    if (editingId === addressId) resetForm();
    setMessage('Đã xóa địa chỉ.');
  };

  if (!user) {
    return (
      <div className="container">
        <div className="page page-narrow">
          <div className="eyebrow">Tài khoản</div>
          <h1 className="section-title">Đăng Nhập Để Quản Lý Địa Chỉ</h1>
          <p className="page-note">Sổ địa chỉ được lưu cục bộ cho tài khoản mô phỏng của bạn.</p>
          <Link to="/login" className="btn btn--dark">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page address-page">
        <div>
          <div className="eyebrow">Tài khoản của bạn</div>
          <h1 className="section-title">Sổ Địa Chỉ</h1>
          <p className="page-note">
            Lưu địa chỉ giao hàng thường dùng để chọn nhanh khi thanh toán.
          </p>
        </div>

        <div className="address-page-links">
          <Link to="/profile" className="btn btn--outline">Hồ sơ cá nhân</Link>
          <Link to="/checkout" className="btn btn--outline">Thanh toán</Link>
        </div>

        {addresses.length === 0 ? (
          <div className="empty-state">
            <span className="icon">location_on</span>
            <p>Bạn chưa lưu địa chỉ giao hàng nào.</p>
          </div>
        ) : (
          <ul className="address-list">
            {addresses.map((address) => (
              <li key={address.id} className="address-card">
                <div className="address-card-head">
                  <div className="address-card-title">
                    <strong>{address.label}</strong>
                    {address.isDefault && <span className="address-default-badge">Mặc định</span>}
                  </div>
                  <div className="address-card-actions">
                    {!address.isDefault && (
                      <button
                        type="button"
                        className="address-text-button"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Đặt làm mặc định
                      </button>
                    )}
                    <button
                      type="button"
                      className="address-text-button"
                      onClick={() => handleEdit(address)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="address-text-button address-text-button--danger"
                      onClick={() => setConfirmDeleteId(address.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <p><strong>{address.name}</strong> · {address.phone}</p>
                <p className="page-note">{address.address}</p>
                {confirmDeleteId === address.id && (
                  <div className="address-delete-confirm" role="group" aria-label="Xác nhận xóa địa chỉ">
                    <span>Xóa địa chỉ này?</span>
                    <button
                      type="button"
                      className="address-text-button address-text-button--danger"
                      onClick={() => handleDelete(address.id)}
                    >
                      Xác nhận
                    </button>
                    <button
                      type="button"
                      className="address-text-button"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <section className="address-form-section">
          <div>
            <h2 className="address-form-title">
              {editingId ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
            </h2>
            <p className="page-note">Số điện thoại dùng để liên hệ giao hàng.</p>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="address-label">
              Nhãn địa chỉ
              <input
                id="address-label"
                className="input"
                placeholder="Nhà riêng, văn phòng..."
                value={form.label}
                onChange={setField('label')}
              />
            </label>
            <label htmlFor="address-name">
              Họ tên người nhận
              <input
                id="address-name"
                className="input"
                autoComplete="name"
                value={form.name}
                onChange={setField('name')}
              />
            </label>
            <label htmlFor="address-phone">
              Số điện thoại
              <input
                id="address-phone"
                type="tel"
                className="input"
                autoComplete="tel"
                value={form.phone}
                onChange={setField('phone')}
              />
            </label>
            <label htmlFor="address-full">
              Địa chỉ giao hàng
              <textarea
                id="address-full"
                className="input address-textarea"
                autoComplete="street-address"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={form.address}
                onChange={setField('address')}
                rows={3}
              />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="profile-success" role="status">{message}</p>}

            <div className="address-form-actions">
              <button type="submit" className="btn btn--red">
                {editingId ? 'Lưu địa chỉ' : 'Thêm địa chỉ'}
              </button>
              {editingId && (
                <button type="button" className="btn btn--outline" onClick={resetForm}>
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
