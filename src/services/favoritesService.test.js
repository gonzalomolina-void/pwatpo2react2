import { describe, it, expect, vi, beforeEach } from 'vitest';
import favoritesService from './favoritesService';
import apiClient from './apiClient';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}));

describe('favoritesService with API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    favoritesService.clearFavorites();
  });

  describe('fetchFavorites', () => {
    it('llama a la API GET /favorites y llena el cache', async () => {
      const mockFavorites = [{ id: '1', name: 'Card 1' }, { id: 2, name: 'Card 2' }];
      apiClient.get.mockResolvedValueOnce(mockFavorites);

      const result = await favoritesService.fetchFavorites();

      expect(apiClient.get).toHaveBeenCalledWith('/favorites');
      expect(result).toEqual(mockFavorites);
      expect(favoritesService.getFavorites()).toEqual(mockFavorites);
    });

    it('limpia el cache y propaga el error si falla la API', async () => {
      const mockError = new Error('API Error');
      apiClient.get.mockRejectedValueOnce(mockError);

      // Metemos algo en el cache antes para probar que se limpie
      apiClient.post.mockResolvedValueOnce({});
      await favoritesService.addFavorite({ id: '1', name: 'Card 1' });

      await expect(favoritesService.fetchFavorites()).rejects.toThrow('API Error');
      expect(favoritesService.getFavorites()).toEqual([]);
    });
  });

  describe('isFavorite', () => {
    it('retorna true si el ID de la carta coincide con el cache (seguro de tipo string)', async () => {
      const mockFavorites = [{ id: 1 }, { id: '2' }];
      apiClient.get.mockResolvedValueOnce(mockFavorites);
      
      // Llenamos el cache esperando a que termine la promesa
      await favoritesService.fetchFavorites();
      
      expect(favoritesService.isFavorite('1')).toBe(true);
      expect(favoritesService.isFavorite(1)).toBe(true);
      expect(favoritesService.isFavorite('2')).toBe(true);
      expect(favoritesService.isFavorite(2)).toBe(true);
    });

    it('retorna false si el ID no esta en el cache', () => {
      expect(favoritesService.isFavorite('99')).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('agrega optimistamente la carta al cache y hace POST a la API', async () => {
      const card = { id: 3, name: 'Card 3' };
      apiClient.post.mockResolvedValueOnce({ message: 'Success' });

      const promise = favoritesService.addFavorite(card);
      
      // La UI/Cache debería actualizarse inmediatamente antes de que resuelva el POST
      expect(favoritesService.isFavorite(3)).toBe(true);

      const result = await promise;
      expect(apiClient.post).toHaveBeenCalledWith('/favorites', { cardId: 3 });
      expect(result).toEqual([card]);
    });

    it('revierte el cache (rollback) si el POST falla', async () => {
      const card = { id: 4, name: 'Card 4' };
      apiClient.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(favoritesService.addFavorite(card)).rejects.toThrow('Network Error');
      
      // Debe haber vuelto a falso
      expect(favoritesService.isFavorite(4)).toBe(false);
    });
  });

  describe('removeFavorite', () => {
    it('remueve optimistamente la carta del cache y hace DELETE a la API', async () => {
      const card = { id: '5', name: 'Card 5' };
      apiClient.post.mockResolvedValueOnce({});
      await favoritesService.addFavorite(card);

      apiClient.delete.mockResolvedValueOnce({ message: 'Deleted' });

      const promise = favoritesService.removeFavorite('5');

      // Eliminación optimista en el cache
      expect(favoritesService.isFavorite('5')).toBe(false);

      await promise;
      expect(apiClient.delete).toHaveBeenCalledWith('/favorites/5');
      expect(favoritesService.getFavorites()).toEqual([]);
    });

    it('revierte el cache (rollback) si el DELETE falla', async () => {
      const card = { id: 6, name: 'Card 6' };
      apiClient.post.mockResolvedValueOnce({});
      await favoritesService.addFavorite(card);

      apiClient.delete.mockRejectedValueOnce(new Error('Delete Failed'));

      await expect(favoritesService.removeFavorite(6)).rejects.toThrow('Delete Failed');

      // Debe volver a estar en favoritos
      expect(favoritesService.isFavorite(6)).toBe(true);
    });
  });

  describe('toggleFavorite', () => {
    it('llama a addFavorite si la carta no es favorita', async () => {
      const card = { id: 7 };
      apiClient.post.mockResolvedValueOnce({});

      await favoritesService.toggleFavorite(card);

      expect(apiClient.post).toHaveBeenCalledWith('/favorites', { cardId: 7 });
      expect(favoritesService.isFavorite(7)).toBe(true);
    });

    it('llama a removeFavorite si la carta ya es favorita', async () => {
      const card = { id: 8 };
      apiClient.post.mockResolvedValueOnce({});
      await favoritesService.addFavorite(card);

      apiClient.delete.mockResolvedValueOnce({});
      await favoritesService.toggleFavorite(card);

      expect(apiClient.delete).toHaveBeenCalledWith('/favorites/8');
      expect(favoritesService.isFavorite(8)).toBe(false);
    });
  });
});
