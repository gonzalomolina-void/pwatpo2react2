import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TCG Nexus
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              {t('Home')}
            </Link>
            <Link to="/favoritos" className="hover:text-blue-400 transition-colors">
              {t('Favoritos')}
            </Link>
          </nav>

          {/* Selector de idioma */}
          <div className="flex gap-2 ml-4 border-l border-slate-700 pl-4">
            <button
              onClick={() => changeLanguage('es')}
              className={`px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
                i18n.language === 'es'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
                i18n.language === 'en'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}