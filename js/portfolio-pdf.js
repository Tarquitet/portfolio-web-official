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
  const coverSrc = window.Utils.getSmartPath('cover_art.webp', 'PORTFOLIO');
  const backSrc = coverSrc;

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

  // Datos dinámicos para la portada
  const roleText = cv.basics.role ? cv.basics.role.toUpperCase() : 'MULTIMEDIA ENGINEER';

  p1.innerHTML = `
    <div class="cover-layout">
      <div class="cover-vertical">> TARQUITET</div>
      
      <div class="cover-main">
        <div class="cover-img">
            <img src="${coverSrc}" alt="Cover" style="width:100%; height:100%; object-fit:cover;" onerror="window.Utils.handleImgError(this)">
            
            <div class="mag-overlay">
                <div style="text-align:right; font-family:var(--f-code); color:#fff; font-size:9pt; opacity:0.8;">
                    ISSUE NO. 01 // ${currentYear}
                </div>

                <div>
                    <div class="mag-headline">THE<br>ARCHITECT</div>
                    <div class="mag-sublines">> ${roleText}</div>
                    
                    <div class="barcode-strip">
                        <div class="css-barcode"></div>
                        <div style="text-align:right; color:#fff; font-family:var(--f-code); font-size:8pt;">
                            $ PRICELESS<br>EDITION: GLOBAL
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="border-top:4px solid var(--text); padding-top:10px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
             <div style="font-weight:900; font-size:14pt; line-height:1.1;">${cv.basics.name.replace('<br>', ' ')}</div>
             <div style="font-family:var(--f-code); font-size:9pt; margin-top:4px; opacity:0.7;">PORTFOLIO DOCUMENT</div>
          </div>
          <div style="text-align:right;">
             <div style="background:var(--text); color:var(--bg); padding:4px 8px; font-weight:bold; font-size:9pt;">
                CONFIDENTIAL
             </div>
          </div>
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

  // C. CONTRAPORTADA (FINAL - SOLO PRO)
  const pLast = addPage(false);

  // 1. FILTRO: Definimos qué redes son "Profesionales"
  // Solo permitimos: LinkedIn, GitHub y Correo (identificado por '@')
  const allowedNetworks = ['linkedin', 'github', '@'];

  const professionalContacts = cv.contact.filter((c) => {
    const combined = (c.text + c.link).toLowerCase();
    // Si cumple con alguna de las palabras permitidas, pasa el filtro
    return allowedNetworks.some((keyword) => combined.includes(keyword));
  });

  // 2. GENERACIÓN DE LINKS (Usando la lista filtrada)
  const linksHtml = professionalContacts
    .map((c) => {
      // Icono simple
      let icon = '>';
      const txt = c.text.toLowerCase();
      if (txt.includes('@')) icon = '@'; // Icono para email
      if (c.link.includes('linkedin')) icon = 'IN'; // Texto corto para LinkedIn
      if (c.link.includes('github')) icon = 'GIT'; // Texto corto para GitHub

      const isLink = c.link && c.link !== '-';
      const tag = isLink ? 'a' : 'div';
      const href = isLink ? `href="${c.link}" target="_blank"` : `onclick="window.Utils.copyText('${c.text}', this)"`;
      const cursor = isLink ? 'pointer' : 'copy';

      // Estilo industrial para el link
      return `
        <${tag} ${href} style="display:flex; justify-content:space-between; align-items:center; font-family:var(--f-code); font-size:10pt; color:var(--bg); text-decoration:none; border-bottom:1px solid rgba(242,240,233,0.2); padding:12px 0; cursor:${cursor}; transition:0.2s;">
            <span style="opacity:0.9; font-weight:bold;">${icon} // ${c.text.toUpperCase()}</span>
            <span style="opacity:0.5;">↗</span>
        </${tag}>`;
    })
    .join('');

  // 2. Prepara las variables dinámicas ANTES de asignar el HTML
  const letsTalk = cv.labels.letsTalk || "LET'S TALK.";
  const rights = cv.labels.rights || 'ALL RIGHTS RESERVED.';
  const hire = cv.labels.hire || 'AVAILABLE FOR HIRE';
  const shutdown = cv.labels.shutdown || 'SYSTEM SHUTDOWN';

  // 3. HTML ESTRUCTURAL DE LA CONTRAPORTADA
  pLast.innerHTML = `
    <div style="display:flex; flex-direction:column; height:100%; position:relative;">

        <div style="flex:1; border:2px solid var(--text); overflow:hidden; position:relative; background:#000;">
            <img src="${backSrc}" alt="Back Cover" style="width:100%; height:100%; object-fit:cover; opacity:0.5;" onerror="window.Utils.handleImgError(this)">

            <div style="position:absolute; bottom:55px; left:20px; color:#fff; font-family:var(--f-code); font-size:8pt; opacity:0.8;">
                /// ${shutdown}<br> /// EXECUTION COMPLETE
            </div>
            
            <div style="position:absolute; bottom:55px; right:20px; background:var(--accent); color:#fff; padding:5px 10px; font-family:var(--f-code); font-size:8pt; font-weight:bold;">
                ● ${hire} </div>
        </div>

        <div class="back-thank-you" style="padding-top:30px;">

            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:30px;">
                <h1 class="back-title" style="font-size:45pt; margin:0; line-height:0.9;">${letsTalk.replace(' ', '<br>')}</h1>

                <div style="text-align:right; font-family:var(--f-code); color:var(--bg); opacity:0.5; font-size:8pt;">
                    ${cv.basics.name}<br>
                    ${roleText} </div>
            </div>

            <div style="margin-bottom:30px;">
                ${linksHtml}
            </div>

            <div style="border-top: 1px solid rgba(242,240,233,0.3); padding-top: 20px; margin-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; font-family: var(--f-code); font-size: 10pt; color: var(--bg); text-align: left; opacity: 1;">
                
                <div style="line-height: 1.5;">
                    <a href="https://web.tarquitet.com" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: 900; font-size: 13pt; border-bottom: 2px solid var(--accent); padding-bottom: 2px; display: inline-block; margin-bottom: 4px;">
                        WEB.TARQUITET.COM
                    </a><br>
                    <span style="opacity: 0.9;">PORTFOLIO_V2 // BOGOTÁ, COLOMBIA</span>
                </div>

                <div style="text-align: right; line-height: 1.5; opacity: 0.9;">
                    © ${currentYear} ${rights}<br>
                    <span style="font-weight: bold; color: var(--accent);">END OF FILE.</span>
                </div>

            </div>

        </div>
    </div>`;

  // FINAL: Inicializar iconos
  if (window.Utils && window.Utils.initIcons) window.Utils.initIcons();

  // Marca para Python
  document.body.classList.add('pdf-ready');
});
