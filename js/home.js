
// Top Skills Section Logic
function initTopSkills() {
  const skillBoxes = document.querySelectorAll('.skill-box');
  const btnBrowse = document.getElementById('btn-browse-skills');
  let selectedSkills = new Set();

  if (!skillBoxes.length || !btnBrowse) return;

  skillBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const skill = box.getAttribute('data-skill');
      if (selectedSkills.has(skill)) {
        selectedSkills.delete(skill);
        box.classList.remove('selected');
      } else {
        selectedSkills.add(skill);
        box.classList.add('selected');
      }
    });
  });

  btnBrowse.addEventListener('click', () => {
    if (selectedSkills.size > 0) {
      const skillsQuery = Array.from(selectedSkills).map(encodeURIComponent).join(',');
      window.location.href = `candidates.html?skills=${skillsQuery}`;
    } else {
      window.location.href = 'candidates.html';
    }
  });
}

// Toggle Logic for Hero Section
function initHeroToggle() {
  const btnHire = document.getElementById('btn-toggle-hire');
  const btnWork = document.getElementById('btn-toggle-work');
  
  const heading = document.getElementById('hero-dynamic-heading');
  const subtext = document.getElementById('hero-dynamic-subtext');
  
  const ctaHire = document.getElementById('hero-cta-hire');
  const ctaWork = document.getElementById('hero-cta-work');
  
  if(!btnHire || !btnWork) return;

  btnHire.addEventListener('click', () => {
    btnHire.classList.add('active');
    btnWork.classList.remove('active');
    
    heading.innerHTML = 'Grow at the speed<br>of your ambition';
    subtext.innerHTML = 'Hire experts who use AI to amplify their skills<br>and impact — turning complex work into results';
    
    ctaHire.style.display = 'flex';
    ctaWork.style.display = 'none';
  });

  btnWork.addEventListener('click', () => {
    btnWork.classList.add('active');
    btnHire.classList.remove('active');
    
    heading.innerHTML = 'The future of work<br>is yours';
    subtext.innerHTML = 'The freelance platform designed for the<br>highly-skilled, highly-ambitious, and AI-fluent';
    
    ctaHire.style.display = 'none';
    ctaWork.style.display = 'flex';
  });
  
  // Wire buttons
  const btnFindTalent = document.getElementById('hero-btn-find-talent');
  if(btnFindTalent) {
    btnFindTalent.addEventListener('click', () => {
      window.location.href = 'candidates.html';
    });
  }
  
  const btnFindOpp = document.getElementById('hero-btn-find-opportunities');
  if(btnFindOpp) {
    btnFindOpp.addEventListener('click', () => {
      if (window.openAuthModal) {
        window.openAuthModal('candidate', 'login');
      }
    });
  }
}

/* ==========================================================================
   SkillHire Homepage Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTopSkills();
  initHeroToggle();
  initHIWToggle();
  renderHeroActions();
  renderProjectsShowcase('all');
  setupShowcaseTabs();
  setupSearchBar();
  setupSearchTabs();
});

/**
 * Renders the top 3 candidates as featured items from CandidatesDB
 */
function renderFeaturedCandidates() {
  const container = document.getElementById('featured-candidates-grid');
  if (!container) return;

  // Retrieve all candidates and select the first 3 for featured showcase
  const allCandidates = window.CandidatesDB.getAll();
  const featured = allCandidates.slice(0, 3);

  if (featured.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary-text);">No candidates found.</p>';
    return;
  }

  container.innerHTML = featured.map(candidate => {
    // Generate skills list html
    const skillsHtml = candidate.skills.slice(0, 3).map(skill => 
      `<span class="skill-tag">${escapeHTML(skill)}</span>`
    ).join('');

    // Check availability badge class
    const isInternship = candidate.availability.toLowerCase().includes('internship');
    const badgeClass = isInternship ? 'badge-internship' : 'badge-fulltime';

    return `
      <div class="candidate-card fade-in-section">
        <div class="candidate-header">
          <div class="candidate-avatar-wrapper">
            <img src="${escapeHTML(candidate.avatar)}" alt="${escapeHTML(candidate.name)}" class="candidate-avatar">
            <div class="candidate-status-indicator"></div>
          </div>
          <div class="candidate-header-info">
            <h3>${escapeHTML(candidate.name)}</h3>
            <div class="role">${escapeHTML(candidate.role)}</div>
          </div>
        </div>
        
        <div class="candidate-badge-row">
          <span class="badge ${badgeClass}">${escapeHTML(candidate.availability)}</span>
        </div>
        
        <div class="candidate-skills">
          ${skillsHtml}
          ${candidate.skills.length > 3 ? `<span class="skill-tag">+${candidate.skills.length - 3}</span>` : ''}
        </div>
        
        <div class="candidate-footer">
          <div class="candidate-projects-count">${candidate.projects.length} Project${candidate.projects.length === 1 ? '' : 's'}</div>
          <a href="profile.html?id=${escapeHTML(candidate.id)}" class="btn btn-secondary btn-text" style="padding: 6px 12px; font-size: 0.85rem;">View Profile &rarr;</a>
        </div>
      </div>
    `;
  }).join('');
  
  // Re-run scroll animations to detect newly added cards
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}

/* ==========================================================================
   Dribbble-Style Projects Showcase
   ========================================================================== */

/**
 * Renders the Dribbble-style project shot cards.
 * @param {string} activeFilter - tag to filter by, or 'all'
 */
function renderProjectsShowcase(activeFilter) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const allProjects = window.ProjectsDB.getAll();
  const filtered = activeFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--secondary-text);padding:40px 0;">No projects found for this category.</p>';
    return;
  }

  // Retrieve liked state from localStorage
  const likedProjects = getLikedProjects();

  container.innerHTML = filtered.map((project, idx) => {
    const isLiked = likedProjects.includes(project.id);
    const heartFill = isLiked ? '#1dbf73' : 'none';
    const heartStroke = isLiked ? '#1dbf73' : 'currentColor';

    return `
      <a href="project.html?id=${encodeURIComponent(project.id)}"
         class="project-shot-card fade-in-section"
         id="project-card-${idx}"
         data-project-id="${escapeHTML(project.id)}">

        <!-- Thumbnail + Hover Overlay -->
        <div class="project-shot-thumb">
          <img
            src="${escapeHTML(project.thumbnail)}"
            alt="${escapeHTML(project.title)}"
            class="project-shot-img"
            loading="lazy"
          >
          <div class="project-shot-overlay">
            <div class="project-shot-overlay-title">${escapeHTML(project.title)}</div>
            <div class="project-shot-actions">
              <button
                class="project-shot-action-btn${isLiked ? ' liked' : ''}"
                id="like-btn-${idx}"
                data-project-id="${escapeHTML(project.id)}"
                aria-label="Like project"
                onclick="event.preventDefault(); toggleProjectLike(this, '${escapeHTML(project.id)}', ${idx})"
              >
                <svg viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Like
              </button>
              <button
                class="project-shot-action-btn"
                id="save-btn-${idx}"
                data-project-id="${escapeHTML(project.id)}"
                aria-label="Save project"
                onclick="event.preventDefault(); toggleProjectSave(this, '${escapeHTML(project.id)}', ${idx})"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="project-shot-footer">
          <div class="project-shot-author">
            <img
              src="${escapeHTML(project.authorAvatar)}"
              alt="${escapeHTML(project.authorName)}"
              class="project-shot-avatar"
            >
            <span class="project-shot-author-name">${escapeHTML(project.authorName)}</span>
          </div>
          <div class="project-shot-stats">
            <span class="project-shot-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span id="likes-count-${idx}">${formatCount(project.likes)}</span>
            </span>
            <span class="project-shot-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              ${formatCount(project.views)}
            </span>
          </div>
        </div>
      </a>
    `;
  }).join('');

  // Re-trigger scroll animations for newly injected elements
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}

/**
 * Initialises the How It Works section toggle (For Hiring / For Finding Work).
 */
function initHIWToggle() {
  const btnHiring = document.getElementById('hiw-btn-hiring');
  const btnWork   = document.getElementById('hiw-btn-work');
  const panelHiring = document.getElementById('hiw-panel-hiring');
  const panelWork   = document.getElementById('hiw-panel-work');
  if (!btnHiring || !btnWork) return;

  btnHiring.addEventListener('click', () => {
    btnHiring.classList.add('active');
    btnWork.classList.remove('active');
    panelHiring.style.display = '';
    panelWork.style.display = 'none';
  });

  btnWork.addEventListener('click', () => {
    btnWork.classList.add('active');
    btnHiring.classList.remove('active');
    panelWork.style.display = '';
    panelHiring.style.display = 'none';
  });
}

/**
 * Sets up the Shots / Designers two-tab switcher.
 */
function setupShowcaseTabs() {
  const tabs = document.querySelectorAll('.proj-filter-btn[data-view]');
  const heading  = document.getElementById('showcase-heading');
  const subtext  = document.getElementById('showcase-subtext');
  const panelShots     = document.getElementById('panel-shots');
  const panelDesigners = document.getElementById('panel-designers');
  const browseAll      = document.getElementById('projects-browse-all');

  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');

      if (view === 'shots') {
        heading.textContent  = 'Shots';
        subtext.textContent  = 'Browse real work from talented creators — hover to interact.';
        panelShots.style.display     = '';
        panelDesigners.style.display = 'none';
        if (browseAll) { browseAll.textContent = 'Browse All Talent →'; browseAll.href = 'candidates.html'; }
      } else {
        heading.textContent  = 'Designers';
        subtext.textContent  = 'Discover skilled designers and developers ready to work with you.';
        panelShots.style.display     = 'none';
        panelDesigners.style.display = '';
        renderDesigners();
        if (browseAll) { browseAll.textContent = 'Browse All Designers →'; browseAll.href = 'candidates.html'; }
      }
    });
  });
}

/**
 * Renders candidate profile cards in the Designers panel.
 */
function renderDesigners() {
  const container = document.getElementById('designers-grid');
  if (!container || container.dataset.rendered) return;

  const candidates = window.CandidatesDB.getAll();

  if (!candidates || candidates.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--secondary-text);padding:40px 0;">No designers found.</p>';
    return;
  }

  container.innerHTML = candidates.map((candidate, idx) => {
    // Same UI logic as candidates.js
    const showCount = 3;
    const initialSkills = candidate.skills.slice(0, showCount);
    const hiddenSkills = candidate.skills.slice(showCount);
    
    let skillsHtml = initialSkills.map(skill => 
      `<span class="skill-tag">${escapeHTML(skill)}</span>`
    ).join('');

    if (hiddenSkills.length > 0) {
      skillsHtml += `
        <span class="skill-tag-more" id="more-skills-home-${idx}">+${hiddenSkills.length}</span>
        <span class="hidden-skills" id="hidden-skills-home-${idx}" style="display:none;">
          ${hiddenSkills.map(skill => `<span class="skill-tag">${escapeHTML(skill)}</span>`).join('')}
        </span>
      `;
    }

    const hourlyRateHtml = candidate.hourlyRate 
      ? `<div class="hourly-rate-text">${candidate.hourlyRate}/hr</div>` 
      : '';

    // No bookmark logic for home page guests, keeping it clean
    const bookmarkHtml = '';
    
    return `
      <div class="candidate-card fade-in-section is-visible">
        ${bookmarkHtml}
        <div class="candidate-header">
          <div class="candidate-avatar-wrapper">
            <img src="${escapeHTML(candidate.avatar)}" alt="${escapeHTML(candidate.name)}" class="candidate-avatar">
            <div class="candidate-status-indicator"></div>
          </div>
          <div class="candidate-header-info">
            <h3>${escapeHTML(candidate.name)}</h3>
            <div class="role">${escapeHTML(candidate.role)}</div>
          </div>
        </div>
        
        <div class="candidate-skills" id="skills-container-home-${idx}">
          ${skillsHtml}
        </div>
        
        <div class="candidate-footer">
          <div class="footer-stats">
            <div class="candidate-projects-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              ${candidate.projects.length} Project${candidate.projects.length === 1 ? '' : 's'}
            </div>
            ${hourlyRateHtml}
          </div>
          <a href="profile.html?id=${escapeHTML(candidate.id)}" class="btn-view-profile">View Profile &rarr;</a>
        </div>
      </div>
    `;
  }).join('');

  // Setup expanding skills
  candidates.forEach((candidate, idx) => {
    const moreBtn = document.getElementById(`more-skills-home-${idx}`);
    const hiddenSkills = document.getElementById(`hidden-skills-home-${idx}`);
    if (moreBtn && hiddenSkills) {
      moreBtn.addEventListener('click', () => {
        moreBtn.style.display = 'none';
        hiddenSkills.style.display = 'inline';
      });
    }
  });

  container.dataset.rendered = 'true';
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
}

/**
 * Toggle like state for a project, persisted in localStorage.
 */
function toggleProjectLike(btn, projectId, idx) {
  const liked = getLikedProjects();
  const isLiked = liked.includes(projectId);

  if (isLiked) {
    // Unlike
    const newLiked = liked.filter(id => id !== projectId);
    localStorage.setItem('skillhire_liked_projects', JSON.stringify(newLiked));
    btn.classList.remove('liked');
    btn.querySelector('svg').setAttribute('fill', 'none');
    btn.querySelector('svg').setAttribute('stroke', 'currentColor');
  } else {
    // Like
    liked.push(projectId);
    localStorage.setItem('skillhire_liked_projects', JSON.stringify(liked));
    btn.classList.add('liked');
    btn.querySelector('svg').setAttribute('fill', '#1dbf73');
    btn.querySelector('svg').setAttribute('stroke', '#1dbf73');
  }

  // Update footer like count display (optimistic)
  const countEl = document.getElementById(`likes-count-${idx}`);
  if (countEl) {
    const project = window.ProjectsDB.getById(projectId);
    if (project) {
      const delta = isLiked ? -1 : +1;
      const newCount = project.likes + delta;
      countEl.textContent = formatCount(newCount);
    }
  }
}

/**
 * Toggle save state (visual feedback only — would be tied to auth in prod)
 */
function toggleProjectSave(btn, projectId) {
  const isSaved = btn.dataset.saved === 'true';
  if (isSaved) {
    btn.dataset.saved = 'false';
    btn.querySelector('svg').setAttribute('fill', 'none');
    btn.style.background = '';
    btn.style.color = '';
  } else {
    btn.dataset.saved = 'true';
    btn.querySelector('svg').setAttribute('fill', '#111111');
    btn.style.background = '#f4f4f5';
    btn.style.color = '#111111';
  }
}

/**
 * Returns the array of liked project IDs from localStorage.
 */
function getLikedProjects() {
  try {
    return JSON.parse(localStorage.getItem('skillhire_liked_projects')) || [];
  } catch {
    return [];
  }
}

/**
 * Formats large numbers: 1200 → "1.2k", 18500 → "18.5k"
 */
function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

/**
 * Sets up the search bar — Enter key or click navigates to candidates.html
 */
function setupSearchBar() {
  const input = document.getElementById('hero-search-input');
  const btn   = document.getElementById('hero-search-btn');
  if (!input || !btn) return;

  function doSearch() {
    const query = input.value.trim();
    if (query) {
      window.location.href = `candidates.html?search=${encodeURIComponent(query)}`;
    }
  }

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
}

/**
 * Animates the search tab switcher (visual only — shots / designers / services)
 */
function setupSearchTabs() {
  const tabs = document.querySelectorAll('.search-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Update placeholder text based on active tab
      const input = document.getElementById('hero-search-input');
      const tabName = tab.getAttribute('data-tab');
      if (input) {
        const placeholders = {
          shots:     'What type of work are you looking for?',
          designers: 'Search for designers by name or skill…',
          services:  'Search for services or specialisations…'
        };
        input.placeholder = placeholders[tabName] || input.placeholder;
      }
    });
  });
}

/**
 * Helper to prevent XSS injection
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
 * Dynamically displays login options or dashboard links on the homepage hero area
 */
function renderHeroActions() {
  const container = document.getElementById('hero-actions-container');
  if (!container) return;

  const session = window.SessionManager.getActiveUser();

  if (session) {
    if (session.role === 'recruiter') {
      container.innerHTML = `
        <a href="recruiter-dashboard.html" class="btn btn-primary">Go to Dashboard</a>
        <a href="candidates.html" class="btn btn-secondary">Explore Candidates</a>
      `;
    } else {
      container.innerHTML = `
        <a href="candidate-dashboard.html" class="btn btn-primary">Go to Dashboard</a>
        <a href="profile.html?id=${session.user.id}" class="btn btn-secondary">View My Public Profile</a>
      `;
    }
  } else {
    container.innerHTML = `
      <button class="btn btn-primary" id="hero-login-recruiter">Login as Recruiter</button>
      <button class="btn btn-secondary" id="hero-login-candidate">Login as Candidate</button>
      <a href="candidates.html" class="btn btn-text" style="color: var(--secondary-text); padding: 12px 24px; font-weight: 500;">Explore Talent &rarr;</a>
    `;

    // Bind modal open triggers
    document.getElementById('hero-login-recruiter').addEventListener('click', () => {
      if (typeof window.openAuthModal === 'function') {
        window.openAuthModal('recruiter', 'login');
      }
    });

    document.getElementById('hero-login-candidate').addEventListener('click', () => {
      if (typeof window.openAuthModal === 'function') {
        window.openAuthModal('candidate', 'login');
      }
    });
  }
}

// Skills Grid Logic
function initSkillsGrid() {
  const skillBoxes = document.querySelectorAll('.sg-box');
  const findCandidatesBtn = document.getElementById('btn-find-candidates');

  if (!skillBoxes.length || !findCandidatesBtn) return;

  skillBoxes.forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('active');
    });
  });

  findCandidatesBtn.addEventListener('click', () => {
    const activeBoxes = document.querySelectorAll('.sg-box.active');
    const selectedSkills = Array.from(activeBoxes).map(box => box.getAttribute('data-skill'));
    
    if (selectedSkills.length > 0) {
      const queryParam = encodeURIComponent(selectedSkills.join(','));
      window.location.href = `candidates.html?skills=${queryParam}`;
    } else {
      // If no skills selected, just go to candidates
      window.location.href = 'candidates.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTopSkills();
  initSkillsGrid();
});

