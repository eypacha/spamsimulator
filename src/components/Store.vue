<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Tienda</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="card in cards"
          :key="card.title"
          class="bg-white p-4 shadow flex flex-col h-full gap-5"
          :class="card.rounded ? 'rounded-lg' : ''"
        >
          <div>
            <h3 class="text-lg font-semibold">{{ card.title }}</h3>
            <p class="text-gray-600">{{ card.description }}</p>
            <template v-for="(line, idx) in card.details" :key="idx">
              <p class="text-sm">{{ line }}</p>
            </template>
          </div>
          <button
            @click="card.onClick"
            :disabled="card.disabled"
            class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 mt-auto"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStatsStore } from '../store/stats.js';
import { computed } from 'vue';

const statsStore = useStatsStore();

const cards = computed(() => [
  {
    title: 'Dinero, dame dinero',
    description: 'Aumenta los puntos lo que ganas por eliminar spam.',
    details: [
      `Actual: ${statsStore.pointsPerSpam} puntos`,
      `Costo: ${statsStore.upgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyUpgrade(),
    disabled: statsStore.score < statsStore.upgradeCost,
  },
  {
    title: 'Basura espacial',
    description: 'Aumenta el límite de emails en la papelera.',
    details: [
      `Actual: ${statsStore.getSpaceString(statsStore.maxTrash, 3)}`,
      `Costo: ${statsStore.trashUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyTrashUpgrade(),
    disabled: statsStore.score < statsStore.trashUpgradeCost,
  },
  {
    title: 'Come disco',
    description: 'Aumenta el límite de emails en la bandeja de entrada.',
    details: [
      `Actual: ${statsStore.getSpaceString(statsStore.maxInbox)}`,
      `Costo: ${statsStore.inboxUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyInboxUpgrade(),
    disabled: statsStore.score < statsStore.inboxUpgradeCost,
  },
  {
    title: 'Selección múltiple',
    description: 'Aumenta el número de emails que puedes seleccionar a la vez.',
    details: [
      `Actual: ${statsStore.maxSelectable} emails`,
      `Costo: ${statsStore.selectionUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buySelectionUpgrade(),
    disabled: statsStore.score < statsStore.selectionUpgradeCost,
    rounded: true,
  },
    {
    title: 'Combos',
    description: '¡Gana multiplicador de puntos por eliminar spam seguido!',
    details: [
      `Combo actual: x${statsStore.comboMultiplier ?? 1}`,
      `Costo: ${statsStore.comboUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyComboUpgrade(),
    disabled: statsStore.score < statsStore.comboUpgradeCost || statsStore.comboUnlocked,
    rounded: true,
  },
  {
    title: 'TurboSpam',
    description: 'Reduce el intervalo de llegada de emails un 10% (mínimo 1s).',
    details: [
      `Actual: ${(statsStore.turboSpamInterval / 1000).toFixed(2)} s`,
      `Costo: ${statsStore.turboSpamUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyTurboSpamUpgrade(),
    disabled: statsStore.score < statsStore.turboSpamUpgradeCost || statsStore.turboSpamInterval <= 1000,
  },
]);
</script>