window.cvData = {
  // Configuration settings for paths and others
  config: {
    profilePath: '../assets/images/profile/',
    pdfPath: '../../assets/pdf/',
    portfolioPath: '../../assets/images/portfolio/',
    iconsPath: '../../assets/icons/',
  },
  // Labels for different sections
  labels: {
    contact: 'Contact',
    languages: 'Languages',
    softSkills: 'Skills',
    techSkills: 'Technical',
    profile: 'Profile',
    education: 'Education',
    projects: 'Projects',
    stack: 'Tech Stack',
    footerTheme: 'SELECT A THEME',
    footerContact: 'CONTACT + NETWORKS',
    skillsTitle: 'Skills and Technologies',
    software: 'Software',
    letsTalk: "LET'S TALK.", // For the back cover of the PDF
    confidential: 'CONFIDENTIAL',
    hire: 'AVAILABLE FOR HIRE',
    shutdown: 'SYSTEM SHUTDOWN',
    rights: 'ALL RIGHTS RESERVED.',
    certificates: 'Certificates',
  },
  // Sections configuration (moved from modules/config.js)
  /*
  sections: [
  // ... your other sections
  {
    id: 'https://my-other-web.com', // The external URL directly
    title: 'MY OTHER WEB',
    inMenu: true,
    menuTitle: 'OTHER WEB',
    menuGroup: 'SERVICES', // Injected into the services dropdown
    isOnlyLink: true        // CRUCIAL: Does not create section 01, 02, etc. on the web
  },
]
  */
  sections: [
    {
      id: 'profile-section',
      title: 'PROFILE',
      subtitle: 'About me',
      inMenu: true,
      menuTitle: 'PROFILE',
      isOnlyLink: true, // This makes it appear in the menu but DOES NOT create section 01
    },
    {
      id: 'dev-section',
      title: 'DEVELOP<br/>CODER',
      subtitle: 'WEB | SCRIPTS | AUTOMATION',
      injectTarget: 'prof-inject',
      inMenu: true,
      menuTitle: 'DEVELOP',
      menuGroup: 'SERVICES', // Automatically goes into the dropdown
    },
    {
      id: 'video-section',
      title: 'VIDEOS<br/>EDIT',
      subtitle: 'YOUTUBE | SHORTS',
      injectTarget: 'video-inject',
      inMenu: true,
      menuTitle: 'VIDEO',
      menuGroup: 'SERVICES',
    },
    {
      id: 'ux-section',
      title: 'DESIGN<br/>RENDERS',
      subtitle: 'Thumbnails | 3D | Logos | Backgrounds',
      injectTarget: 'ux-inject',
      inMenu: true,
      menuTitle: 'DESIGN',
      menuGroup: 'SERVICES',
    },
    {
      id: 'https://art.tarquitet.com', // The external URL directly
      title: 'COMMISSIONS',
      inMenu: true,
      menuTitle: 'ART',
      menuGroup: 'SERVICES', // Injected into the services dropdown
      isOnlyLink: true, // CRUCIAL: Does not create section 01, 02, etc. on the web
    },
    {
      id: 'archive-section',
      title: 'ARCHIVE',
      subtitle: 'Database',
      inMenu: true,
      menuTitle: 'ARCHIVE',
      isOnlyLink: true,
    },
    {
      id: 'contact', // Footer anchor ID
      title: 'CONTACT',
      inMenu: true,
      menuTitle: 'CONTACT',
      isOnlyLink: true,
    },
  ],
  // Basic info about profile (me)
  basics: {
    name: 'David Josué<br>Pinto Gómez',
    role: 'Multimedia Engineer',
    imageName: 'profile.webp',
    summary:
      'Multimedia Engineer focused on Digital Production, UX/UI, AI tools, and agile methodologies to optimize workflows and achieve metric objectives. Trained in Adobe Creative Suite, frontend development, and project management from the technical phase to post-production.',
  },
  // Contact details
  contact: [
    // --- LEFT COLUMN (PROFESSIONAL) ---
    { icon: 'mail', text: 'contact@tarquitet.com', link: '-', type: 'PROFESSIONAL' },
    { icon: 'globe', text: 'Web Portfolio', link: 'https://web.tarquitet.com', type: 'PROFESSIONAL' },
    { icon: 'linkedin', text: 'LinkedIn', link: 'https://linkedin.com/in/pinto-gomez-david', type: 'PROFESSIONAL' },
    { icon: 'github', text: 'GitHub', link: 'https://github.com/tarquitet', type: 'PROFESSIONAL' },

    // --- CENTER COLUMN (ARTISTIC / CREATOR) ---
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
      name: 'Spanish',
      level: 'Native',
      code: 'ES',
      percent: 100,
    },
    {
      name: 'English',
      score: 130, // PENDING TO MAKE THIS SCORE REAL - EXAMS AND STUDY MORE
      maxScore: 300,

      levelRanges: [
        { limit: 50, code: 'A1', label: 'Basic' },
        { limit: 100, code: 'A1', label: 'Basic' },
        { limit: 110, code: 'A2', label: 'Basic' },
        { limit: 120, code: 'A2', label: 'Basic' },
        { limit: 130, code: 'B1', label: 'Intermediate' },
        { limit: 140, code: 'B1', label: 'Intermediate' },
        { limit: 160, code: 'B2', label: 'Intermediate' },
        { limit: 180, code: 'B2', label: 'Intermediate' },
        { limit: 210, code: 'C1', label: 'Advanced' },
        { limit: 240, code: 'C1', label: 'Advanced' },
        { limit: 300, code: 'C2', label: 'Advanced' },
      ],

      modalTitle: 'ABOUT THE LEVEL',
      modalText:
        'Level determined according to the official score of the Slang platform contrasted with the Common European Framework of Reference for Languages (CEFR).',
    },
  ],
  // Skills data - soft, tech, hard
  skills: {
    soft: ['Creativity and Innovation', 'Analytical Thinking', 'Teamwork', 'Strategic Communication'],
    hard: ['Project Management', 'Programming Logic', 'Digital Strategy'],
    tech: ['Audiovisual Post-production', 'Web Design (UX/UI)', 'Video Game Development', 'Digital Illustration'],
  },
  // Education history
  education: [
    {
      title: 'NEW GRANADA MILITARY UNIVERSITY',
      date: '2020 - 2026',
      degree: 'Multimedia Engineer.',
      gpa: 'GPA: 3.89',
      desc: 'Focus on development, design, and audiovisual media.',
    },
    // Remove high school entry to save space and maintain professionalism
    /*{
      title: 'SANTA ANA SCHOOL',
      date: '2006 - 2019',
      degree: 'Academic High School Diploma with emphasis on Systems.',
      desc: '',
    },*/
  ],
  // Projects completed
  projects: [
    {
      title: 'Professional Portfolio - Tarquitet',
      stack: 'Vanilla JS / HTML5 / CSS3',
      desc: 'Personal website optimized up to 95% without complex frameworks.',
    },
    {
      title: 'Official Website - Builtechraft SMP',
      stack: 'Astro / GitHub Actions / UX Design',
      desc: 'Responsive design, continuous integration and deployment workflows (CI/CD).',
    },
    {
      title: 'JSON Data Pipeline - Sheets to GitHub',
      stack: 'Google Apps Script / JSON / GitHub API',
      desc: 'Data automation using Google Sheets as a CMS and jsDelivr for fast, lightweight loading.',
    },
    {
      title: '3D Video Game Prototype - UMNG',
      stack: 'Unreal Engine / Blueprints',
      desc: '3D platform prototype with Blueprints for the Diploma in Video Game Development.',
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
    { name: 'Python (Scripts)', icon: 'code' }, // <-- ADDED: Shows you know Python
    { name: 'Google Apps Script', icon: 'code' }, // <-- ADDED: Validation of the JSON project
    { name: 'Davinci Resolve', icon: 'davinci' },
    { name: 'OBS Studio', icon: 'obs' },
    { name: 'Miro', icon: 'miro' },
    { name: 'Chat GPT', icon: 'chatgpt' },
    { name: 'Gemini', icon: 'gemini' },
    { name: 'Autodesk Maya', icon: 'maya' },
    { name: 'Word', icon: 'word' },
    { name: 'Excel', icon: 'excel' },
    { name: 'Google Sheets', icon: 'sheets' },
    { name: 'Google Docs', icon: 'docs' },
    { name: 'Google Slides', icon: 'slides' },
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
    'PROFESSIONAL ',
    'ARTIST ',
    'CONTENT CREATOR ',
    'VIDEO EDITOR ',
    'CREATIVE ',
    'DEVELOPER ',
    'PLANNER ',
    'ILLUSTRATOR ',
    'MULTIMEDIA ',
    'ENGINEER ',
    'PROMPT WRITER ',
    'COOL IDEAS ',
  ],
  certificates: [
    {
      title: 'Diploma in Video Game Development and Production',
      institution: 'New Granada Military University',
      date: '2025',
      desc: 'Video game development process in professional environments.',
    },
    {
      title: 'Learning Path: AI without Limits',
      institution: "Bogotá Mayor's Office",
      date: '2026',
      desc: 'Implementation of Artificial Intelligence tools to optimize workflows.',
    },
    {
      title: 'Pedagogical Strategies for Thinking Development',
      institution: 'SENA',
      date: '2026',
      desc: 'Methodologies and pedagogical techniques to foster critical thinking.',
    },
  ],
};
