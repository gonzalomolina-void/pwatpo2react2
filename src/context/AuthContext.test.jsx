import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';

vi.mock('../services/authService');

// Componente helper para interactuar con useAuth en los tests
function TestComponent({ onMount }) {
  const auth = useAuth();
  useEffect(() => {
    if (onMount) onMount(auth);
  }, [auth]);

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
  });

  it('debe inicializar con user en null y loading en false por defecto', async () => {
    authService.getMe.mockRejectedValueOnce(new Error('No session'));

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
  });

  it('debe iniciar sesion correctamente al llamar a login', async () => {
    const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
    const mockLoginResponse = { accessToken: 'jwt-token', user: mockUser };
    
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
  });

  it('debe lanzar error y mantener al usuario en null si login falla', async () => {
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
  });

  it('debe cerrar sesion correctamente al llamar a logout', async () => {
    authService.logout.mockResolvedValueOnce(true);

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    // Simulamos que el usuario ya estaba autenticado seteandolo manualmente o iniciando sesion
    // En este caso, usaremos el mock de login primero
    const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
    authService.login.mockResolvedValueOnce({ accessToken: 'jwt-token', user: mockUser });
    
    await act(async () => {
      await authInstance.login('test@test.com', 'password123');
    });

    expect(authInstance.user).toEqual(mockUser);

    // Ahora cerramos sesion
    await act(async () => {
      await authInstance.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(authInstance.user).toBeNull();
    expect(authInstance.isAuthenticated).toBe(false);
  });
});
