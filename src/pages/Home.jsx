import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
        const newCards = data.filter(newCard => !prevCards.some(pc => pc.id === newCard.id));
        return [...prevCards, ...newCards];
      });

      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError(t('catalog.error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Efecto para carga inicial y cambios de página
  useEffect(() => {
    // Usamos una función asíncrona interna para evitar el error de set-state-in-effect
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

  // Filtrado local para tipos y rarezas (MockAPI no siempre filtra bien por múltiples campos)
  const filteredCards = cards.filter(card => {
    const lang = 'es'; // Usamos 'es' para comparar con TYPE_OPTIONS y RARITY_OPTIONS
    const cardData = card[lang] || card;
    
    const matchType = activeFilters.selectedTypes.length === 0 || 
                      activeFilters.selectedTypes.includes(cardData.type);
    const matchRarity = activeFilters.selectedRarities.length === 0 || 
                        activeFilters.selectedRarities.includes(cardData.rarity);
    
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
        <>
          {filteredCards.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-slate-500 text-xl">
              {t('catalog.noResults', 'No se encontraron resultados')}
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isLoading && page === 1 ? 'opacity-50' : 'opacity-100'}`}>
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

          {/* Indicador de carga */}
          {isLoading && (
            <div className="py-12 flex justify-center">
              <LoadingSpinner message={page === 1 ? t('catalog.loading') : t('catalog.loadingMore', 'Invocando más cartas...')} />
            </div>
          )}

          {/* Mensaje de final del catálogo */}
          {!hasMore && filteredCards.length > 0 && (
            <div className="py-12 text-center text-slate-500 italic border-t border-slate-800 mt-12">
              {t('catalog.allLoaded', 'Has llegado al final del Nexo.')}
            </div>
          )}
        </>
      )}
    </div>
  );
}