<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Logros</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="achievement in achievements" :key="achievement.id"
             class="bg-white p-4 rounded-lg shadow border-2"
             :class="achievement.unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{{ achievement.unlocked ? '🏅' : '🔒' }}</span>
            <div>
              <h3 class="text-lg font-semibold" :class="achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'">
                {{ achievement.name }}
              </h3>
              <p class="text-sm text-gray-500">{{ achievement.description }}</p>
              <p class="text-xs text-gray-400 mt-1">
                Progreso: {{ achievement.current }}/{{ achievement.target }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();

const achievements = computed(() => [
  {
    id: 'sweeper',
    name: 'Barrendero',
    description: 'Borrar 50 spam',
    target: 50,
    current: statsStore.totalSpamDeleted,
    unlocked: statsStore.totalSpamDeleted >= 50
  },
  {
    id: 'pressure-washer',
    name: 'Hidrolavador',
    description: 'Borrar 100 spam',
    target: 100,
    current: statsStore.totalSpamDeleted,
    unlocked: statsStore.totalSpamDeleted >= 100
  },
  {
    id: 'novice-reader',
    name: 'Lector novato',
    description: 'Leer 50 correos',
    target: 50,
    current: statsStore.totalEmailsRead,
    unlocked: statsStore.totalEmailsRead >= 50
  },
  {
    id: 'advanced-reader',
    name: 'Lector avanzado',
    description: 'Leer 100 correos',
    target: 100,
    current: statsStore.totalEmailsRead,
    unlocked: statsStore.totalEmailsRead >= 100
  }
]);
</script>