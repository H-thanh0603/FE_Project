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

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const selectSuggestion = (suggestion) => {
    onChange(suggestion.label);
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/products/${suggestion.id}`);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
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
          {suggestions.length === 0 ? (
            <p className="search-suggestions-empty">Không có gợi ý phù hợp.</p>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                id={`search-suggestion-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`search-suggestion${index === activeIndex ? ' active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
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
