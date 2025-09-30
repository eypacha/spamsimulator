import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useSoundStore } from './sound.js';
import { formatStorage } from '../utils/storage.js';

export const useStatsStore = defineStore('stats', () => {
  const STATS_STORAGE_KEY = 'spambot_stats';

  function loadStats() {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }

  function saveStats() {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify({
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
      totalCoinsEarned: totalCoinsEarned.value
    }));
  }
  const loaded = loadStats();
  const score = ref(loaded?.score ?? 0);
  const level = ref(loaded?.level ?? 1); // Maybe keep level for display, but not auto
  const pointsPerSpam = ref(loaded?.pointsPerSpam ?? 1);
  const totalSpamDeleted = ref(0);
  const totalEmailsRead = ref(0);
  const totalGirlfriendEmailsRead = ref(0);
  const totalNigerianPrinceDeleted = ref(0);
  const totalCoinsEarned = ref(loaded?.totalCoinsEarned ?? 0);
  const currentStreak = ref(0);
  const maxStreak = ref(0);
  const upgradeCost = ref(loaded?.upgradeCost ?? 10);
  const trashUpgradeCost = ref(loaded?.trashUpgradeCost ?? 20);
  const inboxUpgradeCost = ref(loaded?.inboxUpgradeCost ?? 30);
  const selectionUpgradeCost = ref(loaded?.selectionUpgradeCost ?? 15);
  const maxTrash = ref(loaded?.maxTrash ?? 5);
  const maxInbox = ref(loaded?.maxInbox ?? 20);
  const maxSelectable = ref(loaded?.maxSelectable ?? 3);
  const EMAIL_SIZE_KB = 5; // Simulated size per email
  let soundTimeout = null;

  function addScore(points) {
    score.value += points;
    totalCoinsEarned.value += points;
    totalSpamDeleted.value += 1;
    saveStats();
    // Throttle sound to avoid multiple plays
    if (soundTimeout) clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      const soundStore = useSoundStore();
      soundStore.playCoinSound();
    }, 100);
  }

  function markEmailAsRead(email) {
    totalEmailsRead.value += 1;
    if (email.fromEmail === 'carinovia@gmail.com') {
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
  }

  function buyUpgrade() {
    if (score.value >= upgradeCost.value) {
      score.value -= upgradeCost.value;
      pointsPerSpam.value += 1;
      upgradeCost.value = Math.floor(upgradeCost.value * 1.5); // Increase cost
      saveStats();
      const soundStore = useSoundStore();
      soundStore.playBuySound();
    }
  }

  function buyTrashUpgrade() {
    if (score.value >= trashUpgradeCost.value) {
      score.value -= trashUpgradeCost.value;
      maxTrash.value += 5;
      trashUpgradeCost.value = Math.floor(trashUpgradeCost.value * 1.5);
      saveStats();
      const soundStore = useSoundStore();
      soundStore.playBuySound();
    }
  }

  function buyInboxUpgrade() {
    if (score.value >= inboxUpgradeCost.value) {
      score.value -= inboxUpgradeCost.value;
      maxInbox.value += 10;
      inboxUpgradeCost.value = Math.floor(inboxUpgradeCost.value * 1.5);
      saveStats();
      const soundStore = useSoundStore();
      soundStore.playBuySound();
    }
  }

  function buySelectionUpgrade() {
    if (score.value >= selectionUpgradeCost.value) {
      score.value -= selectionUpgradeCost.value;
      maxSelectable.value += 1;
      selectionUpgradeCost.value = Math.floor(selectionUpgradeCost.value * 1.5);
      saveStats();
      const soundStore = useSoundStore();
      soundStore.playBuySound();
    }
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
    upgradeCost.value = 10;
    trashUpgradeCost.value = 20;
    inboxUpgradeCost.value = 30;
    selectionUpgradeCost.value = 15;
    maxTrash.value = 5;
    maxInbox.value = 20;
    maxSelectable.value = 3;
    saveStats();
  }
  // Guarda automáticamente cuando cambian los upgrades y monedas
  watch([
    score, level, pointsPerSpam, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, totalCoinsEarned
  ], saveStats);

  return { score, level, pointsPerSpam, totalSpamDeleted, totalEmailsRead, totalGirlfriendEmailsRead, totalNigerianPrinceDeleted, totalCoinsEarned, currentStreak, maxStreak, upgradeCost, trashUpgradeCost, inboxUpgradeCost, selectionUpgradeCost, maxTrash, maxInbox, maxSelectable, addScore, markEmailAsRead, recordCorrectDeletion, recordIncorrectDeletion, recordNigerianPrinceDeletion, buyUpgrade, buyTrashUpgrade, buyInboxUpgrade, buySelectionUpgrade, getSpaceString, reset };
});