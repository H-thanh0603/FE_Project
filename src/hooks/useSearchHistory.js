import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const MAX_HISTORY = 5;

/** Lịch sử từ khóa tìm kiếm gần nhất, mới nhất đứng đầu, không trùng lặp. */
export default function useSearchHistory() {
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.SEARCH_HISTORY, []);

  const addTerm = (term) => {
    const value = term.trim();
    if (!value) return;

    setHistory((prev) =>
      [value, ...prev.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(
        0,
        MAX_HISTORY,
      ),
    );
  };

  const clearHistory = () => setHistory([]);

  return { history, addTerm, clearHistory };
}
