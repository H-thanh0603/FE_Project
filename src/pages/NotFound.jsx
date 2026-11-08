import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <h1 className="page-title">404</h1>
      <p>Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
