# 🚀 Guía de Despliegue: GitHub como CDN de Imágenes

Para optimizar el rendimiento y evitar los límites de almacenamiento de Vercel, utilizamos GitHub como un CDN (Content Delivery Network) para servir los assets pesados (cartas).

## 1. El Concepto: URL Humana vs URL Raw

GitHub muestra las imágenes en una interfaz para humanos. Para que la aplicación pueda consumirlas, necesitamos la URL **Raw**.

*   **URL de Repositorio (Humana):** `https://github.com/usuario/repo/blob/main/public/cards/Grak.png`
*   **URL Directa (Raw/CDN):** `https://raw.githubusercontent.com/usuario/repo/main/public/cards/Grak.png`

## 2. Configuración de Entorno (Vite)

Usamos variables de entorno para que el código sepa de dónde sacar las imágenes dependiendo de dónde se esté ejecutando.

### Local (`.env.local`)
En tu máquina, las imágenes se cargan desde la carpeta `public/` local.
```env
VITE_CARDS_URL=/cards/
```

### Producción (Vercel)
En el panel de Vercel, debés configurar la variable apuntando a tu repositorio de GitHub.
```env
VITE_CARDS_URL=https://raw.githubusercontent.com/[TU_USUARIO]/[TU_REPO]/main/public/cards/
```

## 3. Uso en el Código (React)

En los componentes (ej. `Card.jsx`), consumimos la variable de entorno de la siguiente manera:

```javascript
const cardsBaseUrl = import.meta.env.VITE_CARDS_URL;

// Ejemplo de uso en el src de la imagen
<img 
  src={`${cardsBaseUrl}${card.image}`} 
  alt={card.name} 
/>
```

## 4. Optimización de Despliegue en Vercel

Para que Vercel no pierda tiempo subiendo las imágenes (ya que las servimos desde GitHub), debemos crear un archivo `.vercelignore` en la raíz del proyecto.

### Archivo `.vercelignore`
```text
public/cards/
```

## 5. Pasos para el Deployment

1.  **Push a GitHub:** Subir todos los cambios, incluyendo las imágenes en `public/cards/`.
2.  **Configurar Vercel:**
    *   Ir a **Project Settings > Environment Variables**.
    *   Agregar `VITE_CARDS_URL` con la URL Raw de tu repo.
3.  **Deploy:** Vercel ignorará la carpeta `/cards` gracias al `.vercelignore`, haciendo el build mucho más liviano y rápido.
4.  **Verificación:** La aplicación cargará las imágenes directamente desde la infraestructura de GitHub.

---
*Nota: Asegurate de que el repositorio sea público para que las imágenes sean accesibles sin tokens de autenticación.*
