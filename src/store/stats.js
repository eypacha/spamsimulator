import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useSoundStore } from './sound.js';
import { formatStorage } from '../utils/storage.js';
import { loadStats, saveStats } from '../utils/statsStorage.js';
import { createUpgradeHandler } from './modules/upgradeManager.js';
import { createComboManager } from './modules/comboManager.js';
import { createAbilitiesManager } from './modules/abilitiesManager.js';
import { createStatsTracker } from './modules/statsTracker.js';
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
      turboSpamLevel: turboSpamLevel.value,
      turboSpamInterval: turboSpamInterval.value,
      turboSpamUpgradeCost: turboSpamUpgradeCost.value,
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
      spaceBarUpgradeCost: abilitiesManager.spaceBarUpgradeCost.value
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
    spaceBarUpgradeCost
  } = abilitiesManager;

  function buySpaceBarUpgrade() {
    buyUpgradeHandler(spaceBarUpgradeCost, abilitiesManager.unlockSpaceBar, 1.5, !spaceBarUnlocked.value);
  }

  function buySpamFrenzyUpgrade() {
    buyUpgradeHandler(spamFrenzyUpgradeCost, abilitiesManager.unlockSpamFrenzy, 1.5, !spamFrenzyUnlocked.value);
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
  // TurboSpam upgrade
  const loadedTurboLevel = loaded?.turboSpamLevel ?? 0;
  const loadedTurboInterval = loaded?.turboSpamInterval ?? TURBO_DEFAULT_INTERVAL;
  const loadedTurboCost = loaded?.turboSpamUpgradeCost ?? TURBO_DEFAULT_COST;
  const turboSpamLevel = ref(loadedTurboLevel);
  const turboSpamInterval = ref(loadedTurboInterval);
  const turboSpamUpgradeCost = ref(loadedTurboCost);
  function buyTurboSpamUpgrade() {
    buyUpgradeHandler(turboSpamUpgradeCost, () => {
      turboSpamLevel.value += 1;
      turboSpamInterval.value = Math.max(TURBO_MIN_INTERVAL, Math.floor(turboSpamInterval.value * TURBO_DECREASE));
    }, 1.7, turboSpamInterval.value > TURBO_MIN_INTERVAL);
  }
  let soundTimeout = null;

  function addScore(points) {
    let realPoints = points;
    if (comboUnlocked.value) {
      realPoints = points * comboMultiplier.value;
    }
    score.value += realPoints;
    statsTracker.incrementCoinsEarned(realPoints);
    statsTracker.incrementSpamDeleted();
    saveAllStats();
    // Throttle sound to avoid multiple plays
    if (soundTimeout) clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      const soundStore = useSoundStore();
      soundStore.playCoinSound();
    }, 100);
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
    buyUpgradeHandler(upgradeCost, () => pointsPerSpam.value += 1);
  }

  function buyTrashUpgrade() {
    buyUpgradeHandler(trashUpgradeCost, () => maxTrash.value += 5);
  }

  function buyInboxUpgrade() {
    buyUpgradeHandler(inboxUpgradeCost, () => maxInbox.value += 10);
  }

  function buySelectionUpgrade() {
    buyUpgradeHandler(selectionUpgradeCost, () => maxSelectable.value += 1, 2);
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
    spaceBarUnlocked, spaceBarUpgradeCost, buySpaceBarUpgrade
  };
});