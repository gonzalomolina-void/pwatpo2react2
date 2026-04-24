import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const CARDS_URL = import.meta.env.VITE_CARDS_URL;

const Card = ({ card }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  
  const { id, cost, image, atk, def } = card;
  const { name, type, rarity } = card[lang] || card['es'];
  const imageUrl = `${CARDS_URL}${image}`;

  // Configuración de colores por rareza (traducida)
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
    'Pobre': { text: 'text-slate-500', border: 'border-slate-600/50', hover: 'hover:border-slate-500' },
    'Poor': { text: 'text-slate-500', border: 'border-slate-600/50', hover: 'hover:border-slate-500' },
  };

  // Traducción de tipos de carta

  const currentConfig = rarityConfig[rarity] || { 
    text: 'text-slate-400', 
    border: 'border-slate-700', 
    hover: 'hover:border-blue-500' 
  };

  return (
    <Link 
      to={`/detalles/${id}`} 
      className={`group relative bg-slate-800 rounded-xl overflow-hidden border ${currentConfig.border} ${currentConfig.hover} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10`}
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/cards/Portada.png'; }}
        />
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full text-sm font-bold border border-slate-700">
          💎 {cost}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold truncate pr-2 text-slate-100">{name}</h3>
          <span className={`text-xs font-black uppercase tracking-widest ${currentConfig.text}`}>
            {rarity}
          </span>
        </div>
        
        <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">
          {type}
        </p>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
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