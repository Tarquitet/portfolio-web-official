/* GUÍA DE CLASIFICACIÓN (TAXONOMÍA):
   - category: 'DEV' (Sección 01), 'DESIGN' (Sección 03), 'VIDEO' (Sección 02)
   - context:  'PROFESSIONAL', 'UNIVERSITY', 'PERSONAL' (Para el Histórico)
   - link:     Si es null o "", no saldrá botón.
*/
window.PROJECT_CONFIG = {
  paths: {
    DEV: '../assets/images/dev/', // Carpeta para categoría DEV
    DESIGN: '../assets/images/design/', // Carpeta para categoría DESIGN
    ART: '../assets/images/ilustraciones/', // Carpeta para categoría ART (Galería)
    VIDEO: '../assets/images/video/', // (Opcional si usas miniaturas locales)
    DEFAULT: '../assets/images/', // Fallback
  },
};
/* TAXONOMÍA ACTUALIZADA:
   - fileName: Solo el nombre del archivo (ej: 'tarquitet-site'). 
   - link: Si pones "=", el sistema usará la imagen como link (útil para arte).
*/
window.mainPortfolio = [
  //SECCION 1 - DEV + WEB + CODE
  {
    title: 'Página Web Ministerial',
    desc: 'Landing Page oficial para el ministerio Verdad & Fe.',
    fileName: 'verdadyfe',
    category: 'DEV',
    context: 'PROFESSIONAL',
    tools: ['HTML', 'CSS', 'Javascript', 'Frontend', 'SEO'],
    link: 'https://www.verdadyfe.org/',
  },
  {
    title: 'Tarquitet Site Oficial',
    desc: 'Página web oficial del portafolio de Tarquitet.',
    fileName: 'tarquitet-site',
    category: 'DEV',
    context: 'PROFESSIONAL',
    tools: ['HTML', 'CSS', 'Javascript', 'Portfolio', 'Frontend', 'Web Design', 'Backend'],
    link: '#',
  },
  {
    title: 'Tarquitet Old Site',
    desc: 'Anterior diseño web del portafolio oficial de Tarquitet.',
    fileName: 'tarquitet-old-site',
    category: 'DEV',
    context: 'PROFESSIONAL',
    tools: ['HTML', 'CSS', 'Javascript', 'Portfolio', 'Frontend', 'Web Design', 'Backend'],
    link: '/ver1/index.html',
  },
  {
    title: 'Builtechraft Web',
    desc: 'Página web para un proyecto personal sobre un servidor multijugador del vdeojuego de Minecraft.',
    fileName: 'Builtechraft-web-2024',
    category: 'DEV',
    context: 'PERSONAL',
    tools: ['HTML', 'CSS', 'Javascript', 'Frontend', 'Web Design', 'Minecraft', 'Web'],
    link: 'https://tarquitet.github.io/Builtechraft-Web/',
  },
  {
    title: 'App Gimnasio 3D Virtual',
    desc: 'App móvil con ejercicios en vista 360° y explicación biomecánica.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/GymApp_1_2024/refs/heads/main/Assets/prototipo-demo.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['Unity', 'C#', 'UI Mobile'],
    link: 'https://github.com/pintomultimedia2002/GymApp_1_2024',
  },
  {
    title: 'Sudoku Intelligent Solver',
    desc: 'IA que genera y resuelve Sudokus mediante Backtracking eficiente.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/Sudoku_Intelligent_Backtracking/refs/heads/master/sudokugenerado.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['C#', 'Backtracking', 'IA'],
    link: 'https://github.com/pintomultimedia2002/Sudoku_Intelligent_Backtracking',
  },
  {
    title: 'C.I.P.S Puzzle Solver',
    desc: 'Minijuego sobre IA experimental que resuelve puzzles numéricos y de imágenes.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/CIPS_Intelligent_Puzzle_Solver/refs/heads/master/puzzle-solved.jpg',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['C#', 'Heurística', 'IA'],
    link: 'https://github.com/pintomultimedia2002/CIPS_Intelligent_Puzzle_Solver',
  },
  {
    title: 'Wumpus World Agent',
    desc: 'Simulación de un Agente Racional basado en conocimiento y lógica proposicional.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/wumpus-world-javascript/refs/heads/main/src/resources/wampus.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['Javascript', 'Lógica', 'IA Clásica'],
    link: 'https://github.com/pintomultimedia2002/wumpus-world-javascript',
  },
  {
    title: 'A* Pathfinder Algorithm',
    desc: 'Implementación del algoritmo A* para búsqueda de caminos óptimos en grafos.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/A_star_algorithm_Javascript/refs/heads/main/wampus-ia.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['Javascript', 'Pathfinding', 'Algoritmos'],
    link: 'https://github.com/pintomultimedia2002/A_star_algorithm_Javascript',
  },
  {
    title: 'CarVoice Assistant',
    desc: 'Asistente virtual para vehículos con control por voz e integración web.',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/carvoice-assist/refs/heads/main/assets/asistant-2.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['HTML', 'CSS', 'Javascript', 'Frontend', 'Web Design', 'Voiceflow', 'Chatbot', 'Web'],
    link: 'https://github.com/pintomultimedia2002/carvoice-assist',
  },
  {
    title: 'Algebrain Mobile App',
    desc: 'App educativa para álgebra enfocada en la experiencia de usuario (UX).',
    fileName:
      'https://raw.githubusercontent.com/pintomultimedia2002/Algebrain-App/refs/heads/main/resources/images/algebrain-demo-4.png',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['HTML', 'CSS', 'Javascript', 'Frontend', 'Web Design', 'eLearning', 'Web App', 'Mobile', 'Web'],
    link: 'https://github.com/pintomultimedia2002/Algebrain-App',
  },
  {
    title: 'Experiencia 360° VR',
    desc: 'Experiencia de terror en Realidad Virtual renderizada en Unity.',
    fileName: 'audio-video-360',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['Unity', 'VR', 'Audio 3D', 'C#', 'Experiencia Immersiva', '360°', 'Video', 'Audio', 'VR', 'XR'],
    link: 'https://www.youtube.com/watch?v=Z8sgOhYMAl4',
  },
  {
    title: 'Simulación OpenGL 3D',
    desc: 'Minijuego de recolección simulado con físicas básicas.',
    fileName: 'unity-opengl-web',
    category: 'DEV',
    context: 'UNIVERSITY',
    tools: ['Unity', 'Simulación', '3D', 'Físicas', 'WebGL', 'Web', 'C#'],
    link: 'https://relaxed-valkyrie-75101a.netlify.app/',
  },

  /* ========================================================================
     2. DISEÑO (DESIGN) -> APARECE EN SECCIÓN 03
     ======================================================================== */
  {
    title: 'New Sporify: Sonórus',
    desc: 'Diseño de interfaz alternativa (Redesign) para Spotify.',
    fileName: 'Sonorus-Figma',
    category: 'DESIGN',
    context: 'UNIVERSITY',
    tools: ['Figma', 'UI Design', 'Prototyping', 'Redesign', 'UI', 'UX', 'Mobile Design'],
    link: 'https://www.figma.com/design/lClUfMJDAuqfEhvXN6IN2B/Untitled?node-id=0-1&t=UD8TxB4UupRydWWD-1',
  },
  {
    title: '4 Better Pets App',
    desc: 'App móvil para facilitar la adopción de mascotas.',
    fileName: '4better-pets-app',
    category: 'DESIGN',
    context: 'UNIVERSITY',
    tools: ['Figma', 'UX Research', 'Mobile Design', 'Prototyping', 'UI', 'UX', 'App Design'],
    link: 'https://www.figma.com/design/8LDG3cejNOO7Re9Z6MMrfU/4-BETTER-PETS?node-id=0-1&t=fkQtYiNLOuIEM5Uo-1',
  },
  {
    title: 'Rappi UI Redesign',
    desc: 'Propuesta de rediseño para mejorar la UX de Rappi.',
    fileName: 'RedisenoRappi-Figma',
    category: 'DESIGN',
    context: 'UNIVERSITY',
    tools: ['Figma', 'UI Kit', 'Redesign', 'UI', 'UX', 'App Design'],
    link: 'https://www.figma.com/design/W8tY2RtS3hM7B9BQjJgpiB/David-Pinto---Redise%C3%B1o-Rappi?node-id=0-1&t=UmSvMcQEsiyU7y4s-1',
  },
  {
    title: 'In-Mortal Transmedia',
    desc: 'Exploración narrativa transmedia sobre la evolución de las ideas.',
    fileName:
      'https://static.wixstatic.com/media/5d4a70_7d7ad22b0b4f4defbc347b359909bcb1~mv2.jpg/v1/fill/w_2146,h_1229,al_c,q_90,enc_avif,quality_auto/5d4a70_7d7ad22b0b4f4defbc347b359909bcb1~mv2.jpg',
    category: 'DESIGN',
    context: 'PERSONAL',
    tools: ['Storytelling', 'Wix', 'Concept Art', 'Narrative Design', 'Transmedia', 'Web Design', 'Web', 'UX'],
    link: 'https://pintodavid2002.wixsite.com/in-mortal',
  },

  /* ========================================================================
     3. VIDEOS MANUALES (VIDEO) -> APARECE EN SECCIÓN 02 (MEZCLADO)
     Estos son los videos que NO están públicos en tu canal principal
     ======================================================================== */
  {
    title: 'Planty: Video Instruccional',
    id: '1AMhkDXVkqU',
    date: '2023-05-20',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'CLIENTE',
    link: 'https://www.youtube.com/watch?v=1AMhkDXVkqU',
  },
  {
    title: 'Planty: Detrás de Cámaras',
    id: 'scgv4lL-4vk',
    date: '2023-05-25',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'CLIENTE',
    link: 'https://www.youtube.com/watch?v=scgv4lL-4vk',
  },
  {
    title: 'Iglesia Misionera Antioquia',
    id: 'zi_l5z1Yx6s',
    date: '2021-07-15',
    category: 'VIDEO',
    context: 'PERSONAL',
    channel: 'CLIENTE',
    link: 'https://www.youtube.com/watch?v=zi_l5z1Yx6s',
  },
  {
    title: 'Trailer App: Algebrain',
    id: '9rP3nJe5S4g',
    date: '2024-02-10',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'PROMO',
    link: 'https://www.youtube.com/watch?v=9rP3nJe5S4g',
  },
  {
    title: 'Comercial Parodia GymApp',
    id: 'QWK7JctMbug',
    date: '2024-01-15',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'COMERCIAL',
    link: 'https://www.youtube.com/watch?v=QWK7JctMbug',
  },
  {
    title: 'Radionovela Suspenso',
    id: 'VJC3mEY-dFU',
    date: '2023-06-10',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://www.youtube.com/watch?v=VJC3mEY-dFU',
  },
  {
    title: 'Minidocumental: Arte Electrónico',
    id: 'P4X0pvVxqVE',
    date: '2022-11-10',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'DOCU',
    link: 'https://www.youtube.com/watch?v=P4X0pvVxqVE',
  },
  {
    title: 'Brainstorming: Proyecto Brock',
    id: 'ijmfr-FB1dM',
    date: '2022-09-05',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://www.youtube.com/watch?v=ijmfr-FB1dM',
  },
  {
    title: 'Stop Motion: Pixelation',
    id: 'ui06UdetAPg',
    date: '2022-04-15',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ANIMACIÓN',
    link: 'https://www.youtube.com/watch?v=ui06UdetAPg',
  },
  {
    title: 'Narrativa Visual: Ética',
    id: 'DR1FwQc-9rQ',
    date: '2020-08-20',
    category: 'VIDEO',
    context: '  ',
    channel: 'ARCHIVO',
    link: 'https://www.youtube.com/watch?v=DR1FwQc-9rQ',
  },
  {
    title: 'Render Sincronizado 3D',
    id: 'VcCDOt0Uujk',
    date: '2023-11-15',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://www.youtube.com/watch?v=VcCDOt0Uujk',
  },
  {
    title: 'Saco Animado 3D',
    id: 'wKekfdNC3ZY',
    date: '2023-10-20',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://www.youtube.com/watch?v=wKekfdNC3ZY',
  },
  {
    title: 'Playblast Electro Swing',
    id: 'v3VPVmA7qOs',
    date: '2023-09-05',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://youtu.be/v3VPVmA7qOs',
  },
  {
    title: 'Playblast & Edit Cops',
    id: 'V3ABRvOuce0',
    date: '2023-08-15',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARCHIVO',
    link: 'https://youtu.be/V3ABRvOuce0',
  },
  {
    title: 'Timelapse Dev: GymApp',
    id: 'ANcyGAwcUac',
    date: '2024-01-20',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'DEVLOG',
    link: 'https://www.youtube.com/watch?v=ANcyGAwcUac',
  },
  {
    title: 'Dibujo Digital: Mis Inicios',
    id: 'QV04Wh2BU0E',
    date: '2022-03-20',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'ARTE',
    link: 'https://www.youtube.com/watch?v=QV04Wh2BU0E',
  },
  {
    title: 'Explicación POO Java',
    id: 'qIxRbcXezWU',
    date: '2020-05-15',
    category: 'VIDEO',
    context: 'UNIVERSITY',
    channel: 'TUTORIAL',
    link: 'https://www.youtube.com/watch?v=qIxRbcXezWU',
  },
];

/* ========================================================================
   4. GALERÍA VISUAL (SECCIÓN 04) - ARTE
   ======================================================================== */
window.galleryData = [
  {
    title: 'Alika Christmas Pose',
    tags: ['Ilustration', 'Furry Art'],
    desc: 'Reto de ilustración combinando referencias festivas.',
    date: '2024-01-05',
    fileName: '2024_Alika_pose_Watermark_Muestra_JPG',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
  {
    title: 'Akiko Princess Pose',
    tags: ['Ilustration', 'Furry Art'],
    desc: 'Ilustración de personaje estilo princesa.',
    date: '2024-10-14',
    fileName: '2024_Akiko_princess_pose_Watermark_Muestra_JPG',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
  {
    title: 'Atila Wolf Risa',
    tags: ['Sketch', 'Furry Art'],
    desc: 'Expresión facial de personaje original (Furry Art).',
    date: '2025-01-12',
    fileName: 'atila-risa-watermark',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
  {
    title: 'Atila Wolf Frente',
    tags: ['Sketch', 'Furry Art'],
    desc: 'Vista frontal de personaje (Character Design).',
    date: '2025-01-12',
    fileName: 'atila-frente-watermark',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
  {
    title: 'Atila Wolf 3/4',
    tags: ['Sketch', 'Furry Art'],
    desc: 'Estudio de perspectiva 3/4 para personaje.',
    date: '2025-01-12',
    fileName: 'atila-3-4-watermark',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
  {
    title: 'Another Renamon Pose',
    tags: ['WIP', 'Furry Art'],
    desc: 'Intento de una renamon combinando diversas referencias.',
    date: '2025-11-22',
    fileName: 'wip-renamon',
    link: '=',
    context: 'PERSONAL',
    category: 'ART',
  },
];
