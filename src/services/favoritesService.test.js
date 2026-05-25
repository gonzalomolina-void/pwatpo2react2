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
      const mockFavorites = [{ id: 'card-1' }, { id: 'card-2' }];
      storageService.get.mockReturnValueOnce(mockFavorites);
      expect(favoritesService.getFavorites()).toEqual(mockFavorites);
    });
  });

  describe('addFavorite', () => {
    it('agrega un objeto de carta completo a la lista de favoritos', () => {
      const mockCard1 = { id: 'card-1', nameEn: 'Card 1' };
      const mockCard2 = { id: 'card-2', nameEn: 'Card 2' };
      storageService.get.mockReturnValueOnce([mockCard1]);
      
      const result = favoritesService.addFavorite(mockCard2);

      expect(result).toEqual([mockCard1, mockCard2]);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', [mockCard1, mockCard2]);
    });

    it('no duplica el objeto si el id ya se encuentra en favoritos', () => {
      const mockCard1 = { id: 'card-1', nameEn: 'Card 1' };
      storageService.get.mockReturnValueOnce([mockCard1]);
      
      const result = favoritesService.addFavorite(mockCard1);

      expect(result).toEqual([mockCard1]);
      expect(storageService.set).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('elimina un objeto por id de la lista', () => {
      const mockCard1 = { id: 'card-1' };
      const mockCard2 = { id: 'card-2' };
      storageService.get.mockReturnValueOnce([mockCard1, mockCard2]);
      
      const result = favoritesService.removeFavorite('card-1');

      expect(result).toEqual([mockCard2]);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', [mockCard2]);
    });
  });

  describe('toggleFavorite', () => {
    it('agrega la carta si no es favorita actualmente', () => {
      const mockCard1 = { id: 'card-1' };
      storageService.get.mockReturnValueOnce([]);
      favoritesService.toggleFavorite(mockCard1);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', [mockCard1]);
    });

    it('remueve la carta si ya es favorita', () => {
      const mockCard1 = { id: 'card-1' };
      storageService.get.mockReturnValueOnce([mockCard1]);
      favoritesService.toggleFavorite(mockCard1);
      expect(storageService.set).toHaveBeenCalledWith('hexa_favorites', []);
    });
  });

  describe('isFavorite', () => {
    it('retorna true si el id esta en la lista de objetos', () => {
      storageService.get.mockReturnValueOnce([{ id: 'card-1' }]);
      expect(favoritesService.isFavorite('card-1')).toBe(true);
    });

    it('retorna false si el id no esta en la lista', () => {
      storageService.get.mockReturnValueOnce([{ id: 'card-2' }]);
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
