/**
 * @typedef {Object} Card
 * @property {string} id - ID único de la carta.
 * @property {number} cost - Costo de maná/energía.
 * @property {Object} media - Assets multimedia.
 * @property {string} media.image - Path de la imagen.
 * @property {number} atk - Puntos de ataque.
 * @property {number} def - Puntos de defensa.
 * @property {string} nameEs - Nombre en español.
 * @property {string} nameEn - Nombre en inglés.
 * @property {string} typeEs - Tipo en español.
 * @property {string} typeEn - Tipo en inglés.
 * @property {string} rarityEs - Rareza en español.
 * @property {string} rarityEn - Rareza en inglés.
 * @property {string} descriptionEs - Descripción en español.
 * @property {string} descriptionEn - Descripción en inglés.
 */

import apiClient from './apiClient';

const cardService = {
  /**
   * Obtiene un listado paginado de cartas del catálogo.
   * 
   * @param {Object} params - Parámetros de búsqueda y paginación.
   * @param {number} [params.page] - Número de página.
   * @param {number} [params.limit] - Cantidad de cartas por página.
   * @param {string} [params.search] - Término de búsqueda por nombre.
   * @param {string} [params.type] - Filtrado por tipo (Backend).
   * @param {string} [params.rarity] - Filtrado por rareza (Backend).
   * @param {Object} [options] - Opciones adicionales.
   * @param {AbortSignal} [options.signal] - Señal para abortar la petición.
   * @returns {Promise<Card[]>} - Array de cartas.
   */
  getCards: async (params = {}, { signal } = {}) => {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const query = searchParams.toString();
      const endpoint = `/cards${query ? `?${query}` : ''}`;

      return await apiClient.get(endpoint, { signal });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (error.status === 404) return [];
      console.error('Error in cardService.getCards:', error);
      throw new Error(`Error fetching cards: ${error.message}`);
    }
  },

  /**
   * Obtiene el detalle de una carta específica por su ID.
   * 
   * @param {string} id - ID de la carta.
   * @param {Object} [options] - Opciones adicionales.
   * @param {AbortSignal} [options.signal] - Señal para abortar la petición.
   * @returns {Promise<Card|null>} - Objeto de la carta o null si no se encuentra.
   */
  getCardById: async (id, { signal } = {}) => {
    try {
      return await apiClient.get(`/cards/${id}`, { signal });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (error.status === 404) return null;
      console.error(`Error in cardService.getCardById(${id}):`, error);
      throw new Error(`Error fetching card ${id}: ${error.message}`);
    }
  }
};

export default cardService;
