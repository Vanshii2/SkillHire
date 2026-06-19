/* ==========================================================================
   SkillBridge Create Profile Redirect Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const session = window.SessionManager.getActiveUser();
  if (session && session.role === 'candidate') {
    window.location.href = 'candidate-dashboard.html';
  } else {
    // Redirect guest users to sign up
    window.location.href = 'index.html?action=candidate-signup';
  }
});
