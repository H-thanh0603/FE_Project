# Kế hoạch: So sánh · Liên quan · Autocomplete

Spec: `docs/superpowers/specs/2026-11-18-compare-related-search-design.md`

Mỗi bước là một commit độc lập, chạy được sau mỗi bước.

| # | Commit | File chính |
| --- | --- | --- |
| 1 | `feat(compare): thêm khóa lưu trữ và CompareContext giới hạn 4 sản phẩm` | `utils/constants.js`, `context/CompareContext.jsx` |
| 2 | `feat(compare): bọc CompareProvider và export hook useCompare` | `main.jsx` |
| 3 | `feat(compare): thêm nút so sánh trên ProductCard` | `ProductCard.jsx` |
| 4 | `style(compare): style trạng thái nút so sánh` | `ProductCard.css` |
| 5 | `feat(compare): thêm link So sánh kèm badge trên Navbar` | `Navbar.jsx` |
| 6 | `feat(compare): xây dựng component CompareTable` | `components/compare/CompareTable/` |
| 7 | `feat(compare): thêm trang /compare và empty state` | `pages/Compare.jsx`, `App.jsx` |
| 8 | `style(compare): responsive cho bảng so sánh` | `CompareTable.css`, `responsive.css` |
| 9 | `feat(product): thêm getRelatedProducts chấm điểm brand/category/tag` | `services/productService.js` |
| 10 | `feat(product): hiển thị khối sản phẩm liên quan ở ProductDetail` | `RelatedProducts.jsx`, `ProductDetail.jsx` |
| 11 | `style(product): style khối sản phẩm liên quan` | `RelatedProducts.css` |
| 12 | `feat(search): thêm hook useSearchHistory` | `hooks/useSearchHistory.js`, `constants.js` |
| 13 | `feat(search): xây dựng SearchAutocomplete hiển thị gợi ý` | `components/common/SearchAutocomplete/` |
| 14 | `feat(search): điều hướng bàn phím và ARIA combobox` | `SearchAutocomplete.jsx` |
| 15 | `feat(search): hiển thị và xóa lịch sử tìm kiếm` | `SearchAutocomplete.jsx` |
| 16 | `feat(search): tích hợp autocomplete vào trang Sản phẩm` | `pages/Products.jsx` |
| 17 | `style(search): style dropdown và sửa layout toolbar` | `SearchAutocomplete.css` |
| 18 | `docs(readme): cập nhật bảng tiến độ 3 tính năng` | `README.md` |

Kiểm tra sau mỗi nhóm: `npm run build`.
