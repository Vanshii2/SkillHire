/* ==========================================================================
   SkillHire Homepage Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderHeroActions();
  renderFeaturedCandidates();
  setupMarqueeClicks();
  setupPopularSkillsClicks();
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

/**
 * Handle category marquee clicks (Redirect to candidates directory page with role pre-searched)
 */
function setupMarqueeClicks() {
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const searchRole = card.getAttribute('data-role');
      if (searchRole) {
        window.location.href = `candidates.html?search=${encodeURIComponent(searchRole)}`;
      }
    });
  });
}

/**
 * Handle popular skills tag clicks (Redirect to candidates directory page with skill pre-filtered)
 */
function setupPopularSkillsClicks() {
  const skillTags = document.querySelectorAll('.skills-cloud .skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const skillName = tag.getAttribute('data-skill');
      if (skillName) {
        window.location.href = `candidates.html?skill=${encodeURIComponent(skillName)}`;
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
