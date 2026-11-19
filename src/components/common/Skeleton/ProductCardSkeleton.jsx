import './ProductCardSkeleton.css';

/** Khung xương thay thế ProductCard lúc đang tải/filter. */
export default function ProductCardSkeleton() {
  return (
    <div className="shop-card skeleton-card" aria-hidden="true">
      <div>
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-line skeleton-line--sm" />
        <div className="skeleton skeleton-line skeleton-line--md" />
        <div className="skeleton skeleton-line skeleton-line--lg" />
      </div>
      <div>
        <div className="skeleton skeleton-line skeleton-line--sm" />
        <div className="skeleton skeleton-sizes">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="skeleton skeleton-chip" />
          ))}
        </div>
        <div className="skeleton-footer">
          <div className="skeleton skeleton-line skeleton-line--price" />
          <div className="skeleton skeleton-circle" />
        </div>
      </div>
    </div>
  );
}
