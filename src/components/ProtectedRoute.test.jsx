import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Mock del AuthContext
vi.mock('../context/AuthContext');

// Mock del componente Navigate de react-router-dom para aserciones limpias
vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to, replace }) => (
    <div data-testid="mock-navigate" data-to={to} data-replace={replace ? "true" : "false"}>
      Redirected to {to}
    </div>
  ))
}));

// Mock de LoadingSpinner
vi.mock('./LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Cargando...</div>
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el LoadingSpinner si está cargando la sesión', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true
    });

    render(
      <ProtectedRoute>
        <div>Child Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
  });

  it('debe redirigir a /login usando Navigate si el usuario no está autenticado', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false
    });

    render(
      <ProtectedRoute>
        <div>Child Content</div>
      </ProtectedRoute>
    );

    const navigateEl = screen.getByTestId('mock-navigate');
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl.getAttribute('data-to')).toBe('/login');
    expect(navigateEl.getAttribute('data-replace')).toBe('true');
    expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
  });

  it('debe renderizar los hijos si el usuario está autenticado', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { email: 'user@test.com', role: 'usuario' }
    });

    render(
      <ProtectedRoute>
        <div>Child Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  it('debe redirigir a / si el usuario está autenticado pero no tiene un rol permitido', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { email: 'user@test.com', role: 'usuario' }
    });

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    const navigateEl = screen.getByTestId('mock-navigate');
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl.getAttribute('data-to')).toBe('/');
    expect(navigateEl.getAttribute('data-replace')).toBe('true');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('debe renderizar los hijos si el usuario tiene el rol permitido', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { email: 'admin@test.com', role: 'admin' }
    });

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });
});
