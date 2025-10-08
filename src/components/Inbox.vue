<template>
  <section class="h-full flex flex-col">
    <div class="bg-gray-50 border-b ">
      <div class="flex items-center justify-between px-6 py-4 top-0 z-10">
        <span class="text-lg font-semibold text-gray-700">Recibidos</span>
        <span class="text-sm text-gray-500">{{ visibleEmails.length }} correos</span>
      </div>
      <div v-if="!selectedEmail" class="px-6 py-2">
        <button
          v-if="statsStore.maxSelectable !== 0 && (statsStore.bulkDeleteUnlocked || statsStore.bulkArchiveUnlocked)"
          @click="selectFirstThree" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 mr-2">
          Seleccionar {{ statsStore.maxSelectable >= statsStore.maxInbox ? 'todos' : statsStore.maxSelectable }}
        </button>
        <button v-if="statsStore.bulkDeleteUnlocked" @click="deleteSelected" :disabled="selectedEmails.length === 0"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed mr-2">
          Eliminar ({{ selectedEmails.length }})
        </button>
        <button v-if="statsStore.bulkArchiveUnlocked" @click="archiveSelected" :disabled="selectedEmails.length === 0"
          class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Archivar ({{ selectedEmails.length }})
        </button>
        <button v-if="statsStore.spamFrenzyUnlocked" @click="statsStore.activateSpamFrenzy()"
          :disabled="statsStore.spamFrenzyActive || statsStore.spamFrenzyCooldown > 0"
          class="px-4 py-2 rounded bg-pink-600 text-white font-bold ml-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
          :class="statsStore.spamFrenzyActive ? 'animate-pulse pulse-fast' : 'hover:bg-pink-700'">
          Spam Frenzy
          <span v-if="statsStore.spamFrenzyCooldown > 0"> ({{ statsStore.spamFrenzyCooldown }})</span>
        </button>
        <button v-if="statsStore.virusBombUnlocked" @click="handleVirusBomb"
          :disabled="statsStore.virusBombCooldown > 0"
          class="px-4 py-2 rounded bg-purple-600 text-white font-bold ml-2 transition disabled:opacity-70 disabled:cursor-not-allowed hover:bg-purple-700">
          💣 Virus Bomb
          <span v-if="statsStore.virusBombCooldown > 0"> ({{ statsStore.virusBombCooldown }})</span>
        </button>
      </div>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="visibleEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-x-hidden">
          <Email v-for="email in visibleEmails" :key="email.id" :email="email" v-model="selectedEmails"
            :show-checkbox="true" @toggle-star="emailStore.toggleStar" @open="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold text-center">¡Tu bandeja está vacía!<br /> Disfruta tu día 😊
          </div>
        </div>
      </template>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null"
        class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" @archive="archiveEmail" />
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
  <VirusManager screen="inbox" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';
import { useSoundStore } from '../store/sound.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';
import VirusManager from './VirusManager.vue';

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
  statsStore.markEmailAsRead(email);
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

function archiveEmail(id) {
  emailStore.archiveEmail(id);
  selectedEmail.value = null;
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

function archiveSelected() {
  // Archivar emails seleccionados
  selectedEmails.value.forEach(id => emailStore.archiveEmail(id));
  selectedEmails.value = [];
}

function selectFirstThree() {
  selectedEmails.value = visibleEmails.value.slice(0, statsStore.maxSelectable).map(e => e.id);
}

function handleVirusBomb() {
  // Ejecutar el Virus Bomb, pasando la función de conversión del emailStore
  statsStore.activateVirusBomb(() => emailStore.convertLegitimateToSpam());
}

function handleAntivirus() {
  // Antivirus elimina un virus si hay alguno
  const activated = statsStore.activateAntivirus();
  if (activated && soundStore.playAntivirusSound) {
    soundStore.playAntivirusSound();
  }
}
</script>
