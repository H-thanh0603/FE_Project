import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { isEmail, isPhone, isNotEmpty, isPassword, isMatch } from '../utils/validators';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  agree: false,
};

/**
 * ⚠️ Đăng ký MÔ PHỎNG: mật khẩu chỉ được kiểm tra hợp lệ phía client và
 * KHÔNG được lưu trữ. AuthContext chỉ lưu thông tin hồ sơ vào LocalStorage.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({
      ...prev,
      [field]: field === 'agree' ? event.target.checked : event.target.value,
    }));

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) {
      next.name = 'Vui lòng nhập họ tên.';
    }
    if (!isEmail(form.email)) {
      next.email = 'Email chưa đúng định dạng.';
    }
    if (!isPhone(form.phone)) {
      next.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.';
    }
    if (!isPassword(form.password)) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự.';
    }
    if (!isMatch(form.password, form.confirm)) {
      next.confirm = 'Mật khẩu nhập lại không khớp.';
    }
    if (!form.agree) {
      next.agree = 'Bạn cần đồng ý với điều khoản trước khi đăng ký.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    // Giả lập thời gian gọi API tạo tài khoản
    setSubmitting(true);
    setTimeout(() => {
      const result = register({ name: form.name, email: form.email, phone: form.phone });
      setSubmitting(false);
      if (!result.ok) {
        setErrors({ email: result.error });
        return;
      }
      navigate('/');
    }, 800);
  };

  return (
    <AuthLayout
      eyebrow="Thành viên mới"
      title="Đăng Ký"
      subtitle="Tạo tài khoản để lưu giỏ hàng, theo dõi đơn hàng và nhận ưu đãi thành viên."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="reg-name">Họ và tên</label>
          <div className="field-input">
            <span className="icon">person</span>
            <input
              id="reg-name"
              placeholder="Nguyễn Minh Anh"
              value={form.name}
              onChange={setField('name')}
              autoComplete="name"
            />
          </div>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="reg-email">Email</label>
          <div className="field-input">
            <span className="icon">mail</span>
            <input
              id="reg-email"
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
          <label className="field-label" htmlFor="reg-phone">Số điện thoại</label>
          <div className="field-input">
            <span className="icon">call</span>
            <input
              id="reg-phone"
              type="tel"
              placeholder="0968656866"
              value={form.phone}
              onChange={setField('phone')}
              autoComplete="tel"
            />
          </div>
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="reg-password">Mật khẩu</label>
          <div className="field-input">
            <span className="icon">lock</span>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 6 ký tự"
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
          <label className="field-label" htmlFor="reg-confirm">Nhập lại mật khẩu</label>
          <div className="field-input">
            <span className="icon">lock_reset</span>
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.confirm}
              onChange={setField('confirm')}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="field-eye"
              aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              <span className="icon">{showConfirm ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.confirm && <span className="field-error">{errors.confirm}</span>}
        </div>

        <div className="field">
          <label className="checkbox">
            <input type="checkbox" checked={form.agree} onChange={setField('agree')} />
            Tôi đồng ý với điều khoản sử dụng của KINETIC (dự án mô phỏng)
          </label>
          {errors.agree && <span className="field-error">{errors.agree}</span>}
        </div>

        <button type="submit" className="btn btn--red" disabled={submitting}>
          {submitting ? (
            <>
              <span className="icon spinning">progress_activity</span>
              Đang tạo tài khoản...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>

      <p className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
