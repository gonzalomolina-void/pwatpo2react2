# Spec: us-13-refresh-token

## 1. Requirement: Renovación Silenciosa de Access Token (Refresh JWT)

El cliente HTTP (`apiClient.js`) MUST interceptar cualquier respuesta con estado `401 Unauthorized` de solicitudes protegidas del catálogo. Si ocurre un `401`, el cliente MUST pausar la ejecución de esa petición, solicitar de forma asíncrona un nuevo Access Token haciendo un `POST /api/auth/refresh` enviando las credenciales CORS (`credentials: 'include'`), y tras una respuesta exitosa (`200 OK`), persistir el nuevo token y reintentar la petición original con el nuevo encabezado `Authorization`.

### Scenario: Renovación silenciosa exitosa
- **GIVEN** un usuario autenticado con un Access Token expirado y una cookie `refreshToken` válida en el navegador.
- **WHEN** el cliente realiza una petición protegida (ej: `GET /api/cards/card-1`).
- **THEN** el servidor responde con `401 Unauthorized`.
- **AND** el `apiClient` intercepta el `401` y realiza un `POST /api/auth/refresh` con `credentials: 'include'`.
- **AND** el backend responde con un nuevo Access Token.
- **AND** el cliente persiste el nuevo Access Token en `localStorage`.
- **AND** el cliente reintenta de forma automática la petición a `GET /api/cards/card-1` inyectando el nuevo token de acceso.
- **AND** el componente de la UI recibe finalmente los datos de la carta de forma transparente sin interrupciones.

---

## 2. Requirement: Manejo de Expiración Total de Sesión (Session Expiration)

Si la llamada al endpoint de renovación de token (`POST /api/auth/refresh`) falla con un estado `401 Unauthorized` (lo que indica que el Refresh Token en la cookie ha expirado o ha sido revocado), el sistema MUST invalidar por completo la sesión local del usuario, limpiar el almacenamiento persistente local, despachar el evento global `auth:expired` y forzar la redirección a la pantalla de login con un mensaje explicativo.

### Scenario: Expiración del Refresh Token redirige al Login
- **GIVEN** un usuario con sesión iniciada cuyo Refresh Token ha expirado en el backend.
- **WHEN** el Access Token expira y el `apiClient` intenta realizar el refresh silencioso (`POST /api/auth/refresh`).
- **THEN** el servidor responde con `401 Unauthorized` en la petición de refresh.
- **AND** el `apiClient` limpia el token `hexa_token` de `localStorage`.
- **AND** el `apiClient` emite un evento personalizado `auth:expired` en la ventana global (`window`).
- **AND** el `AuthProvider` de React reacciona al evento, limpia el estado local del usuario (`user: null`, `token: null`) y redirige a la ruta `/login` mostrando el aviso de sesión expirada.

---

## 3. Requirement: Manejo de Peticiones Concurrentes Expiradas

Cuando se disparan múltiples peticiones asíncronas de forma simultánea (ej: cargar la grilla de cartas y chequear favoritos en el home) y el Access Token ha expirado, el cliente HTTP MUST realizar una única petición a `/auth/refresh` en segundo plano. El resto de las peticiones fallidas MUST encolarse y quedar en espera de que finalice la renovación para ser reintentadas todas juntas con el nuevo token obtenido.

### Scenario: Peticiones concurrentes encoladas y reintentadas tras un único refresh
- **GIVEN** un usuario autenticado con Access Token expirado.
- **WHEN** se disparan de forma simultánea tres peticiones: `GET /api/cards`, `GET /api/favorites` y `GET /api/auth/me`.
- **THEN** las tres peticiones fallan con `401 Unauthorized`.
- **AND** el `apiClient` realiza una única llamada a `POST /api/auth/refresh`.
- **AND** las llamadas originales de cards, favorites y auth son encoladas en memoria.
- **AND** tras el éxito de la petición de refresh, el cliente reintenta las tres peticiones concurrentes encoladas usando el nuevo Access Token.
- **AND** las llamadas resuelven con éxito hacia la UI de forma transparente.
