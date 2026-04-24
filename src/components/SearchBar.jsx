import { useState, useEffect, useRef } from 'react';


function CheckboxDropdown({ label, options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(next);
  };


  const displayText =
    selected.length === 0
      ? label
      : selected.length <= 2
        ? selected.join(', ')
        : `${selected.length} seleccionados`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-full md:w-48 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors text-left"
      >
        <span className="truncate text-sm">{displayText}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
          { }
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full px-4 py-2 text-xs text-blue-400 hover:bg-slate-700/50 text-left transition-colors border-b border-slate-700"
            >
              Limpiar selección
            </button>
          )}

          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-slate-200">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}


export default function SearchBar({
  onSearch,
  typeOptions = [],
  rarityOptions = [],
  debounceMs = 300,
}) {
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


    if (debounceTimer.current) clearTimeout(debounceTimer.current);


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
      { }
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
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={handleTextChange}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      { }
      {typeOptions.length > 0 && (
        <CheckboxDropdown
          label="Tipos"
          options={typeOptions}
          selected={selectedTypes}
          onChange={handleTypesChange}
        />
      )}
      {rarityOptions.length > 0 && (
        <CheckboxDropdown
          label="Rarezas"
          options={rarityOptions}
          selected={selectedRarities}
          onChange={handleRaritiesChange}
        />
      )}
    </div>
  );
}
