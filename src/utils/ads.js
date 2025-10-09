/**
 * Utility for handling Google Ads display in the email game
 */

/**
 * Check if ads should be shown for an email
 * @param {Object} email - Email object
 * @returns {boolean} True if ads should be shown
 */
export function shouldShowAds(email) {
  if (!email || !email.isSpam) return false;
  return Math.random() < 0.3;
}