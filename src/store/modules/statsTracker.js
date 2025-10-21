import { ref } from 'vue';

/**
 * Stats Tracker - Maneja el seguimiento de estadísticas y eventos del juego
 * @param {Object} loaded - Datos cargados del storage
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @returns {Object} Estado y funciones de tracking
 */
export function createStatsTracker(loaded, saveAllStats) {
  const totalScore = ref(loaded?.totalScore ?? 0);
  const totalEmailsRead = ref(loaded?.totalEmailsRead ?? 0);
  const totalGirlfriendEmailsRead = ref(loaded?.totalGirlfriendEmailsRead ?? 0);
  const totalNigerianPrinceDeleted = ref(loaded?.totalNigerianPrinceDeleted ?? 0);
  const totalCoinsEarned = ref(loaded?.totalCoinsEarned ?? 0);
  const totalEmailsSent = ref(loaded?.totalEmailsSent ?? 0);
  const currentStreak = ref(loaded?.currentStreak ?? 0);
  const maxStreak = ref(loaded?.maxStreak ?? 0);
  const catPicturesViewed = ref(new Set(loaded?.catPicturesViewed ?? []));
  const totalVirusesInfected = ref(loaded?.totalVirusesInfected ?? 0);
  const totalAppointmentsConfirmed = ref(loaded?.totalAppointmentsConfirmed ?? 0);
  const totalWorkAppointmentsConfirmed = ref(loaded?.totalWorkAppointmentsConfirmed ?? 0);
  
  // Logros de tiempo
  const playedAt6AM = ref(loaded?.playedAt6AM ?? false);
  const playedAt3AM = ref(loaded?.playedAt3AM ?? false);
  const totalPlayTimeMinutes = ref(loaded?.totalPlayTimeMinutes ?? 0);
  const sessionStartTime = ref(Date.now());
  let playTimeInterval = null;

  // IDs de citas de trabajo confirmadas
  const confirmedWorkAppointments = ref(new Set(loaded?.confirmedWorkAppointments ?? []));

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
  
  function markCatPictureViewed(catNumber) {
    catPicturesViewed.value.add(catNumber);
    saveAllStats();
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
    totalScore.value += 1;
  }

  function incrementCoinsEarned(amount) {
    totalCoinsEarned.value += amount;
  }

  function recordVirusInfection() {
    totalVirusesInfected.value += 1;
    saveAllStats();
  }

  function recordAppointmentConfirmed() {
    totalAppointmentsConfirmed.value += 1;
    saveAllStats();
  }

  function recordWorkAppointmentConfirmed(emailId) {
    if (!confirmedWorkAppointments.value.has(emailId)) {
      console.log('[statsTracker] Agregando cita de trabajo confirmada:', emailId);
      confirmedWorkAppointments.value.add(emailId);
      totalWorkAppointmentsConfirmed.value += 1;
      saveAllStats();
    } else {
      console.log('[statsTracker] Cita ya confirmada, no se suma:', emailId);
    }
  }

  function removeWorkAppointment(emailId) {
    if (confirmedWorkAppointments.value.has(emailId)) {
      confirmedWorkAppointments.value.delete(emailId);
      saveAllStats();
    }
  }

  function checkTimeAchievements() {
    const hour = new Date().getHours();
    
    // Madrugador: Jugar a las 6 AM (entre 6:00 y 6:59)
    if (hour === 6 && !playedAt6AM.value) {
      playedAt6AM.value = true;
      saveAllStats();
    }
    
    // Noctámbulo: Jugar a las 3 AM (entre 3:00 y 3:59)
    if (hour === 3 && !playedAt3AM.value) {
      playedAt3AM.value = true;
      saveAllStats();
    }
  }

  function startPlayTimeTracking() {
    sessionStartTime.value = Date.now();
    
    // Verificar logros de hora al iniciar
    checkTimeAchievements();
    
    // Actualizar tiempo de juego cada minuto
    playTimeInterval = setInterval(() => {
      totalPlayTimeMinutes.value += 1;
      saveAllStats();
      
      // Verificar logros de hora cada minuto
      checkTimeAchievements();
    }, 60000); // 60000ms = 1 minuto
  }

  function stopPlayTimeTracking() {
    if (playTimeInterval) {
      clearInterval(playTimeInterval);
      playTimeInterval = null;
    }
  }

  function resetStats() {
    totalScore.value = 0;
    totalEmailsRead.value = 0;
    totalGirlfriendEmailsRead.value = 0;
    totalNigerianPrinceDeleted.value = 0;
    totalCoinsEarned.value = 0;
    totalEmailsSent.value = 0;
    currentStreak.value = 0;
    maxStreak.value = 0;
    catPicturesViewed.value = new Set();
    totalVirusesInfected.value = 0;
    totalAppointmentsConfirmed.value = 0;
    playedAt6AM.value = false;
    playedAt3AM.value = false;
    totalPlayTimeMinutes.value = 0;
  }

  return {
    totalScore,
    totalEmailsRead,
    totalGirlfriendEmailsRead,
    totalNigerianPrinceDeleted,
    totalCoinsEarned,
    totalEmailsSent,
    currentStreak,
    maxStreak,
    catPicturesViewed,
    totalVirusesInfected,
    totalAppointmentsConfirmed,
    playedAt6AM,
    playedAt3AM,
    totalPlayTimeMinutes,
    confirmedWorkAppointments,
    recordEmailSent,
    markEmailAsRead,
    markCatPictureViewed,
    recordCorrectDeletion,
    recordIncorrectDeletion,
    recordNigerianPrinceDeletion,
    incrementSpamDeleted,
    incrementCoinsEarned,
    recordVirusInfection,
    recordAppointmentConfirmed,
    recordWorkAppointmentConfirmed,
    removeWorkAppointment,
    startPlayTimeTracking,
    stopPlayTimeTracking,
    resetStats
  };
}
