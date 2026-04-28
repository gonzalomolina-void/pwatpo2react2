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
        setError('No se pudieron cargar tus favoritos.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner message="Cargando favoritos..." />
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
        <h1 className="text-4xl font-extrabold mb-4 text-slate-100">
          Mis Favoritos
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Aquí tienes tu colección personal de cartas marcadas como favoritas.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="text-slate-400 text-lg mb-2">No tienes favoritos todavía</p>
          <p className="text-slate-500 text-sm mb-6">
            Explora el catálogo y guarda tus cartas favoritas
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}