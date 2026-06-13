## Implementation Progress: us-15-auth-flow-corrections

**Mode**: Strict TDD

### Completed Tasks
- [x] 1.1 Crear el archivo del componente `src/components/ProtectedRoute.jsx` con su firma vacía que solo retorne `null`.
- [x] 1.2 Crear `src/components/ProtectedRoute.test.jsx` y escribir las 3 pruebas unitarias fallantes (RED).
- [x] 2.1 Implementar la lógica completa de `ProtectedRoute.jsx` para hacer pasar las pruebas unitarias anteriores en verde (GREEN).
- [x] 2.2 Refactorizar `src/App.jsx` para separar la lógica de providers en `App` y el routing/layouts en `AppContent`.
- [x] 2.3 Envolver las rutas `/`, `/favoritos` y `/detalles/:id` con `<ProtectedRoute>` en `AppContent`.
- [x] 2.4 Implementar el efecto reactivo (`useEffect`) en `AppContent` que redirija a `/login` al cerrarse el Splash Screen si no hay sesión activa.
- [x] 3.1 Modificar `src/components/Header.jsx` para inyectar `useNavigate` y redirigir al Login (`/login`) tras invocar la función `logout()`.
- [x] 3.2 Actualizar la suite de pruebas unitarias en `src/components/Header.test.jsx` y `src/App.test.jsx` para asegurar que el botón de logout redirige correctamente y corregir posibles colisiones causadas por las rutas protegidas.
- [x] 4.1 Correr la suite completa de pruebas (`pnpm.cmd test:run`) y asegurar que todos los tests (heredados y nuevos) finalicen en verde.

### Files Changed
| File | Action | What Was Done |
|------|--------|---------------|
| `src/components/ProtectedRoute.jsx` | Created | Componente de ruta protegida que evalúa la sesión y el loading del token JWT. |
| `src/components/ProtectedRoute.test.jsx` | Created | Pruebas unitarias para validar comportamiento de redirección, loading y renderizado de hijos. |
| `src/App.jsx` | Modified | Refactorización de App/AppContent para integrar ProtectedRoute y redirección reactiva post-splash. |
| `src/components/Header.jsx` | Modified | Ajustada la acción de cerrar sesión para realizar navigate('/login') tras logout. |
| `src/components/Header.test.jsx` | Modified | Modificados los mocks de useNavigate y aserciones para verificar redirección del botón de Logout. |

### TDD Cycle Evidence
| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.2 | `src/components/ProtectedRoute.test.jsx` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 3 tests | ✅ Clean |

### Test Summary
- **Total tests written**: 3 (para ProtectedRoute)
- **Total tests passing**: 234
- **Layers used**: Unit (3)
- **Approval tests**: None
- **Pure functions created**: 0

### Deviations from Design
None.

### Issues Found
- *Header.test.jsx async collision*: El test de redirección de logout fallaba de forma síncrona debido al ciclo de microtareas del `async/await` de `logout()`. Se solucionó haciendo la prueba asíncrona y envolviendo la aserción en `waitFor`.

### Remaining Tasks
- [ ] 4.2 Levantar el servidor de desarrollo local y validar manualmente el comportamiento del Splash screen redirigiendo a login, y el logout redirigiendo de vuelta al login.
