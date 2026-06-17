import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (options && options.name) {
        return `${key} ${options.name}`;
      }
      return key;
    },
  })
}));

describe('DeleteConfirmDialog Component', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  it('debería no renderizar nada si isOpen es falso', () => {
    const { container } = render(
      <DeleteConfirmDialog
        isOpen={false}
        cardName="Exodia"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('debería renderizar el modal con el nombre de la carta y botones si isOpen es verdadero', () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        cardName="Exodia"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    expect(screen.getByTestId('delete-confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('card.admin.deleteConfirmTitle')).toBeInTheDocument();
    expect(screen.getByText('card.admin.deleteConfirmMsg Exodia')).toBeInTheDocument();
    expect(screen.getByTestId('btn-confirm-delete')).toBeInTheDocument();
  });

  it('debería llamar a onCancel al presionar el botón de cancelar', () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        cardName="Exodia"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    const cancelBtn = screen.getByText('card.admin.deleteCancelBtn');
    fireEvent.click(cancelBtn);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('debería llamar a onConfirm al presionar el botón de confirmar', () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        cardName="Exodia"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    const confirmBtn = screen.getByTestId('btn-confirm-delete');
    fireEvent.click(confirmBtn);
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('debería deshabilitar botones y mostrar spinner cuando está cargando', () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        cardName="Exodia"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    const cancelBtn = screen.getByText('card.admin.deleteCancelBtn');
    const confirmBtn = screen.getByTestId('btn-confirm-delete');

    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();
    expect(confirmBtn.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
