# Proposal: us-20-fullstack-user-name

## 1. Intent
Implementar el campo `name` en el registro de usuarios de forma que la cabecera muestre el nombre del usuario logueado en lugar de su correo electrónico.

## 2. Scope

### In-Scope (Backend - tpexpress)
- Modificar el modelo `User` en `prisma/schema.prisma` para incluir `name String`.
- Ejecutar migraciones y resetear base de datos local para repoblar con seeders.
- Actualizar `userService.createUser` y `auth.controller.js` para recibir, validar y persistir el nombre.
- Agregar los mensajes de error correspondientes al campo `name` localizados en español e inglés.
- Modificar el payload del token JWT firmado en login/refresh para incluir la propiedad `name`.

### In-Scope (Frontend - pwatpo2react2)
- Modificar `authService.register` y `AuthContext.jsx` para pasar el `name`.
- Actualizar el formulario en `Register.jsx` (o vista de autenticación) con un input de "Nombre" y validaciones correspondientes.
- Modificar `Header.jsx` (Desktop y Mobile) para mostrar el nombre.

### Out-of-Scope
- Edición del nombre de usuario una vez registrado (perfil/ajustes de cuenta no forma parte de este TP).

## 3. Approach & Tradeoffs
- **Db Reset**: Optamos por `name String` (no opcional) para asegurar la integridad de datos, asumiendo un reset de la DB local de desarrollo.
- **Fallback**: En la UI del frontend, se mantendrá un fallback `{user.name || user.email}` como buena práctica ante posibles inconsistencias iniciales o de restauración de sesión.
