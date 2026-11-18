import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

export const MAX_COMPARE = 4;

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  // Danh sách id sản phẩm đang so sánh, tối đa MAX_COMPARE
  const [productIds, setProductIds] = useLocalStorage(STORAGE_KEYS.COMPARE, []);

  const isComparing = (productId) => productIds.includes(productId);
  const isFull = productIds.length >= MAX_COMPARE;

  const toggleCompare = (productId) =>
    setProductIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, productId];
    });

  const removeCompare = (productId) =>
    setProductIds((prev) => prev.filter((id) => id !== productId));

  const clearCompare = () => setProductIds([]);

  const value = useMemo(
    () => ({
      productIds,
      isComparing,
      isFull,
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [productIds],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare phải được dùng bên trong <CompareProvider>');
  }
  return context;
}
