/* ==========================================================================
   SkillHire Recruiter Dashboard Page Controller
   ========================================================================== */

let activeRecruiter = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session check
  const session = window.SessionManager.getActiveUser();
  if (!session || session.role !== 'recruiter') {
    alert('Please log in as a Recruiter to access this dashboard.');
    window.location.href = 'index.html';
    return;
  }

  activeRecruiter = session.user;

  // 2. Load basic info
  updateRecruiterSidebarHeader();

  // 3. Initialize components
  initTabs();
  renderShortlistedCandidates();
  renderContactHistory();
  loadRecruiterProfileData();
  initRecruiterProfileSubmit();
});

/**
 * Tab switcher
 */
function initTabs() {
  const menuItems = document.querySelectorAll('.menu-item');
  const tabs = document.querySelectorAll('.tab-content');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(mi => mi.classList.remove('active'));
      tabs.forEach(tab => tab.style.display = 'none');

      item.classList.add('active');
      const tabId = `tab-${item.getAttribute('data-tab')}`;
      document.getElementById(tabId).style.display = 'block';
    });
  });
}

/**
 * Render shortlisted candidate cards
 */
function renderShortlistedCandidates() {
  const grid = document.getElementById('shortlisted-candidates-grid');
  const countBadge = document.getElementById('shortlist-count-badge');
  if (!grid) return;

  const savedIds = activeRecruiter.savedCandidates || [];

  // Update badges
  if (savedIds.length > 0) {
    if (countBadge) {
      countBadge.textContent = savedIds.length;
      countBadge.style.display = 'inline-flex';
    }
  } else {
    if (countBadge) countBadge.style.display = 'none';
  }

  if (savedIds.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; padding: 60px 40px; text-align: center; background: rgba(0,0,0,0.01); border: 1px dashed var(--border-color); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <span style="font-size: 2.5rem;">⭐</span>
        <h3>Your Shortlist is empty</h3>
        <p>Go to the Candidates Directory to search and save fresher portfolios to your shortlist.</p>
        <a href="candidates.html" class="btn btn-primary" style="margin-top: 10px;">Explore Candidates</a>
      </div>
    `;
    return;
  }

  // Fetch candidate objects
  const list = savedIds.map(id => window.CandidatesDB.getById(id)).filter(Boolean);

  grid.innerHTML = list.map(candidate => {
    // Skills HTML
    const skillsHtml = candidate.skills.slice(0, 3).map(skill => 
      `<span class="skill-tag" style="font-size:0.8rem; padding: 4px 10px;">${escapeHTML(skill)}</span>`
    ).join('');

    // Availability classification
    const isInternship = candidate.availability.toLowerCase().includes('internship');
    const badgeClass = isInternship ? 'badge-internship' : 'badge-fulltime';

    return `
      <div class="candidate-card" style="position: relative;">
        <!-- Remove star shortcut button -->
        <button class="bookmark-btn active btn-remove-shortlist" data-id="${candidate.id}" title="Remove from shortlist" style="position: absolute; top: 16px; right: 16px; z-index: 10;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>

        <div class="candidate-header">
          <div class="candidate-avatar-wrapper">
            <img src="${escapeHTML(candidate.avatar)}" alt="${escapeHTML(candidate.name)}" class="candidate-avatar">
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
          ${candidate.skills.length > 3 ? `<span class="skill-tag" style="font-size:0.8rem; padding: 4px 10px;">+${candidate.skills.length - 3}</span>` : ''}
        </div>
        
        <div class="candidate-footer" style="gap: 10px;">
          <a href="profile.html?id=${escapeHTML(candidate.id)}" class="btn btn-secondary btn-text" style="font-size: 0.8rem; padding: 6px 12px;">View Profile</a>
          <button class="btn btn-primary btn-contact-shortcut" data-id="${candidate.id}" data-name="${candidate.name}" style="font-size: 0.8rem; padding: 6px 12px;">Contact</button>
        </div>
      </div>
    `;
  }).join('');

  // Bind click event triggers
  grid.querySelectorAll('.btn-remove-shortlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const candId = btn.getAttribute('data-id');
      window.RecruitersDB.toggleSaveCandidate(activeRecruiter.id, candId);
      
      // Update local state and re-render
      activeRecruiter = window.RecruitersDB.getById(activeRecruiter.id);
      renderShortlistedCandidates();
    });
  });

  grid.querySelectorAll('.btn-contact-shortcut').forEach(btn => {
    btn.addEventListener('click', () => {
      const candId = btn.getAttribute('data-id');
      const candName = btn.getAttribute('data-name');
      window.openContactModal(candId, candName);
    });
  });
}

/**
 * Render contact history timeline table
 */
function renderContactHistory() {
  const container = document.getElementById('recruiter-history-list');
  if (!container) return;

  const messages = window.MessagesDB.getForRecruiter(activeRecruiter.id);

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 60px 40px; text-align: center; background: rgba(0,0,0,0.01); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <span style="font-size: 2rem;">📜</span>
        <h3 style="margin-top: 10px;">No messages sent yet</h3>
        <p>Your contact logs will list details of messages sent to candidates through the directory.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="messages-table">
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Subject Inquiry</th>
          <th>Date Sent</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${messages.map(msg => {
          const candidate = window.CandidatesDB.getById(msg.candidateId);
          const candidateName = candidate ? candidate.name : 'Unknown Candidate';
          return `
            <tr>
              <td>
                <div style="font-weight:600; color:var(--primary-text);">${escapeHTML(candidateName)}</div>
              </td>
              <td>
                <span class="msg-subj-cell">${escapeHTML(msg.subject)}</span>
              </td>
              <td>
                <span style="font-size:0.85rem; color:var(--secondary-text);">${new Date(msg.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-view-history" data-id="${msg.id}" style="font-size:0.8rem; padding: 6px 12px;">View Message</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  // Bind view click handler
  container.querySelectorAll('.btn-view-history').forEach(btn => {
    btn.addEventListener('click', () => {
      const msgId = btn.getAttribute('data-id');
      const msg = messages.find(m => m.id === msgId);
      if (msg) openHistoryMessageDetail(msg);
    });
  });
}

function openHistoryMessageDetail(msg) {
  const modal = document.getElementById('history-message-modal');
  const closeBtn = document.getElementById('history-modal-close');
  const okBtn = document.getElementById('history-modal-ok-btn');
  const candidate = window.CandidatesDB.getById(msg.candidateId);
  const candidateName = candidate ? candidate.name : 'Unknown Candidate';

  document.getElementById('history-msg-subject').textContent = msg.subject;
  document.getElementById('history-msg-meta').textContent = `Sent to ${candidateName} (${candidate ? candidate.contact.email : ''}) on ${new Date(msg.timestamp).toLocaleString()}`;
  document.getElementById('history-msg-body').textContent = msg.body;

  modal.classList.add('active');

  const closeModal = () => modal.classList.remove('active');
  closeBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', closeModal);
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
 * Updates Recruiter Header and Logo elements inside the dashboard sidebar
 */
function updateRecruiterSidebarHeader() {
  if (!activeRecruiter) return;
  document.getElementById('rec-dashboard-name').textContent = activeRecruiter.name;
  document.getElementById('rec-dashboard-company').textContent = activeRecruiter.company;
  
  const recAvatarElement = document.querySelector('.rec-avatar-icon');
  if (recAvatarElement) {
    if (activeRecruiter.logo) {
      recAvatarElement.innerHTML = `<img src="${activeRecruiter.logo}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      recAvatarElement.innerHTML = `🏢`;
    }
  }
}

/**
 * Loads Recruiter Profile details into Company form controls
 */
function loadRecruiterProfileData() {
  if (!activeRecruiter) return;
  document.getElementById('edit-rec-name').value = activeRecruiter.name;
  document.getElementById('edit-rec-company').value = activeRecruiter.company;
  document.getElementById('edit-rec-email').value = activeRecruiter.email;
  document.getElementById('edit-rec-logo-path').value = activeRecruiter.logo || '';
  
  const logoPreview = document.getElementById('edit-rec-logo-preview');
  if (logoPreview) {
    if (activeRecruiter.logo) {
      logoPreview.innerHTML = `<img src="${activeRecruiter.logo}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      logoPreview.innerHTML = `🏢`;
    }
  }
}

/**
 * Handles Recruiter Profile file reading and form submit changes
 */
function initRecruiterProfileSubmit() {
  const fileInput = document.getElementById('edit-rec-logo-file');
  const logoPathInput = document.getElementById('edit-rec-logo-path');
  const logoPreview = document.getElementById('edit-rec-logo-preview');
  const form = document.getElementById('recruiter-edit-form');
  const toast = document.getElementById('rec-profile-save-toast');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          logoPathInput.value = base64;
          if (logoPreview) {
            logoPreview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      activeRecruiter.name = document.getElementById('edit-rec-name').value.trim();
      activeRecruiter.company = document.getElementById('edit-rec-company').value.trim();
      activeRecruiter.email = document.getElementById('edit-rec-email').value.trim();
      activeRecruiter.logo = logoPathInput.value;

      window.RecruitersDB.update(activeRecruiter);
      updateRecruiterSidebarHeader();

      if (toast) {
        toast.style.display = 'block';
        setTimeout(() => {
          toast.style.display = 'none';
        }, 3000);
      }
    });
  }
}
