import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { isEmail, isPassword } from '../utils/validators';

/**
 * ⚠️ Đăng nhập MÔ PHỎNG: mật khẩu chỉ dùng để kiểm tra hợp lệ phía client,
 * KHÔNG được gửi đi hay lưu trữ ở bất kỳ đâu. Khi có backend cần thay bằng
 * API xác thực thật (JWT, session...).
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({
      ...prev,
      [field]: field === 'remember' ? event.target.checked : event.target.value,
    }));

  const validate = () => {
    const next = {};
    if (!isEmail(form.email)) {
      next.email = 'Email chưa đúng định dạng.';
    }
    if (!isPassword(form.password)) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    // Giả lập thời gian gọi API xác thực
    setSubmitting(true);
    setFormError('');
    setTimeout(() => {
      const result = login(form.email);
      setSubmitting(false);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      navigate('/');
    }, 800);
  };

  return (
    <AuthLayout
      eyebrow="Chào mừng trở lại"
      title="Đăng Nhập"
      subtitle="Đăng nhập để lưu giỏ hàng, theo dõi đơn hàng và nhận ưu đãi thành viên."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="login-email">Email</label>
          <div className="field-input">
            <span className="icon">mail</span>
            <input
              id="login-email"
              type="email"
              placeholder="ban@email.com"
              value={form.email}
              onChange={setField('email')}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="login-password">Mật khẩu</label>
          <div className="field-input">
            <span className="icon">lock</span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={setField('password')}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="field-eye"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="icon">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={setField('remember')}
            />
            Ghi nhớ đăng nhập
          </label>
          <Link to="/forgot-password" className="auth-link">
            Quên mật khẩu?
          </Link>
        </div>

        {formError && <p className="form-banner form-banner--error">{formError}</p>}

        <button type="submit" className="btn btn--red" disabled={submitting}>
          {submitting ? (
            <>
              <span className="icon spinning">progress_activity</span>
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <p className="auth-switch">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </AuthLayout>
  );
}
