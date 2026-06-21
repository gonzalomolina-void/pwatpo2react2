import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Estados del formulario
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de visibilidad independientes
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de estado de peticion
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Validaciones y submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validar requeridos
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('profile.errors.required'));
      return;
    }

    // 2. Validar largo
    if (newPassword.length < 6) {
      setError(t('profile.errors.tooShort'));
      return;
    }

    // 3. Validar coincidencia
    if (newPassword !== confirmPassword) {
      setError(t('profile.errors.mismatch'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      setSuccess(response.message || t('profile.success'));
      
      // Limpiar formulario ante éxito
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update failed:', err);
      // Extraer mensaje del backend o fallback
      setError(err.message || t('auth.errorGeneral'));
    } finally {
      setLoading(false);
    }
  };

  // Renderizador del ojo de visibilidad
  const renderEyeIcon = (isVisible) => (
    isVisible ? (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      </svg>
    ) : (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  );

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Encabezado */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Columna de Datos de Usuario (1/3) */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {t('profile.infoTitle')}
            </h2>

            {/* Avatar & Info Básica */}
            <div className="flex flex-col items-center border-b border-slate-100 pb-6 dark:border-slate-800/50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                {user?.name || 'Usuario Hexa'}
              </h3>
              <span className="mt-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                {user?.role ? user.role.toUpperCase() : 'USUARIO'}
              </span>
            </div>

            {/* Datos detallados */}
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  {t('profile.email')}
                </label>
                <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300" title={user?.email}>
                  {user?.email || 'email@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna del Formulario de Cambio de Contraseña (2/3) */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-6 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {t('profile.securityTitle')}
            </h2>

            {/* Alertas */}
            {success && (
              <div className="animate-fadeIn mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400">
                {success}
              </div>
            )}
            {error && (
              <div className="animate-fadeIn mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Contraseña Actual */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('profile.currentPassword')}
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm font-medium text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Alternar visibilidad de contraseña actual"
                  >
                    {renderEyeIcon(showCurrent)}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('profile.newPassword')}
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm font-medium text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Alternar visibilidad de nueva contraseña"
                  >
                    {renderEyeIcon(showNew)}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('profile.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm font-medium text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Alternar visibilidad de confirmación de contraseña"
                  >
                    {renderEyeIcon(showConfirm)}
                  </button>
                </div>
              </div>

              {/* Botón de Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-600/50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('profile.updating')}
                  </span>
                ) : (
                  t('profile.submit')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
