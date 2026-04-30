# 🔄 Cómo Implementar Scroll Infinito (HEXA)

El scroll infinito es un patrón de diseño que carga contenido automáticamente a medida que el usuario se desplaza hacia abajo, eliminando la necesidad de una paginación manual por botones. En **HEXA**, implementaremos este patrón de forma eficiente y profesional.

---

## 🛠️ Conceptos Fundamentales

Para que el scroll infinito funcione correctamente, necesitamos coordinar tres capas de la aplicación:

### 1. Paginación en la API (MockAPI.io)
MockAPI permite segmentar los datos mediante parámetros en la URL. Usaremos dos parámetros clave:
- `page`: El número de "lote" o página que queremos pedir (ej. 1, 2, 3...).
- `limit`: La cantidad de cartas por lote (ej. 12 cartas por petición).

**Ejemplo de URL:** `${API_URL}/cards?page=1&limit=12`

### 2. Gestión de Estado en React
No podemos simplemente reemplazar las cartas que ya tenemos. Debemos **acumularlas**.
- `cards`: Un array que crece con cada petición: `setCards(prev => [...prev, ...nuevasCartas])`.
- `page`: Un contador que aumenta cada vez que llegamos al final de la pantalla.
- `hasMore`: Un booleano que nos indica si todavía quedan cartas en la API. Si la API devuelve un array vacío `[]`, cambiamos `hasMore` a `false` para dejar de pedir.

### 3. El Gatillo (Intersection Observer)
En lugar de usar el evento `window.onscroll` (que consume muchísima CPU), usaremos la API nativa **Intersection Observer**.
- Colocamos un `<div>` invisible (el "Centinela") al final de nuestra grilla de cartas.
- El Observador "vigila" ese `<div>`.
- Cuando el `<div>` entra en el campo de visión del usuario, el Observador dispara una función que aumenta el número de la página (`page++`).

---

## 🚀 Flujo de Implementación

1.  **Estado Inicial:** La aplicación carga la `page: 1`.
2.  **Renderizado:** Se muestran las primeras 12 cartas y el **Centinela** queda oculto debajo de ellas.
3.  **Interacción:** El usuario hace scroll hacia abajo.
4.  **Detección:** El **Centinela** entra en la pantalla.
5.  **Actualización:** Se incrementa `page` a 2.
6.  **Petición:** El `useEffect` detecta el cambio de `page` y llama a `cardService.getCards({ page: 2, limit: 12 })`.
7.  **Concatenación:** Las nuevas cartas se agregan al final del array existente.
8.  **Finalización:** Si la API devuelve menos cartas de las pedidas o un array vacío, se marca `hasMore: false` y el Observador se desconecta.

---

## 💎 Ventajas de este Enfoque

-   **Performance:** El `IntersectionObserver` es asíncrono y no bloquea el hilo principal de ejecución.
-   **UX (Experiencia de Usuario):** La navegación es fluida, tipo "Instagram" o "TikTok", ideal para una enciclopedia de cartas.
-   **Ahorro de Datos:** Solo descargamos lo que el usuario realmente va a ver.

---
*Documentación técnica para el Issue #5 del proyecto HEXA - PWA UNCOMA.*
