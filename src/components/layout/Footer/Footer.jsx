import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from '../../../utils/validators';
import { STORAGE_KEYS } from '../../../utils/constants';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../common/Modal/Modal';
import SizeGuideModal from '../../product/SizeGuideModal/SizeGuideModal';

const FOOTER_PROMO_CODE = 'WELCOME15';

function savePromoSubscriber(email) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PROMO_SUBSCRIBERS);
    const list = raw ? JSON.parse(raw) : [];
    const normalized = email.trim().toLowerCase();
    if (!list.includes(normalized)) {
      window.localStorage.setItem(
        STORAGE_KEYS.PROMO_SUBSCRIBERS,
        JSON.stringify([normalized, ...list]),
      );
    }
  } catch {
    // Bỏ qua nếu localStorage bị chặn
  }
}

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);

  const handlePromoSubmit = (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    savePromoSubscriber(email);
    setError('');
    setSubscribed(true);
    setEmail('');
    showToast(`Đã kích hoạt mã giảm 15%: ${FOOTER_PROMO_CODE}`, 'success');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(FOOTER_PROMO_CODE);
      showToast(`Đã sao chép mã ${FOOTER_PROMO_CODE}`, 'success');
    } catch {
      showToast(`Mã ưu đãi của bạn: ${FOOTER_PROMO_CODE}`, 'info');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Link to="/" aria-label="Về trang chủ KINETIC">
                <img src="/images/logo.svg" alt="KINETIC" />
              </Link>
            </div>
            <p className="footer-description">
              Thương hiệu sneaker và thời trang thể thao streetwear hiệu năng cao. Sáng tạo không
              ranh giới, đồng hành cùng tinh thần bứt phá của thế hệ tiên phong.
            </p>
            <div className="footer-socials">
              <Link to="/" className="icon" title="Trang chủ KINETIC" aria-label="Trang chủ">
                public
              </Link>
              <Link to="/products" className="icon" title="Khám phá sản phẩm" aria-label="Sản phẩm">
                storefront
              </Link>
              <Link to="/notifications" className="icon" title="Thông báo" aria-label="Thông báo">
                chat
              </Link>
              <Link to="/wishlist" className="icon" title="Yêu thích" aria-label="Yêu thích">
                favorite
              </Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Danh Mục Sản Phẩm</h4>
            <ul className="footer-links">
              <li>
                <Link to="/products?category=running">Giày Chạy Bộ Performance</Link>
              </li>
              <li>
                <Link to="/products?category=limited">Sneakers Bản Giới Hạn</Link>
              </li>
              <li>
                <Link to="/products?category=basketball">Giày Bóng Rổ Sân Đấu</Link>
              </li>
              <li>
                <Link to="/products?category=streetwear">Sneakers Streetwear</Link>
              </li>
              <li>
                <Link to="/products">Tất Cả Sản Phẩm</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Hỗ Trợ Khách Hàng</h4>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setInfoModal('return')}
                >
                  Chính Sách Đổi Trả 30 Ngày
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  Hướng Dẫn Chọn Kích Cỡ (Size Guide)
                </button>
              </li>
              <li>
                <Link to="/orders">Tra Cứu Tiến Độ Vận Chuyển</Link>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setInfoModal('authentic')}
                >
                  Quy Trình Kiểm Định Authentic
                </button>
              </li>
              <li>
                <Link to="/compare">So Sánh Sản Phẩm</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Ưu Đãi Độc Quyền</h4>
            <p className="footer-promo">
              Đăng ký ngay để nhận thông báo drop giới hạn và ưu đãi 15% cho đơn đầu tiên.
            </p>
            <form onSubmit={handlePromoSubmit} noValidate>
              <input
                className="footer-email"
                type="email"
                placeholder="Nhập email của bạn..."
                aria-label="Email nhận ưu đãi"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
              />
              <button type="submit" className="btn btn--red" style={{ width: '100%' }}>
                Nhận Code -15%
              </button>
            </form>
            {error && <p className="footer-promo-error">{error}</p>}
            {subscribed && (
              <div className="footer-promo-success" role="status">
                <span>
                  Mã của bạn: <strong>{FOOTER_PROMO_CODE}</strong>
                </span>
                <button type="button" className="footer-promo-copy" onClick={handleCopyCode}>
                  Sao chép
                </button>
              </div>
            )}
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

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      <Modal
        isOpen={infoModal === 'return'}
        onClose={() => setInfoModal(null)}
        title="Chính Sách Đổi Trả 30 Ngày"
      >
        <ul className="footer-policy-list">
          <li>Đổi size miễn phí trong vòng 30 ngày kể từ ngày nhận hàng.</li>
          <li>Sản phẩm chưa qua sử dụng ngoài trời, còn nguyên hộp, tem và phụ kiện đi kèm.</li>
          <li>Hoàn tiền 100% trong 3–5 ngày làm việc nếu phát sinh lỗi sản xuất.</li>
        </ul>
      </Modal>

      <Modal
        isOpen={infoModal === 'authentic'}
        onClose={() => setInfoModal(null)}
        title="Quy Trình Kiểm Định Authentic"
      >
        <ul className="footer-policy-list">
          <li>Bước 1: Đối chiếu tem size, mã SKU, hộp và chất liệu theo tiêu chuẩn hãng.</li>
          <li>Bước 2: Kiểm tra đường may, keo đế, lót giày và độ đàn hồi dưới đèn UV.</li>
          <li>Bước 3: Gắn tag niêm phong KINETIC Verified và hoàn tiền gấp đôi nếu phát hiện hàng giả.</li>
        </ul>
      </Modal>
    </footer>
  );
}
