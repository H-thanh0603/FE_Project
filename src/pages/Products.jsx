import { useMemo, useState } from 'react';
import { getProducts, getBrands } from '../services/productService';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/product/ProductCard/ProductCard';

export default function Products() {
  const products = getProducts();
  const brands = getBrands();

  const [brand, setBrand] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (brand === 'all' || product.brandId === brand) &&
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [brand, debouncedSearch],
  );

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Cửa hàng KINETIC</div>
          <h1 className="section-title">Tất Cả Sản Phẩm</h1>
        </div>

        <div className="toolbar">
          <input
            type="search"
            className="input"
            placeholder="Tìm kiếm giày..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="input"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            aria-label="Lọc theo thương hiệu"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <p className="page-note">
          Hiển thị <strong>{filtered.length}</strong> / {products.length} sản phẩm
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="icon">search_off</span>
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
