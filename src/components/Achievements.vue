<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Logros</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div v-for="achievement in achievements" :key="achievement.id"
             class="bg-white p-4 rounded-lg shadow border-2 text-center"
             :class="achievement.unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'">
          <div class="flex flex-col items-center space-y-2">
            <span class="text-4xl">{{ achievement.emoji }}</span>
            <div class="text-center">
              <h3 class="text-lg font-semibold" :class="achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'">
                {{ achievement.name }}
              </h3>
              <p class="text-sm text-gray-500">{{ achievement.description }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ achievement.current }}/{{ achievement.target }}
              </p>
            </div>
            <span class="text-2xl">{{ achievement.unlocked ? '🏅' : '🔒' }}</span>
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
    emoji: '🧹',
    target: 50,
    current: statsStore.totalSpamDeleted,
    unlocked: statsStore.totalSpamDeleted >= 50
  },
  {
    id: 'pressure-washer',
    name: 'Hidrolavador',
    description: 'Borrar 100 spam',
    emoji: '🚿',
    target: 100,
    current: statsStore.totalSpamDeleted,
    unlocked: statsStore.totalSpamDeleted >= 100
  },
  {
    id: 'spam-master',
    name: 'Maestro del spam',
    description: 'Borrar 1000 spam',
    emoji: '🗑️',
    target: 1000,
    current: statsStore.totalSpamDeleted,
    unlocked: statsStore.totalSpamDeleted >= 1000
  },
  {
    id: 'novice-reader',
    name: 'Lector casual',
    description: 'Leer 50 correos',
    emoji: '📖',
    target: 50,
    current: statsStore.totalEmailsRead,
    unlocked: statsStore.totalEmailsRead >= 50
  },
  {
    id: 'advanced-reader',
    name: 'Bibliófilo',
    description: 'Leer 100 correos',
    emoji: '📚',
    target: 100,
    current: statsStore.totalEmailsRead,
    unlocked: statsStore.totalEmailsRead >= 100
  },
  {
    id: 'expert-reader',
    name: 'Lector experto',
    description: 'Leer 1000 correos',
    emoji: '📚',
    target: 1000,
    current: statsStore.totalEmailsRead,
    unlocked: statsStore.totalEmailsRead >= 1000
  },
  {
    id: 'capitalist',
    name: 'Capitalista',
    description: 'Acumular 500 monedas',
    emoji: '💰',
    target: 500,
    current: statsStore.totalCoinsEarned,
    unlocked: statsStore.totalCoinsEarned >= 500
  },
  {
    id: 'millionaire',
    name: 'Millonario',
    description: 'Acumular 1000 monedas',
    emoji: '🤑',
    target: 1000,
    current: statsStore.totalCoinsEarned,
    unlocked: statsStore.totalCoinsEarned >= 1000
  },
  {
    id: 'streak',
    name: 'En racha',
    description: 'Eliminar 10 emails seguidos correctamente',
    emoji: '🔥',
    target: 10,
    current: statsStore.maxStreak,
    unlocked: statsStore.maxStreak >= 10
  },
  {
    id: 'perfect',
    name: 'Perfecto',
    description: 'Eliminar 50 emails seguidos sin errores',
    emoji: '🌟',
    target: 50,
    current: statsStore.maxStreak,
    unlocked: statsStore.maxStreak >= 50
  },
  {
    id: 'legend',
    name: 'Leyenda',
    description: 'Eliminar 100 emails seguidos sin errores',
    emoji: '💯',
    target: 100,
    current: statsStore.maxStreak,
    unlocked: statsStore.maxStreak >= 100
  },
  {
    id: 'broken-heart',
    name: 'El último romántico',
    description: 'Lee 100 correos destacados de tu novia',
    emoji: '💔',
    target: 100,
    current: statsStore.totalGirlfriendEmailsRead,
    unlocked: statsStore.totalGirlfriendEmailsRead >= 100
  },
  {
    id: 'nigerian-prince',
    name: 'Príncipe de Nigeria',
    description: 'Borrar 1000 emails del príncipe nigeriano',
    emoji: '👑',
    target: 1000,
    current: statsStore.totalNigerianPrinceDeleted,
    unlocked: statsStore.totalNigerianPrinceDeleted >= 1000
  },
  {
    id: 'broken-heart',
    name: 'Un poco mucho',
    description: 'Lee 10000 correos destacados de tu novia',
    emoji: '❤️‍🔥',
    target: 10000,
    current: statsStore.totalGirlfriendEmailsRead,
    unlocked: statsStore.totalGirlfriendEmailsRead >= 10000
  },
]);
</script>