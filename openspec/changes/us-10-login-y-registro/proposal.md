# Proposal: US 10 - Login, Registro y Gestión de Sesión (JWT)

## Intent
Habilitar a los usuarios para registrarse, iniciar sesión y mantener una sesión activa y segura en la aplicación web HEXA, permitiendo el acceso personalizado y seguro a funcionalidades protegidas (ej. gestión de favoritos).

## Scope

### In Scope
- Formulario de Login/Registro en el frontend con validaciones.
- `AuthContext` + `useAuth` hook para centralizar y difundir el estado de la sesión.
- Guardado en memoria del `accessToken` de corta duración.
- Envío automático del JWT en la cabecera `Authorization: Bearer <token>` para peticiones HTTP.
- Header adaptado con información del usuario autenticado y botón de Logout.

### Out of Scope
- Gestión de roles de administrador (US12).
- Interceptor para la renovación silenciosa con refresh token (US13).
- Persistencia asíncrona de favoritos (US7).

## Capabilities

### New Capabilities
- `user-auth`: Cubre el registro de nuevos usuarios, inicio de sesión (Login), mantenimiento del estado de autenticación en React y cierre de sesión (Logout).

### Modified Capabilities
None

## Approach
Implementar autenticación usando React Context y un hook personalizado `useAuth`. El frontend interactuará con los endpoints de `/api/auth` en el backend local (`http://localhost:3000`). El token de acceso se almacena en memoria de React y el refresh token mediante cookies seguras HTTP-Only manejadas de forma automática por el navegador.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/App.jsx` | Modified | Envolver app en `AuthProvider` y agregar ruta `/login`. |
| `src/components/Header.jsx` | Modified | Mostrar datos de perfil e incorporar Login/Logout. |
| `src/services/authService.js` | New | Fetch contra endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` y `/api/auth/me`. |
| `src/context/AuthContext.jsx` | New | Context Provider de autenticación. |
| `src/hooks/useAuth.js` | New | Hook para consumir el contexto. |
| `src/pages/Login.jsx` | New | Vista con formularios de Login y Registro. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Exposición del JWT | Low | Guardar el `accessToken` en memoria de React. |
| Parpadeo de interfaz al recargar | Med | Usar spinner de carga durante validación inicial de sesión (`/api/auth/me`). |

## Rollback Plan
Revertir commits asociados y remover `AuthProvider` de `App.jsx`, restableciendo el Header original desde Git.

## Dependencies
- Backend Express (`tpexpress`) corriendo localmente en puerto 3000 con endpoints `/api/auth/*`.

## Success Criteria
- [ ] Formularios de registro y login funcionales y validados.
- [ ] El token JWT se envía en cabeceras de peticiones protegidas.
- [ ] Header reacciona inmediatamente al iniciar/cerrar sesión.
