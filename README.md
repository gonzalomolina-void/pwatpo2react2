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

Si quieres probar HEXA en tu propia terminal:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/gonzalomolina-void/pwatpo2react2.git
   cd pwatpo2react2
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Accede a la app:**
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
   npm run test
   ```

2. **Ejecutar los tests una sola vez (ideal para CI):**
   ```bash
   npm run test:run
   ```

3. **Ejecutar tests y ver reporte de cobertura (coverage):**
   ```bash
   npm run test:coverage
   ```

---

## 👥 El Equipo (The Council of HEXA)

- **Lautaro (PM / Scrum Master):** Coordinación, Arquitectura e Internacionalización.
- **Juan (Developer):** Servicios API, Home y Detalle de Cartas.
- **Gonzalo (Developer):** Scroll Infinito, Favoritos y Persistencia.

---

## 📄 Licencia

Este proyecto es para fines educativos bajo los requerimientos de la UNCOMA. El arte conceptual pertenece a sus respectivos creadores dentro del universo de HEXA.

---
*Desarrollado con ❤️ para PWA - Universidad Nacional del Comahue*
