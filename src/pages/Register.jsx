import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="container">
      <div className="page page-narrow">
        <div className="auth-card">
          <div className="eyebrow">Thành viên mới</div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>
            Đăng Ký
          </h1>
          <div className="empty-state" style={{ border: 'none', background: 'transparent', padding: 0 }}>
            <span className="icon">construction</span>
            <p>
              🚧 Trang đăng ký đang được phát triển. Hiện tại bạn có thể dùng{' '}
              <Link to="/login">trang Đăng nhập mô phỏng</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
