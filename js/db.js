/* ==========================================================================
   SkillBridge Database Wrapper (LocalStorage-based)
   ========================================================================== */

const STORAGE_KEY = 'skillbridge_candidates_v4';
const RECRUITERS_KEY = 'skillbridge_recruiters';
const MESSAGES_KEY = 'skillbridge_messages';
const JOBS_KEY = 'skillbridge_jobs';
const PROPOSALS_KEY = 'skillbridge_proposals';
const REVIEWS_KEY = 'skillbridge_reviews';
const ESCROW_KEY = 'skillbridge_escrow';

/* ==========================================================================
   Static Projects Showcase Data (Portfolio feed)
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 'aatma-brand-identity',
    title: 'Aatma — Brand Identity',
    description: 'A complete visual identity system for Aatma, a contemporary wellness brand. This project covers logo design, color system, typography scale, and packaging mockups — all built around a philosophy of mindful minimalism.',
    thumbnail: 'assets/images/aatma1.webp',
    images: ['assets/images/aatma1.webp', 'assets/images/aatmaa2.webp'],
    tags: ['Branding', 'Identity', 'AI'],
    authorName: 'Aditi Rao',
    authorAvatar: 'assets/images/aditi.png',
    authorId: 'aditi-rao',
    likes: 1200,
    views: 6800
  },
  {
    id: 'spectra-dashboard',
    title: 'Spectra — Analytics Dashboard',
    description: 'Spectra is a next-generation SaaS analytics dashboard built for marketing teams. It surfaces actionable insights across multiple data channels with a focus on visual clarity and zero-cognitive-load UI.',
    thumbnail: 'assets/images/spectra.....webp',
    images: ['assets/images/spectra.....webp', 'assets/images/spectra2.avif'],
    tags: ['Dashboard', 'UI/UX', 'SaaS'],
    authorName: 'Rahul Sharma',
    authorAvatar: 'assets/images/rahul.png',
    authorId: 'rahul-sharma',
    likes: 1100,
    views: 5200
  },
  {
    id: 'plate-food-app',
    title: 'Plate — Food Delivery App',
    description: 'Plate is a premium mobile food delivery application designed for a seamless ordering experience. The UI system focuses on rich food photography, contextual micro-animations, and a one-tap checkout flow.',
    thumbnail: 'assets/images/plateui.webp',
    images: ['assets/images/plateui.webp', 'assets/images/plateui2.webp', 'assets/images/plateappui.webp'],
    tags: ['Mobile App', 'UI/UX', 'React Native'],
    authorName: 'Sarah Jenkins',
    authorAvatar: 'assets/images/sara.png',
    authorId: 'sarah-jenkins',
    likes: 1000,
    views: 9100
  },
  {
    id: 'steer-saas-platform',
    title: 'Steer — Project Management',
    description: 'Steer is a modern project management SaaS platform built for distributed teams. Features include Kanban boards, sprint planning, automated status updates, and a real-time activity feed.',
    thumbnail: 'assets/images/steer.webp',
    images: ['assets/images/steer.webp', 'assets/images/steer2.webp', 'assets/images/steer3.webp', 'assets/images/steer4.png'],
    tags: ['SaaS', 'MERN', 'Dashboard'],
    authorName: 'Aman Verma',
    authorAvatar: 'assets/images/aman.png',
    authorId: 'aman-verma',
    likes: 156,
    views: 4300
  },
  {
    id: 'matcha-ecommerce',
    title: 'Matcha — E-Commerce UI Kit',
    description: 'A sophisticated e-commerce UI kit designed for premium tea brands. Includes landing page templates, product detail views, cart flows, and a comprehensive component library built in  and HTML/CSS.',
    thumbnail: 'assets/images/matcha2.webp',
    images: ['assets/images/matcha2.webp', 'assets/images/matcha3.webp', 'assets/images/matcha4.webp', 'assets/images/matcha5.webp'],
    tags: ['E-Commerce', 'UI Kit', 'AI'],
    authorName: 'Aditi Rao',
    authorAvatar: 'assets/images/aditi.png',
    authorId: 'aditi-rao',
    likes: 428,
    views: 11200
  },
  {
    id: 'tira-beauty-app',
    title: 'Tira — Beauty Discovery App',
    description: 'Tira is a mobile-first beauty discovery platform that uses AI to suggest personalised skincare and makeup products. The UI features a luxurious dark palette, gesture-driven navigation, and AR try-on previews.',
    thumbnail: 'assets/images/tira.webp',
    images: ['assets/images/tira.webp', 'assets/images/tira2.webp'],
    tags: ['Mobile App', 'AI', 'Beauty'],
    authorName: 'Sarah Jenkins',
    authorAvatar: 'assets/images/sara.png',
    authorId: 'sarah-jenkins',
    likes: 201,
    views: 7600
  },
  {
    id: 'pix-portfolio-template',
    title: 'Pix — Creative Portfolio Template',
    description: 'Pix is a high-impact portfolio template designed for creative professionals. The layout system adapts dynamically to the content type — photography, video, or design work — and ships with a dark and light mode.',
    thumbnail: 'assets/images/pix3.webp',
    images: ['assets/images/pix3.webp', 'assets/images/pix4.webp', 'assets/images/pix5.webp', 'assets/images/pix6.webp'],
    tags: ['Portfolio', 'HTML/CSS', 'Template'],
    authorName: 'Rahul Sharma',
    authorAvatar: 'assets/images/rahul.png',
    authorId: 'rahul-sharma',
    likes: 335,
    views: 8900
  },
  {
    id: 'book-cover-series',
    title: 'Book Cover Design Series',
    description: 'A curated series of editorial book cover designs that blend typographic experimentation with bold illustration.',
    thumbnail: 'assets/images/bookIllustraion.webp',
    images: ['assets/images/bookIllustraion.webp', 'assets/images/book2.webp', 'assets/images/book3.webp', 'assets/images/book4.webp', 'assets/images/book5.webp'],
    tags: ['Editorial', 'Illustration', 'Typography'],
    authorName: 'Tanmay Patel',
    authorAvatar: 'assets/images/tanmay.png',
    authorId: 'tanmay-patel',
    likes: 519,
    views: 14300
  },
  {
    id: 'port-portfolio-site',
    title: 'Port — Developer Portfolio Site',
    description: 'Port is a fully responsive developer portfolio site with an immersive hero section, scroll-driven animations, and a project grid that showcases work in a magazine-style layout.',
    thumbnail: 'assets/images/port1.webp',
    images: ['assets/images/port1.webp', 'assets/images/portbox2.webp'],
    tags: ['Portfolio', 'JavaScript', 'Animation'],
    authorName: 'Aman Verma',
    authorAvatar: 'assets/images/aman.png',
    authorId: 'aman-verma',
    likes: 274,
    views: 6100
  },
  {
    id: 'monkey-nft-collection',
    title: 'Monkey Club — NFT Collection',
    description: 'A vibrant generative NFT collection featuring 10,000 unique monkey characters with procedurally generated traits.',
    thumbnail: 'assets/images/monkey1.webp',
    images: ['assets/images/monkey1.webp', 'assets/images/monkey2.webp', 'assets/images/monkey3.webp', 'assets/images/monkey4.webp'],
    tags: ['NFT', 'Generative Art', 'Web3'],
    authorName: 'Tanmay Patel',
    authorAvatar: 'assets/images/tanmay.png',
    authorId: 'tanmay-patel',
    likes: 682,
    views: 18500
  },
  {
    id: 'maps-location-ui',
    title: 'Mapsi — Location Intelligence UI',
    description: 'Mapsi is a B2B location intelligence dashboard that helps logistics companies visualise fleet movements and delivery zones.',
    thumbnail: 'assets/images/mapsi.png',
    images: ['assets/images/mapsi.png'],
    tags: ['Dashboard', 'Maps', 'Logistics'],
    authorName: 'Rahul Sharma',
    authorAvatar: 'assets/images/rahul.png',
    authorId: 'rahul-sharma',
    likes: 143,
    views: 3900
  },
  {
    id: 'personal-branding-shoot',
    title: 'Personal Branding Shoot — Visuals',
    description: 'A personal branding visual set including professional headshots, lifestyle photos, and environmental portraits.',
    thumbnail: 'assets/images/pix7.webp',
    images: ['assets/images/pix7.webp', 'assets/images/pix8.webp', 'assets/images/pix9.webp'],
    tags: ['Photography', 'Branding', 'Visual'],
    authorName: 'Aditi Rao',
    authorAvatar: 'assets/images/aditi.png',
    authorId: 'aditi-rao',
    likes: 397,
    views: 10200
  },
  {
    id: 'fittrack-mobile-app',
    title: 'FitTrack — Cross-Platform Mobile App',
    description: 'A cross-platform fitness tracking app built with React Native and Expo. Features animated workout charts, streak tracking, offline data sync, and push notifications. Shipped on both iOS and Android.',
    thumbnail: 'assets/images/plateui.webp',
    images: ['assets/images/plateui.webp', 'assets/images/plateui2.webp'],
    tags: ['Mobile App', 'React Native', 'Expo'],
    authorName: 'Priya Kapoor',
    authorAvatar: 'assets/images/priya.png',
    authorId: 'priya-kapoor',
    likes: 318,
    views: 8400
  }
];

class ProjectsDB {
  static getAll() { return PROJECTS_DATA; }
  static getById(id) { return PROJECTS_DATA.find(p => p.id === id) || null; }
  static getByAuthor(authorId) { return PROJECTS_DATA.filter(p => p.authorId === authorId); }
}
window.ProjectsDB = ProjectsDB;

/* ==========================================================================
   Seed Candidates (Freelancers)
   ========================================================================== */
const SEED_CANDIDATES = [
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Frontend Developer',
    avatar: 'assets/images/rahul.png',
    availability: 'Available',
    hourlyRate: 850,
    password: 'password123',
    rating: 4.9,
    reviewCount: 38,
    about: 'Passionate frontend developer focused on building modern web applications using React and JavaScript. Obsessed with micro-animations, glassmorphic UI elements, and performance optimization.',
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'GraphQL', 'JavaScript', 'Vite'],
    contact: { email: 'rahul.sharma@example.com', linkedin: 'https://linkedin.com/in/rahulsharma-demo', github: 'https://github.com/rahulsharma-demo' },
    projects: [
      { name: 'DevFlow Developer Platform', description: 'A premium community platform for developers to share code snippets, collaborate, and write technical blogs.', techStack: ['React', 'Node.js', 'Express', 'MongoDB'], screenshot: 'assets/images/3.webp', github: 'https://github.com', live: 'https://example.com' },
      { name: 'PromptKit Canvas', description: 'A sleek, collaborative canvas tool for prompt engineering with a node-based interface.', techStack: ['JavaScript', 'HTMLCanvas', 'CSS', 'LocalStorage'], screenshot: 'assets/images/4.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'MERN Stack Developer',
    avatar: 'assets/images/sara.png',
    availability: 'Available',
    hourlyRate: 1200,
    password: 'password123',
    rating: 5.0,
    reviewCount: 21,
    about: 'Full-stack developer focused on building scalable, type-safe REST APIs and blending them with premium user experiences.',
    skills: ['Node.js', 'MongoDB', 'Docker', 'AWS', 'Redis', 'TypeScript', 'Express'],
    contact: { email: 'sarah.j@example.com', linkedin: 'https://linkedin.com/in/sarahjenkins-demo', github: 'https://github.com/sarahjenkins-demo' },
    projects: [
      { name: 'Fintech Edge Dashboard', description: 'A premium SaaS billing and analytics dashboard. Visualizes subscription metrics, churn rates, and MRR.', techStack: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB'], screenshot: 'assets/images/5.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  },
  {
    id: 'aman-verma',
    name: 'Aman Verma',
    role: 'Frontend Developer',
    avatar: 'assets/images/aman.png',
    availability: 'Available',
    hourlyRate: 700,
    password: 'password123',
    rating: 4.8,
    reviewCount: 15,
    about: 'Creative frontend developer with a background in digital design. Specializes in custom animations, SVG manipulation, and building state-driven interactive user interfaces.',
    skills: ['Vue.js', 'WordPress', 'PHP', 'JavaScript', 'Nuxt.js', 'CSS Animations', 'Three.js'],
    contact: { email: 'aman.verma@example.com', linkedin: 'https://linkedin.com/in/amanverma-demo', github: 'https://github.com/amanverma-demo' },
    projects: [
      { name: 'TaskSphere SaaS Mockup', description: 'A tasks management board featuring drag-and-drop lists, sub-tasks, and calendar views.', techStack: ['React', 'JavaScript', 'CSS', 'HTML'], screenshot: 'assets/images/6.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  },
  {
    id: 'tanmay-patel',
    name: 'Tanmay Patel',
    role: 'Python / Backend Developer',
    avatar: 'assets/images/tanmay.png',
    availability: 'Available',
    hourlyRate: 950,
    password: 'password123',
    rating: 4.7,
    reviewCount: 29,
    about: 'Data-driven backend engineer specialized in RESTful API services, serverless microservices, and database performance.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'FastAPI', 'Celery', 'Linux'],
    contact: { email: 'tanmay.p@example.com', linkedin: 'https://linkedin.com/in/tanmaypatel-demo', github: 'https://github.com/tanmaypatel-demo' },
    projects: [
      { name: 'Analytics Engine API', description: 'A high-throughput metrics ingestion gateway built using Django REST Framework.', techStack: ['Python', 'Django', 'PostgreSQL', 'Redis'], screenshot: 'assets/images/7.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  },
  {
    id: 'aditi-rao',
    name: 'Aditi Rao',
    role: 'UI/UX Designer',
    avatar: 'assets/images/aditi.png',
    availability: 'Available',
    hourlyRate: 1500,
    password: 'password123',
    rating: 5.0,
    reviewCount: 44,
    about: 'Visual designer and prototype developer bridging the gap between aesthetics and engineering. Crafting clean Design Systems and high-fidelity HTML/CSS layouts.',
    skills: ['UI/UX', 'AI', 'Prototyping', 'Design Systems', 'Webflow', 'Brand Identity', 'Motion Design'],
    contact: { email: 'aditi.rao@example.com', linkedin: 'https://linkedin.com/in/aditirao-demo', github: 'https://github.com/aditirao-demo' },
    projects: [
      { name: 'Atlas Design System', description: 'A comprehensive, multi-platform design token library featuring responsive typography scales and color mapping generators.', techStack: ['AI', 'CSS', 'HTML', 'JavaScript'], screenshot: 'assets/images/8.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  },
  {
    id: 'priya-kapoor',
    name: 'Priya Kapoor',
    role: 'React Native Developer',
    avatar: 'assets/images/priya.png',
    availability: 'Available',
    hourlyRate: 1100,
    password: 'password123',
    rating: 4.9,
    reviewCount: 33,
    about: 'Mobile-first engineer specializing in cross-platform React Native apps. Experienced in shipping production apps on iOS and Android with seamless animations and offline-first architecture.',
    skills: ['React Native', 'Flutter', 'Firebase', 'Swift', 'TypeScript', 'Expo', 'Kotlin'],
    contact: { email: 'priya.k@example.com', linkedin: 'https://linkedin.com/in/priyakapoor-demo', github: 'https://github.com/priyakapoor-demo' },
    projects: [
      { name: 'FitTrack Mobile App', description: 'A cross-platform fitness tracking app with real-time sync, animated workout charts, and streak tracking.', techStack: ['React Native', 'TypeScript', 'Firebase', 'Expo'], screenshot: 'assets/images/1.webp', github: 'https://github.com', live: 'https://example.com' }
    ]
  }
];

/* ==========================================================================
   Seed Jobs (Posted Projects)
   ========================================================================== */
const SEED_JOBS = [
  {
    id: 'job-001',
    title: 'Build a React E-Commerce Frontend',
    description: 'Looking for an experienced React developer to build the frontend for our e-commerce platform. The project includes product listing, cart, checkout, and user profile pages. Must be responsive and follow our existing design system.',
    budget: '₹25,000',
    budgetType: 'fixed',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    deadline: '30 days',
    clientId: 'jane-doe',
    clientName: 'Jane Doe',
    clientAvatar: null,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    proposals: 8,
    status: 'open',
    category: 'Web Development'
  },
  {
    id: 'job-002',
    title: 'UI/UX Designer for SaaS Dashboard',
    description: 'We need a UI/UX designer to redesign our analytics dashboard. You will work with our product team to create wireframes, high-fidelity mockups, and a complete design system. Experience with data visualization and AI tools is a plus.',
    budget: '₹15,000',
    budgetType: 'fixed',
    skills: ['UI/UX', 'AI', 'Prototyping', 'Design Systems'],
    deadline: '21 days',
    clientId: 'jane-doe',
    clientName: 'Jane Doe',
    clientAvatar: null,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    proposals: 15,
    status: 'open',
    category: 'Design'
  },
  {
    id: 'job-003',
    title: 'Python Backend API Development',
    description: 'Need a skilled Python developer to build REST APIs using Django/FastAPI for our mobile application. The APIs should support user authentication, data processing, and third-party integrations. Strong knowledge of SQL databases required.',
    budget: '₹800/hr',
    budgetType: 'hourly',
    skills: ['Python', 'Django', 'REST API', 'PostgreSQL', 'SQL'],
    deadline: '45 days',
    clientId: 'jane-doe',
    clientName: 'Jane Doe',
    clientAvatar: null,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    proposals: 22,
    status: 'open',
    category: 'Backend Development'
  },
  {
    id: 'job-004',
    title: 'Mobile App UI — React Native',
    description: 'We are building a fitness tracking app and need a React Native developer to implement UI screens from our designs. 12 screens total including onboarding, home, workout tracker, profile, and settings.',
    budget: '₹20,000',
    budgetType: 'fixed',
    skills: ['React Native', 'JavaScript', 'Mobile', 'AI'],
    deadline: '20 days',
    clientId: 'jane-doe',
    clientName: 'Jane Doe',
    clientAvatar: null,
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    proposals: 4,
    status: 'open',
    category: 'Mobile Development'
  }
];

/* ==========================================================================
   CandidatesDB (Freelancers)
   ========================================================================== */
class CandidatesDB {
  static init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CANDIDATES));
    } else {
      // Migrate: replace Figma with AI in existing candidates' skills
      const candidates = JSON.parse(localStorage.getItem(STORAGE_KEY));
      let dirty = false;
      candidates.forEach(c => {
        if (c.skills && c.skills.includes('Figma')) {
          c.skills = c.skills.map(s => s === 'Figma' ? 'AI' : s);
          dirty = true;
        }
      });
      if (dirty) localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  static getById(id) {
    return this.getAll().find(c => c.id === id) || null;
  }

  static getByEmail(email) {
    return this.getAll().find(c => c.contact && c.contact.email && c.contact.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static save(candidate) {
    const candidates = this.getAll();
    if (!candidate.id) {
      candidate.id = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    }
    const index = candidates.findIndex(c => c.id === candidate.id);
    if (index !== -1) {
      candidates[index] = candidate;
    } else {
      candidates.push(candidate);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    return candidate.id;
  }

  static update(candidate) {
    const all = this.getAll();
    const i = all.findIndex(c => c.id === candidate.id);
    if (i !== -1) {
      all[i] = candidate;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }

  static signup(name, email, password, role = 'Frontend Developer') {
    const candidates = this.getAll();
    if (this.getByEmail(email)) throw new Error('Email is already registered.');
    if (window.RecruitersDB && window.RecruitersDB.getByEmail(email)) throw new Error('Email is already registered.');

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newCandidate = {
      id, name, role,
      avatar: 'assets/images/avatar1.png',
      availability: 'Available',
      hourlyRate: 500,
      password,
      rating: 0,
      reviewCount: 0,
      about: '',
      skills: [],
      contact: { email, linkedin: '', github: '' },
      projects: []
    };
    candidates.push(newCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    return newCandidate;
  }

  static query({ search = '', skills = [], sortBy = 'projects' } = {}) {
    let candidates = this.getAll();
    // Only show candidates with at least 1 project
    candidates = candidates.filter(c => c.projects && c.projects.length > 0);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (skills.length > 0) {
      candidates = candidates.filter(c =>
        skills.some(skill => c.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
      );
    }
    if (sortBy === 'price') candidates.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    else if (sortBy === 'skills') candidates.sort((a, b) => b.skills.length - a.skills.length);
    else if (sortBy === 'rating') candidates.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else candidates.sort((a, b) => (b.projects || []).length - (a.projects || []).length);
    return candidates;
  }

  static addProject(candidateId, project) {
    const candidate = this.getById(candidateId);
    if (!candidate) return null;
    if (!candidate.projects) candidate.projects = [];
    const proj = { ...project, id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5) };
    candidate.projects.push(proj);
    this.update(candidate);
    return proj;
  }

  static removeProject(candidateId, projectId) {
    const candidate = this.getById(candidateId);
    if (!candidate) return;
    candidate.projects = (candidate.projects || []).filter(p => p.id !== projectId);
    this.update(candidate);
  }
}

/* ==========================================================================
   RecruitersDB (Clients)
   ========================================================================== */
class RecruitersDB {
  static init() {
    if (!localStorage.getItem(RECRUITERS_KEY)) {
      localStorage.setItem(RECRUITERS_KEY, JSON.stringify([
        { id: 'jane-doe', name: 'Jane Doe', email: 'jane@acme.com', password: 'password123', company: 'Acme Corporation', savedCandidates: ['rahul-sharma'] }
      ]));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(RECRUITERS_KEY)) || [];
  }

  static getById(id) { return this.getAll().find(r => r.id === id) || null; }
  static getByEmail(email) { return this.getAll().find(r => r.email.toLowerCase() === email.toLowerCase()) || null; }

  static signup(name, email, password, company) {
    const recruiters = this.getAll();
    if (recruiters.some(r => r.email.toLowerCase() === email.toLowerCase())) throw new Error('Email is already registered.');
    if (window.CandidatesDB && window.CandidatesDB.getByEmail(email)) throw new Error('Email is already registered.');

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newRecruiter = { id, name, email, password, company: company || name, savedCandidates: [] };
    recruiters.push(newRecruiter);
    localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recruiters));
    return newRecruiter;
  }

  static signupWithId(id, name, email, password, company) {
    const recruiters = this.getAll();
    if (recruiters.some(r => r.id === id)) return this.getById(id);
    const newRecruiter = { id, name, email, password, company: company || name, savedCandidates: [] };
    recruiters.push(newRecruiter);
    localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recruiters));
    return newRecruiter;
  }

  static update(recruiter) {
    const recruiters = this.getAll();
    const i = recruiters.findIndex(r => r.id === recruiter.id);
    if (i !== -1) { recruiters[i] = recruiter; localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recruiters)); }
  }

  static toggleSaveCandidate(recruiterId, candidateId) {
    const recruiter = this.getById(recruiterId);
    if (!recruiter) return false;
    if (!recruiter.savedCandidates) recruiter.savedCandidates = [];
    const i = recruiter.savedCandidates.indexOf(candidateId);
    if (i === -1) { recruiter.savedCandidates.push(candidateId); this.update(recruiter); return true; }
    recruiter.savedCandidates.splice(i, 1); this.update(recruiter); return false;
  }

  static isSaved(recruiterId, candidateId) {
    const r = this.getById(recruiterId);
    return r && r.savedCandidates ? r.savedCandidates.includes(candidateId) : false;
  }
}

/* ==========================================================================
   MessagesDB
   ========================================================================== */
class MessagesDB {
  static init() {
    if (!localStorage.getItem(MESSAGES_KEY)) localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  }

  static getAll() { this.init(); return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; }
  static getForCandidate(candidateId) { return this.getAll().filter(m => m.candidateId === candidateId); }
  static getForRecruiter(recruiterId) { return this.getAll().filter(m => m.recruiterId === recruiterId); }

  static send(recruiterId, recruiterName, recruiterCompany, recruiterEmail, candidateId, subject, body) {
    const messages = this.getAll();
    const msg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      recruiterId, recruiterName, recruiterCompany, recruiterEmail,
      candidateId, subject, body,
      timestamp: new Date().toISOString()
    };
    messages.push(msg);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return msg;
  }
}

/* ==========================================================================
   JobsDB (Posted Projects / Jobs by Clients)
   ========================================================================== */
class JobsDB {
  static init() {
    if (!localStorage.getItem(JOBS_KEY)) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(SEED_JOBS));
    } else {
      // Migrate: fix range budgets and Figma→AI in existing seeded jobs
      const jobs = JSON.parse(localStorage.getItem(JOBS_KEY));
      let dirty = false;
      jobs.forEach(j => {
        // Fix range budgets (contains ' – ')
        if (j.budget && j.budget.includes(' – ')) {
          j.budget = j.budget.split(' – ')[0].replace(/\/hr.*$/, '') + (j.budgetType === 'hourly' ? '/hr' : '');
          dirty = true;
        }
        // Fix Figma → AI in skills
        if (j.skills && j.skills.includes('Figma')) {
          j.skills = j.skills.map(s => s === 'Figma' ? 'AI' : s);
          dirty = true;
        }
        // Fix description mentioning Figma
        if (j.description && j.description.includes('Figma')) {
          j.description = j.description.replace(/Figma /g, 'AI ').replace(/ Figma/g, ' AI').replace(/Figma\b/g, 'AI');
          dirty = true;
        }
      });
      // Ensure directHire / invitedFreelancerId fields exist.
      // Recover old directHire jobs by cross-referencing "Project Invite:" messages.
      const msgs = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
      jobs.forEach(j => {
        if (j.directHire === undefined || j.invitedFreelancerId === undefined) {
          // Try to recover: look for a "Project Invite: <title>" message from the same client
          const inviteMsg = msgs.find(m =>
            m.recruiterId === j.clientId &&
            m.subject === 'Project Invite: ' + j.title
          );
          j.directHire = !!inviteMsg;
          j.invitedFreelancerId = inviteMsg ? inviteMsg.candidateId : null;
          dirty = true;
        }
      });
      if (dirty) localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
  }

  static getById(id) { return this.getAll().find(j => j.id === id) || null; }
  static getByClient(clientId) { return this.getAll().filter(j => j.clientId === clientId); }

  static post(jobData, session) {
    if (!session) throw new Error('You must be logged in to post a project.');
    const jobs = this.getAll();
    const id = 'job-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const clientName = session.user.name;
    const clientCompany = session.role === 'recruiter' ? (session.user.company || '') : '';
    const newJob = {
      id,
      title: jobData.title,
      description: jobData.description,
      budget: jobData.budget,
      budgetType: jobData.budgetType || 'fixed',
      skills: jobData.skills || [],
      deadline: jobData.deadline || '30 days',
      clientId: session.user.id,
      clientName,
      clientCompany,
      posterType: jobData.posterType || 'individual',
      clientAvatar: null,
      postedAt: new Date().toISOString(),
      proposals: 0,
      status: 'open',
      category: jobData.category || 'General',
      directHire: jobData.directHire || false,
      invitedFreelancerId: jobData.invitedFreelancerId || null
    };
    jobs.unshift(newJob);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return newJob;
  }

  static delete(jobId) {
    const jobs = this.getAll().filter(j => j.id !== jobId);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  static updateStatus(jobId, status) {
    const jobs = this.getAll();
    const j = jobs.find(j => j.id === jobId);
    if (j) { j.status = status; localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); }
  }

  static query({ search = '', category = '', skills = [] } = {}) {
    // Never expose directHire (private invite) jobs in public listings
    let jobs = this.getAll().filter(j => j.status === 'open' && !j.directHire);
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (category) jobs = jobs.filter(j => j.category === category);
    if (skills.length > 0) jobs = jobs.filter(j => skills.some(s => j.skills.some(js => js.toLowerCase() === s.toLowerCase())));
    // Newest first
    jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    return jobs;
  }

  static incrementProposals(jobId) {
    const jobs = this.getAll();
    const j = jobs.find(j => j.id === jobId);
    if (j) { j.proposals = (j.proposals || 0) + 1; localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); }
  }
}

/* ==========================================================================
   ProposalsDB (Freelancer Proposals on Jobs)
   ========================================================================== */
class ProposalsDB {
  static init() {
    if (!localStorage.getItem(PROPOSALS_KEY)) localStorage.setItem(PROPOSALS_KEY, JSON.stringify([]));
  }

  static getAll() { this.init(); return JSON.parse(localStorage.getItem(PROPOSALS_KEY)) || []; }
  static getByJob(jobId) { return this.getAll().filter(p => p.jobId === jobId); }
  static getByFreelancer(freelancerId) { return this.getAll().filter(p => p.freelancerId === freelancerId); }

  static hasApplied(jobId, freelancerId) {
    return this.getAll().some(p => p.jobId === jobId && p.freelancerId === freelancerId);
  }

  static submit(jobId, freelancerSession, formData) {
    if (!freelancerSession) throw new Error('You must be logged in to submit a proposal.');
    if (this.hasApplied(jobId, freelancerSession.user.id)) throw new Error('You have already submitted a proposal for this project.');

    const proposals = this.getAll();
    // Pull fresh candidate record so avatar/role reflect latest edits
    const freshCand = CandidatesDB.getById(freelancerSession.user.id) || freelancerSession.user;
    const proposal = {
      id: 'prop-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      jobId,
      freelancerId: freelancerSession.user.id,
      freelancerName: freshCand.name || freelancerSession.user.name,
      freelancerRole: freshCand.role || 'Freelancer',
      freelancerAvatar: freshCand.avatar || null,
      coverLetter: formData.coverLetter,
      proposedBudget: formData.proposedBudget,
      proposedTimeline: formData.proposedTimeline,
      proposalType: formData.proposalType || 'bid',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    proposals.push(proposal);
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
    JobsDB.incrementProposals(jobId);
    return proposal;
  }

  static updateStatus(proposalId, status) {
    const proposals = this.getAll();
    const p = proposals.find(p => p.id === proposalId);
    if (p) { p.status = status; localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals)); }
  }
}

/* ==========================================================================
   SessionManager
   ========================================================================== */
class SessionManager {
  static getActiveUser() {
    const role = localStorage.getItem('skillbridge_active_role');
    const id = localStorage.getItem('skillbridge_active_id');
    if (!role || !id) return null;
    if (role === 'candidate') {
      const user = CandidatesDB.getById(id);
      return user ? { role, user } : null;
    } else if (role === 'recruiter') {
      const user = RecruitersDB.getById(id);
      return user ? { role, user } : null;
    }
    return null;
  }

  static loginCandidate(email, password) {
    const candidate = CandidatesDB.getByEmail(email);
    if (candidate && (candidate.password === password || (!candidate.password && password === 'password123'))) {
      candidate.lastLoginAt = Date.now();
      CandidatesDB.update(candidate);
      localStorage.setItem('skillbridge_active_role', 'candidate');
      localStorage.setItem('skillbridge_active_id', candidate.id);
      return { role: 'candidate', user: candidate };
    }
    return null;
  }

  static loginRecruiter(email, password) {
    const recruiter = RecruitersDB.getByEmail(email);
    if (recruiter && recruiter.password === password) {
      recruiter.lastLoginAt = Date.now();
      RecruitersDB.update(recruiter);
      localStorage.setItem('skillbridge_active_role', 'recruiter');
      localStorage.setItem('skillbridge_active_id', recruiter.id);
      return { role: 'recruiter', user: recruiter };
    }
    return null;
  }

  static login(email, password) {
    const s = this.loginCandidate(email, password);
    if (s) return s;
    return this.loginRecruiter(email, password);
  }

  static logout() {
    localStorage.removeItem('skillbridge_active_role');
    localStorage.removeItem('skillbridge_active_id');
  }
}

/* ==========================================================================
   ReviewsDB (Client ratings of freelancers)
   ========================================================================== */
class ReviewsDB {
  static init() {
    if (!localStorage.getItem(REVIEWS_KEY)) localStorage.setItem(REVIEWS_KEY, JSON.stringify([]));
  }

  static getAll() { this.init(); return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; }

  static getForCandidate(candidateId) { return this.getAll().filter(r => r.candidateId === candidateId); }

  static hasReviewed(clientId, candidateId) {
    return this.getAll().some(r => r.clientId === clientId && r.candidateId === candidateId);
  }

  static add(clientId, clientName, candidateId, rating, comment) {
    const reviews = this.getAll();
    const review = {
      id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      clientId, clientName, candidateId,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };
    reviews.push(review);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    // Update candidate's computed rating
    const allForCandidate = reviews.filter(r => r.candidateId === candidateId);
    const avg = allForCandidate.reduce((s, r) => s + r.rating, 0) / allForCandidate.length;
    const candidate = CandidatesDB.getById(candidateId);
    if (candidate) {
      candidate.rating = Math.round(avg * 10) / 10;
      candidate.reviewCount = allForCandidate.length;
      CandidatesDB.update(candidate);
    }
    return review;
  }

  static getAverageRating(candidateId) {
    const reviews = this.getForCandidate(candidateId);
    if (!reviews.length) return { average: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { average: Math.round(avg * 10) / 10, count: reviews.length };
  }

  static renderStarsHTML(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= full) html += '<span style="color:#f59e0b">★</span>';
      else if (i === full + 1 && half) html += '<span style="color:#f59e0b">½</span>';
      else html += '<span style="color:#ccc">★</span>';
    }
    return html;
  }
}

/* ==========================================================================
   EscrowDB (Payment escrow between clients and freelancers)
   ========================================================================== */
class EscrowDB {
  static init() {
    if (!localStorage.getItem(ESCROW_KEY)) localStorage.setItem(ESCROW_KEY, JSON.stringify([]));
  }

  static getAll() { this.init(); return JSON.parse(localStorage.getItem(ESCROW_KEY)) || []; }
  static getById(id) { return this.getAll().find(e => e.id === id) || null; }
  static getByClient(clientId) { return this.getAll().filter(e => e.clientId === clientId); }
  static getByFreelancer(freelancerId) { return this.getAll().filter(e => e.freelancerId === freelancerId); }
  static getByProposal(proposalId) { return this.getAll().find(e => e.proposalId === proposalId) || null; }

  static create(proposalId, clientId, clientName, freelancerId, freelancerName, jobTitle, amount, jobId) {
    if (this.getByProposal(proposalId)) return this.getByProposal(proposalId);
    const escrows = this.getAll();
    const escrow = {
      id: 'escrow-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      proposalId, jobId: jobId || null,
      clientId, clientName, freelancerId, freelancerName,
      jobTitle, amount,
      status: 'awaiting_payment', // awaiting_payment → funded → work_submitted → released | disputed
      createdAt: new Date().toISOString(),
      fundedAt: null,
      releasedAt: null,
      workNote: ''
    };
    escrows.push(escrow);
    localStorage.setItem(ESCROW_KEY, JSON.stringify(escrows));
    return escrow;
  }

  static updateStatus(escrowId, status, extra = {}) {
    const escrows = this.getAll();
    const e = escrows.find(e => e.id === escrowId);
    if (!e) return;
    e.status = status;
    Object.assign(e, extra);
    localStorage.setItem(ESCROW_KEY, JSON.stringify(escrows));
    const rawAmt = String(e.amount).replace(/[₹,\s]/g, '');
    const now = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // ── FUNDED: notify both parties ──────────────────────────────────────
    if (status === 'funded') {
      const notifKey = 'sb_escrow_notif_' + escrowId;
      if (!localStorage.getItem(notifKey)) {
        localStorage.setItem(notifKey, '1');
        // → Freelancer: work can begin
        if (e.freelancerId) {
          MessagesDB.send(
            e.clientId || 'system', e.clientName || 'Client', 'Client', '',
            e.freelancerId,
            '💰 Escrow Funded — Work Can Begin: ' + e.jobTitle,
            `Great news! ${e.clientName || 'Your client'} has funded the escrow for "${e.jobTitle}".\n\nAmount secured: ₹${rawAmt}\n\nYou can now start working. Submit your deliverables from your My Contracts tab when done — the client will review and release payment.\n\nFunded at: ${now}`
          );
        }
        // → Client: payment receipt confirmation
        if (e.clientId) {
          MessagesDB.send(
            e.clientId, e.clientName || 'Client', '', '',
            e.freelancerId || 'system',
            '✅ Payment Confirmed — Escrow Active: ' + e.jobTitle,
            `Your escrow payment of ₹${rawAmt} for "${e.jobTitle}" has been successfully funded.\n\nThe freelancer ${e.freelancerName || ''} has been notified and will begin work.\n\nYou can release payment once you've reviewed and approved the delivered work from your Payments & Escrow tab.\n\nFunded at: ${now}`
          );
        }
      }
    }

    // ── RELEASED: notify both parties ────────────────────────────────────
    if (status === 'released') {
      const relKey = 'sb_release_notif_' + escrowId;
      if (!localStorage.getItem(relKey)) {
        localStorage.setItem(relKey, '1');
        // → Freelancer: payment in hand
        if (e.freelancerId) {
          MessagesDB.send(
            e.clientId || 'system', e.clientName || 'Client', 'Client', '',
            e.freelancerId,
            '🎉 Payment Released: ' + e.jobTitle,
            `Your payment of ₹${rawAmt} for "${e.jobTitle}" has been approved and released by ${e.clientName || 'the client'}.\n\nThe funds are now available to you. Thank you for completing this project!\n\nPlease take a moment to rate your experience from your My Contracts tab.\n\nReleased at: ${now}`
          );
        }
        // → Client: project complete confirmation
        if (e.clientId) {
          MessagesDB.send(
            e.clientId, e.clientName || 'Client', '', '',
            e.freelancerId || 'system',
            '✅ Project Complete — Payment Released: ' + e.jobTitle,
            `You have successfully released ₹${rawAmt} to ${e.freelancerName || 'the freelancer'} for "${e.jobTitle}".\n\nThe project is now marked as complete. Thank you for using SkillBridge!\n\nReleased at: ${now}`
          );
        }
      }
    }

    // ── DISPUTED: notify both parties ────────────────────────────────────
    if (status === 'disputed') {
      const disKey = 'sb_dispute_notif_' + escrowId;
      if (!localStorage.getItem(disKey)) {
        localStorage.setItem(disKey, '1');
        const disputeMsg = (who) => `A dispute has been raised for "${e.jobTitle}" (₹${rawAmt}).\n\nOur support team will review the case and contact both parties within 24–48 hours. The escrow amount is held safely until the dispute is resolved.\n\nRaised at: ${now}`;
        if (e.freelancerId) {
          MessagesDB.send(e.clientId || 'system', e.clientName || 'Client', '', '', e.freelancerId, '⚠️ Dispute Raised: ' + e.jobTitle, disputeMsg('freelancer'));
        }
        if (e.clientId) {
          MessagesDB.send(e.clientId, e.clientName || 'Client', '', '', e.freelancerId || 'system', '⚠️ Dispute Raised: ' + e.jobTitle, disputeMsg('client'));
        }
      }
    }

    return e;
  }
}

const COMPLAINTS_KEY = 'skillbridge_complaints';

class ComplaintsDB {
  static init() {
    if (!localStorage.getItem(COMPLAINTS_KEY)) localStorage.setItem(COMPLAINTS_KEY, JSON.stringify([]));
  }

  static getAll() { this.init(); return JSON.parse(localStorage.getItem(COMPLAINTS_KEY)) || []; }
  static getByUser(userId) { return this.getAll().filter(c => c.filedBy === userId || c.againstUserId === userId); }
  static getByContract(escrowId) { return this.getAll().filter(c => c.escrowId === escrowId); }

  static file({ escrowId, filedBy, filedByName, againstUserId, againstName, subject, description, contractTitle }) {
    this.init();
    const complaints = this.getAll();
    const c = {
      id: 'cmp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      escrowId, filedBy, filedByName, againstUserId, againstName,
      subject, description, contractTitle,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    complaints.unshift(c);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return c;
  }
}

// Auto-init
CandidatesDB.init();
RecruitersDB.init();
MessagesDB.init();
JobsDB.init();
ProposalsDB.init();
ReviewsDB.init();
EscrowDB.init();
ComplaintsDB.init();

// ── Window globals (script-tag usage) ──────────────────────────────────────
window.CandidatesDB  = CandidatesDB;
window.RecruitersDB  = RecruitersDB;
window.MessagesDB    = MessagesDB;
window.JobsDB        = JobsDB;
window.ProposalsDB   = ProposalsDB;
window.ReviewsDB     = ReviewsDB;
window.EscrowDB      = EscrowDB;
window.ComplaintsDB  = ComplaintsDB;
window.SessionManager = SessionManager;

// ── ESM export shim (ES-module / bundler usage) ────────────────────────────
// When this file is loaded as type="module" or bundled, named exports are
// available. The window assignments above remain as the fallback for classic
// <script src="js/db.js"> usage — no functionality changes.
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS (Node / Jest)
  module.exports = { CandidatesDB, RecruitersDB, MessagesDB, JobsDB,
    ProposalsDB, ReviewsDB, EscrowDB, ComplaintsDB, SessionManager };
}
// For native ESM: add  type="module"  to the script tag and import like:
//   import { JobsDB, ProposalsDB } from './js/db.js'
// The classes are top-level declarations — they are automatically tree-shakeable.
