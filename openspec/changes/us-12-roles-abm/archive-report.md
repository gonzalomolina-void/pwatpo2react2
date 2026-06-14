# Archive Report: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

**Change**: us-12-roles-abm
**Closed at**: 2026-06-14T20:33:00Z
**Mode**: Strict TDD

---

### Sync Traceability

All planned specifications and implementation trace have been archived in the openspec local directory:

| Artifact | File Path |
|----------|-----------|
| Exploration | `openspec/changes/us-12-roles-abm/exploration.md` (Not required for this change) |
| Proposal | `openspec/changes/us-12-roles-abm/proposal.md` |
| Specification | `openspec/changes/us-12-roles-abm/spec.md` |
| Design | `openspec/changes/us-12-roles-abm/design.md` |
| Tasks checklist | `openspec/changes/us-12-roles-abm/tasks.md` |
| Implementation progress | `openspec/changes/us-12-roles-abm/apply-progress.md` |
| Verification report | `openspec/changes/us-12-roles-abm/verify-report.md` |
| Archive Report | `openspec/changes/us-12-roles-abm/archive-report.md` |

---

### Specs Synced

The following capabilities have been implemented and validated in the codebase:

* **`jwt-role-decoding`**: Decodificación de tokens JWT usando `atob` nativo en el cliente, extrayendo el rol de administrador (`admin`) y sincronizándolo en el estado del `AuthContext`.
* **`route-protection-by-role`**: Extensión de `ProtectedRoute` para aceptar una propiedad `allowedRoles` y denegar el acceso a rutas administrativas para usuarios sin privilegios.
* **`admin-abm-ui`**: Botones de creación ("Nueva Carta") y de edición/eliminación incrustados reactivamente en el catálogo principal y las tarjetas de cartas solo para roles administrativos.
* **`multilingual-card-modal`**: Modal de alta, edición y eliminación de cartas con inputs bilingües de traducción de nombres y descripciones que se sincronizan con las llamadas POST, PUT, DELETE a la API utilizando el token del usuario.

---

### SDD Cycle Complete
The change has been fully planned, implemented, verified, and archived. All 276/276 tests are passing successfully.
Ready for integration.
