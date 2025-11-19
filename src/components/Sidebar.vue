<template>
  <aside class="w-64 bg-gray-800 bg-[url('images/backgrounds/doodle-email-dark.jpg')] bg-[length:1200px] text-white flex-shrink-0 h-full">
    <nav class="h-full flex flex-col py-6">
      <ul class="space-y-2">
        <li v-if="statsStore.composeUnlocked">
          <button @click="$emit('openCompose')" class="w-full text-left px-6 py-3 transition hover:bg-gray-700 cursor-pointer flex items-center justify-between">
            <span>✍️ Redactar</span>
            <span v-if="statsStore.keyboardShortcutsUnlocked" class="text-xs text-gray-400">(Shift+Q)</span>
          </button>
        </li>
        <li v-for="item in menuOptions" :key="item.key">
          <button
            @click="selectMenu(item.key)"
            class="cursor-pointer w-full text-left px-6 py-3 transition flex items-center justify-between"
            :class="selectedMenu === item.key ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700'">
            <span>{{ item.icon }} {{ item.label }}</span>
            <span v-if="statsStore.keyboardShortcutsUnlocked && item.shortcut" class="text-xs text-gray-400">({{ item.shortcut }})</span>
          </button>
        </li>
      </ul>
      
      <!-- Barra de progreso del espacio -->
      <div class="mt-auto px-6 space-y-4">
        <!-- Botón Antivirus -->
        <div v-if="statsStore.antivirusUnlocked" class="mb-4">
          <button @click="handleAntivirus"
            :disabled="statsStore.antivirusCooldown > 0 || virusStore.virusCount === 0"
            class="w-full px-4 py-2 rounded bg-green-600 text-white font-bold transition disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-700">
            🛡️ Antivirus
            <span v-if="statsStore.antivirusCooldown > 0"> ({{ statsStore.antivirusCooldown }})</span>
          </button>
        </div>

        <!-- Barra de Nivel -->
        <div v-if="statsStore.levelBarUnlocked" class="mb-4">
          <div class="text-sm text-blue-300 mb-2">Progreso de Nivel</div>
          <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
            <div 
              class="h-2 rounded-full transition-all duration-300 bg-blue-500"
              :style="{ width: levelProgressPercentage + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-400 text-center">
            Nivel {{ statsStore.level }} ({{ statsStore.totalScore }}/{{ nextLevelThreshold }})
          </div>
        </div>
        <!-- Barra de Bandeja de Entrada -->
        <div v-if="statsStore.spaceBarUnlocked">
          <div class="text-sm text-gray-300 mb-2">Espacio de Bandeja</div>
          <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
            <div 
              :class="['h-2 rounded-full transition-all duration-300', inboxProgressBarColor]" 
              :style="{ width: inboxProgressPercentage + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-400 text-center">
            {{ currentInboxSpace }} / {{ maxInboxSpace }}
          </div>
        </div>

        <!-- Barra de Papelera -->
        <div v-if="statsStore.trashBarUnlocked">
          <div class="text-sm text-gray-300 mb-2">Espacio de Papelera</div>
          <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
            <div 
              :class="['h-2 rounded-full transition-all duration-300', trashProgressBarColor]" 
              :style="{ width: trashProgressPercentage + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-400 text-center">
            {{ currentTrashSpace }} / {{ maxTrashSpace }}
          </div>
        </div>

      </div>
    </nav>
  </aside>
</template>

<script setup>
import { calculateLevel, calculateLevelThreshold } from '../utils/balancing.js';
// Calcula el progreso de nivel
const level = computed(() => statsStore.level);
const totalScore = computed(() => statsStore.totalScore);
// Calcula el umbral para el siguiente nivel
const nextLevelThreshold = computed(() => calculateLevelThreshold(level.value + 1));
const currentLevelThreshold = computed(() => calculateLevelThreshold(level.value));
const levelProgress = computed(() => totalScore.value - currentLevelThreshold.value);
const levelProgressPercentage = computed(() => {
  const max = nextLevelThreshold.value - currentLevelThreshold.value;
  return Math.min(100, Math.round((levelProgress.value / max) * 100));
});
import { useSoundStore } from '../store/sound.js';
const soundStore = useSoundStore();

function handleAntivirus() {
  const activated = statsStore.activateAntivirus(); // No pasar argumentos
  if (activated && soundStore.playAntivirusSound) {
    soundStore.playAntivirusSound();
  }
}
import { defineProps, defineEmits, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';
import { useVirusStore } from '../store/virus.js';

// Opciones del menú (excepto Redactar)
const allMenuOptions = [
  { key: 'inbox', icon: '📥', label: 'Recibidos', shortcut: 'Shift+W' },
  { key: 'starred', icon: '⭐', label: 'Destacados', requiresUnlock: true, shortcut: 'Shift+E' },
  { key: 'trash', icon: '🗑️', label: 'Papelera', shortcut: 'Shift+R' },
  { key: 'store', icon: '🛒', label: 'Tienda', shortcut: 'Shift+A' },
  { key: 'achievements', icon: '🏆', label: 'Logros', shortcut: 'Shift+S' },
  { key: 'settings', icon: '⚙️', label: 'Settings', shortcut: 'Shift+D' },
];

const props = defineProps({
  selectedMenu: String
});
const emit = defineEmits(['selectMenu']);

const emailStore = useEmailStore();
const statsStore = useStatsStore();
const virusStore = useVirusStore();

// Filtrar opciones del menú según los unlocks
const menuOptions = computed(() => {
  return allMenuOptions.filter(item => {
    if (item.requiresUnlock) {
      return statsStore.starredUnlocked;
    }
    return true;
  });
});

const visibleEmails = computed(() => emailStore.emails.filter(e => !e.trash));
const trashedEmails = computed(() => emailStore.emails.filter(e => e.trash));

// Inbox space calculations
const currentInboxSpace = computed(() => statsStore.getSpaceString(visibleEmails.value.length));
const maxInboxSpace = computed(() => statsStore.getSpaceString(statsStore.maxInbox));
const inboxProgressPercentage = computed(() => {
  const used = visibleEmails.value.length;
  const max = statsStore.maxInbox;
  return max > 0 ? Math.min((used / max) * 100, 100) : 0;
});

const inboxProgressBarColor = computed(() => {
  const percentage = inboxProgressPercentage.value;
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
});

// Trash space calculations
const currentTrashSpace = computed(() => statsStore.getSpaceString(trashedEmails.value.length, 3));
const maxTrashSpace = computed(() => statsStore.getSpaceString(statsStore.maxTrash, 3));
const trashProgressPercentage = computed(() => {
  const used = trashedEmails.value.length;
  const max = statsStore.maxTrash;
  return max > 0 ? Math.min((used / max) * 100, 100) : 0;
});

const trashProgressBarColor = computed(() => {
  const percentage = trashProgressPercentage.value;
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
});

function selectMenu(menu) {
  emit('selectMenu', menu);
}
</script>
