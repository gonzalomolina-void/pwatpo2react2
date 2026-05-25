import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Favorites from './Favorites';
import favoritesService from '../services/favoritesService';

const mockT = vi.hoisted(() => (str) => str);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'es'
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

vi.mock('../services/favoritesService', () => ({
  default: {
    getFavorites: vi.fn(),
    isFavorite: vi.fn(),
  },
}));

const mockCard = {
  id: 'card-1',
  nameEs: 'Mago',
  nameEn: 'Mage',
  typeEs: 'Unidad',
  typeEn: 'Unit',
  rarityEs: 'Común',
  rarityEn: 'Common',
  cost: 3,
  atk: 5,
  def: 3,
  media: { image: 'mago.webp' },
};

describe('Favorites Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra mensaje de lista vacía cuando no hay favoritos', async () => {
    favoritesService.getFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('favorites.empty')).toBeInTheDocument();
    });
    expect(screen.getByText('favorites.emptySub')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'favorites.backToCatalog' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renderiza las cartas favoritas en un grid', async () => {
    // Ahora el servicio devuelve objetos completos
    favoritesService.getFavorites.mockReturnValue([mockCard]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mago')).toBeInTheDocument();
    });
  });
});
