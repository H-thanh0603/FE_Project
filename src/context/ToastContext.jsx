import { createContext, useCallback, useContext, useRef, useState } from 'react';

/**
 * Thông báo nổi (toast) dùng chung toàn ứng dụng.
 * Mỗi toast tự ẩn sau AUTO_DISMISS_MS; không lưu trữ, chỉ tồn tại trong phiên.
 */
const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /** Hiện một toast; type: 'success' | 'error' | 'info' */
  const showToast = useCallback(
    (message, type = 'success') => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
      return id;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được dùng bên trong <ToastProvider>');
  }
  return context;
}
