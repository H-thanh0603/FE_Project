import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="page" style={{ alignItems: 'center', textAlign: 'center', paddingTop: '4rem' }}>
        <div className="notfound-code">404</div>
        <h1 className="section-title">Trang Không Tồn Tại</h1>
        <p className="section-desc" style={{ maxWidth: 'none' }}>
          Đường dẫn bạn tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/" className="btn btn--dark">
          <span className="icon">arrow_back</span>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
