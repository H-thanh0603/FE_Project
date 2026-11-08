import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import formatPrice from '../../../utils/formatPrice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  // Ảnh mẫu chưa có trong public/images — hiển thị placeholder khi ảnh lỗi
  const [imageError, setImageError] = useState(false);

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        {imageError ? (
          <span className="product-card-placeholder" aria-hidden="true">
            👟
          </span>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      <div className="product-card-body">
        <Link to={`/products/${product.id}`} className="product-card-name">
          {product.name}
        </Link>
        <p className="product-card-price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => addItem(product, product.sizes[0] ?? null)}
        >
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
