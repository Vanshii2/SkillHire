/* ==========================================================================
   SkillBridge Candidate Profile Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
});

// Helper to resolve asset path prefix depending on current subdirectory depth
function resolveAssetPath(path) {
  if (!path) return '';
  const inSubdir = window.location.pathname.includes('/candidate/') || 
                   window.location.pathname.includes('/recruiter/') || 
                   window.location.pathname.includes('/shared/');
  
  // Clean up leading ../ or duplicate prefixes
  let cleanPath = path.replace(/^\.\.\//, '');
  if (cleanPath.startsWith('assets/')) {
    return (inSubdir ? '../' : '') + cleanPath;
  }
  return path;
}

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

  // ── Login gate ──
  const session = window.SessionManager && window.SessionManager.getActiveUser();
  if (!session) {
    mainContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:48px 24px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <h2 style="font-size:1.6rem;font-weight:800;color:#111;letter-spacing:-0.02em;margin-bottom:10px;">Log in to view this profile</h2>
        <p style="color:#666;font-size:0.95rem;max-width:360px;line-height:1.6;margin-bottom:28px;">Create a free account or log in to browse freelancer profiles, view portfolios, and connect with talent.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" style="padding:11px 28px;" onclick="window.openAuthModal && window.openAuthModal('login')">Log In</button>
          <button class="btn btn-secondary" style="padding:11px 28px;" onclick="window.openAuthModal && window.openAuthModal('register')">Create Account</button>
        </div>
        <a href="candidates.html" style="margin-top:20px;font-size:0.85rem;color:#aaa;text-decoration:none;">&larr; Back to Browse Freelancers</a>
      </div>`;
    return;
  }

  // Query candidate details
  const candidate = window.CandidatesDB.getById(candidateId);
  if (!candidate) {
    renderError(mainContainer, 'Candidate Profile Not Found', 'The candidate you are trying to view does not exist in our database.');
    return;
  }

  const inSubdir = window.location.pathname.includes('/candidate/') ||
                   window.location.pathname.includes('/recruiter/') ||
                   window.location.pathname.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

  // Set page HTML title dynamic
  document.title = `${candidate.name} — ${candidate.role} | SkillBridge`;

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

  // Merge candidate.projects with PROJECTS_DATA showcase items for this author
  const showcaseItems = (window.ProjectsDB ? window.ProjectsDB.getByAuthor(candidateId) : []).map(p => ({
    name: p.title,
    description: p.description,
    techStack: p.tags || [],
    screenshot: p.thumbnail,
    github: null,
    live: null,
    likes: p.likes,
    views: p.views,
    isShowcase: true
  }));

  const allProjects = [...showcaseItems, ...candidate.projects];

  const projectsHtml = allProjects.length === 0
    ? `<div style="color:var(--secondary-text);font-size:0.9rem;padding:24px 0;">No projects showcased yet.</div>`
    : allProjects.map(proj => {
    const techTags = proj.techStack.map(tech =>
      `<span class="skill-tag">${escapeHTML(tech)}</span>`
    ).join('');

    const metaHtml = proj.isShowcase ? `
      <div style="display:flex;gap:14px;margin-bottom:8px;font-size:0.78rem;color:#aaa;">
        <span>❤ ${proj.likes} likes</span>
        <span>👁 ${proj.views?.toLocaleString()} views</span>
      </div>` : '';

    return `
      <div class="project-card fade-in-section is-visible">
        <div class="project-img-wrapper">
          <img src="${resolveAssetPath(proj.screenshot)}" alt="${escapeHTML(proj.name)}" class="project-img" onerror="this.style.display='none'">
        </div>
        <div class="project-info">
          <h3>${escapeHTML(proj.name)}</h3>
          ${metaHtml}
          <p class="project-description">${escapeHTML(proj.description)}</p>
          <div class="project-tech">${techTags}</div>
          <div class="project-actions">
            ${proj.github ? `<a href="${escapeHTML(proj.github)}" target="_blank" class="btn btn-secondary">Source Code</a>` : ''}
            ${proj.live ? `<a href="${escapeHTML(proj.live)}" target="_blank" class="btn btn-primary">Live Demo</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Get Reviews from database
  let reviewsHtml = '';
  if (window.ReviewsController) {
    const reviews = window.ReviewsController.getReviewsForCandidate(candidateId) || [];
    if (reviews.length > 0) {
      reviewsHtml = `
        <div class="sidebar-card" style="margin-top: 32px; grid-column: 1 / -1;">
          <h2 style="margin-bottom: 20px;">Client Reviews & Feedback</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${reviews.map(rev => {
              const starsHtml = window.ReviewsController.renderStarsHTML(rev.rating);
              return `
                <div style="border-bottom: 1px solid rgba(0,0,0,0.03); padding-bottom: 16px; margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div>${starsHtml}</div>
                    <span style="font-size: 0.75rem; color: var(--secondary-text);">${new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style="font-size: 0.9rem; font-style: italic; color: var(--secondary-text); line-height: 1.5;">
                    "${escapeHTML(rev.review)}"
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  // Get Average rating badge details
  let ratingBadgeHtml = '';
  if (window.ReviewsController) {
    const stats = window.ReviewsController.getAverageRating(candidateId);
    if (stats.count > 0) {
      const ratingStars = window.ReviewsController.renderStarsHTML(stats.average);
      ratingBadgeHtml = `
        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; margin-top: 6px;">
          <span>${ratingStars}</span>
          <strong style="color: var(--primary-text);">${stats.average}</strong>
          <span style="color: var(--secondary-text);">(${stats.count} ${stats.count === 1 ? 'review' : 'reviews'})</span>
        </div>
      `;
    }
  }

  let actionButtonsHtml = '';

  if (session) {
    if (session.role === 'recruiter') {
      const isSaved = window.RecruitersDB.isSaved(session.user.id, candidate.id);
      actionButtonsHtml = `
        <button class="btn btn-secondary ${isSaved ? 'active' : ''}" id="profile-btn-shortlist" style="padding: 10px 20px; font-size: 0.9rem;">
          ${isSaved ? '★ Shortlisted' : '☆ Save to Shortlist'}
        </button>
        <button class="btn btn-secondary" id="profile-btn-contact" style="padding: 10px 20px; font-size: 0.9rem;">
          Contact Candidate
        </button>
        <button class="btn btn-primary" id="profile-btn-hire" style="padding: 10px 20px; font-size: 0.9rem; background-color: var(--accent-color); border-color: var(--accent-color);">
          Hire Candidate
        </button>
      `;
    } else if (session.role === 'candidate' && session.user.id === candidate.id) {
      actionButtonsHtml = `
        <a href="${prefix}candidate/dashboard.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">
          Edit My Profile
        </a>
      `;
    }
  } else {
    // Guest — show login prompt
    actionButtonsHtml = `
      <button class="btn btn-primary" onclick="window.openAuthModal('login')" style="padding:10px 20px;font-size:0.9rem;">
        Log In to Contact
      </button>
    `;
  }

  mainContainer.innerHTML = `
    <div class="profile-section container">
      
      <!-- Profile Header Hero -->
      <div class="profile-hero fade-in-section is-visible" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 40px; flex-wrap: wrap;">
          <div class="profile-hero-avatar-wrapper">
            <img src="${resolveAssetPath(candidate.avatar)}" alt="${escapeHTML(candidate.name)}" class="profile-hero-avatar">
          </div>
          <div class="profile-hero-info">
            <span class="badge ${badgeClass}">${escapeHTML(candidate.availability)}</span>
            <h1 style="margin-top: 4px;">${escapeHTML(candidate.name)}</h1>
            <div class="role">${escapeHTML(candidate.role)}</div>
            ${ratingBadgeHtml}
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

        <!-- Render Reviews Section -->
        ${reviewsHtml}

      </div>

    </div>
  `;

  // Bind Recruiter Actions Events
  const btnShortlist = document.getElementById('profile-btn-shortlist');
  const btnContact = document.getElementById('profile-btn-contact');
  const btnHire = document.getElementById('profile-btn-hire');

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

  if (btnHire) {
    btnHire.addEventListener('click', () => {
      // Open auth modal or a contact prompt if RequestsController not available
      if (window.openAuthModal) window.openAuthModal('login');
    });
  }
}

/**
 * Renders a clean error card if profile load fails
 */
function renderError(container, title, message) {
  const inSubdir = window.location.pathname.includes('/candidate/') || 
                   window.location.pathname.includes('/recruiter/') || 
                   window.location.pathname.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

  container.innerHTML = `
    <div class="profile-error-card">
      
      <h1>${escapeHTML(title)}</h1>
      <p>${escapeHTML(message)}</p>
      <a href="${prefix}candidates.html" class="btn btn-primary">Browse Candidates Directory</a>
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
  const inSubdir = window.location.pathname.includes('/candidate/') || 
                   window.location.pathname.includes('/recruiter/') || 
                   window.location.pathname.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

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
        <div style="width:64px;height:64px;border-radius:50%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; color: var(--primary-text); margin-bottom: 12px;">Full Portfolio Locked</h2>
        <p style="color: var(--secondary-text); font-size: 0.95rem; line-height: 1.6; max-width: 440px; margin: 0 auto 32px auto;">
          To view technical projects, source repositories, live demos, and direct candidate email or social channels, please log in.
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 280px; margin: 0 auto;">
          <button class="btn btn-primary btn-block" onclick="window.openAuthModal('recruiter', 'login')">Login as Recruiter</button>
          <button class="btn btn-secondary btn-block" onclick="window.openAuthModal('candidate', 'login')">Login as Candidate</button>
          <a href="${prefix}candidates.html" class="btn btn-text" style="color: var(--secondary-text); font-size: 0.9rem; margin-top: 10px;">&larr; Back to Directory</a>
        </div>
      </div>
    </div>
  `;
}
