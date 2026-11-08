/** Các hàm tính toán dùng chung cho giỏ hàng, tách khỏi UI để tái sử dụng. */

export function calculateItemCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
