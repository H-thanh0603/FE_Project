import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getBrandName } from '../../../services/productService';
import useSearchHistory from '../../../hooks/useSearchHistory';
import formatPrice from '../../../utils/formatPrice';
import './SearchAutocomplete.css';

const MAX_SUGGESTIONS = 6;

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit = null,
  placeholder = 'Tìm kiếm...',
}) {
  const navigate = useNavigate();
  const { history, addTerm, clearHistory } = useSearchHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const products = useMemo(() => getProducts(), []);
  const query = value.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!query) return [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          getBrandName(product.brandId).toLowerCase().includes(query),
      )
      .slice(0, MAX_SUGGESTIONS)
      .map((product) => ({
        id: product.id,
        type: 'product',
        label: product.name,
        meta: `${getBrandName(product.brandId)} · ${formatPrice(product.price)}`,
      }));
  }, [products, query]);

  // Ô trống thì gợi ý lịch sử, có từ khóa thì gợi ý sản phẩm
  const items = query
    ? suggestions
    : history.map((term) => ({ id: `history-${term}`, type: 'history', label: term, meta: '' }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const selectItem = (item) => {
    close();

    if (item.type === 'product') {
      if (value.trim()) addTerm(value);
      navigate(`/products/${item.id}`);
      return;
    }

    onChange(item.label);
    addTerm(item.label);
    if (onSubmit) onSubmit(item.label);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (!isOpen || activeIndex < 0)) {
      if (query) {
        event.preventDefault();
        addTerm(value);
        close();
        if (onSubmit) onSubmit(value.trim());
      }
      return;
    }

    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) {
        event.preventDefault();
        selectItem(items[activeIndex]);
      } else if (query) {
        event.preventDefault();
        addTerm(value);
        close();
        if (onSubmit) onSubmit(value.trim());
      }
    } else if (event.key === 'Escape') {
      close();
    }
  };

  return (
    <div className="search-autocomplete" ref={wrapperRef}>
      <span className="icon search-autocomplete-icon">search</span>
      <input
        type="search"
        className="input search-autocomplete-input"
        placeholder={placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && query && (
        <div className="search-suggestions" id="search-suggestions" role="listbox">
          {items.length === 0 ? (
            <p className="search-suggestions-empty">Không có gợi ý phù hợp.</p>
          ) : (
            items.map((item, index) => (
              <button
                key={item.id}
                id={`search-suggestion-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`search-suggestion${index === activeIndex ? ' active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectItem(item)}
              >
                <span className="icon">search</span>
                <span className="search-suggestion-label">{item.label}</span>
                {item.meta && <span className="search-suggestion-meta">{item.meta}</span>}
              </button>
            ))
          )}
        </div>
      )}

      {isOpen && !query && items.length > 0 && (
        <div className="search-suggestions" id="search-suggestions" role="listbox">
          <div className="search-suggestions-head">
            <span>Tìm kiếm gần đây</span>
            <button type="button" className="search-suggestions-clear" onClick={clearHistory}>
              Xóa lịch sử
            </button>
          </div>
          {items.map((item, index) => (
            <button
              key={item.id}
              id={`search-suggestion-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={`search-suggestion${index === activeIndex ? ' active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectItem(item)}
            >
              <span className="icon">history</span>
              <span className="search-suggestion-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
