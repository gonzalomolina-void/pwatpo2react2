import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxDropdown from './CheckboxDropdown';

export default function SearchBar({
  onSearch,
  typeOptions = [],
  rarityOptions = [],
  debounceMs = 300,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const debounceTimer = useRef(null);

  const emitSearch = (overrides = {}) => {
    const payload = {
      searchTerm,
      selectedTypes,
      selectedRarities,
      ...overrides,
    };
    onSearch(payload);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer.current) {
       clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      emitSearch({ searchTerm: value });
    }, debounceMs);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    emitSearch({ searchTerm: '' });
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleTypesChange = (newTypes) => {
    setSelectedTypes(newTypes);
    emitSearch({ selectedTypes: newTypes });
  };

  const handleRaritiesChange = (newRarities) => {
    setSelectedRarities(newRarities);
    emitSearch({ selectedRarities: newRarities });
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="relative grow">
        <svg
          className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={handleTextChange}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-10 pl-10 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-800 focus:outline-none dark:text-slate-400 dark:hover:text-slate-200"
            aria-label={t('search.clear')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {typeOptions.length > 0 && (
        <CheckboxDropdown
          label={t('search.types')}
          options={typeOptions}
          selected={selectedTypes}
          onChange={handleTypesChange}
        />
      )}
      {rarityOptions.length > 0 && (
        <CheckboxDropdown
          label={t('search.rarities')}
          options={rarityOptions}
          selected={selectedRarities}
          onChange={handleRaritiesChange}
        />
      )}
    </div>
  );
}
