import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard/ProductCard';

export default function Home() {
  const featured = getProducts().slice(0, 4);

  return (
    <div className="page">
      <section className="hero">
        <h1>Bộ sưu tập giày mới 2026</h1>
        <p>Chọn cho mình đôi giày phù hợp — thoải mái cả ngày dài.</p>
        <Link to="/products" className="btn btn-primary">
          Mua ngay
        </Link>
      </section>

      <section className="page-section">
        <h2>Sản phẩm nổi bật</h2>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
