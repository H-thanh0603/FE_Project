import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getBrandName } from '../../../services/productService';
import formatPrice from '../../../utils/formatPrice';
import './SearchAutocomplete.css';

const MAX_SUGGESTIONS = 6;

export default function SearchAutocomplete({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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
        label: product.name,
        meta: `${getBrandName(product.brandId)} · ${formatPrice(product.price)}`,
      }));
  }, [products, query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion) => {
    onChange(suggestion.label);
    setIsOpen(false);
    navigate(`/products/${suggestion.id}`);
  };

  return (
    <div className="search-autocomplete" ref={wrapperRef}>
      <span className="icon search-autocomplete-icon">search</span>
      <input
        type="search"
        className="input search-autocomplete-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && query && (
        <div className="search-suggestions">
          {suggestions.length === 0 ? (
            <p className="search-suggestions-empty">Không có gợi ý phù hợp.</p>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className="search-suggestion"
                onClick={() => selectSuggestion(suggestion)}
              >
                <span className="icon">search</span>
                <span className="search-suggestion-label">{suggestion.label}</span>
                <span className="search-suggestion-meta">{suggestion.meta}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
