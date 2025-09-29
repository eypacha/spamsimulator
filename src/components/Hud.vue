<template>
  <div class="hud-bar bg-blue-600 text-white px-6 py-2 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <span class="font-bold">Spam Simulator</span>
    </div>
    <div class="flex items-center space-x-4">
      <span :class="['transition-transform duration-300', { 'scale-110': scoreAnimating }]">🪙 {{ score }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();

const score = computed(() => statsStore.score);
const scoreAnimating = ref(false);

watch(score, () => {
  scoreAnimating.value = true;
  setTimeout(() => {
    scoreAnimating.value = false;
  }, 300);
});
</script>