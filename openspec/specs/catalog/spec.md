# Spec: Catalog

## 1. Requirement: Recarga de Datos de Carta por Idioma (i18n)

El componente de detalles de carta (`Detail.jsx`) MUST realizar una nueva petición para obtener la información de la carta en el idioma correspondiente cada vez que cambie el idioma global seleccionado en el cliente. El sistema MUST mostrar el spinner de carga temático (`LoadingSpinner`) mientras la petición está en curso.

### Scenario: Cambio de idioma exitoso en pantalla de detalles
- **GIVEN** un usuario autenticado visualizando el detalle de la carta "card-1" en español.
- **WHEN** el usuario cambia el idioma a inglés desde el selector del header (`i18n.language` pasa a 'en').
- **THEN** el componente `Detail` MUST gatillar una nueva llamada asíncrona a `cardService.getCardById('card-1')`.
- **AND** renderizar el `LoadingSpinner` mostrando el mensaje correspondiente al nuevo idioma mientras espera la respuesta.
- **AND** renderizar finalmente la carta con sus datos (nombre, descripción, tipo y rareza) traducidos al inglés.

### Scenario: Cancelación por cambio rápido de idioma
- GIVEN un usuario autenticado visualizando el detalle de la carta "card-1" en español.
- WHEN el usuario cambia a inglés y, antes de completar la carga, cambia a español nuevamente de forma inmediata.
- THEN el sistema MUST abortar la petición intermedia de inglés usando la señal de `AbortController`.
- AND realizar la última petición en español.
- AND renderizar el componente final únicamente con los datos en español tras finalizar su carga.

## 2. Requirement: Sincronización Inteligente de Filtros Post-ABM

El sistema MUST sincronizar de forma inteligente los filtros del catálogo de cartas ante las acciones exitosas de Alta, Modificación y Baja realizadas en el modal de administración:
- Al **Crear** o **Borrar** una carta, los filtros de búsqueda MUST limpiarse a su estado inicial vacío y el catálogo MUST recargar desde la página 1.
- Al **Editar** una carta, los filtros de búsqueda MUST conservarse. El listado MUST actualizarse optimistamente en el cliente de forma inmediata, y la página 1 MUST recargarse en segundo plano desde el backend.

### Scenario: Limpieza de filtros en Alta (Creación) exitosa
- GIVEN un usuario administrador con filtros activos en el catálogo.
- WHEN completa y guarda con éxito los datos de una nueva carta.
- THEN el modal de administración MUST cerrarse.
- AND restablecer el buscador y filtros a su estado vacío.
- AND recargar el catálogo desde la página 1 sin condiciones de búsqueda.

### Scenario: Limpieza de filtros en Baja (Eliminación) exitosa
- GIVEN un usuario administrador con filtros activos en el catálogo.
- WHEN elimina con éxito una carta existente en el modal.
- THEN el modal de administración MUST cerrarse.
- AND restablecer el buscador y filtros a su estado vacío.
- AND recargar el catálogo desde la página 1 sin condiciones de búsqueda.

### Scenario: Conservación de filtros y actualización optimista en Modificación (Edición) exitosa
- GIVEN un usuario administrador con filtros activos y visualizando la carta "card-123".
- WHEN edita y guarda con éxito los cambios de la carta "card-123".
- THEN el modal de administración MUST cerrarse.
- AND conservar intactos los filtros de búsqueda activos.
- AND actualizar localmente e inmediatamente en la grilla los campos modificados de la carta "card-123" (actualización optimista).
- AND recargar la página 1 del catálogo desde la API conservando los filtros.

### Scenario: Sincronización reactiva del buscador sin bucles
- GIVEN el componente `SearchBar` renderizado.
- WHEN recibe una prop `filters` modificada desde el padre `Home`.
- THEN MUST actualizar su estado local interno para reflejar las props.
- AND NOT disparar llamadas al callback `onSearch` para evitar loops de renderizado.
