/* ==========================================================================
   SkillHire Database Wrapper (LocalStorage-based)
   ========================================================================== */

const STORAGE_KEY = 'skillhire_candidates';
const RECRUITERS_KEY = 'skillhire_recruiters';
const MESSAGES_KEY = 'skillhire_messages';

// Premium Seed Candidates (Seed if LocalStorage is empty)
const SEED_CANDIDATES = [
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Frontend Developer',
    avatar: 'assets/images/avatar1.png',
    availability: 'Available for Internship',
    password: 'password123',
    about: 'Passionate frontend developer focused on building modern web applications using React and JavaScript. Obsessed with micro-animations, glassmorphic UI elements, and performance optimization.',
    skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git'],
    contact: {
      email: 'rahul.sharma@example.com',
      linkedin: 'https://linkedin.com/in/rahulsharma-demo',
      github: 'https://github.com/rahulsharma-demo'
    },
    projects: [
      {
        name: 'DevFlow Developer Platform',
        description: 'A premium community platform for developers to share code snippets, collaborate, and write technical blogs. Features dark mode, code execution simulators, and a markdown editor.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        screenshot: 'assets/images/project1.png',
        github: 'https://github.com/rahulsharma-demo/devflow',
        live: 'https://devflow-demo.dev'
      },
      {
        name: 'PromptKit Canvas',
        description: 'A sleek, collaborative canvas tool for prompt engineering with a node-based interface. Enables visualizing LLM chains, testing system prompts, and exporting API calls.',
        techStack: ['JavaScript', 'HTMLCanvas', 'CSS', 'LocalStorage'],
        screenshot: 'assets/images/project2.png',
        github: 'https://github.com/rahulsharma-demo/promptkit',
        live: 'https://promptkit-demo.dev'
      }
    ]
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'MERN Developer',
    avatar: 'assets/images/avatar2.png',
    availability: 'Available for Full-Time',
    password: 'password123',
    about: 'Full-stack developer focused on building scalable, type-safe REST APIs and blending them with premium user experiences. Love engineering clean architectures and optimization.',
    skills: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
    contact: {
      email: 'sarah.j@example.com',
      linkedin: 'https://linkedin.com/in/sarahjenkins-demo',
      github: 'https://github.com/sarahjenkins-demo'
    },
    projects: [
      {
        name: 'Fintech Edge Dashboard',
        description: 'A premium SaaS billing and analytics dashboard. Visualizes subscription metrics, churn rates, and monthly recurring revenue with high-end chart interactions and robust tables.',
        techStack: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB'],
        screenshot: 'assets/images/project1.png',
        github: 'https://github.com/sarahjenkins-demo/fintech-edge',
        live: 'https://fintech-edge.demo.dev'
      }
    ]
  },
  {
    id: 'aman-verma',
    name: 'Aman Verma',
    role: 'Frontend Developer',
    avatar: 'assets/images/avatar1.png',
    availability: 'Available for Internship',
    password: 'password123',
    about: 'Creative frontend developer with a background in digital design. Specializes in custom animations, SVG manipulation, and building state-driven interactive user interfaces.',
    skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'Redux'],
    contact: {
      email: 'aman.verma@example.com',
      linkedin: 'https://linkedin.com/in/amanverma-demo',
      github: 'https://github.com/amanverma-demo'
    },
    projects: [
      {
        name: 'TaskSphere SaaS Mockup',
        description: 'A tasks management board featuring drag-and-drop lists, sub-tasks, and calendar views. Fully optimized for instant transitions and keyboard shortcuts.',
        techStack: ['React', 'JavaScript', 'CSS', 'HTML'],
        screenshot: 'assets/images/project2.png',
        github: 'https://github.com/amanverma-demo/tasksphere',
        live: 'https://tasksphere-demo.dev'
      }
    ]
  },
  {
    id: 'tanmay-patel',
    name: 'Tanmay Patel',
    role: 'Python Developer',
    avatar: 'assets/images/avatar1.png',
    availability: 'Available for Full-Time',
    password: 'password123',
    about: 'Data-driven backend engineer specialized in RESTful API services, serverless microservices, and database performance. Passionate about clean code, robust unit tests, and performance optimization.',
    skills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'JavaScript'],
    contact: {
      email: 'tanmay.p@example.com',
      linkedin: 'https://linkedin.com/in/tanmaypatel-demo',
      github: 'https://github.com/tanmaypatel-demo'
    },
    projects: [
      {
        name: 'Analytics Engine API',
        description: 'A high-throughput metrics ingestion gateway built using Django REST Framework. Serves complex aggregations over millions of rows under 80ms.',
        techStack: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        screenshot: 'assets/images/project1.png',
        github: 'https://github.com/tanmaypatel-demo/analytics-api',
        live: 'https://api.analytics-demo.dev'
      }
    ]
  },
  {
    id: 'aditi-rao',
    name: 'Aditi Rao',
    role: 'UI/UX Designer',
    avatar: 'assets/images/avatar2.png',
    availability: 'Available for Internship',
    password: 'password123',
    about: 'Visual designer and prototype developer bridging the gap between aesthetics and engineering. Crafting clean Design Systems, complex Figma tokens, and high-fidelity HTML/CSS layouts.',
    skills: ['UI/UX', 'Figma', 'HTML', 'CSS', 'JavaScript'],
    contact: {
      email: 'aditi.rao@example.com',
      linkedin: 'https://linkedin.com/in/aditirao-demo',
      github: 'https://github.com/aditirao-demo'
    },
    projects: [
      {
        name: 'Atlas Design System',
        description: 'A comprehensive, multi-platform design token library featuring responsive typography scales, color mapping generators, and production-ready CSS variables.',
        techStack: ['Figma', 'CSS', 'HTML', 'JavaScript'],
        screenshot: 'assets/images/project2.png',
        github: 'https://github.com/aditirao-demo/atlas-ds',
        live: 'https://atlas-ds.demo.dev'
      }
    ]
  }
];

class CandidatesDB {
  static init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CANDIDATES));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  static getById(id) {
    const candidates = this.getAll();
    return candidates.find(c => c.id === id) || null;
  }

  static getByEmail(email) {
    const candidates = this.getAll();
    return candidates.find(c => c.contact && c.contact.email && c.contact.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static save(candidate) {
    const candidates = this.getAll();
    
    // Auto-generate slug ID if not provided
    if (!candidate.id) {
      candidate.id = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    }
    
    // Check if candidate already exists
    const index = candidates.findIndex(c => c.id === candidate.id);
    if (index !== -1) {
      candidates[index] = candidate;
    } else {
      candidates.push(candidate);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    return candidate.id;
  }

  static signup(name, email, password, role = 'Frontend Developer') {
    const candidates = this.getAll();
    if (this.getByEmail(email)) {
      throw new Error('Email is already registered as a Candidate.');
    }
    if (window.RecruitersDB && window.RecruitersDB.getByEmail(email)) {
      throw new Error('Email is already registered as a Recruiter.');
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newCandidate = {
      id,
      name,
      role,
      avatar: 'assets/images/avatar1.png',
      availability: 'Available for Full-Time',
      password,
      about: 'Welcome to your new portfolio page! Please edit your profile to add an about section.',
      skills: ['HTML', 'CSS', 'JavaScript'],
      contact: {
        email: email,
        linkedin: '',
        github: ''
      },
      projects: []
    };

    candidates.push(newCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    return newCandidate;
  }

  static query({ search = '', skills = [], availability = [] } = {}) {
    let candidates = this.getAll();

    // 1. Search filter (Name or Skill match)
    if (search.trim()) {
      const queryStr = search.toLowerCase().trim();
      candidates = candidates.filter(c => 
        c.name.toLowerCase().includes(queryStr) || 
        c.role.toLowerCase().includes(queryStr) ||
        c.skills.some(skill => skill.toLowerCase().includes(queryStr))
      );
    }

    // 2. Skill tags filters
    if (skills.length > 0) {
      candidates = candidates.filter(c => 
        skills.some(skill => c.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
      );
    }

    // 3. Availability filter
    if (availability.length > 0) {
      candidates = candidates.filter(c => {
        return availability.some(avail => {
          const formattedAvail = avail.toLowerCase();
          const candidateAvail = c.availability.toLowerCase();
          return candidateAvail.includes(formattedAvail);
        });
      });
    }

    return candidates;
  }
}

class RecruitersDB {
  static init() {
    if (!localStorage.getItem(RECRUITERS_KEY)) {
      const seedRecruiter = [
        {
          id: 'jane-doe',
          name: 'Jane Doe',
          email: 'jane@acme.com',
          password: 'password123',
          company: 'Acme Corporation',
          savedCandidates: ['rahul-sharma']
        }
      ];
      localStorage.setItem(RECRUITERS_KEY, JSON.stringify(seedRecruiter));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(RECRUITERS_KEY)) || [];
  }

  static getById(id) {
    const recruiters = this.getAll();
    return recruiters.find(r => r.id === id) || null;
  }

  static getByEmail(email) {
    const recruiters = this.getAll();
    return recruiters.find(r => r.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static signup(name, email, password, company) {
    const recruiters = this.getAll();
    if (recruiters.some(r => r.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered as a Recruiter.');
    }
    if (window.CandidatesDB && window.CandidatesDB.getByEmail(email)) {
      throw new Error('Email is already registered as a Candidate.');
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newRecruiter = {
      id,
      name,
      email,
      password,
      company,
      savedCandidates: []
    };
    recruiters.push(newRecruiter);
    localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recruiters));
    return newRecruiter;
  }

  static update(recruiter) {
    const recruiters = this.getAll();
    const index = recruiters.findIndex(r => r.id === recruiter.id);
    if (index !== -1) {
      recruiters[index] = recruiter;
      localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recruiters));
    }
  }

  static toggleSaveCandidate(recruiterId, candidateId) {
    const recruiter = this.getById(recruiterId);
    if (!recruiter) return false;
    
    if (!recruiter.savedCandidates) {
      recruiter.savedCandidates = [];
    }
    
    const index = recruiter.savedCandidates.indexOf(candidateId);
    let isSaved = false;
    if (index === -1) {
      recruiter.savedCandidates.push(candidateId);
      isSaved = true;
    } else {
      recruiter.savedCandidates.splice(index, 1);
      isSaved = false;
    }
    
    this.update(recruiter);
    return isSaved;
  }

  static isSaved(recruiterId, candidateId) {
    const recruiter = this.getById(recruiterId);
    if (!recruiter || !recruiter.savedCandidates) return false;
    return recruiter.savedCandidates.includes(candidateId);
  }
}

class MessagesDB {
  static init() {
    if (!localStorage.getItem(MESSAGES_KEY)) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
    }
  }

  static getAll() {
    this.init();
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  }

  static getForCandidate(candidateId) {
    const messages = this.getAll();
    return messages.filter(m => m.candidateId === candidateId);
  }

  static getForRecruiter(recruiterId) {
    const messages = this.getAll();
    return messages.filter(m => m.recruiterId === recruiterId);
  }

  static send(recruiterId, recruiterName, recruiterCompany, recruiterEmail, candidateId, subject, body) {
    const messages = this.getAll();
    const newMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      recruiterId,
      recruiterName,
      recruiterCompany,
      recruiterEmail,
      candidateId,
      subject,
      body,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return newMessage;
  }
}

class SessionManager {
  static getActiveUser() {
    const role = localStorage.getItem('skillhire_active_role');
    const id = localStorage.getItem('skillhire_active_id');
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
      localStorage.setItem('skillhire_active_role', 'candidate');
      localStorage.setItem('skillhire_active_id', candidate.id);
      return { role: 'candidate', user: candidate };
    }
    return null;
  }

  static loginRecruiter(email, password) {
    const recruiter = RecruitersDB.getByEmail(email);
    if (recruiter && recruiter.password === password) {
      localStorage.setItem('skillhire_active_role', 'recruiter');
      localStorage.setItem('skillhire_active_id', recruiter.id);
      return { role: 'recruiter', user: recruiter };
    }
    return null;
  }
  
  static logout() {
    localStorage.removeItem('skillhire_active_role');
    localStorage.removeItem('skillhire_active_id');
  }
}

// Auto init databases on load
CandidatesDB.init();
RecruitersDB.init();
MessagesDB.init();

// Expose to window object
window.CandidatesDB = CandidatesDB;
window.RecruitersDB = RecruitersDB;
window.MessagesDB = MessagesDB;
window.SessionManager = SessionManager;
