import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Danh sách id sản phẩm yêu thích, lưu trong LocalStorage
  const [productIds, setProductIds] = useLocalStorage(STORAGE_KEYS.WISHLIST, []);

  const toggleWishlist = (productId) =>
    setProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

  const isWishlisted = (productId) => productIds.includes(productId);

  const value = useMemo(
    () => ({ productIds, toggleWishlist, isWishlisted }),
    [productIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist phải được dùng bên trong <WishlistProvider>');
  }
  return context;
}
