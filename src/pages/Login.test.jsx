import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mocks de hooks
vi.mock('../context/AuthContext');

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'auth.loginTitle': 'Ingresá a HEXA',
        'auth.registerTitle': 'Creá tu Cuenta',
        'auth.loginSubtitle': 'Accedé a tus favoritos y forjá cartas únicas',
        'auth.registerSubtitle': 'Registrate para empezar a coleccionar',
        'auth.namePlaceholder': 'Nombre',
        'auth.emailPlaceholder': 'Email',
        'auth.passwordPlaceholder': 'Contraseña',
        'auth.confirmPasswordPlaceholder': 'Confirmar contraseña',
        'auth.loginButton': 'Iniciar Sesión',
        'auth.registerButton': 'Registrarse',
        'auth.needAccount': '¿No tenés cuenta? Registrate',
        'auth.haveAccount': '¿Ya tenés cuenta? Iniciá sesión',
        'auth.errorNameRequired': 'El nombre es obligatorio',
        'auth.errorNameTooShort': 'El nombre debe tener al menos 2 caracteres'
      };
      return translations[key] || key;
    },
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Helper para renderizar con Router
function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('Login Page', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      register: mockRegister,
      isAuthenticated: false
    });
  });

  it('debe renderizar el formulario de login por defecto', () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/confirmar contraseña/i)).not.toBeInTheDocument();
  });

  it('debe cambiar al formulario de registro al hacer clic en registrarse', async () => {
    renderWithRouter(<Login />);

    const toggleButton = screen.getByText(/¿no tenés cuenta\? registrate/i);
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByPlaceholderText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validacion si los campos se envian vacios', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debe llamar a login con los datos correctos y redirigir al Home al enviar formulario valido', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('debe llamar a register con los datos correctos al enviar formulario de registro valido', async () => {
    mockRegister.mockResolvedValueOnce({ success: true });
    renderWithRouter(<Login />);

    // Cambiar a registro
    const toggleButton = screen.getByText(/¿no tenés cuenta\? registrate/i);
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    const nameInput = screen.getByPlaceholderText(/nombre/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Gonzalo' } });
      fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockRegister).toHaveBeenCalledWith('new@test.com', 'Gonzalo', 'password123');
  });

  it('debe mostrar error de validacion si el nombre esta vacio al intentar registrarse', async () => {
    renderWithRouter(<Login />);

    // Cambiar a registro
    const toggleButton = screen.getByText(/¿no tenés cuenta\? registrate/i);
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      // Dejamos el campo name vacío
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debe mostrar error de validacion si el nombre es demasiado corto al intentar registrarse', async () => {
    renderWithRouter(<Login />);

    // Cambiar a registro
    const toggleButton = screen.getByText(/¿no tenés cuenta\? registrate/i);
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    const nameInput = screen.getByPlaceholderText(/nombre/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'G' } });
      fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
