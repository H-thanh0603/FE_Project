import { useState, useEffect } from 'react';

/**
 * Đồng bộ một state với localStorage.
 * @param {string} key           Khóa lưu trữ (dùng các hằng trong utils/constants.js)
 * @param {*}      initialValue  Giá trị mặc định khi chưa có dữ liệu
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Bỏ qua khi localStorage đầy hoặc bị trình duyệt chặn
    }
  }, [key, value]);

  return [value, setValue];
}
