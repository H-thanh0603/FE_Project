import homepage from '../../data/homepage.json';

export default function TrustBadges() {
  const badges = homepage.trustBadges;

  return (
    <section className="section">
      <div className="container">
        <div className="trust-grid">
          {badges.map((badge) => (
            <div key={badge.title} className="trust-card">
              <div className="trust-icon">
                <span className="icon">{badge.icon}</span>
              </div>
              <div>
                <h4 className="trust-title">{badge.title}</h4>
                <p className="trust-desc">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
