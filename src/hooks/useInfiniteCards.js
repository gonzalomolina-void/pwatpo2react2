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
  // Usamos useMemo para que el valor sea persistente durante la vida del componente
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
  const [hasMore, setHasMore] = useState(isRestoring ? homeCache.hasMore : true);
  
  const abortControllerRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Actualizar la caché cada vez que cambie el estado relevante
  useEffect(() => {
    if (cards.length > 0) {
      homeCache = {
        cards,
        page,
        hasMore,
        filters: activeFilters,
        lang
      };
    }
  }, [cards, page, hasMore, activeFilters, lang]);

  const fetchCards = useCallback(async (targetPage, filters) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const langKey = lang === 'es' ? 'Es' : 'En';
      const params = {
        page: targetPage,
        limit: limit,
      };

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
        if (targetPage === 1) return data;
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
  }, [limit, lang]);

  useEffect(() => {
    // Si estamos restaurando de caché, el primer render NO dispara fetch
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      if (isRestoring) return;
    }

    fetchCards(page, activeFilters);
  }, [page, activeFilters, fetchCards, isRestoring]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setPage(1);
    setHasMore(true);
  }, []);



  const observer = useRef();
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

  return {
    cards,
    isLoading,
    error,
    hasMore,
    page,
    handleSearch,
    lastCardElementRef
  };
};

