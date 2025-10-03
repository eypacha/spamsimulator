<template>
  <section class="h-full flex flex-col">
    <div class="bg-gray-50 border-b ">
      <div class="flex items-center justify-between px-6 py-4 top-0 z-10">
        <span class="text-lg font-semibold text-gray-700">Papelera</span>
        <span class="text-sm text-gray-500">{{ trashedEmails.length }} correos</span>
      </div>
      <div v-if="!selectedEmail" class="px-6 py-2">
        <button v-if="statsStore.maxSelectable !== 0" @click="selectFirstThree" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 mr-2">Seleccionar {{ statsStore.maxSelectable >= statsStore.maxInbox ? 'todos' : statsStore.maxSelectable }}</button>
        <button @click="deleteSelected" :disabled="selectedEmails.length === 0"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Eliminar
          ({{ selectedEmails.length }})</button>
      </div>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="trashedEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <Email v-for="email in trashedEmails" :key="email.id" :email="email" v-model="selectedEmails"
            @open="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold text-center">¡Nada en la papelera!<br/>Todo limpio 🚀</div>
        </div>
      </template>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null"
        class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" @deletePermanent="confirmDeletePermanent" />
    </div>
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center z-50"
      style="background: rgba(0,0,0,0.4);">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-4 text-lg">¿Eliminar este correo definitivamente?</div>
        <div class="flex gap-4 justify-center">
          <button @click="doDeletePermanent"
            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Eliminar</button>
          <button @click="showConfirm = false"
            class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400">Cancelar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';

const emailStore = useEmailStore();
const statsStore = useStatsStore();
const { emails } = storeToRefs(emailStore);
import { useSoundStore } from '../store/sound.js';
const soundStore = useSoundStore();
const trashedEmails = computed(() => emails.value.filter(e => e.trash).reverse());
const selectedEmail = ref(null);
const selectedEmails = ref([]);
const showConfirm = ref(false);
let pendingDeleteId = null;

function openEmail(email) {
  selectedEmail.value = email;
  emailStore.setRead(email.id);
  statsStore.markEmailAsRead(email);
}
function confirmDeletePermanent(id) {
  pendingDeleteId = id;
  showConfirm.value = true;
}
function doDeletePermanent() {
  const idx = emails.value.findIndex(e => e.id === pendingDeleteId);
  if (idx !== -1) {
    // Si es nigerianprince, sumar progreso
    const email = emails.value[idx];
    if (email.type === 'nigerianprince') {
      statsStore.recordNigerianPrinceDeletion();
    }
    emails.value.splice(idx, 1);
  }
  selectedEmail.value = null;
  showConfirm.value = false;
  pendingDeleteId = null;
  // Si la papelera queda vacía, reproducir sonido
  if (emails.value.filter(e => e.trash).length === 0) {
    soundStore.playTrashSound();
  }
}

function deleteSelected() {
  selectedEmails.value.forEach(id => {
    const idx = emails.value.findIndex(e => e.id === id);
    if (idx !== -1) {
      const email = emails.value[idx];
      if (email.type === 'nigerianprince') {
        statsStore.recordNigerianPrinceDeletion();
      }
      emails.value.splice(idx, 1);
    }
  });
  selectedEmails.value = [];
  // Si la papelera queda vacía, reproducir sonido
  if (emails.value.filter(e => e.trash).length === 0) {
    soundStore.playTrashSound();
  }
}

function selectFirstThree() {
  selectedEmails.value = trashedEmails.value.slice(0, statsStore.maxSelectable).map(e => e.id);
}
</script>
