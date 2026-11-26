import { STORAGE_KEYS } from '../utils/constants';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Bỏ qua nếu localStorage đầy hoặc bị chặn
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Tính tồn kho mặc định ổn định theo (product, size) nếu products.json chưa khai báo stockBySize.
 * Đảm bảo có phân bố tự nhiên (hết hàng / sắp hết / còn hàng) và luôn có ít nhất 1 size còn hàng.
 */
function getBaseSizeStock(product, size) {
  if (!product) return 0;
  if (product.stockBySize && typeof product.stockBySize[size] === 'number') {
    return Math.max(0, product.stockBySize[size]);
  }
  const sizes = product.sizes ?? [];
  const sizeIndex = sizes.indexOf(size);
  const seed = hashString(`${product.id}:${size}`);
  // Cho tối đa 1 size ở cuối/giữa hết hàng để mô phỏng trải nghiệm "báo khi có hàng"
  const outIndex = sizes.length >= 3 ? hashString(product.id) % sizes.length : -1;
  if (sizeIndex === outIndex && sizeIndex !== 0) {
    return 0;
  }
  const pool = [1, 2, 2, 4, 5, 6, 8, 9];
  return pool[seed % pool.length];
}

export function getSizeStock(product, size) {
  if (!product || size == null) return 0;
  const overrides = readJson(STORAGE_KEYS.STOCK_OVERRIDES, {});
  const key = `${product.id}:${size}`;
  if (typeof overrides[key] === 'number') {
    return Math.max(0, overrides[key]);
  }
  return getBaseSizeStock(product, size);
}

export function getProductStockMap(product) {
  if (!product?.sizes?.length) return {};
  const map = {};
  product.sizes.forEach((size) => {
    map[size] = getSizeStock(product, size);
  });
  return map;
}

/**
 * Trừ tồn kho mô phỏng sau khi đặt hàng thành công.
 */
export function deductStockForItems(items, productLookup) {
  if (!Array.isArray(items) || items.length === 0) return;
  const overrides = readJson(STORAGE_KEYS.STOCK_OVERRIDES, {});
  items.forEach((item) => {
    if (!item?.id || item.size == null) return;
    const key = `${item.id}:${item.size}`;
    const product = productLookup ? productLookup(item.id) : null;
    const current =
      typeof overrides[key] === 'number'
        ? overrides[key]
        : product
          ? getBaseSizeStock(product, item.size)
          : 5;
    overrides[key] = Math.max(0, current - (item.quantity || 1));
  });
  writeJson(STORAGE_KEYS.STOCK_OVERRIDES, overrides);
}

export function getRestockSubscriptions() {
  return readJson(STORAGE_KEYS.RESTOCK_SUBSCRIPTIONS, []);
}

export function isSubscribedRestock(productId, size) {
  return getRestockSubscriptions().some(
    (entry) => entry.productId === productId && entry.size === size,
  );
}

export function subscribeRestock({ productId, size, email }) {
  const list = getRestockSubscriptions();
  const exists = list.some(
    (entry) => entry.productId === productId && entry.size === size,
  );
  if (exists) {
    return { ok: true, alreadySubscribed: true };
  }
  const next = [
    {
      productId,
      size,
      email: email.trim(),
      createdAt: new Date().toISOString(),
    },
    ...list,
  ];
  writeJson(STORAGE_KEYS.RESTOCK_SUBSCRIPTIONS, next);
  return { ok: true, alreadySubscribed: false };
}
