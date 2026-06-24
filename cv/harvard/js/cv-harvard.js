document.addEventListener('DOMContentLoaded', () => {
  const d = window.cvData;
  if (!d) return console.error('No se encontró cv_data.js');
  document.getElementById('lbl-profile').textContent = d.labels.profile;
  document.getElementById('lbl-education').textContent = d.labels.education;
  document.getElementById('lbl-projects').textContent = d.labels.projects;
  document.getElementById('lbl-soft').textContent = d.labels.softSkills + ':';
  document.getElementById('lbl-tech').textContent = d.labels.techSkills + ':';
  document.getElementById('lbl-languages').textContent = d.labels.languages;
  const skillsTitle = document.getElementById('lbl-skills-master');
  if (skillsTitle) skillsTitle.textContent = d.labels.skillsTitle || 'Habilidades y Tecnologías';
  const softCat = document.getElementById('lbl-software-cat');
  if (softCat) softCat.textContent = (d.labels.software || 'Software') + ':';
  document.getElementById('cv-name').innerHTML = d.basics.name.replace('<br>', ' ');
  document.getElementById('cv-summary').innerHTML = d.basics.summary;
  const contactBar = document.getElementById('cv-contact-bar');
  if (contactBar && d.contact) {
    contactBar.innerHTML = '';
    const professionalContacts = d.contact.filter((item) => item.type === 'PROFESSIONAL');
    professionalContacts.forEach((item, index) => {
      const isCopy = item.link === '-';
      const content = isCopy
        ? `<span class="copyable" onclick="window.Utils.copyText('${item.text}', this)" title="Click para copiar">${item.text}</span>`
        : `<a href="${item.link}" target="_blank" class="contact-link">${item.text}</a>`;
      contactBar.innerHTML += content + (index < professionalContacts.length - 1 ? ' | ' : '');
    });
  }
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
  const renderList = (id, items) => {
    const el = document.getElementById(id);
    if (el && items) {
      const text = items.map((s) => s.name || s).join(', ');
      el.textContent = text;
    }
  };
  renderList('cv-soft-skills', d.skills.soft);
  renderList('cv-hard-skills', d.skills.hard);
  renderList('cv-tech-skills', d.skills.tech);
  renderList('cv-software-list', d.software);
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
  window.Utils.initIcons();
});
