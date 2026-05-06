# Configuración de Ruteo en Vercel para SPAs

## Problema: Error 404 al recargar (Refresh/F5)
En una aplicación de una sola página (SPA) como **HEXA**, que utiliza `react-router-dom` para el ruteo del lado del cliente, el servidor de hosting (Vercel en este caso) no tiene conocimiento nativo de las rutas de JavaScript.

Cuando un usuario navega a `/favorites` desde la aplicación, React Router maneja el cambio de URL sin recargar. Sin embargo, si el usuario presiona F5 o ingresa directamente a `https://tu-app.vercel.app/favorites`, Vercel intenta buscar un archivo físico llamado `favorites.html` o similar en el servidor. Al no encontrarlo, devuelve un error 404.

## Solución: Rewrites en `vercel.json`
Para solucionar esto, hemos configurado Vercel para que redirija todas las peticiones que no correspondan a archivos estáticos (como imágenes o JS) hacia el archivo raíz `index.html`. Una vez que el navegador carga el `index.html`, React Router toma el control de la URL y muestra el componente correcto.

### Archivo de Configuración
Se ha creado el archivo `vercel.json` en la raíz del proyecto con el siguiente contenido:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Beneficios
- **Soporte completo para Deep Linking:** Los usuarios pueden compartir URLs directas a cualquier sección de la aplicación.
- **Experiencia de usuario fluida:** El refresco de página funciona como se espera en cualquier sitio web moderno.
- **Mantenimiento simplificado:** No requiere configuraciones complejas de servidores proxy o scripts de redirección manuales.

---
*Documentado en Mayo 2026 para el equipo de HEXA.*
