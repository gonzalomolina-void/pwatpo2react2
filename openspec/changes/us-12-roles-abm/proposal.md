# Propuesta de Cambio: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

## 1. Visión General y Propósito
El objetivo de este cambio es implementar el flujo administrativo completo (ABM: Alta, Baja y Modificación de cartas) en el frontend, securizando el acceso y las vistas visuales para que solo los usuarios con el rol `admin` puedan utilizarlos. Se reutilizará un modal de edición/alta que maneje de forma robusta la internacionalización (i18n) de las propiedades de las cartas, garantizando que el tipo y la rareza se mantengan consistentes en todos los idiomas.

## 2. Enfoque de Diseño y Arquitectura
- **Decodificación del JWT**:
  - Implementar una utilería de parsing nativa y ligera para el payload del token JWT en `src/utils/jwt.js` usando `atob` de forma segura.
  - Al iniciar sesión o restaurar sesión, decodificar el token para extraer el campo `role` y cargarlo en el estado del usuario en `AuthContext`.
- **Ruta Protegida (`ProtectedRoute.jsx`)**:
  - Extender el componente para que acepte una prop opcional `allowedRoles` (ej: `allowedRoles={['admin']}`). Si el usuario autenticado no tiene un rol permitido, se lo redirigirá al Home `/` o a una página de no autorizado.
- **Componentes y Vistas**:
  - **Grilla de Cartas (`Card.jsx`)**: Añadir un botón flotante absoluto de edición (tres puntitos o lápiz) en la esquina superior de la tarjeta de la carta. Este botón solo se renderizará si el usuario autenticado tiene rol `admin`. Al clickearlo, se abrirá el modal de edición.
  - **Catálogo (`Home.jsx`)**: Añadir un botón "Nueva Carta" sobre la grilla, visible únicamente para admins.
  - **Formulario Reutilizable (`CardFormModal.jsx`)**:
    - Un modal que sirva tanto para Alta como para Edición.
    - Campos globales: `cost`, `atk`, `def` (inputs numéricos) e `image` (input de texto).
    - Tabla de traducciones: Una fila por idioma configurado en la app (Español e Inglés), con columnas para el `Nombre` (input), `Descripción` (textarea), `Tipo` (select) y `Rareza` (select).
    - Los selectores de Tipo y Rareza usarán una constante conceptual en `src/constants/cardConstants.js` que indexe las claves (`creature`, `common`, etc.) junto a sus traducciones para guardar los datos consistentes en la base de datos sin importar el idioma global seleccionado.
  - **Acciones y Modales de Confirmación**:
    - En modo edición, el modal incluirá un botón "Eliminar". Al hacerle click, se abrirá un segundo diálogo modal de confirmación.
    - El guardado llamará a `POST /api/cards` (alta) o `PUT /api/cards/:id` (edición).
    - La eliminación llamará a `DELETE /api/cards/:id`.
- **Feedback (Toasts) y Sincronización**:
  - Mostrar un toast de éxito ante cada operación (guardado/borrado).
  - Al cerrar el modal tras un éxito, ejecutar el callback `onSuccess` que le pasará el Home para reiniciar el scroll infinito/paginación del catálogo a la página 1.

## 3. Impacto en Pruebas (TDD)
- **Tests Unitarios (`src/components/Card.test.jsx`, `src/pages/Home.test.jsx`, etc.)**:
  - Escribir tests para verificar que el botón de edición y el botón de alta sólo se rendericen ante un usuario con rol `admin`.
  - Crear pruebas unitarias para `CardFormModal.jsx` validando el renderizado de la tabla de idiomas, dropdowns y disparos de callbacks.
  - Probar que `ProtectedRoute` restrinja el acceso a usuarios comunes ante rutas que exigen `allowedRoles`.

## 4. Riesgos y Mitigación
- **Riesgo:** Inconsistencias al decodificar tokens JWT corruptos o vacíos.
- **Mitigación:** Capturar excepciones en la función de parsing nativa devolviendo `null` de forma segura.
- **Riesgo:** Pérdida de traducciones de otros idiomas al editar una carta.
- **Mitigación:** Asegurar que el modal de edición llame al nuevo endpoint del backend `GET /api/cards/:id/edit` para obtener las traducciones de todos los idiomas de forma completa y sin aplanar antes de rellenar el formulario.

## 5. Plan de Rollback
En caso de fallas graves en la integración, se desharán los cambios mediante:
```bash
git checkout develop
git branch -D feat/us-12-roles-abm
```
