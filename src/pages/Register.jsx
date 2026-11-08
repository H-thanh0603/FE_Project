import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';

export default function Register() {
  return (
    <AuthLayout
      eyebrow="Thành viên mới"
      title="Đăng Ký"
      subtitle="Tạo tài khoản để lưu giỏ hàng, đơn hàng và danh sách yêu thích."
    >
      <div className="empty-state" style={{ border: 'none', background: 'transparent', padding: 0 }}>
        <span className="icon">construction</span>
        <p>
          🚧 Biểu mẫu đăng ký đang được phát triển. Hiện tại bạn có thể dùng{' '}
          <Link to="/login">trang Đăng nhập mô phỏng</Link>.
        </p>
      </div>

      <p className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
