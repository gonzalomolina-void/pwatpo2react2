import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import favoritesService from '../services/favoritesService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Favorites() {
  const { t } = useTranslation();

  // Los favoritos ya vienen como objetos completos desde el servicio (LocalStorage)
  // Cargamos directamente en el estado inicial
  const [favorites, setFavorites] = useState(() => favoritesService.getFavorites());

  // Callback para remover la carta de la vista cuando se desmarca
  const handleFavoriteToggle = useCallback((card, isFav) => {
    if (!isFav) {
      setFavorites(prevFavorites => prevFavorites.filter(c => c.id !== card.id));
    }
  }, []);

  return (
    <div className="py-12">

      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('favorites.title')}
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-400">
          {t('favorites.description')}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700/50 dark:bg-slate-800/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">{t('favorites.empty')}</p>
          <p className="mb-6 text-sm text-slate-500">
            {t('favorites.emptySub')}
          </p>
          <Link
            to="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t('favorites.backToCatalog')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map(card => (
            <Card key={card.id} card={card} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}