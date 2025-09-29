<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Tienda</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="space-y-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold">Upgrade Puntos por Spam</h3>
          <p class="text-gray-600">Aumenta los puntos que ganas por eliminar spam.</p>
          <p class="text-sm">Actual: {{ statsStore.pointsPerSpam }} puntos</p>
          <p class="text-sm">Costo: {{ statsStore.upgradeCost }} 🪙</p>
          <button @click="buyUpgrade" :disabled="statsStore.score < statsStore.upgradeCost" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
            Comprar
          </button>
        </div>
        <!-- Add more upgrades here in the future -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();

function buyUpgrade() {
  statsStore.buyUpgrade();
}
</script>