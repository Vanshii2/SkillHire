/* ==========================================================================
   SkillHire Candidate Dashboard Page Script
   ========================================================================== */

let activeCandidate = null;
let currentSkills = [];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session check
  const session = window.SessionManager.getActiveUser();
  if (!session || session.role !== 'candidate') {
    alert('Please log in as a Candidate to access this dashboard.');
    window.location.href = 'index.html';
    return;
  }
  
  activeCandidate = session.user;
  currentSkills = [...activeCandidate.skills];

  // 2. Initialize elements
  initTabs();
  loadProfileData();
  renderProjects();
  renderMessages();
  
  // 3. Bind listeners
  initAvatarSelection();
  initSkillsAdder();
  initProfileFormSubmit();
  initProjectManagement();
});

/**
 * Handle switching tabs
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
 * Load candidate details into profile form
 */
function loadProfileData() {
  if (!activeCandidate) return;

  // Header display
  document.getElementById('dashboard-name').textContent = activeCandidate.name;
  document.getElementById('dashboard-role').textContent = activeCandidate.role;
  document.getElementById('dashboard-avatar').src = activeCandidate.avatar;

  // Form inputs
  document.getElementById('edit-name').value = activeCandidate.name;
  document.getElementById('edit-role').value = activeCandidate.role;
  document.getElementById('edit-availability').value = activeCandidate.availability;
  document.getElementById('edit-about').value = activeCandidate.about;
  document.getElementById('edit-linkedin').value = activeCandidate.contact.linkedin || '';
  document.getElementById('edit-github').value = activeCandidate.contact.github || '';
  document.getElementById('edit-avatar-path').value = activeCandidate.avatar;

  // Sync avatar selection
  const avatarPresets = document.querySelectorAll('.avatar-preset-option');
  avatarPresets.forEach(preset => {
    preset.classList.remove('selected');
    if (preset.getAttribute('data-path') === activeCandidate.avatar) {
      preset.classList.add('selected');
    }
  });

  renderSkillsList();
}

/**
 * Sync avatar selection classes
 */
function initAvatarSelection() {
  const avatarPresets = document.querySelectorAll('.avatar-preset-option');
  const avatarInput = document.getElementById('edit-avatar-path');
  const fileInput = document.getElementById('edit-avatar-file');

  avatarPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      avatarPresets.forEach(p => p.classList.remove('selected'));
      preset.classList.add('selected');
      avatarInput.value = preset.getAttribute('data-path');
      if (fileInput) fileInput.value = ''; // Reset file input
    });
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          avatarInput.value = base64;
          avatarPresets.forEach(p => p.classList.remove('selected'));
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

/**
 * Edit Skills tags inside form
 */
function initSkillsAdder() {
  const skillInput = document.getElementById('edit-skill-input');
  const addBtn = document.getElementById('btn-dashboard-add-skill');

  if (!skillInput || !addBtn) return;

  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addSkillTag();
  });

  skillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkillTag();
    }
  });

  function addSkillTag() {
    const val = skillInput.value.trim();
    if (!val) return;

    if (!currentSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
      currentSkills.push(val);
      renderSkillsList();
    }
    skillInput.value = '';
  }
}

function renderSkillsList() {
  const container = document.getElementById('dashboard-skills-wrapper');
  if (!container) return;

  container.innerHTML = currentSkills.map((skill, index) => `
    <span class="skill-tag-remove" style="background: rgba(0,0,0,0.02); border:1px solid var(--border-color); padding: 6px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight:500;">
      ${escapeHTML(skill)}
      <button type="button" class="skill-remove-btn" data-index="${index}" style="background:none; border:none; color:var(--secondary-text); font-size:1.1rem; cursor:pointer; line-height: 1;">&times;</button>
    </span>
  `).join('');

  // Attach delete click
  container.querySelectorAll('.skill-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      currentSkills.splice(idx, 1);
      renderSkillsList();
    });
  });
}

/**
 * Save candidate profile changes
 */
function initProfileFormSubmit() {
  const form = document.getElementById('profile-edit-form');
  const toast = document.getElementById('profile-save-toast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (currentSkills.length === 0) {
      alert('Please add at least one technical skill.');
      return;
    }

    // Update activeCandidate details
    activeCandidate.name = document.getElementById('edit-name').value.trim();
    activeCandidate.role = document.getElementById('edit-role').value.trim();
    activeCandidate.availability = document.getElementById('edit-availability').value;
    activeCandidate.about = document.getElementById('edit-about').value.trim();
    activeCandidate.avatar = document.getElementById('edit-avatar-path').value;
    activeCandidate.skills = [...currentSkills];
    activeCandidate.contact.linkedin = document.getElementById('edit-linkedin').value.trim();
    activeCandidate.contact.github = document.getElementById('edit-github').value.trim();

    // Save to local storage
    window.CandidatesDB.save(activeCandidate);

    // Sync header info
    document.getElementById('dashboard-name').textContent = activeCandidate.name;
    document.getElementById('dashboard-role').textContent = activeCandidate.role;
    document.getElementById('dashboard-avatar').src = activeCandidate.avatar;

    // Show toast message
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }
  });
}

/**
 * Render Projects Showcase
 */
function renderProjects() {
  const grid = document.getElementById('dashboard-projects-grid');
  if (!grid) return;

  if (!activeCandidate.projects || activeCandidate.projects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; padding: 40px; text-align: center; background: rgba(0,0,0,0.01); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <h3>No projects showcased yet</h3>
        <p>Click "Add Showcase Project" to add your first software product details.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = activeCandidate.projects.map((proj, idx) => `
    <div class="dashboard-project-card">
      <img src="${escapeHTML(proj.screenshot)}" alt="${escapeHTML(proj.name)}" class="dash-proj-img" onerror="this.src='assets/images/project1.png'">
      <div class="dash-proj-info">
        <h3>${escapeHTML(proj.name)}</h3>
        <p>${escapeHTML(proj.description.substring(0, 100))}${proj.description.length > 100 ? '...' : ''}</p>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-edit-proj" data-index="${idx}" style="font-size:0.8rem; padding:6px 12px;">Edit</button>
          <button class="btn btn-secondary btn-delete-proj" data-index="${idx}" style="font-size:0.8rem; padding:6px 12px; border-color: rgba(239, 68, 68, 0.2); color:#EF4444;">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  // Bind project actions
  grid.querySelectorAll('.btn-edit-proj').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      openProjectModal(idx);
    });
  });

  grid.querySelectorAll('.btn-delete-proj').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      if (confirm(`Are you sure you want to delete "${activeCandidate.projects[idx].name}"?`)) {
        activeCandidate.projects.splice(idx, 1);
        window.CandidatesDB.save(activeCandidate);
        renderProjects();
      }
    });
  });
}

/**
 * Add / Edit Projects Form Modals
 */
function initProjectManagement() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');
  const openBtn = document.getElementById('btn-open-project-modal');
  const form = document.getElementById('dashboard-project-form');

  if (!modal) return;

  openBtn.addEventListener('click', () => {
    openProjectModal();
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const idxVal = document.getElementById('project-edit-index').value;
    const name = document.getElementById('proj-modal-name').value.trim();
    const live = document.getElementById('proj-modal-live').value.trim();
    const github = document.getElementById('proj-modal-github').value.trim();
    const screenshot = document.getElementById('proj-modal-screenshot').value;
    const description = document.getElementById('proj-modal-description').value.trim();
    const techRaw = document.getElementById('proj-modal-tech').value.trim();

    const techStack = techRaw.split(',').map(s => s.trim()).filter(Boolean);

    const projectData = { name, live, github, screenshot, description, techStack };

    if (!activeCandidate.projects) activeCandidate.projects = [];

    if (idxVal === '') {
      // Add new
      activeCandidate.projects.push(projectData);
    } else {
      // Edit existing
      activeCandidate.projects[parseInt(idxVal)] = projectData;
    }

    // Save
    window.CandidatesDB.save(activeCandidate);
    modal.classList.remove('active');
    renderProjects();
  });
}

function openProjectModal(index = null) {
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('dashboard-project-form');
  const title = document.getElementById('project-modal-title');

  form.reset();
  
  if (index === null) {
    title.textContent = 'Add Showcase Project';
    document.getElementById('project-edit-index').value = '';
  } else {
    title.textContent = 'Edit Showcase Project';
    document.getElementById('project-edit-index').value = index;
    const proj = activeCandidate.projects[index];
    
    document.getElementById('proj-modal-name').value = proj.name;
    document.getElementById('proj-modal-live').value = proj.live || '';
    document.getElementById('proj-modal-github').value = proj.github || '';
    document.getElementById('proj-modal-screenshot').value = proj.screenshot;
    document.getElementById('proj-modal-description').value = proj.description;
    document.getElementById('proj-modal-tech').value = proj.techStack.join(', ');
  }

  modal.classList.add('active');
}

/**
 * Render Recruiter Inquiries Messages Inbox
 */
function renderMessages() {
  const inbox = document.getElementById('dashboard-messages-inbox');
  const countBadge = document.getElementById('messages-count');
  if (!inbox) return;

  const messages = window.MessagesDB.getForCandidate(activeCandidate.id);

  // Update navbar unread badges
  if (messages.length > 0) {
    if (countBadge) {
      countBadge.textContent = messages.length;
      countBadge.style.display = 'inline-flex';
    }
  } else {
    if (countBadge) countBadge.style.display = 'none';
  }

  if (messages.length === 0) {
    inbox.innerHTML = `
      <div class="empty-state" style="padding: 60px 40px; text-align: center; background: rgba(0,0,0,0.01); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <span style="font-size: 2rem;">✉️</span>
        <h3 style="margin-top: 10px;">Your inbox is empty</h3>
        <p>When recruiters search for your skills and contact you, their inquiries will display here.</p>
      </div>
    `;
    return;
  }

  // Render list/table of messages
  inbox.innerHTML = `
    <table class="messages-table">
      <thead>
        <tr>
          <th>Sender</th>
          <th>Subject</th>
          <th>Date Recieved</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${messages.map(msg => `
          <tr>
            <td>
              <div style="font-weight:600; color:var(--primary-text);">${escapeHTML(msg.recruiterName)}</div>
              <div style="font-size:0.8rem; color:var(--secondary-text);">${escapeHTML(msg.recruiterCompany)}</div>
            </td>
            <td>
              <span class="msg-subj-cell">${escapeHTML(msg.subject)}</span>
            </td>
            <td>
              <span style="font-size:0.85rem; color:var(--secondary-text);">${new Date(msg.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
            </td>
            <td>
              <button class="btn btn-secondary btn-view-msg" data-id="${msg.id}" style="font-size:0.8rem; padding: 6px 12px;">View Message</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Bind view click handler
  inbox.querySelectorAll('.btn-view-msg').forEach(btn => {
    btn.addEventListener('click', () => {
      const msgId = btn.getAttribute('data-id');
      const msg = messages.find(m => m.id === msgId);
      if (msg) openMessageDetail(msg);
    });
  });
}

/**
 * Open message detail view modal
 */
function openMessageDetail(msg) {
  const modal = document.getElementById('message-view-modal');
  const closeBtn = document.getElementById('message-view-modal-close');
  
  document.getElementById('msg-view-company').textContent = msg.recruiterCompany;
  document.getElementById('msg-view-subject').textContent = msg.subject;
  document.getElementById('msg-view-meta').textContent = `From ${msg.recruiterName} (${msg.recruiterEmail}) on ${new Date(msg.timestamp).toLocaleString()}`;
  document.getElementById('msg-view-body').textContent = msg.body;
  
  const replyBtn = document.getElementById('msg-view-reply-btn');
  replyBtn.href = `mailto:${msg.recruiterEmail}?subject=Re: ${encodeURIComponent(msg.subject)}`;

  modal.classList.add('active');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
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
