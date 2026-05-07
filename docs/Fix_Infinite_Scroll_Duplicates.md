# 🛠️ Reporte Técnico: Solución a Llamadas Duplicadas en Scroll Infinito

Este documento detalla la investigación y resolución del problema de rendimiento detectado en el catálogo principal, donde se realizaban múltiples peticiones innecesarias a la API para la misma página de resultados.

---

## 1. El Problema Detectado 🔍
Durante las pruebas de navegación en el catálogo (Home), se observó en la pestaña *Network* de las DevTools que al scrollear hacia abajo, las peticiones a la API para páginas específicas (ej. `page=3`) se disparaban múltiples veces.

*   **Síntoma:** El navegador mostraba una petición con código `200` seguida de dos o tres peticiones con código `304` (Not Modified) para la misma URL.
*   **Impacto:** Consumo innecesario de ancho de banda, sobrecarga latente en el servidor (MockAPI) y procesamiento redundante de React al intentar mergear cartas que ya existían.

---

## 2. Análisis de Causa Raíz (Root Cause) 🧬
Se identificaron dos culpables principales en el hook `useInfiniteCards.js`:

### A. Loop de Dependencias
La función `fetchCards` estaba envuelta en un `useCallback` que dependía de `cards.length`. 
1. `fetchCards` se ejecuta y actualiza el estado `cards`.
2. Al cambiar `cards.length`, la función `fetchCards` se recrea (nueva referencia).
3. El `useEffect` que dispara la carga detecta la nueva referencia de `fetchCards` y vuelve a ejecutarla para la **misma página**, creando un bucle.

### B. "Jitter" del IntersectionObserver
El callback del `IntersectionObserver` incrementaba la página (`setPage`) apenas el centinela entraba en vista. Sin embargo:
* No había una guardia que verificara si ya había una petición "en vuelo" para esa nueva página.
* El estado `isLoading` de React no se actualiza de forma instantánea entre frames, permitiendo que un movimiento rápido del scroll disparara el evento de intersección varias veces antes de que la UI se bloqueara por carga.

---

## 3. Solución Implementada 🚀
Se refactorizó el hook `useInfiniteCards.js` aplicando un patrón de **Guardia por Referencia**:

1.  **`fetchingPageRef`**: Se introdujo un `useRef` que almacena el número de página que se está procesando actualmente. Al ser una referencia, su cambio es instantáneo y no depende del ciclo de renderizado de React.
2.  **Bloqueo de Peticiones:** Al inicio de `fetchCards`, se compara `fetchingPageRef.current` con la página solicitada. Si coinciden, la función termina inmediatamente (`return`), bloqueando cualquier duplicado.
3.  **Limpieza del Observer:** Se aseguró que el `IntersectionObserver` se desconecte proactivamente antes de cualquier chequeo de carga, y se agregó una condición extra (`!isLoading`) dentro del callback del observador para evitar disparos accidentales.
4.  **Optimización de Dependencias:** Se eliminó la dependencia innecesaria de `cards.length` en la lógica de carga, delegando la prevención de duplicados a la guardia de la referencia y a un filtrado por ID en el seteo del estado.

---

## 4. Resultados y Verificación ✅
*   **Peticiones Quirúrgicas:** Cada página del catálogo se solicita exactamente **una vez**.
*   **Estabilidad:** El scroll rápido ya no genera "cataratas" de peticiones en el Network.
*   **Performance:** Se redujo el re-renderizado innecesario al evitar el procesamiento de datos duplicados.

---
*Documentación técnica para HEXA — PWA UNCOMA (Mayo 2026).*
