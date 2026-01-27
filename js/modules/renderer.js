import { CONFIG } from './config.min.js';

export class Renderer {
  constructor(data, gallery) {
    this.data = data;
    this.gallery = gallery;
    this.cachedVideos = null;

    // Referencia al template del HTML (asegúrate de haberlo puesto en index.html)
    this.template = document.getElementById('uni-card-template');
  }

  renderAll() {
    // 1. Generar la estructura base (Sticky Containers)
    this.renderStructure();

    // 2. Renderizar contenido específico
    this.renderDev();
    this.renderVideo();
    this.renderDesign();
    this.renderGallery();
    this.renderDatabase();
    this.renderProfile();
    this.renderFooter();

    if (window.Utils) window.Utils.initIcons();
  }

  // --- HELPER: Extraer ID de YouTube desde URL ---
  _extractYoutubeId(url) {
    if (!url) return null;
    // Soporta: youtube.com/watch?v=ID, youtu.be/ID, embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // --- NUEVO: Generador de Estructura (Sticky Sections) ---
  renderStructure() {
    const root = document.getElementById(CONFIG.DOM.sectionsRoot);
    const sections = window.cvData?.sections || null;
    if (!root || !sections) return;

    // Crea el HTML de las secciones leyendo cvData.sections
    root.innerHTML = sections
      .map(
        (sect) => `
      <div class="sticky-container" id="${sect.id}">
        <div class="sticky-viewport">
          <div class="h-card intro">
            <span class="sect-idx">${sect.index}</span>
            <h2>${sect.title}</h2>
            <p>${sect.subtitle}</p>
          </div>
          <div class="horizontal-track">
            <div id="${sect.injectTarget}" class="track-content"></div>
          </div>
        </div>
      </div>
    `,
      )
      .join('');
  }

  // --- HELPER: Crear Tarjeta desde Template ---
  _createCardNode(item, type) {
    if (!this.template) return null;

    const clone = this.template.content.cloneNode(true);

    const visualBox = clone.querySelector('.uni-img-box');
    const img = clone.querySelector('.card-img');
    const title = clone.querySelector('.uni-title');
    const dateEl = clone.querySelector('.uni-date');
    const cta = clone.querySelector('.card-cta');
    const linkWrap = clone.querySelector('.card-link-wrapper');
    const badgeContainer = clone.querySelector('.card-badges-overlay');

    let imgSrc = '';
    let mainLink = item.link;
    let ctaText = 'VER PROYECTO ->';

    let badgesToShow = [];
    let dateText = '';

    // --- LÓGICA DE CONTENIDO ---
    if (type === 'VIDEO') {
      // ... (Lógica de video se mantiene igual) ...
      const videoId = item.id || this._extractYoutubeId(item.link);
      imgSrc = videoId
        ? `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`
        : window.Utils.getSmartPath(item.fileName, 'VIDEO');

      badgesToShow.push('YOUTUBE');
      dateText = item.date || '';
      ctaText = 'VER EN YOUTUBE ->';
    } else if (type === 'ART') {
      imgSrc = window.Utils.getSmartPath(item.fileName, 'ART');

      // Lógica original de Arte
      if (mainLink === '=' || !mainLink) mainLink = imgSrc;

      if (visualBox) visualBox.classList.add('is-art-mode');
      if (item.tags && item.tags.length > 0) {
        badgesToShow.push(item.tags[0].toUpperCase());
      }
      dateText = item.date || '';
      ctaText = 'VER FULLSCREEN ->';
    } else {
      // DEV & DESIGN
      imgSrc = window.Utils.getSmartPath(item.fileName, type === 'DESIGN' ? 'DESIGN' : 'DEV');

      // 🔥 LÓGICA AGREGADA AQUÍ: Soporte para '=' en Dev y Design
      if (mainLink === '=') {
        mainLink = imgSrc;
        ctaText = 'VER IMAGEN ->'; // Opcional: Cambiar texto si es imagen
      }

      const tools = item.tools || [];
      if (tools.some((t) => t.includes('HTML') || t.includes('Web'))) badgesToShow.push('WEB');
      else if (tools.some((t) => t.includes('Figma'))) badgesToShow.push('FIGMA');
      else if (tools.some((t) => t.includes('Unity'))) badgesToShow.push('UNITY');
      else if (tools.length > 0) badgesToShow.push(tools[0]);

      if (item.date) dateText = item.date;
      // Mantiene el texto por defecto si no es imagen
      if (mainLink !== imgSrc) ctaText = type === 'DESIGN' ? 'VER DISEÑO ->' : 'VER PROYECTO ->';
    }

    // --- RENDERIZADO (El resto sigue igual) ---

    if (badgeContainer && badgesToShow.length > 0) {
      badgeContainer.innerHTML = badgesToShow
        .map((tag) => `<div class="overlay-badge" data-type="${tag}">${tag}</div>`)
        .join('');
    }

    if (dateEl) dateEl.textContent = dateText;

    if (img) {
      img.src = imgSrc;
      img.alt = item.title;
      img.onerror = function () {
        window.Utils.handleImgError(this);
      };
    }

    if (title) {
      const maxLen = 40;
      if (item.title.length > maxLen) {
        title.textContent = item.title.substring(0, maxLen) + '...';
        title.title = item.title;
      } else {
        title.textContent = item.title;
        title.removeAttribute('title');
      }
    }

    // Links
    if (cta) {
      cta.href = mainLink;
      cta.textContent = ctaText;
      // Si es imagen, forzar target blank para que no cierre el portafolio
      if (mainLink === imgSrc) cta.target = '_blank';
    }
    if (linkWrap) {
      linkWrap.href = mainLink;
      linkWrap.style.display = 'block';
      linkWrap.style.width = '100%';
      linkWrap.style.height = '100%';
      if (mainLink === imgSrc) linkWrap.target = '_blank';
    }

    return clone;
  }

  // --- Renderizado SmartGrid (Responsive) ---
  // Modificamos la firma para aceptar 'hasMore' (por defecto false)
  // Reemplaza _renderSmartGrid en js/modules/renderer.js

  _renderSmartGrid(items, targetId, type, hasMore = false) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = '';
    container.className = '';

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const fragment = document.createDocumentFragment();

    // --- MODO MÓVIL (SWIPE) ---
    if (isMobile) {
      container.classList.add('mobile-swipe-mode');

      // Indicador de posición (1 / 10)
      const indicatorWrap = document.querySelector(`.swipe-indicator-wrap[data-for="${targetId}"]`);
      if (indicatorWrap) indicatorWrap.remove();

      // Si hay más, sumamos 1 al total para contar la tarjeta de Histórico
      const totalCount = items.length + (hasMore ? 1 : 0);
      const newInd = `<div class="swipe-indicator-wrap" data-for="${targetId}"><span class="swipe-indicator" id="ind-${targetId}">1 / ${totalCount}</span></div>`;
      if (container.parentElement) container.parentElement.insertAdjacentHTML('beforebegin', newInd);

      // Renderizar los 10 items
      items.forEach((item) => {
        const node = this._createCardNode(item, type);
        if (node) fragment.appendChild(node);
      });

      // INYECTAR TARJETA "VER MÁS" EN MÓVIL
      if (hasMore) {
        const seeMoreCard = this._createSeeMoreCard(true);
        fragment.appendChild(seeMoreCard);
      }

      container.appendChild(fragment);

      // Lógica del Indicador al hacer Scroll
      const indicatorEl = document.getElementById(`ind-${targetId}`);
      container.addEventListener(
        'scroll',
        () => {
          if (!indicatorEl) return;
          const index = Math.round(container.scrollLeft / (window.innerWidth * 0.92));
          // Si el usuario llega a la tarjeta extra, mostramos "HIST" en el contador
          const label = hasMore && index >= items.length ? 'HIST' : Math.min(Math.max(0, index) + 1, totalCount);
          indicatorEl.textContent = `${label} / ${totalCount}`;
        },
        { passive: true },
      );
    } else {
      // --- MODO ESCRITORIO (GRILLA / COLUMNAS) ---
      container.style.display = 'flex';
      container.style.gap = '3rem';
      container.style.marginRight = '1rem';

      const col1 = document.createElement('div');
      col1.className = 'pin-col';
      const col2 = document.createElement('div');
      col2.className = 'pin-col fast-col';

      items.forEach((item, index) => {
        const node = this._createCardNode(item, type);
        if (node) {
          if (index % 2 === 0) col1.appendChild(node);
          else col2.appendChild(node);
        }
      });

      container.appendChild(col1);
      container.appendChild(col2);

      // INYECTAR TARJETA "VER MÁS" EN ESCRITORIO
      if (hasMore) {
        const seeMoreCard = this._createSeeMoreCard(false);
        seeMoreCard.classList.remove('uni-card');
        seeMoreCard.style.width = '300px';
        seeMoreCard.style.flexShrink = '0';
        container.appendChild(seeMoreCard);
      }
    }

    if (window.Utils && window.Utils.initIcons) window.Utils.initIcons();
  }

  // --- 1. FUNCIÓN MAESTRA DE RENDERIZADO (SmartGrid) ---
  _renderSmartGrid(items, targetId, type, hasMore = false) {
    const container = document.getElementById(targetId);
    if (!container) return;

    // Limpiamos el contenedor
    container.innerHTML = '';
    container.className = '';

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const fragment = document.createDocumentFragment();

    // --- MODO MÓVIL (SWIPE / CARRUSEL) ---
    if (isMobile) {
      container.classList.add('mobile-swipe-mode');

      // REGLA DE ORO: En móvil SIEMPRE mostramos el botón al final
      // (Para que el usuario siempre tenga la opción de ir al histórico fácil)
      const showSeeMore = true;

      // Ajustamos el contador (1 / Total + 1)
      const totalCount = items.length + (showSeeMore ? 1 : 0);

      // Eliminamos indicador viejo si existe y creamos uno nuevo
      const indicatorWrap = document.querySelector(`.swipe-indicator-wrap[data-for="${targetId}"]`);
      if (indicatorWrap) indicatorWrap.remove();

      const newInd = `<div class="swipe-indicator-wrap" data-for="${targetId}"><span class="swipe-indicator" id="ind-${targetId}">1 / ${totalCount}</span></div>`;
      if (container.parentElement) container.parentElement.insertAdjacentHTML('beforebegin', newInd);

      // A. Renderizar los proyectos
      items.forEach((item) => {
        const node = this._createCardNode(item, type);
        if (node) fragment.appendChild(node);
      });

      // B. Renderizar el botón final (Siempre en móvil)
      if (showSeeMore) {
        const seeMoreCard = this._createSeeMoreCard(true);
        fragment.appendChild(seeMoreCard);
      }

      container.appendChild(fragment);

      // Evento Scroll para actualizar el numerito (1/5)
      const indicatorEl = document.getElementById(`ind-${targetId}`);
      container.addEventListener(
        'scroll',
        () => {
          if (!indicatorEl) return;
          const index = Math.round(container.scrollLeft / (window.innerWidth * 0.92));
          const label = index >= items.length ? 'HIST' : Math.min(Math.max(0, index) + 1, totalCount);
          indicatorEl.textContent = `${label} / ${totalCount}`;
        },
        { passive: true },
      );
    } else {
      // --- MODO ESCRITORIO (GRILLA + BOTÓN ABAJO) ---

      // 1. Configuramos el contenedor principal en formato vertical (Columna)
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '3rem'; // Espacio entre la grilla y el botón de abajo

      // 2. Creamos un sub-contenedor para las dos columnas (La grilla)
      const gridWrapper = document.createElement('div');
      gridWrapper.style.display = 'flex';
      gridWrapper.style.gap = '3rem';
      gridWrapper.style.marginRight = '1rem';

      const col1 = document.createElement('div');
      col1.className = 'pin-col';
      const col2 = document.createElement('div');
      col2.className = 'pin-col fast-col';

      // Llenamos las columnas con los proyectos
      items.forEach((item, index) => {
        const node = this._createCardNode(item, type);
        if (node) {
          if (index % 2 === 0) col1.appendChild(node);
          else col2.appendChild(node);
        }
      });

      // Insertamos las columnas en el sub-contenedor
      gridWrapper.appendChild(col1);
      gridWrapper.appendChild(col2);

      // 3. Añadimos la grilla al contenedor principal
      container.appendChild(gridWrapper);

      // 4. Añadimos el botón DEBAJO de la grilla (si hay más proyectos)
      if (hasMore) {
        const seeMoreCard = this._createSeeMoreCard(false);
        seeMoreCard.classList.remove('pin-col-item'); // Quitamos clases de columna

        // Ajustes para que el botón ocupe todo el ancho inferior
        seeMoreCard.style.width = '100%';
        seeMoreCard.style.marginRight = '1rem';

        container.appendChild(seeMoreCard);
      }
    }

    // Reiniciar íconos (Lucide)
    if (window.Utils && window.Utils.initIcons) window.Utils.initIcons();
  }

  // --- 2. HELPER PARA CREAR LA TARJETA DEL BOTÓN ---
  _createSeeMoreCard(isMobile) {
    const template = document.getElementById('see-more-template');
    if (!template) return null;

    // 1. Clonar el contenido del template
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('a');

    // 2. Ajustes condicionales según el dispositivo
    if (!isMobile) {
      // En escritorio NO es una tarjeta normal, es un contenedor de ancho completo
      card.classList.remove('uni-card');
      card.style.width = '100%';
      card.style.marginRight = '1rem';
    } else {
      // En móvil forzamos el Aspect Ratio 16:9
      card.style.cssText = 'display: flex; height: auto; aspect-ratio: 16/9; width: 85vw;';
    }

    return card;
  }

  // --- SECCIONES INDIVIDUALES ---
  renderDev() {
    // 1. Filtrar todos los posibles
    const allItems = this.data.filter((p) => 'DEV' === p.category && p.context !== 'UNIVERSITY');

    // 2. Detectar si hay más de 10
    const limit = 8;
    const hasMore = allItems.length > limit;

    // 3. Cortar solo los 10 primeros para mostrar
    const dataToShow = allItems.slice(0, limit);

    // 4. Renderizar pasando el flag 'hasMore'
    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.prof, 'DEV', hasMore);
  }

  renderDesign() {
    const allItems = this.data.filter((e) => 'DESIGN' === e.category && e.context !== 'UNIVERSITY');

    const limit = 8;
    const hasMore = allItems.length > limit;
    const dataToShow = allItems.slice(0, limit);

    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.ux, 'DESIGN', hasMore);
  }

  // --- HELPER: Extraer ID de YouTube (AHORA CON SOPORTE SHORTS) ---
  _extractYoutubeId(url) {
    if (!url) return null;
    // Agregado 'shorts/' a la expresión regular
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  async renderVideo() {
    // 1. OBTENER VIDEOS MANUALES (Desde projects-opti.js)
    // Filtramos categoría VIDEO y excluimos UNIVERSITY (para que salgan los PERSONAL y PROFESSIONAL)
    const manualVideos = this.data
      .filter((p) => p.category === 'VIDEO' && p.context !== 'UNIVERSITY')
      .map((p) => ({
        ...p,
        id: this._extractYoutubeId(p.link), // Ahora detectará el ID del Short
        date: p.date || '2023-01-01', // Fecha fallback
        isManual: true,
      }));

    // 2. OBTENER VIDEOS AUTOMÁTICOS (RSS YouTube)
    if (!this.cachedVideos) {
      let youtubeVideos = [];
      try {
        const res = await fetch(CONFIG.API.rssBase + CONFIG.API.youtubeChannel);
        const data = await res.json();

        if (data.status === 'ok') {
          youtubeVideos = data.items.map((item) => ({
            title: item.title,
            link: item.link,
            date: item.pubDate.split(' ')[0],
            category: 'VIDEO',
            id: this._extractYoutubeId(item.link),
            desc: 'Video reciente de YouTube',
            tools: ['YouTube'],
            isManual: false,
          }));
        }
      } catch (e) {
        console.warn('⚠️ Error cargando feed YouTube, mostrando solo manuales.');
        youtubeVideos = [];
      }

      // 3. FUSIÓN (Merge) - Manuales tienen prioridad sobre RSS
      const videoMap = new Map();

      // A. Primero los de YouTube
      youtubeVideos.forEach((v) => {
        if (v.id) videoMap.set(v.id, v);
      });

      // B. Sobrescribimos con los Manuales (así conservas tus descripciones personalizadas)
      manualVideos.forEach((v) => {
        if (v.id) videoMap.set(v.id, v);
      });

      // 4. Convertir a Array y Ordenar
      this.cachedVideos = Array.from(videoMap.values()).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      // Actualizar también la lista de base de datos completa si es necesario
      this.renderDatabase();
    }

    // 5. RENDERIZADO FINAL
    const allItems = this.cachedVideos || [];

    const limit = 8;
    const hasMore = allItems.length > limit;
    const dataToShow = allItems.slice(0, limit);

    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.video, 'VIDEO', hasMore);
  }

  renderGallery() {
    const allItems = [...this.gallery].sort((a, b) => new Date(b.date) - new Date(a.date));

    const limit = 8;
    const hasMore = allItems.length > limit;
    const dataToShow = allItems.slice(0, limit);

    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.media, 'ART', hasMore);
  }

  // --- HISTÓRICO / DATABASE ---
  renderDatabase() {
    const mapContext = {
      PROFESSIONAL: document.getElementById(CONFIG.DOM.lists.prof),
      UNIVERSITY: document.getElementById(CONFIG.DOM.lists.univ),
      PERSONAL: document.getElementById(CONFIG.DOM.lists.personal),
    };
    const catNames = { DEV: 'DESARROLLO', DESIGN: 'DISEÑO', VIDEO: 'AUDIOVISUAL', ART: 'ARTE', OTHER: 'OTROS' };

    Object.values(mapContext).forEach((el) => {
      if (el) el.innerHTML = '';
    });

    Object.keys(mapContext).forEach((contextKey) => {
      const container = mapContext[contextKey];
      if (!container) return;

      let items = this.data.filter((p) => p.context === contextKey);

      // Combinar datos externos (Videos y Galería) en la sección PERSONAL
      if (contextKey === 'PERSONAL') {
        if (this.cachedVideos)
          items = [...items, ...this.cachedVideos.map((v) => ({ ...v, context: 'PERSONAL', desc: 'YouTube Upload' }))];
        if (this.gallery) items = [...items, ...this.gallery.filter((g) => (g.context || 'PERSONAL') === 'PERSONAL')];
      }

      if (items.length === 0) {
        container.innerHTML =
          '<div style="padding:2rem; opacity:0.5; font-family:var(--font-tech)">// SIN REGISTROS</div>';
        return;
      }

      items.sort((a, b) => new Date(b.date || '2000') - new Date(a.date || '2000'));
      const cats = [...new Set(items.map((i) => i.category || 'OTHER'))].sort();

      cats.forEach((cat) => {
        const groupItems = items.filter((p) => (p.category || 'OTHER') === cat);
        const rowsHTML = groupItems
          .map((p) => {
            // Extracción automática de ID también para la lista
            const videoId = p.id || this._extractYoutubeId(p.link);

            let thumb = videoId
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : window.Utils.getSmartPath(p.fileName || p.image, cat);

            let linkHTML = p.link
              ? `<a href="${p.link === '=' ? thumb : p.link}" target="_blank" class="db-link">VER -></a>`
              : '';

            return `<div class="db-item">
                  <div class="db-row-header"><div class="db-title"><i data-lucide="chevron-right" class="db-icon"></i> ${p.title}</div><span class="db-meta" style="opacity:0.5">${p.date || '--'}</span></div>
                  <div class="db-content"><div class="db-inner">
                      <img src="${thumb}" class="db-preview-img" loading="lazy" onerror="window.Utils.handleImgError(this)">
                      <div class="db-text-wrap"><p class="db-desc">${p.desc || ''}</p><div class="db-action">${linkHTML}</div></div>
                  </div></div>
              </div>`;
          })
          .join('');
        container.insertAdjacentHTML(
          'beforeend',
          `<div class="db-group"><div class="db-group-header"><span>> ${catNames[cat] || cat}</span> <span>[ ${groupItems.length} ]</span></div><div class="db-group-content">${rowsHTML}</div></div>`,
        );
      });
    });
    this.initDatabaseEvents();
  }

  // --- PERFIL ---
  renderProfile() {
    const basic = window.cvData?.basics;
    if (!basic) return;
    const container = document.querySelector('.p-visual');
    if (container) {
      const secretSrc = window.Utils.getSmartPath(basic.secretImageName, 'PROFILE');
      const frontSrc = window.Utils.getSmartPath(basic.imageName, 'PROFILE');
      container.innerHTML = `<img src="${secretSrc}" class="p-img-back" alt="Egg" onerror="window.Utils.handleImgError(this)"><img src="${frontSrc}" class="p-img-front" alt="Profile" onerror="window.Utils.handleImgError(this)"><div class="colombia-tag" id="colombia-tag">BOGOTÁ, COLOMBIA 🇨🇴</div>`;
    }
    this._renderProfileStats();
  }

  _renderProfileStats() {
    if (window.cvData?.languages) {
      const [es, en] = window.cvData.languages;
      if (es) {
        document.getElementById('lang-lbl-1').textContent = es.name.toUpperCase();
        document.getElementById('lang-val-1').textContent = es.level;
      }
      if (en) {
        document.getElementById('lang-lbl-2').textContent = en.name.toUpperCase();
        let label = `${en.score} pts`;
        if (en.levelRanges) {
          const range = en.levelRanges.find((r) => en.score <= r.limit) || en.levelRanges[en.levelRanges.length - 1];
          label = `${range.code} ${range.label}`;
        }
        document.getElementById('lang-val-2').textContent = `${label}`;
        const bar = document.getElementById('duo-bar');
        const scoreEl = document.getElementById('duo-score');
        if (bar) bar.style.width = `${Math.round((en.score / en.maxScore) * 100)}%`;
        if (scoreEl)
          scoreEl.innerHTML = `<div style="font-size:2.5rem">${en.score} / ${en.maxScore}</div><div>${label}</div>`;
        if (en.modalTitle) document.getElementById('duo-title').textContent = en.modalTitle;
        if (en.modalText) document.getElementById('duo-desc').textContent = en.modalText;
      }
    }
    if (window.cvData?.skills) {
      const { hard, soft } = window.cvData.skills;
      const fill = (items, id) => {
        const el = document.getElementById(id);
        if (el && items) el.innerHTML = items.map((i) => `<li>${i.name || i}</li>`).join('');
      };
      fill(hard, 'list-hard');
      fill(soft, 'list-soft');
    }
  }

  // --- FOOTER ---
  renderFooter() {
    if (!window.cvData) return;
    const d = window.cvData;
    ['lbl-theme', 'lbl-contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = d.labels[{ 'lbl-theme': 'footerTheme', 'lbl-contact': 'footerContact' }[id]];
    });

    const contactContainer = document.getElementById('contact-inject');
    if (contactContainer && d.contact) {
      contactContainer.innerHTML =
        d.contact
          .map((c) => {
            if (c.icon === 'mail' || c.icon === 'at-sign') {
              return `<div class="c-item"><span class="c-label">${c.icon === 'mail' ? 'CORREO' : 'USUARIO'}</span><div class="c-value copy-trigger" data-copy="${c.text}">${c.text} <i data-lucide="copy" class="copy-icon"></i></div></div>`;
            }
            return '';
          })
          .join('') +
        `<div class="c-item"><span class="c-label">REDES</span><div class="social-links">` +
        d.contact
          .filter((c) => ['linkedin', 'github'].includes(c.icon))
          .map((c) => `<a href="${c.link}" target="_blank">${c.text.toUpperCase()}</a>`)
          .join('') +
        `</div></div>`;
    }
  }

  initDatabaseEvents() {
    const v = document.querySelector('.db-interface');
    if (!v) return;
    v.querySelectorAll('.db-group-header').forEach((h) => h.replaceWith(h.cloneNode(true)));
    document
      .querySelectorAll('.db-group-header')
      .forEach((h) => h.addEventListener('click', () => h.parentElement.classList.toggle('active')));
    document.querySelectorAll('.db-row-header').forEach((h) =>
      h.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = h.parentElement;
        const active = item.classList.contains('active');
        item
          .closest('.db-group-content')
          .querySelectorAll('.db-item')
          .forEach((i) => i.classList.remove('active'));
        if (!active) item.classList.add('active');
      }),
    );
  }
}
