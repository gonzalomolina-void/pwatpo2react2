# 🚀 Despliegue en Vercel vía GitHub Releases

Este documento detalla la configuración necesaria para que **HEXA** solo se despliegue en producción cuando se publica un **Release** en GitHub, evitando despliegues automáticos innecesarios en cada merge a `main`.

---

## 1. Preparar Credenciales de Vercel
Para que GitHub pueda comandar el despliegue, necesitamos identificar el proyecto y autorizar la conexión.

1.  **Vercel Token:**
    *   Andá a [Vercel Settings > Tokens](https://vercel.com/account/tokens).
    *   Creá un nuevo token llamado "GitHub Actions" y guardalo. (Se recomienda una expiración de **180 días** para cubrir el cuatrimestre).
2.  **Identificadores de Proyecto:**
    *   En la terminal del proyecto, corré `npx vercel link` (vinculá tu cuenta si es necesario).
    *   Esto genera el archivo `.vercel/project.json`.
    *   Copiá el `projectId` y el `orgId`.

---

## 2. Configurar Secrets en GitHub
Guardamos las llaves en un lugar seguro dentro de tu repositorio.

1.  En tu repositorio de GitHub, andá a **Settings > Secrets and variables > Actions**.
2.  Creá 3 **Repository Secrets**:
    *   `VERCEL_TOKEN`: (El token del paso 1).
    *   `VERCEL_ORG_ID`: (El `orgId` de project.json).
    *   `VERCEL_PROJECT_ID`: (El `projectId` de project.json).

---

## 3. Desactivar Deploys Automáticos de Vercel
Queremos que GitHub sea el único "dueño" del botón de despliegue.

1.  En el Dashboard de Vercel, seleccioná tu proyecto.
2.  Andá a **Settings > General** (sección **Build & Development Settings**).
3.  En la subsección **Ignored Build Step**, configurá:
    *   **Behavior:** `Don't build anything` (Recomendado) o `Custom` (escribiendo `exit 0`).
4.  Guardá los cambios.

> **Nota:** Esto desactiva los despliegues automáticos por Git, dejando el control absoluto a nuestra GitHub Action.

---

## 4. Configurar Variables de Entorno en Vercel
Antes de deployar, la infraestructura debe conocer las URLs de los servicios.

1.  En el Dashboard de Vercel, andá a **Settings > Environment Variables** (menú lateral izquierdo).
2.  **Pro Tip:** Podés arrastrar tu archivo `.env.local` o pegar el contenido de un `.env` directamente en el cuadro de carga para que Vercel detecte todas las variables automáticamente (ignorando las comentadas).
3.  Asegurate de que las siguientes variables tengan marcada la casilla **Production**:
    *   `VITE_API_URL`: URL de tu MockAPI.
    *   `VITE_CARDS_URL`: URL de Cloudinary (carpeta `cards/`).
    *   `VITE_SPLASH_URL`: URL de Cloudinary (carpeta `splash/`).
4.  Dale a **Save**.

---

## 5. Pipeline de GitHub Actions
Creá el archivo `.github/workflows/deploy-release.yml` con el siguiente contenido:

```yaml
name: Deploy to Vercel on Release

on:
  release:
    types: [published]

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Instalar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Instalar Vercel CLI
        run: npm install --global vercel@latest

      - name: Bajar información de entorno de Vercel
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Buildear el proyecto
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deployar a Producción
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## ✅ Checklist Final de Lanzamiento
Antes de disparar el primer Release, verificá que estos puntos estén cumplidos:

1.  **En Vercel (Panel Web):**
    *   [ ] **Ignored Build Step:** Configurado en `Don't build anything` o `exit 0`.
    *   [ ] **Environment Variables:** `VITE_API_URL`, `VITE_CARDS_URL` y `VITE_SPLASH_URL` cargadas y asignadas al entorno de **Production**.
2.  **En GitHub (Tu Repo):**
    *   [ ] **Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` creados en *Settings > Secrets and variables > Actions*.
    *   [ ] **Workflow:** El archivo `.github/workflows/deploy-release.yml` debe existir en la rama **`main`**.

---

## 🔄 Flujo de Trabajo Recomendado

1.  **Feature/Fix:** Trabajás en una rama específica (ej: `feat-pipeline`).
2.  **A Develop:** Pull Request desde tu rama hacia **`develop`**.
3.  **A Main:** Pull Request desde `develop` hacia **`main`**. (Vercel no disparará ningún build gracias al bloqueo).
4.  **Release:** Una vez que el código del pipeline y el workflow estén en `main`, vas a *GitHub > Releases* y creás una versión (ej: `v1.0.0`).
5.  **Build Automático:** Al publicar el Release, GitHub Actions toma el mando, compila y despliega en Vercel de forma segura.

---
*Documentación para TCG Nexus — PWA UNCOMA (Abril 2026).*
