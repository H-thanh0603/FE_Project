import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * ⚠️ Thông báo trong ứng dụng chỉ MÔ PHỎNG, lưu trong LocalStorage.
 * Được tạo khi đặt đơn hoặc đổi trạng thái đơn; khi có backend cần thay bằng API.
 */
const NotificationContext = createContext(null);

const MAX_NOTIFICATIONS = 20;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useLocalStorage(STORAGE_KEYS.NOTIFICATIONS, []);

  /** Thêm thông báo mới lên đầu danh sách, giữ tối đa MAX_NOTIFICATIONS mục */
  const pushNotification = ({ title, message, link = null }) =>
    setNotifications((prev) =>
      [
        {
          id: `noti-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          message,
          link,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, MAX_NOTIFICATIONS),
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

  const clearNotifications = () => setNotifications([]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      pushNotification,
      markAllRead,
      clearNotifications,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notifications],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications phải được dùng bên trong <NotificationProvider>');
  }
  return context;
}
