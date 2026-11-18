import { useState } from 'react';
import { Link } from 'react-router-dom';
import homepage from '../../data/homepage.json';
import formatPrice from '../../utils/formatPrice';

export default function HeroSection() {
  const hero = homepage.hero;
  const [selectedColorway, setSelectedColorway] = useState(hero.colorways[0]);
  const [fading, setFading] = useState(false);

  const switchColor = (colorway) => {
    if (colorway.name === selectedColorway.name) return;

    setFading(true);
    setTimeout(() => {
      setSelectedColorway(colorway);
      setFading(false);
    }, 200);
  };

  const accentClass = (accent) =>
    accent === true ? 'hero-stat-value--red' : accent === 'lime' ? 'hero-stat-value--lime' : '';

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
            to={`/products/${hero.productId}?color=${encodeURIComponent(selectedColorway.name)}`}
            className="hero-showcase-frame"
            style={fading ? { opacity: 0.5 } : undefined}
            aria-label={`Xem chi tiết ${hero.showcaseName} - ${selectedColorway.name}`}
          >
            <span className="hero-flag hero-flag--left">{hero.showcaseBadges[0]}</span>
            <span className="hero-flag hero-flag--right">{hero.showcaseBadges[1]}</span>
            <img
              src={selectedColorway.image || hero.image}
              alt={`${hero.showcaseName} - ${selectedColorway.name}`}
            />
            <div className="hero-float-card">
              <div className="hero-float-info">
                <span className={`hero-float-dot hero-float-dot--${selectedColorway.swatch}`} />
                <div>
                  <div className="hero-float-name">
                    {hero.showcaseName}
                    <span className="hero-float-color">{selectedColorway.name}</span>
                  </div>
                  <div className="hero-float-sub">
                    {selectedColorway.description || hero.showcaseSubtitle}
                  </div>
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
            {hero.colorways.map((colorway) => (
              <button
                key={colorway.name}
                type="button"
                className={`colorway-btn${selectedColorway.name === colorway.name ? ' selected' : ''}`}
                aria-pressed={selectedColorway.name === colorway.name}
                onClick={() => switchColor(colorway)}
              >
                <span className={`colorway-dot colorway-dot--${colorway.swatch}`} />
                {colorway.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
