import { useMemo, useState } from 'react';
import homepage from '../../data/homepage.json';
import { getProducts } from '../../services/productService';
import ProductCard from '../product/ProductCard/ProductCard';

export default function FeaturedProducts() {
  const { featured } = homepage;
  const products = getProducts();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(
    () =>
      tab === 'all'
        ? products
        : products.filter((product) => product.tags.includes(tab)),
    [tab],
  );

  return (
    <section className="section" id="products-grid">
      <div className="container">
        <div className="featured-head">
          <div>
            <div className="eyebrow">{featured.eyebrow}</div>
            <h2 className="section-title">{featured.title}</h2>
          </div>

          <div className="featured-tabs">
            {featured.tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`featured-tab${tab === item.id ? ' active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="featured-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
