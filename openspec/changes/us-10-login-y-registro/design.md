# Design: US 10 - Login, Registro y Gestión de Sesión (JWT)

## Technical Approach
El frontend consumirá los servicios de autenticación del backend Node.js (`http://localhost:3000/api/auth`). Implementaremos un `AuthContext` en React para propagar de forma global el token de acceso, el estado de carga (`loading`), los datos del usuario logueado, y proveer los métodos de registro, login y logout. La persistencia de sesión a largo plazo se delegará a la cookie `refreshToken` que el backend maneja automáticamente.

## Architecture Decisions

### Decision: Manejo de Estado de Sesión y Autenticación
* **Choice**: React Context (`AuthContext`) y un hook personalizado `useAuth`.
* **Alternatives considered**: Redux Toolkit, Zustand, variables globales en servicios.
* **Rationale**: React Context es nativo, liviano y perfectamente adecuado para difundir el estado de autenticación a través del árbol de componentes de HEXA sin introducir dependencias externas.

### Decision: Persistencia del Token de Acceso
* **Choice**: Almacenamiento puramente en memoria de React (RAM) para el `accessToken` (duración corta, 15 min).
* **Alternatives considered**: Guardar JWT en `localStorage`.
* **Rationale**: Almacenar el JWT en `localStorage` lo expone a ataques XSS. Guardarlo en memoria es seguro. La persistencia real la maneja la cookie HTTP-Only segura del refresh token a nivel de red, que es inmune a lecturas de JS.

## Data Flow

```
  Formulario Login ──(login)──> useAuth() ──(fetch)──> POST /api/auth/login
         │                                                      │
         │                                               (Set HTTP-Only Cookie)
         │                                                      │
         ▼                                                      ▼
  Actualiza RAM token <──────── Retorna JWT <───────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/authService.js` | Create | Wrapper de `fetch` para realizar llamadas a `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, y `/api/auth/me`. |
| `src/context/AuthContext.jsx` | Create | Context Provider que expone `user`, `login`, `register`, `logout` y `loading`. Realiza petición `/auth/me` inicial para recuperar la sesión. |
| `src/hooks/useAuth.js` | Create | Hook simple para consumir `AuthContext`. |
| `src/pages/Login.jsx` | Create | Vista con formularios integrados de Login y Registro. |
| `src/App.jsx` | Modify | Envolver app en `AuthProvider` y declarar ruta `/login` en el enrutador. |
| `src/components/Header.jsx` | Modify | Reaccionar a `useAuth` para mostrar Login, Logout y el email del usuario logueado. |

## Interfaces / Contracts

### `authService.js` API
```javascript
export const authService = {
  register: async (email, password) => { ... }, // POST /api/auth/register
  login: async (email, password) => { ... },    // POST /api/auth/login
  logout: async () => { ... },                  // POST /api/auth/logout
  getMe: async (token) => { ... }               // GET /api/auth/me
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `authService` | Mockear llamadas a `fetch` simulando respuestas exitosas y errores del backend. |
| Unit | `Login` Page | Verificar renderizado, validación de campos, y envío correcto del formulario. |
| Integration | `AuthContext` + `Header` | Renderizar el Header dentro del provider de autenticación y verificar cambio de estado tras simular login. |

## Migration / Rollout
No se requiere migración de datos. Al desplegar el frontend, se debe configurar la variable de entorno `VITE_API_URL` apuntando al backend real en producción.

## Open Questions
None
