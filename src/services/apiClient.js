import i18n from 'i18next';

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Realiza una peticion HTTP utilizando fetch nativo con soporte para
 * cabeceras de sesion, idioma, cookies CORS e intercepcion de errores 401.
 * 
 * @param {string|URL} endpoint - Path relativo o URL completa.
 * @param {Object} [options] - Opciones de fetch.
 * @returns {Promise<any>} - JSON parseado de la respuesta.
 */
async function request(endpoint, options = {}) {
  const urlString = typeof endpoint === 'string' ? endpoint : endpoint.toString();
  const url = urlString.startsWith('http') ? urlString : `${API_URL}${urlString}`;
  
  const hasManualAuth = options.headers && (options.headers['Authorization'] || options.headers['authorization']);

  // Configurar headers por defecto
  const headers = {
    'Accept-Language': i18n.language || 'es',
    ...options.headers
  };

  // Inyectar Content-Type por defecto si hay body y no se especifica
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Inyectar Access Token si existe y no hay cabecera manual
  if (!hasManualAuth) {
    const token = localStorage.getItem('hexa_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include' // Forzar soporte de cookies CORS para refresh token
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && !hasManualAuth) {
      // Excluir endpoints publicos de auth del ciclo de refresh
      const isPublicAuth = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
      
      if (!isPublicAuth) {
        if (isRefreshing) {
          // Si ya hay una renovacion en curso, encolar peticion
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(newToken => {
              // Reintentar con el nuevo token
              fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
              return request(endpoint, fetchOptions);
            })
            .catch(err => {
              throw err;
            });
        }

        isRefreshing = true;

        return new Promise((resolve, reject) => {
          (async () => {
            try {
              const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
              });

              if (!refreshResponse.ok) {
                throw new Error('Session expired');
              }

              const { token: newToken } = await refreshResponse.json();
              localStorage.setItem('hexa_token', newToken);
              
              processQueue(null, newToken);
              isRefreshing = false;

              // Reintentar peticion original
              fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
              const retryResult = await request(endpoint, fetchOptions);
              resolve(retryResult);
            } catch (refreshError) {
              processQueue(refreshError, null);
              isRefreshing = false;
              
              // Limpieza e invalidador de sesion
              localStorage.removeItem('hexa_token');
              window.dispatchEvent(new CustomEvent('auth:expired'));
              
              reject(new Error('Session expired'));
            }
          })();
        });
      }
    }

    if (!response.ok) {
      // Si la API retorna un error no 401, lanzar error con status
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }

    // Retornar null o vacio para respuestas sin cuerpo o con 204 No Content
    if (response.status === 204) return null;
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw error;
  }
}

const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

export default apiClient;
