# Portafolio Web — Tarquitet

Bienvenido al portafolio web de **David Josué Pinto Gómez (Tarquitet)**. Este repositorio contiene una página web responsive que presenta mi trabajo como Ingeniero en Multimedia: currículums en distintos estilos, un portafolio interactivo y recursos para generar una versión PDF imprimible.

## Descripción

El proyecto está pensado para mostrar proyectos, habilidades y experiencia profesional de forma clara y accesible. Los contenidos principales se generan a partir de datos centralizados en `js/cv_data.js`, lo que facilita la personalización.

## Características

- Múltiples formatos de CV (Harvard, Artístico).
- Versión PDF del portafolio (generada desde el HTML).
- Diseño responsive (desktop, tablet y móvil).
- Tema claro/oscuro con selector integrado.
- Archivos optimizados y minificados para mejor rendimiento.
- Datos y contenidos centralizados en JavaScript para fácil mantenimiento.

## Tecnologías

- HTML5
- CSS3 (responsive)
- JavaScript (ES6+)
- Fuentes: Google Fonts (Inter, JetBrains Mono)
- Iconos: Lucide, Devicon

Herramientas utilizadas: Figma, Photoshop, Unity, VS Code, GitHub.

## Estructura del proyecto

La siguiente vista muestra la estructura principal del repositorio en formato árbol. Los nombres y subcarpetas ayudan a localizar recursos y entradas principales.

```text
Pagina-Porafolio/
├─ assets/
│  ├─ fonts/                    # Tipografías (Inter, JetBrains Mono, etc.)
│  ├─ ico/                      # Favicons y site.webmanifest
│  │  └─ icons/                 # Iconos utilizados
│  └─ images/                   # Imágenes del portafolio
│     ├─ design/
│     ├─ dev/
│     ├─ ilustraciones/
│     ├─ portfolio/
│     └─ profile/
├─ css/                         # Hojas de estilo
│  ├─ cv-artistico.css
│  ├─ cv-harvard.css
│  ├─ portfolio-pdf.css
│  └─ styles_v2.css
├─ js/                          # Scripts y datos
│  ├─ cv_data.js                 # Datos del CV y configuración central
│  ├─ main.js
│  ├─ projects-opti.js
│  └─ modules/
│     ├─ config.js
│     ├─ renderer.js
│     └─ ui.js
├─ dev/                         # Herramientas y scripts de desarrollo
│  └─ scripts/
│     └─ html-2-pdf/            # Scripts para generar PDF desde HTML
├─ ver0/                        # Versiones antiguas (historical)
├─ ver1/
├─ ver2/
├─ cv-artistico.html            # Página CV artístico
├─ cv-harvard.html              # Página CV estilo Harvard
├─ portfolio-pdf.html           # Versión PDF imprimible del portafolio
├─ TODO.md                      # Tareas pendientes
└─ README.md                    # Documentación (este archivo)
```

> Nota: la estructura real contiene más archivos y carpetas; arriba se muestran los elementos principales.

## Instalación y uso

1. Clona el repositorio:

```bash
git clone https://github.com/pintomultimedia2002/pagina-porafolio.git
cd pagina-porafolio
```

2. Abre los archivos HTML en tu navegador para ver las versiones:

- `portfolio-pdf.html` — portafolio completo y versión imprimible.
- `cv-harvard.html` — CV estilo Harvard.
- `cv-artistico.html` — CV artístico.

3. Personalización rápida:

- Edita `js/cv_data.js` para actualizar nombre, experiencia, proyectos y enlaces.
- Sustituye o añade imágenes en `assets/images/`.
- Modifica estilos en `css/` según prefieras.

## Datos del autor

- **Autor:** David Josué Pinto Gómez (Tarquitet)
- **Profesión:** Ingeniero en Multimedia
- **Contacto:** pinto.multimedia2002@gmail.com
- **LinkedIn:** https://linkedin.com/in/pinto-gomez-david
- **GitHub:** https://github.com/pintomultimedia2002

## Estado del proyecto

Proyecto en desarrollo activo. Consulta `TODO.md` para tareas pendientes y mejoras planificadas.

## Contribuciones

Si quieres contribuir o comentar mejoras, abre un issue o contacta por email. Las contribuciones pueden incluir mejorar documentación, optimizar imágenes o proponer mejoras en la estructura de datos.

## Licencia

Proyecto personal: contenido y activos protegidos por derechos de autor (2024) — David Josué Pinto Gómez. Si deseas reutilizar partes del proyecto, contacta al autor para permiso.

---

Gracias por visitar el portafolio. Si te resulta útil, considera darle una estrella al repositorio o compartirlo.

[![Read in English](https://img.shields.io/badge/Read%20in%20English-EN-blue?style=flat-square&logo=github)](README.md)
