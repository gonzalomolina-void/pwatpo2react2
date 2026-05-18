import { describe, it, expect, vi, beforeEach } from 'vitest';
import cardService from './cardService';



describe('cardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn();
  });

  describe('getCards', () => {
    it('retorna un array de cartas si la respuesta HTTP es exitosa', async () => {
      const mockCards = [{ id: '1', nameEs: 'Carta de Prueba' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards
      });

      const result = await cardService.getCards({ page: 1, limit: 10 });


      const expectedUrl = new URL(`${import.meta.env.VITE_API_URL}/cards?page=1&limit=10`);
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockCards);
    });

    it('retorna un array vacio si el servidor responde con 404 (Not Found)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await cardService.getCards();
      expect(result).toEqual([]);
    });

    it('lanza un error si la respuesta no es exitosa y no es 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(cardService.getCards()).rejects.toThrow('Error fetching cards: Internal Server Error');
    });
  });

  describe('getCardById', () => {
    it('retorna la carta correspondiente al id buscado', async () => {
      const mockCard = { id: 'card-1', nameEs: 'Mago' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCard
      });

      const result = await cardService.getCardById('card-1');
      expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/cards/card-1`);
      expect(result).toEqual(mockCard);
    });

    it('retorna null si la carta no existe (HTTP 404)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await cardService.getCardById('invalid-id');
      expect(result).toBeNull();
    });

    it('lanza un error si el servidor falla (HTTP 500)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      });

      await expect(cardService.getCardById('card-1')).rejects.toThrow('Error fetching card card-1: Server Error');
    });
  });
});
