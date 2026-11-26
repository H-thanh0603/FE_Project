import { useEffect, useMemo, useState } from 'react';
import './ProductGallery.css';

/**
 * Thư viện ảnh sản phẩm hỗ trợ zoom khi di chuột, chọn ảnh thu nhỏ và lightbox toàn màn hình.
 */
export default function ProductGallery({
  product,
  activeColorway = null,
  badge = null,
  onSelectColorway = null,
}) {
  const slides = useMemo(() => {
    const list = [];
    const seen = new Set();

    const pushSlide = (src, label, colorway = null) => {
      if (!src || seen.has(src)) return;
      seen.add(src);
      list.push({ src, label, colorway });
    };

    if (product?.colorways?.length) {
      product.colorways.forEach((cw) => {
        pushSlide(cw.image, `${product.name} - ${cw.name}`, cw);
      });
    }

    if (Array.isArray(product?.gallery)) {
      product.gallery.forEach((src, idx) => {
        pushSlide(src, `${product.name} - Góc ${idx + 1}`);
      });
    }

    pushSlide(product?.image, product?.name ?? 'Sản phẩm');
    return list;
  }, [product]);

  const activeColorwayIndex = useMemo(() => {
    if (!activeColorway?.image) return 0;
    const idx = slides.findIndex((slide) => slide.src === activeColorway.image);
    return idx >= 0 ? idx : 0;
  }, [activeColorway, slides]);

  const [activeIndex, setActiveIndex] = useState(activeColorwayIndex);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);

  useEffect(() => {
    setActiveIndex(activeColorwayIndex);
  }, [activeColorwayIndex, product?.id]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxZoomed(false);
      } else if (event.key === 'ArrowRight' && slides.length > 1) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
        setLightboxZoomed(false);
      } else if (event.key === 'ArrowLeft' && slides.length > 1) {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setLightboxZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, slides.length]);

  const currentSlide = slides[activeIndex] ?? slides[0] ?? null;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleSelectSlide = (index) => {
    setActiveIndex(index);
    const chosen = slides[index];
    if (chosen?.colorway && onSelectColorway) {
      onSelectColorway(chosen.colorway);
    }
  };

  return (
    <div className="product-gallery">
      <div
        className={`detail-image product-gallery-stage${isZooming ? ' is-zooming' : ''}${currentSlide ? ' is-interactive' : ''}`}
        onMouseEnter={() => currentSlide && setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={currentSlide ? handleMouseMove : undefined}
        onClick={() => currentSlide && setIsLightboxOpen(true)}
        role={currentSlide ? 'button' : undefined}
        tabIndex={currentSlide ? 0 : undefined}
        aria-label={currentSlide ? `Phóng to ảnh ${currentSlide.label}` : undefined}
        onKeyDown={(event) => {
          if (currentSlide && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
      >
        {badge && (
          <span className={`shop-card-tag${badge.tone ? ` shop-card-tag--${badge.tone}` : ''}`}>
            {badge.label}
          </span>
        )}

        {currentSlide ? (
          <>
            <img
              src={currentSlide.src}
              alt={currentSlide.label}
              className="product-gallery-img"
              style={
                isZooming
                  ? {
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }
                  : undefined
              }
            />
            <span className="product-gallery-hint" aria-hidden="true">
              <span className="icon">zoom_in</span>
              Bấm để xem lớn
            </span>
          </>
        ) : (
          <span className="detail-image-placeholder icon" aria-label="Chưa có ảnh sản phẩm">
            image
          </span>
        )}
      </div>

      {slides.length > 1 && (
        <div className="product-gallery-thumbs" role="tablist" aria-label="Ảnh sản phẩm">
          {slides.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              className={`product-gallery-thumb${idx === activeIndex ? ' active' : ''}`}
              onClick={() => handleSelectSlide(idx)}
              title={slide.label}
            >
              <img src={slide.src} alt={slide.label} />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && currentSlide && (
        <div
          className="gallery-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh lớn: ${currentSlide.label}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsLightboxOpen(false);
              setLightboxZoomed(false);
            }
          }}
        >
          <div className="gallery-lightbox-toolbar">
            <span className="gallery-lightbox-caption">
              {currentSlide.label}
              {slides.length > 1 ? ` (${activeIndex + 1}/${slides.length})` : ''}
            </span>
            <div className="gallery-lightbox-controls">
              <button
                type="button"
                className="gallery-lightbox-btn"
                onClick={() => setLightboxZoomed((prev) => !prev)}
                aria-label={lightboxZoomed ? 'Thu nhỏ ảnh' : 'Phóng to ảnh'}
              >
                <span className="icon">{lightboxZoomed ? 'zoom_out' : 'zoom_in'}</span>
              </button>
              <button
                type="button"
                className="gallery-lightbox-btn"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoomed(false);
                }}
                aria-label="Đóng xem ảnh lớn"
              >
                <span className="icon">close</span>
              </button>
            </div>
          </div>

          <div className="gallery-lightbox-body">
            {slides.length > 1 && (
              <button
                type="button"
                className="gallery-lightbox-nav gallery-lightbox-nav--prev"
                onClick={() => {
                  setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
                  setLightboxZoomed(false);
                }}
                aria-label="Ảnh trước"
              >
                <span className="icon">chevron_left</span>
              </button>
            )}

            <img
              src={currentSlide.src}
              alt={currentSlide.label}
              className={`gallery-lightbox-img${lightboxZoomed ? ' is-zoomed' : ''}`}
              onClick={() => setLightboxZoomed((prev) => !prev)}
            />

            {slides.length > 1 && (
              <button
                type="button"
                className="gallery-lightbox-nav gallery-lightbox-nav--next"
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % slides.length);
                  setLightboxZoomed(false);
                }}
                aria-label="Ảnh kế tiếp"
              >
                <span className="icon">chevron_right</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
