import storageService from './storageService';

const FAVORITES_KEY = 'hexa_favorites';

/**
 * Servicio para gestionar la persistencia de las cartas favoritas del usuario.
 * Ahora guarda el objeto completo de la carta para evitar N+1 requests.
 */
const favoritesService = {
  /**
   * Obtiene el listado de objetos de cartas favoritas.
   * @returns {Object[]}
   */
  getFavorites: () => {
    return storageService.get(FAVORITES_KEY) || [];
  },

  /**
   * Agrega una carta a favoritos.
   * @param {Object} card - Objeto completo de la carta.
   * @returns {Object[]} - Lista actualizada de favoritos.
   */
  addFavorite: (card) => {
    const favorites = favoritesService.getFavorites();
    if (!favorites.some(f => f.id === card.id)) {
      favorites.push(card);
      storageService.set(FAVORITES_KEY, favorites);
    }
    return favorites;
  },

  /**
   * Elimina una carta de favoritos.
   * @param {string} cardId 
   * @returns {Object[]} - Lista actualizada de favoritos.
   */
  removeFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    const filtered = favorites.filter(f => f.id !== cardId);
    storageService.set(FAVORITES_KEY, filtered);
    return filtered;
  },

  /**
   * Alterna el estado de favorito de una carta.
   * @param {Object} card - Objeto completo de la carta.
   * @returns {Object[]} - Lista actualizada de favoritos.
   */
  toggleFavorite: (card) => {
    const favorites = favoritesService.getFavorites();
    if (favorites.some(f => f.id === card.id)) {
      return favoritesService.removeFavorite(card.id);
    } else {
      return favoritesService.addFavorite(card);
    }
  },

  /**
   * Verifica si una carta es favorita por su ID.
   * @param {string} cardId 
   * @returns {boolean}
   */
  isFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    return favorites.some(f => f.id === cardId);
  },

  /**
   * Limpia todos los favoritos.
   */
  clearFavorites: () => {
    storageService.set(FAVORITES_KEY, []);
  }
};

export default favoritesService;