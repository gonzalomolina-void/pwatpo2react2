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

import i18n from '../i18n';

const API_URL = import.meta.env.VITE_API_URL;

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
      const url = new URL(`${API_URL}/cards`);
      
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      url.search = searchParams.toString();

      const response = await fetch(url, { 
        signal,
        headers: {
          'Accept-Language': i18n.language || 'es'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`Error fetching cards: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.error('Error in cardService.getCards:', error);
      throw error;
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
      const response = await fetch(`${API_URL}/cards/${id}`, { 
        signal,
        headers: {
          'Accept-Language': i18n.language || 'es'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error fetching card ${id}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.error(`Error in cardService.getCardById(${id}):`, error);
      throw error;
    }
  }
};


export default cardService;
