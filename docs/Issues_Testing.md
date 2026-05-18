# 🧪 Planificación de Issues: Testing Automático (HEXA)

Hola equipo, Juan toma el mando como **PM** para esta fase de testing. Vamos a fortalecer la estabilidad de **HEXA** implementando tests estratégicos siguiendo los requerimientos del TP de Programación Web Avanzada.

---

## 👥 Equipo y Roles (Fase Testing)
*   **Juan (PM / Lead Developer):** Configuración base, CI/CD, servicios de datos y coordinación.
*   **Lautaro (Developer):** Hooks personalizados, servicios de usuario y lógica de navegación.
*   **Gonzalo (Developer):** UI Components (reutilizables y complejos) y validación de interfaces.

---

## 📌 Issue 13: Configuración del Entorno de Testing y Documentación
**Responsable:** Juan

**Descripción:**
Establecer las bases del entorno de pruebas utilizando Vitest y React Testing Library, asegurando que se cumplan los scripts y configuraciones exigidas por la cátedra.

**Tareas:**
- [ ] Instalar dependencias: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- [ ] Configurar `vite.config.js` con el entorno `jsdom`.
- [ ] Crear `src/test/setup.js` para importar `@testing-library/jest-dom`.
- [ ] Configurar scripts en `package.json`:
    - `"test": "vitest"` (modo watch para desarrollo).
    - `"test:run": "vitest run"` (modo ejecución única para CI).
- [ ] **Bonus:** Configurar reporte de coverage (`vitest --coverage`).
- [ ] **Bonus:** Crear workflow `.github/workflows/unit-tests.yml` para validar PRs.
- [ ] Actualizar `README.md` con las librerías instaladas y guía de ejecución de tests.

---

## 📌 Issue 14: Unit Tests para Servicios de Datos y Persistencia
**Responsable:** Juan

**Descripción:**
Validar la capa de infraestructura y servicios de dominio. Es fundamental mockear las llamadas a la API y el almacenamiento local.

**Tareas:**
- [x] **storageService.js**: Probar métodos get/set/remove/clear mockeando `localStorage`.
- [x] **cardService.js**: Mockear `fetch` para validar obtención de cartas (getCards, getCardById) y manejo de errores (404, 500).
- [x] **preferencesService.js**: Validar persistencia de idioma y tema (interacción con storageService y sessionStorage).
- [x] **favoritesService.js**: Probar lógica de agregar/quitar/listar favoritos y persistencia.

---

## 📌 Issue 15: Unit Tests para Hooks y Utilidades de Lógica
**Responsable:** Lautaro

**Descripción:**
Garantizar que la lógica de negocio extraída en hooks y utilidades funcione correctamente de forma aislada.

**Tareas:**
- [ ] **useInfiniteCards.js**: 
    - Validar estados iniciales (loading, cards vacío).
    - Probar carga de datos exitosa y concatenación de páginas.
    - Validar manejo de errores y estado `hasMore`.
    - Probar lógica de filtrado local y búsqueda.
- [ ] **rarityConfig.js**: Validar que `getRarityConfig` devuelva los estilos correctos según la rareza (incluyendo fallback).

---

## 📌 Issue 16: Unit Tests para Componentes de Interfaz con Lógica
**Responsable:** Gonzalo

**Descripción:**
Testear componentes que manejan estado interno o interacciones complejas del usuario.

**Tareas:**
- [ ] **SearchBar.jsx**: Validar input, debounce/submit y limpieza de búsqueda.
- [ ] **CheckboxDropdown.jsx**: Probar apertura/cierre, selección de múltiples opciones y comunicación con el padre.
- [ ] **LanguageSelector.jsx**: Verificar que cambie el idioma en i18next al interactuar.
- [ ] **ThemeToggle.jsx**: Validar cambio de tema (claro/oscuro) y persistencia visual.
- [ ] **Modal.jsx**: Probar renderizado condicional, cierre al hacer clic fuera o en botón X.

---

## 📌 Issue 17: Unit Tests para Componentes Base y Reutilizables
**Responsable:** Gonzalo

**Descripción:**
Asegurar el correcto renderizado de los componentes más granulares de la UI.

**Tareas:**
- [ ] **Card.jsx**: Validar renderizado de datos de la carta, manejo de favoritos (botón) y navegación al detalle.
- [ ] **StatBadge.jsx**: Verificar renderizado de iconos y valores según el tipo de estadística.
- [ ] **Header.jsx / Footer.jsx**: Validar presencia de links y elementos clave del layout.
- [ ] **BackButton.jsx / LoadingSpinner.jsx**: Tests de humo y renderizado básico.
- [ ] **TeamMember.jsx / AcercaDe.jsx**: Validar renderizado de información estática/props.

---

## 📌 Issue 18: Unit Tests para Páginas y Flujos de Navegación
**Responsable:** Lautaro

**Descripción:**
Pruebas de integración ligera para las vistas principales de la aplicación, asegurando que los componentes colaboren correctamente.

**Tareas:**
- [ ] **Home.jsx**: Validar integración de SearchBar, filtros y lista de cartas con scroll infinito (mockeando el hook).
- [ ] **Detail.jsx**: Probar renderizado de carta específica, manejo de ID no existente (NotFound) y estado de carga.
- [ ] **Favorites.jsx**: Validar lista de favoritos y mensaje de "lista vacía".
- [ ] **SplashScreen.jsx**: Verificar que se oculte después del tiempo estipulado (timers).
- [ ] **NotFound.jsx**: Validar mensaje de error 404 y botón de retorno a Home.
