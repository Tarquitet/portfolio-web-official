/**
 * js/utils.js
 * Utilidades compartidas y centralizadas.
 */

window.Utils = {
  /**
   * 1. RESOLUCIÓN DE RUTAS (SMART PATH)
   * Construye la ruta de la imagen basada en la categoría y configuración.
   */
  getSmartPath: (fileName, category = 'DEFAULT', defaultExt = '.avif') => {
    if (!fileName) return '';

    // A. Si es link externo o data base64, devolver tal cual
    if (fileName.includes('://') || fileName.startsWith('data:')) return fileName;

    // B. Obtener configuración de rutas
    // Aseguramos que existan los objetos para evitar errores si projects.js falla
    const projConfig = typeof PROJECT_CONFIG !== 'undefined' ? PROJECT_CONFIG.paths : {};
    const cvConfig = window.cvData && window.cvData.config ? window.cvData.config : {};

    // C. Determinar Carpeta Base
    let basePath = '../assets/images/'; // Fallback por defecto

    if (category === 'PORTFOLIO') basePath = cvConfig.portfolioPath || projConfig.DEFAULT || basePath;
    else if (category === 'PROFILE') basePath = cvConfig.profilePath || basePath;
    else if (projConfig[category]) basePath = projConfig[category];
    else basePath = projConfig.DEFAULT || basePath;

    // D. Manejo de Extensión
    // Si ya tiene extensión (ej: .png), se deja. Si no, se pone la default (.avif)
    const hasExt = fileName.includes('.');
    const finalName = hasExt ? fileName : `${fileName}${defaultExt}`;

    return `${basePath}${finalName}`;
  },

  /**
   * 2. SISTEMA DE RESPALDO DE IMÁGENES (CASCADA)
   * Orden: AVIF -> WEBP -> JPG -> PNG
   */
  handleImgError: (img) => {
    const currentSrc = img.src;
    if (img.dataset.tried === 'all') return;

    let nextExt = '';
    if (currentSrc.endsWith('.avif')) nextExt = '.webp';
    else if (currentSrc.endsWith('.webp')) nextExt = '.jpg';
    else if (currentSrc.endsWith('.jpg')) nextExt = '.png';
    else {
      img.dataset.tried = 'all';
      // Mantiene el espacio pero baja la opacidad para no ensuciar el diseño
      img.style.opacity = '0.3';
      img.style.filter = 'grayscale(100%)';
      return;
    }

    // Reemplazar extensión
    const dotIndex = currentSrc.lastIndexOf('.');
    if (dotIndex !== -1) {
      const basePath = currentSrc.substring(0, dotIndex);
      img.src = basePath + nextExt;
    }
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
