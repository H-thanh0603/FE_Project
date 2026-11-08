import { useState, useEffect } from 'react';

/**
 * Trả về giá trị sau khi người dùng ngừng thay đổi trong `delay` ms.
 * Hữu ích cho ô tìm kiếm để tránh lọc dữ liệu liên tục khi đang gõ.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
