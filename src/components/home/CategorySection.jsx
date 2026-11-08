import { Link } from 'react-router-dom';
import homepage from '../../data/homepage.json';

export default function CategorySection() {
  const { categories } = homepage;

  return (
    <section className="section section--subtle">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">{categories.eyebrow}</div>
            <h2 className="section-title">{categories.title}</h2>
          </div>
          <p className="section-desc">{categories.description}</p>
        </div>

        <div className="category-grid">
          {categories.items.map((item) => (
            <Link
              key={item.name}
              to="/products"
              className={`category-card${item.dark ? ' category-card--dark' : ''}`}
            >
              <div className="category-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className={`category-badge${item.dark ? ' category-badge--lime' : ''}`}>
                  {item.badge}
                </span>
              </div>
              <div className="category-body">
                <div>
                  <h3 className="category-name">{item.name}</h3>
                  <p className="category-subtitle">{item.subtitle}</p>
                </div>
                <div className="category-cta">
                  <span>{item.cta}</span>
                  <span className="icon">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
