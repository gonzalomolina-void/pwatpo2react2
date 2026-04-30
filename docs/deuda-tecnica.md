# 🛠️ Registro de Deuda Técnica - HEXA

## 1. Arquitectura y DX (Developer Experience)

### ✅ Documentación de Servicios (Completado)
*   **Acción:** Se implementó JSDoc y `@typedef` en `cardService.js` y `favoritesService.js`.
*   **Resultado:** Autocompletado inteligente y mejor documentación de la estructura de datos.

### ✅ Refactor de "Fat Components" (Completado)
*   **Acción:** Se extrajo la lógica de `Home.jsx` al hook personalizado `useInfiniteCards.js`.
*   **Resultado:** Separación clara de incumbencias (Separation of Concerns) y componente Home puramente representativo.

### ✅ Aislamiento de Infraestructura (Completado)
*   **Acción:** Creación de `preferencesService.js` para centralizar el acceso a `localStorage` y `sessionStorage`.
*   **Resultado:** Se oculta la implementación del almacenamiento (Infrastructure) al resto de la aplicación (Domain/UI).

### ✅ Constantes de Dominio (Completado)
*   **Acción:** Se crearon las constantes en `src/constants/game.js` y se refactorizó `Home.jsx` para consumirlas.
*   **Resultado:** Código más mantenible y reutilizable para la futura US8.

### 🚀 Escalabilidad del Estado
*   **Contexto:** El sistema de favoritos usa `useState` y prop drilling/contexto simple.
*   **Tarea Pendiente:** Evaluar el uso de un Store (Zustand o Redux Toolkit) si la complejidad del usuario (mazos, inventario) crece en la Parte 3 del TP.

## 2. Internacionalización y UI (Completado ✅)

### ✅ Mensajes y Metadatos Localizados
*   **Acción:** Se sincronizaron las claves entre `es.json` y `en.json`.
*   **Acción:** Se implementó la actualización dinámica de `document.title` en `App.jsx`.
*   **Acción:** Localizados tooltips y aria-labels en `ThemeToggle.jsx` y `Header.jsx`.

## 3. PWA y Despliegue

### ✅ Configuración Base PWA (Completado)
*   **Acción:** Creación de `manifest.json` y vinculación en `index.html`.
*   **Tarea Pendiente:** Implementar un Service Worker (vía Vite PWA Plugin) para soporte offline real de las cartas ya cacheadas.

### ✅ Manejo de Entorno (Vite) (Completado)
*   **Acción:** Se creó el archivo `.env.example` con las variables necesarias para IA y Cloudinary.

## 4. Calidad y Testing

### ⏳ Cobertura de Tests
*   **Estado:** Crítico/Pendiente.
*   **Tarea Pendiente:** Configurar Vitest y React Testing Library. Priorizar testing de hooks personalizados (`useInfiniteCards`) y servicios.

## 5. Optimización de Repositorio (Git)

### ⏳ Historial Pesado por Assets Originales
*   **Problema:** El repo retiene ~80MB de assets no optimizados en el historial.
*   **Tarea Pendiente:** Ejecutar limpieza con `BFG Repo-Cleaner` antes del cierre del cuatrimestre.

---
*Última actualización: Abril 2026 - Sesión de Cierre Tech Lead/QA*
