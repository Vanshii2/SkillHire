/* ==========================================================================
   SkillBridge Request & Hiring Flow Controller
   ========================================================================== */

class RequestsController {
  static init() {
    this.injectHireModal();
  }

  // Dynamically inject the Hire Modal into the page if it's not present
  static injectHireModal() {
    if (document.getElementById('hire-modal-overlay')) return;

    const modalHtml = `
      <div class="modal-overlay" id="hire-modal-overlay">
        <div class="modal-card" style="max-width: 550px;">
          <button class="modal-close-btn" id="btn-close-hire-modal">&times;</button>
          <h2 style="font-family: var(--font-heading); margin-bottom: 24px; font-size: 1.5rem;">Send Project Proposal</h2>
          <form id="hire-candidate-form">
            <input type="hidden" id="hire-cand-id">
            <div class="form-group">
              <label for="hire-cand-name">Candidate Name</label>
              <input type="text" id="hire-cand-name" readonly style="background-color: var(--bg-color); font-weight: 600;">
            </div>
            <div class="form-group">
              <label for="hire-proj-title">Project Title</label>
              <input type="text" id="hire-proj-title" placeholder="e.g. E-Commerce Redesign" required>
            </div>
            <div class="form-group">
              <label for="hire-proj-desc">Project Details / Scope</label>
              <textarea id="hire-proj-desc" rows="4" placeholder="Describe project deliverables, expectations, and milestones..." required style="resize: vertical; min-height: 80px;"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="hire-proj-budget">Initial Budget ($ USD)</label>
                <input type="number" id="hire-proj-budget" min="1" placeholder="e.g. 500" required>
              </div>
              <div class="form-group">
                <label for="hire-proj-deadline">Target Deadline</label>
                <input type="date" id="hire-proj-deadline" required>
              </div>
            </div>
            <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
              <button type="button" class="btn btn-secondary" id="btn-cancel-hire">Cancel</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-hire">Send Proposal</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    // Event listeners
    const overlay = document.getElementById('hire-modal-overlay');
    const closeBtn = document.getElementById('btn-close-hire-modal');
    const cancelBtn = document.getElementById('btn-cancel-hire');
    const form = document.getElementById('hire-candidate-form');

    const closeModal = () => {
      overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitProposal();
    });
  }

  static openHireModal(candidateId, candidateName) {
    const session = window.SessionManager.getActiveUser();
    if (!session || session.role !== 'recruiter') {
      alert('Please log in as a recruiter to send project proposals.');
      if (window.openAuthModal) {
        window.openAuthModal('recruiter', 'login');
      }
      return;
    }

    this.injectHireModal();

    document.getElementById('hire-cand-id').value = candidateId;
    document.getElementById('hire-cand-name').value = candidateName;
    
    // Set default date to 14 days from today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    const dateStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('hire-proj-deadline').value = dateStr;

    document.getElementById('hire-modal-overlay').classList.add('active');
  }

  static submitProposal() {
    const session = window.SessionManager.getActiveUser();
    if (!session) return;

    const candidateId = document.getElementById('hire-cand-id').value;
    const candidateName = document.getElementById('hire-cand-name').value;
    const title = document.getElementById('hire-proj-title').value.trim();
    const description = document.getElementById('hire-proj-desc').value.trim();
    const budget = parseFloat(document.getElementById('hire-proj-budget').value);
    const deadline = document.getElementById('hire-proj-deadline').value;

    // Validation
    if (!title || !description || isNaN(budget) || budget <= 0 || !deadline) {
      alert('Please fill out all fields correctly. Budget must be greater than $0.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (deadline < todayStr) {
      alert('Deadline cannot be in the past.');
      return;
    }

    const newRequest = {
      id: 'req-' + Date.now(),
      recruiterId: session.user.id,
      recruiterName: session.user.name || 'Acme Recruiter',
      recruiterCompany: session.user.company || 'Acme Corp',
      candidateId: candidateId,
      candidateName: candidateName,
      title: title,
      description: description,
      budget: budget,
      deadline: deadline,
      status: 'pending',
      counterBudget: null,
      createdAt: new Date().toISOString()
    };

    // Save request
    window.Storage.add(window.KEYS.requests, newRequest);

    // Save automatic message to messages
    const autoMessage = {
      id: 'msg-' + Date.now(),
      recruiterId: session.user.id,
      recruiterName: session.user.name || 'Acme Recruiter',
      recruiterCompany: session.user.company || 'Acme Corp',
      recruiterEmail: session.user.email,
      candidateId: candidateId,
      subject: `Project Proposal: ${title}`,
      body: `I have sent you a formal project request for "${title}" with an initial budget of $${budget} and deadline of ${deadline}. Please view details and accept/decline in your Requests panel.`,
      timestamp: new Date().toISOString(),
      isSystemMessage: true
    };
    // Format to old messages list key if present
    const messages = window.Storage.get(window.KEYS.messages);
    messages.push(autoMessage);
    window.Storage.set(window.KEYS.messages, messages);

    alert(`Hiring proposal sent successfully to ${candidateName}!`);
    document.getElementById('hire-modal-overlay').classList.remove('active');
  }

  // Candidates actions
  static acceptRequest(requestId) {
    const requests = window.Storage.get(window.KEYS.requests);
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'accepted';
    window.Storage.update(window.KEYS.requests, req);

    // Auto-generate Contract
    if (window.ContractsController) {
      window.ContractsController.createContract(req);
    } else {
      console.warn("ContractsController not loaded yet, deferring contract creation");
    }

    alert('You have accepted the project proposal! A contract has been generated. Please navigate to the Contracts page to manage progress.');
    location.reload();
  }

  static rejectRequest(requestId) {
    if (!confirm('Are you sure you want to reject this request?')) return;

    const requests = window.Storage.get(window.KEYS.requests);
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'rejected';
    window.Storage.update(window.KEYS.requests, req);

    alert('Request rejected.');
    location.reload();
  }

  static negotiateRequest(requestId, counterBudget) {
    const budgetVal = parseFloat(counterBudget);
    if (isNaN(budgetVal) || budgetVal <= 0) {
      alert('Please enter a valid counter budget greater than 0.');
      return;
    }

    const requests = window.Storage.get(window.KEYS.requests);
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'countered';
    req.counterBudget = budgetVal;
    window.Storage.update(window.KEYS.requests, req);

    // Send chat notification
    const autoMessage = {
      id: 'msg-' + Date.now(),
      recruiterId: req.recruiterId,
      recruiterName: req.recruiterName,
      recruiterCompany: req.recruiterCompany,
      candidateId: req.candidateId,
      subject: `Negotiation Counter-Offer: ${req.title}`,
      body: `I have countered your budget offer for "${req.title}" with a proposed budget of $${budgetVal}. Please review this counter offer in your dashboard.`,
      timestamp: new Date().toISOString(),
      isSystemMessage: true
    };
    const messages = window.Storage.get(window.KEYS.messages);
    messages.push(autoMessage);
    window.Storage.set(window.KEYS.messages, messages);

    alert(`Counter-offer of $${budgetVal} sent to ${req.recruiterName}.`);
    location.reload();
  }

  // Recruiter actions on countered offer
  static acceptCounter(requestId) {
    const requests = window.Storage.get(window.KEYS.requests);
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.budget = req.counterBudget;
    req.status = 'accepted';
    req.counterBudget = null;
    window.Storage.update(window.KEYS.requests, req);

    // Auto-generate Contract
    if (window.ContractsController) {
      window.ContractsController.createContract(req);
    }

    alert('You accepted the counter budget! A contract has been created. It is pending Escrow Payment.');
    location.reload();
  }

  static rejectCounter(requestId) {
    if (!confirm('Are you sure you want to reject this counter offer? This will reject the whole proposal.')) return;

    const requests = window.Storage.get(window.KEYS.requests);
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = 'rejected';
    window.Storage.update(window.KEYS.requests, req);

    alert('Counter offer rejected.');
    location.reload();
  }
}

window.RequestsController = RequestsController;
document.addEventListener('DOMContentLoaded', () => {
  RequestsController.init();
});
