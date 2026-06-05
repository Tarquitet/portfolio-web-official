/**
 * js/utils.js
 * Utilidades compartidas y centralizadas.
 */

window.Utils = {
  // 1. CONSTRUCCIÓN DE RUTA (SIMPLE Y DIRECTA)
  getSmartPath: (fileName, category = 'DEFAULT') => {
    if (!fileName) return '';
    // Si ya es una URL completa (https://...) o data:image, la devolvemos tal cual
    if (fileName.includes('://') || fileName.startsWith('data:')) return fileName;

    const projConfig = typeof PROJECT_CONFIG !== 'undefined' ? PROJECT_CONFIG.paths : {};
    const cvConfig = window.cvData && window.cvData.config ? window.cvData.config : {};

    // Ruta base por defecto
    let basePath = 'assets/images/';

    // Selección de carpeta según categoría (Esto SÍ es útil mantenerlo)
    if (category === 'PORTFOLIO') basePath = cvConfig.portfolioPath || projConfig.DEFAULT || basePath;
    else if (category === 'PROFILE') basePath = cvConfig.profilePath || basePath;
    else if (category === 'ART')
      basePath = '../assets/images/ilustraciones/'; // Ajusta si tu ruta es diferente
    else if (category === 'DESIGN') basePath = '../assets/images/design/';
    else if (category === 'DEV') basePath = '../assets/images/dev/';
    else if (projConfig[category]) basePath = projConfig[category];
    else basePath = projConfig.DEFAULT || basePath;

    // AQUÍ ESTÁ EL CAMBIO: Ya no agregamos extensiones. Confiamos en tu JSON.
    return `${basePath}${fileName}`;
  },

  // 2. MANEJO DE ERRORES (SIN CASCADA)
  handleImgError: function (img) {
    if (img.dataset.dead === 'true') return;
    console.warn('Imagen no encontrada o bloqueada por la API:', img.src);
    img.dataset.dead = 'true';

    // 1. Reemplazamos el src por un SVG vacío para que desaparezca el icono de "imagen rota" del navegador
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

    // 2. Le aplicamos el color gris.
    // Puedes usar un gris neutro como '#555555' o usar la variable de tus tarjetas para que cambie según el tema:
    img.style.backgroundColor = 'var(--card)';
  },

  /**
   * 3. COPIAR AL PORTAPAPELES
   */
  copyText: (text, element = null) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (element) {
            const originalText = element.innerText;
            const originalColor = element.style.color;

            element.innerText = '¡COPIADO!';
            element.style.color = '#2ecc71'; // Verde

            setTimeout(() => {
              element.innerText = originalText;
              element.style.color = originalColor;
            }, 1500);
          }

          // Notificación Toast Global (si existe en el HTML)
          const toast = document.getElementById('toast');
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
          }
        })
        .catch((err) => console.error('Error copy:', err));
    }
  },

  /**
   * 4. FORMATO DE TAGS
   */
  formatTags: (tags, limit = 2) => {
    return tags?.slice(0, limit).join(' / ').toUpperCase() || 'PROJECT';
  },

  /**
   * 5. INICIALIZAR ICONOS
   */
  initIcons: () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },
  /**
   * Strip HTML tags and convert inline breaks to spaces, collapse whitespace.
   * Returns a trimmed plain-text string.
   */
  stripHtmlToText: (html) => {
    if (!html) return '';
    // Replace <br> variants with space
    let t = html.replace(/<br\s*\/?>/gi, ' ');
    // Remove any remaining tags
    t = t.replace(/<[^>]+>/g, ' ');
    // Collapse whitespace
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  },
};
