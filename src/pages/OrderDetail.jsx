import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  advanceOrderStatus,
  canCancelOrder,
  cancelOrder,
  getNextOrderStatus,
  getOrderById,
} from '../services/orderService';
import formatPrice from '../utils/formatPrice';

const ORDER_STATUSES = {
  pending: { label: 'Đã tiếp nhận', icon: 'receipt_long' },
  confirmed: { label: 'Đã xác nhận', icon: 'fact_check' },
  shipping: { label: 'Đang giao hàng', icon: 'local_shipping' },
  delivered: { label: 'Đã giao hàng', icon: 'check_circle' },
  cancelled: { label: 'Đã hủy', icon: 'cancel' },
};

const ORDER_STATUS_LABELS = {
  pending: 'Đã tiếp nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

function getOrderStatus(order) {
  const status = ORDER_STATUSES[order.status];
  if (status) return status;
  return { label: 'Đã tiếp nhận', icon: 'receipt_long' };
}

function getSubtotal(order) {
  return order.subtotal ?? order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(() => getOrderById(id));
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    setOrder(getOrderById(id));
    setConfirmCancel(false);
    setActionMessage('');
  }, [id]);

  const handleCancel = () => {
    const result = cancelOrder(id);
    if (!result.ok) {
      setActionMessage(result.error);
      return;
    }
    setOrder(result.order);
    setConfirmCancel(false);
    setActionMessage('Đơn hàng đã được hủy (mô phỏng).');
  };

  const handleAdvanceStatus = () => {
    const result = advanceOrderStatus(id);
    if (!result.ok) {
      setActionMessage(result.error);
      return;
    }
    setOrder(result.order);
    setActionMessage('Trạng thái đơn hàng đã được cập nhật (mô phỏng).');
  };

  const handleReorder = () => {
    order.items.forEach((item) => addItem(item, item.size, item.quantity));
    setActionMessage('Đã thêm sản phẩm từ đơn hàng vào giỏ.');
  };

  if (!order) {
    return (
      <div className="container">
        <div className="page">
          <div className="eyebrow">Lịch sử mua sắm</div>
          <h1 className="section-title">Không Tìm Thấy Đơn Hàng</h1>
          <div className="empty-state">
            <span className="icon">receipt_long</span>
            <p>Đơn hàng không tồn tại hoặc không còn trong dữ liệu trình duyệt này.</p>
            <Link to="/orders" className="btn btn--dark">Về danh sách đơn hàng</Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getOrderStatus(order);
  const subtotal = getSubtotal(order);
  const shippingCost = order.shipping?.cost ?? Math.max(order.total - subtotal, 0);

  return (
    <div className="container">
      <div className="page order-detail-page">
        <nav className="breadcrumb" aria-label="Đường dẫn">
          <Link to="/">Trang chủ</Link>
          <span className="icon">chevron_right</span>
          <Link to="/orders">Đơn hàng</Link>
          <span className="icon">chevron_right</span>
          <span>{order.id}</span>
        </nav>

        <header className="order-detail-header">
          <div>
            <div className="eyebrow">Chi tiết đơn hàng</div>
            <h1 className="section-title">{order.id}</h1>
            <p className="page-note">
              Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="order-status-badge">
            <span className="icon">{status.icon}</span>
            {status.label}
            <span className="order-status-demo">Mô phỏng</span>
          </div>
        </header>

        <div className="order-detail-grid">
          <section className="order-detail-panel">
            <h2 className="order-detail-panel-title">Sản Phẩm Đã Đặt</h2>
            <ul className="order-detail-items">
              {order.items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="order-detail-item">
                  <div className="order-detail-item-info">
                    <strong>{item.name}</strong>
                    <span>Size {item.size} · Số lượng {item.quantity}</span>
                  </div>
                  <div className="order-detail-item-price">
                    <span>{formatPrice(item.price)} / đôi</span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </li>
              ))}
            </ul>

            <div className="order-detail-totals">
              <p><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></p>
              {order.discount?.amount > 0 && (
                <p className="order-detail-discount">
                  <span>Giảm giá{order.discount.code ? ` (${order.discount.code})` : ''}</span>
                  <strong>-{formatPrice(order.discount.amount)}</strong>
                </p>
              )}
              <p>
                <span>Giao hàng{order.shipping?.name ? ` — ${order.shipping.name}` : ''}</span>
                <strong>{shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost)}</strong>
              </p>
              {order.payment && (
                <p><span>Thanh toán</span><strong>{order.payment.name}</strong></p>
              )}
              <p className="order-detail-grand-total">
                <span>Tổng cộng</span><strong>{formatPrice(order.total)}</strong>
              </p>
            </div>
          </section>

          <div className="order-detail-aside">
            <section className="order-detail-panel">
              <h2 className="order-detail-panel-title">Thông Tin Giao Hàng</h2>
              <div className="order-detail-info">
                <strong>{order.customer.name}</strong>
                <span>{order.customer.phone}</span>
                <span>{order.customer.email}</span>
                <span>{order.customer.address}</span>
              </div>
            </section>

            <section className="order-detail-panel">
              <h2 className="order-detail-panel-title">Trạng Thái Đơn</h2>
              <p className="page-note">
                {status.label}. Trạng thái chỉ để minh họa giao diện, không phản ánh vận chuyển thực tế.
              </p>
            </section>
          </div>
        </div>

        {actionMessage && <p className="profile-success" role="status">{actionMessage}</p>}
        <div className="order-actions order-detail-actions">
          <button type="button" className="btn btn--outline" onClick={handleReorder}>
            Mua lại
          </button>
          {getNextOrderStatus(order) && (
            <button type="button" className="btn btn--outline" onClick={handleAdvanceStatus}>
              Cập nhật: {ORDER_STATUS_LABELS[getNextOrderStatus(order)]}
            </button>
          )}
          {canCancelOrder(order) && (
            confirmCancel ? (
              <span className="order-cancel-confirm">
                Xác nhận hủy đơn này?
                <button
                  type="button"
                  className="order-action-link order-action-link--danger"
                  onClick={handleCancel}
                >
                  Có, hủy đơn
                </button>
                <button
                  type="button"
                  className="order-action-link"
                  onClick={() => setConfirmCancel(false)}
                >
                  Không
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="order-action-link order-action-link--danger"
                onClick={() => setConfirmCancel(true)}
              >
                Hủy đơn
              </button>
            )
          )}
        </div>

        <Link to="/orders" className="btn btn--outline order-detail-back">
          <span className="icon">arrow_back</span>
          Quay lại đơn hàng
        </Link>
      </div>
    </div>
  );
}
