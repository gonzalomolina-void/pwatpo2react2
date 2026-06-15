# Propuesta de Cambio: us-18-cardformmodal-refactor

**Cambio**: us-18-cardformmodal-refactor  
**Fase**: Propuesta (sdd-propose)  
**Estado**: Listo para revisión  

---

## 1. Introducción y Motivación

El modal de administración de cartas [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx) es un monolito que mezcla lógica de red, validación, gestión de estado local complejo de traducción y diseño visual. Esto incrementa la deuda técnica y dificulta la mantenibilidad.

Esta propuesta detalla el refactor arquitectónico para:
1. Extraer la lógica y efectos a un custom hook reutilizable `useCardForm`.
2. Dividir la UI en subcomponentes de presentación atómicos y puros.
3. Garantizar la compatibilidad absoluta con la suite de pruebas existente y sumar tests específicos para el hook y los nuevos subcomponentes.

---

## 2. Alcance del Cambio

### Nuevos Archivos a Crear:
1. `src/hooks/useCardForm.js`: Custom hook con toda la lógica de negocio y estado del formulario.
2. `src/hooks/useCardForm.test.js`: Suite de pruebas unitarias para el hook.
3. `src/components/CardStatsGrid.jsx`: Componente de presentación para los inputs y selectores numéricos/globales.
4. `src/components/CardTranslationsForm.jsx`: Componente de presentación para las tarjetas de traducción bilingüe.
5. `src/components/DeleteConfirmDialog.jsx`: Componente presentacional flotante para el diálogo de borrado.

### Archivos a Modificar:
1. [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx): Simplificación absoluta del componente para actuar únicamente como contenedor estructural.
2. [CardFormModal.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.test.jsx): Actualización de mocks e inyecciones de datos en caso de ser necesario.

---

## 3. Enfoque Técnico y Distribución de Responsabilidades

### A. Lógica y Ciclo de Vida (`useCardForm.js`)
El hook encapsulará los estados y los efectos asociados al modal:
- **Carga inicial**: Si `isOpen` y `cardId` están presentes, llamará a `cardService.getCardForEdit` y seteará los estados.
- **Reseteo**: Si `isOpen` cambia pero no hay `cardId`, limpiará todos los campos a sus valores iniciales.
- **Envío**: Validará numéricamente los campos y despachará la acción pertinente (`createCard` o `updateCard`) notificando al finalizar a través de Toast y ejecutando `onSuccess` y `onClose`.
- **Borrado**: Despachará `deleteCard` notificando éxito.

### B. UI Desacoplada (Componentes Presentacionales)
- **`CardStatsGrid`**: Recibirá las props de estado (`cost`, `atk`, `def`, `image`, `typeId`, `rarityId`), manejadores de cambio (`onChange`) y las opciones de tipos y rarezas. No tendrá estado propio.
- **`CardTranslationsForm`**: Recibirá el objeto estructurado de `translations` y el callback `onTranslationChange`.
- **`DeleteConfirmDialog`**: Recibirá la condición de visibilidad (`isOpen`), callbacks (`onClose`, `onConfirm`) y el estado de carga (`loading`).

---

## 4. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| **Regresiones en los tests existentes** | Alto | **NO** modificaremos los selectores `data-testid` ni la jerarquía funcional que `CardFormModal.test.jsx` utiliza para encontrar y simular interacciones. La UI renderizada final debe ser exactamente idéntica en estructura HTML a la actual. |
| **Sincronización desfasada al reabrir el modal** | Medio | El hook `useCardForm` tendrá un `useEffect` que observará las dependencias `isOpen` y `cardId` para forzar la inicialización/limpieza correcta de los estados en cada apertura del modal. |
| **Acoplamiento de constantes en selectores** | Bajo | Haremos que `CardStatsGrid` reciba las listas de opciones `CARD_TYPES` y `CARD_RARITIES` por props, preparándolo para ser alimentado dinámicamente desde la API en la futura **US17**. |

---

## 5. Criterios de Aceptación Técnicos

1. **Desacoplamiento de Lógica**: `CardFormModal.jsx` no debe contener llamadas a `cardService`, ni hooks de `useState`/`useEffect` de inputs directamente definidos en su cuerpo (todo se delega al hook).
2. **Modularización Visual**: La UI de estadísticas, traducciones y borrado debe estar modularizada en componentes atómicos e independientes en `src/components/`.
3. **Tests de Cobertura**: La suite completa de pruebas (`pnpm test:run`) debe pasar a verde con 100% de éxito, e incorporar las nuevas pruebas del hook y los subcomponentes.
