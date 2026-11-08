import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import formatPrice from '../utils/formatPrice';

export default function Orders() {
  const orders = getOrders();

  return (
    <div className="page">
      <h1 className="page-title">Đơn hàng của bạn</h1>

      {orders.length === 0 ? (
        <>
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/products" className="btn btn-primary">
            Mua sắm ngay
          </Link>
        </>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <p>
                <strong>{order.id}</strong> — {new Date(order.createdAt).toLocaleString('vi-VN')}
              </p>
              <p>Người nhận: {order.customer.name}</p>
              <p>
                {order.items.length} sản phẩm — Tổng:{' '}
                <strong>{formatPrice(order.total)}</strong>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
