# Design: us-16-i18n-remote

## Technical Approach
La estrategia consiste en agregar la propiedad `i18n.language` al arreglo de dependencias del hook `useEffect` encargado de obtener la información de la carta en `Detail.jsx`. Esto asegura que cualquier cambio en el idioma actual de la aplicación invalide el efecto anterior, cancele la petición en vuelo (mediante `AbortController`) y dispare una nueva llamada asíncrona enviando el locale correcto al backend a través de `cardService.getCardById`.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **React Dependency Array** | Sencillo y declarativo. Acoplado al ciclo de vida de React. | **Elegida**: Es la práctica idiomática de React para variables reactivas de las que depende un efecto. |
| **i18next Event Listener** | Más control imperativo. Requiere registrar/limpiar listeners manuales (riesgo de memory leaks). | **Rechazada**: Introduce complejidad innecesaria. |

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Mock estático de i18n** | Fácil de configurar pero no permite simular cambios de idioma reactivos en tests unitarios. | **Rechazada**: Impediría probar la recarga en el cambio de idioma. |
| **Mock dinámico con Shared Ref** | Requiere declarar un objeto mutable (`mockLanguage.value`) usando `vi.hoisted`. | **Elegida**: Permite mutar el idioma dentro de los tests y disparar rerenders con `rerender`. |

## Data Flow
```
[Header/LanguageSelector] ──(cambio de idioma)──> [i18n.language]
                                                        │ (actualización)
                                                        ▼
[Detail Component] <────(useEffect reactivo)─────────── [Rerender]
        │
        ├── (1. Aborta llamada previa via controller.abort())
        └── (2. Invoca cardService.getCardById(id)) ──(Accept-Language Header)──> [API Backend]
                                                                                        │
                                                  [Renderiza Carta con Lore traducido] <┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Detail.jsx` | Modify | Incorporar `i18n.language` en la lista de dependencias del `useEffect` de carga. |
| `src/pages/Detail.test.jsx` | Modify | Refactorizar mock de `react-i18next` para usar `mockLanguage.value` y añadir la prueba de recarga reactiva. |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Reactividad al cambio de idioma | Mutar `mockLanguage.value = 'en'`, aplicar `rerender` en el componente y comprobar que `getCardById` se invoca por segunda vez. |

## Migration / Rollout
No migration required.

## Open Questions
None.
