import storageService from './storageService';

const FAVORITES_KEY = 'tcgnexus_favorites';

const favoritesService = {
  getFavorites: () => {
    return storageService.get(FAVORITES_KEY) || [];
  },

  addFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    if (!favorites.includes(cardId)) {
      favorites.push(cardId);
      storageService.set(FAVORITES_KEY, favorites);
    }
    return favorites;
  },

  removeFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    const filtered = favorites.filter(id => id !== cardId);
    storageService.set(FAVORITES_KEY, filtered);
    return filtered;
  },

  toggleFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    if (favorites.includes(cardId)) {
      return favoritesService.removeFavorite(cardId);
    } else {
      return favoritesService.addFavorite(cardId);
    }
  },

  isFavorite: (cardId) => {
    const favorites = favoritesService.getFavorites();
    return favorites.includes(cardId);
  },

  clearFavorites: () => {
    storageService.set(FAVORITES_KEY, []);
  }
};

export default favoritesService;