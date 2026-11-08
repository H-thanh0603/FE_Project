import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import formatPrice from '../utils/formatPrice';

export default function Orders() {
  const orders = getOrders();

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Lịch sử mua sắm</div>
          <h1 className="section-title">Đơn Hàng Của Bạn</h1>
        </div>

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
                <div className="order-card-foot">
                  <span>{order.items.length} sản phẩm</span>
                  <span className="order-card-total">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
