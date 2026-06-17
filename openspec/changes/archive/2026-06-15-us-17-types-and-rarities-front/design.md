# Design: us-17-types-and-rarities-front

## Technical Approach
Implementar un servicio centralizado `lookupService.js` que encapsule las llamadas HTTP a `/api/types` y `/api/rarities` utilizando `apiClient` para inyectar de forma transparente las cabeceras de autorización e i18n. El servicio implementará una caché en memoria para las promesas de carga para evitar peticiones duplicadas. Los componentes React (`Home` y `CardFormModal` a través de `useCardForm`) consumirán el servicio de manera asíncrona reaccionando de forma natural a los cambios del idioma actual (`i18n.language`).

## Architecture Decisions

| Decision | Tradeoffs | Rationale |
|----------|-----------|-----------|
| **Caché en memoria en el Servicio** | + Simplicidad y modularidad.<br>- La caché vive solo en el ciclo de vida de la aplicación. | Evita peticiones repetitivas ante cierres/aperturas del modal y cambios de vista, sin la sobrecarga de un estado global o local complejo. |
| **Suscripción Reactiva vía `useTranslation`** | + Idiomático en React.<br>- Re-renderiza el componente ante cambios de idioma. | `useTranslation` de `react-i18next` gatilla una re-renderización automática cuando cambia el idioma, lo que permite que los `useEffect` que dependen de `i18n.language` gatillen la recarga de lookups de forma limpia y automática. |

## Data Flow
```
[Header i18n Change] ──→ Re-render [Home / CardFormModal]
                             │
                             ▼
                        useEffect() (dependencies: i18n.language)
                             │
                             ▼
                     lookupService.getTypes() / getRarities()
                             │
            ┌────────────────┴────────────────┐
            ▼ (Caché hit para lng)            ▼ (Caché miss)
      [Resolve Promise]                 apiClient.get() ──→ API
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/lookupService.js` | Create | Nuevo servicio para cargar y cachear tipos y rarezas. |
| `src/hooks/useCardForm.js` | Modify | Reemplazar las constantes de tipos/rarezas por llamadas asíncronas a `lookupService`. |
| `src/pages/Home.jsx` | Modify | Reemplazar constantes de filtro por estados asíncronos alimentados de `lookupService`. |
| `src/constants/cardConstants.js` | Delete | Remover constantes obsoletas. |
| `src/constants/game.js` | Modify | Limpiar arrays obsoletos de tipo y rareza. |
| `src/hooks/useCardForm.test.js` | Modify | Mockear `lookupService` para asegurar aislamiento de pruebas. |
| `src/pages/Home.test.jsx` | Modify | Mockear `lookupService` en pruebas de integración de filtros de Home. |

## Interfaces / Contracts

```javascript
// src/services/lookupService.js
export const lookupService = {
  /**
   * Obtiene la lista de tipos de cartas desde la API localizados en el idioma activo.
   * @returns {Promise<Array<{id: number, code: string, name: string, labelKey: string}>>}
   */
  getTypes: async () => {},

  /**
   * Obtiene la lista de rarezas de cartas desde la API localizadas en el idioma activo.
   * @returns {Promise<Array<{id: number, code: string, name: string, labelKey: string}>>}
   */
  getRarities: async () => {},

  /**
   * Invalida la caché del servicio.
   */
  clearCache: () => {}
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `lookupService` caching & dynamic fetch | Testear que la primera llamada llame al cliente API, las subsiguientes resuelvan de caché, e invalide al borrar caché. |
| Unit | `useCardForm` dynamic options | Simular resolución de promesas en `useCardForm` y verificar que mapee correctamente los IDs. |
| Integration | `Home` filter rendering | Montar `Home` mockeando el servicio de lookups y verificar que renderice las opciones de tipo/rareza dinámicas devueltas. |

## Migration / Rollout
No migration required. Las APIs del backend ya son la fuente de verdad. Se remueven las constantes locales para evitar código muerto.

## Open Questions
None.
