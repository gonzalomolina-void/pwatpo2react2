# Tasks: US 10 - Login, Registro y Gestión de Sesión (JWT)

## Phase 1: Foundation / Infrastructure
- [x] 1.1 Crear `src/services/authService.js` con las funciones fetch para interactuar con los endpoints de `/api/auth` en el backend.
- [x] 1.2 Crear `src/services/authService.test.js` mockeando fetch para validar las llamadas del servicio.
- [x] 1.3 Crear `src/context/AuthContext.jsx` con el esqueleto básico del Provider y del hook `useAuth`.

## Phase 2: Core Implementation (TDD)
- [x] 2.1 Escribir pruebas unitarias fallantes para el flujo de login y registro en `src/context/AuthContext.test.jsx`.
- [x] 2.2 Implementar en `AuthContext.jsx` la lógica para manejar credenciales, llamar a `authService.login`/`register`, y almacenar el JWT en memoria.
- [x] 2.3 Escribir pruebas unitarias fallantes en `src/pages/Login.test.jsx` para comprobar la presencia del formulario y las validaciones de entrada.
- [x] 2.4 Crear `src/pages/Login.jsx` implementando el formulario visual, las validaciones de campos y la llamada al método de login/registro.

## Phase 3: Integration / Wiring
- [x] 3.1 Modificar `src/App.jsx` para registrar la ruta `/login` e integrar el componente `<AuthProvider>` en la raíz de componentes.
- [x] 3.2 Modificar `src/components/Header.jsx` para inyectar `useAuth()` y reaccionar al estado de sesión de forma reactiva (Login, Logout y email visible).
- [x] 3.3 Escribir pruebas de integración en `src/components/Header.test.jsx` validando la visibilidad del email del usuario y el botón de logout al simular sesión iniciada.

## Phase 4: Verification / Testing
- [ ] 4.1 Correr la suite de tests completa (`pnpm test:run`) y verificar que todos los tests creados y heredados pasen en verde.
- [ ] 4.2 Realizar pruebas de flujo manuales en la UI contra la API local y validar el comportamiento de registro, login, recarga de página (mantenimiento de sesión) y logout.
