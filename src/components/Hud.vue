<template>
  <div class="hud-bar bg-blue-600 text-white px-6 py-2 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <span class="font-bold">Spam Simulator</span>
    </div>
    <div class="flex items-center space-x-4">
      <span>🪙 {{ score }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();

const score = computed(() => statsStore.score);
</script>