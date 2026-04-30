# ☁️ Guía de Configuración: Cloudinary & Variables de Entorno

Esta guía detalla los pasos para migrar los assets locales a Cloudinary y configurar el entorno de desarrollo para servirlos de forma eficiente.

---

## 1. Organización en Cloudinary
Para mantener la paridad con la estructura del proyecto, organizá tu **Media Library** de la siguiente manera:

1.  Creá una carpeta llamada `cards/` y subí todas las cartas optimizadas (`.webp`).
2.  Creá una carpeta llamada `splash/` y subí las pantallas de carga (versiones `wide` y `mobile`).

## 2. Configuración de Upload Presets (EVITAR NOMBRES RAROS)
Por defecto, Cloudinary agrega un sufijo aleatorio a los archivos (ej. `Grak_abc123`). Para que las URLs coincidan con nuestro código, debés configurar el **Upload Preset**:

1.  Andá a **Settings (Engranaje)** -> **Upload**.
2.  Buscá la sección **Upload presets** y editá el que uses por defecto (ej. `ml_default`).
3.  **Unique filename:** Cambialo a **`Off`**. (Esto quita los sufijos).
4.  **Use filename or external ID:** Cambialo a **`On`**.
5.  **Use asset folder as public ID prefix:** Cambialo a **`On`**. (Esto hace que la URL incluya la carpeta, ej: `cards/Grak.webp`).
6.  **Folder:** Dejá este campo vacío para que respete la carpeta donde soltás el archivo.
7.  ¡Dale a **Save**!

> **Nota:** Estos cambios solo afectan a las subidas nuevas. Lo que ya tiene sufijo deberá ser resubido.

## 3. Obtención de la URL Base
Una vez configurado, la URL de una imagen subida a la carpeta `cards` será:
- **URL:** `https://res.cloudinary.com/tu-cloud-name/image/upload/cards/Grak.webp`
- **Variable de entorno:** La ruta hasta la carpeta inclusive:
  `https://res.cloudinary.com/tu-cloud-name/image/upload/cards/`


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
*Documentación técnica para HEXA — PWA UNCOMA (Abril 2026).*
