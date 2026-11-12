import { STORAGE_KEYS } from '../utils/constants';

/** Dữ liệu đánh giá mẫu khởi tạo ban đầu cho các sản phẩm */
const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    productId: 'kinetic-phantom-velocity',
    author: 'Trần Minh Quân',
    rating: 5,
    date: '10/11/2026',
    comment: 'Giày ôm chân rất êm, đệm đàn hồi tốt khi chạy đường dài trên 10km. Rất đáng tiền!',
  },
  {
    id: 'rev-02',
    productId: 'kinetic-phantom-velocity',
    author: 'Nguyễn Hải Đăng',
    rating: 5,
    date: '05/11/2026',
    comment: 'Thiết kế đẹp, form chuẩn châu Á. Mình mang size 42 vừa khít, không bị cọ gót.',
  },
  {
    id: 'rev-03',
    productId: 'air-flow-glide-90',
    author: 'Lê Hoàng Nam',
    rating: 5,
    date: '08/11/2026',
    comment: 'Đế êm dạo phố cả ngày không mỏi chân. Phối đồ streetwear cực đỉnh.',
  },
  {
    id: 'rev-04',
    productId: 'air-flow-glide-90',
    author: 'Phạm Thuỳ Dung',
    rating: 4,
    date: '02/11/2026',
    comment: 'Màu sắc y hình, giao hàng bọc cẩn thận. Trừ 1 sao vì hộp giày hơi móp xíu.',
  },
  {
    id: 'rev-05',
    productId: 'vortex-horizon-low',
    author: 'Võ Quốc Huy',
    rating: 5,
    date: '06/11/2026',
    comment: 'Bám đường ướt cực tốt, chạy trời mưa không lo trơn trượt.',
  },
];

function getStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (err) {
    console.error('Lỗi lưu đánh giá:', err);
  }
}

/** Lấy danh sách đánh giá của một sản phẩm */
export function getProductReviews(productId) {
  const custom = getStoredReviews().filter((r) => r.productId === productId);
  const initial = INITIAL_REVIEWS.filter((r) => r.productId === productId);
  return [...custom, ...initial];
}

/** Thêm đánh giá mới từ người dùng */
export function addProductReview({ productId, author, rating, comment }) {
  const current = getStoredReviews();
  const newReview = {
    id: `rev-custom-${Date.now()}`,
    productId,
    author: author.trim() || 'Khách hàng',
    rating: Number(rating) || 5,
    date: new Date().toLocaleDateString('vi-VN'),
    comment: comment.trim(),
  };

  const updated = [newReview, ...current];
  saveStoredReviews(updated);
  return newReview;
}
