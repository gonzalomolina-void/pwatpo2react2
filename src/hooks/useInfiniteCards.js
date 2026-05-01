import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';

/**
 * @typedef {Object} Filters
 * @property {string} searchTerm
 * @property {string[]} selectedTypes
 * @property {string[]} selectedRarities
 */

/**
 * Caché en memoria para persistir el estado del catálogo entre navegaciones
 * sin necesidad de recurrir a estados globales complejos.
 */
let homeCache = {
  cards: [],
  page: 1,
  hasMore: true,
  filters: null,
  lang: null
};

/**
 * Hook personalizado para manejar la lógica de scroll infinito y filtrado de cartas.
 */
export const useInfiniteCards = ({ limit = 12, initialFilters, lang }) => {
  const { t } = useTranslation();

  // Inicializamos desde la caché si los filtros y el idioma coinciden
  const shouldRestore = homeCache.filters && 
                       JSON.stringify(homeCache.filters) === JSON.stringify(initialFilters) &&
                       homeCache.lang === lang;

  const [cards, setCards] = useState(shouldRestore ? homeCache.cards : []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(shouldRestore ? homeCache.filters : initialFilters);
  const [page, setPage] = useState(shouldRestore ? homeCache.page : 1);
  const [hasMore, setHasMore] = useState(shouldRestore ? homeCache.hasMore : true);
  
  const observer = useRef();

  // Actualizar la caché cada vez que cambie el estado relevante
  useEffect(() => {
    homeCache = {
      cards,
      page,
      hasMore,
      filters: activeFilters,
      lang
    };
  }, [cards, page, hasMore, activeFilters, lang]);

  const fetchCards = useCallback(async (currentPage, filters, isNewSearch = false) => {
    // Si estamos restaurando y ya tenemos cartas, no hacemos el primer fetch
    if (shouldRestore && currentPage === 1 && !isNewSearch && cards.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: limit,
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

      setHasMore(data.length === limit);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [limit, shouldRestore, cards.length]);

  useEffect(() => {
    // Solo disparamos el fetch inicial si no estamos restaurando o si la página es > 1
    if (!shouldRestore || page > 1) {
      fetchCards(page, activeFilters);
    }
  }, [page, activeFilters, fetchCards, shouldRestore]);

  const handleSearch = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setPage(1);
    setHasMore(true);
    fetchCards(1, newFilters, true);
  }, [fetchCards]);

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

  // Filtrado local adicional (tipos y rarezas)
  const filteredCards = cards.filter(card => {
    const langKey = lang === 'es' ? 'Es' : 'En';
    
    // Mapeamos las keys seleccionadas a sus etiquetas traducidas para comparar con la data de la carta
    const matchType = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.some(key => {
      const translatedLabel = t(`home.filters.types.${key}`, { lng: lang });
      return card[`type${langKey}`] === translatedLabel;
    });

    const matchRarity = activeFilters.selectedRarities.length === 0 || activeFilters.selectedRarities.some(key => {
      const translatedLabel = t(`home.filters.rarities.${key}`, { lng: lang });
      return card[`rarity${langKey}`] === translatedLabel;
    });

    return matchType && matchRarity;
  });

  return {
    cards: filteredCards,
    isLoading,
    error,
    hasMore,
    page,
    handleSearch,
    lastCardElementRef
  };
};
