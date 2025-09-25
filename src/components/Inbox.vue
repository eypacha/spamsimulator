<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
      <span class="text-lg font-semibold text-gray-700">Recibidos</span>
      <span class="text-sm text-gray-500">{{ visibleEmails.length }} correos</span>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="visibleEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <Email v-for="email in visibleEmails" :key="email.id" :email="email" v-model="selectedEmails" @toggle-star="emailStore.toggleStar" @click="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold">¡Tu bandeja está vacía! Disfruta tu día 😊</div>
        </div>
      </template>
    </div>
    <EmailDetail v-else :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" />
    <div v-if="showTrashFull" class="fixed inset-0 flex items-center justify-center z-50" style="background: rgba(0,0,0,0.4);">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-4 text-lg">No puedes eliminar este correo, papelera llena</div>
        <div class="flex gap-4 justify-center">
          <button @click="showTrashFull = false" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Aceptar</button>
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

const selectedEmails = ref([]);
const selectedEmail = ref(null);
const emailStore = useEmailStore();
const { emails } = storeToRefs(emailStore);
const visibleEmails = computed(() => emails.value.filter(e => !e.trash));
const trashCount = computed(() => emails.value.filter(e => e.trash).length);
const showTrashFull = ref(false);

function openEmail(email) {
  selectedEmail.value = email;
}

function deleteEmail(id) {
  if (trashCount.value >= 5) {
    showTrashFull.value = true;
    return;
  }
  emailStore.moveToTrash(id);
  selectedEmail.value = null;
}

function toggleStar(id) {
  emailStore.toggleStar(id);
}
</script>
