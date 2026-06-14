import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Detail from './Detail';
import cardService from '../services/cardService';
import favoritesService from '../services/favoritesService';

const mockLanguage = vi.hoisted(() => ({ value: 'es' }));
const mockT = vi.hoisted(() => (str) => str);
const mockNavigate = vi.hoisted(() => vi.fn());

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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../services/cardService', () => ({
  default: { getCardById: vi.fn() },
}));

vi.mock('../services/favoritesService', () => ({
  default: {
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
  },
}));

const mockCard = {
  id: 'card-1',
  name: 'Mago de Fuego',
  type: 'Unidad',
  rarity: 'Legendario',
  cost: 5,
  atk: 8,
  def: 6,
  image: 'fire-mage.webp',
  description: 'Un poderoso mago del fuego.',
};

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/detalles/card-1']}>
      <Routes>
        <Route path="/detalles/:id" element={<Detail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLanguage.value = 'es';
  });

  it('muestra el spinner de carga mientras se obtiene la carta', () => {
    cardService.getCardById.mockReturnValue(new Promise(() => {}));

    renderDetail();

    expect(screen.getByText('detail.loading')).toBeInTheDocument();
  });

  it('renderiza los detalles de la carta cuando se carga exitosamente', async () => {
    cardService.getCardById.mockResolvedValue(mockCard);

    renderDetail();

    await waitFor(() => {
      expect(screen.getByText('Mago de Fuego')).toBeInTheDocument();
    });
    expect(screen.getByText('Unidad')).toBeInTheDocument();
    expect(screen.getByText('Legendario')).toBeInTheDocument();
    expect(screen.getByText('detail.loreTitle')).toBeInTheDocument();
    expect(screen.getByText('detail.edition')).toBeInTheDocument();
    expect(screen.getByText('detail.backToCatalog')).toBeInTheDocument();
  });

  it('navega a /404 si la carta no existe (retorna null)', async () => {
    cardService.getCardById.mockResolvedValue(null);

    renderDetail();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
    });
  });

  it('navega a /404 si la API falla', async () => {
    cardService.getCardById.mockRejectedValue(new Error('fail'));

    renderDetail();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
    });
  });

  it('alterna el favorito al hacer clic en el corazón optimistamente', async () => {
    cardService.getCardById.mockResolvedValue(mockCard);
    favoritesService.isFavorite.mockReturnValue(false);
    favoritesService.toggleFavorite.mockResolvedValueOnce([]); // Resuelve ok

    renderDetail();

    await waitFor(() => {
      expect(screen.getByText('Mago de Fuego')).toBeInTheDocument();
    });

    const favButton = screen.getByRole('button');
    
    // Al principio no es favorito (color original en la UI)
    expect(favButton).not.toHaveClass('bg-red-500'); // Asumimos color por defecto

    fireEvent.click(favButton);

    // Cambia optimistamente
    expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(mockCard);
  });

  it('reverts favorite UI state (rollback) in detail page if toggle API fails', async () => {
    cardService.getCardById.mockResolvedValue(mockCard);
    favoritesService.isFavorite.mockReturnValue(false);
    favoritesService.toggleFavorite.mockRejectedValueOnce(new Error('API Toggle Failed'));

    renderDetail();

    await waitFor(() => {
      expect(screen.getByText('Mago de Fuego')).toBeInTheDocument();
    });

    const favButton = screen.getByRole('button');
    
    // Al principio no es favorito
    expect(favButton).toHaveClass('text-slate-400');

    fireEvent.click(favButton);

    // Se asume optimismo visual (cambia inmediatamente a bg-red-500/90)
    expect(favButton).toHaveClass('bg-red-500/90');

    // Pero al fallar el servicio, debe rollbackear a no-favorito
    await waitFor(() => {
      expect(favButton).toHaveClass('text-slate-400');
    });
  });

  it('muestra imagen de fallback si la imagen principal falla', async () => {
    cardService.getCardById.mockResolvedValue(mockCard);
    
    renderDetail();

    await waitFor(() => {
      expect(screen.getByAltText('Mago de Fuego')).toBeInTheDocument();
    });
    
    const img = screen.getByAltText('Mago de Fuego');
    fireEvent.error(img);

    expect(img.src).toContain('FallbackImageEs.webp');
  });

  it('vuelve a solicitar la carta al cambiar el idioma (i18n)', async () => {
    cardService.getCardById.mockResolvedValue(mockCard);

    const { rerender } = renderDetail();

    await waitFor(() => {
      expect(cardService.getCardById).toHaveBeenCalledTimes(1);
    });

    // Cambiar idioma
    mockLanguage.value = 'en';

    // Rerenderizar para reflejar el cambio de idioma en el hook reactivo
    rerender(
      <MemoryRouter initialEntries={['/detalles/card-1']}>
        <Routes>
          <Route path="/detalles/:id" element={<Detail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Debe haberse ejecutado una segunda vez al cambiar de idioma
      expect(cardService.getCardById).toHaveBeenCalledTimes(2);
    });
  });
});
