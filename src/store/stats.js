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
      trashBarUpgradeCost: abilitiesManager.trashBarUpgradeCost.value
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
    trashBarUpgradeCost
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

  function reset() {
    score.value = 0;
    level.value = 1;
    pointsPerSpam.value = 1;
    statsTracker.resetStats();
    upgradeCost.value = UPGRADE_COST;
    trashUpgradeCost.value = TRASH_UPGRADE_COST;
    inboxUpgradeCost.value = INBOX_UPGRADE_COST;
    selectionUpgradeCost.value = SELECTION_UPGRADE_COST;
    maxTrash.value = MAX_TRASH;
    maxInbox.value = MAX_INBOX;
    maxSelectable.value = MAX_SELECTABLE;
    saveAllStats();
  }
  // Guarda automáticamente cuando cambian los upgrades, monedas y contadores de logros
  watch([
    score, level, pointsPerSpam, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, totalCoinsEarned,
    totalSpamDeleted, totalEmailsRead, totalGirlfriendEmailsRead, totalNigerianPrinceDeleted, currentStreak, maxStreak,
    turboSpamLevel, turboSpamInterval, turboSpamUpgradeCost,
    comboUnlocked, comboUpgradeCost, comboMultiplier, comboCount
  ], saveAllStats);

  return { score, level, pointsPerSpam, totalSpamDeleted, totalEmailsRead, totalGirlfriendEmailsRead, totalNigerianPrinceDeleted, totalCoinsEarned, currentStreak, maxStreak, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, addScore, markEmailAsRead, recordCorrectDeletion, recordIncorrectDeletion, recordNigerianPrinceDeletion, buyUpgrade, buyTrashUpgrade, buyInboxUpgrade, buySelectionUpgrade, getSpaceString, reset,
    turboSpamLevel, turboSpamInterval, turboSpamUpgradeCost, buyTurboSpamUpgrade, totalEmailsSent, recordEmailSent,
    comboUnlocked, comboUpgradeCost, comboMultiplier, comboCount, buyComboUpgrade,
    spamFrenzyUnlocked, spamFrenzyUpgradeCost, buySpamFrenzyUpgrade, spamFrenzyActive, spamFrenzyTime, activateSpamFrenzy, spamFrenzyCooldown,
    // Space Bar Upgrade
    spaceBarUnlocked, spaceBarUpgradeCost, buySpaceBarUpgrade,
    // Spam Detector Upgrade
    spamDetectorUnlocked, spamDetectorUpgradeCost, buySpamDetectorUpgrade,
    // Trash Bar Upgrade
    trashBarUnlocked, trashBarUpgradeCost, buyTrashBarUpgrade
  };
});