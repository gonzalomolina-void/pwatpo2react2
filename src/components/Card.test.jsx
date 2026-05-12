import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';
import favoritesService from '../services/favoritesService';

// Mock de favoritesService
vi.mock('../services/favoritesService', () => ({
  default: {
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
  },
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  }),
}));

describe('Card Component', () => {
  const mockCard = {
    id: '1',
    nameEn: 'Dragon Warrior',
    nameEs: 'Guerrero Dragón',
    typeEn: 'Unit',
    rarityEn: 'Legendary',
    cost: 5,
    atk: 10,
    def: 8,
    media: { image: 'dragon.png' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card information correctly', () => {
    favoritesService.isFavorite.mockReturnValue(false);
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dragon Warrior')).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/8/)).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('Legendary')).toBeInTheDocument();
  });

  it('handles favorite toggle', () => {
    favoritesService.isFavorite.mockReturnValue(false);
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /card.addFavorite/i });
    fireEvent.click(favButton);

    expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(mockCard.id);
  });

  it('shows "remove favorite" aria-label when card is already favorite', () => {
    favoritesService.isFavorite.mockReturnValue(true);
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /card.removeFavorite/i })).toBeInTheDocument();
  });

  it('navigates to detail page on click', () => {
    favoritesService.isFavorite.mockReturnValue(false);
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/detalles/1');
  });
});
