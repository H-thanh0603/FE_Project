import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateItemCount, calculateTotal } from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Giỏ hàng được lưu trong LocalStorage nên không mất khi tải lại trang
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.CART, []);

  /** Thêm giày vào giỏ; trùng sản phẩm + size thì cộng dồn số lượng */
  const addItem = (product, size, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (item) => item.id === product.id && item.size === size,
      );
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
  };

  /** Cập nhật số lượng; nhỏ hơn hoặc bằng 0 thì xóa khỏi giỏ */
  const updateQuantity = (id, size, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => !(item.id === id && item.size === size))
        : prev.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item,
          ),
    );
  };

  const removeItem = (id, size) =>
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount: calculateItemCount(items),
      total: calculateTotal(items),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được dùng bên trong <CartProvider>');
  }
  return context;
}
