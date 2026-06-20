import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

// Mock de useNavigate y useLocation para validar redirecciones y rutas
const mockNavigate = vi.fn();
let mockPathname = '/';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname })
  };
});

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'nav.home': 'Inicio',
        'nav.favorites': 'Favoritos',
        'about.title': 'Acerca de',
        'nav.login': 'Iniciar Sesión',
        'nav.logout': 'Cerrar Sesión',
        'nav.profile': 'Perfil'
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
    mockPathname = '/';
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
    expect(screen.getByText(/user@test\.com/)).toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: 'Cerrar Sesión' });
    expect(logoutBtn).toBeInTheDocument();
  });

  it('debe mostrar el nombre del usuario si esta autenticado y tiene seteado el name', () => {
    useAuth.mockReturnValue({
      user: { email: 'user@test.com', name: 'Gonzalo', role: 'usuario' },
      isAuthenticated: true,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: 'Iniciar Sesión' })).not.toBeInTheDocument();
    expect(screen.getByText(/Gonzalo/)).toBeInTheDocument();
    expect(screen.queryByText(/user@test\.com/)).not.toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: 'Cerrar Sesión' });
    expect(logoutBtn).toBeInTheDocument();
  });

  it('debe llamar a la funcion logout y redirigir a /login al hacer clic en Cerrar Sesion', async () => {
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
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('no debe renderizar links de navegacion ni iniciar sesion en la ruta /login', () => {
    mockPathname = '/login';
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument(); // El logotipo
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument(); // El enlace de navegación de Inicio (desktop)
    expect(screen.queryByText('Favoritos')).not.toBeInTheDocument(); // Enlace de Favoritos
    expect(screen.queryByRole('link', { name: 'Iniciar Sesión' })).not.toBeInTheDocument(); // Enlace de Iniciar Sesión
  });

  it('debe renderizar links de navegacion normalmente en rutas distintas a /login', () => {
    mockPathname = '/';
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const homeLinks = screen.getAllByRole('link', { name: 'Inicio' });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('debe renderizar enlaces al perfil (/perfil) en desktop y mobile cuando esta autenticado', () => {
    useAuth.mockReturnValue({
      user: { email: 'user@test.com', name: 'Gonzalo', role: 'usuario' },
      isAuthenticated: true,
      logout: mockLogout
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Desktop: El badge de usuario es un Link que apunta a /perfil
    const desktopProfileLink = screen.getByRole('link', { name: /Gonzalo/ });
    expect(desktopProfileLink).toBeInTheDocument();
    expect(desktopProfileLink.getAttribute('href')).toBe('/perfil');

    // Abrir menú mobile
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Mobile: Debe haber un enlace con texto "Perfil" que apunte a /perfil
    const mobileProfileLink = screen.getByRole('link', { name: /Perfil/ });
    expect(mobileProfileLink).toBeInTheDocument();
    expect(mobileProfileLink.getAttribute('href')).toBe('/perfil');
  });
});
