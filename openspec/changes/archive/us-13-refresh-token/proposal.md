# Proposal: us-13-refresh-token

## Intent
Implementar la renovación silenciosa y automática de la sesión del usuario mediante un Refresh Token persistido en cookies HTTP-Only seguras por el backend. Cuando el Access Token JWT expire y la API responda con un error `401 Unauthorized`, el frontend interceptará el fallo, solicitará un nuevo Access Token al endpoint de refresh de forma transparente y reintentará la solicitud original. Si el refresco falla, se invalidará la sesión local redirigiendo al usuario al login.

## Scope

### In Scope
* **Creación de `src/services/apiClient.js`**: Cliente HTTP unificado (wrapper sobre `fetch` nativo) con soporte para inyección de cabeceras, manejo de cookies CORS (`credentials: 'include'`) y cola de peticiones bloqueantes durante la renovación del token.
* **Manejo de Errores 401**: Interceptar el estado `401` en `apiClient.js`, exceptuando los endpoints públicos de login y registro.
* **Cola de Peticiones concurrentes**: Cola en memoria para pausar peticiones simultáneas mientras se resuelve la llamada de refresh, liberándolas/reintentándolas juntas una vez que se obtiene el nuevo token.
* **Notificación de Expiración**: Emisión de un evento personalizado `auth:expired` cuando el refresh token también ha expirado (o sea inválido), permitiendo que `AuthContext` limpie el estado de React y navegue al login.
* **Refactor de Servicios**: Migrar `src/services/cardService.js` y `src/services/authService.js` para que utilicen `apiClient` en lugar de `fetch` directo.
* **Tests Unitarios**: Escribir pruebas unitarias exhaustivas en `src/services/apiClient.test.js`.

### Out of Scope
* Modificaciones en el backend `tpexpress` (se asume que su API y manejo de cookies están listos y expuestos).
* Migración a librerías de terceros (Axios).

## Technical Approach
1. **apiClient.js**:
   * Mantener una bandera `isRefreshing = false` y un arreglo `failedQueue = []` para pausar peticiones.
   * Inyectar dinámicamente el encabezado `Authorization: Bearer <token>` si hay un token en localStorage.
   * Inyectar `Accept-Language` con el locale de `i18n.language`.
   * Adjuntar `credentials: 'include'` en todas las peticiones a la API para dar soporte a las cookies CORS de refresh.
2. **AuthContext.jsx**:
   * Registrar un event listener para `auth:expired`. Al gatillarse, ejecutar la limpieza del storage, resetear el estado `user` y `token` a null, y navegar a `/login`.
3. **Refactor**:
   * Cambiar las llamadas de `fetch` por llamadas a `apiClient.get`, `apiClient.post`, etc.

## Migration / Rollout
No se requieren migraciones de base de datos. El rollout se realizará directamente al integrar esta rama, ya que los contratos de firmas de funciones de servicios hacia los componentes visuales de React se mantendrán inalterados.
