import i18n from 'i18next';
import apiClient from './apiClient';

// Caché en memoria para tipos y rarezas indexada por el idioma activo
// Almacena las promesas de carga para evitar peticiones duplicadas y concurrentes
let typesCache = {}; // { es: Promise, en: Promise }
let raritiesCache = {}; // { es: Promise, en: Promise }

export const lookupService = {
  /**
   * Obtiene la lista de tipos de cartas desde la API localizados en el idioma activo.
   * @returns {Promise<Array<{id: number, code: string, name: string, labelKey: string}>>}
   */
  getTypes: () => {
    const lang = i18n.language || 'es';

    if (!typesCache[lang]) {
      typesCache[lang] = apiClient.get('/types').catch((error) => {
        // Limpiar la caché si la petición falla para que en el próximo reintento vuelva a llamar
        delete typesCache[lang];
        throw error;
      });
    }

    return typesCache[lang];
  },

  /**
   * Obtiene la lista de rarezas de cartas desde la API localizadas en el idioma activo.
   * @returns {Promise<Array<{id: number, code: string, name: string, labelKey: string}>>}
   */
  getRarities: () => {
    const lang = i18n.language || 'es';

    if (!raritiesCache[lang]) {
      raritiesCache[lang] = apiClient.get('/rarities').catch((error) => {
        // Limpiar la caché si la petición falla
        delete raritiesCache[lang];
        throw error;
      });
    }

    return raritiesCache[lang];
  },

  /**
   * Limpia toda la caché almacenada en memoria (útil para pruebas).
   */
  clearCache: () => {
    typesCache = {};
    raritiesCache = {};
  }
};
