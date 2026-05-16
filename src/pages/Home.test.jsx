import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
  default: vi.fn(() => <div data-testid="mock-searchbar" />),
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
});
