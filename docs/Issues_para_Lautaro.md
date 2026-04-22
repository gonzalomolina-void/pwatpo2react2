# 📩 Issues para Crear en GitHub (TCG Nexus)

Hola Lau, acá tenés la lista de issues para que los vayas creando en el repo. Acordate de darle a **"New Issue"**, pegar el título y después el contenido del bloque de código en la descripción. ¡Con esto el tablero Kanban queda de 10!

---

## 📌 Issue 1: Configuración de Entorno y Layout Base (US1)
**Responsable sugerido:** Lautaro (PM)

**Contenido para la descripción:**
```markdown
### User Story
Como desarrollador, quiero tener la estructura del proyecto con Tailwind CSS y React Router configurada, para navegar entre las diferentes secciones de la app.

### Criterios de Aceptación:
- [ ] Instalación de Tailwind CSS y `react-router-dom`.
- [ ] Creación de componentes Header (sticky) y Footer.
- [ ] Configuración de rutas básicas: `/` (Home), `/detalles/:id` (Detalle), `/favoritos` (Favoritos).
```

---

## 📌 Issue 2: Soporte Multi-idioma i18n (US2)
**Responsable sugerido:** Lautaro (PM)

**Contenido para la descripción:**
```markdown
### User Story
Como usuario internacional, quiero poder cambiar el idioma de la aplicación entre Español e Inglés, para entender mejor el contenido.

### Criterios de Aceptación:
- [ ] Implementación de `react-i18next`.
- [ ] Selector de idioma en el Header.
- [ ] Persistencia de la preferencia de idioma en `localStorage`.
```

---

## 📌 Issue 3: Catálogo de Cartas y Servicios API (US3)
**Responsable sugerido:** Juan (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como jugador, quiero ver una grilla de cartas con su imagen, nombre y costo, para explorar la colección disponible.

### Criterios de Aceptación:
- [ ] Configuración de servicios Fetch para MockAPI.
- [ ] Renderizado de tarjetas (cards) responsivas con Tailwind.
- [ ] Manejo de estados de carga (Loading/Error).
```

---

## 📌 Issue 4: Buscador de Cartas con filtrado (US4)
**Responsable sugerido:** Juan (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como jugador, quiero buscar cartas por nombre, para encontrar rápidamente una carta específica.

### Criterios de Aceptación:
- [ ] Input de búsqueda funcional en el Header/Home.
- [ ] Llamada al endpoint de filtrado de MockAPI (search).
- [ ] Mensaje de "No se encontraron resultados" si no hay coincidencias.
```

---

## 📌 Issue 5: Lógica de Scroll Infinito (US5)
**Responsable sugerido:** Gonzalo (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como usuario, quiero que se carguen más cartas automáticamente al scrollear hacia abajo, para tener una navegación fluida sin paginación manual.

### Criterios de Aceptación:
- [ ] Implementar paginación con los parámetros de MockAPI.
- [ ] Detección automática del final de página para cargar el siguiente set de datos.
```

---

## 📌 Issue 6: Página de Detalle y manejo de 404 (US6)
**Responsable sugerido:** Juan (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como jugador, quiero ver toda la información de una carta en alta resolución, para conocer sus estadísticas de juego.

### Criterios de Aceptación:
- [ ] Obtener ID desde la URL (`params`).
- [ ] Mostrar Lore, ATK/DEF, Artista y edición.
- [ ] Redirección a página de error 404 si el ID no existe en la API.
```

---

## 📌 Issue 7: Sistema de Favoritos y Persistencia (US7)
**Responsable sugerido:** Gonzalo (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como coleccionista, quiero marcar cartas como favoritas, para tenerlas guardadas en mi lista personal.

### Criterios de Aceptación:
- [ ] Botón/Ícono de favorito funcional en cards y vista de detalle.
- [ ] Persistencia de la lista de favoritos en `localStorage`.
- [ ] Vista `/favoritos` que muestre solo los elementos guardados.
```

---

## 📌 Issue 8: Integración de IA para creación de cartas (US8)
**Responsable sugerido:** Juan (Developer)

**Contenido para la descripción:**
```markdown
### User Story
Como creador de contenido, quiero generar nuevas cartas automáticamente usando IA, para expandir el universo del juego sin esfuerzo manual.

### Criterios de Aceptación:
- [ ] Formulario de prompt para ingresar temática de la carta.
- [ ] Conexión con API de Gemini/Nano Banana.
- [ ] Previsualización de la carta generada (Nombre, Lore, Stats).
```
