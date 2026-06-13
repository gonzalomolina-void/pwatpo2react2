import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'nav.home': 'Inicio',
        'nav.favorites': 'Favoritos',
        'about.title': 'Acerca de',
        'nav.login': 'Iniciar Sesión',
        'nav.logout': 'Cerrar Sesión'
      };
      return translations[key] || key;
    },
  }),
}));

// Mock del AuthContext
vi.mock('../context/AuthContext');

// Mock de subcomponentes para simplificar
vi.mock('./ThemeToggle', () => ({
  default: () => <button data-testid="theme-toggle">Theme</button>
}));
vi.mock('./LanguageSelector', () => ({
  default: () => <select data-testid="lang-selector"><option>ES</option></select>
}));

describe('Header Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Valor por defecto para las pruebas existentes (usuario no autenticado)
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout
    });
  });

  it('renders navigation links and logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const homeLinks = screen.getAllByRole('link', { name: 'Inicio' });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    expect(screen.getAllByText('Favoritos')).toHaveLength(2);
  });

  it('debe mostrar el boton de Iniciar Sesion si el usuario no esta autenticado', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Se busca el enlace a iniciar sesión
    const loginLink = screen.getByRole('link', { name: 'Iniciar Sesión' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
    expect(screen.queryByRole('button', { name: 'Cerrar Sesión' })).not.toBeInTheDocument();
  });

  it('debe mostrar el email del usuario y el boton de Cerrar Sesion si esta autenticado', () => {
    useAuth.mockReturnValue({
      user: { email: 'user@test.com', role: 'usuario' },
      isAuthenticated: true,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: 'Iniciar Sesión' })).not.toBeInTheDocument();
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: 'Cerrar Sesión' });
    expect(logoutBtn).toBeInTheDocument();
  });

  it('debe llamar a la funcion logout al hacer clic en Cerrar Sesion', () => {
    useAuth.mockReturnValue({
      user: { email: 'user@test.com', role: 'usuario' },
      isAuthenticated: true,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByRole('button', { name: 'Cerrar Sesión' });
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });
});
