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
    fetchFavorites: vi.fn(),
    getFavorites: vi.fn(),
    isFavorite: vi.fn(),
  },
}));

const mockCard = {
  id: 'card-1',
  name: 'Mago',
  type: 'Unidad',
  rarity: 'Común',
  cost: 3,
  atk: 5,
  def: 3,
  image: 'mago.webp',
};

describe('Favorites Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra spinner de carga mientras se obtienen los favoritos', () => {
    // La promesa queda pendiente
    favoritesService.fetchFavorites.mockReturnValueOnce(new Promise(() => {}));
    favoritesService.getFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    expect(screen.getByText('favorites.loading')).toBeInTheDocument();
  });

  it('muestra mensaje de error si falla la llamada a la API', async () => {
    favoritesService.fetchFavorites.mockRejectedValueOnce(new Error('API Error'));
    favoritesService.getFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    // Esperar a que se quite el estado de carga y muestre error
    await waitFor(() => {
      expect(screen.queryByText('favorites.loading')).not.toBeInTheDocument();
    });
    expect(screen.getByText('favorites.error')).toBeInTheDocument();
  });

  it('muestra mensaje de lista vacía cuando no hay favoritos', async () => {
    favoritesService.fetchFavorites.mockResolvedValueOnce([]);
    favoritesService.getFavorites.mockReturnValue([]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('favorites.loading')).not.toBeInTheDocument();
    });
    expect(screen.getByText('favorites.empty')).toBeInTheDocument();
    expect(screen.getByText('favorites.emptySub')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'favorites.backToCatalog' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renderiza las cartas favoritas en un grid tras carga exitosa', async () => {
    favoritesService.fetchFavorites.mockResolvedValueOnce([mockCard]);
    favoritesService.getFavorites.mockReturnValue([mockCard]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('favorites.loading')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Mago')).toBeInTheDocument();
  });
});
