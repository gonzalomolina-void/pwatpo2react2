# 📋 Planificación del Proyecto: TCG Nexus

Este documento detalla la estrategia de desarrollo para la aplicación **TCG Nexus**, siguiendo los lineamientos del TP React Parte II 2026.

## 👥 Equipo y Roles
*   **Lautaro (PM / Scrum Master):** Coordinación, gestión del tablero Kanban, configuración de arquitectura base e internacionalización.
*   **Juan (Developer):** Implementación de servicios de API, Página de Inicio y Detalle de Cartas.
*   **Gonzalo (Developer):** Implementación de scroll infinito, gestión de favoritos y persistencia.

---

## 📝 User Stories (Historias de Usuario)

### US1: Configuración de Entorno y Layout Base
**Como** desarrollador, **quiero** tener la estructura del proyecto con Tailwind CSS y React Router configurada, **para** navegar entre las diferentes secciones de la app.
*   **Criterios de Aceptación:**
    *   Instalación de Tailwind CSS y `react-router-dom`.
    *   Creación de Header (sticky) con navegación y Footer.
    *   Configuración de rutas: `/` (Home), `/detalles/:id` (Detalle), `/favoritos` (Favoritos).

### US2: Soporte Multi-idioma (i18n)
**Como** usuario internacional, **quiero** poder cambiar el idioma de la aplicación entre Español e Inglés, **para** entender mejor el contenido.
*   **Criterios de Aceptación:**
    *   Implementación de `react-i18next`.
    *   Selector de idioma en el Header.
    *   Persistencia del idioma seleccionado en `localStorage`.

### US3: Catálogo de Cartas (Home)
**Como** jugador, **quiero** ver una grilla de cartas con su imagen, nombre y costo, **para** explorar la colección disponible.
*   **Criterios de Aceptación:**
    *   Consumo de `/items` desde MockAPI.
    *   Renderizado de tarjetas (cards) responsivas con Tailwind.
    *   Manejo de estados de carga.

### US4: Buscador de Cartas
**Como** jugador, **quiero** buscar cartas por nombre, **para** encontrar rápidamente una carta específica.
*   **Criterios de Aceptación:**
    *   Input de búsqueda en el Header o Home.
    *   Llamada al endpoint de filtrado de MockAPI.
    *   Mensaje de "No se encontraron resultados" si la búsqueda falla.

### US5: Scroll Infinito
**Como** usuario, **quiero** que se carguen más cartas automáticamente al scrollear hacia abajo, **para** tener una navegación fluida sin paginación manual.
*   **Criterios de Aceptación:**
    *   Uso de la paginación de MockAPI.
    *   Detección del final de página para disparar nuevas peticiones.

### US6: Detalle de la Carta
**Como** jugador, **quiero** ver toda la información de una carta (Lore, ATK/DEF, Artista) en alta resolución, **para** conocer sus estadísticas de juego.
*   **Criterios de Aceptación:**
    *   Petición a `/items/:id`.
    *   Manejo de error 404 si el ID no existe.
    *   Diseño detallado de la vista.

### US7: Gestión de Favoritos
**Como** coleccionista, **quiero** marcar cartas como favoritas, **para** tenerlas guardadas en mi lista personal.
*   **Criterios de Aceptación:**
    *   Botón de favorito en las cards y/o detalle.
    *   Persistencia en `localStorage`.
    *   Vista de `/favoritos` que consuma los datos guardados.

### US8: Creación de Cartas con IA (Gemini / Nano Banana)
**Como** creador de contenido, **quiero** generar nuevas cartas automáticamente usando IA, **para** expandir el universo del juego sin esfuerzo manual.
*   **Criterios de Aceptación:**
    *   Formulario simple para ingresar un "prompt" o temática.
    *   Integración con la API de Gemini (o Nano Banana) para obtener nombre, estadísticas y lore.
    *   Visualización previa de la carta generada.

### US9: Pipeline de Deployment vía GitHub Releases
**Como** desarrollador, **quiero** automatizar el despliegue a Vercel mediante GitHub Releases, **para** tener un control profesional del ciclo de vida de producción.
*   **Criterios de Aceptación:**
    *   Configuración de Secrets en GitHub (Vercel Token, Org ID, Project ID).
    *   Implementación de GitHub Action disparada por `release published`.
    *   Desactivación de builds automáticos en Vercel.

---

## 📊 Tabla de Asignación de Tareas

| ID | Tarea / User Story | Responsable | Estimación (Esfuerzo) |
|:---|:---|:---|:---|
| 0 | Gestión de Kanban y Seguimiento | **Lautaro** | Media (Constante) |
| 1 | Setup inicial, Router y Layout (US1) | **Lautaro** | Media |
| 2 | Configuración i18n y LocalStorage (US2) | **Lautaro** | Baja |
| 3 | Servicios de API (MockAPI) y Home (US3) | **Juan** | Alta |
| 4 | Buscador con filtrado de API (US4) | **Juan** | Media |
| 5 | Lógica de Scroll Infinito (US5) | **Gonzalo** | Alta |
| 6 | Página de Detalle y manejo de 404 (US6) | **Juan** | Media |
| 7 | Sistema de Favoritos y Persistencia (US7) | **Gonzalo** | Alta |
| 8 | Integración de IA para creación de cartas (US8) | **Juan** | Muy Alta |
| 9 | Pipeline de Deployment vía GitHub Releases (US9) | **Lautaro** | Media |
| 10 | Documentación Final (README) | **Lautaro** | Baja |

---

## 🛠️ Tecnologías a Utilizar
*   **Frontend:** React 18+, Vite.
*   **Estilos:** Tailwind CSS.
*   **Estado:** `useState`, `useEffect`.
*   **Navegación:** `react-router-dom`.
*   **Traducción:** `react-i18next`.
*   **Backend:** MockAPI.io.
