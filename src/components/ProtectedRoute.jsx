import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Mostrar el spinner de carga temático mientras se verifica el token JWT
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no está autenticado, redirigir al login reemplazando el historial
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Validar restricciones de rol si se especifican
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderizar el contenido protegido
  return children;
}

