import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { isEmail } from '../utils/validators';

/**
 * ⚠️ Quên mật khẩu chỉ MÔ PHỎNG: hiển thị thông báo gửi email thành công
 * mà không có hệ thống gửi thư thật. Khi có backend cần thay bằng API.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Email chưa đúng định dạng.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <AuthLayout
      eyebrow="Khôi phục tài khoản"
      title="Quên Mật Khẩu"
      subtitle="Nhập email đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu."
    >
      {sent ? (
        <div className="forgot-success">
          <span className="icon forgot-success-icon">mark_email_read</span>
          <p>
            Đã gửi hướng dẫn tới <strong>{email}</strong> (mô phỏng).
          </p>
          <p className="page-note">Kiểm tra hộp thư đến và làm theo các bước đặt lại mật khẩu.</p>
          <Link
            to={`/reset-password?email=${encodeURIComponent(email)}`}
            className="btn btn--red"
          >
            Đặt lại mật khẩu ngay
          </Link>
          <Link to="/login" className="btn btn--dark">
            Về trang đăng nhập
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="forgot-email">Email đăng ký</label>
            <div className="field-input">
              <span className="icon">forward_to_inbox</span>
              <input
                id="forgot-email"
                type="email"
                placeholder="ban@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            {error && <span className="field-error">{error}</span>}
          </div>

          <button type="submit" className="btn btn--red">
            Gửi hướng dẫn
          </button>

          <p className="auth-switch">
            Vừa nhớ ra mật khẩu? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
