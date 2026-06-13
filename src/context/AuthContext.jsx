import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

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
          setToken(savedToken);
          setUser(userData);
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('hexa_token');
        }
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  /**
   * Registra un nuevo usuario en la plataforma.
   */
  const register = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.register(email, password);
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
      localStorage.setItem('hexa_token', result.accessToken);
      setToken(result.accessToken);
      setUser(result.user);
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
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
