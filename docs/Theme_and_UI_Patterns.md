# 🎨 Guía de UI: Dark Mode y Patrones de Interfaz

Este documento explica la implementación técnica del sistema de temas (oscuro/claro) y el manejo de componentes globales como los Modales en TCG Nexus.

## 🌙 1. Sistema de Temas (Dark/Light Mode)

El proyecto utiliza **Tailwind CSS v4** con una estrategia basada en clases (`.dark`).

### Configuración en Tailwind v4
A diferencia de versiones anteriores, Tailwind v4 prioriza las preferencias del sistema. Para habilitar el cambio manual por clase, tuvimos que definir una **variante manual** en `src/index.css`:

```css
/* src/index.css */
@variant dark (&:where(.dark, .dark *));
```

Esto le permite a Tailwind aplicar las clases `dark:` cuando detecta la clase `.dark` en el elemento `<html>`.

### Persistencia y Estado
La preferencia del usuario se gestiona a través del `preferencesService.js`, que guarda el valor (`dark` o `light`) en el **localStorage**. 

El componente `ThemeToggle.jsx` es el encargado de:
1. Leer el tema inicial.
2. Inyectar la clase en el `document.documentElement`.
3. Actualizar el servicio cuando el usuario "invoca la luz" o "abraza las sombras".

---

## 🚪 2. Portales de React (Modales)

Un problema común en CSS es que los contenedores con filtros (como el `backdrop-blur-md` de nuestro Header) crean un **nuevo contexto de apilamiento (stacking context)**. Esto provoca que elementos con `position: fixed` (como un Modal) queden "atrapados" y se vean cortados por el contenedor padre.

### La Solución: `createPortal`
Para que el `Modal.jsx` se vea siempre por encima de todo, usamos Portales de React:

```javascript
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 ...">
      {/* Contenido del Modal */}
    </div>,
    document.body // Se renderiza aquí, fuera del DOM de la App
  );
};
```

Esto "teletransporta" el modal al final del `<body>`, asegurando que ignore cualquier restricción visual del Header o del contenido principal.

---

## 📜 3. Guía de Estilos Épicos

Para mantener la estética de fantasía épica, los componentes deben seguir estos patrones de clases:

| Elemento | Modo Claro (Luz) | Modo Oscuro (Sombras) |
| :--- | :--- | :--- |
| **Fondos** | `bg-slate-50` | `bg-slate-900` |
| **Tarjetas** | `bg-white` | `bg-slate-800` |
| **Bordes** | `border-slate-200` | `border-slate-700` |
| **Texto Principal** | `text-slate-900` | `text-slate-100` |
| **Texto Secundario**| `text-slate-600` | `text-slate-400` |

### Ejemplo de Componente Theme-Aware:
```jsx
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
  <h3 className="text-slate-900 dark:text-white">Título Épico</h3>
</div>
```

---
*Última actualización: Abril 2026 - Sistema de Temas v1.0*
