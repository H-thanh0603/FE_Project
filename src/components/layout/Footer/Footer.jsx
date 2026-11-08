export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/images/logo.svg" alt="KINETIC" />
            </div>
            <p className="footer-description">
              Thương hiệu sneaker và thời trang thể thao streetwear hiệu năng cao. Sáng tạo không
              ranh giới, đồng hành cùng tinh thần bứt phá của thế hệ tiên phong.
            </p>
            <div className="footer-socials">
              <span className="icon" title="Website">public</span>
              <span className="icon" title="YouTube">play_circle</span>
              <span className="icon" title="Chat">chat</span>
              <span className="icon" title="Instagram">photo_camera</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Danh Mục Sản Phẩm</h4>
            <ul className="footer-links">
              <li><a href="#products-grid">Giày Chạy Bộ Performance</a></li>
              <li><a href="#products-grid">Sneakers Bản Giới Hạn</a></li>
              <li><a href="#products-grid">Giày Bóng Rổ Sân Đấu</a></li>
              <li><a href="#products-grid">Phụ Kiện & Vớ Kỹ Thuật</a></li>
              <li><a href="#products-grid">Bộ Sưu Tập Deadstock</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Hỗ Trợ Khách Hàng</h4>
            <ul className="footer-links">
              <li><a href="#">Chính Sách Đổi Trả 30 Ngày</a></li>
              <li><a href="#">Hướng Dẫn Chọn Kích Cỡ (Size Guide)</a></li>
              <li><a href="#">Tra Cứu Tiến Độ Vận Chuyển</a></li>
              <li><a href="#">Quy Trình Kiểm Định Authentic</a></li>
              <li><a href="#">Hỏi Đáp Thường Gặp (FAQ)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Ưu Đãi Độc Quyền</h4>
            <p className="footer-promo">
              Đăng ký ngay để nhận thông báo drop giới hạn và ưu đãi 15% cho đơn đầu tiên.
            </p>
            <input
              className="footer-email"
              type="email"
              placeholder="Nhập email của bạn..."
              aria-label="Email nhận ưu đãi"
            />
            <button type="button" className="btn btn--red" style={{ width: '100%' }}>
              Nhận Code -15%
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 KINETIC SNEAKERS. BẢO LƯU MỌI QUYỀN. THIẾT KẾ CHO TỐC ĐỘ VÀ VĂN HOÁ ĐƯỜNG PHỐ.
          </div>
          <div className="payment-chips">
            <span>Cổng thanh toán:</span>
            <span className="payment-chip">VISA</span>
            <span className="payment-chip">MASTERCARD</span>
            <span className="payment-chip">MOMO</span>
            <span className="payment-chip">VNPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
