<template>
  <div class="hud-bar bg-blue-600 text-white px-6 py-2 flex justify-between items-center relative">
    <div class="flex items-center space-x-4">
      <!-- Hamburguesa solo en mobile -->
      <button @click="$emit('openSidebar')" class="md:hidden mr-2 text-white rounded shadow-lg focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="font-bold">Spam Simulator</span>
    </div>
    <div class="flex items-center space-x-4">
      <span v-if="comboUnlocked && comboMultiplier > 1" class="font-bold text-yellow-300  animate-pulse pulse-fast">x{{
        comboMultiplier }}</span>
      <span :class="['transition-transform duration-300', { 'scale-110': scoreAnimating }]">🪙 {{ score }}</span>
      <span>⭐ {{ totalSpamDeleted }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();


const score = computed(() => statsStore.score);
const totalSpamDeleted = computed(() => statsStore.totalSpamDeleted);
const comboUnlocked = computed(() => statsStore.comboUnlocked);
const comboMultiplier = computed(() => statsStore.comboMultiplier);
const scoreAnimating = ref(false);

watch(score, () => {
  scoreAnimating.value = true;
  setTimeout(() => {
    scoreAnimating.value = false;
  }, 300);
});
</script>