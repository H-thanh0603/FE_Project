import formatPrice from '../utils/formatPrice';

/**
 * ⚠️ Mã giảm giá chỉ MÔ PHỎNG: danh sách cố định trong mã nguồn, không có
 * hệ thống kiểm tra hay cấp phát thật. Khi có backend cần thay bằng API.
 */
export const COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    label: 'Giảm 10% tổng đơn',
  },
  {
    code: 'KINETIC200',
    type: 'amount',
    value: 200000,
    minSubtotal: 1000000,
    label: 'Giảm 200.000₫ cho đơn từ 1.000.000₫',
  },
  {
    code: 'SUMMER15',
    type: 'percent',
    value: 15,
    minSubtotal: 2000000,
    label: 'Giảm 15% cho đơn từ 2.000.000₫',
  },
];

/** Tìm mã giảm giá theo mã người dùng nhập (không phân biệt hoa thường) */
export function findCoupon(code) {
  const normalized = String(code ?? '').trim().toUpperCase();
  return COUPONS.find((coupon) => coupon.code === normalized) || null;
}

/** Số tiền được giảm; không vượt quá tạm tính để tổng đơn không bị âm */
export function calculateDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const raw =
    coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.min(raw, subtotal);
}

/** Kiểm tra mã có dùng được cho đơn hiện tại hay không */
export function validateCoupon(code, subtotal) {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { ok: false, error: 'Mã giảm giá không tồn tại.' };
  }
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `Mã ${coupon.code} chỉ áp dụng cho đơn từ ${formatPrice(coupon.minSubtotal)}.`,
    };
  }
  return { ok: true, coupon };
}
