import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProductById, getBrandName } from '../services/productService';
import {
  getProductStockMap,
  isSubscribedRestock,
  subscribeRestock,
} from '../services/stockService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import RecentlyViewed from '../components/product/RecentlyViewed';
import formatPrice from '../utils/formatPrice';
import { isEmail } from '../utils/validators';
import { getProductBadge } from '../utils/productLabels';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SizeGuideModal from '../components/product/SizeGuideModal/SizeGuideModal';
import ProductReviews from '../components/product/ProductReviews/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts/RelatedProducts';
import ProductGallery from '../components/product/ProductGallery/ProductGallery';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const product = getProductById(id);
  useDocumentTitle(product ? product.name : 'Chi tiết sản phẩm');
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { pushNotification } = useNotifications();
  const { recordView } = useRecentlyViewed();

  const stockMap = product ? getProductStockMap(product) : {};
  const firstInStockSize =
    product?.sizes?.find((s) => (stockMap[s] ?? 0) > 0) ?? product?.sizes?.[0] ?? null;

  const [size, setSize] = useState(firstInStockSize);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [restockEmail, setRestockEmail] = useState(user?.email ?? '');
  const [restockError, setRestockError] = useState('');
  const [subscribedSizes, setSubscribedSizes] = useState({});
  const justAddedTimerRef = useRef(null);

  const colorways = product?.colorways ?? [];
  const requestedColor = searchParams.get('color');
  const activeColorway =
    colorways.find((colorway) => colorway.name === requestedColor) ?? colorways[0] ?? null;

  useEffect(() => {
    const freshStock = product ? getProductStockMap(product) : {};
    const initialSize =
      product?.sizes?.find((s) => (freshStock[s] ?? 0) > 0) ?? product?.sizes?.[0] ?? null;
    setSize(initialSize);
    setQuantity(1);
    setJustAdded(false);
    setIsSizeGuideOpen(false);
    setRestockError('');
    if (justAddedTimerRef.current) {
      clearTimeout(justAddedTimerRef.current);
      justAddedTimerRef.current = null;
    }
  }, [product?.id]);

  useEffect(() => () => {
    if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
  }, []);

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
  const currentStock = size != null ? (stockMap[size] ?? 0) : 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 2;
  const maxOrderQty = Math.max(1, Math.min(10, currentStock));
  const restockKey = `${product.id}:${size}`;
  const isRestockRegistered =
    Boolean(subscribedSizes[restockKey]) || isSubscribedRestock(product.id, size);

  const handleSizeChange = (nextSize) => {
    setSize(nextSize);
    setRestockError('');
    const nextStock = stockMap[nextSize] ?? 0;
    if (nextStock > 0) {
      setQuantity((prev) => Math.min(prev, Math.min(10, nextStock)));
    } else {
      setQuantity(1);
    }
  };

  const handleRestockSubmit = (event) => {
    event.preventDefault();
    if (!isEmail(restockEmail)) {
      setRestockError('Vui lòng nhập email hợp lệ để nhận thông báo.');
      return;
    }
    subscribeRestock({ productId: product.id, size, email: restockEmail });
    setSubscribedSizes((prev) => ({ ...prev, [restockKey]: true }));
    setRestockError('');
    pushNotification({
      title: 'Đăng ký báo có hàng thành công',
      message: `Hệ thống sẽ báo qua ${restockEmail.trim()} khi ${product.name} (size ${size}) về hàng.`,
      link: `/products/${product.id}`,
    });
    showToast(`Đã đăng ký nhận thông báo khi size ${size} có hàng trở lại.`);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast(`Size ${size} hiện đã hết hàng.`);
      return;
    }
    const safeQty = Math.min(quantity, maxOrderQty);
    addItem(product, size, safeQty, activeColorway);
    setJustAdded(true);
    const qtyText = safeQty > 1 ? `${safeQty}x ` : '';
    const colorText = activeColorway ? ` - ${activeColorway.name}` : '';
    showToast(`Đã thêm ${qtyText}${product.name}${colorText} (size ${size}) vào giỏ.`);
    if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
    justAddedTimerRef.current = setTimeout(() => {
      setJustAdded(false);
      justAddedTimerRef.current = null;
    }, 1500);
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
          <ProductGallery
            product={product}
            activeColorway={activeColorway}
            badge={badge}
            onSelectColorway={handleColorSelect}
          />

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
                {product.sizes.map((s) => {
                  const sStock = stockMap[s] ?? 0;
                  const sOut = sStock <= 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`size-chip${size === s ? ' selected' : ''}${sOut ? ' is-out-of-stock' : ''}`}
                      onClick={() => handleSizeChange(s)}
                      title={sOut ? `Size ${s} - Hết hàng` : `Size ${s} - Còn ${sStock} đôi`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div
                className={`detail-stock-status${
                  isOutOfStock ? ' is-out' : isLowStock ? ' is-low' : ' is-available'
                }`}
              >
                <span className="icon" style={{ fontSize: 16 }}>
                  {isOutOfStock ? 'block' : isLowStock ? 'local_fire_department' : 'check_circle'}
                </span>
                {isOutOfStock
                  ? `Size ${size} hiện tạm hết hàng`
                  : isLowStock
                    ? `Sắp hết hàng — chỉ còn ${currentStock} đôi cho size ${size}`
                    : `Còn ${currentStock} đôi sẵn hàng cho size ${size}`}
              </div>

              {isOutOfStock && (
                <div className="restock-box">
                  {isRestockRegistered ? (
                    <div className="restock-done">
                      <span className="icon" style={{ fontSize: 18 }}>notifications_active</span>
                      <span>
                        Đã đăng ký nhận thông báo khi <strong>size {size}</strong> có hàng trở lại.
                      </span>
                    </div>
                  ) : (
                    <form className="restock-form" onSubmit={handleRestockSubmit} noValidate>
                      <label htmlFor="restock-email" className="restock-label">
                        Nhận thông báo ngay khi size {size} về hàng:
                      </label>
                      <div className="restock-input-row">
                        <input
                          id="restock-email"
                          type="email"
                          value={restockEmail}
                          onChange={(e) => {
                            setRestockEmail(e.target.value);
                            setRestockError('');
                          }}
                          placeholder="Nhập email của bạn..."
                          className="restock-input"
                        />
                        <button type="submit" className="btn btn--primary">
                          Báo khi có hàng
                        </button>
                      </div>
                      {restockError && <p className="restock-error">{restockError}</p>}
                    </form>
                  )}
                </div>
              )}
            </div>

            {!isOutOfStock && (
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
                    onClick={() => setQuantity((q) => Math.min(maxOrderQty, q + 1))}
                    disabled={quantity >= maxOrderQty}
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button
                type="button"
                className="btn btn--dark"
                disabled={isOutOfStock}
                title={
                  isOutOfStock
                    ? `Size ${size} đã hết hàng`
                    : justAdded
                      ? 'Đã thêm vào giỏ hàng'
                      : 'Thêm sản phẩm vào giỏ hàng'
                }
                onClick={handleAddToCart}
              >
                <span className="icon">
                  {isOutOfStock ? 'remove_shopping_cart' : justAdded ? 'check' : 'shopping_bag'}
                </span>
                {isOutOfStock ? 'Hết hàng' : justAdded ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              <button
                type="button"
                className="btn btn--outline"
                aria-label={wishlisted ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                title={wishlisted ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
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
        <RelatedProducts productId={product.id} />
      </div>
      <RecentlyViewed excludeProductId={product.id} />
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        availableSizes={product.sizes}
        onSelectSize={(pickedSize) => {
          handleSizeChange(pickedSize);
          showToast(`Đã chọn size ${pickedSize} theo gợi ý.`);
        }}
      />

      <div className="sticky-buy-bar" role="region" aria-label="Mua nhanh">
        <div className="sticky-buy-price">
          <span>{formatPrice(product.price)}</span>
          {onSale && <small>{formatPrice(product.oldPrice)}</small>}
        </div>
        <button
          type="button"
          className="btn btn--dark"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <span className="icon">
            {isOutOfStock ? 'remove_shopping_cart' : justAdded ? 'check' : 'shopping_bag'}
          </span>
          {isOutOfStock ? 'Hết hàng' : justAdded ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}
