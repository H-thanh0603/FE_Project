import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * ⚠️ Đăng nhập chỉ MÔ PHỎNG phía frontend: mọi tên nhập vào đều được chấp nhận,
 * chỉ lưu thông tin hiển thị trong LocalStorage. Đây không phải xác thực thật
 * và KHÔNG lưu mật khẩu — khi có backend cần thay bằng API xác thực (JWT, session...).
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, null);

  const login = (name) =>
    setUser({ name, loggedInAt: new Date().toISOString() });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
