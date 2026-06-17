/* ==========================================================================
   Exhibitly Contracts, Milestones & Deliverables Controller
   ========================================================================== */

class ContractsController {
  
  static createContract(request) {
    const newContract = {
      id: 'ctr-' + Date.now(),
      requestId: request.id,
      recruiterId: request.recruiterId,
      recruiterName: request.recruiterName,
      recruiterCompany: request.recruiterCompany,
      candidateId: request.candidateId,
      candidateName: request.candidateName,
      title: request.title,
      description: request.description,
      budget: request.budget,
      deadline: request.deadline,
      status: 'pending-payment', // pending-payment -> in-progress -> delivered -> completed or revision-requested
      createdAt: new Date().toISOString()
    };

    // Save contract
    window.Storage.add(window.KEYS.contracts, newContract);

    // Initialize escrow record
    const newEscrow = {
      id: 'esc-' + Date.now(),
      contractId: newContract.id,
      amount: newContract.budget,
      status: 'pending', // pending -> held -> released
      transactionId: null,
      paidAt: null
    };
    window.Storage.add(window.KEYS.escrows, newEscrow);

    // Initial timeline update
    this.addTimelineUpdate(newContract.id, 'Contract initialized. Awaiting escrow deposit from recruiter.');

    return newContract;
  }

  static addTimelineUpdate(contractId, text) {
    const newUpdate = {
      id: 'upd-' + Date.now(),
      contractId: contractId,
      text: text,
      createdAt: new Date().toISOString()
    };
    window.Storage.add(window.KEYS.updates, newUpdate);
    return newUpdate;
  }

  static payEscrow(contractId, cardName, cardNumber) {
    const contracts = window.Storage.get(window.KEYS.contracts);
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return false;

    contract.status = 'in-progress';
    window.Storage.update(window.KEYS.contracts, contract);

    // Update escrow
    const escrows = window.Storage.get(window.KEYS.escrows);
    const escrow = escrows.find(e => e.contractId === contractId);
    if (escrow) {
      escrow.status = 'held';
      escrow.transactionId = 'TXN-' + Date.now().toString() + '-' + Math.floor(1000 + Math.random() * 9000);
      escrow.paidAt = new Date().toISOString();
      window.Storage.update(window.KEYS.escrows, escrow);
    }

    // Add update
    this.addTimelineUpdate(contractId, `Escrow payment of $${contract.budget} funded successfully. Transaction: ${escrow ? escrow.transactionId : 'N/A'}. Project is now active and in-progress.`);

    return true;
  }

  static postProgressUpdate(contractId, updateText) {
    if (!updateText.trim()) return false;
    this.addTimelineUpdate(contractId, `Progress Update: ${updateText.trim()}`);
    return true;
  }

  static submitDeliverable(contractId, githubUrl, liveUrl, notes) {
    const contracts = window.Storage.get(window.KEYS.contracts);
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return false;

    contract.status = 'delivered';
    window.Storage.update(window.KEYS.contracts, contract);

    // Create delivery record
    const delivery = {
      id: 'del-' + Date.now(),
      contractId: contractId,
      githubUrl: githubUrl,
      liveUrl: liveUrl,
      notes: notes,
      submittedAt: new Date().toISOString()
    };
    window.Storage.add(window.KEYS.deliveries, delivery);

    // Add update
    this.addTimelineUpdate(
      contractId, 
      `Candidate submitted deliverables! GitHub: ${githubUrl || 'N/A'} | Live Link: ${liveUrl || 'N/A'}. Notes: ${notes || 'None'}`
    );

    return true;
  }

  static requestRevision(contractId, notes) {
    const contracts = window.Storage.get(window.KEYS.contracts);
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return false;

    contract.status = 'revision-requested';
    window.Storage.update(window.KEYS.contracts, contract);

    // Add update
    this.addTimelineUpdate(contractId, `Revision Requested: ${notes}`);

    return true;
  }

  static approveAndCompleteContract(contractId, rating, reviewText) {
    const contracts = window.Storage.get(window.KEYS.contracts);
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return false;

    // Update contract status
    contract.status = 'completed';
    window.Storage.update(window.KEYS.contracts, contract);

    // Release escrow
    const escrows = window.Storage.get(window.KEYS.escrows);
    const escrow = escrows.find(e => e.contractId === contractId);
    if (escrow) {
      escrow.status = 'released';
      window.Storage.update(window.KEYS.escrows, escrow);
    }

    // Add timeline update
    this.addTimelineUpdate(contractId, 'Recruiter approved deliverables. Escrow balance released. Project completed successfully!');

    // Auto-add completed project to Candidate Portfolio
    const candidate = window.Storage.get('profiles').find(p => p.id === contract.candidateId) || window.CandidatesDB.getById(contract.candidateId);
    if (candidate) {
      if (!candidate.projects) {
        candidate.projects = [];
      }
      
      const newPortfolioProject = {
        name: contract.title,
        description: contract.description,
        screenshot: '../assets/images/aatma1.webp', // Default fallback image path for candidate portfolio items
        techStack: ['Contract Work', 'Vanilla JS', 'Completed'],
        github: 'https://github.com',
        live: 'https://live-exhibit.dev'
      };
      
      candidate.projects.push(newPortfolioProject);
      
      // Save to window.Storage profiles list
      const profiles = window.Storage.get('profiles');
      const pIdx = profiles.findIndex(x => x.id === candidate.id);
      if (pIdx !== -1) {
        profiles[pIdx] = candidate;
        window.Storage.set('profiles', profiles);
      }
      
      // Also update skillhire_candidates list to make sure directories are fully synced
      if (window.CandidatesDB) {
        const fullCand = window.CandidatesDB.getById(candidate.id);
        if (fullCand) {
          if (!fullCand.projects) fullCand.projects = [];
          fullCand.projects.push(newPortfolioProject);
          window.CandidatesDB.save(fullCand);
        }
      }
    }

    // Save Review
    if (window.ReviewsController) {
      window.ReviewsController.createReview(contractId, contract.recruiterId, contract.candidateId, rating, reviewText);
    }

    return true;
  }
}

window.ContractsController = ContractsController;
