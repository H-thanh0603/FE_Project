/** Kiểm tra email hợp lệ (đơn giản, đủ dùng cho form mô phỏng) */
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Số điện thoại Việt Nam: 10 chữ số, bắt đầu bằng 0 */
export function isPhone(value) {
  return /^0\d{9}$/.test(value);
}

/** Chuỗi không rỗng sau khi cắt khoảng trắng */
export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
