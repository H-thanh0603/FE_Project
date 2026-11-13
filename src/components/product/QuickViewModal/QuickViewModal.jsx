import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../common/Modal/Modal';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import { getBrandName } from '../../../services/productService';
import formatPrice from '../../../utils/formatPrice';
import './QuickViewModal.css';

/**
 * Modal xem nhanh thông tin sản phẩm và thêm vào giỏ hàng.
 * @param {Object} props
 * @param {Object|null} props.product
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 */
export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) return null;

  const onSale = Boolean(product.oldPrice);

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setJustAdded(true);
    showToast(`Đã thêm ${product.name} (size ${selectedSize}) vào giỏ.`);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xem nhanh sản phẩm" className="quickview-modal">
      <div className="quickview-layout">
        <div className="quickview-image-box">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span className="icon" style={{ fontSize: 48, color: 'var(--color-muted)' }}>
              image
            </span>
          )}
        </div>

        <div className="quickview-info">
          <span className="quickview-brand">{getBrandName(product.brandId)}</span>
          <h3 className="quickview-name">{product.name}</h3>

          <div className="quickview-price-row">
            <span className="quickview-price">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="quickview-old-price">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="quickview-desc">{product.description}</p>

          <div className="detail-block" style={{ marginBottom: 0 }}>
            <div className="shop-card-sizes-label">Chọn kích cỡ:</div>
            <div className="quickview-sizes">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-chip${selectedSize === s ? ' selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="quickview-actions">
            <button
              type="button"
              className="btn btn--dark"
              title={justAdded ? 'Đã thêm vào giỏ hàng' : 'Thêm sản phẩm vào giỏ hàng'}
              onClick={handleAddToCart}
            >
              <span className="icon">{justAdded ? 'check' : 'shopping_bag'}</span>
              {justAdded ? 'Đã thêm thành công' : 'Thêm vào giỏ'}
            </button>
            <Link
              to={`/products/${product.id}`}
              className="quickview-link"
              onClick={onClose}
            >
              Xem trang chi tiết đầy đủ →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
