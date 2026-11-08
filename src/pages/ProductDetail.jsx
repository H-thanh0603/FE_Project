import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getBrandName } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import formatPrice from '../utils/formatPrice';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [size, setSize] = useState(product?.sizes[0] ?? null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <p>Không tìm thấy sản phẩm.</p>
        <Link to="/products" className="btn btn-outline">
          Về danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="page">
      <div className="detail">
        <div className="detail-image">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="detail-info">
          <p className="detail-brand">{getBrandName(product.brandId)}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>

          <div className="detail-sizes">
            <span>Chọn size: </span>
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-btn${size === s ? ' selected' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
              {added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => toggleWishlist(product.id)}
            >
              {isWishlisted(product.id) ? '❤️ Đã yêu thích' : '🤍 Yêu thích'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
