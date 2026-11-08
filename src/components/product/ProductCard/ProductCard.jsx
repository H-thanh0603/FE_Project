import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import formatPrice from '../../../utils/formatPrice';
import './ProductCard.css';

/** Màu nền của badge theo nhãn: giới hạn -> lime, hot/pro -> đen, giảm giá -> đỏ đậm */
function tagClass(tag) {
  if (tag === 'LIMITED') return 'shop-card-tag--lime';
  if (tag === 'HOT SELLER' || tag === 'PRO HOOPS') return 'shop-card-tag--black';
  if (tag.startsWith('-')) return 'shop-card-tag--red-dark';
  return '';
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const wishlisted = isWishlisted(product.id);
  const onSale = Boolean(product.oldPrice);

  return (
    <article className="shop-card">
      <div>
        <div className="shop-card-image">
          {product.tag && (
            <span className={`shop-card-tag ${tagClass(product.tag)}`}>{product.tag}</span>
          )}
          <button
            type="button"
            aria-label="Yêu thích"
            className={`fav-btn${wishlisted ? ' active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
          >
            <span className={`icon${wishlisted ? ' icon--fill' : ''}`}>favorite</span>
          </button>
          <Link to={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} loading="lazy" />
          </Link>
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
          <button type="button" className="add-btn" aria-label="Thêm vào giỏ" onClick={handleAdd}>
            <span className="icon">{justAdded ? 'check' : 'shopping_bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
