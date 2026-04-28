import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AcercaDe from './AcercaDe';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <AcercaDe />
          <Link to="/" className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-purple-500">
            TCG Nexus
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 md:flex">
            <Link to="/" className="text-sm font-medium tracking-wider text-slate-600 uppercase transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
              {t('nav.home')}
            </Link>
            <Link to="/favoritos" className="text-sm font-medium tracking-wider text-slate-600 uppercase transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
              {t('nav.favorites')}
            </Link>
          </nav>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6 dark:border-slate-800">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
