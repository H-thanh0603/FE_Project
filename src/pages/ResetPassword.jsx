import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { isMatch, isPassword } from '../utils/validators';

/**
 * ⚠️ Đặt lại mật khẩu chỉ MÔ PHỎNG: mật khẩu mới KHÔNG được lưu ở bất kỳ đâu,
 * chỉ kiểm tra hợp lệ trên biểu mẫu. Khi có backend cần thay bằng API thật.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!isPassword(form.password)) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự.';
    }
    if (!isMatch(form.password, form.confirm)) {
      next.confirm = 'Mật khẩu nhập lại không khớp.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setDone(true);
  };

  return (
    <AuthLayout
      eyebrow="Khôi phục tài khoản"
      title="Đặt Lại Mật Khẩu"
      subtitle={
        email
          ? `Tạo mật khẩu mới cho ${email}.`
          : 'Tạo mật khẩu mới cho tài khoản của bạn.'
      }
    >
      {done ? (
        <div className="forgot-success">
          <span className="icon forgot-success-icon">lock_reset</span>
          <p>Mật khẩu đã được đặt lại (mô phỏng).</p>
          <p className="page-note">
            Vì đây là bản mô phỏng, mật khẩu mới không được lưu trữ ở đâu cả.
          </p>
          <Link to="/login" className="btn btn--dark">
            Về trang đăng nhập
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="reset-password">Mật khẩu mới</label>
            <div className="field-input">
              <span className="icon">lock</span>
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={setField('password')}
                autoComplete="new-password"
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

          <div className="field">
            <label className="field-label" htmlFor="reset-confirm">Nhập lại mật khẩu</label>
            <div className="field-input">
              <span className="icon">lock_reset</span>
              <input
                id="reset-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirm}
                onChange={setField('confirm')}
                autoComplete="new-password"
              />
            </div>
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn--red">Đặt lại mật khẩu</button>

          <p className="auth-switch">
            Quay lại <Link to="/login">Đăng nhập</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
