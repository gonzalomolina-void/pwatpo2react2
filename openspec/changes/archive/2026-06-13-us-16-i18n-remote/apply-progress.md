## Implementation Progress: us-16-i18n-remote

**Mode**: Strict TDD

### Completed Tasks
- [x] 1.1 Modificar `src/pages/Detail.test.jsx` para refactorizar el mock de `react-i18next` utilizando `vi.hoisted` y un shared ref `mockLanguage.value`.
- [x] 1.2 Agregar un test unitario en `src/pages/Detail.test.jsx` que renderice el componente, simule un cambio de idioma mutando `mockLanguage.value` y rerenderizando el componente, y aserte que `cardService.getCardById` se invoque por segunda vez (RED).
- [x] 2.1 Modificar `src/pages/Detail.jsx` agregando `i18n.language` a las dependencias del hook `useEffect` de carga.
- [x] 2.2 Ejecutar `pnpm.cmd test:run` para comprobar que los nuevos tests unitarios y la suite pasen a verde (GREEN).

### Files Changed
| File | Action | What Was Done |
|------|--------|---------------|
| `src/pages/Detail.jsx` | Modified | Añadido `i18n.language` en el arreglo de dependencias de `useEffect`. |
| `src/pages/Detail.test.jsx` | Modified | Refactorizado mock de `react-i18next` con variable `vi.hoisted` y agregado test de reactividad. |

### TDD Cycle Evidence
| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.2 | `src/pages/Detail.test.jsx` | Unit | N/A (new) | ✅ Written | ✅ Passed | ✅ 1 test | ✅ Clean |

### Test Summary
- **Total tests written**: 1
- **Total tests passing**: 239
- **Layers used**: Unit (1)
- **Approval tests**: None
- **Pure functions created**: 0

### Deviations from Design
None.

### Issues Found
None.

### Remaining Tasks
- [ ] 3.1 Confirmar que los 239 tests de la suite completa de pruebas pasen a verde sin regresiones.
- [ ] 3.2 Levantar de forma local los servidores para verificar visualmente que el lore de la carta se traduzca reactivamente al cambiar de idioma en el header y que el LoadingSpinner aparezca temporalmente durante la transición.
