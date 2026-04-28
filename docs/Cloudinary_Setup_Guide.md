# ☁️ Guía de Configuración: Cloudinary & Variables de Entorno

Esta guía detalla los pasos para migrar los assets locales a Cloudinary y configurar el entorno de desarrollo para servirlos de forma eficiente.

---

## 1. Organización en Cloudinary
Para mantener la paridad con la estructura del proyecto, organizá tu **Media Library** de la siguiente manera:

1.  Creá una carpeta llamada `cards/` y subí todas las cartas optimizadas (`.webp`).
2.  Creá una carpeta llamada `splash/` y subí las pantallas de carga (versiones `wide` y `mobile`).

## 2. Obtención de la URL Base
Una vez subida una imagen (ej. `cards/Grak.webp`), hacé clic en ella para ver su URL.
- **URL Completa:** `https://res.cloudinary.com/tu-cloud-name/image/upload/v12345/cards/Grak.webp`
- **Lo que necesitamos:** La parte de la ruta hasta el nombre de la carpeta:
  `https://res.cloudinary.com/tu-cloud-name/image/upload/cards/`

> **Tip de Pro:** Podés omitir el número de versión (`v12345/`) en la variable de entorno para que las URLs sean más limpias; Cloudinary resolverá la imagen igual.

---

## 3. Configuración del Archivo `.env.local`
Este archivo **no se sube al repositorio** (está en el `.gitignore`). Copiá y pegá lo siguiente, reemplazando con tus datos:

```env
# --- API CONFIG ---
VITE_API_URL=https://tu-mockapi.mockapi.io/api/v1

# --- CLOUDINARY ASSETS ---
# Asegurate de incluir la barra "/" al final de la URL
VITE_CARDS_URL=https://res.cloudinary.com/tu-cloud-name/image/upload/cards/
VITE_SPLASH_URL=https://res.cloudinary.com/tu-cloud-name/image/upload/splash/
```

---

## 4. Aplicación de Cambios
1.  **Reiniciar el Servidor:** Vite carga las variables de entorno al iniciar. Si el servidor estaba corriendo, cortalo (`Ctrl + C`) y ejecutá `npm run dev` nuevamente.
2.  **Verificación:** Abrí la consola del navegador (F12). Si las imágenes cargan, deberías ver que el `src` de las etiquetas `<img>` ahora apunta a Cloudinary.

## 5. Ventajas del Setup
- **Zero Repo Bloat:** No subimos binarios pesados a Git.
- **CDN Global:** Las imágenes cargan desde el servidor más cercano al usuario.
- **Optimización Automática:** Si agregás `,f_auto,q_auto` a la URL, Cloudinary comprimirá la imagen aún más según el navegador del usuario.

---
*Documentación técnica para TCG Nexus — PWA UNCOMA (Abril 2026).*
