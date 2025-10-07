import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useSoundStore } from './sound.js';
import { formatStorage } from '../utils/storage.js';
import { loadStats, saveStats } from '../utils/statsStorage.js';
import { calculatePointsPerSpamIncrement, calculateUpgradeCostMultiplier, calculateTrashCapacityIncrement, calculateInboxCapacityIncrement, calculateSelectionIncrement, calculateSelectionCostMultiplier } from '../utils/balancing.js';
import { createUpgradeHandler } from './modules/upgradeManager.js';
import { createComboManager } from './modules/comboManager.js';
import { createAbilitiesManager } from './modules/abilitiesManager.js';
import { createStatsTracker } from './modules/statsTracker.js';
import { createTurboSpamManager } from './modules/turboSpamManager.js';
import { createScoreManager } from './modules/scoreManager.js';
import {
  EMAIL_SIZE_KB,
  TURBO_MIN_INTERVAL,
  TURBO_DEFAULT_INTERVAL,
  TURBO_DEFAULT_COST,
  TURBO_DECREASE,
  UPGRADE_COST,
  TRASH_UPGRADE_COST,
  INBOX_UPGRADE_COST,
  SELECTION_UPGRADE_COST,
  MAX_TRASH,
  MAX_INBOX,
  MAX_SELECTABLE
} from '../constants/stats.js';

export const useStatsStore = defineStore('stats', () => {
  // --- Storage helpers are now imported from utils/statsStorage.js ---
  // Primero cargar stats guardados
  const loaded = loadStats();

  // Helper to save all stats state
  function saveAllStats() {
    saveStats({
      score: score.value,
      virusCount: virusCount.value,
      virusByScreen: virusByScreen.value,
      level: level.value,
      pointsPerSpam: pointsPerSpam.value,
      upgradeCost: upgradeCost.value,
      trashUpgradeCost: trashUpgradeCost.value,
      inboxUpgradeCost: inboxUpgradeCost.value,
      selectionUpgradeCost: selectionUpgradeCost.value,
      maxTrash: maxTrash.value,
      maxInbox: maxInbox.value,
      maxSelectable: maxSelectable.value,
      totalCoinsEarned: statsTracker.totalCoinsEarned.value,
      totalSpamDeleted: statsTracker.totalSpamDeleted.value,
      totalEmailsRead: statsTracker.totalEmailsRead.value,
      totalGirlfriendEmailsRead: statsTracker.totalGirlfriendEmailsRead.value,
      totalNigerianPrinceDeleted: statsTracker.totalNigerianPrinceDeleted.value,
      totalEmailsSent: statsTracker.totalEmailsSent.value,
      currentStreak: statsTracker.currentStreak.value,
      maxStreak: statsTracker.maxStreak.value,
      catPicturesViewed: Array.from(statsTracker.catPicturesViewed.value),
      totalVirusesInfected: statsTracker.totalVirusesInfected.value,
      totalAppointmentsConfirmed: statsTracker.totalAppointmentsConfirmed.value,
      playedAt6AM: statsTracker.playedAt6AM.value,
      playedAt3AM: statsTracker.playedAt3AM.value,
      totalPlayTimeMinutes: statsTracker.totalPlayTimeMinutes.value,
      turboSpamLevel: turboSpamManager.turboSpamLevel.value,
      turboSpamInterval: turboSpamManager.turboSpamInterval.value,
      turboSpamUpgradeCost: turboSpamManager.turboSpamUpgradeCost.value,
      // Combo
      comboUnlocked: comboUnlocked.value,
      comboUpgradeCost: comboUpgradeCost.value,
      comboMultiplier: comboMultiplier.value,
      comboCount: comboCount.value,
      // Spam Frenzy
      spamFrenzyUnlocked: abilitiesManager.spamFrenzyUnlocked.value,
      spamFrenzyUpgradeCost: abilitiesManager.spamFrenzyUpgradeCost.value,
      spamFrenzyCooldown: abilitiesManager.spamFrenzyCooldown.value,
      spamFrenzyActive: abilitiesManager.spamFrenzyActive.value,
      spamFrenzyTime: abilitiesManager.spamFrenzyTime.value,
      // Space Bar
      spaceBarUnlocked: abilitiesManager.spaceBarUnlocked.value,
      spaceBarUpgradeCost: abilitiesManager.spaceBarUpgradeCost.value,
      // Spam Detector
      spamDetectorUnlocked: abilitiesManager.spamDetectorUnlocked.value,
      spamDetectorUpgradeCost: abilitiesManager.spamDetectorUpgradeCost.value,
      // Trash Bar
      trashBarUnlocked: abilitiesManager.trashBarUnlocked.value,
      trashBarUpgradeCost: abilitiesManager.trashBarUpgradeCost.value,
      // Compose
      composeUnlocked: abilitiesManager.composeUnlocked.value,
      composeUpgradeCost: abilitiesManager.composeUpgradeCost.value,
      // Starred
      starredUnlocked: abilitiesManager.starredUnlocked.value,
      starredUpgradeCost: abilitiesManager.starredUpgradeCost.value,
      // Virus Bomb
      virusBombUnlocked: abilitiesManager.virusBombUnlocked.value,
      virusBombUpgradeCost: abilitiesManager.virusBombUpgradeCost.value,
      virusBombCooldown: abilitiesManager.virusBombCooldown.value,
  // Antivirus
  antivirusUnlocked: abilitiesManager.antivirusUnlocked.value,
  antivirusUpgradeCost: abilitiesManager.antivirusUpgradeCost.value,
  antivirusCooldown: abilitiesManager.antivirusCooldown.value,
      // Group Select
      groupSelectUnlocked: abilitiesManager.groupSelectUnlocked.value,
      groupSelectUpgradeCost: abilitiesManager.groupSelectUpgradeCost.value,
      // Keyboard Shortcuts
      keyboardShortcutsUnlocked: abilitiesManager.keyboardShortcutsUnlocked.value,
      keyboardShortcutsUpgradeCost: abilitiesManager.keyboardShortcutsUpgradeCost.value,
      // Bulk Delete
      bulkDeleteUnlocked: abilitiesManager.bulkDeleteUnlocked.value,
      bulkDeleteUpgradeCost: abilitiesManager.bulkDeleteUpgradeCost.value,
      // Bulk Archive
      bulkArchiveUnlocked: abilitiesManager.bulkArchiveUnlocked.value,
      bulkArchiveUpgradeCost: abilitiesManager.bulkArchiveUpgradeCost.value,
      // Mobile Friendly
      mobileFriendlyUnlocked: abilitiesManager.mobileFriendlyUnlocked.value,
      mobileFriendlyUpgradeCost: abilitiesManager.mobileFriendlyUpgradeCost.value
    });
  }

  // Abilities Manager - maneja habilidades especiales (SpamFrenzy y SpaceBar)
  const abilitiesManager = createAbilitiesManager(loaded, saveAllStats);
  const { 
    spamFrenzyUnlocked, 
    spamFrenzyUpgradeCost, 
    spamFrenzyCooldown, 
    spamFrenzyActive, 
    spamFrenzyTime,
    activateSpamFrenzy,
    spaceBarUnlocked,
    spaceBarUpgradeCost,
    spamDetectorUnlocked,
    spamDetectorUpgradeCost,
    trashBarUnlocked,
    trashBarUpgradeCost,
    composeUnlocked,
    composeUpgradeCost,
    starredUnlocked,
    starredUpgradeCost,
    virusBombUnlocked,
    virusBombUpgradeCost,
    virusBombCooldown,
    activateVirusBomb,
  antivirusUnlocked,
  antivirusUpgradeCost,
  antivirusCooldown,
  activateAntivirus,
    groupSelectUnlocked,
    groupSelectUpgradeCost,
    keyboardShortcutsUnlocked,
    keyboardShortcutsUpgradeCost,
    bulkDeleteUnlocked,
    bulkDeleteUpgradeCost,
    bulkArchiveUnlocked,
    bulkArchiveUpgradeCost,
    mobileFriendlyUnlocked,
    mobileFriendlyUpgradeCost
  } = abilitiesManager;

  function buySpaceBarUpgrade() {
    buyUpgradeHandler(spaceBarUpgradeCost, abilitiesManager.unlockSpaceBar, 1.5, !spaceBarUnlocked.value);
  }

  function buySpamFrenzyUpgrade() {
    buyUpgradeHandler(spamFrenzyUpgradeCost, abilitiesManager.unlockSpamFrenzy, 1.5, !spamFrenzyUnlocked.value);
  }

  function buySpamDetectorUpgrade() {
    buyUpgradeHandler(spamDetectorUpgradeCost, abilitiesManager.unlockSpamDetector, 1.5, !spamDetectorUnlocked.value);
  }

  function buyTrashBarUpgrade() {
    buyUpgradeHandler(trashBarUpgradeCost, abilitiesManager.unlockTrashBar, 1.5, !trashBarUnlocked.value);
  }

  function buyComposeUpgrade() {
    buyUpgradeHandler(composeUpgradeCost, abilitiesManager.unlockCompose, 1.5, !composeUnlocked.value);
  }

  function buyStarredUpgrade() {
    buyUpgradeHandler(starredUpgradeCost, abilitiesManager.unlockStarred, 1.5, !starredUnlocked.value);
  }

  function buyVirusBombUpgrade() {
    buyUpgradeHandler(virusBombUpgradeCost, abilitiesManager.unlockVirusBomb, 1.5, !virusBombUnlocked.value);
  }

  function buyAntivirusUpgrade() {
    buyUpgradeHandler(antivirusUpgradeCost, abilitiesManager.unlockAntivirus, 1.5, !antivirusUnlocked.value);
  }

  function buyGroupSelectUpgrade() {
    buyUpgradeHandler(groupSelectUpgradeCost, abilitiesManager.unlockGroupSelect, 1.5, !groupSelectUnlocked.value);
  }

  function buyKeyboardShortcutsUpgrade() {
    buyUpgradeHandler(keyboardShortcutsUpgradeCost, abilitiesManager.unlockKeyboardShortcuts, 1.5, !keyboardShortcutsUnlocked.value);
  }

  function buyBulkDeleteUpgrade() {
    buyUpgradeHandler(bulkDeleteUpgradeCost, abilitiesManager.unlockBulkDelete, 1.5, !bulkDeleteUnlocked.value);
  }

  function buyBulkArchiveUpgrade() {
    buyUpgradeHandler(bulkArchiveUpgradeCost, abilitiesManager.unlockBulkArchive, 1.5, !bulkArchiveUnlocked.value);
  }

  function buyMobileFriendlyUpgrade() {
    buyUpgradeHandler(mobileFriendlyUpgradeCost, abilitiesManager.unlockMobileFriendly, 1.5, !mobileFriendlyUnlocked.value);
  }

  // Combo upgrade - usando comboManager
  const comboManager = createComboManager(loaded, saveAllStats);
  const { comboUnlocked, comboUpgradeCost, comboMultiplier, comboCount, updateCombo } = comboManager;

  function buyComboUpgrade() {
    buyUpgradeHandler(comboUpgradeCost, comboManager.resetCombo, 1.5, !comboUnlocked.value);
  }
  // Stats Tracker - maneja estadísticas y eventos del juego
  const statsTracker = createStatsTracker(loaded, saveAllStats);
  const {
    totalSpamDeleted,
    totalEmailsRead,
    totalGirlfriendEmailsRead,
    totalNigerianPrinceDeleted,
    totalCoinsEarned,
    totalEmailsSent,
    currentStreak,
    maxStreak,
    recordEmailSent,
    markEmailAsRead
  } = statsTracker;

  // const loaded = loadStats(); // Already declared at the top
  const score = ref(loaded?.score ?? 0);
  const virusCount = ref(loaded?.virusCount ?? 0);
  const virusByScreen = ref(loaded?.virusByScreen ?? { inbox: 0, trash: 0, store: 0, achievements: 0, settings: 0, starred: 0 });
  const gameOver = ref(false);
  const activeScreens = computed(() => {
    const screens = ['inbox', 'trash', 'store', 'achievements', 'settings'];
    if (abilitiesManager.starredUnlocked.value) screens.push('starred');
    return screens;
  });
  const soundStore = useSoundStore();
  const buyUpgradeHandler = createUpgradeHandler(score, saveAllStats, soundStore);
  const level = ref(loaded?.level ?? 1); // Maybe keep level for display, but not auto
  const pointsPerSpam = ref(loaded?.pointsPerSpam ?? 1);
  const upgradeCost = ref(loaded?.upgradeCost ?? UPGRADE_COST);
  const trashUpgradeCost = ref(loaded?.trashUpgradeCost ?? TRASH_UPGRADE_COST);
  const inboxUpgradeCost = ref(loaded?.inboxUpgradeCost ?? INBOX_UPGRADE_COST);
  // Aumentar el costo inicial de selección múltiple
  const selectionUpgradeCost = ref(loaded?.selectionUpgradeCost ?? SELECTION_UPGRADE_COST);
  const maxTrash = ref(loaded?.maxTrash ?? MAX_TRASH);
  const maxInbox = ref(loaded?.maxInbox ?? MAX_INBOX);
  const maxSelectable = ref(loaded?.maxSelectable ?? MAX_SELECTABLE);

  // TurboSpam Manager - maneja el upgrade de turbo spam
  const turboSpamManager = createTurboSpamManager(loaded, {
    TURBO_MIN_INTERVAL,
    TURBO_DEFAULT_INTERVAL,
    TURBO_DEFAULT_COST,
    TURBO_DECREASE
  });
  const { turboSpamLevel, turboSpamInterval, turboSpamUpgradeCost } = turboSpamManager;

  function buyTurboSpamUpgrade() {
    buyUpgradeHandler(
      turboSpamUpgradeCost, 
      turboSpamManager.upgradeTurboSpam, 
      1.7, 
      turboSpamManager.canUpgrade()
    );
  }

  // Score Manager - maneja la puntuación con multiplicadores y sonidos
  const scoreManager = createScoreManager(comboUnlocked, comboMultiplier, statsTracker, saveAllStats, soundStore);

  function addScore(points) {
    scoreManager.addScore(score, points);
  }

  function incrementVirusCount(amount = 1) {
    virusCount.value += amount;
    for (let i = 0; i < amount; i++) {
      const screens = activeScreens.value;
      const randomScreen = screens[Math.floor(Math.random() * screens.length)];
      virusByScreen.value[randomScreen]++;
      statsTracker.recordVirusInfection();
    }
    saveAllStats();
  }

  function removeOneVirus(screen) {
    if (screen) {
      // Remover de pantalla específica
      if (virusByScreen.value[screen] > 0) {
        virusByScreen.value[screen]--;
        virusCount.value--;
        saveAllStats();
        return true;
      }
    } else {
      // Remover de cualquier pantalla (para compatibilidad)
      const screensWithVirus = activeScreens.value.filter(s => virusByScreen.value[s] > 0);
      if (screensWithVirus.length > 0) {
        const randomScreen = screensWithVirus[Math.floor(Math.random() * screensWithVirus.length)];
        virusByScreen.value[randomScreen]--;
        virusCount.value--;
        saveAllStats();
        return true;
      }
    }
    return false;
  }

  // === Virus coin drain loop ===
  const VIRUS_DRAIN_INTERVAL = 2000; // 2s
  let virusDrainTimer = null;

  function computeVirusDrain() {
    if (virusCount.value <= 0) return 0;
    const drainPerVirus = Math.max(1, Math.floor(pointsPerSpam.value * 0.25));
    return drainPerVirus * virusCount.value;
  }

  function applyVirusDrain() {
    const drain = computeVirusDrain();
    if (drain > 0 && score.value > 0) {
      score.value = Math.max(0, score.value - drain);
      // Guardar y disparar animación negativa (HUD ya detecta decremento)
      saveAllStats();
      // Reproducir sonido de virus por drenaje
      if (soundStore && soundStore.playVirusSound) {
        soundStore.playVirusSound();
      }
    }
  }

  function startVirusDrainLoop() {
    if (virusDrainTimer) return; // ya corriendo
    virusDrainTimer = setInterval(applyVirusDrain, VIRUS_DRAIN_INTERVAL);
  }

  function stopVirusDrainLoop() {
    if (virusDrainTimer) {
      clearInterval(virusDrainTimer);
      virusDrainTimer = null;
    }
  }

  // Iniciar inmediatamente (el juego ya está montado al usar el store)
  startVirusDrainLoop();

  // Watch for game over condition - game over when score is 0 AND there are viruses
  watch([score, virusCount], ([newScore, newVirusCount]) => {
    if (newScore === 0 && newVirusCount > 0 && !gameOver.value) {
      gameOver.value = true;
      stopVirusDrainLoop(); // Detener el drain cuando hay game over
    }
  });

  // Hot Module Replacement cleanup (desarrollo)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      stopVirusDrainLoop();
    });
  }

  function recordCorrectDeletion() {
    statsTracker.recordCorrectDeletion();
    updateCombo(true);
  }

  function recordIncorrectDeletion() {
    statsTracker.recordIncorrectDeletion();
    updateCombo(false);
  }

  function recordNigerianPrinceDeletion() {
    statsTracker.recordNigerianPrinceDeletion();
  }

  function buyUpgrade() {
    const increment = calculatePointsPerSpamIncrement(pointsPerSpam.value);
    const costMultiplier = calculateUpgradeCostMultiplier(pointsPerSpam.value);
    buyUpgradeHandler(upgradeCost, () => pointsPerSpam.value += increment, costMultiplier);
  }

  function buyTrashUpgrade() {
    const increment = calculateTrashCapacityIncrement(maxTrash.value);
    buyUpgradeHandler(trashUpgradeCost, () => maxTrash.value += increment);
  }

  function buyInboxUpgrade() {
    const increment = calculateInboxCapacityIncrement(maxInbox.value);
    buyUpgradeHandler(inboxUpgradeCost, () => maxInbox.value += increment);
  }

  function buySelectionUpgrade() {
    const increment = calculateSelectionIncrement(maxSelectable.value);
    const costMultiplier = calculateSelectionCostMultiplier(maxSelectable.value);
    buyUpgradeHandler(selectionUpgradeCost, () => maxSelectable.value += increment, costMultiplier);
  }

  function getSpaceString(emailCount, sizeKB = EMAIL_SIZE_KB) {
    return formatStorage(emailCount * sizeKB);
  }

  function resetGame() {
    // Resetear todo menos achievements
    score.value = 0;
    virusCount.value = 0;
    virusByScreen.value = { inbox: 0, trash: 0, store: 0, achievements: 0, settings: 0, starred: 0 };
    level.value = 1;
    pointsPerSpam.value = 1;
    upgradeCost.value = UPGRADE_COST;
    trashUpgradeCost.value = TRASH_UPGRADE_COST;
    inboxUpgradeCost.value = INBOX_UPGRADE_COST;
    selectionUpgradeCost.value = SELECTION_UPGRADE_COST;
    maxTrash.value = MAX_TRASH;
    maxInbox.value = MAX_INBOX;
    maxSelectable.value = MAX_SELECTABLE;
    
    // Resetear stats tracker (mantener achievements)
    statsTracker.resetStats();
    
    // Resetear combo
    comboManager.resetCombo();
    
    gameOver.value = false;
    startVirusDrainLoop(); // Reiniciar el drain loop
    saveAllStats();
  }
  // Guarda automáticamente cuando cambian los upgrades, monedas y contadores de logros
  watch([
    score, level, pointsPerSpam, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, totalCoinsEarned,
    totalSpamDeleted, totalEmailsRead, totalGirlfriendEmailsRead, totalNigerianPrinceDeleted, currentStreak, maxStreak,
    turboSpamLevel, turboSpamInterval, turboSpamUpgradeCost,
    comboUnlocked, comboUpgradeCost, comboMultiplier, comboCount
  ], saveAllStats);

  // Computed para contar logros desbloqueados
  const unlockedAchievements = computed(() => {
    let count = 0;
    
    // Logros de spam eliminado
    if (totalSpamDeleted.value >= 50) count++;
    if (totalSpamDeleted.value >= 100) count++;
    if (totalSpamDeleted.value >= 1000) count++;
    if (totalSpamDeleted.value >= 10000) count++;
    
    // Logros de emails leídos
    if (totalEmailsRead.value >= 50) count++;
    if (totalEmailsRead.value >= 100) count++;
    if (totalEmailsRead.value >= 1000) count++;
    
    // Logros de monedas
    if (totalCoinsEarned.value >= 500) count++;
    if (totalCoinsEarned.value >= 1000) count++;
    if (totalCoinsEarned.value >= 10000) count++;
    
    // Logros de racha
    if (maxStreak.value >= 10) count++;
    if (maxStreak.value >= 50) count++;
    if (maxStreak.value >= 100) count++;
    
    // Logros de correos enviados
    if (totalEmailsSent.value >= 1) count++;
    if (totalEmailsSent.value >= 10) count++;
    if (totalEmailsSent.value >= 100) count++;
    
    // Logros de correos de novia
    if (totalGirlfriendEmailsRead.value >= 100) count++;
    if (totalGirlfriendEmailsRead.value >= 10000) count++;
    
    // Logro de príncipe nigeriano
    if (totalNigerianPrinceDeleted.value >= 1000) count++;
    
    // Logro de fotos de gatos
    if (statsTracker.catPicturesViewed.value.size >= 20) count++;
    
    // Logros de virus infectados
    if (statsTracker.totalVirusesInfected.value >= 50) count++;
    if (statsTracker.totalVirusesInfected.value >= 100) count++;
    if (statsTracker.totalVirusesInfected.value >= 1000) count++;
    
    // Logros de tiempo
    if (statsTracker.playedAt6AM.value) count++;
    if (statsTracker.playedAt3AM.value) count++;
    if (statsTracker.totalPlayTimeMinutes.value >= 480) count++; // 8 horas = 480 minutos
    
    // Logros de citas
    if (statsTracker.totalAppointmentsConfirmed.value >= 100) count++;
    
    return count;
  });

  // Iniciar el tracking de tiempo de juego
  statsTracker.startPlayTimeTracking();

  return { score, virusCount, incrementVirusCount, unlockedAchievements, level, pointsPerSpam, totalSpamDeleted, totalEmailsRead, totalGirlfriendEmailsRead, totalNigerianPrinceDeleted, totalCoinsEarned, totalVirusesInfected: computed(() => statsTracker.totalVirusesInfected.value), totalAppointmentsConfirmed: computed(() => statsTracker.totalAppointmentsConfirmed.value), recordAppointmentConfirmed: statsTracker.recordAppointmentConfirmed, playedAt6AM: computed(() => statsTracker.playedAt6AM.value), playedAt3AM: computed(() => statsTracker.playedAt3AM.value), totalPlayTimeMinutes: computed(() => statsTracker.totalPlayTimeMinutes.value), currentStreak, maxStreak, catPicturesViewed: computed(() => statsTracker.catPicturesViewed.value), markCatPictureViewed: statsTracker.markCatPictureViewed, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, addScore, markEmailAsRead, recordCorrectDeletion, recordIncorrectDeletion, recordNigerianPrinceDeletion, buyUpgrade, buyTrashUpgrade, buyInboxUpgrade, buySelectionUpgrade,     getSpaceString, resetGame,
    turboSpamLevel, turboSpamInterval, turboSpamUpgradeCost, buyTurboSpamUpgrade, totalEmailsSent, recordEmailSent,
    comboUnlocked, comboUpgradeCost, comboMultiplier, comboCount, buyComboUpgrade,
    spamFrenzyUnlocked, spamFrenzyUpgradeCost, buySpamFrenzyUpgrade, spamFrenzyActive, spamFrenzyTime, activateSpamFrenzy, spamFrenzyCooldown,
    // Space Bar Upgrade
    spaceBarUnlocked, spaceBarUpgradeCost, buySpaceBarUpgrade,
    // Spam Detector Upgrade
    spamDetectorUnlocked, spamDetectorUpgradeCost, buySpamDetectorUpgrade,
    // Trash Bar Upgrade
    trashBarUnlocked, trashBarUpgradeCost, buyTrashBarUpgrade,
    // Compose Upgrade
    composeUnlocked, composeUpgradeCost, buyComposeUpgrade,
    // Starred Upgrade
    starredUnlocked, starredUpgradeCost, buyStarredUpgrade,
    // Virus Bomb Upgrade
    virusBombUnlocked, virusBombUpgradeCost, virusBombCooldown, activateVirusBomb, buyVirusBombUpgrade,
    // Antivirus Upgrade
    antivirusUnlocked, antivirusUpgradeCost, antivirusCooldown, activateAntivirus: () => activateAntivirus(removeOneVirus), buyAntivirusUpgrade,
    // Group Select Upgrade
    groupSelectUnlocked, groupSelectUpgradeCost, buyGroupSelectUpgrade,
    // Keyboard Shortcuts Upgrade
    keyboardShortcutsUnlocked, keyboardShortcutsUpgradeCost, buyKeyboardShortcutsUpgrade,
    // Bulk Delete Upgrade
    bulkDeleteUnlocked, bulkDeleteUpgradeCost, buyBulkDeleteUpgrade,
    // Bulk Archive Upgrade
    bulkArchiveUnlocked, bulkArchiveUpgradeCost, buyBulkArchiveUpgrade,
    // Mobile Friendly Upgrade
    mobileFriendlyUnlocked, mobileFriendlyUpgradeCost, buyMobileFriendlyUpgrade,
    // Virus by screen
    virusByScreen,
    activeScreens,
    removeOneVirus,
    // Game Over
    gameOver,
    resetGame
  };
});