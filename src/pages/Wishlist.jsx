import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../services/productService';
import ProductCard from '../components/product/ProductCard/ProductCard';

export default function Wishlist() {
  const { productIds } = useWishlist();
  const products = productIds.map(getProductById).filter(Boolean);

  return (
    <div className="page">
      <h1 className="page-title">Sản phẩm yêu thích</h1>

      {products.length === 0 ? (
        <>
          <p>Bạn chưa yêu thích sản phẩm nào.</p>
          <Link to="/products" className="btn btn-primary">
            Khám phá sản phẩm
          </Link>
        </>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
