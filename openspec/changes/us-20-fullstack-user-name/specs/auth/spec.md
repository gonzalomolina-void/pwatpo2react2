# Spec: Auth Name Personalization

## 1. Requirement: Registro con Nombre Obligatorio (Backend)

El sistema de autenticación del backend MUST requerir un campo `name` durante el registro de nuevos usuarios, realizando las validaciones de tipo, longitud y traducción de errores según el idioma:
- El campo `name` es requerido y no debe estar vacío.
- Debe ser de tipo string con un largo entre 2 y 50 caracteres.
- Si falla la validación, la API del backend MUST retornar un código `400 Bad Request` junto con el detalle del error traducido según el idioma activo (`Accept-Language`).

### Scenario: Registro exitoso con nombre completo
- **GIVEN** un cliente realizando una petición POST a `/api/auth/register` en español.
- **WHEN** envía los datos `{ "email": "nuevo@test.com", "name": "Gonzalo Molina", "password": "password123" }`.
- **THEN** la API del backend MUST retornar un código `201 Created`.
- **AND** devolver el objeto del usuario creado conteniendo `"name": "Gonzalo Molina"` y excluyendo la contraseña.

### Scenario: Registro fallido por nombre ausente o vacío
- **GIVEN** un cliente realizando una petición POST a `/api/auth/register` en español.
- **WHEN** envía los datos `{ "email": "nuevo@test.com", "password": "password123" }` o `{ "email": "nuevo@test.com", "name": "   ", "password": "password123" }`.
- **THEN** la API del backend MUST retornar un código `400 Bad Request`.
- **AND** incluir en los detalles de error un mensaje indicando que el nombre es requerido en español.

---

## 2. Requirement: Personalización del Perfil en la Cabecera (Frontend)

El cliente del frontend MUST registrar al usuario enviando su nombre, y mostrarlo en lugar del correo electrónico en la cabecera tanto en pantallas de escritorio como en dispositivos móviles:
- El formulario de registro en la interfaz de usuario MUST incluir el campo de entrada "Nombre".
- Al iniciar sesión con éxito o recuperar el perfil (`/me`), el objeto de sesión del contexto `AuthContext` MUST exponer el campo `name`.
- La cabecera (`Header.jsx`) MUST renderizar el valor de `user.name` si está presente.
- Si por alguna razón el nombre del usuario es nulo o vacío, el sistema MUST utilizar el correo electrónico (`user.email`) como fallback.

### Scenario: Renderizado del nombre en Header de Desktop
- **GIVEN** un usuario autenticado con datos `{ "email": "gonzalo@test.com", "name": "Gonzalo" }`.
- **WHEN** se monta el componente `Header` en una pantalla de escritorio.
- **THEN** el sistema MUST renderizar el texto "Gonzalo" en la sección de estado de sesión.
- **AND** NOT mostrar el correo electrónico "gonzalo@test.com" a menos que se posicione el cursor encima (como `title` tooltip).

### Scenario: Fallback a correo electrónico por nombre vacío
- **GIVEN** un usuario autenticado viejo con datos `{ "email": "viejo@test.com", "name": "" }`.
- **WHEN** se monta el componente `Header`.
- **THEN** el sistema MUST renderizar el correo electrónico "viejo@test.com" en la sección de estado de sesión como alternativa de seguridad.
