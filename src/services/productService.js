import products from '../data/products.json';
import brands from '../data/brands.json';

/**
 * Hiện tại dữ liệu đọc từ JSON mô phỏng trong `data/`.
 * Khi có backend thật, chỉ cần thay thân các hàm này bằng lời gọi API
 * (ví dụ dùng Axios) — các component không cần thay đổi.
 */

export function getProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((product) => product.id === id) || null;
}

export function getBrands() {
  return brands;
}

export function getBrandName(brandId) {
  return brands.find((brand) => brand.id === brandId)?.name || 'Khác';
}

/**
 * Gợi ý sản phẩm liên quan: cùng thương hiệu +3, cùng danh mục +2,
 * mỗi tag chung +1; hòa điểm thì ưu tiên đánh giá cao hơn.
 */
export function getRelatedProducts(productId, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];

  const scoreOf = (candidate) => {
    let points = 0;
    if (candidate.brandId === product.brandId) points += 3;
    if (candidate.category === product.category) points += 2;
    points += candidate.tags.filter((tag) => product.tags.includes(tag)).length;
    return points;
  };

  return products
    .filter((candidate) => candidate.id !== productId)
    .map((candidate) => ({ candidate, points: scoreOf(candidate) }))
    .filter(({ points }) => points > 0)
    .sort(
      (a, b) =>
        b.points - a.points || (b.candidate.rating ?? 0) - (a.candidate.rating ?? 0),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
