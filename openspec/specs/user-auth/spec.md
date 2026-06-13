# User Authentication Specification

## Purpose
Esta especificación define el comportamiento del sistema de autenticación de usuarios para HEXA, permitiendo el registro, inicio de sesión, mantenimiento del estado de sesión activa y cierre de sesión de forma segura.

## Requirements

### Requirement: Registro de Nuevos Usuarios
El sistema MUST permitir a los usuarios crear una cuenta ingresando un email y contraseña válidos.

#### Scenario: Registro exitoso
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa un email no registrado y contraseña válida y hace clic en "Registrarse"
- THEN el sistema realiza la petición `POST /api/auth/register` al backend
- AND muestra un mensaje de éxito redirigiendo al usuario al formulario de inicio de sesión

#### Scenario: Intento de registro con email duplicado
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa un email ya registrado por otro usuario y hace clic en "Registrarse"
- THEN el sistema muestra un mensaje de error claro provisto por la API del backend

---

### Requirement: Inicio de Sesión (Login)
El sistema MUST validar las credenciales del usuario y establecer una sesión de forma segura.

#### Scenario: Login exitoso
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa credenciales correctas y hace clic en "Iniciar Sesión"
- THEN el sistema realiza la petición `POST /api/auth/login` al backend
- AND almacena el token JWT de acceso en el estado de React
- AND redirige al usuario a la página de inicio (Home) con la sesión activa

#### Scenario: Login fallido por credenciales inválidas
- GIVEN un usuario no autenticado en la página de Login
- WHEN ingresa credenciales incorrectas y hace clic en "Iniciar Sesión"
- THEN el sistema muestra un mensaje de error y mantiene al usuario en el formulario de login

---

### Requirement: Persistencia y Mantenimiento de la Sesión
El sistema MUST verificar de forma asíncrona si existe una sesión activa al cargar o actualizar la aplicación web.

#### Scenario: Recuperación exitosa de sesión activa
- GIVEN un usuario con una sesión activa en el navegador (cookie refresh token presente)
- WHEN abre o recarga la aplicación web
- THEN el sistema muestra el spinner de carga inicial
- AND realiza la petición `GET /api/auth/me` para obtener los datos del usuario
- AND oculta el spinner, manteniendo la sesión iniciada en el frontend

---

### Requirement: Cierre de Sesión (Logout)
El sistema MUST limpiar el estado de sesión local y notificar al backend para invalidar las credenciales.

#### Scenario: Cierre de sesión exitoso
- GIVEN un usuario autenticado y visible en el Header
- WHEN hace clic en el botón "Cerrar Sesión"
- THEN el sistema realiza la petición `POST /api/auth/logout` al backend
- AND ya no almacena el token de acceso en memoria
- AND redirige al usuario a la vista de inicio (Home) con el estado de sesión cerrado
