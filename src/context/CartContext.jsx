import { createContext, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateItemCount, calculateTotal } from '../services/cartService';
import { calculateDiscount, validateCoupon } from '../services/couponService';

const CartContext = createContext(null);

function normalizeColorway(colorway) {
  if (!colorway) return null;
  if (typeof colorway === 'string') return colorway;
  return colorway.name ?? null;
}

function isSameCartItem(item, id, size, colorway) {
  return (
    item.id === id &&
    item.size === size &&
    (item.colorway ?? null) === (colorway ?? null)
  );
}

export function CartProvider({ children }) {
  // Giỏ hàng được lưu trong LocalStorage nên không mất khi tải lại trang
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.CART, []);
  // Mã giảm giá đang áp dụng, lưu lại để không mất khi tải lại trang
  const [coupon, setCoupon] = useLocalStorage(STORAGE_KEYS.COUPON, null);

  /** Thêm giày vào giỏ; trùng sản phẩm + size + phối màu thì cộng dồn số lượng */
  const addItem = (product, size, quantity = 1, colorway = null) => {
    const resolvedColorway = colorway ?? product.colorways?.[0] ?? product.colorway ?? null;
    const colorwayName = normalizeColorway(resolvedColorway);
    const image =
      (typeof resolvedColorway === 'object' && resolvedColorway?.image) ||
      product.image;

    setItems((prev) => {
      const index = prev.findIndex((item) =>
        isSameCartItem(item, product.id, size, colorwayName),
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
          image,
          size,
          ...(colorwayName ? { colorway: colorwayName } : {}),
          quantity,
        },
      ];
    });
  };

  /** Cập nhật số lượng; nhỏ hơn hoặc bằng 0 thì xóa khỏi giỏ */
  const updateQuantity = (id, size, quantity, colorway = null) => {
    const colorwayName = normalizeColorway(colorway);
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => !isSameCartItem(item, id, size, colorwayName))
        : prev.map((item) =>
            isSameCartItem(item, id, size, colorwayName) ? { ...item, quantity } : item,
          ),
    );
  };

  const removeItem = (id, size, colorway = null) => {
    const colorwayName = normalizeColorway(colorway);
    setItems((prev) =>
      prev.filter((item) => !isSameCartItem(item, id, size, colorwayName)),
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const total = calculateTotal(items);

  useEffect(() => {
    if (coupon && (items.length === 0 || total < (coupon.minSubtotal ?? 0))) {
      setCoupon(null);
    }
  }, [coupon, items.length, setCoupon, total]);

  /** Áp dụng mã giảm giá; trả về kết quả để UI hiển thị lỗi nếu có */
  const applyCoupon = (code) => {
    const result = validateCoupon(code, total);
    if (result.ok) setCoupon(result.coupon);
    return result;
  };

  const removeCoupon = () => setCoupon(null);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount: calculateItemCount(items),
      total,
      coupon,
      applyCoupon,
      removeCoupon,
      discount: calculateDiscount(coupon, total),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, coupon, total],
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
