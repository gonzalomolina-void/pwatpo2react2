# HEXA - Contexto del Proyecto

Este repositorio contiene el desarrollo de **HEXA**, una enciclopedia interactiva y multilingüe de cartas para un juego de cartas coleccionables (TCG). Es un proyecto desarrollado para la cátedra de PWA de la UNCOMA (TP React Parte II 2026).

## ᚥ Project Overview
- **Propósito:** Catálogo interactivo con búsqueda, scroll infinito, sistema de favoritos y generación de cartas mediante IA.
- **Tecnologías:**
  - **Core:** React 19, Vite 8.
  - **Estilos:** Tailwind CSS v4 (configurado mediante `@tailwindcss/postcss`).
  - **Navegación:** `react-router-dom` v7.
  - **Internacionalización:** `react-i18next`.
  - **Backend:** MockAPI.io.
  - **IA:** Integración con Gemini / Nano Banana (Pendiente US8).

## 🛠️ Arquitectura y Convenciones
- **Estructura de Carpetas:**
  - `src/components/`: Componentes reutilizables (Header, Footer, Cards).
  - `src/pages/`: Páginas de la aplicación (Home, Detail, Favorites).
  - `docs/`: Documentación del proyecto, planificación y arte conceptual.
  - `public/`: Assets estáticos.
- **Estilos:** Se utiliza Tailwind CSS para todo el estilado. El archivo base es `src/index.css` con las directivas de `@import "tailwindcss"`.
- **Navegación:** Configurada en `src/App.jsx` utilizando `BrowserRouter`.
- **Estado:** Se prioriza el uso de hooks nativos (`useState`, `useEffect`, `useParams`).
- **Workflow:** Todo feature o cambio debe realizarse en una **branch separada** para mantener el control de los cambios y la estabilidad de la rama principal.

## 📜 Comandos Clave
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera el build de producción.
- `npm run lint`: Ejecuta el linter (ESLint).

## 📚 Documentación de Referencia
- `docs/Planning.md`: Planificación detallada, roles y User Stories.
- `docs/hexa.md`: Descripción del dominio y funcionalidades principales.
- `docs/Issues_para_Lautaro.md`: Lista de issues para el tablero Kanban.
- `docs/TP React parte 2 2026.pdf`: Enunciado oficial del trabajo práctico.

## ✅ Estado Actual (Abril 2026)
- **Completado:**
  - US1 (Configuración de Entorno y Layout Base).
  - US2 (Soporte Multi-idioma i18n).
  - US3 (Catálogo de Cartas y Servicios API).
  - US4 (Buscador con Filtrado).
  - US5 (Scroll Infinito).
  - US6 (Página de Detalle y manejo de 404).
  - US7 (Sistema de Favoritos y Persistencia).
  - US10 (Splash Screen de Carga).
  - US11 (Loading Spinner Temático).
- **En Proceso:**
  - US8 (Integración de IA para creación de cartas): Infraestructura, UI y previsualización mockeada listas. Ver [Plan de Forja](./docs/Forja_AI_Plan.md) para la integración real.

## ᚥ Notas para el Agente
- El proyecto utiliza Dark Mode por defecto (`bg-slate-900`, `text-slate-100`).
- Al realizar cambios en los estilos, verificar que `src/index.css` mantenga el `@import "tailwindcss"`.
- Los issues de GitHub ya están mapeados y actualizados según `docs/Issues_para_Lautaro.md`.
- El nombre del proyecto ha sido cambiado de TCG Nexus a **HEXA** (Abril 2026).
- La funcionalidad de **Forja** se encuentra en `/forja`.
