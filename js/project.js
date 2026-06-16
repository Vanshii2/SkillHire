/* ==========================================================================
   SkillHire Project Detail Page Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('project-detail-root');
  if (!root) return;

  // Parse ?id= from the URL
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    renderNotFound(root);
    return;
  }

  const project = window.ProjectsDB.getById(projectId);
  if (!project) {
    renderNotFound(root);
    return;
  }

  // Update document title with the project name
  document.title = `${project.title} — SkillHire`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', project.description.slice(0, 155));

  renderProjectDetail(root, project);
});

/* -------------------------------------------------------------------------
   Render full project detail
   ------------------------------------------------------------------------- */
function renderProjectDetail(root, project) {
  const likedProjects = getLikedProjects();
  const isLiked = likedProjects.includes(project.id);

  // Build thumbnail strip HTML (only if more than 1 image)
  const thumbsHtml = project.images.length > 1
    ? `<div class="project-thumbs-strip" id="project-thumbs-strip">
        ${project.images.map((img, i) => `
          <div class="project-thumb-item${i === 0 ? ' active' : ''}"
               id="thumb-${i}"
               data-src="${escapeHTML(img)}"
               role="button"
               tabindex="0"
               onclick="switchProjectImage(this, '${escapeHTML(img)}', ${i})"
               onkeydown="if(event.key==='Enter')switchProjectImage(this, '${escapeHTML(img)}', ${i})">
            <img src="${escapeHTML(img)}" alt="Project image ${i + 1}" loading="lazy">
          </div>
        `).join('')}
      </div>`
    : '';

  // Build tags HTML
  const tagsHtml = project.tags.map(tag =>
    `<span class="skill-tag">${escapeHTML(tag)}</span>`
  ).join('');

  // Candidate profile link (from CandidatesDB if available)
  const candidate = window.CandidatesDB ? window.CandidatesDB.getById(project.authorId) : null;
  const profileLink = candidate ? `profile.html?id=${encodeURIComponent(project.authorId)}` : '#';

  root.innerHTML = `
    <!-- Back link -->
    <a href="index.html#projects-showcase-section" class="project-back-link" id="project-back-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Back to Projects
    </a>

    <!-- Two-column layout -->
    <div class="project-detail-layout">

      <!-- LEFT: Image Gallery -->
      <div class="project-detail-gallery">
        <div class="project-main-image-wrap">
          <img
            src="${escapeHTML(project.images[0])}"
            alt="${escapeHTML(project.title)}"
            id="project-main-image"
          >
        </div>
        ${thumbsHtml}
      </div>

      <!-- RIGHT: Sidebar -->
      <aside class="project-detail-sidebar">

        <!-- Title + Tags -->
        <h1 class="project-detail-title">${escapeHTML(project.title)}</h1>
        <div class="project-detail-tags">${tagsHtml}</div>

        <!-- Description -->
        <p class="project-detail-description">${escapeHTML(project.description)}</p>

        <!-- Author Card -->
        <a href="${escapeHTML(profileLink)}" class="project-detail-author-card" id="project-author-card">
          <img
            src="${escapeHTML(project.authorAvatar)}"
            alt="${escapeHTML(project.authorName)}"
            class="project-detail-author-avatar"
          >
          <div class="project-detail-author-info">
            <h4>${escapeHTML(project.authorName)}</h4>
            <p>${candidate ? escapeHTML(candidate.role) : 'Designer / Developer'}</p>
          </div>
        </a>

        <!-- Stats -->
        <div class="project-detail-stats">
          <div class="project-detail-stat-item">
            <span class="project-detail-stat-value" id="detail-likes-count">${formatCount(project.likes)}</span>
            <span class="project-detail-stat-label">Likes</span>
          </div>
          <div class="project-detail-stat-item">
            <span class="project-detail-stat-value">${formatCount(project.views)}</span>
            <span class="project-detail-stat-label">Views</span>
          </div>
          <div class="project-detail-stat-item">
            <span class="project-detail-stat-value">${project.images.length}</span>
            <span class="project-detail-stat-label">Images</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="project-detail-actions">
          <button
            class="project-like-btn${isLiked ? ' liked' : ''}"
            id="detail-like-btn"
            onclick="toggleDetailLike('${escapeHTML(project.id)}')"
          >
            <svg viewBox="0 0 24 24"
                 fill="${isLiked ? '#e1306c' : 'none'}"
                 stroke="${isLiked ? '#e1306c' : 'currentColor'}"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ${isLiked ? 'Liked' : 'Like this Shot'}
          </button>

          ${candidate ? `
          <a href="${escapeHTML(profileLink)}" class="btn btn-secondary" id="detail-view-profile-btn">
            View ${escapeHTML(candidate.name.split(' ')[0])}'s Profile &rarr;
          </a>
          ` : ''}
        </div>

      </aside>
    </div>
  `;

  // After render: re-run scroll animations
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}

/* -------------------------------------------------------------------------
   Switch main displayed image when a thumbnail is clicked
   ------------------------------------------------------------------------- */
function switchProjectImage(thumbEl, src, idx) {
  // Update main image
  const mainImg = document.getElementById('project-main-image');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
    }, 180);
  }

  // Update active state on thumbs
  const allThumbs = document.querySelectorAll('.project-thumb-item');
  allThumbs.forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

/* -------------------------------------------------------------------------
   Toggle like on the detail page
   ------------------------------------------------------------------------- */
function toggleDetailLike(projectId) {
  const liked = getLikedProjects();
  const isLiked = liked.includes(projectId);
  const btn = document.getElementById('detail-like-btn');
  const countEl = document.getElementById('detail-likes-count');
  const project = window.ProjectsDB.getById(projectId);

  if (isLiked) {
    // Unlike
    const newLiked = liked.filter(id => id !== projectId);
    localStorage.setItem('skillhire_liked_projects', JSON.stringify(newLiked));
    btn.classList.remove('liked');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Like this Shot
    `;
    if (countEl && project) countEl.textContent = formatCount(project.likes - 1);
  } else {
    // Like
    liked.push(projectId);
    localStorage.setItem('skillhire_liked_projects', JSON.stringify(liked));
    btn.classList.add('liked');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#e1306c" stroke="#e1306c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Liked
    `;
    if (countEl && project) countEl.textContent = formatCount(project.likes + 1);
  }
}

/* -------------------------------------------------------------------------
   Utility helpers
   ------------------------------------------------------------------------- */
function renderNotFound(root) {
  root.innerHTML = `
    <div class="project-not-found">
      <h2>Project not found</h2>
      <p>The project you're looking for doesn't exist or may have been removed.</p>
      <a href="index.html" class="btn btn-primary">Back to Home</a>
    </div>
  `;
}

function getLikedProjects() {
  try {
    return JSON.parse(localStorage.getItem('skillhire_liked_projects')) || [];
  } catch {
    return [];
  }
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

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
