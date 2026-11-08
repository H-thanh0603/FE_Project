import homepage from '../../data/homepage.json';

/** Chuyển chuỗi "top: 28%; left: 28%" thành object style cho React */
function styleFrom(position) {
  return position.split(';').reduce((styles, rule) => {
    const [property, value] = rule.split(':').map((part) => part.trim());
    if (property && value) {
      styles[property] = value;
    }
    return styles;
  }, {});
}

export default function TechSection() {
  const tech = homepage.tech;

  return (
    <section className="section section--subtle">
      <div className="container">
        <div className="tech-intro">
          <div className="eyebrow">{tech.eyebrow}</div>
          <h2 className="section-title">{tech.title}</h2>
          <p className="section-desc">{tech.description}</p>
        </div>

        <div className="tech-panel">
          <div className="tech-grid">
            <div className="tech-visual">
              <img src={tech.image} alt={tech.title} loading="lazy" />
              {tech.hotspots.map((spot) => (
                <div key={spot.title} className="hotspot" style={styleFrom(spot.position)}>
                  <span className={`hotspot-ping${spot.accent === 'lime' ? ' hotspot-ping--lime' : ''}`} />
                  <span className={`hotspot-dot${spot.accent === 'lime' ? ' hotspot-dot--lime' : ''}`}>
                    {spot.order}
                  </span>
                  <span className="hotspot-tip">
                    <span className="hotspot-tip-title">{spot.title}</span>
                    <span className="hotspot-tip-desc">{spot.description}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="tech-specs">
              {tech.specs.map((spec) => (
                <div key={spec.title} className="tech-spec">
                  <div className="tech-spec-head">
                    <span className="icon">{spec.icon}</span>
                    <span className="tech-spec-title">{spec.title}</span>
                  </div>
                  <p className="tech-spec-desc">{spec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
