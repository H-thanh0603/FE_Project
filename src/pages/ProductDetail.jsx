import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProductById, getBrandName } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import RecentlyViewed from '../components/product/RecentlyViewed';
import formatPrice from '../utils/formatPrice';
import { getProductBadge } from '../utils/productLabels';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SizeGuideModal from '../components/product/SizeGuideModal/SizeGuideModal';
import ProductReviews from '../components/product/ProductReviews/ProductReviews';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const product = getProductById(id);
  useDocumentTitle(product ? product.name : 'Chi tiết sản phẩm');
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { recordView } = useRecentlyViewed();
  const [size, setSize] = useState(product?.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const colorways = product?.colorways ?? [];
  const requestedColor = searchParams.get('color');
  const activeColorway =
    colorways.find((colorway) => colorway.name === requestedColor) ?? colorways[0] ?? null;

  useEffect(() => {
    if (product) recordView(product.id);
  }, [product, recordView]);

  const handleColorSelect = (colorway) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('color', colorway.name);
    setSearchParams(nextParams, { replace: true });
  };

  if (!product) {
    return (
      <div className="container">
        <div className="page">
          <h1 className="section-title">Không tìm thấy sản phẩm</h1>
          <div className="empty-state">
            <span className="icon">inventory_2</span>
            <p>Sản phẩm này không tồn tại hoặc đã bị gỡ.</p>
          </div>
          <Link to="/products" className="btn btn--dark" style={{ alignSelf: 'flex-start' }}>
            Về danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const onSale = Boolean(product.oldPrice);
  const badge = getProductBadge(product);

  const handleAddToCart = () => {
    addItem(product, size, quantity);
    setJustAdded(true);
    const qtyText = quantity > 1 ? `${quantity}x ` : '';
    showToast(`Đã thêm ${qtyText}${product.name} (size ${size}) vào giỏ.`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="container">
      <div className="page">
        <nav className="breadcrumb" aria-label="Đường dẫn">
          <Link to="/">Trang chủ</Link>
          <span className="icon">chevron_right</span>
          <Link to="/products">Sản phẩm</Link>
          <span className="icon">chevron_right</span>
          <span>{product.name}</span>
        </nav>

        <div className="detail">
          <div className="detail-image">
            {badge && (
              <span className={`shop-card-tag${badge.tone ? ` shop-card-tag--${badge.tone}` : ''}`}>
                {badge.label}
              </span>
            )}
            {product.image || activeColorway?.image ? (
              <img
                src={activeColorway?.image || product.image}
                alt={`${product.name}${activeColorway ? ` - ${activeColorway.name}` : ''}`}
              />
            ) : (
              <span className="detail-image-placeholder icon" aria-label="Chưa có ảnh sản phẩm">
                image
              </span>
            )}
          </div>

          <div className="detail-info">
            <div className="eyebrow">{getBrandName(product.brandId)}</div>
            <h1 className="section-title">{product.name}</h1>

            {product.rating && (
              <div className="shop-card-rating">
                <span className="icon icon--fill" style={{ fontSize: 16 }}>star</span>
                <span className="shop-card-rating-score">{product.rating}</span>
                <span className="shop-card-rating-count">({product.reviews} đánh giá)</span>
              </div>
            )}

            <p className="detail-price">
              {formatPrice(product.price)}
              {onSale && <span className="shop-card-old-price">{formatPrice(product.oldPrice)}</span>}
            </p>
            <p className="detail-description">{product.description}</p>

            {colorways.length > 0 && (
              <div className="detail-block">
                <div className="shop-card-sizes-label">Chọn phối màu</div>
                <div className="detail-colorways">
                  {colorways.map((colorway) => (
                    <button
                      key={colorway.name}
                      type="button"
                      className={`detail-colorway${activeColorway?.name === colorway.name ? ' selected' : ''}`}
                      aria-pressed={activeColorway?.name === colorway.name}
                      onClick={() => handleColorSelect(colorway)}
                    >
                      <span className={`detail-colorway-dot detail-colorway-dot--${colorway.swatch}`} />
                      {colorway.name}
                    </button>
                  ))}
                </div>
                {activeColorway && (
                  <div className="detail-colorway-info">
                    <p className="detail-colorway-desc">{activeColorway.description}</p>
                    <span className="detail-colorway-sku">Mã phối màu: {activeColorway.sku}</span>
                  </div>
                )}
              </div>
            )}

            <div className="detail-block">
              <div className="detail-sizes-header">
                <div className="shop-card-sizes-label">Chọn kích cỡ</div>
                <button
                  type="button"
                  className="size-guide-trigger"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  <span className="icon" style={{ fontSize: 16 }}>straighten</span>
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="detail-sizes">
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
            </div>

            <div className="detail-qty-group">
              <div className="shop-card-sizes-label">Số lượng</div>
              <div className="detail-qty-selector">
                <button
                  type="button"
                  className="detail-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <span className="detail-qty-val">{quantity}</span>
                <button
                  type="button"
                  className="detail-qty-btn"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn btn--dark" onClick={handleAddToCart}>
                <span className="icon">{justAdded ? 'check' : 'shopping_bag'}</span>
                {justAdded ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => toggleWishlist(product.id)}
              >
                <span className={`icon${wishlisted ? ' icon--fill' : ''}`} style={{ color: wishlisted ? 'var(--color-primary)' : 'inherit' }}>
                  favorite
                </span>
                {wishlisted ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
            </div>
          </div>
        </div>
        <ProductReviews productId={product.id} fallbackRating={product.rating || 5} />
      </div>
      <RecentlyViewed excludeProductId={product.id} />
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
