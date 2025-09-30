/**
 * Utility for handling Google Ads display in the email game
 */

/**
 * Check if ads should be shown for an email
 * @param {Object} email - Email object
 * @returns {boolean} True if ads should be shown
 */
export function shouldShowAds(email) {
  return email.isSpam === true;
}