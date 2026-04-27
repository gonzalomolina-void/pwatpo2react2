# 🛠️ Registro de Deuda Técnica - TCG Nexus

Este documento centraliza las mejoras pendientes, refactorizaciones y "magic strings" identificados que deben ser resueltos para mantener la calidad y escalabilidad del proyecto.

## 1. Magic Strings y Constantes de Dominio

### Hallazgo: Opciones de Filtrado en `Home.jsx`
*   **Archivo:** `src/pages/Home.jsx`
*   **Problema:** Las constantes `TYPE_OPTIONS` y `RARITY_OPTIONS` están definidas localmente en la página.
*   **Impacto:** Si se necesitan estos valores en la vista de detalle o en el creador de cartas por IA (US8), habrá duplicación de código.
*   **Tarea Pendiente:** Mover a `src/config/constants.js` o `src/constants/domain.js`.

### Hallazgo: Mensajes de Interfaz Hardcodeados
*   **Archivo:** `src/pages/Home.jsx`
*   **Problema:** Mensajes como `"Invocando criaturas del Nexo..."`, `"Buscando..."` y mensajes de error están escritos directamente en el JSX o en el estado.
*   **Tarea Pendiente:** Migrar estos strings a los archivos de traducción (`es.json` / `en.json`) durante la implementación de la **US2 (i18n)**.

## 2. Arquitectura de Servicios

### Hallazgo: Centralización de Preferencias (Completado ✅)
*   **Acción:** Se creó `preferencesService.js` para abstraer el uso de `localStorage` y `sessionStorage`.
*   **Nota:** Mantener este patrón para cualquier nueva configuración de UI que se agregue (ej: temas, filtros persistentes).

## 3. Próximos Refactors Sugeridos
*   **Validación de IDs:** En `cardService.js`, mejorar la validación de los IDs antes de realizar el fetch.
*   **Tipado (JSDoc):** Agregar documentación de tipos a los retornos de los servicios para mejorar el autocompletado en los componentes.

## 4. Optimización de Repositorio (Git)

### Hallazgo: Historial Pesado por Assets Originales
*   **Problema:** Se subieron 78MB de imágenes Splash originales a la rama `develop` antes de implementar la estrategia de optimización.
*   **Impacto:** El historial de Git retiene ese peso, haciendo que los clones del repositorio sean más lentos.
*   **Decisión Temporal:** Se pospone la reescritura del historial (usando herramientas como `git filter-repo` o `BFG`) para evitar conflictos de merge críticos con el equipo durante el desarrollo del TP.
*   **Tarea Pendiente:** Evaluar la limpieza profunda del historial antes de la entrega final o al cierre del cuatrimestre.

---
*Última actualización: Abril 2026*
