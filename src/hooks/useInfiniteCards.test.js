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

    // Solo debería quedar la carta de tipo 'unit'
    // Nota: El mock de 't' devuelve la key, y el hook compara contra esa traducción
    expect(result.current.cards).toHaveLength(1);
    expect(result.current.cards[0].id).toBe('1');
  });
});
