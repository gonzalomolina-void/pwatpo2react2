# ᚥ Rebranding: De TCG Nexus a HEXA

Este documento contiene el texto para el issue de GitHub y los pasos necesarios para realizar el cambio de nombre de la aplicación y la URL en Vercel.

---

## 📌 Issue de GitHub

**Título:**
`Rebranding: Cambiar el nombre de la aplicación de TCG Nexus a HEXA`

**Descripción:**

### Contexto
Actualmente el proyecto se llama "TCG Nexus", pero nos enteramos de que otro grupo de la materia ya está utilizando el nombre "Nexus". Para evitar confusiones y darle una identidad propia y más sólida a nuestro TCG, vamos a realizar un rebranding completo de la aplicación, pasando a llamarnos **HEXA**.

### Tareas a realizar
- [x] Actualizar el nombre en el archivo `README.md`.
- [x] Actualizar el `<title>` y las meta etiquetas en `index.html`.
- [x] Cambiar el `name` y `short_name` en `public/manifest.json`.
- [x] Modificar cualquier texto visible en la UI (Header, Splash Screen, AcercaDe, etc.) que mencione "Nexus" por "HEXA".
- [x] Actualizar los archivos de traducción en `src/i18n/locales/` (`es.json` y `en.json`).
- [x] Renombrar el `name` en el `package.json`.
- [x] Cambiar el dominio de Vercel de `tcg-nexus` a `hexa-tcg` (o similar).
- [x] Renombrar el archivo `docs/nexus.md` a `docs/hexa.md` (opcional, pero recomendado para mantener consistencia) y actualizar su contenido.

---

## 🚀 Pasos para Vercel (URL Gratis)

Para cambiar la URL `.vercel.app` de forma gratuita:

1.  Entrá a tu dashboard de Vercel y seleccioná el proyecto.
2.  Andá a la pestaña **Settings** (arriba a la derecha).
3.  En el menú lateral izquierdo, seleccioná **Domains**.
4.  Identificá tu dominio actual (ej: `tcg-nexus.vercel.app`).
5.  **Dos opciones:**
    *   Hacé clic en **Edit** sobre el dominio actual y cambialo por `hexa-tcg.vercel.app`.
    *   O agregá el nuevo dominio en el input superior y luego eliminá el anterior.
6.  Vercel verificará la disponibilidad y lo asignará automáticamente.
7.  *(Opcional)* En **Settings > General**, cambiá también el **Project Name** a `hexa-tcg` para que todo quede consistente.

---
*Documentación para el rebranding del proyecto HEXA — Abril 2026.*
