import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { useInfiniteCards } from '../hooks/useInfiniteCards';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, isAuthenticated: false }))
}));

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

vi.mock('../hooks/useInfiniteCards', () => ({
  useInfiniteCards: vi.fn(),
}));

vi.mock('../components/Card', () => ({
  default: vi.fn(() => <div data-testid="mock-card" />),
}));

vi.mock('../components/CardFormModal', () => ({
  default: vi.fn(({ isOpen, onClose, onSuccess }) => isOpen ? (
    <div data-testid="mock-card-form-modal">
      <button data-testid="btn-close-modal" onClick={onClose}>Close</button>
      <button data-testid="btn-success-create" onClick={() => onSuccess({ action: 'create', card: { id: '3' } })}>Success Create</button>
      <button data-testid="btn-success-edit" onClick={() => onSuccess({ action: 'edit', card: { id: '1', nameEs: 'Carta Editada' } })}>Success Edit</button>
      <button data-testid="btn-success-delete" onClick={() => onSuccess({ action: 'delete', cardId: '1' })}>Success Delete</button>
      <button data-testid="btn-success-modal" onClick={() => onSuccess()}>Success Legacy</button>
    </div>
  ) : null)
}));

vi.mock('../components/SearchBar', () => ({
  default: vi.fn(({ onSearch, filters }) => (
    <div data-testid="mock-searchbar" data-filters={JSON.stringify(filters)}>
      <button data-testid="trigger-search" onClick={() => onSearch({ searchTerm: 'test', selectedTypes: ['spell'], selectedRarities: [] })}>
        Search
      </button>
    </div>
  )),
}));

const mockCards = [
  { id: '1', nameEs: 'Carta 1', nameEn: 'Card 1' },
  { id: '2', nameEs: 'Carta 2', nameEn: 'Card 2' },
];

function mockHookState(overrides = {}) {
  vi.mocked(useInfiniteCards).mockReturnValue({
    cards: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,
    handleSearch: vi.fn(),
    lastCardElementRef: vi.fn(),
    ...overrides,
  });
}

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false
    });
  });

  it('renderiza el título y la descripción', () => {
    mockHookState();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.description')).toBeInTheDocument();
  });

  it('muestra el spinner de carga inicial cuando isLoading y page=1', () => {
    mockHookState({ isLoading: true, page: 1 });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('home.loading')).toBeInTheDocument();
  });

  it('muestra mensaje de sin resultados cuando no hay cartas', () => {
    mockHookState({ cards: [] });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('home.noResults')).toBeInTheDocument();
  });

  it('renderiza las cartas en un grid', () => {
    mockHookState({ cards: mockCards });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('mock-card')).toHaveLength(2);
  });

  it('muestra estado de error con botón de reintentar', () => {
    mockHookState({ error: true });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('home.error')).toBeInTheDocument();
    expect(screen.getByText('home.retry')).toBeInTheDocument();
  });

  it('muestra mensaje de fin de catálogo cuando hasMore es false', () => {
    mockHookState({ cards: mockCards, hasMore: false });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('home.endOfCatalog')).toBeInTheDocument();
  });

  it('muestra spinner de carga en páginas siguientes junto con las cartas', () => {
    mockHookState({ cards: mockCards, isLoading: true, page: 2 });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('mock-card')).toHaveLength(2);
    expect(screen.getByText('home.loading')).toBeInTheDocument();
  });

  it('renderiza el SearchBar', () => {
    mockHookState();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('mock-searchbar')).toBeInTheDocument();
  });

  it('sets scrollRestoration to manual on mount', () => {
    mockHookState();
    // Definir la propiedad en el mock de history si no existe en JSDOM
    if (!('scrollRestoration' in window.history)) {
      Object.defineProperty(window.history, 'scrollRestoration', {
        value: 'auto',
        writable: true,
        configurable: true
      });
    } else {
      window.history.scrollRestoration = 'auto';
    }
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(window.history.scrollRestoration).toBe('manual');
  });

  it('restores scroll position if saved in sessionStorage', () => {
    vi.useFakeTimers();
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('500');
    
    mockHookState({ cards: mockCards });
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 500,
      behavior: 'instant'
    });
    
    vi.useRealTimers();
    getItemSpy.mockRestore();
    scrollToSpy.mockRestore();
  });

  it('saves scroll position to sessionStorage on scroll event', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    mockHookState();
    
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // Simular scroll con property setter para JSDOM
    Object.defineProperty(window, 'scrollY', { value: 300, configurable: true });
    fireEvent.scroll(window);
    
    expect(setItemSpy).toHaveBeenCalledWith('home_scroll_pos', '300');
    
    setItemSpy.mockRestore();
  });

  it('removes scroll position from sessionStorage on search', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    mockHookState();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByTestId('trigger-search'));
    
    expect(removeItemSpy).toHaveBeenCalledWith('home_scroll_pos');
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('no debe mostrar el botón "Nueva Carta" si el usuario no es admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'user@test.com', role: 'usuario' },
      isAuthenticated: true
    });
    mockHookState();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.queryByText('card.admin.newCard')).not.toBeInTheDocument();
  });

  it('debe mostrar el botón "Nueva Carta" si el usuario es admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true
    });
    mockHookState();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('card.admin.newCard')).toBeInTheDocument();
  });

  it('debe abrir el modal al clickear "Nueva Carta" y llamar a handleSearch al guardar exitosamente', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true
    });
    const handleSearchMock = vi.fn();
    mockHookState({ handleSearch: handleSearchMock });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const btn = screen.getByText('card.admin.newCard');
    fireEvent.click(btn);

    // Debe abrir el modal mockeado
    expect(screen.getByTestId('mock-card-form-modal')).toBeInTheDocument();

    // Simular guardado exitoso
    fireEvent.click(screen.getByTestId('btn-success-modal'));

    // Debe refrescar llamando a handleSearch
    expect(handleSearchMock).toHaveBeenCalled();
  });

  describe('Post-ABM Filter Synchronization (US19)', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        user: { email: 'admin@test.com', role: 'admin' },
        isAuthenticated: true
      });
    });

    it('debe limpiar filtros y refrescar catálogo al CREAR una carta', async () => {
      const handleSearchMock = vi.fn();
      mockHookState({ handleSearch: handleSearchMock });

      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      // Abrir modal y disparar éxito de creación
      fireEvent.click(screen.getByText('card.admin.newCard'));
      fireEvent.click(screen.getByTestId('btn-success-create'));

      // Debe resetear filtros a valores vacíos y buscar
      expect(handleSearchMock).toHaveBeenCalledWith({
        searchTerm: '',
        selectedTypes: [],
        selectedRarities: []
      });

      // El SearchBar debe recibir los filtros reseteados
      const searchBar = screen.getByTestId('mock-searchbar');
      expect(JSON.parse(searchBar.getAttribute('data-filters'))).toEqual({
        searchTerm: '',
        selectedTypes: [],
        selectedRarities: []
      });
    });

    it('debe limpiar filtros y refrescar catálogo al ELIMINAR una carta', async () => {
      const handleSearchMock = vi.fn();
      mockHookState({ handleSearch: handleSearchMock });

      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      // Abrir modal y disparar éxito de eliminación
      fireEvent.click(screen.getByText('card.admin.newCard'));
      fireEvent.click(screen.getByTestId('btn-success-delete'));

      // Debe resetear filtros y buscar
      expect(handleSearchMock).toHaveBeenCalledWith({
        searchTerm: '',
        selectedTypes: [],
        selectedRarities: []
      });
    });

    it('debe conservar filtros, llamar a updateCardOptimistic y refrescar catálogo al EDITAR una carta', async () => {
      const triggerSearchMock = vi.fn();
      const updateCardOptimisticMock = vi.fn();
      mockHookState({ 
        handleSearch: triggerSearchMock,
        updateCardOptimistic: updateCardOptimisticMock
      });

      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      // Simular que el usuario hace una búsqueda primero para establecer filtros
      const searchBar = screen.getByTestId('mock-searchbar');
      fireEvent.click(screen.getByText('Search')); // Dispara onSearch con { searchTerm: 'test', selectedTypes: ['spell']... }

      // Limpiamos los llamados del mock para la aserción posterior
      triggerSearchMock.mockClear();

      // Abrir modal y disparar éxito de edición
      fireEvent.click(screen.getByText('card.admin.newCard'));
      fireEvent.click(screen.getByTestId('btn-success-edit'));

      // Debe actualizar optimistamente la carta editada en el hook
      expect(updateCardOptimisticMock).toHaveBeenCalledWith({
        id: '1',
        nameEs: 'Carta Editada'
      });

      // Debe recargar la lista de la API conservando los filtros actuales ('test', ['spell'])
      expect(triggerSearchMock).toHaveBeenCalledWith({
        searchTerm: 'test',
        selectedTypes: ['spell'],
        selectedRarities: []
      });

      // El SearchBar debe mantener sus valores en la prop filters
      expect(JSON.parse(searchBar.getAttribute('data-filters'))).toEqual({
        searchTerm: 'test',
        selectedTypes: ['spell'],
        selectedRarities: []
      });
    });
  });
});
