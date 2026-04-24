import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const data = await cardService.getCards();
        setCards(data);
      } catch (err) {
        setError(t('catalog.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [t]);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner message={t('catalog.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl inline-block max-w-md">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            {t('catalog.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
          {t('Catalogo de cartas')}
        </h1>
        <p className="text-slate-400 max-w-2xl">
          {t('Explora la colección completa de cartas de TCG Nexus. Criaturas, hechizos y artefactos te esperan para tu mazo.')}
        </p>
      </header>

      {cards.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {t('catalog.noCards')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}