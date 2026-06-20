import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { preferencesService } from '../services/preferencesService';
import { useAuth } from '../context/AuthContext';

export default function ThemeToggle() {
  const { t } = useTranslation();
  
  // Consumir el contexto de forma segura para no romper entornos de test sin provider
  let authContext = null;
  try {
    authContext = useAuth();
  } catch (error) {
    // Fallback silencioso si no está dentro de AuthProvider
  }

  const [localTheme, setLocalTheme] = useState(() => preferencesService.getTheme());
  const currentTheme = authContext ? authContext.theme : localTheme;

  // Aplicar tema en el DOM para entornos sin contexto
  useEffect(() => {
    if (!authContext) {
      const root = window.document.documentElement;
      if (localTheme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      preferencesService.setTheme(localTheme);
    }
  }, [localTheme, authContext]);

  // Sincronizar colorScheme y clase dark en el DOM reactivamente según el tema activo
  useEffect(() => {
    const root = window.document.documentElement;
    if (currentTheme === 'dark') {
      root.style.colorScheme = 'dark';
      root.classList.add('dark');
    } else {
      root.style.colorScheme = 'light';
      root.classList.remove('dark');
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    if (authContext) {
      authContext.updatePreferences({ darkMode: currentTheme !== 'dark' });
    } else {
      setLocalTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-lg shadow-lg transition-all hover:scale-110 hover:border-yellow-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400"
      title={currentTheme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      aria-label={t('theme.toggle')}
    >
      <span className="transform transition-transform duration-500 hover:rotate-12">
        {currentTheme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
