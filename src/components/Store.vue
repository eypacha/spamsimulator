<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Tienda</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold">Upgrade Puntos por Spam</h3>
          <p class="text-gray-600">Aumenta los puntos lo que ganas por eliminar spam.</p>
          <p class="text-sm">Actual: {{ statsStore.pointsPerSpam }} puntos</p>
          <p class="text-sm">Costo: {{ statsStore.upgradeCost }} 🪙</p>
          <button @click="buyUpgrade" :disabled="statsStore.score < statsStore.upgradeCost" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
            Comprar
          </button>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold">Aumentar Espacio en Papelera</h3>
          <p class="text-gray-600">Aumenta el límite de emails en la papelera.</p>
          <p class="text-sm">Actual: {{ statsStore.getSpaceString(statsStore.maxTrash, 3) }}</p>
          <p class="text-sm">Costo: {{ statsStore.trashUpgradeCost }} 🪙</p>
          <button @click="buyTrashUpgrade" :disabled="statsStore.score < statsStore.trashUpgradeCost" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
            Comprar
          </button>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold">Aumentar Espacio en Bandeja</h3>
          <p class="text-gray-600">Aumenta el límite de emails en la bandeja de entrada.</p>
          <p class="text-sm">Actual: {{ statsStore.getSpaceString(statsStore.maxInbox) }}</p>
          <p class="text-sm">Costo: {{ statsStore.inboxUpgradeCost }} 🪙</p>
          <button @click="buyInboxUpgrade" :disabled="statsStore.score < statsStore.inboxUpgradeCost" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
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

function buyTrashUpgrade() {
  statsStore.buyTrashUpgrade();
}

function buyInboxUpgrade() {
  statsStore.buyInboxUpgrade();
}
</script>