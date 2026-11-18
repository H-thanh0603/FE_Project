import { useState } from 'react';
import homepage from '../../data/homepage.json';
import { isEmail } from '../../utils/validators';

export default function NewsletterSection() {
  const newsletter = homepage.newsletter;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    // Mô phỏng đăng ký bản tin phía frontend — chưa có backend thật
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="section">
      <div className="container">
        <div className="newsletter-box">
          <span className="newsletter-badge">{newsletter.badge}</span>
          <h3 className="newsletter-title">{newsletter.title}</h3>
          <p className="newsletter-desc">{newsletter.description}</p>

          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="newsletter-input"
              placeholder={newsletter.placeholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" className="btn btn--red">
              {newsletter.cta}
            </button>
          </form>

          {error && <p className="newsletter-success" style={{ color: '#ffdad6' }}>{error}</p>}
          {subscribed && (
            <p className="newsletter-success">
              ✓ Cảm ơn bạn! Mã voucher KINETIC200K đã được gửi vào hòm thư (mô phỏng).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
