import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ⚠️ Đăng nhập MÔ PHỎNG: không kiểm tra mật khẩu, chỉ lưu tên hiển thị
 * vào LocalStorage. Khi có backend cần thay bằng API xác thực thật.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    login(name.trim());
    navigate('/');
  };

  return (
    <div className="container">
      <div className="page page-narrow">
        <div className="auth-card">
          <div className="eyebrow">Chào mừng trở lại</div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>
            Đăng Nhập
          </h1>
          <p className="page-note">
            Dự án chưa có backend — nhập tên bất kỳ để mô phỏng đăng nhập.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Tên hiển thị
              <input
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ví dụ: Minh Anh"
              />
            </label>
            <button type="submit" className="btn btn--dark">
              Đăng nhập
            </button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
