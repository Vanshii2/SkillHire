/* ==========================================================================
   SkillHire Candidate Directory Page Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Bind UI Elements
  const searchInput = document.getElementById('search-input');
  const skillCheckboxes = document.querySelectorAll('.skill-filter-checkbox');
  const availabilityCheckboxes = document.querySelectorAll('.availability-filter-checkbox');
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

  availabilityCheckboxes.forEach(cb => {
    cb.addEventListener('change', filterAndRender);
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      skillCheckboxes.forEach(cb => cb.checked = false);
      availabilityCheckboxes.forEach(cb => cb.checked = false);
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

  if (searchParam) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = searchParam;
  }

  if (skillParam) {
    const skillCheckboxes = document.querySelectorAll('.skill-filter-checkbox');
    skillCheckboxes.forEach(cb => {
      if (cb.value.toLowerCase() === skillParam.toLowerCase()) {
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
  const availabilityCheckboxes = document.querySelectorAll('.availability-filter-checkbox');
  const gridContainer = document.getElementById('candidates-list-grid');
  const countDisplay = document.getElementById('results-count-number');

  if (!gridContainer) return;

  // Gather filter states
  const searchVal = searchInput ? searchInput.value : '';
  
  const selectedSkills = [];
  skillCheckboxes.forEach(cb => {
    if (cb.checked) selectedSkills.push(cb.value);
  });

  const selectedAvailability = [];
  availabilityCheckboxes.forEach(cb => {
    if (cb.checked) selectedAvailability.push(cb.value);
  });

  // Query LocalStorage database
  const matches = window.CandidatesDB.query({
    search: searchVal,
    skills: selectedSkills,
    availability: selectedAvailability
  });

  // Update counter
  if (countDisplay) {
    countDisplay.textContent = `Showing ${matches.length} candidate${matches.length === 1 ? '' : 's'}`;
  }

  // Handle empty state
  if (matches.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">🔍</span>
        <h3>No candidates found</h3>
        <p>Try clearing some filters or searching for another keyword or skill tag.</p>
      </div>
    `;
    return;
  }

  const session = window.SessionManager.getActiveUser();
  const isRecruiter = session && session.role === 'recruiter';

  // Render cards
  gridContainer.innerHTML = matches.map(candidate => {
    // Skills HTML
    const skillsHtml = candidate.skills.slice(0, 3).map(skill => 
      `<span class="skill-tag">${escapeHTML(skill)}</span>`
    ).join('');

    // Availability classification
    const isInternship = candidate.availability.toLowerCase().includes('internship');
    const badgeClass = isInternship ? 'badge-internship' : 'badge-fulltime';

    const isSaved = isRecruiter && window.RecruitersDB.isSaved(session.user.id, candidate.id);
    const bookmarkHtml = isRecruiter ? `
      <button class="bookmark-btn ${isSaved ? 'active' : ''}" data-id="${candidate.id}" title="${isSaved ? 'Remove from shortlist' : 'Save to shortlist'}" style="position: absolute; top: 16px; right: 16px; z-index: 10;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>
    ` : '';

    return `
      <div class="candidate-card fade-in-section is-visible" style="position: relative;">
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
