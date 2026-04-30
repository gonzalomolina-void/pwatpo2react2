# ᚥ Plan de Implementación: La Forja (IA Card Creator)

## 1. Visión General
"La Forja" es un laboratorio alquímico-tecnológico donde los usuarios pueden generar cartas únicas colaborando con una Inteligencia Artificial (Google Gemini). Esta funcionalidad expande el universo de **HEXA** permitiendo que la comunidad cree contenido dinámico.

## 2. Requerimientos Técnicos
Para habilitar La Forja, se necesitan los siguientes elementos:

### 🔑 API Keys y Variables de Entorno
*   **Google AI Studio (Gemini API Key):** Es necesaria una clave válida para realizar peticiones al modelo `gemini-1.5-flash` o similar.
*   **VITE_AI_API_KEY:** Debe configurarse en el archivo `.env.local` (local) y en las variables de entorno de Vercel (producción).

### 🛠️ Infraestructura de Datos
*   **MockAPI Limitation:** Actualmente, MockAPI no permite subidas masivas o persistencia dinámica desde el cliente de forma escalable (límites de recursos y seguridad).
*   **Solución Temporal:** Las cartas generadas se mostrarán en una **previsualización efímera** y podrán guardarse en el **estado local** de la sesión hasta que se implemente el backend real (Node.js/FastAPI).

## 3. Flujo de Usuario (User Flow)
1.  **Input:** El usuario ingresa una temática o prompt simple (ej: "Un dragón de cristal que vive en el vacío").
2.  **Prompt Engineering:** La aplicación envuelve el input en un "System Prompt" que instruye a Gemini a responder en un formato JSON estricto que cumpla con el esquema de HEXA (`base_cards.md`).
3.  **Generación:** La IA devuelve nombre, estadísticas (ATK/DEF), costo, rareza y lore (en español e inglés).
4.  **Previsualización:** Se renderiza una instancia de `Card.jsx` en tiempo real con los datos obtenidos.
5.  **Refinado:** El usuario puede volver a "forjar" si no le gusta el resultado antes de "finalizar" la creación.

## 4. Prompt Maestro (System Instructions)
Para asegurar que la IA responda correctamente, usaremos un prompt estructurado:
> "Eres un diseñador senior de TCG para el juego HEXA. Tu tarea es generar una carta equilibrada y épica basada en el prompt del usuario.
> Responde ÚNICAMENTE en formato JSON plano con esta estructura: 
> { 'nameEn': '...', 'nameEs': '...', 'atk': 0, 'def': 0, 'cost': 0, 'typeEn': '...', 'typeEs': '...', 'descriptionEn': '...', 'descriptionEs': '...', 'rarityEn': '...', 'rarityEs': '...' }. 
> Asegúrate de que el costo de maná sea proporcional a las estadísticas."

## 5. Seguridad y Buenas Prácticas
*   **Protección de Key:** En una etapa de producción, la petición a Gemini DEBE realizarse a través de una **Serverless Function** (Vercel Functions) para no exponer la `VITE_AI_API_KEY` en el cliente.
*   **Sanitización:** Validar el JSON recibido antes de inyectarlo en los componentes de React para evitar ataques de inyección o errores de renderizado.

## 6. Hoja de Ruta (Next Steps)
*   **Fase 1 (UI):** Crear la página `/forja` con el formulario de prompt y el estado de carga temático.
*   **Fase 2 (Integración):** Implementar el servicio `aiService.js` para conectar con Gemini.
*   **Fase 3 (Imágenes):** Asignar una imagen genérica por tipo/rareza o integrar generación de imágenes (DALL-E/Midjourney) si el presupuesto lo permite.
*   **Fase 4 (Persistencia):** Migrar de MockAPI a una API propia para persistir las creaciones de los usuarios.

---
*Documentación técnica para HEXA — PWA UNCOMA (Abril 2026).*
