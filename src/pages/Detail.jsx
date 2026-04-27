import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cardService from '../services/cardService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatBadge from '../components/StatBadge';
import BackButton from '../components/BackButton';
import { getRarityConfig } from '../utils/rarityConfig';

const CARDS_URL = import.meta.env.VITE_CARDS_URL;

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch {
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner message="Invocando carta del Nexo..." />
      </div>
    );
  }

  if (!card) return null;

  const lang = 'es';
  const localized = card[lang] || card['es'];
  const { name, type, rarity, description } = localized;
  const { cost, atk, def, image } = card;
  const imageUrl = `${CARDS_URL}${image}`;
  const rarityStyle = getRarityConfig(rarity);

  return (
    <div className="py-12">
      <div className="mb-8">
        <BackButton to="/" label="Volver al catálogo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className={`relative rounded-2xl overflow-hidden border-2 ${rarityStyle.border} shadow-2xl ${rarityStyle.glow}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-auto object-cover"
            onError={(e) => { e.target.src = `${CARDS_URL}Portada.png`; }}
          />
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
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Lore</h2>
            <p className="text-slate-300 text-lg leading-relaxed italic">"{description}"</p>
          </div>

          <div className="text-xs text-slate-600 uppercase tracking-widest">
            Edición: TCG Nexus — Primera Edición
          </div>
        </div>
      </div>
    </div>
  );
}
