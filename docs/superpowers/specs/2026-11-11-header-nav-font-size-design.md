# Header Navigation Font Size Design

## Intent
Tăng nhẹ khả năng đọc của liên kết điều hướng header (Trang chủ, Sản phẩm, Yêu thích, Đơn hàng), Giỏ hàng và Đăng nhập.

## Goals / Non-goals
- Tăng cỡ chữ từ `0.78rem` lên `0.9rem` cho menu và Giỏ hàng.
- Tăng chữ nút Đăng nhập lên `0.9rem`.
- Giữ nguyên bố cục, màu sắc, icon, nội dung và các thành phần khác.

## Approaches
- Chỉnh CSS hiện có: thay giá trị font-size trên `.nav-link`, `.cart-link` và đặt font-size trên `.nav-actions .btn--light`. Ít thay đổi, không thêm cấu trúc.
- Thêm token/kiểu dùng chung: không cần vì chỉ có một thay đổi nhỏ, sẽ tăng phạm vi.

## Decision
Dùng CSS hiện có trong `src/styles/global.css`; áp dụng đồng đều ở kích thước màn hình hiện tại, không thay responsive breakpoint.
