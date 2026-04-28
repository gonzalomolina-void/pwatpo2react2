import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import favoritesService from '../services/favoritesService';
const CARDS_URL = import.meta.env.VITE_CARDS_URL;

const Card = ({ card }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
    const [isFav, setIsFav] = useState(() => favoritesService.isFavorite(card.id));

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favoritesService.toggleFavorite(card.id);
    setIsFav(!isFav);
  };
  const { id, cost, image, atk, def } = card;
  const { name, type, rarity } = card[lang] || card['es'];
  const imageUrl = `${CARDS_URL}${image}`;

  // Configuración de colores por rareza (soporta ambos idiomas para mayor robustez)
  const rarityConfig = {
    'Legendario': { text: 'text-orange-400', border: 'border-orange-500/50', hover: 'hover:border-orange-400' },
    'Legendary': { text: 'text-orange-400', border: 'border-orange-500/50', hover: 'hover:border-orange-400' },
    'Épico': { text: 'text-purple-400', border: 'border-purple-500/50', hover: 'hover:border-purple-400' },
    'Epic': { text: 'text-purple-400', border: 'border-purple-500/50', hover: 'hover:border-purple-400' },
    'Raro': { text: 'text-blue-400', border: 'border-blue-500/50', hover: 'hover:border-blue-400' },
    'Rare': { text: 'text-blue-400', border: 'border-blue-500/50', hover: 'hover:border-blue-400' },
    'Poco Común': { text: 'text-green-400', border: 'border-green-500/50', hover: 'hover:border-green-400' },
    'Uncommon': { text: 'text-green-400', border: 'border-green-500/50', hover: 'hover:border-green-400' },
    'Normal': { text: 'text-slate-100', border: 'border-slate-200/50', hover: 'hover:border-slate-100' },
    'Común': { text: 'text-slate-100', border: 'border-slate-200/50', hover: 'hover:border-slate-100' },
    'Common': { text: 'text-slate-100', border: 'border-slate-200/50', hover: 'hover:border-slate-100' },
    'Pobre': { text: 'text-slate-500', border: 'border-slate-600/50', hover: 'hover:border-slate-500' },
    'Poor': { text: 'text-slate-500', border: 'border-slate-600/50', hover: 'hover:border-slate-500' },
  };

  const currentConfig = rarityConfig[rarity] || { 
    text: 'text-slate-400', 
    border: 'border-slate-700', 
    hover: 'hover:border-blue-500' 
  };

  return (
    <Link 
      to={`/detalles/${id}`} 
      className={`group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border ${currentConfig.border} ${currentConfig.hover} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10`}
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/cards/Portada.png'; }}
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isFav 
              ? 'bg-red-500/90 border-red-500 text-white' 
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          💎 {cost}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold truncate pr-2 text-slate-800 dark:text-slate-100">{name}</h3>
          <span className={`text-xs font-black uppercase tracking-widest ${currentConfig.text}`}>
            {rarity}
          </span>
        </div>
        
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{type}</p>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700/50">
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
};

export default Card;