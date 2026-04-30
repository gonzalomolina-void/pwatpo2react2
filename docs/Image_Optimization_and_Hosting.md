# 🖼️ Estrategia de Optimización y Hosting de Imágenes (HEXA)

Este documento detalla la estrategia para el manejo de assets visuales pesados, priorizando el rendimiento de la PWA y la limpieza del repositorio de Git.

---

## 1. El Problema del "Peso Muerto" 🪨
Para una PWA (Progressive Web App), el peso de las imágenes es crítico. 
- **Estado Inicial:** Imágenes de ~6MB c/u.
- **Impacto:** Carga lenta, alto consumo de datos móviles y penalización en Lighthouse.
- **Decisión Arquitectónica:** No se deben subir archivos binarios pesados al repositorio. Git no está diseñado para trackear cambios en archivos de varios megabytes.

## 2. Optimización: El Formato WebP ⚡
Antes de subir cualquier imagen a la nube, es obligatorio optimizarla.
*   **Formato:** Usar siempre `.webp` o `.avif`.
*   **Herramientas recomendadas:**
    *   [Squoosh.app](https://squoosh.app/): Herramienta de Google para compresión manual.
    *   [TinyPNG](https://tinypng.com/): Compresión inteligente por lotes.
*   **Objetivo:** Reducir imágenes de 6MB a menos de **200KB** sin pérdida de calidad perceptible.

---

## 3. Hosting: Cloudinary (Recomendado) ☁️
Cloudinary no es solo un "alojamiento", es un motor de transformación de imágenes en tiempo real.

### Beneficios:
*   **Transformaciones por URL:** Podés subir la imagen original y pedir versiones diferentes cambiando la URL.
*   **CDN Global:** Las imágenes se sirven desde el servidor más cercano al usuario.

### Parámetros "Mágicos" para HEXA:
Agregando estos parámetros a la URL de Cloudinary (`/image/upload/[PARAMETROS]/v123/foto.jpg`):
*   `f_auto`: Selecciona automáticamente el mejor formato (WebP, AVIF) según el navegador.
*   `q_auto`: Aplica la compresión máxima sin perder calidad visual.
*   `w_500`: Redimensiona el ancho a 500px (ideal para las cartas del catálogo).

---

## 4. Hosting Alternativo: ImgBB 🚀
Si se busca simplicidad extrema para las imágenes generadas por los usuarios (IA):
*   **Pro:** API Key gratuita y subida directa sin configuraciones de transformación.
*   **Contra:** No permite redimensionar o cambiar formatos mediante la URL como Cloudinary.

---

## 5. Guía de Migración
1.  **Limpieza de Repo:** Borrar las imágenes pesadas de la rama de desarrollo.
2.  **Subida Masiva:** Cargar las originales a la Media Library de Cloudinary.
3.  **Actualización de Servicios:**
    *   Configurar `VITE_CLOUDINARY_URL` en el `.env`.
    *   Modificar `cardService.js` para construir las URLs con los parámetros de optimización.

---

## 6. Plan de Corrección: Assets en `develop` 🚑
Si las imágenes pesadas ya están mergeadas en la rama principal, seguí estos pasos para "desintoxicar" el proyecto:

1.  **Extraer y Optimizar:** Descargá las imágenes de `public/splash/` y subilas a Cloudinary.
2.  **Eliminar y Limpiar:** 
    ```powershell
    git rm -r public/splash/*
    git commit -m "chore: migrate heavy splash assets to Cloudinary"
    ```
3.  **Peso del Historial:** Ojo, Git seguirá recordando el peso en los commits viejos. Si el repo se vuelve inmanejable, se puede usar `git filter-repo` o `BFG Repo-Cleaner`, pero para la cursada de PWA, con eliminar los archivos del estado actual ya evitás que los nuevos `clone` tarden una eternidad.

## 7. Tips Específicos para Splash Screens 🎭
El Splash es lo primero que ve el usuario. Si tarda en cargar, la experiencia es pésima.

*   **Responsive Loading:** Cloudinary te permite servir versiones distintas según el dispositivo:
    *   **Mobile:** `.../w_400,c_fill/splash_mobile.webp`
    *   **Desktop:** `.../w_1920,c_fill/splash_wide.webp`
*   **Formato de Emergencia:** Si no querés usar Cloudinary para el Splash, al menos convertilo a **WebP** con una calidad de 75-80%. Debería pesar menos de **150KB** (comparado con los 2-5MB que suelen pesar los PNG originales).
*   **Preload:** Agregá un tag de preload en el `index.html` para la imagen del Splash si querés que vuele:
    ```html
    <link rel="preload" as="image" href="URL_DE_CLOUDINARY">
    ```

---
*Última actualización: Abril 2026 - Corrección de activos en develop.*
