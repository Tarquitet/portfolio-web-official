// ==========================================
// 0. OPTIMIZACIÓN DE CARGA (Evitar Lag al recargar)
// ==========================================
// Esto obliga al navegador a empezar siempre arriba.
// Evita que cargue toda la página de golpe si el usuario estaba en el footer.
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INICIALIZACIÓN Y HELPERS
  // ==========================================

  // Inicializador de iconos optimizado (acepta scope)
  const initIcons = (rootElement = document) => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        root: rootElement,
        nameAttr: 'data-lucide',
        attrs: {
          class: 'lucide-icon',
        },
      });
    }
  };

  // Inicialización global
  initIcons(document);

  // Inicialización de animaciones (AOS)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      // 1. Duración: Subimos a 800ms para que la entrada sea más suave y elegante
      duration: 800,

      // 2. Once: true (Correcto, para que no moleste al subir)
      once: true,

      // 3. LA CLAVE: Offset
      // Subimos de 50 a 200.
      // Esto le dice al navegador: "No animes hasta que el usuario haya hecho
      // scroll y el elemento esté bien adentro de la pantalla (200px)".
      offset: 200,

      // 4. Easing: Añadimos una curva de velocidad para que no sea robótico
      easing: 'ease-out-quart',
    });
  }

  // ==========================================
  // 2. SISTEMA DE PROYECTOS DINÁMICO
  // ==========================================

  const slidesWrapper = document.getElementById('slides-wrapper');
  const carouselControls = document.getElementById('carousel-controls');
  const carouselContainer = document.querySelector('.carousel-container');

  let slideInterval;
  const slideDuration = 10000;

  function renderProjects() {
    if (!slidesWrapper || typeof projectsData === 'undefined') return;
    slidesWrapper.innerHTML = '';

    projectsData.forEach((project, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === 0 ? 'active' : ''}`;

      let bgContent = '';
      if (project.image) {
        bgContent = `<img src="${project.image}" class="slide-bg" loading="lazy" alt="Imagen del proyecto ${project.title}">`;
      } else {
        bgContent = `
            <div class="slide-bg-placeholder secondary-gradient slide-bg">
                <i data-lucide="${project.iconFallback}"></i>
            </div>`;
      }

      slide.innerHTML = `
        <div class="slide-content">
            <div class="slide-header">
                <div class="project-badge"><i data-lucide="${project.badgeIcon}" size="14"></i> ${project.type}</div>
                <div class="slide-number">0${index + 1}</div>
                <h3 class="slide-title">${project.title}</h3>
            </div>
            <div class="slide-footer">
                <p class="slide-desc">${project.desc}</p>
                <div class="slide-actions">
                    <a href="${project.link}" target="_blank" class="btn-slide-action">
                        Ver Proyecto <i data-lucide="external-link" size="16"></i>
                    </a>
                </div>
                <div class="slide-tags">
                    ${project.tags.map((tag) => `<span class="slide-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        ${bgContent}
      `;
      slidesWrapper.appendChild(slide);
    });

    initIcons();

    if (projectsData.length > 1) {
      if (carouselControls) carouselControls.style.display = 'flex';
      initCarouselLogic();
    } else if (carouselControls) {
      carouselControls.style.display = 'none';
    }
  }

  function initCarouselLogic() {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextheme-btn');
    const prevBtn = document.getElementById('prev-btn');
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove('active'));
      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;
      slides[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, slideDuration);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startAutoSlide();
      });
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startAutoSlide();
      });
    }

    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoSlide);
      carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    startAutoSlide();
  }

  renderProjects();

  // ==========================================
  // 3. FÍSICA LÁMPARA DE LAVA (CANVAS)
  // ==========================================
  const canvas = document.getElementById('lava-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let primaryColor, secondaryColor;

    const updateColors = () => {
      const styles = getComputedStyle(document.documentElement);
      primaryColor = styles.getPropertyValue('--primary').trim();
      secondaryColor = styles.getPropertyValue('--secondary').trim();
    };
    updateColors();

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Blob {
      constructor() {
        this.r = Math.random() * 150 + 100;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.isPrimary = Math.random() > 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.r || this.x > width + this.r) this.vx *= -1;
        if (this.y < -this.r || this.y > height + this.r) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        const color = this.isPrimary ? primaryColor : secondaryColor;
        gradient.addColorStop(0, color + 'CC'); // Opacidad alta (80%)
        gradient.addColorStop(1, color + '00'); // Transparente
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const blobs = Array.from({ length: 6 }, () => new Blob());
    let animationId;
    let isPageVisible = true;

    const animate = () => {
      if (!isPageVisible) return;
      ctx.clearRect(0, 0, width, height);
      blobs.forEach((blob) => {
        blob.update();
        blob.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isPageVisible = false;
        cancelAnimationFrame(animationId);
      } else {
        isPageVisible = true;
        animate();
      }
    });

    animate();
    window.updateLavaColors = updateColors;
  }

  // ==========================================
  // 4. COLOR PICKER & UI
  // ==========================================
  const colorOptions = document.querySelectorAll('.color-option');
  const root = document.documentElement;

  colorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      colorOptions.forEach((opt) => opt.classList.remove('active'));
      option.classList.add('active');
      const p = option.getAttribute('data-color');
      const s = option.getAttribute('data-sec');
      root.style.setProperty('--primary', p);
      root.style.setProperty('--secondary', s);
      root.style.setProperty('--accent-glow', p + '60');
      if (window.updateLavaColors) window.updateLavaColors();
    });
  });

  const scrollTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const curr = root.getAttribute('data-theme');
      const next = curr === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeIcon.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
      initIcons();
      if (window.updateLavaColors) window.updateLavaColors();
    });
  }

  const englishStat = document.getElementById('english-stat');
  if (englishStat) {
    englishStat.addEventListener('click', (e) => {
      e.stopPropagation();
      englishStat.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!englishStat.contains(e.target)) englishStat.classList.remove('active');
    });
  }

  // ==========================================
  // 5. SISTEMA DE SKILLS (CON RESIZEOBSERVER)
  // ==========================================

  const skillsGrid = document.getElementById('skills-grid');
  const skillsWrapper = document.querySelector('.skills-wrapper');
  const closeSkillBtn = document.getElementById('close-skill-btn');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');
  const detailBars = document.getElementById('detail-bars');
  const detailView = document.getElementById('skill-detail-view');

  // --- IMPLEMENTACIÓN DEL RESIZEOBSERVER (OPTIMIZACIÓN CLAVE) ---
  const resizeObserver = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      for (let entry of entries) {
        const isGridActive = !skillsWrapper.classList.contains('details-active');

        // Verificamos si debemos ajustar la altura
        if ((isGridActive && entry.target === skillsGrid) || (!isGridActive && entry.target === detailView)) {
          // CORRECCIÓN CRÍTICA:
          // 1. Usamos 'offsetHeight' en lugar de 'contentRect' para asegurar que
          //    incluimos el borde y padding de la tarjeta misma.
          // 2. Sumamos 140px:
          //    (60px padding top + 60px padding bottom + 20px extra de seguridad para la sombra)
          const exactHeight = entry.target.offsetHeight;
          skillsWrapper.style.height = exactHeight + 140 + 'px';
        }
      }
    });
  });

  if (skillsGrid) resizeObserver.observe(skillsGrid);
  if (detailView) resizeObserver.observe(detailView);

  function renderSkillsGrid() {
    if (!skillsGrid || typeof skillsData === 'undefined') return;

    const fragment = document.createDocumentFragment();

    // AHORA USAMOS EL INDEX PARA CALCULAR EL RETRASO
    skillsData.forEach((skill, index) => {
      const pill = document.createElement('div');
      pill.className = 'skill-pill-interactive';

      // --- NUEVO: AÑADIMOS ANIMACIÓN ESCALONADA ---
      pill.setAttribute('data-aos', 'fade-up'); // Animación hacia arriba
      pill.setAttribute('data-aos-delay', index * 50); // 50ms de diferencia entre cada una
      // --------------------------------------------

      pill.innerHTML = `<i data-lucide="${skill.icon}"></i><span>${skill.name}</span>`;
      pill.addEventListener('click', () => openSkillDetail(skill));
      fragment.appendChild(pill);
    });

    skillsGrid.innerHTML = '';
    skillsGrid.appendChild(fragment);

    initIcons(skillsGrid);
  }

  function openSkillDetail(skill) {
    const iconContainer = document.querySelector('.detail-icon-box');
    iconContainer.innerHTML = `<i data-lucide="${skill.icon}"></i>`;
    detailTitle.textContent = skill.name;
    detailDesc.textContent = skill.desc;

    detailBars.innerHTML = skill.details
      .map(
        (sub) => `
        <div class="skill-bar-item">
            <div class="bar-label"><span>${sub.label}</span><span>${sub.level}%</span></div>
            <div class="progress-track">
                <div class="progress-fill" style="width: 0%" data-width="${sub.level}%"></div>
            </div>
        </div>
    `
      )
      .join('');

    initIcons(detailView);
    skillsWrapper.classList.add('details-active');

    setTimeout(() => {
      const bars = document.querySelectorAll('.progress-fill');
      bars.forEach((bar) => (bar.style.width = bar.getAttribute('data-width')));
    }, 100);
  }

  if (closeSkillBtn) {
    closeSkillBtn.addEventListener('click', () => {
      skillsWrapper.classList.remove('details-active');
      // El ResizeObserver se encargará de ajustar la altura automáticamente
    });
  }

  renderSkillsGrid();

  // ==========================================
  // 6. UTILIDADES (Copy, Year, Dropdown)
  // ==========================================

  // COPIAR AL PORTAPAPELES
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout;

  const showToast = (message) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMsg.textContent = message;
    toast.classList.add('visible');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  };

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label');
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`¡${label} copiado!`);
      } catch (err) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast(`¡${label} copiado!`);
        } catch (e) {
          showToast('Error al copiar');
        }
        document.body.removeChild(textArea);
      }
    });
  });

  // AÑO FOOTER
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // DROPDOWN CV
  const cvWrapper = document.querySelector('.cv-dropdown-wrapper');
  const cvBtn = document.getElementById('cv-trigger-hero');

  if (cvWrapper && cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cvWrapper.classList.toggle('active');
      cvBtn.setAttribute('aria-expanded', cvWrapper.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
      if (cvWrapper.classList.contains('active') && !cvWrapper.contains(e.target)) {
        cvWrapper.classList.remove('active');
        cvBtn.setAttribute('aria-expanded', 'false');
      }
    });

    const cvOptions = document.querySelectorAll('.cv-option');
    cvOptions.forEach((opt) => {
      opt.addEventListener('click', () => cvWrapper.classList.remove('active'));
    });
  }

  // ==========================================
  // 7. EASTER EGG: COLOMBIA
  // ==========================================
  const colombiaText = document.getElementById('colombia-text');

  if (colombiaText) {
    const today = new Date();
    // 20 de Julio (Mes 6, Dia 20)
    const isIndependenceDay = today.getMonth() === 6 && today.getDate() === 20;

    if (isIndependenceDay) {
      colombiaText.classList.add('flag-active', 'infinite-mode');
      colombiaText.title = '¡Feliz día de la Independencia!';
    } else {
      colombiaText.addEventListener('click', () => {
        if (colombiaText.classList.contains('flag-active')) return;
        colombiaText.classList.add('flag-active');
        // Transición suave al terminar
        colombiaText.addEventListener(
          'animationend',
          () => {
            colombiaText.classList.remove('flag-active');
          },
          { once: true }
        );
      });
    }
  }

  // ==========================================
  // 8. TRAYECTORIA DINÁMICA
  // ==========================================

  function renderTrajectory() {
    const container = document.getElementById('trajectory-container');
    if (!container || typeof trajectoryData === 'undefined') return;
    container.innerHTML = '';

    trajectoryData.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'timeline-item';

      // --- NUEVO: AÑADIMOS ANIMACIÓN ESCALONADA ---
      div.setAttribute('data-aos', 'fade-left'); // Entran desde la izquierda
      div.setAttribute('data-aos-delay', index * 100); // 100ms de retraso por item
      // --------------------------------------------

      div.innerHTML = `
        <span class="timeline-date">${item.date}</span>
        <h4 class="timeline-title">${item.title}</h4>
        <p class="timeline-place">
           <i data-lucide="${item.icon}" size="14"></i> ${item.place}
        </p>
        <p class="timeline-desc">${item.desc}</p>
      `;
      container.appendChild(div);
    });

    initIcons(container);
  }

  renderTrajectory();

  // ==========================================
  // X. AUTO-ANIMACIÓN PARA ELEMENTOS ESTÁTICOS
  // ==========================================

  // 1. Hard Skills (Píldoras estáticas)
  const staticSkills = document.querySelectorAll('.skill-grid .skill-pill');
  staticSkills.forEach((skill, index) => {
    skill.setAttribute('data-aos', 'zoom-in');
    skill.setAttribute('data-aos-delay', index * 50); // Cascada rápida
  });

  // 2. Proyectos (Solo el contenedor, el contenido interno ya tiene transición CSS)
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    carousel.setAttribute('data-aos', 'fade-up');
    carousel.setAttribute('data-aos-duration', '1000');
  }

  // REFRESCAR AOS: Importante para que detecte los nuevos atributos que acabamos de poner
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 100);
});
