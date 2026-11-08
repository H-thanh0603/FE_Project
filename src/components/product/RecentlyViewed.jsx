import { getProductById } from '../../services/productService';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import ProductCard from './ProductCard/ProductCard';

export default function RecentlyViewed({ excludeProductId }) {
  const { productIds, clearRecentlyViewed } = useRecentlyViewed();
  const products = productIds
    .filter((id) => id !== excludeProductId)
    .map(getProductById)
    .filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section className="section recently-viewed">
      <div className="container">
        <div className="recently-viewed-heading">
          <div>
            <div className="eyebrow">Dành cho bạn</div>
            <h2 className="section-title">Sản Phẩm Đã Xem Gần Đây</h2>
          </div>
          <button
            type="button"
            className="recently-viewed-clear"
            onClick={clearRecentlyViewed}
          >
            Xóa lịch sử
          </button>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
