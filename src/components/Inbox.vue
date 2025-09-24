<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
      <span class="text-lg font-semibold text-gray-700">Recibidos</span>
      <span class="text-sm text-gray-500">{{ visibleEmails.length }} correos</span>
    </div>
    <div v-if="!selectedEmail" class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
        <Email v-for="email in visibleEmails" :key="email.id" :email="email" v-model="selectedEmails" @toggle-star="emailStore.toggleStar" @click="openEmail(email)" />
      </ul>
    </div>
    <EmailDetail v-else :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" />
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

function openEmail(email) {
  selectedEmail.value = email;
}

function deleteEmail(id) {
  emailStore.moveToTrash(id);
  selectedEmail.value = null;
}

function toggleStar(id) {
  emailStore.toggleStar(id);
}
</script>
