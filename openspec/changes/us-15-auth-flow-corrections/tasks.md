# Tasks: us-15-auth-flow-corrections

Este documento detalla el desglose de tareas ordenadas cronológicamente para implementar la US15 en el frontend, siguiendo estrictamente el ciclo TDD.

---

## Phase 1: Foundation / Infrastructure
- [x] **Task 1.1**: Crear el archivo del componente `src/components/ProtectedRoute.jsx` con su firma vacía que solo retorne `null`.
- [x] **Task 1.2**: Crear `src/components/ProtectedRoute.test.jsx` y escribir las 3 pruebas unitarias fallantes (RED):
    - Comprobar que renderiza el `LoadingSpinner` si `loading` en `useAuth()` es `true`.
    - Comprobar que redirige usando `<Navigate to="/login" replace />` si `isAuthenticated` es `false`.
    - Comprobar que renderiza los componentes hijos (`children`) si `isAuthenticated` es `true`.

## Phase 2: Core Implementation
- [x] **Task 2.1**: Implementar la lógica completa de `ProtectedRoute.jsx` para hacer pasar las pruebas unitarias anteriores en verde (GREEN).
- [x] **Task 2.2**: Refactorizar `src/App.jsx` para separar la lógica de providers en `App` y el routing/layouts en `AppContent`.
- [x] **Task 2.3**: Envolver las rutas `/`, `/favoritos` y `/detalles/:id` con `<ProtectedRoute>` en `AppContent`.
- [x] **Task 2.4**: Implementar el efecto reactivo (`useEffect`) en `AppContent` que redirija a `/login` al cerrarse el Splash Screen si no hay sesión activa.

## Phase 3: Integration / Wiring
- [x] **Task 3.1**: Modificar `src/components/Header.jsx` para inyectar `useNavigate` y redirigir al Login (`/login`) tras invocar la función `logout()`.
- [x] **Task 3.2**: Actualizar la suite de pruebas unitarias en `src/components/Header.test.jsx` y `src/App.test.jsx` para asegurar que el botón de logout redirige correctamente y corregir posibles colisiones causadas por las rutas protegidas.
- [x] **Task 3.3**: Ocultar los enlaces de navegación (`Home`, `Favoritos` e `Iniciar Sesión`) en el `Header` en la ruta de `/login` usando TDD.

## Phase 4: Verification & Manual Testing
- [x] **Task 4.1**: Ejecutar la suite completa de pruebas (`pnpm.cmd test:run`) y asegurar que todos los tests (heredados y nuevos) finalicen en verde.
- [ ] **Task 4.2**: Levantar el servidor de desarrollo local y validar manualmente el comportamiento del Splash screen redirigiendo a login, y el logout redirigiendo de vuelta al login.
