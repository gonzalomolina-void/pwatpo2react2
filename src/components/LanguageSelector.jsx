import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const authContext = useAuth();

  const currentLang = authContext?.language 
    ? authContext.language.split('-')[0] 
    : i18n.language.split('-')[0];

  const changeLanguage = (lang) => {
    if (authContext) {
      authContext.updatePreferences({ language: lang });
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const getBtnClass = (lang) => {
    const isActive = currentLang === lang;
    return `px-2 py-1 rounded-md text-xs font-bold transition-all duration-300 ${
      isActive 
        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
    }`;
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800/50">
      <button
        onClick={() => changeLanguage('es')}
        className={getBtnClass('es')}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={getBtnClass('en')}
        aria-label="Change to English"
      >
        EN
      </button>
    </div>
  );
}
