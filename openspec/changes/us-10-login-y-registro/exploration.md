## Exploration: us-10-login-y-registro

### Current State
Actualmente, el frontend (`pwatpo2react2`) no posee ninguna infraestructura para la autenticación de usuarios. Todas las operaciones y vistas son públicas. El servicio de favoritos (`favoritesService.js`) opera de forma puramente síncrona guardando la información de manera persistente en el `localStorage` del cliente.

### Affected Areas
- `src/App.jsx` — Añadir la ruta `/login` y el `AuthProvider` envolviendo los componentes.
- `src/components/Header.jsx` — Mostrar dinámicamente opciones de navegación basadas en el estado de autenticación (Login/Logout, nombre de usuario, y link a la Forja si es admin).
- `src/services/authService.js` — (Nuevo archivo) Servicio para realizar peticiones fetch contra el backend (`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`).
- `src/context/AuthContext.jsx` — (Nuevo archivo) Contexto y proveedor de autenticación para centralizar y difundir el estado de la sesión.
- `src/hooks/useAuth.js` — (Nuevo archivo) Hook personalizado para consumir el contexto de autenticación de forma simple.
- `src/pages/Login.jsx` — (Nuevo archivo) Página de login y registro de usuarios con formularios y validaciones de inputs.

### Approaches
1. **Approach 1: React Context (AuthContext) + custom hook `useAuth`** — Crear un contexto de React para centralizar el estado de sesión (`user`, `token`, `loading`, `isAuthenticated`) y métodos (`login`, `register`, `logout`).
   - Pros: Centralización limpia, reactividad inmediata en toda la app sin prop-drilling, facilita la protección de rutas y la inyección del token en otros servicios.
   - Cons: Agrega un wrapper más en la raíz de componentes.
   - Effort: Medium.

2. **Approach 2: Estado local en App.jsx y pasaje por Props** — Manejar el estado del usuario en `App.jsx` y pasarlo manualmente al `Header` y vistas que lo requieran.
   - Pros: Evita la creación de un Context Provider.
   - Cons: Genera prop-drilling innecesario, dificulta la modularidad del código y complica el desarrollo de futuros interceptores HTTP.
   - Effort: Low.

### Recommendation
Se recomienda implementar el **Approach 1 (React Context)**. Ofrece una base arquitectónica robusta y escalable que simplifica enormemente las implementaciones futuras del control de acceso por roles (US12) y el interceptor de refresh token (US13).

### Risks
- **Exposición de credenciales**: El almacenamiento del JWT debe ser seguro. Usaremos memoria RAM (estado de React) para el `accessToken` de corta duración y la persistencia se delegará al mecanismo automático del navegador (cookie HTTP-only `refreshToken` que maneja el backend Express).
- **Manejo de estados asíncronos**: Durante la carga inicial (mientras se valida si el usuario tiene una sesión activa leyendo de `/api/auth/me`), la UI debe mostrar un spinner de carga para evitar destellos de layouts incorrectos.

### Ready for Proposal
Yes — Estamos listos para presentar la propuesta técnica e iniciar el diseño detallado de la US 10.
