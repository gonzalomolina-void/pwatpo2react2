# Proposal: us-15-auth-flow-corrections

**Change ID**: `us-15-auth-flow-corrections`
**Author**: Antigravity
**State**: Proposed

## 1. Intent
Resolver los problemas de consistencia de navegación en el flujo de autenticación, obligando al usuario a iniciar sesión de forma obligatoria tras finalizar la pantalla Splash y asegurando que las vistas principales de la aplicación (Home, Favoritos y Detalle de Cartas) estén protegidas contra el acceso directo por URL de usuarios anónimos. Asimismo, garantizar que al cerrar sesión el usuario sea devuelto de inmediato al Login.

---

## 2. Scope

### 2.1 Added Modules
*   🆕 `src/components/ProtectedRoute.jsx`: Componente de envoltura que comprueba el estado de `isAuthenticated` en el contexto y redirige a `/login` en caso negativo.

### 2.2 Modified Modules
*   ⚠️ `src/App.jsx`: Refactorizar para separar la estructura en `App` (declarativa de providers) y `AppContent` (declarativa de vistas, layouts y efectos de navegación).
*   ⚠️ `src/components/Header.jsx`: Ajustar las acciones del botón de cerrar sesión en formato desktop y móvil para que invoquen `navigate('/login')` tras realizar el logout.

---

## 3. Tech Approach
*   **Separación de Preocupaciones**: Se aísla el árbol de rutas y la barra de navegación dentro de `AppContent` para que pueda consumir tanto `useNavigate` de `react-router-dom` como `useAuth` de `AuthContext`.
*   **Ruta Protegida Reutilizable**: El componente `ProtectedRoute` interceptará los accesos y mostrará el spinner global temático (`LoadingSpinner`) mientras la sesión se está recuperando de forma asíncrona de `localStorage`.
*   **Tests Unitarios e Integración**:
    *   Escribir pruebas unitarias para `ProtectedRoute.jsx` validando el renderizado de sus hijos si está autenticado, la redirección a `/login` si no lo está, y el spinner de carga si `loading` es true.
    *   Actualizar `Header.test.jsx` para comprobar que la redirección a `/login` ocurra tras hacer clic en el botón de logout.
    *   Ajustar `App.test.jsx` y tests de páginas si fallan por falta de contexto o por la nueva redirección automática.
