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

## 3. Requirement: Arquitectura Desacoplada y Modular de CardFormModal

Para garantizar la mantenibilidad y escalabilidad del módulo de administración de cartas, la lógica del formulario y su UI MUST estar completamente desacopladas siguiendo el patrón contenedor-presentacional:
- Toda la lógica de negocio, manejo de estados, efectos y peticiones a la API (`cardService`) MUST estar centralizados dentro del Custom Hook `useCardForm.js`.
- La UI del modal de formulario `CardFormModal.jsx` MUST estar dividida en subcomponentes presentacionales atómicos y puros:
  - `<CardStatsGrid />`: Grilla que agrupa atributos globales (costo, ataque, defensa, imagen, tipo y rareza).
  - `<CardTranslationsForm />`: Formulario para la carga de traducciones bilingües (Español e Inglés).
  - `<DeleteConfirmDialog />`: Diálogo de confirmación secundario de borrado.
- Los subcomponentes presentacionales MUST recibir sus estados y manejadores de forma exclusiva a través de props, operando de manera agnóstica a la lógica del backend o al estado del modal contenedor.

## 4. Requirement: Carga Dinámica e Internacionalización de Catálogos Paramétricos

El sistema MUST desacoplar la parametrización de tipos y rarezas de cartas obteniéndolas de forma dinámica desde el backend (endpoints `/api/types` y `/api/rarities`) en lugar de usar constantes locales estáticas:
- Las llamadas a la API de tipos y rarezas MUST incluir la cabecera `Accept-Language` correspondiente al idioma actual de la aplicación (`i18n.language`).
- El servicio de API (`lookupService.js`) MUST cachear en memoria las promesas de las consultas según el idioma de la aplicación para evitar peticiones HTTP redundantes ante la navegación o reapertura de componentes.
- Si el idioma de la aplicación cambia (`i18n.language`), el sistema MUST invalidar la caché y re-ejecutar reactiva e inmediatamente las consultas a la API para refrescar los catálogos en todos los componentes activos en pantalla.
- Mientras la obtención asíncrona de tipos y rarezas esté en curso en el formulario (`useCardForm`), el flag `fetching` del formulario MUST permanecer en `true`.

### Scenario: Carga dinámica y traducción exitosa en Filtros
- **GIVEN** un usuario autenticado en la página de inicio (`Home`).
- **WHEN** el componente se monta con idioma inglés activo.
- **THEN** el sistema MUST disparar la petición HTTP a `GET /api/types` y `GET /api/rarities` con cabecera `Accept-Language: en`.
- **AND** renderizar los filtros de tipo y rareza del buscador con las traducciones dinámicas correspondientes del backend (ej. "Creature", "Legendary").

### Scenario: Cambio reactivo de idioma en filtros activos
- **GIVEN** el Home montado mostrando los filtros de búsqueda en español.
- **WHEN** el usuario cambia el idioma global de la aplicación a inglés (`i18n.language` cambia a 'en').
- **THEN** el sistema MUST invalidar la caché en memoria del `lookupService`.
- **AND** realizar inmediatamente nuevas peticiones a `/api/types` y `/api/rarities` en inglés.
- **AND** renderizar los filtros de búsqueda con los nombres localizados en inglés ("Creature", etc.).

### Scenario: Uso de caché en memoria para múltiples componentes
- **GIVEN** que el Home ya cargó los tipos y rarezas en inglés desde la API.
- **WHEN** un administrador abre el formulario `CardFormModal` (alta o edición).
- **THEN** el `lookupService` MUST resolver los tipos y rarezas utilizando las promesas cacheadas en memoria.
- **AND** NOT realizar llamadas HTTP adicionales a los endpoints `/api/types` and `/api/rarities`.

