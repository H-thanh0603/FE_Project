import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import {
  advanceOrderStatus,
  canCancelOrder,
  cancelOrder,
  getNextOrderStatus,
  getOrders,
} from '../services/orderService';
import formatPrice from '../utils/formatPrice';

const STATUS_LABELS = {
  pending: 'Đã tiếp nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? STATUS_LABELS.pending;
}

export default function Orders() {
  const [orders, setOrders] = useState(getOrders);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const { addItem } = useCart();
  const { pushNotification } = useNotifications();

  const handleCancel = (orderId) => {
    const result = cancelOrder(orderId);
    if (!result.ok) {
      setActionMessage(result.error);
      return;
    }
    setOrders(getOrders());
    setConfirmCancelId(null);
    setActionMessage(`Đã hủy đơn ${orderId} (mô phỏng).`);
    pushNotification({
      title: 'Đơn hàng đã hủy',
      message: `Đơn ${orderId} đã được hủy (mô phỏng).`,
      link: `/orders/${encodeURIComponent(orderId)}`,
    });
  };

  const handleAdvanceStatus = (orderId) => {
    const result = advanceOrderStatus(orderId);
    if (!result.ok) {
      setActionMessage(result.error);
      return;
    }
    setOrders(getOrders());
    setActionMessage(`Trạng thái đơn ${orderId} đã được cập nhật (mô phỏng).`);
    pushNotification({
      title: 'Cập nhật đơn hàng',
      message: `Đơn ${orderId} chuyển sang "${getStatusLabel(result.order.status)}".`,
      link: `/orders/${encodeURIComponent(orderId)}`,
    });
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => addItem(item, item.size, item.quantity));
    setActionMessage(`Đã thêm ${order.items.length} dòng sản phẩm từ đơn ${order.id} vào giỏ.`);
  };

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Lịch sử mua sắm</div>
          <h1 className="section-title">Đơn Hàng Của Bạn</h1>
        </div>

        {actionMessage && <p className="profile-success" role="status">{actionMessage}</p>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="icon">receipt_long</span>
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link to="/products" className="btn btn--dark">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order-card">
                <div className="order-card-head">
                  <strong>{order.id}</strong>
                  <span className="order-card-date">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p>Người nhận: {order.customer.name}</p>
                {order.shipping && (
                  <p>
                    Giao hàng: {order.shipping.name}
                    {order.shipping.cost === 0 ? ' — Miễn phí' : ''}
                  </p>
                )}
                {order.payment && (
                  <p>Thanh toán: {order.payment.name} (mô phỏng)</p>
                )}
                <div className="order-card-foot">
                  <span>{order.items.length} sản phẩm</span>
                  <span className="order-card-total">{formatPrice(order.total)}</span>
                </div>
                <p className="order-card-status">
                  Trạng thái: {STATUS_LABELS[order.status ?? 'pending'] ?? 'Đã tiếp nhận'} (mô phỏng)
                </p>
                <Link to={`/orders/${encodeURIComponent(order.id)}`} className="order-detail-link">
                  Xem chi tiết đơn hàng
                  <span className="icon">arrow_forward</span>
                </Link>
                <div className="order-actions">
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => handleReorder(order)}
                  >
                    Mua lại
                  </button>
                  {getNextOrderStatus(order) && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => handleAdvanceStatus(order.id)}
                    >
                      Cập nhật: {getStatusLabel(getNextOrderStatus(order))}
                    </button>
                  )}
                  {canCancelOrder(order) && (
                    confirmCancelId === order.id ? (
                      <span className="order-cancel-confirm">
                        Xác nhận hủy?
                        <button
                          type="button"
                          className="order-action-link order-action-link--danger"
                          onClick={() => handleCancel(order.id)}
                        >
                          Có, hủy đơn
                        </button>
                        <button
                          type="button"
                          className="order-action-link"
                          onClick={() => setConfirmCancelId(null)}
                        >
                          Không
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="order-action-link order-action-link--danger"
                        onClick={() => setConfirmCancelId(order.id)}
                      >
                        Hủy đơn
                      </button>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
