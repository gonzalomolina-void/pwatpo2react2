import apiClient from './apiClient';

let cachedFavorites = [];

/**
 * Servicio para gestionar la persistencia de las cartas favoritas del usuario.
 * Ahora se conecta con el backend e implementa un cache en memoria para evitar
 * consultas N+1 en el renderizado de cartas.
 */
const favoritesService = {
  /**
   * Inicializa y obtiene el caché desde el backend.
   * @returns {Promise<Object[]>}
   */
  fetchFavorites: async () => {
    try {
      cachedFavorites = await apiClient.get('/favorites') || [];
      return cachedFavorites;
    } catch (error) {
      cachedFavorites = [];
      throw error;
    }
  },

  /**
   * Obtiene el listado de objetos de cartas favoritas desde el caché local.
   * @returns {Object[]}
   */
  getFavorites: () => {
    return cachedFavorites;
  },

  /**
   * Agrega una carta a favoritos.
   * @param {Object} card - Objeto completo de la carta.
   * @returns {Promise<Object[]>} - Lista actualizada de favoritos.
   */
  addFavorite: async (card) => {
    // Agregar optimistamente
    if (!cachedFavorites.some(f => String(f.id) === String(card.id))) {
      cachedFavorites.push(card);
    }

    try {
      await apiClient.post('/favorites', { cardId: card.id });
    } catch (error) {
      // Rollback ante fallo de API
      cachedFavorites = cachedFavorites.filter(f => String(f.id) !== String(card.id));
      throw error;
    }

    return cachedFavorites;
  },

  /**
   * Elimina una carta de favoritos.
   * @param {string|number} cardId 
   * @returns {Promise<Object[]>} - Lista actualizada de favoritos.
   */
  removeFavorite: async (cardId) => {
    const originalFavorites = [...cachedFavorites];
    // Eliminar optimistamente
    cachedFavorites = cachedFavorites.filter(f => String(f.id) !== String(cardId));

    try {
      await apiClient.delete(`/favorites/${cardId}`);
    } catch (error) {
      // Rollback ante fallo de API
      cachedFavorites = originalFavorites;
      throw error;
    }

    return cachedFavorites;
  },

  /**
   * Alterna el estado de favorito de una carta.
   * @param {Object} card - Objeto completo de la carta.
   * @returns {Promise<Object[]>} - Lista actualizada de favoritos.
   */
  toggleFavorite: async (card) => {
    if (favoritesService.isFavorite(card.id)) {
      return favoritesService.removeFavorite(card.id);
    } else {
      return favoritesService.addFavorite(card);
    }
  },

  /**
   * Verifica si una carta es favorita por su ID de forma sincrónica.
   * @param {string|number} cardId 
   * @returns {boolean}
   */
  isFavorite: (cardId) => {
    return cachedFavorites.some(f => String(f.id) === String(cardId));
  },

  /**
   * Limpia todos los favoritos del caché en memoria.
   */
  clearFavorites: () => {
    cachedFavorites = [];
  }
};

export default favoritesService;