import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { t } = useTranslation();
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validaciones del formulario
  const validateForm = () => {
    setError('');
    if (!email || !password) {
      setError(t('auth.errorRequiredFields') || 'Todos los campos son requeridos');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.errorInvalidEmail') || 'Email no válido');
      return false;
    }
    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError(t('auth.errorPasswordMismatch') || 'Las contraseñas no coinciden');
        return false;
      }
      if (password.length < 6) {
        setError(t('auth.errorPasswordTooShort') || 'La contraseña debe tener al menos 6 caracteres');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccessMsg('');

    try {
      if (isRegisterMode) {
        await register(email, password);
        setSuccessMsg(t('auth.registerSuccess') || '¡Registro exitoso! Ya podés iniciar sesión.');
        // Reiniciar campos y pasar a modo login tras registrarse
        setIsRegisterMode(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      // Intentar extraer el mensaje de error del backend
      const errMsg = err.message || t('auth.errorGeneral') || 'Ocurrió un error inesperado';
      setError(errMsg.replace('Error in login: ', '').replace('Error in register: ', ''));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isRegisterMode 
              ? (t('auth.registerTitle') || 'Creá tu Cuenta') 
              : (t('auth.loginTitle') || 'Ingresá a HEXA')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isRegisterMode 
              ? (t('auth.registerSubtitle') || 'Registrate para empezar a coleccionar') 
              : (t('auth.loginSubtitle') || 'Accedé a tus favoritos y forjá cartas únicas')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400" role="alert">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
              {successMsg}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder={t('auth.emailPlaceholder') || 'Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder={t('auth.passwordPlaceholder') || 'Contraseña'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {isRegisterMode && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="relative block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirmar contraseña'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-4 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isRegisterMode ? (
                t('auth.registerButton') || 'Registrarse'
              ) : (
                t('auth.loginButton') || 'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setSuccessMsg('');
            }}
            disabled={loading}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {isRegisterMode 
              ? (t('auth.haveAccount') || '¿Ya tenés cuenta? Iniciá sesión') 
              : (t('auth.needAccount') || '¿No tenés cuenta? Registrate')}
          </button>
        </div>
      </div>
    </div>
  );
}
