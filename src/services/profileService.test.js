import { describe, it, expect, vi, beforeEach } from 'vitest';
import profileService from './profileService';

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  describe('getProfile', () => {
    it('debería retornar el perfil del usuario autenticado ante GET exitoso', async () => {
      const mockProfile = { userId: 10, darkMode: true, language: 'en' };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      const result = await profileService.getProfile();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/profile`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept-Language': 'es'
          })
        })
      );
      expect(result).toEqual(mockProfile);
    });

    it('debería lanzar un error si la petición GET falla', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(profileService.getProfile()).rejects.toThrow('Error fetching user profile: Internal Server Error');
    });
  });

  describe('updateProfile', () => {
    it('debería retornar el perfil actualizado ante PUT exitoso', async () => {
      const mockUpdatedProfile = { userId: 10, darkMode: false, language: 'es' };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedProfile
      });

      const result = await profileService.updateProfile({ darkMode: false, language: 'es' });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/profile`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ darkMode: false, language: 'es' })
        })
      );
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('debería lanzar un error si la petición PUT falla', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(profileService.updateProfile({ language: 'fr' })).rejects.toThrow('Error updating user profile: Bad Request');
    });
  });
});
