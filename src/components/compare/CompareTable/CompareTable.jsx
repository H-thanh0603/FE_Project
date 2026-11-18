import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useCompare } from '../../../context/CompareContext';
import { useToast } from '../../../context/ToastContext';
import { getBrandName } from '../../../services/productService';
import formatPrice from '../../../utils/formatPrice';
import homepage from '../../../data/homepage.json';
import './CompareTable.css';

const TAG_LABELS = {
  new: 'Mới',
  bestseller: 'Bán chạy',
  sale: 'Giảm giá',
  limited: 'Limited',
  pro: 'Pro',
};

function getCategoryName(categoryId) {
  return (
    homepage.categories.items.find((item) => item.category === categoryId)?.name ?? categoryId
  );
}

export default function CompareTable({ products }) {
  const { removeCompare } = useCompare();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product) => {
    const size = product.sizes[0];
    addItem(product, size);
    showToast(`Đã thêm ${product.name} (size ${size}) vào giỏ.`);
  };

  const rows = [
    {
      label: 'Giá',
      render: (product) => (
        <span className="compare-price">{formatPrice(product.price)}</span>
      ),
    },
    { label: 'Thương hiệu', render: (product) => getBrandName(product.brandId) },
    { label: 'Danh mục', render: (product) => getCategoryName(product.category) },
    {
      label: 'Đánh giá',
      render: (product) =>
        product.rating ? (
          <span className="compare-rating">
            <span className="icon icon--fill">star</span>
            {product.rating} ({product.reviews})
          </span>
        ) : (
          '—'
        ),
    },
    { label: 'Kích cỡ', render: (product) => product.sizes.join(' · ') },
    {
      label: 'Màu sắc',
      render: (product) => (
        <span className="compare-colors">
          {product.colors.map((color) => (
            <span
              key={color}
              className="shop-card-swatch"
              style={{ background: color }}
              title={color}
            />
          ))}
        </span>
      ),
    },
    {
      label: 'Nhãn',
      render: (product) => product.tags.map((tag) => TAG_LABELS[tag] ?? tag).join(' · '),
    },
    { label: 'Mô tả', render: (product) => product.description },
    {
      label: 'Hành động',
      render: (product) => (
        <button type="button" className="btn btn--dark" onClick={() => handleAddToCart(product)}>
          <span className="icon">shopping_bag</span>
          Thêm vào giỏ
        </button>
      ),
    },
  ];

  return (
    <div className="compare-scroll">
      <table className="compare-table">
        <caption className="compare-caption">
          So sánh {products.length} sản phẩm đã chọn
        </caption>
        <thead>
          <tr>
            <th scope="col" className="compare-corner">
              Sản phẩm
            </th>
            {products.map((product) => (
              <th key={product.id} scope="col">
                <div className="compare-head">
                  <Link to={`/products/${product.id}`} className="compare-head-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span className="icon">image</span>
                    )}
                  </Link>
                  <Link to={`/products/${product.id}`} className="compare-head-name">
                    {product.name}
                  </Link>
                  <button
                    type="button"
                    className="compare-remove"
                    onClick={() => removeCompare(product.id)}
                  >
                    <span className="icon">close</span>
                    Bỏ chọn
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {products.map((product) => (
                <td key={product.id}>{row.render(product)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
