import { describe, it, expect, vi, beforeEach } from 'vitest';
import { preferencesService } from './preferencesService';
import storageService from './storageService';


vi.mock('./storageService', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

describe('preferencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('Splash Screen', () => {
    it('hasSeenSplashScreen retorna false por defecto si no se ha visto', () => {
      expect(preferencesService.hasSeenSplashScreen()).toBe(false);
    });

    it('setSplashScreenSeen guarda "true" en sessionStorage', () => {
      preferencesService.setSplashScreenSeen();
      expect(sessionStorage.getItem('hexa_splash_seen')).toBe('true');
      expect(preferencesService.hasSeenSplashScreen()).toBe(true);
    });
  });

  describe('Idioma (Language)', () => {
    it('getLanguage retorna "es" como fallback si no hay valor guardado', () => {
      storageService.get.mockReturnValueOnce(null);
      expect(preferencesService.getLanguage()).toBe('es');
      expect(storageService.get).toHaveBeenCalledWith('hexa_lang');
    });

    it('getLanguage retorna el valor guardado si existe', () => {
      storageService.get.mockReturnValueOnce('en');
      expect(preferencesService.getLanguage()).toBe('en');
    });

    it('setLanguage guarda el valor usando storageService', () => {
      preferencesService.setLanguage('en');
      expect(storageService.set).toHaveBeenCalledWith('hexa_lang', 'en');
    });
  });

  describe('Tema (Theme)', () => {
    it('getTheme retorna "dark" por defecto', () => {
      storageService.get.mockReturnValueOnce(null);
      expect(preferencesService.getTheme()).toBe('dark');
    });

    it('getTheme retorna el tema guardado', () => {
      storageService.get.mockReturnValueOnce('light');
      expect(preferencesService.getTheme()).toBe('light');
    });

    it('setTheme guarda el tema usando storageService', () => {
      preferencesService.setTheme('light');
      expect(storageService.set).toHaveBeenCalledWith('hexa_theme', 'light');
    });
  });
});
