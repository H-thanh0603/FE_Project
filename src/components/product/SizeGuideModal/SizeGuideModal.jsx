import Modal from '../../common/Modal/Modal';
import './SizeGuideModal.css';

const SIZE_CHART = [
  { eu: 38, cm: '24.0', us: '5.5', uk: '5.0' },
  { eu: 39, cm: '24.5', us: '6.5', uk: '6.0' },
  { eu: 40, cm: '25.0', us: '7.0', uk: '6.5' },
  { eu: 41, cm: '26.0', us: '8.0', uk: '7.5' },
  { eu: 42, cm: '26.5', us: '8.5', uk: '8.0' },
  { eu: 43, cm: '27.5', us: '9.5', uk: '9.0' },
  { eu: 44, cm: '28.0', us: '10.0', uk: '9.5' },
];

/**
 * Modal hiển thị bảng quy đổi kích cỡ và cách đo chân.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 */
export default function SizeGuideModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng hướng dẫn chọn size giày">
      <div className="size-guide-intro">
        Chọn đúng kích cỡ giúp bạn có trải nghiệm êm ái và vận động tối ưu nhất.
      </div>

      <div className="size-guide-steps">
        <div className="size-guide-steps-title">
          <span className="icon" style={{ fontSize: 16 }}>straighten</span>
          Cách đo chiều dài bàn chân tại nhà
        </div>
        <ol>
          <li>Đặt tờ giấy trắng A4 áp sát chân tường phẳng.</li>
          <li>Đặt bàn chân lên giấy, gót chân chạm nhẹ vào tường.</li>
          <li>Dùng bút vạch điểm đầu ngón chân dài nhất trên giấy.</li>
          <li>Đo khoảng cách từ mép giấy đến vạch vừa đánh dấu để lấy số cm.</li>
        </ol>
      </div>

      <div className="size-table-wrapper">
        <table className="size-table">
          <thead>
            <tr>
              <th className="highlight-col">Size EU</th>
              <th>Chiều dài chân (cm)</th>
              <th>Size US</th>
              <th>Size UK</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.eu}>
                <td className="highlight-col">{row.eu}</td>
                <td>{row.cm}</td>
                <td>{row.us}</td>
                <td>{row.uk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="size-guide-note">
        * Mẹo: Nếu mu bàn chân dày hoặc chân bè ngang, bạn nên tăng thêm 1 size (+0.5cm đến 1cm) để đi thoải mái hơn.
      </p>
    </Modal>
  );
}
