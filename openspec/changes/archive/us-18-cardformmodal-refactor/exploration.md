# Reporte de Exploración: us-18-cardformmodal-refactor

**Cambio**: us-18-cardformmodal-refactor  
**Estado**: Completado  

---

## 1. Contexto y Objetivos

El modal de administración de cartas [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx) actualmente centraliza toda la lógica de negocio y visualización del ABM de cartas en un único archivo de más de 420 líneas. Esto dificulta el mantenimiento, la escalabilidad y la testabilidad de la interfaz de administración.

La **US18** busca refactorizar este modal aplicando los siguientes principios arquitectónicos:
- **Separación de Lógica y Presentación**: Extraer todos los estados locales, efectos de carga, llamadas a la API de `cardService` y validaciones a un custom hook llamado `useCardForm.js`.
- **Componentes Atómicos**: Dividir la UI del modal en tres subcomponentes atómicos de presentación:
  - `CardStatsGrid.jsx`: Formulario para atributos numéricos y selectores globales.
  - `CardTranslationsForm.jsx`: Gestión bilingüe (Español/Inglés) de nombre y descripción.
  - `DeleteConfirmDialog.jsx`: Diálogo secundario flotante de confirmación de eliminación.
- **Mantener Cobertura de Tests**: Asegurar que los tests existentes sigan pasando al 100% y crear pruebas específicas para cada nueva pieza modularizada.

---

## 2. Investigación de la Estructura Actual

El componente actual [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx) contiene:

### A. Estados e Inicialización
- 11 estados locales distintos para rastrear los campos del formulario, cargas (`fetching`, `loading`), errores y confirmación de borrado.
- Un `useEffect` de 50 líneas encargado de limpiar el formulario (en alta) o pedir y precargar los datos de la carta por su ID (en edición).

### B. Lógica de Envío y Borrado
- `handleSubmit`: Lógica asíncrona para validar atributos numéricos y despachar `createCard` o `updateCard` enviando el payload estructurado con arrays de traducciones, seguido de notificaciones en Toast.
- `handleDelete`: Lógica asíncrona para despachar `deleteCard` y notificar éxito o error.

### C. UI Embebida
- Grid complejo con 6 entradas globales (cost, atk, def, image, type, rarity).
- Dos tarjetas de traducción con inputs de nombre y textareas de descripción bilingües.
- Diálogo flotante (dialog de confirmación) embebido con condicional inline al final del archivo.

---

## 3. Plan de Diseño Modularizado

### 1. Custom Hook: `useCardForm.js`
Ubicación: `src/hooks/useCardForm.js`
Encapsulará:
- Los estados de los inputs, la carga y confirmación de borrado.
- El `useEffect` que gestiona el fetch inicial de edición y el reset en alta.
- Las funciones `handleSubmit`, `handleDelete` y `handleTranslationChange`.
- Recibe por parámetro un objeto de configuración: `{ cardId, isOpen, onSuccess, onClose }`.

### 2. Formulario de Atributos: `CardStatsGrid.jsx`
Ubicación: `src/components/CardStatsGrid.jsx`
Componente presentacional puro que renderiza el grid de datos de la carta.
> [!IMPORTANT]
> Para anticiparnos a la **US17** (desacoplamiento de tipos y rarezas desde backend), diseñaremos `CardStatsGrid` de forma que reciba las opciones de tipos y rarezas por props (o a través del hook) en lugar de importar constantes locales hardcodeadas. Esto facilitará enormemente la integración posterior de la API asíncrona de tipos/rarezas.

### 3. Formulario Bilingüe: `CardTranslationsForm.jsx`
Ubicación: `src/components/CardTranslationsForm.jsx`
Componente presentacional que renderiza las secciones de Español e Inglés y propaga los cambios mediante un callback genérico `onChange`.

### 4. Diálogo de Borrado: `DeleteConfirmDialog.jsx`
Ubicación: `src/components/DeleteConfirmDialog.jsx`
Componente flotante que abstrae el diálogo de confirmación de borrado, encapsulando su propio overlay y botones.

---

## 4. Estrategia de Testing (TDD)

1.  **Tests para `useCardForm`**: Crearemos un archivo [useCardForm.test.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useCardForm.test.js) usando `renderHook` de `@testing-library/react` para validar el ciclo de vida de los estados (precarga de datos, reseteos, llamadas a la API y notificaciones).
2.  **Tests para Subcomponentes**: Crearemos pruebas unitarias de renderizado y control para `CardStatsGrid`, `CardTranslationsForm` y `DeleteConfirmDialog`.
3.  **Refactor de CardFormModal**: Reemplazaremos la implementación en `CardFormModal.jsx` y comprobaremos que las pruebas de integración en [CardFormModal.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.test.jsx) sigan pasando al 100%.

---

## 5. Próximos Pasos

1.  Crear la Propuesta de Cambio (`proposal.md`) detallando la estructura de archivos final.
2.  Escribir el Diseño Técnico (`design.md`) detallando la interfaz del hook y de cada subcomponente.
3.  Crear la Lista de Tareas (`tasks.md`) secuencial para la implementación TDD.
