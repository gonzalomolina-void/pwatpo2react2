import storageService from './storageService';

const FAVORITES_KEY = 'hexa_favorites';

/**
 * Servicio para gestionar la persistencia de las cartas favoritas del usuario.
 */
const favoritesService = {
  /**
   * Obtiene el listado de IDs de cartas favoritas.
   * @returns {string[]}
   */
  getFavorites: () => {
    return storageService.get(FAVORITES_KEY) || [];
  },

  /**
   * Agrega una carta a favoritos.
   * @param {string} cardId 
   * @returns {string[]} - Lista actualizada de favoritos.
   */
  addFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    if (!favorites.includes(cardId)) {
      favorites.push(cardId);
      storageService.set(FAVORITES_KEY, favorites);
    }
    return favorites;
  },

  /**
   * Elimina una carta de favoritos.
   * @param {string} cardId 
   * @returns {string[]} - Lista actualizada de favoritos.
   */
  removeFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    const filtered = favorites.filter(id => id !== cardId);
    storageService.set(FAVORITES_KEY, filtered);
    return filtered;
  },

  /**
   * Alterna el estado de favorito de una carta.
   * @param {string} cardId 
   * @returns {string[]} - Lista actualizada de favoritos.
   */
  toggleFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    if (favorites.includes(cardId)) {
      return favoritesService.removeFavorite(cardId);
    } else {
      return favoritesService.addFavorite(cardId);
    }
  },

  /**
   * Verifica si una carta es favorita.
   * @param {string} cardId 
   * @returns {boolean}
   */
  isFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    return favorites.includes(cardId);
  },

  /**
   * Limpia todos los favoritos.
   */
  clearFavorites: () => {
    storageService.set(FAVORITES_KEY, []);
  }
};

export default favoritesService;