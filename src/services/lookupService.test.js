import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18n from 'i18next';
import apiClient from './apiClient';
import { lookupService } from './lookupService';

// Mock de apiClient
vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn()
  }
}));

// Mock de i18next para controlar el idioma
vi.mock('i18next', () => {
  let currentLanguage = 'es';
  return {
    default: {
      language: currentLanguage,
      changeLanguage: (lng) => { currentLanguage = lng; },
      on: vi.fn(),
      off: vi.fn()
    }
  };
});

describe('lookupService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lookupService.clearCache();
    // Resetear idioma a es por defecto
    i18n.language = 'es';
  });

  it('debería obtener los tipos desde la API en la primera llamada y cachear la promesa', async () => {
    const mockTypes = [
      { id: 1, code: 'creature', name: 'Criatura', labelKey: 'card.types.creature' }
    ];
    apiClient.get.mockResolvedValueOnce(mockTypes);

    // Primera llamada
    const p1 = lookupService.getTypes();
    // Segunda llamada inmediata (debería retornar la misma promesa o caché)
    const p2 = lookupService.getTypes();

    expect(p1).toBe(p2); // Mismo objeto promesa

    const result = await p1;
    expect(result).toEqual(mockTypes);
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/types');
  });

  it('debería realizar una nueva petición si se consulta en un idioma diferente', async () => {
    const mockTypesEs = [{ id: 1, code: 'creature', name: 'Criatura' }];
    const mockTypesEn = [{ id: 1, code: 'creature', name: 'Creature' }];

    apiClient.get.mockResolvedValueOnce(mockTypesEs);
    const resultEs = await lookupService.getTypes();
    expect(resultEs).toEqual(mockTypesEs);

    // Cambiamos el idioma
    i18n.language = 'en';
    apiClient.get.mockResolvedValueOnce(mockTypesEn);
    const resultEn = await lookupService.getTypes();
    expect(resultEn).toEqual(mockTypesEn);

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });

  it('debería obtener las rarezas desde la API en la primera llamada y cachear el resultado', async () => {
    const mockRarities = [
      { id: 1, code: 'common', name: 'Común', labelKey: 'card.rarities.common' }
    ];
    apiClient.get.mockResolvedValueOnce(mockRarities);

    const result = await lookupService.getRarities();
    expect(result).toEqual(mockRarities);

    // Segunda llamada
    const result2 = await lookupService.getRarities();
    expect(result2).toEqual(mockRarities);

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/rarities');
  });

  it('debería limpiar la caché ante un fallo en la API para permitir reintentar', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('API error'));

    await expect(lookupService.getTypes()).rejects.toThrow('API error');

    // Al fallar, debería intentar llamarlo de nuevo en la siguiente consulta
    apiClient.get.mockResolvedValueOnce([{ id: 1, code: 'creature', name: 'Criatura' }]);
    const result = await lookupService.getTypes();
    expect(result).toHaveLength(1);
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
