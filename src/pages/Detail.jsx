import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';
import favoritesService from '../services/favoritesService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatBadge from '../components/StatBadge';
import BackButton from '../components/BackButton';
import { getRarityConfig } from '../utils/rarityConfig';

const CARDS_URL = import.meta.env.VITE_CARDS_URL;

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const data = await cardService.getCardById(id);

        if (!data) {
          navigate('/404', { replace: true });
          return;
        }

        setCard(data);
        setIsFav(favoritesService.isFavorite(id));
      } catch {
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate]);

  const handleFavorite = () => {
    favoritesService.toggleFavorite(id);
    setIsFav(!isFav);
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner message={t('detail.loading')} />
      </div>
    );
  }

  if (!card) return null;

  const localized = card[lang] || card['es'];
  const { name, type, rarity, description } = localized;
  const { cost, atk, def, image } = card;
  const imageUrl = `${CARDS_URL}${image}`;
  const rarityStyle = getRarityConfig(rarity);

  return (
    <div className="py-12">
      <div className="mb-8">
        <BackButton to="/" label={t('detail.backToCatalog')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className={`relative rounded-2xl overflow-hidden border-2 ${rarityStyle.border} shadow-2xl ${rarityStyle.glow}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-auto object-cover"
            onError={(e) => { e.target.src = `${CARDS_URL}Portada.png`; }}
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
              isFav 
                ? 'bg-red-500/90 border-red-500 text-white' 
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-red-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-lg font-bold border border-slate-700">
            💎 {cost}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-100 mb-2">{name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{type}</span>
              <span className="text-slate-700">•</span>
              <span className={`text-sm font-black uppercase tracking-widest ${rarityStyle.text}`}>{rarity}</span>
            </div>
          </div>

          <div className={`flex gap-8 p-5 bg-slate-800/50 rounded-xl border ${rarityStyle.border}`}>
            <StatBadge icon="⚔️" value={atk} color="text-red-500" size="lg" />
            <StatBadge icon="🛡️" value={def} color="text-blue-500" size="lg" />
          </div>

          <div className="p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">{t('detail.loreTitle')}</h2>
            <p className="text-slate-300 text-lg leading-relaxed italic">"{description}"</p>
          </div>

          <div className="text-xs text-slate-600 uppercase tracking-widest">
            {t('detail.edition')}
          </div>
        </div>
      </div>
    </div>
  );
}
