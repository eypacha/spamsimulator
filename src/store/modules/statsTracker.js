import { ref } from 'vue';

/**
 * Stats Tracker - Maneja el seguimiento de estadísticas y eventos del juego
 * @param {Object} loaded - Datos cargados del storage
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @returns {Object} Estado y funciones de tracking
 */
export function createStatsTracker(loaded, saveAllStats) {
  const totalSpamDeleted = ref(loaded?.totalSpamDeleted ?? 0);
  const totalEmailsRead = ref(loaded?.totalEmailsRead ?? 0);
  const totalGirlfriendEmailsRead = ref(loaded?.totalGirlfriendEmailsRead ?? 0);
  const totalNigerianPrinceDeleted = ref(loaded?.totalNigerianPrinceDeleted ?? 0);
  const totalCoinsEarned = ref(loaded?.totalCoinsEarned ?? 0);
  const totalEmailsSent = ref(loaded?.totalEmailsSent ?? 0);
  const currentStreak = ref(loaded?.currentStreak ?? 0);
  const maxStreak = ref(loaded?.maxStreak ?? 0);

  function recordEmailSent() {
    totalEmailsSent.value += 1;
    saveAllStats();
  }

  function markEmailAsRead(email) {
    totalEmailsRead.value += 1;
    if (email.fromEmail === 'caririchardson@gmail.com') {
      totalGirlfriendEmailsRead.value += 1;
    }
  }

  function recordCorrectDeletion() {
    currentStreak.value += 1;
    if (currentStreak.value > maxStreak.value) {
      maxStreak.value = currentStreak.value;
    }
  }

  function recordIncorrectDeletion() {
    currentStreak.value = 0;
  }

  function recordNigerianPrinceDeletion() {
    totalNigerianPrinceDeleted.value += 1;
    saveAllStats();
  }

  function incrementSpamDeleted() {
    totalSpamDeleted.value += 1;
  }

  function incrementCoinsEarned(amount) {
    totalCoinsEarned.value += amount;
  }

  function resetStats() {
    totalSpamDeleted.value = 0;
    totalEmailsRead.value = 0;
    totalGirlfriendEmailsRead.value = 0;
    totalNigerianPrinceDeleted.value = 0;
    totalCoinsEarned.value = 0;
    totalEmailsSent.value = 0;
    currentStreak.value = 0;
    maxStreak.value = 0;
  }

  return {
    totalSpamDeleted,
    totalEmailsRead,
    totalGirlfriendEmailsRead,
    totalNigerianPrinceDeleted,
    totalCoinsEarned,
    totalEmailsSent,
    currentStreak,
    maxStreak,
    recordEmailSent,
    markEmailAsRead,
    recordCorrectDeletion,
    recordIncorrectDeletion,
    recordNigerianPrinceDeletion,
    incrementSpamDeleted,
    incrementCoinsEarned,
    resetStats
  };
}
