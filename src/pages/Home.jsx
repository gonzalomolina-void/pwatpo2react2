import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ 
    searchTerm: '', 
    selectedTypes: [], 
    selectedRarities: [] 
  });

  // Estados para Scroll Infinito
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const LIMIT = 12;

  // Elemento centinela para el IntersectionObserver
  const lastCardElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchCards = useCallback(async (currentPage, filters, isNewSearch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: LIMIT,
      };

      if (filters.searchTerm) {
        params.search = filters.searchTerm;
      }

      const data = await cardService.getCards(params);

      setCards(prevCards => {
        if (isNewSearch) return data;
        // Evitar duplicados por ID
        const newCards = data.filter(newCard => !prevCards.some(pc => pc.id === newCard.id));
        return [...prevCards, ...newCards];
      });

      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError(t('home.error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Efecto para carga inicial y cambios de página
  useEffect(() => {
    const load = async () => {
      await fetchCards(page, activeFilters);
    };
    load();
  }, [page, activeFilters, fetchCards]);

  // Manejo de búsqueda y filtros
  const handleSearch = useCallback(({ searchTerm, selectedTypes, selectedRarities }) => {
    const newFilters = { searchTerm, selectedTypes, selectedRarities };
    setActiveFilters(newFilters);
    
    setPage(1);
    setHasMore(true);
    fetchCards(1, newFilters, true);
  }, [fetchCards]);

  // Filtrado local para tipos y rarezas
  const filteredCards = cards.filter(card => {
    const cardData = card[lang] || card['es'];
    
    const matchType = activeFilters.selectedTypes.length === 0 || 
                      activeFilters.selectedTypes.includes(cardData.type);
    const matchRarity = activeFilters.selectedRarities.length === 0 || 
                        activeFilters.selectedRarities.includes(cardData.rarity);
    
    return matchType && matchRarity;
  });

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block max-w-md rounded-xl border border-red-500/50 bg-red-500/10 p-6">
          <p className="mb-4 font-medium text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
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
        <h1 className="mb-4 inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-4xl font-extrabold text-transparent dark:from-blue-400 dark:to-purple-500">
          {t('home.title')}
        </h1>
        <p className="mb-8 max-w-2xl text-slate-600 dark:text-slate-400">
          {t('home.description')}
        </p>

        <SearchBar
          onSearch={handleSearch}
          typeOptions={TYPE_OPTIONS}
          rarityOptions={RARITY_OPTIONS}
        />
      </header>

      {isLoading && page === 1 ? (
        <div className="flex min-h-[40vh] items-center justify-center py-12">
          <LoadingSpinner message={t('home.loading')} />
        </div>
      ) : (
        <>
          {filteredCards.length === 0 ? (
            <div className="py-12 text-center text-xl text-slate-400 dark:text-slate-500">
              {t('home.noResults')}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isLoading && page === 1 ? 'opacity-50' : 'opacity-100'}`}>
              {filteredCards.map((card, index) => {
                if (filteredCards.length === index + 1) {
                  return (
                    <div ref={lastCardElementRef} key={card.id}>
                      <Card card={card} />
                    </div>
                  );
                } else {
                  return <Card key={card.id} card={card} />;
                }
              })}
            </div>
          )}

          {/* Indicador de carga para páginas siguientes */}
          {isLoading && page > 1 && (
            <div className="flex justify-center py-12">
              <LoadingSpinner message={t('home.loading')} />
            </div>
          )}

          {/* Mensaje de final del catálogo */}
          {!hasMore && filteredCards.length > 0 && (
            <div className="mt-12 border-t border-slate-200 py-12 text-center text-slate-500 italic dark:border-slate-800">
              {/* Aquí podrías agregar una clave 'home.allLoaded' si quieres */}
              Has llegado al final del Nexo.
            </div>
          )}
        </>
      )}
    </div>
  );
}