import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { preferencesService } from '../services/preferencesService';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(() => preferencesService.getTheme());

  // Aplicar el tema al cambiar el estado
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    preferencesService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-lg shadow-lg transition-all hover:scale-110 hover:border-yellow-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400"
      title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      aria-label={t('theme.toggle')}
    >
      <span className="transform transition-transform duration-500 hover:rotate-12">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
