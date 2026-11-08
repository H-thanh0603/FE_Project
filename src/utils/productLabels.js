export function getProductBadge(product) {
  if (product.tags.includes('limited')) {
    return { label: 'LIMITED', tone: 'lime' };
  }

  if (product.tags.includes('sale') && product.oldPrice) {
    const discount = Math.round((1 - product.price / product.oldPrice) * 100);
    return { label: `-${discount}%`, tone: 'red-dark' };
  }

  if (product.tags.includes('pro')) {
    return { label: 'PRO HOOPS', tone: 'black' };
  }

  if (product.tags.includes('bestseller')) {
    return { label: 'HOT SELLER', tone: 'black' };
  }

  if (product.tags.includes('new')) {
    return { label: 'NEW DROP', tone: '' };
  }

  return null;
}
