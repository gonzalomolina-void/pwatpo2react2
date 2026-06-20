import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import favoritesService from '../services/favoritesService';
import profileService from '../services/profileService';
import { preferencesService } from '../services/preferencesService';
import i18n from 'i18next';
import { parseJwt } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState(() => preferencesService.getTheme());
  const [language, setLanguageState] = useState(() => preferencesService.getLanguage());

  // Sincronizar perfil del backend con preferencias locales
  const syncProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      const localTheme = preferencesService.getTheme();
      const localLang = preferencesService.getLanguage();

      const isServerDefault = !profile.darkMode && profile.language === 'es';
      const isLocalDefault = localTheme === 'dark' && localLang === 'es';

      if (profile.darkMode !== (localTheme === 'dark') || profile.language !== localLang) {
        if (isServerDefault && !isLocalDefault) {
          // Servidor tiene defaults pero cliente tiene configs personalizadas: subir al servidor
          await profileService.updateProfile({
            darkMode: localTheme === 'dark',
            language: localLang
          });
        } else {
          // Servidor tiene configs personalizadas: descargar y aplicar en cliente
          const newTheme = profile.darkMode ? 'dark' : 'light';
          preferencesService.setTheme(newTheme);
          setThemeState(newTheme);
          preferencesService.setLanguage(profile.language);
          setLanguageState(profile.language);
          i18n.changeLanguage(profile.language);

          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync profile:', error);
    }
  };

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
          // Sincronizar perfil remota-local
          await syncProfile();
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
      // Sincronizar perfil remota-local
      await syncProfile();
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

  /**
   * Actualiza el idioma y tema unificados local y remotamente.
   */
  const updatePreferences = async (updates) => {
    const currentTheme = preferencesService.getTheme();
    const currentLang = preferencesService.getLanguage();

    const nextTheme = updates.darkMode !== undefined 
      ? (updates.darkMode ? 'dark' : 'light') 
      : currentTheme;

    const nextLang = updates.language !== undefined 
      ? updates.language 
      : currentLang;

    // 1. Aplicación local
    if (updates.darkMode !== undefined) {
      preferencesService.setTheme(nextTheme);
      setThemeState(nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    if (updates.language !== undefined) {
      preferencesService.setLanguage(nextLang);
      setLanguageState(nextLang);
      i18n.changeLanguage(nextLang);
    }

    // 2. Propagación al servidor si hay token y sesión activa
    const tokenExists = localStorage.getItem('hexa_token');
    if (tokenExists) {
      try {
        await profileService.updateProfile({
          darkMode: nextTheme === 'dark',
          language: nextLang
        });
      } catch (error) {
        console.error('Failed to sync preferences to remote server:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, theme, language, updatePreferences, isAuthenticated: !!user }}>
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
