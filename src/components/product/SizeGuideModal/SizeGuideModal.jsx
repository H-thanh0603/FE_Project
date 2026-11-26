import { useMemo, useState } from 'react';
import Modal from '../../common/Modal/Modal';
import './SizeGuideModal.css';

const SIZE_CHART = [
  { eu: 38, cm: 24.0, cmLabel: '24.0', us: '5.5', uk: '5.0' },
  { eu: 39, cm: 24.5, cmLabel: '24.5', us: '6.5', uk: '6.0' },
  { eu: 40, cm: 25.0, cmLabel: '25.0', us: '7.0', uk: '6.5' },
  { eu: 41, cm: 26.0, cmLabel: '26.0', us: '8.0', uk: '7.5' },
  { eu: 42, cm: 26.5, cmLabel: '26.5', us: '8.5', uk: '8.0' },
  { eu: 43, cm: 27.5, cmLabel: '27.5', us: '9.5', uk: '9.0' },
  { eu: 44, cm: 28.0, cmLabel: '28.0', us: '10.0', uk: '9.5' },
];

const FOOT_SHAPES = [
  { id: 'narrow', label: 'Chân thon', offset: 0 },
  { id: 'regular', label: 'Bình thường', offset: 0 },
  { id: 'wide', label: 'Chân bè / Mu cao', offset: 1 },
];

function findRecommendedRow(footLengthCm, shapeOffset) {
  if (!Number.isFinite(footLengthCm) || footLengthCm < 21 || footLengthCm > 31) {
    return null;
  }
  let baseIdx = SIZE_CHART.findIndex((row) => footLengthCm <= row.cm);
  if (baseIdx === -1) baseIdx = SIZE_CHART.length - 1;
  const adjustedIdx = Math.min(SIZE_CHART.length - 1, baseIdx + shapeOffset);
  return SIZE_CHART[adjustedIdx];
}

/**
 * Modal hiển thị bộ tính size tự động, bảng quy đổi kích cỡ và cách đo chân.
 */
export default function SizeGuideModal({
  isOpen,
  onClose,
  availableSizes = [],
  onSelectSize = null,
}) {
  const [footLength, setFootLength] = useState('25.5');
  const [footShape, setFootShape] = useState('regular');

  const activeShape = FOOT_SHAPES.find((shape) => shape.id === footShape) ?? FOOT_SHAPES[1];
  const parsedLength = parseFloat(footLength);

  const recommended = useMemo(
    () => findRecommendedRow(parsedLength, activeShape.offset),
    [parsedLength, activeShape.offset],
  );

  const isRecommendedAvailable =
    recommended &&
    (availableSizes.length === 0 || availableSizes.includes(recommended.eu));

  const nearestAvailable = useMemo(() => {
    if (!recommended || availableSizes.length === 0 || isRecommendedAvailable) return null;
    return availableSizes.reduce((best, candidate) =>
      Math.abs(candidate - recommended.eu) < Math.abs(best - recommended.eu)
        ? candidate
        : best,
    );
  }, [recommended, availableSizes, isRecommendedAvailable]);

  const handleApplySize = (sizeEu) => {
    if (!onSelectSize) return;
    onSelectSize(sizeEu);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng hướng dẫn chọn size giày">
      <div className="size-guide-intro">
        Nhập chiều dài bàn chân để hệ thống gợi ý size phù hợp hoặc tra trực tiếp bảng quy đổi bên dưới.
      </div>

      <section className="size-finder" aria-label="Gợi ý chọn size tự động">
        <div className="size-finder-title">
          <span className="icon" style={{ fontSize: 18 }}>calculate</span>
          Tính size tự động
        </div>

        <div className="size-finder-grid">
          <label className="size-finder-field">
            <span className="size-finder-label">Chiều dài chân (cm)</span>
            <div className="size-finder-input-wrap">
              <input
                type="number"
                min="22"
                max="30"
                step="0.5"
                value={footLength}
                onChange={(e) => setFootLength(e.target.value)}
                className="size-finder-input"
              />
              <span className="size-finder-unit">cm</span>
            </div>
          </label>

          <div className="size-finder-field">
            <span className="size-finder-label">Form bàn chân</span>
            <div className="size-finder-shapes" role="radiogroup" aria-label="Form bàn chân">
              {FOOT_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  role="radio"
                  aria-checked={footShape === shape.id}
                  className={`size-finder-shape${footShape === shape.id ? ' active' : ''}`}
                  onClick={() => setFootShape(shape.id)}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {recommended ? (
          <div className="size-finder-result">
            <div className="size-finder-result-info">
              <span className="size-finder-result-badge">EU {recommended.eu}</span>
              <div>
                <strong>Gợi ý chuẩn cho bạn: Size {recommended.eu}</strong>
                <div className="size-finder-result-sub">
                  US {recommended.us} · UK {recommended.uk} · Chân ~{recommended.cmLabel} cm
                  {activeShape.offset > 0 ? ' (đã +1 size cho chân bè)' : ''}
                </div>
              </div>
            </div>

            {onSelectSize && isRecommendedAvailable && (
              <button
                type="button"
                className="btn btn--primary size-finder-apply"
                onClick={() => handleApplySize(recommended.eu)}
              >
                Chọn size {recommended.eu}
              </button>
            )}

            {onSelectSize && !isRecommendedAvailable && nearestAvailable && (
              <button
                type="button"
                className="btn btn--dark size-finder-apply"
                onClick={() => handleApplySize(nearestAvailable)}
              >
                Mẫu này không có {recommended.eu} · Chọn {nearestAvailable}
              </button>
            )}
          </div>
        ) : (
          <p className="size-finder-error">
            Nhập chiều dài chân từ 22 đến 30 cm để nhận gợi ý size.
          </p>
        )}
      </section>

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
              <tr
                key={row.eu}
                className={recommended?.eu === row.eu ? 'is-recommended' : undefined}
              >
                <td className="highlight-col">{row.eu}</td>
                <td>{row.cmLabel}</td>
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
