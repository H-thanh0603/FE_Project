import { STORAGE_KEYS } from '../utils/constants';

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const NEXT_ORDER_STATUS = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.SHIPPING,
  [ORDER_STATUS.SHIPPING]: ORDER_STATUS.DELIVERED,
};

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

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) || null;
}

function replaceOrder(orderId, update) {
  const orders = getOrders();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index < 0) return { ok: false, error: 'Không tìm thấy đơn hàng.' };

  const updatedOrder = update(orders[index]);
  if (!updatedOrder) return { ok: false, error: 'Trạng thái hiện tại không cho phép thao tác này.' };

  orders[index] = updatedOrder;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return { ok: true, order: updatedOrder };
}

export function canCancelOrder(order) {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(
    order.status ?? ORDER_STATUS.PENDING,
  );
}

export function getNextOrderStatus(order) {
  return NEXT_ORDER_STATUS[order.status ?? ORDER_STATUS.PENDING] ?? null;
}

export function cancelOrder(orderId) {
  return replaceOrder(orderId, (order) => {
    if (!canCancelOrder(order)) return null;
    return {
      ...order,
      status: ORDER_STATUS.CANCELLED,
      cancelledAt: new Date().toISOString(),
    };
  });
}

export function advanceOrderStatus(orderId) {
  return replaceOrder(orderId, (order) => {
    const nextStatus = getNextOrderStatus(order);
    if (!nextStatus) return null;
    return {
      ...order,
      status: nextStatus,
      statusUpdatedAt: new Date().toISOString(),
    };
  });
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
