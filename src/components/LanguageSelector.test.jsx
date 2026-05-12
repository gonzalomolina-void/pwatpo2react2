import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageSelector from './LanguageSelector';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'es',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('LanguageSelector Component', () => {
  it('calls changeLanguage when buttons are clicked', () => {
    render(<LanguageSelector />);
    
    const enButton = screen.getByLabelText(/English/i);
    fireEvent.click(enButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');

    const esButton = screen.getByLabelText(/Español/i);
    fireEvent.click(esButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('marks current language button as active', () => {
    const { container } = render(<LanguageSelector />);
    const esButton = screen.getByLabelText(/Español/i);
    
    // El botón activo tiene clases de fondo blanco y sombra
    expect(esButton).toHaveClass('bg-white');
  });
});
