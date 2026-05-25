import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { useInfiniteCards } from '../hooks/useInfiniteCards';

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

vi.mock('../components/SearchBar', () => ({
  default: vi.fn(({ onSearch }) => (
    <div data-testid="mock-searchbar">
      <button data-testid="trigger-search" onClick={() => onSearch({ searchTerm: 'test', selectedTypes: [], selectedRarities: [] })}>
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
});
