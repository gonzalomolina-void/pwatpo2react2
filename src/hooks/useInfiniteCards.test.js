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
    { id: '1', name: 'Card 1', typeEn: 'home.filters.types.unit', rarityEn: 'home.filters.rarities.common' },
    { id: '2', name: 'Card 2', typeEn: 'home.filters.types.spell', rarityEn: 'home.filters.rarities.rare' },
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
      useInfiniteCards({ limit: 10, initialFilters, lang: 'es' })
    );

    expect(result.current.cards).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load cards successfully', async () => {
    cardService.getCards.mockResolvedValue(mockCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cards).toHaveLength(2);
    expect(cardService.getCards).toHaveBeenCalled();
  });

  it('should handle search correctly', async () => {
    cardService.getCards.mockResolvedValue(mockCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 5, initialFilters, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newFilters = { ...initialFilters, searchTerm: 'Dragon' };

    act(() => {
      result.current.handleSearch(newFilters);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(cardService.getCards).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Dragon' }),
        expect.objectContaining({ signal: expect.anything() })
      );
    });
  });


  it('should pass type filter to cardService', async () => {
    cardService.getCards.mockResolvedValue([mockCards[0]]);

    const filtersWithType = {
      ...initialFilters,
      selectedTypes: ['unit']
    };

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters: filtersWithType, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(cardService.getCards).toHaveBeenCalledWith(
      expect.objectContaining({ typeEn: 'home.filters.types.unit' }),
      expect.objectContaining({ signal: expect.anything() })
    );
    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].id).toBe('1');
  });

  it('should pass rarity filter to cardService', async () => {
    cardService.getCards.mockResolvedValue([mockCards[0]]);

    const filtersWithRarity = {
      ...initialFilters,
      selectedRarities: ['legendary']
    };

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 10, initialFilters: filtersWithRarity, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(cardService.getCards).toHaveBeenCalledWith(
      expect.objectContaining({ rarityEn: 'home.filters.rarities.legendary' }),
      expect.objectContaining({ signal: expect.anything() })
    );
  });

  it('should set error state when API fails', async () => {
    cardService.getCards.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'en' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(true);
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

    cardService.getCards.mockResolvedValue(mockCards);

    const { result } = renderHook(() => 
      useInfiniteCards({ limit: 2, initialFilters, lang: 'unique-lang-for-intersection' })
    );



    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockNode = document.createElement('div');
    act(() => {
      result.current.lastCardElementRef(mockNode);
    });

    // Simular intersección
    await act(async () => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    // Esperar a que la página cambie y se dispare el segundo fetch
    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    await waitFor(() => {
      expect(cardService.getCards).toHaveBeenCalledTimes(2);
    }, { timeout: 2000 });


  });
});
