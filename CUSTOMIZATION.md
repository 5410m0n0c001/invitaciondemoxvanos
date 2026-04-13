# Guía de Personalización y Funcionamiento

Esta guía explica cómo adaptar la plantilla para un nuevo evento y cómo funcionan los módulos principales del sistema. El objetivo es que puedas crear una invitación completa en menos de 30 minutos.

## 🎨 Personalización Visual

### 1. Colores y Estilos
Los colores globales se encuentran al inicio de `css/styles.css` en la sección `:root`.
- Modifica `--primary-color` para el tono principal (ej. verde oliva).
- Modifica `--accent-color` para los detalles (ej. beige/oro).

### 2. Imágenes y Video
Reemplaza los archivos en la carpeta raíz manteniendo el mismo nombre o actualiza la ruta en el HTML:
- `sobre.mp4`: Video de apertura.
- `portada.mp4`: Video principal de la sección Hero.
- `Invitación Virtual Boda Fotográfico Verde y Blanco.png`: Imagen de respaldo/fondo.
- `qr.png`: Tu código QR personalizado.
- `favicon.ico`: Icono de la pestaña del navegador.

### 3. Textos y Datos del Evento
Casi todos los textos están en `index.html`. Busca y reemplaza:
- Nombres de los novios (`.names`).
- Mensaje de bienvenida.
- Detalles de la ceremonia y recepción (lugar, hora, dirección).
- Enlaces de Google Maps y Waze en los botones de ubicación.
- Números de teléfono en los botones de WhatsApp (RSVP).

## ⚙️ Funcionamiento de Módulos

### 📸 Carga de Galería (Cloudinary)
La galería en `index.html` y `smartlanding.html` se carga dinámicamente:
1.  **Lógica**: En `js/script.js`, la función `loadGallery()` realiza una petición `fetch` a la API de búsqueda de Cloudinary (vía una URL de lista JSON) usando el `PHOTO_TAG`.
2.  **Visualización**: Genera elementos `<img>` dentro del contenedor `#photo-gallery`.
3.  **Nota**: Asegúrate de que las fotos en Cloudinary tengan la etiqueta (tag) correcta que configuraste en el archivo JS.

### 📤 Subida de Fotos (Smart Landing)
Ubicación: `smartlanding.html` y `js/smartlanding.js`.
1.  **Botón "Subir Foto"**: Activa un input de tipo `file` con `capture="camera"` en móviles, abriendo directamente la cámara.
2.  **Proceso**: El archivo se envía mediante un `FormData` directamente a Cloudinary usando el `UPLOAD_PRESET`.
3.  **Feedback**: Se muestra una barra de carga y un mensaje de éxito sin recargar la página.

### 📲 Comportamiento del QR
- El archivo `qr.png` debe apuntar a la URL de tu `smartlanding.html`.
- En `js/script.js`, el botón "Compartir QR" utiliza la API `navigator.share` para permitir que el usuario envíe la imagen del QR por WhatsApp u otras apps.

### 🎬 Animaciones y Navegación
- **Entrada**: El script maneja el evento `click` en la pantalla de inicio para reproducir el video y luego ocultar el overlay con un desvanecimiento.
- **Scroll Reveal**: Se utiliza `IntersectionObserver` para añadir clases de animación (`.visible`) a los elementos conforme el usuario baja por la página.
- **Nav Flotante**: Sincroniza la posición del scroll con los iconos activos de la barra inferior.

## ⏱️ Checklist de 30 Minutos
1. [ ] Cambiar credenciales de Cloudinary en `js/script.js` y `js/smartlanding.js`.
2. [ ] Reemplazar `sobre.mp4` y `portada.mp4`.
3. [ ] Actualizar nombres y fecha en `index.html`.
4. [ ] Cambiar enlaces de mapas y números de RSVP.
5. [ ] Subir a GitHub y activar GitHub Pages.

---
Si necesitas ayuda con flujos más complejos, consulta la documentación oficial de [Cloudinary](https://cloudinary.com/documentation).
