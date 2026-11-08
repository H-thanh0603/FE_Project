import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getBrands } from '../services/productService';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/product/ProductCard/ProductCard';
import homepage from '../data/homepage.json';

export default function Products() {
  const products = getProducts();
  const brands = getBrands();
  const categories = homepage.categories.items;
  const categoryIds = categories.map((item) => item.category);
  const [searchParams, setSearchParams] = useSearchParams();

  const [brand, setBrand] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const requestedCategory = searchParams.get('category');
  const category = categoryIds.includes(requestedCategory) ? requestedCategory : 'all';
  const activeCategory = categories.find((item) => item.category === category);

  const setCategory = (value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value === 'all') {
        next.delete('category');
      } else {
        next.set('category', value);
      }
      return next;
    });
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'all' || product.category === category) &&
          (brand === 'all' || product.brandId === brand) &&
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [brand, category, debouncedSearch],
  );

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Cửa hàng KINETIC</div>
          <h1 className="section-title">{activeCategory?.name ?? 'Tất Cả Sản Phẩm'}</h1>
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
          <select
            className="input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Lọc theo danh mục"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item.category} value={item.category}>
                {item.name}
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
