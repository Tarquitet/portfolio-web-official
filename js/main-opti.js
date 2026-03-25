import { CONFIG } from '/js/modules/config.min.js';
import { UI } from '/js/modules/ui.min.js';
import { Renderer } from '/js/modules/renderer.min.js';

class PortfolioApp {
  constructor() {
    this.data = window.mainPortfolio || [];
    this.gallery = window.galleryData || [];
    this.ui = new UI();
    this.renderer = new Renderer(this.data, this.gallery);

    // Iniciar
    setRandomSystemTheme();
    this.init();
  }

  init() {
    try {
      this.renderer.renderAll();
      this.ui.initAll();

      let resizeTimer;
      let windowWidth = window.innerWidth; // Guardamos el ancho inicial al cargar

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          // Solo re-renderiza si el ancho real cambió
          if (window.innerWidth !== windowWidth) {
            windowWidth = window.innerWidth; // Actualizamos el nuevo ancho
            this.renderer.renderAll();
          }
        }, 200);
      });

      const yearEl = document.getElementById(CONFIG.DOM.footerYear);
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    } catch (error) {
      console.error('ERROR CRÍTICO EN MAIN:', error);
      document.body.classList.remove('loading');
      const pl = document.getElementById('preloader');
      if (pl) pl.style.display = 'none';
    }
  }
}

function setRandomSystemTheme() {
  // 1. Clasificamos tus temas basándonos en tu CSS
  const darkThemes = ['theme-fire', 'theme-industrial', 'theme-cyber'];
  const lightThemes = ['theme-bauhaus', 'theme-pop'];

  // 2. Detectamos la preferencia del sistema (modo oscuro o claro)
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 3. Elegimos el catálogo adecuado según el sistema
  const themeCatalog = isDarkMode ? darkThemes : lightThemes;

  // 4. Sorteo: Elegimos un tema al azar del catálogo seleccionado usando Math.random()
  const randomIndex = Math.floor(Math.random() * themeCatalog.length);
  const selectedTheme = themeCatalog[randomIndex];

  // 5. Aplicamos el tema a la raíz de la página (el :root o html)
  document.documentElement.setAttribute('data-theme', selectedTheme);

  // 6. Sincronizamos los botones del footer
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach((btn) => {
    // Le quitamos la clase 'active' a todos (para limpiar el que viene por defecto en HTML)
    btn.classList.remove('active');

    // Se la ponemos solo al botón que coincide con nuestro sorteo
    if (btn.dataset.theme === selectedTheme) {
      btn.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
