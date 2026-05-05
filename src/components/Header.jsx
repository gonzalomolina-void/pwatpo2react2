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
            className="flex items-center transition-transform hover:scale-105 active:scale-95" 
            onClick={closeMenu}
            aria-label={t('nav.home')}
          >
            <svg
              viewBox="0 0 120 40"
              className="h-8 w-auto sm:h-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logo-grad-light" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="logo-grad-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              
              {/* Grupo de letras con degradado dinámico */}
              <g className="fill-[url(#logo-grad-light)] dark:fill-[url(#logo-grad-dark)]">
                {/* H - Hagalaz Rune Style */}
                <path d="M10 5 V35 M25 5 V35 M10 12 L25 28" strokeWidth="4" strokeLinecap="round" className="stroke-[url(#logo-grad-light)] dark:stroke-[url(#logo-grad-dark)]" />
                
                {/* E */}
                <path d="M40 5 H55 M40 20 H52 M40 35 H55 M40 5 V35" strokeWidth="4" strokeLinecap="round" fill="none" className="stroke-[url(#logo-grad-light)] dark:stroke-[url(#logo-grad-dark)]" />
                
                {/* X */}
                <path d="M65 5 L80 35 M80 5 L65 35" strokeWidth="4" strokeLinecap="round" className="stroke-[url(#logo-grad-light)] dark:stroke-[url(#logo-grad-dark)]" />
                
                {/* A */}
                <path d="M90 35 L100 5 L110 35 M94 22 H106" strokeWidth="4" strokeLinecap="round" fill="none" className="stroke-[url(#logo-grad-light)] dark:stroke-[url(#logo-grad-dark)]" />
              </g>
            </svg>
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
