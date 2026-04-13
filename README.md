# Invitación Digital Smart - Plantilla Reutilizable

Esta es una plantilla premium para invitaciones digitales de eventos (bodas, XV años, bautizos, etc.), diseñada para ser ligera, visualmente impactante y altamente interactiva.

## 🚀 Tecnologías Usadas

- **Frontend**: HTML5 Semántico, CSS3 (Vanilla), JavaScript (ES6+).
- **Animaciones**: CSS Animations, Intersection Observer API.
- **Servicios**: [Cloudinary](https://cloudinary.com/) (Galería y subida de fotos en tiempo real).
- **Iconos**: [Boxicons](https://boxicons.com/).
- **Tipografía**: Google Fonts (Playfair Display, Montserrat).
- **Despliegue**: Optimizado para GitHub Pages.

## 🏗️ Arquitectura y Componentes

El proyecto sigue una arquitectura de sitio estático (SPA-ish) optimizada para dispositivos móviles:

1.  **Entrada de Video (`index.html`)**: Una experiencia inmersiva que utiliza un video full-screen (`sobre.mp4`) para simular la apertura de un sobre físico.
2.  **Módulos de Invitación**: Secciones dinámicas que se revelan al hacer scroll (RSVP, ubicación, cuenta regresiva, mesa de regalos).
3.  **Smart Landing (`smartlanding.html`)**: Una página ligera e independiente diseñada específicamente para que los invitados suban fotos rápidamente desde el código QR, sin cargar todo el contenido pesado de la invitación principal.
4.  **Integración Cloudinary**: Manejo asíncrono de carga de imágenes y visualización de galería.

## 🔄 Flujo de Usuario

1.  **Acceso**: El usuario recibe un enlace o escanea un código QR.
2.  **Entrada**: Se presenta una pantalla negra con "Toca para abrir". Al tocar, se reproduce el video del sobre.
3.  **Exploración**: Se revela la invitación con música de fondo opcional. El usuario puede navegar mediante una barra flotante.
4.  **Interacción**: Los botones permiten confirmar asistencia vía WhatsApp, abrir Google Maps o Waze, y ver la mesa de regalos.
5.  **Compartir Momentos**: Los invitados escanean el QR al final de la invitación para ir a la *Smart Landing* y subir sus propias fotos del evento.

## 📁 Estructura del Proyecto

```text
├── css/
│   ├── styles.css        # Estilos principales de la invitación
│   └── smartlanding.css  # Estilos ligeros para la página de fotos
├── js/
│   ├── script.js         # Lógica principal, navegación y animaciones
│   └── smartlanding.js   # Lógica de subida a Cloudinary y galería
├── index.html            # Punto de entrada principal
├── smartlanding.html     # Página de subida de fotos para invitados
├── qr.png                # Imagen estática del código QR
├── sobre.mp4             # Video de apertura
├── music.mp3             # Música de fondo
└── [imágenes]            # Assets visuales (PNG, JPG, WEBP)
```

## 💻 Cómo Empezar

### Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/nombre-del-repo.git
cd nombre-del-repo
```

### Despliegue en GitHub Pages
1. Sube el código a tu repositorio de GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona la rama `main` y la carpeta `/root`.
4. ¡Tu invitación estará lista en un par de minutos!

---
*Desarrollado con ❤️ para momentos inolvidables.*
