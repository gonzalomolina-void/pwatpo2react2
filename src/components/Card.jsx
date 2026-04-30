import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, forwardRef } from 'react';
import favoritesService from '../services/favoritesService';
import { getRarityConfig } from '../utils/rarityConfig';

const CARDS_URL = import.meta.env.VITE_CARDS_URL;

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};


const Card = forwardRef(({ card }, ref) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const [isFav, setIsFav] = useState(() => favoritesService.isFavorite(card.id));

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favoritesService.toggleFavorite(card.id);
    setIsFav(!isFav);
  };

  const { id, cost, media, atk, def } = card;
  const langKey = lang === 'es' ? 'Es' : 'En';
  const name = card[`name${langKey}`];
  const type = card[`type${langKey}`];
  const rarity = card[`rarity${langKey}`];
  const image = media.image;
  const imageUrl = `${CARDS_URL}${image}`;
  const currentConfig = getRarityConfig(rarity);
  const fallbackImage = `${CARDS_URL}FallbackImage${lang.capitalize()}.webp`;

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
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        <div className="absolute top-2 right-2 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-sm font-bold text-slate-900 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-white">
          💎 {cost}
        </div>
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
});

Card.displayName = 'Card';

export default Card;