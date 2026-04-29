# 🚀 Despliegue en Vercel vía GitHub Releases

Este documento detalla la configuración necesaria para que **TCG Nexus** solo se despliegue en producción cuando se publica un **Release** en GitHub, evitando despliegues automáticos innecesarios en cada merge a `main`.

---

## 1. Preparar Credenciales de Vercel
Para que GitHub pueda comandar el despliegue, necesitamos identificar el proyecto y autorizar la conexión.

1.  **Vercel Token:**
    *   Andá a [Vercel Settings > Tokens](https://vercel.com/account/tokens).
    *   Creá un nuevo token llamado "GitHub Actions" y guardalo.
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
2.  Andá a **Settings > Git**.
3.  En la sección **Ignored Build Step**, configurá:
    *   **Behavior:** `Command`
    *   **Command:** `exit 0`
4.  Guardá los cambios.

> **Nota:** `exit 0` le indica a Vercel que no hubo cambios relevantes para buildear, cancelando el proceso automático cada vez que entra código a la rama `main`.

---

## 4. Pipeline de GitHub Actions
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

## 🔄 Flujo de Trabajo Recomendado

1.  **Desarrollo:** Trabajás en `develop` u otras ramas.
2.  **Integración:** Hacés un Pull Request de `develop` a `main`.
3.  **Merge:** Se mergea a `main`. **Vercel no dispara ningún build** (gracias al `exit 0`).
4.  **Release:** Vas a GitHub > Releases y creás una nueva versión (ej: `v1.0.0`).
5.  **Build:** Al publicar el Release, se dispara el Action, compila y despliega en Vercel de forma segura.

---
*Documentación para TCG Nexus — PWA UNCOMA (Abril 2026).*
