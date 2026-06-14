# Design: us-13-refresh-token

## Technical Approach

Implementaremos un cliente HTTP personalizado (`src/services/apiClient.js`) que envuelva a `window.fetch`. Este wrapper centralizará la inyección de cabeceras de autorización e idioma, forzará el envío de cookies CORS (`credentials: 'include'`) y gestionará el flujo silencioso de renovación de tokens mediante una cola en memoria. 

### Mecanismo de Intercepción y Cola de Peticiones

```
[Cliente HTTP (apiClient)] ─── Petición Protegida ───> [Backend API]
                                                           │
                                             <── 401 Unauthorized ──
                                                           │
                                            ¿isRefreshing = true?
                                              /             \
                                            Sí               No
                                            /                 \
                                   [Encolar Promesa]   [Set isRefreshing = true]
                                                               │
                                                       [POST /auth/refresh]
                                                       /                  \
                                                  200 OK (Nuevo Token)   401 Unauthorized
                                                    /                        \
                                     [Guardar Token en localStorage]    [Limpiar localStorage]
                                                    │                                │
                                      [Procesar Cola / Reintentar]      [Despachar Evento auth:expired]
                                                    │                                │
                                           (isRefreshing = false)          (Redirección a /login)
```

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **apiClient (Wrapper Fetch)** | Cero dependencias externas. Control absoluto de la cola de reintentos concurrentes. Mayor código a mantener. | **Elegida**: Mantiene el bundle liviano y es 100% compatible con la arquitectura actual del proyecto. |
| **Migrar a Axios** | Menos código propio. Librería estándar. Incrementa peso del bundle y requiere refactorizar toda la firma de llamadas. | **Rechazada**: Añade complejidad innecesaria a los tests existentes y peso al bundle. |

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Eventos Globales (`CustomEvent`)** | Desacoplamiento total entre `apiClient.js` y `AuthContext.jsx`. Fácil de testear. | **Elegida**: Permite a la capa de infraestructura notificar a la UI sin acoplar dependencias directas de React. |
| **Callback Registrado** | Acoplamiento imperativo directo. Mayor complejidad en el ciclo de vida del setup. | **Rechazada**: Complica el testeo en aislamiento del `apiClient`. |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/apiClient.js` | Create | Wrapper personalizado de `fetch` que maneja cabeceras, CORS, semáforo de refresh y cola de peticiones. |
| `src/services/apiClient.test.js` | Create | Pruebas unitarias completas para los flujos de reintento, colas concurrentes y eventos de expiración. |
| `src/services/authService.js` | Modify | Reemplazar `fetch` por llamadas a `apiClient` y agregar `credentials: 'include'`. |
| `src/services/cardService.js` | Modify | Reemplazar `fetch` por llamadas a `apiClient`. |
| `src/context/AuthContext.jsx` | Modify | Agregar event listener para `auth:expired` y realizar limpieza global y redirección a `/login`. |

## Data Flow (Refresh Silencioso)

1. Una petición a `apiClient` detecta un `401 Unauthorized`.
2. Si no es una ruta pública, y `isRefreshing === false`:
   * Se marca `isRefreshing = true`.
   * Se inicia la petición `POST /api/auth/refresh` con `credentials: 'include'`.
3. Mientras se resuelve el refresh, otras peticiones concurrentes que den `401` se guardan en la cola `failedQueue`.
4. Si la llamada de refresh es exitosa:
   * Se almacena el nuevo token en `localStorage` (`hexa_token`).
   * Se reintentan todas las peticiones encoladas en `failedQueue` con el nuevo token y se resuelve la promesa original.
   * Se limpia la cola y se restablece `isRefreshing = false`.
5. Si falla la llamada de refresh:
   * Se limpia la cola rechazando las promesas pendientes.
   * Se borra `hexa_token` de `localStorage`.
   * Se emite el evento global `auth:expired`.
   * `AuthContext` escucha el evento, limpia el estado de React y redirige al Login.
