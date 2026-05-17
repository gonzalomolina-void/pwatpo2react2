import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInfiniteCards } from './useInfiniteCards';
import cardService from '../services/cardService';

// Mock de cardService
vi.mock('../services/cardService', () => ({
  default: {
    getCards: vi.fn(),
  },
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simplemente devuelve la key para facilitar el testeo
  }),
}));

// Mock de IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('useInfiniteCards Hook', () => {
  const mockCards = [
    { id: '1', name: 'Card 1', typeEn: 'Unit', rarityEn: 'Common' },
    { id: '2', name: 'Card 2', typeEn: 'Spell', rarityEn: 'Rare' },
  ];

  const initialFilters = {
    searchTerm: '',
    selectedTypes: [],
    selectedRarities: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default states', async () => {
    cardService.getCards.mockResolvedValue([]);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters, lang: 'es' }) // 'es' para diferenciar del resto
    );

    expect(result.current.cards).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load cards successfully', async () => {
    cardService.getCards.mockResolvedValue(mockCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'en-US' }) // lang diferente
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cards).toHaveLength(2);
    expect(cardService.getCards).toHaveBeenCalled();
  });

  it('should handle search correctly', async () => {
    cardService.getCards.mockResolvedValue(mockCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 5, initialFilters, lang: 'en-GB' }) // lang diferente
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newFilters = { ...initialFilters, searchTerm: 'Dragon' };

    await act(async () => {
      result.current.handleSearch(newFilters);
    });

    expect(result.current.page).toBe(1);
    expect(cardService.getCards).toHaveBeenCalledWith(expect.objectContaining({ 
      search: 'Dragon' 
    }));
  });

  it('should set error state when API fails', async () => {
    cardService.getCards.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'fr' }) // lang diferente
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(true);
  });

  it('should set hasMore to false when returned data length < limit', async () => {
    cardService.getCards.mockResolvedValue([mockCards[0]]);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 100, initialFilters, lang: 'de' }) // limit alto y lang diferente
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasMore).toBe(false);
  });

  it('should filter cards locally by type', async () => {
    const mixedCards = [
      { id: '1', name: 'Unit Card', typeEn: 'home.filters.types.unit', rarityEn: 'home.filters.rarities.common' },
      { id: '2', name: 'Spell Card', typeEn: 'home.filters.types.spell', rarityEn: 'home.filters.rarities.rare' },
    ];
    cardService.getCards.mockResolvedValue(mixedCards);

    const filtersWithType = {
      ...initialFilters,
      selectedTypes: ['unit']
    };

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters: filtersWithType, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].id).toBe('1');
  });

  it('should increment page when intersection observer triggers', async () => {
    let intersectionCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();
    
    window.IntersectionObserver = class {
      constructor(callback) {
        intersectionCallback = callback;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
    };

    const manyCards = Array.from({ length: 10 }, (_, i) => ({ 
      id: `${i}`, 
      name: `Card ${i}`, 
      typeEn: 'home.filters.types.unit', 
      rarityEn: 'home.filters.rarities.common' 
    }));
    cardService.getCards.mockResolvedValue(manyCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasMore).toBe(true);

    // Obtener la referencia para el observador
    const mockNode = document.createElement('div');
    act(() => {
      result.current.lastCardElementRef(mockNode);
    });

    expect(intersectionCallback).toBeDefined();

    // Simular intersección
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    expect(result.current.page).toBe(2);
    expect(cardService.getCards).toHaveBeenCalledTimes(2);
  });

  it('disconnects previous observer when ref changes', async () => {
    const disconnect = vi.fn();
    window.IntersectionObserver = class {
      constructor() {}
      observe = vi.fn();
      disconnect = disconnect;
      unobserve = vi.fn();
    };

    cardService.getCards.mockResolvedValue(mockCards);
    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.lastCardElementRef(document.createElement('div'));
    });
    
    act(() => {
      result.current.lastCardElementRef(document.createElement('div'));
    });

    expect(disconnect).toHaveBeenCalled();
  });

  it('returns early in lastCardElementRef if isLoading is true', async () => {
    window.IntersectionObserver = vi.fn();
    
    cardService.getCards.mockReturnValue(new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters, lang: 'en' })
    );

    // isLoading will be true
    act(() => {
      result.current.lastCardElementRef(document.createElement('div'));
    });

    expect(window.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should filter cards locally by rarity', async () => {
    const mixedCards = [
      { id: '1', name: 'Legendary Card', typeEn: 'home.filters.types.unit', rarityEn: 'home.filters.rarities.legendary' },
      { id: '2', name: 'Rare Card', typeEn: 'home.filters.types.unit', rarityEn: 'home.filters.rarities.rare' },
    ];
    cardService.getCards.mockResolvedValue(mixedCards);

    const filtersWithRarity = {
      ...initialFilters,
      selectedRarities: ['legendary']
    };

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters: filtersWithRarity, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].id).toBe('1');
  });
});
