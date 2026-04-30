import storageService from './storageService';

const SPLASH_KEY = 'hexa_splash_seen';
const LANG_KEY = 'hexa_lang';
const THEME_KEY = 'hexa_theme';

export const preferencesService = {
  // ... (session methods)
  hasSeenSplashScreen: () => {
    return sessionStorage.getItem(SPLASH_KEY) === 'true';
  },
  
  setSplashScreenSeen: () => {
    sessionStorage.setItem(SPLASH_KEY, 'true');
  },

  // --- Cosas persistentes (Local) ---
  getLanguage: () => {
    return storageService.get(LANG_KEY) || 'es';
  },
  
  setLanguage: (lang) => {
    storageService.set(LANG_KEY, lang);
  },

  getTheme: () => {
    return storageService.get(THEME_KEY) || 'dark';
  },

  setTheme: (theme) => {
    storageService.set(THEME_KEY, theme);
  }
};
