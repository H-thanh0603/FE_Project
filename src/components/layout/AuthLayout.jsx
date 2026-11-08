import { Link } from 'react-router-dom';
import './AuthLayout.css';

const PERKS = [
  'Miễn phí vận chuyển cho đơn từ 1.500.000₫',
  'Đổi size miễn phí trong 30 ngày',
  'Cam kết 100% chính hãng — hoàn tiền 200% nếu giả',
];

/**
 * Khung trang xác thực dùng chung: panel thương hiệu bên trái,
 * panel biểu mẫu bên phải. Dùng cho Đăng nhập / Đăng ký / Quên mật khẩu.
 */
export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand">
        <Link to="/" className="auth-brand-logo" aria-label="Về trang chủ KINETIC">
          <img src="/images/logo.svg" alt="KINETIC" />
        </Link>

        <div className="auth-brand-body">
          <h2 className="auth-brand-title">
            ĐỊNH HÌNH TỪNG BƯỚC CHẠY.
            <br />
            CHINH PHỤC MỌI GIỚI HẠN.
          </h2>
          <p className="auth-brand-desc">
            Tham gia cộng đồng KINETIC để nhận voucher 200.000₫ và quyền truy cập sớm
            các đợt drop giới hạn.
          </p>

          <ul className="auth-brand-perks">
            {PERKS.map((perk) => (
              <li key={perk}>
                <span className="icon">check_circle</span>
                {perk}
              </li>
            ))}
          </ul>

          <img
            className="auth-brand-shoe"
            src="/images/shoes/hero-nitro-runner.jpg"
            alt="Kinetic Nitro X Pro Runner"
            loading="lazy"
          />
        </div>

        <div className="auth-brand-foot">#KINETICSTREET</div>
      </aside>

      <main className="auth-panel">
        <div className="auth-box">
          <div className="auth-box-head">
            <div className="eyebrow">{eyebrow}</div>
            <h1 className="section-title" style={{ fontSize: '1.7rem' }}>
              {title}
            </h1>
            {subtitle && <p className="auth-box-subtitle">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
