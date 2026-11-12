import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../services/productService';
import ProductCard from '../components/product/ProductCard/ProductCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Wishlist() {
  useDocumentTitle('Danh sách yêu thích');
  const { productIds } = useWishlist();
  const products = productIds.map(getProductById).filter(Boolean);

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Danh sách cá nhân</div>
          <h1 className="section-title">Sản Phẩm Yêu Thích</h1>
        </div>

        <p className="page-note">
          Hiện có <strong>{products.length}</strong> sản phẩm trong danh sách yêu thích
        </p>

        {products.length === 0 ? (
          <div className="empty-state">
            <span className="icon">favorite_border</span>
            <p>Bạn chưa yêu thích sản phẩm nào. Bấm biểu tượng trái tim trên thẻ sản phẩm để lưu.</p>
            <Link to="/products" className="btn btn--dark">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
