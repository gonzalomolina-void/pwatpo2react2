# 🎴 HEXA: Presentación del Proyecto

## 📖 Introducción
**HEXA** es una enciclopedia interactiva y multilingüe diseñada para entusiastas de los juegos de cartas coleccionables. Desarrollada como una **Progressive Web App (PWA)** (aunque no se solicitaba de esta forma en el enunciado), la aplicación permite explorar un vasto catálogo de cartas, conocer su historia (lore), estadísticas de combate y gestionar una colección personal de favoritos con persistencia local.

---

## 🧭 Flujo de Navegación (User Experience)

### 1. Inmersión Inicial: Splash Screen
Al ingresar por primera vez en la sesión, el usuario es recibido por una **pantalla de presentación épica**. Esta pantalla utiliza imágenes generadas por IA y animaciones de entrada/salida para establecer la atmósfera de fantasía del juego.

### 2. Exploración Dinámica: Home (Catálogo)
La pantalla principal es el núcleo de la experiencia:
*   **Grilla Responsiva:** Las cartas se presentan en una grilla adaptable que varía desde 1 columna en mobile hasta 4 en pantallas grandes.
*   **Buscador con Debouncing:** Un motor de búsqueda que filtra por nombre en tiempo real, optimizado para no sobrecargar la API mientras el usuario escribe.
*   **Filtros Avanzados:** Permite filtrar por tipo (Criatura, Hechizo, Artefacto) y rareza (Pobre hasta Legendario).
*   **Scroll Infinito:** Implementado mediante `IntersectionObserver`, permitiendo una navegación fluida sin cortes por paginación manual.

### 3. Conocimiento Profundo: Vista de Detalle
Al seleccionar una carta, el usuario accede a toda su información técnica:
*   Estadísticas de **Ataque (ATK)** y **Defensa (DEF)** con insignias visuales.
*   **Lore e Historia:** Texto narrativo que expande el universo del juego.
*   **Gestión de Favoritos:** Posibilidad de marcar/desmarcar la carta desde el detalle.

### 4. Colección Personal: Mis Favoritos
Una sección dedicada donde el usuario puede visualizar exclusivamente las cartas que ha guardado. La lista persiste incluso después de cerrar el navegador.

---

## 🛠️ Detalles Técnicos y Arquitectura

### 🏗️ Stack Tecnológico
*   **Core:** React 19 + Vite (Aprovechando las últimas mejoras de renderizado y velocidad de build).
*   **Estilos:** **Tailwind CSS v4** utilizando variables CSS nativas y el nuevo motor de compilación para una UI ultraliviana.
*   **Navegación:** `react-router-dom` v7 para una SPA fluida.

### 🌎 Internacionalización (i18n)
El sistema es **completamente bilingüe** (Español/Inglés):
*   **Contexto Dinámico:** Uso de `react-i18next` para el cambio de idioma sin recargar la página.
*   **Metadatos Localizados:** El título de la pestaña del navegador (`document.title`) cambia dinámicamente según el idioma seleccionado.
*   **Persistencia:** El idioma elegido se guarda en `localStorage` para futuras visitas.

### 🧩 Patrones de Diseño y Refactorización
Se priorizó la calidad del código mediante:
*   **Custom Hooks:** Extracción de la lógica compleja de la Home hacia `useInfiniteCards.js`, separando la lógica de negocio de la interfaz.
*   **Servicios Desacoplados:** Capa de servicios (`cardService`, `storageService`, `favoritesService`, `preferencesService`) que abstrae las peticiones fetch y el acceso al almacenamiento.
*   **Documentación DX:** Implementación exhaustiva de **JSDoc** con `@typedef` para proveer tipado fuerte y autocompletado en un entorno JavaScript.
*   **React Portals:** Uso de portales para modales (Acerca De), garantizando que ignoren los contextos de apilamiento (z-index) del layout principal.

### ⚡ Performance y PWA
*   **Imagen Fallback:** Manejo de errores en carga de imágenes (`onError`) para mostrar portadas por defecto.
*   **Optimización de Assets:** Uso de formatos de última generación (`.webp`) y estrategia de hosting en Cloudinary.
*   **Manifest PWA:** Configuración de `manifest.json` para que la aplicación sea instalable y se comporte como una App nativa.

---
*Proyecto desarrollado para la cátedra de Programación Web Avanzada (PWA) - UNCOMA 2026.*
