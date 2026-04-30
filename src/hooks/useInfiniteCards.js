import { useState, useEffect, useCallback, useRef } from 'react';
import cardService from '../services/cardService';

/**
 * @typedef {Object} Filters
 * @property {string} searchTerm
 * @property {string[]} selectedTypes
 * @property {string[]} selectedRarities
 */

/**
 * Hook personalizado para manejar la lógica de scroll infinito y filtrado de cartas.
 * 
 * @param {Object} options
 * @param {number} options.limit - Cantidad de cartas por página.
 * @param {Filters} options.initialFilters - Filtros iniciales.
 * @param {string} options.lang - Idioma actual ('es' o 'en').
 * @returns {Object}
 */
export const useInfiniteCards = ({ limit = 12, initialFilters, lang }) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();

  const fetchCards = useCallback(async (currentPage, filters, isNewSearch = false) => {
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
  }, [limit]);

  useEffect(() => {
    fetchCards(page, activeFilters);
  }, [page, activeFilters, fetchCards]);

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
    const type = card[`type${langKey}`];
    const rarity = card[`rarity${langKey}`];
    const matchType = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(type);
    const matchRarity = activeFilters.selectedRarities.length === 0 || activeFilters.selectedRarities.includes(rarity);
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
