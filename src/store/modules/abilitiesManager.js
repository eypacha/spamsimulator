import { ref } from 'vue';

/**
 * Abilities Manager - Maneja habilidades especiales con timers y cooldowns
 * @param {Object} loaded - Datos cargados del storage
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @returns {Object} Estado y funciones de habilidades
 */
export function createAbilitiesManager(loaded, saveAllStats) {
  // Spam Frenzy - Habilidad de frenesí con cooldown
  const spamFrenzyUnlocked = ref(loaded?.spamFrenzyUnlocked ?? false);
  const spamFrenzyUpgradeCost = ref(loaded?.spamFrenzyUpgradeCost ?? 200);
  const spamFrenzyCooldown = ref(loaded?.spamFrenzyCooldown ?? 0);
  const spamFrenzyActive = ref(loaded?.spamFrenzyActive ?? false);
  const spamFrenzyTime = ref(loaded?.spamFrenzyTime ?? 0);

  // Space Bar - Habilidad de barra espaciadora
  const spaceBarUnlocked = ref(loaded?.spaceBarUnlocked ?? false);
  const spaceBarUpgradeCost = ref(loaded?.spaceBarUpgradeCost ?? 50);

  // Spam Detector - Marca visualmente los emails de spam
  const spamDetectorUnlocked = ref(loaded?.spamDetectorUnlocked ?? false);
  const spamDetectorUpgradeCost = ref(loaded?.spamDetectorUpgradeCost ?? 80);

  function unlockSpamFrenzy() {
    spamFrenzyUnlocked.value = true;
  }

  function unlockSpaceBar() {
    spaceBarUnlocked.value = true;
  }

  function unlockSpamDetector() {
    spamDetectorUnlocked.value = true;
  }

  function activateSpamFrenzy() {
    if (!spamFrenzyUnlocked.value || spamFrenzyActive.value || spamFrenzyCooldown.value > 0) return;
    
    spamFrenzyActive.value = true;
    spamFrenzyTime.value = 3;
    spamFrenzyCooldown.value = 60; // Cooldown de 60 segundos

    // Timer para el efecto (duración de 3 segundos)
    const interval = setInterval(() => {
      spamFrenzyTime.value--;
      if (spamFrenzyTime.value <= 0) {
        spamFrenzyActive.value = false;
        clearInterval(interval);
      }
    }, 1000);

    // Timer para el cooldown
    const cdInterval = setInterval(() => {
      spamFrenzyCooldown.value--;
      if (spamFrenzyCooldown.value <= 0) {
        clearInterval(cdInterval);
      }
    }, 1000);

    saveAllStats();
  }

  return {
    // Spam Frenzy
    spamFrenzyUnlocked,
    spamFrenzyUpgradeCost,
    spamFrenzyCooldown,
    spamFrenzyActive,
    spamFrenzyTime,
    unlockSpamFrenzy,
    activateSpamFrenzy,
    
    // Space Bar
    spaceBarUnlocked,
    spaceBarUpgradeCost,
    unlockSpaceBar,
    
    // Spam Detector
    spamDetectorUnlocked,
    spamDetectorUpgradeCost,
    unlockSpamDetector
  };
}
