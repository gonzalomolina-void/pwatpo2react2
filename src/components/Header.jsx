import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AcercaDe from './AcercaDe';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <AcercaDe />
          <Link 
            to="/" 
            className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-blue-400 dark:to-purple-500" 
            onClick={closeMenu}
            aria-label={t('nav.home')}
          >
            TCG Nexus
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex gap-6">
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

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/95">
          <nav className="container mx-auto flex flex-col p-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center border-b border-slate-100 py-4 text-base font-medium text-slate-600 transition-colors hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
            >
              <span className="mr-3">🏠</span>
              {t('nav.home')}
            </Link>
            <Link
              to="/favoritos"
              onClick={closeMenu}
              className="flex items-center py-4 text-base font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              <span className="mr-3">⭐</span>
              {t('nav.favorites')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
