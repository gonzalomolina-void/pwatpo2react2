import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CardFormModal from './CardFormModal';
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
const mockT = (key) => key;
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: { language: 'es' }
  })
}));

// Mock de Modal para renderizar sus hijos directamente
vi.mock('./Modal', () => ({
  default: ({ isOpen, children, title }) => isOpen ? (
    <div data-testid="mock-modal">
      <h2>{title}</h2>
      {children}
    </div>
  ) : null
}));

describe('CardFormModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no debe renderizar nada si isOpen es false', () => {
    render(
      <CardFormModal isOpen={false} onClose={() => {}} />
    );

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('debe renderizar campos vacíos en modo de creación (Alta)', () => {
    render(
      <CardFormModal isOpen={true} onClose={() => {}} />
    );

    expect(screen.getByTestId('input-cost')).toBeInTheDocument();
    expect(screen.getByTestId('input-atk')).toBeInTheDocument();
    expect(screen.getByTestId('input-def')).toBeInTheDocument();
    expect(screen.getByTestId('input-image')).toBeInTheDocument();
    expect(screen.getByTestId('select-type')).toBeInTheDocument();
    expect(screen.getByTestId('select-rarity')).toBeInTheDocument();

    // Inputs de traducción
    expect(screen.getByTestId('input-name-es')).toHaveValue('');
    expect(screen.getByTestId('textarea-desc-es')).toHaveValue('');
    expect(screen.getByTestId('input-name-en')).toHaveValue('');
    expect(screen.getByTestId('textarea-desc-en')).toHaveValue('');
  });

  it('debe cargar y precargar datos en modo de edición', async () => {
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

    render(
      <CardFormModal isOpen={true} cardId="123" onClose={() => {}} />
    );

    expect(cardService.getCardForEdit).toHaveBeenCalledWith('123');

    await waitFor(() => {
      expect(screen.getByTestId('input-cost')).toHaveValue(5);
      expect(screen.getByTestId('input-atk')).toHaveValue(4);
      expect(screen.getByTestId('input-def')).toHaveValue(6);
      expect(screen.getByTestId('input-image')).toHaveValue('http://test.com/img.png');
      expect(screen.getByTestId('select-type')).toHaveValue('1');
      expect(screen.getByTestId('select-rarity')).toHaveValue('3');
      expect(screen.getByTestId('input-name-es')).toHaveValue('Carta Es');
      expect(screen.getByTestId('textarea-desc-es')).toHaveValue('Desc Es');
      expect(screen.getByTestId('input-name-en')).toHaveValue('Card En');
      expect(screen.getByTestId('textarea-desc-en')).toHaveValue('Desc En');
    });
  });

  it('debe enviar una peticion POST a createCard al guardar en modo Alta', async () => {
    const onSuccessMock = vi.fn();
    const onCloseMock = vi.fn();
    cardService.createCard.mockResolvedValueOnce({ id: 'new-id' });

    render(
      <CardFormModal isOpen={true} onClose={onCloseMock} onSuccess={onSuccessMock} />
    );

    // Llenar campos
    fireEvent.change(screen.getByTestId('input-cost'), { target: { value: '3' } });
    fireEvent.change(screen.getByTestId('input-atk'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('input-def'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('input-image'), { target: { value: 'image.png' } });
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('select-rarity'), { target: { value: '2' } });

    fireEvent.change(screen.getByTestId('input-name-es'), { target: { value: 'Nombre Es' } });
    fireEvent.change(screen.getByTestId('textarea-desc-es'), { target: { value: 'Desc Es' } });
    fireEvent.change(screen.getByTestId('input-name-en'), { target: { value: 'Name En' } });
    fireEvent.change(screen.getByTestId('textarea-desc-en'), { target: { value: 'Desc En' } });

    // Enviar
    fireEvent.submit(screen.getByTestId('form-card'));

    await waitFor(() => {
      expect(cardService.createCard).toHaveBeenCalledWith({
        cost: 3,
        atk: 2,
        def: 1,
        image: 'image.png',
        typeId: 2,
        rarityId: 2,
        translations: [
          { language: 'es', name: 'Nombre Es', description: 'Desc Es' },
          { language: 'en', name: 'Name En', description: 'Desc En' }
        ]
      });
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('debe enviar una peticion PUT a updateCard al guardar en modo Edición', async () => {
    const onSuccessMock = vi.fn();
    const onCloseMock = vi.fn();

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

    render(
      <CardFormModal isOpen={true} cardId="123" onClose={onCloseMock} onSuccess={onSuccessMock} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('input-cost')).toHaveValue(5);
    });

    // Modificar costo
    fireEvent.change(screen.getByTestId('input-cost'), { target: { value: '8' } });

    // Enviar
    fireEvent.submit(screen.getByTestId('form-card'));

    await waitFor(() => {
      expect(cardService.updateCard).toHaveBeenCalledWith('123', {
        cost: 8,
        atk: 4,
        def: 6,
        image: 'http://test.com/img.png',
        typeId: 1,
        rarityId: 3,
        translations: [
          { language: 'es', name: 'Carta Es', description: 'Desc Es' },
          { language: 'en', name: 'Card En', description: 'Desc En' }
        ]
      });
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('debe abrir modal de confirmación al hacer click en Eliminar y llamar a deleteCard', async () => {
    const onSuccessMock = vi.fn();
    const onCloseMock = vi.fn();

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
    cardService.deleteCard.mockResolvedValueOnce(null);

    render(
      <CardFormModal isOpen={true} cardId="123" onClose={onCloseMock} onSuccess={onSuccessMock} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('btn-delete')).toBeInTheDocument();
    });

    // Hacer click en eliminar
    fireEvent.click(screen.getByTestId('btn-delete'));

    // Debe mostrar diálogo de confirmación
    expect(screen.getByTestId('delete-confirm-dialog')).toBeInTheDocument();

    // Confirmar eliminación
    fireEvent.click(screen.getByTestId('btn-confirm-delete'));

    await waitFor(() => {
      expect(cardService.deleteCard).toHaveBeenCalledWith('123');
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
