import { CONFIG } from './config.min.js';

export class UI {
  constructor() {
    this.lenis = null; // Restauramos la propiedad
  }

  initAll() {
    this.initLoader();
    this.initOptimizedCursor();
    this.initTicker();
    this.initTechTicker();
    this.initTypewriter();
    this.initThemeSwitcher();
    this.initCopyActions();
    this.initModals();

    // AQUÍ INICIAMOS LENIS
    this.initGlobalSmoothScroll();

    this.initDuolingoModal();
    this.initSmoothNavigation();
    this.checkColombiaEasterEgg();
    this.initProfileWipeEffect();
    this.initVisibilityControl();
    this.initHeroInteraction();
  }

  // --- 1. MOTOR DE SCROLL (LENIS) ---
  initGlobalSmoothScroll() {
    // Verificamos que la librería exista
    if (typeof Lenis === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // ESCUCHAMOS EL SCROLL (Parallax + Sticky JS)
    this.lenis.on('scroll', ({ scroll }) => {
      // A. Parallax Columnas
      document.querySelectorAll('.fast-col').forEach((c) => {
        c.style.transform = `translate3d(0, -${scroll * 0.05}px, 0)`;
      });

      // B. Sticky Sidebar (Solo Desktop)
      if (window.innerWidth > 1024) {
        document.querySelectorAll('.sticky-container').forEach((c) => {
          const title = c.querySelector('.h-card.intro');
          const track = c.querySelector('.horizontal-track');

          if (title && track) {
            // Lógica matemática original
            const limit = track.offsetHeight - title.offsetHeight - 50;
            const val = Math.max(0, Math.min(-c.getBoundingClientRect().top, limit));

            title.style.transform = `translate3d(0, ${val}px, 0)`;
          }
        });
      }
    });

    // Loop de animación
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // --- 2. NAVEGACIÓN ---
  initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href');

        if (id === '#') {
          if (this.lenis) this.lenis.scrollTo(0);
          else window.scrollTo(0, 0);
          return;
        }

        const el = document.querySelector(id);
        if (el && this.lenis) {
          this.lenis.scrollTo(el, { offset: 0, duration: 1.5 });
        }
      });
    });
  }

  // --- 3. COMPONENTES VISUALES ---

  initTechTicker() {
    const track = document.querySelector('.tech-track');
    const section = document.querySelector('.tech-ticker-section'); // El contenedor padre
    const d = window.cvData;
    if (!track || !section || !d) return;

    const iconsBase = d.config.iconsPath;
    const allItems = [...(d.software || []), ...(d.tickerItems || [])];

    // 1. Renderizado eficiente (Las 2 copias)
    const tickerHTML = allItems
      .map(
        (item) => `
      <span class="tech-item">
        ${item.name.toUpperCase()} 
        <img src="${iconsBase}${item.icon}.svg" class="ticker-icon-img" alt="${item.name}">
      </span> 
      <span class="tech-sep">///</span>
    `,
      )
      .join(' ');

    track.innerHTML = tickerHTML + tickerHTML;

    // 2. OPTIMIZACIÓN REAL: Intersection Observer
    // Le dice al navegador que vigile si la sección es visible en la pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Si la sección entra en la pantalla, corre la animación
            track.style.animationPlayState = 'running';
          } else {
            // Si el usuario hace scroll y la sección desaparece, ponle PAUSA.
            // Esto libera la Tarjeta Gráfica y ahorra batería.
            track.style.animationPlayState = 'paused';
          }
        });
      },
      {
        rootMargin: '50px', // Empieza a calcular 50px antes de que aparezca
      },
    );

    observer.observe(section);
  }

  // --- 4. UTILIDADES ---

  initDuolingoModal() {
    const t = document.getElementById('open-duo'),
      d = document.getElementById('duo-modal');
    if (!t || !d) return;
    t.addEventListener('click', () => {
      d.showModal();
      document.body.classList.add('no-scroll');
      if (this.lenis) this.lenis.stop();
    });
    d.addEventListener('close', () => {
      document.body.classList.remove('no-scroll');
      if (this.lenis) this.lenis.start();
    });
    d.addEventListener('click', (e) => {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    });
  }

  initVisibilityControl() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('is-paused');
        if (this.lenis) this.lenis.stop(); // Esto sí ahorra batería
      } else {
        document.body.classList.remove('is-paused');
        if (this.lenis) this.lenis.start();
      }
    });
  }

  // --- RESTO DE FUNCIONES (Loader, Ticker texto, etc.) ---

  initLoader() {
    const l = document.getElementById('preloader');
    const num = document.getElementById('load-num');
    const bar = document.getElementById('bar-fill');
    const textEl = document.getElementById('random-text');
    const root = document.documentElement;

    if (!l) return;

    const phrases = [
      'CARGANDO ASSETS...',
      'SINTETIZANDO...',
      'CALCULANDO VECTORES...',
      'INICIANDO MOTORES...',
      'OPTIMIZANDO...',
      'LEYENDO DATOS...',
      'DESCOMPRIMIENDO...',
      'CONECTANDO...',
      'VERIFICANDO...',
    ];

    // 1. ROTACIÓN DE FRASES (JS puro cambiando el DOM)
    let textInterval = setInterval(() => {
      if (textEl) textEl.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }, 120);

    let visualProgress = 0;

    // 2. SIMULACIÓN ORGÁNICA (Llega al 90% mientras carga)
    const animInterval = setInterval(() => {
      if (visualProgress < 90) {
        // Incremento aleatorio para que no parezca una máquina lineal
        visualProgress += Math.random() * 2;
        if (visualProgress > 90) visualProgress = 90;

        const val = Math.floor(visualProgress);
        if (num) num.textContent = val;
        if (bar) bar.style.width = val + '%';
        // Actualizamos la variable para el efecto "Líquido" del CSS
        root.style.setProperty('--progress', val + '%');
      }
    }, 50);

    // 3. FINALIZACIÓN REAL (Cuando window.load confirma que todo bajó)
    window.addEventListener('load', () => {
      clearInterval(animInterval);

      // Tramo final rápido del 90 al 100%
      let finalStep = visualProgress;
      const finish = setInterval(() => {
        finalStep += 2;
        const val = Math.min(Math.floor(finalStep), 100);

        if (num) num.textContent = val;
        if (bar) bar.style.width = val + '%';
        root.style.setProperty('--progress', val + '%');

        if (val >= 100) {
          clearInterval(finish);
          clearInterval(textInterval);

          if (textEl) {
            textEl.textContent = 'ACCESO CONCEDIDO';
            textEl.style.color = '#2ecc71';
            textEl.style.fontWeight = 'bold';
          }

          // Animación de salida "Portal Zoom"
          setTimeout(() => {
            l.classList.add('zoom-out');
            document.body.classList.remove('loading');
            setTimeout(() => (l.style.display = 'none'), 1000);
          }, 500);
        }
      }, 20);
    });
  }

  getCombinedTickerData() {
    if (!window.cvData) return [];
    const softNames = (window.cvData.software || []).map((s) => s.name);
    const manualItems = (window.cvData.tickerItems || []).map((i) => (typeof i === 'object' ? i.name : i));
    return [...new Set([...softNames, ...manualItems].map((i) => i.toUpperCase()))];
  }

  initTicker() {
    const items = this.getCombinedTickerData();
    const t1 = document.getElementById(CONFIG.DOM.tickers.t1);
    const t2 = document.getElementById(CONFIG.DOM.tickers.t2);

    if (t1 && t2 && items.length > 0) {
      // 1. Unimos las palabras una sola vez
      const singleText = items.join(' /// ') + ' /// ';

      // 2. Lo duplicamos exactamente 1 vez para que encaje con tu CSS de translateY(-50%)
      const loopText = singleText + singleText;

      t1.textContent = loopText;
      t2.textContent = loopText;

      // 3. El truco estático: Desfasamos el tiempo de tu animación de 60s
      t1.style.animationDelay = `-${Math.random() * 60}s`;
      t2.style.animationDelay = `-${Math.random() * 60}s`;
    }
  }

  initTypewriter() {
    const el = document.querySelector('.typing-text');
    const words = window.cvData?.identityData; // Usamos tus datos de cv_data.min.js

    if (!el || !words) return;

    let index = 0;

    const runCycle = () => {
      const word = words[index];
      el.textContent = word;
      el.style.setProperty('--n-chars', word.length);

      // 1. INICIAR ESCRITURA
      el.classList.remove('is-erasing');
      el.classList.add('is-typing');

      // 2. PAUSA AL TERMINAR DE ESCRIBIR (3 segundos: 2.5s de animación + 0.5s de lectura)
      setTimeout(() => {
        // 3. INICIAR BORRADO
        el.classList.remove('is-typing');
        el.classList.add('is-erasing');

        // 4. PASAR A LA SIGUIENTE PALABRA AL TERMINAR DE BORRAR (1.5 segundos)
        setTimeout(() => {
          index = (index + 1) % words.length;
          runCycle();
        }, 1500);
      }, 3500);
    };

    runCycle();
  }

  initOptimizedCursor() {
    const dot = document.getElementById('cursor-dot');
    const circle = document.getElementById('cursor-circle');

    if (!dot || !circle) return;

    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Usamos transform directamente como en tu ejemplo,
      // pero con translate3d para que sea ultra suave.
      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
        circle.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      });
    });
  }

  initThemeSwitcher() {
    document.querySelectorAll('.theme-btn').forEach((b) =>
      b.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach((btn) => btn.classList.remove('active'));
        b.classList.add('active');
        document.documentElement.setAttribute('data-theme', b.dataset.theme);
      }),
    );
  }

  initCopyActions() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('.copy-trigger');
      if (t && window.Utils) window.Utils.copyText(t.dataset.copy, t);
    });
  }

  initModals() {
    const btn = document.getElementById('open-duo'),
      m = document.getElementById('duo-modal');
    if (btn && m) btn.addEventListener('click', () => m.showModal());
  }

  checkColombiaEasterEgg() {
    const tag = document.getElementById('colombia-tag');
    if (!tag) return;
    const now = new Date();
    if (now.getMonth() === 6 && now.getDate() === 20) {
      tag.classList.add('colombia-mode');
      tag.title = '¡Que viva Colombia!';
    }
  }

  initProfileWipeEffect() {
    const t = document.getElementById('profile-trigger');
    if (!t) return;
    const start = (e) => {
      if (e.cancelable && e.type !== 'mousedown') e.preventDefault();
      t.classList.add('is-wiping');
    };
    const end = () => t.classList.remove('is-wiping');
    ['mousedown', 'touchstart'].forEach((e) => t.addEventListener(e, start, { passive: false }));
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach((e) => t.addEventListener(e, end));
  }

  initHeroInteraction() {
    const h = document.getElementById('hero-trigger');
    if (h)
      h.addEventListener('click', () => {
        document.getElementById('profile-section')?.scrollIntoView({ behavior: 'smooth' });
        h.classList.add('brand-contrast-active');
        setTimeout(() => h.classList.remove('brand-contrast-active'), 2000);
      });
  }
}
