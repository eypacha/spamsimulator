import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSoundStore } from './sound.js';

export const useStatsStore = defineStore('stats', () => {
  const score = ref(0);
  const level = ref(1); // Maybe keep level for display, but not auto
  const pointsPerSpam = ref(1);
  const totalSpamDeleted = ref(0);
  const upgradeCost = ref(10);
  let soundTimeout = null;

  function addScore(points) {
    score.value += points;
    totalSpamDeleted.value += 1;
    // Throttle sound to avoid multiple plays
    if (soundTimeout) clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      const soundStore = useSoundStore();
      soundStore.playCoinSound();
    }, 100);
  }

  function buyUpgrade() {
    if (score.value >= upgradeCost.value) {
      score.value -= upgradeCost.value;
      pointsPerSpam.value += 1;
      upgradeCost.value = Math.floor(upgradeCost.value * 1.5); // Increase cost
    }
  }

  function reset() {
    score.value = 0;
    level.value = 1;
    pointsPerSpam.value = 1;
    totalSpamDeleted.value = 0;
    upgradeCost.value = 10;
  }

  return { score, level, pointsPerSpam, totalSpamDeleted, upgradeCost, addScore, buyUpgrade, reset };
});