import { describe, it, expect, vi, beforeEach } from 'vitest';
import favoritesService from './favoritesService';
import storageService from './storageService';


vi.mock('./storageService', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

describe('favoritesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('retorna un array vacio si no hay favoritos guardados', () => {
      storageService.get.mockReturnValueOnce(null);
      expect(favoritesService.getFavorites()).toEqual([]);
    });

    it('retorna la lista de favoritos guardados', () => {
      storageService.get.mockReturnValueOnce(['card-1', 'card-2']);
      expect(favoritesService.getFavorites()).toEqual(['card-1', 'card-2']);
    });
  });

  describe('addFavorite', () => {
    it('agrega un nuevo id a la lista de favoritos', () => {
      storageService.get.mockReturnValueOnce(['card-1']);
      const result = favoritesService.addFavorite('card-2');

      expect(result).toEqual(['card-1', 'card-2']);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', ['card-1', 'card-2']);
    });

    it('no duplica el id si ya se encuentra en favoritos', () => {
      storageService.get.mockReturnValueOnce(['card-1']);
      const result = favoritesService.addFavorite('card-1');

      expect(result).toEqual(['card-1']);
      expect(storageService.set).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('elimina un id existente de la lista', () => {
      storageService.get.mockReturnValueOnce(['card-1', 'card-2']);
      const result = favoritesService.removeFavorite('card-1');

      expect(result).toEqual(['card-2']);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', ['card-2']);
    });
  });

  describe('toggleFavorite', () => {
    it('agrega la carta si no es favorita actualmente', () => {
      storageService.get.mockReturnValueOnce([]);
      favoritesService.toggleFavorite('card-1');
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', ['card-1']);
    });

    it('remueve la carta si ya es favorita', () => {
      storageService.get.mockReturnValueOnce(['card-1']);
      favoritesService.toggleFavorite('card-1');
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', []);
    });
  });

  describe('isFavorite', () => {
    it('retorna true si el id esta en la lista', () => {
      storageService.get.mockReturnValueOnce(['card-1']);
      expect(favoritesService.isFavorite('card-1')).toBe(true);
    });

    it('retorna false si el id no esta en la lista', () => {
      storageService.get.mockReturnValueOnce(['card-2']);
      expect(favoritesService.isFavorite('card-1')).toBe(false);
    });
  });

  describe('clearFavorites', () => {
    it('limpia por completo el array de favoritos', () => {
      favoritesService.clearFavorites();
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', []);
    });
  });
});
