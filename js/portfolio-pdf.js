document.addEventListener('DOMContentLoaded', () => {
  // 1. VERIFICACIÓN DE SEGURIDAD
  if (!window.cvData || !window.Utils) {
    console.error('❌ Error Crítico: cvData o Utils no cargaron.');
    return;
  }

  const cv = window.cvData;
  const labels = cv.labels || {};
  const currentYear = new Date().getFullYear();

  // Helper: get sanitized section title from cvData.sections (strip html like <br/>)
  const getSectionTitle = (idx, fallback) => {
    const sections = cv.sections || [];
    const s = sections[idx] || null;
    if (!s) return fallback || '';
    const raw = s.title || '';
    const cleaned = window.Utils.stripHtmlToText
      ? window.Utils.stripHtmlToText(raw)
      : raw
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
    return `${s.index} / ${cleaned.toUpperCase()}`;
  };

  // 2. RUTAS INTELIGENTES (Usando Utils)
  const coverSrc = window.Utils.getSmartPath('cover_art', 'PORTFOLIO');
  const backSrc = window.Utils.getSmartPath('back_art', 'PORTFOLIO');

  // 3. CONFIGURACIÓN DEL CONTENEDOR
  const container = document.getElementById('magazine-target');
  if (!container) {
    console.error('❌ Error: No se encontró #magazine-target');
    return;
  }

  let totalPageCount = 0;

  // --- FUNCIÓN PARA AGREGAR PÁGINAS ---
  const addPage = (hasFooter = true) => {
    if (hasFooter) totalPageCount++;
    const sec = document.createElement('section');
    sec.className = 'magazine-page';

    const footerHtml = hasFooter
      ? `<div class="mag-footer">
           <span>TARQUITET // ${currentYear}</span>
           <span>PAG. ${totalPageCount.toString().padStart(2, '0')}</span>
         </div>`
      : '';

    sec.innerHTML = `<div class="page-content" style="${hasFooter ? '' : 'height:100%'}"></div>${footerHtml}`;
    container.appendChild(sec);
    return sec.querySelector('.page-content');
  };

  // --- FUNCIÓN PARA OBTENER ICONOS ---
  const getIcon = (type, key) => {
    const t = (key || '').toLowerCase();

    // Iconos de Arte
    if (type === 'art') {
      if (t.includes('sketch')) return '<i data-lucide="pencil"></i>';
      if (t.includes('ilustracion')) return '<i data-lucide="palette"></i>';
      return '<i data-lucide="image"></i>';
    }

    // Iconos de Software
    const soft = cv.software.find((s) => s.name.toLowerCase().includes(t.split('/')[0]));
    if (!soft) return '<i data-lucide="code-2"></i>';

    return soft.iconType === 'lucide' ? `<i data-lucide="${soft.iconName}"></i>` : `<i class="${soft.iconClass}"></i>`;
  };

  // --- FUNCIÓN MAESTRA DE RENDERIZADO ---
  const renderSection = (items, label, groupKey) => {
    if (!items || !items.length) return;

    // Agrupar items
    const groups = {};
    items.forEach((p) => {
      // Protección contra undefined
      const keys = p[groupKey];
      const k = keys && keys.length > 0 ? keys[0] : 'General';
      if (!groups[k]) groups[k] = [];
      groups[k].push(p);
    });

    let page = addPage(true);
    let count = 0;
    let newSec = true;

    for (const [subCat, elements] of Object.entries(groups)) {
      // Título de sección (solo la primera vez)
      if (newSec) {
        page.innerHTML += `<div class="section-label">${label}</div>`;
        newSec = false;
      }

      // Cinta de categoría
      const iconType = groupKey === 'tags' ? 'art' : 'tool';
      const ribbonHtml = `<div class="sub-ribbon">${getIcon(iconType, subCat)}<span> ${subCat.toUpperCase()}</span></div>`;
      page.innerHTML += ribbonHtml;

      elements.forEach((item) => {
        // Nueva página cada 4 items
        if (count >= 4) {
          page = addPage(true);
          page.innerHTML += `<div class="section-label">${label} (CONT.)</div>` + ribbonHtml;
          count = 0;
        }

        const category = groupKey === 'tags' ? 'ART' : item.category;
        const imgSrc = window.Utils.getSmartPath(item.image || item.fileName, category);

        // 🔥 PROTECCIÓN ANTI-CRASH (Aquí fallaba antes)
        // Si no tiene tools, usa array vacío. Si no tiene fecha, usa string vacío.
        const toolsSafe = item.tools || [];
        const meta = groupKey === 'tags' ? `// ${item.date || ''}` : `// ${toolsSafe.join(' / ')}`;

        // Render del Item
        page.innerHTML += `
            <article class="project-container">
                <div class="img-block">
                    <img src="${imgSrc}" alt="${item.title}" onerror="window.Utils.handleImgError(this)">
                </div>
                <div class="info-block">
                    <div class="p-title-ribbon">${item.title}</div>
                    <div class="info-card">
                        <div class="p-meta">${meta}</div>
                        <p class="p-desc">${item.desc}</p>
                    </div>
                </div>
            </article>`;
        count++;
      });
    }
  };

  // --- EJECUCIÓN ---

  // A. PORTADA
  const p1 = addPage(false);
  p1.innerHTML = `
    <div class="cover-layout">
      <div class="cover-vertical">> TARQUITET</div>
      <div class="cover-main">
        <div class="cover-img">
            <img src="${coverSrc}" alt="Cover" onerror="window.Utils.handleImgError(this)">
        </div>
        <div style="border-top:5px solid var(--text); padding-top:15px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
             <div style="font-weight:900; font-size:16pt;">${cv.basics.name.replace('<br>', ' ')}</div>
             <div style="color:var(--accent); font-family:var(--f-code); font-size:10pt;">${cv.basics.role.toUpperCase()}</div>
          </div>
          <div style="text-align:right; font-family:var(--f-code); font-size:8.5pt;">EDITION // ${currentYear}<br>BEST OF THE YEAR</div>
        </div>
      </div>
    </div>`;

  // B. SECCIONES (AQUÍ ESTÁ LA SOLUCIÓN DE "FALTAN PÁGINAS")

  // 1. Obtenemos TODO el portafolio (sin filtrar universidad)
  // Obtener portafolio excluyendo videos y proyectos universitarios (PDF no incluye VIDEO ni UNIVERSITY)
  const port = (window.mainPortfolio || []).filter((p) => p.category !== 'VIDEO' && p.context !== 'UNIVERSITY');
  const gallery = window.galleryData || [];

  // 2. Renderizar DEV (usa title de sections[0])
  renderSection(
    port.filter((p) => p.category === 'DEV'),
    getSectionTitle(0, '01 / DEVELOPMENT'),
    'tools',
  );

  // 3. Renderizar DESIGN (usa title de sections[2] - UX / UI)
  // Append "& UI" only if necessary; prefer the sanitized section title
  renderSection(
    port.filter((p) => p.category === 'DESIGN'),
    getSectionTitle(2, '02 / DESIGN & UI'),
    'tools',
  );

  // 4. VIDEO: excluido del PDF (no renderizamos sección de video)

  // 5. Renderizar ARTE (usa title de sections[3])
  renderSection(gallery, getSectionTitle(3, '04 / VISUAL ARTS'), 'tags');

  // C. CONTRAPORTADA
  const pLast = addPage(false);
  const linksHtml = cv.contact
    .map((c) => {
      const style =
        'display:block; font-family:var(--f-code); font-size:8.5pt; color:rgba(242,240,233,0.7); text-decoration:none; margin-bottom:10px; border-bottom:1px solid rgba(242,240,233,0.1); padding-bottom:2px; transition:0.3s;';
      if (c.link && c.link !== '-') {
        return `<a href="${c.link}" target="_blank" style="${style} cursor:pointer;">${c.text.toUpperCase()} ↗</a>`;
      }
      return `<div onclick="window.Utils.copyText('${c.text}', this)" title="Copiar" style="${style} cursor:copy;">${c.text.toUpperCase()}</div>`;
    })
    .join('');

  pLast.innerHTML = `
    <div style="display:flex; flex-direction:column; height:100%;">
        <div style="flex:1; border:2px solid var(--text); overflow:hidden; position:relative;">
            <img src="${backSrc}" style="width:100%; height:100%; object-fit:cover; filter: grayscale(60%);" onerror="window.Utils.handleImgError(this)">
        </div>
        <div class="back-thank-you">
            <h1 class="back-title">THANK YOU</h1>
            <div style="color:var(--bg); font-family:var(--f-code); margin:15px 0 25px 0; font-size:9pt;">TARQUITET.COM // ${currentYear}</div>
            <div style="display:flex; flex-direction:column; gap:5px;">${linksHtml}</div>
        </div>
    </div>`;

  // FINAL: Inicializar iconos
  if (window.Utils && window.Utils.initIcons) window.Utils.initIcons();

  // Marca para Python
  document.body.classList.add('pdf-ready');
});
