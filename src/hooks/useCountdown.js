import { useEffect, useState } from 'react';

/**
 * Đếm ngược từ `totalSeconds` (hoặc tới một mốc thời gian tuyệt đối `target`).
 * Trả về số ngày / giờ / phút / giây còn lại, cập nhật mỗi giây.
 * Dùng cho khối Flash Drop trên trang chủ.
 */
export default function useCountdown({ totalSeconds = 0, target = null } = {}) {
  const [remaining, setRemaining] = useState(() => {
    if (target) {
      return Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000));
    }
    return Math.max(0, totalSeconds);
  });

  useEffect(() => {
    const tick = () =>
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
  };
}
