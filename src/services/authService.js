const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  /**
   * Registra un nuevo usuario en el sistema.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  register: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Error in register: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in authService.register:', error);
      throw error;
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Error in login: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in authService.login:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión activa del usuario.
   * @returns {Promise<boolean>}
   */
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Error in logout: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error in authService.logout:', error);
      throw error;
    }
  },

  /**
   * Obtiene los datos del perfil del usuario mediante el token de acceso.
   * @param {string} token 
   * @returns {Promise<Object>}
   */
  getMe: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in authService.getMe:', error);
      throw error;
    }
  }
};

export default authService;
