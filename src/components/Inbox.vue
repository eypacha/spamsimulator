<template>
  <section class="h-full flex flex-col">
    <div class="bg-gray-50 border-b ">
      <div class="flex items-center justify-between px-6 py-4 top-0 z-10">
        <span class="text-lg font-semibold text-gray-700">Recibidos</span>
        <span class="text-sm text-gray-500">{{ statsStore.getSpaceString(visibleEmails.length) }} / {{ statsStore.getSpaceString(statsStore.maxInbox) }}</span>
      </div>
      <div v-if="!selectedEmail" class="px-6 py-2">
        <button @click="deleteSelected" :disabled="selectedEmails.length === 0"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Eliminar
          ({{ selectedEmails.length }})</button>
      </div>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="visibleEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <Email v-for="email in visibleEmails" :key="email.id" :email="email" v-model="selectedEmails"
            @toggle-star="emailStore.toggleStar" @click="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold">¡Tu bandeja está vacía! Disfruta tu día 😊</div>
        </div>
      </template>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null"
        class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" />
    </div>
    <div v-if="showTrashFull" class="fixed inset-0 flex items-center justify-center z-50"
      style="background: rgba(0,0,0,0.4);">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-4 text-lg">No puedes eliminar este correo, papelera llena</div>
        <div class="flex gap-4 justify-center">
          <button @click="showTrashFull = false"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Aceptar</button>
        </div>
      </div>
    </div>
    <div v-if="showInboxFullModal" class="fixed inset-0 flex items-center justify-center z-50"
      style="background: rgba(0,0,0,0.4);">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-4 text-lg">Bandeja llena, no se pueden recibir más correos</div>
        <div class="flex gap-4 justify-center">
          <button @click="showInboxFullModal = false"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Aceptar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';
import { useSoundStore } from '../store/sound.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';

const selectedEmails = ref([]);
const selectedEmail = ref(null);
const emailStore = useEmailStore();
const statsStore = useStatsStore();
const soundStore = useSoundStore();
const { emails, inboxFull } = storeToRefs(emailStore);
const visibleEmails = computed(() => emails.value.filter(e => !e.trash).reverse());
const trashCount = computed(() => emails.value.filter(e => e.trash).length);
const showTrashFull = ref(false);
const showInboxFullModal = ref(false);

watch(inboxFull, (newVal) => {
  if (newVal) showInboxFullModal.value = true;
});

function openEmail(email) {
  selectedEmail.value = email;
  emailStore.setRead(email.id);
}

function deleteEmail(id) {
  if (trashCount.value >= statsStore.maxTrash) {
    showTrashFull.value = true;
    soundStore.playErrorSound();
    return;
  }
  emailStore.moveToTrash(id);
  selectedEmail.value = null;
}

function toggleStar(id) {
  emailStore.toggleStar(id);
}

function deleteSelected() {
  const totalToTrash = trashCount.value + selectedEmails.value.length;
  if (totalToTrash > statsStore.maxTrash) {
    console.log('Trash full in deleteSelected, playing sound');
    showTrashFull.value = true;
    soundStore.playErrorSound();
    return;
  }
  selectedEmails.value.forEach(id => emailStore.moveToTrash(id));
  selectedEmails.value = [];
}
</script>
