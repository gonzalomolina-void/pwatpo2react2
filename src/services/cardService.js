const API_URL = import.meta.env.VITE_API_URL;

const cardService = {
  getCards: async (params = {}) => {
    try {
      const url = new URL(`${API_URL}/cards`);
      
      // Añadir parámetros de búsqueda/paginación si existen
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching cards: ${response.statusText}`);
      }
      
      return await response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error in cardService.getCards:', error);
      throw error;
    }
  },

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
