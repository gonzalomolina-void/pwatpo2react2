import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';
import favoritesService from '../services/favoritesService';

vi.mock('../services/authService');
vi.mock('../services/favoritesService', () => ({
  default: {
    fetchFavorites: vi.fn().mockResolvedValue([]),
    clearFavorites: vi.fn()
  }
}));

// Helper component
function TestComponent({ onMount }) {
  const auth = useAuth();
  useEffect(() => {
    if (onMount) onMount(auth);
  }, [auth, onMount]);

  return (
    <div>
      <div data-testid="user">{auth.user ? auth.user.email : 'null'}</div>
      <div data-testid="loading">{auth.loading ? 'true' : 'false'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <button onClick={() => auth.login('test@test.com', 'password123')}>Login</button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe inicializar con user en null y loading en false por defecto si no hay token', async () => {
    let authInstance;
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent onMount={(auth) => { authInstance = auth; }} />
        </AuthProvider>
      );
    });

    expect(authInstance.user).toBeNull();
    expect(authInstance.loading).toBe(false);
    expect(authInstance.isAuthenticated).toBe(false);
    expect(favoritesService.fetchFavorites).not.toHaveBeenCalled();
  });

  it('debe restaurar la sesion y cargar favoritos si hay token en localStorage', async () => {
    const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
    localStorage.setItem('hexa_token', 'saved-jwt-token');
    authService.getMe.mockResolvedValueOnce(mockUser);

    let authInstance;
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent onMount={(auth) => { authInstance = auth; }} />
        </AuthProvider>
      );
    });

    expect(authService.getMe).toHaveBeenCalledWith('saved-jwt-token');
    expect(authInstance.user).toEqual(mockUser);
    expect(authInstance.isAuthenticated).toBe(true);
    expect(favoritesService.fetchFavorites).toHaveBeenCalled();
  });

  it('debe iniciar sesion correctamente al llamar a login y cargar favoritos', async () => {
    const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
    const mockLoginResponse = { token: 'jwt-token', user: mockUser };
    
    authService.login.mockResolvedValueOnce(mockLoginResponse);
    authService.getMe.mockResolvedValueOnce(mockUser);

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    await act(async () => {
      await authInstance.login('test@test.com', 'password123');
    });

    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(authInstance.user).toEqual(mockUser);
    expect(authInstance.isAuthenticated).toBe(true);
    expect(favoritesService.fetchFavorites).toHaveBeenCalled();
  });

  it('debe lanzar error y mantener al usuario en null si login falla sin cargar favoritos', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    await expect(
      act(async () => {
        await authInstance.login('test@test.com', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid credentials');

    expect(authInstance.user).toBeNull();
    expect(authInstance.isAuthenticated).toBe(false);
    expect(favoritesService.fetchFavorites).not.toHaveBeenCalled();
  });

  it('debe cerrar sesion correctamente al llamar a logout y limpiar favoritos', async () => {
    authService.logout.mockResolvedValueOnce(true);

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
    authService.login.mockResolvedValueOnce({ token: 'jwt-token', user: mockUser });
    
    await act(async () => {
      await authInstance.login('test@test.com', 'password123');
    });

    expect(authInstance.user).toEqual(mockUser);
    vi.clearAllMocks(); // Limpiar llamadas previas (del login)

    await act(async () => {
      await authInstance.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(authInstance.user).toBeNull();
    expect(authInstance.isAuthenticated).toBe(false);
    expect(favoritesService.clearFavorites).toHaveBeenCalled();
  });

  it('debería decodificar el JWT y asignar el rol admin al restaurar sesión', async () => {
    // JWT con payload: { id: 1, email: 'test@test.com', role: 'admin' }
    const adminToken = 'header.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6ImFkbWluIn0.signature';
    localStorage.setItem('hexa_token', adminToken);
    
    // getMe no devuelve rol para forzar la lectura del JWT
    const mockUserData = { id: 1, email: 'test@test.com' };
    authService.getMe.mockResolvedValueOnce(mockUserData);

    let authInstance;
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent onMount={(auth) => { authInstance = auth; }} />
        </AuthProvider>
      );
    });

    expect(authInstance.user).toEqual({ id: 1, email: 'test@test.com', role: 'admin' });
    expect(authInstance.user.role).toBe('admin');
  });

  it('debería decodificar el JWT y asignar el rol admin al iniciar sesión (login)', async () => {
    const adminToken = 'header.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiJ9.signature';
    const mockUserData = { id: 1, email: 'admin@test.com' };
    const mockLoginResponse = { token: adminToken, user: mockUserData };
    
    authService.login.mockResolvedValueOnce(mockLoginResponse);

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    await act(async () => {
      await authInstance.login('admin@test.com', 'password123');
    });

    expect(authInstance.user).toEqual({ id: 1, email: 'admin@test.com', role: 'admin' });
    expect(authInstance.user.role).toBe('admin');
  });
});
