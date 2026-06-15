# Design: us-20-fullstack-user-name

Diseño técnico para la implementación del registro con nombre y personalización de perfil.

## 1. Backend: tpexpress

### Base de Datos & Migración (Prisma)
- **Modificación**: `prisma/schema.prisma`
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String   // <-- Nuevo campo obligatorio
    password  String
    roleId    Int
    role      Role     @relation(fields: [roleId], references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    ...
  }
  ```
- **Migración**: Correr en consola:
  ```bash
  pnpm prisma migrate dev --name add_user_name
  ```
  Esto creará la migración y regenerará el Prisma Client local. Dado que es Opción A, permitiremos el reset de la DB local.
- **Seeder**: Actualizar `prisma/seed.js` para proveer un campo `name` a todos los usuarios de prueba inyectados (admin, usuario común, etc.).

### Lógica & Validación
- **Traducciones**:
  Agregar claves de error en `src/utils/errors.i18n.js` y archivos de locales (`es.json`, `en.json` en locales/ si se usan):
  - `NAME_REQUIRED`: "El nombre es obligatorio." / "Name is required."
  - `NAME_TOO_SHORT`: "El nombre debe tener al menos 2 caracteres." / "Name must be at least 2 characters."
  - `NAME_TOO_LONG`: "El nombre no puede superar los 50 caracteres." / "Name cannot exceed 50 characters."
- **Servicios (`user.service.js`)**:
  ```javascript
  export async function createUser({ email, name, password, role }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return prisma.user.create({
      data: {
        email,
        name, // <-- Persistir nombre
        password: hashedPassword,
        role: {
          connect: { name: role || ROLES.USER }
        }
      },
      include: {
        role: true
      }
    });
  }
  ```
- **Controlador (`auth.controller.js`)**:
  - Validar presencia, tipo y longitud de `name` al inicio de `register`.
  - Agregar `name` al payload del token JWT firmado en `login` y `refresh`.

---

## 2. Frontend: pwatpo2react2

### Autenticación & API
- **Servicio (`authService.js`)**:
  - Modificar `register` para recibir `name` en el payload de la llamada `POST /auth/register`.
- **Contexto (`AuthContext.jsx`)**:
  - Actualizar `register` para pasar `name`:
    ```javascript
    const register = async (email, name, password) => {
      setLoading(true);
      try {
        const result = await authService.register(email, name, password);
        setLoading(false);
        return result;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };
    ```

### Vistas & UI
- **Página de Registro/Login (`Login.jsx` o similar)**:
  - Si el componente maneja tanto Login como Registro, agregar un input de texto para el "Nombre" visible únicamente en la pestaña de Registro.
  - Sincronizar el input con un estado local `name` y agregar la validación requerida.
- **Cabecera (`Header.jsx`)**:
  - Reemplazar `{user.email}` por `{user.name || user.email}` en el navbar normal y móvil.
