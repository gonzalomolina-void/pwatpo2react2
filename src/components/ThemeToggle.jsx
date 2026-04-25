import { useState, useEffect } from 'react';
import { preferencesService } from '../services/preferencesService';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => preferencesService.getTheme());

  // Aplicar el tema al cargar y cuando cambie el estado
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    preferencesService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-lg hover:scale-110 hover:border-yellow-500 dark:hover:border-blue-400 transition-all shadow-lg active:scale-95"
      title={theme === 'dark' ? 'Invocar Modo Luz' : 'Abrazar las Sombras'}
      aria-label="Cambiar tema"
    >
      <span className="transform transition-transform duration-500 hover:rotate-12">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
