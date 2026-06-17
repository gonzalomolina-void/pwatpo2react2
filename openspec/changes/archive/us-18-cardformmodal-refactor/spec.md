# Especificación de Requerimientos: us-18-cardformmodal-refactor

**Cambio**: us-18-cardformmodal-refactor  
**Fase**: Especificación (sdd-spec)  
**Estado**: Listo para revisión  

---

## 1. Requerimientos Funcionales y Técnicos

### REQ-1: Desacoplamiento de Lógica de Negocio (Custom Hook)
- **Descripción**: La lógica de administración de cartas debe estar desacoplada de la capa visual.
- **Detalle Técnico**:
  - Toda llamada a `cardService` (`getCardForEdit`, `createCard`, `updateCard`, `deleteCard`) MUST gestionarse dentro de `useCardForm.js`.
  - Todos los estados de formulario (cost, atk, def, image, typeId, rarityId, translations, loading, fetching, error, showDeleteConfirm) MUST vivir en el hook.
  - El hook MUST retornar valores y manejadores listos para que los consuma la UI.

### REQ-2: Modularización Visual de UI (Subcomponentes)
- **Descripción**: El modal debe construirse a partir de componentes presentacionales atómicos de React.
- **Detalle Técnico**:
  - Los inputs globales de la carta (stats y assets) MUST modularizarse en `<CardStatsGrid />`.
  - Los inputs de traducción bilingüe MUST modularizarse en `<CardTranslationsForm />`.
  - El modal de confirmación de borrado MUST modularizarse en `<DeleteConfirmDialog />`.
  - Los subcomponentes MUST recibir sus valores y manejadores de forma exclusiva por props.

### REQ-3: Preservación de UI e Integración de Tests
- **Descripción**: El refactor visual no debe alterar la experiencia de usuario ni romper las pruebas automáticas.
- **Detalle Técnico**:
  - Los selectores de pruebas `data-testid` (`input-cost`, `input-atk`, `input-def`, `input-image`, `select-type`, `select-rarity`, `input-name-es`, `textarea-desc-es`, `input-name-en`, `textarea-desc-en`, `btn-delete`, `btn-confirm-delete`, `delete-confirm-dialog`) MUST mantenerse idénticos y en los mismos elementos lógicos.
  - La suite de pruebas de `CardFormModal.test.jsx` MUST pasar al 100% sin modificar su estructura de simulación.

---

## 2. Escenarios de Aceptación (Gherkin)

### Escenario 1: Inicialización y carga de datos en modo Edición (Hook)
- **Dado** que se invoca `useCardForm` con `cardId: "123"` e `isOpen: true`
- **Cuando** el servicio `cardService.getCardForEdit("123")` resuelve con los datos de la carta
- **Entonces** el hook MUST cambiar `fetching` a `false`
- **Y** poblar los estados correspondientes (`cost`, `atk`, `def`, `image`, `typeId`, `rarityId`, `translations`) con los datos devueltos por la API.

### Escenario 2: Limpieza de campos al abrir en modo Creación (Hook)
- **Dado** que se invoca `useCardForm` sin `cardId` (alta) e `isOpen: true`
- **Cuando** se monta o abre el modal
- **Entonces** el hook MUST limpiar e inicializar todos los estados de los campos a su valor vacío por defecto.

### Escenario 3: Envío exitoso del formulario y triggers de callbacks
- **Dado** que un usuario completa los datos en el formulario
- **Cuando** ejecuta el envío del formulario (`handleSubmit`)
- **Entonces** el hook MUST validar que los números sean válidos y no vacíos
- **Y** despachar la llamada a la API (`createCard` o `updateCard` según corresponda)
- **Y** notificar el éxito mediante Toast
- **Y** ejecutar los callbacks `onSuccess` (con payload enriquecido) y `onClose` recibidos por prop.

### Escenario 4: Confirmación y eliminación exitosa
- **Dado** que el usuario hace click en "Eliminar" en modo Edición
- **Cuando** confirma la acción en el diálogo secundario (`handleDelete`)
- **Entonces** el hook MUST llamar a `cardService.deleteCard` con el ID de la carta
- **Y** notificar el éxito mediante Toast
- **Y** ejecutar `onSuccess` (con payload enriquecido) y `onClose`
- **Y** ocultar el diálogo de confirmación.

### Escenario 5: Preservación de UI del Modal
- **Dado** que el modal `CardFormModal` está abierto
- **Cuando** se renderiza la UI
- **Entonces** el contenedor principal delega a los subcomponentes `<CardStatsGrid />`, `<CardTranslationsForm />` y `<DeleteConfirmDialog />` pasando las props correspondientes
- **Y** la estructura del árbol DOM conserva los mismos inputs con sus atributos `data-testid` intactos.
