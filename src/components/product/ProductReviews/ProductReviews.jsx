import './ProductReviews.css';

/**
 * Hiển thị khối tóm tắt và danh sách nhận xét đánh giá của sản phẩm.
 * @param {Object} props
 * @param {Array} props.reviews - Danh sách bài đánh giá
 * @param {number} [props.averageRating=5.0] - Điểm trung bình
 */
export default function ProductReviews({ reviews = [], averageRating = 5.0 }) {
  return (
    <div className="product-reviews-container">
      <div className="reviews-summary-card">
        <div className="reviews-score-block">
          <span className="reviews-score-num">{averageRating.toFixed(1)}</span>
          <div className="reviews-stars-row" aria-label={`Điểm đánh giá: ${averageRating} trên 5 sao`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`icon${star <= Math.round(averageRating) ? ' icon--fill' : ''}`}
              >
                star
              </span>
            ))}
          </div>
          <span className="reviews-total-text">{reviews.length} lượt đánh giá</span>
        </div>

        <div className="reviews-summary-info">
          <div className="eyebrow">Trải nghiệm thực tế</div>
          <h3 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            Đánh giá từ khách hàng đã mua
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            100% đánh giá từ khách hàng đã sở hữu và trải nghiệm sản phẩm thực tế.
          </p>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <span className="icon">rate_review</span>
            <p>Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên để lại nhận xét!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="review-item">
              <div className="review-item-header">
                <div className="review-author-group">
                  <div className="review-avatar">
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="review-author-name">{rev.author}</span>
                      <span className="review-verified">
                        <span className="icon" style={{ fontSize: 13 }}>verified</span>
                        Đã mua hàng
                      </span>
                    </div>
                    <div className="reviews-stars-row" style={{ margin: 0 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`icon${star <= rev.rating ? ' icon--fill' : ''}`}
                          style={{ fontSize: 14 }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="review-date">{rev.date}</span>
              </div>

              <p className="review-comment">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
