import { useState } from 'react';
import homepage from '../../data/homepage.json';
import useCountdown from '../../hooks/useCountdown';
import formatPrice from '../../utils/formatPrice';

export default function FlashDropSection() {
  const drop = homepage.flashDrop;
  const { days, hours, minutes, seconds } = useCountdown({
    totalSeconds: drop.durationSeconds,
  });
  const [ordered, setOrdered] = useState(false);

  const pad = (value) => String(value).padStart(2, '0');

  const handlePreOrder = () => {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 2000);
  };

  return (
    <section className="section section--dark">
      <div className="container">
        <div className="drop-box">
          <div>
            <div className="drop-badges">
              <span className="drop-badge">{drop.badge}</span>
              <span className="drop-note">{drop.note}</span>
            </div>

            <h2 className="drop-name">{drop.name}</h2>
            <p className="drop-description">{drop.description}</p>

            <div className="countdown-label">{drop.countdownLabel}</div>
            <div className="countdown">
              <div className="countdown-cell">
                <div className="countdown-value">{pad(days)}</div>
                <div className="countdown-unit">Ngày</div>
              </div>
              <div className="countdown-cell">
                <div className="countdown-value">{pad(hours)}</div>
                <div className="countdown-unit">Giờ</div>
              </div>
              <div className="countdown-cell">
                <div className="countdown-value">{pad(minutes)}</div>
                <div className="countdown-unit">Phút</div>
              </div>
              <div className="countdown-cell">
                <div className="countdown-value">{pad(seconds)}</div>
                <div className="countdown-unit">Giây</div>
              </div>
            </div>

            <div className="drop-price-row">
              <div>
                <span className="drop-price">{formatPrice(drop.price)}</span>{' '}
                <span className="drop-old-price">{formatPrice(drop.oldPrice)}</span>
              </div>
              <span className="drop-stock">{drop.stockLabel}</span>
            </div>
            <div className="drop-progress">
              <div className="drop-progress-bar" style={{ width: `${drop.progressPercent}%` }} />
            </div>
            <div className="drop-progress-meta">
              <span>{drop.soldLabel}</span>
              <span>{drop.progressNote}</span>
            </div>

            <button type="button" className="btn btn--red" onClick={handlePreOrder}>
              <span className="icon">bolt</span>
              {ordered ? '✓ Đã thêm vào hàng đợi Pre-Order' : drop.cta}
            </button>
          </div>

          <div className="drop-visual">
            <img src={drop.image} alt={drop.name} />
            <span className="drop-verified">{drop.verifiedLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
