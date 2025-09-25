<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
      <span class="text-lg font-semibold text-gray-700">Papelera</span>
      <span class="text-sm text-gray-500">{{ trashedEmails.length }}/{{ TRASH_MAX }} emails</span>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="trashedEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <Email v-for="email in trashedEmails" :key="email.id" :email="email" @click="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold">¡Nada en la papelera! Todo limpio 🚀</div>
        </div>
      </template>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null" class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" @deletePermanent="confirmDeletePermanent" />
    </div>
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center z-50" style="background: rgba(0,0,0,0.4);">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-4 text-lg">¿Eliminar este correo definitivamente?</div>
        <div class="flex gap-4 justify-center">
          <button @click="doDeletePermanent" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Eliminar</button>
          <button @click="showConfirm = false" class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400">Cancelar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';

const emailStore = useEmailStore();
const { emails } = storeToRefs(emailStore);
const trashedEmails = computed(() => emails.value.filter(e => e.trash));
const selectedEmail = ref(null);
const showConfirm = ref(false);
let pendingDeleteId = null;
const TRASH_MAX = 5;

function openEmail(email) {
  selectedEmail.value = email;
}
function confirmDeletePermanent(id) {
  pendingDeleteId = id;
  showConfirm.value = true;
}
function doDeletePermanent() {
  const idx = emails.value.findIndex(e => e.id === pendingDeleteId);
  if (idx !== -1) emails.value.splice(idx, 1);
  selectedEmail.value = null;
  showConfirm.value = false;
  pendingDeleteId = null;
}
// No changes needed here for the popup, logic is handled in Inbox.vue
</script>
