import { Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCompare, MAX_COMPARE } from '../context/CompareContext';
import CompareTable from '../components/compare/CompareTable/CompareTable';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Compare() {
  useDocumentTitle('So sánh sản phẩm');
  const { productIds, clearCompare } = useCompare();
  const products = productIds.map(getProductById).filter(Boolean);

  return (
    <div className="container">
      <div className="page">
        <div>
          <div className="eyebrow">Đối chiếu trực tiếp</div>
          <h1 className="section-title">So Sánh Sản Phẩm</h1>
        </div>

        <p className="page-note">
          Đang so sánh <strong>{products.length}/{MAX_COMPARE}</strong> sản phẩm
        </p>

        {products.length === 0 ? (
          <div className="empty-state">
            <span className="icon">compare_arrows</span>
            <p>
              Bạn chưa chọn sản phẩm nào để so sánh. Bấm biểu tượng so sánh trên thẻ sản phẩm
              để thêm vào danh sách.
            </p>
            <Link to="/products" className="btn btn--dark">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <CompareTable products={products} />
            <div className="compare-actions">
              <Link to="/products" className="btn btn--outline">
                Thêm sản phẩm khác
              </Link>
              <button type="button" className="btn btn--outline" onClick={clearCompare}>
                Xóa tất cả
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
