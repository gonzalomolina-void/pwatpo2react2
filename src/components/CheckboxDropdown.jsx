import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function CheckboxDropdown({ label, options, selected, onChange }) {
  const { t } = useTranslation();
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
        : `${selected.length} ${t('search.selected')}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left text-slate-900 transition-colors hover:border-blue-500 focus:border-blue-500 focus:outline-none md:w-48 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      >
        <span className="truncate text-sm">{displayText}</span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute z-20 mt-2 w-full min-w-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full border-b border-slate-100 px-4 py-2 text-left text-xs text-blue-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-700/50"
            >
              {t('search.clear')}
            </button>
          )}

          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-0 dark:border-slate-600 dark:bg-slate-900"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default CheckboxDropdown;
