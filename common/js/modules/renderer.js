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
    // 2. Renderizar contenido específico
    this.renderStructure();
    this.renderMenu();
    this.renderDev();
    this.renderVideo();
    this.renderDesign();
    this.renderGallery();
    this.renderDatabase();
    this.renderProfile();
    this.renderFooter();

    if (window.Utils) window.Utils.initIcons();
  }

  _resolveImgPath(item, type) {
    // 1. Lógica de Video (YouTube)
    if (type === 'VIDEO') {
      const videoId = item.id || this._extractYoutubeId(item.link);
      return videoId
        ? `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`
        : window.Utils.getSmartPath(file, 'VIDEO');
    }

    // 2. Obtenemos el nombre. EJEMPLO: "mi-proyecto.webp"
    const file = item.img || item.fileName || item.image;
    if (!file) return '';

    // 3. Mapeo de Categoría
    const cat = type === 'ART' ? 'ART' : type === 'DESIGN' ? 'DESIGN' : 'DEV';

    // 4. Llamada a Utils.
    // Como 'file' ya tiene la extensión, Utils solo le pegará la carpeta.
    return window.Utils.getSmartPath(file, cat);
  }

  // --- HELPER: Extraer ID de YouTube desde URL ---
  _extractYoutubeId(url) {
    if (!url) return null;
    // Soporta: youtube.com/watch?v=ID, youtu.be/ID, embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  _zigZagSort(projects, limit, isArt = false) {
    const groups = {};
    projects.forEach((p) => {
      // Para DEV/DESIGN usa 'tools', para ART usa 'tags'. Si no tiene, va a 'Otros'
      const arr = isArt ? p.tags : p.tools;
      const key = arr && arr.length > 0 ? arr[0] : 'Otros';
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    const result = [];
    const keys = Object.keys(groups);
    let index = 0;
    let keepAdding = true;

    // Entrelaza 1 de cada grupo hasta llegar al límite
    while (result.length < limit && keepAdding) {
      keepAdding = false;
      for (const key of keys) {
        if (result.length >= limit) break;
        if (groups[key][index]) {
          result.push(groups[key][index]);
          keepAdding = true;
        }
      }
      index++;
    }
    return result;
  }

  async _fetchGithubRepos(username = 'tarquitet') {
    try {
      // 1. Traemos los repositorios públicos ordenados por los actualizados más recientemente
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      const repos = await res.json();

      // 2. Mapeamos cada repositorio para intentar sacarle la imagen de su README
      const githubProjects = await Promise.all(
        repos.map(async (repo) => {
          let firstImage = null;

          try {
            // Buscamos el README.md en la rama 'main' (o 'master')
            const readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/main/README.md`);
            if (readmeRes.ok) {
              const readmeText = await readmeRes.text();

              // Regex mágico: Busca ![alt](url_imagen) o <img src="url_imagen">
              const regex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["']/;
              const match = readmeText.match(regex);

              // Si encuentra un match, guardamos la URL de la imagen
              if (match) firstImage = match[1] || match[2];
            }
          } catch (e) {
            // Silencioso, si falla es porque no hay README o no hay rama main
          }

          // 3. Formateamos el objeto para que tu sistema de grillas (SmartGrid) lo entienda
          return {
            title: repo.name.replace(/-/g, ' ').toUpperCase(),
            category: 'DEV',
            context: 'PERSONAL',
            link: repo.html_url,
            // Si no encuentra imagen, le podemos poner un placeholder por defecto de tu assets
            img: firstImage || 'github_placeholder.webp',
            desc: repo.description || 'Repositorio público en GitHub',
            // El Zig-Zag lo agrupará bajo el lenguaje principal del repo
            tools: ['GITHUB', repo.language || 'CODE'],
            date: repo.updated_at.split('T')[0],
            isGithub: true,
          };
        }),
      );

      // Filtramos por si acaso quieres omitir los que definitivamente no tienen imagen
      return githubProjects;
    } catch (e) {
      console.warn('⚠️ Error cargando feed de GitHub.', e);
      return [];
    }
  }

  // --- NUEVO: Generador de Estructura (Sticky Sections) ---
  // --- 2. CONTADOR AUTOMÁTICO Y ESTRUCTURA POR ZIG ZAG + SI ESTA SOLO EN PDF O NO---
  renderStructure() {
    const root = document.getElementById(CONFIG.DOM.sectionsRoot);
    const sections = window.cvData?.sections;
    if (!root || !sections) return;

    const physicalSections = sections.filter((s) => !s.isOnlyLink);

    root.innerHTML = physicalSections
      .map((sect, index) => {
        const autoIndex = (index + 1).toString().padStart(2, '0');

        return `
        <div class="sticky-container" id="${sect.id}">
          <div class="sticky-viewport">
            <div class="h-card intro">
              <span class="sect-idx">${autoIndex}</span>
              <h2>${sect.title}</h2>
              <p>${sect.subtitle}</p>
            </div>
            <div class="horizontal-track">
              <div id="${sect.injectTarget}" class="track-content"></div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  // --- 4. TARJETAS (Corrección de Fullscreen y Enlaces) ---
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

    // 1. UNIFICACIÓN: Usamos el método central para la imagen
    let imgSrc = this._resolveImgPath(item, type);
    let mainLink = item.link;
    let ctaText = 'VER PROYECTO ->';

    let badgesToShow = [];
    let dateText = item.date || '';

    // 2. LÓGICA DE CONTENIDO Y ENLACES
    if (type === 'VIDEO') {
      badgesToShow.push('YOUTUBE');
      ctaText = 'VER EN YOUTUBE ->';
    } else if (type === 'ART') {
      // Soporte para link '=' o vacío en Arte
      if (mainLink === '=' || !mainLink) mainLink = imgSrc;

      if (visualBox) visualBox.classList.add('is-art-mode');
      if (item.tags && item.tags.length > 0) {
        badgesToShow.push(item.tags[0].toUpperCase());
      }
      ctaText = 'VER FULLSCREEN ->';
      // Dentro de _createCardNode, reemplaza el bloque 'else' final con este:
    } else {
      if (mainLink === '=') {
        mainLink = imgSrc;
        ctaText = 'VER IMAGEN ->';
      }
      const tools = item.tools || [];

      // Recorremos las herramientas (limitamos a 3 para no saturar visualmente)
      tools.slice(0, 3).forEach((tool) => {
        let badgeText = tool.toUpperCase();

        // Normalizamos nombres para que "web" o "html" muestren "WEB"
        if (tool.includes('HTML') || tool.toLowerCase().includes('web')) badgeText = 'WEB';

        // Evitamos poner el mismo badge dos veces en la misma tarjeta
        if (!badgesToShow.includes(badgeText)) {
          badgesToShow.push(badgeText);
        }
      });

      if (mainLink !== imgSrc) ctaText = type === 'DESIGN' ? 'VER DISEÑO ->' : 'VER PROYECTO ->';
    }

    // 3. RENDERIZADO DE BADGES Y FECHA
    if (badgeContainer && badgesToShow.length > 0) {
      badgeContainer.innerHTML = badgesToShow
        .map((tag) => `<div class="overlay-badge" data-type="${tag}">${tag}</div>`)
        .join('');
    }

    if (dateEl) dateEl.textContent = dateText;

    // 4. RENDERIZADO DE IMAGEN (Con el unificador)
    if (img) {
      img.src = imgSrc;
      img.alt = item.title;
      img.onerror = function () {
        this.onerror = null;
      };
    }

    // 5. RENDERIZADO DE TÍTULO (Restaurado)
    if (title && item.title) {
      const maxLen = 40;
      if (item.title.length > maxLen) {
        title.textContent = item.title.substring(0, maxLen) + '...';
        title.title = item.title;
      } else {
        title.textContent = item.title;
        title.removeAttribute('title');
      }
    }

    // 6. ASIGNACIÓN DE ENLACES (CTA y Wrapper)
    if (cta) {
      cta.href = mainLink;
      cta.textContent = ctaText;
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

  // --- 1. FUNCIÓN MAESTRA DE RENDERIZADO (SmartGrid) ---
  _renderSmartGrid(items, targetId, type, hasMore = false) {
    const container = document.getElementById(targetId);
    if (!container) return;

    // Limpiamos el contenedor
    container.innerHTML = '';
    container.className = '';

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const fragment = document.createDocumentFragment();

    // =========================================================
    // MODO MÓVIL (SWIPE / CARRUSEL) -> Botón al final del carril
    // =========================================================
    if (isMobile) {
      container.classList.add('mobile-swipe-mode');

      // 1. Mostrar siempre el botón "Ver más" en móvil (para navegar fácil)
      const showSeeMoreMobile = true;
      const totalCount = items.length + (showSeeMoreMobile ? 1 : 0);

      // 2. Indicador (1 / X)
      const indicatorWrap = document.querySelector(`.swipe-indicator-wrap[data-for="${targetId}"]`);
      if (indicatorWrap) indicatorWrap.remove();

      const newInd = `<div class="swipe-indicator-wrap" data-for="${targetId}"><span class="swipe-indicator" id="ind-${targetId}">1 / ${totalCount}</span></div>`;
      if (container.parentElement) container.parentElement.insertAdjacentHTML('beforebegin', newInd);

      // 3. Renderizar items
      items.forEach((item) => {
        const node = this._createCardNode(item, type);
        if (node) fragment.appendChild(node);
      });

      // 4. Renderizar TARJETA FINAL "Ver más"
      if (showSeeMoreMobile) {
        const seeMoreCard = this._createSeeMoreCard(true);
        fragment.appendChild(seeMoreCard);
      }

      container.appendChild(fragment);

      // 5. Evento Scroll
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
      // =========================================================
      // MODO ESCRITORIO (GRILLA) -> Botón en el Sidebar Izquierdo
      // =========================================================

      // 1. Configuración de Grilla
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

      // 2. LÓGICA DEL BOTÓN LATERAL
      // Buscamos el contenedor "padre" (sticky-viewport) para encontrar el sidebar (.h-card)
      // Estructura: .sticky-viewport > .h-card (sidebar) + .horizontal-track (donde estamos)

      const viewport = container.closest('.sticky-viewport');
      const sidebar = viewport ? viewport.querySelector('.h-card') : null;

      if (sidebar) {
        // Limpieza: Si ya existía un botón viejo (por re-render), bórralo
        const oldBtn = sidebar.querySelector('.sidebar-btn');
        if (oldBtn) oldBtn.remove();

        // Si hay más proyectos, inyectamos el botón DEBAJO del texto
        if (hasMore) {
          const btn = document.createElement('a');
          btn.className = 'sidebar-btn';
          btn.href = '#archive-section'; // El ID de tu sección de Histórico
          btn.innerHTML = 'VER MÁS PROYECTOS <i data-lucide="arrow-right"></i>';

          // Opcional: Smooth scroll manual si el href es un ancla
          btn.onclick = (e) => {
            // Si quieres un scroll suave por JS descomenta esto, si no CSS scroll-behavior sirve
            // e.preventDefault();
            // document.getElementById('archive-section').scrollIntoView({behavior: 'smooth'});
          };

          sidebar.appendChild(btn);
        }
      }
    }

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

  //RENDERIZADO MENU
  // --- 3. MENÚ DINÁMICO (Dropdowns y Enlaces) ---
  renderMenu() {
    const nav = document.querySelector('.nav-minimal');
    const sections = window.cvData?.sections;
    if (!nav || !sections) return;

    const menuItems = sections.filter((s) => s.inMenu);

    // Separamos los que van en el grupo "SERVICIOS"
    const topLevel = menuItems.filter((s) => !s.menuGroup);
    const serviciosGroup = menuItems.filter((s) => s.menuGroup === 'SERVICIOS');

    let menuHTML = '';

    topLevel.forEach((item) => {
      // LÓGICA INTELIGENTE:
      // ¿Es un link externo? (Empieza con http)
      const isExternal = item.id.startsWith('http');

      // Si es externo, usamos el ID tal cual. Si es interno, le ponemos el #.
      const link = isExternal ? item.id : `#${item.id}`;
      const target = isExternal ? 'target="_blank"' : '';

      menuHTML += `<a href="${link}" ${target}>${item.menuTitle || item.title}</a>`;

      // Inyectar el dropdown de servicios justo después del Perfil
      if (item.id === 'profile-section' && serviciosGroup.length > 0) {
        menuHTML += `
          <div class="nav-group">
            <span class="nav-trigger">SERVICIOS</span>
            <div class="nav-dropdown">
              ${serviciosGroup
                .map((s) => {
                  const subIsExt = s.id.startsWith('http');
                  const subLink = subIsExt ? s.id : `#${s.id}`;
                  const subTarget = subIsExt ? 'target="_blank"' : '';
                  return `<a href="${subLink}" ${subTarget}>${s.menuTitle || s.title}</a>`;
                })
                .join('')}
            </div>
          </div>
        `;
      }
    });

    nav.innerHTML = menuHTML;
  }

  // --- SECCIONES INDIVIDUALES ---
  async renderDev() {
    const localDev = this.data.filter((p) => !p.pdfOnly && p.category === 'DEV' && p.context !== 'UNIVERSITY');
    const localLinks = this.data.map((p) => p.link).filter((link) => link);

    let githubProjects = [];

    try {
      const res = await fetch(`https://api.github.com/users/tarquitet/repos?sort=updated&per_page=15`);
      const repos = await res.json();
      const newRepos = repos.filter((repo) => !localLinks.includes(repo.html_url));

      githubProjects = await Promise.all(
        newRepos.map(async (repo) => {
          let firstImage = null;
          try {
            const readmeRes = await fetch(`https://raw.githubusercontent.com/tarquitet/${repo.name}/main/README.md`);
            if (readmeRes.ok) {
              const readmeText = await readmeRes.text();

              // Búsqueda global de todas las imágenes en el Markdown o HTML
              const regex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["']/g;
              let match;

              // Recorremos las imágenes hasta encontrar una válida
              while ((match = regex.exec(readmeText)) !== null) {
                const url = match[1] || match[2];

                // Ignoramos escudos (badges) típicos de GitHub
                if (url && !url.includes('shields.io') && !url.includes('badge') && !url.endsWith('.svg')) {
                  // Si la imagen es una ruta local del repo (ej. "images/foto.png"), reconstruimos la URL cruda
                  if (!url.startsWith('http')) {
                    // Limpiamos el "./" por si acaso y armamos la ruta hacia raw.githubusercontent
                    firstImage = `https://raw.githubusercontent.com/tarquitet/${repo.name}/main/${url.replace(/^\.\//, '')}`;
                  } else {
                    firstImage = url;
                  }

                  break; // Encontramos la imagen buena, detenemos la búsqueda
                }
              }
            }
          } catch (e) {
            /* Falla silenciosa */
          }

          return {
            title: repo.name.replace(/-/g, ' ').toUpperCase(),
            category: 'DEV',
            context: 'PERSONAL',
            link: repo.html_url,
            img: firstImage || 'github_placeholder.webp', // Asegúrate de tener esta imagen en tus assets por si acaso
            desc: repo.description || 'Repositorio público en GitHub',
            tools: ['GITHUB', (repo.language || 'CODE').toUpperCase()],
            date: repo.updated_at.split('T')[0],
            isGithub: true,
          };
        }),
      );
    } catch (e) {
      console.warn('⚠️ Error cargando repos de GitHub:', e);
    }

    const allItems = [...localDev, ...githubProjects];
    const limit = 10;
    const hasMore = allItems.length > limit;

    const dataToShow = this._zigZagSort(allItems, limit, false);

    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.prof, 'DEV', hasMore);
  }

  renderDesign() {
    // Agregamos el filtro !p.pdfOnly
    const allItems = this.data.filter((e) => !e.pdfOnly && 'DESIGN' === e.category && e.context !== 'UNIVERSITY');
    const limit = 10;
    const hasMore = allItems.length > limit;
    // Usamos Zig-Zag
    const dataToShow = this._zigZagSort(allItems, limit, false);
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
    // 1. Filtramos los manuales ignorando los pdfOnly (por si acaso)
    const manualVideos = this.data
      .filter((p) => !p.pdfOnly && p.category === 'VIDEO' && p.context !== 'UNIVERSITY')
      .map((p) => ({
        ...p,
        id: this._extractYoutubeId(p.link),
        date: p.date || '2023-01-01',
        isManual: true,
      }));

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
            tools: ['YouTube'], // Etiqueta clave para el Zig-Zag
            isManual: false,
          }));
        }
      } catch (e) {
        console.warn('⚠️ Error cargando feed YouTube, mostrando solo manuales.');
        youtubeVideos = [];
      }

      const videoMap = new Map();
      youtubeVideos.forEach((v) => {
        if (v.id) videoMap.set(v.id, v);
      });
      manualVideos.forEach((v) => {
        if (v.id) videoMap.set(v.id, v);
      });

      this.cachedVideos = Array.from(videoMap.values()).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      this.renderDatabase();
    }

    const allItems = this.cachedVideos || [];
    const limit = 10;
    const hasMore = allItems.length > limit;

    // 2. Aplicamos el Zig-Zag a los videos (intercala 'YouTube' con tus otras herramientas)
    const dataToShow = this._zigZagSort(allItems, limit, false);

    this._renderSmartGrid(dataToShow, CONFIG.DOM.injects.video, 'VIDEO', hasMore);
  }

  renderGallery() {
    // Agregamos el filtro !p.pdfOnly
    const allItems = [...this.gallery].filter((p) => !p.pdfOnly).sort((a, b) => new Date(b.date) - new Date(a.date));
    const limit = 10;
    const hasMore = allItems.length > limit;
    // Usamos Zig-Zag (isArt = true para que lea "tags" en vez de "tools")
    const dataToShow = this._zigZagSort(allItems, limit, true);
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

      let items = this.data.filter((p) => !p.pdfOnly && p.context === contextKey);

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
            // --- AQUÍ ESTÁ LA UNIFICACIÓN ---
            // Llamamos al mismo método que usan las tarjetas de la parte superior
            let thumb = this._resolveImgPath(p, cat);

            let linkHTML = p.link
              ? `<a href="${p.link === '=' ? thumb : p.link}" target="_blank" class="db-link">VER -></a>`
              : '';

            return `<div class="db-item">
                <div class="db-row-header">
                  <div class="db-title"><i data-lucide="chevron-right" class="db-icon"></i> ${p.title}</div>
                  <span class="db-meta" style="opacity:0.5">${p.date || '--'}</span>
                </div>
                <div class="db-content">
                  <div class="db-inner">
                    <img src="${thumb}" class="db-preview-img" loading="lazy" decoding="async" onerror="window.Utils.handleImgError(this)">
                    <div class="db-text-wrap">
                      <p class="db-desc">${p.desc || ''}</p>
                      <div class="db-action">${linkHTML}</div>
                    </div>
                  </div>
                </div>
            </div>`;
          })
          .join('');
        container.insertAdjacentHTML(
          'beforeend',
          `<div class="db-group">
          <div class="db-group-header">
            <span>> ${catNames[cat] || cat}</span> 
            <span>[ ${groupItems.length} ]</span>
          </div>
          <div class="db-group-content">${rowsHTML}</div>
        </div>`,
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
      // 1. Solo obtenemos la imagen frontal
      const frontSrc = window.Utils.getSmartPath(basic.imageName, 'PROFILE');

      // 2. Generamos HTML LIMPIO: Solo una imagen y el tag de Colombia
      container.innerHTML = `
      <img src="${frontSrc}" class="p-img-front" alt="Profile" loading="lazy" decoding="async" onerror="window.Utils.handleImgError(this)">
      <div class="colombia-tag" id="colombia-tag">BOGOTÁ, COLOMBIA 🇨🇴</div>
    `;

      // 3. Aseguramos que el cursor sea el normal
      container.style.cursor = 'default';
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
    const d = window.cvData;
    const iconsBase = d.config.iconsPath; // '../assets/icons/'
    const container = document.getElementById('contact-inject');

    if (!container || !d.contact) return;

    const emailVal = d.contact.find((c) => c.icon === 'mail')?.text || '';
    const profLinks = d.contact.filter((c) => c.icon === 'linkedin' || c.icon === 'github');
    const artLinks = d.contact.filter((c) => c.type === 'ART');

    container.innerHTML = `
    <div class="c-item">
      <span class="c-label">CORREO</span>
      <div class="c-value copy-trigger" data-copy="${emailVal}">
        ${emailVal} <img src="${iconsBase}copy.svg" style="width:14px; opacity:0.5;">
      </div>
    </div>

    <div class="c-item">
      <span class="c-label">REDES ARTÍSTICAS</span>
      <div class="social-links">
        ${artLinks
          .map(
            (l) => `
          <a href="${l.link}" target="_blank" class="icon-link" title="${l.text}">
            <img src="${iconsBase}${l.icon}.svg">
          </a>
        `,
          )
          .join('')}
      </div>
    </div>

    <div class="c-item">
      <span class="c-label">REDES PROFESIONALES</span>
      <div class="social-links">
        ${profLinks.map((l) => `<a href="${l.link}" target="_blank">${l.text.toUpperCase()}</a>`).join('')}
      </div>
    </div>
  `;
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
