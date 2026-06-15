import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCardForm } from './useCardForm';
import cardService from '../services/cardService';

// Mock de cardService
vi.mock('../services/cardService', () => ({
  default: {
    getCardForEdit: vi.fn(),
    createCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn()
  }
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  })
}));

// Mock de ToastContext
const mockShowToast = vi.fn();
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast
  })
}));

describe('useCardForm Hook', () => {
  const onSuccessMock = vi.fn();
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería inicializar los estados vacíos al abrirse en modo creación (Alta)', () => {
    const { result } = renderHook(() =>
      useCardForm({ cardId: null, isOpen: true, onSuccess: onSuccessMock, onClose: onCloseMock })
    );

    expect(result.current.cost).toBe('');
    expect(result.current.atk).toBe('');
    expect(result.current.def).toBe('');
    expect(result.current.image).toBe('');
    expect(result.current.typeId).toBe('');
    expect(result.current.rarityId).toBe('');
    expect(result.current.translations.es.name).toBe('');
    expect(result.current.translations.en.name).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.fetching).toBe(false);
    expect(result.current.showDeleteConfirm).toBe(false);
  });

  it('debería precargar los datos de la carta al abrirse en modo edición', async () => {
    const mockCard = {
      id: '123',
      cost: 5,
      atk: 4,
      def: 6,
      image: 'http://test.com/img.png',
      typeId: 1,
      rarityId: 3,
      typeCode: 'creature',
      rarityCode: 'uncommon',
      translations: {
        es: { name: 'Carta Es', description: 'Desc Es' },
        en: { name: 'Card En', description: 'Desc En' }
      }
    };
    cardService.getCardForEdit.mockResolvedValueOnce(mockCard);

    const { result } = renderHook(() =>
      useCardForm({ cardId: '123', isOpen: true, onSuccess: onSuccessMock, onClose: onCloseMock })
    );

    expect(result.current.fetching).toBe(true);
    expect(cardService.getCardForEdit).toHaveBeenCalledWith('123');

    await waitFor(() => {
      expect(result.current.fetching).toBe(false);
      expect(result.current.cost).toBe(5);
      expect(result.current.atk).toBe(4);
      expect(result.current.def).toBe(6);
      expect(result.current.image).toBe('http://test.com/img.png');
      expect(result.current.typeId).toBe('1');
      expect(result.current.rarityId).toBe('3');
      expect(result.current.translations.es.name).toBe('Carta Es');
      expect(result.current.translations.en.name).toBe('Card En');
    });
  });

  it('debería llamar a createCard y onSuccess al guardar en modo creación', async () => {
    cardService.createCard.mockResolvedValueOnce({ id: 'new-id' });

    const { result } = renderHook(() =>
      useCardForm({ cardId: null, isOpen: true, onSuccess: onSuccessMock, onClose: onCloseMock })
    );

    // Seteamos campos
    act(() => {
      result.current.setCost('3');
      result.current.setAtk('2');
      result.current.setDef('1');
      result.current.setImage('img.png');
      result.current.setTypeId('2');
      result.current.setRarityId('2');
      result.current.handleTranslationChange('es', 'name', 'Nombre Es');
      result.current.handleTranslationChange('es', 'description', 'Desc Es');
      result.current.handleTranslationChange('en', 'name', 'Name En');
      result.current.handleTranslationChange('en', 'description', 'Desc En');
    });

    // Simulamos submit
    const mockEvent = { preventDefault: vi.fn() };
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(cardService.createCard).toHaveBeenCalledWith({
      cost: 3,
      atk: 2,
      def: 1,
      image: 'img.png',
      typeId: 2,
      rarityId: 2,
      translations: [
        { language: 'es', name: 'Nombre Es', description: 'Desc Es' },
        { language: 'en', name: 'Name En', description: 'Desc En' }
      ]
    });
    expect(onSuccessMock).toHaveBeenCalledWith({ action: 'create', card: { id: 'new-id' } });
    expect(onCloseMock).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('card.admin.createSuccess', 'success');
  });

  it('debería llamar a updateCard y onSuccess al guardar en modo edición', async () => {
    const mockCard = {
      id: '123',
      cost: 5,
      atk: 4,
      def: 6,
      image: 'http://test.com/img.png',
      typeId: 1,
      rarityId: 3,
      typeCode: 'creature',
      rarityCode: 'uncommon',
      translations: {
        es: { name: 'Carta Es', description: 'Desc Es' },
        en: { name: 'Card En', description: 'Desc En' }
      }
    };
    cardService.getCardForEdit.mockResolvedValueOnce(mockCard);
    cardService.updateCard.mockResolvedValueOnce({ id: '123' });

    const { result } = renderHook(() =>
      useCardForm({ cardId: '123', isOpen: true, onSuccess: onSuccessMock, onClose: onCloseMock })
    );

    await waitFor(() => {
      expect(result.current.fetching).toBe(false);
    });

    // Modificar un campo
    act(() => {
      result.current.setCost('8');
    });

    const mockEvent = { preventDefault: vi.fn() };
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(cardService.updateCard).toHaveBeenCalledWith('123', expect.objectContaining({
      cost: 8,
      atk: 4,
      def: 6
    }));
    expect(onSuccessMock).toHaveBeenCalledWith({ action: 'edit', card: { id: '123' } });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('debería llamar a deleteCard y onSuccess al eliminar la carta', async () => {
    cardService.getCardForEdit.mockResolvedValueOnce({ id: '123' });
    cardService.deleteCard.mockResolvedValueOnce(null);

    const { result } = renderHook(() =>
      useCardForm({ cardId: '123', isOpen: true, onSuccess: onSuccessMock, onClose: onCloseMock })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(cardService.deleteCard).toHaveBeenCalledWith('123');
    expect(onSuccessMock).toHaveBeenCalledWith({ action: 'delete', cardId: '123' });
    expect(onCloseMock).toHaveBeenCalled();
    expect(result.current.showDeleteConfirm).toBe(false);
  });
});
