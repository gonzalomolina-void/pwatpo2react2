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
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
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
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
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
