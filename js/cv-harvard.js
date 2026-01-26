document.addEventListener('DOMContentLoaded', () => {
  const d = window.cvData;
  if (!d) return console.error('No se encontró cv_data.js');

  // 1. Inyectar Etiquetas
  document.getElementById('lbl-profile').textContent = d.labels.profile;
  document.getElementById('lbl-education').textContent = d.labels.education;
  document.getElementById('lbl-projects').textContent = d.labels.projects;
  document.getElementById('lbl-soft').textContent = d.labels.softSkills + ':';
  document.getElementById('lbl-tech').textContent = d.labels.techSkills + ':';
  document.getElementById('lbl-languages').textContent = d.labels.languages;

  // 2. Básicos
  document.getElementById('cv-name').innerHTML = d.basics.name.replace('<br>', ' ');
  document.getElementById('cv-summary').innerHTML = d.basics.summary;

  // 3. Contacto (Usando Utils para copiar)
  const contactBar = document.getElementById('cv-contact-bar');
  if (contactBar && d.contact) {
    d.contact.forEach((item, index) => {
      const isCopy = item.link === '-';

      // AQUÍ EL CAMBIO: Usamos window.Utils.copyText
      const content = isCopy
        ? `<span class="copyable" onclick="window.Utils.copyText('${item.text}', this)" title="Click para copiar">${item.text}</span>`
        : `<a href="${item.link}" target="_blank" class="contact-link">${item.text}</a>`;

      contactBar.innerHTML += content + (index < d.contact.length - 1 ? ' | ' : '');
    });
  }

  // 4. Educación
  const eduContainer = document.getElementById('cv-education-list');
  if (eduContainer && d.education) {
    d.education.forEach((edu) => {
      eduContainer.innerHTML += `
          <div class="entry">
            <div class="entry-header"><span>${edu.title}</span> <span>${edu.date}</span></div>
            <div class="entry-sub"><span>${edu.degree}</span></div>
            ${edu.desc ? `<div class="entry-desc">${edu.desc}</div>` : ''}
          </div>`;
    });
  }

  // 5. Proyectos
  const projContainer = document.getElementById('cv-projects-list');
  if (projContainer && d.projects) {
    d.projects.forEach((proj) => {
      projContainer.innerHTML += `
          <div class="entry">
            <div class="entry-header"><span>${proj.title}</span> <span>${proj.stack}</span></div>
            <div class="entry-desc">${proj.desc}</div>
          </div>`;
    });
  }

  // 6. Skills (Mapeo de objetos a strings)
  const renderList = (id, items) => {
    const el = document.getElementById(id);
    if (el && items) {
      // Detectamos si es objeto (nuevo formato) o string (viejo formato)
      const text = items.map((s) => s.name || s).join(', ');
      el.textContent = text;
    }
  };

  renderList('cv-soft-skills', d.skills.soft);
  renderList('cv-tech-skills', d.skills.tech);
  renderList('cv-software-list', d.software);

  // 7. Idiomas
  const getLangLevel = (lang) => {
    if (lang.level) return lang.level;
    if (lang.score && lang.levelRanges) {
      const found = lang.levelRanges.find((r) => lang.score <= r.limit);
      return found ? `${found.code} - ${found.label}` : `${lang.score} pts`;
    }
    return '';
  };

  const langContainer = document.getElementById('cv-languages-list');
  if (langContainer && d.languages) {
    langContainer.textContent = d.languages.map((l) => `${l.name} (${getLangLevel(l)})`).join(' | ');
  }

  // Inicializar iconos usando Utils
  window.Utils.initIcons();
});
