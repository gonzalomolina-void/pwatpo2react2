# Especificación de Requerimientos: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

## 1. Requerimientos Funcionales
El sistema debe ocultar o mostrar las opciones de administración (creación, edición y borrado de cartas) según el rol decodificado del JWT del usuario. Además, proveerá un modal de edición/alta que permita cargar las traducciones y configuraciones lingüísticas completas, y restringirá las rutas administrativas a nivel de React Router.

## 2. Escenarios de Aceptación (Gherkin/TDD)

### Escenario 1: Visibilidad de botones administrativos para administradores
- **Given** Un usuario autenticado con rol `admin`.
- **When** El usuario navega al Home (`/`).
- **Then** Se debe mostrar el botón de "Nueva Carta" sobre el catálogo.
- **And** Cada tarjeta de carta (`Card.jsx`) debe mostrar el botón de edición (tres puntitos o lápiz).

### Escenario 2: Ocultación de botones administrativos para usuarios comunes
- **Given** Un usuario autenticado con rol `usuario`.
- **When** El usuario navega al Home (`/`).
- **Then** NO se debe mostrar el botón de "Nueva Carta".
- **And** Ninguna tarjeta de carta (`Card.jsx`) debe mostrar el botón de edición.

### Escenario 3: Restricción de rutas de administración (ProtectedRoute)
- **Given** Un usuario autenticado con rol `usuario`.
- **When** El usuario intenta ingresar manualmente por URL a una ruta administrativa (ej: `/forja`).
- **Then** El sistema debe bloquear el acceso y redirigir al usuario al Home (`/`).

### Escenario 4: Visualización y precarga del modal de edición
- **Given** El administrador hace clic en el botón de edición de la carta con ID `1`.
- **When** Se abre el modal de edición.
- **Then** Se debe disparar un fetch a `/api/cards/1/edit`.
- **And** Se deben precargar los campos globales (`cost`, `atk`, `def`, `image`) en el formulario vertical.
- **And** Se deben precargar los campos localizados (`name`, `description`, `type`, `rarity`) en la tabla de traducciones, mapeando las claves `typeCode` y `rarityCode` a las filas correspondientes de cada idioma (`es` y `en`).

### Escenario 5: Guardado exitoso de edición
- **Given** El administrador modifica campos en el modal de edición.
- **When** El usuario hace clic en el botón "Guardar".
- **Then** Se debe realizar la petición `PUT /api/cards/:id` enviando los datos y el token JWT en la cabecera.
- **And** Se debe mostrar un toast de éxito en el idioma activo de `react-i18next`.
- **And** Se debe cerrar el modal.
- **And** Se debe resetear la lista del catálogo en el Home a la página 1 para reflejar los cambios.

### Escenario 6: Borrado de carta con confirmación
- **Given** El modal de edición abierto.
- **When** El administrador hace clic en el botón "Eliminar".
- **Then** Se debe abrir un modal de confirmación secundario.
- **When** El administrador confirma el borrado en el modal secundario.
- **Then** Se debe realizar la petición `DELETE /api/cards/:id` con el token JWT.
- **And** Se debe mostrar un toast de éxito en el idioma activo.
- **And** Se deben cerrar ambos modales.
- **And** Se debe resetear la lista del catálogo en el Home a la página 1.
