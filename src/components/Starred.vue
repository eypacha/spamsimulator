<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
      <span class="text-lg font-semibold text-gray-700">Destacados</span>
      <span class="text-sm text-gray-500">{{ starredEmails.length }} correos</span>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
        <Email v-for="email in starredEmails" :key="email.id" :email="email" @open="openEmail(email)" />
      </ul>
    </div>
    <div v-else class="flex-1 overflow-y-auto">
      <button @click="selectedEmail = null" class="my-4 ml-6 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">←</button>
      <EmailDetail :email="selectedEmail" />
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
const starredEmails = computed(() => emails.value.filter(e => e.starred).reverse());
const selectedEmail = ref(null);

function openEmail(email) {
  selectedEmail.value = email;
  emailStore.setRead(email.id);
  statsStore.markEmailAsRead(email);
}
</script>
