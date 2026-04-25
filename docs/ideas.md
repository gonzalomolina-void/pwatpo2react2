# 💡 Ideas para el Futuro: TCG Nexus

Acá vamos guardando todas esas locuras que se nos ocurren para que no se pierdan en el olvido del desarrollo. ¡A meterle ficha!

---

## 🃏 Mecánicas de UI / UX

### 🔄 Rotación de Carta (Modo "Ulti")
- **Idea:** Cuando una carta tenga una habilidad especial o "Ulti" activa (como Sir Kaelen que es horizontal), permitir que la carta gire 90 grados.
- **Implementación:** Usar clases de Tailwind (`rotate-90`) con transiciones suaves para simular que la carta cambia de estado o se "agota" para activar su poder máximo.
- **Detalle:** Sirve para darle dinamismo a la grilla y aprovechar mejor las imágenes que no son verticales por defecto.

---

## 🎨 Estética y Arte

### ✨ Efecto de Brillo (Foil)
- **Idea:** Agregar un gradiente animado que se mueva sobre la carta para las rarezas "Legendario" y "Épico".
- **Referencia:** Efecto holográfico tipo Pokémon TCG.

---

## 🛠️ Funcionalidades Técnicas

### 💾 Exportar Mazo (JSON)
- **Idea:** Permitir que el usuario descargue su lista de favoritos como un archivo JSON para compartirlo.

### 🌐 Simulación de API Multilingüe (MockAPI.io)
- **Idea:** Crear recursos separados en MockAPI (`/cards_es` y `/cards_en`) para simular la entrega de contenido localizado desde el servidor.
- **Implementación:** Inyectar el idioma obtenido de `preferencesService.getLanguage()` dinámicamente en la URL de las peticiones en `cardService.js`.
- **Ventaja:** Optimiza el payload (solo baja un idioma a la vez) y permite que el motor de búsqueda de MockAPI funcione correctamente para cada lenguaje sin mezclar resultados.
- **Restricción Crítica:** Mantener IDs idénticos entre recursos para no romper la persistencia de favoritos.
