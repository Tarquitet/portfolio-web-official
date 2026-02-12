import { CONFIG } from './config.min.js';

export class UI {
  constructor() {
    this.lenis = null; // Restauramos la propiedad
  }

  initAll() {
    this.initLoader();
    this.initCursor();
    this.initTicker();
    this.initTechTicker();
    this.initTypewriter();
    this.initThemeSwitcher();
    this.initCopyActions();
    this.initModals();

    // AQUÍ INICIAMOS LENIS
    this.initGlobalSmoothScroll();

    this.initDuolingoModal();
    this.initReadMore();
    this.initSmoothNavigation();
    this.checkColombiaEasterEgg();
    this.initProfileWipeEffect();
    this.initVisibilityControl();
    this.initHeroInteraction();
    this.initTabs();
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
    const d = window.cvData;
    if (!track || !d) return;

    const iconsBase = d.config.iconsPath;
    const allItems = [...(d.software || []), ...(d.tickerItems || [])];

    // Mantenemos tu lógica de SVGs locales
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

    track.innerHTML = Array(4).fill(tickerHTML).join(' ');
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
    if (textEl) textEl.textContent = phrases[0];

    let textInterval = setInterval(() => {
      if (textEl) textEl.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }, 120);

    let visualProgress = 0;
    let realLoadedPercent = 0;
    const imgs = Array.from(document.images);
    const total = imgs.length;
    let loadedCount = 0;

    const updateRealLoad = () => {
      loadedCount++;
      realLoadedPercent = total === 0 ? 100 : Math.floor((loadedCount / total) * 100);
    };

    if (total === 0) realLoadedPercent = 100;
    else {
      imgs.forEach((img) => {
        if (img.complete) updateRealLoad();
        else {
          img.addEventListener('load', updateRealLoad);
          img.addEventListener('error', updateRealLoad);
        }
      });
    }

    const animInterval = setInterval(() => {
      if (visualProgress < 85) {
        if (Math.random() > 0.5) visualProgress += 1;
      }
      if (realLoadedPercent > visualProgress) {
        visualProgress += (realLoadedPercent - visualProgress) * 0.2;
      }
      if (realLoadedPercent >= 100) visualProgress += 4;
      if (visualProgress > 100) visualProgress = 100;

      if (num) {
        const val = Math.floor(visualProgress);
        num.textContent = val;
        num.style.setProperty('--progress', val + '%');
      }
      if (bar) bar.style.width = visualProgress + '%';

      if (visualProgress >= 100) {
        clearInterval(animInterval);
        clearInterval(textInterval);
        if (textEl) {
          textEl.textContent = 'ACCESO CONCEDIDO';
          textEl.style.color = '#2ecc71';
          textEl.style.fontWeight = 'bold';
        }
        setTimeout(() => {
          l.classList.add('zoom-out');
          document.body.classList.remove('loading');
          setTimeout(() => (l.style.display = 'none'), 1000);
        }, 500);
      }
    }, 30);
    setTimeout(() => {
      realLoadedPercent = 100;
    }, 5000);
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
      const createStream = () => {
        const offset = Math.floor(Math.random() * items.length);
        const list = [...items.slice(offset), ...items.slice(0, offset)];
        return Array(20)
          .fill(list.join(' /// ') + ' /// ')
          .join('');
      };
      t1.textContent = createStream();
      t2.textContent = createStream();
    }
  }

  initTypewriter() {
    const el = document.querySelector('.typing-text');
    const words = window.cvData?.identityData;
    if (el && words) {
      let wIdx = 0,
        cIdx = 0,
        isDel = false;
      const type = () => {
        const word = words[wIdx];
        el.textContent = word.substring(0, isDel ? cIdx - 1 : cIdx + 1);
        cIdx = isDel ? cIdx - 1 : cIdx + 1;
        let speed = isDel ? 50 : 150;
        if (!isDel && cIdx === word.length) {
          speed = 2000;
          isDel = true;
        } else if (isDel && cIdx === 0) {
          isDel = false;
          wIdx = (wIdx + 1) % words.length;
          speed = 500;
        }
        setTimeout(type, speed);
      };
      type();
    }
  }

  initCursor() {
    if (!window.matchMedia('(hover:hover)').matches) return;
    const d = document.getElementById('cursor-dot');
    const c = document.getElementById('cursor-circle');
    document.addEventListener('mousemove', (e) => {
      if (d) {
        d.style.left = e.clientX + 'px';
        d.style.top = e.clientY + 'px';
      }
      if (c)
        setTimeout(() => {
          c.style.left = e.clientX + 'px';
          c.style.top = e.clientY + 'px';
        }, 50);
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

  initTabs() {
    document.querySelectorAll('.db-btn').forEach((b) =>
      b.addEventListener('click', () => {
        document.querySelectorAll('.db-btn, .db-list').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        document.getElementById(`list-${b.dataset.cat}`)?.classList.add('active');
      }),
    );
  }

  initReadMore() {
    const bio = document.querySelector('.p-bio');
    if (!bio || !window.matchMedia('(max-width: 1024px)').matches) return;
    bio.classList.add('bio-collapsed');
    const btn = document.createElement('button');
    btn.id = 'read-more-btn';
    btn.textContent = '< LEER MÁS >';
    bio.parentNode.insertBefore(btn, bio.nextSibling);
    btn.addEventListener('click', () => {
      if (bio.classList.contains('bio-collapsed')) {
        bio.classList.remove('bio-collapsed');
        btn.textContent = '> LEER MENOS <';
      } else {
        bio.classList.add('bio-collapsed');
        btn.textContent = '< LEER MÁS >';
        document.getElementById('profile-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
