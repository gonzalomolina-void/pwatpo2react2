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
- **GIVEN** un usuario autenticado visualizando el detalle de la carta "card-1" en español.
- **WHEN** el usuario cambia a inglés y, antes de completar la carga, cambia a español nuevamente de forma inmediata.
- **THEN** el sistema MUST abortar la petición intermedia de inglés usando la señal de `AbortController`.
- **AND** realizar la última petición en español.
- **AND** renderizar el componente final únicamente con los datos en español tras finalizar su carga.
