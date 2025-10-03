<template>
  <aside class="w-64 bg-gray-800 text-white flex-shrink-0 h-full">
    <nav class="h-full flex flex-col py-6">
      <ul class="space-y-2">
        <li>
          <button @click="$emit('openCompose')" class="w-full text-left px-6 py-3 transition hover:bg-gray-700 cursor-pointer">✍️ Redactar</button>
        </li>
        <li v-for="item in menuOptions" :key="item.key">
          <button @click="selectMenu(item.key)" :class="menuBtnClass(item.key)">{{ item.icon }} {{ item.label }}</button>
        </li>
      </ul>
      
      <!-- Barra de progreso del espacio -->
      <div class="mt-auto px-6">
        <div class="text-sm text-gray-300 mb-2">Espacio de Bandeja</div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
          <div 
            :class="['h-2 rounded-full transition-all duration-300', progressBarColor]" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="text-xs text-gray-400 text-center">
          {{ currentSpace }} / {{ maxSpace }}
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';

// Opciones del menú (excepto Redactar)
const menuOptions = [
  { key: 'inbox', icon: '📥', label: 'Recibidos' },
  { key: 'starred', icon: '⭐', label: 'Destacados' },
  { key: 'trash', icon: '🗑️', label: 'Papelera' },
  { key: 'store', icon: '🛒', label: 'Tienda' },
  { key: 'achievements', icon: '🏆', label: 'Logros' },
  { key: 'settings', icon: '⚙️', label: 'Settings' },
];

const props = defineProps({
  selectedMenu: String
});
const emit = defineEmits(['selectMenu']);

const emailStore = useEmailStore();
const statsStore = useStatsStore();

const visibleEmails = computed(() => emailStore.emails.filter(e => !e.trash));

const currentSpace = computed(() => statsStore.getSpaceString(visibleEmails.value.length));
const maxSpace = computed(() => statsStore.getSpaceString(statsStore.maxInbox));
const progressPercentage = computed(() => {
  const used = visibleEmails.value.length;
  const max = statsStore.maxInbox;
  return max > 0 ? Math.min((used / max) * 100, 100) : 0;
});

const progressBarColor = computed(() => {
  const percentage = progressPercentage.value;
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
});

function selectMenu(menu) {
  emit('selectMenu', menu);
}

function menuBtnClass(menu) {
  return [
    'cursor-pointer w-full text-left px-6 py-3 transition',
    props.selectedMenu === menu ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700',
  ];
}
</script>
