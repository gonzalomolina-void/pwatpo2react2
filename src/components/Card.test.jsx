import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';
import favoritesService from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';

// Mock de favoritesService
vi.mock('../services/favoritesService', () => ({
  default: {
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
  },
}));

// Mock de AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, isAuthenticated: false }))
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
    name: 'Dragon Warrior',
    type: 'Unit',
    rarity: 'Legendary',
    cost: 5,
    atk: 10,
    def: 8,
    image: 'dragon.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false
    });
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

  it('handles favorite toggle and updates optimistically', async () => {
    favoritesService.isFavorite.mockReturnValue(false);
    favoritesService.toggleFavorite.mockResolvedValueOnce([]); // Resuelve exitoso
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /card.addFavorite/i });
    fireEvent.click(favButton);

    // Debe cambiar optimistamente a "removeFavorite" inmediatamente
    expect(screen.getByRole('button', { name: /card.removeFavorite/i })).toBeInTheDocument();
    expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(mockCard);
  });

  it('reverts favorite UI state (rollback) if toggle API fails', async () => {
    favoritesService.isFavorite.mockReturnValue(false);
    favoritesService.toggleFavorite.mockRejectedValueOnce(new Error('Toggle Failed'));
    
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /card.addFavorite/i });
    fireEvent.click(favButton);

    // Setea optimistamente a favorito inmediatamente
    expect(screen.getByRole('button', { name: /card.removeFavorite/i })).toBeInTheDocument();

    // Pero al fallar el servicio, debe rollbackear a no-favorito
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /card.addFavorite/i })).toBeInTheDocument();
    });
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

  it('shows fallback image on error', () => {
    favoritesService.isFavorite.mockReturnValue(false);
    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    const img = screen.getByAltText('Dragon Warrior');
    fireEvent.error(img);

    expect(img.src).toContain('FallbackImageEn.webp');
  });

  it('no debe mostrar el botón de edición si el usuario no es admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'user@test.com', role: 'usuario' },
      isAuthenticated: true
    });
    favoritesService.isFavorite.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('btn-edit-card')).not.toBeInTheDocument();
  });

  it('debe mostrar el botón de edición si el usuario es admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true
    });
    favoritesService.isFavorite.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Card card={mockCard} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('btn-edit-card')).toBeInTheDocument();
  });

  it('debe llamar al callback onEdit al hacer click en el botón de edición si es admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true
    });
    favoritesService.isFavorite.mockReturnValue(false);
    const onEditMock = vi.fn();

    render(
      <MemoryRouter>
        <Card card={mockCard} onEdit={onEditMock} />
      </MemoryRouter>
    );

    const btn = screen.getByTestId('btn-edit-card');
    fireEvent.click(btn);

    expect(onEditMock).toHaveBeenCalledWith('1');
  });
});
