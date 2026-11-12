import { useState, useEffect } from 'react';
import { getProductReviews, addProductReview } from '../../../services/reviewService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './ProductReviews.css';

/**
 * Khối đánh giá sản phẩm: hiển thị danh sách đánh giá và form cho người dùng viết nhận xét.
 * @param {Object} props
 * @param {string} props.productId
 * @param {number} [props.fallbackRating=5.0]
 */
export default function ProductReviews({ productId, fallbackRating = 5.0 }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (productId) {
      setReviews(getProductReviews(productId));
    }
  }, [productId]);

  useEffect(() => {
    if (user?.name) {
      setAuthor(user.name);
    }
  }, [user]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : fallbackRating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Vui lòng nhập nội dung nhận xét.');
      return;
    }

    const newRev = addProductReview({
      productId,
      author: author.trim() || user?.name || 'Khách hàng',
      rating,
      comment,
    });

    setReviews((prev) => [newRev, ...prev]);
    setComment('');
    showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!');
  };

  return (
    <section className="product-reviews-section">
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
            Đánh giá từ khách hàng
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            100% đánh giá từ khách hàng đã trải nghiệm và mua sắm sản phẩm.
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

      <form className="review-form-card" onSubmit={handleSubmit}>
        <div className="review-form-title">
          <span className="icon">edit_note</span>
          Viết nhận xét của bạn
        </div>

        <div className="review-star-picker">
          <span style={{ fontSize: '0.875rem', fontWeight: 600, marginRight: '0.5rem' }}>
            Đánh giá của bạn:
          </span>
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                type="button"
                className={`star-pick-btn${active ? ' active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Chọn ${star} sao`}
              >
                <span className={`icon${active ? ' icon--fill' : ''}`} style={{ fontSize: 24 }}>
                  star
                </span>
              </button>
            );
          })}
        </div>

        <div className="review-form-inputs">
          {!user && (
            <input
              type="text"
              className="input"
              placeholder="Tên của bạn (vd: Nguyễn Văn A)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          )}

          <textarea
            className="input review-textarea"
            placeholder="Chia sẻ cảm nhận chi tiết về form dáng, độ êm, độ bám đường của đôi giày..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
          />

          <button
            type="submit"
            className="btn btn--dark"
            style={{ alignSelf: 'flex-start' }}
          >
            <span className="icon">send</span>
            Gửi đánh giá
          </button>
        </div>
      </form>
    </section>
  );
}
