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
