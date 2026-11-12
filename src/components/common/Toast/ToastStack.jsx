import { useToast } from '../../../context/ToastContext';
import './ToastStack.css';

const TOAST_ICONS = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

/** Khu vực hiển thị các toast đang hoạt động ở góc trên bên phải. */
export default function ToastStack() {
  const { toasts, dismissToast } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span className="icon toast-icon">{TOAST_ICONS[toast.type] ?? 'info'}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            aria-label="Đóng thông báo"
            onClick={() => dismissToast(toast.id)}
          >
            <span className="icon">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
