# Thiết kế: So sánh sản phẩm, Sản phẩm liên quan, Autocomplete tìm kiếm

Ngày: 2026-11-18

## Mục tiêu

Bổ sung 3 tính năng frontend cho ShoeStore, giữ nguyên kiến trúc hiện có
(React 18 + Vite, Context API, dữ liệu JSON, LocalStorage, CSS thuần).

## 1. So sánh sản phẩm

- `CompareContext` theo đúng khuôn `WishlistContext`: lưu mảng `productIds`
  vào `STORAGE_KEYS.COMPARE`, tối đa `MAX_COMPARE = 4` sản phẩm.
- API: `productIds`, `toggleCompare(id)`, `removeCompare(id)`, `clearCompare()`,
  `isComparing(id)`, `isFull`.
- Nút so sánh (icon `compare_arrows`) trên `ProductCard`, cạnh nút yêu thích;
  disable khi đã đủ 4 và sản phẩm chưa được chọn.
- Navbar thêm link "So sánh" + badge số lượng.
- Trang `/compare` trong `MainLayout`: bảng so sánh theo cột (ảnh, giá, thương
  hiệu, danh mục, đánh giá, kích cỡ, màu, nhãn, mô tả), mỗi cột có nút xóa và
  thêm nhanh vào giỏ với size đầu tiên. Empty state khi chưa chọn gì.

Không làm thanh so sánh nổi — badge trên Navbar là đủ.

## 2. Sản phẩm liên quan

- `getRelatedProducts(productId, limit = 4)` trong `services/productService.js`:
  chấm điểm cùng thương hiệu +3, cùng danh mục +2, mỗi tag chung +1; loại chính
  nó; sắp xếp giảm dần, hòa điểm thì theo `rating`.
- `RelatedProducts` dùng lại `ProductCard`, đặt trong `ProductDetail` sau
  `ProductReviews`, trước khối đã xem gần đây.

## 3. Autocomplete tìm kiếm + lịch sử

- `useSearchHistory`: lưu tối đa 5 từ khóa gần nhất vào
  `STORAGE_KEYS.SEARCH_HISTORY`, không trùng lặp (so sánh không phân biệt hoa
  thường), có `clearHistory()`.
- `SearchAutocomplete` thay ô tìm kiếm trong toolbar trang Sản phẩm:
  - gợi ý tối đa 6 sản phẩm khớp tên hoặc thương hiệu, kèm giá;
  - chọn sản phẩm → điều hướng `/products/:id`;
  - khi ô trống và được focus → hiện lịch sử, có nút xóa;
  - bàn phím: `↑` `↓` di chuyển, `Enter` chọn, `Esc` đóng;
  - ARIA: `role="combobox"`, `aria-expanded`, `aria-controls`,
    `aria-activedescendant`, listbox + option.
- Chỉ gắn ở trang Sản phẩm, không thêm ô tìm kiếm vào Navbar.

## Ràng buộc

- Không thêm dependency.
- Component chỉ đọc dữ liệu qua `services/`.
- Màu/khoảng cách dùng CSS Variables, phải chạy đúng ở dark mode.
- LocalStorage chỉ dùng khóa khai báo trong `utils/constants.js`.

## Ngoài phạm vi

- Không làm filter/sort phía backend, không đổi cấu trúc `products.json`.
- Không thêm test framework (dự án hiện chưa có).
