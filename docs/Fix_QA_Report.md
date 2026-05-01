# 🛠️ Plan de Fixes - Reporte QA (Mayo 2026)

Este documento detalla el plan de acción para corregir los errores reportados por QA respecto a la visualización de checkboxes en modo claro y la pérdida de sincronización en las traducciones de los filtros.

---

## 1. Problema: Checkboxes oscuros en Modo Claro
**Causa:** Aunque se cambia la clase `.dark` en el elemento `html`, no se está actualizando la propiedad CSS `color-scheme`. Esto hace que el navegador siga renderizando los controles nativos (como checkboxes) basándose en la preferencia del sistema operativo en lugar del tema de la aplicación.

### ✅ Solución:
Actualizar el `ThemeToggle.jsx` para que maneje la propiedad `color-scheme` dinámicamente.

- **Archivo:** `src/components/ThemeToggle.jsx`
- **Acción:** En el `useEffect` que aplica el tema, agregar:
  ```javascript
  document.documentElement.style.colorScheme = theme;
  ```
- **Archivo:** `src/index.css`
- **Acción:** Asegurar que `:root` tenga `color-scheme: light dark;` para permitir la sobreescritura manual.

---

## 2. Problema: Filtros no se traducen o se deseleccionan al cambiar idioma
**Causa:** El estado de los filtros (`selectedTypes`, `selectedRarities`) guarda los **strings traducidos** (ej: "Criatura"). Al cambiar de idioma, las opciones del dropdown se regeneran con nuevos strings (ej: "Creature"), pero el estado mantiene los anteriores. Esto rompe la lógica de `includes()` y hace que los elementos parezcan deseleccionados y con texto en el idioma previo.

### ✅ Solución: Arquitectura de Filtros basada en Keys
Vamos a desacoplar el **valor lógico** (key) de la **etiqueta visual** (label).

### Paso A: Refactor de `CheckboxDropdown.jsx`
- Modificar el componente para que acepte `options` como un array de objetos: `{ value, label }`.
- Usar `option.value` para la lógica de selección y `option.label` para el renderizado.

### Paso B: Refactor de `SearchBar.jsx`
- Actualizar para que reciba las opciones formateadas como objetos.
- Mantener el estado interno usando solo los `values` (keys).

### Paso C: Actualización en `Home.jsx`
- Generar las opciones pasando tanto la key como la traducción:
  ```javascript
  const typeOptions = TYPE_OPTIONS.map(key => ({
    value: key,
    label: t(`home.filters.types.${key}`)
  }));
  ```

### Paso D: Ajuste en `useInfiniteCards.js`
- Modificar el filtrado local para que compare las **keys** seleccionadas con los datos de la carta.
- Dado que las cartas en la API tienen strings traducidos (`typeEs`, `typeEn`), se implementará un mapeo inverso o se comparará contra ambas versiones para garantizar consistencia.

---

## 🗓️ Cronograma de Ejecución
1.  **Fix UI:** `ThemeToggle.jsx` (Inmediato).
2.  **Refactor Componentes:** `CheckboxDropdown` y `SearchBar`.
3.  **Integración:** Actualización de `Home` y `useInfiniteCards`.
4.  **Validación:** Pruebas cruzadas de cambio de idioma con filtros activos.

*Documento de trabajo para HEXA — PWA UNCOMA (Mayo 2026).*
