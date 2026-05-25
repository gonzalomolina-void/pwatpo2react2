import { describe, it, expect, beforeEach, vi } from 'vitest';
import storageService from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('get: retorna null si la clave no existe', () => {
    expect(storageService.get('clave_inexistente')).toBeNull();
  });

  it('get: retorna el objeto parseado si existe', () => {
    localStorage.setItem('test_key', JSON.stringify({ data: 'hello' }));
    expect(storageService.get('test_key')).toEqual({ data: 'hello' });
  });

  it('get: retorna null y loguea error si localStorage falla', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage fail');
    });

    const result = storageService.get('any_key');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('set: guarda el valor serializado en localStorage', () => {
    storageService.set('test_array', [1, 2, 3]);
    expect(localStorage.getItem('test_array')).toBe('[1,2,3]');
  });

  it('set: loguea error si localStorage falla', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    storageService.set('any_key', 'value');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('remove: elimina la clave especificada de localStorage', () => {
    localStorage.setItem('to_remove', '"chau"');
    storageService.remove('to_remove');
    expect(localStorage.getItem('to_remove')).toBeNull();
  });

  it('remove: loguea error si localStorage.removeItem falla', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Remove fail');
    });

    storageService.remove('any_key');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('clear: limpia todo el localStorage', () => {
    localStorage.setItem('k1', '1');
    localStorage.setItem('k2', '2');
    storageService.clear();
    expect(localStorage.length).toBe(0);
  });

  it('clear: loguea error si localStorage.clear falla', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      throw new Error('Clear fail');
    });

    storageService.clear();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
