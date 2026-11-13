import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../context/ToastContext';
import { getBrandName } from '../../../services/productService';
import formatPrice from '../../../utils/formatPrice';
import { getProductBadge } from '../../../utils/productLabels';
import './ProductCard.css';

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, size);
    setJustAdded(true);
    showToast(`Đã thêm ${product.name} (size ${size}) vào giỏ.`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const wishlisted = isWishlisted(product.id);
  const onSale = Boolean(product.oldPrice);
  const badge = getProductBadge(product);

  return (
    <article className="shop-card">
      <div>
        <div className="shop-card-image">
          {badge && (
            <span className={`shop-card-tag${badge.tone ? ` shop-card-tag--${badge.tone}` : ''}`}>
              {badge.label}
            </span>
          )}
          <button
            type="button"
            aria-label={wishlisted ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
            title={wishlisted ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
            className={`fav-btn${wishlisted ? ' active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
          >
            <span className={`icon${wishlisted ? ' icon--fill' : ''}`}>favorite</span>
          </button>
          <Link to={`/products/${product.id}`}>
            {product.image ? (
              <img src={product.image} alt={product.name} loading="lazy" />
            ) : (
              <span className="shop-card-image-placeholder icon" aria-label="Chưa có ảnh sản phẩm">
                image
              </span>
            )}
          </Link>
          {onQuickView && (
            <button
              type="button"
              className="shop-card-quickview"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              aria-label={`Xem nhanh ${product.name}`}
            >
              <span className="icon">visibility</span>
              Xem nhanh
            </button>
          )}
        </div>

        {product.colors?.length > 0 && (
          <div className="shop-card-colors">
            {product.colors.map((color) => (
              <span key={color} className="shop-card-swatch" style={{ background: color }} />
            ))}
          </div>
        )}

        {product.rating && (
          <div className="shop-card-rating">
            <span className="icon icon--fill" style={{ fontSize: 14 }}>star</span>
            <span className="shop-card-rating-score">{product.rating}</span>
            <span className="shop-card-rating-count">({product.reviews})</span>
          </div>
        )}

        <p className="shop-card-brand">{getBrandName(product.brandId)}</p>
        <h3 className="shop-card-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="shop-card-desc">{product.description}</p>
      </div>

      <div>
        <div className="shop-card-sizes-label">Chọn kích cỡ:</div>
        <div className="shop-card-sizes">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`size-chip${size === s ? ' selected' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="shop-card-footer">
          <div>
            <span className={`shop-card-price${onSale ? '' : ' shop-card-price--dark'}`}>
              {formatPrice(product.price)}
            </span>
            {onSale && <span className="shop-card-old-price">{formatPrice(product.oldPrice)}</span>}
          </div>
          <button
            type="button"
            className="add-btn"
            aria-label={justAdded ? 'Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
            title={justAdded ? 'Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
            onClick={handleAdd}
          >
            <span className="icon">{justAdded ? 'check' : 'shopping_bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
