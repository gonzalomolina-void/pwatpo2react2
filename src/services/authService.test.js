import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  describe('login', () => {
    it('retorna datos de usuario y token ante login exitoso', async () => {
      const mockResponse = { token: 'jwt-123', user: { id: 1, email: 'test@test.com', role: 'usuario' } };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authService.login('test@test.com', 'password123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ email: 'test@test.com', password: 'password123' })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('lanza un error si el backend responde con error de login (ej: 401)', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(authService.login('wrong@test.com', 'badpwd')).rejects.toThrow('Error in login: Unauthorized');
    });
  });

  describe('register', () => {
    it('retorna mensaje de exito ante registro exitoso', async () => {
      const mockResponse = { message: 'Usuario creado' };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authService.register('new@test.com', 'password123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ email: 'new@test.com', password: 'password123' })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('lanza un error si el backend responde con error de registro (ej: 400)', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(authService.register('dup@test.com', 'pwd')).rejects.toThrow('Error in register: Bad Request');
    });
  });

  describe('logout', () => {
    it('retorna true ante logout exitoso', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logout exitoso' })
      });

      const result = await authService.logout();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        expect.objectContaining({
          method: 'POST'
        })
      );
      expect(result).toBe(true);
    });

    it('lanza un error si logout falla en el backend', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(authService.logout()).rejects.toThrow('Error in logout: Internal Server Error');
    });
  });

  describe('getMe', () => {
    it('retorna datos de usuario al enviar token valido', async () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'usuario' };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const result = await authService.getMe('jwt-123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({ 'Authorization': 'Bearer jwt-123' })
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('lanza un error si el token es invalido o expiro', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(authService.getMe('expired-token')).rejects.toThrow('Error fetching user profile: Unauthorized');
    });
  });
});
