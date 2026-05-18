# 🌐 Guía de Testing E2E: Elevando la Calidad de HEXA

¡Hola equipo! Si están leyendo esto es porque ya no nos conformamos con que el código "compile". Queremos estar seguros de que la aplicación **realmente funciona** para el usuario final. Para eso, implementamos **Testing End-to-End (E2E)**.

Esta guía explica qué es, por qué es importante y cómo lo estamos usando en nuestro proyecto con **Playwright**.

---

## 1. ¿Qué es el Testing E2E? 🧪

El testing **End-to-End** (de punta a punta) es una técnica de prueba que valida el flujo completo de una aplicación, desde el principio hasta el fin. 

A diferencia de los tests unitarios (que prueban una función o componente solo), el E2E simula a un **usuario real** interactuando con la interfaz en un navegador de verdad.

- **Unit Test:** ¿La rueda gira?
- **Integration Test:** ¿La rueda encaja en el eje?
- **E2E Test:** ¿El auto arranca, dobla y frena cuando el conductor lo maneja?

### La Pirámide de Testing 🔺
En HEXA seguimos este modelo:
1.  **Unit Tests (Base):** Muchos, rápidos, prueban lógica pura (Vitest).
2.  **E2E Tests (Cima):** Menos, más lentos, prueban los "caminos críticos" (Playwright).

---

## 2. ¿Por qué usamos Playwright? 🎭

**Playwright** es una herramienta moderna de Microsoft para automatizar navegadores (Chromium, Firefox, WebKit). La elegimos porque:
- **Es rápida:** Ejecuta tests en paralelo por defecto.
- **Auto-wait:** No tenemos que poner "pausas" manuales; Playwright espera a que los elementos aparezcan.
- **Trace Viewer:** Si un test falla, nos graba un video y nos muestra exactamente qué pasó.
- **Strict Mode:** Nos obliga a escribir mejores selectores (si hay dos botones iguales, el test falla para avisarnos que la UI es ambigua).

---

## 3. Conceptos Clave para Principiantes 🧠

Para escribir o entender un test de Playwright, hay que dominar tres pilares:

### A. Locators (¿Dónde está el elemento?) 📍
Es la forma de decirle al navegador qué queremos tocar. Siempre priorizamos el **rol accesible** (cómo lo ve una persona con discapacidad o un lector de pantalla):
```javascript
page.getByRole('button', { name: 'Entrar' }) // ✅ La Posta
page.locator('.btn-azul')                    // ❌ Evitar (atado a estilos)
```

### B. Actions (¿Qué hace el usuario?) ⚡
Son las interacciones físicas:
- `click()`: Hacer click.
- `fill('texto')`: Escribir en un input.
- `goto('/')`: Navegar a una URL.
- `evaluate(() => window.scrollTo(...))`: Simular scroll.

### C. Assertions (¿Qué esperamos que pase?) ✅
Es la verdad que queremos validar. Usamos `expect`:
```javascript
await expect(page.locator('h1')).toHaveText('Bienvenido');
```

---

## 4. Implementación en HEXA ᚥ

Nuestros tests viven en la carpeta `tests/e2e/`. El archivo principal es `home.spec.js` y cubre:
1.  **Carga del Catálogo:** Verifica que la API responda y se vean cartas.
2.  **Buscador:** Valida que el filtrado por nombre funcione y no se rompa con el delay (debounce).
3.  **Navegación:** Asegura que el usuario pueda entrar a ver el detalle de una carta y volver atrás.
4.  **Favoritos:** Prueba que al marcar una carta, esta aparezca mágicamente en la sección de favoritos.
5.  **Scroll Infinito:** Valida que al bajar al fondo, se carguen automáticamente más cartas.

---

## 6. Buenas Prácticas con Git 📁

Para mantener el repositorio liviano y profesional, es importante saber qué archivos subir y cuáles no:

### ✅ Lo que SÍ se sube (Código y Configuración)
- `playwright.config.js`: La configuración global.
- `tests/e2e/*.spec.js`: Tus scripts de prueba.
- `package.json`: Las dependencias del proyecto.

### ❌ Lo que NO se sube (Reportes y Resultados)
Nunca debemos subir los archivos generados automáticamente, ya que pesan mucho y cambian en cada ejecución. El archivo `.gitignore` ya está configurado para ignorar:
- `playwright-report/`: El reporte HTML generado.
- `test-results/`: Capturas de pantalla, videos y trazas de errores.

---

## 7. Cómo ejecutar los tests 🚀


En HEXA ya dejamos todo configurado en el `package.json`. No hace falta que instalen nada raro:

- **Modo Terminal (Headless):**
  ```bash
  npm run test:e2e
  ```
- **Modo Interactivo (UI):** ¡Este es el más divertido! Abre una ventana donde podés ver al robot haciendo click.
  ```bash
  npm run test:e2e:ui
  ```
- **Ver Reporte:** Si algo falló, acá tenés las pruebas (fotos y videos).
  ```bash
  npm run test:e2e:report
  ```
- **Modo Demo / Grabación de Video:** Ideal para hacer videos de presentación. Ralentiza las acciones y graba automáticamente un video `.webm` en la carpeta `test-results/`.
  ```bash
  npm run test:e2e:demo
  ```

---

## 8. ¿Cómo grabar una demo perfecta? 🎥

Si necesitás mostrarle la app a un cliente o profesor, usá el comando `npm run test:e2e:demo`. 
- **SlowMo:** Hemos configurado una pausa de 800ms entre cada click y tipeo para que el ojo humano pueda seguir el proceso.
- **Auto-Video:** Playwright generará un archivo de video por cada test ejecutado.
- **Ubicación:** Buscá tus videos en `test-results/`.

---

## 💎 Tips de "Senior" para el equipo
1.  **No usen esperas fijas:** Nunca pongan `waitForTimeout(3000)`. Es "flaky" (frágil). Usen `expect().toBeVisible()`.
2.  **Tests Atómicos:** Cada test debe probar una sola cosa. Si el test de favoritos falla, no debería afectar al test del buscador.
3.  **Independencia del Idioma:** Usen expresiones regulares (`/favoritos|favorites/i`) para que el test no explote si alguien cambia el idioma por defecto.

---
*Documentación para el equipo de HEXA — PWA UNCOMA (Mayo 2026).*
