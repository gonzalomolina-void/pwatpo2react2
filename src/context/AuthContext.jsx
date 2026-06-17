import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import favoritesService from '../services/favoritesService';
import { parseJwt } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Intentar restaurar la sesión al montar
  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem('hexa_token');
      if (savedToken) {
        try {
          const userData = await authService.getMe(savedToken);
          const payload = parseJwt(savedToken);
          const userWithRole = {
            ...userData,
            role: payload?.role || userData?.role || 'usuario'
          };
          setToken(savedToken);
          setUser(userWithRole);
          // Cargar favoritos en cache al restaurar sesión
          await favoritesService.fetchFavorites();
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('hexa_token');
          favoritesService.clearFavorites();
        }
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  // Escuchar evento global de expiracion de sesion
  useEffect(() => {
    const handleAuthExpired = () => {
      console.warn('Session expired event received, cleaning up local state');
      localStorage.removeItem('hexa_token');
      setToken(null);
      setUser(null);
      favoritesService.clearFavorites();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  /**
   * Registra un nuevo usuario en la plataforma.
   */
  const register = async (email, name, password) => {
    setLoading(true);
    try {
      const result = await authService.register(email, name, password);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Inicia sesión con credenciales de usuario.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      // Guardar token en localStorage
      localStorage.setItem('hexa_token', result.token);
      
      const payload = parseJwt(result.token);
      const userWithRole = {
        ...result.user,
        role: payload?.role || result.user?.role || 'usuario'
      };

      setToken(result.token);
      setUser(userWithRole);
      // Cargar favoritos en cache al iniciar sesión
      await favoritesService.fetchFavorites();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Cierra la sesión del usuario.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed, cleaning up local session anyway:', error);
    } finally {
      localStorage.removeItem('hexa_token');
      setToken(null);
      setUser(null);
      favoritesService.clearFavorites();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
