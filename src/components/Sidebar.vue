<template>
  <aside class="w-64 bg-gray-800 text-white flex-shrink-0">
    <nav class="h-full flex flex-col py-6">
      <ul class="space-y-2">
        <li>
          <button @click="selectMenu('compose')" :class="menuBtnClass('compose')">✍️ Redactar</button>
        </li>
        <li>
          <button @click="selectMenu('inbox')" :class="menuBtnClass('inbox')">📥 Recibidos</button>
        </li>
        <li>
          <button @click="selectMenu('sent')" :class="menuBtnClass('sent')">📤 Enviado</button>
        </li>
        <li>
          <button @click="selectMenu('starred')" :class="menuBtnClass('starred')">⭐ Destacados</button>
        </li>
        <li>
          <button @click="selectMenu('trash')" :class="menuBtnClass('trash')">🗑️ Papelera</button>
        </li>
        <li>
          <button @click="selectMenu('store')" :class="menuBtnClass('store')">🛒 Tienda</button>
        </li>
        <li>
          <button @click="selectMenu('achievements')" :class="menuBtnClass('achievements')">🏆 Logros</button>
        </li>
      </ul>
      
      <!-- Barra de progreso del espacio -->
      <div class="mt-auto px-6">
        <div class="text-sm text-gray-300 mb-2">Espacio de Bandeja</div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
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

function selectMenu(menu) {
  emit('selectMenu', menu);
}

function menuBtnClass(menu) {
  return [
    'w-full text-left px-6 py-3 transition',
    props.selectedMenu === menu ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700',
  ];
}
</script>
