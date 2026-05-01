# 🏷️ Estrategia de Versionado e Inyección de Build-Info

Este documento detalla cómo automatizar la inclusión de la versión del proyecto y metadatos del build (como el hash del commit) dentro de la aplicación **HEXA**. Esto es fundamental para el seguimiento de errores en producción y el control de despliegues.

---

## 1. Sincronización con Package.json
La "fuente de verdad" de la versión es el campo `version` en `package.json`.

### Configuración en `vite.config.js`
Podemos exponer este valor a la aplicación de forma global:

```javascript
import { defineConfig } from 'vite';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  define: {
    // Expone la versión como una variable de entorno de Vite
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
});
```

### Uso en la UI (Acerca de)
```jsx
// En src/components/AcercaDe.jsx
<p className="text-xs text-slate-500">
  Versión: {import.meta.env.PACKAGE_VERSION}
</p>
```

---

## 2. Inyección de Commit Hash (Git)
Para saber exactamente qué código generó un build, podemos inyectar el hash corto de Git.

```javascript
import { execSync } from 'child_process';
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  define: {
    '__COMMIT_HASH__': JSON.stringify(commitHash),
  },
});
```

---

## 3. Banner de Encabezado en Archivos Buildeados
Podemos configurar Vite (vía esbuild) para que agregue un comentario legal y técnico al principio de cada archivo `.js` o `.css` generado.

```javascript
export default defineConfig({
  build: {
    esbuild: {
      banner: `/*! HEXA TCG - v${pkg.version} - Commit: ${commitHash} - Build: ${new Date().toISOString()} */`,
    },
  },
});
```

---

## 4. Flujo de Release Recomendado (SemVer)

1.  **Desarrollo:** Trabajar con la versión actual (ej. `1.0.2`).
2.  **Preparación de Release:**
    *   Si son correcciones de bugs: Incrementar el **Patch** (`1.0.3`).
    *   Si son funcionalidades nuevas: Incrementar el **Minor** (`1.1.0`).
3.  **Update:** Ejecutar `npm version patch` (esto actualiza el `package.json` y crea un tag de git).
4.  **GitHub Release:** Al publicar el release en GitHub, el Action de deploy tomará la versión del `package.json` y la inyectará en el build final.

---
*Documentación técnica para HEXA — Estrategias de CI/CD (Mayo 2026).*
