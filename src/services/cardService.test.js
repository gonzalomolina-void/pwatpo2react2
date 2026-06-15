import { describe, it, expect, vi, beforeEach } from 'vitest';
import cardService from './cardService';



describe('cardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  describe('getCards', () => {
    it('retorna un array de cartas si la respuesta HTTP es exitosa', async () => {
      const mockCards = [{ id: '1', nameEs: 'Carta de Prueba' }];
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards
      });

      const result = await cardService.getCards({ page: 1, limit: 10 });


      const expectedUrl = `${import.meta.env.VITE_API_URL}/cards?page=1&limit=10`;
      expect(globalThis.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({ method: 'GET' }));

      expect(result).toEqual(mockCards);
    });

    it('retorna un array vacio si el servidor responde con 404 (Not Found)', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await cardService.getCards();
      expect(result).toEqual([]);
    });

    it('lanza un error si la respuesta no es exitosa y no es 404', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(cardService.getCards()).rejects.toThrow('Error fetching cards: Internal Server Error');
    });

    it('ignora parametros null o undefined', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      await cardService.getCards({ page: 1, limit: null, search: undefined });
      
      const expectedUrl = `${import.meta.env.VITE_API_URL}/cards?page=1`;
      expect(globalThis.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({ method: 'GET' }));
    });

    it('loguea error si fetch falla', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(cardService.getCards()).rejects.toThrow('Network error');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('envia el token de autorizacion en las cabeceras si existe en localStorage', async () => {
      localStorage.setItem('hexa_token', 'test-token');
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      await cardService.getCards({ page: 1 });

      const expectedUrl = `${import.meta.env.VITE_API_URL}/cards?page=1`;
      expect(globalThis.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      }));
    });
  });

  describe('getCardById', () => {
    it('retorna la carta correspondiente al id buscado', async () => {
      const mockCard = { id: 'card-1', nameEs: 'Mago' };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCard
      });

      const result = await cardService.getCardById('card-1');
      expect(globalThis.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/cards/card-1`, expect.objectContaining({ method: 'GET' }));

      expect(result).toEqual(mockCard);

    });

    it('retorna null si la carta no existe (HTTP 404)', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await cardService.getCardById('invalid-id');
      expect(result).toBeNull();
    });

    it('lanza un error si el servidor falla (HTTP 500)', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      });

      await expect(cardService.getCardById('card-1')).rejects.toThrow('Error fetching card card-1: Server Error');
    });

    it('loguea error si fetch falla', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(cardService.getCardById('1')).rejects.toThrow('Network error');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('envia el token de autorizacion en las cabeceras si existe en localStorage', async () => {
      localStorage.setItem('hexa_token', 'test-token');
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await cardService.getCardById('card-123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/cards/card-123`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });

  describe('getCardForEdit', () => {
    it('debe solicitar la carta enviando peticion GET a /cards/:id/edit', async () => {
      const mockCardEdit = { id: '1', cost: 3, translations: { es: { name: 'Fuego' } } };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCardEdit
      });

      const result = await cardService.getCardForEdit('1');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/cards/1/edit`,
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual(mockCardEdit);
    });

    it('debe propagar los errores de la API', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(cardService.getCardForEdit('1')).rejects.toThrow('Error fetching card for edit 1: Forbidden');
    });
  });

  describe('createCard', () => {
    it('debe enviar una peticion POST a /cards con el payload', async () => {
      const payload = { cost: 4, atk: 2, def: 2, image: 'img.png' };
      const mockResponse = { id: 'new-id', ...payload };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await cardService.createCard(payload);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/cards`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('debe propagar los errores de la API al crear', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(cardService.createCard({})).rejects.toThrow('Error creating card: Bad Request');
    });
  });

  describe('updateCard', () => {
    it('debe enviar una peticion PUT a /cards/:id con el payload', async () => {
      const payload = { cost: 5 };
      const mockResponse = { id: '1', cost: 5 };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await cardService.updateCard('1', payload);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/cards/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('debe propagar los errores de la API al actualizar', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(cardService.updateCard('1', {})).rejects.toThrow('Error updating card 1: Not Found');
    });
  });

  describe('deleteCard', () => {
    it('debe enviar una peticion DELETE a /cards/:id', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      });

      const result = await cardService.deleteCard('1');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/cards/1`,
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toBeNull();
    });

    it('debe propagar los errores de la API al eliminar', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(cardService.deleteCard('1')).rejects.toThrow('Error deleting card 1: Forbidden');
    });
  });
});

