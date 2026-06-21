import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import cardService from '../services/cardService';

/**
 * @typedef {Object} Filters
 * @property {string} searchTerm
 * @property {string[]} selectedTypes
 * @property {string[]} selectedRarities
 */

/**
 * Caché en memoria para persistir el estado del catálogo entre navegaciones.
 */
let homeCache = {
  cards: [],
  page: 1,
  cursor: null,
  hasMore: true,
  filters: null,
  lang: null
};

export const useInfiniteCards = ({ limit = 12, initialFilters, lang }) => {
  const { t } = useTranslation();
  const tRef = useRef(t);
  
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Decidimos si restauramos en el primer render para que sea estable
  const isRestoring = useMemo(() => {
    return !!(homeCache.filters && 
      homeCache.cards.length > 0 &&
      JSON.stringify(homeCache.filters) === JSON.stringify(initialFilters) &&
      homeCache.lang === lang);
  }, [initialFilters, lang]);

  const [cards, setCards] = useState(isRestoring ? homeCache.cards : []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(isRestoring ? homeCache.filters : initialFilters);
  const [page, setPage] = useState(isRestoring ? homeCache.page : 1);
  const [cursor, setCursor] = useState(isRestoring ? homeCache.cursor : null);
  const [hasMore, setHasMore] = useState(isRestoring ? homeCache.hasMore : true);
  
  const abortControllerRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Actualizar la caché cada vez que cambie el estado relevante
  useEffect(() => {
    if (cards.length > 0) {
      homeCache = {
        cards,
        page,
        cursor,
        hasMore,
        filters: activeFilters,
        lang
      };
    }
  }, [cards, page, cursor, hasMore, activeFilters, lang]);

  const fetchCards = useCallback(async (targetCursor, filters) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const params = {
        limit: limit,
      };

      if (targetCursor !== null) {
        params.cursor = targetCursor;
      }

      if (filters.searchTerm) {
        params.search = filters.searchTerm;
      }

      if (filters.selectedTypes.length > 0) {
        params.type = filters.selectedTypes[0];
      }

      if (filters.selectedRarities.length > 0) {
        params.rarity = filters.selectedRarities[0];
      }

      const data = await cardService.getCards(params, { signal: abortControllerRef.current.signal });

      setCards(prevCards => {
        if (targetCursor === null) return data;
        const newCards = data.filter(newCard => !prevCards.some(pc => pc.id === newCard.id));
        return [...prevCards, ...newCards];
      });

      setHasMore(data.length === limit);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // Si estamos restaurando de caché, el primer render NO dispara fetch
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      if (isRestoring) return;
    }

    fetchCards(cursor, activeFilters);
  }, [cursor, activeFilters, fetchCards, isRestoring]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = useCallback((newFilters) => {
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(activeFilters);
    const cursorChanged = cursor !== null;

    if (filtersChanged || cursorChanged) {
      setIsLoading(true);
      setActiveFilters(newFilters);
      setCursor(null);
      setPage(1);
      setHasMore(true);
    } else {
      // Si los filtros son idénticos y el cursor ya es null, forzamos refetch
      fetchCards(null, activeFilters);
    }
  }, [activeFilters, cursor, fetchCards]);

  const observer = useRef();
  const lastCardElementRef = useCallback(node => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        setCursor(lastCard.id);
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, cards]);

  const updateCardOptimistic = useCallback((updatedCard) => {
    if (!updatedCard || !updatedCard.id) return;

    setCards((prevCards) => {
      const newCards = prevCards.map((card) =>
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      );
      // Sincronizar la caché global
      homeCache.cards = newCards;
      return newCards;
    });
  }, []);

  return {
    cards,
    isLoading,
    error,
    hasMore,
    page,
    cursor,
    handleSearch,
    updateCardOptimistic,
    lastCardElementRef,
  };
};

