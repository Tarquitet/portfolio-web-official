document.addEventListener('DOMContentLoaded', () => {
  const d = window.cvData;
  if (!d) return;

  // 1. Etiquetas y Textos Básicos
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };

  setTxt('lbl-contact', d.labels.contact);
  setTxt('lbl-languages', d.labels.languages);
  setTxt('lbl-soft', d.labels.softSkills);
  setTxt('lbl-tech', d.labels.techSkills);
  setTxt('lbl-profile', d.labels.profile);
  setTxt('lbl-education', d.labels.education);
  setTxt('lbl-projects', d.labels.projects);
  setTxt('lbl-stack', d.labels.stack);

  setTxt('cv-name', d.basics.name);
  setTxt('cv-role', d.basics.role);
  setTxt('cv-summary', d.basics.summary);

  // --- IMAGEN DE PERFIL (MODULARIZADA) ---
  // Usamos getSmartPath para obtener la ruta correcta (Profile Path + Nombre + .avif)
  const imgPath = window.Utils.getSmartPath(d.basics.imageName, 'PROFILE');
  const imgDiv = document.getElementById('cv-image-div');

  if (imgDiv) {
    // Limpiamos estilos de background anteriores por si acaso
    imgDiv.style.backgroundImage = 'none';
    imgDiv.style.overflow = 'hidden'; // Asegura que la imagen respete el círculo

    // Inyectamos <img> para aprovechar el sistema de fallback (AVIF -> WEBP -> JPG)
    imgDiv.innerHTML = `
        <img src="${imgPath}" 
             alt="Profile" 
             style="width: 100%; height: 100%; object-fit: cover; object-position: 40% 42%; transform: scale(1.35);" 
             onerror="window.Utils.handleImgError(this)">
      `;
  }

  // 2. Contacto
  const contactContainer = document.getElementById('cv-contact-list');
  if (contactContainer && d.contact) {
    contactContainer.innerHTML = '';
    d.contact.forEach((item) => {
      const isCopy = item.link === '-';
      // Usamos el path configurado en d.config.iconsPath
      const iconPath = `${d.config.iconsPath}${item.icon}`;

      const contentHtml = isCopy
        ? `<span class="contact-link copyable" onclick="window.Utils.copyText('${item.text}', this)">${item.text}</span>`
        : `<a href="${item.link}" target="_blank" class="contact-link">${item.text}</a>`;

      contactContainer.innerHTML += `
      <div class="contact-item">
        <img src="${iconPath}" class="contact-icon" style="width:18px; height:18px;">
        ${contentHtml}
      </div>`;
    });
  }

  // 3. Idiomas
  const langContainer = document.getElementById('cv-languages-list');
  d.languages.forEach((lang) => {
    let percent = lang.percent;
    let label = lang.level;

    if (!percent && lang.score && lang.maxScore) {
      percent = (lang.score / lang.maxScore) * 100;
      if (lang.levelRanges) {
        const found = lang.levelRanges.find((r) => lang.score <= r.limit);
        if (found) label = `${found.code} ${found.label}`;
      }
    }

    langContainer.innerHTML += `
      <div class="skill-row">
        <div class="skill-txt"><span>${lang.name}</span> <span>${label || ''}</span></div>
        <div class="progress-track">
           <div class="progress-fill" style="width: ${percent}%"></div>
           ${percent < 100 ? `<div class="progress-marker" style="left: ${percent}%"></div>` : ''}
        </div>
      </div>`;
  });

  // 4. Skills
  const renderBars = (items, containerId) => {
    const container = document.getElementById(containerId);
    if (!items || !container) return;
    items.forEach((skill) => {
      container.innerHTML += `
        <div class="skill-row">
          <div class="skill-txt"><span>${skill.name}</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: ${skill.percent}%"></div></div>
        </div>`;
    });
  };
  renderBars(d.skills.soft, 'cv-soft-skills');
  renderBars(d.skills.tech, 'cv-tech-skills');

  // 5. Educación
  const eduContainer = document.getElementById('cv-education-list');
  d.education.forEach((edu) => {
    eduContainer.innerHTML += `
      <div class="list-group">
        <div class="li-head">${edu.title} <span style="opacity:0.6; margin-left:5px; font-size:0.9em">${
          edu.date
        }</span></div>
        <div class="li-item">${edu.degree}</div>
        ${edu.desc ? `<div class="li-item">${edu.desc}</div>` : ''}
      </div>`;
  });

  // 6. Proyectos
  const projContainer = document.getElementById('cv-projects-list');
  d.projects.forEach((proj) => {
    projContainer.innerHTML += `
      <div class="list-group">
        <div class="li-head">
          <span>${proj.title}</span>
          <span style="font-size:0.8em; opacity:0.8; font-weight:400; color:#444;">// ${proj.stack}</span>
        </div>
        <div class="li-item">${proj.desc}</div>
      </div>`;
  });

  // 7. Software
  const softContainer = document.getElementById('cv-software-grid');

  if (softContainer && d.software) {
    softContainer.innerHTML = ''; // Limpiar

    // Obtener ruta base (asegurando fallback)
    const iconsBase = d.config && d.config.iconsPath ? d.config.iconsPath : '../assets/icons/';

    d.software.forEach((soft) => {
      let iconHTML = '';

      // CASO A: ICONO LOCAL (Imagen SVG/PNG)
      if (soft.iconType === 'local') {
        const fullPath = `${iconsBase}${soft.iconName}`;
        // Agregamos clase 'local-img' para controlarlo con CSS
        iconHTML = `<img src="${fullPath}" alt="${soft.name}" class="soft-icon local-img" loading="lazy" onerror="this.style.display='none'">`;
      }
      // CASO B: LUCIDE (SVG Dinámico)
      else if (soft.iconType === 'lucide') {
        const color = soft.color || '#111';
        iconHTML = `<i data-lucide="${soft.iconName}" class="soft-icon" style="color:${color}"></i>`;
      }
      // CASO C: DEVICON (Clase CSS)
      else {
        iconHTML = `<i class="${soft.iconClass} soft-icon"></i>`;
      }

      softContainer.innerHTML += `
        <div class="soft-box">
          ${iconHTML}
          <span class="soft-name">${soft.name}</span>
        </div>`;
    });

    // Reinicializar iconos al final
    if (window.Utils && window.Utils.initIcons) {
      window.Utils.initIcons();
    }
  }

  // USAMOS window.Utils.initIcons
  window.Utils.initIcons();
});
