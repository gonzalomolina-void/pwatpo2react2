import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, forwardRef, memo } from 'react';
import favoritesService from '../services/favoritesService';
import { getRarityConfig } from '../utils/rarityConfig';
import { capitalize } from '../utils/stringUtils';
import { useAuth } from '../context/AuthContext';

const CARDS_URL = import.meta.env.VITE_CARDS_URL;

const Card = memo(forwardRef(({ card, onFavoriteToggle, onEdit }, ref) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const [isFav, setIsFav] = useState(() => favoritesService.isFavorite(card.id));

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const previousIsFav = isFav;
    const newIsFav = !previousIsFav;

    // Actualización optimista de la UI
    setIsFav(newIsFav);
    if (onFavoriteToggle) {
      onFavoriteToggle(card, newIsFav);
    }

    try {
      await favoritesService.toggleFavorite(card);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Rollback ante error de la API
      setIsFav(previousIsFav);
      if (onFavoriteToggle) {
        onFavoriteToggle(card, previousIsFav);
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const { id, cost, atk, def, name, type, rarity, image } = card;
  const imageUrl = `${CARDS_URL}${image}`;
  const currentConfig = getRarityConfig(rarity);
  const fallbackImage = `${CARDS_URL}FallbackImage${capitalize(lang)}.webp`;

  return (
    <Link 
      ref={ref}
      to={`/detalles/${id}`} 
      className={`group relative overflow-hidden rounded-xl border bg-white dark:bg-slate-800 ${currentConfig.border} ${currentConfig.hover} ${currentConfig.glow} transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10`}
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-2 left-2 rounded-full border p-2 backdrop-blur-md transition-all duration-300 ${
            isFav 
              ? 'border-red-500 bg-red-500/90 text-white' 
              : 'border-slate-200 bg-white/80 text-slate-400 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/80'
          }`}
          aria-label={isFav ? t('card.removeFavorite') : t('card.addFavorite')}
          title={isFav ? t('card.removeFavorite') : t('card.addFavorite')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        <div className="absolute top-2 right-2 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-sm font-bold text-slate-900 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-white">
          💎 {cost}
        </div>
        {user?.role === 'admin' && (
          <button
            type="button"
            data-testid="btn-edit-card"
            onClick={handleEdit}
            className="absolute right-2 bottom-2 z-10 cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 text-slate-600 backdrop-blur-md transition-all hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:text-blue-400"
            aria-label={t('card.admin.editCard')}
            title={t('card.admin.editCard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <h3 className="truncate pr-2 text-lg font-bold text-slate-800 dark:text-slate-100">{name}</h3>
          <span className={`text-xs font-black tracking-widest uppercase ${currentConfig.text}`}>
            {rarity}
          </span>
        </div>

        <p className="text-xs font-medium tracking-tighter text-slate-500 uppercase dark:text-slate-400">{type}</p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-700/50">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-sm font-black text-red-500">
              <span className="opacity-70">⚔️</span> {atk}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-black text-blue-500">
              <span className="opacity-70">🛡️</span> {def}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}));

Card.displayName = 'Card';

export default Card;