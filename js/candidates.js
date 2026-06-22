/* ==========================================================================
   SkillBridge Candidate Directory Page Logic - Premium Edition
   ========================================================================== */

function updateFilterBadge(wrapperId, count, clearFn) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  if (count === 0) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `<span style="display:inline-flex;align-items:center;gap:7px;background:#1dbf73;color:#fff;font-size:0.75rem;font-weight:700;border-radius:99px;padding:5px 13px;letter-spacing:0.01em;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
    ${count} Filter${count !== 1 ? 's' : ''} applied
    <button onclick="(${clearFn.toString()})()" style="background:rgba(255,255,255,0.25);border:none;border-radius:50%;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;color:#fff;font-size:0.8rem;line-height:1;" title="Clear all filters">✕</button>
  </span>`;
}

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
      if (sortSelect) sortSelect.value = 'projects';
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
  const session = window.SessionManager && window.SessionManager.getActiveUser();
  const rawMatches = window.CandidatesDB.query({
    search: searchVal,
    skills: selectedSkills,
    sortBy: sortVal
  });

  // Never show the logged-in user their own profile — can't hire yourself
  const matches = session ? rawMatches.filter(c => c.id !== session.user.id) : rawMatches;

  // Update counter
  if (countDisplay) {
    countDisplay.textContent = `Showing ${matches.length} candidate${matches.length === 1 ? '' : 's'}`;
  }

  // Filter badge
  let filterCount = 0;
  if (searchVal.trim()) filterCount++;
  filterCount += selectedSkills.length;
  if (sortVal && sortVal !== 'projects') filterCount++;
  updateFilterBadge('filter-badge-wrap', filterCount, () => {
    if (searchInput) searchInput.value = '';
    skillCheckboxes.forEach(cb => cb.checked = false);
    if (sortSelect) sortSelect.value = 'projects';
    filterAndRender();
  });

  // Handle empty state
  if (matches.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3>No freelancers found</h3>
        <p>Try clearing some filters or searching for a different skill or keyword.</p>
      </div>
    `;
    return;
  }

  const activeMode = localStorage.getItem('skillbridge_mode') || 'freelancer';
  const isRecruiter = session && (session.role === 'recruiter' || (session.user && session.user.bothRoles && activeMode === 'client'));

  // Render cards
  const inSubdir = window.location.pathname.includes('/candidate/') ||
                   window.location.pathname.includes('/recruiter/') ||
                   window.location.pathname.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

  gridContainer.innerHTML = matches.map((candidate, idx) => {
    const rating = candidate.rating || 0;
    const reviewCount = candidate.reviewCount || 0;
    const isSaved = isRecruiter && window.RecruitersDB && window.RecruitersDB.isSaved(session && session.user.id, candidate.id);

    let avatarSrc = candidate.avatar || '';
    if (avatarSrc.startsWith('assets/')) avatarSrc = prefix + avatarSrc;
    else if (avatarSrc.startsWith('../assets/')) avatarSrc = avatarSrc.replace(/^\.\.\//, '');

    const rateNum = candidate.hourlyRate;
    const rate = rateNum ? `₹${rateNum}/hr` : '₹500/hr';
    const initial = candidate.name.charAt(0).toUpperCase();

    const bio = candidate.about
      ? (candidate.about.length > 95 ? candidate.about.slice(0, 95) + '…' : candidate.about)
      : '';

    const visibleSkills = candidate.skills.slice(0, 4);
    const extraCount = candidate.skills.length - visibleSkills.length;
    const skillPills = visibleSkills.map(s => `<span class="upw-skill">${escapeHTML(s)}</span>`).join('');
    const hiddenPills = candidate.skills.slice(4).map(s =>
      `<span class="upw-skill upw-skill-hidden" style="display:none">${escapeHTML(s)}</span>`
    ).join('');
    const moreBtn = extraCount > 0
      ? `<button class="upw-skill-more" onclick="this.closest('.upw-skills').querySelectorAll('.upw-skill-hidden').forEach(function(e){e.style.display='inline-flex'});this.style.display='none'">
           +${extraCount}
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
         </button>`
      : '';

    return `
      <div class="candidate-card">
        ${isRecruiter ? `<button class="card-save-btn ${isSaved ? 'active' : ''}" data-id="${candidate.id}" title="${isSaved ? 'Saved' : 'Save'}" aria-label="Save freelancer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>` : ''}
        <div class="upw-card-top">
          <div class="upw-avatar-wrap">
            <div class="upw-avatar-letter">${initial}</div>
            <img src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(candidate.name)}" class="upw-avatar-img" onerror="this.style.display='none'">
            <div class="upw-online-dot"></div>
          </div>
          <div class="upw-info">
            <div class="upw-name">${escapeHTML(candidate.name)}</div>
            <div class="upw-role">${escapeHTML(candidate.role)}</div>
            <div class="upw-meta-row">
              <span class="upw-rate">${escapeHTML(rate)}</span>
              <span class="upw-sep">·</span>
              ${reviewCount > 0 ? `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span class="upw-rating">${rating.toFixed(1)}</span>
              <span class="upw-review-cnt">(${reviewCount})</span>
              <span class="upw-sep">·</span>` : ''}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              <span class="upw-jobs">${candidate.projects ? candidate.projects.length : 0} project${(candidate.projects && candidate.projects.length === 1) ? '' : 's'}</span>
            </div>
          </div>
        </div>
        <p class="upw-bio">${escapeHTML(bio)}</p>
        <div class="upw-skills">
          ${skillPills}${hiddenPills}${moreBtn}
        </div>
        <a href="${prefix}profile.html?id=${escapeHTML(candidate.id)}" class="upw-see-profile">
          See Profile
        </a>
      </div>
    `;
  }).join('');

  // Bookmark button handlers
  if (isRecruiter) {
    gridContainer.querySelectorAll('.card-save-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const candId = btn.getAttribute('data-id');
        const nowSaved = window.RecruitersDB.toggleSaveCandidate(session.user.id, candId);
        btn.classList.toggle('active', nowSaved);
        btn.title = nowSaved ? 'Saved' : 'Save';
        btn.querySelector('svg').setAttribute('fill', nowSaved ? 'currentColor' : 'none');
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
