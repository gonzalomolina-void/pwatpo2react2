# Exploration: us-13-refresh-token

## Context & Objectives
La User Story 13 requiere que la aplicación mantenga activa la sesión del usuario de forma transparente, renovando automáticamente el token de acceso (Access Token) mediante el Refresh Token cuando expire (retornando error `401 Unauthorized`), y deslogueando al usuario redirigiéndolo al Login únicamente cuando el Refresh Token también haya expirado o sea inválido.

## Current Architecture Analysis
* **Cliente HTTP**: No se utiliza Axios, la aplicación consume la API mediante `fetch` nativo de forma imperativa en `src/services/cardService.js` y `src/services/authService.js`.
* **Almacenamiento de Tokens**:
  * El Access Token (`hexa_token`) se almacena actualmente en `localStorage` (establecido en la US10/15).
  * El Refresh Token lo expone el backend Express (`tpexpress`) a través de una cookie segura HTTP-Only llamada `refreshToken` al hacer login exitoso.
* **Comportamiento del Backend (`tpexpress`)**:
  * `POST /api/auth/login`: Genera el Access Token (JWT de corta duración: 15m) en la respuesta y setea el Refresh Token en una cookie HTTP-Only segura (`sameSite: 'strict'`, `maxAge: 7 días`).
  * `POST /api/auth/refresh`: Lee la cookie HTTP-Only, valida el Refresh Token en la base de datos y responde con un nuevo Access Token (`{ token }`) en el cuerpo de la respuesta en formato JSON.
  * `POST /api/auth/logout`: Invalida el Refresh Token en la base de datos y borra la cookie en el cliente.
  * **CORS & Cookies**: Dado que el cliente corre en `http://localhost:5173` y la API en `http://localhost:3000`, es obligatorio pasar la propiedad `credentials: 'include'` en todas las llamadas de `fetch` de autenticación para que el navegador guarde la cookie al loguearse y la envíe al refrescar o desloguear.

## Identified Gap / Technical Problem
Actualmente no existe un cliente HTTP unificado (interceptor). Si el Access Token expira, las llamadas a `fetch` en `cardService.js` fallarán directamente con `401 Unauthorized`, lo que causará redirecciones incorrectas a `/404` (en la vista de detalles) o errores silenciosos.
Para resolver esto de manera elegante y reutilizable, es imperativo crear un wrapper unificado para `fetch` en el frontend, en lugar de duplicar la lógica de captura del `401` y reintento en cada servicio de la aplicación.

## Proposed Alternatives

### Alternative 1: Wrapper personalizado de `fetch` (apiClient)
Consiste en crear un cliente HTTP unificado en `src/services/apiClient.js` que implemente una función `customFetch` que envuelva a `window.fetch`. Este wrapper inyectará automáticamente las cabeceras comunes (como `Authorization` y `Accept-Language`), capturará las respuestas `401`, realizará el refresh silencioso mediante `POST /api/auth/refresh`, actualizará el Access Token y reintentará la petición original.
* **Pros**:
  * Mantiene las dependencias a cero (no requiere agregar Axios).
  * Control total sobre la lógica del reintento de fetch.
  * Se alinea con el diseño minimalista actual.
* **Contras**:
  * Requiere escribir un poco de código para manejar la cola de peticiones concurrentes que fallan con 401 mientras se realiza la renovación del token (evitando múltiples llamadas simultáneas de refresh).

### Alternative 2: Instalar y migrar a Axios
Instalar Axios (`pnpm add axios`) y reemplazar todos los usos de `fetch` en los servicios por instancias de Axios, configurando el interceptor estándar de respuesta.
* **Pros**:
  * Los interceptores de Axios son un estándar de la industria bien conocido.
* **Contras**:
  * Agrega peso adicional al bundle (~40KB gzip).
  * Requiere refactorizar todos los métodos de `authService.js` y `cardService.js` para migrar de `fetch` a Axios, incrementando el riesgo de regresiones y rompiendo tests unitarios existentes.

## Decision
**Elegida: Alternativa 1 (Wrapper personalizado de `fetch`)**
Es la opción más robusta y limpia porque evita dependencias pesadas y minimiza el impacto en la suite de tests unitarios existentes. Refactorizaremos el acceso HTTP en `cardService.js` y `authService.js` para usar nuestro `apiClient.js`, manteniendo la interfaz del servicio idéntica hacia los componentes (cero cambios en componentes React).

## Spikes / Verification Plan
1. Verificar que el backend reciba correctamente las cookies enviando `credentials: 'include'`.
2. Escribir tests unitarios (TDD) para validar que el interceptor maneje correctamente el flujo de refresh y el reintento de la petición original.
3. Asegurar que las llamadas concurrentes en vuelo esperen al proceso de renovación antes de reintentar.
