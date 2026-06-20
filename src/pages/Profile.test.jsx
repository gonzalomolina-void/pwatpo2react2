import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

// Mock del AuthContext
vi.mock('../context/AuthContext');

// Mock del authService
vi.mock('../services/authService', () => ({
  default: {
    changePassword: vi.fn()
  }
}));

// Mock de react-i18next retornando las claves de traducción
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Profile Page Component', () => {
  const mockUser = {
    name: 'Gonzalo',
    email: 'gonzalo@test.com',
    role: 'admin'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true
    });
  });

  it('renderiza la informacion del usuario correctamente', () => {
    render(<Profile />);

    expect(screen.getByText('profile.title')).toBeInTheDocument();
    expect(screen.getByText('profile.subtitle')).toBeInTheDocument();
    expect(screen.getByText('profile.infoTitle')).toBeInTheDocument();

    // Nombre de usuario y inicial del Avatar
    expect(screen.getByText('Gonzalo')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();

    // Rol en mayúsculas
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    // Email del usuario
    expect(screen.getByText('gonzalo@test.com')).toBeInTheDocument();
  });

  it('permite alternar la visibilidad de los inputs de contraseñas de forma independiente', () => {
    render(<Profile />);

    const currentInput = screen.getAllByPlaceholderText('••••••••')[0];
    const newInput = screen.getAllByPlaceholderText('••••••••')[1];
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[2];

    // Por defecto todos son tipo password
    expect(currentInput.type).toBe('password');
    expect(newInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');

    // Alternar contraseña actual
    const toggleCurrentBtn = screen.getByLabelText('Alternar visibilidad de contraseña actual');
    fireEvent.click(toggleCurrentBtn);
    expect(currentInput.type).toBe('text');
    expect(newInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');

    fireEvent.click(toggleCurrentBtn);
    expect(currentInput.type).toBe('password');

    // Alternar nueva contraseña
    const toggleNewBtn = screen.getByLabelText('Alternar visibilidad de nueva contraseña');
    fireEvent.click(toggleNewBtn);
    expect(currentInput.type).toBe('password');
    expect(newInput.type).toBe('text');
    expect(confirmInput.type).toBe('password');

    fireEvent.click(toggleNewBtn);
    expect(newInput.type).toBe('password');

    // Alternar confirmar contraseña
    const toggleConfirmBtn = screen.getByLabelText('Alternar visibilidad de confirmación de contraseña');
    fireEvent.click(toggleConfirmBtn);
    expect(currentInput.type).toBe('password');
    expect(newInput.type).toBe('password');
    expect(confirmInput.type).toBe('text');

    fireEvent.click(toggleConfirmBtn);
    expect(confirmInput.type).toBe('password');
  });

  it('valida que todos los campos sean obligatorios', async () => {
    render(<Profile />);

    const submitBtn = screen.getByRole('button', { name: 'profile.submit' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('profile.errors.required')).toBeInTheDocument();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('valida que la nueva contraseña tenga al menos 6 caracteres', async () => {
    render(<Profile />);

    const currentInput = screen.getAllByPlaceholderText('••••••••')[0];
    const newInput = screen.getAllByPlaceholderText('••••••••')[1];
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[2];

    fireEvent.change(currentInput, { target: { value: 'oldPass123' } });
    fireEvent.change(newInput, { target: { value: '12345' } });
    fireEvent.change(confirmInput, { target: { value: '12345' } });

    const submitBtn = screen.getByRole('button', { name: 'profile.submit' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('profile.errors.tooShort')).toBeInTheDocument();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('valida que la nueva contraseña y su confirmacion coincidan', async () => {
    render(<Profile />);

    const currentInput = screen.getAllByPlaceholderText('••••••••')[0];
    const newInput = screen.getAllByPlaceholderText('••••••••')[1];
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[2];

    fireEvent.change(currentInput, { target: { value: 'oldPass123' } });
    fireEvent.change(newInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmInput, { target: { value: 'newPass456' } });

    const submitBtn = screen.getByRole('button', { name: 'profile.submit' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('profile.errors.mismatch')).toBeInTheDocument();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('envia el formulario exitosamente, limpia los campos y muestra mensaje de éxito', async () => {
    authService.changePassword.mockResolvedValueOnce({
      message: 'profile.success'
    });

    render(<Profile />);

    const currentInput = screen.getAllByPlaceholderText('••••••••')[0];
    const newInput = screen.getAllByPlaceholderText('••••••••')[1];
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[2];

    fireEvent.change(currentInput, { target: { value: 'oldPass123' } });
    fireEvent.change(newInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmInput, { target: { value: 'newPass123' } });

    const submitBtn = screen.getByRole('button', { name: 'profile.submit' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith('oldPass123', 'newPass123');
    });

    expect(screen.getByText('profile.success')).toBeInTheDocument();
    expect(screen.queryByText('profile.errors.required')).not.toBeInTheDocument();

    // Los campos deben haber sido vaciados
    expect(currentInput.value).toBe('');
    expect(newInput.value).toBe('');
    expect(confirmInput.value).toBe('');
  });

  it('muestra mensaje de error si el servicio falla y no limpia los campos del formulario', async () => {
    authService.changePassword.mockRejectedValueOnce(new Error('Contraseña actual incorrecta'));

    render(<Profile />);

    const currentInput = screen.getAllByPlaceholderText('••••••••')[0];
    const newInput = screen.getAllByPlaceholderText('••••••••')[1];
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[2];

    fireEvent.change(currentInput, { target: { value: 'wrongOldPass' } });
    fireEvent.change(newInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmInput, { target: { value: 'newPass123' } });

    const submitBtn = screen.getByRole('button', { name: 'profile.submit' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith('wrongOldPass', 'newPass123');
    });

    expect(screen.getByText('Contraseña actual incorrecta')).toBeInTheDocument();

    // Los campos deben conservar su valor
    expect(currentInput.value).toBe('wrongOldPass');
    expect(newInput.value).toBe('newPass123');
    expect(confirmInput.value).toBe('newPass123');
  });
});
