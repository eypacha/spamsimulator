<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
      <span class="text-lg font-semibold text-gray-700">Destacados</span>
      <span class="text-sm text-gray-500">{{ starredEmails.length }} correos</span>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <template v-if="starredEmails.length > 0">
        <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
          <Email v-for="email in starredEmails" :key="email.id" :email="email" @open="openEmail(email)" />
        </ul>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <div class="text-2xl text-gray-400 font-semibold text-center">¡No hay emails destacados!<br/>⭐ Marca algunos como favoritos</div>
        </div>
      </template>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null" class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" />
    </div>
    <VirusManager screen="starred" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { useStatsStore } from '../store/stats.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';
import VirusManager from './VirusManager.vue';

const emailStore = useEmailStore();
const statsStore = useStatsStore();
const { emails } = storeToRefs(emailStore);
const starredEmails = computed(() => emails.value.filter(e => e.starred).reverse());
const selectedEmail = ref(null);

// Watch para resetear selectedEmail si el email ya no existe
watch(() => emailStore.emails, (newEmails) => {
  if (selectedEmail.value && !newEmails.find(email => email.id === selectedEmail.value.id)) {
    selectedEmail.value = null;
  }
}, { deep: true });

function openEmail(email) {
  selectedEmail.value = email;
  emailStore.setRead(email.id);
  statsStore.markEmailAsRead(email);
}
</script>
