/**
 * @typedef {Object} CardTranslation
 * @property {string} name - Nombre de la carta.
 * @property {string} type - Tipo de carta.
 * @property {string} rarity - Rareza de la carta.
 * @property {string} lore - Historia de la carta.
 */

/**
 * @typedef {Object} Card
 * @property {string} id - ID único de la carta.
 * @property {number} cost - Costo de maná/energía.
 * @property {string} image - Path de la imagen.
 * @property {number} atk - Puntos de ataque.
 * @property {number} def - Puntos de defensa.
 * @property {CardTranslation} es - Traducción al español.
 * @property {CardTranslation} en - Traducción al inglés.
 */

const API_URL = import.meta.env.VITE_API_URL;

const cardService = {
  /**
   * Obtiene un listado paginado de cartas del catálogo.
   * 
   * @param {Object} params - Parámetros de búsqueda y paginación.
   * @param {number} [params.page] - Número de página.
   * @param {number} [params.limit] - Cantidad de cartas por página.
   * @param {string} [params.search] - Término de búsqueda por nombre.
   * @returns {Promise<Card[]>} - Array de cartas.
   */
  getCards: async (params = {}) => {
    try {
      const url = new URL(`${API_URL}/cards`);
      
      // Usar URLSearchParams para un manejo más limpio de los parámetros
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      url.search = searchParams.toString();

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`Error fetching cards: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in cardService.getCards:', error);
      throw error;
    }
  },

  /**
   * Obtiene el detalle de una carta específica por su ID.
   * 
   * @param {string} id - ID de la carta.
   * @returns {Promise<Card|null>} - Objeto de la carta o null si no se encuentra.
   */
  getCardById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/cards/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error fetching card ${id}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in cardService.getCardById(${id}):`, error);
      throw error;
    }
  }
};

export default cardService;
