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

  const session = window.SessionManager && window.SessionManager.getActiveUser();

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
  // Determine availability from last login (>2 months = inactive)
  const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;
  const lastLogin = candidate.lastLoginAt || 0;
  const isInactive = lastLogin > 0 && (Date.now() - lastLogin) > TWO_MONTHS_MS;
  const displayAvailability = isInactive ? 'Inactive' : (candidate.availability || 'Available');
  const isInternship = !isInactive && displayAvailability.toLowerCase().includes('internship');
  const badgeClass = isInactive ? 'badge-inactive' : (isInternship ? 'badge-internship' : 'badge-fulltime');

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

  // Showcase projects from ProjectsDB (home-feed quality, link to full project page)
  const showcaseProjects = window.ProjectsDB ? window.ProjectsDB.getByAuthor(candidateId) : [];

  // Only show user-added projects that have the new multi-image format (skip old seeded entries)
  const devProjects = (candidate.projects || []).filter(p => p.images && p.images.length > 0);
  const totalProjectCount = showcaseProjects.length + devProjects.length;

  // Store dev projects globally for modal click handler
  window._profileProjects = devProjects.map(p => ({
    ...p,
    _resolvedThumb: '',
    _resolvedImages: p.images && p.images.length
      ? p.images
      : (p.thumbnail ? [p.thumbnail] : (p.screenshot ? [resolveAssetPath(p.screenshot)] : []))
  }));

  const isOwnProfile = session && session.role === 'candidate' && session.user.id === candidateId;
  const cardStyle = `border-radius:14px;overflow:hidden;border:1px solid var(--border-color);background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.18s,transform 0.18s;`;
  const cardHover = `onmouseover="this.style.boxShadow='0 8px 28px rgba(0,0,0,0.10)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'"`;

  const showcaseCards = showcaseProjects.map(proj => {
    const thumbSrc = resolveAssetPath(proj.thumbnail);
    const tagsHtml = (proj.tags || []).map(t => `<span style="font-size:0.72rem;font-weight:600;color:#1dbf73;background:#f0fdf7;border-radius:99px;padding:2px 10px;">${escapeHTML(t)}</span>`).join('');
    return `
      <a href="${prefix}project.html?id=${encodeURIComponent(proj.id)}" style="${cardStyle}text-decoration:none;display:block;color:inherit;" ${cardHover}>
        ${thumbSrc ? `
          <div style="width:100%;height:190px;overflow:hidden;background:#f5f5f5;">
            <img src="${escapeHTML(thumbSrc)}" alt="${escapeHTML(proj.title)}"
              style="width:100%;height:100%;object-fit:cover;"
              onerror="this.parentElement.style.background='#f0f0f0';this.style.display='none';">
          </div>
        ` : `<div style="width:100%;height:140px;background:linear-gradient(135deg,#f0fdf7,#e8f5e9);display:flex;align-items:center;justify-content:center;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c8e6c9" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>`}
        <div style="padding:14px 16px 16px;">
          ${tagsHtml ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">${tagsHtml}</div>` : ''}
          <h3 style="font-size:0.97rem;font-weight:800;color:#1a1a2e;margin:0 0 5px;">${escapeHTML(proj.title)}</h3>
          <p style="font-size:0.83rem;color:#666;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHTML(proj.description || '')}</p>
          <div style="margin-top:10px;font-size:0.75rem;color:#1dbf73;font-weight:600;">View details →</div>
        </div>
      </a>`;
  });

  const devCards = devProjects.map((proj, idx) => {
    const thumbSrc = proj.thumbnail
      ? proj.thumbnail
      : (proj.images && proj.images[0] ? proj.images[0]
        : (proj.screenshot ? resolveAssetPath(proj.screenshot) : ''));
    const safeId = escapeHTML(proj.id || '');
    return `
      <div onclick="openProjectModal(${idx})" style="${cardStyle}cursor:pointer;position:relative;" ${cardHover}>
        ${isOwnProfile ? `
          <button onclick="event.stopPropagation();deleteProfileProject('${safeId}')"
            title="Delete project"
            style="position:absolute;top:8px;right:8px;z-index:5;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,0.45);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:background 0.15s;"
            onmouseover="this.style.background='rgba(220,38,38,0.85)'" onmouseout="this.style.background='rgba(0,0,0,0.45)'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>` : ''}
        ${thumbSrc ? `
          <div style="width:100%;height:190px;overflow:hidden;background:#f5f5f5;">
            <img src="${thumbSrc.startsWith('data:') ? thumbSrc : escapeHTML(thumbSrc)}"
              alt="${escapeHTML(proj.name)}"
              style="width:100%;height:100%;object-fit:cover;"
              onerror="this.parentElement.style.background='#f0f0f0';this.style.display='none';">
          </div>
        ` : `<div style="width:100%;height:140px;background:linear-gradient(135deg,#f0fdf7,#e8f5e9);display:flex;align-items:center;justify-content:center;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c8e6c9" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>`}
        <div style="padding:16px 18px 18px;">
          <h3 style="font-size:0.97rem;font-weight:800;color:#1a1a2e;margin:0 0 6px;">${escapeHTML(proj.name)}</h3>
          <p style="font-size:0.85rem;color:#666;line-height:1.6;margin:0;">${escapeHTML(proj.description || '')}</p>
          <div style="margin-top:10px;font-size:0.75rem;color:#1dbf73;font-weight:600;">View details →</div>
        </div>
      </div>`;
  });

  const allCards = [...showcaseCards, ...devCards];
  const projectsHtml = allCards.length === 0
    ? `<div style="color:var(--secondary-text);font-size:0.9rem;padding:24px 0;">No projects yet.</div>`
    : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">${allCards.join('')}</div>`;

  // Reviews are rendered dynamically via injectRatingSection() after DOM is ready
  let reviewsHtml = '';

  // Get Average rating badge details
  let ratingBadgeHtml = '';
  if (window.ReviewsDB) {
    const stats = window.ReviewsDB.getAverageRating(candidateId);
    if (stats.count > 0) {
      const ratingStars = window.ReviewsDB.renderStarsHTML(stats.average);
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

  const activeMode = localStorage.getItem('skillbridge_mode') || 'freelancer';
  const isClientMode = session && (session.role === 'recruiter' || (session.user.bothRoles && activeMode === 'client'));

  if (session) {
    if (isClientMode) {
      const clientRecId = session.user.id;
      const isSaved = window.RecruitersDB.isSaved(clientRecId, candidate.id);
      actionButtonsHtml = `
        ${isOwnProfile ? `<a href="${prefix}edit-profile.html" class="btn btn-secondary" style="padding:10px 20px;font-size:0.9rem;">Edit Profile</a>` : `
        <button class="btn btn-secondary ${isSaved ? 'active' : ''}" id="profile-btn-shortlist" style="padding: 10px 20px; font-size: 0.9rem;">
          ${isSaved ? '★ Shortlisted' : '☆ Save to Shortlist'}
        </button>
        <button class="btn btn-secondary" id="profile-btn-contact" style="padding: 10px 20px; font-size: 0.9rem;">
          Contact Candidate
        </button>`}
        <button class="btn btn-primary" id="profile-btn-hire" style="padding: 10px 20px; font-size: 0.9rem; background-color: var(--accent-color); border-color: var(--accent-color);">
          Hire Candidate
        </button>
      `;
    } else if (isOwnProfile) {
      actionButtonsHtml = `
        <a href="${prefix}edit-profile.html" class="btn btn-secondary" style="padding:10px 20px;font-size:0.9rem;">
          Edit My Profile
        </a>
        <a href="${prefix}edit-profile.html#add-project-form" class="btn btn-primary" style="padding:10px 20px;font-size:0.9rem;background:#1dbf73;border-color:#1dbf73;display:inline-flex;align-items:center;gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Projects
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
            <span class="badge ${badgeClass}">${escapeHTML(displayAvailability)}</span>
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
          <h2>Projects &amp; Work <span style="font-size:0.78rem;font-weight:600;color:#aaa;margin-left:8px;">${totalProjectCount} total</span></h2>
          <p style="color: var(--secondary-text); margin-bottom: 24px;">Work built by ${escapeHTML(candidate.name.split(' ')[0])}.</p>
          <div class="projects-list">
            ${projectsHtml}
          </div>

          ${(() => {
            if (!isOwnProfile) return '';
            const savedIds = candidate.savedProjects || [];
            if (savedIds.length === 0) return '';
            const savedItems = savedIds.map(id => window.ProjectsDB ? window.ProjectsDB.getById(id) : null).filter(Boolean);
            if (savedItems.length === 0) return '';
            const savedCardsHtml = savedItems.map(p => {
              const thumb = resolveAssetPath(p.thumbnail);
              const tagsHtml = (p.tags || []).map(t => `<span style="font-size:0.7rem;font-weight:600;color:#1dbf73;background:#f0fdf7;border-radius:99px;padding:2px 9px;">${escapeHTML(t)}</span>`).join('');
              return `<a href="${prefix}project.html?id=${encodeURIComponent(p.id)}"
                style="border-radius:14px;overflow:hidden;border:1px solid var(--border-color);background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.18s,transform 0.18s;text-decoration:none;display:block;color:inherit;"
                onmouseover="this.style.boxShadow='0 8px 28px rgba(0,0,0,0.10)';this.style.transform='translateY(-2px)'"
                onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
                ${thumb ? `<div style="width:100%;height:180px;overflow:hidden;background:#f5f5f5;"><img src="${escapeHTML(thumb)}" alt="${escapeHTML(p.title)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display='none'"></div>` : ''}
                <div style="padding:14px 16px 16px;">
                  ${tagsHtml ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:7px;">${tagsHtml}</div>` : ''}
                  <h3 style="font-size:0.95rem;font-weight:800;color:#1a1a2e;margin:0 0 4px;">${escapeHTML(p.title)}</h3>
                  <p style="font-size:0.82rem;color:#666;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHTML(p.description || '')}</p>
                  <div style="margin-top:9px;font-size:0.73rem;color:#1dbf73;font-weight:600;">View details →</div>
                </div>
              </a>`;
            }).join('');
            return `
              <div style="margin-top:48px;">
                <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'grid':'none';this.querySelector('.saved-chevron').style.transform=this.nextElementSibling.style.display==='none'?'rotate(0deg)':'rotate(180deg)'"
                  style="display:flex;align-items:center;gap:10px;cursor:pointer;padding-bottom:16px;border-bottom:1px solid #f0f0f0;user-select:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  <h2 style="margin:0;font-size:1.05rem;font-weight:800;color:#111;">Saved Projects</h2>
                  <span style="font-size:0.75rem;font-weight:700;color:#fff;background:#1dbf73;border-radius:99px;padding:2px 8px;">${savedItems.length}</span>
                  <svg class="saved-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto;transition:transform 0.2s;transform:rotate(180deg);"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:20px;">
                  ${savedCardsHtml}
                </div>
              </div>`;
          })()}
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

  if (btnShortlist && session && isClientMode) {
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
      openHireModal(candidate, session);
    });
  }

  // Inject rating section for clients
  if (isClientMode) {
    injectRatingSection(candidate, session);
  }
}

/**
 * Inject a "Rate this freelancer" section on the profile page for clients
 */
function injectRatingSection(candidate, session) {
  const reviewStats = window.ReviewsDB ? window.ReviewsDB.getAverageRating(candidate.id) : { average: 0, count: 0 };
  const alreadyReviewed = window.ReviewsDB && window.ReviewsDB.hasReviewed(session.user.id, candidate.id);
  const reviews = window.ReviewsDB ? window.ReviewsDB.getForCandidate(candidate.id) : [];

  const grid = document.querySelector('.profile-grid');
  if (!grid) return;

  const section = document.createElement('div');
  section.id = 'profile-rating-section';
  section.style.cssText = 'grid-column:1/-1;margin-top:8px;';
  section.innerHTML = `
    <div class="sidebar-card" style="background:#fff;border-radius:16px;padding:28px;">
      <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:16px;">
        ${reviewStats.count > 0 ? `Reviews (${reviewStats.count})` : 'Reviews'}
      </h2>
      ${reviewStats.count > 0 ? `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <span style="font-size:2.2rem;font-weight:900;color:#1a1a2e;">${reviewStats.average}</span>
          <div>
            <div style="font-size:1.2rem;">${window.ReviewsDB.renderStarsHTML(reviewStats.average)}</div>
            <div style="font-size:0.82rem;color:#888;">${reviewStats.count} review${reviewStats.count === 1 ? '' : 's'}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:20px;">
          ${reviews.slice(-5).reverse().map(r => `
            <div style="padding:14px;background:#f8f9fa;border-radius:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-weight:700;font-size:0.88rem;">${r.clientName || 'Client'}</span>
                <span style="font-size:0.85rem;">${window.ReviewsDB.renderStarsHTML(r.rating)}</span>
              </div>
              ${r.comment ? `<p style="font-size:0.85rem;color:#555;margin:0;">${r.comment}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : '<p style="color:#888;font-size:0.9rem;margin-bottom:16px;">No reviews yet.</p>'}
      ${!alreadyReviewed ? `
        <div id="rate-form-wrap" style="border-top:1px solid #f0f0f0;padding-top:18px;">
          <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:12px;">Leave a Review</h3>
          <div style="display:flex;gap:6px;margin-bottom:12px;" id="star-picker">
            ${[1,2,3,4,5].map(n => `<button data-star="${n}" style="font-size:1.6rem;background:none;border:none;cursor:pointer;color:#d0d0d0;padding:0;">★</button>`).join('')}
          </div>
          <textarea id="review-comment" placeholder="Share your experience working with ${candidate.name.split(' ')[0]}..." style="width:100%;border:1.5px solid #e8e8e8;border-radius:10px;padding:10px 14px;font-size:0.9rem;resize:vertical;min-height:80px;font-family:inherit;box-sizing:border-box;"></textarea>
          <button id="submit-review-btn" class="btn btn-primary" style="margin-top:10px;padding:10px 24px;">Submit Review</button>
          <div id="review-error" style="color:#e53e3e;font-size:0.85rem;margin-top:6px;"></div>
        </div>
      ` : '<div style="color:#1dbf73;font-weight:600;font-size:0.9rem;padding-top:12px;border-top:1px solid #f0f0f0;">✓ You have already reviewed this freelancer.</div>'}
    </div>
  `;
  grid.appendChild(section);

  // Star picker interaction
  let selectedStar = 0;
  const starBtns = section.querySelectorAll('#star-picker button');
  starBtns.forEach(btn => {
    btn.addEventListener('mouseover', () => {
      const n = +btn.dataset.star;
      starBtns.forEach(b => b.style.color = +b.dataset.star <= n ? '#f59e0b' : '#d0d0d0');
    });
    btn.addEventListener('mouseout', () => {
      starBtns.forEach(b => b.style.color = +b.dataset.star <= selectedStar ? '#f59e0b' : '#d0d0d0');
    });
    btn.addEventListener('click', () => {
      selectedStar = +btn.dataset.star;
      starBtns.forEach(b => b.style.color = +b.dataset.star <= selectedStar ? '#f59e0b' : '#d0d0d0');
    });
  });

  const submitBtn = section.querySelector('#submit-review-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const comment = section.querySelector('#review-comment').value.trim();
      const errEl = section.querySelector('#review-error');
      if (!selectedStar) { errEl.textContent = 'Please select a star rating.'; return; }
      window.ReviewsDB.add(session.user.id, session.user.name, candidate.id, selectedStar, comment);
      section.remove();
      injectRatingSection(candidate, session);
    });
  }
}

/**
 * Opens a hire/contact modal for a logged-in client to send a project request
 */
function openHireModal(candidate, session) {
  const existing = document.getElementById('hire-modal-overlay');
  if (existing) existing.remove();

  // Check if there's already an active direct-hire or accepted escrow for this pair
  const allJobs = window.JobsDB ? window.JobsDB.getAll() : [];
  const activeHire = allJobs.find(j =>
    j.clientId === session.user.id &&
    j.invitedFreelancerId === candidate.id &&
    j.directHire &&
    ['open', 'in_progress'].includes(j.status || 'open')
  );
  const allEscrows = window.EscrowDB ? window.EscrowDB.getAll() : [];
  const activeEscrow = allEscrows.find(e =>
    e.clientId === session.user.id && e.freelancerId === candidate.id &&
    !['released', 'disputed'].includes(e.status)
  );

  if (activeHire || activeEscrow) {
    const overlay2 = document.createElement('div');
    overlay2.id = 'hire-modal-overlay';
    overlay2.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);';
    overlay2.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:40px 36px;max-width:420px;width:100%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.18);position:relative;">
        <button onclick="document.getElementById('hire-modal-overlay').remove()" style="position:absolute;top:14px;right:14px;background:none;border:none;cursor:pointer;color:#aaa;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div style="width:56px;height:56px;background:rgba(29,191,115,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size:1.05rem;font-weight:800;color:#111;margin-bottom:8px;">Already Working Together</h3>
        <p style="font-size:0.88rem;color:#555;line-height:1.6;margin-bottom:20px;">
          You already have an active contract or pending invite with <strong>${escapeHTML(candidate.name)}</strong>.
          ${activeEscrow ? `The escrow status is <strong>${activeEscrow.status.replace('_',' ')}</strong>.` : 'The invite is awaiting their response.'}
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a href="${(function(){const p=window.location.pathname;const pre=p.includes('/candidate/')||p.includes('/recruiter/')||p.includes('/shared/')?'../':'';return pre+'recruiter/dashboard.html';})()}" style="padding:10px 20px;background:#1dbf73;color:#fff;border-radius:8px;font-weight:700;font-size:0.88rem;text-decoration:none;">Go to Dashboard</a>
          <button onclick="document.getElementById('hire-modal-overlay').remove()" style="padding:10px 20px;background:#f5f5f5;color:#555;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.88rem;font-family:inherit;">Close</button>
        </div>
      </div>`;
    overlay2.addEventListener('click', e => { if (e.target === overlay2) overlay2.remove(); });
    document.body.appendChild(overlay2);
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'hire-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);';

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:20px;padding:36px 36px 32px;max-width:520px;width:100%;position:relative;box-shadow:0 24px 64px rgba(0,0,0,0.18);max-height:90vh;overflow-y:auto;">
      <button onclick="document.getElementById('hire-modal-overlay').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:#aaa;padding:4px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
        <div style="width:48px;height:48px;border-radius:50%;background:#1dbf73;color:#fff;font-size:1.1rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:var(--font-heading);">${escapeHTML(candidate.name.charAt(0))}</div>
        <div>
          <div style="font-size:1rem;font-weight:800;color:#111;">Contact ${escapeHTML(candidate.name)}</div>
          <div style="font-size:0.82rem;color:#888;">${escapeHTML(candidate.role)}</div>
        </div>
      </div>
      <form id="hire-form">
        <div style="margin-bottom:16px;">
          <label style="font-size:0.8rem;font-weight:700;color:#555;display:block;margin-bottom:6px;">Your Name</label>
          <input type="text" id="hf-name" value="${escapeHTML(session.user.name)}" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-family:var(--font-body);font-size:0.9rem;box-sizing:border-box;" placeholder="Your name" required>
        </div>
        <div style="margin-bottom:16px;">
          <label style="font-size:0.8rem;font-weight:700;color:#555;display:block;margin-bottom:6px;">Project Title <span style="color:#e53e3e;">*</span></label>
          <input type="text" id="hf-title" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-family:var(--font-body);font-size:0.9rem;box-sizing:border-box;" placeholder="e.g. Build a React Dashboard" required>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <label style="font-size:0.8rem;font-weight:700;color:#555;display:block;margin-bottom:6px;">Budget (₹) <span style="color:#e53e3e;">*</span></label>
            <input type="number" id="hf-budget" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-family:var(--font-body);font-size:0.9rem;box-sizing:border-box;" placeholder="e.g. 15000" required>
          </div>
          <div>
            <label style="font-size:0.8rem;font-weight:700;color:#555;display:block;margin-bottom:6px;">Timeline <span style="color:#e53e3e;">*</span></label>
            <input type="text" id="hf-timeline" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-family:var(--font-body);font-size:0.9rem;box-sizing:border-box;" placeholder="e.g. 2 weeks" required>
          </div>
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:0.8rem;font-weight:700;color:#555;display:block;margin-bottom:6px;">Message <span style="color:#e53e3e;">*</span></label>
          <textarea id="hf-message" rows="4" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-family:var(--font-body);font-size:0.9rem;box-sizing:border-box;resize:vertical;" placeholder="Describe what you need help with…" required></textarea>
        </div>
        <div id="hf-error" style="display:none;background:#fff5f5;border:1px solid #fed7d7;border-radius:8px;padding:10px 14px;font-size:0.82rem;color:#c53030;margin-bottom:14px;"></div>
        <button type="submit" id="hf-submit" style="width:100%;padding:12px;background:#1dbf73;color:#fff;border:none;border-radius:10px;font-family:var(--font-body);font-size:0.9rem;font-weight:700;cursor:pointer;transition:background 0.15s;">Send Request</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Focus first empty required field
  document.getElementById('hf-title').focus();

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('hire-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('hf-title').value.trim();
    const budget = document.getElementById('hf-budget').value.trim();
    const message = document.getElementById('hf-message').value.trim();
    const timeline = document.getElementById('hf-timeline').value.trim();
    const errEl = document.getElementById('hf-error');

    if (!title || !budget || !timeline || !message) {
      errEl.textContent = 'Please fill in all required fields including Timeline.';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const btn = document.getElementById('hf-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Create a real job posting so freelancer can see and bid
    let newJob = null;
    try {
      const budgetDisplay = `₹${Number(budget).toLocaleString('en-IN')}`;
      newJob = window.JobsDB.post({
        title,
        description: message,
        budget: budgetDisplay,
        budgetType: 'fixed',
        deadline: timeline || '30 days',
        skills: candidate.skills || [],
        category: candidate.role || 'General',
        directHire: true,
        invitedFreelancerId: candidate.id
      }, session);

      // Send message to freelancer so they see the invite
      const company = session.user.company || session.user.name;
      window.MessagesDB.send(
        session.user.id, session.user.name, company,
        session.user.contact?.email || session.user.email || '',
        candidate.id,
        `Project Invite: ${title}`,
        `Hi ${candidate.name.split(' ')[0]}, I'd like to hire you for "${title}" with a budget of ${budgetDisplay}. ${timeline ? 'Timeline: ' + timeline + '.' : ''}\n\n${message}\n\nYou can view this project and submit your proposal from your dashboard.`
      );
    } catch(err) {
      console.warn('Hire modal DB error:', err);
    }

    setTimeout(() => {
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;padding:48px 36px;max-width:420px;width:100%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.18);">
          <div style="width:60px;height:60px;background:#f0fdf7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 style="font-size:1.2rem;font-weight:800;color:#111;margin-bottom:8px;">Invite Sent!</h3>
          <p style="font-size:0.9rem;color:#666;line-height:1.6;margin-bottom:16px;"><strong>${escapeHTML(candidate.name)}</strong> has been notified. The invite will appear in their <strong>dashboard under Invites Received</strong> — it is private and not listed publicly.</p>
          <p style="font-size:0.82rem;color:#888;margin-bottom:4px;">You'll be notified in your <strong>Responses</strong> tab when they Accept, Counter, or Reject.</p>
          <button onclick="document.getElementById('hire-modal-overlay').remove()" style="margin-top:20px;padding:10px 28px;background:#1dbf73;color:#fff;border:none;border-radius:8px;font-family:var(--font-body);font-weight:700;cursor:pointer;font-size:0.9rem;">Done</button>
        </div>`;
    }, 600);
  });
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
 * Opens a full project detail modal matching the project.html layout
 */
function openProjectModal(idx) {
  const proj = window._profileProjects && window._profileProjects[idx];
  if (!proj) return;

  const existing = document.getElementById('proj-detail-overlay');
  if (existing) existing.remove();

  // Store images in a global so onclick handlers can reference by index (avoids embedding base64 in HTML)
  const allImages = (proj._resolvedImages && proj._resolvedImages.length)
    ? proj._resolvedImages
    : (proj._resolvedThumb ? [proj._resolvedThumb] : []);
  window._pdmImages = allImages;

  const tags = proj.tags || [];
  const tagsHtml = tags.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        ${tags.map(t => `<span style="padding:4px 12px;background:#f4f4f5;border-radius:99px;font-size:0.75rem;font-weight:600;color:#555;">${escapeHTML(t)}</span>`).join('')}
       </div>`
    : '';

  const overlay = document.createElement('div');
  overlay.id = 'proj-detail-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:3000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(8px);';

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:20px;max-width:960px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.25);position:relative;">
      <button onclick="document.getElementById('proj-detail-overlay').remove()"
        style="position:absolute;top:14px;right:14px;z-index:10;background:#f5f5f5;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#555;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div style="display:grid;grid-template-columns:55% 45%;min-height:420px;">

        <!-- LEFT: images -->
        <div style="padding:28px 20px 28px 28px;border-right:1px solid #f0f0f0;display:flex;flex-direction:column;">
          <div id="pdm-main-wrap" style="width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#f0f0f0;flex-shrink:0;">
            ${allImages.length
              ? `<img id="pdm-main-img" src="" style="width:100%;height:100%;object-fit:cover;transition:opacity 0.2s;">`
              : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`}
          </div>
          ${allImages.length > 1 ? `
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
            ${allImages.map((_, i) => `
              <div onclick="switchPdmImageByIdx(${i})" id="pdm-thumb-${i}"
                style="width:72px;height:50px;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid ${i===0?'#1dbf73':'#e8e8e8'};flex-shrink:0;background:#f0f0f0;">
                <img id="pdm-thumb-img-${i}" src="" alt="" style="width:100%;height:100%;object-fit:cover;">
              </div>`).join('')}
          </div>` : ''}
        </div>

        <!-- RIGHT: info -->
        <div style="padding:28px 28px 28px 24px;display:flex;flex-direction:column;">
          <h2 style="font-size:1.4rem;font-weight:800;color:#111;margin:0 0 12px;letter-spacing:-0.02em;padding-right:36px;">${escapeHTML(proj.name)}</h2>
          ${tagsHtml}
          <p style="font-size:0.9rem;color:#555;line-height:1.8;margin:0;flex:1;">${escapeHTML(proj.description || 'No description provided.')}</p>
        </div>
      </div>
    </div>`;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);

  // Set images via JS after DOM is ready (avoids base64 in HTML attributes)
  if (allImages.length) {
    const mainImg = document.getElementById('pdm-main-img');
    if (mainImg) mainImg.src = allImages[0];
    allImages.forEach((src, i) => {
      const t = document.getElementById(`pdm-thumb-img-${i}`);
      if (t) t.src = src;
    });
  }

  const onKey = e => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function switchPdmImageByIdx(idx) {
  const src = window._pdmImages && window._pdmImages[idx];
  if (!src) return;
  const mainImg = document.getElementById('pdm-main-img');
  if (!mainImg) return;
  mainImg.style.opacity = '0';
  setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 180);
  // Update border highlight on strip
  (window._pdmImages || []).forEach((_, i) => {
    const t = document.getElementById(`pdm-thumb-${i}`);
    if (t) t.style.border = `2px solid ${i === idx ? '#1dbf73' : '#e8e8e8'}`;
  });
}

function switchPdmImage(escapedSrc, dataSrc) {
  const src = dataSrc || escapedSrc;
  const mainImg = document.getElementById('pdm-main-img');
  if (!mainImg || !src) return;
  mainImg.style.opacity = '0';
  setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 180);
}

function deleteProfileProject(projId) {
  if (!projId) return;
  const session = window.SessionManager && window.SessionManager.getActiveUser();
  if (!session || session.role !== 'candidate') return;
  if (!confirm('Delete this project? This cannot be undone.')) return;
  window.CandidatesDB.removeProject(session.user.id, projId);
  renderProfile();
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
