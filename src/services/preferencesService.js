import storageService from './storageService';

const SPLASH_KEY = 'tcg_nexus_splash_seen';
const LANG_KEY = 'tcg_nexus_lang';

export const preferencesService = {
  // --- Cosas efímeras (Sesión) ---
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
  }
};
