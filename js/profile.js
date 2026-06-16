/* ==========================================================================
   SkillHire Candidate Profile Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
});

/**
 * Loads candidate info by URL ?id=slug and dynamically populates the profile layout.
 */
function renderProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get('id');

  const mainContainer = document.getElementById('profile-main-container');
  if (!mainContainer) return;

  if (!candidateId) {
    renderError(mainContainer, 'No Profile Selected', 'Please go back to the directory and select a candidate profile.');
    return;
  }

  // Query candidate details
  const candidate = window.CandidatesDB.getById(candidateId);
  if (!candidate) {
    renderError(mainContainer, 'Candidate Profile Not Found', 'The candidate you are trying to view does not exist in our database.');
    return;
  }

  // Set page HTML title dynamic
  document.title = `${candidate.name} — ${candidate.role} | SkillHire`;

  // Require active session to view candidate full profile
  const session = window.SessionManager.getActiveUser();
  if (!session) {
    renderLockedProfile(mainContainer);
    return;
  }

  // Render Page Content
  const isInternship = candidate.availability.toLowerCase().includes('internship');
  const badgeClass = isInternship ? 'badge-internship' : 'badge-fulltime';

  // Construct contact HTML channels dynamically
  const emailHtml = candidate.contact.email ? `
    <li class="contact-item">
      <span class="contact-label">Email</span>
      <a href="mailto:${escapeHTML(candidate.contact.email)}" class="contact-link">${escapeHTML(candidate.contact.email)}</a>
    </li>
  ` : '';

  const linkedinHtml = candidate.contact.linkedin ? `
    <li class="contact-item">
      <span class="contact-label">LinkedIn</span>
      <a href="${escapeHTML(candidate.contact.linkedin)}" target="_blank" class="contact-link">View LinkedIn Profile</a>
    </li>
  ` : '';

  const githubHtml = candidate.contact.github ? `
    <li class="contact-item">
      <span class="contact-label">GitHub</span>
      <a href="${escapeHTML(candidate.contact.github)}" target="_blank" class="contact-link">github.com/${escapeHTML(getGitHubUsername(candidate.contact.github))}</a>
    </li>
  ` : '';

  // Construct skills HTML
  const skillsHtml = candidate.skills.map(skill => 
    `<span class="skill-tag">${escapeHTML(skill)}</span>`
  ).join('');

  // Construct project cards HTML
  const projectsHtml = candidate.projects.map(proj => {
    const techTags = proj.techStack.map(tech => 
      `<span class="skill-tag">${escapeHTML(tech)}</span>`
    ).join('');

    return `
      <div class="project-card fade-in-section is-visible">
        <div class="project-img-wrapper">
          <img src="${escapeHTML(proj.screenshot)}" alt="${escapeHTML(proj.name)}" class="project-img" onerror="this.src='assets/images/project1.png'">
        </div>
        <div class="project-info">
          <h3>${escapeHTML(proj.name)}</h3>
          <p class="project-description">${escapeHTML(proj.description)}</p>
          <div class="project-tech">
            ${techTags}
          </div>
          <div class="project-actions">
            ${proj.github ? `<a href="${escapeHTML(proj.github)}" target="_blank" class="btn btn-secondary">Source Code</a>` : ''}
            ${proj.live ? `<a href="${escapeHTML(proj.live)}" target="_blank" class="btn btn-primary">Live Demo</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  let actionButtonsHtml = '';

  if (session) {
    if (session.role === 'recruiter') {
      const isSaved = window.RecruitersDB.isSaved(session.user.id, candidate.id);
      actionButtonsHtml = `
        <button class="btn btn-secondary ${isSaved ? 'active' : ''}" id="profile-btn-shortlist" style="padding: 10px 20px; font-size: 0.9rem;">
          ${isSaved ? '★ Shortlisted' : '☆ Save to Shortlist'}
        </button>
        <button class="btn btn-primary" id="profile-btn-contact" style="padding: 10px 20px; font-size: 0.9rem;">
          Contact Candidate
        </button>
      `;
    } else if (session.role === 'candidate' && session.user.id === candidate.id) {
      actionButtonsHtml = `
        <a href="candidate-dashboard.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">
          Edit My Profile
        </a>
      `;
    }
  } else {
    // Guest view - show a prompt button that triggers the recruiter login
    actionButtonsHtml = `
      <button class="btn btn-secondary" onclick="window.openAuthModal('recruiter', 'login')" style="padding: 10px 20px; font-size: 0.9rem;">
        Login as Recruiter to Contact
      </button>
    `;
  }

  mainContainer.innerHTML = `
    <div class="profile-section container">
      
      <!-- Profile Header Hero -->
      <div class="profile-hero fade-in-section is-visible" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 40px; flex-wrap: wrap;">
          <div class="profile-hero-avatar-wrapper">
            <img src="${escapeHTML(candidate.avatar)}" alt="${escapeHTML(candidate.name)}" class="profile-hero-avatar">
          </div>
          <div class="profile-hero-info">
            <span class="badge ${badgeClass}">${escapeHTML(candidate.availability)}</span>
            <h1>${escapeHTML(candidate.name)}</h1>
            <div class="role">${escapeHTML(candidate.role)}</div>
          </div>
        </div>
        
        <div class="profile-hero-actions" style="display: flex; gap: 12px; align-items: center;">
          ${actionButtonsHtml}
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="profile-grid">
        
        <!-- Left Sidebar Details -->
        <aside class="profile-sidebar fade-in-section is-visible">
          <!-- About -->
          <div class="sidebar-card">
            <h2>About Me</h2>
            <p class="about-text">${escapeHTML(candidate.about)}</p>
          </div>
          
          <!-- Skills -->
          <div class="sidebar-card">
            <h2>Technical Skills</h2>
            <div class="profile-skills-tags">
              ${skillsHtml}
            </div>
          </div>
          
          <!-- Contact Details -->
          <div class="sidebar-card">
            <h2>Contact Details</h2>
            <ul class="contact-list">
              ${emailHtml}
              ${linkedinHtml}
              ${githubHtml}
            </ul>
          </div>
        </aside>

        <!-- Right Main Projects list -->
        <div class="profile-main fade-in-section is-visible">
          <h2>Project Showcases</h2>
          <p style="color: var(--secondary-text); margin-bottom: 24px;">Explore works built by ${escapeHTML(candidate.name.split(' ')[0])}.</p>
          <div class="projects-list">
            ${projectsHtml}
          </div>
        </div>

      </div>

    </div>
  `;

  // Bind Recruiter Actions Events
  const btnShortlist = document.getElementById('profile-btn-shortlist');
  const btnContact = document.getElementById('profile-btn-contact');

  if (btnShortlist && session) {
    btnShortlist.addEventListener('click', () => {
      const activeRecId = session.user.id;
      const nowSaved = window.RecruitersDB.toggleSaveCandidate(activeRecId, candidate.id);
      if (nowSaved) {
        btnShortlist.textContent = '★ Shortlisted';
        btnShortlist.classList.add('active');
      } else {
        btnShortlist.textContent = '☆ Save to Shortlist';
        btnShortlist.classList.remove('active');
      }
    });
  }

  if (btnContact) {
    btnContact.addEventListener('click', () => {
      window.openContactModal(candidate.id, candidate.name);
    });
  }
}

/**
 * Renders a clean error card if profile load fails
 */
function renderError(container, title, message) {
  container.innerHTML = `
    <div class="profile-error-card">
      <span style="font-size: 3rem;">⚠️</span>
      <h1>${escapeHTML(title)}</h1>
      <p>${escapeHTML(message)}</p>
      <a href="candidates.html" class="btn btn-primary">Browse Candidates Directory</a>
    </div>
  `;
}

/**
 * Extracts a username from a github URL
 */
function getGitHubUsername(url) {
  if (!url) return 'profile';
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    return pathParts[0] || 'profile';
  } catch (e) {
    // Return last section if not valid URL
    const parts = url.split('/');
    return parts[parts.length - 1] || 'profile';
  }
}

/**
 * XSS preventer
 */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * Renders a glassmorphic block wall overlay indicating the profile is locked
 */
function renderLockedProfile(container) {
  container.innerHTML = `
    <div class="profile-section container" style="max-width: 900px; margin: 40px auto 80px auto;">
      <!-- Blurred Hero Skeleton -->
      <div class="profile-hero" style="filter: blur(5px); opacity: 0.3; pointer-events: none; margin-bottom: 32px; user-select: none;">
        <div style="display: flex; align-items: center; gap: 40px;">
          <div class="profile-hero-avatar-wrapper">
            <div class="profile-hero-avatar" style="width: 140px; height: 140px; background: rgba(0,0,0,0.1); border-radius: var(--radius-lg);"></div>
          </div>
          <div class="profile-hero-info">
            <span class="badge" style="background: rgba(0,0,0,0.1); width: 100px; height: 20px;"></span>
            <h1 style="width: 250px; height: 40px; background: rgba(0,0,0,0.1); margin-top: 10px;"></h1>
            <div class="role" style="width: 150px; height: 20px; background: rgba(0,0,0,0.1); margin-top: 10px;"></div>
          </div>
        </div>
      </div>

      <!-- Centered Premium Locked Card -->
      <div class="profile-lock-card" style="text-align: center; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: var(--radius-xl); padding: 48px 32px; box-shadow: var(--shadow-lg); margin-top: -80px; position: relative; z-index: 10;">
        <div style="font-size: 3.2rem; margin-bottom: 20px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));">🔒</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; color: var(--primary-text); margin-bottom: 12px;">Full Portfolio Locked</h2>
        <p style="color: var(--secondary-text); font-size: 0.95rem; line-height: 1.6; max-width: 440px; margin: 0 auto 32px auto;">
          To view technical projects, source repositories, live demos, and direct candidate email or social channels, please log in.
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 280px; margin: 0 auto;">
          <button class="btn btn-primary btn-block" onclick="window.openAuthModal('recruiter', 'login')">Login as Recruiter</button>
          <button class="btn btn-secondary btn-block" onclick="window.openAuthModal('candidate', 'login')">Login as Candidate</button>
          <a href="candidates.html" class="btn btn-text" style="color: var(--secondary-text); font-size: 0.9rem; margin-top: 10px;">&larr; Back to Directory</a>
        </div>
      </div>
    </div>
  `;
}
