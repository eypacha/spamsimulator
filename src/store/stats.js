import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useSoundStore } from './sound.js';
import { formatStorage } from '../utils/storage.js';
import { loadStats, saveStats } from '../utils/statsStorage.js';
import { createUpgradeHandler } from './modules/upgradeManager.js';
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
      totalCoinsEarned: totalCoinsEarned.value,
      totalSpamDeleted: totalSpamDeleted.value,
      totalEmailsRead: totalEmailsRead.value,
      totalGirlfriendEmailsRead: totalGirlfriendEmailsRead.value,
      totalNigerianPrinceDeleted: totalNigerianPrinceDeleted.value,
      totalEmailsSent: totalEmailsSent.value,
      currentStreak: currentStreak.value,
      maxStreak: maxStreak.value,
      turboSpamLevel: turboSpamLevel.value,
      turboSpamInterval: turboSpamInterval.value,
      turboSpamUpgradeCost: turboSpamUpgradeCost.value,
      // Combo
      comboUnlocked: comboUnlocked.value,
      comboUpgradeCost: comboUpgradeCost.value,
      comboMultiplier: comboMultiplier.value,
      comboCount: comboCount.value,
      // Spam Frenzy
      spamFrenzyUnlocked: spamFrenzyUnlocked.value,
      spamFrenzyUpgradeCost: spamFrenzyUpgradeCost.value,
      spamFrenzyCooldown: spamFrenzyCooldown.value,
      spamFrenzyActive: spamFrenzyActive.value,
      spamFrenzyTime: spamFrenzyTime.value,
      // Space Bar
      spaceBarUnlocked: spaceBarUnlocked.value,
      spaceBarUpgradeCost: spaceBarUpgradeCost.value
    });
  }

    // Upgrade para barra de espacio en la bandeja de entrada
  const spaceBarUnlocked = ref(loaded?.spaceBarUnlocked ?? false);
  const spaceBarUpgradeCost = ref(loaded?.spaceBarUpgradeCost ?? 50);

  function buySpaceBarUpgrade() {
    buyUpgradeHandler(spaceBarUpgradeCost, () => {
      spaceBarUnlocked.value = true;
    }, 1.5, !spaceBarUnlocked.value);
  }
  // Cooldown para Spam Frenzy
  // Spam Frenzy upgrade
  const spamFrenzyUnlocked = ref(loaded?.spamFrenzyUnlocked ?? false);
  const spamFrenzyUpgradeCost = ref(loaded?.spamFrenzyUpgradeCost ?? 200);
  const spamFrenzyCooldown = ref(loaded?.spamFrenzyCooldown ?? 0); // segundos restantes de cooldown
  const spamFrenzyActive = ref(loaded?.spamFrenzyActive ?? false);
  const spamFrenzyTime = ref(loaded?.spamFrenzyTime ?? 0); // segundos restantes

  function buySpamFrenzyUpgrade() {
    buyUpgradeHandler(spamFrenzyUpgradeCost, () => {
      spamFrenzyUnlocked.value = true;
    }, 1.5, !spamFrenzyUnlocked.value);
  }

  function activateSpamFrenzy() {
    if (!spamFrenzyUnlocked.value || spamFrenzyActive.value || spamFrenzyCooldown.value > 0) return;
    spamFrenzyActive.value = true;
    spamFrenzyTime.value = 3;
    // Cooldown de 60 segundos
    spamFrenzyCooldown.value = 60;
    // Timer para el efecto
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
  // Combo upgrade
  const comboUnlocked = ref(loaded?.comboUnlocked ?? false);
  const comboUpgradeCost = ref(loaded?.comboUpgradeCost ?? 150);
  const comboMultiplier = ref(loaded?.comboMultiplier ?? 1); // 1, 2, 3, 5
  const comboCount = ref(loaded?.comboCount ?? 0); // para llevar el conteo

  function buyComboUpgrade() {
    buyUpgradeHandler(comboUpgradeCost, () => {
      comboUnlocked.value = true;
      comboMultiplier.value = 1;
      comboCount.value = 0;
    }, 1.5, !comboUnlocked.value);
  }

  function updateCombo(success) {
    if (!comboUnlocked.value) return;
    if (success) {
      comboCount.value++;
      if (comboCount.value >= 20) comboMultiplier.value = 5;
      else if (comboCount.value >= 10) comboMultiplier.value = 3;
      else if (comboCount.value >= 5) comboMultiplier.value = 2;
      else comboMultiplier.value = 1;
    } else {
      comboCount.value = 0;
      comboMultiplier.value = 1;
    }
    saveAllStats();
  }
  // const loaded = loadStats(); // Already declared at the top
  const score = ref(loaded?.score ?? 0);
  const soundStore = useSoundStore();
  const buyUpgradeHandler = createUpgradeHandler(score, saveAllStats, soundStore);
  const level = ref(loaded?.level ?? 1); // Maybe keep level for display, but not auto
  const pointsPerSpam = ref(loaded?.pointsPerSpam ?? 1);
  const totalSpamDeleted = ref(loaded?.totalSpamDeleted ?? 0);
  const totalEmailsRead = ref(loaded?.totalEmailsRead ?? 0);
  const totalGirlfriendEmailsRead = ref(loaded?.totalGirlfriendEmailsRead ?? 0);
  const totalNigerianPrinceDeleted = ref(loaded?.totalNigerianPrinceDeleted ?? 0);
  const totalCoinsEarned = ref(loaded?.totalCoinsEarned ?? 0);
  const totalEmailsSent = ref(loaded?.totalEmailsSent ?? 0);
  function recordEmailSent() {
    totalEmailsSent.value += 1;
    saveAllStats();
  }
  const currentStreak = ref(loaded?.currentStreak ?? 0);
  const maxStreak = ref(loaded?.maxStreak ?? 0);
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
    totalCoinsEarned.value += realPoints;
    totalSpamDeleted.value += 1;
    saveAllStats();
    // Throttle sound to avoid multiple plays
    if (soundTimeout) clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      const soundStore = useSoundStore();
      soundStore.playCoinSound();
    }, 100);
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
    updateCombo(true);
  }

  function recordIncorrectDeletion() {
    currentStreak.value = 0;
    updateCombo(false);
  }

  function recordNigerianPrinceDeletion() {
    totalNigerianPrinceDeleted.value += 1;
    saveAllStats();
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
    totalSpamDeleted.value = 0;
    totalEmailsRead.value = 0;
    totalGirlfriendEmailsRead.value = 0;
    totalNigerianPrinceDeleted.value = 0;
    totalCoinsEarned.value = 0;
    currentStreak.value = 0;
    maxStreak.value = 0;
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