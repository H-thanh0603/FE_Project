import homepage from '../../data/homepage.json';

export default function CommunitySection() {
  const community = homepage.community;

  return (
    <section className="section section--subtle">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">{community.eyebrow}</div>
            <h2 className="section-title">{community.title}</h2>
          </div>
          <p className="section-desc community-note">{community.description}</p>
        </div>

        <div className="community-grid">
          {community.posts.map((post) => (
            <div key={post.author} className="community-post">
              <img src={post.image} alt={post.product} loading="lazy" />
              <div className="community-overlay">
                <span className="community-author">{post.author}</span>
                <span className="community-product">{post.product}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
