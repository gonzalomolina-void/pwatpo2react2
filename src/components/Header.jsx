import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AcercaDe from './AcercaDe';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AcercaDe />
          <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            TCG Nexus
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium uppercase tracking-wider">
              {t('nav.home')}
            </Link>
            <Link to="/favoritos" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium uppercase tracking-wider">
              {t('nav.favorites')}
            </Link>
          </nav>
          <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-6 gap-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
