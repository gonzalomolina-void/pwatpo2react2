import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';
import favoritesService from '../services/favoritesService';
import profileService from '../services/profileService';
import { preferencesService } from '../services/preferencesService';
import i18n from 'i18next';

vi.mock('../services/authService');
vi.mock('../services/profileService', () => ({
  default: {
    getProfile: vi.fn().mockResolvedValue({ darkMode: false, language: 'es' }),
    updateProfile: vi.fn().mockResolvedValue({})
  }
}));
vi.mock('../services/preferencesService', () => ({
  preferencesService: {
    getTheme: vi.fn().mockReturnValue('dark'),
    setTheme: vi.fn(),
    getLanguage: vi.fn().mockReturnValue('es'),
    setLanguage: vi.fn()
  }
}));
vi.mock('i18next', () => ({
  default: {
    language: 'es',
    changeLanguage: vi.fn().mockResolvedValue(true)
  }
}));
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

  it('debe registrar un nuevo usuario correctamente al llamar a register', async () => {
    const mockRegisterResponse = { id: 2, email: 'new@test.com', name: 'Gonzalo', role: 'usuario' };
    authService.register.mockResolvedValueOnce(mockRegisterResponse);

    let authInstance;
    render(
      <AuthProvider>
        <TestComponent onMount={(auth) => { authInstance = auth; }} />
      </AuthProvider>
    );

    let result;
    await act(async () => {
      result = await authInstance.register('new@test.com', 'Gonzalo', 'password123');
    });

    expect(authService.register).toHaveBeenCalledWith('new@test.com', 'Gonzalo', 'password123');
    expect(result).toEqual(mockRegisterResponse);
  });

  // ✅ PRUEBAS DE SINCRONIZACIÓN DE PERFIL & PREFERENCIAS (US107)
  describe('Sincronización de Perfil (US107)', () => {
    it('debe aplicar las preferencias personalizadas del backend si difieren de las locales por defecto', async () => {
      // Configurar que el backend tiene perfil custom
      profileService.getProfile.mockResolvedValueOnce({ darkMode: true, language: 'en' });
      // Configurar que el cliente tiene defaults (dark / es)
      preferencesService.getTheme.mockReturnValue('dark');
      preferencesService.getLanguage.mockReturnValue('es');

      localStorage.setItem('hexa_token', 'jwt-token-107');
      authService.getMe.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });

      // Debe descargar y aplicar
      expect(profileService.getProfile).toHaveBeenCalled();
      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
      expect(preferencesService.setLanguage).toHaveBeenCalledWith('en');
      expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
      expect(profileService.updateProfile).not.toHaveBeenCalled();
    });

    it('debe subir las preferencias locales al backend si el servidor retorna defaults (isServerDefault) y el cliente tiene custom', async () => {
      // Servidor con default (darkMode: false, language: 'es')
      profileService.getProfile.mockResolvedValueOnce({ darkMode: false, language: 'es' });
      // Cliente con configuraciones modificadas locales (light / en)
      preferencesService.getTheme.mockReturnValue('light');
      preferencesService.getLanguage.mockReturnValue('en');

      localStorage.setItem('hexa_token', 'jwt-token-107');
      authService.getMe.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      });

      // Debe detectar discrepancia y subir
      expect(profileService.getProfile).toHaveBeenCalled();
      expect(profileService.updateProfile).toHaveBeenCalledWith({
        darkMode: false,
        language: 'en'
      });
    });

    it('debe actualizar preferencias localmente y en el servidor al llamar a updatePreferences estando autenticado', async () => {
      let authInstance;
      localStorage.setItem('hexa_token', 'jwt-token-107');
      authService.getMe.mockResolvedValueOnce({ id: 1, email: 'test@test.com' });

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent onMount={(auth) => { authInstance = auth; }} />
          </AuthProvider>
        );
      });

      vi.clearAllMocks(); // Limpiar llamadas del restore inicial
      
      // Simular cambio a dark mode y lenguaje inglés
      await act(async () => {
        await authInstance.updatePreferences({ darkMode: true, language: 'en' });
      });

      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
      expect(preferencesService.setLanguage).toHaveBeenCalledWith('en');
      expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
      expect(profileService.updateProfile).toHaveBeenCalledWith({
        darkMode: true,
        language: 'en'
      });
    });

    it('debe actualizar preferencias únicamente en local al llamar a updatePreferences estando anónimo', async () => {
      let authInstance;
      // Sin token ni sesión
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent onMount={(auth) => { authInstance = auth; }} />
          </AuthProvider>
        );
      });

      vi.clearAllMocks();

      await act(async () => {
        await authInstance.updatePreferences({ darkMode: false, language: 'es' });
      });

      expect(preferencesService.setTheme).toHaveBeenCalledWith('light');
      expect(preferencesService.setLanguage).toHaveBeenCalledWith('es');
      expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
      // NO debe intentar subir al backend
      expect(profileService.updateProfile).not.toHaveBeenCalled();
    });
  });
});
