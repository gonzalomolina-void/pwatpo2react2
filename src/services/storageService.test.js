import { describe, it, expect, beforeEach } from 'vitest';
import storageService from './storageService';

describe('storageService', () => {
  beforeEach(() => {

    localStorage.clear();
  });

  it('get: retorna null si la clave no existe', () => {
    expect(storageService.get('clave_inexistente')).toBeNull();
  });

  it('get: retorna el objeto parseado si existe', () => {
    localStorage.setItem('test_key', JSON.stringify({ data: 'hello' }));
    expect(storageService.get('test_key')).toEqual({ data: 'hello' });
  });

  it('set: guarda el valor serializado en localStorage', () => {
    storageService.set('test_array', [1, 2, 3]);
    expect(localStorage.getItem('test_array')).toBe('[1,2,3]');
  });

  it('remove: elimina la clave especificada de localStorage', () => {
    localStorage.setItem('to_remove', '"chau"');
    storageService.remove('to_remove');
    expect(localStorage.getItem('to_remove')).toBeNull();
  });

  it('clear: limpia todo el localStorage', () => {
    localStorage.setItem('k1', '1');
    localStorage.setItem('k2', '2');
    storageService.clear();
    expect(localStorage.length).toBe(0);
  });
});
