import { useState } from 'react';
import { Link } from 'react-router-dom';
import homepage from '../../data/homepage.json';
import formatPrice from '../../utils/formatPrice';

export default function HeroSection() {
  const hero = homepage.hero;
  const [selectedColor, setSelectedColor] = useState(hero.colorways[0]);
  const [fading, setFading] = useState(false);

  const switchColor = (name) => {
    setFading(true);
    setTimeout(() => {
      setSelectedColor(name);
      setFading(false);
    }, 200);
  };

  const accentClass = (accent) =>
    accent === true ? 'hero-stat-value--red' : accent === 'lime' ? 'hero-stat-value--lime' : '';

  const dotClass = (name) => {
    if (name === 'Neon Sunset') return 'colorway-dot--red';
    if (name === 'Carbon Stealth') return 'colorway-dot--black';
    return 'colorway-dot--white';
  };

  return (
    <section className="container">
      <div className="hero">
        <div>
          <span className="hero-eyebrow">{hero.eyebrow}</span>
          <h1 className="hero-title">
            {hero.titleLines.map((line, index) => (
              <span
                key={line}
                className={index === hero.highlightLine ? 'highlight' : undefined}
                style={{ display: 'block' }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn--red">
              {hero.primaryCta}
            </Link>
            <button type="button" className="btn btn--outline">
              <span className="icon">play_circle</span>
              {hero.secondaryCta}
            </button>
          </div>

          <div className="hero-stats">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className={`hero-stat-value ${accentClass(stat.accent)}`}>{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-showcase">
          <Link
            to={`/products/${hero.productId}`}
            className="hero-showcase-frame"
            style={fading ? { opacity: 0.5 } : undefined}
            aria-label={`Xem chi tiết ${hero.showcaseName}`}
          >
            <span className="hero-flag hero-flag--left">{hero.showcaseBadges[0]}</span>
            <span className="hero-flag hero-flag--right">{hero.showcaseBadges[1]}</span>
            <img src={hero.image} alt={hero.showcaseName} />
            <div className="hero-float-card">
              <div className="hero-float-info">
                <span className="hero-float-dot" />
                <div>
                  <div className="hero-float-name">{hero.showcaseName}</div>
                  <div className="hero-float-sub">{hero.showcaseSubtitle}</div>
                </div>
              </div>
              <div className="hero-float-price">
                {formatPrice(hero.showcasePrice)}
                <span className="hero-float-old">{formatPrice(hero.showcaseOldPrice)}</span>
              </div>
            </div>
          </Link>

          <div className="colorway-row">
            <span className="colorway-label">Phối màu sẵn có:</span>
            {hero.colorways.map((name) => (
              <button
                key={name}
                type="button"
                className={`colorway-btn${selectedColor === name ? ' selected' : ''}`}
                onClick={() => switchColor(name)}
              >
                <span className={`colorway-dot ${dotClass(name)}`} />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
