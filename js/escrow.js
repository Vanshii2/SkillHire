/* ==========================================================================
   Exhibitly Escrow Payment Checkout Controller
   ========================================================================== */

class EscrowController {
  
  static init() {
    this.injectCheckoutModal();
  }

  static injectCheckoutModal() {
    if (document.getElementById('escrow-checkout-overlay')) return;

    const modalHtml = `
      <div class="modal-overlay" id="escrow-checkout-overlay">
        <div class="modal-card checkout-modal-card">
          <button class="modal-close-btn" id="btn-close-escrow-modal">&times;</button>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem;">Secure Escrow Checkout</h2>
            <p style="font-size: 0.85rem; color: var(--secondary-text); margin-top: 4px;">Exhibitly SafePay Escrow Protection</p>
          </div>

          <!-- Credit Card Mockup -->
          <div class="credit-card-mockup">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="card-logo">SafePay<div class="logo-dot"></div></div>
              <div class="card-chip"></div>
            </div>
            <div class="card-number-display" id="cc-mock-number">•••• •••• •••• ••••</div>
            <div class="card-footer-info">
              <div>
                <div style="opacity: 0.6; font-size: 0.6rem; text-transform: uppercase;">Card Holder</div>
                <div class="card-holder-display" id="cc-mock-name">YOUR NAME</div>
              </div>
              <div style="text-align: right;">
                <div style="opacity: 0.6; font-size: 0.6rem; text-transform: uppercase;">Expires</div>
                <div id="cc-mock-expiry">MM/YY</div>
              </div>
            </div>
          </div>

          <!-- Form Details -->
          <form id="escrow-checkout-form">
            <input type="hidden" id="checkout-contract-id">
            <div class="form-group">
              <label for="card-holder">Cardholder Name</label>
              <input type="text" id="card-holder" placeholder="John Doe" required autocomplete="off">
            </div>
            
            <div class="form-group">
              <label for="card-number">Card Number</label>
              <input type="text" id="card-number" placeholder="4111 2222 3333 4444" maxlength="19" required autocomplete="off">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="card-expiry">Expiry Date</label>
                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required autocomplete="off">
              </div>
              <div class="form-group">
                <label for="card-cvv">CVV</label>
                <input type="password" id="card-cvv" placeholder="•••" maxlength="4" required autocomplete="off">
              </div>
            </div>

            <!-- Loader spinner (Hidden by default) -->
            <div id="checkout-loading-spinner" style="display: none; text-align: center; margin: 15px 0;">
              <span class="spinner" style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(234,88,12,0.2); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 10px; vertical-align: middle;"></span>
              <span style="font-size: 0.9rem; color: var(--accent-color); font-weight: 600;">Securing Escrow Funds...</span>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btn-pay-escrow" style="margin-top: 10px;">
              Deposit Funds & Start Contract
            </button>
          </form>
        </div>
      </div>

      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    // Event Bindings
    const overlay = document.getElementById('escrow-checkout-overlay');
    const closeBtn = document.getElementById('btn-close-escrow-modal');
    const form = document.getElementById('escrow-checkout-form');
    
    // Elements for card sync
    const cardHolderInput = document.getElementById('card-holder');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    
    const mockName = document.getElementById('cc-mock-name');
    const mockNumber = document.getElementById('cc-mock-number');
    const mockExpiry = document.getElementById('cc-mock-expiry');

    // Sync inputs with mockup card face
    cardHolderInput.addEventListener('input', (e) => {
      mockName.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    cardNumberInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = v.match(/\d{4,16}/g);
      let match = (matches && matches[0]) || '';
      let parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        e.target.value = parts.join(' ');
      } else {
        e.target.value = v;
      }
      
      mockNumber.textContent = e.target.value || '•••• •••• •••• ••••';
    });

    cardExpiryInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        e.target.value = v.substring(0, 2) + '/' + v.substring(2, 4);
      } else {
        e.target.value = v;
      }
      mockExpiry.textContent = e.target.value || 'MM/YY';
    });

    const closeModal = () => {
      overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processPayment();
    });
  }

  static openEscrowCheckout(contractId) {
    this.injectCheckoutModal();
    
    document.getElementById('checkout-contract-id').value = contractId;
    document.getElementById('escrow-checkout-overlay').classList.add('active');
  }

  static processPayment() {
    const contractId = document.getElementById('checkout-contract-id').value;
    const holder = document.getElementById('card-holder').value.trim();
    const number = document.getElementById('card-number').value.replace(/\s+/g, '');
    const expiry = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;

    // Standard client card validations
    if (!holder) {
      alert('Cardholder name is required.');
      return;
    }
    if (number.length !== 16 || isNaN(number)) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    if (!expiry.includes('/') || expiry.length !== 5) {
      alert('Please enter expiry date in MM/YY format.');
      return;
    }
    if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
      alert('Please enter a valid 3 or 4 digit CVV code.');
      return;
    }

    // Show loading spinner animation
    const spinner = document.getElementById('checkout-loading-spinner');
    const submitBtn = document.getElementById('btn-pay-escrow');
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';

    // Simulate SafePay transaction latency
    setTimeout(() => {
      const success = window.ContractsController.payEscrow(contractId, holder, number);
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';

      if (success) {
        alert('Payment processed successfully! Escrow funds are secured in Exhibitly SafePay.');
        document.getElementById('escrow-checkout-overlay').classList.remove('active');
        location.reload();
      } else {
        alert('Error securing escrow funds. Please try again.');
      }
    }, 1500);
  }
}

window.EscrowController = EscrowController;
document.addEventListener('DOMContentLoaded', () => {
  EscrowController.init();
});
