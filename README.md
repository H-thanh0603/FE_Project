# 🛒 ShoeStore — Website Thương Mại Điện Tử Bán Giày

Website thương mại điện tử bán giày xây dựng bằng **React + Vite**, tập trung vào **Frontend**. Hiện tại dự án ở giai đoạn khởi tạo: cấu trúc thư mục, dữ liệu mô phỏng và khung ứng dụng đã sẵn sàng để phát triển từng tính năng.

> **Về mô phỏng backend:** Dữ liệu sản phẩm được mô phỏng bằng **JSON**; giỏ hàng, danh sách yêu thích và lịch sử đơn hàng được lưu bằng **LocalStorage**. Chức năng đặt hàng và đăng nhập chỉ mang tính chất mô phỏng — **không** có hệ thống thanh toán hay xác thực thực tế, và **không** lưu mật khẩu trong LocalStorage.

---

## 📑 Mục lục

- [Tiến độ tính năng](#-tiến-độ-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Quy ước lập trình](#-quy-ước-lập-trình)
- [Đóng góp](#-đóng-góp)

---

## 📊 Tiến độ tính năng

Trạng thái: ✅ Đã hoàn thành · 🚧 Đang phát triển · 📋 Dự kiến triển khai

| Tính năng | Trạng thái | Ghi chú |
| --- | :---: | --- |
| Khởi tạo cấu trúc dự án (Vite + React) | ✅ | Cấu hình chạy được với `npm run dev` |
| Giao diện trang chủ theo thiết kế Kinetic | ✅ | Hero, danh mục lọc sản phẩm, flash drop + countdown, tabs sản phẩm, công nghệ, cam kết, cộng đồng, newsletter |
| Dữ liệu sản phẩm & thương hiệu JSON | ✅ | `src/data/`, 24 sản phẩm thuộc 5 thương hiệu; danh mục và nhãn được chuẩn hóa |
| Giỏ hàng (thêm / sửa / xóa, lưu LocalStorage) | ✅ | `CartContext` |
| Danh sách yêu thích | ✅ | `WishlistContext`, tích hợp nút tim trên thẻ sản phẩm |
| Tìm kiếm, lọc theo thương hiệu, danh mục, giá, size, màu và khuyến mãi | ✅ | Trang Sản phẩm |
| Sắp xếp và phân trang sản phẩm | ✅ | Tính trên kết quả sau khi lọc |
| Chi tiết sản phẩm (chọn size) | ✅ | |
| Thanh toán & lịch sử đơn hàng (mô phỏng) | ✅ | Lưu LocalStorage, không có thanh toán thật |
| Đăng nhập / Đăng ký (mô phỏng) | ✅ | Khung AuthLayout hai cột, validate đầy đủ; mật khẩu không được lưu trữ |
| Hồ sơ người dùng (mô phỏng) | ✅ | Xem, sửa tên, email, số điện thoại; lưu LocalStorage |
| Sổ địa chỉ giao hàng (mô phỏng) | ✅ | Thêm, sửa, xóa, chọn mặc định; chọn nhanh khi checkout |
| Quên mật khẩu (mô phỏng) | ✅ | Hiển thị thông báo gửi email giả lập |
| Đánh giá sản phẩm | 📋 | |
| Áp dụng mã giảm giá | 📋 | |
| Kết nối API backend thật + xác thực (JWT) | 📋 | Thay nội dung các hàm trong `services/` |

---

## 🧰 Công nghệ sử dụng

| Công nghệ | Vai trò |
| --- | --- |
| [React](https://react.dev/) | Thư viện xây dựng giao diện (phiên bản theo `package.json`) |
| [Vite](https://vite.dev/) | Công cụ build và dev server |
| [React Router](https://reactrouter.com/) | Điều hướng giữa các trang |
| [Context API](https://react.dev/learn/scaling-up-with-reducer-and-context) | Quản lý trạng thái dùng chung (giỏ hàng, yêu thích, tài khoản) |
| CSS thuần + CSS Variables | Biến giao diện, theme, responsive |
| Google Fonts | Space Grotesk (tiêu đề), Hanken Grotesk (nội dung), Material Symbols (icon) |
| JSON + LocalStorage | Mô phỏng dữ liệu và lưu trữ phía người dùng |

> **Axios** chưa cần thiết ở giai đoạn này — chỉ bổ sung khi dự án kết nối backend thật (xem mục [Tiến độ tính năng](#-tiến-độ-tính-năng)).

---

## 📂 Cấu trúc thư mục

```text
FE_Project/
├── public/                  # Tài nguyên tĩnh (tham chiếu bằng đường dẫn /...)
│   ├── images/
│   │   ├── shoes/           #   Ảnh giày
│   │   ├── banners/         #   Ảnh banner trang chủ
│   │   └── brands/          #   Logo thương hiệu
│   └── favicon.ico
│
├── src/
│   ├── components/          # Component tái sử dụng, chia theo nhóm
│   │   ├── common/          #   Button, Modal, Pagination, Loading
│   │   ├── layout/          #   Navbar, Footer, MainLayout.jsx
│   │   ├── home/            #   8 section trang chủ (hero, flash drop, tabs...)
│   │   ├── product/         #   ProductCard, ProductFilter, ProductSort, ProductGallery
│   │   └── cart/            #   CartItem, CartSummary
│   │
│   ├── pages/               # Các trang chính của website
│   │   ├── Home.jsx             # Trang chủ
│   │   ├── Products.jsx         # Danh sách sản phẩm (tìm kiếm, lọc)
│   │   ├── ProductDetail.jsx    # Chi tiết sản phẩm, chọn size
│   │   ├── Cart.jsx             # Giỏ hàng
│   │   ├── Checkout.jsx         # Thanh toán (mô phỏng)
│   │   ├── Wishlist.jsx         # Sản phẩm yêu thích
│   │   ├── Login.jsx            # Đăng nhập giả lập
│   │   ├── Register.jsx         # Đăng ký (đang phát triển)
│   │   ├── Orders.jsx           # Lịch sử đơn hàng
│   │   └── NotFound.jsx         # Trang 404
│   │
│   ├── context/             # Trạng thái dùng chung
│   │   ├── CartContext.jsx      # Giỏ hàng + custom hook useCart()
│   │   ├── WishlistContext.jsx  # Yêu thích + useWishlist()
│   │   └── AuthContext.jsx      # Tài khoản giả lập + useAuth()
│   │
│   ├── hooks/               # React Hook tự viết
│   │   ├── useLocalStorage.js   # Đồng bộ state với LocalStorage
│   │   ├── useDebounce.js       # Debounce cho ô tìm kiếm
│   │   └── useCountdown.js      # Đếm ngược cho khối Flash Drop
│   │
│   ├── services/            # Truy xuất và xử lý dữ liệu
│   │   ├── productService.js    # Sản phẩm, thương hiệu (hiện đọc JSON)
│   │   ├── cartService.js       # Tính tổng tiền, số lượng
│   │   └── orderService.js      # Lưu / đọc đơn hàng (LocalStorage)
│   │
│   ├── data/                # Dữ liệu JSON mô phỏng
│   │   ├── products.json        # Danh sách giày
│   │   ├── brands.json          # Thương hiệu
│   │   └── homepage.json        # Nội dung các section trang chủ
│   │
│   ├── utils/               # Hàm tiện ích dùng chung
│   │   ├── formatPrice.js       # Định dạng tiền VND
│   │   ├── validators.js        # Kiểm tra email, số điện thoại...
│   │   └── constants.js         # Hằng số (khóa LocalStorage, đơn vị tiền)
│   │
│   ├── styles/              # CSS toàn cục, biến giao diện, responsive
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── responsive.css
│   │
│   ├── App.jsx              # Định nghĩa routes
│   └── main.jsx             # Điểm khởi động, bọc các Provider
│
├── index.html               # HTML gốc (Vite)
├── package.json
├── vite.config.js           # Cấu hình Vite
├── .gitignore
└── README.md
```

**Lưu ý:**

- Component dạng thư mục (ví dụ `ProductCard/`) chứa `ProductCard.jsx` và `ProductCard.css` riêng.
- Các thư mục `common/`, `product/`, `cart/` hiện chỉ tạo sẵn khung — **chưa cần tạo tất cả component ngay từ đầu**, thêm dần theo nhu cầu.
- `package-lock.json` sẽ xuất hiện sau lần chạy `npm install` đầu tiên.

---

## 🚀 Cài đặt và chạy dự án

### Yêu cầu

- **Node.js**: dùng phiên bản **LTS** đáp ứng yêu cầu của [Vite](https://vite.dev/guide/) (kiểm tra bằng `node -v`).

### Các bước

```bash
# 1. Clone dự án
git clone https://github.com/H-Thanh0603/FE_Project.git
cd FE_Project

# 2. Cài đặt dependencies
npm install

# 3. Chạy môi trường phát triển
npm run dev
```

Sau đó mở địa chỉ mà Vite hiển thị trên terminal — thông thường là **http://localhost:5173**.

### Lệnh khác

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Dev server với hot-reload |
| `npm run build` | Build bản production vào `dist/` |
| `npm run preview` | Xem trước bản build production |

---

## 📐 Quy ước lập trình

- **Component**: đặt tên `PascalCase`; component lớn đặt trong thư mục riêng kèm file CSS cùng tên.
- **Hook / hàm tiện ích**: `camelCase`; tên hook luôn bắt đầu bằng `use`.
- **Context**: tách `Provider` và custom hook (ví dụ `useCart()`) để component chỉ dùng hook, không import context trực tiếp.
- **Dữ liệu**: component chỉ truy cập dữ liệu qua `services/`, không import trực tiếp JSON — giúp sau này thay bằng API thật mà không sửa UI.
- **Catalog**: mỗi sản phẩm có một `category` chính (`running`, `streetwear`, `basketball`, `limited`) và mảng `tags` riêng cho nhãn như `new`, `bestseller`, `sale`; ảnh chưa có dùng chuỗi rỗng và hiển thị placeholder.
- **LocalStorage**: chỉ dùng khóa khai báo trong `utils/constants.js`.
- **Style**: dùng CSS Variables trong `styles/variables.css`, tránh hardcode màu và khoảng cách.
- **Tài nguyên tĩnh**: ảnh giày đặt trong `public/images/shoes/`, tham chiếu bằng `/images/shoes/ten-anh.jpg`.

---

## 🤝 Đóng góp

1. Tạo branch mới từ `main`: `git checkout -b feature/ten-tinh-nang`
2. Commit với thông điệp rõ ràng: `git commit -m "feat: thêm lọc sản phẩm theo khoảng giá"`
3. Push và tạo Pull Request để review trước khi merge.
