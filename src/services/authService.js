import apiClient from './apiClient';

const authService = {
  /**
   * Registra un nuevo usuario en el sistema.
   * @param {string} email 
   * @param {string} name
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  register: async (email, name, password) => {
    try {
      return await apiClient.post('/auth/register', { email, name, password });
    } catch (error) {
      console.error('Error in authService.register:', error);
      const err = new Error(`Error in register: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  },

  /**
   * Inicia sesión de usuario obteniendo un token de acceso.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  login: async (email, password) => {
    try {
      return await apiClient.post('/auth/login', { email, password });
    } catch (error) {
      console.error('Error in authService.login:', error);
      const err = new Error(`Error in login: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  },

  /**
   * Cierra la sesión activa del usuario.
   * @returns {Promise<boolean>}
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      return true;
    } catch (error) {
      console.error('Error in authService.logout:', error);
      const err = new Error(`Error in logout: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  },

  /**
   * Obtiene los datos del perfil del usuario mediante el token de acceso.
   * @param {string} token 
   * @returns {Promise<Object>}
   */
  getMe: async (token) => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await apiClient.get('/auth/me', { headers });
    } catch (error) {
      console.error('Error in authService.getMe:', error);
      const err = new Error(`Error fetching user profile: ${error.message}`);
      err.status = error.status;
      throw err;
    }
  }
};

export default authService;
