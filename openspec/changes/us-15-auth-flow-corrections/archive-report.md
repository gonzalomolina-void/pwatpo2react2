# Archive Report: us-15-auth-flow-corrections

**Status**: 📦 ARCHIVED
**Change ID**: `us-15-auth-flow-corrections`
**Project**: `HEXA (Full-stack)`

## 1. Summary of Completed Change
Se han completado y verificado todas las correcciones y securizaciones correspondientes a la **User Story 15 (Flujo de Autenticación y Securización de Cartas)** en una arquitectura full-stack (frontend React y backend Express).
El catálogo, los favoritos y los detalles ahora están debidamente resguardados de usuarios anónimos en ambas aplicaciones.

---

## 2. Deliverables & Branches

### 2.1 Frontend: `feat/us-15-auth-flow-corrections`
Rama creada a partir de `feat/us-10-login-y-registro` y subida a origin. Los cambios principales son:
*   🆕 [src/components/ProtectedRoute.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/ProtectedRoute.jsx): Componente wrapper para validar estado de sesión y loading.
*   🆕 [src/components/ProtectedRoute.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/ProtectedRoute.test.jsx): Pruebas de integración del componente.
*   ⚠️ [src/App.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/App.jsx) (Modificado): Refactorizado en `App` y `AppContent` para inyectar `useNavigate`, aplicar `ProtectedRoute` a las tres vistas principales, y disparar la redirección reactiva post-splash.
*   ⚠️ [src/components/Header.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/Header.jsx) y [src/components/Header.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/Header.test.jsx) (Modificados): Modificado Logout para redirigir a `/login` de inmediato.

### 2.2 Backend: `feat/us-15-api-security`
Rama creada a partir de `main` en `tpexpress` y subida a origin. Los cambios son:
*   ⚠️ [src/routes/card.routes.js](file:///C:/Work/Uncoma/PWA/tpexpress/src/routes/card.routes.js) (Modificado): Securizadas las rutas GET `/api/cards` y GET `/api/cards/:id` aplicando el middleware `requireAuth`.

---

## 3. Final Sign-off
Todas las pruebas automatizadas (234 en el cliente y 41 en la API) se ejecutan con éxito y sin regresiones. Se cierra este cambio en la suite SDD y se marca como archivado.
