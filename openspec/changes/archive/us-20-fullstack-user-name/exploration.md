# Exploration: us-20-fullstack-user-name

Investigación previa para la implementación del campo `name` en el registro y cabecera de la aplicación de forma full-stack.

## Backend: tpexpress

### 1. Esquema de Prisma (`prisma/schema.prisma`)
El modelo `User` actual no contiene ningún campo de texto para almacenar el nombre:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  roleId    Int
  role      Role     @relation(fields: [roleId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ...
}
```
Para implementar el nombre, agregaremos `name String` debajo del campo `email`.
Dado que se seleccionó la **Opción A**, se forzará un reset de la base de datos de desarrollo mediante `pnpm prisma db push --force-reset` o `pnpm prisma migrate reset` para reconstruir las tablas y volver a aplicar los seeders de prueba.

### 2. Controlador de Registro (`src/controllers/auth.controller.js`)
El método `register` desestructura `{ email, password }` del cuerpo del request. Agregaremos `name` a la desestructuración y validaremos:
- Que exista y sea un string.
- Que contenga entre 2 y 50 caracteres (no vacíos ni puros espacios).
Se deberán incluir claves de traducción en `src/utils/errors.i18n.js` y `src/locales/` para los errores de validación de nombre.

### 3. JWT Payload
Se modificará el login y el refresco para incluir el `name` del usuario dentro del JWT firmado:
```javascript
const token = jwt.sign(
  { userId: user.id, email: user.email, name: user.name, role: user.role.name },
  JWT_SECRET,
  { expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY }
);
```

---

## Frontend: pwatpo2react2

### 1. `AuthContext.jsx`
La función `register` debe expandirse para aceptar `name`:
```javascript
const register = async (email, name, password) => { ... }
```
El objeto retornado por el inicio de sesión y la restauración de sesión propagará automáticamente el campo `name` a `user`.

### 2. Formulario de Registro
Se modificará `src/pages/Login.jsx` o el componente donde se realice el registro para incluir un campo de entrada para el "Nombre" con validaciones similares a las del backend.

### 3. Cabecera (`src/components/Header.jsx`)
Se reemplazará `{user.email}` por `{user.name || user.email}` tanto en la vista Desktop como en el nav lateral de Mobile.
