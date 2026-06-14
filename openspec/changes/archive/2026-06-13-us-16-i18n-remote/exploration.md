# Exploration: us-16-i18n-remote

### Current State
Actualmente, al navegar a la página de detalle de una carta (`Detail.jsx`), el componente recupera los datos de la carta invocando `cardService.getCardById` dentro de un hook `useEffect`. Sin embargo, las dependencias de este efecto son únicamente `[id, navigate]`. Cuando el usuario cambia el idioma utilizando el selector del encabezado (provisto por `react-i18next`), la propiedad `i18n.language` se actualiza, pero el efecto no se vuelve a disparar. Esto provoca que el lore y las propiedades de la carta sigan mostrándose en el idioma anterior hasta que se fuerce una recarga completa de la página.

### Affected Areas
- `src/pages/Detail.jsx` — El `useEffect` que carga los detalles de la carta debe incluir el idioma actual en su lista de dependencias para volver a realizar la petición.
- `src/pages/Detail.test.jsx` — La suite de pruebas unitarias debe modificarse para mockear el cambio de idioma dinámicamente y asertar que se gatille un nuevo fetch al mutar el locale.

### Approaches
1. **Agregar `i18n.language` a las dependencias de useEffect** — Modificar el arreglo de dependencias del efecto de carga en `Detail.jsx` para incluir `i18n.language`.
   - Pros: Solución extremadamente limpia, nativa de React y con cero líneas redundantes.
   - Cons: Ninguno.
   - Effort: Low

2. **Escuchar cambios a través de un event listener manual** — Suscribirse al evento de cambio de idioma de i18next manualmente.
   - Pros: Funciona fuera de las dependencias de React si se necesita una lógica compleja no reactiva.
   - Cons: Añade complejidad innecesaria, riesgo de fugas de memoria si no se desuscribe correctamente.
   - Effort: Medium

### Recommendation
Recomendamos la **Opción 1** (Agregar `i18n.language` a las dependencias de `useEffect`). Es la forma canónica de resolver este problema en React, ya que la petición al backend depende directamente del locale seleccionado (enviado en la cabecera `Accept-Language`), por lo que cualquier cambio en esta variable debe re-ejecutar el efecto.

### Risks
- **Llamadas duplicadas en montaje inicial**: Si no se maneja correctamente, podría haber una doble llamada al cargar la página si el idioma de i18n se inicializa asincrónicamente. Sin embargo, en nuestro stack i18n se inicializa de forma síncrona antes del renderizado de la app.
- **Cancelación de peticiones en curso**: Asegurar que el `AbortController` cancele la petición anterior si el idioma cambia muy rápido para evitar condiciones de carrera (ya implementado en el componente actual).

### Ready for Proposal
Yes.
