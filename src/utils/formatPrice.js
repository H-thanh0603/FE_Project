import { CURRENCY } from './constants';

/** Định dạng số thành chuỗi tiền tệ, ví dụ 2790000 -> "2.790.000 ₫" */
export default function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: CURRENCY,
  }).format(price);
}
