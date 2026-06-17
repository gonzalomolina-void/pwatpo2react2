# Desglose de Tareas: us-18-cardformmodal-refactor

**Cambio**: us-18-cardformmodal-refactor  
**Fase**: Tareas (sdd-tasks)  
**Estado**: Listo para revisión  

Este documento detalla la secuencia cronológica de tareas requeridas para implementar el refactor modular de `CardFormModal` siguiendo el ciclo de desarrollo TDD de forma estricta.

---

## 📋 Lista de Tareas Cronológicas

### 📦 Bloque 1: Custom Hook `useCardForm`

- [x] **1.1 (Test Unitario - Rojo):** Crear el archivo de pruebas `src/hooks/useCardForm.test.js` y definir tests unitarios usando `renderHook` y `vitest` para comprobar:
  - Inicialización vacía en modo creación (alta).
  - Carga asíncrona de datos en modo edición (precarga y poblamiento de estados).
  - Limpieza de estados al reabrir el modal.
  - Envío y validación asíncrona del formulario dispatchando `createCard` o `updateCard`.
  - Eliminación asíncrona dispatchando `deleteCard`.
- [x] **1.2 (Implementación - Verde):** Crear el archivo `src/hooks/useCardForm.js` y programar la lógica completa de estados, `useEffect` y manejadores (`handleSubmit`, `handleDelete`, `handleTranslationChange`).
- [x] **1.3 (Verificación):** Correr `pnpm.cmd test:run` y asegurar que la suite del hook pase a verde (GREEN).

---

### 📦 Bloque 2: Subcomponentes Presentacionales

- [x] **2.1 (Subcomponente - CardStatsGrid):**
  - Crear el test unitario `src/components/CardStatsGrid.test.jsx` (Rojo) validando el renderizado de campos y selectores.
  - Crear el componente `src/components/CardStatsGrid.jsx` (Verde) extrayendo el grid de atributos globales del modal original.
  - Confirmar test en verde.
- [x] **2.2 (Subcomponente - CardTranslationsForm):**
  - Crear el test unitario `src/components/CardTranslationsForm.test.jsx` (Rojo) validando inputs bilingües.
  - Crear el componente `src/components/CardTranslationsForm.jsx` (Verde) extrayendo las tarjetas de traducción bilingües.
  - Confirmar test en verde.
- [x] **2.3 (Subcomponente - DeleteConfirmDialog):**
  - Crear el test unitario `src/components/DeleteConfirmDialog.test.jsx` (Rojo) validando overlay, textos y botones.
  - Crear el componente `src/components/DeleteConfirmDialog.jsx` (Verde) extrayendo la UI flotante de confirmación.
  - Confirmar test en verde.

---

### 📦 Bloque 3: Refactorización del Contenedor e Integración

- [x] **3.1 (Refactor - Verde):** Modificar [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx) para remover toda la lógica monolítica de estados/API y adaptarlo para consumir el hook `useCardForm` y renderizar los nuevos subcomponentes.
- [x] **3.2 (Verificación de Integración):** Correr la suite de tests de [CardFormModal.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.test.jsx) y comprobar que sigan pasando al 100% sin modificaciones estructurales (confirmando que los selectores de test se mantuvieron correctos).
- [x] **3.3 (Prueba de Regresión Final):** Correr toda la suite de pruebas del proyecto (`pnpm.cmd test:run`) garantizando que los 282+ tests estén en verde y sin regresiones.
