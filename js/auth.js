/* ==========================================================================
   Exhibitly Authentication Controller
   ========================================================================== */

class Auth {
  static getActiveUser() {
    const role = localStorage.getItem('skillhire_active_role');
    const id = localStorage.getItem('skillhire_active_id');
    if (!role || !id) return null;

    const profiles = window.Storage.get(window.KEYS.profiles);
    const userProfile = profiles.find(p => p.id === id);
    if (!userProfile) return null;

    return { role, user: userProfile };
  }

  static login(email, password, role) {
    const users = window.Storage.get(window.KEYS.users);
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
    
    if (matchedUser) {
      localStorage.setItem('skillhire_active_role', role);
      localStorage.setItem('skillhire_active_id', matchedUser.id);
      return matchedUser;
    }
    return null;
  }

  static signup(name, email, password, role, extra = {}) {
    const users = window.Storage.get(window.KEYS.users);
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Email is already registered on Exhibitly.');
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    // Add user credential
    const newUser = { id, email, password, role };
    window.Storage.add(window.KEYS.users, newUser);

    // Add profile
    let newProfile = { id, name, email };
    if (role === 'candidate') {
      newProfile = {
        ...newProfile,
        role: extra.role || 'Frontend Developer',
        avatar: '../assets/images/avatar1.png',
        availability: 'Available for Full-Time',
        about: 'Welcome to your new portfolio page! Please edit your profile to add an about section.',
        skills: ['HTML', 'CSS', 'JavaScript'],
        contact: { email: email, linkedin: '', github: '' },
        projects: []
      };
    } else {
      newProfile = {
        ...newProfile,
        company: extra.company || 'New Company',
        logo: '',
        savedCandidates: []
      };
    }
    window.Storage.add(window.KEYS.profiles, newProfile);

    // Log in
    localStorage.setItem('skillhire_active_role', role);
    localStorage.setItem('skillhire_active_id', id);
    
    return newUser;
  }

  static logout() {
    localStorage.removeItem('skillhire_active_role');
    localStorage.removeItem('skillhire_active_id');
  }
}

// Expose globally
window.Auth = Auth;
