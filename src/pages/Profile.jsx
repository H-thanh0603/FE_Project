import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isEmail, isNotEmpty, isPhone } from '../utils/validators';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const setField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setError('');
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isNotEmpty(form.name)) {
      setError('Vui lòng nhập họ tên.');
      return;
    }
    if (!isEmail(form.email)) {
      setError('Email chưa đúng định dạng.');
      return;
    }
    if (form.phone && !isPhone(form.phone)) {
      setError('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
      return;
    }

    const result = updateProfile(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage('Thông tin hồ sơ đã được cập nhật.');
  };

  if (!user) {
    return (
      <div className="container">
        <div className="page page-narrow">
          <div className="eyebrow">Tài khoản</div>
          <h1 className="section-title">Đăng Nhập Để Xem Hồ Sơ</h1>
          <p className="page-note">Hồ sơ được lưu cục bộ cho tài khoản mô phỏng của bạn.</p>
          <Link to="/login" className="btn btn--dark">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page page-narrow profile-page">
        <div>
          <div className="eyebrow">Tài khoản của bạn</div>
          <h1 className="section-title">Thông Tin Cá Nhân</h1>
          <p className="page-note">
            Thông tin được lưu trên trình duyệt này; đây là tài khoản mô phỏng frontend.
          </p>
        </div>

        <div className="profile-links">
          <Link to="/orders" className="btn btn--outline">Đơn hàng</Link>
          <Link to="/wishlist" className="btn btn--outline">Sản phẩm yêu thích</Link>
          <Link to="/addresses" className="btn btn--outline">Sổ địa chỉ</Link>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="profile-name">
            Họ và tên
            <input
              id="profile-name"
              className="input"
              autoComplete="name"
              value={form.name}
              onChange={setField('name')}
            />
          </label>

          <label htmlFor="profile-email">
            Email
            <input
              id="profile-email"
              type="email"
              className="input"
              autoComplete="email"
              value={form.email}
              onChange={setField('email')}
            />
          </label>

          <label htmlFor="profile-phone">
            Số điện thoại
            <input
              id="profile-phone"
              type="tel"
              className="input"
              autoComplete="tel"
              placeholder="Chưa cập nhật"
              value={form.phone}
              onChange={setField('phone')}
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="profile-success" role="status">{message}</p>}

          <button type="submit" className="btn btn--red">
            Lưu thay đổi
          </button>
        </form>

        <p className="page-note">
          Mật khẩu không được lưu trong ứng dụng mô phỏng này.
        </p>
      </div>
    </div>
  );
}
