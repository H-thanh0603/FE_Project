import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getBrands } from '../services/productService';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/product/ProductCard/ProductCard';
import Pagination from '../components/common/Pagination/Pagination';
import homepage from '../data/homepage.json';

const PAGE_SIZE = 8;

export default function Products() {
  const products = getProducts();
  const brands = getBrands();
  const categories = homepage.categories.items;
  const categoryIds = categories.map((item) => item.category);
  const [searchParams, setSearchParams] = useSearchParams();

  const [brand, setBrand] = useState('all');
  const [search, setSearch] = useState('');
  const [size, setSize] = useState('all');
  const [color, setColor] = useState('all');
  const [saleOnly, setSaleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const sizes = [...new Set(products.flatMap((product) => product.sizes))]
    .sort((a, b) => a - b);
  const colors = [...new Set(products.flatMap((product) => product.colors))];
  const requestedCategory = searchParams.get('category');
  const category = categoryIds.includes(requestedCategory) ? requestedCategory : 'all';
  const activeCategory = categories.find((item) => item.category === category);
  const minPriceValue = minPrice === '' ? null : Number(minPrice);
  const maxPriceValue = maxPrice === '' ? null : Number(maxPrice);
  const invalidPriceRange =
    minPriceValue !== null &&
    maxPriceValue !== null &&
    minPriceValue > maxPriceValue;
  const hasActiveFilters =
    brand !== 'all' ||
    category !== 'all' ||
    search.trim() !== '' ||
    size !== 'all' ||
    color !== 'all' ||
    saleOnly ||
    minPrice !== '' ||
    maxPrice !== '';

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

  const clearFilters = () => {
    setBrand('all');
    setSearch('');
    setSize('all');
    setColor('all');
    setSaleOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setCategory('all');
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          !invalidPriceRange &&
          (category === 'all' || product.category === category) &&
          (brand === 'all' || product.brandId === brand) &&
          product.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) &&
          (size === 'all' || product.sizes.includes(Number(size))) &&
          (color === 'all' || product.colors.includes(color)) &&
          (!saleOnly || (product.tags.includes('sale') && product.oldPrice > product.price)) &&
          (minPriceValue === null || product.price >= minPriceValue) &&
          (maxPriceValue === null || product.price <= maxPriceValue),
      ),
    [
      brand,
      category,
      color,
      debouncedSearch,
      invalidPriceRange,
      maxPriceValue,
      minPriceValue,
      products,
      saleOnly,
      size,
    ],
  );

  const sorted = useMemo(() => {
    const result = [...filtered];

    switch (sort) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      default:
        return result;
    }
  }, [filtered, sort]);

  useEffect(() => {
    setPage(1);
  }, [
    brand,
    category,
    color,
    debouncedSearch,
    maxPrice,
    minPrice,
    saleOnly,
    size,
    sort,
  ]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const visibleProducts = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const firstVisibleProduct = sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastVisibleProduct = Math.min(currentPage * PAGE_SIZE, sorted.length);

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
          <select
            className="input"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sắp xếp sản phẩm"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="rating-desc">Đánh giá cao nhất</option>
            <option value="name-asc">Tên: A đến Z</option>
          </select>
          <button
            type="button"
            className="btn btn--outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Xóa bộ lọc
          </button>
        </div>

        <section className="product-filters" aria-label="Bộ lọc sản phẩm">
          <div className="product-filter-row">
            <label className="product-filter-group">
              <span className="product-filter-label">Giá từ (₫)</span>
              <input
                type="number"
                className="input"
                min="0"
                step="100000"
                placeholder="Không giới hạn"
                aria-label="Giá thấp nhất bằng đồng"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
            </label>
            <label className="product-filter-group">
              <span className="product-filter-label">Đến (₫)</span>
              <input
                type="number"
                className="input"
                min="0"
                step="100000"
                placeholder="Không giới hạn"
                aria-label="Giá cao nhất bằng đồng"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </label>
            <label className="product-filter-sale">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(event) => setSaleOnly(event.target.checked)}
              />
              Chỉ xem sản phẩm giảm giá
            </label>
          </div>

          <div className="product-filter-row">
            <div className="product-filter-group">
              <span className="product-filter-label">Kích cỡ</span>
              <div className="product-filter-options">
                <button
                  type="button"
                  className={`size-chip${size === 'all' ? ' selected' : ''}`}
                  aria-pressed={size === 'all'}
                  onClick={() => setSize('all')}
                >
                  Tất cả
                </button>
                {sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`size-chip${size === String(item) ? ' selected' : ''}`}
                    aria-pressed={size === String(item)}
                    onClick={() => setSize(size === String(item) ? 'all' : String(item))}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="product-filter-row">
            <div className="product-filter-group">
              <span className="product-filter-label">Màu sắc</span>
              <div className="product-filter-options">
                <button
                  type="button"
                  className={`product-color-option${color === 'all' ? ' selected' : ''}`}
                  aria-label="Tất cả màu sắc"
                  aria-pressed={color === 'all'}
                  onClick={() => setColor('all')}
                >
                  Tất cả
                </button>
                {colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`product-color-swatch${color === item ? ' selected' : ''}`}
                    style={{ '--swatch-color': item }}
                    title={item}
                    aria-label={`Màu ${item}`}
                    aria-pressed={color === item}
                    onClick={() => setColor(color === item ? 'all' : item)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {invalidPriceRange && (
          <p className="form-error" role="alert">
            Giá tối thiểu không được lớn hơn giá tối đa.
          </p>
        )}

        <p className="page-note">
          Hiển thị <strong>{firstVisibleProduct}–{lastVisibleProduct}</strong> / {sorted.length}{' '}
          sản phẩm phù hợp ({products.length} sản phẩm trong cửa hàng)
        </p>

        {sorted.length === 0 ? (
          <div className="empty-state">
            <span className="icon">search_off</span>
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
            {hasActiveFilters && (
              <button type="button" className="btn btn--outline" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
