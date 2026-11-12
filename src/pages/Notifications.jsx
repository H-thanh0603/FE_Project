import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

/** Danh sách thông báo mô phỏng — sinh khi đặt, hủy hoặc đổi trạng thái đơn hàng. */
export default function Notifications() {
  const { notifications, unreadCount, markAllRead, clearNotifications } = useNotifications();

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Cập nhật mới nhất</div>
          <h1 className="section-title">Thông Báo</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <span className="icon">notifications</span>
            <p>Bạn chưa có thông báo nào.</p>
            <Link to="/products" className="btn btn--dark">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="noti-actions">
              <span className="noti-summary">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Đã đọc hết'}
              </span>
              <button
                type="button"
                className="btn btn--outline"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                Đánh dấu đã đọc
              </button>
              <button type="button" className="btn btn--dark" onClick={clearNotifications}>
                Xóa tất cả
              </button>
            </div>

            <ul className="noti-list">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className={`noti-item${item.read ? '' : ' noti-item--unread'}`}
                >
                  <span className="noti-icon icon">notifications</span>
                  <div className="noti-body">
                    <p className="noti-title">{item.title}</p>
                    <p className="noti-message">{item.message}</p>
                    <span className="noti-time">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  {item.link && (
                    <Link to={item.link} className="order-detail-link">
                      Xem
                      <span className="icon">arrow_forward</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}