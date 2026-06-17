/* ==========================================================================
   SkillHire Shared Script (Global Layout & Animations)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveLinks();
  initScrollAnimations();
  initAuthModal();
  initContactModal();
  updateNavbarState();

  // Check for auto-open modal actions on redirect
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  if (action === 'candidate-signup') {
    setTimeout(() => {
      if (typeof window.openAuthModal === 'function') {
        window.openAuthModal('candidate', 'signup');
      }
    }, 350);
  } else if (action === 'recruiter-login') {
    setTimeout(() => {
      if (typeof window.openAuthModal === 'function') {
        window.openAuthModal('recruiter', 'login');
      }
    }, 350);
  }
});

/**
 * Floating glass navbar behavior (scrolling & mobile drawer)
 */
function initNavbar() {
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  // Sticky Scroll Class Trigger
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close mobile drawer when clicking overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close drawer on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  function openMobileMenu() {
    mobileToggle.classList.add('active');
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Disable scroll under overlay
  }

  function closeMobileMenu() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    document.body.style.overflow = ''; // Re-enable scroll
  }

  window.closeMobileMenu = closeMobileMenu;
}

/**
 * Highlights active page navigation link based on URL
 */
function initActiveLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Exact match or matches directory root index.html
    const isHome = (currentPath === '/' || currentPath.endsWith('index.html')) && (href === 'index.html' || href === '/');
    const matchesHref = currentPath.endsWith(href) && href !== 'index.html' && href !== '/';

    if (isHome || matchesHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Sets up fade-in animations on scroll for tags with '.fade-in-section'
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% is visible
      rootMargin: '0px 0px -50px 0px' // offset slightly for better entrance feel
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once visible, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }
}

/**
 * Dynamic Auth Modal Injection and Controller
 */
function initAuthModal() {
  // If modal already exists, do not inject
  if (document.getElementById('auth-modal')) return;

  const modalHtml = `
    <div id="auth-modal" class="modal-overlay">
      <div class="modal-card auth-card">
        <button class="modal-close-btn" id="auth-modal-close">&times;</button>
        
        <div class="auth-tabs">
          <button class="auth-tab-btn active" id="tab-candidate">Candidate Portal</button>
          <button class="auth-tab-btn" id="tab-recruiter">Recruiter Portal</button>
        </div>

        <!-- Candidate Form -->
        <div class="auth-form-container" id="candidate-form-wrapper">
          <h2 class="auth-title" id="candidate-auth-title">Candidate Login</h2>
          <p class="auth-subtitle">Showcase your projects and get noticed by tech recruiters.</p>
          
          <form id="candidate-auth-form">
            <input type="hidden" id="candidate-mode" value="login">
            
            <div class="form-group" id="candidate-name-group" style="display: none;">
              <label for="candidate-name">Full Name</label>
              <input type="text" id="candidate-name" placeholder="John Doe">
            </div>
            
            <div class="form-group">
              <label for="candidate-email">Email Address</label>
              <input type="email" id="candidate-email" placeholder="john@example.com" required>
            </div>
            
            <div class="form-group">
              <label for="candidate-password">Password</label>
              <input type="password" id="candidate-password" placeholder="••••••••" required>
            </div>

            <div class="form-group" id="candidate-role-group" style="display: none;">
              <label for="candidate-role">Specialization Role</label>
              <select id="candidate-role">
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="MERN Developer">MERN Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Mobile Developer">Mobile Developer</option>
              </select>
            </div>

            <div class="auth-error" id="candidate-auth-error"></div>
            
            <button type="submit" class="btn btn-primary btn-block" id="candidate-submit-btn">Login as Candidate</button>
          </form>
          
          <div class="auth-toggle-text">
            <span id="candidate-toggle-prompt">Don't have a profile?</span>
            <button class="auth-toggle-link" id="candidate-toggle-btn">Create Profile / Sign Up</button>
          </div>
        </div>

        <!-- Recruiter Form -->
        <div class="auth-form-container" id="recruiter-form-wrapper" style="display: none;">
          <h2 class="auth-title" id="recruiter-auth-title">Recruiter Login</h2>
          <p class="auth-subtitle">Discover and contact fresh engineering and design talent.</p>
          
          <form id="recruiter-auth-form">
            <input type="hidden" id="recruiter-mode" value="login">
            
            <div class="form-group" id="recruiter-name-group" style="display: none;">
              <label for="recruiter-name">Full Name</label>
              <input type="text" id="recruiter-name" placeholder="Jane Doe">
            </div>

            <div class="form-group" id="recruiter-company-group" style="display: none;">
              <label for="recruiter-company">Company / Organization</label>
              <input type="text" id="recruiter-company" placeholder="Acme Inc">
            </div>
            
            <div class="form-group">
              <label for="recruiter-email">Work Email</label>
              <input type="email" id="recruiter-email" placeholder="jane@company.com" required>
            </div>
            
            <div class="form-group">
              <label for="recruiter-password">Password</label>
              <input type="password" id="recruiter-password" placeholder="••••••••" required>
            </div>

            <div class="auth-error" id="recruiter-auth-error"></div>
            
            <button type="submit" class="btn btn-primary btn-block" id="recruiter-submit-btn">Login as Recruiter</button>
          </form>
          
          <div class="auth-toggle-text">
            <span id="recruiter-toggle-prompt">New to SkillHire?</span>
            <button class="auth-toggle-link" id="recruiter-toggle-btn">Create Recruiter Account</button>
          </div>
        </div>
        
      </div>
    </div>
  `;

  // Inject to page
  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHtml;
  document.body.appendChild(wrapper.firstElementChild);

  // Bind modal DOM triggers
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabCandidate = document.getElementById('tab-candidate');
  const tabRecruiter = document.getElementById('tab-recruiter');
  
  const candFormWrapper = document.getElementById('candidate-form-wrapper');
  const recFormWrapper = document.getElementById('recruiter-form-wrapper');
  
  const candToggleBtn = document.getElementById('candidate-toggle-btn');
  const recToggleBtn = document.getElementById('recruiter-toggle-btn');

  // Close Event
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Tab Candidate Click
  tabCandidate.addEventListener('click', () => {
    tabCandidate.classList.add('active');
    tabRecruiter.classList.remove('active');
    candFormWrapper.style.display = 'block';
    recFormWrapper.style.display = 'none';
  });

  // Tab Recruiter Click
  tabRecruiter.addEventListener('click', () => {
    tabRecruiter.classList.add('active');
    tabCandidate.classList.remove('active');
    recFormWrapper.style.display = 'block';
    candFormWrapper.style.display = 'none';
  });

  // Toggle Candidate Login/Signup Mode
  candToggleBtn.addEventListener('click', () => {
    const modeInput = document.getElementById('candidate-mode');
    const nameGroup = document.getElementById('candidate-name-group');
    const roleGroup = document.getElementById('candidate-role-group');
    const submitBtn = document.getElementById('candidate-submit-btn');
    const title = document.getElementById('candidate-auth-title');
    const prompt = document.getElementById('candidate-toggle-prompt');
    const err = document.getElementById('candidate-auth-error');

    err.textContent = '';
    if (modeInput.value === 'login') {
      modeInput.value = 'signup';
      nameGroup.style.display = 'block';
      roleGroup.style.display = 'block';
      document.getElementById('candidate-name').required = true;
      submitBtn.textContent = 'Register & Create Profile';
      title.textContent = 'Candidate Signup';
      prompt.textContent = 'Already have an account?';
      candToggleBtn.textContent = 'Log In';
    } else {
      modeInput.value = 'login';
      nameGroup.style.display = 'none';
      roleGroup.style.display = 'none';
      document.getElementById('candidate-name').required = false;
      submitBtn.textContent = 'Login as Candidate';
      title.textContent = 'Candidate Login';
      prompt.textContent = "Don't have a profile?";
      candToggleBtn.textContent = 'Create Profile / Sign Up';
    }
  });

  // Toggle Recruiter Login/Signup Mode
  recToggleBtn.addEventListener('click', () => {
    const modeInput = document.getElementById('recruiter-mode');
    const nameGroup = document.getElementById('recruiter-name-group');
    const companyGroup = document.getElementById('recruiter-company-group');
    const submitBtn = document.getElementById('recruiter-submit-btn');
    const title = document.getElementById('recruiter-auth-title');
    const prompt = document.getElementById('recruiter-toggle-prompt');
    const err = document.getElementById('recruiter-auth-error');

    err.textContent = '';
    if (modeInput.value === 'login') {
      modeInput.value = 'signup';
      nameGroup.style.display = 'block';
      companyGroup.style.display = 'block';
      document.getElementById('recruiter-name').required = true;
      document.getElementById('recruiter-company').required = true;
      submitBtn.textContent = 'Create Recruiter Account';
      title.textContent = 'Recruiter Signup';
      prompt.textContent = 'Already registered?';
      recToggleBtn.textContent = 'Log In';
    } else {
      modeInput.value = 'login';
      nameGroup.style.display = 'none';
      companyGroup.style.display = 'none';
      document.getElementById('recruiter-name').required = false;
      document.getElementById('recruiter-company').required = false;
      submitBtn.textContent = 'Login as Recruiter';
      title.textContent = 'Recruiter Login';
      prompt.textContent = 'New to SkillHire?';
      recToggleBtn.textContent = 'Create Recruiter Account';
    }
  });

  // Candidate Form Submit
  document.getElementById('candidate-auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mode = document.getElementById('candidate-mode').value;
    const email = document.getElementById('candidate-email').value.trim();
    const password = document.getElementById('candidate-password').value;
    const errorEl = document.getElementById('candidate-auth-error');

    const inSubdir = window.location.pathname.includes('/candidate/') || 
                     window.location.pathname.includes('/recruiter/') || 
                     window.location.pathname.includes('/shared/');
    const prefix = inSubdir ? '../' : '';

    try {
      if (mode === 'login') {
        const session = window.SessionManager.loginCandidate(email, password);
        if (session) {
          modal.classList.remove('active');
          window.location.href = prefix + 'candidate/dashboard.html';
        } else {
          errorEl.textContent = 'Invalid candidate email or password. (Hint: Seed accounts use password123)';
        }
      } else {
        const name = document.getElementById('candidate-name').value.trim();
        const role = document.getElementById('candidate-role').value;
        const candidate = window.CandidatesDB.signup(name, email, password, role);
        window.SessionManager.loginCandidate(email, password);
        modal.classList.remove('active');
        window.location.href = prefix + 'candidate/dashboard.html';
      }
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });

  // Recruiter Form Submit
  document.getElementById('recruiter-auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mode = document.getElementById('recruiter-mode').value;
    const email = document.getElementById('recruiter-email').value.trim();
    const password = document.getElementById('recruiter-password').value;
    const errorEl = document.getElementById('recruiter-auth-error');

    const inSubdir = window.location.pathname.includes('/candidate/') || 
                     window.location.pathname.includes('/recruiter/') || 
                     window.location.pathname.includes('/shared/');
    const prefix = inSubdir ? '../' : '';

    try {
      if (mode === 'login') {
        const session = window.SessionManager.loginRecruiter(email, password);
        if (session) {
          modal.classList.remove('active');
          window.location.href = prefix + 'recruiter/dashboard.html';
        } else {
          errorEl.textContent = 'Invalid recruiter email or password. (Hint: Try jane@acme.com with password123)';
        }
      } else {
        const name = document.getElementById('recruiter-name').value.trim();
        const company = document.getElementById('recruiter-company').value.trim();
        const recruiter = window.RecruitersDB.signup(name, email, password, company);
        window.SessionManager.loginRecruiter(email, password);
        modal.classList.remove('active');
        window.location.href = prefix + 'recruiter/dashboard.html';
      }
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });

  // Export open trigger to window
  window.openAuthModal = function(role = 'candidate', mode = 'login') {
    modal.classList.add('active');
    if (role === 'candidate') {
      tabCandidate.click();
      if (mode === 'signup' && document.getElementById('candidate-mode').value === 'login') {
        candToggleBtn.click();
      } else if (mode === 'login' && document.getElementById('candidate-mode').value === 'signup') {
        candToggleBtn.click();
      }
    } else {
      tabRecruiter.click();
      if (mode === 'signup' && document.getElementById('recruiter-mode').value === 'login') {
        recToggleBtn.click();
      } else if (mode === 'login' && document.getElementById('recruiter-mode').value === 'signup') {
        recToggleBtn.click();
      }
    }
  };
}

/**
 * Contact Modal Injection and Controller
 */
function initContactModal() {
  if (document.getElementById('contact-modal')) return;

  const contactHtml = `
    <div id="contact-modal" class="modal-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" id="contact-modal-close">&times;</button>
        <h2 class="modal-title">Contact Candidate</h2>
        <p class="modal-subtitle">Send an inquiry to the candidate. Your request will be saved to your dashboard logs.</p>
        
        <form id="recruiter-contact-form">
          <input type="hidden" id="contact-candidate-id">
          
          <div class="form-group">
            <label for="contact-candidate-name">Candidate Name</label>
            <input type="text" id="contact-candidate-name" readonly style="background: rgba(255,255,255,0.05);">
          </div>

          <div class="form-group">
            <label for="contact-subject">Inquiry Subject</label>
            <input type="text" id="contact-subject" placeholder="Opportunity: Senior Frontend Developer" required>
          </div>

          <div class="form-group">
            <label for="contact-body">Message Description</label>
            <textarea id="contact-body" rows="6" placeholder="Hi! We saw your project showcase on SkillHire and would love to interview you for..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Log Message & Show Contact Info</button>
        </form>

        <!-- Success Reveal State (Hidden initially) -->
        <div id="contact-reveal-section" style="display: none; text-align: center; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <h3 style="color: #10B981; margin-bottom: 8px;">✓ Message Saved to Dashboard Logs</h3>
          <p style="margin-bottom: 16px; font-size: 0.95rem; color: var(--secondary-text);">Candidate Direct Contact Email:</p>
          <div class="reveal-email-box" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 1.1rem; border: 1px dashed rgba(255,255,255,0.2);">
            <span id="contact-reveal-email"></span>
          </div>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <button class="btn btn-secondary" id="contact-btn-copy" style="font-size: 0.85rem; padding: 8px 16px;">Copy Email Address</button>
            <a class="btn btn-primary" id="contact-btn-mail" href="" style="font-size: 0.85rem; padding: 8px 16px;">Open in Mail Client &rarr;</a>
          </div>
        </div>

      </div>
    </div>
  `;

  // Inject to page
  const wrapper = document.createElement('div');
  wrapper.innerHTML = contactHtml;
  document.body.appendChild(wrapper.firstElementChild);

  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close');
  const contactForm = document.getElementById('recruiter-contact-form');
  const revealSection = document.getElementById('contact-reveal-section');
  const revealEmail = document.getElementById('contact-reveal-email');
  const copyBtn = document.getElementById('contact-btn-copy');
  const mailLink = document.getElementById('contact-btn-mail');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const candidateId = document.getElementById('contact-candidate-id').value;
    const subject = document.getElementById('contact-subject').value.trim();
    const body = document.getElementById('contact-body').value.trim();

    const session = window.SessionManager.getActiveUser();
    if (!session || session.role !== 'recruiter') {
      alert('You must be logged in as a recruiter to contact candidates.');
      return;
    }

    const candidate = window.CandidatesDB.getById(candidateId);
    if (!candidate) {
      alert('Candidate details not found.');
      return;
    }

    // Save message to simulated DB
    window.MessagesDB.send(
      session.user.id,
      session.user.name,
      session.user.company,
      session.user.email,
      candidateId,
      subject,
      body
    );

    // Populate contact reveal and toggle view
    const email = candidate.contact.email || 'no-email@example.com';
    revealEmail.textContent = email;
    mailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Hide form elements and show email reveal section
    contactForm.style.display = 'none';
    revealSection.style.display = 'block';
  });

  // Copy email action
  copyBtn.addEventListener('click', () => {
    const text = revealEmail.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Email Address';
      }, 2000);
    });
  });

  window.openContactModal = function(candidateId, candidateName) {
    const session = window.SessionManager.getActiveUser();
    if (!session || session.role !== 'recruiter') {
      // Prompt recruiter to log in
      window.openAuthModal('recruiter', 'login');
      return;
    }

    // Reset UI state
    contactForm.reset();
    contactForm.style.display = 'block';
    revealSection.style.display = 'none';
    
    document.getElementById('contact-candidate-id').value = candidateId;
    document.getElementById('contact-candidate-name').value = candidateName;

    modal.classList.add('active');
  };
}

/**
 * Updates floating header and mobile drawer navigation dynamically based on Login State
 */
function updateNavbarState() {
  const session = window.SessionManager.getActiveUser();

  const desktopCtaContainer = document.querySelector('.nav-cta');
  const desktopNavMenu = document.getElementById('nav-menu-list');

  const mobileCtaContainer = document.querySelector('.mobile-nav-cta');
  const mobileNavMenu = document.querySelector('.mobile-nav-list');

  if (!desktopNavMenu || !desktopCtaContainer) return;

  const inSubdir = window.location.pathname.includes('/candidate/') || 
                   window.location.pathname.includes('/recruiter/') || 
                   window.location.pathname.includes('/shared/');
  const prefix = inSubdir ? '../' : '';

  if (session) {
    // Shared Logout Actions
    const handleLogoutHtml = `
      <button class="btn btn-secondary" id="btn-navbar-logout" style="margin-left: 10px;">Logout</button>
    `;

    if (session.role === 'recruiter') {
      // Update links for recruiter
      const recruiterLinks = `
        <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
        <li><a href="${prefix}candidates.html" class="nav-link">Candidates</a></li>
        <li><a href="${prefix}recruiter/dashboard.html" class="nav-link" style="color: #60A5FA;">Dashboard</a></li>
      `;
      desktopNavMenu.innerHTML = recruiterLinks;
      desktopCtaContainer.innerHTML = `
        <span class="recruiter-badge" style="font-size:0.8rem; background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.3); color:#93C5FD; padding:6px 12px; border-radius:100px; font-weight:600;">Recruiter: ${session.user.name.split(' ')[0]}</span>
        ${handleLogoutHtml}
      `;

      if (mobileNavMenu) {
        mobileNavMenu.innerHTML = `
          <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
          <li><a href="${prefix}candidates.html" class="mobile-nav-link">Candidates</a></li>
          <li><a href="${prefix}recruiter/dashboard.html" class="mobile-nav-link" style="color: #60A5FA;">Dashboard</a></li>
        `;
      }
      if (mobileCtaContainer) {
        mobileCtaContainer.innerHTML = `
          <button class="btn btn-secondary btn-block" id="btn-mob-logout" style="margin-top: 10px;">Logout</button>
        `;
      }

    } else {
      // Update links for candidate
      const candidateLinks = `
        <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
        <li><a href="${prefix}candidates.html" class="nav-link">Candidates</a></li>
        <li><a href="${prefix}profile.html?id=${session.user.id}" class="nav-link">My Public Profile</a></li>
      `;
      desktopNavMenu.innerHTML = candidateLinks;
      desktopCtaContainer.innerHTML = `
        <a href="${prefix}candidate/dashboard.html" class="btn btn-primary">My Dashboard</a>
        ${handleLogoutHtml}
      `;

      if (mobileNavMenu) {
        mobileNavMenu.innerHTML = `
          <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
          <li><a href="${prefix}candidates.html" class="mobile-nav-link">Candidates</a></li>
          <li><a href="${prefix}profile.html?id=${session.user.id}" class="mobile-nav-link">My Public Profile</a></li>
          <li><a href="${prefix}candidate/dashboard.html" class="mobile-nav-link" style="color: var(--primary-color);">My Dashboard</a></li>
        `;
      }
      if (mobileCtaContainer) {
        mobileCtaContainer.innerHTML = `
          <button class="btn btn-secondary btn-block" id="btn-mob-logout" style="margin-top: 10px;">Logout</button>
        `;
      }
    }

    // Attach click listeners to logout buttons
    const logOutBtn = document.getElementById('btn-navbar-logout');
    if (logOutBtn) {
      logOutBtn.addEventListener('click', () => {
        window.SessionManager.logout();
        window.location.href = `${prefix}index.html`;
      });
    }

    const mobLogOutBtn = document.getElementById('btn-mob-logout');
    if (mobLogOutBtn) {
      mobLogOutBtn.addEventListener('click', () => {
        window.closeMobileMenu();
        window.SessionManager.logout();
        window.location.href = `${prefix}index.html`;
      });
    }

  } else {
    // Guest User - update navbar links and setup modal action triggers
    desktopNavMenu.innerHTML = `
      <li><a href="${prefix}index.html" class="nav-link" id="nav-link-home">Home</a></li>
      <li><a href="${prefix}candidates.html" class="nav-link" id="nav-link-candidates">Candidates</a></li>
      <li><a href="#" class="nav-link" id="nav-link-candidate-reg">Join as Candidate</a></li>
    `;

    desktopCtaContainer.innerHTML = `
      <button class="btn btn-primary" id="nav-btn-portal-trigger">Recruiter Login</button>
    `;

    if (mobileNavMenu) {
      mobileNavMenu.innerHTML = `
        <li><a href="${prefix}index.html" class="mobile-nav-link">Home</a></li>
        <li><a href="${prefix}candidates.html" class="mobile-nav-link">Candidates</a></li>
        <li><a href="#" class="mobile-nav-link" id="mob-link-candidate-reg">Join as Candidate</a></li>
      `;
    }

    if (mobileCtaContainer) {
      mobileCtaContainer.innerHTML = `
        <button class="btn btn-primary btn-block" id="mob-btn-portal-trigger">Recruiter Login</button>
      `;
    }

    // Bind triggers to open Modal
    document.getElementById('nav-btn-portal-trigger').addEventListener('click', () => {
      window.openAuthModal('recruiter', 'login');
    });

    const mobPortalTrigger = document.getElementById('mob-btn-portal-trigger');
    if (mobPortalTrigger) {
      mobPortalTrigger.addEventListener('click', () => {
        window.closeMobileMenu();
        window.openAuthModal('recruiter', 'login');
      });
    }

    document.getElementById('nav-link-candidate-reg').addEventListener('click', (e) => {
      e.preventDefault();
      window.openAuthModal('candidate', 'signup');
    });

    const mobCandReg = document.getElementById('mob-link-candidate-reg');
    if (mobCandReg) {
      mobCandReg.addEventListener('click', (e) => {
        e.preventDefault();
        window.closeMobileMenu();
        window.openAuthModal('candidate', 'signup');
      });
    }
  }

  // Refresh active link visual styles
  initActiveLinks();
}
