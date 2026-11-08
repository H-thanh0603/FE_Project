import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import homepage from '../../data/homepage.json';
import { getProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import formatPrice from '../../utils/formatPrice';

function ShopCard({ product, sizeLabel }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const tagClass =
    product.tag === 'LIMITED'
      ? 'shop-card-tag--lime'
      : product.tag === 'HOT SELLER' || product.tag === 'PRO HOOPS'
        ? 'shop-card-tag--black'
        : product.tag.startsWith('-')
          ? 'shop-card-tag--red-dark'
          : '';

  const onSale = Boolean(product.oldPrice);

  return (
    <article className="shop-card">
      <div>
        <div className="shop-card-image">
          <span className={`shop-card-tag ${tagClass}`}>{product.tag}</span>
          <button
            type="button"
            aria-label="Yêu thích"
            className={`fav-btn${isWishlisted(product.id) ? ' active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
          >
            <span className={`icon${isWishlisted(product.id) ? ' icon--fill' : ''}`}>favorite</span>
          </button>
          <Link to={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} loading="lazy" />
          </Link>
        </div>

        <div className="shop-card-colors">
          {product.colors.map((color) => (
            <span key={color} className="shop-card-swatch" style={{ background: color }} />
          ))}
        </div>

        <div className="shop-card-rating">
          <span className="icon icon--fill" style={{ fontSize: 14 }}>star</span>
          <span className="shop-card-rating-score">{product.rating}</span>
          <span className="shop-card-rating-count">({product.reviews})</span>
        </div>

        <h3 className="shop-card-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="shop-card-desc">{product.description}</p>
      </div>

      <div>
        <div className="shop-card-sizes-label">{sizeLabel}</div>
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

export default function FeaturedProducts() {
  const { featured } = homepage;
  const products = getProducts();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(
    () =>
      tab === 'all'
        ? products
        : products.filter((product) => product.category?.includes(tab)),
    [tab],
  );

  return (
    <section className="section" id="products-grid">
      <div className="container">
        <div className="featured-head">
          <div>
            <div className="eyebrow">{featured.eyebrow}</div>
            <h2 className="section-title">{featured.title}</h2>
          </div>

          <div className="featured-tabs">
            {featured.tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`featured-tab${tab === item.id ? ' active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="featured-grid">
          {filtered.map((product) => (
            <ShopCard key={product.id} product={product} sizeLabel={featured.sizeLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}
