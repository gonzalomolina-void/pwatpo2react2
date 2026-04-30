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
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <LoadingSpinner message={t('detail.loading')} />
      </div>
    );
  }

  if (!card) return null;

  const langKey = lang === 'es' ? 'Es' : 'En';
  const name = card[`name${langKey}`];
  const type = card[`type${langKey}`];
  const rarity = card[`rarity${langKey}`];
  const description = card[`description${langKey}`];
  const { cost, atk, def, media } = card;
  const imageUrl = `${CARDS_URL}${media.image}`;
  const rarityStyle = getRarityConfig(rarity);

  return (
    <div className="py-12">
      <div className="mb-8">
        <BackButton to="/" label={t('detail.backToCatalog')} />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className={`relative overflow-hidden rounded-2xl border-2 ${rarityStyle.border} shadow-2xl ${rarityStyle.glow}`}>
          <img
            src={imageUrl}
            alt={name}
            className="h-auto w-full object-cover"
            onError={(e) => { e.target.src = `${CARDS_URL}FallbackImage${lang.capitalize()}.webp`; }}
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-4 left-4 rounded-full border p-3 backdrop-blur-md transition-all duration-300 ${
              isFav 
                ? 'border-red-500 bg-red-500/90 text-white' 
                : 'border-slate-200 bg-white/80 text-slate-400 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/80'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <div className="absolute top-4 right-4 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-lg font-bold text-slate-900 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-white">
            💎 {cost}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold text-slate-900 dark:text-slate-100">{name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">{type}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`text-sm font-black tracking-widest uppercase ${rarityStyle.text}`}>{rarity}</span>
            </div>
          </div>

          <div className={`flex gap-8 rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-800/50 ${rarityStyle.border}`}>
            <StatBadge icon="⚔️" value={atk} color="text-red-500" size="lg" />
            <StatBadge icon="🛡️" value={def} color="text-blue-500" size="lg" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/30">
            <h2 className="mb-3 text-sm font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">{t('detail.loreTitle')}</h2>
            <p className="text-lg leading-relaxed text-slate-700 italic dark:text-slate-300">"{description}"</p>
          </div>

          <div className="text-xs font-medium tracking-widest text-slate-400 uppercase dark:text-slate-600">
            {t('detail.edition')}
          </div>
        </div>
      </div>
    </div>
  );
}
