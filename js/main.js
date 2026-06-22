/* ==========================================================================
   SkillBridge — Shared Script (Global Layout, Navbar, Auth)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initAuthModal();
  initContactModal();
  updateNavbarState();

  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  if (action === 'login') {
    setTimeout(() => { if (window.openAuthModal) window.openAuthModal('login'); }, 350);
  } else if (action === 'register') {
    setTimeout(() => { if (window.openAuthModal) window.openAuthModal('register'); }, 350);
  } else if (action === 'candidate-signup') {
    setTimeout(() => { if (window.openAuthModal) window.openAuthModal('register', 'freelancer'); }, 350);
  } else if (action === 'recruiter-login') {
    setTimeout(() => { if (window.openAuthModal) window.openAuthModal('login'); }, 350);
  }
});

/* --------------------------------------------------------------------------
   Navbar — scroll shadow + mobile drawer
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

  function openMobileMenu() {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  window.closeMobileMenu = closeMobileMenu;
}

/* --------------------------------------------------------------------------
   Scroll-triggered fade-in animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in-section');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

/* --------------------------------------------------------------------------
   Auth Modal (unified — login / register with role selection)
   -------------------------------------------------------------------------- */
function initAuthModal() {
  if (document.getElementById('auth-modal')) return;

  const html = `
  <div id="auth-modal" class="modal-overlay">
    <div class="modal-card auth-card">
      <button class="modal-close-btn" id="auth-modal-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="auth-brand">
        <span class="auth-logo-text">SkillBridge</span>
      </div>

      <div class="auth-tabs">
        <button class="auth-tab-btn active" id="tab-login">Log In</button>
        <button class="auth-tab-btn" id="tab-register">Register</button>
      </div>

      <!-- LOGIN PANEL -->
      <div id="auth-panel-login">
        <form id="login-form" novalidate>
          <div class="form-group">
            <label for="login-email">Email <span class="req-star">*</span></label>
            <input type="email" id="login-email" placeholder="eg@gmail.com" autocomplete="off" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password <span class="req-star">*</span></label>
            <div class="pw-wrap">
              <input type="password" id="login-password" placeholder="Your password" autocomplete="off" required>
              <button type="button" class="pw-toggle" data-target="login-password" aria-label="Show/hide password">
                <svg class="pw-eye-show" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="auth-error" id="login-error"></div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:4px;border-radius:10px;">Continue</button>
        </form>
        <p class="auth-toggle-text">
          Don't have an account? <button class="auth-toggle-link" id="goto-register">Sign up free</button>
        </p>
      </div>

      <!-- REGISTER PANEL -->
      <div id="auth-panel-register" style="display:none;">

        <div class="auth-role-selector" id="role-selector">
          <div class="auth-role-card selected" data-role="freelancer" id="role-card-freelancer">
            <div class="auth-role-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div style="flex:1;">
              <div class="auth-role-title">I'm a Freelancer</div>
              <div class="auth-role-desc">Find projects &amp; get hired</div>
            </div>
            <div class="auth-role-check">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div class="auth-role-card" data-role="client" id="role-card-client">
            <div class="auth-role-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <div style="flex:1;">
              <div class="auth-role-title">I'm a Client</div>
              <div class="auth-role-desc">Post projects &amp; hire talent</div>
            </div>
            <div class="auth-role-check">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>

        <!-- Both mode notice (hidden by default) -->
        <div id="both-mode-notice" style="display:none;background:rgba(29,191,115,0.08);border:1px solid rgba(29,191,115,0.25);border-radius:10px;padding:10px 14px;margin-bottom:4px;font-size:0.82rem;color:#15803d;">
          You'll be able to switch between Client and Freelancer mode any time after signing up.
        </div>

        <input type="hidden" id="register-role" value="freelancer">

        <form id="register-form" novalidate>
          <div class="auth-form-row">
            <div class="form-group">
              <label for="reg-name">Full Name <span class="req-star">*</span></label>
              <input type="text" id="reg-name" placeholder="Jane Doe" autocomplete="name" required>
            </div>
            <div class="form-group">
              <label for="reg-email">Email <span class="req-star">*</span></label>
              <input type="email" id="reg-email" placeholder="you@example.com" autocomplete="email" required>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password">Password <span class="req-star">*</span></label>
            <div class="pw-wrap">
              <input type="password" id="reg-password" placeholder="Min. 8 characters" autocomplete="new-password" required minlength="8">
              <button type="button" class="pw-toggle" data-target="reg-password" aria-label="Show/hide password">
                <svg class="pw-eye-show" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="pw-rules" id="pw-rules">
              <span class="pw-rule" data-rule="length">8+ characters</span>
              <span class="pw-rule" data-rule="upper">Uppercase letter</span>
              <span class="pw-rule" data-rule="number">Number</span>
              <span class="pw-rule" data-rule="special">Special character</span>
            </div>
          </div>

          <div class="auth-form-row">
            <div class="form-group" id="reg-skill-group">
              <label for="reg-skill">Primary Skill</label>
              <select id="reg-skill">
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="MERN Developer">MERN Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group" id="reg-company-group" style="display:none;">
              <label for="reg-company">Company <span style="color:#aaa;font-weight:400;font-size:0.8rem;">(optional)</span></label>
              <input type="text" id="reg-company" placeholder="Your company name">
            </div>
          </div>

          <div class="auth-tc-row">
            <label class="auth-tc-label">
              <input type="checkbox" id="reg-tc" required>
              <span>I agree to the <a href="policies.html" target="_blank" style="color:var(--accent-color);font-weight:600;">Terms of Service</a> and <a href="policies.html#privacy" target="_blank" style="color:var(--accent-color);font-weight:600;">Privacy Policy</a></span>
            </label>
          </div>
          <div class="auth-error" id="register-error"></div>
          <button type="submit" class="btn btn-primary btn-block" id="register-submit-btn" style="border-radius:10px;">Create Account</button>
        </form>
        <p class="auth-toggle-text">
          Already have an account? <button class="auth-toggle-link" id="goto-login">Log in</button>
        </p>
      </div>

    </div>
  </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild);

  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const panelLogin = document.getElementById('auth-panel-login');
  const panelRegister = document.getElementById('auth-panel-register');
  const gotoRegister = document.getElementById('goto-register');
  const gotoLogin = document.getElementById('goto-login');

  // Close
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  // Tab switching
  function showTab(tab) {
    tabLogin.classList.toggle('active', tab === 'login');
    tabRegister.classList.toggle('active', tab === 'register');
    panelLogin.style.display = tab === 'login' ? 'block' : 'none';
    panelRegister.style.display = tab === 'register' ? 'block' : 'none';
  }
  tabLogin.addEventListener('click', () => showTab('login'));
  tabRegister.addEventListener('click', () => showTab('register'));
  if (gotoRegister) gotoRegister.addEventListener('click', () => showTab('register'));
  if (gotoLogin) gotoLogin.addEventListener('click', () => showTab('login'));

  // Role card selection — supports single or both selected
  const roleCards = document.querySelectorAll('.auth-role-card');
  const roleInput = document.getElementById('register-role');
  const skillGroup = document.getElementById('reg-skill-group');
  const companyGroup = document.getElementById('reg-company-group');
  const bothNotice = document.getElementById('both-mode-notice');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const clickedRole = card.getAttribute('data-role');
      // Radio behaviour — deselect all, select only the clicked one
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      roleInput.value = clickedRole;
      if (bothNotice) bothNotice.style.display = 'none';
      if (skillGroup) skillGroup.style.display = clickedRole === 'freelancer' ? 'block' : 'none';
      if (companyGroup) companyGroup.style.display = clickedRole === 'client' ? 'block' : 'none';
    });
  });

  // Password show/hide toggles
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  });

  // Live password validation rules
  const regPwInput = document.getElementById('reg-password');
  if (regPwInput) {
    regPwInput.addEventListener('input', () => {
      const v = regPwInput.value;
      const rules = {
        length: v.length >= 8,
        upper: /[A-Z]/.test(v),
        number: /[0-9]/.test(v),
        special: /[^A-Za-z0-9]/.test(v)
      };
      document.querySelectorAll('.pw-rule').forEach(el => {
        el.classList.toggle('met', !!rules[el.dataset.rule]);
      });
    });
  }

  // Prefix helper for subdirectory pages
  function getPrefix() {
    const path = window.location.pathname;
    return (path.includes('/candidate/') || path.includes('/recruiter/') || path.includes('/shared/')) ? '../' : '';
  }

  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';

    try {
      const session = window.SessionManager.login(email, password);
      if (session) {
        // Merge any pre-login pending saves into the candidate's profile
        if (session.role === 'candidate') {
          const pending = JSON.parse(localStorage.getItem('skillbridge_pending_saves') || '[]');
          if (pending.length > 0) {
            const candidate = window.CandidatesDB.getById(session.user.id) || {};
            const existing = Array.isArray(candidate.savedProjects) ? candidate.savedProjects : [];
            const merged = [...new Set([...existing, ...pending])];
            window.CandidatesDB.save({ ...candidate, savedProjects: merged });
            localStorage.removeItem('skillbridge_pending_saves');
          }
        }
        modal.classList.remove('active');
        updateNavbarState();
        const prefix = getPrefix();
        if (session.role === 'recruiter') {
          window.location.href = prefix + 'recruiter/dashboard.html';
        } else {
          window.location.href = prefix + 'candidate/dashboard.html';
        }
      } else {
        errEl.textContent = 'Invalid email or password.';
      }
    } catch (err) {
      errEl.textContent = err.message;
    }
  });

  // Register form
  document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('register-role').value;
    const tc = document.getElementById('reg-tc').checked;
    const errEl = document.getElementById('register-error');
    errEl.textContent = '';

    if (!tc) { errEl.textContent = 'Please accept the Terms of Service to continue.'; return; }

    try {
      const prefix = getPrefix();
      // 'both' means user ticked both client + freelancer
      const isBoth = role === 'both';
      const effectiveRole = isBoth ? 'freelancer' : role;
      if (effectiveRole === 'freelancer') {
        const skill = document.getElementById('reg-skill').value;
        const newUser = window.CandidatesDB.signup(name, email, password, skill);
        if (isBoth) {
          newUser.bothRoles = true;
          window.CandidatesDB.update(newUser);
          // Also create a recruiter record with same ID so shortlist/hire works
          window.RecruitersDB.signupWithId(newUser.id, name, email, password, name);
        }
        window.SessionManager.loginCandidate(email, password);
        modal.classList.remove('active');
        updateNavbarState();
        window.location.href = prefix + 'profile-setup.html';
      } else {
        const company = document.getElementById('reg-company').value.trim();
        window.RecruitersDB.signup(name, email, password, company || name);
        window.SessionManager.loginRecruiter(email, password);
        modal.classList.remove('active');
        updateNavbarState();
        window.location.href = prefix + 'profile-setup.html';
      }
    } catch (err) {
      errEl.textContent = err.message;
    }
  });

  // Global open function
  window.openAuthModal = function(tab = 'login', role = 'freelancer') {
    modal.classList.add('active');
    showTab(tab);
    if (tab === 'register' && role) {
      const card = document.querySelector(`.auth-role-card[data-role="${role}"]`);
      if (card) card.click();
    }
    // Clear browser-autofilled values every time the modal opens
    setTimeout(() => {
      const emailEl = document.getElementById('login-email');
      const pwEl = document.getElementById('login-password');
      if (emailEl) emailEl.value = '';
      if (pwEl) pwEl.value = '';
    }, 50);
  };
}

/* --------------------------------------------------------------------------
   Contact Modal (Recruiter → Candidate)
   -------------------------------------------------------------------------- */
function initContactModal() {
  if (document.getElementById('contact-modal')) return;

  const html = `
  <div id="contact-modal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close-btn" id="contact-modal-close">&times;</button>
      <h2 class="modal-title">Contact Freelancer</h2>
      <p class="modal-subtitle">Send an inquiry. It will be saved to your dashboard.</p>
      <form id="recruiter-contact-form">
        <input type="hidden" id="contact-candidate-id">
        <div class="form-group">
          <label>Freelancer</label>
          <input type="text" id="contact-candidate-name" readonly style="background:rgba(0,0,0,0.03);">
        </div>
        <div class="form-group">
          <label for="contact-subject">Subject</label>
          <input type="text" id="contact-subject" placeholder="Opportunity: Frontend Developer" required>
        </div>
        <div class="form-group">
          <label for="contact-body">Message</label>
          <textarea id="contact-body" rows="5" placeholder="Hi! We saw your work on SkillBridge and would love to connect..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Send & Reveal Contact Info</button>
      </form>
      <div id="contact-reveal-section" style="display:none;text-align:center;margin-top:16px;padding-top:20px;border-top:1px solid var(--border-color);">
        <h3 style="color:#1dbf73;margin-bottom:8px;">Message Saved!</h3>
        <p style="margin-bottom:12px;font-size:.9rem;color:var(--secondary-text);">Freelancer contact email:</p>
        <div style="background:#f5f5f5;padding:12px 20px;border-radius:10px;font-weight:600;font-size:1.05rem;margin-bottom:16px;display:inline-block;">
          <span id="contact-reveal-email"></span>
        </div>
        <div style="display:flex;justify-content:center;gap:10px;">
          <button class="btn btn-secondary" id="contact-btn-copy" style="font-size:.85rem;padding:8px 16px;">Copy Email</button>
          <a class="btn btn-primary" id="contact-btn-mail" href="" style="font-size:.85rem;padding:8px 16px;">Open Mail Client</a>
        </div>
      </div>
    </div>
  </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild);

  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close');
  const form = document.getElementById('recruiter-contact-form');
  const revealSec = document.getElementById('contact-reveal-section');
  const revealEmail = document.getElementById('contact-reveal-email');
  const copyBtn = document.getElementById('contact-btn-copy');
  const mailLink = document.getElementById('contact-btn-mail');

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const candidateId = document.getElementById('contact-candidate-id').value;
    const subject = document.getElementById('contact-subject').value.trim();
    const body = document.getElementById('contact-body').value.trim();
    const session = window.SessionManager.getActiveUser();

    if (!session) { alert('You must be logged in to contact freelancers.'); return; }

    const candidate = window.CandidatesDB.getById(candidateId);
    if (!candidate) { alert('Freelancer not found.'); return; }

    window.MessagesDB.send(
      session.user.id, session.user.name,
      session.user.company || session.user.name,
      session.user.contact ? session.user.contact.email : (session.user.email || ''),
      candidateId, subject, body
    );

    const email = candidate.contact.email || 'no-email@example.com';
    revealEmail.textContent = email;
    mailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.style.display = 'none';
    revealSec.style.display = 'block';
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(revealEmail.textContent).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy Email'; }, 2000);
    });
  });

  window.openContactModal = function(candidateId, candidateName) {
    const session = window.SessionManager.getActiveUser();
    if (!session) { window.openAuthModal('login'); return; }
    form.reset();
    form.style.display = 'block';
    revealSec.style.display = 'none';
    document.getElementById('contact-candidate-id').value = candidateId;
    document.getElementById('contact-candidate-name').value = candidateName;
    modal.classList.add('active');
  };
}

/* --------------------------------------------------------------------------
   Proposal Submit Modal
   -------------------------------------------------------------------------- */
function initProposalModal() {
  if (document.getElementById('proposal-modal')) return;

  const html = `
  <div id="proposal-modal" class="modal-overlay">
    <div class="modal-card">
      <button class="modal-close-btn" id="proposal-modal-close">&times;</button>
      <h2 class="modal-title">Submit Proposal</h2>
      <p class="modal-subtitle" id="proposal-job-title-display"></p>
      <form id="proposal-form">
        <input type="hidden" id="proposal-job-id">
        <div class="form-group">
          <label for="proposal-budget">Your Bid / Rate</label>
          <input type="text" id="proposal-budget" placeholder="e.g. ₹18,000 fixed or ₹900/hr" required>
        </div>
        <div class="form-group">
          <label for="proposal-timeline">Estimated Timeline</label>
          <input type="text" id="proposal-timeline" placeholder="e.g. 2 weeks" required>
        </div>
        <div class="form-group">
          <label for="proposal-cover">Cover Letter</label>
          <textarea id="proposal-cover" rows="6" placeholder="Introduce yourself and explain why you're the right fit for this project..." required></textarea>
        </div>
        <div class="auth-error" id="proposal-error"></div>
        <button type="submit" class="btn btn-primary btn-block" style="border-radius:6px;">Submit Proposal</button>
      </form>
      <div id="proposal-success" style="display:none;text-align:center;padding:28px 0;">
        <div style="width:52px;height:52px;border-radius:50%;background:rgba(29,191,115,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="color:#111;font-size:1.1rem;margin-bottom:8px;">Proposal Submitted!</h3>
        <p style="color:#666;font-size:0.88rem;">Your proposal has been sent to the client. <a href="my-proposals.html" style="color:var(--accent-color);font-weight:600;">View in My Proposals</a></p>
      </div>
    </div>
  </div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild);

  const modal = document.getElementById('proposal-modal');
  const closeBtn = document.getElementById('proposal-modal-close');
  const form = document.getElementById('proposal-form');
  const successDiv = document.getElementById('proposal-success');

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const jobId = document.getElementById('proposal-job-id').value;
    const budget = document.getElementById('proposal-budget').value.trim();
    const timeline = document.getElementById('proposal-timeline').value.trim();
    const cover = document.getElementById('proposal-cover').value.trim();
    const errEl = document.getElementById('proposal-error');
    errEl.textContent = '';

    const session = window.SessionManager.getActiveUser();
    if (!session) { errEl.textContent = 'You must be logged in to submit a proposal.'; return; }

    try {
      window.ProposalsDB.submit(jobId, session, { coverLetter: cover, proposedBudget: budget, proposedTimeline: timeline });
      form.style.display = 'none';
      successDiv.style.display = 'block';

      // Update the card button to Submitted state
      const cardBtn = document.querySelector(`.bp-apply-btn[data-job-id="${jobId}"]`);
      if (cardBtn) {
        cardBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:-2px;"><polyline points="20 6 9 17 4 12"/></svg>Submitted`;
        cardBtn.disabled = true;
        cardBtn.classList.add('applied');
        cardBtn.onclick = null;
        cardBtn.style.background = '#e8f8f0';
        cardBtn.style.color = '#16a060';
        cardBtn.style.border = '1.5px solid #a7e9c8';
        cardBtn.style.cursor = 'default';
      }

      // Auto-close modal, then fade and remove the card from the list
      setTimeout(() => {
        modal.classList.remove('active');
        const card = document.querySelector(`.job-card[data-job-id="${jobId}"]`);
        if (card) {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-8px)';
          setTimeout(() => {
            card.remove();
            const countEl = document.getElementById('job-count-label');
            if (countEl) {
              const current = parseInt(countEl.textContent) || 0;
              const remaining = Math.max(0, current - 1);
              countEl.textContent = `${remaining} project${remaining !== 1 ? 's' : ''} found`;
            }
          }, 420);
        }
      }, 2000);
    } catch (err) {
      errEl.textContent = err.message;
    }
  });

  window.openProposalModal = function(jobId, jobTitle) {
    const session = window.SessionManager.getActiveUser();
    if (!session) { window.openAuthModal('login'); return; }
    form.reset();
    form.style.display = 'block';
    successDiv.style.display = 'none';
    document.getElementById('proposal-job-id').value = jobId;
    document.getElementById('proposal-job-title-display').textContent = jobTitle;
    document.getElementById('proposal-error').textContent = '';
    modal.classList.add('active');
  };
}

/* --------------------------------------------------------------------------
   updateNavbarState — renders nav based on session + active mode
   Mode: 'freelancer' shows Browse Projects + My Proposals
         'client'     shows Browse Freelancers + Post Project
   Same account can switch modes via the mode toggle button.
   -------------------------------------------------------------------------- */
function getActiveMode(session) {
  const stored = localStorage.getItem('skillbridge_mode');
  if (stored === 'client' || stored === 'freelancer') return stored;
  return session.role === 'recruiter' ? 'client' : 'freelancer';
}

function updateNavbarState() {
  const session = window.SessionManager.getActiveUser();
  const desktopCta = document.querySelector('.nav-cta');
  const desktopMenu = document.getElementById('nav-menu-list');
  const mobileCta = document.querySelector('.mobile-nav-cta');
  const mobileMenu = document.querySelector('.mobile-nav-list');

  if (!desktopMenu || !desktopCta) return;

  const path = window.location.pathname;
  const inSubdir = path.includes('/candidate/') || path.includes('/recruiter/') || path.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

  if (session) {
    const mode = getActiveMode(session);
    const isClient = mode === 'client';

    const dashUrl = session.role === 'recruiter'
      ? `${prefix}recruiter/dashboard.html`
      : `${prefix}candidate/dashboard.html`;

    const profileUrl = session.role === 'recruiter'
      ? `${prefix}client-profile.html?id=${session.user.id}`
      : `${prefix}profile.html?id=${session.user.id}`;

    // Role-specific link order — client: Home | Browse Freelancers | Post Project | Dashboard
    //                             freelancer: Home | Find Work | Dashboard
    desktopMenu.innerHTML = isClient ? `
      <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
      <li><a href="${prefix}candidates.html" class="nav-link">Browse Freelancers</a></li>
      <li><a href="${prefix}post-project.html" class="nav-link">Post Project</a></li>
      <li><a href="${dashUrl}" class="nav-link">Dashboard</a></li>
    ` : `
      <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
      <li><a href="${prefix}browse-projects.html" class="nav-link">Find Work</a></li>
      <li><a href="${dashUrl}" class="nav-link">Dashboard</a></li>
    `;

    const switchLabel = isClient ? 'Switch to Freelancer' : 'Switch to Client';
    const switchMode  = isClient ? 'freelancer' : 'client';
    const canSwitchModes = session.user.bothRoles === true;

    desktopCta.innerHTML = `
      ${canSwitchModes ? `<button class="btn-mode-switch" id="btn-mode-switch" title="${switchLabel}" data-mode="${switchMode}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        <span>${isClient ? 'Freelancer mode' : 'Client mode'}</span>
      </button>` : ''}
      <div class="nav-profile-wrap" id="nav-user-pill">
        <button type="button" class="user-pill-link" id="nav-user-badge" aria-expanded="false" aria-haspopup="true">
          <span class="user-pill-avatar">${session.user.name.charAt(0).toUpperCase()}</span>
          <span class="user-pill-name">${session.user.name.split(' ')[0]}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;margin-left:2px;" id="pill-chevron"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-profile-dropdown" id="nav-profile-dropdown">
          <a href="${profileUrl}" class="nav-dd-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </a>
          <button class="nav-dd-row nav-dd-logout" id="btn-navbar-logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </button>
        </div>
      </div>
    `;

    if (mobileMenu) {
      mobileMenu.innerHTML = isClient ? `
        <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
        <li><a href="${prefix}candidates.html" class="mobile-nav-link">Browse Freelancers</a></li>
        <li><a href="${prefix}post-project.html" class="mobile-nav-link">Post Project</a></li>
        <li><a href="${dashUrl}" class="mobile-nav-link">Dashboard</a></li>
        <li><a href="${profileUrl}" class="mobile-nav-link">My Profile</a></li>
      ` : `
        <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
        <li><a href="${prefix}browse-projects.html" class="mobile-nav-link">Find Work</a></li>
        <li><a href="${dashUrl}" class="mobile-nav-link">Dashboard</a></li>
        <li><a href="${profileUrl}" class="mobile-nav-link">My Profile</a></li>
      `;
    }
    if (mobileCta) {
      mobileCta.innerHTML = `
        ${canSwitchModes ? `<button class="btn btn-secondary btn-block" id="btn-mob-mode" style="font-size:0.82rem;">${switchLabel}</button>` : ''}
        <button class="btn btn-secondary btn-block" id="btn-mob-logout" style="margin-top:${canSwitchModes ? '8' : '0'}px;">Log Out</button>
      `;
    }

    // Profile pill — click toggles dropdown (not navigate)
    const pillBtn = document.getElementById('nav-user-badge');
    const pillWrap = document.getElementById('nav-user-pill');
    const pillChevron = document.getElementById('pill-chevron');
    if (pillBtn && pillWrap) {
      pillBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = pillWrap.classList.toggle('open');
        pillBtn.setAttribute('aria-expanded', String(isOpen));
        if (pillChevron) pillChevron.style.transform = isOpen ? 'rotate(180deg)' : '';
      });
      // Close when clicking anywhere else
      document.addEventListener('click', function closeDropdown(e) {
        if (!pillWrap.contains(e.target)) {
          pillWrap.classList.remove('open');
          pillBtn.setAttribute('aria-expanded', 'false');
          if (pillChevron) pillChevron.style.transform = '';
        }
      }, { capture: true });
    }

    // Mode switch — save new mode and redirect to that mode's home page
    const modeDest = switchMode === 'client'
      ? `${prefix}recruiter/dashboard.html`
      : `${prefix}candidate/dashboard.html`;

    document.getElementById('btn-mode-switch')?.addEventListener('click', () => {
      localStorage.setItem('skillbridge_mode', switchMode);
      window.location.href = modeDest;
    });
    document.getElementById('btn-mob-mode')?.addEventListener('click', () => {
      localStorage.setItem('skillbridge_mode', switchMode);
      window.closeMobileMenu();
      window.location.href = modeDest;
    });

    // Logout
    document.getElementById('btn-navbar-logout')?.addEventListener('click', () => {
      window.SessionManager.logout();
      localStorage.removeItem('skillbridge_mode');
      window.location.href = `${prefix}index.html`;
    });
    document.getElementById('btn-mob-logout')?.addEventListener('click', () => {
      window.closeMobileMenu();
      window.SessionManager.logout();
      localStorage.removeItem('skillbridge_mode');
      window.location.href = `${prefix}index.html`;
    });

  } else {
    // ── GUEST NAVBAR ──
    desktopMenu.innerHTML = `
      <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
      <li><a href="${prefix}hire-talent.html" class="nav-link">Hire Talent</a></li>
      <li><a href="${prefix}browse-projects.html" class="nav-link">Get Hired</a></li>
    `;
    desktopCta.innerHTML = `
      <button class="btn btn-secondary" id="nav-btn-login" style="margin-right:8px;padding:8px 18px;font-size:0.85rem;">Log In</button>
      <button class="btn btn-primary" id="nav-btn-register" style="padding:8px 18px;font-size:0.85rem;">Register</button>
    `;

    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
        <li><a href="${prefix}hire-talent.html" class="mobile-nav-link">Hire Talent</a></li>
        <li><a href="${prefix}browse-projects.html" class="mobile-nav-link">Get Hired</a></li>
      `;
    }
    if (mobileCta) {
      mobileCta.innerHTML = `
        <button class="btn btn-secondary btn-block" id="mob-btn-login">Log In</button>
        <button class="btn btn-primary btn-block" id="mob-btn-register" style="margin-top:8px;">Register</button>
      `;
    }

    document.getElementById('nav-btn-login')?.addEventListener('click', () => window.openAuthModal('login'));
    document.getElementById('nav-btn-register')?.addEventListener('click', () => window.openAuthModal('register'));
    document.getElementById('mob-btn-login')?.addEventListener('click', () => { window.closeMobileMenu(); window.openAuthModal('login'); });
    document.getElementById('mob-btn-register')?.addEventListener('click', () => { window.closeMobileMenu(); window.openAuthModal('register'); });
  }

  highlightActiveNavLink();
}

/* --------------------------------------------------------------------------
   Highlight active nav link
   -------------------------------------------------------------------------- */
function highlightActiveNavLink() {
  const cur = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isHome = (cur === '/' || cur.endsWith('index.html')) && (href.endsWith('index.html') || href === '/');
    const matches = !isHome && href !== '#' && cur.endsWith(href.replace('../', '').replace('./', ''));
    link.classList.toggle('active', isHome || matches);
  });
}

// Kick off proposal modal init on pages that may need it
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initProposalModal === 'function') initProposalModal();
});
// Export for pages that load main.js
window.initProposalModal = initProposalModal;

/* ==========================================================================
   Escrow Payment — redirect to payment.html (full-page experience)
   ========================================================================== */
(function () {
  // Resolve path to payment.html from current page location
  function _payPath() {
    const segs = window.location.pathname.split('/').filter(Boolean);
    // If we're in a subdirectory (e.g. /recruiter/dashboard.html), go up one level
    return segs.length > 1 ? '../payment.html' : 'payment.html';
  }

  // openPaymentModal(escrowId, amount, label) — redirects to payment.html
  window.openPaymentModal = function (escrowId, amount, label) {
    const returnUrl = window.location.href;
    const url = _payPath()
      + '?escrow=' + encodeURIComponent(escrowId)
      + '&amount=' + encodeURIComponent(amount)
      + '&label='  + encodeURIComponent(label)
      + '&return=' + encodeURIComponent(returnUrl);
    window.location.href = url;
  };
}());
