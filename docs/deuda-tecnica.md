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

### ⏳ Constantes de Dominio
*   **Archivo:** `src/pages/Home.jsx`
*   **Problema:** `TYPE_OPTIONS` y `RARITY_OPTIONS` siguen definidos localmente.
*   **Tarea Pendiente:** Mover a un archivo central (ej: `src/constants/game.js`) para uso compartido con la futura US8 (Creador de cartas).

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

### ⏳ Manejo de Entorno (Vite)
*   **Tarea Pendiente:** Crear un `.env.example` para guiar la configuración de futuras integración (IA/Cloudinary).

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
