import { STORAGE_KEYS } from '../utils/constants';

/**
 * Lưu và đọc lịch sử đơn hàng trong LocalStorage (mô phỏng backend).
 * ⚠️ Đặt hàng chỉ mang tính mô phỏng — không có thanh toán hay lưu trữ thật.
 */

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const newOrder = {
    ...order,
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const orders = [newOrder, ...getOrders()];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return newOrder;
}
