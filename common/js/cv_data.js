window.cvData = {
  // Configuration settings for paths and others
  config: {
    profilePath: '../assets/images/profile/',
    pdfPath: '../assets/pdf/',
    portfolioPath: '../assets/images/portfolio/',
    iconsPath: '../assets/icons/',
  },
  // Labels for different sections
  labels: {
    contact: 'Contacto',
    languages: 'Idiomas',
    softSkills: 'Habilidades',
    techSkills: 'Técnicas',
    profile: 'Perfil',
    education: 'Formación',
    projects: 'Proyectos',
    stack: 'Stack Tecnológico',
    footerTheme: 'SELECCIONA UN TEMA',
    footerContact: 'CONTACTO + REDES',
    skillsTitle: 'Habilidades y Tecnologías',
    software: 'Software',
    letsTalk: "LET'S TALK.", // Para la contraportada del PDF
    confidential: 'CONFIDENTIAL',
    hire: 'AVAILABLE FOR HIRE',
    shutdown: 'SYSTEM SHUTDOWN',
    rights: 'ALL RIGHTS RESERVED.',
  },
  // Sections configuration (moved from modules/config.js)
  /*
  sections: [
  // ... tus otras secciones
  {
    id: 'https://mi-otra-web.com', // La URL externa directamente
    title: 'MI OTRA WEB',
    inMenu: true,
    menuTitle: 'OTRA WEB',
    menuGroup: 'SERVICIOS', // Se inyecta en el dropdown de servicios
    isOnlyLink: true        // CRUCIAL: No crea sección 01, 02, etc. en la web
  },
]
  */
  sections: [
    {
      id: 'profile-section',
      title: 'PERFIL',
      subtitle: 'Sobre mí',
      inMenu: true,
      menuTitle: 'PERFIL',
      isOnlyLink: true, // Esto hace que esté en el menú pero NO cree la sección 01
    },
    {
      id: 'dev-section',
      title: 'DEVELOP<br/>CODER',
      subtitle: 'WEB | SCRIPTS | AUTOMATIZACIÓN',
      injectTarget: 'prof-inject',
      inMenu: true,
      menuTitle: 'DEVELOP',
      menuGroup: 'SERVICIOS', // Se mete al dropdown automáticamente
    },
    {
      id: 'video-section',
      title: 'VIDEOS<br/>EDIT',
      subtitle: 'YOUTUBE | SHORTS',
      injectTarget: 'video-inject',
      inMenu: true,
      menuTitle: 'VIDEO',
      menuGroup: 'SERVICIOS',
    },
    {
      id: 'ux-section',
      title: 'DISEÑO<br/>RENDERS',
      subtitle: 'Miniaturas | 3D | Logos | Fondos',
      injectTarget: 'ux-inject',
      inMenu: true,
      menuTitle: 'DISEÑO',
      menuGroup: 'SERVICIOS',
    },
    {
      id: 'https://art.tarquitet.com', // La URL externa directamente
      title: 'COMISIONES',
      inMenu: true,
      menuTitle: 'ARTE',
      menuGroup: 'SERVICIOS', // Se inyecta en el dropdown de servicios
      isOnlyLink: true, // CRUCIAL: No crea sección 01, 02, etc. en la web
    },
    {
      id: 'archive-section',
      title: 'HISTÓRICO',
      subtitle: 'Base de datos',
      inMenu: true,
      menuTitle: 'HISTÓRICO',
      isOnlyLink: true,
    },
    {
      id: 'contact', // ID del ancla del footer
      title: 'CONTACTO',
      inMenu: true,
      menuTitle: 'CONTACTO',
      isOnlyLink: true,
    },
  ],
  // Basic info about profile (me)
  basics: {
    name: 'David Josué<br>Pinto Gómez',
    role: 'Ingeniero en Multimedia',
    imageName: 'profile.webp',
    summary:
      'Ingeniero en Multimedia especializado en Producción Digital y Diseño UX/UI, con enfoque en la creación de soluciones estratégicas e innovadoras. Experto en el manejo de Adobe Creative Suite y desarrollo frontend, con capacidad comprobada para gestionar proyectos complejos desde la fase técnica hasta la postproducción. Enfocado en el uso de herramientas de IA y metodologías ágiles para optimizar flujos de trabajo y alcanzar objetivos métricos.',
  },
  // Contact details
  contact: [
    // --- COLUMNA IZQUIERDA (PROFESIONAL) ---
    { icon: 'mail', text: 'contact@tarquitet.com', link: '-', type: 'PROFESSIONAL' },
    { icon: 'globe', text: 'Portafolio Web', link: 'https://web.tarquitet.com', type: 'PROFESSIONAL' },
    { icon: 'linkedin', text: 'Linkedin', link: 'https://linkedin.com/in/pinto-gomez-david', type: 'PROFESSIONAL' },
    { icon: 'github', text: 'GitHub', link: 'https://github.com/tarquitet', type: 'PROFESSIONAL' },

    // --- COLUMNA CENTRAL (ARTÍSTICAS / CREADOR) ---
    { icon: 'youtube', text: 'YouTube', link: 'https://youtube.com/@tarquitet', type: 'ART' },
    { icon: 'vgen', text: 'VGen', link: 'https://vgen.co/tarquitet', type: 'ART' },
    { icon: 'discord', text: 'Discord', link: 'https://discord.gg/REMWQJRpnH', type: 'ART' },
    { icon: 'x', text: 'Twitter', link: 'https://twitter.com/tarquitet', type: 'ART' },
    { icon: 'artstation', text: 'ArtStation', link: 'https://artstation.com/tarquitet', type: 'ART' },
    { icon: 'deviant', text: 'DeviantArt', link: 'https://www.deviantart.com/tarquitet2002', type: 'ART' },
  ],
  // Languages data
  languages: [
    {
      name: 'Español',
      level: 'Nativo',
      code: 'ES',
      percent: 100,
    },
    {
      name: 'Inglés',
      score: 130, //PENDIENTE HACER REAL ESE PUNTAJE - EXAMENES Y A ESTUDIAR MÁS
      maxScore: 300,

      levelRanges: [
        { limit: 50, code: 'A1', label: 'Básico' },
        { limit: 100, code: 'A1', label: 'Básico' },
        { limit: 110, code: 'A2', label: 'Básico' },
        { limit: 120, code: 'A2', label: 'Básico' },
        { limit: 130, code: 'B1', label: 'Medio' },
        { limit: 140, code: 'B1', label: 'Medio' },
        { limit: 160, code: 'B2', label: 'Medio' },
        { limit: 180, code: 'B2', label: 'Medio' },
        { limit: 210, code: 'C1', label: 'Avanzado' },
        { limit: 240, code: 'C1', label: 'Avanzado' },
        { limit: 300, code: 'C2', label: 'Avanzado' },
      ],

      modalTitle: 'SOBRE EL NIVEL',
      modalText:
        'Nivel determinado según el puntaje oficial de la plataforma Slang contrastado con el Marco Común Europeo (MCER).',
    },
  ],
  // Skills data - soft, tech, hard
  skills: {
    soft: ['Creatividad e Innovación', 'Pensamiento Analítico', 'Trabajo en Equipo', 'Comunicación Estratégica'],
    hard: ['Gestión de Proyectos', 'Lógica de Programación', 'Postproducción Audiovisual', 'Estrategia Digital'],
    tech: ['Postproducción Audiovisual', 'Diseño Web (UX/UI)', 'Desarrollo de Videojuegos', 'Ilustración Digital'],
  },
  // Education history
  education: [
    {
      title: 'UNIVERSIDAD MILITAR NUEVA GRANADA',
      date: '2020 - 2026',
      degree: 'Ingeniero en Multimedia.',
      desc: 'Enfoque en desarrollo, diseño y medios audiovisuales.',
    },
    // Elimina la entrada del colegio para ganar espacio y profesionalismo
    /*{
      title: 'COLEGIO SANTA ANA',
      date: '2006 - 2019',
      degree: 'Bachiller Académico con énfasis en Sistemas.',
      desc: '',
    },*/
  ],
  // Projects completed
  projects: [
    {
      title: 'Página Web - Verdad & Fe',
      stack: 'HTML5 / CSS3 / Diseño UX',
      desc: 'Desarrollo de plataforma web responsive para contenido ministerial, priorizando la legibilidad y la navegación intuitiva para diversos grupos demográficos.',
    },
    {
      title: 'Prototipo de Videojuego 3D - UMNG',
      stack: 'Unreal Engine / Blueprints',
      desc: 'Videojuego experimental de plataformas en 3D desarrollado en Unreal Engine utilizando Blueprints para el Diplomado en Desarrollo de VideoJuegos.',
    },
    {
      title: 'Portafolio Profesional - Tarquitet',
      stack: 'JS / HTML5 / CSS3',
      desc: 'Desarrollo de portafolio personal en Vanilla JavaScript, logrando una reducción del 95% en el peso de carga de activos multimedia mediante técnicas avanzadas de compresión sin depender de librerías externas.',
    },
  ],
  // Software and tools
  software: [
    { name: 'Photoshop', icon: 'photoshop' },
    { name: 'Unity 3D', icon: 'unity' },
    { name: 'Figma', icon: 'figma' },
    { name: 'VS Code', icon: 'vscode' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Web Dev', icon: 'code' },
    { name: 'Davinci Resolve', icon: 'davinci' },
    { name: 'OBS Studio', icon: 'obs' },
    { name: 'Miro', icon: 'miro' },
    { name: 'Chat GPT', icon: 'chatgpt' },
    { name: 'Gemini', icon: 'gemini' },
    { name: 'Autodesk Maya', icon: 'maya' },
  ],
  // Ticker after profile items
  tickerItems: [
    { name: 'C#', icon: 'csharp' },
    { name: 'C++', icon: 'cpp' },
    { name: 'HTML', icon: 'html' },
    { name: 'CSS', icon: 'css' },
    { name: 'JavaScript', icon: 'js' },
    { name: 'VIDEO EDITING', icon: 'video' },
  ],
  // Typerwriter / Identity data
  identityData: [
    'PROFESIONAL ',
    'ARTIST ',
    'CONTENT CREATOR ',
    'VIDEO EDITOR ',
    'CREATIVE ',
    'DEVELOPER ',
    'PLANNER ',
    'ILUSTRATOR ',
    'MULTIMEDIA ',
    'ENGINEER ',
    'PROMPT WRITTER ',
    'COOL IDEAS ',
  ],
};
