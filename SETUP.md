# Guía de Instalación y Configuración Local

Sigue estos pasos para configurar el entorno de desarrollo y ejecutar la invitación en tu computadora.

## 1. Requisitos Previos

No necesitas instalar bases de datos complejas o servidores pesados. Solo requieres:

- **Editor de Código**: Recomendamos [VS Code](https://code.visualstudio.com/).
- **Navegador Web**: Chrome, Edge o Safari.
- **Servidor Local (Opcional pero recomendado)**: Para evitar problemas de CORS con los videos y fetch, usa la extensión "Live Server" de VS Code o un comando de Python/Node.

## 2. Instalación Paso a Paso

1.  **Descarga el código**:
    Si tienes Git, clona el repositorio. Si no, descarga el archivo ZIP y extráelo en una carpeta.

2.  **Abrir en el editor**:
    Abre la carpeta del proyecto en VS Code.

3.  **Ejecutar el proyecto**:
    - **Con Live Server**: Haz clic derecho en `index.html` y selecciona "Open with Live Server".
    - **Con Python**:
      ```bash
      # En la carpeta del proyecto
      python -m http.server 8000
      ```
    - **Con Node.js (http-server)**:
      ```bash
      npx http-server ./
      ```

4.  **Acceso**:
    Abre tu navegador en `http://localhost:8000` (o el puerto que te indique tu servidor).

## 3. Configuración de API (Cloudinary)

Para que la galería y la subida de fotos funcionen, debes configurar tus propias credenciales de Cloudinary:

1.  Crea una cuenta gratuita en [Cloudinary](https://cloudinary.com/).
2.  Obtén tu **Cloud Name**.
3.  Crea un **Unsigned Upload Preset** en la configuración de Cloudinary (Settings > Upload > Upload presets).
4.  Modifica los siguientes archivos con tus datos:

**En `js/script.js` y `js/smartlanding.js`:**
```javascript
const CLOUD_NAME = 'tu_cloud_name';
const UPLOAD_PRESET = 'tu_preset_unsigned';
const PHOTO_TAG = 'etiqueta_para_fotos'; // Ejemplo: 'boda-juan-y-maria'
```

## 4. Estructura de Git

Si planeas subirlo a GitHub para desplegarlo:

1.  Inicia un repositorio local: `git init`
2.  Agrega los archivos: `git add .`
3.  Primer commit: `git commit -m "Setup inicial de invitación"`
4.  Crea un repo en GitHub y sigue las instrucciones para hacer `push`.

---
**Nota**: El video de entrada (`sobre.mp4`) puede no reproducirse automáticamente en algunos navegadores debido a políticas de privacidad si no hay una interacción previa del usuario (clic). Por eso la pantalla de "Toca para abrir" es esencial.
