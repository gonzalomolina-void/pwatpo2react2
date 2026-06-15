# Tasks: us-20-fullstack-user-name

## Phase 1: Backend - Cambios de Base de Datos y Servicios (tpexpress)

- [ ] 1.1 Modificar `prisma/schema.prisma` agregando `name String` en el modelo `User` en `tpexpress`.
- [ ] 1.2 Actualizar `prisma/seed.js` proviniendo el campo `name` a los usuarios mockeados de prueba en `tpexpress`.
- [ ] 1.3 Ejecutar las migraciones de Prisma locales (`pnpm prisma migrate dev --name add_user_name`) aceptando el reset de la base de datos de desarrollo.
- [ ] 1.4 Modificar `user.service.js` para recibir e insertar el campo `name` en el método `createUser`.

## Phase 2: Backend - Validaciones y Endpoints de Autenticación (tpexpress)

- [ ] 2.1 Agregar claves y traducciones de errores en locales/ y en `errors.i18n.js` de `tpexpress` para errores de nombre.
- [ ] 2.2 Modificar el controlador `register` en `auth.controller.js` para validar y requerir `name` en `tpexpress`.
- [ ] 2.3 Modificar `login` y `refresh` en `auth.controller.js` para incluir `name` en el payload firmado del JWT y devolverlo en la respuesta.
- [ ] 2.4 Correr los tests del backend (`pnpm test:run` o correspondiente) y validar que se mantengan en verde.

## Phase 3: Frontend - Integración de API y AuthContext (pwatpo2react2)

- [ ] 3.1 Modificar `authService.js` en `pwatpo2react2` para enviar el campo `name` en la petición de registro.
- [ ] 3.2 Modificar `AuthContext.jsx` en `pwatpo2react2` para recibir y enviar `name` en su método `register`.
- [ ] 3.3 Modificar `AuthContext.test.jsx` para mockear y verificar el registro con `name`.

## Phase 4: Frontend - Vistas y Cabecera (pwatpo2react2)

- [ ] 4.1 Modificar el formulario de registro en `src/pages/Login.jsx` (o donde se registre) para incluir el input de "Nombre" y su validación local.
- [ ] 4.2 Modificar `src/components/Header.jsx` para renderizar `{user.name || user.email}` en Desktop y Mobile.
- [ ] 4.3 Ejecutar `pnpm lint` y correr la suite de pruebas unitarias (`pnpm test:run`) en verde para todo el frontend.
