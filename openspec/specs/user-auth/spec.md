# User Authentication Specification

## Purpose
Esta especificación define el comportamiento del sistema de autenticación de usuarios para HEXA, permitiendo el registro, inicio de sesión, mantenimiento del estado de sesión activa y cierre de sesión de forma segura.

## Requirements

### Requirement: Registro de Nuevos Usuarios
El sistema MUST permitir a los usuarios crear una cuenta ingresando un email, nombre y contraseña válidos.

#### Scenario: Registro exitoso
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa un email no registrado, su nombre completo, una contraseña válida y hace clic en "Registrarse"
- THEN el sistema realiza la petición `POST /api/auth/register` al backend conteniendo los campos email, name y password
- AND muestra un mensaje de éxito redirigiendo al usuario al formulario de inicio de sesión

#### Scenario: Intento de registro con email duplicado
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa un email ya registrado por otro usuario, su nombre, contraseña válida y hace clic en "Registrarse"
- THEN el sistema muestra un mensaje de error claro provisto por la API del backend

#### Scenario: Registro fallido por nombre inválido (vacío o demasiado corto)
- GIVEN un usuario no autenticado en la página de Login intentando registrarse
- WHEN no proporciona un nombre o proporciona uno de menos de 2 caracteres
- THEN el sistema bloquea el envío y muestra localmente un mensaje de validación indicando el error

---

### Requirement: Inicio de Sesión (Login)
El sistema MUST validar las credenciales del usuario y establecer una sesión de forma segura.

#### Scenario: Login exitoso
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa credenciales correctas y hace clic en "Iniciar Sesión"
- THEN el sistema realiza la petición `POST /api/auth/login` al backend
- AND almacena el token JWT de acceso en el estado de React
- AND redirige al usuario a la página de inicio (Home) con la sesión activa

#### Scenario: Login fallido por credenciales inválidas
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa credenciales incorrectas y hace clic en "Iniciar Sesión"
- THEN el sistema muestra un mensaje de error y mantiene al usuario en el formulario de login

---

### Requirement: Persistencia y Mantenimiento de la Sesión
El sistema MUST verificar de forma asíncrona si existe una sesión activa al cargar o actualizar la aplicación web.

#### Scenario: Recuperación exitosa de sesión activa
- GIVEN un usuario con una sesión activa en el navegador (cookie refresh token presente)
- WHEN abre o recarga la aplicación web
- THEN el sistema muestra el spinner de carga inicial
- AND realiza la petición `GET /api/auth/me` para obtener los datos del usuario
- AND oculta el spinner, manteniendo la sesión iniciada en el frontend

---

### Requirement: Cierre de Sesión (Logout)
El sistema MUST limpiar el estado de sesión local y notificar al backend para invalidar las credenciales.

#### Scenario: Cierre de sesión exitoso
- GIVEN un usuario autenticado y visible en el Header
- WHEN hace clic en el botón "Cerrar Sesión"
- THEN el sistema realiza la petición `POST /api/auth/logout` al backend
- AND ya no almacena el token de acceso en memoria
- AND redirige al usuario a la vista de inicio (Home) con el estado de sesión cerrado

---

### Requirement: Renovación Silenciosa de Access Token (Refresh JWT)
El cliente HTTP (`apiClient.js`) MUST interceptar cualquier respuesta con estado `401 Unauthorized` de solicitudes protegidas del catálogo. Si ocurre un `401`, el cliente MUST pausar la ejecución de esa petición, solicitar de forma asíncrona un nuevo Access Token haciendo un `POST /api/auth/refresh` enviando las credenciales CORS (`credentials: 'include'`), y tras una respuesta exitosa (`200 OK`), persistir el nuevo token y reintentar la petición original con el nuevo encabezado `Authorization`.

#### Scenario: Renovación silenciosa exitosa
- GIVEN un usuario autenticado con un Access Token expirado y una cookie `refreshToken` válida en el navegador.
- WHEN el cliente realiza una petición protegida (ej: `GET /api/cards/card-1`).
- THEN el servidor responde con `401 Unauthorized`.
- AND el `apiClient` intercepta el `401` y realiza un `POST /api/auth/refresh` con `credentials: 'include'`.
- AND el backend responde con un nuevo Access Token.
- AND el cliente persiste el nuevo Access Token en `localStorage`.
- AND el cliente reintenta de forma automática la petición a `GET /api/cards/card-1` inyectando el nuevo token de acceso.
- AND el componente de la UI recibe finalmente los datos de la carta de forma transparente sin interrupciones.

---

### Requirement: Manejo de Expiración Total de Sesión (Session Expiration)
Si la llamada al endpoint de renovación de token (`POST /api/auth/refresh`) falla con un estado `401 Unauthorized` (lo que indica que el Refresh Token en la cookie ha expirado o ha sido revocado), el sistema MUST invalidar por completo la sesión local del usuario, limpiar el almacenamiento persistente local, despachar el evento global `auth:expired` y forzar la redirección a la pantalla de login con un mensaje explicativo.

#### Scenario: Expiración del Refresh Token redirige al Login
- GIVEN un usuario con sesión iniciada cuyo Refresh Token ha expirado en el backend.
- WHEN el Access Token expira y el `apiClient` intenta realizar el refresh silencioso (`POST /api/auth/refresh`).
- THEN el servidor responde con `401 Unauthorized` en la petición de refresh.
- AND el `apiClient` limpia el token `hexa_token` de `localStorage`.
- AND el `apiClient` emite un evento personalizado `auth:expired` en la ventana global (`window`).
- AND el `AuthProvider` de React reacciona al evento, limpia el estado local del usuario (`user: null`, `token: null`) y redirige a la ruta `/login` mostrando el aviso de sesión expirada.

---

### Requirement: Manejo de Peticiones Concurrentes Expiradas
Cuando se disparan múltiples peticiones asíncronas de forma simultánea (ej: cargar la grilla de cartas y chequear favoritos en el home) y el Access Token ha expirado, el cliente HTTP MUST realizar una única petición a `/auth/refresh` en segundo plano. El resto de las peticiones fallidas MUST encolarse y quedar en espera de que finalice la renovación para ser reintentadas todas juntas con el nuevo token obtenido.

#### Scenario: Peticiones concurrentes encoladas y reintentadas tras un único refresh
- GIVEN un usuario autenticado con Access Token expirado.
- WHEN se disparan de forma simultánea tres peticiones: `GET /api/cards`, `GET /api/favorites` y `GET /api/auth/me`.
- THEN las tres peticiones fallan con `401 Unauthorized`.
- AND el `apiClient` realiza una única llamada a `POST /api/auth/refresh`.
- AND las llamadas originales de cards, favorites y auth son encoladas en memoria.
- AND tras el éxito de la petición de refresh, el cliente reintenta las tres peticiones concurrentes encoladas usando el nuevo Access Token.
- AND las llamadas resuelven con éxito hacia la UI de forma transparente.

---

### Requirement: Personalización de Perfil en la Cabecera
La cabecera (Header) MUST renderizar el nombre del usuario si está presente en los datos de la sesión activa, utilizando el email como alternativa (fallback) si el nombre no está configurado o es vacío.

#### Scenario: Visualización del nombre del usuario en el Header
- GIVEN un usuario autenticado con datos `{ "email": "gonzalo@test.com", "name": "Gonzalo" }`
- WHEN el Header se monta en la vista
- THEN muestra el texto "Gonzalo" en lugar del correo electrónico en escritorio y móvil
- AND incluye el correo electrónico "gonzalo@test.com" en el tooltip (title) del elemento

#### Scenario: Fallback a correo electrónico en el Header
- GIVEN un usuario autenticado cuyo nombre no está definido o es vacío (`""`)
- WHEN el Header se monta en la vista
- THEN muestra el correo electrónico "viejo@test.com" en su lugar como fallback de seguridad
