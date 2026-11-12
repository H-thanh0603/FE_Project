import { useEffect } from 'react';

const BASE_TITLE = 'KINETIC — Giày Thể Thao Chính Hãng';

/**
 * Hook cập nhật document.title theo từng trang.
 * @param {string} [title]
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | KINETIC` : BASE_TITLE;
  }, [title]);
}
