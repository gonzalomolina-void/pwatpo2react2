import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Favorites from './Favorites';
import favoritesService from '../services/favoritesService';

const mockLanguage = vi.hoisted(() => ({ value: 'es' }));
const mockT = vi.hoisted(() => (str) => str);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: mockLanguage.value
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

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, isAuthenticated: false }))
}));

vi.mock('../context/ToastContext', () => ({
  useToast: vi.fn(() => ({
    showToast: vi.fn()
  }))
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
    mockLanguage.value = 'es';
    favoritesService.isFavorite.mockReturnValue(true);
  });

  it('muestra spinner de carga mientras se obtienen los favoritos', () => {
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

  it('vuelve a solicitar los favoritos al cambiar el idioma (i18n)', async () => {
    favoritesService.fetchFavorites.mockResolvedValue([mockCard]);
    favoritesService.getFavorites.mockReturnValue([mockCard]);

    const { rerender } = render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(favoritesService.fetchFavorites).toHaveBeenCalledTimes(1);
    });

    // Cambiar idioma en mock
    mockLanguage.value = 'en';

    // Rerenderizar para propagar el cambio de idioma
    rerender(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Debería haberse llamado por segunda vez para obtener los datos en inglés
      expect(favoritesService.fetchFavorites).toHaveBeenCalledTimes(2);
    });
  });
});
