import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardTranslationsForm from './CardTranslationsForm';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  })
}));

describe('CardTranslationsForm Component', () => {
  const translations = {
    es: { name: 'Carta de Prueba', description: 'Una descripción de prueba' },
    en: { name: 'Test Card', description: 'A test description' }
  };
  const mockOnChange = vi.fn();

  it('debería renderizar los campos de traducción con los valores iniciales correspondientes', () => {
    render(
      <CardTranslationsForm
        translations={translations}
        onChange={mockOnChange}
      />
    );

    // Comprobar que los inputs de Español tienen los valores correctos
    expect(screen.getByTestId('input-name-es')).toHaveValue('Carta de Prueba');
    expect(screen.getByTestId('textarea-desc-es')).toHaveValue('Una descripción de prueba');

    // Comprobar que los inputs de Inglés tienen los valores correctos
    expect(screen.getByTestId('input-name-en')).toHaveValue('Test Card');
    expect(screen.getByTestId('textarea-desc-en')).toHaveValue('A test description');
  });

  it('debería disparar el callback onChange cuando se modifica el nombre en español', () => {
    render(
      <CardTranslationsForm
        translations={translations}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByTestId('input-name-es'), { target: { value: 'Nuevo Nombre' } });
    expect(mockOnChange).toHaveBeenCalledWith('es', 'name', 'Nuevo Nombre');
  });

  it('debería disparar el callback onChange cuando se modifica la descripción en inglés', () => {
    render(
      <CardTranslationsForm
        translations={translations}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByTestId('textarea-desc-en'), { target: { value: 'New Description' } });
    expect(mockOnChange).toHaveBeenCalledWith('en', 'description', 'New Description');
  });
});
