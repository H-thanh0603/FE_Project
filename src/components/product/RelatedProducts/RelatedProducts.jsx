import { getRelatedProducts } from '../../../services/productService';
import ProductCard from '../ProductCard/ProductCard';
import './RelatedProducts.css';

export default function RelatedProducts({ productId }) {
  const products = getRelatedProducts(productId);
  if (products.length === 0) return null;

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <div className="related-products-heading">
        <div className="eyebrow">Có thể bạn thích</div>
        <h2 className="section-title" id="related-products-title">
          Sản Phẩm Liên Quan
        </h2>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
