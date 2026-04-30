# Base Cards Schema

Este documento describe la estructura base de las cartas en el proyecto TCG Nexus tras la refactorización de abril de 2026.

## Estructura del Objeto Carta

Cada carta en `docs/merged_cards.json` sigue este esquema:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | string | Identificador único de la carta. |
| `cost` | number | Costo de maná/energía para jugar la carta. |
| `atk` | number | Puntos de ataque. |
| `def` | number | Puntos de defensa. |
| `media` | object | Contenedor de assets multimedia. |
| `media.image` | string | Nombre del archivo de imagen en `public/cards/`. |
| `nameEs` | string | Nombre en español. |
| `nameEn` | string | Nombre en inglés. |
| `typeEs` | string | Tipo de carta en español (Criatura, Hechizo, Artefacto). |
| `typeEn` | string | Tipo de carta en inglés (Creature, Spell, Artifact). |
| `rarityEs` | string | Rareza en español. |
| `rarityEn` | string | Rareza en inglés. |
| `descriptionEs` | string | Descripción/Efecto en español. |
| `descriptionEn` | string | Descripción/Efecto en inglés. |

## Razones del Cambio
1. **Acceso Directo:** Facilita el filtrado y la búsqueda sin necesidad de navegar por sub-objetos de idioma.
2. **Consistencia:** Alinea el esquema con patrones de consumo de API más planos.
3. **Escalabilidad de Media:** El objeto `media` permite añadir futuros campos como `video`, `audio` o `thumbnail` sin romper la raíz del objeto.
