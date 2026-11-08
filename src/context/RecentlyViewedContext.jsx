import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const RecentlyViewedContext = createContext(null);
const MAX_RECENTLY_VIEWED = 8;

export function RecentlyViewedProvider({ children }) {
  const [productIds, setProductIds] = useLocalStorage(
    STORAGE_KEYS.RECENTLY_VIEWED,
    [],
  );

  const recordView = useCallback((productId) => {
    setProductIds((previous) => [
      productId,
      ...previous.filter((id) => id !== productId),
    ].slice(0, MAX_RECENTLY_VIEWED));
  }, [setProductIds]);

  const clearRecentlyViewed = useCallback(() => setProductIds([]), [setProductIds]);

  const value = useMemo(
    () => ({ productIds, recordView, clearRecentlyViewed }),
    [productIds, recordView, clearRecentlyViewed],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed phải được dùng bên trong <RecentlyViewedProvider>');
  }
  return context;
}
