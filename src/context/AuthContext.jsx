import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * ⚠️ Xác thực chỉ MÔ PHỎNG phía frontend:
 * - Tài khoản đăng ký chỉ lưu tên + email vào LocalStorage.
 * - Mật khẩu chỉ dùng để kiểm tra hợp lệ trên biểu mẫu, KHÔNG được lưu trữ.
 * - Không phải xác thực thật; khi có backend cần thay bằng API (JWT, session...).
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, null);
  // Danh sách tài khoản đã đăng ký (không chứa mật khẩu)
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.ACCOUNTS, []);

  /** Đăng nhập bằng email; chưa có tài khoản nào thì vào chế độ demo */
  const login = (email) => {
    const normalized = email.trim().toLowerCase();

    if (accounts.length === 0) {
      // Chế độ demo: chấp nhận mọi email, tạo tài khoản tạm không lưu danh sách
      setUser({
        name: normalized.split('@')[0] || 'Khách',
        email: normalized,
        demo: true,
      });
      return { ok: true };
    }

    const found = accounts.find(
      (account) => account.email.toLowerCase() === normalized,
    );
    if (!found) {
      return { ok: false, error: 'Email chưa được đăng ký. Hãy tạo tài khoản trước.' };
    }

    setUser(found);
    return { ok: true };
  };

  /** Đăng ký tài khoản mới; mật khẩu không được lưu vào đâu cả */
  const register = ({ name, email }) => {
    const normalized = email.trim().toLowerCase();

    if (accounts.some((account) => account.email.toLowerCase() === normalized)) {
      return { ok: false, error: 'Email này đã được đăng ký. Hãy đăng nhập.' };
    }

    const account = {
      name: name.trim(),
      email: normalized,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, account]);
    setUser(account);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, accounts, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  }
  return context;
}
