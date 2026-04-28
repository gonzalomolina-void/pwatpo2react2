import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cardService from '../services/cardService';
import favoritesService from '../services/favoritesService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Favorites() {
  const { t } = useTranslation();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const favoriteIds = favoritesService.getFavorites();
        
        if (favoriteIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const cards = await Promise.all(
          favoriteIds.map(id => cardService.getCardById(id))
        );
        
        setFavorites(cards.filter(Boolean));
      } catch {
        setError(t('favorites.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [t]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <LoadingSpinner message={t('favorites.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-extrabold text-slate-100">
          {t('favorites.title')}
        </h1>
        <p className="max-w-2xl text-slate-400">
          {t('favorites.description')}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto mb-4 h-16 w-16 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="mb-2 text-lg text-slate-400">{t('favorites.empty')}</p>
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
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}