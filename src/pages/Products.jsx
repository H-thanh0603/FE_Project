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
    <div className="page">
      <h1 className="page-title">Sản phẩm</h1>

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

      {filtered.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
