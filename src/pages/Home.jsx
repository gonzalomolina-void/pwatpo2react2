import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';

  const TYPE_OPTIONS = [
    t('home.filters.types.Criatura'),
    t('home.filters.types.Hechizo'),
    t('home.filters.types.Artefacto')
  ];
  const RARITY_OPTIONS = [
    t('home.filters.rarities.Pobre'),
    t('home.filters.rarities.Común'),
    t('home.filters.rarities.Poco Común'),
    t('home.filters.rarities.Raro'),
    t('home.filters.rarities.Épico'),
    t('home.filters.rarities.Legendario')
  ];

  const [cards, setCards] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ selectedTypes: [], selectedRarities: [] });

  const fetchCards = async (searchQuery = '', isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setIsSearching(true);
      }
      setError(null);
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await cardService.getCards(params);
      setCards(data);
    } catch {
      setError(t('home.error'));
    } finally {
      setInitialLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchCards('', true);
    };
    initFetch();
  }, []);

  const handleSearch = useCallback(({ searchTerm, selectedTypes, selectedRarities }) => {
    setActiveFilters({ selectedTypes, selectedRarities });
    fetchCards(searchTerm);
  }, []);

  const filteredCards = cards.filter(card => {
    // Si no hay traduccion para el idioma actual, fallback a 'es'
    const cardData = card[lang] || card['es'];
    
    // Los filtros vienen con la etiqueta traducida, comparamos con la data de la carta en el idioma actual
    const matchType = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(cardData.type);
    const matchRarity = activeFilters.selectedRarities.length === 0 || activeFilters.selectedRarities.includes(cardData.rarity);
    return matchType && matchRarity;
  });

  if (initialLoading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner message={t('home.loading')} />
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
            {t('home.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent inline-block">
          {t('home.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-8">
          {t('home.description')}
        </p>

        <SearchBar
          onSearch={handleSearch}
          typeOptions={TYPE_OPTIONS}
          rarityOptions={RARITY_OPTIONS}
        />
      </header>

      {isSearching && (
        <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          {t('home.searching')}
        </div>
      )}

      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xl">
          {t('home.noResults')}
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
          {filteredCards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
