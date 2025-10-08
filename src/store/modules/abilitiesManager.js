import { ref } from 'vue';

/**
 * Abilities Manager - Maneja habilidades especiales con timers y cooldowns
 * @param {Object} loaded - Datos cargados del storage
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @returns {Object} Estado y funciones de habilidades
 */
export function createAbilitiesManager(loaded, saveAllStats) {
  // Nivel de antivirus: 1=2 virus, 2=3 virus, ... hasta 5
  const antivirusLevel = ref(loaded?.antivirusLevel ?? 1);
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

  // Trash Bar - Barra de espacio de papelera
  const trashBarUnlocked = ref(loaded?.trashBarUnlocked ?? false);
  const trashBarUpgradeCost = ref(loaded?.trashBarUpgradeCost ?? 60);

  // Compose - Habilidad de redactar emails
  const composeUnlocked = ref(loaded?.composeUnlocked ?? false);
  const composeUpgradeCost = ref(loaded?.composeUpgradeCost ?? 100);

  // Starred - Habilidad de destacar emails
  const starredUnlocked = ref(loaded?.starredUnlocked ?? false);
  const starredUpgradeCost = ref(loaded?.starredUpgradeCost ?? 75);

  // Virus Bomb - Habilidad de convertir emails legítimos en spam
  const virusBombUnlocked = ref(loaded?.virusBombUnlocked ?? false);
  const virusBombUpgradeCost = ref(loaded?.virusBombUpgradeCost ?? 250);
  const virusBombCooldown = ref(loaded?.virusBombCooldown ?? 0);

  // Antivirus - Elimina un virus con cooldown
  const antivirusUnlocked = ref(loaded?.antivirusUnlocked ?? false);
  const antivirusUpgradeCost = ref(loaded?.antivirusUpgradeCost ?? 180);
  const antivirusCooldown = ref(loaded?.antivirusCooldown ?? 0);

  // Group Select - Selecciona grupos consecutivos del mismo tipo
  const groupSelectUnlocked = ref(loaded?.groupSelectUnlocked ?? false);
  const groupSelectUpgradeCost = ref(loaded?.groupSelectUpgradeCost ?? 150);

  // Keyboard Shortcuts - Habilita atajos de teclado para navegación
  const keyboardShortcutsUnlocked = ref(loaded?.keyboardShortcutsUnlocked ?? false);
  const keyboardShortcutsUpgradeCost = ref(loaded?.keyboardShortcutsUpgradeCost ?? 120);

  // Bulk Delete - Eliminar múltiples emails seleccionados
  const bulkDeleteUnlocked = ref(loaded?.bulkDeleteUnlocked ?? false);
  const bulkDeleteUpgradeCost = ref(loaded?.bulkDeleteUpgradeCost ?? 50);

  // Bulk Archive - Archivar múltiples emails seleccionados
  const bulkArchiveUnlocked = ref(loaded?.bulkArchiveUnlocked ?? false);
  const bulkArchiveUpgradeCost = ref(loaded?.bulkArchiveUpgradeCost ?? 60);

  // MobileFriendly - Swipe para borrar/archivar mails
  const mobileFriendlyUnlocked = ref(loaded?.mobileFriendlyUnlocked ?? false);
  const mobileFriendlyUpgradeCost = ref(loaded?.mobileFriendlyUpgradeCost ?? 40);

  function unlockSpamFrenzy() {
    spamFrenzyUnlocked.value = true;
  }

  function unlockSpaceBar() {
    spaceBarUnlocked.value = true;
  }

  function unlockSpamDetector() {
    spamDetectorUnlocked.value = true;
  }

  function unlockTrashBar() {
    trashBarUnlocked.value = true;
  }

  function unlockCompose() {
    composeUnlocked.value = true;
  }

  function unlockStarred() {
    starredUnlocked.value = true;
  }

  function unlockVirusBomb() {
    virusBombUnlocked.value = true;
  }

  function unlockAntivirus() {
    antivirusUnlocked.value = true;
    antivirusLevel.value = 1; // Al desbloquear, empieza en nivel 1 (elimina 2 virus)
    saveAllStats();
  }

  function upgradeAntivirus() {
    if (antivirusLevel.value < 4) {
      antivirusLevel.value++;
      saveAllStats();
      return true;
    }
    return false;
  }

  function unlockGroupSelect() {
    groupSelectUnlocked.value = true;
  }

  function unlockKeyboardShortcuts() {
    keyboardShortcutsUnlocked.value = true;
  }

  function unlockBulkDelete() {
    bulkDeleteUnlocked.value = true;
  }

  function unlockBulkArchive() {
    bulkArchiveUnlocked.value = true;
  }
  function unlockMobileFriendly() {
    mobileFriendlyUnlocked.value = true;
  }

  // Reiniciar timers al cargar (para cooldowns guardados)
  function initializeCooldowns() {
    // Virus Bomb cooldown
    if (virusBombCooldown.value > 0) {
      const cdInterval = setInterval(() => {
        virusBombCooldown.value--;
        if (virusBombCooldown.value <= 0) {
          clearInterval(cdInterval);
          saveAllStats();
        }
      }, 1000);
    }

    // Spam Frenzy cooldown
    if (spamFrenzyCooldown.value > 0) {
      const cdInterval = setInterval(() => {
        spamFrenzyCooldown.value--;
        if (spamFrenzyCooldown.value <= 0) {
          clearInterval(cdInterval);
          saveAllStats();
        }
      }, 1000);
    }

    // Spam Frenzy active timer
    if (spamFrenzyActive.value && spamFrenzyTime.value > 0) {
      const interval = setInterval(() => {
        spamFrenzyTime.value--;
        if (spamFrenzyTime.value <= 0) {
          spamFrenzyActive.value = false;
          clearInterval(interval);
          saveAllStats();
        }
      }, 1000);
    }

    // Antivirus cooldown
    if (antivirusCooldown.value > 0) {
      const cdInterval = setInterval(() => {
        antivirusCooldown.value--;
        if (antivirusCooldown.value <= 0) {
          clearInterval(cdInterval);
          saveAllStats();
        }
      }, 1000);
    }
  }

  // Inicializar cooldowns al cargar el módulo
  initializeCooldowns();

  function activateVirusBomb(convertEmailsCallback) {
    if (!virusBombUnlocked.value || virusBombCooldown.value > 0) return false;
    
    // Ejecutar la conversión de emails (callback proporcionado por emailStore)
    const converted = convertEmailsCallback();
    
    if (converted) {
      virusBombCooldown.value = 60; // Cooldown de 60 segundos

      // Timer para el cooldown
      const cdInterval = setInterval(() => {
        virusBombCooldown.value--;
        if (virusBombCooldown.value <= 0) {
          clearInterval(cdInterval);
        }
      }, 1000);

      saveAllStats();
      return true;
    }
    
    return false;
  }

  function activateSpamFrenzy() {
    if (!spamFrenzyUnlocked.value || spamFrenzyActive.value || spamFrenzyCooldown.value > 0) return;
    
    spamFrenzyActive.value = true;
    spamFrenzyTime.value = 5;
    spamFrenzyCooldown.value = 30;

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

  function activateAntivirus(removeVirusCallback) {
    if (!antivirusUnlocked.value || antivirusCooldown.value > 0) return false;
    let virusesToRemove = Math.min(antivirusLevel.value + 1, 5); // 2,3,4,5
    let removedAny = false;
    for (let i = 0; i < virusesToRemove; i++) {
      const removed = removeVirusCallback();
      if (removed) removedAny = true;
    }
    if (removedAny) {
      antivirusCooldown.value = 20; // 20s cooldown
      const cdInterval = setInterval(() => {
        antivirusCooldown.value--;
        if (antivirusCooldown.value <= 0) {
          clearInterval(cdInterval);
          saveAllStats();
        }
      }, 1000);
      saveAllStats();
      return true;
    }
    return false;
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
    unlockSpamDetector,
    // Trash Bar
    trashBarUnlocked,
    trashBarUpgradeCost,
    unlockTrashBar,
    // Compose
    composeUnlocked,
    composeUpgradeCost,
    unlockCompose,
    // Starred
    starredUnlocked,
    starredUpgradeCost,
    unlockStarred,
    // Virus Bomb
    virusBombUnlocked,
    virusBombUpgradeCost,
    virusBombCooldown,
    unlockVirusBomb,
    activateVirusBomb,
    // Antivirus
    antivirusUnlocked,
    antivirusUpgradeCost,
    antivirusCooldown,
    unlockAntivirus,
    upgradeAntivirus,
    antivirusLevel,
    activateAntivirus,
    // Group Select
    groupSelectUnlocked,
    groupSelectUpgradeCost,
    unlockGroupSelect,
    // Keyboard Shortcuts
    keyboardShortcutsUnlocked,
    keyboardShortcutsUpgradeCost,
    unlockKeyboardShortcuts,
    // Bulk Delete
    bulkDeleteUnlocked,
    bulkDeleteUpgradeCost,
    unlockBulkDelete,
    // Bulk Archive
    bulkArchiveUnlocked,
    bulkArchiveUpgradeCost,
    unlockBulkArchive,
    // MobileFriendly
    mobileFriendlyUnlocked,
    mobileFriendlyUpgradeCost,
    unlockMobileFriendly,
  };
}
