import apiClient from './apiClient';

const profileService = {
  /**
   * Obtiene las preferencias del perfil del usuario autenticado.
   * @returns {Promise<Object>} El perfil del usuario { userId, darkMode, language }
   */
  getProfile: async () => {
    try {
      return await apiClient.get('/profile');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      const err = new Error(`Error fetching user profile: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  },

  /**
   * Actualiza las preferencias del perfil del usuario autenticado.
   * @param {Object} data - Datos a actualizar ({ darkMode, language }).
   * @returns {Promise<Object>} El perfil actualizado.
   */
  updateProfile: async (data) => {
    try {
      return await apiClient.put('/profile', data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      const err = new Error(`Error updating user profile: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  }
};

export default profileService;
