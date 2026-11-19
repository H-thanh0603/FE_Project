import { useEffect } from 'react';

/**
 * Thêm class "is-visible" cho các phần tử khớp `selector` bên trong `rootRef`
 * khi chúng cuộn vào viewport. Dùng một Observer cho toàn bộ danh sách,
 * tự ngừng observe sau khi phần tử hiện ra (chỉ chạy 1 lần).
 */
export default function useScrollReveal(rootRef, selector = 'section') {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll(selector));
    if (targets.length === 0) return undefined;

    // Chỉ bật trạng thái ẩn khi JS chạy — nếu JS tắt, nội dung vẫn hiện bình thường.
    root.classList.add('reveal-enabled');
    if (targets.length === 0) return undefined;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef, selector]);
}
