# 🌌 HEXA: La Enciclopedia de Cartas

![HEXA Banner](./docs/ArteConceptual/Portada.png)

Bienvenido a **HEXA**, una enciclopedia interactiva y multilingüe diseñada para los maestros de las cartas. Explora un universo de criaturas legendarias, hechizos ancestrales y artefactos poderosos en esta plataforma de vanguardia.

Este proyecto ha sido desarrollado para la cátedra de **Programación Web Avanzada (PWA)** de la **UNCOMA** (Trabajo Práctico React Parte II - 2026).

---

## ✨ Características Principales

- 🃏 **Exploración Infinita:** Sumérgete en un catálogo dinámico con *Infinite Scroll* consumiendo datos en tiempo real.
- 🔍 **Buscador Inteligente:** Encuentra cualquier carta por su nombre mediante filtrado directo en la API.
- 🌎 **Multilingüe (i18n):** Soporte completo para **Español** e **Inglés** con detección automática de idioma.
- ❤️ **Colección de Favoritos:** Guarda tus cartas preferidas con persistencia local (*LocalStorage*).
- 📱 **Diseño Ultra-Responsivo:** Una experiencia visual de primer nivel en cualquier dispositivo gracias a Tailwind CSS.
- 🤖 **Forja de Cartas (IA):** Generación dinámica de cartas y lore utilizando la potencia de Gemini / Nano Banana.

---

## 🎨 Arte Conceptual del Universo

El universo de HEXA cobra vida a través de sus protagonistas. Aquí te presentamos algunas de las entidades que habitan nuestro mundo:

| ![Lyra](./docs/ArteConceptual/Lyra.png) | ![Grak](./docs/ArteConceptual/Grak.png) | ![Sir Kaelen](./docs/ArteConceptual/SirKaelen.png) | 
|:---:|:---:|:---:|
| **Lyra** | **Grak** | **Sir Kaelen** | 
| *La Tejedora de Luz* | *El Devastador de Tierras* | *El Guardián del Honor* | 

---

## 🛠️ Stack Tecnológico

- **Core:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Modern CSS engine)
- **Navegación:** [React Router 7](https://reactrouter.com/)
- **Internacionalización:** [react-i18next](https://react.i18next.com/)
- **Backend Mock:** [MockAPI.io](https://mockapi.io/)
- **Inteligencia Artificial:** Google Gemini / Nano Banana API

---

## 🚀 Instalación y Uso

Este proyecto utiliza **pnpm** como gestor de paquetes. Si no lo tienes instalado globalmente, puedes hacerlo ejecutando:

```bash
npm install -g pnpm
```

### Configuración inicial del proyecto:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/gonzalomolina-void/pwatpo2react2.git
   cd pwatpo2react2
   ```

2. **Migración de ambiente (si ya tenías el proyecto clonado con npm):**
   Si estás en Windows, ejecuta el script de migración en PowerShell para limpiar los archivos redundantes de npm e instalar con pnpm:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\migrate-to-pnpm.ps1
   ```
   *En otros sistemas operativos, simplemente elimina `node_modules` y `package-lock.json` manualmente y ejecuta `pnpm install`.*

3. **Instala las dependencias (instalación limpia):**
   ```bash
   pnpm install
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

5. **Accede a la app:**
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🧪 Testing Automático

El proyecto incluye tests automatizados. Las librerías instaladas para el entorno de testing son:
- **Vitest**: Motor y *runner* de tests.
- **jsdom**: Entorno que simula el DOM del navegador.
- **React Testing Library** (`@testing-library/react`): Herramientas para renderizar y testear componentes.
- **jest-dom** (`@testing-library/jest-dom`): Matchers personalizados (ej. `toBeInTheDocument`).
- **user-event** (`@testing-library/user-event`): Simulador de eventos reales de usuario.

Para ejecutar las pruebas localmente:

1. **Ejecutar tests en modo watch (desarrollo):**
   ```bash
   pnpm test
   ```

2. **Ejecutar los tests una sola vez (ideal para CI):**
   ```bash
   pnpm test:run
   ```

3. **Ejecutar tests y ver reporte de cobertura (coverage):**
   ```bash
   pnpm test:coverage
   ```

---

## 👥 El Equipo (The Council of HEXA)

- **Lautaro (PM / Scrum Master):** Coordinación, Arquitectura e Internacionalización.
- **Juan (Developer):** Servicios API, Home y Detalle de Cartas.
- **Gonzalo (Developer):** Scroll Infinito, Favoritos y Persistencia.

---

## 🏷️ Versionado y Publicación de Releases

El frontend cuenta con un sistema automatizado para el versionado semántico (SemVer) y la publicación de releases oficiales en GitHub. El flujo garantiza que solo el código que pase de forma exitosa las pruebas de calidad pueda publicarse y desplegarse en producción.

### Prerrequisitos
Para realizar una publicación de release a remoto, el mantenedor debe tener:
1. La CLI de GitHub (`gh`) instalada y autenticada en su máquina (`gh auth login`).
2. Permisos de escritura (push) en el repositorio remoto.

### Scripts de Lanzamiento (Local & CI)
Se pueden ejecutar los siguientes comandos en la terminal desde la raíz del proyecto para automatizar el lanzamiento:

```bash
# Publicar una versión tipo PATCH (e.g. 1.16.1 -> 1.16.2) para corrección de bugs
pnpm run release:patch

# Publicar una versión tipo MINOR (e.g. 1.16.1 -> 1.17.0) para nuevas funcionalidades
pnpm run release:minor

# Publicar una versión tipo MAJOR (e.g. 1.16.1 -> 2.0.0) para breaking changes
pnpm run release:major
```

### Flujo de Ejecución del Script (`Release-Project.ps1`)
Al ejecutar cualquiera de los comandos anteriores, se ejecuta un script de PowerShell que realiza la siguiente secuencia:
1. **Pre-flight Checks (Quality Gate)**: Ejecuta el linter (`pnpm lint`) y la suite completa de pruebas unitarias (`pnpm test:run`). Si cualquiera de las dos falla, el proceso de release se cancela de forma inmediata.
2. **Version Bump & Changelog**: Invoca a `standard-version` para calcular el incremento según la matemática de SemVer, actualizar el `package.json`, autogenerar el historial de cambios en `CHANGELOG.md` y clavar el tag de Git local correspondiente (ej. `v1.17.0`).
3. **Git Push**: Sube los commits y tags generados a la rama remota activa (`git push origin <rama> --follow-tags`).
4. **GitHub Release**: Utiliza la CLI de GitHub para publicar el Release oficial en la web de GitHub (`gh release create`) bajo el tag correspondiente y autogenerando las notas de lanzamiento.

### Despliegue Automático en Vercel
* El proyecto está configurado en Vercel con el comportamiento `Don't build anything` por defecto para evitar deploys innecesarios en cada push simple.
* El despliegue de producción se gatilla **únicamente** cuando se publica un **Release oficial** en GitHub. Esto activa una GitHub Action (`.github/workflows/deploy-release.yml`) que compila la aplicación inyectando la versión y el hash de commit Git correspondientes, y sube el build compilado a Vercel de forma segura.

---

## 📄 Licencia

Este proyecto es para fines educativos bajo los requerimientos de la UNCOMA. El arte conceptual pertenece a sus respectivos creadores dentro del universo de HEXA.

---
*Desarrollado con ❤️ para PWA - Universidad Nacional del Comahue*
