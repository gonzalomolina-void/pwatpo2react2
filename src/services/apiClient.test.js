import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('inyecta cabeceras de autorizacion e idioma y usa credentials include', async () => {
    localStorage.setItem('hexa_token', 'mock-access-token');
    
    // Mockea respuesta exitosa
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'ok' })
    });

    const response = await apiClient.get('/cards');

    expect(response).toEqual({ data: 'ok' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/cards'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-access-token',
          'Accept-Language': expect.any(String)
        }),
        credentials: 'include'
      })
    );
  });

  it('realiza el refresh silencioso exitosamente ante un 401 y reintenta la peticion', async () => {
    localStorage.setItem('hexa_token', 'expired-token');

    // 1. Peticion original da 401
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    // 2. Refresh da 200 con nuevo token
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ token: 'new-valid-token' })
    });

    // 3. Reintento da 200 con la info
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' })
    });

    const response = await apiClient.get('/cards/1');

    expect(response).toEqual({ data: 'success' });
    
    // El nuevo token debe guardarse en localStorage
    expect(localStorage.getItem('hexa_token')).toBe('new-valid-token');

    // Debe haberse llamado a /auth/refresh
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include'
      })
    );

    // El reintento debe llevar el nuevo token
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('/cards/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer new-valid-token'
        })
      })
    );
  });

  it('encola peticiones concurrentes y realiza un unico refresh', async () => {
    localStorage.setItem('hexa_token', 'expired-token');

    // Mocks para las llamadas iniciales que fallan con 401
    fetch.mockResolvedValueOnce({ ok: false, status: 401 }); // original card 1
    fetch.mockResolvedValueOnce({ ok: false, status: 401 }); // original card 2

    // Mock para el refresh (simulamos demora para que coincidan en vuelo)
    let resolveRefresh;
    const refreshPromise = new Promise(resolve => {
      resolveRefresh = () => {
        resolve({
          ok: true,
          status: 200,
          json: async () => ({ token: 'new-shared-token' })
        });
      };
    });
    fetch.mockReturnValueOnce(refreshPromise);

    // Mocks para los reintentos
    fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: 1 }) });
    fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: 2 }) });

    // Disparar concurrentemente
    const p1 = apiClient.get('/cards/1');
    const p2 = apiClient.get('/cards/2');

    // Esperar un instante y resolver el refresh
    await new Promise(r => setTimeout(r, 10));
    resolveRefresh();

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(r1).toEqual({ id: 1 });
    expect(r2).toEqual({ id: 2 });

    // Solo se debe haber llamado a /auth/refresh EXACTAMENTE UNA VEZ
    const refreshCalls = fetch.mock.calls.filter(call => call[0].includes('/auth/refresh'));
    expect(refreshCalls.length).toBe(1);

    expect(localStorage.getItem('hexa_token')).toBe('new-shared-token');
  });

  it('despacha evento auth:expired y limpia token si el refresh falla', async () => {
    localStorage.setItem('hexa_token', 'expired-token');

    // 1. Peticion original da 401
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    // 2. Refresh tambien da 401
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    const expiredSpy = vi.fn();
    window.addEventListener('auth:expired', expiredSpy);

    await expect(apiClient.get('/cards/1')).rejects.toThrow('Session expired');

    expect(localStorage.getItem('hexa_token')).toBeNull();
    expect(expiredSpy).toHaveBeenCalled();

    window.removeEventListener('auth:expired', expiredSpy);
  });
});
