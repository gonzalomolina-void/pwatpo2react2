import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';
import { preferencesService } from '../services/preferencesService';

const mockUpdatePreferences = vi.fn();
let mockAuthValue = null;

// Mock de preferencesService
vi.mock('../services/preferencesService', () => ({
  preferencesService: {
    getTheme: vi.fn(),
    setTheme: vi.fn(),
  },
}));

// Mock de useAuth condicional
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthValue
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValue = null;
    mockUpdatePreferences.mockClear();
    // Limpiar las clases y estilos del documento antes de cada test
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  // ✅ INICIALIZACIÓN TESTS
  describe('Initialization', () => {
    it('initializes with light theme from preferencesService', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('initializes with dark theme from preferencesService', () => {
      preferencesService.getTheme.mockReturnValue('dark');

      render(<ThemeToggle />);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('renders button with correct emoji for light theme', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);

      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    it('renders button with correct emoji for dark theme', () => {
      preferencesService.getTheme.mockReturnValue('dark');

      render(<ThemeToggle />);

      expect(screen.getByText('🌙')).toBeInTheDocument();
    });
  });

  // ✅ TOGGLE TESTS
  describe('Theme Toggle', () => {
    it('toggles from light to dark when clicked', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
    });

    it('toggles from dark to light when clicked', () => {
      preferencesService.getTheme.mockReturnValue('dark');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(preferencesService.setTheme).toHaveBeenCalledWith('light');
    });

    it('toggles theme multiple times correctly', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      preferencesService.setTheme.mockClear();
      const button = screen.getByRole('button');

      // Light -> Dark
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Dark -> Light
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Light -> Dark
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      expect(preferencesService.setTheme).toHaveBeenCalledTimes(3);
    });
  });

  // ✅ PERSISTENCIA TESTS
  describe('Persistence', () => {
    it('persists theme to service when toggled', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme with current theme after toggle', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      preferencesService.setTheme.mockClear();
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(preferencesService.setTheme).toHaveBeenNthCalledWith(1, 'dark');
      expect(preferencesService.setTheme).toHaveBeenNthCalledWith(2, 'light');
    });

    it('persists theme immediately on toggle', async () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // setTheme debe haber sido llamado inmediatamente
      expect(preferencesService.setTheme).toHaveBeenCalled();
      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
    });
  });

  // ✅ VISUAL CHANGE TESTS
  describe('Visual Changes', () => {
    it('updates DOM class when theme changes', async () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      fireEvent.click(button);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('updates colorScheme style property', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      expect(document.documentElement.style.colorScheme).toBe('light');

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('updates emoji when theme changes', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      expect(screen.getByText('☀️')).toBeInTheDocument();

      // Simular cambio de tema
      preferencesService.getTheme.mockReturnValue('dark');
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // El emoji debe cambiar a luna
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('removes dark class when switching to light theme', () => {
      preferencesService.getTheme.mockReturnValue('dark');

      render(<ThemeToggle />);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('adds dark class when switching to dark theme', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  // ✅ ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has accessible button with title', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('title');
      expect(button.title).toContain('theme.toDark'); // Cambiar a oscuro
    });

    it('has accessible button with aria-label', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'theme.toggle');
    });

    it('button is keyboard accessible', async () => {
      const user = userEvent.setup();
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);

      // Tab to button and press Enter
      await user.tab();
      await user.keyboard('{Enter}');

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });


    it('updates title when theme changes', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      // Light theme: title debería indicar cambiar a oscuro
      expect(button.title).toContain('theme.toDark');

      fireEvent.click(button);

      // Dark theme: title debería indicar cambiar a luz
      expect(button.title).toContain('theme.toLight');
    });
  });

  // ✅ EDGE CASES
  describe('Edge Cases', () => {
    it('handles unknown theme gracefully', () => {
      preferencesService.getTheme.mockReturnValue('unknown');

      render(<ThemeToggle />);

      // Debería funcionar sin errores
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('handles rapid clicks', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      preferencesService.setTheme.mockClear();

      // Clicks rápidos
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));

      // Debería estar en light (4 toggles de light -> dark -> light -> dark -> light)
      expect(preferencesService.setTheme).toHaveBeenCalledTimes(4);
    });
  });

  // ✅ INTEGRATION TESTS
  describe('Integration', () => {
    it('completely switches theme with all side effects', () => {
      preferencesService.getTheme.mockReturnValue('light');

      render(<ThemeToggle />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Verificar todos los cambios de lado
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.style.colorScheme).toBe('dark');
      expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });
  });

  // ✅ PRUEBAS DE INTEGRACIÓN CON AUTHCONTEXT (US107)
  describe('Integración con AuthContext (US107)', () => {
    it('debe inicializarse con el tema provisto por el contexto de autenticación', () => {
      mockAuthValue = {
        theme: 'dark',
        updatePreferences: mockUpdatePreferences
      };

      render(<ThemeToggle />);

      // Debe mostrar luna por ser dark
      expect(screen.getByText('🌙')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('debe llamar a updatePreferences en lugar de cambiar estado local al hacer click si está autenticado', () => {
      mockAuthValue = {
        theme: 'light',
        updatePreferences: mockUpdatePreferences
      };

      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Debe haber llamado a la actualización del contexto con el valor opuesto (light -> true para darkMode)
      expect(mockUpdatePreferences).toHaveBeenCalledWith({ darkMode: true });
      // Y no debería haber tocado preferencesService directamente desde el manejador de click local
      expect(preferencesService.setTheme).not.toHaveBeenCalled();
    });
  });
});

