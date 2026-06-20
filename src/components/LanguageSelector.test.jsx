import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import LanguageSelector from './LanguageSelector';

const mockChangeLanguage = vi.fn();
const mockI18n = {
  language: 'es',
  changeLanguage: mockChangeLanguage,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

const mockUpdatePreferences = vi.fn();
let mockAuthValue = null;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => {
    if (mockAuthValue === null) {
      throw new Error('No provider');
    }
    return mockAuthValue;
  }
}));

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    mockI18n.language = 'es';
    mockAuthValue = null;
    mockUpdatePreferences.mockClear();
  });

  // ✅ CAMBIAR IDIOMA TESTS
  describe('Language Change', () => {
    it('calls changeLanguage when English button is clicked', () => {
      render(<LanguageSelector />);

      const enButton = screen.getByRole('button', { name: /Change to English/i });
      fireEvent.click(enButton);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });

    it('calls changeLanguage when Spanish button is clicked', () => {
      render(<LanguageSelector />);

      const esButton = screen.getByRole('button', { name: /Cambiar a Español/i });
      fireEvent.click(esButton);

      expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    });

    it('handles language variants (e.g., es-AR -> es)', () => {
      mockI18n.language = 'es-AR';

      render(<LanguageSelector />);

      // El botón ES debe estar activo (extrae solo "es" de "es-AR")
      const esButton = screen.getByRole('button', { name: /Cambiar a Español/i });
      expect(esButton).toHaveClass('bg-white');
    });
  });

  // ✅ VISUAL STATE TESTS
  describe('Visual State', () => {
    it('marks Spanish button as active when language is es', () => {
      mockI18n.language = 'es';

      render(
<LanguageSelector />);
      const esButton = screen.getByRole('button', { name: /Cambiar a Español/i });

      // Botón activo debe tener estas clases
      expect(esButton).toHaveClass('bg-white');
      expect(esButton).toHaveClass('text-blue-600');
      expect(esButton).toHaveClass('shadow-sm');
    });

    it('marks English button as active when language is en', () => {
      mockI18n.language = 'en';

      render(<LanguageSelector />);
      const enButton = screen.getByRole('button', { name: /Change to English/i });

      expect(enButton).toHaveClass('bg-white');
      expect(enButton).toHaveClass('text-blue-600');
    });

    it('marks non-active button as inactive', () => {
      mockI18n.language = 'es';

      render(<LanguageSelector />);
      const enButton = screen.getByRole('button', { name: /Change to English/i });

      // Botón inactivo debe tener estas clases
      expect(enButton).toHaveClass('text-slate-500');
      expect(enButton).not.toHaveClass('bg-white');
      expect(enButton).not.toHaveClass('shadow-sm');
    });
  });

  // ✅ RENDER TESTS
  describe('Rendering', () => {
    it('renders both language buttons', () => {
      mockI18n.language = 'es';

      render(<LanguageSelector />);

      expect(screen.getByRole('button', { name: /Cambiar a Español/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Change to English/i })).toBeInTheDocument();
    });

    it('renders in a flex container with border', () => {
      mockI18n.language = 'es';

      const { container } = render(<LanguageSelector />);
      const wrapper = container.firstChild;


      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('rounded-lg');
      expect(wrapper).toHaveClass('border');
    });

    it('renders with correct button labels', () => {
      mockI18n.language = 'es';

      render(<LanguageSelector />);

      expect(screen.getByText('ES')).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
    });
  });

  // ✅ ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('buttons have appropriate aria-labels', () => {
      mockI18n.language = 'es';

      render(<LanguageSelector />);

      expect(screen.getByLabelText('Cambiar a Español')).toBeInTheDocument();
      expect(screen.getByLabelText('Change to English')).toBeInTheDocument();
    });

    it('buttons are clickable with keyboard', async () => {
      const user = userEvent.setup();
      mockI18n.language = 'es';

      render(<LanguageSelector />);

      const enButton = screen.getByRole('button', { name: /Change to English/i });
      await user.click(enButton);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });
  });

  // ✅ INTEGRATION TESTS
  describe('Integration', () => {
    it('multiple clicks trigger multiple language changes', () => {
      mockI18n.language = 'es';

      render(<LanguageSelector />);

      const enButton = screen.getByRole('button', { name: /Change to English/i });
      const esButton = screen.getByRole('button', { name: /Cambiar a Español/i });

      fireEvent.click(enButton);
      fireEvent.click(esButton);
      fireEvent.click(enButton);

      expect(mockChangeLanguage).toHaveBeenCalledTimes(3);
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(1, 'en');
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(2, 'es');
      expect(mockChangeLanguage).toHaveBeenNthCalledWith(3, 'en');
    });
  });

  // ✅ PRUEBAS DE INTEGRACIÓN CON AUTHCONTEXT (US107)
  describe('Integración con AuthContext (US107)', () => {
    it('debe inicializarse con el lenguaje provisto por el contexto de autenticación', () => {
      mockAuthValue = {
        language: 'en',
        updatePreferences: mockUpdatePreferences
      };

      render(<LanguageSelector />);

      // Botón de inglés (EN) debe estar activo
      const enButton = screen.getByRole('button', { name: /Change to English/i });
      expect(enButton).toHaveClass('bg-white');
      expect(enButton).toHaveClass('text-blue-600');
    });

    it('debe llamar a updatePreferences con el idioma seleccionado al hacer click si está autenticado', () => {
      mockAuthValue = {
        language: 'es',
        updatePreferences: mockUpdatePreferences
      };

      render(<LanguageSelector />);
      const enButton = screen.getByRole('button', { name: /Change to English/i });
      fireEvent.click(enButton);

      // Debe haber llamado al contexto
      expect(mockUpdatePreferences).toHaveBeenCalledWith({ language: 'en' });
      // Y no debería haber llamado a i18n directamente desde el componente local
      expect(mockChangeLanguage).not.toHaveBeenCalled();
    });
  });
});
