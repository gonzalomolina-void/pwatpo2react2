# Tasks: us-16-i18n-remote

Este documento detalla el desglose de tareas cronológicas para implementar la US16 siguiendo estrictamente el ciclo TDD.

## Phase 1: Test-First Setup (RED)
- [ ] **Task 1.1**: Modificar `src/pages/Detail.test.jsx` para refactorizar el mock de `react-i18next` utilizando `vi.hoisted` y un shared ref `mockLanguage.value`.
- [ ] **Task 1.2**: Agregar un test unitario en `src/pages/Detail.test.jsx` que renderice el componente, simule un cambio de idioma mutando `mockLanguage.value` y rerenderizando el componente, y aserte que `cardService.getCardById` se invoque por segunda vez (RED).

## Phase 2: Core Implementation (GREEN)
- [ ] **Task 2.1**: Modificar `src/pages/Detail.jsx` agregando `i18n.language` a las dependencias del hook `useEffect` de carga.
- [ ] **Task 2.2**: Ejecutar `pnpm.cmd test:run` para comprobar que los nuevos tests unitarios y la suite pasen a verde (GREEN).

## Phase 3: Verification & Manual Testing
- [ ] **Task 3.1**: Confirmar que los 239 tests de la suite completa de pruebas pasen a verde sin regresiones.
- [ ] **Task 3.2**: Levantar de forma local los servidores para verificar visualmente que el lore de la carta se traduzca reactivamente al cambiar de idioma en el header y que el LoadingSpinner aparezca temporalmente durante la transición.
