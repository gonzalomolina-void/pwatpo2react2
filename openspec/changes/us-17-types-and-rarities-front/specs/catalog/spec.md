# Delta for catalog

## ADDED Requirements

### Requirement: Carga Dinámica e Internacionalización de Catálogos Paramétricos

El sistema MUST desacoplar la parametrización de tipos y rarezas de cartas obteniéndolas de forma dinámica desde el backend (endpoints `/api/types` y `/api/rarities`) en lugar de usar constantes locales estáticas:
- Las llamadas a la API de tipos y rarezas MUST incluir la cabecera `Accept-Language` correspondiente al idioma actual de la aplicación (`i18n.language`).
- El servicio de API (`lookupService.js`) MUST cachear en memoria las promesas de las consultas según el idioma de la aplicación para evitar peticiones HTTP redundantes ante la navegación o reapertura de componentes.
- Si el idioma de la aplicación cambia (`i18n.language`), el sistema MUST invalidar la caché y re-ejecutar reactiva e inmediatamente las consultas a la API para refrescar los catálogos en todos los componentes activos en pantalla.
- Mientras la obtención asíncrona de tipos y rarezas esté en curso en el formulario (`useCardForm`), el flag `fetching` del formulario MUST permanecer en `true`.

#### Scenario: Carga dinámica y traducción exitosa en Filtros
- **GIVEN** un usuario autenticado en la página de inicio (`Home`).
- **WHEN** el componente se monta con idioma inglés activo.
- **THEN** el sistema MUST disparar la petición HTTP a `GET /api/types` y `GET /api/rarities` con cabecera `Accept-Language: en`.
- **AND** renderizar los filtros de tipo y rareza del buscador con las traducciones dinámicas correspondientes del backend (ej. "Creature", "Legendary").

#### Scenario: Cambio reactivo de idioma en filtros activos
- **GIVEN** el Home montado mostrando los filtros de búsqueda en español.
- **WHEN** el usuario cambia el idioma global de la aplicación a inglés (`i18n.language` cambia a 'en').
- **THEN** el sistema MUST invalidar la caché en memoria del `lookupService`.
- **AND** realizar inmediatamente nuevas peticiones a `/api/types` y `/api/rarities` en inglés.
- **AND** renderizar los filtros de búsqueda con los nombres localizados en inglés ("Creature", etc.).

#### Scenario: Uso de caché en memoria para múltiples componentes
- **GIVEN** que el Home ya cargó los tipos y rarezas en inglés desde la API.
- **WHEN** un administrador abre el formulario `CardFormModal` (alta o edición).
- **THEN** el `lookupService` MUST resolver los tipos y rarezas utilizando las promesas cacheadas en memoria.
- **AND** NOT realizar llamadas HTTP adicionales a los endpoints `/api/types` y `/api/rarities`.

## MODIFIED Requirements
None
