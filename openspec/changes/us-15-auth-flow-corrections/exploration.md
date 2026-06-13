# Exploration: us-15-auth-flow-corrections

Este reporte detalla el análisis del flujo de navegación actual y las modificaciones necesarias para forzar la autenticación obligatoria antes de ingresar a la aplicación web (catálogo de HEXA) y corregir el comportamiento tras el cierre de sesión.

---

## 1. Current Navigation Flow Analysis

### 1.1 Splash Screen and Home Redirection
*   **Current state**: `App.jsx` renderiza directamente el catálogo (`Home`) si la pantalla Splash no está visible (`showSplash === false`). Si un usuario no está autenticado, ingresa directamente a `/` (Home) y puede ver las cartas, ya que no existen protecciones de rutas.
*   **Goal**: Redirigir a `/login` inmediatamente si la sesión no está activa cuando el Splash termine de renderizarse.

### 1.2 Route Protection
*   **Current state**: Todas las rutas (`/`, `/detalles/:id`, `/favoritos`) son públicas.
*   **Goal**: Proteger estas vistas para que solo usuarios autenticados (`isAuthenticated === true`) puedan acceder a ellas. Si se intenta entrar directamente, debe redirigir a `/login`.

### 1.3 Logout Behavior
*   **Current state**: Al hacer clic en "Cerrar Sesión" en `Header.jsx`, se limpia la sesión del `AuthContext` pero el usuario permanece en la misma página donde estaba, lo cual causa errores si la página requiere datos de sesión.
*   **Goal**: Redirigir de forma explícita al usuario a la ruta `/login` al cerrarse la sesión.

---

## 2. Proposed Technical Approach

### 2.1 Refactoring App.jsx structure
Para que el estado de sesión (`useAuth`) y la navegación (`useNavigate`) estén disponibles en la raíz de renderizado, debemos separar `App` en dos componentes:
1.  **`App`**: Define los proveedores globales (`AuthProvider` y `BrowserRouter`).
2.  **`AppContent`**: Componente interno que consume `useAuth` y define el árbol de rutas y efectos reactivos.

```jsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
```

### 2.2 Protected Route Component
Crearemos un componente genérico y reutilizable `ProtectedRoute.jsx` en `src/components/ProtectedRoute.jsx` para envolver todas las rutas que requieren inicio de sesión obligatorio.

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### 2.3 Wiring the Navigation in AppContent
En `AppContent`, observaremos el estado de `showSplash`, `loading` e `isAuthenticated` para forzar el flujo de login si el usuario no tiene una sesión activa tras el Splash.

```jsx
const { isAuthenticated, loading } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (!showSplash && !loading && !isAuthenticated) {
    navigate('/login', { replace: true });
  }
}, [showSplash, loading, isAuthenticated, navigate]);
```

### 2.4 Logout Redirection in Header
En `Header.jsx`, modificaremos las funciones del botón de logout para forzar la redirección:
```jsx
const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

---

## 3. Risks & Critical Tests
*   **Test Collisions**: Proteger las rutas principales romperá algunos tests existentes si no se mockea `useAuth` o si se espera que rendericen sin envolver en un mock de autenticación.
*   **Infinite Redirection Loop**: Debemos asegurar que `/login` NO esté protegido por el `ProtectedRoute`, de lo contrario caerá en un loop infinito de redirecciones.
*   **Loading State**: El spinner de restauración de sesión debe mostrarse correctamente mientras `loading` es true para evitar parpadeos o redirecciones en falso al login antes de verificar la cookie o localStorage.
