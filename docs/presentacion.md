# 🎭 Guión de Presentación: HEXA

Este documento sirve como estructura para la defensa del proyecto ante la cátedra de Programación Web Avanzada (UNCOMA 2026).

---

## 🎙️ Parte 1: Visión General (Lautaro - PM)
**Lautaro:** "¡Hola! Bienvenidos a la presentación de **HEXA**. La idea surgió de la necesidad de tener una enciclopedia moderna y rápida para jugadores de TCG. No queríamos hacer una web estática, sino una experiencia que se sienta como una App nativa. 

Los principales features que definen a HEXA son:
1.  **Catálogo Dinámico:** Con búsqueda en tiempo real y filtros avanzados.
2.  **Creación de Imagenes con IA:** Integración con Gemini, inicialmente manual para que los desarrolladores creen las imagenes de las cartas usando nano banana.
3.  **Persistencia Total:** Favoritos e idiomas que sobreviven a la sesión.
4.  **UX Pulida:** Una interfaz oscura por defecto, rápida y con navegación sin recargas."

---

## 🛠️ Parte 2: El Corazón Tecnológico (Lautaro/Equipo)
**Lautaro:** "A nivel técnico, no nos quedamos en lo básico. Usamos **React 19** y **Tailwind CSS v4**, que es lo último que salió. Implementamos una arquitectura de **Capa de Servicios** para que la lógica de la API y el almacenamiento (`localStorage`/`sessionStorage`) esté separada de la UI.

Un desafío técnico que resolvimos y del que estamos orgullosos es el **FOUC (Flash of Unstyled Content)**. Evitamos que la pantalla parpadee al cargar el modo oscuro inyectando un script síncrono en el `<head>`, asegurando que la app nazca oscura si el usuario así lo prefirió."

---

## 🧑‍💻 Parte 3: Implementaciones Específicas

### 3.1. Desarrollo de UI y Funcionalidad Core (Juan)
**Juan:** "En mi caso, me enfoqué en los componentes de interacción compleja:
*   **SearchBar & CheckboxDropdown:** Desarrollé el motor de búsqueda y los filtros multiselección, asegurando que la UI sea intuitiva tanto en desktop como en mobile.
*   **Creación de Imagenes con IA:** Utilice Gemini (Nano Banana) para la generación de imágenes y lore de cartas mediante prompts escritos por Gemini.
*   **Details & 404:** Creé la vista de detalle, donde el usuario ve el lore y estadísticas, y la página 404 personalizada para mantener la inmersión incluso ante errores de ruta."

### 3.2. Gestión de Proyecto y Estado (Lautaro)
**Lautaro:** "Además de coordinar el equipo como PM usando un tablero Kanban e Issue tracking, trabajé en:
*   **Internacionalización (i18n):** Implementé el soporte bilingüe completo usando `react-i18next`, incluyendo el cambio dinámico del título de la pestaña.
*   **Sistema de Favoritos:** Creé la lógica de persistencia para que el usuario pueda armar su mazo ideal y consultarlo cuando quiera.
*   **Scroll Infinito (Lógica):** Desarrollé el hook `useInfiniteCards` para manejar la paginación automática mediante el `IntersectionObserver`."

### 3.3. Infraestructura y Performance (Gonzalo)
**Gonzalo:** "Mi foco estuvo en que la App vuele y sea accesible:
*   **Deployment:** Configuré todo el pipeline en **Vercel** y la optimización de assets a través de un CDN.
*   **Catálogo & API:** Implementé el servicio de cartas consumiendo MockAPI y asegurando el manejo de errores de red.
*   **Persistencia de Navegación:** Uno de los puntos más complejos fue la **Restauración de Scroll**. Logramos que si un usuario está viendo la carta número 50, entra al detalle y vuelve, la página lo deje exactamente donde estaba, gracias a una caché manual en memoria y el uso de `sessionStorage`."

---

## 🏁 Conclusión
**Lautaro:** "HEXA es el resultado de aplicar patrones de diseño sólidos, las últimas tecnologías de React y un foco obsesivo en la experiencia del usuario. ¡Muchas gracias!"
