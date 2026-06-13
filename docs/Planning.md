# 📋 Planificación del Proyecto: HEXA

Este documento detalla la estrategia de desarrollo para la aplicación **HEXA**, siguiendo los lineamientos del TP React Parte II 2026.

## 👥 Equipo y Roles
*   **Lautaro (PM / Scrum Master - Fase Inicial):** Coordinación, gestión del tablero Kanban, configuración de arquitectura base e internacionalización.
*   **Juan (PM / Lead Developer - Fase Testing):** Coordinación de la estrategia de pruebas unitarias y configuración del entorno de testeo.
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

### US7: Gestión de Favoritos Relacionados con el Usuario
**Como** jugador autenticado, **quiero** marcar cartas como favoritas, **para** tenerlas guardadas en la base de datos de mi cuenta.
*   **Criterios de Aceptación:**
    *   Botón de favorito en las cards y/o detalle.
    *   Consumo de los endpoints del backend (`POST /api/favorites`, `DELETE /api/favorites/:id`) enviando el token JWT.
    *   Vista de `/favoritos` que cargue los favoritos directamente de la base de datos a través de la API (`GET /api/favorites`).

### US8: Creación de Cartas con IA (Gemini / Nano Banana)
**Como** creador de contenido, **quiero** generar nuevas cartas automáticamente usando IA, **para** expandir el universo del juego sin esfuerzo manual.
*   **Criterios de Aceptación:**
    *   Formulario simple para ingresar un "prompt" o temática.
    *   Integración con la API de Gemini (o Nano Banana) para obtener nombre, estadísticas y lore.
    *   Visualización previa de la carta generada.
*   **Documentación Adicional:** Ver [Plan de Implementación: La Forja](./Forja_AI_Plan.md).

### US9: Pipeline de Deployment vía GitHub Releases
**Como** desarrollador, **quiero** automatizar el despliegue a Vercel mediante GitHub Releases, **para** tener un control profesional del ciclo de vida de producción.
*   **Criterios de Aceptación:**
    *   Configuración de Secrets en GitHub (Vercel Token, Org ID, Project ID).
    *   Implementación de GitHub Action disparada por `release published`.
    *   Desactivación de builds automáticos en Vercel.

### US10: Pantalla de Login / Registro y Gestión de Sesión (JWT)
**Como** usuario, **quiero** registrarme e iniciar sesión en la aplicación, **para** acceder a mis favoritos de manera personalizada.
*   **Criterios de Aceptación:**
    *   Formulario visual de Login y Registro con validaciones en los inputs.
    *   Guardar el token JWT devuelto por el backend en `localStorage` o cookies al iniciar sesión.
    *   Enviar el JWT en la cabecera `Authorization: Bearer <token>` para todas las llamadas protegidas (ej. favoritos).
    *   Header con botón de "Cerrar Sesión" e información del usuario autenticado.

### US11: Adaptación de i18n y Aplanamiento en llamadas a la API
**Como** desarrollador, **quiero** adaptar el cliente y los componentes para que envíen el idioma al backend y usen propiedades planas, **para** reducir el procesamiento en el cliente y simplificar la lógica de traducción.
*   **Criterios de Aceptación:**
    *   Configurar `cardService.js` para enviar el idioma actual de la aplicación (`react-i18next`) a través de la cabecera `Accept-Language` o parámetro `lang`.
    *   Adaptar [Card.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/Card.jsx) y [Detail.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Detail.jsx) para leer propiedades directas (`name`, `description`, `type`, `rarity`) y quitar claves dinámicas como `nameEs` / `nameEn`.
    *   Actualizar los mocks y aserciones de la suite de tests unitarios que se vean afectados por el cambio de estructura plana.

### US12: Control de Acceso basado en Roles en el Cliente (Frontend)
**Como** usuario autenticado, **quiero** que la aplicación oculte o deshabilite las opciones administrativas si no tengo el rol de `admin`, **para** evitar errores de permisos al interactuar con la interfaz.
*   **Criterios de Aceptación:**
    *   Decodificar el token JWT al iniciar sesión para extraer el campo `role` del usuario.
    *   Ocultar o deshabilitar elementos del frontend para crear cartas (como la Forja o botones de edición) si el usuario no tiene rol `admin`.
    *   Implementar un componente de ruta protegida (`ProtectedRoute`) en React Router que limite el acceso a vistas administrativas únicamente a usuarios con rol `admin`.
    *   Redirigir a los usuarios comunes a una ruta no autorizada o al Home si intentan ingresar directamente por URL a una sección de administrador.

### US13: Renovación de Sesión con Refresh Token en el Frontend
**Como** usuario, **quiero** que mi sesión se mantenga activa y funcional sin interrupciones molestas mientras la app esté abierta, **para** mejorar mi experiencia de navegación.
*   **Criterios de Aceptación:**
    *   Almacenar el Refresh Token de forma segura en el cliente (o usar el manejo automático del navegador si el backend lo setea vía cookie `httpOnly`).
    *   Configurar un interceptor en el cliente HTTP (como Axios) para capturar errores de tipo `401 Unauthorized`.
    *   Cuando ocurra un `401` por token expirado, el interceptor debe realizar una solicitud a `POST /api/auth/refresh` en segundo plano para obtener un nuevo Access Token y reintentar la petición original.
    *   Si el refresco falla, se debe desloguear al usuario automáticamente, limpiando el almacenamiento y redirigiéndolo al Login con un mensaje informativo de sesión expirada.

### US15: Flujo de Autenticación y Securización de Cartas (Full-stack)
**Como** administrador y desarrollador, **quiero** que el usuario deba loguearse obligatoriamente para ver las cartas y que la API del backend proteja esos endpoints, **para** garantizar la seguridad del catálogo y un flujo de navegación consistente.
*   **Criterios de Aceptación:**
    *   **Frontend:**
        *   Luego de que la pantalla Splash finalice, el usuario debe ser redirigido a `/login` si no está autenticado, en lugar de ingresar directo a `/` (Home).
        *   Al ejecutar la acción de "Cerrar Sesión" (Logout), la aplicación debe redirigir inmediatamente a `/login`.
        *   Si un usuario no autenticado intenta ingresar manualmente a rutas protegidas (como `/` o `/favoritos`), debe ser redirigido a `/login`.
    *   **Backend:**
        *   Las rutas GET `/api/cards` y GET `/api/cards/:id` deben ser securizadas con el middleware `requireAuth`, rechazando peticiones sin token JWT válido con un error `401 Unauthorized`.

---

## 📊 Tabla de Asignación de Tareas

| ID | Tarea / User Story | Responsable | Estimación (Esfuerzo) |
|:---|:---|:---|:---|
| 0 | Gestión de Kanban y Seguimiento | **Lautaro** | Media (Constante) |
| 1 | Setup inicial, Router y Layout (US1) | **Lautaro** | Media |
| 2 | Configuración i18n y LocalStorage (US2) | **Lautaro** | Baja |
| 3 | Servicios de API y Home (US3) | **Juan** | Alta |
| 4 | Buscador con filtrado de API (US4) | **Juan** | Media |
| 5 | Lógica de Scroll Infinito (US5) | **Gonzalo** | Alta |
| 6 | Página de Detalle y manejo de 404 (US6) | **Juan** | Media |
| 7 | Favoritos vinculados al Backend con JWT (US7) | **Gonzalo** | Alta |
| 8 | Integración de IA para creación de cartas (US8) | **Juan** | Muy Alta |
| 9 | Pipeline de Deployment vía GitHub Releases (US9) | **Lautaro** | Media |
| 10 | Pantalla de Login/Registro y Autenticación JWT (US10) | **Gonzalo** | Alta |
| 11 | Adaptación de i18n y Aplanamiento de API (US11) | **Lautaro** | Media |
| 12 | Control de Acceso por Roles (US12) | **Gonzalo** | Media |
| 13 | Interceptor HTTP y Renovación de Token (US13) | **Gonzalo** | Alta |
| 14 | Documentación Final (README) | **Lautaro** | Baja |
| 15 | Flujo Auth y Seguridad de Cartas (US15) | **Gonzalo & Juan** | Media |

---

## 🛠️ Tecnologías a Utilizar
*   **Frontend:** React 18+, Vite.
*   **Estilos:** Tailwind CSS.
*   **Estado:** `useState`, `useEffect`.
*   **Navegación:** `react-router-dom`.
*   **Traducción:** `react-i18next`.
*   **Backend:** Node.js, Express, Prisma, PostgreSQL (reemplazando MockAPI.io).
