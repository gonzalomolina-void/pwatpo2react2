# Diseño Técnico: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

## 1. Mapeo y Flujo de Autenticación con Roles

### A. Decodificación de JWT (`src/utils/jwt.js`)
Para cumplir el requerimiento de extraer el rol desde el token JWT en el cliente, crearemos una función utilitaria nativa de decodificación en `src/utils/jwt.js`:
```javascript
/**
 * Decodifica de forma segura el payload de un token JWT.
 * @param {string} token - El JWT a decodificar.
 * @returns {Object|null} El payload decodificado o null si el token es inválido.
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}
```

### B. Actualización de AuthContext (`src/context/AuthContext.jsx`)
Al iniciar sesión exitosamente (`login`) o restaurar sesión (`restoreSession`), se decodificará el token y se adjuntará el campo `role` del payload al objeto `user` en el estado de React:
```javascript
// Dentro de AuthContext.jsx
const updateSession = (token, userData) => {
  const payload = parseJwt(token);
  const userWithRole = {
    ...userData,
    role: payload?.role || userData?.role || 'usuario'
  };
  setToken(token);
  setUser(userWithRole);
};
```

## 2. Componente de Ruta Protegida (`src/components/ProtectedRoute.jsx`)
Se extenderá `ProtectedRoute` para admitir la prop opcional `allowedRoles` (array de strings):
```javascript
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Spinner de carga temático
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Validar restricciones de rol si se especifican
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />; // Redirigir al Home
  }

  return children;
}
```

## 3. Parametrización de Tipos y Rarezas (`src/constants/cardConstants.js`)
Para poblar los dropdowns globales en el formulario administrativo, mapearemos los IDs y códigos correspondientes a la estructura de la base de datos de Prisma del backend:
```javascript
export const CARD_TYPES = [
  { id: 1, code: 'creature', labelKey: 'card.types.creature' },
  { id: 2, code: 'spell', labelKey: 'card.types.spell' },
  { id: 3, code: 'artifact', labelKey: 'card.types.artifact' }
];

export const CARD_RARITIES = [
  { id: 1, code: 'poor', labelKey: 'card.rarities.poor' },
  { id: 2, code: 'common', labelKey: 'card.rarities.common' },
  { id: 3, code: 'uncommon', labelKey: 'card.rarities.uncommon' },
  { id: 4, code: 'rare', labelKey: 'card.rarities.rare' },
  { id: 5, code: 'epic', labelKey: 'card.rarities.epic' },
  { id: 6, code: 'legendary', labelKey: 'card.rarities.legendary' }
];
```

## 4. Modal Reutilizable de Edición/Alta (`src/components/CardFormModal.jsx`)
El modal tendrá dos modos: `Crear` (Alta) y `Editar`.

### A. Estructura del Formulario (Layout)
- **Campos Globales (Bloque Superior - Grid Vertical):**
  - `cost` (Costo): Input numérico.
  - `atk` (Ataque): Input numérico.
  - `def` (Defensa): Input numérico.
  - `image` (Imagen): Input de texto.
  - `typeId` (Tipo): Select (dropdown) con los tipos mapeados en `CARD_TYPES` traducidos mediante i18n.
  - `rarityId` (Rareza): Select (dropdown) con las rarezas mapeadas en `CARD_RARITIES` traducidos mediante i18n.
- **Tabla de Traducciones (Bloque Inferior):**
  - Una tabla con tres columnas: `Idioma`, `Nombre` (Input de texto), `Descripción` (Textarea).
  - Dos filas: Español e Inglés.

### B. Inicialización del Estado en Edición
Cuando se abre en modo edición, el modal disparará una llamada a `GET /api/cards/:id/edit` para obtener las traducciones de todos los idiomas de forma completa y sin aplanar:
```javascript
useEffect(() => {
  if (cardId) {
    cardService.getCardForEdit(cardId).then(data => {
      // Poblar estados de campos globales
      setCost(data.cost);
      setAtk(data.atk);
      setDef(data.def);
      setImage(data.image);
      setTypeId(data.typeId);
      setRarityId(data.rarityId);
      // Poblar diccionario de traducciones
      setTranslations(data.translations);
    });
  }
}, [cardId]);
```

### C. Estructura del Payload a Enviar
Al hacer click en "Guardar", se convertirá la estructura del diccionario de traducciones de React al array de traducciones esperado por el backend:
```javascript
const payload = {
  cost: Number(cost),
  atk: Number(atk),
  def: Number(def),
  image,
  typeId: Number(typeId),
  rarityId: Number(rarityId),
  translations: [
    { language: 'es', name: translations.es.name, description: translations.es.description },
    { language: 'en', name: translations.en.name, description: translations.en.description }
  ]
};
```
- Modo Alta: Llama a `POST /api/cards` enviando el payload.
- Modo Edición: Llama a `PUT /api/cards/:id` enviando el payload.

## 5. Control de Vistas en UI
- **Link en Header/Botón en Home (`src/pages/Home.jsx`):**
  ```jsx
  {user?.role === 'admin' && (
    <button onClick={handleCreate}>Nueva Carta</button>
  )}
  ```
- **Botón de Edición en Tarjetas (`src/components/Card.jsx`):**
  ```jsx
  {user?.role === 'admin' && (
    <button className="absolute top-2 right-2 p-2 bg-slate-800 text-white rounded-full">
      <EditIcon />
    </button>
  )}
  ```
