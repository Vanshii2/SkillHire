/* ==========================================================================
   SkillBridge Review & Ratings Controller
   ========================================================================== */

class ReviewsController {
  
  static createReview(contractId, recruiterId, candidateId, rating, reviewText) {
    const ratingVal = parseInt(rating);
    const newReview = {
      id: 'rev-' + Date.now(),
      contractId: contractId,
      recruiterId: recruiterId,
      candidateId: candidateId,
      rating: isNaN(ratingVal) ? 5 : ratingVal,
      review: reviewText.trim() || 'Great work, very professional!',
      createdAt: new Date().toISOString()
    };

    window.Storage.add(window.KEYS.reviews, newReview);

    // Update candidate profile with dynamic rating count/average if helpful
    this.updateCandidateProfileRating(candidateId);

    return newReview;
  }

  static getReviewsForCandidate(candidateId) {
    const allReviews = window.Storage.get(window.KEYS.reviews);
    return allReviews.filter(r => r.candidateId === candidateId);
  }

  static getAverageRating(candidateId) {
    const reviews = this.getReviewsForCandidate(candidateId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = sum / reviews.length;

    return {
      average: parseFloat(avg.toFixed(1)),
      count: reviews.length
    };
  }

  static updateCandidateProfileRating(candidateId) {
    const stats = this.getAverageRating(candidateId);
    // Sync to profiles list
    const profiles = window.Storage.get('profiles');
    const idx = profiles.findIndex(p => p.id === candidateId);
    if (idx !== -1) {
      profiles[idx].ratingAverage = stats.average;
      profiles[idx].ratingCount = stats.count;
      window.Storage.set('profiles', profiles);
    }

    // Sync to skillbridge_candidates
    if (window.CandidatesDB) {
      const fullCand = window.CandidatesDB.getById(candidateId);
      if (fullCand) {
        fullCand.ratingAverage = stats.average;
        fullCand.ratingCount = stats.count;
        window.CandidatesDB.save(fullCand);
      }
    }
  }

  static renderStarsHTML(rating) {
    const stars = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        html += '<span style="color: #fbbf24;">★</span>';
      } else {
        html += '<span style="color: #cbd5e1;">★</span>';
      }
    }
    return html;
  }
}

window.ReviewsController = ReviewsController;
