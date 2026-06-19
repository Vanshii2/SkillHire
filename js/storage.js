/* ==========================================================================
   SkillBridge Storage & Unified DB Layer
   ========================================================================== */

const KEYS = {
  users: 'users',
  profiles: 'profiles',
  projects: 'projects',
  messages: 'messages',
  requests: 'requests',
  contracts: 'contracts',
  escrows: 'escrows',
  updates: 'updates',
  deliveries: 'deliveries',
  reviews: 'reviews'
};

// Seed Initial Candidates & Recruiters
const SEED_USERS = [
  { id: 'rahul-sharma', email: 'rahul.sharma@example.com', password: 'password123', role: 'candidate' },
  { id: 'sarah-jenkins', email: 'sarah.j@example.com', password: 'password123', role: 'candidate' },
  { id: 'aman-verma', email: 'aman.verma@example.com', password: 'password123', role: 'candidate' },
  { id: 'tanmay-patel', email: 'tanmay.p@example.com', password: 'password123', role: 'candidate' },
  { id: 'aditi-rao', email: 'aditi.rao@example.com', password: 'password123', role: 'candidate' },
  { id: 'jane-doe', email: 'jane@acme.com', password: 'password123', role: 'recruiter' }
];

const SEED_PROFILES = [
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Frontend Developer',
    avatar: '../assets/images/avatar1.png',
    availability: 'Available for Internship',
    about: 'Passionate frontend developer focused on building modern web applications using React and JavaScript. Obsessed with micro-animations, glassmorphic UI elements, and performance optimization.',
    skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Git'],
    contact: { email: 'rahul.sharma@example.com', linkedin: 'https://linkedin.com/in/rahulsharma-demo', github: 'https://github.com/rahulsharma-demo' }
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'MERN Developer',
    avatar: '../assets/images/avatar2.png',
    availability: 'Available for Full-Time',
    about: 'Full-stack developer focused on building scalable, type-safe REST APIs and blending them with premium user experiences. Love engineering clean architectures and optimization.',
    skills: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
    contact: { email: 'sarah.j@example.com', linkedin: 'https://linkedin.com/in/sarahjenkins-demo', github: 'https://github.com/sarahjenkins-demo' }
  },
  {
    id: 'aman-verma',
    name: 'Aman Verma',
    role: 'Frontend Developer',
    avatar: '../assets/images/avatar1.png',
    availability: 'Available for Internship',
    about: 'Creative frontend developer with a background in digital design. Specializes in custom animations, SVG manipulation, and building state-driven interactive user interfaces.',
    skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'Redux'],
    contact: { email: 'aman.verma@example.com', linkedin: 'https://linkedin.com/in/amanverma-demo', github: 'https://github.com/amanverma-demo' }
  },
  {
    id: 'tanmay-patel',
    name: 'Tanmay Patel',
    role: 'Python Developer',
    avatar: '../assets/images/avatar1.png',
    availability: 'Available for Full-Time',
    about: 'Data-driven backend engineer specialized in RESTful API services, serverless microservices, and database performance. Passionate about clean code, robust unit tests, and performance optimization.',
    skills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'JavaScript'],
    contact: { email: 'tanmay.p@example.com', linkedin: 'https://linkedin.com/in/tanmaypatel-demo', github: 'https://github.com/tanmaypatel-demo' }
  },
  {
    id: 'aditi-rao',
    name: 'Aditi Rao',
    role: 'UI/UX Designer',
    avatar: '../assets/images/avatar2.png',
    availability: 'Available for Internship',
    about: 'Visual designer and prototype developer bridging the gap between aesthetics and engineering. Crafting clean Design Systems, complex Figma tokens, and high-fidelity HTML/CSS layouts.',
    skills: ['UI/UX', 'Figma', 'HTML', 'CSS', 'JavaScript'],
    contact: { email: 'aditi.rao@example.com', linkedin: 'https://linkedin.com/in/aditirao-demo', github: 'https://github.com/aditirao-demo' }
  },
  {
    id: 'jane-doe',
    name: 'Jane Doe',
    company: 'Acme Corporation',
    logo: '',
    email: 'jane@acme.com'
  }
];

const SEED_PROJECTS = [
  {
    id: 'aatma-brand-identity',
    title: 'Aatma — Brand Identity',
    description: 'A complete visual identity system for Aatma wellness brand.Mindful minimalism design token frameworks.',
    thumbnail: '../assets/images/aatma1.webp',
    images: ['../assets/images/aatma1.webp', '../assets/images/aatmaa2.webp'],
    tags: ['Branding', 'Identity', 'Figma'],
    authorName: 'Aditi Rao',
    authorId: 'aditi-rao',
    likes: 247,
    views: 6800
  },
  {
    id: 'spectra-dashboard',
    title: 'Spectra — Analytics Dashboard',
    description: 'Spectra is next-generation SaaS analytics dashboard built with visual clarity and zero-cognitive-load UI.',
    thumbnail: '../assets/images/spectra.....webp',
    images: ['../assets/images/spectra.....webp', '../assets/images/spectra2.avif'],
    tags: ['Dashboard', 'UI/UX', 'SaaS'],
    authorName: 'Rahul Sharma',
    authorId: 'rahul-sharma',
    likes: 189,
    views: 5200
  },
  {
    id: 'plate-food-app',
    title: 'Plate — Food Delivery App',
    description: 'Plate is premium food delivery application focusing on food photography and context animation.',
    thumbnail: '../assets/images/plateui.webp',
    images: ['../assets/images/plateui.webp', '../assets/images/plateui2.webp', '../assets/images/plateappui.webp'],
    tags: ['Mobile App', 'UI/UX', 'React Native'],
    authorName: 'Sarah Jenkins',
    authorId: 'sarah-jenkins',
    likes: 312,
    views: 9100
  }
];

class Storage {
  static get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static add(key, item) {
    const list = this.get(key);
    list.push(item);
    this.set(key, list);
    return item;
  }

  static update(key, item, identifier = 'id') {
    const list = this.get(key);
    const idx = list.findIndex(x => x[identifier] === item[identifier]);
    if (idx !== -1) {
      list[idx] = item;
      this.set(key, list);
      return true;
    }
    return false;
  }

  static delete(key, id, identifier = 'id') {
    const list = this.get(key);
    const filtered = list.filter(x => x[identifier] !== id);
    this.set(key, filtered);
  }

  static init() {
    if (!localStorage.getItem(KEYS.users)) {
      this.set(KEYS.users, SEED_USERS);
    }
    if (!localStorage.getItem(KEYS.profiles)) {
      this.set(KEYS.profiles, SEED_PROFILES);
    }
    if (!localStorage.getItem(KEYS.projects)) {
      this.set(KEYS.projects, SEED_PROJECTS);
    }
    if (!localStorage.getItem(KEYS.messages)) {
      this.set(KEYS.messages, []);
    }
    if (!localStorage.getItem(KEYS.requests)) {
      this.set(KEYS.requests, []);
    }
    if (!localStorage.getItem(KEYS.contracts)) {
      this.set(KEYS.contracts, []);
    }
    if (!localStorage.getItem(KEYS.escrows)) {
      this.set(KEYS.escrows, []);
    }
    if (!localStorage.getItem(KEYS.updates)) {
      this.set(KEYS.updates, []);
    }
    if (!localStorage.getItem(KEYS.deliveries)) {
      this.set(KEYS.deliveries, []);
    }
    if (!localStorage.getItem(KEYS.reviews)) {
      this.set(KEYS.reviews, []);
    }
  }
}

// Initialise DB
Storage.init();
window.Storage = Storage;
window.KEYS = KEYS;
