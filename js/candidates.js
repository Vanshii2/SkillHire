/* ==========================================================================
   SkillHire Candidate Directory Page Logic - Premium Edition
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Bind UI Elements
  const searchInput = document.getElementById('search-input');
  const skillCheckboxes = document.querySelectorAll('.skill-filter-checkbox');
  const sortSelect = document.getElementById('sort-select');
  const clearFiltersBtn = document.getElementById('btn-clear-all');
  
  // Parse URL Parameters for initial search/filters
  parseUrlParams();

  // Initial candidate render based on loaded parameters
  filterAndRender();

  // Add Event Listeners for Filters
  if (searchInput) {
    searchInput.addEventListener('input', filterAndRender);
  }

  skillCheckboxes.forEach(cb => {
    cb.addEventListener('change', filterAndRender);
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', filterAndRender);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      skillCheckboxes.forEach(cb => cb.checked = false);
      if (sortSelect) sortSelect.value = '';
      // Re-render
      filterAndRender();
    });
  }
});

/**
 * Parses URL queries (?search=Frontend or ?skill=React) and sets the initial UI states
 */
function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const skillParam = urlParams.get('skill');
  const skillsParam = urlParams.get('skills');

  if (searchParam) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = searchParam;
  }

  const skillsToMatch = [];
  if (skillParam) skillsToMatch.push(skillParam.toLowerCase());
  if (skillsParam) {
    skillsParam.split(',').forEach(s => skillsToMatch.push(s.toLowerCase()));
  }

  if (skillsToMatch.length > 0) {
    const skillCheckboxes = document.querySelectorAll('.skill-filter-checkbox');
    skillCheckboxes.forEach(cb => {
      if (skillsToMatch.includes(cb.value.toLowerCase())) {
        cb.checked = true;
      }
    });
  }
}

/**
 * Gathers filter choices, queries CandidatesDB, and redraws candidate cards
 */
function filterAndRender() {
  const searchInput = document.getElementById('search-input');
  const skillCheckboxes = document.querySelectorAll('.skill-filter-checkbox');
  const sortSelect = document.getElementById('sort-select');
  const gridContainer = document.getElementById('candidates-list-grid');
  const countDisplay = document.getElementById('results-count-number');

  if (!gridContainer) return;

  // Gather filter states
  const searchVal = searchInput ? searchInput.value : '';
  
  const selectedSkills = [];
  skillCheckboxes.forEach(cb => {
    if (cb.checked) selectedSkills.push(cb.value);
  });

  const sortVal = sortSelect ? sortSelect.value : '';

  // Query LocalStorage database
  const matches = window.CandidatesDB.query({
    search: searchVal,
    skills: selectedSkills,
    sortBy: sortVal
  });

  // Update counter
  if (countDisplay) {
    countDisplay.textContent = `Showing ${matches.length} candidate${matches.length === 1 ? '' : 's'}`;
  }

  // Handle empty state
  if (matches.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No candidates found</h3>
        <p>Try clearing some filters or searching for another keyword or skill tag.</p>
      </div>
    `;
    return;
  }

  const session = window.SessionManager && window.SessionManager.getActiveUser();
  const isRecruiter = session && session.role === 'recruiter';

  // Render cards
  gridContainer.innerHTML = matches.map((candidate, idx) => {
    // Determine how many skills to show initially
    const showCount = 3;
    const initialSkills = candidate.skills.slice(0, showCount);
    const hiddenSkills = candidate.skills.slice(showCount);
    
    let skillsHtml = initialSkills.map(skill => 
      `<span class="skill-tag">${escapeHTML(skill)}</span>`
    ).join('');

    if (hiddenSkills.length > 0) {
      skillsHtml += `
        <span class="skill-tag-more" id="more-skills-${idx}">+${hiddenSkills.length}</span>
        <span class="hidden-skills" id="hidden-skills-${idx}" style="display:none;">
          ${hiddenSkills.map(skill => `<span class="skill-tag">${escapeHTML(skill)}</span>`).join('')}
        </span>
      `;
    }

    const hourlyRateHtml = candidate.hourlyRate 
      ? `<div class="hourly-rate-text">${candidate.hourlyRate}/hr</div>` 
      : '';

    const isSaved = isRecruiter && window.RecruitersDB && window.RecruitersDB.isSaved(session.user.id, candidate.id);
    const bookmarkHtml = isRecruiter ? `
      <button class="bookmark-btn ${isSaved ? 'active' : ''}" data-id="${candidate.id}" title="${isSaved ? 'Remove from shortlist' : 'Save to shortlist'}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>
    ` : '';

    const inSubdir = window.location.pathname.includes('/candidate/') || 
                     window.location.pathname.includes('/recruiter/') || 
                     window.location.pathname.includes('/shared/');
    const prefix = inSubdir ? '../' : '';
    
    // Resolve avatar path
    let avatarSrc = candidate.avatar;
    if (avatarSrc && avatarSrc.startsWith('assets/')) {
      avatarSrc = prefix + avatarSrc;
    } else if (avatarSrc && avatarSrc.startsWith('../assets/')) {
      avatarSrc = (inSubdir ? '../' : '') + avatarSrc.replace(/^\.\.\//, '');
    }

    return `
      <div class="candidate-card fade-in-section is-visible">
        ${bookmarkHtml}
        <div class="candidate-header">
          <div class="candidate-avatar-wrapper">
            <img src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(candidate.name)}" class="candidate-avatar">
            <div class="candidate-status-indicator"></div>
          </div>
          <div class="candidate-header-info">
            <h3>${escapeHTML(candidate.name)}</h3>
            <div class="role">${escapeHTML(candidate.role)}</div>
          </div>
        </div>
        
        <div class="candidate-skills" id="skills-container-${idx}">
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
          <a href="${prefix}profile.html?id=${escapeHTML(candidate.id)}" class="btn-view-profile">View Profile &rarr;</a>
        </div>
      </div>
    `;
  }).join('');

  // Expand skills functionality
  matches.forEach((candidate, idx) => {
    const moreBtn = document.getElementById(`more-skills-${idx}`);
    const hiddenSkills = document.getElementById(`hidden-skills-${idx}`);
    if (moreBtn && hiddenSkills) {
      moreBtn.addEventListener('click', () => {
        moreBtn.style.display = 'none';
        hiddenSkills.style.display = 'inline';
      });
    }
  });

  // Bind click event listeners for bookmark buttons
  if (isRecruiter) {
    const bookmarkButtons = gridContainer.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const candId = btn.getAttribute('data-id');
        const activeRecId = session.user.id;
        const nowSaved = window.RecruitersDB.toggleSaveCandidate(activeRecId, candId);
        
        if (nowSaved) {
          btn.classList.add('active');
          btn.title = 'Remove from shortlist';
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        } else {
          btn.classList.remove('active');
          btn.title = 'Save to shortlist';
          btn.querySelector('svg').setAttribute('fill', 'none');
        }
      });
    });
  }

  // Update Scroll Animations
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
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
